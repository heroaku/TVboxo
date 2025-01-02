var rule={
    title: '专享影视',
    host: 'https://zxys.cc',
    url: '/show/id/fyclass/page/fypage.html',
    searchUrl: '/search/page/fypage/wd/**.html',
    headers: {'User-Agent': 'UC_UA'},
    searchable: 1, quickSearch: 0, filterable: 0, double: true, play_parse: true, limit: 6,
    class_name: '电影&电视剧&动漫&短剧&综艺',
    class_url: 'dianying&dianshi&dongman&duanju&zongyi',
play_parse:true,
lazy:'',
limit:6,
推荐:'.module;.module-main;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module .module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":";;.module-info-main&&.module-info-item:eq(1)&&Text;.module-info-main&&.module-info-item:eq(2)&&Text","content":".show-desc&&Text","tabs":"#y-playList&&.tab-item","lists":".module-play-list-content:eq(#id) a"},
搜索:'.module&&.module-main;.lazy&&alt;.lazyload&&data-original;.module-item-note&&Text;a&&href',
}
