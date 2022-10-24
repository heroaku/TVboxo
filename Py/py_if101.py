#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import json
import urllib.parse

class Spider(Spider):
    def getName(self):
        return "IF101影视"
    def init(self,extend=""):
        print("============{0}============".format(extend))
        pass
    def homeContent(self,filter):
        result = {}

        classes = [{"type_id":20,"type_name":"电影"},{"type_id":21,"type_name":"电视剧"},{"type_id":22,"type_name":"动漫"},{"type_id":23,"type_name":"综艺"},{"type_id":24,"type_name":"体育"},{"type_id":25,"type_name":"纪录片"},{"type_id":26,"type_name":"明星资讯"},{"type_id":28,"type_name":"冒险片"},{"type_id":29,"type_name":"剧情片"},{"type_id":30,"type_name":"动作片"},{"type_id":31,"type_name":"动画电影"},{"type_id":32,"type_name":"同性片"},{"type_id":33,"type_name":"喜剧片"},{"type_id":34,"type_name":"奇幻片"},{"type_id":35,"type_name":"恐怖片"},{"type_id":36,"type_name":"悬疑片"},{"type_id":37,"type_name":"惊悚片"},{"type_id":38,"type_name":"歌舞片"},{"type_id":39,"type_name":"灾难片"},{"type_id":40,"type_name":"爱情片"},{"type_id":41,"type_name":"犯罪片"},{"type_id":42,"type_name":"科幻片"},{"type_id":43,"type_name":"经典片"},{"type_id":44,"type_name":"网络电影"},{"type_id":117,"type_name":"战争片"},{"type_id":119,"type_name":"欧美剧"},{"type_id":120,"type_name":"日剧"},{"type_id":121,"type_name":"韩剧"},{"type_id":122,"type_name":"国产剧"},{"type_id":123,"type_name":"泰剧"},{"type_id":124,"type_name":"港剧"},{"type_id":125,"type_name":"台剧"},{"type_id":126,"type_name":"新马剧"},{"type_id":127,"type_name":"其他剧"},{"type_id":128,"type_name":"欧美综艺"},{"type_id":129,"type_name":"日本综艺"},{"type_id":130,"type_name":"韩国综艺"},{"type_id":131,"type_name":"国产综艺"},{"type_id":132,"type_name":"新马泰综艺"},{"type_id":133,"type_name":"港台综艺"},{"type_id":134,"type_name":"其他综艺"},{"type_id":135,"type_name":"欧美动漫"},{"type_id":136,"type_name":"日本动漫"},{"type_id":137,"type_name":"韩国动漫"},{"type_id":138,"type_name":"国产动漫"},{"type_id":139,"type_name":"新马泰动漫"},{"type_id":140,"type_name":"港台动漫"},{"type_id":142,"type_name":"其他动漫"}]

        result['class'] = classes
        return result
    def homeVideoContent(self):
        rsp = self.fetch("https://api.8a5.cn/parse/if101/py.php?do=homeVideoContent")
        alists = json.loads(rsp.text)
        alist = alists['list']
        result = {
            'list':alist
        }
        return result
    def categoryContent(self,tid,pg,filter,extend):
        result = {}
        urlParams = []
        params = ''
        for key in extend:
            urlParams.append(str(key) + '=' + extend[key])
        params = '&'.join(urlParams)
        url = 'https://api.8a5.cn/parse/if101/py.php?do=categoryContent&tid={0}&page={1}&{2}'.format(tid, pg,params)
        rsp = self.fetch(url)
        alists = json.loads(rsp.text)
        alist = alists['list']

        result['list'] = alist
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self,array):
        tid = array[0]
        url = 'https://api.8a5.cn/parse/if101/py.php?do=detailContent&id={0}'.format(tid)
        rsp = self.fetch(url)
        alists = json.loads(rsp.text)
        vod = alists['vod']
        result = {
            'list':[
                vod
            ]
        }
        return result

    def searchContent(self,key,quick):
        url = 'https://api.8a5.cn/parse/if101/py.php?do=searchContent&wd={0}'.format(key)
        rsp = self.fetch(url)
        alists = json.loads(rsp.text)
        list = alists['list']
        result = {
            'list':list
        }
        return result


    def playerContent(self,flag,id,vipFlags):
        result = {}
        id = 'https://api.8a5.cn/parse/if101/get.php?url=' + urllib.parse.quote(id)
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = id
        return result

    def isVideoFormat(self,url):
        pass
    def manualVideoCheck(self):
        pass
    def localProxy(self,param):
        return [200, "video/MP2T", action, ""]
