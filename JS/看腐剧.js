var rule = {
    title:'看腐剧',
    host:'https://www.kanfujutv.com',
    // https://www.kanfujutv.com/vodshow/fyclass/page/fypage.html
    // https://www.kanfujutv.com/vodsearch.html?wd=%E5%85%B3%E4%BA%8E&submit=
    url:'/vodshow/fyclass/page/fypage.html',
    searchUrl:'/vodsearch.html?wd=**&submit=',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电视剧&电影&综艺&动漫',
    class_url:'Fuju&BLdianying&BLzongyi&BLdongman',
    //class_parse:'.myui-panel-box&&ul&&li;a&&Text;a&&href;/v/(.*)/',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.hl-vod-list;li;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.hl-list-item;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    二级:{"title":".hl-item-thumb.hl-lazy&&title;.hl-full-box&&ul li:eq(6)&&Text","img":".hl-item-thumb.hl-lazy&&data-original","desc":".hl-full-box&&ul&&li:eq(-1)&&Text;.hl-full-box&&ul&&li:eq(-2)&&Text;.hl-full-box&&ul&&li:eq(-3)&&Text;.hl-full-box&&ul&&li:eq(2)&&Text;.hl-full-box&&ul&&li:eq(3)&&Text","content":".hl-col-xs-12.blurb&&Text","tabs":".hl-plays-from:eq(0) a","lists":".hl-plays-list:eq(#id) li"},
    搜索:'ul.hl-one-list&&li;a&&title;.hl-item-thumb&&data-original;.hl-lc-1&&Text;a&&href;.text-muted:eq(-1)&&Text',
}
