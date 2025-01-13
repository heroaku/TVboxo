muban.短视2.二级.img = '.detail-pic&&.lazy&&data-src';
var rule = {
    title: '统一影视',
    模板:'短视2',
    host: 'https://www.tyys2.com',
   // homeUrl:'/map.html',
    // url: '/index.php/api/vod#type=fyclass&page=fypage', https://www.tyys2.com/index.php/vod/search/page/2/wd/ai.html
    url: '/index.php/vod/type/id/fyclass/page/fypage.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filterable:1,//是否启用分类筛选,
    filter_url:'{{fl.cateId}}',
    filter: {
        "20":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"20"},{"n":"动作片","v":"21"},{"n":"喜剧片","v":"22"},{"n":"爱情片","v":"23"},{"n":"科幻片","v":"24"},{"n":"恐怖片","v":"25"},{"n":"剧情片","v":"26"},{"n":"战争片","v":"27"},{"n":"惊悚片","v":"28"},{"n":"犯罪片","v":"29"},{"n":"冒险篇","v":"30"},{"n":"动画片","v":"31"},{"n":"悬疑片","v":"32"},{"n":"武侠片","v":"33"},{"n":"奇幻片","v":"34"},{"n":"纪录片","v":"35"},{"n":"其他片","v":"36"}]}],
        "37":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"37"},{"n":"国产剧","v":"38"},{"n":"港台剧","v":"39"},{"n":"欧美剧","v":"40"},{"n":"日韩剧","v":"41"},{"n":"其他剧","v":"42"}]}],
        "43":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"43"},{"n":"国产动漫","v":"52"},{"n":"日本动漫","v":"53"},{"n":"欧美动漫","v":"54"}]}]
    },
    filter_def:{
        20:{cateId:'20'},
        37:{cateId:'37'},
        45:{cateId:'45'},
        43:{cateId:'43'}
    },
    //class_parse:'.swiper-wrapper&&li;a&&Text;a&&href;.*/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&短剧&体育',
    class_url:'2&1&4&3&41&5',
    detailUrl:'/index.php/vod/detail/id/fyid.html',
    推荐:'.border-box .public-list-box;.time-title&&Text;.lazy&&data-src;.public-list-prb&&Text;a&&href',
    double: false, // 推荐内容是否双层定位
    一级:'.border-box .public-list-box;.time-title&&Text;.lazy&&data-src;.public-list-prb&&Text;a&&href',
}
