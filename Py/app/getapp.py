import re
import sys
import uuid
import json
import base64
from Crypto.Cipher import AES
from base.spider import Spider
from Crypto.Util.Padding import pad
from Crypto.Util.Padding import unpad
# 移除了urlencode导入，将使用自定义方法

sys.path.append('..')

headerx = {
    'User-Agent': 'okhttp/3.10.0'  # okhttp/3.14.9
}

class Spider(Spider):
    global headerx
    init_data = ''
    search_verify = ''

    def getName(self):
        return "首页"

    def init(self, extend):
        js1=json.loads(extend)
        host = js1['host']
        if re.match(r'^https?:\/\/.*\.(txt|json)$',host):
            host = self.fetch(host, headers=headerx, timeout=10).text.rstrip('/')
        self.xurl = host + js1.get('api','/api.php/getappapi')
        self.key = js1['datakey']
        self.iv = js1.get('dataiv',self.key)

        res = self.fetch(self.xurl + '.index/initV119', headers=headerx).json()
        encrypted_data = res['data']
        response = self.decrypt(encrypted_data)
        init_data = json.loads(response)
        self.init_data = init_data
        self.search_verify = init_data['config'].get('system_search_verify_status',False)

    def homeContent(self, filter):
        kjson = self.init_data
        result = {"class": [], "filters": {}}
        for i in kjson['type_list']:
            if not(i['type_name'] in ['全部', 'QQ', 'juo.one'] or '企鹅群' in i['type_name']):
                result['class'].append({
                    "type_id": i['type_id'],
                    "type_name": i['type_name']
                })
            name_mapping = {'class': '类型', 'area': '地区', 'lang': '语言', 'year': '年份', 'sort': '排序'}
            filter_items = []
            for filter_type in i.get('filter_type_list', []):
                filter_name = filter_type.get('name')
                values = filter_type.get('list', [])

                if not values:
                    continue

                value_list = [{"n": value, "v": value} for value in values]
                display_name = name_mapping.get(filter_name, filter_name)
                key = 'by' if filter_name == 'sort' else filter_name

                filter_items.append({
                    "key": key,
                    "name": display_name,
                    "value": value_list
                })

            type_id = i.get('type_id')
            if filter_items:
                result["filters"][str(type_id)] = filter_items

        return result

    def homeVideoContent(self):
        videos = []
        kjson = self.init_data
        for i in kjson['type_list']:
            for item in i['recommend_list']:
                vod_id = item['vod_id']
                name = item['vod_name']
                pic = item['vod_pic']
                remarks = item['vod_remarks']
                video = {
                    "vod_id": vod_id,
                    "vod_name": name,
                    "vod_pic": pic,
                    "vod_remarks": remarks
                }
                videos.append(video)
        return {'list': videos}

    def categoryContent(self, cid, pg, filter, ext):
        videos = []
        payload = {
            'area': ext.get('area','全部'),
            'year': ext.get('year','全部'),
            'type_id': cid,
            'page': str(pg),
            'sort': ext.get('sort','最新'),
            'lang': ext.get('lang','全部'),
            'class': ext.get('class','全部')
        }
        url = f'{self.xurl}.index/typeFilterVodList'
        res = self.post(url=url, headers=headerx,data=payload).json()
        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        kjson1 = json.loads(kjson)
        for i in kjson1['recommend_list']:
            id = i['vod_id']
            name = i['vod_name']
            pic = i['vod_pic']
            remarks = i['vod_remarks']
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remarks
            }
            videos.append(video)
        return {'list': videos, 'page': pg, 'pagecount': 9999, 'limit': 90, 'total': 999999}

    def detailContent(self, ids):
        did = ids[0]
        payload = {
            'vod_id': did,
        }
        api_endpoints = ['vodDetail', 'vodDetail2']

        for endpoint in api_endpoints:
            url = f'{self.xurl}.index/{endpoint}'
            response = self.post(url=url, headers=headerx, data=payload)

            if response.status_code == 200:
                response_data = response.json()
                encrypted_data = response_data['data']
                kjson1 = self.decrypt(encrypted_data)
                kjson = json.loads(kjson1)
                break
        videos = []
        play_form = ''
        play_url = ''

        actor = kjson['vod']['vod_actor']
        director = kjson['vod'].get('vod_director', '')
        area = kjson['vod']['vod_area']
        name = kjson['vod']['vod_name']
        year = kjson['vod']['vod_year']
        content = kjson['vod']['vod_content']
        subtitle = kjson['vod']['vod_remarks']
        desc = kjson['vod']['vod_lang']
        remark = '时间:' + subtitle + ' 语言:' + desc
        for line in kjson['vod_play_list']:
            keywords = ['防走丢', '群', '防失群', 'Q','juo.one',]
            if any(keyword in line['player_info']['show'] for keyword in keywords):
                continue
            play_form += line['player_info']['show'] + '$$$'
            parse = line['player_info']['parse']
            player_parse_type = line['player_info']['player_parse_type']
            kurls = ""
            for vod in line['urls']:
                kurl = vod['url']
                if '.m3u8' in kurl:
                    kurls += str(vod['name']) + '$' + vod['url'] + '#'
                else:
                    if 'm3u8' not in kurl:
                        token = 'token+' + vod['token']
                        kurls += str(vod['name']) + '$' + parse + ',' + vod[
                            'url'] + ',' + token + ',' + player_parse_type + '#'
            kurls = kurls.rstrip('#')
            play_url += kurls + '$$$'
        play_form = play_form.rstrip('$$$')
        play_url = play_url.rstrip('$$$')
        videos.append({
            "vod_id": did,
            "vod_name": name,
            "vod_actor": actor.replace('演员', ''),
            "vod_director": director.replace('导演', ''),
            "vod_content": content,
            "vod_remarks": remark,
            "vod_year": year + '年',
            "vod_area": area,
            "vod_play_from": play_form,
            "vod_play_url": play_url
        })
        return {'list': videos}

    def playerContent(self, flag, id, vipFlags):
        url = ''
        if re.search(r'https?:\/\/.*\.(m3u8|mp4|flv)', id):
            url = id
        elif 'url=' in id:
            aid = id.split(',')
            uid = aid[0]
            kurl = aid[1]
            kjson = uid + kurl
            url2 = f"{kjson}"
            response = self.fetch(url=url2)
            if response.status_code == 200:
                kjson1 = response.json()
                url = kjson1['url']
        else:
            aid = id.split(',')
            bid = aid[-1]
            uid = aid[0]
            kurl = aid[1]
            token = aid[2].replace('token+', '')
            id1 = self.decrypt_wb(kurl)
            payload = {
                'parse_api': uid,
                'url': id1,
                'player_parse_type': bid,
                'token': token
            }
            url1 = f"{self.xurl}.index/vodParse"
            response = self.post(url=url1, headers=headerx, data=payload)
            if response.status_code == 200:
                response_data = response.json()
                encrypted_data = response_data['data']
                kjson = self.decrypt(encrypted_data)
                kjson1 = json.loads(kjson)
                kjson2 = kjson1['json']
                kjson3 = json.loads(kjson2)
                url = kjson3['url']
        return {"parse": 0, "playUrl": '', "url": url, "header": {'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 14; 23113RK12C Build/SKQ1.231004.001)'}}

    def searchContent(self, key, quick, pg="1"):
        videos = []
        payload = {
            'keywords': key,
            'type_id': "0",
            'page': str(pg)
        }
        if self.search_verify:
            verifi = self.verification()
            if verifi is None:
                return {'list': []}
            payload['code'] = verifi['code']
            payload['key'] = verifi['uuid']

        # 替换urlencode的实现
        data_str = '&'.join([f"{k}={v}" for k, v in payload.items()])

        # 设置请求头
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            **headerx  # 保留原来的 headerx 内容
        }

        url = f'{self.xurl}.index/searchList'
        res = self.post(url=url, data=data_str, headers=headers).json()

        if not res.get('data'):
            return {'list': [], 'msg': res.get('msg')}

        encrypted_data = res['data']
        kjson = self.decrypt(encrypted_data)
        kjson1 = json.loads(kjson)

        for i in kjson1['search_list']:
            video = {
                "vod_id": i['vod_id'],
                "vod_name": i['vod_name'],
                "vod_pic": i['vod_pic'],
                "vod_remarks": f"{i.get('vod_year', '')} {i.get('vod_class', '')}".strip()
            }
            videos.append(video)

        return {
            'list': videos,
            'page': pg,
            'pagecount': 9999,
            'limit': 90,
            'total': 999999
        }

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def decrypt(self, encrypted_data_b64):
        key_text = self.key
        iv_text = self.iv
        key_bytes = key_text.encode('utf-8')
        iv_bytes = iv_text.encode('utf-8')
        encrypted_data = base64.b64decode(encrypted_data_b64)
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        decrypted_padded = cipher.decrypt(encrypted_data)
        decrypted = unpad(decrypted_padded, AES.block_size)
        return decrypted.decode('utf-8')

    def decrypt_wb(self, sencrypted_data):
        key_text = self.key
        iv_text = self.iv
        key_bytes = key_text.encode('utf-8')
        iv_bytes = iv_text.encode('utf-8')
        data_bytes = sencrypted_data.encode('utf-8')
        padded_data = pad(data_bytes, AES.block_size)
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        encrypted_bytes = cipher.encrypt(padded_data)
        encrypted_data_b64 = base64.b64encode(encrypted_bytes).decode('utf-8')
        return encrypted_data_b64

    def ocr(self,base64Img):
        dat2 = self.post("https://api.nn.ci/ocr/b64/text",data=base64Img,headers=headerx).text
        if dat2:
            return dat2
        else:
            return None

    def verification(self):
        random_uuid = str(uuid.uuid4())
        dat = self.fetch(f'{self.xurl}.verify/create?key={random_uuid}',headers=headerx).content
        base64_img = base64.b64encode(dat).decode('utf-8')
        if not dat:
            return None
        code = self.ocr(base64_img)
        if not code:
            return None
        code = self.replace_code(code)  # 修改为类方法调用
        if not (len(code) == 4 and code.isdigit()):
            return None
        return {'uuid': random_uuid, 'code': code}

    @staticmethod  # 添加静态方法装饰器
    def replace_code(text):
        replacements = {'y': '9','口': '0','q': '0','u': '0','o': '0','>': '1','d': '0','b': '8','已': '2','D': '0','五': '5'}
        if len(text) == 3:
            text = text.replace('066', '1666')
            text = text.replace('566', '5066')
        return ''.join(replacements.get(c, c) for c in text)