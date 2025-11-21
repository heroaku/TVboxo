# coding = utf-8
# !/usr/bin/python

"""


"""

from urllib.parse import urljoin, quote
from base.spider import Spider
from bs4 import BeautifulSoup
import requests
import base64
import json
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
        token = self.encrypt("MTc2MzczNjk4MQ==")
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
        if not pg or pg == "1":
            url = f"{xurl}/type/{tid}.html"
        else:
            url = f"{xurl}/type/{tid}/page/{pg}.html"

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

        # 获取总页数（可选，若无法获取可设为999）
        total_pages = 999
        page_links = soup.select(".page-link[href*='/page/']")
        if page_links:
            try:
                nums = [int(re.search(r'/page/(\d+)', a.get("href", "")).group(1)) for a in page_links if re.search(r'/page/(\d+)', a.get("href", ""))]
                total_pages = max(nums) if nums else 999
            except:
                total_pages = 999

        return {
            "list": videos,
            "page": int(pg),
            "pagecount": total_pages,
            "limit": 30,
            "total": total_pages * 30
        }

    def detailContent(self, array):
        tid = array[0]
        detail_url = f"{xurl}/vod/{tid}.html"
        session = requests.Session()
        html = self.fetch_html(session, detail_url)
        if not html:
            return {"list": []}

        soup = BeautifulSoup(html, "html.parser")
        vod_name = soup.select_one("h1").get_text(strip=True) if soup.select_one("h1") else ""
        vod_pic = soup.select_one(".module-info-poster img").get("data-original", "") if soup.select_one(".module-info-poster img") else ""
        vod_content = soup.select_one(".module-info-introduction-content p").get_text(strip=True) if soup.select_one(".module-info-introduction-content p") else ""

        # 提取多线路（标签）
        tab_items = soup.select(".module-player-tab-item")
        tab_names = [t.get_text(strip=True) for t in tab_items] or ["播放"]

        # 提取播放列表（按线路分组）
        play_lists = soup.select(".module-play-list")
        play_urls = []
        for idx, lst in enumerate(play_lists):
            tab_name = tab_names[idx] if idx < len(tab_names) else f"线路{idx+1}"
            urls = lst.select("a")
            episodes = "#".join([f"{a.get_text(strip=True)}${a.get('href', '')}" for a in urls])
            play_urls.append(f"{tab_name}${episodes}")

        vod_play_from = "$$$".join(tab_names)
        vod_play_url = "$$$".join([part.split("$", 1)[1] if "$" in part else part for part in play_urls])

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
        if not pg or pg == "1":
            search_url = f"{xurl}/vodsearch.html?wd={quote(key)}"
        else:
            search_url = f"{xurl}/vodsearch/page/{pg}.html?wd={quote(key)}"

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

        # 搜索页总页数（可选）
        total_pages = 999
        page_links = soup.select(".page-link[href*='/page/']")
        if page_links:
            try:
                nums = [int(re.search(r'/page/(\d+)', a.get("href", "")).group(1)) for a in page_links if re.search(r'/page/(\d+)', a.get("href", ""))]
                total_pages = max(nums) if nums else 999
            except:
                total_pages = 999

        return {
            "list": videos,
            "page": int(pg),
            "pagecount": total_pages,
            "limit": 30,
            "total": total_pages * 30
        }

    def localProxy(self, params):
        return None
