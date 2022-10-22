var rule = {
    title:'简单影院',
    host:'https://www.ysjd.top',
    // homeUrl:'/',
    url:'/vodtype/fyclass-fypage.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.module-items;.module-item;.module-item-cover&&.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.videoul.classification-ul&&li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',
    二级:{"title":"h1.page-title&&Text;.video-info-aux&&Text","img":".lazyload&&data-src","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".video-info-item.video-info-content.vod_content&&Text","tabs":".module-tab-item.tab-item","lists":".module-blocklist.scroll-box:eq(#id) a"},
    搜索:'.module-search-item;h3&&Text;img&&data-src;.module-item-text&&Text;a&&href',   
}
