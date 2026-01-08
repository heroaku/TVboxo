var rule = {
  title: 'SKR影院',
  host: 'https://xymv.com',
  url: '/vodshow/fyclass-----------fypage---.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  class_name: '电影&电视剧&综艺&动漫&短剧&解说&体育',
  class_url: 'dianying&dianshiju&zongyi&dongman&duanju&dianyingjieshuo&tiyu',

  play_parse: true,
  lazy: `
    let html = JSON.parse(request(input).match(/player_aaaa=({.*?})</)[1]);
    let url = html.url;
    if (html.encrypt == '1') {
      url = unescape(url);
    } else if (html.encrypt == '2') {
      url = unescape(base64Decode(url));
    }
    if (/m3u8|mp4/.test(url)) {
      input = url;
    } else {
      input = html.link;
    }
  `,

  limit: 6,

  推荐: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
  double: false, // 无需二次跳转

  一级: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',

  二级: {
    title: 'h2.title a&&Text',
    img: '.play_vlist_thumb.vnow&&data-original',
    desc: '.panel.play_content:eq(0) p:eq(0)&&Text;' +
          '.panel.play_content:eq(0) p:eq(1)&&Text;' +
          '.play_text&&Text;' +
          '.panel.play_content:eq(0) p:contains("每天")&&Text',
    content: '.play_text&&Text',
    tabs: '.title_nav li a',
    lists: '.content_playlist:eq(#id) li a'
  },

  搜索: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href'
}
