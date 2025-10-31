# -*- coding: utf-8 -*-
# @Author  : Doubebly
# @Time    : 2025/1/19 22:00

import sys
import requests
from lxml import etree
import base64
import json
import re
from urllib import parse
sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
    def getName(self):
        return "QuickVod"

    def init(self, extend):
        self.home_url = 'https://www.quickvod.cc'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        }

    def getDependence(self):
        return []

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        return {
            'class': [
                {'type_id': '1', 'type_name': '电影'},
                {'type_id': '2', 'type_name': '剧集'},
                {'type_id': '4', 'type_name': '动漫'}
            ]
        }

    def homeVideoContent(self):
        data = self.get_data(self.home_url)
        return {'list': data, 'parse': 0, 'jx': 0}

    def categoryContent(self, cid, page, filter, ext):
        url = f'{self.home_url}/type/{cid}-{page}.html'
        data = self.get_data(url)
        return {'list': data, 'parse': 0, 'jx': 0}

    def detailContent(self, did):
        ids = did[0]
        video_list = []
        try:
            res = requests.get(f'{self.home_url}/video/{ids}.html', headers=self.headers)
            root = etree.HTML(res.text.encode('utf-8'))
            vod_play_from = root.xpath('//div[@class="stui-vodlist__head"]/h3/text()')[0]
            play_list = root.xpath('//ul[contains(@class, "stui-content__playlist")]/li')
            p_list = []
            for play in play_list:
                name = play.xpath('./a/text()')[0]
                url = play.xpath('./a/@href')[0]
                p_list.append(f'{name}${url}')
            video_list.append({
                'type_name': '',
                'vod_id': ids,
                'vod_name': '',
                'vod_remarks': '',
                'vod_year': '',
                'vod_area': '',
                'vod_actor': '',
                'vod_director': '沐辰_为爱发电',
                'vod_content': '',
                'vod_play_from': vod_play_from,
                'vod_play_url': '#'.join(p_list)
            })
            return {"list": video_list, 'parse': 0, 'jx': 0}
        except requests.RequestException as e:
            print(f"Error in detailContent: {e}")
            return {'list': [], 'msg': str(e)}

    def searchContent(self, key, quick, page='1'):
        if page != '1':
            return {'list': [], 'parse': 0, 'jx': 0}
        url = f'{self.home_url}/vodsearch/-------------.html'
        d = {
            'wd': key,
            'submit': '',
        }
        h = {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        }
        data = []
        try:
            res = requests.post(url, data=d, headers=h)
            root = etree.HTML(res.text.encode('utf-8'))
            data_list = root.xpath('//div[@class="stui-vodlist__box"]/a')
            for i in data_list:
                data.append({
                    'vod_id': i.xpath('./@href')[0].split('/')[-1].split('.')[0],
                    'vod_name': i.xpath('./@title')[0],
                    'vod_pic': i.xpath('./@data-original')[0],
                    'vod_remarks': i.xpath('./span[2]/text()')[0]
                })
            return {'list': data, 'parse': 0, 'jx': 0}
        except requests.RequestException as e:
            print(f"Error in searchContent: {e}")
            return {'list': [], 'parse': 0, 'jx': 0}

    def playerContent(self, flag, pid, vipFlags):
        play_url = 'https://gitee.com/dobebly/my_img/raw/c1977fa6134aefb8e5a34dabd731a4d186c84a4d/x.mp4'
        try:
            # 請求播放頁面
            res = requests.get(f'{self.home_url}{pid}', headers=self.headers)
            res.encoding = 'utf-8'
            print(f"播放頁面響應: {res.status_code}, 前100字: {res.text[:100]}")
            
            # 提取加密的URL
            urls = re.findall(r'},\"url\":\"(.*?)\",\"url_next\"', res.text)
            print(f"提取到的URL: {urls}")
            if len(urls) == 0:
                print("未提取到URL，返回默認播放地址")
                return {'url': play_url, 'parse': 0, 'jx': 0}
            d = urls[0]
            
            # 發送API請求
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'origin': 'https://www.quickvod.cc'
            }
            data = {
                'vid': d,
            }
            response = requests.post('https://www.quickvod.cc/qvod/api.php', headers=headers, data=data)
            print(f"API響應碼: {response.status_code}, 內容: {response.text}")
            
            if response.status_code == 200:
                en_url = response.json()['data']['url']
                print(f"加密URL: {en_url}")
                play_url = self.de_url(en_url)
                print(f"解密後的播放URL: {play_url}")
                host = parse.urlparse(play_url).netloc
                h = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Host': host,
                }
                return {'url': play_url, "header": h, 'parse': 0, 'jx': 0}
            return {'url': play_url, 'parse': 0, 'jx': 0}
        except requests.RequestException as e:
            print(f"請求異常: {e}")
            return {'url': play_url, 'parse': 0, 'jx': 0}
        except Exception as e:
            print(f"其他異常: {e}")
            return {'url': play_url, 'parse': 0, 'jx': 0}

    def localProxy(self, params):
        pass

    def destroy(self):
        return '正在Destroy'

    def get_data(self, url):
        data = []
        try:
            res = requests.get(url, headers=self.headers, timeout=5)
            res.raise_for_status()
            c = res.text
            root = etree.HTML(c.encode('utf-8'))
            data_list = root.xpath('//div[@class="stui-vodlist__box"]/a')
            for i in data_list:
                vod_id = i.xpath('./@href')
                vod_name = i.xpath('./@title')
                vod_pic = i.xpath('./@data-original')
                vod_remarks = i.xpath('./span[2]/text()')
                if vod_id and vod_name and vod_pic and vod_remarks:
                    data.append({
                        'vod_id': vod_id[0].split('/')[-1].split('.')[0],
                        'vod_name': vod_name[0],
                        'vod_pic': vod_pic[0],
                        'vod_remarks': vod_remarks[0]
                    })
            return data
        except requests.RequestException as e:
            print(f"Error in get_data: {e}")
            return data
        except Exception as e:
            print(f"Error in get_data: {e}")
            return data

    def b64decode(self, original_string):
        padding_needed = len(original_string) % 4
        if padding_needed:
            original_string += '=' * (4 - padding_needed)
        decoded_bytes = base64.b64decode(original_string)
        decoded_string = decoded_bytes.decode('utf-8', errors='ignore')
        return decoded_string

    def custom_str_decode(self, encoded_string):
        key = '098f6bcd4621d373cade4e832627b4f6'
        _len = len(key)
        code = ''
        de_base64 = self.b64decode(encoded_string)
        i = 0
        while True:
            if i >= len(de_base64):
                break
            k = i % 32
            code += chr(ord(de_base64[i]) ^ ord(key[k]))
            i += 1
        return self.b64decode(code)

    def de_url(self, d):
        a = self.custom_str_decode(d).split('/')
        a1 = a[0]
        a2 = a[1]
        a3 = a[2]
        a1 = json.loads(self.b64decode(a1))
        a2 = json.loads(self.b64decode(a2))
        a3 = self.b64decode(a3)
        s = ''
        b1 = a2
        b2 = a1
        d3 = list(a3)
        i = 0
        while True:
            if i >= len(d3):
                break
            c1 = d3[i]
            c2 = bool(re.match(r'^[a-zA-Z]+$', c1))
            c3 = True if c1 in b2 else False
            if c2 and c3:
                s += b2[b1.index(c1)]
            else:
                s += c1
            i += 1
        return s

if __name__ == "__main__":
    spider = Spider()
    spider.init("")

    # 測試首頁內容
    print("測試首頁內容:")
    home_content = spider.homeVideoContent()
    for item in home_content['list'][:3]:
        print(f"影片: {item['vod_name']}, ID: {item['vod_id']}")

    # 測試詳情頁與播放（假設使用一個已知的ID，例如從首頁獲取）
    if home_content['list']:
        test_id = home_content['list'][0]['vod_id']
        print(f"\n測試詳情頁 (ID: {test_id}):")
        detail_content = spider.detailContent([test_id])
        if detail_content['list']:
            vod = detail_content['list'][0]
            print(f"播放來源: {vod['vod_play_from']}")
            print(f"播放列表: {vod['vod_play_url'][:100]}...")

            # 測試播放URL（使用第一個播放鏈接）
            play_url = vod['vod_play_url'].split('#')[0].split('$')[1]
            print(f"\n測試播放URL (PID: {play_url}):")
            play_result = spider.playerContent("QuickVod", play_url, [])
            print(f"最終播放URL: {play_result['url']}")
