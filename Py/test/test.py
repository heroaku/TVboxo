# coding=utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from Crypto.Util.Padding import unpad
from Crypto.Util.Padding import pad
from urllib.parse import unquote
from Crypto.Cipher import ARC4
from urllib.parse import quote
from base.spider import Spider
from Crypto.Cipher import AES
from datetime import datetime
from bs4 import BeautifulSoup
from base64 import b64decode
import urllib.request
import urllib.parse
import datetime
import binascii
import requests
import base64
import json
import time
import sys
import re
import os

sys.path.append('..')

sys.stdout.reconfigure(encoding='utf-8')

xurl = "https://qqqys.com"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
          }

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
                            output += f"#{match[1]}${number}{xurl}{match[0]}"
                        else:
                            output += f"#{match[1]}${number}{match[0]}"
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
                new_list = [f'{item}' for item in matches]
                jg = '$$$'.join(new_list)
                return jg

    def homeContent(self, filter):
        result = {"class": []}
        doc = self._get_homepage_document()
        result["class"] = self._extract_categories(doc)
        return result

    def _get_homepage_document(self):
        detail = requests.get(url=xurl, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        return BeautifulSoup(res, "lxml")

    def _extract_categories(self, doc):
        categories = []
        soups = doc.find_all('ul', class_="flex")
        skip_keywords = {"问答", "专题", "排行榜"}
        for soup in soups:
            vods = soup.find_all('li')
            for vod in vods:
                name = vod.text.strip()
                if name in skip_keywords:
                    continue
                categories.append({"type_id": name, "type_name": name})
        return categories

    def homeVideoContent(self):
        doc = self._get_homepage_document()
        videos = self._extract_videos(doc)
        result = {'list': videos}
        return result

    def _get_homepage_document(self):
        detail = requests.get(url=xurl, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        return BeautifulSoup(res, "lxml")

    def _extract_videos(self, doc):
        videos = []
        soups = doc.find_all('div', class_="grid")
        for soup in soups:
            vods = soup.find_all('a')
            for vod in vods:
                video = self._parse_video_item(vod)
                videos.append(video)
        return videos

    def _parse_video_item(self, vod):
        name = vod['title']
        id = vod['href']
        pic = vod.find('img')['data-original']
        if 'http' not in pic:
            pic = xurl + pic
        remarks = vod.find('div',class_="truncate text-center text-xs absolute right-0 bottom-0 left-0 z-10 pt-[50px] px-[5px] pb-[10px] pointer-events-none text-white")
        remark = remarks.text.strip() if remarks else ""
        return {
            "vod_id": id,
            "vod_name": name,
            "vod_pic": pic,
            "vod_remarks": remark
               }

    def categoryContent(self, cid, pg, filter, ext):
        page = self._process_page_number(pg)
        url, params = self._build_category_request_params(cid, page)
        data = self._fetch_category_data(url, params)
        videos = self._parse_category_videos(data)
        result = self._build_category_result(videos, pg)
        return result

    def _process_page_number(self, pg):
        if pg:
            return int(pg)
        else:
            return 1

    def _build_category_request_params(self, cid, page):
        url = "https://qqqys.com/api.php/filter/vod"
        params = {
            'type_name': cid,
            'sort': 'hits',
            'page': str(page),
            'limit': 24
                 }
        return url, params

    def _fetch_category_data(self, url, params):
        detail = requests.get(url=url, headers=headerx, params=params)
        detail.encoding = "utf-8"
        data = detail.json()
        return data['data']['list']

    def _parse_category_videos(self, data):
        videos = []
        for vod in data:
            name = vod['vod_name']
            id = f"/vd/{vod['vod_id']}.html"
            pic = vod['vod_pic']
            remark = vod['vod_year']
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remark
                    }
            videos.append(video)
        return videos

    def _build_category_result(self, videos, pg):
        result = {
            'list': videos,
            'page': pg,
            'pagecount': 9999,
            'limit': 90,
            'total': 999999
                 }
        return result

    def detailContent(self, ids):
        did = ids[0]
        did = self._process_video_url(did)
        doc, res = self._fetch_and_parse_page(did)
        content = self._extract_video_content(res)
        director = self._extract_video_director(res)
        actor = self._extract_video_actor(res)
        year = self._extract_video_year(res)
        data = self._extract_playlist_data(res)
        xianlu, bofang = self._process_playlist_data(data)
        aggregate_data = self._fetch_aggregate_data(did)
        xianlu, bofang = self._process_aggregate_playlist(aggregate_data, xianlu, bofang)
        xianlu, bofang = self._clean_playlist_strings(xianlu, bofang)
        videos = self._build_video_details(did, director, actor, year, content, xianlu, bofang)
        result = {'list': videos}
        return result

    def _process_video_url(self, did):
        if 'http' not in did:
            did = xurl + did
        return did

    def _fetch_and_parse_page(self, did):
        res = requests.get(url=did, headers=headerx)
        res.encoding = "utf-8"
        res_text = res.text
        doc = BeautifulSoup(res_text, "lxml")
        return doc, res_text

    def _extract_video_content(self, res):
        content = '为您介绍剧情📢' + self.extract_middle_text(res, 'md:border-[#25252b]">', '</p>', 0)
        content = content.replace(' ', '').replace('<p>', '').replace('\n', '').replace('\t', '')
        return content

    def _extract_video_director(self, res):
        return self.extract_middle_text(res, '导演：', '</div>', 1, 'href=".*?" target=".*?">(.*?)</a>')

    def _extract_video_actor(self, res):
        return self.extract_middle_text(res, '主演：', '</div>', 1, 'href=".*?" target=".*?">(.*?)</a>')

    def _extract_video_year(self, res):
        return self.extract_middle_text(res, '上映：', 'div>', 1, '<div class=".*?">(.*?)</')

    def _extract_playlist_data(self, res):
        soups = self.extract_middle_text(res, "window.PLAYLIST_DATA = ", ";", 0)
        return json.loads(soups)

    def _process_playlist_data(self, data):
        xianlu = ''
        bofang = ''
        def convert_unicode(text):
            def replace_func(match):
                try:
                    hex_code = match.group(1)
                    return chr(int(hex_code, 16))
                except:
                    return match.group(0)
            return re.sub(r'u([0-9a-fA-F]{4})', replace_func, text)
        for key, value_dict in data.items():
            id = value_dict["url"]
            id = convert_unicode(id)
            name = value_dict["player_info"]["show"]
            name = convert_unicode(name)
            bofang = bofang + id + '$$$'
            xianlu = xianlu + name + '$$$'
        return xianlu, bofang

    def _fetch_aggregate_data(self, did):
        fenge = did.split("/")
        vod_id = fenge[4].replace('.html', '')
        url = f"{xurl}/api.php/internal/search_aggregate?vod_id={vod_id}"
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        data = detail.json()
        return data['data']

    def _process_aggregate_playlist(self, aggregate_data, xianlu, bofang):
        for vod in aggregate_data:
            name = vod['site_name']
            id = vod['vod_play_url']
            bofang = bofang + id + '$$$'
            xianlu = xianlu + name + '$$$'
        return xianlu, bofang

    def _clean_playlist_strings(self, xianlu, bofang):
        xianlu = xianlu[:-3]
        bofang = bofang[:-3]
        return xianlu, bofang

    def _build_video_details(self, did, director, actor, year, content, xianlu, bofang):
        videos = []
        videos.append({
            "vod_id": did,
            "vod_director": director,
            "vod_actor": actor,
            "vod_year": year,
            "vod_content": content,
            "vod_play_from": xianlu,
            "vod_play_url": bofang
                     })
        return videos

    def playerContent(self, flag, id, vipFlags):
        url = self._resolve_play_url(id)
        result = self._build_player_result(url)
        return result

    def _resolve_play_url(self, id):
        if 'vwnet' in id or 'YYNB' in id:
            return self._resolve_vwnet_url(id)
        elif 'xysl' in id:
            return self._resolve_xysl_url(id)
        elif 'm3u8' in id:
            return self._resolve_m3u8_url(id)
        else:
            return self._resolve_default_url(id)

    def _resolve_vwnet_url(self, id):
        fenge = id.split("-")
        url = f'{xurl}/api.php/decode/url/?url={id}&vodFrom={fenge[0]}'
        return self._fetch_decoded_url(url)

    def _resolve_xysl_url(self, id):
        url = f'{xurl}/api.php/decode/url/?url={id}&vodFrom=aiappslys'
        return self._fetch_decoded_url(url)

    def _resolve_m3u8_url(self, id):
        return id

    def _resolve_default_url(self, id):
        url = f'{xurl}/api.php/decode/url/?url={id}&vodFrom=duanjuzy'
        return self._fetch_decoded_url(url)

    def _fetch_decoded_url(self, url):
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        data = detail.json()
        return data['data']

    def _build_player_result(self, url):
        result = {}
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        result["header"] = headerx
        return result

    def searchContentPage(self, key, quick, pg):
        page = self._process_page_number(pg)
        url = self._build_search_url(key, page)
        doc = self._fetch_and_parse_search_page(url)
        videos = self._extract_search_videos(doc)
        result = self._build_search_result(videos, pg)
        return result

    def _process_page_number(self, pg):
        if pg:
            return int(pg)
        else:
            return 1

    def _build_search_url(self, key, page):
        return f'{xurl}/vodsearch/{key}--/page/{str(page)}.html'

    def _fetch_and_parse_search_page(self, url):
        detail = requests.get(url=url, headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        return BeautifulSoup(res, "lxml")

    def _extract_search_videos(self, doc):
        videos = []
        soups = doc.find_all('div', class_="bg-[#16161a] p-5 rounded-lg relative mb-10 pt-[30px]")
        for vod in soups:
            video = self._parse_search_video_item(vod)
            videos.append(video)
        return videos

    def _parse_search_video_item(self, vod):
        names = vod.find('div', class_="text-[16px] mb-2 leading-[1.2] truncate")
        name = names.text.strip()
        ids = vod.find('a', class_="float-left z-[1] relative mt-[-40px] ml-[-20px] w-[112px]")
        id = ids['href']
        pic = vod.find('img')['data-original']
        if 'http' not in pic:
            pic = xurl + pic
        remarks = vod.find('div', class_="module-item-cover relative w-full aspect-[10/14] overflow-hidden rounded-lg bg-center bg-cover")
        remark = remarks.text.strip() if remarks else ""
        video = {
            "vod_id": id,
            "vod_name": name,
            "vod_pic": pic,
            "vod_remarks": remark
                }
        return video

    def _build_search_result(self, videos, pg):
        result = {
            'list': videos,
            'page': pg,
            'pagecount': 9999,
            'limit': 90,
            'total': 999999
                 }
        return result

    def searchContent(self, key, quick, pg="1"):
        return self.searchContentPage(key, quick, '1')

    def localProxy(self, params):
        if params['type'] == "m3u8":
            return self.proxyM3u8(params)
        elif params['type'] == "media":
            return self.proxyMedia(params)
        elif params['type'] == "ts":
            return self.proxyTs(params)
        return None






