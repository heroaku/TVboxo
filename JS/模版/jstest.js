var rule = {
    title: '高清+非凡聚合',
    host: '',
    homeUrl: 'https://api.1080zyku.com/inc/apijson.php',
    url: 'http://cj.ffzyapi.com/api.php/provide/vod/?ac=detail&t=fyclass&pg=fypage',
    detailUrl: 'http://cj.ffzyapi.com/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: 'http://cj.ffzyapi.com/api.php/provide/vod/?wd=**&pg=fypage',
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 8000,
    limit: 20,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    // 使用非凡资源的完整分类（高清资源网不支持分类）
    class_name: '电影&连续剧&综艺&动漫&动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&国产剧&港剧&韩剧&美剧&泰剧&日剧&动画片&记录片&伦理片',
    class_url: '1&2&3&4&5&6&7&8&9&10&11&12&13&14&15&16&18&29&20&34',

    play_parse: true,
    lazy: function () {
        if (input.includes('http')) {
            input = { jx: 0, url: input, parse: 0 };
        } else {
            // 通用解析兜底
            input = {
                jx: 1,
                url: 'https://jx.jsonplayer.com/player/?url=' + encodeURIComponent(input),
                parse: 1
            };
        }
    },

    // 首页推荐：使用高清资源网的“最新更新”
    推荐: `js:
        let d = [];
        try {
            let res = request('https://api.1080zyku.com/inc/apijson.php');
            let list = JSON.parse(res).list || [];
            list.forEach(it => {
                d.push({
                    title: it.vod_name,
                    img: 'https://via.placeholder.com/300x400/4a86e8/FFFFFF?text=高清',
                    desc: (it.type_name || '') + ' | ' + (it.vod_remarks || ''),
                    url: 'ff_' + it.vod_id  // 前缀标记，避免冲突
                });
            });
        } catch (e) {}
        VIDLIST = d;
    `,

    // 一级列表：使用非凡资源（保证可分类、有图、可播）
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',

    // 二级详情：使用非凡资源
    二级: 'json:list;vod_name;vod_pic;vod_year;vod_area;vod_actor;vod_director;vod_content;vod_play_from;vod_play_url',

    // 搜索：使用非凡资源
    搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id'
};
