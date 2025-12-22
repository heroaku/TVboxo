# -*- coding: utf-8 -*-
# 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
# 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import re,sys,json,urllib3
from base.spider import Spider
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class Spider(Spider):
    headers,timeout,ver,uas,parses,custom_parses,host,froms,detail,custom_first,category,cms = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'no-cache'
    },5,1,{},{},{},'','','','','',''

    def init(self, extend=''):
        ext = extend.strip()
        if ext.startswith('http'):
            host = ext
        else:
            arr = json.loads(ext)
            host = arr['host']
            self.ver = 2 if arr.get('ver') == 2 else self.ver
            cms = arr.get('cms', '').rstrip('/')
            if re.match(r'^https?:\/\/.*\/vod', cms):
                if '?' in cms:
                    cms += '&'
                else:
                    cms += '?'
                self.cms = cms
            self.froms = arr.get('from', '')
            self.custom_parses = arr.get('parse', {})
            self.custom_first = arr.get('custom_first', 0)
            self.category = arr.get('category', 1)
            ua = arr.get('ua')
            if ua:
                if isinstance(ua,str):
                    self.headers['User-Agent'] = ua
                elif isinstance(ua,dict):
                    self.uas = {'host': ua.get('host'), 'config': ua.get('config'), 'home': ua.get('home'),
                                'category': ua.get('category'),'search': ua.get('search'), 'parse': ua.get('parse'),
                                'player': ua.get('player')}
            self.timeout = arr.get('timeout', 5)
        if not re.match(r'^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:\d+)?(\/)?$', host):
            headers = self.headers.copy()
            custom_ua = self.uas.get('host')
            if custom_ua: headers['User-Agent'] = custom_ua
            host_ = self.fetch(host, headers=headers, verify=False, timeout=self.timeout).text
            try:
                host_ = json.loads(host_)['apiDomain']
            except json.JSONDecodeError:
                host_ = host_.strip()
            if host_.startswith('http'): host = host_
        self.host = host.rstrip('/')

    def homeContent(self, filter):
        if not self.host or self.category == 0: return None
        headers = self.headers.copy()
        custom_ua = self.uas.get('home')
        if custom_ua: headers['User-Agent'] = custom_ua
        if self.cms and not self.category == 2:
            class_url = self.cms.rstrip('&')
            class_url = class_url.replace('&ac=videolist','').replace('ac=videolist&','').replace('ac=videolist','')
            class_url = class_url.replace('ac=detail', 'ac=list')
            classes = self.fetch(f"{class_url}", headers=headers, verify=False, timeout=self.timeout).json()['class']
            data = self.fetch(f"{self.cms.strip('&')}", headers=headers, verify=False, timeout=self.timeout).json()
            data['class'] = classes
            if self.category == 2:
                for i in data.get('list',[]):
                    i['vod_id'] = f"msearch:{i['vod_id']}"
        else:
            response = self.fetch(f'{self.host}/api.php/Appfox/init', headers=headers, verify=False, timeout=self.timeout).json()
            classes = []
            for i in response['data']['type_list']:
                classes.append({'type_id': i['type_id'],'type_name': i['type_name']})
            data =  {'class': classes}
        return data

    def homeVideoContent(self):
        if not self.host or self.category == 0: return None
        if self.cms and not self.category == 2: return None
        headers = self.headers.copy()
        custom_ua = self.uas.get('homeVideo',self.uas.get('home'))
        if custom_ua: headers['User-Agent'] = custom_ua
        if self.ver == 2:
            response = self.fetch(f'{self.host}/api.php/appfox/nav', headers=headers, verify=False, timeout=self.timeout).json()
            navigationId = ''
            for i in response['data']:
                if isinstance(i,dict):
                    navigationId = i['navigationId']
                    break
            if not navigationId: return None
            path = f'nav_video?id={navigationId}'
        else:
            path = 'index'
        response = self.fetch(f'{self.host}/api.php/Appfox/{path}', headers=headers, verify=False, timeout=self.timeout).json()
        data = response['data']
        videos = []
        for i in data:
            for j in i.get('banner', []):
                videos.append(j)
            for k in i.get('categories', []):
                for l in k.get('videos',[]):
                    videos.append(l)
        if videos and self.category == 2:
            for i in videos:
                i['vod_id'] = f"msearch:{i['vod_id']}"
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        if not self.host: return None
        headers = self.headers.copy()
        category_ua = self.uas.get('category')
        if category_ua: headers['User-Agent'] = category_ua
        if self.cms and not self.category == 2:
            data =  self.fetch(f'{self.cms}pg={pg}&t={tid}', headers=headers, verify=False, timeout=self.timeout).json()
        else:
            response = self.fetch(f"{self.host}/api.php/Appfox/vodList?type_id={tid}&class=全部&area=全部&lang=全部&year=全部&sort=最新&page={pg}", headers=headers, verify=False, timeout=self.timeout).json()
            videos = []
            for i in response['data']['recommend_list']:
                videos.append(i)
            data =  {'list': videos}
        if self.category == 2:
            if isinstance(data, dict):
                for i in data.get('list'):
                    i['vod_id'] = f"msearch:{i['vod_id']}"
        return data

    def searchContent(self, key, quick, pg='1'):
        if not self.host: return None
        headers = self.headers.copy()
        search_ua = self.uas.get('search')
        if search_ua: headers['User-Agent'] = search_ua
        if self.cms:
            cms = self.cms
            if '?' in cms: cms = cms.split('?')[0] + '?'
            response = self.fetch(f'{cms}ac=detail&wd={key}', headers=headers, verify=False, timeout=self.timeout).json()
            self.detail = response['list']
        else:
            path = f"{self.host}/api.php/Appfox/vod?ac=detail&wd={key}"
            if self.froms: path += '&from=' + self.froms
            response = self.fetch(path, headers=headers, verify=False, timeout=self.timeout).json()
            self.detail = response['list']
        return response

    def detailContent(self, ids):
        headers = self.headers.copy()
        detail_ua = self.uas.get('detail',self.uas.get('search'))
        if detail_ua:
            headers['User-Agent'] = detail_ua
        video = next((i.copy() for i in self.detail if str(i['vod_id']) == str(ids[0])), None)
        if not video:
            if self.cms:
                cms = self.cms
                if '?' in cms: cms = cms.split('?')[0] + '?'
                response = self.fetch(f'{cms}ac=detail&ids={ids[0]}', headers=headers, verify=False, timeout=self.timeout).json()
                video = response.get('list')[0]
            else:
                detail_response = self.fetch(f"{self.host}/api.php/Appfox/vod?ac=detail&ids={ids[0]}", headers=headers, verify=False, timeout=self.timeout).json()
                video = detail_response.get('list')[0]
        if not video: return {'list': []}
        play_from = video['vod_play_from'].split('$$$')
        play_urls = video['vod_play_url'].split('$$$')
        try:
            headers = self.headers.copy()
            custom_ua = self.uas.get('config')
            if custom_ua: headers['User-Agent'] = custom_ua
            config_response = self.fetch(f"{self.host}/api.php/Appfox/config", headers=headers, verify=False, timeout=self.timeout).json()
            player_list = config_response.get('data', {}).get('playerList', [])
            jiexi_data_list = config_response.get('data', {}).get('jiexiDataList', [])
        except Exception:
            return {'list': [video]}
        player_map = {player['playerCode']: player for player in player_list}
        processed_play_urls = []
        for idx, play_code in enumerate(play_from):
            if play_code in player_map:
                player_info = player_map[play_code]
                if player_info['playerCode'] != player_info['playerName']:
                    play_from[idx] = f"{player_info['playerName']}\u2005({play_code})"
            if idx < len(play_urls):
                urls = play_urls[idx].split('#')
                processed_urls = []
                for url in urls:
                    parts = url.split('$')
                    if len(parts) >= 2:
                        parts[1] = f"{play_code}@{parts[1]}"
                        processed_urls.append('$'.join(parts))
                    else:
                        processed_urls.append(url)
                processed_play_urls.append('#'.join(processed_urls))
        video['vod_play_from'] = '$$$'.join(play_from)
        video['vod_play_url'] = '$$$'.join(processed_play_urls)
        self.parses = {p['playerCode']: p['url'] for p in jiexi_data_list if p.get('url', '').startswith('http')}
        return {'list': [video]}

    def playerContent(self, flag, id, vipflags):
        play_from, raw_url = id.split('@', 1)
        jx, parse, parsed = 0, 0, 0
        headers = self.headers.copy()
        parse_ua = self.uas.get('parse')
        if parse_ua: headers['User-Agent'] = parse_ua
        player_ua = self.uas.get('player','Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')
        url = raw_url
        parses_main = []
        if self.custom_first == 1:
            parses_main.append(self.custom_parses)
            parses_main.append(self.parses)
        else:
            parses_main.append(self.parses)
            parses_main.append(self.custom_parses)
        for parses2 in parses_main:
            if not parsed and not re.match(r'https?://.*\.(m3u8|mp4|flv|mkv)', url):
                for key, parsers in parses2.items():
                    if play_from not in key:
                        continue
                    if isinstance(parsers,list):
                        for parser in parsers:
                            if parser.startswith('parse:'):
                                url,jx,parse = parser.split('parse:')[1] + raw_url,0,1
                                break
                            try:
                                response = self.fetch(f"{parser}{raw_url}", headers=headers, verify=False, timeout=self.timeout).json()
                                if response.get('url', '').startswith('http'):
                                    url, parsed = response['url'], 1
                                    break
                            except Exception:
                                continue
                    else:
                        if parsers.startswith('parse:'):
                            url,jx,parse = parsers.split('parse:')[1] + raw_url,0,1
                            break
                        try:
                            response = self.fetch(f"{parsers}{raw_url}", headers=headers, verify=False, timeout=self.timeout).json()
                            if response.get('url', '').startswith('http'):
                                url, parsed = response['url'], 1
                                break
                        except Exception:
                            continue
                    if parsed or parse:
                        break
            if parsed or parse:
                break
        if not(re.match(r'https?:\/\/.*\.(m3u8|mp4|flv|mkv)', url) or parsed == 1):
            jx = 1
        return { 'jx': jx, 'parse': parse, 'url': url, 'header': {'User-Agent': player_ua}}

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
