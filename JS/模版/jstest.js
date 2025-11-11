var rule={
    title: '热播影视',
    host: 'https://www.rebovod.com',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
  //https://www.rebovod.com/index.php/vod/show/id/fyclass/page/fypage.html
    //https://www.rebovod.com/index.php/vod/search/page/fypage/wd/**.html
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
    'User-Agent': 'MOBILE_UA',
    },
    //class_parse: '.head-nav&&ul&&li;a&&Text;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&短剧',
    class_url:'1&2&z3&4&5',
    play_parse: false,
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    limit: 6,
    推荐: '.public-list-box;a;a&&title;img&&data-src;.public-list-prb&&Text;a&&href',
    double: true,
    一级: '.public-list-box;a&&title;img&&data-src;.public-list-prb&&Text;a&&href',
    二级: {
    "title": ".this-desc-title&&Text;.focus-item-label-original&&Text",
    "img": ".lazyload&&data-original",
    "desc": ".this-desc-info&&span:eq(1)&&Text;.this-desc-info&&span:eq(2)&&Text;.this-info:eq(1)&&Text;.this-info&&Text",
    "content": ".module-info-introduction&&Text",
    "tabs": ".anthology-tab&&.swiper-wrapper a",
    "lists": ".anthology-list-box:eq(#id) ul li"},
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',}
