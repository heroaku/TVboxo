"""

作者 凯悦宾馆 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================kaiyuebinguan====================

"""

from Crypto.Util.Padding import unpad
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from base.spider import Spider
from bs4 import BeautifulSoup
import urllib.request
import urllib.parse
import binascii
import requests
import base64
import json
import time
import sys
import re
import os

sys.path.append('..')

xurl = "https://51souju1.com"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
          }

# headerx = {
#     'User-Agent': 'Linux; Android 12; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.101 Mobile Safari/537.36'
#           }

pm = ''

class Spider(Spider):
    global xurl
    global headerx

    def getName(self):
        return "首页"

    def init(self, extend):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def extract_middle_text(self, text, start_str, end_str, pl, start_index1: str = '', end_index2: str = ''):
        if pl == 3:
            plx = []
            while True:
                start_index = text.find(start_str)
                if start_index == -1:
                    break
                end_index = text.find(end_str, start_index + len(start_str))
                if end_index == -1:
                    break
                middle_text = text[start_index + len(start_str):end_index]
                plx.append(middle_text)
                text = text.replace(start_str + middle_text + end_str, '')
            if len(plx) > 0:
                purl = ''
                for i in range(len(plx)):
                    matches = re.findall(start_index1, plx[i])
                    output = ""
                    for match in matches:
                        match3 = re.search(r'(?:^|[^0-9])(\d+)(?:[^0-9]|$)', match[1])
                        if match3:
                            number = match3.group(1)
                        else:
                            number = 0
                        if 'http' not in match[0]:
                            output += f"#{'📽️丢丢👉' + match[1]}${number}{xurl}{match[0]}"
                        else:
                            output += f"#{'📽️丢丢👉' + match[1]}${number}{match[0]}"
                    output = output[1:]
                    purl = purl + output + "$$$"
                purl = purl[:-3]
                return purl
            else:
                return ""
        else:
            start_index = text.find(start_str)
            if start_index == -1:
                return ""
            end_index = text.find(end_str, start_index + len(start_str))
            if end_index == -1:
                return ""

        if pl == 0:
            middle_text = text[start_index + len(start_str):end_index]
            return middle_text.replace("\\", "")

        if pl == 1:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                jg = ' '.join(matches)
                return jg

        if pl == 2:
            middle_text = text[start_index + len(start_str):end_index]
            matches = re.findall(start_index1, middle_text)
            if matches:
                new_list = [f'✨丢丢👉{item}' for item in matches]
                jg = '$$$'.join(new_list)
                return jg

    def homeContent(self, filter):
        result = {}
        result = {"class": [{"type_id": "1", "type_name": "丢丢电影🌠"},
                            {"type_id": "2", "type_name": "丢丢剧集🌠"},
                            {"type_id": "4", "type_name": "丢丢动漫🌠"},
                            {"type_id": "41", "type_name": "丢丢记录🌠"},
                            {"type_id": "3", "type_name": "丢丢综艺🌠"}],

                  "list": [],
                  "filters": {"1": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": ""},
                                               {"n": "2024", "v": "2024"},
                                               {"n": "2023", "v": "2023"},
                                               {"n": "2022", "v": "2022"},
                                               {"n": "2021", "v": "2021"},
                                               {"n": "2020", "v": "2020"},
                                               {"n": "2019", "v": "2019"},
                                               {"n": "2018", "v": "2018"}]}],
                              "2": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": ""},
                                               {"n": "2024", "v": "2024"},
                                               {"n": "2023", "v": "2023"},
                                               {"n": "2022", "v": "2022"},
                                               {"n": "2021", "v": "2021"},
                                               {"n": "2020", "v": "2020"},
                                               {"n": "2019", "v": "2019"},
                                               {"n": "2018", "v": "2018"}]}],
                              "3": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": ""},
                                               {"n": "2024", "v": "2024"},
                                               {"n": "2023", "v": "2023"},
                                               {"n": "2022", "v": "2022"},
                                               {"n": "2021", "v": "2021"},
                                               {"n": "2020", "v": "2020"},
                                               {"n": "2019", "v": "2019"},
                                               {"n": "2018", "v": "2018"}]}],
                              "41": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": ""},
                                               {"n": "2024", "v": "2024"},
                                               {"n": "2023", "v": "2023"},
                                               {"n": "2022", "v": "2022"},
                                               {"n": "2021", "v": "2021"},
                                               {"n": "2020", "v": "2020"},
                                               {"n": "2019", "v": "2019"},
                                               {"n": "2018", "v": "2018"}]}],
                              "4": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": ""},
                                               {"n": "2024", "v": "2024"},
                                               {"n": "2023", "v": "2023"},
                                               {"n": "2022", "v": "2022"},
                                               {"n": "2021", "v": "2021"},
                                               {"n": "2020", "v": "2020"},
                                               {"n": "2019", "v": "2019"},
                                               {"n": "2018", "v": "2018"}]}]}}

        return result

    def homeVideoContent(self):
        videos = []

        try:
            detail = requests.get(url=xurl, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text

            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('ul', class_="hl-vod-list")

            for soup in soups:
                vods = soup.find_all('li')

                for vod in vods:
                    names = vod.find('a', class_="hl-lazy")
                    name = names['title']

                    id = names['href']

                    pic = names['data-original']

                    if 'http' not in pic:
                        pic = xurl + pic

                    remarks = vod.find('span', class_="douban")
                    remark = remarks.text.strip()

                    video = {
                        "vod_id": id+'++'+name,
                        "vod_name": '丢丢📽️' + name,
                        "vod_pic": pic,
                        "vod_tag": "folder",
                        "vod_remarks": '丢丢▶️' + remark
                             }
                    videos.append(video)

            result = {'list': videos}
            return result
        except:
            pass

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        videos = []

        if pg:
            page = int(pg)
        else:
            page = 1

        if '++' in cid:

            split = cid.split("++")

            xurl1 = xurl+split[0]
            detail = requests.get(url=xurl1, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text
            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('div', class_="jsx-17a26d933178525f search-result-container")

            for vod in soups:

                ids = vod.find('a', class_="mac_ulog")
                id = ids['href']

                pic = ids['data-icon']

                remark = ids['data-web-name']

                video = {
                    "vod_id": id,
                    "vod_name": '丢丢📽️' + split[1],
                    "vod_pic": pic,
                    "vod_remarks": '丢丢▶️' + remark
                        }
                videos.append(video)

        else:

            if '年代' in ext.keys():
                NdType = ext['年代']
            else:
                NdType = ''

            if page == '1':
                url = f'{xurl}/vodshow/{cid}-----------.html'

            else:
                url = f'{xurl}/vodshow/{cid}--------{str(page)}---{NdType}.html'

            try:
                detail = requests.get(url=url, headers=headerx)
                detail.encoding = "utf-8"
                res = detail.text
                doc = BeautifulSoup(res, "lxml")

                soups = doc.find_all('ul', class_="hl-vod-list")

                for soup in soups:
                    vods = soup.find_all('li')

                    for vod in vods:
                        names = vod.find('a', class_="hl-lazy")
                        name = names['title']

                        id = names['href']

                        pic = names['data-original']

                        if 'http' not in pic:
                            pic = xurl + pic

                        remarks = vod.find('span', class_="douban")
                        remark = remarks.text.strip()

                        video = {
                            "vod_id": id+'++'+name,
                            "vod_name": '丢丢📽️' + name,
                            "vod_pic": pic,
                            "vod_tag": "folder",
                            "vod_remarks": '丢丢▶️' + remark
                                }
                        videos.append(video)

            except:
                pass
        result = {'list': videos}
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        global pm
        did = ids[0]
        result = {}
        videos = []

        if 'http' not in did:
            did = xurl + did

        if 'www.nkdvd.com' in did:  # 耐看点播
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'<div class="module-info-introduction-content">','</p>', 0)
            content = content.replace('\n', '').replace('\t', '').replace('<p>', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<div class="module-play-list-content', '</div>', 3, 'href="(.*?)" title=".*?"><span>(.*?)</span>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.nkdvd.com')

            xianlu = self.extract_middle_text(res, '<div class="module-tab-items-box hisSwiper"','<div class="shortcuts-mobile-overlay">',2, 'data-dropdown-value=".*?"><span>(.*?)</span>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.ffys.fun' in did:  # 飞飞影视
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'<div class="module-info-introduction-content">','</p>', 0)
            content = content.replace('\n', '').replace('\t', '').replace('<p>', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<div class="module-play-list-content', '</div>', 3, 'href="(.*?)" title=".*?"><span>(.*?)</span>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.ffys.fun')

            xianlu = self.extract_middle_text(res, '<div class="module-tab-items-box hisSwiper"','<div class="shortcuts-mobile-overlay">',2, 'data-dropdown-value=".*?"><span>(.*?)</span>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'cddys1.me' in did:  # 臭蛋蛋影视
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'<meta name="description" content=','>', 0)

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<div class="module-play-list-content', '</div>', 3, 'href="(.*?)" title=".*?"><span>(.*?)</span>')
                bofang = bofang.replace('https://51souju1.com', 'https://cddys1.me')

            xianlu = self.extract_middle_text(res, '<div class="module-tab-items-box hisSwiper"','<div class="shortcuts-mobile-overlay">',2, 'data-dropdown-value=".*?"><span>(.*?)</span>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'rebozj.pro' in did:  # 热播之家
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'style="display: none;">','</span>', 0)
            content = content.replace('\u3000', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<ul class="stui-content__playlist', '</ul>', 3, 'href="(.*?)">(.*?)</a>')
                bofang = bofang.replace('https://51souju1.com', 'https://rebozj.pro')

            xianlu = self.extract_middle_text(res, '<ul class="nav nav-tabs','</ul>',2, 'data-toggle=".*?">(.*?)</a>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.juyeye.cc' in did:  # 剧爷爷
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'<div class="module-info-introduction-content">','</p>', 0)
            content = content.replace('\n', '').replace('\t', '').replace('<p>', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<div class="module-play-list-content', '</div>', 3, 'href="(.*?)" title=".*?"><span>(.*?)</span>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.juyeye.cc')

            xianlu = self.extract_middle_text(res, '<div class="module-tab-items-box hisSwiper"','<div class="shortcuts-mobile-overlay">',2, 'data-dropdown-value=".*?"><span>(.*?)</span>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.1080p.club' in did:  # 1080迷
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'<div class="ju-blurb">','</p>', 0)
            content = content.replace('<p>', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<ul class="playNumList">', '</ul>', 3, 'href="(.*?)">(.*?)</a>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.1080p.club')

            xianlu = self.extract_middle_text(res, '<div class="m-title">','</div>',2, '<h2>(.*?)</h2>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.a8ys.vip' in did:  # A8影视
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'style="line-height: 20px;">','</p>', 0)
            content = content.replace('<p>', '').replace('\u3000', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<div class="module-play-list-content', '</div>', 3, 'href="(.*?)" title=".*?"><span>(.*?)</span>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.a8ys.vip')

            xianlu = self.extract_middle_text(res, '<div class="module-tab-items-box hisSwiper"','<div class="shortcuts-mobile-overlay">',2, 'data-dropdown-value="(.*?)">')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.kpkuang.fun' in did:  # 看片狂人
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'简介：</span>','<', 0)
            content = content.replace('\t', '').replace('(www.kpkuang.com)', '').replace('\u3000', '').replace(' ', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<ul class="fed-part-rows" >', '</ul>', 3, 'href="(.*?)" rel="nofollow" title=".*?">\s+.*?\s+(.*?)                        </a>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.kpkuang.fun')

            xianlu = self.extract_middle_text(res, '<ul uk-tab class="yunlist">','</ul>',2, 'data-linename=".*?" >(.*?)                   <span')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        if 'www.hdmoli.pro' in did:  # HDMoli
            res1 = requests.get(url=did, headers=headerx)
            res1.encoding = "utf-8"
            res = res1.text

            url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
            response = requests.get(url)
            response.encoding = 'utf-8'
            code = response.text
            name = self.extract_middle_text(code, "s1='", "'", 0)
            Jumps = self.extract_middle_text(code, "s2='", "'", 0)

            content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'剧情：','</p>', 0)
            content = content.replace('\n', '').replace('\t', '')

            if name not in content:
                bofang = Jumps
            else:
                bofang = self.extract_middle_text(res, '<ul class="myui-content__list sort-list', '</ul>', 3, 'href="(.*?)" target=".*?">(.*?)</a>')
                bofang = bofang.replace('https://51souju1.com', 'https://www.hdmoli.pro')

            xianlu = self.extract_middle_text(res, '<ul class="nav nav-tabs active">','</ul>',2, 'data-toggle=".*?">(.*?)</a>')

            videos.append({
                "vod_id": did,
                "vod_actor": '😸皮皮 😸灰灰',
                "vod_director": '😸丢丢',
                "vod_content": content,
                "vod_play_from": xianlu,
                "vod_play_url": bofang
                         })

        result['list'] = videos
        return result

    def playerContent(self, flag, id, vipFlags):
        parts = id.split("http")

        xiutan = 0

        if xiutan == 0:
            if len(parts) > 1:
                before_https, after_https = parts[0], 'http' + parts[1]

            if '239755956819.mp4' in after_https:
                url = after_https

            if 'www.nkdvd.com' in after_https:  # 耐看点播
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = after_https

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'cddys1.me' in after_https:  # 臭蛋蛋影视
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = after_https

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'rebozj.pro' in after_https:  # 热播之家
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '},"url":"', '"', 0).replace('\\', '')
                url = unquote(url)

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.juyeye.cc' in after_https:  # 剧爷爷
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '},"url":"', '"', 0).replace('\\', '')

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.a8ys.vip' in after_https:  # A8影院
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '},"url":"', '"', 0).replace('\\', '')
                url = url.replace('u7b2c', '%E7%AC%AC').replace('u96c6', '%E9%9B%86')

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.kpkuang.fun' in after_https:  # 看片狂人
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = after_https

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.1080p.club' in after_https:  # 1080迷
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = after_https

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.ffys.fun' in after_https:  # 飞飞影视
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '},"url":"', '"', 0).replace('\\', '')

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

            if 'www.hdmoli.pro' in after_https:  # HDMoli
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '";var now="', '"', 0).replace('\\', '')
                url = "https://v.damoli.pro/v/" + url

                result = {}
                result["parse"] = xiutan
                result["playUrl"] = ''
                result["url"] = url
                result["header"] = headerx
                return result

    def searchContentPage(self, key, quick, page):
        result = {}
        videos = []

        if not page:
            page = '1'
        if page == '1':
            url = f'{xurl}/vodsearch/-------------.html?wd={key}&submit='

        else:
            url = f'{xurl}/vodsearch/{key}----------{str(page)}---.html'

        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        doc = BeautifulSoup(res, "lxml")

        soups = doc.find_all('ul', class_="hl-one-list")

        for soup in soups:
            vods = soup.find_all('div', class_="hl-item-pic")

            for vod in vods:

                name = vod.find('a')['title']

                id = vod.find('a')['href']

                pic = vod.find('a')['data-original']

                if 'http' not in pic:
                    pic = xurl + pic

                remarks = vod.find('span', class_="douban")
                remark = remarks.text.strip()

                video = {
                    "vod_id": id+'++'+name,
                    "vod_name": '丢丢📽️' + name,
                    "vod_pic": pic,
                    "vod_tag": "folder",
                    "vod_remarks": '丢丢▶️' + remark
                        }
                videos.append(video)

        result['list'] = videos
        result['page'] = page
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def searchContent(self, key, quick):
        return self.searchContentPage(key, quick, '1')

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None





