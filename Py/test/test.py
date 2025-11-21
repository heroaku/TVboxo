# coding = utf-8
# !/usr/bin/python

"""

作者 丢丢喵 🚓 剧多多 jddzx.cc 完整抓取规则
✅ 自动绕过 /robot.php 人机验证
✅ 仅抓第一页（翻页无效）
✅ 正确进入二级页（/vod/xxx.html）
✅ 完整解析多线路（tabs + lists 一一对应）

"""

from urllib.parse import urljoin, quote
from base.spider import Spider
from bs4 import BeautifulSoup
import requests
import base64
import time
import re

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

    def encrypt(self, s, dummy='P'):
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
        full_url = urljoin(xurl, target_url)
        value = self.encrypt(full_url)
        token = self.encrypt("MTc2MzczNjk4MQ==")
        data = f"value={value}&token={token}"
        try:
            session.post(f"{xurl}/robot.php", data=data, timeout=10)
            time.sleep(1.2)
            return True
        except:
            return False

    def fetch_html(self, session, url):
        try:
            resp = session.get(url, headers=headerx, timeout=10)
            if "人机验证" in resp.text:
                if self.bypass_robot(session, url):
                    resp = session.get(url, headers=headerx, timeout=10)
                else:
                    return ""
            return resp.text
        except:
            return ""

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
        # ✅ 只抓第一页（翻页无效）
        url = f"{xurl}/type/{tid}.html"

        session = requests.Session()
        html = self.fetch_html(session, url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")
        videos = []

        for item in soup.select("a.module-poster-item.module-item"):
            href = item.get("href", "").strip()
            if not href.startswith("/vod/"):
                continue

            # ✅ 正确提取 vod_id
            vod_id = href.replace("/vod/", "").rstrip(".html")
            if not vod_id:
                continue

            title = item.select_one(".module-poster-item-title")
            img = item.select_one("img.lazy")
            note = item.select_one(".module-item-note")

            videos.append({
                "vod_id": vod_id,  # 传给二级页
                "vod_name": title.get_text(strip=True) if title else "",
                "vod_pic": img.get("data-original", "") if img else "",
                "vod_remarks": note.get_text(strip=True) if note else ""
            })

        return {
            "list": videos,
            "page": 1,
            "pagecount": 1,
            "limit": len(videos),
            "total": len(videos)
        }

    def detailContent(self, array):
        vod_id = array[0]
        detail_url = f"{xurl}/vod/{vod_id}.html"

        session = requests.Session()
        html = self.fetch_html(session, detail_url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")

        vod_name = soup.select_one("h1").get_text(strip=True) if soup.select_one("h1") else vod_id
        vod_pic = soup.select_one(".module-info-poster img").get("data-original", "") if soup.select_one(".module-info-poster img") else ""
        vod_content = soup.select_one(".module-info-introduction-content p").get_text(strip=True) if soup.select_one(".module-info-introduction-content p") else ""

        # ✅ 完整解析多线路
        tab_items = soup.select(".module-player-tab-item")
        play_lists = soup.select(".module-play-list")

        tabs = []
        urls = []
        for i in range(min(len(tab_items), len(play_lists))):
            tab_name = tab_items[i].get_text(strip=True)
            eps = []
            for a in play_lists[i].select("a"):
                ep_name = a.get_text(strip=True)
                ep_url = a.get("href", "").strip()
                if ep_name and ep_url:
                    eps.append(f"{ep_name}${ep_url}")
            if eps:
                tabs.append(tab_name)
                urls.append("#".join(eps))

        return {
            "list": [{
                "vod_id": vod_id,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
                "vod_content": vod_content,
                "vod_play_from": "$$$".join(tabs),
                "vod_play_url": "$$$".join(urls)
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
        # 搜索也只抓第一页
        search_url = f"{xurl}/vodsearch.html?wd={quote(key)}"
        session = requests.Session()
        html = self.fetch_html(session, search_url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")
        videos = []
        for item in soup.select("a.module-poster-item.module-item"):
            href = item.get("href", "").strip()
            if not href.startswith("/vod/"):
                continue
            vod_id = href.replace("/vod/", "").rstrip(".html")
            title = item.select_one(".module-poster-item-title")
            img = item.select_one("img.lazy")
            note = item.select_one(".module-item-note")

            videos.append({
                "vod_id": vod_id,
                "vod_name": title.get_text(strip=True) if title else "",
                "vod_pic": img.get("data-original", "") if img else "",
                "vod_remarks": note.get_text(strip=True) if note else ""
            })

        return {
            "list": videos,
            "page": 1,
            "pagecount": 1,
            "limit": len(videos),
            "total": len(videos)
        }

    def localProxy(self, params):
        return None
