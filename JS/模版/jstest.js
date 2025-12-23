var rule={
    title:'蛋蛋赞',
    host:'http://www.yezitv.top',
    // http://www.yezitv.top/index.php/vod/type/id/fyclass/page/fypage.html
    url:'/index.php/vod/type/id/fyclass/page/fypage.html',   
    //searchUrl:'/search/**/',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电视剧&电影&综艺&动漫',
    class_url:'2&1&3&4',

   推荐:'div.lists-content;li;h2&&Text;.thumb&&src;.note&&Text;a&&href',  
 
   一级:'.box_con&&ul&&li;a&&title;img&&src;.note&&Text;a&&href',

    double:true, // 推荐内容是否双层定位
   二级:{"title":"h1&&Text;.product-excerpt:eq(2)&&Text","img":".thumb&&src","desc":";;.product-excerpt:eq(3)&&Text;.product-excerpt:eq(1)&&Text;.product-excerpt:eq(0)&&Text","content":".product-excerpt:eq(5)&&Text","tabs":".playlists dl dt","lists":".play-div-oa:eq(#id) li"},
   搜索:'ul.img-list.clearfix&&li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
}
