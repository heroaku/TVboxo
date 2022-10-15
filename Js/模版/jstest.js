var rule={
    title:'欧乐影院',
    host:'https://www.olevod.com',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.top_nav&&ul li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":"h2&&Text;.data_style&&Text","img":".vodlist_thumb&&data-original","desc":".content_detail.content_min li:eq(0)&&Text;.content_detail.content_min li:eq(2)&&Text;.content_detail.content_min li:eq(3)&&Text","content":".content_desc.full_text&&Text","tabs":".title_nav:eq(0) li","lists":".content__playlist:eq(#id) li"},
    搜索:'#searchList li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',
}
