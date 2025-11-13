# -*- coding: utf-8 -*-
# @Author  : Doubebly
# @Time    : 2025/3/22 21:03
import json
import sys
import requests
from lxml import etree, html
import re
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):
    def getName(self):
        return "爱瓜TV"

    def init(self, extend):
        self.home_url = 'https://aigua1.com'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Referer": "https://aigua1.com/",
        }
        self.image_domain = "https://vres.wbadl.cn"  # 圖片域名

        self.default_play_url = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4'

    def getDependence(self):
        return []

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def homeContent(self, filter):
        result = {
            'class': [
                {'type_id': '2', 'type_name': '电视剧'},
                {'type_id': '1', 'type_name': '电影'},
                {'type_id': '3', 'type_name': '综艺'},
                {'type_id': '4', 'type_name': '动漫'},
                {'type_id': '32', 'type_name': '纪录片'}
            ],
            'filters': {
                '1': [  # 电影筛选条件
                    {'name': '剧情', 'key': 'class', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '魔幻', 'v': '179'},
                        {'n': '动作', 'v': '154'},
                        {'n': '科幻', 'v': '159'},
                        {'n': '惊悚', 'v': '156'},
                        {'n': '犯罪', 'v': '157'},
                        {'n': '剧情', 'v': '161'},
                        {'n': '悬疑', 'v': '160'},
                        {'n': '奇幻', 'v': '226'},
                        {'n': '爱情', 'v': '155'},
                        {'n': '战争', 'v': '164'},
                        {'n': '恐怖', 'v': '169'},
                        {'n': '喜剧', 'v': '153'},
                        {'n': '冒险', 'v': '280'},
                        {'n': '灾难', 'v': '281'},
                        {'n': '歌舞', 'v': '282'},
                        {'n': '动画', 'v': '283'},
                        {'n': '经典', 'v': '284'},
                        {'n': '同性', 'v': '285'},
                        {'n': '网络电影', 'v': '286'},
                        {'n': '其他', 'v': '178'}
                    ]},
                    {'name': '地区', 'key': 'area', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '大陆', 'v': '18'},
                        {'n': '日本', 'v': '24'},
                        {'n': '香港', 'v': '20'},
                        {'n': '韩国', 'v': '21'},
                        {'n': '台湾', 'v': '23'},
                        {'n': '英国', 'v': '22'},
                        {'n': '东南亚', 'v': '29'},
                        {'n': '欧美', 'v': '19'},
                        {'n': '其它', 'v': '30'}
                    ]},
                    {'name': '年份', 'key': 'year', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '2025', 'v': '131'},
                        {'n': '2024', 'v': '130'},
                        {'n': '2023', 'v': '129'},
                        {'n': '2022', 'v': '21'},
                        {'n': '2021', 'v': '22'},
                        {'n': '2020', 'v': '23'},
                        {'n': '2019', 'v': '24'},
                        {'n': '2018', 'v': '25'},
                        {'n': '2017', 'v': '26'},
                        {'n': '2016', 'v': '27'},
                        {'n': '2015', 'v': '28'},
                        {'n': '2014', 'v': '29'},
                        {'n': '2013', 'v': '30'},
                        {'n': '2012', 'v': '31'},
                        {'n': '2011', 'v': '32'},
                        {'n': '2010', 'v': '33'},
                        {'n': '2009', 'v': '34'},
                        {'n': '2008', 'v': '35'},
                        {'n': '更早', 'v': '127'}
                    ]},
                    {'name': '状态', 'key': 'status', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '完结', 'v': '1'},
                        {'n': '更新中', 'v': '2'}
                    ]},
                    {'name': '排序', 'key': 'by', 'value': [
                        {'n': '添加时间', 'v': 'new'},
                        {'n': '人气高低', 'v': 'hot'},
                        {'n': '评分高低', 'v': 'score'}
                    ]}
                ],
                '2': [  # 电视剧筛选条件
                    {'name': '剧情', 'key': 'class', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '短剧', 'v': '364'},
                        {'n': '偶像', 'v': '251'},
                        {'n': '爱情', 'v': '252'},
                        {'n': '言情', 'v': '253'},
                        {'n': '古装', 'v': '254'},
                        {'n': '历史', 'v': '255'},
                        {'n': '玄幻', 'v': '256'},
                        {'n': '谍战', 'v': '257'},
                        {'n': '历险', 'v': '258'},
                        {'n': '都市', 'v': '259'},
                        {'n': '科幻', 'v': '260'},
                        {'n': '军旅', 'v': '261'},
                        {'n': '喜剧', 'v': '262'},
                        {'n': '武侠', 'v': '263'},
                        {'n': '江湖', 'v': '264'},
                        {'n': '罪案', 'v': '265'},
                        {'n': '青春', 'v': '266'},
                        {'n': '家庭', 'v': '267'},
                        {'n': '战争', 'v': '268'},
                        {'n': '悬疑', 'v': '269'},
                        {'n': '穿越', 'v': '270'},
                        {'n': '宫廷', 'v': '271'},
                        {'n': '神话', 'v': '272'},
                        {'n': '商战', 'v': '273'},
                        {'n': '警匪', 'v': '274'},
                        {'n': '动作', 'v': '275'},
                        {'n': '惊悚', 'v': '276'},
                        {'n': '剧情', 'v': '277'},
                        {'n': '同性', 'v': '278'},
                        {'n': '奇幻', 'v': '279'},
                        {'n': '其他', 'v': '231'}
                    ]},
                    {'name': '地区', 'key': 'area', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '大陆', 'v': '18'},
                        {'n': '日本', 'v': '24'},
                        {'n': '香港', 'v': '20'},
                        {'n': '韩国', 'v': '21'},
                        {'n': '台湾', 'v': '23'},
                        {'n': '英国', 'v': '22'},
                        {'n': '东南亚', 'v': '29'},
                        {'n': '欧美', 'v': '19'},
                        {'n': '其它', 'v': '30'}
                    ]},
                    {'name': '年份', 'key': 'year', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '2025', 'v': '131'},
                        {'n': '2024', 'v': '130'},
                        {'n': '2023', 'v': '129'},
                        {'n': '2022', 'v': '21'},
                        {'n': '2021', 'v': '22'},
                        {'n': '2020', 'v': '23'},
                        {'n': '2019', 'v': '24'},
                        {'n': '2018', 'v': '25'},
                        {'n': '2017', 'v': '26'},
                        {'n': '2016', 'v': '27'},
                        {'n': '2015', 'v': '28'},
                        {'n': '2014', 'v': '29'},
                        {'n': '2013', 'v': '30'},
                        {'n': '2012', 'v': '31'},
                        {'n': '2011', 'v': '32'},
                        {'n': '2010', 'v': '33'},
                        {'n': '2009', 'v': '34'},
                        {'n': '2008', 'v': '35'},
                        {'n': '更早', 'v': '127'}
                    ]},
                    {'name': '状态', 'key': 'status', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '完结', 'v': '1'},
                        {'n': '更新中', 'v': '2'}
                    ]},
                    {'name': '排序', 'key': 'by', 'value': [
                        {'n': '添加时间', 'v': 'new'},
                        {'n': '人气高低', 'v': 'hot'},
                        {'n': '评分高低', 'v': 'score'}
                    ]}
                ],
                '3': [  # 综艺筛选条件
                    {'name': '类型', 'key': 'class', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '生活', 'v': '229'},
                        {'n': '脱口秀', 'v': '228'},
                        {'n': '真人秀', 'v': '227'},
                        {'n': '访谈', 'v': '168'},
                        {'n': '选秀', 'v': '287'},
                        {'n': '网综', 'v': '288'},
                        {'n': '搞笑', 'v': '289'},
                        {'n': '竞技', 'v': '290'},
                        {'n': '情感', 'v': '291'},
                        {'n': '演唱会', 'v': '292'},
                        {'n': '晚会', 'v': '293'},
                        {'n': '其他', 'v': '232'}
                    ]},
                    {'name': '地区', 'key': 'area', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '大陆', 'v': '18'},
                        {'n': '日本', 'v': '24'},
                        {'n': '香港', 'v': '20'},
                        {'n': '韩国', 'v': '21'},
                        {'n': '台湾', 'v': '23'},
                        {'n': '东南亚', 'v': '29'},
                        {'n': '欧美', 'v': '19'},
                        {'n': '其它', 'v': '30'}
                    ]},
                    {'name': '年份', 'key': 'year', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '2025', 'v': '131'},
                        {'n': '2024', 'v': '130'},
                        {'n': '2023', 'v': '129'},
                        {'n': '2022', 'v': '21'},
                        {'n': '2021', 'v': '22'},
                        {'n': '2020', 'v': '23'},
                        {'n': '2019', 'v': '24'},
                        {'n': '2018', 'v': '25'},
                        {'n': '2017', 'v': '26'},
                        {'n': '2016', 'v': '27'},
                        {'n': '2015', 'v': '28'},
                        {'n': '2014', 'v': '29'},
                        {'n': '2013', 'v': '30'},
                        {'n': '2012', 'v': '31'},
                        {'n': '2011', 'v': '32'},
                        {'n': '2010', 'v': '33'},
                        {'n': '2009', 'v': '34'},
                        {'n': '2008', 'v': '35'},
                        {'n': '更早', 'v': '127'}
                    ]},
                    {'name': '状态', 'key': 'status', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '完结', 'v': '1'},
                        {'n': '更新中', 'v': '2'}
                    ]},
                    {'name': '排序', 'key': 'by', 'value': [
                        {'n': '添加时间', 'v': 'new'},
                        {'n': '人气高低', 'v': 'hot'},
                        {'n': '评分高低', 'v': 'score'}
                    ]}
                ],
                '4': [  # 动漫筛选条件
                    {'name': '类型', 'key': 'class', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '儿童', 'v': '363'},
                        {'n': '格斗', 'v': '167'},
                        {'n': '热血', 'v': '165'},
                        {'n': '机战', 'v': '166'},
                        {'n': '少女', 'v': '294'},
                        {'n': '竞技', 'v': '295'},
                        {'n': '科幻', 'v': '296'},
                        {'n': '爆笑', 'v': '297'},
                        {'n': '推理', 'v': '298'},
                        {'n': '魔幻', 'v': '299'},
                        {'n': '冒险', 'v': '300'},
                        {'n': '恋爱', 'v': '301'},
                        {'n': '校园', 'v': '302'},
                        {'n': '治愈', 'v': '303'},
                        {'n': '泡面', 'v': '304'},
                        {'n': '穿越', 'v': '305'},
                        {'n': '灵异', 'v': '306'},
                        {'n': '耽美', 'v': '307'},
                        {'n': '剧场版', 'v': '308'},
                        {'n': '其他', 'v': '170'}
                    ]},
                    {'name': '地区', 'key': 'area', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '大陆', 'v': '18'},
                        {'n': '日本', 'v': '24'},
                        {'n': '香港', 'v': '20'},
                        {'n': '韩国', 'v': '21'},
                        {'n': '台湾', 'v': '23'},
                        {'n': '英国', 'v': '22'},
                        {'n': '东南亚', 'v': '29'},
                        {'n': '欧美', 'v': '19'},
                        {'n': '其它', 'v': '30'}
                    ]},
                    {'name': '年份', 'key': 'year', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '2025', 'v': '131'},
                        {'n': '2024', 'v': '130'},
                        {'n': '2023', 'v': '129'},
                        {'n': '2022', 'v': '21'},
                        {'n': '2021', 'v': '22'},
                        {'n': '2020', 'v': '23'},
                        {'n': '2019', 'v': '24'},
                        {'n': '2018', 'v': '25'},
                        {'n': '2017', 'v': '26'},
                        {'n': '2016', 'v': '27'},
                        {'n': '2015', 'v': '28'},
                        {'n': '2014', 'v': '29'},
                        {'n': '2013', 'v': '30'},
                        {'n': '2012', 'v': '31'},
                        {'n': '2011', 'v': '32'},
                        {'n': '2010', 'v': '33'},
                        {'n': '2009', 'v': '34'},
                        {'n': '2008', 'v': '35'},
                        {'n': '更早', 'v': '127'}
                    ]},
                    {'name': '状态', 'key': 'status', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '完结', 'v': '1'},
                        {'n': '更新中', 'v': '2'}
                    ]},
                    {'name': '排序', 'key': 'by', 'value': [
                        {'n': '添加时间', 'v': 'new'},
                        {'n': '人气高低', 'v': 'hot'},
                        {'n': '评分高低', 'v': 'score'}
                    ]}
                ],
                '32': [  # 纪录片筛选条件
                    {'name': '类型', 'key': 'class', 'value': [
                        {'n': '全部', 'v': '0'}  # HTML未提供具体类型，仅保留“全部”
                    ]},
                    {'name': '地区', 'key': 'area', 'value': [
                        {'n': '全部', 'v': '0'}  # HTML未提供具体地区，仅保留“全部”
                    ]},
                    {'name': '年份', 'key': 'year', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '2025', 'v': '131'},
                        {'n': '2024', 'v': '130'},
                        {'n': '2023', 'v': '129'},
                        {'n': '2022', 'v': '21'},
                        {'n': '2021', 'v': '22'},
                        {'n': '2020', 'v': '23'},
                        {'n': '2019', 'v': '24'},
                        {'n': '2018', 'v': '25'},
                        {'n': '2017', 'v': '26'},
                        {'n': '2016', 'v': '27'},
                        {'n': '2015', 'v': '28'},
                        {'n': '2014', 'v': '29'},
                        {'n': '2013', 'v': '30'},
                        {'n': '2012', 'v': '31'},
                        {'n': '2011', 'v': '32'},
                        {'n': '2010', 'v': '33'},
                        {'n': '2009', 'v': '34'},
                        {'n': '2008', 'v': '35'},
                        {'n': '更早', 'v': '127'}
                    ]},
                    {'name': '状态', 'key': 'status', 'value': [
                        {'n': '全部', 'v': '0'},
                        {'n': '完结', 'v': '1'},
                        {'n': '更新中', 'v': '2'}
                    ]},
                    {'name': '排序', 'key': 'by', 'value': [
                        {'n': '添加时间', 'v': 'new'},
                        {'n': '人气高低', 'v': 'hot'},
                        {'n': '评分高低', 'v': 'score'}
                    ]}
                ]
            }
        }
        # print(f"Debug homeContent: {result}")
        return result

