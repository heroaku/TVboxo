var rule = {
    title: '量子资源',
    host: 'https://www.lzizy.com',
    // ⚠️ 注意：使用 /show/ 而非 /type/ 来支持筛选
    url: '/index.php/vod/show/id/fyclass/fyfilter.html',
    filter_url: '{{fl.class ? "class/" + fl.class + "/" : ""}}{{fl.area ? "area/" + fl.area + "/" : ""}}{{fl.year ? "year/" + fl.year + "/" : ""}}',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    // 📌 class_url 必须是数字 ID（对应 MacCMS 分类 ID）
    class_name: '电影&国产剧&韩剧&美剧&日剧&港剧&台剧&泰剧&综艺&动漫&体育&短剧',
    class_url: '1&13&15&16&22&14&21&24&3&4&36&46',

    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 5000,

    // 首页（可选，用电影第一页）
    首页: $js.toString(() => {
        input = HOST + '/index.php/vod/show/id/1/page/1.html';
        let html = fetch(input);
        let list = pdfa(html, 'ul.vodlist li');
        VODS = [];
        list.forEach(li => {
            VODS.push({
                vod_name: pdfh(li, 'a&&title'),
                vod_id: pdfh(li, 'a&&href').match(/\/detail\/id\/(\d+)\.html/)?.[1] || '',
                vod_pic: pdfh(li, 'img&&data-original'),
                vod_remarks: pdfh(li, '.pic-text&&Text') || ''
            });
        });
    }),

    // 一级列表
    一级: $js.toString(() => {
        // input 形如：/index.php/vod/show/id/13/class/剧情/area/大陆/year/2025.html
        let pageMatch = input.match(/\/page\/(\d+)\.html/);
        let page = pageMatch ? pageMatch[1] : '1';
        let baseUrl = input.split('/page/')[0].split('.html')[0];
        let url = baseUrl + (page === '1' ? '.html' : `/page/${page}.html`);

        let html = fetch(url);
        let list = pdfa(html, 'ul.vodlist li');
        VODS = [];
        list.forEach(li => {
            VODS.push({
                vod_name: pdfh(li, 'a&&title'),
                vod_id: pdfh(li, 'a&&href').match(/\/detail\/id\/(\d+)\.html/)?.[1] || '',
                vod_pic: pdfh(li, 'img&&data-original'),
                vod_remarks: pdfh(li, '.pic-text&&Text') || ''
            });
        });
    }),

    // 二级详情
    二级: $js.toString(() => {
        let detailUrl = '/index.php/vod/detail/id/' + input + '.html';
        let html = fetch(HOST + detailUrl);
        let vod_name = pdfh(html, 'h2&&Text') || input;
        let vod_pic = pdfh(html, '.detail-pic img&&src');
        let vod_year = pdfh(html, 'li:contains(年份)&&Text').replace(/\D+/g, '');
        let vod_area = pdfh(html, 'li:contains(地区)&&Text').replace(/地区：/, '');
        let vod_actor = pdfh(html, 'li:contains(主演)&&Text').replace(/主演：/, '');
        let vod_director = pdfh(html, 'li:contains(导演)&&Text').replace(/导演：/, '');
        let vod_content = pdfh(html, '.vod_content&&Text') || '';

        // 获取播放列表（假设最多 3 条线路）
        let vod_play_from = '';
        let vod_play_url = '';
        for (let sid = 1; sid <= 3; sid++) {
            let playHtml = fetch(HOST + `/index.php/vod/play/id/${input}/sid/${sid}/nid/1.html`);
            let script = playHtml.match(/var player_aaaa=({.*?});/)?.[1];
            if (script) {
                try {
                    let obj = JSON.parse(script.replace(/'/g, '"').replace(/,\s*}/, '}').replace(/,\s*]/, ']'));
                    if (obj.url && obj.url.includes('m3u8')) {
                        // 假设每季最多 50 集（可优化为动态获取）
                        let urls = [];
                        for (let nid = 1; nid <= 50; nid++) {
                            urls.push(`第${nid}集$${HOST}/index.php/vod/play/id/${input}/sid/${sid}/nid/${nid}.html`);
                        }
                        vod_play_from += (vod_play_from ? '$$$' : '') + `量子线路${sid}`;
                        vod_play_url += (vod_play_url ? '$$$' : '') + urls.join('#');
                        break; // 仅取第一条有效线路（可改为多线路）
                    }
                } catch (e) {}
            }
        }

        VOD = {
            vod_id: input,
            vod_name: vod_name,
            vod_pic: vod_pic,
            vod_year: vod_year,
            vod_area: vod_area,
            vod_actor: vod_actor,
            vod_director: vod_director,
            vod_content: vod_content,
            vod_play_from: vod_play_from,
            vod_play_url: vod_play_url
        };
    }),

    // 搜索
    搜索: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'ul.vodlist li');
        VODS = [];
        list.forEach(li => {
            VODS.push({
                vod_name: pdfh(li, 'a&&title'),
                vod_id: pdfh(li, 'a&&href').match(/\/detail\/id\/(\d+)\.html/)?.[1] || '',
                vod_pic: pdfh(li, 'img&&data-original'),
                vod_remarks: pdfh(li, '.pic-text&&Text') || ''
            });
        });
    }),

    // 懒加载播放
    lazy: $js.toString(() => {
        // input 是播放页 URL：/index.php/vod/play/id/123/sid/1/nid/1.html
        let html = fetch(HOST + input);
        let m3u8 = '';
        // 方法1：从 bfurl 提取
        m3u8 = pdfh(html, 'a#bfurl&&href');
        if (!m3u8) {
            // 方法2：从 player_aaaa 提取
            let script = html.match(/var player_aaaa=({.*?});/)?.[1];
            if (script) {
                try {
                    let obj = JSON.parse(script.replace(/'/g, '"').replace(/,\s*}/, '}'));
                    m3u8 = obj.url || '';
                } catch (e) {}
            }
        }
        if (m3u8) {
            input = { jx: 0, parse: 0, url: m3u8 };
        }
    }),

    filter: {
        "13": [ // 国产剧
            { "key": "class", "name": "类型", "value": [
                { "n": "全部", "v": "" },
                { "n": "剧情", "v": "剧情" },
                { "n": "古装", "v": "古装" },
                { "n": "爱情", "v": "爱情" },
                { "n": "悬疑", "v": "悬疑" }
            ]},
            { "key": "area", "name": "地区", "value": [
                { "n": "全部", "v": "" },
                { "n": "大陆", "v": "大陆" }
            ]},
            { "key": "year", "name": "年份", "value": [
                { "n": "全部", "v": "" },
                { "n": "2025", "v": "2025" },
                { "n": "2024", "v": "2024" }
            ]}
        ],
        "15": [ // 韩剧
            { "key": "area", "name": "地区", "value": [{ "n": "韩国", "v": "韩国" }] },
            { "key": "year", "name": "年份", "value": [{ "n": "2025", "v": "2025" }] }
        ]
        // 可按需补充其他分类的筛选
    },
    filter_def: {
        "13": { "class": "", "area": "", "year": "" },
        "15": { "area": "韩国", "year": "2025" }
    }
};
