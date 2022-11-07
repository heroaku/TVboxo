var rule = Object.assign(muban.mxpro,{
title:'鸭奈飞',
//host:'https://yanetflix.com',
host:'https://yanetflix.tv/',
url:'/vodshow/fyclass--------fypage---.html',
class_parse:'.navbar-items li;a&&Text;a&&href;.*/(.*?).html',
});
