var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
    url: '/show/fyfilter/',
    filter_url: '{{fl.type}}' +
                '{{fl.area ? "/area/" + fl.area : ""}}' +
                '{{fl.class ? "/class/" + fl.class : ""}}' +
                '/by/{{fl.by || "year"}}' +
                '{{fl.year ? "/year/" + fl.year : ""}}' +
                '{{fypage > 1 ? "/page/" + fypage : ""}}',
    
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    filter: {
        "电影": [
            {"key":"type","name":"类型","value":[{"n":"全部","v":"dianying"},{"n":"动作","v":"dongzuopian"},{"n":"喜剧","v":"xijupian"}]},
            {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"}]}
        ],
        "电视剧": [
            {"key":"type","name":"类型","value":[{"n":"全部","v":"dianshiju"},{"n":"国产剧","v":"guochanju"}]},
            {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"爱情","v":"爱情"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"}]}
        ]
        // 其他分类略...
    },

    filter_def: {
        "电影": { type: "dianying", by: "year" },
        "电视剧": { type: "dianshiju", by: "year" }
    },

    一级: $js.toString(() => {
        let html = fetch(input); // input 已是完整筛选 URL
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
