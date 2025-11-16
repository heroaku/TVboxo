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

xurl = "https://www.akysw.pro"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
          }

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
                            {"type_id": "164", "type_name": "丢丢4K🌠"},
                            {"type_id": "79", "type_name": "丢丢综艺🌠"},
                            {"type_id": "166", "type_name": "丢丢体育🌠"},
                            {"type_id": "170", "type_name": "丢丢演唱会🌠"},
                            {"type_id": "165", "type_name": "丢丢短剧🌠"}],

                  "list": [],
                  "filters": {"77": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": "0"},
                                               {"n": "80年代", "v": "42"},
                                               {"n": "90年代", "v": "43"},
                                               {"n": "00年代", "v": "44"},
                                               {"n": "10年代", "v": "45"},
                                               {"n": "20年代", "v": "46"}]}],
                              "78": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": "0"},
                                               {"n": "80年代", "v": "42"},
                                               {"n": "90年代", "v": "43"},
                                               {"n": "00年代", "v": "44"},
                                               {"n": "10年代", "v": "45"},
                                               {"n": "20年代", "v": "46"}]}],
                              "80": [{"key": "年代",
                                      "name": "年代",
                                      "value": [{"n": "全部", "v": "0"},
                                                {"n": "80年代", "v": "42"},
                                                {"n": "90年代", "v": "43"},
                                                {"n": "00年代", "v": "44"},
                                                {"n": "10年代", "v": "45"},
                                                {"n": "20年代", "v": "46"}]}],
                              "164": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": "0"},
                                               {"n": "80年代", "v": "42"},
                                               {"n": "90年代", "v": "43"},
                                               {"n": "00年代", "v": "44"},
                                               {"n": "10年代", "v": "45"},
                                               {"n": "20年代", "v": "46"}]}],
                              "79": [{"key": "年代",
                                      "name": "年代",
                                      "value": [{"n": "全部", "v": "0"},
                                                {"n": "80年代", "v": "42"},
                                                {"n": "90年代", "v": "43"},
                                                {"n": "00年代", "v": "44"},
                                                {"n": "10年代", "v": "45"},
                                                {"n": "20年代", "v": "46"}]}],
                              "166": [{"key": "年代",
                                      "name": "年代",
                                      "value": [{"n": "全部", "v": "0"},
                                                {"n": "80年代", "v": "42"},
                                                {"n": "90年代", "v": "43"},
                                                {"n": "00年代", "v": "44"},
                                                {"n": "10年代", "v": "45"},
                                                {"n": "20年代", "v": "46"}]}],
                              "170": [{"key": "年代",
                                      "name": "年代",
                                      "value": [{"n": "全部", "v": "0"},
                                                {"n": "80年代", "v": "42"},
                                                {"n": "90年代", "v": "43"},
                                                {"n": "00年代", "v": "44"},
                                                {"n": "10年代", "v": "45"},
                                                {"n": "20年代", "v": "46"}]}],
                              "165": [{"key": "年代",
                                     "name": "年代",
                                     "value": [{"n": "全部", "v": "0"},
                                               {"n": "80年代", "v": "42"},
                                               {"n": "90年代", "v": "43"},
                                               {"n": "00年代", "v": "44"},
                                               {"n": "10年代", "v": "45"},
                                               {"n": "20年代", "v": "46"}]}]}}

        return result

    def homeVideoContent(self):
        videos = []

        try:
            detail = requests.get(url=xurl, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text

            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('div', class_="hide-b-20")

            if soups and len(soups) > 1:
                soups = soups[1]
                vods = soups.find_all('div', class_="public-list-box")

                for vod in vods:
                    names = vod.find('div', class_="public-list-div")
                    name = names.find('a')['title']

                    id = names.find('a')['href']

                    pic = vod.find('img')['data-src']

                    if 'http' not in pic:
                        pic = xurl + pic

                    remarks = vod.find('span', class_="public-list-prb hide")
                    remark = remarks.text.strip()

                    video = {
                        "vod_id": id,
                        "vod_name": '丢丢📽️' + name,
                        "vod_pic": pic,
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

        if '年代' in ext.keys():
            NdType = ext['年代']
        else:
            NdType = ''

        if page == '1':
            url = f'{xurl}/vod/list/1/{cid}/0/0/0/0/0/0'

        else:
            url = f'{xurl}/vod/list/{str(page)}/{cid}/0/{NdType}/0/0/0/0'

        try:
            detail = requests.get(url=url, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text
            doc = BeautifulSoup(res, "lxml")

            soups = doc.find_all('div', class_="border-box")

            for soup in soups:
                vods = soup.find_all('div', class_="public-list-box")

                for vod in vods:

                    name = vod.find('img')['alt']

                    ids = vod.find('a', class_="public-list-exp")
                    id = ids['href']

                    pic = vod.find('img')['src']

                    if 'http' not in pic:
                        pic = xurl + pic

                    remarks = vod.find('span', class_="public-list-prb")
                    remark = remarks.text.strip()

                    video = {
                        "vod_id": id,
                        "vod_name": '丢丢📽️' + name,
                        "vod_pic": pic,
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

        res1 = requests.get(url=did, headers=headerx)
        res1.encoding = "utf-8"
        res = res1.text

        url = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1732697392729/didiu.txt'
        response = requests.get(url)
        response.encoding = 'utf-8'
        code = response.text
        name = self.extract_middle_text(code, "s1='", "'", 0)
        Jumps = self.extract_middle_text(code, "s2='", "'", 0)

        content = '😸丢丢🎉为您介绍剧情📢本资源来源于网络🚓侵权请联系删除👉' + self.extract_middle_text(res,'class="text cor3" >','</div>', 0)

        if name not in content:
            bofang = Jumps
        else:
            bofang = self.extract_middle_text(res, '<ul class="anthology-list-play', '</ul>', 3, 'href="(.*?)" class="hide" style="width:100px">\s+(.*?)\s+</a>')

        xianlu = self.extract_middle_text(res, '<div class="swiper-wrapper"','</div>',2, '</i>&nbsp;(.*?)</a>')

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
            else:
                res = requests.get(url=after_https, headers=headerx)
                res = res.text

                url = self.extract_middle_text(res, '?url=', "'", 0).replace('\\', '')

            result = {}
            result["parse"] = xiutan
            result["playUrl"] = ''
            result["url"] = url
            result["header"] = headerx
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





