var rule = {
    title: '小宝影院',
    host: 'https://www.xiaobaotv.com',
    url: '/vod/show/by/time/id/fyclass/page/fypage.html',
    searchUrl: '/search.html?wd=**&page=fypage',
    class_name: '电影&电视剧&综艺&动漫&短剧',
    class_url: '1&2&4&3&11',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    },
    play_parse: true,
    lazy: '',
    limit: 6,

    // 首页推荐：大片推荐板块
    推荐: 'div.myui-panel-box:has(.title:contains("大片推荐")) ul.myui-vodlist;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double: false,

    // 一级列表（分类页 & 首页板块）
    一级: '.myui-vodlist li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',

    // 二级详情页解析（根据提供的详情页结构）
    二级: {
        title: 'h1.title&&Text;.data:eq(0) a:eq(0)&&Text', // 标题 + 分类
        img: '.myui-content__thumb img.lazyload&&data-original',
        desc: '.data:eq(1)&&Text;.data:eq(2)&&Text;.data:eq(3)&&Text;.data:eq(0) a:eq(1)&&Text;.data:eq(0) a:eq(2)&&Text', // 更新、主演、导演、地区、年份
        content: '.content span.sketch&&Text',
        tabs: '.nav-tabs a',
        lists: '.myui-content__list:eq(#id) a'
    },

    // 搜索解析
    搜索: '.myui-vodlist__media li;a&&title;*;*;a&&href;.text-muted:eq(-1)&&Text'
};
