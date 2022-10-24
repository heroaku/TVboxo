var rule = Object.assign(muban.mxpro,{
title:'豆芽影院',
host:'https://www.imdy.tv',
class_parse:'.navbar-items li:gt(1):lt(8);a&&Text;a&&href;.*-(.*?).html',
});
