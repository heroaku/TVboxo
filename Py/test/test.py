# -*- coding: utf-8 -*-
# @Author  : Adapted for keke7.app
# @Time    : 2025/3/20

import sys
import requests
from bs4 import BeautifulSoup
import urllib.parse
import re
import json
sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
    def getName(self):
        return "可可影视"

    def init(self, extend):
        self.home_url = 'https://www.keke7.app'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Referer": "https://www.keke7.app/",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Connection": "keep-alive"
        }
        self.image_domain = "https://vres.wbadl.cn"

    def getDependence(self):
        return []

    def isVideoFormat(self, url):
        return False

    def manualVideoCheck(self):
        return False

    def homeContent(self, filter):
        result = {
            'class': [
                {'type_id': '1', 'type_name': '电影'},
                {'type_id': '2', 'type_name': '剧集'},
                {'type_id': '4', 'type_name': '综艺'},
                {'type_id': '3', 'type_name': '动漫'},
                {'type_id': '6', 'type_name': '短剧'}
            ],
            # 保留舊版的 filters（已省略）
        }
        return result

    def homeVideoContent(self):
        data = self.get_data(self.home_url)
        return {'list': data}

    def categoryContent(self, tid, pg, filter, extend):
        cate_id = extend.get('cateId', tid) if extend else tid
        class_filter = extend.get('class', '') if extend else ''
        area = extend.get('area', '') if extend else ''
        language = extend.get('language', '') if extend else ''
        year = extend.get('year', '') if extend else ''
        by = extend.get('by', '1') if extend else '1'
        class_filter = urllib.parse.quote(class_filter.encode('utf-8')) if class_filter else ''
        area = urllib.parse.quote(area.encode('utf-8')) if area else ''
        language = urllib.parse.quote(language.encode('utf-8')) if language else ''
        url = f'{self.home_url}/show/{cate_id}-{class_filter}-{area}-{language}-{year}-{by}-{pg}.html'
        data = self.get_data(url)
        return {'list': data}

    def detailContent(self, did):
        ids = did[0] if did else ''
        if not ids:
            return {'list': [], 'msg': 'No ID provided'}
        
        url = self.home_url + ids
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            if res.status_code != 200:
                return {'list': [], 'msg': f'HTTP Error: {res.status_code}'}
            
            soup = BeautifulSoup(res.content, 'html.parser', from_encoding='utf-8')
            
            source_items = soup.select('div.source-box span.source-item-label')
            vod_play_from = '$$$'.join([span.text.strip() for span in source_items]) if source_items else "未找到播放線路"
            print(f"Debug detailContent: 播放線路: {vod_play_from}")
            
            play_lists = soup.select('div.episode-list')
            print(f"Debug detailContent: 找到 {len(play_lists)} 個 episode-list")
            if not play_lists:
                vod_play_url = "未找到集數"
            else:
                vod_play_url = []
                source_count = len(source_items)
                for i, play_list in enumerate(play_lists[:source_count]):
                    episode_items = play_list.select('a')
                    print(f"Debug detailContent: 線路 {i} 找到 {len(episode_items)} 集")
                    if episode_items:
                        episode_list = []
                        for j, a in enumerate(episode_items):
                            name = a.text.strip()
                            ep_url = a['href']
                            ep_num = re.search(r'(\d+)', name)
                            ep_num = ep_num.group(1) if ep_num else str(j + 1)
                            formatted_name = f"第{int(ep_num)}集"
                            full_url = ep_url if ep_url.startswith('http') else f"{self.home_url}{ep_url}"
                            episode_list.append(f"{formatted_name}${full_url}")
                        vod_play_url.append('#'.join(episode_list))
                    else:
                        vod_play_url.append("未找到集數")
                vod_play_url = '$$$'.join(vod_play_url) if vod_play_url else "未找到播放地址"
                print(f"Debug detailContent: 播放 URL 示例: {vod_play_url[:100]}...")
            
            vod_name_elem = soup.select_one('h1') or soup.select_one('div.detail-title')
            vod_name = vod_name_elem.text.strip() if vod_name_elem else '未找到標題'
            vod_name = re.sub(r'[^\u4e00-\u9fa5a-zA-Z0-9\s]', '', vod_name)
            vod_name = re.sub(r'k+k+y+s+\d*\.c+o+m+', '', vod_name).strip()
            
            vod_content = soup.select_one('div.detail-desc')
            vod_content = vod_content.text.strip() if vod_content else ''
            
            tags = soup.select('div.detail-info div.detail-tags-item')
            vod_year = tags[0].text.strip() if tags else ''
            vod_area = tags[1].text.strip() if len(tags) > 1 else ''
            
            vod_actor = soup.find('div', string='演员:')
            vod_actor = vod_actor.find_next('div').text.strip().replace('\n', '').replace(' ', '') if vod_actor else ''
            
            vod_director = soup.find('div', string='导演:')
            vod_director = vod_director.find_next('div').text.strip() if vod_director else ''
            
            vod_remarks = soup.find('div', string='备注:')
            vod_remarks = vod_remarks.find_next('div').text.strip() if vod_remarks else ''
            
            type_name = '劇集' if '/detail/' in ids else ''
            
            video_list = [{
                'type_name': type_name,
                'vod_id': ids,
                'vod_name': vod_name,
                'vod_remarks': vod_remarks,
                'vod_year': vod_year,
                'vod_area': vod_area,
                'vod_actor': vod_actor,
                'vod_director': vod_director,
                'vod_content': vod_content,
                'vod_play_from': vod_play_from,
                'vod_play_url': vod_play_url
            }]
            return {"list": video_list, 'parse': 0, 'jx': 0}
        except Exception as e:
            print(f"Debug detailContent 異常: {str(e)}")
            return {'list': [], 'msg': str(e)}

    def searchContent(self, key, quick, pg='1'):
        url = f'{self.home_url}/search?k={urllib.parse.quote(key.encode("utf-8"))}&page={pg}'
        data = self.get_data(url, is_search=True)
        return {'list': data}

    def playerContent(self, flag, pid, vipFlags):
        url = self.home_url + pid
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(res.content, 'html.parser', from_encoding='utf-8')
            
            iframe = soup.select_one('iframe')
            if iframe and iframe.get('src'):
                iframe_url = iframe['src']
                print(f"Debug playerContent: 找到 iframe: {iframe_url}")
                if iframe_url.startswith('http'):
                    return {'url': iframe_url, 'header': '', 'parse': 1, 'jx': 0}
            
            script = soup.select_one('div.player-box script')
            if script:
                script_text = script.text
                match = re.search(r'url:\s*["\'](.*?)["\']', script_text)
                play_url = match.group(1) if match else ''
                print(f"Debug playerContent: 提取到的播放地址: {play_url}")
                if play_url and (play_url.endswith('.mp4') or play_url.endswith('.m3u8')):
                    return {'url': play_url, 'header': '', 'parse': 0, 'jx': 0}
                
                json_match = re.search(r'var\s+player_data\s*=\s*({.*?})', script_text, re.DOTALL)
                if json_match:
                    player_data = json.loads(json_match.group(1))
                    play_url = player_data.get('url', '')
                    print(f"Debug playerContent: player_data URL: {play_url}")
                    if play_url and (play_url.endswith('.mp4') or play_url.endswith('.m3u8')):
                        return {'url': play_url, 'header': '', 'parse': 0, 'jx': 0}
            
            print("Debug playerContent: 未找到有效播放地址，需解析")
            return {'url': url, 'header': '', 'parse': 1, 'jx': 0}
        except Exception as e:
            print(f"Debug playerContent 異常: {str(e)}")
            return {'url': url, 'header': '', 'parse': 1, 'jx': 0}

    def localProxy(self, params):
        return None

    def destroy(self):
        pass

    def get_data(self, url, is_search=False):
        data = []
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            if res.status_code != 200:
                print(f"Debug get_data: HTTP 錯誤 {res.status_code} at {url}")
                return data
            soup = BeautifulSoup(res.content, 'html.parser', from_encoding='utf-8')
            selector = 'div.search-list a.v-item' if is_search else 'a.v-item'
            items = soup.select(selector)
            print(f"Debug get_data: 找到 {len(items)} 個 v-item")
            for item in items:
                vod_id = item['href'] if 'href' in item.attrs else ''
                vod_name = item.select_one('div.v-item-title:not([style="display: none"])')
                vod_name = vod_name.text.strip() if vod_name else '未找到標題'
                
                # 結合新舊版圖片提取邏輯
                img_tags = item.select('div.v-item-cover img')
                vod_pic = ''
                if img_tags:
                    for img in img_tags:
                        vod_pic = img.get('data-original') or img.get('src') or img.get('data-src') or ''
                        print(f"Debug get_data: img 屬性 - src: {img.get('src')}, data-original: {img.get('data-original')}, data-src: {img.get('data-src')}")
                        if vod_pic and 'placeholder' not in vod_pic:
                            break
                    if vod_pic and not vod_pic.startswith('http'):
                        vod_pic = self.image_domain + vod_pic
                    if 'placeholder' in vod_pic:
                        cover = item.select_one('div.v-item-cover')
                        if cover and cover.get('style'):
                            bg_match = re.search(r'url\((.*?)\)', cover['style'])
                            vod_pic = bg_match.group(1) if bg_match else vod_pic
                
                vod_remarks = item.select_one('div.v-item-bottom span')
                vod_remarks = vod_remarks.text.strip() if vod_remarks else ''
                data.append({
                    'vod_id': vod_id,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'vod_remarks': vod_remarks
                })
            print(f"Debug get_data: 示例數據: {data[:1]}")
            return data
        except Exception as e:
            print(f"Debug get_data 異常: {str(e)}")
            return data

if __name__ == '__main__':
    spider = Spider()
    spider.init({})
    print("測試首頁影片")
    print(spider.homeVideoContent())
    print("測試分類內容")
    print(spider.categoryContent('2', '1', True, {'class': '剧情', 'year': '2024'}))
    print("測試詳情頁")
    print(spider.detailContent(['/detail/264550.html']))
    print("測試播放地址")
    print(spider.playerContent('超清', '/play/264550-32-1627975.html', []))
    print("測試搜索")
    print(spider.searchContent('似锦', False, '1'))
