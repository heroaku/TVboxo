# coding=utf-8
# !/usr/bin/python
import sys
import requests
from bs4 import BeautifulSoup
import re
from base.spider import Spider
from urllib.parse import unquote

sys.path.append('..')
xurl = "https://www.youzisp.tv"
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
    def fl(self,key):
        videos = []
        doc = BeautifulSoup(key, "html.parser")
        soup = doc.find_all('li', class_="hl-list-item hl-col-xs-4 hl-col-sm-3 hl-col-md-20w hl-col-lg-2")

        for vod in soup:
            name = vod.select_one("a")['title']
            id = xurl + vod.select_one("a")["href"]
            pic = vod.select_one("a")['data-original']
            remark = vod.find('span', class_="hl-lc-1 remarks").text
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remark
            }
            videos.append(video)
        return videos
    def homeContent(self, filter):
        result = {}
        result = {
            "class": [{"type_id": "dianying", "type_name": "电影"}, {"type_id": "dianshiju", "type_name": "电视剧"},
                      {"type_id": "zongyi", "type_name": "综艺"}, {"type_id": "dongman", "type_name": "动漫"},
                      {"type_id": "jilupian", "type_name": "纪录片"}], "list": [], "filters": {"dianying": [
                {"key": "类型", "name": "类型",
                 "value": [{"n": "全部", "v": ""}, {"n": "动作", "v": "dongzuo"}, {"n": "冒险", "v": "maoxian"},
                           {"n": "喜剧", "v": "xiju"}, {"n": "奇幻", "v": "qihuan"}, {"n": "科幻", "v": "kehuan"},
                           {"n": "悬疑", "v": "xuanyi"}, {"n": "惊悚", "v": "jingsong"},
                           {"n": "战争", "v": "zhanzheng"},
                           {"n": "爱情", "v": "aiqing"}, {"n": "歌舞", "v": "gewu"}, {"n": "犯罪", "v": "fanzui"},
                           {"n": "灾难", "v": "zainan"}, {"n": "同性", "v": "tongxing"}, {"n": "剧情", "v": "juqing"},
                           {"n": "网络", "v": "wangluo"}]}], "dianshiju": [{"key": "类型", "name": "类型",
                                                                            "value": [{"n": "全部", "v": ""},
                                                                                      {"n": "国产", "v": "guochan"},
                                                                                      {"n": "港台", "v": "gangtai"},
                                                                                      {"n": "欧美", "v": "oumei"},
                                                                                      {"n": "日韩", "v": "rihan"},
                                                                                      {"n": "东南亚",
                                                                                       "v": "dongnanya"}]}],
                "zongyi": [
                    {"key": "类型",
                     "name": "类型",
                     "value": [
                         {"n": "全部",
                          "v": ""},
                         {"n": "国产",
                          "v": "guochan"},
                         {"n": "欧美",
                          "v": "oumei"},
                         {"n": "日韩",
                          "v": "rihan"},
                         {
                             "n": "东南亚",
                             "v": "dongnanya"}]}],
                "dongman": [
                    {"key": "类型",
                     "name": "类型",
                     "value": [
                         {"n": "全部",
                          "v": ""},
                         {"n": "大陆",
                          "v": "dalu"},
                         {"n": "日韩",
                          "v": "rihan"},
                         {"n": "欧美",
                          "v": "oumei"},
                         {
                             "n": "东南亚",
                             "v": "dongnanya"},
                         {
                             "n": "动漫剧场",
                             "v": "dongmanjuchang"}]}],
                "jilupian": [
                    {"key": "类型",
                     "name": "类型",
                     "value": [
                         {"n": "全部",
                          "v": ""}]}]}}
        return result

    def homeVideoContent(self):
        try:
            detail = requests.get(url=xurl + '/vodtype/dianshiju.html', headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text
            videos = self.fl(res)

            result = {'list': videos}
            return result
        except:
            pass

    def categoryContent(self, cid, pg, filter, ext):
        result = {}
        print(ext)
        area = ""
        if pg:
            page = int(pg)
        else:
            page = 1
        page = int(pg)
        videos = []
        lxType1 = ""
        if cid == 'dianying':
            if '类型' in ext.keys():
                lxType = ext['类型']
            else:
                lxType = cid
        if cid == 'dianshiju':
            if '类型' in ext.keys():
                lxType = ext['类型']
            else:
                lxType = cid
        if cid == 'zongyi':
            if '类型' in ext.keys():
                lxType = ext['类型']
            else:
                lxType = cid
        if cid == 'dongman':
            if '类型' in ext.keys():
                lxType = ext['类型']
            else:
                lxType = cid
        if cid == 'jilupian':
            if '类型' in ext.keys():
                lxType = ext['类型']
            else:
                lxType = cid

        videos = []
        url = xurl + "/vodshow/" + lxType + "--------" + str(page) + "---.html"

        try:
            detail = requests.get(url=url, headers=headerx)
            detail.encoding = "utf-8"
            res = detail.text
            videos =self.fl(res)
        except:
            pass
        result = {'list': videos}
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        did = ids[0]
        result = {}
        videos = []
        playurl = ''
        res = requests.get(url=did, headers=headerx)
        res = res.text
        match = re.search(r'content-text"><em>(.*?)</em>', res)
        if match:
            vod_content = match.group(1)
        match = re.search(r'年份：</em>(.*?)</li>', res)
        if match:
            vod_year = match.group(1)
        match = re.search(r'地区：</em>(.*?)</li>', res)
        if match:
            vod_area = match.group(1)
        soup = BeautifulSoup(res, 'html.parser')
        ul = soup.find('div', class_="hl-list-wrap")
        vods = ul.find_all('li')
        for vod in vods:
            purl = xurl + vod.select_one('a')['href']
            plform = vod.select_one('a').text
            playurl += plform + '$' + purl + '#'

        playurl = playurl[:-1]

        videos.append({
            "vod_id": did,
            "vod_name": '',
            "vod_pic": "",
            "type_name": '',
            "vod_year": vod_year,
            "vod_area": vod_area,
            "vod_remarks": "",
            "vod_actor": '',
            "vod_director": '',
            "vod_content": vod_content,
            "vod_play_from": '1080P',
            "vod_play_url": playurl
        })

        result['list'] = videos

        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        res = requests.get(id, headers=headerx)
        res.encoding = "utf-8"
        match = re.search(r'\},"url":"(.*?)"', res.text)
        if match:
            purl = match.group(1).replace('\\', '')
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = purl
        result["header"] = headerx
        return result

    def searchContentPage(self, key, quick, page):
        result = {}
        videos = []
        if not page:
            page = 1
        detail = requests.get(xurl + '/vodsearch/' + key + '----------' + str(page) + '---.html', headers=headerx)
        detail.encoding = "utf-8"
        res = detail.text
        doc = BeautifulSoup(res, "html.parser")
        soup = doc.find_all('li', class_="hl-list-item hl-col-xs-12")

        for vod in soup:
            name = vod.select_one("a")['title']
            id = xurl + vod.select_one("a")["href"]
            pic = vod.select_one("a")['data-original']
            remark = vod.find('span', class_="hl-lc-1 remarks").text
            video = {
                "vod_id": id,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remark
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
