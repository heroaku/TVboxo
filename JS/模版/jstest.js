var rule = {
    title: '奈飞工厂',
    host: 'https://www.netflixgc.com',
    searchUrl: '/vodsearch/**-------------/',
    url:'/index.php/api/vod#type=fyclass&page=fypage',
    detailUrl:'/detail/fyid.html',
    searchable: 2,
    quickSearch: 1,
    filterable:0,
    headers: {
        'Cookie': 'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; user_id=10992; user_name=yuanzl77; group_id=2; group_name=NXVIP; user_check=e59a37f5a4fec0072cb512869352f402; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png',
        'User-Agent': 'MOBILE_UA'
    },
    
    // 分类URL抓取
    cateUrl: '/',
    cateSelector: '.head-nav a[href*="/vodshow/"]',
    cateParse: `
        js:
        let cateObjs = [];
        let elements = pdfa(html, '.head-nav a[href*="/vodshow/"]');
        elements.forEach(element => {
            let href = pdfh(element, 'a&&href');
            let title = pdfh(element, 'a&&Text').replace(/\\s+/g, '');
            
            // 过滤掉非分类链接
            if (href && href.includes('/vodshow/') && title && !title.includes('更多')) {
                // 从URL中提取分类ID
                let cateId = href.match(/\\/vodshow\\/(\\d+)/);
                if (cateId && cateId[1]) {
                    cateObjs.push({
                        title: title,
                        url: '/vodshow/' + cateId[1] + '-----------.html'
                    });
                }
            }
        });
        
        // 去重处理
        let uniqueCates = [];
        let seen = new Set();
        cateObjs.forEach(item => {
            if (!seen.has(item.title)) {
                seen.add(item.title);
                uniqueCates.push(item);
            }
        });
        
        // 输出分类信息用于调试
        print('发现分类数量: ' + uniqueCates.length);
        uniqueCates.forEach(cate => {
            print('分类: ' + cate.title + ' -> ' + cate.url);
        });
        
        JSON.stringify(uniqueCates);
    `,
    
    // 分类映射（从抓取结果生成）
    get_class: `
        js:
        let cates = [];
        try {
            let response = request(rule.cateUrl, {headers: rule.headers});
            let cateData = JSON.parse(rule.cateParse.replace('js:', '').replace('pdfa', 'pdfa').replace('pdfh', 'pdfh'));
            cateData.forEach(item => {
                cates.push(item.title);
            });
        } catch(e) {
            print('分类抓取失败: ' + e.message);
            // 备用分类
            cates = ['电影', '连续剧', '纪录片', '漫剧', '综艺', '伦理'];
        }
        cates;
    `,
    
    get_class_url: `
        js:
        let cateUrls = [];
        try {
            let response = request(rule.cateUrl, {headers: rule.headers});
            let cateData = JSON.parse(rule.cateParse.replace('js:', '').replace('pdfa', 'pdfa').replace('pdfh', 'pdfh'));
            cateData.forEach(item => {
                // 提取分类ID用于API调用
                let cateId = item.url.match(/\\/vodshow\\/(\\d+)/);
                if (cateId && cateId[1]) {
                    cateUrls.push(cateId[1]);
                }
            });
        } catch(e) {
            print('分类URL抓取失败: ' + e.message);
            // 备用分类ID
            cateUrls = ['1', '2', '24', '3', '23', '30'];
        }
        cateUrls;
    `,

    lazy:`js:
        var html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        var url = html.url;
        var from = html.from;
        var MacPlayerConfig={};
        if (html.encrypt == '1') {
            url = unescape(url)
        } else if (html.encrypt == '2') {
            url = unescape(base64Decode(url))
        }
        if (/.m3u8|.mp4/.test(url)) {
            input = url
        } else {
        eval(fetch(HOST + "/static/js/playerconfig.js").replace('var Mac','Mac'));
        var list = MacPlayerConfig.player_list[from].parse;
            input={
                jx:0,
                url:list+url,
                parse:1,
                header: JSON.stringify({
                    'referer': HOST
                })
            }
        }
     `,
    limit: 6,
    class_name:'电影&连续剧&纪录片&漫剧&综艺&伦理',
    class_url:'1&2&24&3&23&30',
    tab_exclude:'SN|KK|LS|阿里|夸克',
    double: false,
    推荐: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
    一级:`js:
        let body = input.split("#")[1];
        let t = Math.round(new Date / 1e3).toString();
        let key = md5("DS" + t + "DCC147D11943AF75");
        let url = input.split("#")[0];
        body = body + "&time=" + t + "&key=" + key;
        print(body);
        fetch_params.body = body;
        let html = post(url, fetch_params);
        let data = JSON.parse(html);
        VODS = data.list.map(function(it) {
            it.vod_pic = it.vod_pic.replace(/mac/, "https");
            return it
        });
     `,
    搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href'
}
