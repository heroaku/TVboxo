# gaze.run 影视源 for OK影视 / TVBox (DrPy2)
import re
import json
import time
from bs4 import BeautifulSoup

def init(cfg):
    pass

def homeContent(filter):
    # 首页分类（模拟 filter 页面的筛选项）
    classes = [
        {"type_id": "all", "type_name": "全部"},
        {"type_id": "1", "type_name": "电影"},
        {"type_id": "2", "type_name": "电视剧"},
        {"type_id": "bangumi", "type_name": "番剧"},
        {"type_id": "chinese_cartoon", "type_name": "国漫"},
    ]
    return {"class": classes}

def homeVideoContent():
    # 首页推荐（可选）
    return {"list": []}

def categoryContent(tid, pg, filter, extend):
    # gaze.run 的 filter 页面实际不分页，全部影视都在一页
    # 我们直接爬首页
    url = "https://gaze.run"
    resp = fetch(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    items = []
    for item in soup.select(".Movie-item"):
        a = item.select_one("a[href^='/play/']")
        if not a:
            continue
        mid = a.get("href").replace("/play/", "")
        title = a.get("title") or item.select_one(".rs-title").get_text(strip=True) if item.select_one(".rs-title") else "未知"
        img = item.select_one("img.mcoverimg")
        pic = img.get("data-src") or img.get("src") if img else ""
        items.append({
            "vod_id": mid,
            "vod_name": title,
            "vod_pic": pic,
            "vod_remarks": ""
        })
    return {"list": items}

def detailContent(ids):
    mid = ids[0]
    url = f"https://gaze.run/play/{mid}"
    resp = fetch(url)
    soup = BeautifulSoup(resp.text, "html.parser")

    # 提取标题
    title = soup.select_one("title")
    vod_name = title.get_text().replace(" - Gaze", "") if title else mid

    # 提取剧集列表
    episodes = []
    playbtns = soup.select("button.playbtn")
    for idx, btn in enumerate(playbtns):
        ep_index = idx + 1
        # 返回跳转链接（WebView 播放）
        play_url = f"{url}?episode={ep_index}"
        episodes.append(f"第{ep_index}集${play_url}")

    vod = {
        "vod_id": mid,
        "vod_name": vod_name,
        "vod_play_from": "Gaze",
        "vod_play_url": "#".join(episodes)
    }
    return {"list": [vod]}

def searchContent(key, quick):
    # 暂不支持搜索（可扩展）
    return {"list": []}

def playerContent(flag, id, vipFlags):
    # 不解析真实 M3U8，直接返回跳转链接（由播放器 WebView 打开）
    return {"parse": 0, "playUrl": "", "url": id}
