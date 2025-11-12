var rule={
    title: '555影视',
    host: 'https://www.nivod.vip',
    url: '/k/fyfilter--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
  //https://www.nivod.vip/k/2--------2---/
    //https://www.55yy7.com/vodsearch/**----------fypage---.html
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
    'User-Agent': 'MOBILE_UA',
    },
    //class_parse: '.navbar&&ul&&li;a&&Text;a&&href;/(\\d+).html',
	class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',  
    filter_url:'{{fl.cateId}}',
	filter: {"1":[{"key":"cateId","name":"类型","value":[{"v":"1","n":"全部"},{"v":"7","n":"喜剧"},{"v":"8","n":"爱情"},{"v":"11","n":"恐怖"},{"v":"6","n":"动作"},{"v":"9","n":"科幻"},{"v":"20","n":"战争"},{"v":"24","n":"犯罪"},{"v":"26","n":"动画"},{"v":"10","n":"奇幻"},{"v":"12","n":"剧情"},{"v":"23","n":"冒险"},{"v":"22","n":"悬疑"},{"v":"45","n":"惊悚"},{"v":"48","n":"网络"}]}],"2":[{"key":"cateId","name":"类型","value":[{"v":"2","n":"全部"},{"v":"13","n":"国产"},{"v":"14","n":"港台"},{"v":"33","n":"韩剧"},{"v":"16","n":"欧美剧"},{"v":"15","n":"日剧"},{"v":"34","n":"泰剧"},{"v":"35","n":"新马剧"},{"v":"25","n":"其它"}]}],"3":[{"key":"cateId","name":"类型","value":[{"v":"2","n":"全部"},{"v":"27","n":"内地"},{"v":"28","n":"港台"},{"v":"29","n":"日本"},{"v":"36","n":"韩国"},{"v":"30","n":"欧美"},{"v":"37","n":"新马泰"},{"v":"38","n":"其它"}]}],"4":[{"key":"cateId","name":"类型","value":[{"v":"4","n":"全部"},{"v":"31","n":"国产"},{"v":"32","n":"日本"},{"v":"39","n":"韩国"},{"v":"40","n":"港台"},{"v":"41","n":"新马泰"},{"v":"42","n":"欧美"},{"v":"43","n":"其它"}]}]},
	filter_def:{
		1:{cateId:'1'},
		2:{cateId:'2'},
		3:{cateId:'3'},
		4:{cateId:'4'}
	},
	play_parse: true,
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    limit: 6,
    推荐: '.module-items;a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    double: true,
    一级: 'a.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    二级: {
    "title": "h1&&Text;.module-info-tag&&Text",
    "img": ".lazyload&&data-original",
    "desc": ".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&Text",
    "content": ".module-info-introduction&&Text",
    "tabs": ".hisSwiper&&span",
    "lists": ".his-tab-list:eq(#id) a"},
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',}
