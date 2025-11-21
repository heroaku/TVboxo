var rule = {
    title: '小宝影院',
    host: 'https://www.xiaobaotv.com',
    url: '/vod/show/by/time/id/fyfilter/page/fypage.html',
    // 仅保留 by 和 id
    filter_url: '{{fl.cateId}}',
    searchUrl: '/search.html?wd=**&page=fypage',
    class_name: '电影&电视剧&综艺&动漫&短剧',
    class_url: '1&2&4&3&11',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    filter: {
        "1": [
            { "key": "cateId", "name": "类型", "value": [
                { "n": "全部", "v": "1" },
                { "n": "动作片", "v": "101" },
                { "n": "喜剧片", "v": "102" },
                { "n": "爱情片", "v": "103" },
                { "n": "科幻片", "v": "104" },
                { "n": "剧情片", "v": "105" },
                { "n": "悬疑片", "v": "106" },
                { "n": "惊悚片", "v": "107" },
                { "n": "恐怖片", "v": "108" },
                { "n": "犯罪片", "v": "109" },
                { "n": "冒险片", "v": "111" },
                { "n": "奇幻片", "v": "112" },
                { "n": "灾难片", "v": "113" },
                { "n": "战争片", "v": "114" },
                { "n": "动画电影片", "v": "115" },
                { "n": "歌舞片", "v": "116" },
                { "n": "网络电影片", "v": "117" },
                { "n": "同性片", "v": "118" },
                { "n": "经典片", "v": "121" },
                { "n": "其它片", "v": "122" }
            ] }
        "2": [
            { "key": "cateId", "name": "类型", "value": [
                { "n": "全部", "v": "2" },
                { "n": "国产剧", "v": "201" },
                { "n": "港台剧", "v": "202" },
                { "n": "日韩剧", "v": "204" },
                { "n": "欧美剧", "v": "206" },
                { "n": "新马泰剧", "v": "209" },
                { "n": "其他剧", "v": "210" }
            ] }
        ],
        "4": [
            { "key": "cateId", "name": "类型", "value": [
                { "n": "全部", "v": "4" },
                { "n": "大陆综艺", "v": "401" },
                { "n": "日韩综艺", "v": "402" },
                { "n": "港台综艺", "v": "404" },
                { "n": "欧美综艺", "v": "406" },
                { "n": "新马泰综艺", "v": "407" },
                { "n": "其它综艺", "v": "410" }
            ] }
        ],
        "3": [
            { "key": "cateId", "name": "类型", "value": [
                { "n": "全部", "v": "3" },
                { "n": "国产动漫", "v": "301" },
                { "n": "日韩动漫", "v": "302" },
                { "n": "港台动漫", "v": "304" },
                { "n": "欧美动漫", "v": "306" },
                { "n": "其它动漫", "v": "310" }
            ] }
        ]
    },

    // 默认筛选：短剧不设 cateId
    filter_def: {
        "1": { "cateId": "1"},
        "2": { "cateId": "2" },
        "4": { "cateId": "4"}, // 综艺 → 4
        "3": { "cateId": "3"}, // 动漫 → 3
        "11": { "cateId": "11"}                // 短剧无 cateId
    },

    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    },
    play_parse: true,
    lazy: '',
    limit: 6,

    推荐: 'div.myui-panel-box:has(.title:contains("大片推荐")) ul.myui-vodlist;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double: false,

    // 修正一级选择器（确保匹配分类页）
    一级: 'ul.myui-vodlist.clearfix li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',

    二级: {
        title: 'h1.title&&Text;.eq(0) a:eq(0)&&Text',
        img: '.myui-content__thumb img.lazyload&&data-original',
        desc: '.eq(1)&&Text;.eq(2)&&Text;.eq(3)&&Text;.eq(0) a:eq(1)&&Text;.eq(0) a:eq(2)&&Text',
        content: '.content span.sketch&&Text',
        tabs: '.nav-tabs a',
        lists: '.myui-content__list:eq(#id) a'
    },

    搜索: '.myui-vodlist__media li;a&&title;*;*;a&&href;.text-muted:eq(-1)&&Text'
}
