var rule = {
    title: '柏彩影视',
    host: 'https://bcvod.com',
    url: '/vodshow/fyfilter.html',
    filterable: 1,
    filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
    filter: {
        // ... 这里省略了filter的具体内容，您原来的filter很长，不需要改动
    },
    filter_def:{
        dianying:{cateId:'dianying',by:'time'},
        dianshiju:{cateId:'dianshiju',by:'time'},
        zongyi:{cateId:'zongyi',by:'time'},
        dongman:{cateId:'dongman',by:'time'},
        duanju:{cateId:'duanju',by:'time'}
    },
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    },
    class_name:'电影&电视剧&综艺&动漫&短剧',
    class_url:'dianying&dianshiju&zongyi&dongman&duanju',
    play_parse: true,
    lazy: `js:
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };
        var html = request(input, {headers: headers});
        if (html.includes('Just a moment')) {
            // 如果遇到Cloudflare验证，尝试使用一个反代服务
            // 注意：这个反代服务需要您自己搭建或寻找可用的
            var proxy_url = 'https://your-proxy-service.com/?url=' + encodeURIComponent(input);
            html = request(proxy_url, {headers: headers});
        }
        var match = html.match(/r player_.*?=(.*?)</);
        if (match) {
            var url = JSON.parse(match[1]).url;
            if (url.indexOf('http') == -1) {
                var player_html = request('https://adys.tv/player/?url=' + url, {headers: headers});
                var player_match = player_html.match(/url":.*?['"](.*?)['"]/);
                if (player_match) {
                    input = player_match[1];
                } else {
                    input = '';
                }
            } else {
                input = url;
            }
        } else {
            input = '';
        }
    `,
    推荐: '*',
    一级:'.vodlist.vodlist_wi li;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
    二级: {
        "title": "h1&&Text;li.data--span:eq(0)&&Text",
        "img": ".bgi.lazyload&&data-background-image",
        "desc": "li.data:eq(4)&&Text;;;li.data--span:eq(3)&&Text;li.data--span:eq(2)&&Text",
        "content": ".full_text&&span&&Text",
        "tabs": ".play_source_tab&&a",
        "lists": ".play_list_box:eq(#id)&&.content_playlist li"
    },
    搜索: '.vodlist.clearfix li.vodlist_item;*;*;*;*',
}
