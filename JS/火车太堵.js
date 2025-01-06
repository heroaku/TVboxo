var rule = {
    title:'火车太堵',
    host:'https://tdgo.shop',
    // homeUrl:'/',
    url:'/vodshow/fyclass--time------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&短剧',
    class_url:'20&21&23&22&24',
    play_parse:true,
    lazy:'',
    limit:6,
推荐:'.module;.module-main;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module .module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":";;.module-info-main&&.module-info-item:eq(1)&&Text;.module-info-main&&.module-info-item:eq(2)&&Text","content":".show-desc&&Text","tabs":"#y-playList&&.tab-item","lists":".module-play-list-content:eq(#id) a"},
搜索:'.module&&.module-main;.lazy&&alt;.lazyload&&data-original;.module-item-note&&Text;a&&href',
}
