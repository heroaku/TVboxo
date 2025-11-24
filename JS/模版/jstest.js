var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
    // ✅ 保留 fyclass，才能显示分类菜单
  //  url: '/show/fyclass/',
    // 重点：url 必须包含 fyfilter
url: '/show/fyfilter/',

// filter_url 定义完整路径模板
filter_url: '{{fl.type}}' +
            '{{fl.area ? "/area/" + fl.area : ""}}' +
            '{{fl.class ? "/class/" + fl.class : ""}}' +
            '/by/{{fl.by || "year"}}' +
            '{{fl.year ? "/year/" + fl.year : ""}}' +
            '{{fypage > 1 ? "/page/" + fypage : ""}}',

// 删除 class_url！！！
// 改用 filter 的 key 作为分类名
filter: {
    "电影": [
        {"key": "type", "value": [{"n":"全部","v":"dianying"}, {"n":"动作","v":"dongzuopian"}]},
        {"key": "area", "value": [{"n":"全部","v":""}, {"n":"中国大陆","v":"中国大陆"}]}
    ],
    "电视剧": [
        {"key": "type", "value": [{"n":"全部","v":"dianshiju"}, {"n":"国产剧","v":"guochanju"}]},
        {"key": "class", "value": [{"n":"全部","v":""}, {"n":"爱情","v":"爱情"}]}
    ]
},

// filter_def 提供默认参数
filter_def: {
    "电影": { type: "dianying", by: "year" },
    "电视剧": { type: "dianshiju", by: "year" }
},
    // ❌ 不用 filter_url（CSP 会忽略）
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    // ✅ 分类菜单（必须）
    class_name: '电影&电视剧&综艺&动漫&短剧&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&duanju&jilupian',

    // ✅ filter 定义筛选项（key 必须和 class_url 一致！）


    // ✅ 一级：核心！动态拼接筛选 URL
    一级: $js.toString(() => {
        // 1. 解析当前分类（如 dianshiju）
        let fyclass = input.split('/show/')[1]?.split('/')[0] || 'dianying';
        // 2. 获取筛选参数
        let fl = {};
        try { fl = JSON.parse(input.split('fl=')[1]?.split('&')[0] || '{}'); } catch(e) {}
        // 3. 获取页码
        let page = input.match(/page\/(\d+)/)?.[1] || '1';

        // 4. 拼接路径
        let parts = [];
        // 主路径：优先用 cateId（子类），否则用大类
        if (fl.cateId && fl.cateId !== fyclass) {
            parts.push(fl.cateId);
        } else {
            parts.push(fyclass);
        }

        // 5. 按分类决定用 area 还是 class
        if (fyclass === 'dianying' || fyclass === 'jilupian') {
            if (fl.area) parts.push('area', fl.area);
        } else {
            if (fl.class) parts.push('class', fl.class);
        }

        // 6. 排序 + 年份
        parts.push('by', fl.by || 'year');
        if (fl.year) parts.push('year', fl.year);

        // 7. 拼完整 URL（第1页不加 /page/1/）
        let url = HOST + '/show/' + parts.join('/') + (page === '1' ? '/' : `/page/${page}/`);

        // 8. 请求解析
        let html = fetch(url);
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            let title = pdfh(it, 'a.module-item-title&&title');
            let link = pdfh(it, 'a.module-item-title&&href');
            let id = link.match(/\/detail\/([^\/]+)\.html/)?.[1] || '';
            let pic = pdfh(it, 'img.lazy&&data-src');
            let remarks = pdfh(it, '.module-item-text&&Text') || '';
            VODS.push({ vod_name: title, vod_id: id, vod_pic: pic, vod_remarks: remarks });
        });
    }),

    // 其他函数（二级、搜索、lazy）可沿用你之前的逻辑
    二级: $js.toString(() => {
        let html = fetch(HOST + '/detail/' + input + '.html');
        let vod_name = pdfh(html, 'h1&&Text') || input;
        let vod_pic = pdfh(html, 'img.lazy&&data-src');
        let vod_actor = pdfh(html, 'div:contains(主演)&&Text').replace(/主演：/, '').trim();
        let vod_content = '';

        let tabs = pdfa(html, '.module-player-tab a.module-tab-item');
        let vod_play_from = [];
        let vod_play_url = [];

        tabs.forEach(tab => {
            let tabName = pdfh(tab, 'span&&Text') || tabName;
            let tabHref = pdfh(tab, 'a&&href');
            if (!tabHref) return;
            let playHtml = fetch(HOST + tabHref);
            let episodes = pdfa(playHtml, '.module-blocklist a');
            let urls = [];
            episodes.forEach(ep => {
                let title = pdfh(ep, 'span&&Text') || pdfh(ep, '&&Text');
                let href = pdfh(ep, 'a&&href');
                if (title && href) urls.push(title + '$' + href);
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
            let title = pdfh(it, 'a.module-item-title&&title');
            let link = pdfh(it, 'a.module-item-title&&href');
            let id = link.match(/\/detail\/([^\/]+)\.html/)?.[1] || '';
            VODS.push({ vod_name: title, vod_id: id });
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
                } catch(e) {}
            }
        }
        if (m3u8) {
            input = { jx: 0, parse: 0, url: m3u8 };
        }
    })
};
