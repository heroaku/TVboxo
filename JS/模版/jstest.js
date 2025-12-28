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
    二级: "js:var html = request(input);var $ = cheerio.load(html);var result = {};result.title = $('.stui-content__detail .title').text().trim();result.img = $('.stui-content__thumb .lazyload').attr('data-original');var descs = [];$('.stui-content__detail p.data').each(function(i, el){descs.push($(el).text().trim());});result.desc = descs.join('\\\\n');result.content = $('#desc .stui-content__desc').text().trim();var playlists = {};$('.stui-pannel').each(function(i, panel){var $panel = $(panel);var title = $panel.find('.stui-pannel__head h4.title').text().trim();var list = [];$panel.find('.stui-content__playlist li a').each(function(j, a){list.push($(a).text().trim() + '$' + $(a).attr('href'));});if(list.length > 0 && title !== '' && title !== '劇情介紹' && title !== '猜你喜歡'){playlists[title] = list;}});result.playlists = playlists;JSON.stringify(result);",
      搜索: '.stui-vodlist__item li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
}

