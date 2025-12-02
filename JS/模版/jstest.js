var rule = {
    title: 'EU影视',
    host: 'https://www.cinemirra.com',
     //https://www.cinemirra.com/vod/show/id/fyclass/page/fypage.html
    //https://euvod.tv/vodshow/fyclass--------fypage---.html
    url: '/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/vodshow/fyclass--------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
    class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
   // class_name: '电影&电视剧&综艺&动漫&国产剧&港台剧&日韩剧&泰国剧&欧美剧&海外剧',
   // class_url: '1&2&4&3&14&15&16&30&20&13',
play_parse: true,
lazy: '',
limit: 6, 
推荐: '.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double: true, // 推荐内容是否双层定位
一级: '.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href', 
二级: {
    "title": "h1&&Text;.video-info-item:eq(1)&&Text",
    "img": ".module-item-pic&&img&&data-src",
    "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    "content": "Text",
    "tabs": ".module-tab-item .tab-item",
    "lists": ".module-list:eq(#id)&&.sort-item&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
}
