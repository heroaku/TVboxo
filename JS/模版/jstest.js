var rule = {
    title: '高清资源网',
    host: 'https://api.1080zyku.com',
    url: '/inc/apijson.php?ac=video&t=fyclass&pg=fypage',
    detailUrl: '/inc/apijson.php?ac=detail&ids=fyid',
    searchUrl: '/inc/apijson.php?ac=video&keyword=**&pg=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 8000,
    limit: 20,
    multi: 1,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    // 根据你原始 categories 和 API class 字段精确映射
    class_name: '动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&记录片&国产剧&欧美剧&日本剧&泰国剧&韩国剧&台湾剧&香港剧&大陆综艺&港台综艺&日韩综艺&欧美综艺&国产动漫&日韩动漫&欧美动漫&倫理片&福利',
    class_url: '5&6&7&8&9&10&11&20&12&15&18&17&14&13&16&62&63&64&65&66&67&68&61&19',

    play_parse: true,
    lazy: function () {
        // 原始配置中的 playUrl 为 https://vip.zykbf.com/?url=
        if (input && typeof input === 'string') {
            input = {
                jx: 1,
                url: 'https://vip.zykbf.com/?url=' + encodeURIComponent(input),
                parse: 1,
                header: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://vip.zykbf.com/'
                }
            };
        }
    },

    // 数据解析
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    二级: `js:
        let html = JSON.parse(request(input));
        if (html.list && html.list[0]) {
            VOD = html.list[0];
            // 补全 play_from 和 play_url（API 未返回 vod_play_url，需模拟）
            // 但注意：当前 API 仅返回 vod_play_from，未返回 vod_play_url，无法直接播放
            // 所以此接口可能不完整，或需额外请求详情页
            // 若无详情接口，则无法获取真实播放链接，仅能用于展示
            // 此处按 OK 影视常见方式保留结构
        }
    `,
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from'
}
