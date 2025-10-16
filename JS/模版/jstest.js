var rule={
title:'春华影院',
host:'https://ylsp.tv',
url:'/vodshow/fyclass--------fypage---',
//https://ylsp.tv/vodshow/fyclass--------fypage---/
searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
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
推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-original;.module-item-text&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module-items&&.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
二级:{"title":"h1&&Text;.module-info-item&&div&&a:eq(0)&&Text","img":".module-item-pic&&img&&data-original","desc":".module-info-item&&a:eq(1)&&Text;.module-info-item&&a:eq(2)&&Text;.module-info-item:eq(1) a&&Text;.module-info-item:eq(0) a&&Text","content":".module-info-item&&Text","tabs":".module-tab-item:eq(#id)&&Text","lists":".module-list:eq(#id)&&.module-play-list-content a"},
搜索:'.module&&.module-main;.lazy&&alt;.lazyload&&data-original;.module-item-note&&Text;a&&href',
}
