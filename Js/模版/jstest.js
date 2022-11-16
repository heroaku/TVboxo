var rule = {
    title:'KOK影视',
    host:'https://www.leyupro.com',
    // homeUrl:'/',
    url:'/lys/fyclass/page/fypage.html',
    searchUrl:'/lyso/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'lyMovie&lyTv&lyVariety&lyCartoon&lydocumentary',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.movie-list-body;.movie-list-item;a&&title;.inlist&&data-original;.module-item-note&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.gcol;a&&title;.inlist&&data-original;.module-item-note&&Text;a&&href',
    二级:{"title":"h1&&Text;.cr3&&Text","img":".poster&&img&&src","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.detailinfo&&p:eq(8)&&Text;.scroll-content&&Text;.album-title&&Text;.detailinfo&&p:eq(2)&&Text","content":".tjuqing&&Text","tabs":".yunplay&&.downtitle&&ul li","lists":".videolist:eq(#id) a"},
    搜索:'.movie-list-body&&.movie-search-list;a&&title;.inlist&&data-original;.module-item-note&&Text;a&&href',
}
