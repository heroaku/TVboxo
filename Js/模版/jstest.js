
var rule = {
     title:'AB影院',
    host:'https://abu22.com/',
    url:'vodtype/fyclass-fypage.html',
    searchUrl:'/search.php#searchword=**;post',
    headers:{ 'User-Agent':'PC_UA',},
    class_name:'电影&剧集&综艺&动漫&伦理',
    class_url:'1&2&4&3&40',
    推荐:'.stui-vodlist__item;*;*;*;*',
    一级:'.stui-vodlist__item;a&&title;a&&data-original;.pic-text&&Text;a&&href',
   
    二级:{"title":"h3&&Text;.stui-content__detail p:eq(0)&&Text","img":".lazyload&&data-original","desc":";;;.stui-content__detail p:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text","content":".stui-content__detail p:eq(5)&&Text","tabs":".stui-pannel__head.clearfix&&h3","lists":".stui-content__playlist.clearfix:eq(#id) a"},
   
    搜索:'ul.stui-vodlist__media&&li;*;*;*;*',
}