def homeVideoContent(self):
    d = []
    try:
        res = requests.get(self.home_url, headers=self.headers, timeout=10)
        res.encoding = 'utf-8'
        root = etree.HTML(res.text)
        data_list = root.xpath('//div[@class="video-box-new"]/div[@class="Movie-list"]')
        
        for i in data_list:
            # 添加空值检查
            hrefs = i.xpath('./a[@class="Movie movie-height"]/@href')
            names = i.xpath('./a[2]/text()')
            pics = i.xpath('./a[1]/img/@originalsrc')
            remarks = i.xpath('./div[@class="Movie-type02"]/div[2]/text()')
            
            if hrefs and names and pics and remarks:
                d.append({
                    'vod_id': hrefs[0].split('=')[-1] if '=' in hrefs[0] else hrefs[0],
                    'vod_name': names[0].strip(),
                    'vod_pic': pics[0],
                    'vod_remarks': remarks[0].strip()
                })
        
        return {'list': d, 'parse': 0, 'jx': 0}
    except Exception as e:
        print(f"获取首页视频内容失败: {e}")
        return {'list': d, 'parse': 0, 'jx': 0}

def categoryContent(self, cid, page, filter, ext):
    """
    获取分类内容视频列表
    
    Args:
        cid: 分类ID
        page: 页码
        filter: 过滤器
        ext: 扩展参数字典
        
    Returns:
        dict: 视频列表数据
    """
    # 参数提取与默认值设置
    params = {
        'class': ext.get('class', '0'),    # 剧情/类型
        'area': ext.get('area', '0'),      # 地区
        'year': ext.get('year', '0'),      # 年份
        'status': ext.get('status', '0'),  # 状态
        'by': ext.get('by', 'new')         # 排序
    }
    
    # URL构造 - 使用字典方式更清晰
    url_params = {
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
    
    # 使用params参数自动编码URL
    url = f"{self.home_url}/video/refresh-cate"
    
    d = []
    try:
        # 添加超时和错误处理
        res = requests.get(
            url, 
            headers=self.headers, 
            params=url_params,
            timeout=10
        )
        res.raise_for_status()  # 检查HTTP状态码
        
        data = res.json()
        
        # 添加数据完整性检查
        if not data.get('data') or not isinstance(data['data'].get('list'), list):
            print("API返回数据格式异常")
            return {'list': d, 'parse': 0, 'jx': 0}
        
        data_list = data['data']['list']
        
        # 使用列表推导式优化循环
        d = [
            {
                'vod_id': item.get('video_id', ''),
                'vod_name': item.get('video_name', '').strip(),
                'vod_pic': item.get('cover', ''),
                'vod_remarks': item.get('flag', ''),
            }
            for item in data_list
            if item.get('video_id')  # 确保有video_id才加入列表
        ]
        
        return {'list': d, 'parse': 0, 'jx': 0}
        
    except requests.exceptions.RequestException as e:
        print(f"网络请求失败: {e}")
    except ValueError as e:
        print(f"JSON解析失败: {e}")
    except Exception as e:
        print(f"获取分类内容失败: {e}")
    
    return {'list': d, 'parse': 0, 'jx': 0}

def detailContent(self, did):
    """
    获取视频详情内容
    
    Args:
        did: 视频ID或ID列表
        
    Returns:
        dict: 视频详情数据
    """
    if not did:
        return {"list": [], "parse": 0, "jx": 0}
    
    video_id = did[0] if isinstance(did, (list, tuple)) else did
    video_list = []
    
    try:
        # 构造请求URL
        url = f"{self.home_url}/video/detail?video_id={video_id}"
        
        # 发送请求
        response = requests.get(url, headers=self.headers, timeout=10)
        response.encoding = 'utf-8'
        response.raise_for_status()
        
        # 解析HTML
        root = etree.HTML(response.text)
        
        # 提取视频基本信息
        video_info = self._extract_video_info(root, video_id)
        
        # 提取播放列表
        play_data = self._extract_play_data(root, video_id)
        
        # 构造返回数据
        video_list.append({
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
        })
        
        return {"list": video_list, 'parse': 0, 'jx': 0}
        
    except requests.exceptions.RequestException as e:
        print(f"网络请求失败: {e}")
    except etree.ParseError as e:
        print(f"HTML解析失败: {e}")
    except Exception as e:
        print(f"获取视频详情失败: {e}")
    
    return {"list": [], "parse": 0, "jx": 0}

def _extract_video_info(self, root, video_id):
    """
    提取视频基本信息
    """
    info = {}
    
    try:
        # 视频名称
        name_elements = root.xpath('//h1[@class="video-title"]/text()')
        info['name'] = name_elements[0].strip() if name_elements else ''
        
        # 视频类型
        type_elements = root.xpath('//span[@class="video-type"]/text()')
        info['type_name'] = type_elements[0].strip() if type_elements else ''
        
        # 备注信息
        remark_elements = root.xpath('//span[@class="video-status"]/text()')
        info['remarks'] = remark_elements[0].strip() if remark_elements else ''
        
        # 年份
        year_elements = root.xpath('//span[contains(text(), "年份")]/following-sibling::span/text()')
        info['year'] = year_elements[0].strip() if year_elements else ''
        
        # 地区
        area_elements = root.xpath('//span[contains(text(), "地区")]/following-sibling::span/text()')
        info['area'] = area_elements[0].strip() if area_elements else ''
        
        # 演员
        actor_elements = root.xpath('//span[contains(text(), "演员")]/following-sibling::span//text()')
        info['actors'] = ' '.join([actor.strip() for actor in actor_elements]) if actor_elements else ''
        
        # 导演
        director_elements = root.xpath('//span[contains(text(), "导演")]/following-sibling::span/text()')
        info['director'] = director_elements[0].strip() if director_elements else ''
        
        # 简介
        desc_elements = root.xpath('//div[@class="video-description"]/text()')
        info['description'] = desc_elements[0].strip() if desc_elements else ''
        
    except Exception as e:
        print(f"提取视频信息失败: {e}")
    
    return info

def _extract_play_data(self, root, video_id):
    """
    提取播放数据
    """
    play_from = []
    play_urls = []
    
    try:
        # 查找所有可能的播放列表容器
        play_containers = root.xpath('//ul[contains(@class, "qy-episode-num")] | //ul[@id="srctab-1"] | //div[contains(@class, "play-list")]//ul')
        
        for index, container in enumerate(play_containers):
            # 播放源名称
            source_name = self._get_source_name(container, index)
            play_from.append(source_name)
            
            # 提取播放集数
            episodes = self._extract_episodes(container, video_id)
            if episodes:
                play_urls.append('#'.join(episodes))
        
        # 如果没有找到播放列表，使用默认线路
        if not play_from:
            play_from = ['线路一', '线路二', '线路三']
            # 使用默认播放URL或空播放列表
            play_urls = [''] * 3
    
    except Exception as e:
        print(f"提取播放数据失败: {e}")
        # 提供默认值
        play_from = ['线路一', '线路二', '线路三']
        play_urls = [''] * 3
    
    return {
        'play_from': '$$$'.join(play_from),
        'play_url': '$$$'.join(play_urls) if play_urls else ''
    }

def _get_source_name(self, container, index):
    """
    获取播放源名称
    """
    # 尝试从容器中提取名称
    name_elements = container.xpath('./preceding-sibling::div[contains(@class, "source-tab")][1]//text() | ./parent::div/preceding-sibling::div[1]//text()')
    
    if name_elements:
        name = ' '.join([text.strip() for text in name_elements if text.strip()])
        if name:
            return name
    
    # 使用默认名称
    return f'线路{index + 1}'

def _extract_episodes(self, container, video_id):
    """
    提取剧集列表
    """
    episodes = []
    
    try:
        # 尝试多种XPath模式提取剧集名称
        name_patterns = [
            './/a/text()',
            './/span[@class="title-link"]/text()',
            './/div[@class="select-link"]/text()',
            './li/text()',
            './/button/text()'
        ]
        
        # 尝试多种XPath模式提取剧集ID
        id_patterns = [
            './li/@data-chapter-id',
            './/a/@data-id',
            './/li/@data-id',
            './/button/@data-id'
        ]
        
        # 提取剧集名称
        names = []
        for pattern in name_patterns:
            found_names = container.xpath(pattern)
            if found_names:
                names = [name.strip() for name in found_names if name.strip()]
                break
        
        # 提取剧集ID
        ids = []
        for pattern in id_patterns:
            found_ids = container.xpath(pattern)
            if found_ids:
                ids = found_ids
                break
        
        # 构造剧集列表
        if names and ids:
            # 确保数量匹配
            min_length = min(len(names), len(ids))
            for i in range(min_length):
                episode_name = names[i]
                episode_id = ids[i]
                episodes.append(f"{episode_name}${video_id}-{episode_id}")
        elif names:
            # 只有名称没有ID
            for i, name in enumerate(names):
                episodes.append(f"{name}${video_id}-{i+1}")
    
    except Exception as e:
        print(f"提取剧集失败: {e}")
    
    return episodes
    def searchContent(self, key, quick, page='1'):
        if str(page) != '1':
            return {'list': [], 'parse': 0, 'jx': 0}
        url = f'{self.home_url}/video/refresh-video?page_num=1&sorttype=desc&page_size=28&tvNum=7&sort=new&keyword={key}'
        d = []
        try:
            res = requests.get(url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//div[@class="SSbox"]')
            for i in data_list:
                d.append(
                    {
                        'vod_id': i.xpath('./a/@href')[0].split('=')[-1],
                        'vod_name': ''.join(i.xpath('.//span/text()')),
                        'vod_pic': i.xpath('./a/img/@originalsrc')[0],
                        'vod_remarks': i.xpath('.//div[@class="SSjgTitle"]/text()')[0],
                    }
                )
            return {'list': d, 'parse': 0, 'jx': 0}
        except Exception as e:
            print(f"Error in searchContent: {e}")
            return {'list': [], 'parse': 0, 'jx': 0}

    def playerContent(self, flag, pid, vipFlags):
    """
    获取视频播放地址
    
    Args:
        flag: 播放线路标识
        pid: 视频ID和章节ID的组合字符串 (格式: videoId-chapterId)
        vipFlags: VIP标志（未使用）
        
    Returns:
        dict: 播放地址信息
    """
    # 参数验证
    if not pid or '-' not in pid:
        return self._get_error_response("无效的视频ID格式")
    
    try:
        # 解析视频ID和章节ID
        video_id, chapter_id = self._parse_video_pid(pid)
        
        # 构造API请求URL
        api_url = self._build_play_url(video_id, chapter_id)
        
        # 发送请求获取播放信息
        play_data = self._fetch_play_data(api_url)
        
        # 根据线路选择播放地址
        play_url = self._select_play_url(play_data, flag)
        
        return {
            'url': play_url,
            'parse': 0, 
            'jx': 0, 
            'header': self.headers
        }
        
    except ValueError as e:
        print(f"参数解析错误: {e}")
        return self._get_error_response(f"参数错误: {e}")
    except requests.exceptions.RequestException as e:
        print(f"网络请求失败: {e}")
        return self._get_error_response("网络请求失败")
    except KeyError as e:
        print(f"数据格式错误，缺少键: {e}")
        return self._get_error_response("数据解析失败")
    except Exception as e:
        print(f"获取播放地址失败: {e}")
        return self._get_error_response("系统错误")

def _parse_video_pid(self, pid):
    """
    解析视频ID和章节ID
    """
    parts = pid.split('-')
    if len(parts) != 2:
        raise ValueError(f"PID格式错误，应为videoId-chapterId，实际为: {pid}")
    
    video_id = parts[0].strip()
    chapter_id = parts[1].strip()
    
    if not video_id or not chapter_id:
        raise ValueError("视频ID或章节ID为空")
    
    return video_id, chapter_id

def _build_play_url(self, video_id, chapter_id, source_id="0", city_code="HKG"):
    """
    构造播放地址请求URL
    
    Args:
        video_id: 视频ID
        chapter_id: 章节ID
        source_id: 源ID (默认为0)
        city_code: 城市代码 (默认为HKG)
    """
    params = {
        'videoId': video_id,
        'sourceId': source_id,
        'citycode': city_code,
        'chapterId': chapter_id
    }
    
    # 使用urlencode确保URL安全
    query_string = urlencode(params)
    return f"{self.home_url}/video/play-url?{query_string}"

def _fetch_play_data(self, api_url):
    """
    获取播放数据
    """
    response = requests.get(api_url, headers=self.headers, timeout=10)
    response.raise_for_status()
    
    data = response.json()
    
    # 验证数据格式
    if not isinstance(data, dict):
        raise ValueError("返回数据不是有效的JSON对象")
    
    if 'data' not in data or 'urlinfo' not in data['data']:
        raise KeyError("返回数据缺少必要的字段")
    
    return data['data']['urlinfo']

def _select_play_url(self, play_data, flag):
    """
    根据线路标识选择播放地址
    
    Args:
        play_data: 播放数据
        flag: 线路标识
    """
    # 线路映射配置 - 可扩展
    line_mapping = {
        '线路一': '1',
        '线路二': '16', 
        '线路三': '21',
        '线路四': '2',  # 可扩展更多线路
        '线路五': '3'
    }
    
    # 获取资源URL列表
    resource_urls = play_data.get('resource_url', {})
    
    if not resource_urls:
        raise ValueError("没有可用的播放资源")
    
    # 查找对应的线路key
    line_key = line_mapping.get(flag)
    
    if line_key and line_key in resource_urls:
        return resource_urls[line_key]
    
    # 如果指定线路不存在，返回第一个可用线路
    print(f"线路 '{flag}' 不存在，使用默认线路")
    first_key = next(iter(resource_urls))
    return resource_urls[first_key]

def _get_error_response(self, message=""):
    """
    获取错误响应
    """
    # 可以配置一个默认的播放地址或错误页面
    default_url = getattr(self, 'default_play_url', '')
    
    return {
        'url': default_url,
        'parse': 0,
        'jx': 0,
        'header': self.headers,
        'msg': message  # 添加错误信息便于调试
    }

# 可选的：添加线路自动发现功能
def _discover_available_lines(self, play_data):
    """
    发现可用的播放线路
    """
    resource_urls = play_data.get('resource_url', {})
    available_lines = []
    
    for key, url in resource_urls.items():
        if url and url.strip():  # 确保URL非空
            available_lines.append({
                'key': key,
                'url': url,
                'name': f'线路{key}'  # 可以根据需要映射为更有意义的名称
            })
    
    return available_lines
    
    def localProxy(self, params):
        pass

    def destroy(self):
        return '正在Destroy'

    def get_data(self):
        url = self.home_url + 'https://aigua1.com/video/refresh-cate?page_num=1&sorttype=desc&channel_id=0&tag=0&area=0&year=0&page_size=28&sort=new'
        pass

if __name__ == '__main__':
    pass
