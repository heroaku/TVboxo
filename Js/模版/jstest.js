muban.首图2.二级.content = '.stui-content__desc&&Text';
muban.首图2.二级.title = '.stui-content__detail&&h3&&Text;.stui-content__detail&&p:eq(1)&&Text;';
muban.首图2.二级.重定向='js:let url = jsp.pd(html,".playbtn&&a&&href");log("重定向到:"+url);html = request(url)';
muban.首图2.二级.tabs='.t-ul&&li';
muban.首图2.二级.lists='.stui-content__playlist:eq(#id)&&li';

var rule = Object.assign(muban.首图2,{
title:'七小时影院',
host:'https://www.qxsyy.com',
url:'/type/fyclass-fypage.html',
searchUrl:'/search/**----------fypage---.html',
class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":".myui-content__detail .title&&Text;.myui-content__detail p:eq(-2)&&Text","img":".myui-content__thumb .lazyload&&data-original","desc":".myui-content__detail p:eq(0)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(2)&&Text","content":".content&&Text","tabs":".nav-tabs:eq(0) li","lists":".myui-content__list:eq(#id) li"},
    搜索:'#searchList li;a&&title;.lazyload&&data-original;.pic_text.text_right&&Text;a&&href;.text-muted:eq(-1)&&Text',
});
