var rule = {
    title: '奈飞工厂',
    host: 'https://www.netflixgc.com',
    模板:'短视2',
    searchUrl: '/vodsearch/**----------fyfilter---/',
    url:'/vodshow/fyclass----------fypage---.html',
    detailUrl:'/detail/fyid.html',
    searchable: 2,
    quickSearch: 1,
    filterable:0,
    
    // Cookie自动更新函数
    getCookie: `js:
        try {
            // 尝试从本地存储获取Cookie
            let storedCookie = localStorage.getItem('netflixgc_cookie');
            let storedTime = localStorage.getItem('netflixgc_cookie_time');
            let currentTime = new Date().getTime();
            
            // 如果Cookie存在且未过期（30分钟内），则使用存储的Cookie
            if (storedCookie && storedTime && (currentTime - parseInt(storedTime)) < 30 * 60 * 1000) {
                log('使用缓存的Cookie');
                storedCookie;
            } else {
                log('获取新的Cookie...');
                // 访问首页获取新的Cookie
                let html = request(rule.host, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });
                
                // 从响应头中提取Cookie
                let responseHeaders = JSON.parse(request(rule.host, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}}).headers);
                let newCookie = responseHeaders['Set-Cookie'] || '';
                
                if (newCookie) {
                    // 处理多个Cookie
                    let cookies = [];
                    if (Array.isArray(newCookie)) {
                        cookies = newCookie;
                    } else {
                        cookies = [newCookie];
                    }
                    
                    // 提取重要的Cookie字段
                    let cookieStr = '';
                    cookies.forEach(cookie => {
                        let match = cookie.match(/(PHPSESSID=[^;]+)/);
                        if (match) cookieStr += match[1] + '; ';
                        
                        match = cookie.match(/(ecPopup=[^;]+)/);
                        if (match) cookieStr += match[1] + '; ';
                        
                        match = cookie.match(/(_funcdn_token=[^;]+)/);
                        if (match) cookieStr += match[1] + '; ';
                    });
                    
                    // 如果没有获取到关键Cookie，使用默认值
                    if (!cookieStr.includes('PHPSESSID')) {
                        cookieStr = 'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; ';
                    }
                    
                    // 存储Cookie和时间戳
                    localStorage.setItem('netflixgc_cookie', cookieStr);
                    localStorage.setItem('netflixgc_cookie_time', currentTime.toString());
                    log('新Cookie获取成功: ' + cookieStr.substring(0, 50) + '...');
                    cookieStr;
                } else {
                    log('未能获取新Cookie，使用默认值');
                    'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; ';
                }
            }
        } catch(e) {
            log('Cookie获取失败: ' + e.message);
            'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; ';
        }
    `,
    
    // 动态获取headers，包含自动更新的Cookie
    headers: `js:
        {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.netflixgc.com/',
            'Cookie': rule.getCookie
        }
    `,
    
    class_name: '电影&连续剧&纪录片&漫剧&综艺&伦理',
    class_url: '1&2&24&3&23&30',

    // 一级分类数据获取
    一级:`js:
        log('开始获取视频数据，URL: ' + input);
        
        try {
            let html = request(input, {
                headers: rule.headers
            });
            
            // 检查是否被Cloudflare拦截
            if (html.includes('Just a moment') || html.includes('Enable JavaScript')) {
                log('页面被Cloudflare拦截，清除Cookie并重试...');
                // 清除过期的Cookie
                localStorage.removeItem('netflixgc_cookie');
                localStorage.removeItem('netflixgc_cookie_time');
                
                // 重新获取页面
                html = request(input, {
                    headers: rule.headers
                });
            }
            
            VODS = [];
            
            if (!html.includes('Just a moment')) {
                // 解析视频列表
                let items = pdfa(html, '.public-list-exp');
                log('找到 ' + items.length + ' 个视频项目');
                
                items.forEach(function(item, index) {
                    try {
                        let vod_name = pdfh(item, 'a&&title') || pdfh(item, 'a&&Text');
                        let vod_pic = pdfh(item, 'img&&data-src') || pdfh(item, 'img&&src');
                        let vod_remarks = pdfh(item, '.ft2&&Text') || '';
                        let vod_url = pdfh(item, 'a&&href');
                        let vod_id = '';
                        
                        // 从URL提取ID
                        if (vod_url) {
                            let idMatch = vod_url.match(/\/(\d+)\.html/);
                            if (idMatch) vod_id = idMatch[1];
                        }
                        
                        if (vod_name && vod_id) {
                            // 处理图片URL
                            if (vod_pic && !vod_pic.startsWith('http')) {
                                vod_pic = rule.host + vod_pic;
                            }
                            
                            VODS.push({
                                vod_name: vod_name.trim(),
                                vod_pic: vod_pic,
                                vod_remarks: vod_remarks,
                                vod_id: vod_id
                            });
                        }
                    } catch(itemError) {
                        log('解析第 ' + index + ' 个项目失败: ' + itemError.message);
                    }
                });
                
                log('成功解析 ' + VODS.length + ' 个视频');
            } else {
                log('仍然被Cloudflare拦截，无法获取数据');
                VODS = [];
            }
        } catch(e) {
            log('获取视频数据失败: ' + e.message);
            VODS = [];
        }
     `,

    // 播放地址解析
    lazy:`js:
        log('开始解析播放地址: ' + input);
        try {
            let html = request(input, {
                headers: rule.headers
            });
            
            // 查找播放器数据
            let player_data = html.match(/r player_.*?=(.*?)</);
            if (player_data && player_data[1]) {
                log('找到播放器数据');
                let player_info = JSON.parse(player_data[1]);
                let url = player_info.url;
                let from = player_info.from;
                
                // 解密URL
                if (player_info.encrypt == '1') {
                    url = unescape(url);
                } else if (player_info.encrypt == '2') {
                    url = unescape(base64Decode(url));
                }
                
                log('解密后URL: ' + url.substring(0, 100) + '...');
                
                // 如果是直接视频链接
                if (/.m3u8|.mp4/.test(url)) {
                    input = url;
                } else {
                    // 获取播放器配置
                    let config_js = request(rule.host + '/static/js/playerconfig.js', {
                        headers: rule.headers
                    });
                    eval(config_js.replace('var Mac','Mac'));
                    let parse_url = MacPlayerConfig.player_list[from].parse;
                    
                    input = {
                        jx: 0,
                        url: parse_url + url,
                        parse: 1,
                        header: JSON.stringify({
                            'referer': rule.host,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
    
    limit: 20,
    tab_exclude:'SN|KK|LS|阿里|夸克',
    double: false,
    推荐: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
    搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href'
}
