var rule = {
    title: '小宝影院',
    host: 'https://www.xiaobaotv.com',
    url: '/vod/show/by/fyfilter/id/fyclass/page/fypage.html',
    searchUrl: '/search.html?wd=**&page=fypage',
    class_name: '电影&电视剧&综艺&动漫&短剧',
    class_url: '1&2&4&3&11',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,

    // 筛选规则：按分类动态加载
    filter: {
        "1": [ // 电影
            {
                "key": "area",
                "name": "地区",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "中国大陆", "v": "area/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86"},
                    {"n": "中国香港", "v": "area/%E4%B8%AD%E5%9B%BD%E9%A6%99%E6%B8%AF"},
                    {"n": "中国台湾", "v": "area/%E4%B8%AD%E5%9B%BD%E5%8F%B0%E6%B9%BE"},
                    {"n": "韩国", "v": "area/%E9%9F%A9%E5%9B%BD"},
                    {"n": "日本", "v": "area/%E6%97%A5%E6%9C%AC"},
                    {"n": "欧美", "v": "area/%E6%AC%A7%E7%BE%8E"},
                    {"n": "泰国", "v": "area/%E6%B3%B0%E5%9B%BD"},
                    {"n": "其它", "v": "area/%E5%85%B6%E5%AE%83"}
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "2025", "v": "year/2025"},
                    {"n": "2024", "v": "year/2024"},
                    {"n": "2023", "v": "year/2023"},
                    {"n": "2022", "v": "year/2022"},
                    {"n": "2021", "v": "year/2021"},
                    {"n": "2020", "v": "year/2020"},
                    {"n": "2019", "v": "year/2019"},
                    {"n": "2018", "v": "year/2018"},
                    {"n": "2010-2017", "v": "year/2010"} // 可扩展更多，此处简化
                ]
            },
            {
                "key": "lang",
                "name": "语言",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "汉语普通话", "v": "lang/%E6%B1%89%E8%AF%AD%E6%99%AE%E9%80%9A%E8%AF%9D"},
                    {"n": "粤语", "v": "lang/%E7%B2%A4%E8%AF%AD"},
                    {"n": "韩语", "v": "lang/%E9%9F%A9%E8%AF%AD"},
                    {"n": "日语", "v": "lang/%E6%97%A5%E8%AF%AD"},
                    {"n": "英语", "v": "lang/%E8%8B%B1%E8%AF%AD"},
                    {"n": "其它", "v": "lang/%E5%85%B6%E5%AE%83"}
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    {"n": "时间", "v": "by/time"},
                    {"n": "人气", "v": "by/hits"},
                    {"n": "评分", "v": "by/score"}
                ]
            }
        ],
        "2": [ // 电视剧（含子类型）
            {
                "key": "type",
                "name": "类型",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "国产剧", "v": "id/201"},
                    {"n": "港台剧", "v": "id/202"},
                    {"n": "日韩剧", "v": "id/204"},
                    {"n": "欧美剧", "v": "id/206"},
                    {"n": "新马泰剧", "v": "id/209"},
                    {"n": "其他剧", "v": "id/210"}
                ]
            },
            {
                "key": "area",
                "name": "地区",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "中国大陆", "v": "area/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86"},
                    {"n": "中国香港", "v": "area/%E4%B8%AD%E5%9B%BD%E9%A6%99%E6%B8%AF"},
                    {"n": "中国台湾", "v": "area/%E4%B8%AD%E5%9B%BD%E5%8F%B0%E6%B9%BE"},
                    {"n": "韩国", "v": "area/%E9%9F%A9%E5%9B%BD"},
                    {"n": "日本", "v": "area/%E6%97%A5%E6%9C%AC"},
                    {"n": "欧美", "v": "area/%E6%AC%A7%E7%BE%8E"},
                    {"n": "泰国", "v": "area/%E6%B3%B0%E5%9B%BD"},
                    {"n": "其它", "v": "area/%E5%85%B6%E5%AE%83"}
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "2025", "v": "year/2025"},
                    {"n": "2024", "v": "year/2024"},
                    {"n": "2023", "v": "year/2023"},
                    {"n": "2022", "v": "year/2022"},
                    {"n": "2021", "v": "year/2021"},
                    {"n": "2020", "v": "year/2020"},
                    {"n": "更早", "v": "year/2019"}
                ]
            },
            {
                "key": "lang",
                "name": "语言",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "汉语普通话", "v": "lang/%E6%B1%89%E8%AF%AD%E6%99%AE%E9%80%9A%E8%AF%9D"},
                    {"n": "粤语", "v": "lang/%E7%B2%A4%E8%AF%AD"},
                    {"n": "韩语", "v": "lang/%E9%9F%A9%E8%AF%AD"},
                    {"n": "日语", "v": "lang/%E6%97%A5%E8%AF%AD"},
                    {"n": "英语", "v": "lang/%E8%8B%B1%E8%AF%AD"},
                    {"n": "其它", "v": "lang/%E5%85%B6%E5%AE%83"}
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    {"n": "时间", "v": "by/time"},
                    {"n": "人气", "v": "by/hits"},
                    {"n": "评分", "v": "by/score"}
                ]
            }
        ],
        "3": [ // 动漫（可简化）
            {
                "key": "area",
                "name": "地区",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "中国大陆", "v": "area/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86"},
                    {"n": "日本", "v": "area/%E6%97%A5%E6%9C%AC"},
                    {"n": "欧美", "v": "area/%E6%AC%A7%E7%BE%8E"},
                    {"n": "其它", "v": "area/%E5%85%B6%E5%AE%83"}
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "2025", "v": "year/2025"},
                    {"n": "2024", "v": "year/2024"},
                    {"n": "2023", "v": "year/2023"},
                    {"n": "更早", "v": "year/2022"}
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    {"n": "时间", "v": "by/time"},
                    {"n": "人气", "v": "by/hits"},
                    {"n": "评分", "v": "by/score"}
                ]
            }
        ],
        "4": [ // 综艺
            {
                "key": "area",
                "name": "地区",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "中国大陆", "v": "area/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86"},
                    {"n": "中国台湾", "v": "area/%E4%B8%AD%E5%9B%BD%E5%8F%B0%E6%B9%BE"},
                    {"n": "韩国", "v": "area/%E9%9F%A9%E5%9B%BD"},
                    {"n": "日本", "v": "area/%E6%97%A5%E6%9C%AC"},
                    {"n": "欧美", "v": "area/%E6%AC%A7%E7%BE%8E"}
                ]
            },
            {
                "key": "year",
                "name": "年份",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "2025", "v": "year/2025"},
                    {"n": "2024", "v": "year/2024"},
                    {"n": "2023", "v": "year/2023"}
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    {"n": "时间", "v": "by/time"},
                    {"n": "人气", "v": "by/hits"},
                    {"n": "评分", "v": "by/score"}
                ]
            }
        ],
        "11": [ // 短剧（简化）
            {
                "key": "year",
                "name": "年份",
                "value": [
                    {"n": "全部", "v": ""},
                    {"n": "2025", "v": "year/2025"},
                    {"n": "2024", "v": "year/2024"}
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    {"n": "时间", "v": "by/time"},
                    {"n": "人气", "v": "by/hits"}
                ]
            }
        ]
    },

    // 默认筛选参数
    filter_def: {
        "1": {"by": "by/time"},
        "2": {"type": "", "by": "by/time"},
        "3": {"by": "by/time"},
        "4": {"by": "by/time"},
        "11": {"by": "by/time"}
    },

    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    },

    play_parse: true,
    lazy: '',
    limit: 6,

    推荐: 'div.myui-panel-box:has(.title:contains("大片推荐")) ul.myui-vodlist;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double: false,

    一级: '.myui-vodlist li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',

    二级: {
        title: 'h1.title&&Text;.eq(0) a:eq(0)&&Text',
        img: '.myui-content__thumb img.lazyload&&data-original',
        desc: '.data:eq(1)&&Text;.data:eq(2)&&Text;.data:eq(3)&&Text;.data:eq(0) a:eq(1)&&Text;.data:eq(0) a:eq(2)&&Text',
        content: '.content span.sketch&&Text',
        tabs: '.nav-tabs a',
        lists: '.myui-content__list:eq(#id) a'
    },

    搜索: '.myui-vodlist__media li;a&&title;*;*;a&&href;.text-muted:eq(-1)&&Text',

    // URL 构建逻辑：支持多维度筛选拼接
    url: '/vod/show/{{fl.by||"by/time"}}{{fl.area?"":"/id/fyclass"}}{{fl.type?"/"+fl.type:(fl.area||fl.lang||fl.year?"":"/id/fyclass")}}{{fl.area?"/"+fl.area:""}}{{fl.lang?"/"+fl.lang:""}}{{fl.year?"/"+fl.year:""}}/page/fypage.html'
};
