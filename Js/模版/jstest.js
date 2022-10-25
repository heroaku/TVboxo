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
});
