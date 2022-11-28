var rule={     
    title:'NY影院',
    host:'https://www.nycvod.com',
    url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    //class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
    //cate_exclude:'演员',
    class_name:'电影&电视剧&综艺&动漫&纪录片&竞技体育&国产剧&港台剧&日韩剧&欧美剧&新马泰&其他',
    class_url:'1&2&3&4&29&5&30&16&18&47&14&13',  
   推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
   double:true, // 推荐内容是否双层定位
   一级:'.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
   二级:{"title":"h1&&Text;.video-info-aux&&div&&a:eq(0)&&Text","img":".module-item-pic&&img&&data-src","desc":";.video-info-aux&&a:eq(1)&&Text;.video-info-aux&&a:eq(2)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(0)&&Text","content":".video-info-content&&Text","tabs":".module-tab-item.tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
   搜索:'.module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href',
}
