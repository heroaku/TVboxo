#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import json
import time
import base64
import requests

class Spider(Spider):
    def getName(self):
        return "央视综艺"

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
            "中华情": "TOPC1451541564922207",
            "回声嘹亮": "TOPC1451535575561597",
            "你好生活第三季": "TOPC1627961377879898",
            "我的艺术清单": "TOPC1582272259917160",
            "黄金100秒": "TOPC1451468496522494",
            "非常6+1": "TOPC1451467940101208",
            "向幸福出发": "TOPC1451984638791216",
            "幸福账单": "TOPC1451984801613379",
            "中国文艺报道": "TOPC1601348042760302",
            "舞蹈世界": "TOPC1451547605511387",
            "艺览天下": "TOPC1451984851125433",
            "天天把歌唱": "TOPC1451535663610626",
            "金牌喜剧班": "TOPC1611826337610628",
            "环球综艺秀": "TOPC1571300682556971",
            "挑战不可能第五季": "TOPC1579169060379297",
            "我们有一套": "TOPC1451527089955940",
            "为了你": "TOPC1451527001597710",
            "朗读者第一季": "TOPC1487120479377477",
            "挑战不可能第二季": "TOPC1474277421637816",
            "精彩一刻": "TOPC1451464786232149",
            "挑战不可能之加油中国": "TOPC1547519813971570",
            "挑战不可能第一季": "TOPC1452063816677656",
            "机智过人第三季": "TOPC1564019920570762",
            "经典咏流传第二季": "TOPC1547521714115947",
            "挑战不可能第三季": "TOPC1509500865106312",
            "经典咏流传第一季": "TOPC1513676755770201",
            "欢乐中国人第二季": "TOPC1516784350726581",
            "故事里的中国第一季": "TOPC1569729252342702",
            "你好生活第二季": "TOPC1604397385056621",
            "喜上加喜": "TOPC1590026042145705",
            "走在回家的路上": "TOPC1577697653272281",
            "综艺盛典": "TOPC1451985071887935",
            "艺术人生": "TOPC1451984891490556",
            "全家好拍档": "TOPC1474275463547690",
            "大魔术师": "TOPC1451984047073332",
            "欢乐一家亲": "TOPC1451984214170587",
            "开心辞典": "TOPC1451984378754815",
            "综艺星天地": "TOPC1451985188986150",
            "激情广场": "TOPC1451984341218765",
            "笑星大联盟": "TOPC1451984731428297",
            "天天乐": "TOPC1451984447718918",
            "欢乐英雄": "TOPC1451984242834620",
            "欢乐中国行": "TOPC1451984301286720",
            "我爱满堂彩": "TOPC1451538709371329",
            "综艺头条": "TOPC1569226855085860",
            "中华情": "TOPC1451541564922207",
            "魔法奇迹": "TOPC1451542029126607"
        }
        classes = []
        for k in cateManual:
            classes.append({
                'type_name': k,
                'type_id': cateManual[k]
            })
        result['class'] = classes
        if filter:
            result['filters'] = self.config['filter']
        return result

    def homeVideoContent(self):
        result = {
            'list': []
        }
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        extend['id'] = tid
        extend['p'] = pg
        filterParams = ["id", "p", "d"]
        params = ["", "", ""]
        for idx in range(len(filterParams)):
            fp = filterParams[idx]
            if fp in extend.keys():
                params[idx] = '{0}={1}'.format(filterParams[idx], extend[fp])
        suffix = '&'.join(params)
        url = 'https://api.cntv.cn/NewVideo/getVideoListByColumn?{0}&n=20&sort=desc&mode=0&serviceId=tvcctv&t=json'.format(suffix)
        if not tid.startswith('TOPC'):
            url = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?{0}&n=20&sort=desc&mode=0&serviceId=tvcctv&t=json'.format(suffix)
        rsp = self.fetch(url, headers=self.header)
        jo = json.loads(rsp.text)
        vodList = jo['data']['list']
        videos = []
        for vod in vodList:
            guid = vod['guid']
            title = vod['title']
            img = vod['image']
            brief = vod['brief']
            videos.append({
                "vod_id": guid + "###" + img,
                "vod_name": title,
                "vod_pic": img,
                "vod_remarks": ''
            })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, array):
        aid = array[0].split('###')
        tid = aid[0]
        url = "https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid={0}".format(tid)

        rsp = self.fetch(url, headers=self.header)
        jo = json.loads(rsp.text)
        title = jo['title'].strip()
        link = jo['hls_url'].strip()
        vod = {
            "vod_id": tid,
            "vod_name": title,
            "vod_pic": aid[1],
            "type_name": '',
            "vod_year": "",
            "vod_area": "",
            "vod_remarks": "",
            "vod_actor": "",
            "vod_director": "",
            "vod_content": ""
        }
        vod['vod_play_from'] = 'CCTV'
        vod['vod_play_url'] = title + "$" + link

        result = {
            'list': [vod]
        }
        return result

    def searchContent(self, key, quick):
        result = {
            'list': []
        }
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        # 先尝试获取原始m3u8文件
        rsp = self.fetch(id, headers=self.header)
        content = rsp.text.strip()
        
        if not content:
            # 如果获取失败，直接返回原始链接
            result["parse"] = 0
            result["playUrl"] = ''
            result["url"] = id
            result["header"] = self.header
            return result
            
        arr = content.split('\n')
        urlPrefix = self.regStr(id, '(http[s]?://[a-zA-z0-9.]+)/')
        
        # 尝试获取高清链接
        resolutions = ['2000', '1200', '800']  # 从高到低尝试
        final_url = id  # 默认使用原始链接
        
        for res in resolutions:
            try:
                subUrl = arr[-1].split('/')
                subUrl[3] = res
                subUrl[-1] = f'{res}.m3u8'
                hdUrl = urlPrefix + '/'.join(subUrl)
                
                # 检查高清链接是否有效
                hdRsp = requests.head(hdUrl, headers=self.header, timeout=5)
                if hdRsp.status_code == 200:
                    final_url = hdUrl
                    break
            except:
                continue
                
        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = final_url
        result["header"] = self.header
        return result

    config = {
        "player": {},
        "filter": {
            "TOPC1451557970755294": [
                {
                    "key": "d",
                    "name": "年份",
                    "value": [
                        {"n": "全部", "v": ""},
                        {"n": "2023", "v": "2023"},
                        {"n": "2022", "v": "2022"},
                        {"n": "2021", "v": "2021"},
                        {"n": "2020", "v": "2020"},
                        {"n": "2019", "v": "2019"},
                        {"n": "2018", "v": "2018"},
                        {"n": "2017", "v": "2017"},
                        {"n": "2016", "v": "2016"},
                        {"n": "2015", "v": "2015"},
                        {"n": "2014", "v": "2014"},
                        {"n": "2013", "v": "2013"},
                        {"n": "2012", "v": "2012"},
                        {"n": "2011", "v": "2011"},
                        {"n": "2010", "v": "2010"},
                        {"n": "2009", "v": "2009"}
                    ]
                }
            ]
        }
    }
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36",
        "Referer": "https://www.cctv.com/",
        "Origin": "https://www.cctv.com"
    }

    def localProxy(self, param):
        return [200, "video/MP2T", None, ""]