var rule = {
    title:'胖子影视',
    host:'https://www.pangzitv.com',
    // homeUrl:'/',
    url:'/vod-list-id-fyclass-pg-fypage-order--by--class-0-year-0-letter--area--lang-.html',
    searchUrl:'/vod-search-pg-fypage-wd-**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.mainwidth&&.imglist02.cl&&.imgItemWrp&&.imgItem;img&&alt;img&&src;.updateEpisode.pa&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.imgItem;img&&alt;img&&src;.updateEpisode.pa&&Text;a&&href',
    二级:{"title":".v-title.clearfix&&Text;.item.item-line:eq(0)&&Text","img":"img&&src","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.item-lines.clearfix&&Text;.item.starring&&Text;.module-info-content&&.module-info-item:eq(-1)&&.module-info-item-content&&Text","content":".intro&&.text&&Text","tabs":".supply.clearfix&&li","lists":".vlink_1&&li"},
    搜索:'.module-card-item.module-item;.module-card-item-title&&Text;img&&data-original;.module-item-note&&Text;a.play-btn-o&&href',
}
