var rule = {
    title: '老网影视',
    host: 'https://www.laowang.co',
     //https://www.laowang.co/vs/fyclass--------fypage---.html
    url: '/vs/fyclass--------fypage---.html',
     //url: '/vs/fyclassfyfilter.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
    //filter: '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',
 //filter_url: '-{{fl.地区}}--{{fl.类型}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
play_parse: true,
lazy: '',
limit: 6, 
推荐: '.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double: true, // 推荐内容是否双层定位
一级: '.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href', 
二级: {
    "title": "h1&&Text;.video-info-item:eq(1)&&Text",
    "img": ".module-item-pic&&img&&data-src",
    "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    "content": "Text",
    "tabs": ".module-tab-item",
    "lists": ".module-list:eq(#id)&&.scroll-content&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
}
