# coding=utf-8
# !/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json


class Spider(Spider):  # 元类 默认的元类 type
    def getName(self):
        return "Alist"

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        result = {}
        cateManual = {
            "七米蓝": "https://al.chirmyram.com"
        }
        classes = []
        for k in cateManual:
            classes.append({
                'type_name': k,
				"type_flag": "1",
                'type_id': cateManual[k]
            })
        result['class'] = classes
        if (filter):
            result['filters'] = self.config['filter']
        return result

    def homeVideoContent(self):
        result = {
            'list': []
        }
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        ulen = len(self.config['url'])
        pat = tid[ulen:] + '/'
        param = {
            "path": pat
        }
        rsp = self.postJson(self.config['url'] + '/api/fs/list', param)
        jo = json.loads(rsp.text)
        videos = []
        vodList = jo['data']['content']
        for vod in vodList:
            img = vod['thumb']
            if len(img) == 0:
                if vod['type'] == 1:
                    img = "http://img1.3png.com/281e284a670865a71d91515866552b5f172b.png"
            aid = pat
            tag = "file"
            remark = "文件"
            if vod['type'] == 1:
                tag = "folder"
                remark = "文件夹"
                aid = self.config['url'] + aid + vod['name']
            else:
                aid = aid + vod['name']
            videos.append({
                "vod_id":  aid,
                "vod_name": vod['name'],
                "vod_pic": img,
                "vod_tag": tag,
                "vod_remarks": remark
            })
        result['list'] = videos
        result['page'] = 1
        result['pagecount'] = 1
        result['limit'] = 999
        result['total'] = 999999
        return result

    def detailContent(self, array):
        fileName = array[0]
        param = {
            "path": fileName,
            "password": "",
            "page_num": 1,
            "page_size": 100
        }
        rsp = self.postJson(self.config['url'] + '/api/fs/get', param)
        jo = json.loads(rsp.text)
        videos = []
        vodList = jo['data']
        url = vodList['raw_url']
        vId = self.config['url'] + fileName
        name = vodList['name']
        pic = vodList['thumb']
        tag = "file"
        if vodList['type'] == 1:
            tag = "folder"
        vod = {
            "vod_id": vId,
            "vod_name": name,
            "vod_pic": pic,
            "vod_tag": tag,
            "vod_play_from": "播放",
            "vod_play_url": name + '$' + url
        }
        result = {
            'list': [
                vod
            ]
        }
        return result

    def searchContent(self, key, quick):
        result = {
            'list': []
        }
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        url = id
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        return result

    config = {
        "player": {},
        "filter": {},
        "url": 'https://al.chirmyram.com'
    }
    header = {}

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]