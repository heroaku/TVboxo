var rule={
		title:'NY影院',
		host:'https://www.nycvod.com',
		url:'/vodshow/fyclass-fyfilter-----fypage---{{fl.year}}.html',
 		searchUrl:'/vodsearch/**----------fypage---.html',
		searchable:2,//是否启用全局搜索,
		quickSearch:0,//是否启用快速搜索,
		filterable:1,//是否启用分类筛选,
		cate_exclude:'电影|电视剧|综艺|动漫|竞技体育',
		filter:{
	    '1':[{'key':'cyass','name':'剧情','value':[{'n':'全部','v':''},{'n':'伦理','v':'伦理'}]},{'key':'area','name':'地区','value':[{'n':'全部','v':''},{'n':'大陆','v':'大陆'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'英国','v':'英国'},{'n':'日本','v':'日本'},{'n':'韩国','v':'韩国'},{'n':'德国','v':'德国'},{'n':'泰国','v':'泰国'},{'n':'印度','v':'印度'},{'n':'意大利','v':'意大利'},{'n':'西班牙','v':'西班牙'},{'n':'加拿大','v':'加拿大'},{'n':'其他','v':'其他'}]},{'key':'year','name':'年代','value':[{'n':'全部','v':''},{'n':'2024','v':'2024'},{'n':'2023','v':'2023'},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'},{'n':'2016','v':'2016'},{'n':'2015','v':'2015'},{'n':'2014','v':'2014'},{'n':'2013','v':'2013'},{'n':'2012','v':'2012'},{'n':'2011','v':'2011'},{'n':'2000之前','v':'lt|2000'}]},{'key':'by','name':'排序','value':[{'n':'全部','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}]
	
        },	
        filter_url:'{{fl.area}}-{{fl.by}}-{{fl.cyass}}',       
        class_name:'電影',
        class_url:'1',
        class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
	//        cate_exclude:'演员',
		play_parse:true,
		lazy:'',
		limit:6,
		推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
		double:true, // 推荐内容是否双层定位
		一级:'.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
		二级:{'title':'h1&&Text;.tag-link&&Text','img':'.module-item-pic&&img&&data-src','desc':'.video-info-items:eq(-2)&&Text;.video-info-items:eq(-1)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item&&Text;.video-info-items:eq(0)&&.video-info-item&&Text','content':'.vod_content&&Text','tabs':'.module-tab-item','lists':'.module-player-list:eq(#id)&&.scroll-content&&a'},
		搜索:'.module-items .module-search-item;h3&&Text;*;.video-serial&&Text;*',
}
