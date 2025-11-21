# coding=utf-8
import json
import time
import random
import string
import re
import base64
import hashlib
import hmac

class Spider:

    def getName(self):
        return "电影猎手"

    def init(self, extend=""):
        self.device = self.device_id()
        self.host = self.gethost()
        self.t = str(int(time.time()))

    def isVideoFormat(self, url):
        return url.endswith(('.mp4', '.m3u8'))

    def manualVideoCheck(self):
        pass

    def action(self, action):
        pass

    def destroy(self):
        pass

    def device_id(self):
        characters = string.ascii_lowercase + string.digits
        return ''.join(random.choices(characters, k=32))

    def gethost(self):
        try:
            # 使用 self.fetch 而非 requests
            resp = self.fetch('https://app-site.ecoliving168.com/domain_v5.json', headers={
                'User-Agent': 'okhttp/4.9.2',
                'Connection': 'Keep-Alive',
            })
            data = resp.json()
            return data['api_service'].replace('/api/', '')
        except:
            # 备用 host（建议你写死一个有效 host）
            return "https://api.ecoliving168.com"

    def header(self):
        return {
            'User-Agent': 'Android',
            'Accept': 'application/prs.55App.v2+json',
            'timestamp': self.t,
            'x-client-setting': '{"pure-mode":1}',
            'x-client-uuid': '{"device_id":"' + self.device + '"}, "type":1,"brand":"Redmi", "model":"M2012K10C", "system_version":30, "sdk_version":"3.1.0.7"}',
            'x-client-version': '3096'
        }

    def url(self, body=None):
        if body is None:
            body = {}
        body["timestamp"] = self.t

        # 注意：RSA 加密无法在 TVBox 实现！我们返回空 pack（用于调试）
        # 真实场景必须用代理，此处仅构造一个无效请求用于测试 host 是否通
        pack = "dummy_pack_for_test"
        key = '635a580fcb5dc6e60caa39c31a7bde48'
        sign = hmac.new(key.encode(), pack.encode(), hashlib.md5).hexdigest()
        return pack, sign

    # === 主要接口 ===

    def homeContent(self, filter):
        result = {"class": [], "filters": {}}
        try:
            bba = self.url()
            url = f"{self.host}/api/v1/app/config?pack={bba[0]}&signature={bba[1]}"
            resp = self.fetch(url, headers=self.header())
            # 尝试解密（但 TVBox 无 AES，会失败）
            try:
                data1 = self.aes_decrypt(resp.text)
                # 如果解密成功，按原逻辑处理
                dy = {"class":"类型","area":"地区","lang":"语言","year":"年份","letter":"字母","by":"排序","sort":"排序"}
                data1['data']['movie_screen']['sort'].pop(0)
                classes = []
                filters = {}
                for item in data1['data']['movie_screen']['filter']:
                    classes.append({"type_name": item["name"], "type_id": str(item["id"])})
                result["class"] = classes
                result["filters"] = filters
            except Exception as e:
                # 解密失败：返回错误提示分类
                result["class"] = [{"type_id": "error", "type_name": "⚠️需要代理支持"}]
        except Exception as e:
            result["class"] = [{"type_id": "error", "type_name": f"网络错误: {str(e)[:20]}"}]
        return result

    def homeVideoContent(self):
        videos = []
        try:
            bba = self.url()
            url = f'{self.host}/api/v1/movie/index_recommend?pack={bba[0]}&signature={bba[1]}'
            resp = self.fetch(url, headers=self.header())
            try:
                data = self.aes_decrypt(resp.text)
                for item in data['data']:
                    if 'list' in item:
                        for it in item['list']:
                            videos.append(self.voides(it))
            except:
                # 解密失败，返回示例视频（用于测试播放）
                videos.append({
                    "vod_id": "https://test.com/sample.m3u8",
                    "vod_name": "⚠️ 解密失败，请使用代理版",
                    "vod_pic": "https://via.placeholder.com/300x400?text=Error",
                    "vod_remarks": "需AES解密"
                })
        except:
            pass
        return {"list": videos}

    def categoryContent(self, tid, pg, filter, extend):
        videos = []
        try:
            # 构造 body（但无法加密）
            body = {"type_id": tid, "page": str(pg), "pageSize": "21"}
            bba = self.url(body)
            url = f"{self.host}/api/v1/movie/screen/list?pack={bba[0]}&signature={bba[1]}"
            resp = self.fetch(url, headers=self.header())
            try:
                data = self.aes_decrypt(resp.text)
                for item in data['data']['list']:
                    videos.append(self.voides(item))
            except:
                videos.append({
                    "vod_id": "https://test.com/sample.m3u8",
                    "vod_name": f"⚠️ 无法解密分类 {tid}",
                    "vod_pic": "https://via.placeholder.com/300x400?text=Decrypt+Fail",
                    "vod_remarks": "需代理"
                })
        except Exception as e:
            videos.append({
                "vod_id": "",
                "vod_name": f"请求失败: {str(e)[:30]}",
                "vod_pic": "",
                "vod_remarks": "网络错误"
            })

        return {
            "list": videos,
            "page": pg,
            "pagecount": 9999,
            "limit": 90,
            "total": 999999
        }

    def detailContent(self, ids):
        try:
            body = {"id": ids[0]}
            bba = self.url(body)
            url = f'{self.host}/api/v1/movie/detail?pack={bba[0]}&signature={bba[1]}'
            resp = self.fetch(url, headers=self.header())
            try:
                data = self.aes_decrypt(resp.text)['data']
                video = {
                    'vod_name': data.get('name', '未知'),
                    'type_name': data.get('type_name', ''),
                    'vod_year': data.get('year', ''),
                    'vod_area': data.get('area', ''),
                    'vod_remarks': data.get('dynami', ''),
                    'vod_content': data.get('content', ''),
                    'vod_play_from': '线路1',
                    'vod_play_url': '第1集$' + str(ids[0])  # fallback 到原始 ID
                }
                return {"list": [video]}
            except:
                # 解密失败，返回原始 ID 作为播放链接（可能无效）
                return {"list": [{
                    "vod_name": "⚠️ 详情解密失败",
                    "vod_play_from": "原始链接",
                    "vod_play_url": f"尝试播放${ids[0]}"
                }]}
        except Exception as e:
            return {"list": [{"vod_name": f"详情错误: {str(e)[:30]}", "vod_play_from": "error", "vod_play_url": "error$"}]}

    def searchContent(self, key, quick, pg=1):
        videos = []
        try:
            body = {"keyword": key, "page": str(pg), "pageSize": "10"}
            bba = self.url(body)
            url = f"{self.host}/api/v1/movie/search?pack={bba[0]}&signature={bba[1]}"
            resp = self.fetch(url, headers=self.header())
            try:
                data = self.aes_decrypt(resp.text)
                for it in data['data'].get('list', []):
                    videos.append(self.voides(it))
            except:
                videos.append({
                    "vod_id": "",
                    "vod_name": "⚠️ 搜索解密失败",
                    "vod_pic": "",
                    "vod_remarks": "需代理"
                })
        except:
            pass
        return {"list": videos, "page": pg}

    def playerContent(self, flag, id, vipFlags):
        # id 可能是真实链接，也可能是标记
        if "m3u8" in id or "mp4" in id:
            real_url = id
        elif "$" in id:
            real_url = id.split("$")[-1]
        else:
            real_url = id

        return {
            "parse": 0,
            "url": real_url,
            "header": {'User-Agent': 'okhttp/4.9.2'}
        }

    # === 工具方法 ===

    def voides(self, item):
        return {
            "vod_id": item.get('id') or item.get('click', ''),
            "vod_name": item.get('name') or item.get('title', '未知'),
            "vod_pic": item.get('cover') or item.get('image', ''),
            "vod_year": item.get('year') or item.get('label', ''),
            "vod_remarks": item.get('dynamic') or item.get('sub_title', '')
        }

    def aes_decrypt(self, text):
        """
        尝试 AES 解密（在支持 Crypto 的环境如宝盒中有效）
        在 OK 影视 Pro 中会抛出异常（因无 Crypto 模块）
        """
        try:
            from Crypto.Cipher import AES
            from Crypto.Util.Padding import unpad
            import base64 as b64

            text = text.replace('-', '+').replace('_', '/') + '=='
            key = b"e6d5de5fcc51f53d"
            iv = b"2f13eef7dfc6c613"
            cipher = AES.new(key, AES.MODE_CBC, iv)
            pt = unpad(cipher.decrypt(b64.b64decode(text)), AES.block_size).decode("utf-8")
            return json.loads(pt)
        except ImportError:
            # 在 OK 影视 Pro 中，Crypto 不存在 → 抛出异常
            raise Exception("No Crypto module")
        except Exception as e:
            raise Exception(f"Decrypt failed: {str(e)}")
        return None
