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
	class_name:'电影&电视剧&综艺&动漫&哔站&国产剧&港台剧&日韩剧&欧美剧&直播',
    class_url:'1&2&3&4&5&13&14&15&16&27',  
    filter_url:'{{fl.cateId}}',
    filter: {"1":[{"key":"cateId","name":"类型","value":[{"v":"1","n":"全部"},{"v":"6","n":"喜剧"},{"v":"7","n":"爱情"},{"v":"8","n":"恐怖"},{"v":"9","n":"动作"},{"v":"10","n":"科幻"},{"v":"11","n":"战争"},{"v":"12","n":"犯罪"},{"v":"13","n":"动画"},{"v":"14","n":"奇幻"},{"v":"15","n":"剧情"},{"v":"16","n":"冒险"},{"v":"17","n":"悬疑"},{"v":"18","n":"惊悚"},{"v":"19","n":"其它"}]}],"2":[{"key":"cateId","name":"类型","value":[{"v":"2","n":"全部"},{"v":"20","n":"大陆"},{"v":"21","n":"TVB"},{"v":"22","n":"韩剧"},{"v":"23","n":"美剧"},{"v":"24","n":"日剧"},{"v":"25","n":"英剧"},{"v":"26","n":"台剧"},{"v":"27","n":"其它"}]}],"4":[{"key":"cateId","name":"类型","value":[{"v":"4","n":"全部"},{"v":"38","n":"搞笑"},{"v":"39","n":"恋爱"},{"v":"40","n":"热血"},{"v":"41","n":"格斗"},{"v":"42","n":"美少女"},{"v":"43","n":"魔法"},{"v":"44","n":"机战"},{"v":"45","n":"校园"},{"v":"46","n":"亲子"},{"v":"47","n":"童话"},{"v":"48","n":"冒险"},{"v":"49","n":"真人"},{"v":"50","n":"LOLI"},{"v":"51","n":"其它"}]}]},
    filter_def:{
	1:{cateId:'1'},
	2:{cateId:'2'},
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
