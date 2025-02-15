
var rule = {
    title:'火车太赌',
    host:'https://www.tdgo.shop',
    // https://www.tdgo.shop/vodshow/21--------4---.html  https://www.tdgo.shop/vodsearch/ai----------2---.html,
    url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&短剧',
    class_url:'20&21&22&23&24',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
    二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":".video-info-items:eq(-1)&&Text;.video-info-items:eq(-3)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text","content":".vod_content&&Text","tabs":".module-tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
    搜索:'.module-items .module-search-item;h3&&Text;img&&data-src;.video-serial&&Text;a&&href',
}
