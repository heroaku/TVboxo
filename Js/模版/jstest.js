var rule = {
    title:'23影院',
    host:'https://www.23wm.net',
    // homeUrl:'/',
    url:'/vodshow/id/fyclass/page/fypage.html',
    searchUrl:'/vodsearch/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'1&2&3&4&20',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.leo-video-item;h2&&Text;img&&data-original;.leo-video-remark&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.leo-video-item;h2&&Text;img&&data-original;.leo-video-remark&&Text;a&&href',
    二级:{"title":".pageHead-text&&Text;.video-info-aux&&Text","img":"img&&lay-src","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".vod-info-text&&Text","tabs":".play-zu-ul li","lists":".play-ji-ul:eq(#id) li"},
    搜索:'.videoul-li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',   
}

