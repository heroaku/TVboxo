var rule={
title:'BD360',
host:'https://chuavod.com/',
url:'index.php/vod/show/by/time/id/fyclass/page/fypage.html',
searchUrl:'/vodsearch/-------------.html?wd=**',
searchable:2,//是否启用全局搜索,
quickSearch:0,//是否启用快速搜索,
filterable:0,//是否启用分类筛选,
headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
class_name: '电影&电视剧&综艺&动漫&记录片&短剧',
class_url: '1&2&3&4&5&6',
play_parse:true,
lazy:'',
limit:6,
推荐:'.module;.module-main;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module .module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
二级:{"title":"h1&&Text;.video-info-aux&&div&&a:eq(0)&&Text","img":".module-item-pic&&img&&data-src","desc":";.video-info-aux&&a:eq(1)&&Text;.video-info-aux&&a:eq(2)&&Text;.video-info-items:eq(1) a&&Text;.video-info-items:eq(0) a&&Text","content":".video-info-content&&Text","tabs":".module-tab-item.tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
搜索:'.module&&.module-main;.lazy&&alt;.lazyload&&data-original;.module-item-note&&Text;a&&href',
}
