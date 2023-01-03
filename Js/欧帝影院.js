var rule={
    title:'欧帝影院',
    host:'https://www.odivod.com',
    // homeUrl:'/',
    url:'/vodshow/fyclass--------fypage---/',
    //https://www.odivod.com/vodshow/2--------2---.html
    searchUrl:'/vodsearch/**----------fypage---/',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.conch-nav&&ul&&li;a&&Text;a&&href;./(\\d+).html',
    //cate_exclude:'',
    class_name:'电影&电视剧&综艺&动漫&记录片&喜剧片&爱情片&同性片&国产剧&香港剧&台湾剧&韩国剧&日本剧&欧美剧&泰国剧&新马剧&其他剧',
    class_url:'1&2&3&4&25&7&8&69&74&13&75&76&77&78&79&80&81',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'body .main;.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'a.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    二级:{"title":"h1&&Text;.module-info-tag&&Text","img":".lazy.lazyload&&data-original","desc":".module-info-item:eq(-1)&&Text;.module-info-item:eq(-2)&&Text;.module-info-item:eq(-3)&&Text;.module-info-item:eq(2)&&.module-info-item-content&&Text;.module-info-item:eq(1)&&.module-info-item-content&&Text","content":".module-info-introduction&&Text","tabs":".module-tab-item.tab-item","lists":".module-list:eq(#id)&&.module-play-list a"},
    搜索:'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',
}
