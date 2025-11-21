# coding = utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 内容均从互联网收集而来 仅供交流学习使用 版权归原创者所有 如侵犯了您的权益 请通知作者 将及时删除侵权内容
                    ====================Diudiumiao====================

"""

from urllib.parse import urljoin
from base.spider import Spider
from bs4 import BeautifulSoup
import requests
import base64
import json
import re
import time

# 全局配置
xurl = "https://www.jddzx.cc"
STATIC_CHARS = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN"

headerx = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

class Spider(Spider):
    def getName(self):
        return "剧多多"

    def init(self, extend=""):
        pass

    def isVideoFormat(self, url):
        return False

    def manualVideoCheck(self):
        pass

    def encrypt(self, s, dummy='P'):
        """复现前端 encrypt 函数"""
        result = ""
        for ch in s:
            pos = STATIC_CHARS.find(ch)
            if pos == -1:
                code = ch
            else:
                code = STATIC_CHARS[(pos + 3) % 62]
            result += dummy + code + dummy
        return base64.b64encode(result.encode()).decode()

    def bypass_robot(self, session, target_url):
        """执行人机验证"""
        full_url = urljoin(xurl, target_url)
        value = self.encrypt(full_url)
        token = self.encrypt("MTc2MzczNjk4MQ==")  # 固定值
        data = f"value={value}&token={token}"
        try:
            session.post(f"{xurl}/robot.php", data=data, timeout=10)
            time.sleep(1.2)
            return True
        except:
            return False

    def fetch_html(self, session, url):
        resp = session.get(url, headers=headerx, timeout=10)
        if "人机验证" in resp.text:
            if self.bypass_robot(session, url):
                resp = session.get(url, headers=headerx, timeout=10)
            else:
                return ""
        return resp.text

    def homeContent(self, filter):
        return {
            "class": [
                {"type_id": "dianying", "type_name": "电影"},
                {"type_id": "juji", "type_name": "剧集"},
                {"type_id": "dongman", "type_name": "动漫"},
                {"type_id": "zongyi", "type_name": "综艺"},
                {"type_id": "duanju", "type_name": "短剧"}
            ]
        }

    def homeVideoContent(self):
        return self.categoryContent("juji", "1", False, {})

    def categoryContent(self, tid, pg, filter, ext):
        if pg != "1":
            # 仅支持第一页（翻页无效/重复）
            pg = "1"

        url = f"{xurl}/type/{tid}.html"
        session = requests.Session()
        html = self.fetch_html(session, url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")
        videos = []
        items = soup.select("a.module-poster-item.module-item")

        for item in items:
            href = item.get("href", "").strip()
            if not href.startswith("/vod/"):
                continue
            title = item.select_one(".module-poster-item-title")
            img = item.select_one("img.lazy")
            note = item.select_one(".module-item-note")

            vod_id = href.lstrip("/").rstrip(".html")
            vod_name = title.get_text(strip=True) if title else ""
            vod_pic = img.get("data-original", "") if img else ""
            vod_remarks = note.get_text(strip=True) if note else ""

            videos.append({
                "vod_id": vod_id,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
                "vod_remarks": vod_remarks
            })

        return {
            "list": videos,
            "page": 1,
            "pagecount": 1,
            "limit": 30,
            "total": len(videos)
        }

    def detailContent(self, array):
        tid = array[0]
        detail_url = f"{xurl}/vod/{tid}.html"
        session = requests.Session()
        html = self.fetch_html(session, detail_url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")
        vod_name = soup.select_one("h1").get_text(strip=True) if soup.select_one("h1") else tid
        vod_pic = soup.select_one(".module-info-poster img").get("data-original", "") if soup.select_one(".module-info-poster img") else ""
        vod_content = soup.select_one(".module-info-introduction-content p").get_text(strip=True) if soup.select_one(".module-info-introduction-content p") else ""

        # 提取多线路
        tabs = soup.select(".module-player-tab-item")
        lists = soup.select(".module-play-list")

        vod_play_from = "$$$".join([t.get_text(strip=True) for t in tabs]) if tabs else "播放"
        vod_play_url = ""
        for lst in lists:
            urls = lst.select("a")
            line = "#".join([f"{a.get_text(strip=True)}${a.get('href', '')}" for a in urls])
            vod_play_url += line + "$$$"
        vod_play_url = vod_play_url.rstrip("$$$")

        return {
            "list": [{
                "vod_id": tid,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
                "vod_content": vod_content,
                "vod_play_from": vod_play_from,
                "vod_play_url": vod_play_url
            }]
        }

    def playerContent(self, flag, id, vipFlags):
        play_url = urljoin(xurl, id)
        return {
            "parse": 0,
            "playUrl": "",
            "url": play_url,
            "header": headerx
        }

    def searchContent(self, key, quick, pg="1"):
        # 搜索功能可选实现（如需）
        return {"list": []}

    def localProxy(self, params):
        return None
