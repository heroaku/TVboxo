var rule={
		title: '黑夜影视',
		host: 'https://m.sdjinhengli.com',
		url: '/kkersw/fyclass--------fypage---.html',
		searchUrl: '/tag/page/fypage/wd/**/',
        //https://m.sdjinhengli.com/kkersw/fyclass--------fypage---.html
		//https://darkvod.com/tag/page/fypage/wd/**/
		searchable: 2,//是否启用全局搜索,
		quickSearch: 0,//是否启用快速搜索,
		filterable: 0,//是否启用分类筛选,
		headers: {//网站的请求头,完整支持所有的,常带ua和cookies
		'User-Agent': 'MOBILE_UA',
		// "Cookie": "searchneed=ok"
		},
		//class_parse: '.myui-header__menu li.hidden-sm:gt(0):lt(5);a&&Text;a&&href',
        class_name:'电影&电视剧&综艺&动漫&短剧',
        class_url:'1&2&3&4&shuangwenduanju',
		play_parse: true,
        lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
		limit: 6,
		推荐: 'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
		double: true, // 推荐内容是否双层定位
		一级: '.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
		二级: {
		"title": ".myui-content__detail .title&&Text;.myui-content__detail p:eq(-2)&&Text",
		"img": ".myui-content__thumb .lazyload&&data-original",
		"desc": ".myui-content__detail p:eq(0)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(2)&&Text",
		"content": ".content&&Text",
		"tabs": ".nav-tabs:eq(0) li",
		"lists": ".myui-content__list:eq(#id) li"
		},
		搜索: '#searchList li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',
		}
