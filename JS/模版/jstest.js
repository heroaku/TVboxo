var rule={     
    title:'蘑菇影视',
    host: 'https://www.moguvodw.com',
    url: '/vodshow/fyclass--------fypage---.html',
    //https://www.moguvodw.com/vodsearch/**----------fypage---.html
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    //class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
    //cate_exclude:'演员',
    class_name:'电视剧&电影&动漫&综艺&短剧&纪录片',
    class_url:'2&1&4&3&21&23',  
    推荐:'ul.hl-vod-list;li;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double: true,
     一级: '.hl-vod-list li;a&&title;a&&data-original;.hl-lc-1&&Text;a&&href',
     二级:{
            'title':'.h1&&Text;.data:eq(0)&&Text',
            'img':'.hl-item-thumb&&data-original',
            'desc':'.hl-infos-content&&.hl-text-conch&&Text',
            'content':'.hl-content-text&&Text',
            'tabs':'.hl-tabs&&a',
            'lists':'.hl-plays-list:eq(#id)&&li'
         },
     搜索: '.hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href'
    }
