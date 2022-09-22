# coding=utf-8
# !/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json
import re
import difflib
import urllib

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
          "菊花盘": "https://pan.142856.xyz/OneDrive",
          "🔮嗨翻":"https://pan.hikerfans.com",
		  "🦀9T(Adult)":"https://drive.9t.ee",
		  "🐱梓澪の妙妙屋":"https://xn--i0v44m.xyz",
		  "🚆资源小站":"https://pan.142856.xyz",
		  "🌤晴园的宝藏库":"https://alist.52qy.repl.co",
		  "🐭米奇妙妙屋":"https://anime.mqmmw.ga",
		  "💂小兵组网盘影视":"https://6vv.app",
		  "📀小光盘":"https://alist.xiaoguanxiaocheng.life",
		  "🐋一只鱼":"https://alist.youte.ml",
		  "🌊七米蓝":"https://al.chirmyram.com", 
		  "🌴非盘":"http://www.feifwp.top",
		  "🥼帅盘":"https://hi.shuaipeng.wang",
		  "🐉神族九帝":"https://alist.shenzjd.com",
		  "☃姬路白雪":"https://pan.jlbx.xyz",
		  "🎧听闻网盘":"https://wangpan.sangxuesheng.com",
		  "💾DISK":"http://124.222.140.243:8080",
		  "🌨云播放":"https://quanzi.laoxianghuijia.cn",
		  "✨星梦":"https://pan.bashroot.top",
		  "🌊小江":"https://dyj.me",
		  "💫触光":"https://pan.ichuguang.com",
		  "🕵好汉吧":"https://8023.haohanba.cn",
		  "🥗AUNEY":"http://121.227.25.116:8008",
		  "🎡资源小站":"https://960303.xyz/",
		  "🐝神器云": "https://quanzi.laoxianghuijia.cn",
		  "🏝fenwe":"http://www.fenwe.tk:5244",
		  "🎢轻弹浅唱":"https://g.xiang.lol"
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

    ver = ''
    baseurl = ''
    def getVersion(self, gtid):
        param = {
            "path": '/'
        }
        if gtid.count('/') == 2:
            gtid = gtid + '/'
        baseurl = re.findall(r"http.*://.*?/", gtid)[0]
        ver = self.fetch(baseurl + 'api/public/settings', param)
        vjo = json.loads(ver.text)['data']
        if type(vjo) is dict:
            ver = 3
        else:
            ver = 2
        self.ver = ver
        self.baseurl = baseurl

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        if tid.count('/') == 2:
            tid = tid + '/'
        nurl = re.findall(r"http.*://.*?/", tid)[0]
        if self.ver == '' or self.baseurl != nurl:
            self.getVersion(tid)
        ver = self.ver
        baseurl = self.baseurl
        if tid.count('/') == 2:
            tid = tid + '/'
        pat = tid.replace(baseurl,"")
        param = {
            "path": '/' + pat
        }
        if ver == 2:
            rsp = self.postJson(baseurl + 'api/public/path', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['files']
        elif ver == 3:
            rsp = self.postJson(baseurl + 'api/fs/list', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['content']
        videos = []
        for vod in vodList:
            if ver == 2:
                img = vod['thumbnail']
            elif ver == 3:
                img = vod['thumb']
            if len(img) == 0:
                if vod['type'] == 1:
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
                    if len(vstr) == 2:
                        suball = vstr
                    else:
                        suball = difflib.get_close_matches(vname, vstr, len(vodList), cutoff=0.8)
                    for sub in suball:
                        stype1 = sub.endswith(".ass")
                        stype2 = sub.endswith(".srt")
                        if stype1 is True or stype2 is True:
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
                else:
                    fs = "KB"
                    sz = round(size / (1024.0), 2)
                tag = "file"
                remark = str(sz) + fs
            ifsubt = 'subt' in locals().keys()
            if ifsubt is False:
                aid = baseurl + aid + vod['name']
            else:
                aid = baseurl + aid + vod['name'] + subt
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
            vurl = ids[0]
        else:
            vurl = id
        if self.ver == '' or self.baseurl == '':
            self.getVersion(vurl)
        ver = self.ver
        baseurl = self.baseurl
        if ifsub is True:
            ids = id.split('@@@')
            fileName = ids[0].replace(baseurl, "")
            sfileName = ids[1].replace(baseurl, "")
        else:
            fileName = id.replace(baseurl, "")
        param = {
            "path": '/' + fileName,
            "password": "",
            "page_num": 1,
            "page_size": 100
        }
        if ver == 2:
            rsp = self.postJson(baseurl + 'api/public/path', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']['files'][0]
            if ifsub is True:
                sparam = {
                    "path": '/' + ids[1],
                    "password": "",
                    "page_num": 1,
                    "page_size": 100
                }
                srsp = self.postJson(baseurl + 'api/public/path', sparam)
                sjo = json.loads(srsp.text)
                sList = sjo['data']['files'][0]
                surl = sList['url']
                if surl.startswith('http') is False:
                    head = re.findall(r"h.*?:", baseurl)[0]
                    surl = head + sList['url']
                urlsfileName = urllib.parse.quote(sfileName)
                surl = surl.replace(sfileName, urlsfileName)
                sub = '@@@' + surl
        elif ver == 3:
            rsp = self.postJson(baseurl + 'api/fs/get', param)
            jo = json.loads(rsp.text)
            vodList = jo['data']
            if ifsub is True:
                sparam = {
                    "path": '/' + ids[1],
                    "password": "",
                    "page_num": 1,
                    "page_size": 100
                }
                srsp = self.postJson(baseurl + 'api/fs/get', sparam)
                sjo = json.loads(srsp.text)
                sList = sjo['data']
                surl = sList['raw_url']
                if sList['raw_url'].startswith('http') is False:
                    head = re.findall(r"h.*?:", baseurl)[0]
                    surl = head + sList['url']
                urlsfileName = urllib.parse.quote(sfileName)
                surl = surl.replace(sfileName, urlsfileName)
                sub = '@@@' + surl
        if ver == 2:
            url = vodList['url']
            pic = vodList['thumbnail']
        elif ver == 3:
            url = vodList['raw_url']
            pic = vodList['thumb']
        if ifsub is True:
            purl = url + sub
        else:
            purl = url
        if purl.startswith('http') is False:
            head = re.findall(r"h.*?:", baseurl)[0]
            purl = head + purl
        urlfileName = urllib.parse.quote(fileName)
        purl = purl.replace(fileName, urlfileName)
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
