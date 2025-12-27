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
    */
    二级:  {
    "title": ".stui-content__detail .title&&Text",
    "img": ".stui-content__thumb .lazyload&&data-original",
    "desc": ".stui-content__detail p.data:eq(0)&&Text;.stui-content__detail p.data:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text",
    "content": "#desc .stui-content__desc&&Text",
    "tabs": ".stui-pannel:gt(0):not(:last) .stui-pannel__head h4.title",
    "lists": ".stui-pannel:gt(0):not(:last):eq(#id) .stui-content__playlist li"
},
    搜索: 'ul.stui-vodlist&&li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',

}
