
var rule = {
    title:'火车太堵',
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
    推荐:'.module-poster-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    一级:'.module-poster-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    //二级:{"title":"h1&&Text;","img":".lazyload&&data-original","desc":";;.module-info-item:eq(4) p&&Text;.module-info-item:eq(3) div&&Text;.module-info-item:eq(1) a&&Text","content":".show-desc&&Text","tabs":'#y-playList&&span',"lists":".module-play-list:eq(#id) a"},     
    二级:{"title":"h1&&Text;.module-info-tag-link:eq(2)&&Text","img":".lazyload&&data-original","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(2)&&.module-info-item-content&&Text;.module-info-content&&.module-info-item:eq(1)&&.module-info-item-content&&Text","content":".module-info-introduction-content&&Text","tabs":".module-tab-items-box:eq(0)&&.module-tab-item","lists":".module-list:eq(#id)&&.module-play-list-content a"}, 
    搜索:'.module-card-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href', 
}
