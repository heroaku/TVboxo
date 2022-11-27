var rule = {
     title:'碟调影视',
    host:'http://www.618648.com',
    // homeUrl:'/',
    url:'/die-tiao/fyclass-fypage.html',
    searchUrl:'/diediaoch/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.stui-header__menu li.hidden-xs;a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:8,
    推荐:'.stui-vodlist.clearfix;.stui-vodlist__box;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.stui-vodlist.clearfix li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":"h1.title&&Text;.stui-content__detail p:eq(0)&&Text","img":".lazyload&&src","content":".stui-content__detail p:eq(4)&&Text","tabs":".playlist.mb h3.title","lists":".stui-content__playlist:eq(#id) li"},
    搜索:'.stui-vodlist.clearfix li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
}
