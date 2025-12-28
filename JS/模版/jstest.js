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
  let title = pdfh(html, '.stui-content__detail .title&&Text');
  let img = pdfh(html, '.stui-content__thumb .lazyload&&data-original');
  let content = pdfh(html, '#desc .stui-content__desc&&Text');
  let desc1 = pdfh(html, '.stui-content__detail p:eq(0)&&Text');
  let desc2 = pdfh(html, '.stui-content__detail p:eq(1)&&Text');
  let desc3 = pdfh(html, '.stui-content__detail p:eq(2)&&Text');
  let desc4 = pdfh(html, '.stui-content__detail p:eq(3)&&Text');
  let desc5 = pdfh(html, '.stui-content__detail p:eq(4)&&Text');
  let desc = [desc1, desc2, desc3, desc4, desc5].filter(s => s).join(' / ');

  let tabs = [];
  let urls = [];
  pdfa(html, '.stui-pannel').forEach(pan => {
    let list = pdfa(pan, '.stui-content__playlist li');
    if (list.length > 0) {
      let tab = pdfh(pan, 'h4.title&&Text');
      if (tab) {
        tabs.push(tab);
        urls.push(list.map(li => pdfh(li, 'a&&Text') + '$' + pd(li, 'a&&href')).join('#'));
      }
    }
  });

  VOD = {
    vod_name: title,
    vod_pic: img,
    vod_content: content,
    vod_actor: desc,
    vod_play_from: tabs.join('$$$'),
    vod_play_url: urls.join('$$$')
  };
`,
    搜索: '.stui-vodlist__item li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
}

