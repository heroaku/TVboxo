var rule = {
    title: '糖豆影视',
    host: 'https://tdys.cc',
    // 启用翻页：MacCMS 标准格式
    url: '/show/fyclass--------fypage---.html',
    //detailUrl: '/vod-detail/fyid.html',
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
    推荐: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    一级: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.module-info-tag&&Text",
        "img": ".module-info-poster&&img&&data-original",
        "desc": ".module-info-content&&p:eq(1)&&Text", // 主演
        "content": ".module-info-introduction&&p&&Text",
        "tabs": "div.module-player-tab-item",
        "lists": "div.module-player-list:eq(#id) a"
    },
    搜索: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href'
};
