import os
import json
import time
import logging
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

# 配置
BASE_URL = "https://www.ece8.com"
LIST_PAGE = "https://www.ece8.com/show/zongyi.html"  # 示例：综艺列表页
HEADERS = {"User-Agent": UserAgent().random}
TIMEOUT = 10
OUTPUT_FILE = "movies_data.json"

# 日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_page(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.encoding = 'utf-8'
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        logger.error(f"获取页面失败 {url}: {e}")
        return None

def parse_list_page(html):
    """从列表页提取所有 /movie/xxx.html 链接"""
    soup = BeautifulSoup(html, 'html.parser')
    links = []
    for a in soup.select('#dataList .public-list-exp'):
        href = a.get('href')
        if href and href.startswith('/movie/'):
            full_url = urljoin(BASE_URL, href)
            links.append(full_url)
    logger.info(f"提取到 {len(links)} 个详情页链接")
    return links

def parse_detail_page(html, url):
    """解析详情页"""
    soup = BeautifulSoup(html, 'html.parser')

    # 基础信息
    title = soup.select_one('.slide-info-title')
    title = title.get_text(strip=True) if title else "未知"

    # 信息行解析（包含年份、地区、类型等）
    info_remarks = soup.select('.slide-info-remarks a')
    year = country = ""
    categories = []
    for tag in info_remarks:
        text = tag.get_text(strip=True)
        href = tag.get('href', '')
        if '/search/year/' in href:
            year = text
        elif '/search/未知/' in href or (text and any(c in text for c in ['国', '美', '韩', '日', '港', '台'])):
            country = text
        else:
            categories.append(text)

    # 备注（状态）
    status = ""
    for div in soup.select('.slide-info'):
        if '备注' in div.get_text():
            status = div.get_text().replace('备注 :', '').strip()
            break

    # 导演、演员
    directors = []
    actors = []
    for div in soup.select('.slide-info'):
        text = div.get_text()
        if '导演 :' in text:
            links = div.select('a')
            directors = [a.get_text(strip=True) for a in links]
        elif '演员 :' in text:
            links = div.select('a')
            actors = [a.get_text(strip=True) for a in links]

    # 更新时间
    update_time = ""
    for div in soup.select('.slide-info'):
        if '更新 :' in div.get_text():
            update_time = div.get_text().replace('更新 :', '').strip()
            break

    # 简介
    description = ""
    desc_div = soup.select_one('#height_limit')
    if desc_div:
        description = desc_div.get_text(strip=True)

    # 海报
    poster = ""
    img_tag = soup.select_one('.detail-pic img')
    if img_tag:
        poster = img_tag.get('data-src') or img_tag.get('src')
        if poster and poster.startswith('//'):
            poster = 'https:' + poster
        elif poster and poster.startswith('/'):
            poster = urljoin(BASE_URL, poster)

    # 播放链接分组提取
    play_urls = {}
    tab_els = soup.select('.anthology-tab a')
    list_boxes = soup.select('.anthology-list-box')

    for tab, box in zip(tab_els, list_boxes):
        source_name = tab.get_text(strip=True)
        if '【' in source_name:
            # 清理如 “【全球①】” → “全球①”
            source_name = source_name.split('】')[0].replace('【', '') + '】'
        links = []
        for a in box.select('a'):
            href = a.get('href')
            if href:
                links.append(urljoin(BASE_URL, href))
        if links:
            play_urls[source_name] = links

    return {
        "title": title,
        "year": year,
        "country": country,
        "categories": categories,
        "director": directors,
        "actors": actors,
        "update_time": update_time,
        "status": status,
        "description": description,
        "poster": poster,
        "play_urls": play_urls,
        "detail_url": url
    }

def crawl():
    # 1. 获取列表页
    list_html = get_page(LIST_PAGE)
    if not list_html:
        logger.error("无法获取列表页")
        return

    # 2. 提取详情页链接（去重）
    detail_urls = list(set(parse_list_page(list_html)))
    if not detail_urls:
        logger.warning("未找到任何详情页链接")
        return

    # 3. 遍历详情页
    results = []
    for i, url in enumerate(detail_urls[:10], 1):  # 限制前10个测试（可取消）
        logger.info(f"({i}/{len(detail_urls)}) 正在抓取: {url}")
        html = get_page(url)
        if html:
            data = parse_detail_page(html, url)
            results.append(data)
        time.sleep(1)  # 避免过快请求

    # 4. 保存结果
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    logger.info(f"✅ 抓取完成，共 {len(results)} 条数据，已保存至 {OUTPUT_FILE}")

if __name__ == '__main__':
    crawl()
