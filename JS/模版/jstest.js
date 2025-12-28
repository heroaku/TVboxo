var rule = {
    title: '好看动漫',
    host: 'https://777tv.ai',
    url: '/vod/show/id/fyclass/page/fypage.html',
  //https://777tv.ai/vod/show/id/fyclass/page/fypage.html
    searchUrl: 'https://www.youjiula.com/search.php?page=fypage&searchword=**&searchtype=',
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
    headers: {
        'User-Agent': 'UC_UA', // "Cookie": ""
    }, // class_parse:'.stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;/(\\d+).html',
    class_parse: '.stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;.*/(.*?).html',
    play_parse: true,
    lazy: '',
    limit: 6,
    推荐: 'ul.stui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double: true, // 推荐内容是否双层定位
    一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    /*
    二级: {
        "title": ".stui-content__detail .title&&Text;.stui-content__detail p:eq(-2)&&Text",
        "img": ".stui-content__thumb .lazyload&&data-original",
        "desc": ".stui-content__detail p:eq(0)&&Text;.stui-content__detail p:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text",
        "content": "#desc&&Text",
        "tabs": ".stui-pannel__head h3",
        //"tabs": ".stui-pannel:gt(0) h3",
        "lists": ".stui-pannel:eq(#id)&&.stui-content__playlist li"
    },

    二级:  {
    "title": ".stui-content__detail .title&&Text",
    "img": ".stui-content__thumb .lazyload&&data-original",
    "desc": ".stui-content__detail p.data:eq(0)&&Text;.stui-content__detail p.data:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text",
    "content": "#desc .stui-content__desc&&Text",
     "tabs": ".stui-pannel h4.title",
     "lists": ".stui-pannel:eq(#id) .stui-content__playlist li"
   // "tabs": ".stui-pannel__head .title",
   // "lists": ".stui-pannel:eq(#id)&&.stui-content__playlist li"
},
    */
二级: `js:
  pdfh = jsp.pdfh; pdfa = jsp.pdfa; pd = jsp.pd;
  let html = input;

  // 提取基础信息
  let title = pdfh(html, '.stui-content__detail .title&&Text');
  let img = pdfh(html, '.stui-content__thumb .lazyload&&data-original');
  let descLines = pdfa(html, '.stui-content__detail p.data');
  let year = '', actor = '', director = '', status = '', update = '';
  descLines.forEach(p => {
    let text = pdfh(p, '&&Text');
    if (text.includes('年份：')) year = text.replace('年份：', '').trim();
    else if (text.includes('主演：')) actor = text.replace('主演：', '').trim();
    else if (text.includes('導演：')) director = text.replace('導演：', '').trim();
    else if (text.includes('狀態：')) status = text.replace('狀態：', '').trim();
    else if (text.includes('更新：')) update = text.replace('更新：', '').trim();
  });
  let content = pdfh(html, '#desc .stui-content__desc&&Text');

  // 提取有效播放线路（排除剧情介绍和猜你喜欢）
  let tabs = [];
  let urls = [];

  let panels = pdfa(html, '.stui-pannel');
  panels.forEach(pan => {
    let playlist = pdfa(pan, '.stui-content__playlist li');
    if (playlist.length > 0) {
      let tabName = pdfh(pan, 'h4.title&&Text');
      if (tabName && tabName.trim()) {
        tabs.push(tabName);
        let playList = playlist.map(li => {
          let name = pdfh(li, 'a&&Text');
          let url = pd(li, 'a&&href');
          return name + '$' + url;
        }).join('#');
        urls.push(playList);
      }
    }
  });

  VOD = {
    vod_name: title,
    vod_pic: img,
    vod_year: year,
    vod_actor: actor,
    vod_director: director,
    vod_content: content,
    vod_remarks: status + ' / ' + update,
    vod_play_from: tabs.join('$$$'),
    vod_play_url: urls.join('$$$')
  };
`,
    搜索: 'ul.stui-vodlist&&li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',

}
