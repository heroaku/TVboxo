var rule = {
    title: '电影天堂采集',
    host: 'http://caiji.dyttzyapi.com',
    url: '/api.php/provide/vod/?ac=detail&t=fyclass&pg=fypage',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    //homeUrl: '/api.php/provide/vod/?ac=detail&t=13&pg=1', // 默认国产剧
    //采集地址：http://caiji.dyttzyapi.com/api.php/provide/vod
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
    class_name: '国产剧&香港剧&韩国剧&欧美剧&台湾剧&日本剧&海外剧&泰国剧&短剧&大陆综艺&港台综艺&日韩综艺&欧美综艺&国产动漫&日韩动漫&欧美动漫&港台动漫&海外动漫&伦理片&动画片&记录片&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片',
    class_url: '13&14&15&16&21&22&23&24&36&25&26&27&28&29&30&31&32&33&34&37&20&6&7&8&9&10&11&12',

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
