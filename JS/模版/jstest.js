var rule={
    title: '耐看',
    host: 'https://huadian2.com',
    //https://huadian2.com/show/2-----------.html
    url: '/show/fyclass--------fypage---.html',
    searchUrl: '/nk/-------------.html?wd=**',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
    'User-Agent': 'MOBILE_UA',
    },
    class_parse: '.hl-menus li;a&&span&&Text;a&&href;.*/(.*?)\.html',
    play_parse: false,
    lazy: '',
    limit: 6,
    推荐:'ul.hl-vod-list;li;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double: true,
     一级: '.hl-vod-list li;a&&title;a&&data-original;.hl-lc-1&&Text;a&&href',
     二级:{
            'title':'.h1&&Text;.data:eq(0)&&Text',
            'img':'.hl-item-thumb&&data-original',
            'desc':'.hl-infos-content&&.hl-text-conch&&Text',
            'content':'.hl-content-text&&Text',
            'tabs':'.hl-tabs&&a',
            'lists':'.hl-plays-list:eq(#id)&&li'
         },
     搜索: '.hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href'
    }
