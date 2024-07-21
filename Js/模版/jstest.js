var rule={     
    title:'时代影视',
    //https://www.wwys.pro/oftensshow/dianshiju--------2---.html
    host:'https://www.56music.top',
    url:'/vodshow/fyclass-----------.html?page=fypage',
    searchUrl:'/vodsearch.html?wd=**&page=fypage',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    //class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
    //cate_exclude:'演员',
    class_name:'电影&电视剧&综艺&动漫&纪录片&国产剧&日剧&韩剧&港剧&欧美剧&泰剧&台剧',
    class_url:'1&2&3&4&17&18&20&22&19&21&24&23',  
    推荐:'body&&.hl-list-wrap;ul&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.hl-vod-list&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    二级: {
        title: '.hl-infos-title&&Text;.hl-text-conch&&Text',
        img: '.hl-lazy&&data-original',
        desc: '.hl-infos-content&&.hl-text-conch&&Text',
        content: '.hl-content-text&&Text',
        tabs: '.hl-tabs&&a',
        lists: '.hl-plays-list:eq(#id)&&li',
    },
    搜索:'.hl-list-wrap&&ul&&li;.hl-item-thumb&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
}
