var rule = {
    title: '柏彩影视',
    host: 'https://bcvod.com',
    url: '/vodshow/fyfilter.html',
    filterable: 1,
    filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
    
    // Cloudflare绕过配置
    cf_config: `js:
        var cf_config = {
            enabled: true,
            max_retries: 3,
            delay_between_retries: 3000,
            use_proxy: true,
            proxies: [
                'https://corsproxy.io/?',
                'https://api.codetabs.com/v1/proxy?quest='
            ],
            user_agents: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
            ]
        };
        
        function smartRequest(url, options = {}) {
            var retryCount = 0;
            var lastError = null;
            
            while (retryCount < cf_config.max_retries) {
                try {
                    var headers = options.headers || {};
                    headers['User-Agent'] = cf_config.user_agents[retryCount % cf_config.user_agents.length];
                    
                    // 第一次尝试直接请求
                    if (retryCount === 0) {
                        var response = request(url, { headers: headers, timeout: 10000 });
                        if (!response.includes('Just a moment')) {
                            return response;
                        }
                    }
                    
                    // 后续尝试使用代理
                    if (cf_config.use_proxy && cf_config.proxies.length > 0) {
                        var proxyIndex = retryCount % cf_config.proxies.length;
                        var proxyUrl = cf_config.proxies[proxyIndex] + encodeURIComponent(url);
                        
                        headers['Referer'] = 'https://www.google.com/';
                        headers['Origin'] = 'https://www.google.com';
                        
                        var response = request(proxyUrl, {
                            headers: headers,
                            timeout: 15000
                        });
                        
                        if (response && !response.includes('Just a moment')) {
                            return response;
                        }
                    }
                    
                    // 等待后重试
                    if (retryCount < cf_config.max_retries - 1) {
                        java.lang.Thread.sleep(cf_config.delay_between_retries);
                    }
                    
                } catch (e) {
                    lastError = e;
                }
                retryCount++;
            }
            
            print('所有绕过尝试均失败: ' + (lastError || '未知错误'));
            return null;
        }
    `,
    
    // 修改一级分类
    一级: `js:
        eval(cf_config);
        
        try {
            var category = TABS[CLASS.tabIndex] || CLASS.tabUrl;
            var page = PAGE || 1;
            var url = HOST + '/vodshow/' + category + '--------' + page + '---.html';
            
            print('正在获取分类: ' + category + ', 页码: ' + page);
            
            var html = smartRequest(url);
            
            if (!html) {
                // 最终备用方案
                html = request(url);
            }
            
            if (html && html.includes('vodlist')) {
                var data = [];
                var items = pdfa(html, '.vodlist.vodlist_wi li');
                for (var i = 0; i < items.length; i++) {
                    try {
                        var item = items[i];
                        data.push({
                            title: pdfh(item, 'a&&title'),
                            pic_url: pdfh(item, '.lazyload&&data-original'),
                            desc: pdfh(item, '.pic_text&&Text'),
                            url: pdfh(item, 'a&&href')
                        });
                    } catch (e) {
                        continue;
                    }
                }
                return JSON.stringify(data);
            }
            
            return '[]';
        } catch (e) {
            print('一级分类错误: ' + e);
            return '[]';
        }
    `,
    
    // 修改搜索
    搜索: `js:
        eval(cf_config);
        
        try {
            var keyword = encodeURIComponent(KEY);
            var page = PAGE || 1;
            var url = HOST + '/vodsearch/' + keyword + '----------' + page + '---.html';
            
            var html = smartRequest(url);
            
            if (html) {
                var data = [];
                var items = pdfa(html, '.vodlist.clearfix li.vodlist_item');
                items.forEach(function(item) {
                    try {
                        data.push({
                            title: pdfh(item, 'a&&title'),
                            pic_url: pdfh(item, '.lazyload&&data-original'),
                            desc: pdfh(item, '.pic_text&&Text'),
                            url: pdfh(item, 'a&&href')
                        });
                    } catch (e) {}
                });
                return JSON.stringify(data);
            }
            return '[]';
        } catch (e) {
            return '[]';
        }
    `,
    
    // 原有的filter、二级等配置保持不变...
    filter: {
        // ... 你的filter配置
    },
    
    二级: {
        "title": "h1&&Text;li.data--span:eq(0)&&Text",
        "img": ".bgi.lazyload&&data-background-image",
        "desc": "li.data:eq(4)&&Text;;;li.data--span:eq(3)&&Text;li.data--span:eq(2)&&Text",
        "content": ".full_text&&span&&Text",
        "tabs": ".play_source_tab&&a",
        "lists": ".play_list_box:eq(#id)&&.content_playlist li"
    },
    
    // 修改lazy加载，也可能需要绕过
    lazy: `js:
        eval(cf_config);
        
        try {
            // 原有的解析逻辑
            var html = smartRequest(input);
            if (!html) html = request(input);
            
            var match = html.match(/r player_.*?=(.*?)</);
            if (match) {
                var url = JSON.parse(match[1]).url;
                if (url.indexOf('http') == -1) {
                    var player_html = smartRequest('https://adys.tv/player/?url=' + url);
                    if (!player_html) player_html = request('https://adys.tv/player/?url=' + url);
                    var player_match = player_html.match(/url":.*?['"](.*?)['"]/);
                    if (player_match) {
                        input = player_match[1];
                    }
                } else {
                    input = url;
                }
            }
        } catch (e) {
            print('lazy解析错误: ' + e);
        }
    `,
};
