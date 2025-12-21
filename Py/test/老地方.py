# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

from base.spider import Spider
import re,sys,time,uuid,hmac,urllib3,hashlib
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    host,player_host,dkey,player = 'https://app.laodifang.tv','https://www.laodifang.tv',{bs.decode('gbk') for bs in [b'\xc2\xd7\xc0\xed',b'\xb8\xa3\xc0\xfb',b'\xc7\xe9\xc9\xab']},{}

    def init(self, extend=''):
        pass

    def headers(self,path,json_type=1):
        timestamp = str(int(time.time()))
        random_uuid = str(uuid.uuid4()).replace('-', '')
        sign = self.hmac_sha256(f'PV-HMAC-SHA256\n{timestamp}\nPOST\n{path}\n\nUNSIGNED-PAYLOAD\n{random_uuid}')
        headers = {
            'User-Agent': 'okhttp/4.11.0',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json',
            'access-token': '',
            'authorization': f"PV-HMAC-SHA256 Credential=5gc4r3ic, SignedHeaders=host;content-type;x-pv-timestamp;x-pv-nonce, Signature={sign}",
            'x-pv-timestamp': timestamp,
            'x-pv-nonce': random_uuid
        }
        if json_type == 1: headers['content-type'] = 'application/json; charset=UTF-8'
        return headers

    def homeContent(self, filter):
        if not self.host: return None
        path = '/api/v1/type/list'
        response = self.post(f'{self.host}{path}', data='{}', headers=self.headers(path), verify=False).json()
        classes = []
        for item in response['data']:
            if isinstance(item, dict):
                type_name = item.get('typeName')
                if not(isinstance(type_name, str) and any(kw in type_name for kw in self.dkey)):
                    classes.append({'type_id': item['typeId'],'type_name': type_name})
        return {'class': classes}

    def homeVideoContent(self):
        path = '/api/v1/video/index'
        response = self.post(f'{self.host}{path}', data='{"isFilterAd":false}', headers=self.headers(path), verify=False).json()
        videos = []
        for i in response['data'].values():
            if isinstance(i,list):
                videos.extend(self.json2vods(i))
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        path = '/api/v1/video/list'
        response = self.post(f'{self.host}{path}', data=f'{{"area":"","claxx":"","lang":"","page":{pg},"pageSize":12,"sort":2,"typeId":{tid},"typeTopId":0,"year":"","isFilterAd":false}}', headers=self.headers(path), verify=False).json()
        return {'list': self.json2vods(response['data']['list']), 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        path = '/api/v1/video/search'
        response = self.post(f'{self.host}{path}', data=f'{{"keyWord":"{key}","isFilterAd":false}}', headers=self.headers(path), verify=False).json()
        videos = self.json2vods(response['data'])
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        path = '/api/v1/video/detail'
        response = self.post(f'{self.host}{path}', data=f'{{"videoId": {ids[0]}}}', headers=self.headers(path), verify=False).json()
        data = response['data']
        path2 = '/app/config.json'
        if not self.player:
            response2 = self.fetch(f'{self.player_host}{path2}', headers=self.headers(path2), verify=False).json()
            self.player = {k['code']: (k['name'], k['needParse']) for k in response2['data']['player']}
        type_name = data['vodClass']
        if isinstance(type_name, str) and any(kw in type_name for kw in self.dkey): return
        shows,play_urls = [],[]
        raw_shows = data['vodPlayFrom'].split('$$$')
        raw_urls_list = data['vodPlayUrl'].split('$$$')
        for show_code, urls_str in zip(raw_shows, raw_urls_list):
            name, need_parse = self.player.get(show_code, ('', 0))
            if name and name != show_code:
                formatted_show = f"{name}({show_code})"
            else:
                formatted_show = show_code
            urls = []
            for url_item in urls_str.split('#'):
                episode, url = url_item.split('$',1)
                urls.append(f"{episode}${show_code}@{int(need_parse)}@{url}")
            play_urls.append('#'.join(urls))
            shows.append(formatted_show)
        video = {
            'vod_id': data['vodId'],
            'vod_name': data['vodName'],
            'vod_pic': data['vodPic'],
            'vod_remarks': data['vodRemarks'],
            'vod_year': data['vodYear'],
            'vod_area': data['vodArea'],
            'vod_actor': data['vodActor'],
            'vod_director': data['vodDirector'],
            'vod_content': data['vodContent'],
            'vod_play_from': '$$$'.join(shows),
            'vod_play_url': '$$$'.join(play_urls),
            'type_name': data['vodClass']
        }
        return {'list': [video]}

    def playerContent(self, flag, video_id, vip_flags):
        play_from, need_parse, raw_url = video_id.split('@',2)
        jx,url = 0,''
        if need_parse == '1':
            try:
                path = '/api/v1/video/realPlayUrl'
                response = self.post(f'{self.host}{path}', data=f'{{"playerCode":"{play_from}","url":"{raw_url}"}}', headers=self.headers(path), verify=False).json()
                play_url = response['data']['playUrl']
                if play_url.startswith('http') and play_url != raw_url: url = play_url
            except Exception:
                pass
        if not url:
            url = raw_url
            if re.search(r'(?:www\.iqiyi|v\.qq|v\.youku|www\.mgtv|www\.bilibili)\.com', video_id):
                jx = 1
        return { 'jx': jx, 'parse': 0, 'url': url, 'header': {'User-Agent': 'okhttp/4.11.0','Accept-Encoding': 'gzip'}}

    def json2vods(self,arr):
        videos = []
        for i in arr:
            vod_class = i.get('vodClass')
            if not(isinstance(vod_class, str) and any(kw in vod_class for kw in self.dkey)):
                videos.append({
                    'vod_id': i['vodId'],
                    'vod_name': i['vodName'],
                    'vod_pic': i['vodPic'],
                    'vod_remarks': i['vodRemarks'],
                    'vod_year': i['vodYear']
                })
        return videos

    def hmac_sha256(self, data):
        key = "4ssnwkd3qoz4tuqoyeddhe65667qo4oc"
        return hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def localProxy(self, param):
        pass
