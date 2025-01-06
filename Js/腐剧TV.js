var rule={
title:'腐剧TV',
host:'https://www.fujutv.net',
    //https://www.fujuyy.com/sptype/20-2.html
    //https://www.fujutv.net/spshow/fyclass--------fypage---.html
    //https://www.fujutv.net/spsearch/**----------fypage---.html
url:'/spshow/fyclass--------fypage---.html',
searchUrl:'/spsearch/**----------fypage---.html',
searchable:2,//是否启用全局搜索,
quickSearch:0,//是否启用快速搜索,
filterable:0,//是否启用分类筛选,
class_name:'电视剧&电影&综艺&动漫',
class_url:'20&21&23&22',
play_parse:true,
lazy:'',
limit:6,
// 推荐:'ul.myui-vodlist;ul li;*;*;*;*',
推荐:'ul.myui-vodlist;li;*;*;*;*',
// 推荐:'ul.myui-vodlist;ul&&li;*;*;*;*', // 此写法本地js无效
double:true, // 推荐内容是否双层定位
一级:'.myui-vodlist__box;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
二级:{"title":"h1&&Text;.data:eq(0) a:eq(0)&&Text","img":".lazyload&&data-original","desc":";.data:eq(0) a:eq(2)&&Text;.data:eq(0) a:eq(1)&&Text;.data:eq(2)&&Text;.data:eq(3)&&Text","content":".text-collapse span&&Text","tabs":".myui-panel__head h3","lists":".myui-content__list:eq(#id) li"},
搜索:'ul.myui-vodlist__media li;*;*;*;*',
}
