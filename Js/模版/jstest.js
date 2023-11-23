var rule={     
    title:'往往影院',
    //https://www.wwys.pro/oftensshow/dianshiju--------2---.html
    host:'https://www.wwys.pro',
    url:'/oftensshow/fyclass--------fypage---.html',
    searchUrl:'/oftenssearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    //class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
    //cate_exclude:'演员',
    class_name:'电影&电视剧&综艺&动漫&纪录片&国产剧&日韩剧&港台剧&欧美剧&泰国剧&其他剧',
    class_url:'dianying&dianshiju&zongyi&dongman&jilupian&guochanju&rihanju&gangtaiju&oumeiju&taiguoju&qitaju',  
    推荐:'body&&.hl-list-wrap;ul&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.hl-vod-list&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    二级:{"title":".hl-dc-title&&Text;.hl-col-xs-12&&em&&.hl-text-muted:eq(-2)&&Text","img":".hl-lazy&&data-original","desc":";;.hl-col-xs-12:eq(5)&&Text;.hl-col-xs-12:eq(3)&&Text;.hl-col-xs-12:eq(4)&&Text","content":".hl-content-text&&Text","tabs":".hl-plays-from a","lists":".hl-plays-list:eq(#id) li"},
    搜索:'.hl-list-wrap&&ul&&li;.hl-item-thumb&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
}
