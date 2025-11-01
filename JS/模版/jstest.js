
var rule={
	title:'老王电影',

	模板:'mxone5',
  host: "https://mxvod.com",
	//https://mxvod.com/vodshow/fyclass--------fypage---.html
	url: "/vodshow/fyclass--------fypage---.html",
  //url: "/vs/fyclassfyfilter.html",
  searchUrl: "/s**/page/fypage.html",
  //filterable: 1,
	filterable: 0, 


    class_parse: '.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
	lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
	搜索: '.module-items .module-search-item;.video-serial&&title;img&&data-src;.video-serial&&Text;.video-serial&&href;.video-serial&&Text',
}
