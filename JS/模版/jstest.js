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
  二级: js:'''
    let d = [];
    let title = pdfh(html, 'h2.title a&&Text');
    let img = pdfh(html, '.play_vlist_thumb.vnow&&data-original');

    // desc: 年份/地区/类型 + 导演 + 主演 + 更新提示
    let yearInfo = pdfh(html, '.play_text&&Text') || '';
    let year = '', area = '', genre = '';
    if (yearInfo.includes('/')) {
        let parts = yearInfo.split('/');
        year = (parts[0] || '').trim();
        area = (parts[1] || '').trim();
        genre = (parts[2] || '').trim();
    }

    let director = pdfh(html, '.panel.play_content:contains("导演")&&Text') || '';
    let actor = pdfh(html, '.panel.play_content:contains("主演")&&Text') || '';
    let update = pdfh(html, '.panel.play_content:contains("每天")&&Text') || '';

    director = director.replace(/^导演：/, '').trim();
    actor = actor.replace(/^主演：/, '').trim();

    let desc = [year, area, genre, director, actor, update].filter(x => x).join(' ⬥ ');
    let content = pdfh(html, '.play_text&&Text') || '';

    // tabs: 提取所有线路名称（去除“高清线路”前缀）
    let tabEls = pdfa(html, '#bofy .title_nav li a');
    let tabs = [];
    tabEls.forEach(el => {
        let text = pdfh(el, 'a&&Text').replace(/高清线路\s*/, '').trim();
        if (text) tabs.push(text);
    });
    if (tabs.length === 0) tabs = ['默认线路'];

    // lists: 只提取当前页面的播放列表（.content_playlist 中的 a）
    let playEls = pdfa(html, '.content_playlist li a');
    let urls = playEls.map(el => {
        let t = pdfh(el, 'a&&Text');
        let u = pdfh(el, 'a&&href');
        return t + '$$' + u;
    });

    // 所有 tab 共享同一份播放列表，避免错位
    let lists = [];
    for (let i = 0; i < tabs.length; i++) {
        lists.push(urls);
    }

    d.push({
        title: title,
        img: img,
        desc: desc,
        content: content,
        tabs: tabs,
        lists: lists
    });
    VOD = d[0];
  ''',
  搜索: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
}
