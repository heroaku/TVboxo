#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import json
import time
import base64

class Spider(Spider):  # 元类 默认的元类 type
    def getName(self):
        return "哔哩哔哩"
    def init(self,extend=""):
        #初始化,获取收藏夹分区,获取userid
        self.userid = self.get_userid()
        url = 'http://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=%s&jsonp=jsonp' % (self.userid)
        rsp = self.fetch(url, cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)
        fav_list=[]
        if jo['code'] == 0:
            for fav in jo['data'].get('list'):

                fav_dict =  {'n':fav['title'] ,'v':fav['id']}
                fav_list.append(fav_dict)
        if self.config["filter"].get('收藏夹'):
            for i in self.config["filter"].get('收藏夹'):
                if i['key']=='mlid':
                    i['value']=fav_list

    #用户userid
    userid=''

    def get_userid(self):
        #获取自己的userid(cookies拥有者)
        url = 'http://api.bilibili.com/x/space/myinfo'
        rsp = self.fetch(url, cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)

        if jo['code'] == 0:
            return jo['data']['mid']


    def isVideoFormat(self,url):
        pass
    def manualVideoCheck(self):
        pass
    def homeContent(self,filter):
        result = {}
        cateManual = {
            "动态":"动态",
            "热门":"热门",
            "推荐":"推荐",
            "排行榜":"排行榜",
            "频道":"频道",
            "收藏夹":"收藏夹",
            "历史记录":"历史记录",
            "zane妈":"zane妈",
            "相声小品": "相声小品",
            "林芊妤":"林芊妤",
            "Zard": "Zard",
            "玩具汽车": "玩具汽车",
            "儿童": "儿童",
            "幼儿": "幼儿",
            "儿童玩具": "儿童玩具",
            "昆虫": "昆虫",
            "动物世界": "动物世界",
            "纪录片": "纪录片",
            "搞笑": "搞笑",
            "假窗-白噪音": "窗+白噪音",
            "演唱会": "演唱会"
        }
        classes = []
        for k in cateManual:
            classes.append({
                'type_name':k,
                'type_id':cateManual[k]
            })
        result['class'] = classes
        if(filter):
            result['filters'] = self.config['filter']
        return result
    def homeVideoContent(self):
        result = {
            'list':[]
        }
        return result
    cookies = ''
    def getCookie(self):
        import requests
        import http.cookies
        ### 这里填cookie
        raw_cookie_line = ""
        simple_cookie = http.cookies.SimpleCookie(raw_cookie_line)
        cookie_jar = requests.cookies.RequestsCookieJar()
        cookie_jar.update(simple_cookie)
        return cookie_jar
    def get_rcmd(self,pg):
        result = {}
        url= 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd?y_num={0}&fresh_type=3&feed_version=SEO_VIDEO&fresh_idx_1h=1&fetch_row=1&fresh_idx=1&brush=0&homepage_ver=1&ps=20'.format(pg)
        rsp = self.fetch(url,cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['item']
            for vod in vodList:
                aid = str(vod['id']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                img =  vod['pic'].strip()
                remark = str(vod['duration']).strip()
                videos.append({
                    "vod_id":aid,
                    "vod_name":title,
                    "vod_pic":img,
                    "vod_remarks":remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result
    def get_dynamic(self,pg):
        result = {}
        if int(pg) > 1:
            return result
        offset = ''
        videos = []
        for i in range(0,10):
            url= 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=all&page={0}&offset={1}'.format(pg,offset)
            rsp = self.fetch(url,cookies=self.getCookie())
            content = rsp.text
            jo = json.loads(content)
            if jo['code'] == 0:
                offset = jo['data']['offset']
                vodList = jo['data']['items']
                for vod in vodList:
                    if vod['type'] == 'DYNAMIC_TYPE_AV':
                        ivod = vod['modules']['module_dynamic']['major']['archive']
                        aid = str(ivod['aid']).strip()
                        title = ivod['title'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                        img =  ivod['cover'].strip()
                        remark = str(ivod['duration_text']).strip()
                        videos.append({
                            "vod_id":aid,
                            "vod_name":title,
                            "vod_pic":img,
                            "vod_remarks":remark
                        })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result
    def second_to_time(self,a):
        #将秒数转化为 时分秒的格式
        if a < 3600:
            return time.strftime("%M:%S", time.gmtime(a))
        else:
            return time.strftime("%H:%M:%S", time.gmtime(a))
    def get_history(self,pg):
        result = {}
        url = 'http://api.bilibili.com/x/v2/history?pn=%s' % pg
        rsp = self.fetch(url,cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)   #解析api接口,转化成json数据对象
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']
            for vod in vodList:
                if vod['duration'] > 0:   #筛选掉非视频的历史记录
                    aid = str(vod["aid"]).strip()   #获取 aid
                    #获取标题
                    title = vod["title"].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                      '"')
                    #封面图片
                    img = vod["pic"].strip()

                    #获取已观看时间
                    if str(vod['progress'])=='-1':
                        process=str(self.second_to_time(vod['duration'])).strip()
                    else:
                        process = str(self.second_to_time(vod['progress'])).strip()
                    #获取视频总时长
                    total_time= str(self.second_to_time(vod['duration'])).strip()
                    #组合 已观看时间 / 总时长 ,赋值给 remark
                    remark = process+' / '+total_time
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
    def get_hot(self,pg):
        result = {}
        url= 'https://api.bilibili.com/x/web-interface/popular?ps=20&pn={0}'.format(pg)
        rsp = self.fetch(url,cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                img =  vod['pic'].strip()
                remark = str(vod['duration']).strip()
                videos.append({
                    "vod_id":aid,
                    "vod_name":title,
                    "vod_pic":img,
                    "vod_remarks":remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result
    def get_rank(self):
        result = {}
        url= 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all'
        rsp = self.fetch(url,cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                img =  vod['pic'].strip()
                remark = str(vod['duration']).strip()
                videos.append({
                    "vod_id":aid,
                    "vod_name":title,
                    "vod_pic":img,
                    "vod_remarks":remark
                })
            result['list'] = videos
            result['page'] = 1
            result['pagecount'] = 1
            result['limit'] = 90
            result['total'] = 999999
        return result
    def get_channel(self,pg,cid):
        result = {}
        if int(pg) > 1:
            return result
        offset = ''
        videos = []
        for i in range(0,5):
            url= 'https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id={0}&sort_type=hot&offset={1}&page_size=30'.format(cid,offset)
            rsp = self.fetch(url,cookies=self.getCookie())
            content = rsp.text
            print(content)
            jo = json.loads(content)
            if jo['code'] == 0:
                offset = jo['data']['offset']
                vodList = jo['data']['list']
                for vod in vodList:
                    if vod['card_type'] == 'rank':
                        rankVods = vod['items']
                        for ivod in rankVods:
                            aid = str(ivod['id']).strip()
                            title = ivod['name'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                            img =  ivod['cover'].strip()
                            remark = str(ivod['duration']).strip()
                            videos.append({
                                "vod_id":aid,
                                "vod_name":title,
                                "vod_pic":img,
                                "vod_remarks":remark
                            })
                    elif vod['card_type'] == 'archive':
                        aid = str(vod['id']).strip()
                        title = vod['name'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
                        img =  vod['cover'].strip()
                        remark = str(vod['duration']).strip()
                        videos.append({
                            "vod_id":aid,
                            "vod_name":title,
                            "vod_pic":img,
                            "vod_remarks":remark
                        })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result
    def get_fav_detail(self,pg,mlid,order):
        result = {}



        url = 'http://api.bilibili.com/x/v3/fav/resource/list?media_id=%s&order=%s&pn=%s&ps=20&platform=web&type=0'%(mlid,order,pg)
        rsp = self.fetch(url, cookies=self.getCookie())

        content = rsp.text
        jo = json.loads(content)

        videos = []
        vodList = jo['data']['medias']

        for vod in vodList:

                aid = str(vod['id']).strip()
                title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img =  vod['cover'].strip()
                remark = str( self.second_to_time(vod['duration'])).strip()
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": img,
                    "vod_remarks": remark

                })


            #videos=self.filter_duration(videos, duration_diff)
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999

        return result
    def get_fav(self,pg,order,extend):

        #获取自己的up_mid(也就是用户uid)
        mlid=''

        fav_config=self.config["filter"].get('收藏夹')

        #默认显示第一个收藏夹内容
        if fav_config:
            for i in fav_config:
                if i['key']=='mlid':
                    if len(i['value'])>0:
                        mlid=i['value'][0]['v']




        #print(self.config["filter"].get('收藏夹'))

        if 'mlid' in extend:
                mlid = extend['mlid']

        if mlid:
            return self.get_fav_detail(pg=pg,mlid=mlid,order=order)
        else:
            return {}
        
    def categoryContent(self,tid,pg,filter,extend):	
        print(tid,pg,filter,extend)
        result = {}
        if tid == "热门":
            return self.get_hot(pg=pg)
        if tid == "排行榜" :
            return self.get_rank()
        if tid == '动态':
            return self.get_dynamic(pg=pg)
        if tid == '历史记录':
            return self.get_history(pg=pg)
        if tid == '推荐':
            return self.get_rcmd(pg=pg)
        if tid == "收藏夹":
            self.box_video_type = '收藏夹'
            order = 'mtime'
            if 'order' in extend:
                order = extend['order']

            return self.get_fav(pg=pg, order=order,extend=extend)
        if tid == '频道':
            cid = '9222'
            if 'cid' in extend:
                cid = extend['cid']
            return self.get_channel(pg=pg,cid=cid)
        url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={0}&page={1}'.format(tid,pg)
        if len(self.cookies) <= 0:
            self.getCookie()
        rsp = self.fetch(url,cookies=self.getCookie())
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] != 0:			
            rspRetry = self.fetch(url,cookies=self.getCookie())
            content = rspRetry.text		
        jo = json.loads(content)
        videos = []
        vodList = jo['data']['result']
        for vod in vodList:
            aid = str(vod['aid']).strip()
            title = tid + ":" + vod['title'].strip().replace("<em class=\"keyword\">","").replace("</em>","")
            img = 'https:' + vod['pic'].strip()
            remark = str(vod['duration']).strip()
            videos.append({
                "vod_id":aid,
                "vod_name":title,
                "vod_pic":img,
                "vod_remarks":remark
            })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result
    def cleanSpace(self,str):
        return str.replace('\n','').replace('\t','').replace('\r','').replace(' ','')
    def detailContent(self,array):
        aid = array[0]
        url = "https://api.bilibili.com/x/web-interface/view?aid={0}".format(aid)

        rsp = self.fetch(url,headers=self.header,cookies=self.getCookie())
        jRoot = json.loads(rsp.text)
        jo = jRoot['data']
        title = jo['title'].replace("<em class=\"keyword\">","").replace("</em>","")
        pic = jo['pic']
        desc = jo['desc']
        typeName = jo['tname']
        vod = {
            "vod_id":aid,
            "vod_name":title,
            "vod_pic":pic,
            "type_name":typeName,
            "vod_year":"",
            "vod_area":"bilidanmu",
            "vod_remarks":"",
            "vod_actor":jo['owner']['name'],
            "vod_director":jo['owner']['name'],
            "vod_content":desc
        }
        ja = jo['pages']
        playUrl = ''
        for tmpJo in ja:
            cid = tmpJo['cid']
            part = tmpJo['part']
            playUrl = playUrl + '{0}${1}_{2}#'.format(part,aid,cid)

        vod['vod_play_from'] = 'B站'
        vod['vod_play_url'] = playUrl

        result = {
            'list':[
                vod
            ]
        }
        return result
    def searchContent(self,key,quick):
        search = self.categoryContent(tid=key,pg=1,filter=None,extend=None)
        result = {
            'list':search['list']
        }
        return result
    def playerContent(self,flag,id,vipFlags):
        # https://www.555dianying.cc/vodplay/static/js/playerconfig.js
        result = {}

        ids = id.split("_")
        url = 'https://api.bilibili.com:443/x/player/playurl?avid={0}&cid=%20%20{1}&qn=112'.format(ids[0],ids[1])
        rsp = self.fetch(url,cookies=self.getCookie())
        jRoot = json.loads(rsp.text)
        jo = jRoot['data']
        ja = jo['durl']
        
        maxSize = -1
        position = -1
        for i in range(len(ja)):
            tmpJo = ja[i]
            if maxSize < int(tmpJo['size']):
                maxSize = int(tmpJo['size'])
                position = i

        url = ''
        if len(ja) > 0:
            if position == -1:
                position = 0
            url = ja[position]['url']

        result["parse"] = 0
        result["playUrl"] = ''
        result["url"] = url
        result["header"] = {
            "Referer":"https://www.bilibili.com",
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
        }
        result["contentType"] = 'video/x-flv'
        return result

    config = {
        "player": {},
        "filter": {"收藏夹": [{
                "key": "order",
                "name": "排序",
                "value": [

                 {
                        "n": "收藏时间",
                        "v": "mtime"
                    },

                    {
                        "n": "播放量",
                        "v": "view"
                    },

                    {
                        "n": "投稿时间",
                        "v": "pubtime"
                    }
                ]
            },
                {
                    "key": "mlid",
                    "name": "收藏夹分区",
                    "value": [
                    ]
                }],
        "频道":[{"key":"cid","name":"分类","value":[{'n': '搞笑', 'v': 1833}, {'n': '美食', 'v': 20215}, {'n': '鬼畜', 'v': 68}, {'n': '天官赐福', 'v': 2544632}, {'n': '英雄联盟', 'v': 9222}, {'n': '美妆', 'v': 832569}, {'n': '必剪创作', 'v': 15775524}, {'n': '单机游戏', 'v': 17683}, {'n': '搞笑', 'v': 1833}, {'n': '科普', 'v': 5417}, {'n': '影视剪辑', 'v': 318570}, {'n': 'vlog', 'v': 2511282}, {'n': '声优', 'v': 1645}, {'n': '动漫杂谈', 'v': 530918}, {'n': 'COSPLAY', 'v': 88}, {'n': '漫展', 'v': 22551}, {'n': 'MAD', 'v': 281}, {'n': '手书', 'v': 608}, {'n': '英雄联盟', 'v': 9222}, {'n': '王者荣耀', 'v': 1404375}, {'n': '单机游戏', 'v': 17683}, {'n': '我的世界', 'v': 47988}, {'n': '守望先锋', 'v': 926988}, {'n': '恐怖游戏', 'v': 17941}, {'n': '英雄联盟', 'v': 9222}, {'n': '王者荣耀', 'v': 1404375}, {'n': '守望先锋', 'v': 926988}, {'n': '炉石传说', 'v': 318756}, {'n': 'DOTA2', 'v': 47034}, {'n': 'CS:GO', 'v': 99842}, {'n': '鬼畜', 'v': 68}, {'n': '鬼畜调教', 'v': 497221}, {'n': '诸葛亮', 'v': 51330}, {'n': '二次元鬼畜', 'v': 29415}, {'n': '王司徒', 'v': 987568}, {'n': '万恶之源', 'v': 21}, {'n': '美妆', 'v': 832569}, {'n': '服饰', 'v': 313718}, {'n': '减肥', 'v': 20805}, {'n': '穿搭', 'v': 1139735}, {'n': '发型', 'v': 13896}, {'n': '化妆教程', 'v': 261355}, {'n': '电音', 'v': 14426}, {'n': '欧美音乐', 'v': 17034}, {'n': '中文翻唱', 'v': 8043}, {'n': '洛天依', 'v': 8564}, {'n': '翻唱', 'v': 386}, {'n': '日文翻唱', 'v': 85689}, {'n': '科普', 'v': 5417}, {'n': '技术宅', 'v': 368}, {'n': '历史', 'v': 221}, {'n': '科学', 'v': 1364}, {'n': '人文', 'v': 40737}, {'n': '科幻', 'v': 5251}, {'n': '手机', 'v': 7007}, {'n': '手机评测', 'v': 143751}, {'n': '电脑', 'v': 1339}, {'n': '摄影', 'v': 25450}, {'n': '笔记本', 'v': 1338}, {'n': '装机', 'v': 413678}, {'n': '课堂教育', 'v': 3233375}, {'n': '公开课', 'v': 31864}, {'n': '演讲', 'v': 2739}, {'n': 'PS教程', 'v': 335752}, {'n': '编程', 'v': 28784}, {'n': '英语学习', 'v': 360005}, {'n': '喵星人', 'v': 1562}, {'n': '萌宠', 'v': 6943}, {'n': '汪星人', 'v': 9955}, {'n': '大熊猫', 'v': 22919}, {'n': '柴犬', 'v': 30239}, {'n': '吱星人', 'v': 6947}, {'n': '美食', 'v': 20215}, {'n': '甜点', 'v': 35505}, {'n': '吃货', 'v': 6942}, {'n': '厨艺', 'v': 239855}, {'n': '烘焙', 'v': 218245}, {'n': '街头美食', 'v': 1139423}, {'n': 'A.I.Channel', 'v': 3232987}, {'n': '虚拟UP主', 'v': 4429874}, {'n': '神楽めあ', 'v': 7562902}, {'n': '白上吹雪', 'v': 7355391}, {'n': '彩虹社', 'v': 1099778}, {'n': 'hololive', 'v': 8751822}, {'n': 'EXO', 'v': 191032}, {'n': '防弹少年团', 'v': 536395}, {'n': '肖战', 'v': 1450880}, {'n': '王一博', 'v': 902215}, {'n': '易烊千玺', 'v': 15186}, {'n': 'BLACKPINK', 'v': 1749296}, {'n': '宅舞', 'v': 9500}, {'n': '街舞', 'v': 5574}, {'n': '舞蹈教学', 'v': 157087}, {'n': '明星舞蹈', 'v': 6012204}, {'n': '韩舞', 'v': 159571}, {'n': '古典舞', 'v': 161247}, {'n': '旅游', 'v': 6572}, {'n': '绘画', 'v': 2800}, {'n': '手工', 'v': 11265}, {'n': 'vlog', 'v': 2511282}, {'n': 'DIY', 'v': 3620}, {'n': '手绘', 'v': 1210}, {'n': '综艺', 'v': 11687}, {'n': '国家宝藏', 'v': 105286}, {'n': '脱口秀', 'v': 4346}, {'n': '日本综艺', 'v': 81265}, {'n': '国内综艺', 'v': 641033}, {'n': '人类观察', 'v': 282453}, {'n': '影评', 'v': 111377}, {'n': '电影解说', 'v': 1161117}, {'n': '影视混剪', 'v': 882598}, {'n': '影视剪辑', 'v': 318570}, {'n': '漫威', 'v': 138600}, {'n': '超级英雄', 'v': 13881}, {'n': '影视混剪', 'v': 882598}, {'n': '影视剪辑', 'v': 318570}, {'n': '诸葛亮', 'v': 51330}, {'n': '韩剧', 'v': 53056}, {'n': '王司徒', 'v': 987568}, {'n': '泰剧', 'v': 179103}, {'n': '郭德纲', 'v': 8892}, {'n': '相声', 'v': 5783}, {'n': '张云雷', 'v': 1093613}, {'n': '秦霄贤', 'v': 3327368}, {'n': '孟鹤堂', 'v': 1482612}, {'n': '岳云鹏', 'v': 24467}, {'n': '假面骑士', 'v': 2069}, {'n': '特摄', 'v': 2947}, {'n': '奥特曼', 'v': 963}, {'n': '迪迦奥特曼', 'v': 13784}, {'n': '超级战队', 'v': 32881}, {'n': '铠甲勇士', 'v': 11564}, {'n': '健身', 'v': 4344}, {'n': '篮球', 'v': 1265}, {'n': '体育', 'v': 41103}, {'n': '帕梅拉', 'v': 257412}, {'n': '极限运动', 'v': 8876}, {'n': '足球', 'v': 584}, {'n': '星海', 'v': 178862}, {'n': '张召忠', 'v': 116480}, {'n': '航母', 'v': 57834}, {'n': '航天', 'v': 81618}, {'n': '导弹', 'v': 14958}, {'n': '战斗机', 'v': 24304}]}]}
    }
    header = {}

    def localProxy(self,param):
        return [200, "video/MP2T", action, ""]
