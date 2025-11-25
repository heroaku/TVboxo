var rule = {
    title: '达达趣影视',
    host: 'https://www.dadaqu.cc',
    homeUrl: '/',
    url: '/show/fyclass--------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 0, // 暂不处理复杂筛选（新版 OK 影视筛选支持弱）
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
    },
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    // 首页推荐
    推荐: '.container-slide .swiper-slide;a&&title;.mobile-v-info&&.v-title&&Text;.mobile-v-info&&p:eq(1)&&Text;a&&href;.banner&&style', // 从 style 提取图片
    推荐解析: false,
    // 一级列表（解析 style 中的背景图）
    一级: '.module-poster-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    // 二级详情
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(0)&&Text',
        img: '.module-item-pic&&img&&src', // 或 data-original
        desc: '.module-info-item-content:eq(4)&&Text;.module-info-item-content:eq(5)&&Text;.module-info-item-content:eq(3)&&Text;.module-info-item-content:eq(2)&&Text',
        content: '.module-info-introduction-content&&Text',
        tabs: '.module-tab-item span',
        lists: '.module-play-list:eq(#id) a'
    },
    // 搜索
    搜索: 'body&&.module-poster-item;a&&title;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    lazy: '',
    play_parse: false, // 播放页为直接跳转，无需解析
    limit: 6
};
