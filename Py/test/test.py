from Crypto.Cipher import AES
from base.spider import Spider
from html.parser import HTMLParser
from Crypto.Util.Padding import unpad
import sys,time,uuid,hmac,json,random,base64,hashlib,urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.path.append('..')

class _HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self._text = []

    def handle_data(self, data):
        self._text.append(data)

    def get_text(self):
        return ''.join(self._text)

class Spider(Spider):
    channelList,vod_tabs,pic_groups,user,app,host,user_cache_key,targets = [], [], [],{},{},'','',{b'\xc2\xd7\xc0\xed'.decode('gbk'),b'\xba\xd6\xa7Q'.decode('big5'),b'\xb1\xa1\xa6\xe2'.decode('big5')}
    
    # 内置扩展配置
    default_ext = {
        "appid": "kkdy",
        "channelid": "c1",
        "versionName": "3.3.9", 
        "host": "https://vcache.ntymkab.com",
        "package": "com.kkdyC1V251003.T090030"
    }
    
    # 筛选配置
    filter_config = {
        "1": [
            { "key": "category", "name": "类型", "value": [{ "n": "全部", "v": "" }, { "n": "Netflix", "v": "NETFLIX" }, { "n": "剧情", "v": "剧情" }, { "n": "喜剧", "v": "喜剧" }, { "n": "动作", "v": "动作" }, { "n": "爱情", "v": "爱情" }, { "n": "恐怖", "v": "恐怖" }, { "n": "惊悚", "v": "惊悚" }, { "n": "犯罪", "v": "犯罪" }, { "n": "科幻", "v": "科幻" }, { "n": "悬疑", "v": "悬疑" }, { "n": "奇幻", "v": "奇幻" }, { "n": "冒险", "v": "冒险" }, { "n": "战争", "v": "战争" }, { "n": "历史", "v": "历史" }, { "n": "古装", "v": "古装" }, { "n": "家庭", "v": "家庭" }, { "n": "传记", "v": "传记" }, { "n": "武侠", "v": "武侠" }, { "n": "歌舞", "v": "歌舞" }, { "n": "短片", "v": "短片" }, { "n": "动画", "v": "动画" }, { "n": "儿童", "v": "儿童" }, { "n": "职场", "v": "职场" }] },
            { "key": "area", "name": "地区", "value": [{ "n": "全部", "v": "" }, { "n": "大陆", "v": "中国大陆" }, { "n": "香港", "v": "中国香港" }, { "n": "台湾", "v": "中国台湾" }, { "n": "美国", "v": "美国" }, { "n": "日本", "v": "日本" }, { "n": "韩国", "v": "韩国" }, { "n": "英国", "v": "英国" }, { "n": "法国", "v": "法国" }, { "n": "德国", "v": "德国" }, { "n": "印度", "v": "印度" }, { "n": "泰国", "v": "泰国" }, { "n": "丹麦", "v": "丹麦" }, { "n": "瑞典", "v": "瑞典" }, { "n": "巴西", "v": "巴西" }, { "n": "加拿大", "v": "加拿大" }, { "n": "俄罗斯", "v": "俄罗斯" }, { "n": "意大利", "v": "意大利" }, { "n": "比利时", "v": "比利时" }, { "n": "爱尔兰", "v": "爱尔兰" }, { "n": "西班牙", "v": "西班牙" }, { "n": "澳大利亚", "v": "澳大利亚" }, { "n": "其他", "v": "其他" }] },
            { "key": "language", "name": "语言", "value": [{ "n": "全部", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "粤语", "v": "粤语" }, { "n": "英语", "v": "英语" }, { "n": "日语", "v": "日语" }, { "n": "韩语", "v": "韩语" }, { "n": "法语", "v": "法语" }, { "n": "其他", "v": "其他" }] },
            { "key": "year", "name": "年份", "value": [{ "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "10年代", "v": "2010_2019" }, { "n": "00年代", "v": "2000_2009" }, { "n": "90年代", "v": "1990_1999" }, { "n": "80年代", "v": "1980_1989" }, { "n": "更早", "v": "0_1979" }] },
            { "key": "sort", "name": "排序", "value": [{ "n": "综合", "v": "1" }, { "n": "最新", "v": "2" }, { "n": "最热", "v": "3" }, { "n": "评分", "v": "4" }] }
        ],
        "2": [
            { "key": "category", "name": "类型", "value": [{ "n": "全部", "v": "" }, { "n": "Netflix", "v": "Netflix" }, { "n": "剧情", "v": "剧情" }, { "n": "爱情", "v": "爱情" }, { "n": "喜剧", "v": "喜剧" }, { "n": "犯罪", "v": "犯罪" }, { "n": "悬疑", "v": "悬疑" }, { "n": "古装", "v": "古装" }, { "n": "动作", "v": "动作" }, { "n": "家庭", "v": "家庭" }, { "n": "惊悚", "v": "惊悚" }, { "n": "奇幻", "v": "奇幻" }, { "n": "美剧", "v": "美剧" }, { "n": "科幻", "v": "科幻" }, { "n": "历史", "v": "历史" }, { "n": "战争", "v": "战争" }, { "n": "韩剧", "v": "韩剧" }, { "n": "武侠", "v": "武侠" }, { "n": "言情", "v": "言情" }, { "n": "恐怖", "v": "恐怖" }, { "n": "冒险", "v": "冒险" }, { "n": "都市", "v": "都市" }, { "n": "职场", "v": "职场" }] },
            { "key": "area", "name": "地区", "value": [{ "n": "地区", "v": "" }, { "n": "大陆", "v": "中国大陆" }, { "n": "香港", "v": "中国香港" }, { "n": "韩国", "v": "韩国" }, { "n": "美国", "v": "美国" }, { "n": "日本", "v": "日本" }, { "n": "法国", "v": "法国" }, { "n": "英国", "v": "英国" }, { "n": "德国", "v": "德国" }, { "n": "台湾", "v": "中国台湾" }, { "n": "泰国", "v": "泰国" }, { "n": "印度", "v": "印度" }, { "n": "其他", "v": "其他" }] },
            { "key": "language", "name": "语言", "value": [{ "n": "全部", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "粤语", "v": "粤语" }, { "n": "英语", "v": "英语" }, { "n": "日语", "v": "日语" }, { "n": "韩语", "v": "韩语" }, { "n": "法语", "v": "法语" }, { "n": "其他", "v": "其他" }] },
            { "key": "year", "name": "年份", "value": [{ "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "10年代", "v": "2010_2019" }, { "n": "00年代", "v": "2000_2009" }, { "n": "90年代", "v": "1990_1999" }, { "n": "80年代", "v": "1980_1989" }, { "n": "更早", "v": "0_1979" }] },
            { "key": "sort", "name": "排序", "value": [{ "n": "综合", "v": "1" }, { "n": "最新", "v": "2" }, { "n": "最热", "v": "3" }, { "n": "评分", "v": "4" }] }
        ],
        "3": [
            { "key": "category", "name": "类型", "value": [{ "n": "全部", "v": "" }, { "n": "Netflix", "v": "Netflix" }, { "n": "动态漫画", "v": "动态漫画" }, { "n": "剧情", "v": "剧情" }, { "n": "动画", "v": "动画" }, { "n": "喜剧", "v": "喜剧" }, { "n": "冒险", "v": "冒险" }, { "n": "动作", "v": "动作" }, { "n": "奇幻", "v": "奇幻" }, { "n": "科幻", "v": "科幻" }, { "n": "儿童", "v": "儿童" }, { "n": "搞笑", "v": "搞笑" }, { "n": "爱情", "v": "爱情" }, { "n": "家庭", "v": "家庭" }, { "n": "短片", "v": "短片" }, { "n": "热血", "v": "热血" }, { "n": "益智", "v": "益智" }, { "n": "悬疑", "v": "悬疑" }, { "n": "经典", "v": "经典" }, { "n": "校园", "v": "校园" }, { "n": "Anime", "v": "Anime" }, { "n": "运动", "v": "运动" }, { "n": "亲子", "v": "亲子" }, { "n": "青春", "v": "青春" }, { "n": "恋爱", "v": "恋爱" }, { "n": "武侠", "v": "武侠" }, { "n": "惊悚", "v": "惊悚" }] },
            { "key": "area", "name": "地区", "value": [{ "n": "全部", "v": "" }, { "n": "日本", "v": "日本" }, { "n": "大陆", "v": "中国大陆" }, { "n": "台湾", "v": "中国台湾" }, { "n": "美国", "v": "美国" }, { "n": "香港", "v": "中国香港" }, { "n": "韩国", "v": "韩国" }, { "n": "英国", "v": "英国" }, { "n": "法国", "v": "法国" }, { "n": "德国", "v": "德国" }, { "n": "印度", "v": "印度" }, { "n": "泰国", "v": "泰国" }, { "n": "丹麦", "v": "丹麦" }, { "n": "瑞典", "v": "瑞典" }, { "n": "巴西", "v": "Brazil" }, { "n": "加拿大", "v": "加拿大" }, { "n": "俄罗斯", "v": "俄罗斯" }, { "n": "意大利", "v": "意大利" }, { "n": "比利时", "v": "比利时" }, { "n": "爱尔兰", "v": "爱尔兰" }, { "n": "西班牙", "v": "西班牙" }, { "n": "澳大利亚", "v": "澳大利亚" }, { "n": "其他", "v": "其他" }] },
            { "key": "language", "name": "语言", "value": [{ "n": "全部", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "粤语", "v": "粤语" }, { "n": "英语", "v": "英语" }, { "n": "日语", "v": "日语" }, { "n": "韩语", "v": "韩语" }, { "n": "法语", "v": "法语" }, { "n": "其他", "v": "其他" }] },
            { "key": "year", "name": "年份", "value": [{ "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "10年代", "v": "2010_2019" }, { "n": "00年代", "v": "2000_2009" }, { "n": "90年代", "v": "1990_1999" }, { "n": "80年代", "v": "1980_1989" }, { "n": "更早", "v": "0_1979" }] },
            { "key": "sort", "name": "排序", "value": [{ "n": "综合", "v": "1" }, { "n": "最新", "v": "2" }, { "n": "最热", "v": "3" }, { "n": "评分", "v": "4" }] }
        ],
        "4": [
            { "key": "category", "name": "类型", "value": [{ "n": "全部", "v": "" }, { "n": "纪录", "v": "纪录" }, { "n": "真人秀", "v": "真人秀" }, { "n": "记录", "v": "记录" }, { "n": "脱口秀", "v": "脱口秀" }, { "n": "剧情", "v": "剧情" }, { "n": "历史", "v": "历史" }, { "n": "喜剧", "v": "喜剧" }, { "n": "传记", "v": "传记" }, { "n": "相声", "v": "相声" }, { "n": "节目", "v": "节目" }, { "n": "歌舞", "v": "歌舞" }, { "n": "冒险", "v": "冒险" }, { "n": "运动", "v": "运动" }, { "n": "Season", "v": "Season" }, { "n": "犯罪", "v": "犯罪" }, { "n": "短片", "v": "短片" }, { "n": "搞笑", "v": "搞笑" }, { "n": "晚会", "v": "晚会" }] },
            { "key": "area", "name": "地区", "value": [{ "n": "全部", "v": "" }, { "n": "大陆", "v": "中国大陆" }, { "n": "香港", "v": "中国香港" }, { "n": "台湾", "v": "中国台湾" }, { "n": "美国", "v": "美国" }, { "n": "日本", "v": "日本" }, { "n": "韩国", "v": "韩国" }, { "n": "其他", "v": "其他" }] },
            { "key": "language", "name": "语言", "value": [{ "n": "全部", "v": "" }, { "n": "国语", "v": "国语" }, { "n": "粤语", "v": "粤语" }, { "n": "英语", "v": "英语" }, { "n": "日语", "v": "日语" }, { "n": "韩语", "v": "韩语" }, { "n": "法语", "v": "法语" }, { "n": "其他", "v": "其他" }] },
            { "key": "year", "name": "年份", "value": [{ "n": "全部", "v": "" }, { "n": "2025", "v": "2025" }, { "n": "2024", "v": "2024" }, { "n": "2023", "v": "2023" }, { "n": "2022", "v": "2022" }, { "n": "2021", "v": "2021" }, { "n": "2020", "v": "2020" }, { "n": "10年代", "v": "2010_2019" }, { "n": "00年代", "v": "2000_2009" }, { "n": "90年代", "v": "1990_1999" }, { "n": "80年代", "v": "1980_1989" }, { "n": "更早", "v": "0_1979" }] },
            { "key": "sort", "name": "排序", "value": [{ "n": "综合", "v": "1" }, { "n": "最新", "v": "2" }, { "n": "最热", "v": "3" }, { "n": "评分", "v": "4" }] }
        ],
        "6": [
            { "key": "category", "name": "类型", "value": [{ "n": "类型", "v": "" }, { "n": "逆袭", "v": "逆袭" }, { "n": "甜宠", "v": "甜宠" }, { "n": "虐恋", "v": "虐恋" }, { "n": "穿越", "v": "穿越" }, { "n": "重生", "v": "重生" }, { "n": "剧情", "v": "剧情" }, { "n": "科幻", "v": "科幻" }, { "n": "武侠", "v": "武侠" }, { "n": "爱情", "v": "爱情" }, { "n": "动作", "v": "动作" }, { "n": "战争", "v": "战争" }, { "n": "冒险", "v": "冒险" }, { "n": "其它", "v": "其它" }] },
            { "key": "sort", "name": "排序", "value": [{ "n": "综合", "v": "1" }, { "n": "最新", "v": "2" }, { "n": "最热", "v": "3" }] }
        ]
    }

    def init(self, extend=''):
        try:
            # 使用内置配置，如果外部有传入扩展配置则覆盖
            ext = self.default_ext.copy()
            if extend:
                external_ext = json.loads(extend)
                ext.update(external_ext)
            
            host, appid, package, channelid, version_name = (ext['host'],ext['appid'],ext['package'], ext['channelid'],ext['versionName'])
            if not(host.startswith('http') and package and channelid and version_name): return
            self.app = {'appid': appid,'package': package,'channelid': channelid,'version_name': version_name}
            self.host = host
            self.user_cache_key = f'{package}_user_e13cca1c0e630208'
            self.user = self.getCache(self.user_cache_key)
            if not(isinstance(self.user,dict)) or 'deviceid' not in self.user or 'deviceinfo' not in self.user:
                deviceid = self.random_android_id()
                uuid_ = str(uuid.uuid4())
                deviceinfo = base64.b64encode(f'{{"brand":"xiaomi","model":"xiaomi","type":"phone","resolutionX":"1600","resolutionY":"900","orientation":"1","osName":"android","osVersion":"15","osLevel":"32","abi":"arm64-v8a,armeabi-v7a,armeabi","androidId":"{deviceid}","uuid":"{uuid_}","gaid":""}}'.encode('utf-8')).decode('utf-8')
                self.user = {'deviceid': deviceid,'deviceinfo': deviceinfo}
            if not('devicecreatedat' in self.user and 'userid' in self.user and 'x-token' in self.user):
                self.login()
            path = '/v4/config/appInit.capi'
            params = {
                'os': 'android',
                'appId': self.app['appid'],
                'userLevel': '2'
            }
            response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
            data = json.loads(self.decrypt(response))
            self.vod_tabs = data['vodTabs']
            self.pic_groups = data['groups']
        except Exception as e:
            print(f"初始化失败: {e}")
            self.host = ''

    def login(self):
        if not self.host: return
        if 'userid' in self.user:
            self.user.pop('userid')
        if 'x-token' in self.user:
            self.user.pop('x-token')
        self.user['devicecreatedat'] = self.timestamp()
        path = '/user/anonymous'
        response = self.post(f'{self.host}{path}', headers=self.headers(path,'',{'apiver': 'v2'},'post'), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        uses_id = data['id']
        token = data['token']
        if uses_id and token:
            self.user['userid'], self.user['x-token'] = uses_id, token
            if True or (data['teenMode']) != '1':
                path2 = '/user/teenMode'
                params2 = {'status': '1'}
                res = self.post(f'{self.host}{path2}', data=params2,headers=self.headers(path2, params2, {'apiver': 'v2'}, 'post'), verify=False).content
                res2 = json.loads(self.decrypt(res))['data']
                if str(res2['teenMode']) != '1':
                    self.host = ''
                    return
            self.setCache(self.user_cache_key,self.user)

    def headers(self, path, params=None, header=None, method='get'):
        if header is None: header = {'x-cdn': '1'}
        sorted_params = ''
        if method == 'get' and params:
            sorted_keys = sorted(params.keys())
            sorted_params = '&'.join([f"{key}={value}" for key, value in zip(sorted_keys, [params[key] for key in sorted_keys])])
        timestamp = self.timestamp()
        deviceCreatedAt = ''
        devicecreatedat = self.user.get('devicecreatedat')
        if devicecreatedat:
            deviceCreatedAt = f"&deviceCreatedAt={self.user['devicecreatedat']}"
        sign = f"{method}|{path}|{sorted_params}|{timestamp}|appId={self.app['appid']}{deviceCreatedAt}&deviceId={self.user['deviceid']}&st=2"
        if 'userid' in self.user and self.user['userid']:
            sign += f"&userId={self.user['userid']}"
        sign += '|'
        return {
            'User-Agent': f"{self.app['package']}/{self.app['version_name']} Dalvik/2.1.0 (Linux; U; Android 12; SM-S9080 Build/3480d86.0)",
            **header,
            'appid': self.app['appid'],
            'os': 'android',
            'appversion': self.app['version_name'],
            'package': self.app['package'],
            'deviceid': '',
            'devicecreatedat': '',
            'deviceinfo': '',
            **self.user,
            'channelid': self.app['channelid'],
            'x-d-video': '1',
            'st': '2',
            'ts': timestamp,
            'sign': self.hmac_sha1(sign)
        }

    def homeContent(self, filter):
        if not self.host: return None
        classes = []
        for i in self.vod_tabs:
            if i['text'] in {bytes(b ^ 90 for b in b'\xe0\x8c\xfd\x0b').decode('big5')}:continue
            if i['index'] != 1 and i['text'] in {'短剧','电影','剧集','动漫','综艺','纪录','综艺纪录'} and i['isAdult'] == 0:
                type_id = i['channelId']
                classes.append({'type_id': type_id, 'type_name': i['text']})
        
        # 添加筛选配置
        filters = {}
        for type_id in ['1', '2', '3', '4', '6']:
            if type_id in self.filter_config:
                filters[type_id] = self.filter_config[type_id]
        
        return {'class': classes, 'filters': filters}

    def homeVideoContent(self):
        if not self.host: return None
        path = '/v4/vod/home.capi'
        params = {
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        videos = []
        fl_channel_ids = {'5'}
        for i in data['blocks']:
            for k in self.targets:
                if k in data.get('topRightLabel','None'): return None
            if str(data.get('channelId','None')) in fl_channel_ids: return None
            if any(any(target in value for item in i.get('labels',[]) for value in item.values()) for target in self.targets): continue
            if 'header' in i and i.get('_vod','').startswith('section') and isinstance(i.get('data'),list):
                for j in i.get('data',[]):
                    url = j['url']
                    if url.startswith('vod/detail?vodId=') and str(j['id']) != 0 and str(j['channelId']) != 0 and '广告' not in j['topRightLabel'] and '广告' not in j['bottomLabel'] and 'browser' not in url:
                        videos.append({
                            'vod_id': j['id'],
                            'vod_name': j['title'],
                            'vod_pic': self.pic(j['imageGroup'],j['imagePath']),
                            'vod_remarks': j['bottomLabel']
                        })
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        if not self.host: return None
        path = '/vod/channel/list.capi'
        
        # 基础参数
        params = {
            'channelId': tid,
            'sort': '3',  # 默认排序
            'category': '',
            'area': '',
            'language': '',
            'year': '',
            'next': f'page={pg}',
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        
        # 处理筛选条件
        if extend:
            # 类型筛选
            if 'category' in extend:
                params['category'] = extend['category']
            # 地区筛选
            if 'area' in extend:
                params['area'] = extend['area']
            # 语言筛选
            if 'language' in extend:
                params['language'] = extend['language']
            # 年份筛选
            if 'year' in extend:
                params['year'] = extend['year']
            # 排序筛选
            if 'sort' in extend:
                params['sort'] = extend['sort']
        
        response = self.fetch(f'{self.host}{path}',params=params, headers=self.headers(path, params), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        videos = []
        for i in data['items']:
            url = i['url']
            if url.startswith('vod/detail?vodId=') and str(i['id']) != 0 and str(i['channelId']) != 0 and '广告' not in i['topRightLabel'] and '广告' not in i['bottomLabel'] and 'browser' not in url:
                videos.append({
                    'vod_id': i['id'],
                    'vod_name': i['title'],
                    'vod_pic': self.pic(i['imageGroup'],i['imagePath']),
                    'vod_remarks': i['bottomLabel'],
                })
        return {'list': videos, 'page': pg}

    def searchContent(self, key, quick, pg='1'):
        if not self.host: return None
        path = '/vod/search/query'
        params = {
            'channelId': '0',
            'k': key,
            'next': f'page={pg}',
            'os': 'android',
            'appId': self.app['appid'],
            'userChannel': self.app['channelid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params,{'apiver':'v2'}), verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        fl_channel_ids = {'5'}
        for k in data['tabs']:
            if 'channelId' in k and 'text' in k:
                if any(m in k['text'] for m in self.targets):
                    fl_channel_ids.add(str(k['channelId']))
        videos = []
        for i in data['items']:
            url = i['url']
            if url.startswith('vod/detail?vodId=') and str(i['id']) != 0  and str(i['channelId']) != 0 and '广告' not in i['topRightLabel'] and '广告' not in i['bottomLabel'] and 'browser' not in url:
                try:
                    if str(i['channelId']) in fl_channel_ids: continue
                    if any(j in i['topRightLabel'] for j in self.targets): continue
                    if any(any(target in value for item in i['labels'] for value in item.values()) for target in self.targets): continue
                except Exception:
                    continue
                year = ''
                year_arr = i.get('year')
                if year_arr: year = year_arr.get('name',year_arr.get('id'))
                videos.append({
                    'vod_id': url.replace('vod/detail?vodId=',''),
                    'vod_name': self.html2text(i['title']),
                    'vod_pic': self.pic(i['imageGroup'],i['imagePath']),
                    'vod_remarks': i['bottomLabel'],
                    'vod_year': year,
                    'vod_content': i['summary']
                })
        return {'list': videos, 'page': pg}

    def detailContent(self, ids):
        if not self.host: return None
        path = '/v2/vod/detail.capi'
        params = {
            'vodId': ids[0],
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}',params=params, headers=self.headers(path, params),  verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        fl_channel_ids = {'5'}
        for i in self.vod_tabs:
            if str(i['isAdult']) == '1' or i['text'] in self.targets:
                fl_channel_ids.add(str(i['channelId']))
        for k in self.targets:
            if k in data['channelName'] or k in data['topRightLabel']: return None
        if str(data['channelId']) in fl_channel_ids: return None
        if any(any(target in value for item in data['labels'] for value in item.values()) for target in self.targets): return None
        
        # 移除播放源限制 - 处理所有播放源
        show, play_urls = [], []
        for i in data['playSources']:
            if i['total'] >= 1:
                if i['list']:
                    urls = []
                    for j in i['list']:
                        urls.append(f"{j['title']}${j['playUrls'][0]['url']}")
                    play_urls.append('#'.join(urls))
                else:
                    play_urls.append(self.episode(ids[0], i['siteId'], i['episodeVodId']))
                show.append(f"{i['name']}\u2005({i['siteId']})")
        
        video = {
            'vod_id': ids[0],
            'vod_name': data['title'],
            'vod_pic': self.pic(data['imageGroup'],data['imagePath']),
            'vod_remarks': data['bottomLabel'],
            'vod_year': data.get('year', []).get('name'),
            'vod_area': self.labels2str(data['area']),
            'vod_actor': self.labels2str(data['actors']),
            'vod_director': self.labels2str(data['directors']),
            'vod_content': data['summary'],
            'vod_play_from': '$$$'.join(show),
            'vod_play_url': '$$$'.join(play_urls),
            'type_name': self.labels2str(data['labels'])
        }
        return {'list': [video]}

    def playerContent(self, flag, id, vipflags):
        return { 'jx': 0, 'parse': 0, 'url': id, 'header': {'User-Agent': 'com.salmon.film.app.start.App/3.3.9 (Linux;Android 12) AndroidXMedia3/1.6.1','Accept-Encoding': 'gzip','Connection': 'Keep-Alive'}}

    def episode(self,video_id,site_id,episode_id):
        path = '/v2/vod/episodes.capi'
        try:
            params = {
                'vodId': video_id,
                'siteId': site_id,
                'episodeVodId': episode_id,
                'os': 'android',
                'appId': self.app['appid'],
                'userLevel': '2'
            }
            response = self.fetch(f'{self.host}{path}', params=params, headers=self.headers(path, params), verify=False).content
            data = self.decrypt(response)
            data = json.loads(data)['data']
            urls = []
            for i in data:
                urls.append(f"{i['title']}${i['playUrls'][0]['url']}")
            play_urls = '#'.join(urls)
        except Exception:
            play_urls = ''
        return play_urls

    # 调试方法：查看所有播放源
    def debug_play_sources(self, vod_id):
        """调试方法：查看视频的所有播放源信息"""
        path = '/v2/vod/detail.capi'
        params = {
            'vodId': vod_id,
            'os': 'android',
            'appId': self.app['appid'],
            'userLevel': '2'
        }
        response = self.fetch(f'{self.host}{path}',params=params, headers=self.headers(path, params),  verify=False).content
        data = self.decrypt(response)
        data = json.loads(data)['data']
        
        print("=== 所有播放源信息 ===")
        print(f"视频ID: {vod_id}")
        print(f"视频标题: {data['title']}")
        print(f"播放源数量: {len(data['playSources'])}")
        print()
        
        for i, source in enumerate(data['playSources']):
            print(f"播放源 {i+1}:")
            print(f"  名称: {source['name']}")
            print(f"  siteId: {source['siteId']}")
            print(f"  剧集数量: {source['total']}")
            print(f"  是否有列表: {'是' if source['list'] else '否'}")
            print(f"  episodeVodId: {source.get('episodeVodId', '无')}")
            
            if source['list']:
                print("  剧集列表:")
                for j, episode in enumerate(source['list']):
                    print(f"    {j+1}. {episode['title']} - {episode['playUrls'][0]['url']}")
            print("---")
        
        return data

    def decrypt(self, data):
        cipher = AES.new('ayt5wy5afwmwrpb19k9s3psx3dymyd0n'.encode('utf-8'), AES.MODE_CBC, 'b3t069ijy7pirw0j'.encode('utf-8'))
        decrypted_bytes = cipher.decrypt(data)
        decrypted_bytes = unpad(decrypted_bytes, AES.block_size)
        return decrypted_bytes.decode('utf-8')

    def hmac_sha1(self, data):
        hmac_obj = hmac.new('ksggsr4tp6difdo1c3im8fqd3g'.encode('utf-8'), data.encode('utf-8'), hashlib.sha1)
        return hmac_obj.hexdigest()

    def labels2str(self,data):
        labels = []
        if isinstance(data,list):
            for i in data:
                label = i.get('name', i.get('id'))
                if label: labels.append(label)
        return ','.join(labels)

    def pic(self,group,path):
        for i in self.pic_groups:
            if i['id'] == group:
                return f"{i['url'][0]['domain']}{path}"
        return f'https://vres.fnqty.com/vod1{path}'

    def html2text(self,html_str):
        extractor = _HTMLTextExtractor()
        extractor.feed(html_str)
        return extractor.get_text()

    def random_android_id(self):
        hex_chars = '0123456789abcdef'
        return ''.join(random.choice(hex_chars) for _ in range(16))

    def timestamp(self):
        return str(int(time.time() * 1000))

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    def localProxy(self, param):
        pass

if __name__ == "__main__":
    sp = Spider()
    formatJo = sp.init()  # 初始化，现在不需要传入extend参数了
    
    # 测试播放源调试功能
    # vod_id = "195930"  # 替换为你要测试的视频ID
    # sp.debug_play_sources(vod_id)
    
    # formatJo = sp.homeContent(False) # 筛选分类(首页 可选)
    # formatJo = sp.homeVideoContent() # (首页 可选)
    # formatJo = sp.searchContent("仙逆",False,'2') # 搜索
    # formatJo = sp.categoryContent('1', '1', False, {}) # 分类
    # formatJo = sp.detailContent(['195930']) # 详情  异常：88051
    # formatJo = sp.playerContent("","https://107.148.194.118:21306/data3/jvods/hls/dhz/4/3361/24121023/3_195930_7779/1920/index.m3u8?appId=dsdy&sign=758726ec1dd41a394fe3b5b65ab504c1&timestamp=1760847330&ref=1",{}) # 播放
    # formatJo = sp.localProxy({"":""}) # 代理
    print(formatJo)
