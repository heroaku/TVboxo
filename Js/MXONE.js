var rule = Object.assign(muban.mxpro,{
	title:'MXONE',
    host:'https://www.jpys.me',
    url:'vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html/',
class_parse:'.navbar-items li:gt(2):lt(8);a&&Text;a&&href;/(\\d+).html',
});
