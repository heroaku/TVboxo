# -*- coding: utf-8 -*-
# @Author  : Doubebly
# @Time    : 2025/3/22 21:03
import json
import sys
import requests
from lxml import etree
from urllib.parse import urlencode
import time
from typing import Dict, List, Any, Optional
import logging

sys.path.append('..')
from base.spider import Spider

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("AiguaTV")


class Spider(Spider):
    """爱瓜TV视频爬虫 - 优化版本"""
    
    def __init__(self):
        super().__init__()
        self.session = None
        self._init_config()

    def _init_config(self):
        """初始化配置"""
        self.home_url = 'https://aigua8.com'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Referer": self.home_url,
        }
        self.image_domain = "https://vres.wbadl.cn"
        self.default_play_url = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4'
        
        # 请求配置
        self.timeout = 15
        self.max_retries = 3
        self.retry_delay = 1
        
        # 分类配置
        self.category_config = self._load_category_config()
        
        # 播放线路配置
        self.line_mapping = {
            '线路一': '1',
            '线路二': '16', 
            '线路三': '21'
        }

    def _load_category_config(self) -> Dict:
        """加载分类配置"""
        return {
            'class': [
                {'type_id': '2', 'type_name': '电视剧'},
                {'type_id': '1', 'type_name': '电影'},
                {'type_id': '3', 'type_name': '综艺'},
                {'type_id': '4', 'type_name': '动漫'},
                {'type_id': '32', 'type_name': '纪录片'}
            ],
            'filters': self._load_filter_config()
        }

    def _load_filter_config(self) -> Dict:
        """加载筛选器配置"""
        return {
            '1': self._get_movie_filters(),      # 电影
            '2': self._get_tv_filters(),         # 电视剧
            '3': self._get_variety_filters(),    # 综艺
            '4': self._get_anime_filters(),      # 动漫
            '32': self._get_documentary_filters() # 纪录片
        }

    def _get_common_filters(self) -> Dict:
        """获取通用筛选条件"""
        year_options = [
            {'n': '全部', 'v': '0'},
            {'n': '2025', 'v': '131'}, {'n': '2024', 'v': '130'}, {'n': '2023', 'v': '129'},
            {'n': '2022', 'v': '21'}, {'n': '2021', 'v': '22'}, {'n': '2020', 'v': '23'},
            {'n': '2019', 'v': '24'}, {'n': '2018', 'v': '25'}, {'n': '2017', 'v': '26'},
            {'n': '2016', 'v': '27'}, {'n': '2015', 'v': '28'}, {'n': '2014', 'v': '29'},
            {'n': '2013', 'v': '30'}, {'n': '2012', 'v': '31'}, {'n': '2011', 'v': '32'},
            {'n': '2010', 'v': '33'}, {'n': '2009', 'v': '34'}, {'n': '2008', 'v': '35'},
            {'n': '更早', 'v': '127'}
        ]
        
        area_options = [
            {'n': '全部', 'v': '0'}, {'n': '大陆', 'v': '18'}, {'n': '日本', 'v': '24'},
            {'n': '香港', 'v': '20'}, {'n': '韩国', 'v': '21'}, {'n': '台湾', 'v': '23'},
            {'n': '英国', 'v': '22'}, {'n': '东南亚', 'v': '29'}, {'n': '欧美', 'v': '19'},
            {'n': '其它', 'v': '30'}
        ]
        
        status_options = [
            {'n': '全部', 'v': '0'}, {'n': '完结', 'v': '1'}, {'n': '更新中', 'v': '2'}
        ]
        
        sort_options = [
            {'n': '添加时间', 'v': 'new'}, {'n': '人气高低', 'v': 'hot'}, {'n': '评分高低', 'v': 'score'}
        ]
        
        return {
            'year': year_options,
            'area': area_options,
            'status': status_options,
            'sort': sort_options
        }

    def _get_movie_filters(self) -> List[Dict]:
        """电影筛选条件"""
        common = self._get_common_filters()
        return [
            {
                'name': '剧情', 'key': 'class', 'value': [
                    {'n': '全部', 'v': '0'}, {'n': '魔幻', 'v': '179'}, {'n': '动作', 'v': '154'},
                    {'n': '科幻', 'v': '159'}, {'n': '惊悚', 'v': '156'}, {'n': '犯罪', 'v': '157'},
                    {'n': '剧情', 'v': '161'}, {'n': '悬疑', 'v': '160'}, {'n': '奇幻', 'v': '226'},
                    {'n': '爱情', 'v': '155'}, {'n': '战争', 'v': '164'}, {'n': '恐怖', 'v': '169'},
                    {'n': '喜剧', 'v': '153'}, {'n': '冒险', 'v': '280'}, {'n': '灾难', 'v': '281'},
                    {'n': '歌舞', 'v': '282'}, {'n': '动画', 'v': '283'}, {'n': '经典', 'v': '284'},
                    {'n': '同性', 'v': '285'}, {'n': '网络电影', 'v': '286'}, {'n': '其他', 'v': '178'}
                ]
            },
            {'name': '地区', 'key': 'area', 'value': common['area']},
            {'name': '年份', 'key': 'year', 'value': common['year']},
            {'name': '状态', 'key': 'status', 'value': common['status']},
            {'name': '排序', 'key': 'by', 'value': common['sort']}
        ]

    def _get_tv_filters(self) -> List[Dict]:
        """电视剧筛选条件"""
        common = self._get_common_filters()
        return [
            {
                'name': '剧情', 'key': 'class', 'value': [
                    {'n': '全部', 'v': '0'}, {'n': '短剧', 'v': '364'}, {'n': '偶像', 'v': '251'},
                    {'n': '爱情', 'v': '252'}, {'n': '言情', 'v': '253'}, {'n': '古装', 'v': '254'},
                    {'n': '历史', 'v': '255'}, {'n': '玄幻', 'v': '256'}, {'n': '谍战', 'v': '257'},
                    {'n': '历险', 'v': '258'}, {'n': '都市', 'v': '259'}, {'n': '科幻', 'v': '260'},
                    {'n': '军旅', 'v': '261'}, {'n': '喜剧', 'v': '262'}, {'n': '武侠', 'v': '263'},
                    {'n': '江湖', 'v': '264'}, {'n': '罪案', 'v': '265'}, {'n': '青春', 'v': '266'},
                    {'n': '家庭', 'v': '267'}, {'n': '战争', 'v': '268'}, {'n': '悬疑', 'v': '269'},
                    {'n': '穿越', 'v': '270'}, {'n': '宫廷', 'v': '271'}, {'n': '神话', 'v': '272'},
                    {'n': '商战', 'v': '273'}, {'n': '警匪', 'v': '274'}, {'n': '动作', 'v': '275'},
                    {'n': '惊悚', 'v': '276'}, {'n': '剧情', 'v': '277'}, {'n': '同性', 'v': '278'},
                    {'n': '奇幻', 'v': '279'}, {'n': '其他', 'v': '231'}
                ]
            },
            {'name': '地区', 'key': 'area', 'value': common['area']},
            {'name': '年份', 'key': 'year', 'value': common['year']},
            {'name': '状态', 'key': 'status', 'value': common['status']},
            {'name': '排序', 'key': 'by', 'value': common['sort']}
        ]

    def _get_variety_filters(self) -> List[Dict]:
        """综艺筛选条件"""
        common = self._get_common_filters()
        return [
            {
                'name': '类型', 'key': 'class', 'value': [
                    {'n': '全部', 'v': '0'}, {'n': '生活', 'v': '229'}, {'n': '脱口秀', 'v': '228'},
                    {'n': '真人秀', 'v': '227'}, {'n': '访谈', 'v': '168'}, {'n': '选秀', 'v': '287'},
                    {'n': '网综', 'v': '288'}, {'n': '搞笑', 'v': '289'}, {'n': '竞技', 'v': '290'},
                    {'n': '情感', 'v': '291'}, {'n': '演唱会', 'v': '292'}, {'n': '晚会', 'v': '293'},
                    {'n': '其他', 'v': '232'}
                ]
            },
            {'name': '地区', 'key': 'area', 'value': common['area']},
            {'name': '年份', 'key': 'year', 'value': common['year']},
            {'name': '状态', 'key': 'status', 'value': common['status']},
            {'name': '排序', 'key': 'by', 'value': common['sort']}
        ]

    def _get_anime_filters(self) -> List[Dict]:
        """动漫筛选条件"""
        common = self._get_common_filters()
        return [
            {
                'name': '类型', 'key': 'class', 'value': [
                    {'n': '全部', 'v': '0'}, {'n': '儿童', 'v': '363'}, {'n': '格斗', 'v': '167'},
                    {'n': '热血', 'v': '165'}, {'n': '机战', 'v': '166'}, {'n': '少女', 'v': '294'},
                    {'n': '竞技', 'v': '295'}, {'n': '科幻', 'v': '296'}, {'n': '爆笑', 'v': '297'},
                    {'n': '推理', 'v': '298'}, {'n': '魔幻', 'v': '299'}, {'n': '冒险', 'v': '300'},
                    {'n': '恋爱', 'v': '301'}, {'n': '校园', 'v': '302'}, {'n': '治愈', 'v': '303'},
                    {'n': '泡面', 'v': '304'}, {'n': '穿越', 'v': '305'}, {'n': '灵异', 'v': '306'},
                    {'n': '耽美', 'v': '307'}, {'n': '剧场版', 'v': '308'}, {'n': '其他', 'v': '170'}
                ]
            },
            {'name': '地区', 'key': 'area', 'value': common['area']},
            {'name': '年份', 'key': 'year', 'value': common['year']},
            {'name': '状态', 'key': 'status', 'value': common['status']},
            {'name': '排序', 'key': 'by', 'value': common['sort']}
        ]

    def _get_documentary_filters(self) -> List[Dict]:
        """纪录片筛选条件"""
        common = self._get_common_filters()
        return [
            {'name': '类型', 'key': 'class', 'value': [{'n': '全部', 'v': '0'}]},
            {'name': '地区', 'key': 'area', 'value': [{'n': '全部', 'v': '0'}]},
            {'name': '年份', 'key': 'year', 'value': common['year']},
            {'name': '状态', 'key': 'status', 'value': common['status']},
            {'name': '排序', 'key': 'by', 'value': common['sort']}
        ]

    def getName(self):
        return "爱瓜TV"

    def init(self, extend):
        """初始化爬虫"""
        try:
            # 创建会话
            self.session = requests.Session()
            self.session.headers.update(self.headers)
            logger.info("爱瓜TV爬虫初始化成功")
        except Exception as e:
            logger.error(f"爬虫初始化失败: {e}")

    def getDependence(self):
        return []

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def _make_request(self, url: str, method: str = 'GET', **kwargs) -> Optional[requests.Response]:
        """统一的请求方法"""
        for attempt in range(self.max_retries):
            try:
                if method.upper() == 'GET':
                    response = self.session.get(url, timeout=self.timeout, **kwargs)
                else:
                    response = self.session.post(url, timeout=self.timeout, **kwargs)
                
                response.raise_for_status()
                return response
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"第{attempt + 1}次请求失败: {e}")
                if attempt == self.max_retries - 1:
                    raise
                time.sleep(self.retry_delay)
        return None

    def homeContent(self, filter):
        """首页内容"""
        try:
            result = {
                'class': self.category_config['class'],
                'filters': self.category_config['filters']
            }
            logger.debug("首页内容获取成功")
            return result
        except Exception as e:
            logger.error(f"首页内容获取失败: {e}")
            return {'class': [], 'filters': {}}

    def homeVideoContent(self):
        """首页视频内容"""
        try:
            response = self._make_request(self.home_url)
            if not response:
                return {'list': [], 'parse': 0, 'jx': 0}
                
            response.encoding = 'utf-8'
            root = etree.HTML(response.text)
            
            data_list = root.xpath('//div[@class="video-box-new"]/div[@class="Movie-list"]')
            video_list = []
            
            for item in data_list:
                try:
                    video_data = {
                        'vod_id': self._safe_xpath(item, './a[@class="Movie movie-height"]/@href', '').split('=')[-1],
                        'vod_name': self._safe_xpath(item, './a[2]/text()', '').strip(),
                        'vod_pic': self._safe_xpath(item, './a[1]/img/@originalsrc', ''),
                        'vod_remarks': self._safe_xpath(item, './div[@class="Movie-type02"]/div[2]/text()', '').strip()
                    }
                    
                    # 验证必要字段
                    if video_data['vod_id'] and video_data['vod_name']:
                        video_list.append(video_data)
                        
                except Exception as e:
                    logger.warning(f"解析视频项失败: {e}")
                    continue
            
            logger.info(f"成功获取 {len(video_list)} 个首页视频")
            return {'list': video_list, 'parse': 0, 'jx': 0}
            
        except Exception as e:
            logger.error(f"首页视频内容获取失败: {e}")
            return {'list': [], 'parse': 0, 'jx': 0}

    def categoryContent(self, cid, page, filter, ext):
        """分类内容"""
        try:
            # 提取筛选参数
            params = {
                'class': ext.get('class', '0'),
                'area': ext.get('area', '0'),
                'year': ext.get('year', '0'),
                'status': ext.get('status', '0'),
                'by': ext.get('by', 'new')
            }
            
            # 构造URL
            api_url = self._build_category_url(cid, page, params)
            
            # 发送请求
            response = self._make_request(api_url)
            if not response:
                return {'list': [], 'parse': 0, 'jx': 0}
            
            data = response.json()
            video_list = self._parse_category_data(data)
            
            logger.info(f"分类 {cid} 第 {page} 页获取 {len(video_list)} 个视频")
            return {'list': video_list, 'parse': 0, 'jx': 0}
            
        except Exception as e:
            logger.error(f"分类内容获取失败: {e}")
            return {'list': [], 'parse': 0, 'jx': 0}

    def _build_category_url(self, cid: str, page: int, params: Dict) -> str:
        """构造分类URL"""
        query_params = {
            'page_num': page,
            'sorttype': 'desc',
            'channel_id': cid,
            'tag': params['class'],
            'area': params['area'],
            'year': params['year'],
            'status': params['status'],
            'sort': params['by'],
            'page_size': 28
        }
        return f"{self.home_url}/video/refresh-cate?{urlencode(query_params)}"

    def _parse_category_data(self, data: Dict) -> List[Dict]:
        """解析分类数据"""
        video_list = []
        try:
            items = data.get('data', {}).get('list', [])
            for item in items:
                video_list.append({
                    'vod_id': item.get('video_id', ''),
                    'vod_name': item.get('video_name', '').strip(),
                    'vod_pic': item.get('cover', ''),
                    'vod_remarks': item.get('flag', '')
                })
        except Exception as e:
            logger.error(f"解析分类数据失败: {e}")
        return video_list

    def detailContent(self, did):
        """详情内容"""
        try:
            video_id = did[0] if isinstance(did, (list, tuple)) else did
            if not video_id:
                return {"list": [], "parse": 0, "jx": 0}
            
            url = f"{self.home_url}/video/detail?video_id={video_id}"
            response = self._make_request(url)
            if not response:
                return {"list": [], "parse": 0, "jx": 0}
            
            response.encoding = 'utf-8'
            root = etree.HTML(response.text)
            
            # 提取视频基本信息
            video_info = self._extract_video_info(root, video_id)
            
            # 提取播放数据
            play_data = self._extract_play_data(root, video_id)
            
            video_list = [{
                'type_name': video_info.get('type_name', ''),
                'vod_id': video_id,
                'vod_name': video_info.get('name', ''),
                'vod_remarks': video_info.get('remarks', ''),
                'vod_year': video_info.get('year', ''),
                'vod_area': video_info.get('area', ''),
                'vod_actor': video_info.get('actors', ''),
                'vod_director': video_info.get('director', ''),
                'vod_content': video_info.get('description', ''),
                'vod_play_from': play_data['play_from'],
                'vod_play_url': play_data['play_url']
            }]
            
            logger.info(f"成功获取视频 {video_id} 的详情信息")
            return {"list": video_list, 'parse': 0, 'jx': 0}
            
        except Exception as e:
            logger.error(f"详情内容获取失败: {e}")
            return {"list": [], "parse": 0, "jx": 0}

    def _extract_video_info(self, root, video_id: str) -> Dict:
        """提取视频基本信息"""
        info = {}
        try:
            # 这里可以根据实际网页结构添加更多的信息提取
            info['name'] = self._safe_xpath(root, '//h1/text()', '')
            info['type_name'] = self._safe_xpath(root, '//span[contains(@class, "type")]/text()', '')
            info['remarks'] = self._safe_xpath(root, '//span[contains(@class, "status")]/text()', '')
            info['year'] = self._safe_xpath(root, '//span[contains(text(), "年份")]/following-sibling::span/text()', '')
            info['area'] = self._safe_xpath(root, '//span[contains(text(), "地区")]/following-sibling::span/text()', '')
            info['actors'] = self._safe_xpath(root, '//span[contains(text(), "演员")]/following-sibling::span/text()', '')
            info['director'] = self._safe_xpath(root, '//span[contains(text(), "导演")]/following-sibling::span/text()', '')
            info['description'] = self._safe_xpath(root, '//div[contains(@class, "description")]/text()', '')
        except Exception as e:
            logger.warning(f"提取视频信息失败: {e}")
        return info

    def _extract_play_data(self, root, video_id: str) -> Dict:
        """提取播放数据"""
        play_from = ['线路一', '线路二', '线路三']
        play_urls = []
        
        try:
            # 查找播放列表
            play_lists = root.xpath('//ul[contains(@class, "qy-episode-num")] | //ul[@id="srctab-1"]')
            
            for play_list in play_lists:
                episodes = self._extract_episodes(play_list, video_id)
                if episodes:
                    play_urls.append('#'.join(episodes))
            
            # 如果没有找到播放列表，复制现有的
            if not play_urls:
                play_urls = [''] * 3
            else:
                play_urls = play_urls * 3
                
        except Exception as e:
            logger.warning(f"提取播放数据失败: {e}")
            play_urls = [''] * 3
        
        return {
            'play_from': '$$$'.join(play_from),
            'play_url': '$$$'.join(play_urls)
        }

    def _extract_episodes(self, container, video_id: str) -> List[str]:
        """提取剧集列表"""
        episodes = []
        try:
            # 尝试多种XPath模式
            name_patterns = [
                './/a/text()',
                './/span[@class="title-link"]/text()',
                './/div[@class="select-link"]/text()',
                './li/text()'
            ]
            
            id_patterns = [
                './li/@data-chapter-id',
                './/a/@data-id',
                './li/@data-id'
            ]
            
            # 提取名称
            names = []
            for pattern in name_patterns:
                found = container.xpath(pattern)
                if found:
                    names = [name.strip() for name in found if name.strip()]
                    break
            
            # 提取ID
            ids = []
            for pattern in id_patterns:
                found = container.xpath(pattern)
                if found:
                    ids = found
                    break
            
            # 构造剧集列表
            if names and ids:
                min_len = min(len(names), len(ids))
                for i in range(min_len):
                    episodes.append(f"{names[i]}${video_id}-{ids[i]}")
            elif names:
                for i, name in enumerate(names):
                    episodes.append(f"{name}${video_id}-{i+1}")
                    
        except Exception as e:
            logger.warning(f"提取剧集失败: {e}")
            
        return episodes

    def searchContent(self, key, quick, page='1'):
        """搜索内容"""
        if page != '1':
            return {'list': [], 'parse': 0, 'jx': 0}
            
        try:
            url = f'{self.home_url}/video/refresh-video?page_num=1&sorttype=desc&page_size=28&tvNum=7&sort=new&keyword={key}'
            
            response = self._make_request(url)
            if not response:
                return {'list': [], 'parse': 0, 'jx': 0}
                
            response.encoding = 'utf-8'
            root = etree.HTML(response.text)
            
            data_list = root.xpath('//div[@class="SSbox"]')
            video_list = []
            
            for item in data_list:
                try:
                    video_data = {
                        'vod_id': self._safe_xpath(item, './a/@href', '').split('=')[-1],
                        'vod_name': ''.join(item.xpath('.//span//text()')).strip(),
                        'vod_pic': self._safe_xpath(item, './a/img/@originalsrc', ''),
                        'vod_remarks': self._safe_xpath(item, './/div[@class="SSjgTitle"]/text()', '')
                    }
                    
                    if video_data['vod_id'] and video_data['vod_name']:
                        video_list.append(video_data)
                        
                except Exception as e:
                    logger.warning(f"解析搜索结果失败: {e}")
                    continue
            
            logger.info(f"搜索 '{key}' 得到 {len(video_list)} 个结果")
            return {'list': video_list, 'parse': 0, 'jx': 0}
            
        except Exception as e:
            logger.error(f"搜索内容失败: {e}")
            return {'list': [], 'parse': 0, 'jx': 0}

    def playerContent(self, flag, pid, vipFlags):
        """播放内容"""
        try:
            if not pid or '-' not in pid:
                return self._get_error_response("无效的播放ID格式")
            
            video_id, chapter_id = pid.split('-')
            url = self._build_play_url(video_id, chapter_id)
            
            response = self._make_request(url)
            if not response:
                return self._get_error_response("网络请求失败")
            
            data = response.json()
            play_url = self._select_play_url(data, flag)
            
            return {
                'url': play_url,
                'parse': 0,
                'jx': 0,
                'header': self.headers
            }
            
        except Exception as e:
            logger.error(f"播放内容获取失败: {e}")
            return self._get_error_response(str(e))

    def _build_play_url(self, video_id: str, chapter_id: str) -> str:
        """构造播放URL"""
        params = {
            'videoId': video_id,
            'sourceId': '0',
            'citycode': 'HKG',
            'chapterId': chapter_id
        }
        return f"{self.home_url}/video/play-url?{urlencode(params)}"

    def _select_play_url(self, data: Dict, flag: str) -> str:
        """选择播放URL"""
        try:
            resource_urls = data.get('data', {}).get('urlinfo', {}).get('resource_url', {})
            
            line_key = self.line_mapping.get(flag)
            if line_key and line_key in resource_urls:
                return resource_urls[line_key]
            
            # 降级策略：返回第一个可用的URL
            if resource_urls:
                first_key = next(iter(resource_urls))
                logger.warning(f"线路 {flag} 不存在，使用线路 {first_key}")
                return resource_urls[first_key]
                
            raise ValueError("没有可用的播放资源")
            
        except Exception as e:
            logger.error(f"选择播放URL失败: {e}")
            return self.default_play_url

    def _get_error_response(self, message: str = "") -> Dict:
        """获取错误响应"""
        return {
            'url': self.default_play_url,
            'parse': 0,
            'jx': 0,
            'header': self.headers,
            'msg': message
        }

    def _safe_xpath(self, element, xpath: str, default: str = '') -> str:
        """安全的XPath提取"""
        try:
            result = element.xpath(xpath)
            return result[0] if result else default
        except:
            return default

    def localProxy(self, params):
        pass

    def destroy(self):
        """销毁资源"""
        try:
            if self.session:
                self.session.close()
            logger.info("爱瓜TV爬虫资源已清理")
            return 'Destroy完成'
        except Exception as e:
            logger.error(f"Destroy失败: {e}")
            return 'Destroy异常'


if __name__ == '__main__':
    # 测试代码
    spider = Spider()
    spider.init({})
    print("爱瓜TV爬虫测试启动")
