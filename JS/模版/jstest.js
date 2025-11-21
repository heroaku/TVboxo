var rule = {
    title: '糖豆影视',
    host: 'https://tdys.cc',
    url: '/show/fyclass--------fypage---.html',
    // ❌ 删除 detailUrl！
    searchUrl: '/so/-.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
    },
    class_name: '电影&剧集&动漫&综艺&纪录片',
    class_url: 'dianying&juji&dongman&zongyi&jilupian',
    lazy: '',
    limit: 30,
    double: true,
    推荐: '.module-items;a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    // ✅ 一级直接返回完整 href（如 /vod-detail/169925.html）
    一级: 'a.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.module-info-tag&&Text",
        "img": ".lazyload&&data-original",
        "desc": ".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&Text",
        "content": ".module-info-introduction&&Text",
        "tabs": ".hisSwiper&&span",
        "lists": ".his-tab-list:eq(#id) a"
    },
    搜索: 'a.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href'
};
