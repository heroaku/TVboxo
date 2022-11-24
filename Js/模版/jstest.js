var rule = {
    title:'剧荒',
    host:'https://www.juhuang.tv',    
    // homeUrl:'/',
    url:'/type/fyclass_type_fypage.html',
    searchUrl:'/s/**/fypage.html',
    searchable:1,
    quickSearch:1,
    headers:{
        'User-Agent':'UC_UA'
    },
    timeout:5000,
	class_name:'电视剧&电影&综艺&动漫',//静态分类名称拼接
	class_url:'2&1&3&4',//静态分类标识拼接
    //class_parse:'.drop-content-items li:gt(0):lt(7);.grid-item-name&&Text;a&&href',
    play_parse:true,
    lazy:'',
    limit:6,
推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
二级:{"title":"h1&&Text;.video-info-aux&&div&&a:eq(0)&&Text","img":".module-item-pic&&img&&data-src","desc":";.video-info-aux&&a:eq(1)&&Text;.video-info-aux&&a:eq(2)&&Text;.video-info-items:eq(1) a&&Text;.video-info-items:eq(0) a&&Text","content":".video-info-content&&Text","tabs":".module-tab-item.tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
搜索:'.module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href',
}
