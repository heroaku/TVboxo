var rule = {
    title: '小鸭影音',
    host: 'https://777tv.ai',
    url: '/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/vod/search/page/fypage/wd/**.html',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 5000,
    class_name: '全部&电视剧&电影&动漫&综艺&短剧',
    class_url: '0&2&1&30&29&short_series',
    limit: 20,
    
    推荐: '.stui-vodlist__bd .stui-vodlist__item;.stui-vodlist__title&&Text;.stui-vodlist__thumb&&data-original;.stui-vodlist__title a&&href;.pic-text&&Text',
    
      一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    
    "二级": {
        "title": ".stui-content__detail .title&&Text",
        "img": ".stui-content__thumb .lazyload&&data-original",
        "desc": ".stui-content__detail p.data:eq(0)&&Text;.stui-content__detail p.data:eq(1)&&Text;.stui-content__detail p.data:eq(2)&&Text;.stui-content__detail p.data:eq(3)&&Text;.stui-content__detail p.data:eq(4)&&Text",
        "content": "#desc .stui-content__desc&&Text",
        "tabs": ".stui-pannel .stui-pannel__head h4",
        "lists": ".stui-pannel:eq(#id) .stui-content__playlist li"
    },
    搜索: 'ul.stui-vodlist&&li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',

}
