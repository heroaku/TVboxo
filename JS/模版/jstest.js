var rule = {
    title: '非凡资源',
    host: 'http://cj.ffzyapi.com',
    url: '/api.php/provide/vod/?ac=detail&t=fyclass&pg=fypage',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    timeout: 8000,
    limit: 20,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    class_name: '电影&连续剧&综艺&动漫&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&国产剧&港剧&韩剧&美剧&泰剧&日剧&动画片&记录片&伦理片',
    class_url: '1&2&3&4&5&6&7&8&9&10&11&12&13&14&15&16&18&29&20&34',

    play_parse: true,
    lazy: function () {
        if (input.includes('m3u8') || input.includes('http')) {
            input = {
                jx: 0,
                url: input,
                parse: 0
            };
        } else {
            // 若为自定义标识（如 ffzy___123），需解析
            input = {
                jx: 1,
                url: 'https://jx.jsonplayer.com/player/?url=' + input,
                parse: 1
            };
        }
    },

    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    二级: 'json:list;vod_name;vod_pic;vod_year;vod_area;vod_actor;vod_director;vod_content;vod_play_from;vod_play_url',
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id'
};
