var rule = {
    title: '高清资源网',
    host: 'https://api.1080zyku.com',
    url: '/inc/apijson.php?ac=video&t=fyclass&pg=fypage',
    detailUrl: '/inc/apijson.php?ac=detail&ids=fyid',
    searchUrl: '/inc/apijson.php?ac=video&keyword=**&pg=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    timeout: 8000,
    limit: 20,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    class_name: '动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&记录片&国产剧&欧美剧&日本剧&泰国剧&韩国剧&台湾剧&香港剧&大陆综艺&港台综艺&日韩综艺&欧美综艺&国产动漫&日韩动漫&欧美动漫&倫理片&福利',
    class_url: '5&6&7&8&9&10&11&20&12&15&18&17&14&13&16&62&63&64&65&66&67&68&61&19',

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
