# coding=utf-8
# !/usr/bin/python
import sys

sys.path.append('..')
from base.spider import Spider
import json
from requests import session, utils
import os
import time
import base64


class Spider(Spider):
    box_video_type = ''

    def getDependence(self):
        return ['py_bilibili']

    def getName(self):
        return "我的哔哩"

    def init(self, extend=""):
        self.bilibili = extend[0]
        print("============{0}============".format(extend))
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        result = {}
        cateManual = {
            # ————————以下可自定义关键词，结果以搜索方式展示————————
            "宅舞": "宅舞",
            "cosplay": "cosplay",
            "周杰伦": "周杰伦",
            "狗狗": "汪星人",
            "猫咪": "喵星人",
            "请自定义关键词": "美女",
            # ————————以下可自定义UP主，冒号后须填写UID————————
            "虫哥说电影": "29296192",

        }
        classes = []
        for k in cateManual:
            classes.append({
                'type_name': k,
                'type_id': cateManual[k]
            })
        result['class'] = classes
        if (filter):
            filters = {}
            for lk in cateManual:
                if not cateManual[lk].isdigit():
                    link = cateManual[lk]
                    filters.update({
                        link: [{"key": "order", "name": "排序",
                                "value": [{"n": "综合排序", "v": "totalrank"}, {"n": "最新发布", "v": "pubdate"},
                                          {"n": "最多点击", "v": "click"}, {"n": "最多收藏", "v": "stow"},
                                          {"n": "最多弹幕", "v": "dm"}, ]},
                               {"key": "duration", "name": "时长",
                                "value": [{"n": "全部", "v": "0"}, {"n": "60分钟以上", "v": "4"},
                                          {"n": "30~60分钟", "v": "3"}, {"n": "5~30分钟", "v": "2"},
                                          {"n": "5分钟以下", "v": "1"}]}]
                    })
            result['filters'] = filters
        return result

    # 用户cookies，请在py_bilibili里填写，此处不用改
    cookies = ''

    def getCookie(self):
        self.cookies = self.bilibili.getCookie()
        return self.cookies

    def homeVideoContent(self):
        result = {}
        return result

    def get_up_videos(self, tid, pg):
        result = {}
        url = 'https://api.bilibili.com/x/space/arc/search?mid={0}&pn={1}&ps=20'.format(tid, pg)
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']['vlist']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                img = vod['pic'].strip()
                remark = str(vod['length']).strip()
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": img,
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def categoryContent(self, tid, pg, filter, extend):
        self.box_video_type = "分区"
        if tid.isdigit():
            return self.get_up_videos(tid, pg)
        else:
            result = self.bilibili.categoryContent(tid, pg, filter, extend)
            return result

    def cleanSpace(self, str):
        return str.replace('\n', '').replace('\t', '').replace('\r', '').replace(' ', '')

    def detailContent(self, array):
        if self.box_video_type == "搜索":
            mid = array[0]
            # 获取UP主视频列表，ps后面为视频数量，默认为20，加快加载速度
            url = 'https://api.bilibili.com/x/space/arc/search?mid={0}&pn=1&ps=20'.format(mid)
            rsp = self.fetch(url, headers=self.header)
            content = rsp.text
            jRoot = json.loads(content)
            jo = jRoot['data']['list']['vlist']

            url2 = "https://api.bilibili.com/x/web-interface/card?mid={0}".format(mid)
            rsp2 = self.fetch(url2, headers=self.header)
            jRoot2 = json.loads(rsp2.text)
            jo2 = jRoot2['data']['card']
            name = jo2['name'].replace("<em class=\"keyword\">", "").replace("</em>", "")
            pic = jo2['face']
            desc = jo2['Official']['desc'] + "　" + jo2['Official']['title']
            vod = {
                "vod_id": mid,
                "vod_name": name + "　" + "个人主页",
                "vod_pic": pic,
                "type_name": "最近投稿",
                "vod_year": "",
                "vod_area": "bilidanmu",
                "vod_remarks": "",  # 不会显示
                'vod_tags': 'mv',  # 不会显示
                "vod_actor": "粉丝数：" + self.bilibili.zh(jo2['fans']),
                "vod_director": name,
                "vod_content": desc
            }
            playUrl = ''
            for tmpJo in jo:
                eid = tmpJo['aid']
                url3 = "https://api.bilibili.com/x/web-interface/view?aid=%s" % str(eid)
                rsp3 = self.fetch(url3)
                jRoot3 = json.loads(rsp3.text)
                cid = jRoot3['data']['cid']
                part = tmpJo['title'].replace("#", "-")
                playUrl = playUrl + '{0}${1}_{2}#'.format(part, eid, cid)

            vod['vod_play_from'] = 'B站'
            vod['vod_play_url'] = playUrl

            result = {
                'list': [
                    vod
                ]
            }
            return result
        else:
            return self.bilibili.detailContent(array)

    def searchContent(self, key, quick):
        self.box_video_type = "搜索"
        if len(self.cookies) <= 0:
            self.getCookie()
        url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&keyword={0}'.format(key)
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        videos = []
        vodList = jo['data']['result']
        for vod in vodList:
            aid = str(vod['mid']) # str(vod["res"][0]["aid"])
            title = "UP主：" + vod['uname'].strip() + "  ☜" + key
            img = 'https:' + vod['upic'].strip()
            remark = "粉丝数" + self.bilibili.zh(vod['fans'])
            videos.append({
                "vod_id": aid,
                "vod_name": title,
                "vod_pic": img,
                "vod_remarks": remark
            })
        result = {
            'list': videos
        }
        return result

    def playerContent(self, flag, id, vipFlags):
        return self.bilibili.playerContent(flag, id, vipFlags)

    config = {
        "player": {},
        "filter": {
        }
    }

    header = {
        "Referer": "https://www.bilibili.com",
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    }

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]
