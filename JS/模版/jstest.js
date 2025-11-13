var rule={
		title: '枫林影视',
		host: 'https://8maple.st',
		url: '/filter/fyfilter--------fypage---.html',
		searchUrl: '/search/**----------fypage---.html',
        //https://8maple.st/filter/fyclass--------fypage---.html
		//https://8maple.st/search/**----------fypage---.html
		searchable: 2,//是否启用全局搜索,
		quickSearch: 0,//是否启用快速搜索,
		filterable: 0,//是否启用分类筛选,
	    filter_url:'{{fl.cateId}}',
	    filter:{
	        "movie":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"movie"},{"n":"动作片","v":"action"},{"n":"喜剧片","v":"comedy"},{"n":"科幻片","v":"sciencefiction"},{"n":"恐怖片","v":"horror"},{"n":"爱情片","v":"love"},{"n":"战争片","v":"war"},{"n":"剧情片","v":"drama"},{"n":"动画电影","v":"cartoon"},{"n":"纪录片","v":"documentary"}]}],
	        "tv":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"tv"},{"n":"国产剧","v":"cn"},{"n":"港剧","v":"hk"},{"n":"台剧","v":"tw"},{"n":"韩剧","v":"kr"},{"n":"日剧","v":"jp"},{"n":"美剧","v":"us"},{"n":"泰剧","v":"taidrama"},{"n":"其他剧","v":"etc"}]}],
	        "show":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"show"},{"n":"国产综艺","v":"cntvshow"},{"n":"日韩综艺","v":"jpkrtvshow"},{"n":"欧美综艺","v":"ustvshow"},{"n":"港台综艺","v":"twhktvshow"}]}],
	        "anime":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"anime"},{"n":"日韩动漫","v":"jpkranime"},{"n":"国产动漫","v":"cnanime"},{"n":"欧美动漫","v":"usanime"}]}]
	    },
	    filter_def:{
	        movie:{cateId:'movie'},
	        tv:{cateId:'tv'},
	        show:{cateId:'show'},
	        anime:{cateId:'anime'}
	    },
		headers: {//网站的请求头,完整支持所有的,常带ua和cookies
		'User-Agent': 'MOBILE_UA',
		// "Cookie": "searchneed=ok"
		},
		//class_parse: '.myui-header__menu li.hidden-sm:gt(0):lt(5);a&&Text;a&&href',
        class_name:'电影&电视剧&综艺&动漫',
    	class_url:'movie&tv&show&anime',
		play_parse: true,
    	lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
		limit: 6,
		推荐: 'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
		double: true, // 推荐内容是否双层定位
		一级: '.myui-vodlist li;a&&title;a&&data-original;.pic-text:eq(1)&&Text;a&&href',
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
