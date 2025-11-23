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

    play_parse: true,
    lazy: function () {
        input = {
            jx: 1,
            url: 'https://vip.zykbf.com/?url=' + encodeURIComponent(input),
            parse: 1
        };
    },

    推荐: `js: VIDLIST = []`, // 无推荐可留空
    一级: `js:
        let d = [];
        let list = JSON.parse(input).list || [];
        list.forEach(it => {
            d.push({
                title: it.vod_name,
                img: 'https://via.placeholder.com/300x400/1E90FF/FFFFFF?text=高清资源',
                desc: it.vod_remarks || '',
                url: it.vod_id
            });
        });
        VIDLIST = d;
    `,
    二级: `js:
        // 注意：当前API无详情页返回 vod_play_url，无法播放
        // 若未来有详情接口，可在此 request 补全
        let data = JSON.parse(input);
        if (data.list && data.list[0]) VOD = data.list[0];
    `,
    搜索: `js:
        let d = [];
        let list = JSON.parse(input).list || [];
        list.forEach(it => {
            d.push({
                title: it.vod_name,
                img: 'https://via.placeholder.com/300x400/1E90FF/FFFFFF?text=高清资源',
                desc: it.vod_remarks || '',
                url: it.vod_id
            });
        });
        VIDLIST = d;
    `
};
