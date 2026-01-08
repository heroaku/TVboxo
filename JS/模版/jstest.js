var rule = {
  title: '策驰影院',
  host: 'https://kuyingju.com',
  //https://kuyingju.com/index.php/vod/show/class/%E5%89%A7%E6%83%85/id/2/page/2.html
  //https://kuyingju.com/index.php/vod/detail/id/5797.html
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  searchUrl: '/sou/?wd=**',
  searchable: 2,
  quickSearch: 0,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  url: '/index.php/vod/show/id/fyclass/page/fypage.html',
  filterable: 0,
  filter_url: '',
  filter: {},
  filter_def: {},
  detailUrl: '/index.php/vod/detail/id/fyid.html',
  play_parse: true,
  lazy: "js:\n  let html = request(input);\n  let hconf = html.match(/r player_.*?=(.*?)</)[1];\n  let json = JSON5.parse(hconf);\n  let url = json.url;\n  if (json.encrypt == '1') {\n    url = unescape(url);\n  } else if (json.encrypt == '2') {\n    url = unescape(base64Decode(url));\n  }\n  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {\n    input = {\n      parse: 0,\n      jx: 0,\n      url: url,\n    };\n  } else {\n    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;\n  }",
  limit: 6,
  推荐: 'ul.swiper-wrapper li;a&&title;.lazyload&&data-original;.item-status&&Text;a&&href',
  一级: '.vod-list ul li;a&&title;.lazyload&&data-original;.item-status&&Text;a&&href',
  二级: {
    title: 'h1&&Text;.row&&span&&Text',
    img: '.lazyload&&data-original',
    desc: '.row&&Text;.row&&span:eq(2)&&Text;.row&&span:eq(1)&&Text;.row&&span:eq(3)&&Text;.row&&span:eq(4)&&Text;',
    content: '.text.text-row&&Text',
    tabs: '.swiper-wrapper li',
    lists: '.ewave-playlist-content:eq(#id) li',
  },
  搜索: '*',
}
