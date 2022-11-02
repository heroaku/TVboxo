var rule = Object.assign(muban.vfed,{
title:'zhui影院',
host:'https://www.zhuijumi.cc',
url:'/videotype//fyclass--------fypage---.html',
searchUrl:'/vodsearch/**-fypage.html',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.fed-list-info.fed-part-rows;li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.fed-list-info&&li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href',
    二级:{"title":"h1.fed-part-eone&&Text;.fed-deta-content&&.fed-part-rows&&li&&Text","img":".fed-list-info&&a&&data-original","desc":".fed-deta-content&&.fed-part-rows&&li:eq(1)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(2)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(3)&&Text","content":".fed-part-esan&&Text","tabs":".fed-drop-boxs&&.fed-part-rows&&li","lists":".fed-play-item:eq(#id)&&ul:eq(1)&&li"},
    搜索:'.fed-deta-info;h1&&Text;.lazyload&&data-original;.fed-list-remarks&&Text;a&&href;.fed-deta-content&&Text',
});
