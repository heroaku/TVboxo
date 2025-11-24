var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
    url: '/show/fyclass/',
    filter_url: 'area/{{fl.area}}/class/{{fl.class}}/year/{{fl.year}}',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: { 'User-Agent': MOBILE_UA },

    class_name: '电影&电视剧&综艺&动漫&短剧&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&duanju&jilupian',

    filter: {
        "duanju": [
            {
                "key": "class",
                "name": "类型",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "重生民国", "v": "重生民国" },
                    { "n": "穿越年代", "v": "穿越年代" },
                    { "n": "现代言情", "v": "现代言情" },
                    { "n": "反转爽剧", "v": "反转爽剧" },
                    { "n": "女频恋爱", "v": "女频恋爱" }
                ]
            },
            {
                "key": "area",
                "name": "地区",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "大陆", "v": "大陆" },
                    { "n": "中国大陆", "v": "中国大陆" }
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "2025", "v": "2025" },
                    { "n": "2024", "v": "2024" }
                ]
            }
        ],
        "jilupian": [
            {
                "key": "area",
                "name": "地区",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "中国大陆", "v": "中国大陆" },
                    { "n": "美国", "v": "美国" },
                    { "n": "英国", "v": "英国" },
                    { "n": "日本", "v": "日本" },
                    { "n": "韩国", "v": "韩国" }
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "2025", "v": "2025" },
                    { "n": "2024", "v": "2024" }
                ]
            }
        ],
        "dianshiju": [
            {
                "key": "area",
                "name": "地区",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "大陆", "v": "大陆" },
                    { "n": "韩国", "v": "韩国" },
                    { "n": "美国", "v": "美国" },
                    { "n": "日本", "v": "日本" },
                    { "n": "香港", "v": "香港" },
                    { "n": "台湾", "v": "台湾" }
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "2025", "v": "2025" },
                    { "n": "2024", "v": "2024" }
                ]
            }
        ],
        "dianying": [
            {
                "key": "area",
                "name": "地区",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "中国大陆", "v": "中国大陆" },
                    { "n": "美国", "v": "美国" },
                    { "n": "韩国", "v": "韩国" },
                    { "n": "日本", "v": "日本" },
                    { "n": "香港", "v": "香港" },
                    { "n": "台湾", "v": "台湾" }
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    { "n": "全部", "v": "" },
                    { "n": "2025", "v": "2025" },
                    { "n": "2024", "v": "2024" }
                ]
            }
        ]
    },

    首页: $js.toString(() => {
        let html = fetch(HOST + '/show/dianshiju/');
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    一级: $js.toString(() => {
        let page = input.match(/\/page\/(\d+)\//)?.[1] || '1';
        let base = input.split('/page/')[0].split('?')[0];
        let url = page === '1' ? base + '/' : base + '/page/' + page + '/';
        let html = fetch(url);
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    二级: $js.toString(() => {
        let detailUrl = '/detail/' + input + '.html';
        let html = fetch(HOST + detailUrl);
        let vod_name = pdfh(html, 'h1&&Text') || input;
        let vod_pic = pdfh(html, 'img.lazy&&data-src');
        let vod_actor = pdfh(html, 'div:contains(主演)&&Text').replace(/主演：/, '').trim();
        let vod_content = '';

        // 尝试获取剧情简介
        let descId = 'blurb_' + vod_name.replace(/[\s\W]+/g, '_');
        let descScript = html.match(new RegExp('var divEle = document.getElementById\\("' + descId + '"\\);divEle.innerHTML=s;'));
        if (descScript) {
            let fullScript = html.match(/if\("([^"]*)"\.length !== 0\)/)?.[1] || '';
            if (fullScript) vod_content = fullScript;
        }

        // 获取所有线路
        let tabs = pdfa(html, 'div.module-player-tab a.module-tab-item');
        let vod_play_from = [];
        let vod_play_url = [];

        tabs.forEach(tab => {
            let tabName = pdfh(tab, 'span&&Text') || pdfh(tab, '&&Text');
            let tabHref = pdfh(tab, 'a&&href');
            if (!tabHref) return;

            let playHtml = fetch(HOST + tabHref);
            let剧集列表 = pdfa(playHtml, 'div.sort-item a');
            let urls = [];
            剧集列表.forEach(ep => {
                let title = pdfh(ep, 'span&&Text');
                let href = pdfh(ep, 'a&&href');
                if (title && href) {
                    urls.push(title + '$' + href);
                }
            });
            if (urls.length > 0) {
                vod_play_from.push(tabName);
                vod_play_url.push(urls.join('#'));
            }
        });

        VOD = {
            vod_id: input,
            vod_name: vod_name,
            vod_pic: vod_pic,
            vod_actor: vod_actor,
            vod_content: vod_content,
            vod_play_from: vod_play_from.join('$$$'),
            vod_play_url: vod_play_url.join('$$$')
        };
    }),

    搜索: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    lazy: $js.toString(() => {
        let html = fetch(HOST + input);
        let m3u8 = pdfh(html, 'a#bfurl&&href');
        if (!m3u8) {
            let script = html.match(/var player_aaaa=({.*?});/)?.[1];
            if (script) {
                try {
                    let obj = JSON.parse(script.replace(/'/g, '"'));
                    m3u8 = obj.url || '';
                } catch (e) {}
            }
        }
        if (m3u8) {
            input = { jx: 0, parse: 0, url: m3u8 };
        }
    })
};
