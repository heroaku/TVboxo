var rule = {
  title: '飞飞影视',
  host: 'https://www.ffys.fun',
  url: '/vodshow/id/fyclass/page/fypage.html[/type/fyclass.html]',
  searchUrl: '/vodsearch**/page/fypage.html',
  searchable: 1, quickSearch: 0, filterable: 0,
  headers: {
    'User-Agent': 'UC_UA'
  },
  class_name: '电影&剧集&综艺&动漫&纪录片&短剧&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&动画片&国产剧&港台剧&日韩剧&欧美剧&泰国剧',
  class_url: '20&21&23&22&24&25&26&27&28&29&30&31&32&33&34&35&36&37&38',
  play_parse: true, limit: 6, double: true, 推荐: '*',
  lazy: `js:let html = request(input);
input=html.match(/[a-zA-z]+://[^\s]*.*.m3u8/g) }`,
  一级: '.module-items a;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
  二级: {
    title: '.module-info-main&&h1',
    img: '.lazyload&&data-original',
    desc: '.module-info-main&&.module-info-tag-link:eq(2)&&Text;..module-info-main&&.module-info-item:eq(3)&&Text;;.module-info-main&&.module-info-item:eq(2)&&Text;.module-info-main&&.module-info-item:eq(1)&&Text',
    content: '.module-info-introduction-content&&Text',
    tabs: '.module-tab-item.tab-item',
    lists: '.module-play-list-content:eq(#id) a',
  },
  搜索: '*',
}
