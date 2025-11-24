var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
    // 占位，实际不用
    url: '/show/fyclass/',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    class_name: '电影&电视剧&综艺&动漫&短剧&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&duanju&jilupian',

    filter: { /* 你现有的 filter */ },

    一级: $js.toString(() => {
        // 从 fl 参数和 class_url 推导真实 URL
        let typeMap = {
            'dianying': '电影', 'dianshiju': '电视剧',
            'zongyi': '综艺', 'dongman': '动漫',
            'duanju': '短剧', 'jilupian': '纪录片'
        };

        let parts = [];
        let fyclass = input.split('/show/')[1]?.split('/')[0] || 'dianying';
        let fl = {};

        try {
            // CSP 会把筛选参数放在 input 的 fl=... 中
            fl = JSON.parse(input.split('fl=')[1]?.split('&')[0] || '{}');
        } catch(e) {}

        // 1. 确定主分类或子类
        if (fl.cateId && fl.cateId !== fyclass) {
            parts.push(fl.cateId); // 如 guochanju
        } else {
            parts.push(fyclass);   // 如 dianshiju
        }

        // 2. 电影/纪录片用 area，其他用 class
        if (fyclass === 'dianying' || fyclass === 'jilupian') {
            if (fl.area) parts.push('area', fl.area);
        } else {
            if (fl.class) parts.push('class', fl.class);
        }

        // 3. 排序和年份
        parts.push('by', fl.by || 'year');
        if (fl.year) parts.push('year', fl.year);

        // 4. 分页
        let page = input.match(/page\/(\d+)/)?.[1] || '1';
        let url = HOST + '/show/' + parts.join('/') + (page === '1' ? '/' : `/page/${page}/`);

        // 5. 请求并解析
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

    // 其他函数（二级、搜索、lazy）保持不变
};
