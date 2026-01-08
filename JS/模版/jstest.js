var rule = {
  title: 'SKR影院',
  host: 'https://xymv.com',
	//https://xymv.com/vodshow/dianshiju-----------.html
  url: '/vodshow/fyclass--------fypage---.html',
  //https://www.skr2.cc/vodshow/32--------2---/
  //https://www.ketv.cc/search/**----------fypage---.html
  searchUrl: '/search/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  //class_parse: '.top_nav.clearfix li;a&&Text;a&&href;/.*-(.*?).html',
  //class_name:'电影&电视剧&综艺&动漫&国产剧&港台剧&日本剧&海外剧&纪录片',
  //class_url:'1&2&3&4&82&32&83&88',
  class_name: '电影&电视剧&综艺&动漫&短剧&解说&体育',
  class_url: 'dianying&dianshiju&zongyi&dongman&duanju&dianyingjieshuo&tiyu',
  play_parse: true,
  lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
  limit: 6,
  推荐: '.cbox_list li;.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
  double: true,
  一级: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
二级: {
    title: 'h2.title a&&Text',
    img: '.play_vlist_thumb.vnow&&data-original',
    desc: '.panel.play_content:eq(0) p:eq(0)&&Text;' +
          '.panel.play_content:eq(0) p:eq(1)&&Text;' +
          '.play_text&&Text;' +
          '.panel.play_content:eq(0) p:contains("每天")&&Text',
    content: '.play_text&&Text',
   tabs: '.title_nav li a&&Text;replace(高清,)',
    lists: '.tabs .content:eq(#id) .content_playlist li a'
},
  搜索: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
}
