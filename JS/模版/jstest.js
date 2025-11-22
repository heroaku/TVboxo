var rule = {
    title: '易看影院',
    host: 'https://www.ece8.com',
    homeUrl: '/',
    url: '/type/fyclass.html?page=fypage',
    searchUrl: '/search.html?wd=**',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
    class_parse: '.nav-swiper a:gt(0):lt(5);em;;',
    play_parse: true,
    lazy: function () {
        var html = request(input);
        // 提取播放页中的 player_aaaa 对象
        var match = html.match(/var player_aaaa=\{([\s\S]*?)\};/);
        if (match) {
            var dataStr = '{' + match[1] + '}';
            try {
                var player = JSON.parse(dataStr.replace(/\\/g, ''));
                var m3u8 = player.url;
                if (m3u8) {
                    // 自动添加 Referer
                    input = {
                        jx: 0,
                        url: m3u8,
                        parse: 0,
                        header: {
                            'Referer': 'https://www.ece8.com/',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    };
                    return;
                }
            } catch (e) {
                log('解析 player_aaaa 失败: ' + e.message);
            }
        }
        // 备用：从 iframe 中提取
        var iframeMatch = html.match(/<iframe[^>]*src="([^"]*ffzy[^"]*)"/);
        if (iframeMatch) {
            var iframeUrl = iframeMatch[1];
            if (iframeUrl.startsWith('//')) iframeUrl = 'https:' + iframeUrl;
            var iframeHtml = request(iframeUrl);
            var m3u8Match = iframeHtml.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/);
            if (m3u8Match) {
                input = {
                    jx: 0,
                    url: m3u8Match[0],
                    parse: 0,
                    header: {
                        'Referer': 'https://www.ece8.com/',
                        'User-Agent': 'Mozilla/5.0'
                    }
                };
                return;
            }
        }
        log('未找到有效视频流');
    },
    // 列表解析：从 /movie/xxx.html 页面提取剧集
    detailUrl: '/movie/fyid.html',
    detail_parse: function (doc, args) {
        let vod = {
            vod_id: args.id,
            vod_name: doc.select('.slide-info-title').text(),
            vod_pic: doc.select('.detail-pic img').attr('data-src') || doc.select('.detail-pic img').attr('src'),
            vod_remarks: doc.select('.slide-info:contains(备注) .slide-info-remarks').text(),
            vod_content: doc.select('#height_limit').text().trim(),
        };

        // 提取演员、导演等
        vod.vod_actor = doc.select('.slide-info:contains(演员) a').map((i, el) => el.text()).join(',');
        vod.vod_director = doc.select('.slide-info:contains(导演) a').map((i, el) => el.text()).join(',');
        vod.vod_year = doc.select('.slide-info-remarks a[href*="/year/"]').first().text();

        // 提取播放列表（多线路）
        let tabs = [];
        let lists = [];
        let tabEls = doc.select('.anthology-tab a');
        let listBoxes = doc.select('.anthology-list-box');

        tabEls.each((i, tab) => {
            let tabName = tab.text().replace(/[\[\]【】\s]/g, '').replace(/\d+$/g, '').trim();
            if (!tabName) return;
            tabs.push(tabName);
            let list = [];
            listBoxes.eq(i).select('a').each((j, a) => {
                let title = a.text().trim();
                let href = a.attr('href');
                if (href && title) list.push(title + '$$$' + href);
            });
            lists.push(list.join('#'));
        });

        vod.vod_play_from = tabs.join('$$$');
        vod.vod_play_url = lists.join('$$$');

        return JSON.stringify({
            list: [vod]
        });
    },

    // 首页推荐解析
    home_parse: function (doc, args) {
        let cards = doc.select('.public-list-box');
        let videos = [];
        cards.each((i, card) => {
            let name = card.select('.time-title').attr('title') || card.select('.time-title').text();
            let id = card.select('a.public-list-exp').attr('href');
            if (!id || !name) return;
            id = id.replace(/.*?\/movie\/(\d+)\.html.*/, '$1');
            let pic = card.select('img').attr('data-src') || card.select('img').attr('src');
            videos.push({
                vod_id: id,
                vod_name: name,
                vod_pic: pic,
            });
        });
        return JSON.stringify({
            list: videos
        });
    }
};
