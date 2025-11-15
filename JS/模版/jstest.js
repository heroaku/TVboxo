var rule = {
    title:'BP影视',
    host:'https://www.6699z.cn',
    // https://www.6699z.cn/index.php/vod/show/id/fyclass/page/fypage.html
	//https://www.6699z.cn/index.php/vod/search/page/fypage/wd/**.html
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,
    quickSearch:0,
    filterable:0,
    headers:{'User-Agent':'MOBILE_UA', },
    class_name:'电视剧&电影&综艺&动漫&短剧',//静态分类名称拼接
    class_url:'2&1&3&4&58',//静态分类标识拼接
    play_parse:true,
	lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    limit:6,
    推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
    二级:{
	    "title":"h1&&Text;.video-info-aux&&div&&a:eq(0)&&Text",
    	"img":".module-item-pic&&img&&data-src",
    	"desc":";.video-info-aux&&a:eq(1)&&Text;.video-info-aux&&a:eq(2)&&Text;.video-info-items:eq(1) a&&Text;.video-info-items:eq(0) a&&Text",
    	// "content":".video-info-content&&Text",
    	"content":".sqjj_a&&Text",
    	"tabs":".module-tab-item.tab-item",
    	//"lists":".module-blocklist:eq(#id)&&.sort-item a"
		"lists":".module-player-list:eq(#id)&&.sort-item a"
	},
   // detailUrl:'https://juhuang.tv/play/fyid_play_1_1.html', //非必填,二级详情拼接链接
    // 搜索:'.module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href',
    搜索:'json:list;vod_name;vod_pic;vod_year;vod_id',
}
