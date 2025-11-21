var rule = {
    title: '剧多多',
    host: 'https://www.jddzx.cc',
    url: '/type/fyclass/page/fypage.html',
    detailUrl: '/vod/fyid.html',
    searchUrl: '/vodsearch.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: 'dianying&juji&dongman&zongyi&duanju',
    lazy: '',
    limit: 20,
    double: false,
    推荐: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    一级: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.module-info-content&&p:eq(0)&&Text",
        "img": ".module-info-poster&&img&&data-original",
        "desc": ".module-info-content&&p:eq(1)&&Text",
        "content": ".module-info-introduction&&p&&Text",
        "tabs": ".module-player-tab-item",
        "lists": ".module-player-list:eq(#id)&&a"
    },
    搜索: 'a.module-poster-item.module-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href'
};
