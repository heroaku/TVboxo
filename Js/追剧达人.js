var rule={
    title:'追剧达人',
    host:'http://zjdr.tv',
    url:'/vodshow/id/fyclass/page/fypage.html',
    //searchUrl:'/vod/search/page/fypage/wd/**.html',
    //class_parse:'.navbar-items li:gt(1):lt(6);a&&Text;a&&href;.*/(.*?).html',

    searchable:2,
    quickSearch:1,
    filterable:0,
    headers:{'User-Agent':'MOBILE_UA', },
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    推荐:'.tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    二级:{"title":"h1&&Text;.module-info-tag&&Text","img":".lazyload&&data-original","desc":".module-info-item:eq(-2)&&Text;.module-info-item:eq(-2)&&Text;.module-info-item:eq(-2)&&Text;.module-info-item:eq(2)&&.module-info-item-content&&Text;.module-info-item:eq(1)&&.module-info-item-content&&Text","content":".module-info-introduction&&Text","tabs":".module-tab-item.tab-item","lists":".module-play-list:eq(#id) a"},
    搜索:'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',
}
