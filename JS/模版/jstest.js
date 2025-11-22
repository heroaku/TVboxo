var rule = {
    title: 'DYTT电影天堂',
    host: 'http://caiji.dyttzyapi.com',
    url: '/api.php/provide/vod/?ac=detail&t=fyclass&pg=fypage',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    homeUrl: '/api.php/provide/vod/?ac=detail&t=13&pg=1', // 默认国产剧

    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },

    timeout: 8000,
    limit: 20,
    multi: 1,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    // === 分类映射 ===
    class_name: '国产剧&韩国剧&日韩动漫&动作片&爱情片&科幻片&恐怖片&剧情片&战争片&动画片&纪录片&大陆综艺',
    class_url: '13&15&30&6&8&9&10&11&12&37&20&25',

    // === 内联筛选规则（filter）===
    filter: {
        "13": [
            {
                "key": "class",
                "name": "类型",
                "value": [
                    { "n": "古装", "v": "古装" },
                    { "n": "爱情", "v": "爱情" },
                    { "n": "剧情", "v": "剧情" }
                ]
            }
        ],
        "15": [
            {
                "key": "class",
                "name": "类型",
                "value": [
                    { "n": "爱情", "v": "爱情" },
                    { "n": "剧情", "v": "剧情" }
                ]
            }
        ],
        "30": [
            {
                "key": "class",
                "name": "地区",
                "value": [
                    { "n": "日韩动漫", "v": "日韩动漫" }
                ]
            }
        ],
        "6": [
            {
                "key": "class",
                "name": "类型",
                "value": [
                    { "n": "动作片", "v": "动作片" }
                ]
            }
        ],
        "8": [
            {
                "key": "class",
                "name": "类型",
                "value": [
                    { "n": "爱情片", "v": "爱情片" }
                ]
            }
        ],
        "25": [
            {
                "key": "year",
                "name": "年份",
                "value": [
                    { "n": "2025", "v": "2025" },
                    { "n": "2024", "v": "2024" },
                    { "n": "2023", "v": "2023" }
                ]
            }
        ]
    },

    // === 播放源处理（自动直链 M3U8）===
    play_parse: true,
    lazy: function () {
        if (input.includes('dyttm3u8')) {
            let purl = input.split('$')[1];
            if (purl && purl.startsWith('http')) {
                input = {
                    jx: 0,
                    url: purl,
                    parse: 0,
                    header: {
                        'Referer': 'https://www.ziziys.org/',
                        'User-Agent': 'Mozilla/5.0'
                    }
                };
            }
        }
    },

    // === 数据解析 ===
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    二级: `js:
        let html = request(input);
        let data = JSON.parse(html);
        if (data && data.list && data.list[0]) {
            VOD = data.list[0];
        } else {
            VOD = {};
        }
    `,
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',

    // === 排除无效分类 ===
    cate_exclude: '电影片|连续剧|综艺片|动漫片|伦理片'
}
