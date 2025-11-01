var rule = {
    title:'多瑙影视',
    host:'https://bcvod.com',
    url:'/vodshow/fyclass--------fypage---.html',
	//https://bcvod.com/vodshow/fyclass--------fypage---.html
   // url:'/index.php/vod/show/id/fyfilter.html',
    filterable:0,//是否启用分类筛选,

    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    class_parse: '.top_nav li:gt(0):lt(5);a&&Text;a&&href;.*/(\\d+).html',
    play_parse:true,
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);log(html);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
   //	lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",

	limit:6,
    推荐:'*',
    一级:'li.vodlist_item;a&&title;a&&data-original;.pic_text&&Text;a&&href',
    二级:{
		"title":"h2&&Text;.data:eq(0)&&Text",
		"img":".lazyload&&data-original",
		"desc":".data:eq(1)&&Text;;;.data--span:eq(2)&&Text;.data--span:eq(3)&&Text",
		"content":".full_text--a&&Text",
		"tabs":".play_source_tab--i&&a",
		"lists":"div.playlist_full:eq(#id) li"
	},
    搜索:'li.searchlist_item;*;*;*;*',
}
