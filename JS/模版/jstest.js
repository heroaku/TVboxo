// == 主站信息 ==
var rule = {
    title: '剧多多',
    host: 'https://www.jddzx.cc',
    homeUrl: '/',
    url: '/type/fyclass/page/fypage.html',
    detailUrl: '/vod/fyid.html',
    searchUrl: '/vodsearch/page/fypage.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: 'dianying&juji&dongman&zongyi&duanju',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    lazy: '',
    limit: 30,
    double: false,
    推荐: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    一级: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.module-info-tag&&Text",
        "img": ".module-info-poster&&img&&data-original",
        "desc": ".module-info-item:eq(0)&&Text",
        "content": ".module-info-introduction-content&&p&&Text",
        "tabs": 'div.module-tab-item.tab-item',
        "lists": "div.module-play-list:eq(#id) a"
    },
    搜索: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    // 人机验证核心函数（drpy2 环境可执行）
    // 注意：drpy2 不支持 btoa/Math.random，需用自定义 base64 + 固定随机
    jsConfig: {
        encrypt: function (s) {
            const STATIC_CHARS = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
            let result = "";
            for (let i = 0; i < s.length; i++) {
                let ch = s[i];
                let pos = STATIC_CHARS.indexOf(ch);
                let code = pos === -1 ? ch : STATIC_CHARS[(pos + 3) % 62];
                // 使用固定字符 'P' 代替 Math.random()
                result += 'P' + code + 'P';
            }
            // 简易 base64（drpy2 不支持 btoa）
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result));
        },
        // drpy2 会自动注入 request、fetch 等方法
        verify: async function (url) {
            const fullUrl = url.startsWith('http') ? url : this.host + url;
            const value = this.encrypt(fullUrl);
            const token = this.encrypt("MTc2MzczNjk4MQ==");
            const data = `value=${encodeURIComponent(value)}&token=${encodeURIComponent(token)}`;
            // POST 到 /robot.php
            await this.post(this.host + '/robot.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': this.headers['User-Agent']
                }
            });
            await this.wait(1200); // 模拟等待 1.2s
        }
    },
    // 重写分类请求（添加验证）
    cateList: async function (cate, pg) {
        const url = pg == 1 ? `/type/${cate}.html` : `/type/${cate}/page/${pg}.html`;
        try {
            // 先尝试请求，若返回验证页则执行验证
            let html = await this.get(this.host + url);
            if (html.includes('人机验证') || html.includes('firewall')) {
                await this.jsConfig.verify(url);
                html = await this.get(this.host + url);
            }
            return html;
        } catch (e) {
            console.log('请求失败:', e);
            return '';
        }
    },
    // 重写搜索请求
    search: async function (wd, pg) {
        const url = pg == 1 ? `/vodsearch.html?wd=${wd}` : `/vodsearch/page/${pg}.html?wd=${wd}`;
        let html = await this.get(this.host + url);
        if (html.includes('人机验证')) {
            await this.jsConfig.verify(url);
            html = await this.get(this.host + url);
        }
        return html;
    },
    // 重写一级解析
    parseVodList: function (html) {
        let list = [];
        const items = html.matchAll(/<a[^>]*class="module-poster-item module-item"[^>]*href="([^"]*)"[^>]*title="([^"]*)"[^>]*>/g);
        for (const item of items) {
            const href = item[1];
            const title = item[2];
            let pic = '';
            let note = '';
            // 尝试提取 pic 和 note
            const itemHtml = item[0] + html.substring(html.indexOf(item[0]) + item[0].length, html.indexOf('</a>', html.indexOf(item[0])) + 4);
            const picMatch = itemHtml.match(/data-original="([^"]*)"/);
            const noteMatch = itemHtml.match(/<div class="module-item-note">([^<]*)<\/div>/);
            if (picMatch) pic = picMatch[1];
            if (noteMatch) note = noteMatch[1];
            if (!href.startsWith('/vod/')) continue;
            const vod_id = href.replace('/vod/', '').replace('.html', '');
            list.push({
                vod_id: vod_id,
                vod_name: title,
                vod_pic: pic,
                vod_remarks: note
            });
        }
        return list;
    },
    // 重写一级入口（支持翻页）
    categoryContent: async function (cate, pg) {
        const html = await this.cateList(cate, pg);
        const list = this.parseVodList(html);
        return JSON.stringify({
            'page': parseInt(pg),
            'pagecount': 999,
            'limit': 30,
            'total': 999 * 30,
            'list': list
        });
    },
    // 重写搜索入口
    searchContent: async function (wd, pg) {
        const html = await this.search(wd, pg);
        const list = this.parseVodList(html);
        return JSON.stringify({
            'page': parseInt(pg),
            'pagecount': 999,
            'limit': 30,
            'total': 999 * 30,
            'list': list
        });
    }
};
