var rule = {
     title:'蜂鸟影院',
    host:'https://www.6ygo.com',
    // homeUrl:'/',
    url:'/6ytype-fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:1,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.stui-header__menu li.hidden-xs;a&&Text;a&&href;/(\\d+)/',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3y&4',
    play_parse:true,
    lazy:'',
    limit:8,
    推荐:'ul.stui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text.text-right&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'body .stui-vodlist__box;a&&title;.lazyload&&data-original;.pic-text.text-right&&Text;a&&href',
    二级:{"title":"h1.title&&Text;.stui-content__detail p:eq(1)&&Text","img":".lazyload&&data-original","desc":".stui-content__detail p:eq(-3)&&Text;.stui-content__detail p:eq(-2)&&Text;.stui-content__detail p:eq(-2)&&Text;.stui-content__detail p:eq(5)&&Text;.stui-content__detail p:eq(4)&&Text","content":".stui-content__detail p.detail&&Text","tabs":".stui-vodlist__head h3","lists":".stui-content__playlist:eq(#id) li"},
    搜索:'.stui-vodlist.clearfix&&ul&&li;h4&&Text;.stui-vodlist__thumb&&data-original;.stui-vodlist__thumb.lazyload&&.pic-text.text-right&&Text;a&&href',
}
