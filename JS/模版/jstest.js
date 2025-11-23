var rule = {
    title: '好看影视',
    host: 'https://103.194.185.51:51123',
     //https://103.194.185.51:51123/show/2------1.html
    //https://103.194.185.51:51123/show/fyclass-----2-fypage.html
    url: '/show/fyclass------fypage.html',
    searchUrl: '/vodshow/fyclass--------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
    //class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
   class_name: '电影&电视剧&综艺&动漫&短剧',
   class_url: '1&2&4&3&6',
play_parse: true,
lazy: '',
limit: 6, 
推荐: '.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double: true, // 推荐内容是否双层定位
一级: '.module-item;.v-item-title:eq(1)&&Text;img:eq(1)&&data-original;.v-item-bottom&&Text;a&&href', 
二级: {
    "title": ".detail-title&&strong:eq(1)&&Text;.video-info-item:eq(1)&&Text",
    "img": ".module-item-pic&&img&&data-src",
    "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    "content": "Text",
    "tabs": ".swiper-slide .source-swiper-slide",
    "lists": ".episode-list:eq(#id)&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
}
