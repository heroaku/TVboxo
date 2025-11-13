var rule={
    title: 'FROK影视',
    host: 'https://www.freeokk.pro',
    url: '/show/fyfilter--------fypage---.html',
    searchUrl: '/search/**----------fypage---.html',
  //https://www.freeokk.pro/show/2--------2---.html
    //https://www.freeokk.pro/search/ai----------2---.html
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
    'User-Agent': 'MOBILE_UA',
    },
    class_parse: '.navbar&&ul&&li;a&&Text;a&&href;/(\\d+).html',
	  //class_name:'电影&电视剧&综艺&动漫',
    //class_url:'1&2&3&4',  
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
