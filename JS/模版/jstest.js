var rule={
    title: '映像星球',
    host: 'https://www.937tv.vip',
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/search/**----------fypage---.html',
  //https://www.937tv.vip/vodshow/lianxuju-----------.html
    //https://www.55yy7.com/vodsearch/**----------fypage---.html
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
    'User-Agent': 'MOBILE_UA',
    },
    //class_parse: '.head-nav&&ul&&li;a&&Text;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&短剧',
    class_url:'dianying&lianxuju&zongyi&dongman&duanju',
    play_parse: false,
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    limit: 6,
    推荐: '.public-list-box;a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    double: true,
    一级: '.public-list-box;a&&title;img&&data-src;.public-list-prb&&Text;a&&href',
    二级: {
    "title": "h1&&Text;.module-info-tag&&Text",
    "img": ".lazyload&&data-original",
    "desc": ".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&Text",
    "content": ".module-info-introduction&&Text",
    "tabs": ".hisSwiper&&span",
    "lists": ".his-tab-list:eq(#id) a"},
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',}
