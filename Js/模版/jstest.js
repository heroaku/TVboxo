var rule={
    title:'789影院',
    host:'https://www.789dyhd.com',
    //host:'https://www.666dyhd.com',

    // homeUrl:'/',
    url:'/index.php/vod/type/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.conch-nav&&ul&&li;a&&Text;a&&href;./(\\d+).html',
    //cate_exclude:'',
    class_name:'电影&电视剧&综艺&动漫&记录片&国产剧&港台剧&日韩剧&欧美剧&海外剧',
    class_url:'1&2&3&4&21&13&14&15&16&22',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.index-tj-l;ul&&li;a&&title;*;*;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.index-area.clearfix&&ul&&li;a&&title;img&&data-original;.other&&Text;a&&href',
    二级:{"title":".lazy&&alt;.other&&Text","img":".ct-l&&img&&data-original","desc":";;.hl-col-xs-12:eq(2)&&Text;.hl-col-xs-12:eq(3)&&Text;.hl-col-xs-12:eq(4)&&Text","content":".hl-content-text&&Text","tabs":".playfrom&&ul&&li","lists":".tab-down:eq(#id)&&.videourl&&ul&&li"},
    搜索:'.hl-list-wrap&&ul&&li;.hl-item-thumb&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
}
