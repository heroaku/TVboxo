var rule = {
    title: '萌番[漫]',
    host: 'http://www.dubokutv.cn',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/search/wd/**/page/fypage/',
  //http://www.dubokutv.cn/index.php/vod/show/id/fyclass/page/fypage.html
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    class_name: '新番&番剧&剧场',
    class_url: '1&2&3',
    limit: 6,
    play_parse: true,
    lazy: $js.toString(() => {
        let html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (url) {
            input = {parse: 0, url: url}
        }
    }),
    double: false,
    推荐: '*',
    一级: '.hl-vod-list li;.hl-item-thumb&&title;.hl-item-thumb&&data-original;.remarks&&Text;.hl-item-thumb&&href',
    二级: {
        title: 'h2&&Text',
        desc: '.hl-full-box&&li:eq(-2)&&Text',
        content: '.blurb&&Text',
        img: '.hl-item-thumb&&data-original',
        tabs: '.hl-plays-from a',
        lists: '.hl-plays-list:eq(#id)&&li',
    },
    搜索: '*',
}

/*

var rule = {
  title: 'FREE影视',
  host: 'https://freeys.org',
  url: '/list/fypage/fyclass/0/0/0/0/0',
  searchUrl: '/search/index.html?keyword=**&page=fypage',
  // https://freeys.org/list/fypage/fyclass/0/0/0/0/0
  //https://freeys.org/search/index.html?keyword=**&page=fypage
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  filter: '',
  filter_url: '',
  filter_def: {},
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  //timeout: 5000,
  //class_parse: 'ul.flex.around&&li;a&&Text;a&&href;.*/(.*?).html',
  //cate_exclude: '',
 /* 
class_name:'电影&电视剧&综艺&动漫&短剧',
  class_url:'1&2&3&4&45',
  play_parse: false,
  lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
  double: true,
  推荐: '*',
  一级: 'body&&.public-list-box;.time-title&&Text;img&&data-src;.public-list-prb&&Text;a&&href',
  二级: {
    title: 'h3&&Text;类型',
    img: '.mask-0&&data-src',
    desc: '.detail-info .this-info&&span:eq(1)--strong&&Text;.detail-info .this-info&&span:eq(2)--strong&&Text;.detail-info .this-info&&span:eq(3)--strong&&Text;.lightSpeedIn .this-info:eq(4)--strong&&Text;.lightSpeedIn .this-info:eq(3)--strong&&Text',
    content: '#height_limit&&Text',
    tabs: '.anthology-tab a',
    lists: '.anthology-list-play:eq(#id)&&li',
    tab_text: 'a--span&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
  },
   搜索: '*',
}
