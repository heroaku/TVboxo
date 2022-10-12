muban.首图2.二级.tabs = '.stui-pannel__head.bottom-line.active.clearfix h3';
muban.首图2.二级.content = '.stui-content__desc&&Text';
var rule = Object.assign(muban.首图2,{
title:'秋霞',
host:'https://www.qiuxiayb.com',
url:'/vodtype/fyclass-fypage.html',
class_parse:'.stui-header__menu li;a&&Text;a&&href;.*/(.*?).html',
searchUrl:'/search/**----------fypage---.html',
搜索:'ul.stui-vodlist&&li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
});
