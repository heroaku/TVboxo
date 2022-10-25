muban.首图.二级.重定向='js:let url = jsp.pd(html,".playbtn&&a&&href");log("重定向到:"+url);html = request(url)';
muban.首图.二级.tabs='.t-ul&&li';
muban.首图.二级.lists='.stui-content__playlist:eq(#id)&&li';

var rule = Object.assign(muban.首图,{
title:'七小时影院',
host:'https://www.qxsyy.com',
url:'/type/fyclass-fypage.html',
searchUrl:'/search/**----------fypage---.html',
class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
});
