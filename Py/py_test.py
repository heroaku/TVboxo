# coding=utf-8
# !/usr/bin/python
import sys
from base.spider import Spider
import json
import threading
import requests
from requests import session, utils
import random
import time

sys.path.append('..')


class Spider(Spider):

    def getName(self):
        return "哔哩哔哩"

    # 主页
    def homeContent(self, filter):
        result = {}
        cateManual = {
            "动态": "动态",
            "热门": "热门",
            "推荐": "推荐",
            "排行榜": "排行榜",
            "发现": "发现",
            "频道": "频道",
            # ————————以下为已经隐藏的分区，请取消任意#号启用—————————
            # "动画": "1",
            # "音乐": "3",
            # "舞蹈": "129",
            # "游戏": "4",
            # "鬼畜": "119",
            # "知识": "36",
            # "科技": "188",
            # "运动": "234",
            # "生活": "160",
            # "美食": "211",
            # "动物": "217",
            # "汽车": "223",
            # "时尚": "155",
            # "娱乐": "5",
            # "影视": "181",
            # "每周必看": "每周必看",
            # "入站必刷": "入站必刷",
            # "历史记录": "历史记录",
            # "我的收藏": "我的收藏",
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

    # 用户cookies
    cookies = ''
    userid = ''
    csrf = ''

    def getCookie(self):
        import http.cookies
        # ----↓↓↓↓↓↓↓----在下方raw_cookie_line后的双引号内填写----↓↓↓↓↓↓↓----
        raw_cookie_line = ""
        simple_cookie = http.cookies.SimpleCookie(raw_cookie_line)
        cookie_jar = requests.cookies.RequestsCookieJar()
        cookie_jar.update(simple_cookie)
        rsp = session()
        rsp.cookies = cookie_jar
        content = self.fetch("https://api.bilibili.com/x/web-interface/nav", cookies=rsp.cookies)
        res = json.loads(content.text)
        if res["code"] == 0:
            self.cookies = rsp.cookies
            self.userid = res["data"].get('mid')
            self.csrf = rsp.cookies['bili_jct']
        return cookie_jar

    channel_list_lite = []

    def __init__(self):
        self.getCookie()
        url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=%s&jsonp=jsonp' % self.userid
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        fav_list = []
        if jo['code'] == 0:
            for fav in jo['data'].get('list'):
                fav_dict = {
                    'n': fav['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                         '"').strip(),
                    'v': fav['id']}
                fav_list.append(fav_dict)
        if self.config["filter"].get('我的收藏'):
            for i in self.config["filter"].get('我的收藏'):
                if i['key'] == 'mlid':
                    i['value'] = fav_list
        # —————————————获得热门频道列表———————————————
        url2 = 'https://api.bilibili.com/x/web-interface/web/channel/category/channel/list?id=100&offset=0&page_size=100'
        rsp2 = self.fetch(url2, cookies=self.cookies)
        content2 = rsp2.text
        jo2 = json.loads(content2)
        channel_list = []
        if jo2['code'] == 0:
            for channel in jo2['data'].get('channels'):
                channel_dict = {
                    'n': channel['name'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                            '"').strip(),
                    'v': channel['id']}
                channel_list.append(channel_dict)
                self.channel_list_lite.append(channel['id'])
        if self.config["filter"].get('频道'):
            for i in self.config["filter"].get('频道'):
                if i['key'] == 'cid':
                    i['value'] = channel_list
        # ————————————————获取动态首页上最近更新的UP主————————————————
        url = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=1'
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        up_list = []
        if jo['code'] == 0:
            for up in jo['data'].get('items'):
                up_dict = {
                    'n': up['modules']["module_author"]['name'],
                    'v': str(up['modules']["module_author"]['mid'])}
                up_list.append(up_dict)
            up_list = [{"n": "上个视频的UP主", "v": "上个视频的UP主"}
                       # ———————此处可以在【动态】中自定义UP主,需填UID，格式如下——————————————
                       # {"n":"徐云流浪中国", "v":"697166795"},
                       ] + up_list
        if self.config["filter"].get('动态'):
            for i in self.config["filter"].get('动态'):
                if i['key'] == 'mid':
                    i['value'] = up_list

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    # 格式化图片，默认16:9的webp格式，降低内存占用
    def format_img(self, img):
        img += "@800w_450h_1c_100q.webp"  # 格式，[jpg/png/gif]@{width}w_{high}h_{is_cut}c_{quality}q.{format}
        return img

    # 将没有page_size参数的页面分页
    def pagination(self, array, pg):
        page_size = 10      # 默认单页视频数量为10，可自定义
        max_number = page_size * int(pg)
        min_number = max_number - page_size
        return array[min_number:max_number]

    # 记录视频历史记录
    def post_history(self, aid, cid):
        url = 'https://api.bilibili.com/x/v2/history/report?aid={0}&cid={1}&csrf={2}'.format(aid, cid, self.csrf)
        requests.post(url=url, cookies=self.cookies)

    # 将超过10000的数字换成成以万和亿为单位
    def zh(self, num):
        if int(num) >= 100000000:
            p = round(float(num) / float(100000000), 1)
            p = str(p) + '亿'
        else:
            if int(num) >= 10000:
                p = round(float(num) / float(10000), 1)
                p = str(p) + '万'
            else:
                p = str(num)
        return p

    # 将秒数转化为 时分秒的格式
    def second_to_time(self, a):
        if a < 3600:
            return time.strftime("%M:%S", time.gmtime(a))
        else:
            return time.strftime("%H:%M:%S", time.gmtime(a))

    # 字符串时分秒以及分秒形式转换成秒
    def str2sec(self, x):
        x = str(x)
        try:
            h, m, s = x.strip().split(':')  # .split()函数将其通过':'分隔开，.strip()函数用来除去空格
            return int(h) * 3600 + int(m) * 60 + int(s)  # int()函数转换成整数运算
        except:
            m, s = x.strip().split(':')  # .split()函数将其通过':'分隔开，.strip()函数用来除去空格
            return int(m) * 60 + int(s)  # int()函数转换成整数运算

    # 按时间过滤
    def filter_duration(self, vodlist, key):
        if key == '0':
            return vodlist
        else:
            vod_list_new = [i for i in vodlist if
                            self.time_diff1[key][0] <= self.str2sec(str(i["vod_remarks"])) < self.time_diff1[key][1]]
            return vod_list_new

    time_diff1 = {'1': [0, 300],
                  '2': [300, 900], '3': [900, 1800], '4': [1800, 3600],
                  '5': [3600, 99999999999999999999999999999999]
                  }
    time_diff = '0'

    def homeVideoContent(self):
        return {'list': self.get_rank(0, 1)['list'] + self.get_rank(0, 2)['list'][0:2]}

    dynamic_offset = ''

    def get_dynamic(self, pg, mid, order):
        if mid == '0':
            result = {}
            if str(pg) == '1':
                url = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=%s' % pg
            else:
                url = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&offset=%s&page=%s' % (
                    self.dynamic_offset, pg)
            rsp = self.fetch(url, cookies=self.cookies)
            content = rsp.text
            jo = json.loads(content)
            if jo['code'] == 0:
                self.dynamic_offset = jo['data'].get('offset')
                videos = []
                vodList = jo['data']['items']
                for vod in vodList:
                    if vod['type'] == 'DYNAMIC_TYPE_AV':
                        up = vod['modules']["module_author"]['name']
                        ivod = vod['modules']['module_dynamic']['major']['archive']
                        aid = str(ivod['aid']).strip()
                        title = ivod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                        img = ivod['cover'].strip()
                        remark = str(self.second_to_time(self.str2sec(ivod['duration_text']))).strip() + '　 ' + str(
                            up).strip()
                        videos.append({
                            "vod_id": aid,
                            "vod_name": title,
                            "vod_pic": self.format_img(img),
                            "vod_remarks": remark
                        })
                result['list'] = videos
                result['page'] = pg
                result['pagecount'] = 9999
                result['limit'] = 90
                result['total'] = 999999
            return result
        elif not mid.isdigit():
            return self.get_up_videos(mid=self.up_mid, pg=pg, order=order)
        else:
            return self.get_up_videos(mid=mid, pg=pg, order=order)

    def get_hot(self, pg):
        result = {}
        url = 'https://api.bilibili.com/x/web-interface/popular?ps=10&pn={0}'.format(pg)
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                img = vod['pic'].strip()
                reason = vod['rcmd_reason']['content'].strip()
                if '人气飙升' in reason:
                    reason = '人气飙升'
                remark = str(self.second_to_time(vod['duration'])).strip() + "　⊵ " + self.zh(
                    vod['stat']['view']) + "　" + reason
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_rcmd(self, pg):
        result = {}
        url = 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd?y_num={0}&fresh_type=3&feed_version=SEO_VIDEO&fresh_idx_1h=1&fetch_row=1&fresh_idx=1&brush=0&homepage_ver=1&ps=10'.format(
            pg)
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['item']
            for vod in vodList:
                if vod['duration'] > 0:
                    aid = str(vod['id']).strip()
                    title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                    img = vod['pic'].strip()
                    remark = str(self.second_to_time(vod['duration'])).strip() + "　⊵ " + self.zh(
                        vod['stat']['view']) + "　≣ " + self.zh(vod['stat']['danmaku'])
                    videos.append({
                        "vod_id": aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 10
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_rank(self, tid, pg):
        result = {}
        url = 'https://api.bilibili.com/x/web-interface/ranking/v2?rid={0}&type=all'.format(tid)
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            vodList = self.pagination(vodList, pg)
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                img = vod['pic'].strip()
                remark = str(self.second_to_time(vod['duration'])).strip() + "　⊵ " + self.zh(
                    vod['stat']['view']) + "　≣ " + self.zh(vod['stat']['danmaku'])
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_found(self, tid, pg):
        result = {}
        url = ''
        if tid == "每周必看":
            url1 = 'https://api.bilibili.com/x/web-interface/popular/series/list'
            rsp1 = self.fetch(url1, cookies=self.cookies)
            content1 = rsp1.text
            jo1 = json.loads(content1)
            number = jo1['data']['list'][0]['number']
            url = 'https://api.bilibili.com/x/web-interface/popular/series/one?number=' + str(number)
        elif tid == "入站必刷":
            url = 'https://api.bilibili.com/x/web-interface/popular/precious?page_size=100&page=1'
        elif tid == "原创":
            url = 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=origin'
        elif tid == "新人":
            url = 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=rookie'
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            vodList = self.pagination(vodList, pg)
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip()
                img = vod['pic'].strip()
                remark = str(self.second_to_time(vod['duration'])).strip() + "　⊵ " + self.zh(
                    vod['stat']['view']) + "　≣ " + self.zh(vod['stat']['danmaku'])
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    channel_offset = ''

    def get_channel(self, pg, cid, extend, order):
        result = {}
        if order == "featured":
            if str(pg) == '1':
                url = 'https://api.bilibili.com/x/web-interface/web/channel/featured/list?channel_id={0}&filter_type=0&offset=&page_size=10'.format(
                    cid)
            else:
                url = 'https://api.bilibili.com/x/web-interface/web/channel/featured/list?channel_id={0}&filter_type=0&offset={1}&page_size=10'.format(
                    cid, self.channel_offset)
        else:
            if str(pg) == '1':
                url = 'https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id={0}&sort_type={1}&offset=&page_size=10'.format(
                    cid, order)
            else:
                url = 'https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id={0}&sort_type={1}&offset={2}&page_size=10'.format(
                    cid, order, self.channel_offset)
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo.get('code') == 0:
            self.channel_offset = jo['data'].get('offset')
            videos = []
            vodList = jo['data']['list']
            if order == 'hot' and pg == '1':
                vodList_rank = vodList[0]['items']
                del (vodList[0])
                vodList = vodList_rank + vodList
            for vod in vodList:
                aid = str(vod['id']).strip()
                title = vod['name'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                img = vod['cover'].strip()
                remark = str(self.second_to_time(self.str2sec(vod['duration']))).strip() + "　⊵ " + vod[
                    'view_count'] + "　" + "ღ " + vod['like_count']
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_history(self, pg):
        result = {}
        url = 'https://api.bilibili.com/x/v2/history?pn=%s&ps=10' % pg
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)  # 解析api接口,转化成json数据对象
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']
            for vod in vodList:
                if vod['duration'] > 0:
                    aid = str(vod["aid"]).strip()
                    title = vod["title"].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                            '"')
                    img = vod["pic"].strip()
                    total_time = str(self.second_to_time(vod['duration'])).strip()
                    view_at = time.strftime("%m-%d %H:%M", time.localtime(vod['view_at']))
                    remark = total_time + '　 ✧ ' + view_at
                    videos.append({
                        "vod_id": aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_toview(self, pg):
        result = {}
        url = 'https://api.bilibili.com/x/v2/history/toview'
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']
            vodList = self.pagination(vodList, pg)
            for vod in vodList:
                if vod['duration'] > 0:
                    aid = str(vod["aid"]).strip()
                    title = vod["title"].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;", '"')
                    img = vod["pic"].strip()
                    if str(vod['progress']) == '-1':
                        process = str(self.second_to_time(vod['duration'])).strip()
                    else:
                        process = str(self.second_to_time(vod['progress'])).strip()
                    total_time = str(self.second_to_time(vod['duration'])).strip()
                    remark = process + ' / ' + total_time + "　⊵ " + self.zh(vod['stat']['view'])
                    videos.append({
                        "vod_id": aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_fav(self, pg, order, extend):
        mlid = ''
        fav_config = self.config["filter"].get('我的收藏')
        if fav_config:
            for i in fav_config:
                if i['key'] == 'mlid':
                    if len(i['value']) > 0:
                        mlid = i['value'][0]['v']
        if 'mlid' in extend:
            mlid = extend['mlid']
        if mlid:
            return self.get_fav_detail(pg=pg, mlid=mlid, order=order)
        else:
            return {}

    def get_fav_detail(self, pg, mlid, order):
        result = {}
        url = 'https://api.bilibili.com/x/v3/fav/resource/list?media_id=%s&order=%s&pn=%s&ps=10&platform=web&type=0' % (mlid, order, pg)
        rsp = self.fetch(url, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['medias']
            for vod in vodList:
                if vod.get('type') in [2] and vod.get('title') != '已失效视频':
                    aid = str(vod['id']).strip()
                    title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                            '"')
                    img = vod['cover'].strip()
                    remark = str(self.second_to_time(vod['duration'])).strip() + "　⊵ " + self.zh(
                        vod['cnt_info']['play']) + "　≣ " + self.zh(vod['cnt_info']['danmaku'])
                    videos.append({
                        "vod_id": aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def get_up_videos(self, mid, pg, order):
        result = {}
        url = 'https://api.bilibili.com/x/space/arc/search?mid={0}&pn={1}&order={2}&ps=10'.format(mid, pg, order)
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] == 0:
            videos = []
            vodList = jo['data']['list']['vlist']
            for vod in vodList:
                aid = str(vod['aid']).strip()
                title = vod['title'].strip().replace("<em class=\"keyword\">", "").replace("</em>", "")
                img = vod['pic'].strip()
                remark = str(self.second_to_time(self.str2sec(vod['length']))).strip() + "　⊵ " + self.zh(
                    vod['play']) + "　≣ " + self.zh(vod['video_review'])
                videos.append({
                    "vod_id": aid,
                    "vod_name": title,
                    "vod_pic": self.format_img(img),
                    "vod_remarks": remark
                })
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = 9999
            result['limit'] = 90
            result['total'] = 999999
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        if len(self.cookies) <= 0:
            self.getCookie()
        if tid == "动态":
            mid = '0'
            order = 'pubdate'
            if 'mid' in extend:
                mid = extend['mid']
            if 'order' in extend:
                order = extend['order']
            return self.get_dynamic(pg=pg, mid=mid, order=order)
        elif tid == "热门":
            return self.get_hot(pg=pg)
        elif tid == '推荐':
            return self.get_rcmd(pg=pg)
        elif tid == "排行榜":
            tid = '0'
            if 'tid' in extend:
                tid = extend['tid']
            return self.get_rank(tid=tid, pg=pg)
        elif tid == "发现":
            tid = '每周必看'
            if 'tid' in extend:
                tid = extend['tid']
            return self.get_found(tid=tid, pg=pg)
        elif tid == '频道':
            order = 'hot'
            cid = random.choice(self.channel_list_lite)
            if 'order' in extend:
                order = extend['order']
            if 'cid' in extend:
                cid = extend['cid']
            return self.get_channel(pg=pg, cid=cid, extend=extend, order=order)

        elif tid == "每周必看":
            return self.get_found(tid="每周必看", pg=pg)
        elif tid == "入站必刷":
            return self.get_found(tid="入站必刷", pg=pg)
        elif tid in ("1", "3", "129", "4", "119", "36", "188", "234", "160", "211", "217", "223", "155", "5", "181"):
            return self.get_rank(tid=tid, pg=pg)
        elif tid == '历史记录':
            sort = '历史记录'
            if 'sort' in extend:
                sort = extend['sort']
            if sort == '稍后再看':
                return self.get_toview(pg=pg)
            return self.get_history(pg=pg)
        elif tid == "我的收藏":
            order = 'mtime'
            if 'order' in extend:
                order = extend['order']
            return self.get_fav(pg=pg, order=order, extend=extend)

        else:
            duration_diff = '0'
            if 'duration' in extend:
                duration_diff = extend['duration']
            order = 'totalrank'
            if 'order' in extend:
                order = extend['order']
            url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={0}&page={1}&duration={2}&order={3}&page_size=10'.format(tid, pg, duration_diff, order)
            rsp = self.fetch(url, cookies=self.cookies)
            content = rsp.text
            jo = json.loads(content)
            if jo.get('code') == 0:
                videos = []
                vodList = jo['data']['result']
                for vod in vodList:
                    aid = str(vod['aid']).strip()
                    title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                            '"')
                    img = 'https:' + vod['pic'].strip()
                    remark = str(self.second_to_time(self.str2sec(vod['duration']))).strip() + "　⊵ " + self.zh(
                        vod['play']) + "　≣ " + self.zh(vod['danmaku'])

                    videos.append({
                        "vod_id": aid,
                        "vod_name": title,
                        "vod_pic": self.format_img(img),
                        "vod_remarks": remark
                    })
                result['list'] = videos
                result['page'] = pg
                result['pagecount'] = 9999
                result['limit'] = 90
                result['total'] = 999999
        return result

    def cleanSpace(self, str):
        return str.replace('\n', '').replace('\t', '').replace('\r', '').replace(' ', '')

    up_mid = ''

    def detailContent(self, array):
        aid = array[0]
        if not aid.isdigit():
            return self.ysContent(array)
        url = "https://api.bilibili.com/x/web-interface/view?aid={0}".format(aid)
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        jRoot = json.loads(rsp.text)
        jo = jRoot['data']
        if 'redirect_url' in jo:
            if 'bangumi' in jo['redirect_url']:
                redirect_url = str(jo['redirect_url']).strip()
                ep_id = redirect_url.split(r"/")[-1]
                ep_id = ep_id.split(r"?")[0]
                new_array = []
                for i in array:
                    new_array.append(i)
                new_array[0] = ep_id
                return self.ysContent(new_array)
        self.up_mid = str(jo['owner']['mid'])
        title = jo['title'].replace("<em class=\"keyword\">", "").replace("</em>", "")
        uname = jo['owner']['name']
        if uname not in title:
            title = '[' + uname + "]" + title
        img = jo['pic']
        desc = jo['desc']
        typeName = jo['tname']
        date = time.strftime("%Y%m%d", time.localtime(jo['pubdate']))  # 投稿时间本地年月日表示
        stat = jo['stat']
        status = "播放: " + self.zh(stat['view']) + "　弹幕: " + self.zh(stat['danmaku']) + "　点赞: " + self.zh(
            stat['like']) + "　收藏: " + self.zh(stat['favorite']) + "　投币: " + self.zh(stat['coin'])
        remark = str(jo['duration']).strip()
        vod = {
            "vod_id": aid,
            "vod_name": title,
            "vod_pic": self.format_img(img),
            "type_name": typeName,
            "vod_year": date,
            "vod_area": "bilidanmu",
            "vod_remarks": remark,  # 不会显示
            'vod_tags': 'mv',  # 不会显示
            "vod_actor": status,
            "vod_director": jo['owner']['name'],
            "vod_content": desc,
            'vod_play_from': '视频分集'
        }
        ja = jo['pages']
        playUrl = ''
        for tmpJo in ja:
            cid = tmpJo['cid']
            part = tmpJo['part'].replace("#", "﹟").replace("$", "﹩")
            playUrl = playUrl + '{0}${1}_{2}#'.format(part, aid, cid)
        vod['vod_play_url'] = playUrl

        if 'ugc_season' in jRoot['data']:
            season_title = jRoot['data']['ugc_season']['title'].replace("#", "﹟").replace("$", "﹩")
            sections = jRoot['data']['ugc_season']['sections']
            sec_len = len(sections)
            for section in sections:
                episodes = section['episodes']
                playUrl = ''
                for episode in episodes:
                    aid = episode['aid']
                    cid = episode['cid']
                    ep_title = episode['title'].replace("#", "﹟").replace("$", "﹩")
                    playUrl = playUrl + '{0}${1}_{2}#'.format(ep_title, aid, cid)
                if sec_len > 1:
                    sec_title = season_title + section['title'].replace("#", "﹟").replace("$", "﹩")
                else:
                    sec_title = season_title
                vod['vod_play_from'] += '$$$' + sec_title
                vod['vod_play_url'] += '$$$' + playUrl
        url2 = 'https://api.bilibili.com/x/web-interface/archive/related?aid={0}'.format(aid)
        rsp2 = self.fetch(url2, headers=self.header, cookies=self.cookies)
        jRoot2 = json.loads(rsp2.text)
        if jRoot2['code'] == 0:
            jo2 = jRoot2['data']
            related_playUrl = ''
            for related in jo2:
                aid = related['aid']
                cid = related['cid']
                related_title = related['title'].replace("#", "﹟").replace("$", "﹩")
                related_playUrl = related_playUrl + '{0}${1}_{2}#'.format(related_title, aid, cid)
            vod['vod_play_from'] += '$$$' + "相关推荐"
            vod['vod_play_url'] += '$$$' + related_playUrl

        result = {'list': [vod]}
        return result

    con = threading.Condition()

    def get_season(self, n, nList, fromList, urlList, season_id, season_title):
        url = 'https://api.bilibili.com/pgc/view/web/season?season_id={0}'.format(season_id)
        try:
            rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
            season = json.loads(rsp.text)
        except:
            with self.con:
                nList.remove(n)
                self.con.notify_all()
            return
        episode = season['result']['episodes']
        if len(episode) == 0:
            with self.con:
                nList.remove(n)
                self.con.notify_all()
            return
        playUrl = ''
        for tmpJo in episode:
            aid = tmpJo['aid']
            cid = tmpJo['cid']
            part = tmpJo['title'].replace("#", "﹟").replace("$", "﹩")
            if tmpJo['badge'] != '':
                part += ' 【' + tmpJo['badge'] + '】'
            part += tmpJo['long_title'].replace("#", "﹟").replace("$", "﹩")
            playUrl += '{0}${1}_{2}_bangumi#'.format(part, aid, cid)
        with self.con:
            while True:
                if n == nList[0]:
                    fromList.append(season_title)
                    urlList.append(playUrl)
                    nList.remove(n)
                    self.con.notify_all()
                    break
                else:
                    self.con.wait()

    def ysContent(self, array):
        aid = array[0]
        if 'ep' in aid:
            aid = 'ep_id=' + aid.replace('ep', '')
        elif 'ss' in aid:
            aid = 'season_id=' + aid.replace('ss', '')
        else:
            aid = 'season_id=' + aid
        url = "https://api.bilibili.com/pgc/view/web/season?{0}".format(aid)
        rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
        jRoot = json.loads(rsp.text)
        jo = jRoot['result']
        id = jo['season_id']
        title = jo['title']
        s_title = jo['season_title']
        img = jo['cover']
        typeName = jo['share_sub_title']
        date = jo['publish']['pub_time'][0:4]
        dec = jo['evaluate']
        remark = jo['new_ep']['desc']
        stat = jo['stat']
        status = "弹幕: " + self.zh(stat['danmakus']) + "　点赞: " + self.zh(stat['likes']) + "　投币: " + self.zh(
            stat['coins']) + "　追番追剧: " + self.zh(stat['favorites'])
        if 'rating' in jo:
            score = "评分: " + str(jo['rating']['score']) + '　' + jo['subtitle']
        else:
            score = "暂无评分" + '　' + jo['subtitle']
        vod = {
            "vod_id": id,
            "vod_name": title,
            "vod_pic": self.format_img(img),
            "type_name": typeName,
            "vod_year": date,
            "vod_area": "bilidanmu",
            "vod_remarks": remark,
            "vod_actor": status,
            "vod_director": score,
            "vod_content": dec
        }
        playUrl = ''
        for tmpJo in jo['episodes']:
            aid = tmpJo['aid']
            cid = tmpJo['cid']
            part = tmpJo['title'].replace("#", "﹟").replace("$", "﹩")
            if tmpJo['badge'] != '':
                part += '【' + tmpJo['badge'] + '】'
            part += tmpJo['long_title'].replace("#", "﹟").replace("$", "﹩")
            playUrl += '{0}${1}_{2}_bangumi#'.format(part, aid, cid)

        fromList = []
        urlList = []
        if playUrl != '':
            fromList.append(s_title)
            urlList.append(playUrl)
        nList = []
        if len(jo['seasons']) > 1:
            n = 0
            for season in jo['seasons']:
                season_id = season['season_id']
                season_title = season['season_title']
                if season_id == id and len(fromList) > 0:
                    isHere = fromList.index(s_title)
                    fromList[isHere] = season_title
                    continue
                n += 1
                nList.append(n)
                t = threading.Thread(target=self.get_season, args=(n, nList, fromList, urlList, season_id, season_title, ))
                t.start()

        while True:
            _count = threading.active_count()
            # 计算线程数，不出结果就调大，结果少了就调小
            if _count <= 2:
                break

        vod['vod_play_from'] = '$$$'.join(fromList)
        vod['vod_play_url'] = '$$$'.join(urlList)

        result = {'list': [vod]}
        return result

    def searchContent(self, key, quick):
        url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={0}&page=1&page_size=20'.format(
            key)
        rsp = self.fetch(url, cookies=self.cookies, headers=self.header)
        content = rsp.text
        jo = json.loads(content)
        if jo['code'] != 0:
            rspRetry = self.fetch(url, cookies=self.cookies, headers=self.header)
            content = rspRetry.text
        jo = json.loads(content)
        videos = []
        vodList = jo['data']['result']
        for vod in vodList:
            aid = str(vod['aid']).strip()
            title = vod['title'].replace("<em class=\"keyword\">", "").replace("</em>", "").replace("&quot;",
                                                                                                    '"') + '[' + key + ']'
            img = 'https:' + vod['pic'].strip()
            remark = str(self.second_to_time(self.str2sec(vod['duration']))).strip()
            videos.append({
                "vod_id": aid,
                "vod_name": title,
                "vod_pic": self.format_img(img),
                "vod_remarks": remark
            })
        result = {
            'list': videos
        }
        return result

    def playerContent(self, flag, id, vipFlags):
        if len(self.cookies) <= 0:
            self.getCookie()
        result = {}
        url = ''
        ids = id.split("_")
        if len(ids) < 2:
            return result
        elif len(ids) >= 2:
            aid = ids[0]
            cid = ids[1]
            if cid == 'cid':
                url = "https://api.bilibili.com/x/web-interface/view?aid=%s" % str(aid)
                rsp = self.fetch(url, headers=self.header, cookies=self.cookies)
                jRoot = json.loads(rsp.text)
                cid = jRoot['data']['cid']
            url = 'https://api.bilibili.com:443/x/player/playurl?avid={0}&cid={1}&qn=116'.format(aid, cid)
            if 'bangumi' in ids:
                url = 'https://api.bilibili.com/pgc/player/web/playurl?aid={0}&cid={1}&qn=116'.format(aid, cid)
            self.post_history(aid, cid)
        rsp = self.fetch(url, cookies=self.cookies, headers=self.header)
        jRoot = json.loads(rsp.text)
        if jRoot['code'] == 0:
            if 'data' in jRoot:
                jo = jRoot['data']
            elif 'result' in jRoot:
                jo = jRoot['result']
            else:
                return result
        else:
            return result
        if jo['quality'] == 16:
            url = 'https://api.bilibili.com/x/player/playurl?avid={0}&cid={1}&fnver=0&fnval=17&fourk=1&qn=120'.format(
                ids[0], ids[1])
            rsp = self.fetch(url, cookies=self.cookies, headers=self.header)
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
            "Referer": "https://www.bilibili.com",
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
        result["contentType"] = 'video/x-flv'
        return result

    config = {
        "player": {},
        "filter": {
            "动态": [{"key": "mid", "name": "最近更新的UP主",
                    "value": []},
                   {"key": "order", "name": "个人动态排序",
                    "value": [{"n": "最新发布", "v": "pubdate"}, {"n": "最多播放", "v": "click"},
                              {"n": "最多收藏", "v": "stow"}]}, ],
            "排行榜": [{"key": "tid", "name": "分区",
                     "value": [{"n": "动画", "v": "1"}, {"n": "音乐", "v": "3"},
                               {"n": "舞蹈", "v": "129"}, {"n": "游戏", "v": "4"},
                               {"n": "鬼畜", "v": "119"}, {"n": "知识", "v": "36"},
                               {"n": "科技", "v": "188"}, {"n": "运动", "v": "234"},
                               {"n": "生活", "v": "160"}, {"n": "美食", "v": "211"},
                               {"n": "动物", "v": "217"}, {"n": "汽车", "v": "223"},
                               {"n": "时尚", "v": "155"}, {"n": "娱乐", "v": "5"},
                               {"n": "影视", "v": "181"}, ]}, ],
            "发现": [{"key": "tid", "name": "分类",
                    "value": [{"n": "每周必看", "v": "每周必看"}, {"n": "入站必刷", "v": "入站必刷"},
                              {"n": "原创", "v": "原创"}, {"n": "新人", "v": "新人"}, ]}, ],
            "频道": [{"key": "cid", "name": "分类",
                    "value": []},
                   {"key": "order", "name": "排序",
                    "value": [{"n": "近期热门", "v": "hot"}, {"n": "月播放量", "v": "view"},
                              {"n": "最新投稿", "v": "new"}, {"n": "频道精选", "v": "featured"}, ]}, ],
            "历史记录": [{"key": "sort", "name": "分类",
                      "value": [{"n": "历史记录", "v": "历史记录"}, {"n": "稍后再看", "v": "稍后再看"}]}, ],
            "我的收藏": [{"key": "mlid", "name": "分区",
                      "value": []},
                     {"key": "order", "name": "排序",
                      "value": [{"n": "收藏时间", "v": "mtime"}, {"n": "播放量", "v": "view"},
                                {"n": "投稿时间", "v": "pubtime"}]}, ],
        }
    }
    header = {
        "Referer": "https://www.bilibili.com",
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    }

    def localProxy(self, param):

        return [200, "video/MP2T", action, ""]
