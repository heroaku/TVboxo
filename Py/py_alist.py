# coding=utf-8
# !/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json
import re
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
		"课程搜索": "https://www.souke365.cn", 
		"博哥": "www.top12345.top",
          "🔮嗨翻":"https://pan.hikerfans.com",
		  "帅仔1":"http://43.139.29.179:5244/",
                  "帅仔2":"http://43.139.29.179:5245/",
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
        cid = ''
        purl = ''
        svodList = str(vodList)
        lenvodList = len(vodList)
        substr = str(re.findall(r"\'name\': \'(.*?)\'", svodList))
        foldernum = svodList.count('\'type\': 1')
        filenum = lenvodList - foldernum
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
                cid = baseurl + aid + vod['name']
            #计算文件大小
            else:
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
                cid = baseurl + aid + vod['name']
                # 开始爬视频与字幕
                if filenum < 150:
                    if 'mp4' in vod['name'] or 'mkv' in vod['name'] or 'TS' in vod['name'] or 'flv' in vod['name'] or 'rmvb' in vod['name'] or 'mp3' in vod['name'] or 'flac' in vod['name'] or 'wav' in vod['name'] or 'wma' in vod['name'] or 'dff' in vod['name']:
                        vodurl = vod['name']
                        # 开始爬字幕
                        cid = '###'
                        subname = re.findall(r"(.*)\.", vod['name'])[0]
                        if filenum == 2:
                            if '.ass' in substr:
                                sub = re.findall(r"'(.*).ass", substr)[0]
                                subt = '@@@' + sub + '.ass'
                                if ',' in sub:
                                    sub = re.findall(r"', '(.*).ass", substr)[0]
                                    subt = '@@@' + sub + '.ass'
                            if '.srt' in substr:
                                sub = re.findall(r"'(.*).srt", substr)[0]
                                subt = '@@@' + sub + '.srt'
                                if ',' in sub:
                                    sub = re.findall(r"', '(.*).srt", substr)[0]
                                    subt = '@@@' + sub + '.srt'
                        else:
                            if subname + '.ass' in substr:
                                subt = '@@@' + subname + '.ass'
                            elif subname + '.srt' in substr:
                                subt = '@@@' + subname + '.srt'
                        # 合并链接
                        if 'subt' in locals().keys():
                            purl = purl + '{0}{1}#'.format(vodurl, subt)
                        else:
                            purl = purl + '{0}#'.format(vodurl)
                else:
                    subname = re.findall(r"(.*)\.", vod['name'])[0]
                    if subname + '.ass' in substr:
                        subt = '@@@' + subname + '.ass'
                        cid = cid + subt
                    elif subname + '.srt' in substr:
                        subt = '@@@' + subname + '.srt'
                        cid = cid + subt
            videos.append({
                "vod_id":  cid,
                "vod_name": vod['name'],
                "vod_pic": img,
                "vod_tag": tag,
                "vod_remarks": remark
            })
        if 'purl' in locals().keys():
            purl = baseurl + aid + '+++' + purl
            for i in range(foldernum, lenvodList):
                if videos[i]['vod_id'] == '###':
                    videos[i]['vod_id'] = purl
        result['list'] = videos
        result['page'] = 1
        result['pagecount'] = 1
        result['limit'] = 999
        result['total'] = 999999
        return result

    def detailContent(self, array):
        id = array[0]
        if '+++' in id:
            ids = id.split('+++')
            durl = ids[0]
            vsList = ids[1].strip('#').split('#')
            vsurl = ''
            for vs in vsList:
                if '@@@' in vs:
                    dvs = vs.split('@@@')
                    vname = dvs[0]
                    vurl = durl + dvs[0]
                    surl = durl + dvs[1]
                    vsurl = vsurl + '{0}${1}@@@{2}#'.format(vname, vurl, surl)
                else:
                    vurl = durl + vs
                    vsurl = vsurl + '{0}${1}#'.format(vs, vurl)
            url = vsurl
        else:
            durl = id
        if self.ver == '' or self.baseurl == '':
            self.getVersion(durl)
        baseurl = self.baseurl
        if '+++' in id:
            vid = durl.replace(baseurl, "").strip('/')
        else:
            vid = durl.replace(re.findall(r".*/", durl)[0], "")
            url = vid + '$' + id
        vod = {
            "vod_id": vid,
            "vod_name": vid,
            "vod_pic": '',
            "vod_tag": '',
            "vod_play_from": "播放",
            "vod_play_url": url
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
        url = ''
        subturl = ''
        ifsub = '@@@' in id
        if ifsub is True:
            ids = id.split('@@@')
            if self.ver == '' or self.baseurl == '':
                self.getVersion(ids[1])
            ver = self.ver
            baseurl = self.baseurl
            fileName = ids[1].replace(baseurl, "")
            vfileName = ids[0].replace(baseurl, "")
            param = {
                "path": '/' + fileName,
                "password": "",
                "page_num": 1,
                "page_size": 100
            }
            vparam = {
                "path": '/' + vfileName,
                "password": "",
                "page_num": 1,
                "page_size": 100
            }
            if ver == 2:
                rsp = self.postJson(baseurl + 'api/public/path', param)
                jo = json.loads(rsp.text)
                vodList = jo['data']['files'][0]
                subturl = vodList['url']
                vrsp = self.postJson(baseurl + 'api/public/path', vparam)
                vjo = json.loads(vrsp.text)
                vList = vjo['data']['files'][0]
                url = vList['url']
            elif ver == 3:
                rsp = self.postJson(baseurl + 'api/fs/get', param)
                jo = json.loads(rsp.text)
                vodList = jo['data']
                subturl = vodList['raw_url']
                vrsp = self.postJson(baseurl + 'api/fs/get', vparam)
                vjo = json.loads(vrsp.text)
                vList = vjo['data']
                url = vList['raw_url']
            if subturl.startswith('http') is False:
                head = re.findall(r"h.*?:", baseurl)[0]
                subturl = head + subturl
            if url.startswith('http') is False:
                head = re.findall(r"h.*?:", baseurl)[0]
                url = head + url
            urlfileName = urllib.parse.quote(fileName)
            subturl = subturl.replace(fileName, urlfileName)
            urlvfileName = urllib.parse.quote(vfileName)
            url = url.replace(vfileName, urlvfileName)
            result['subt'] = subturl
        else:
            if self.ver == '' or self.baseurl == '':
                self.getVersion(id)
            ver = self.ver
            baseurl = self.baseurl
            vfileName = id.replace(baseurl, "")
            vparam = {
                "path": '/' + vfileName,
                "password": "",
                "page_num": 1,
                "page_size": 100
            }
            if ver == 2:
                vrsp = self.postJson(baseurl + 'api/public/path', vparam)
                vjo = json.loads(vrsp.text)
                vList = vjo['data']['files'][0]
                driver = vList['driver']
                url = vList['url']
            elif ver == 3:
                vrsp = self.postJson(baseurl + 'api/fs/get', vparam)
                vjo = json.loads(vrsp.text)
                vList = vjo['data']
                url = vList['raw_url']
                driver = vList['provider']
            if url.startswith('http') is False:
                head = re.findall(r"h.*?:", baseurl)[0]
                url = head + url
            urlvfileName = urllib.parse.quote(vfileName)
            url = url.replace(vfileName, urlvfileName)
            if driver == 'Baidu.Disk':
                result["header"] = {"User-Agent": "pan.baidu.com"}
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
