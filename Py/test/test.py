# coding=utf-8
# !/usr/bin/python
# 嗷呜
import sys
from base64 import b64decode
sys.path.append('..')
from base.spider import Spider
import re
from bs4 import BeautifulSoup
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad


class Spider(Spider):
    def getName(self):
        return "可可"

    def init(self, extend=""):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def cleanText(self, src):
        clean = re.sub('[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]', '',
                       src)
        return clean

    def jsp(self, content):
        return BeautifulSoup(content, "html.parser")

    host = "https://www.kkys02.com"
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/94.0.4606.54 Safari/537.36"
    }
    phost="https://vres.jxlfl.cn"
    def homeContent(self, filter):
        result = {}
        data = self.fetch(self.host, headers=self.header)
        htmld = self.jsp(self.cleanText(data.text))
        list = htmld.select('.main ul[class="fs-margin menu"]')[1]
        self.hlist = htmld.find('div', class_='module-box module-v-box module-one-row-box')
        classes = []
        for li in list.find_all('li', class_='menu-item'):
            classes.append({
                'type_name': li.find('div', class_='menu-item-label').get_text(),
                'type_id': re.findall(r'\d+', li.a.get('href'))[0]
            })
        result['class'] = classes
        return result

    def homeVideoContent(self):
        videos = []
        for li in self.hlist.select('.module-box-inner .module-item'):
            id = li.a.get('href')
            name = li.find('div', class_='v-item-footer').find_all('div')[1].get_text(strip=True)
            pic = li.find_all('img')[-1].get('data-original')
            remark = li.find('div', class_='v-item-bottom').find_all('span')[1].get_text(strip=True)
            year = li.find('div', class_='v-item-top-left').get_text(strip=True)
            videos.append({
                "vod_id": id,
                "vod_name": name,
                "vod_pic": self.phost + pic,
                "vod_remarks": remark,
                "vod_year": year
            })
        result = {
            'list': videos
        }
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        url = f'{self.host}/show/{tid}-----3-{pg}.html'
        html = self.fetch(url, headers=self.header)
        data = self.jsp(self.cleanText(html.text))
        list = data.find('div', class_='module-box-inner')
        videos = []
        for li in list.select('.module-box-inner .module-item'):
            id = li.a.get('href')
            name = li.find('div', class_='v-item-footer').find_all('div')[1].get_text(strip=True)
            pic = li.find_all('img')[-1].get('data-original')
            remark = li.find('div', class_='v-item-bottom').find_all('span')[1].get_text(strip=True)
            year = li.find('div', class_='v-item-top-left').get_text(strip=True)
            videos.append({
                "vod_id": id,
                "vod_name": name,
                "vod_pic": self.phost + pic,
                "vod_remarks": remark,
                "vod_year": year
            })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        tid = ids[0]
        url = self.host + tid
        html = self.fetch(url, headers=self.header)
        data = (self.jsp(self.cleanText(html.text)))
        data1 = data.find('div', class_='detail-box fs-margin-section')
        data2 = data.find('div', id='detail-source-swiper')
        vod_play_from = []
        index = None
        for idx, li in enumerate(data2.find_all('span', class_='source-item-label', id=True), start=0):
            li_text = li.get_text(strip=True)
            if '4K' in li_text:
                index = idx
                continue
            vod_play_from.append(li_text)
        data3 = data.find_all('div', class_='episode-list')
        if index:
            del data3[index]
        vod_play_url = []
        for li in data3:
            dd = []
            for lii in li.find_all('a'):
                dd.append(lii.get_text(strip=True) + "$" + lii.get('href'))
            vod_play_url.append('#'.join(dd))

        vod = {
            "vod_name": data1.find('div', class_='detail-title').find_all('strong')[1].get_text(strip=True),
            "vod_content": data1.find('div', class_='detail-desc').get_text(strip=True),
            "vod_play_from": '$$$'.join(vod_play_from),
            "vod_play_url": '$$$'.join(vod_play_url)
        }
        result = {
            'list': [
                vod
            ]
        }
        return result

    # 未写搜索下面的可忽略
    def searchContent(self, key, quick, pg="1"):
        result = {}
        url = f'{self.host}/search?k={key}&page={pg}'
        html = self.fetch(url, headers=self.header)
        data = self.jsp(self.cleanText(html.text))
        list = data.find('div', class_='search-result-list fs-margin-section')
        videos = []
        for li in list.find_all('a', class_='search-result-item'):
            id = li.get('href')
            name = li.find('div', class_='search-result-item-main').find_all('div')[1].get_text(strip=True)
            pic = li.find_all('img')[-1].get('data-original')
            ddd = li.find('div', class_='tags').find_all('span')
            remark = ddd[-1].get_text(strip=True)
            year = ddd[0].get_text(strip=True)
            videos.append({
                "vod_id": id,
                "vod_name": name,
                "vod_pic": self.phost + pic,
                "vod_remarks": remark,
                "vod_year": year
            })

        result = {
            'list': videos,
            'pg': pg
        }
        return result

    def playerContent(self, flag, id, vipFlags):
        url = self.host + id
        html = self.fetch(url, headers=self.header)
        data = self.cleanText(html.text).strip()
        data1 = re.search(r"TMDPPPP = '(.*?)';", data)[1]

        def decrypt(encrypted_word):
            key = "FNF9aVQF!G*0ux@2hAigUeB3".encode('utf-8')
            encrypted_word_bytes = b64decode(encrypted_word)
            cipher = AES.new(key, AES.MODE_ECB)
            decrypted = unpad(cipher.decrypt(encrypted_word_bytes), AES.block_size)
            return decrypted.decode('utf-8')

        result = {}
        result["parse"] = 0
        result["url"] = decrypt(data1)
        result["header"] = self.header
        return result

    def localProxy(self, param):
        pass
