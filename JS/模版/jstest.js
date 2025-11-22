var rule = {
    title: '看看影视',
    host: 'https://www.kan234.com',
    homeUrl: '/api.php/provide/vod/?ac=detail&t=13', // 默认国产剧
    url: '/api.php/provide/vod/?ac=detail&t=fyclass&pg=fypage',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },

    timeout: 8000,
    limit: 20,
    multi: 1,
    searchable: 2,
    quickSearch: 1,
    filterable: 0, // ✅ 明确不支持筛选

    // 分类映射（根据 MacCMS 常见 type_id）
    class_name: '电影&电视剧&综艺&动漫&国产剧&港台剧&日韩剧&欧美剧&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&动画片&纪录片',
    class_url: '1&2&3&4&13&14&22&16&6&7&8&9&10&11&12&37&20',

    // 自动识别 m3u8 播放源（如 k234m3u8）
    play_parse: true,
    lazy: function () {
        if (input.includes('m3u8')) {
            let purl = input.split('$')[1];
            if (purl && purl.startsWith('http')) {
                input = {
                    jx: 0,
                    url: purl,
                    parse: 0,
                    header: {
                        'Referer': 'https://www.kan234.com/',
                        'User-Agent': 'Mozilla/5.0'
                    }
                };
            }
        }
    },

    // 数据解析
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    二级: `js:
        let html = request(input);
        let data = JSON.parse(html);
        if (data.list && data.list[0]) VOD = data.list[0];
    `,
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from'


    // === 排除无效分类 ===
   // cate_exclude: '电影片|连续剧|综艺片|动漫片|伦理片'
}
