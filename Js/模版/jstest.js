var rule = {
     title:'星辰影视',
    host:'https://www.vod66.com',
    // homeUrl:'/',
    url:'/fyclass/index_fypage_______.html',
    searchUrl:'/index.php?s=vod-search-wd-**-p-fypage.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.stui-header__menu li.hidden-xs;a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'mov&tv&fun&cartoon',
    play_parse:true,
    lazy:'',
    limit:8,
    推荐:'.stui-vodlist.clearfix;.stui-vodlist__box;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.stui-vodlist.clearfix li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":"h1.title&&Text;.stui-content__detail p:eq(2)&&Text","img":".lazyload&&data-original","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-1)&&Text;.video-info-items:eq(-2)&&Text;.stui-content__detail p:eq(7)&&Text;.stui-content__detail p:eq(6)&&Text","content":".stui-content__detail p:eq(9)&&Text","tabs":".nav.nav-tabs li","lists":".tab-pane.fade:eq(#id)&&ul&&li"},
    搜索:'.stui-vodlist.clearfix li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
}
