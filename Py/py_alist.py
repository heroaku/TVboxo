# coding=utf-8
# !/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json
import re
import difflib

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
            "七米蓝": "https://al.chirmyram.com",
            "姬路白雪": "https://pan.jlbx.xyz"
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
        num = tid.count('/')
        if num ==2:
            tid = tid + '/'
        url = re.findall(r"http.*://.*?/", tid)[0]
        pat = tid.replace(url,"")
        ifver = 'ver' in locals().keys()
        if ifver is False:
            param = {
                "path": '/'
            }
            ver = self.fetch(url + 'api/public/settings', param)
            vjo = json.loads(ver.text)['data']
            if type(vjo) is dict:
                ver = 3
            else:
                ver = 2
        param = {
            "path": '/' + pat
        }
        if ver == 2:
            rsp = self.postJson(url + 'api/public/path', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['files']
        else:
            rsp = self.postJson(url + 'api/fs/list', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['content']
        videos = []
        for vod in vodList:
            if ver == 2:
                img = vod['thumbnail']
            else:
                img = vod['thumb']
            if len(img) == 0 and vod['type'] == 1:
                img = "http://img1.3png.com/281e284a670865a71d91515866552b5f172b.png"
            if pat != '':
                aid = pat + '/'
            else:
                aid = pat
            if vod['type'] == 1:
                tag = "folder"
                remark = "文件夹"
            else:
                vname = re.findall(r"(.*)\.", vod['name'])[0]
                vtpye = vod['name'].replace(vname,"")
                if vtpye == '.mkv' or vtpye == '.mp4':
                    vstr = re.findall(r"\'name\': \'(.*?)\'", str(vodList))
                    suball = difflib.get_close_matches(vname, vstr, len(vodList), cutoff=0.8)
                    for sub in suball:
                        stype = sub.replace(vname,"")
                        if stype == '.ass' or stype == '.srt':
                            subt = '@@@'+aid + sub
                size = vod['size']
                if size > 1024 * 1024 * 1024 * 1024.0:
                    fs = "TB"
                    sz = round(size / (1024 * 1024 * 1024 * 1024.0), 2)
                elif size > 1024 * 1024 * 1024.0:
                    fs = "GB"
                    sz = round(size / (1024 * 1024 * 1024.0), 2)
                elif size > 1024 * 1024.0:
                    fs = "MB"
                    sz = round(size / (1024 * 1024.0), 2)
                elif size > 1024.0:
                    fs = "KB"
                    sz = round(size / (1024.0), 2)
                tag = "file"
                remark = str(sz) + fs
            ifsubt = 'subt' in locals().keys()
            if ifsubt is False:
                aid = url + aid + vod['name']
            else:
                aid = url + aid + vod['name'] + subt
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
        id = array[0]
        ifsub = '@@@' in id
        if ifsub is True:
            ids = id.split('@@@')
            url = re.findall(r"http.*://.*?/", ids[0])[0]
            fileName = ids[0].replace(url, "")
        else:
            url = re.findall(r"http.*://.*?/", id)[0]
            fileName = id.replace(url, "")
        ifver = 'ver' in locals().keys()
        if ifver is False:
            param = {
                "path": '/'
            }
            ver = self.fetch(url + 'api/public/settings', param)
            vjo = json.loads(ver.text)['data']
            if type(vjo) is dict:
                ver = 3
            else:
                ver = 2
        param = {
            "path": '/' + fileName,
            "password": "",
            "page_num": 1,
            "page_size": 100
        }
        if ver == 2:
            rsp = self.postJson(url + 'api/public/path', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['files'][0]
            if ifsub is True:
                sparam = {
                    "path": '/' + ids[1],
                    "password": "",
                    "page_num": 1,
                    "page_size": 100
                }
                srsp = self.postJson(url + 'api/public/path', sparam)
                sjo = json.loads(srsp.text)
                sList = sjo['data']['files'][0]
                sub = '@@@' + vodList['url']
        else:
            rsp = self.postJson(url + 'api/fs/get', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']
            if ifsub is True:
                sparam = {
                    "path": '/' + ids[1],
                    "password": "",
                    "page_num": 1,
                    "page_size": 100
                }
                srsp = self.postJson(url + 'api/fs/get', sparam)
                sjo = json.loads(srsp.text)
                sList = sjo['data']
                sub = '@@@' + sList['raw_url']

        if ver == 2:
            url = vodList['url']
            pic = vodList['thumbnail']
        else:
            url = vodList['raw_url']
            pic = vodList['thumb']
        if ifsub is True:
            purl = url + sub
        else:
            purl = url
        vId = fileName
        name = vodList['name']
        tag = "file"
        if vodList['type'] == 1:
            tag = "folder"
        vod = {
            "vod_id": vId,
            "vod_name": name,
            "vod_pic": pic,
            "vod_tag": tag,
            "vod_play_from": "播放",
            "vod_play_url": name + '$' + purl
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
        ifsub = '@@@' in id
        if ifsub is True:
            ids = id.split('@@@')
            url = ids[0]
            result['subt'] = ids[1]
        else:
            url = id
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        return result

    config = {
        "player": {},
        "filter": {}
    }
    header = {}

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]