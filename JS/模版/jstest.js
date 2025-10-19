var rule = {
    title: 'SQZ影视',
    host: 'https://www.shenqizhe.com',
    //https://www.shenqizhe.com/vodshow/fyclass--------fypage---.html
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch**/page/fypage.html',
    //https://www.shenqizhe.com/vodsearch**/page/fypage.html
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
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
    "lists": ".module-blocklist:eq(#id)&&.sort-item&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
}
