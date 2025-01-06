var rule = {
  title: 'KimiVod',
  host: 'https://kimivod.com/vod/show/id/2/page/2.html',
  url: '/vod/show/id/fyclass/page/fypage.html',
  searchUrl: '/vodsearch.html?wd=**',
  searchable: 2,quickSearch: 0,filterable: 0,
  headers: {'User-Agent': 'MOBILE_UA'},
class_name: '电影&剧集&综艺&动漫&短剧&国产剧&韩剧&美剧&日剧&台剧&港剧&海外剧&纪录片&泰剧&战争片&动画电影&悬疑片&奇幻片&爱情片&恐怖片&剧情片&动作片&科幻片&喜剧片&国产动漫&日本动漫&韩国动漫&欧美动漫&港台动漫&台港综艺&欧美综艺&韩日综艺&国产综艺',
class_url: '2&1&4&3&39&6&7&8&9&10&11&12&26&32&22&23&24&25&21&20&13&14&15&16&28&27&29&30&31&36&33&34&38',
  play_parse: true,limit: 6,double: true,
  lazy: `js:
  let html=request(input);
  input=html.match(/vid\s*=\s*["'](.*?)["']/)[1];
  `,
  推荐: '*',
  一级: '.grid .s6.m3;a&&title;img&&data-src;.white-text.small-text&&Text;a&&href',
  二级: {
    title: 'h1&&Text',
    img: 'img&&data-src',
    desc: '.grid&&.error-text&&Text;.grid&&nav&&a:ep(2)&&Text;.grid&&nav&&a:ep(1)&&Text;.grid&&p:ep(1)&&Text;.grid&&p:ep(0)&&Text',
    content: '.right-align&&Text',
    tabs: '.tabs span',
    lists: '.playno:eq(#id) a'
  },
  搜索: '*',
}
