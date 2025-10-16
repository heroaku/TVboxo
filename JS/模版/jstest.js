var rule={
title:'永乐视频',
host:'https://ylsp.tv',
url:'/vodshow/fyclass--------fypage---',
//https://ylsp.tv/vodshow/fyclass--------fypage---/
//https://ylsp.tv/vodsearch/**----------fypage---/
searchUrl:'/vodsearch/**----------fypage---/',
searchable:2,//是否启用全局搜索,
quickSearch:0,//是否启用快速搜索,
filterable:0,//是否启用分类筛选,
headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
class_name: '电影&电视剧&综艺&动漫&国产剧&欧美剧&港台剧&日韩剧',
class_url: '1&2&3&4&13&14&15&16',
play_parse:true,
lazy:'',
limit:6,
    推荐: 'body&&.scroll-box;.module-poster-item.module-item;.module-poster-item-title&&Text;img&&data-original;.module-item-note&&Text;a&&href',
    double: true,
    一级: 'body&&.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.module-info-tag&&Text",
        "img": ".lazyload&&data-original",
        "desc": ".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&Text",
        "content": ".module-info-introduction&&Text",
        "tabs": ".module-tab-item",
        "lists": ".module-play-list:eq(#id) a"
    },
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',
}
