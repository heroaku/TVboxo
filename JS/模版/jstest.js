var rule = {
    title: '奈飞工厂',
    host: 'https://www.netflixgc.com',
    模板:'短视2',
    searchUrl: '/vodsearch/**-------------/',
    url:'/index.php/api/vod#type=fyclass&page=fypage',
    detailUrl:'/detail/fyid.html',
    searchable: 2,
    quickSearch: 1,
    filterable:0,
    headers: {
        'Cookie': 'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; user_id=10992; user_name=yuanzl77; group_id=2; group_name=NXVIP; user_check=e59a37f5a4fec0072cb512869352f402; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.netflixgc.com/'
    },
    
    class_name: '电影&连续剧&纪录片&漫剧&综艺&伦理',
    class_url: '1&2&24&3&23&30',

    // 尝试多种API接口
    一级:`js:
        log('开始获取视频数据，输入参数: ' + input);
        
        // 方法1: 原始API接口
        try {
            let url_parts = input.split("#");
            let api_url = url_parts[0];
            let params = url_parts[1];
            
            let t = Math.round(new Date / 1e3).toString();
            let key = md5("DS" + t + "DCC147D11943AF75");
            let body = params + "&time=" + t + "&key=" + key;
            
            log('API URL: ' + api_url);
            log('请求参数: ' + body);
            
            let fetch_params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Cookie': rule.headers.Cookie,
                    'Referer': rule.host
                },
                body: body
            };
            
            let html = post(api_url, fetch_params);
            log('API返回数据: ' + html.substring(0, 200));
            
            if (html && html.includes('list')) {
                let data = JSON.parse(html);
                if (data.list && data.list.length > 0) {
                    VODS = data.list.map(function(it) {
                        it.vod_pic = it.vod_pic ? it.vod_pic.replace(/mac/, "https") : '';
                        return it;
                    });
                    log('成功获取 ' + VODS.length + ' 个视频');
                    return;
                }
            }
        } catch(e) {
            log('方法1失败: ' + e.message);
        }
        
        // 方法2: 备用API格式
        try {
            let type_id = input.split("type=")[1].split("&")[0];
            let page = input.split("page=")[1];
            
            let api_url = rule.host + '/api.php/provide/vod/?ac=list&t=' + type_id + '&pg=' + page;
            log('尝试备用API: ' + api_url);
            
            let html = request(api_url, {
                headers: rule.headers
            });
            
            if (html && html.includes('list')) {
                let data = JSON.parse(html);
                VODS = data.list || [];
                log('备用API成功获取 ' + VODS.length + ' 个视频');
                return;
            }
        } catch(e) {
            log('方法2失败: ' + e.message);
        }
        
        // 方法3: 直接解析HTML页面（如果API都失败）
        try {
            let type_id = input.split("type=")[1].split("&")[0];
            let page = input.split("page=")[1];
            let list_url = rule.host + '/vodshow/' + type_id + '----------' + page + '---.html';
            
            log('尝试解析HTML页面: ' + list_url);
            
            let html = request(list_url, {
                headers: rule.headers
            });
            
            // 解析HTML中的视频列表
            let items = pdfa(html, '.public-list-exp');
            VODS = [];
            items.forEach(function(item) {
                let vod_name = pdfh(item, 'a&&title');
                let vod_pic = pdfh(item, 'img&&data-src') || pdfh(item, 'img&&src');
                let vod_remarks = pdfh(item, '.ft2&&Text');
                let vod_id = pdfh(item, 'a&&href').match(/\/(\d+)\.html/)[1];
                
                if (vod_name && vod_id) {
                    VODS.push({
                        vod_name: vod_name,
                        vod_pic: vod_pic,
                        vod_remarks: vod_remarks,
                        vod_id: vod_id
                    });
                }
            });
            
            log('HTML解析获取 ' + VODS.length + ' 个视频');
        } catch(e) {
            log('所有方法都失败: ' + e.message);
            VODS = [];
        }
        
        if (VODS.length === 0) {
            log('未获取到任何视频数据，请检查网络或网站状态');
        }
     `,

    lazy:`js:
        try {
            let html = request(input);
            let player_data = html.match(/r player_.*?=(.*?)</);
            if (player_data && player_data[1]) {
                var player_info = JSON.parse(player_data[1]);
                var url = player_info.url;
                var from = player_info.from;
                
                if (player_info.encrypt == '1') {
                    url = unescape(url);
                } else if (player_info.encrypt == '2') {
                    url = unescape(base64Decode(url));
                }
                
                if (/.m3u8|.mp4/.test(url)) {
                    input = url;
                } else {
                    let config_js = request(rule.host + '/static/js/playerconfig.js');
                    eval(config_js.replace('var Mac','Mac'));
                    let parse_url = MacPlayerConfig.player_list[from].parse;
                    input = {
                        jx: 0,
                        url: parse_url + url,
                        parse: 1,
                        header: JSON.stringify({
                            'referer': rule.host
                        })
                    };
                }
            } else {
                log('未找到播放信息');
                input = '';
            }
        } catch(e) {
            log('解析播放地址失败: ' + e.message);
            input = '';
        }
     `,
    limit: 6,
    tab_exclude:'SN|KK|LS|阿里|夸克',
    double: false,
    推荐: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
    搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href'
}
