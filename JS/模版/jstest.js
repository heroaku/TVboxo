var rule = {
    title: '3Q影视',
    host: 'https://qqqys.com/',
    url: 'https://qqqys.com/',
    searchUrl: 'https://qqqys.com/index.php?m=vod-search&wd=**----------&page=fypage',
    searchable: 2, //是否启用全局搜索
    quickSearch: 0, //是否启用快速搜索
    filterable: 0, //是否启用分类筛选
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    class_parse: '.nav-item:gt(0):lt(5);a&&Text;a&&href;.*/(.*?)\\.html',
    play_parse: true,
    lazy: `js:
            let html = request(input);
            let hconf = html.match(/r player_.*?=(.*?)</)[1];
            let json = JSON5.parse(hconf);
            let url = json.url;
            if (json.encrypt == '1') {
                url = unescape(url);
            } else if (json.encrypt == '2') {
                url = unescape(base64Decode(url));
            }
            if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
                input = {
                    parse: 0,
                    jx: 0,
                    url: url,
                };
            } else {
                input;
            }`,
    limit: 6,
    推荐: '.module-item;li;a&&title;.lazyload&&data-original;.module-item-desc&&Text;a&&href',
    double: true, // 推荐内容是否双层定位
    一级: '.module-item li;a&&title;a&&data-original;.module-item-desc&&Text;a&&href',
    二级: {
        "title": "h1&&Text",
        "img": ".poster-img .lazyload&&data-original",
        "desc": ".info-item:eq(0)&&Text;.info-item:eq(1)&&Text;.info-item:eq(2)&&Text;.info-item:eq(3)&&Text;.info-item:eq(4)&&Text",
        "content": ".intro-content&&Text",
        "tabs": ".play-tabs li",
        "lists": ".play-list:eq(#id) li"
    },
    搜索: '.module-item;a&&title;.lazyload&&data-original;.module-item-desc&&Text;a&&href;.info&&p:eq(0) p&&Text',
    // 分类映射
    电影: 'https://qqqys.com/index.php?m=vod-type-id-1.html',
    剧集: 'https://qqqys.com/index.php?m=vod-type-id-2.html',
    动漫: 'https://qqqys.com/index.php?m=vod-type-id-3.html',
    综艺: 'https://qqqys.com/index.php?m=vod-type-id-4.html',
    短剧: 'https://qqqys.com/index.php?m=vod-type-id-5.html'
}
