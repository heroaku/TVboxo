var rule = {
    title: '高清资源网',
    host: 'https://api.1080zyku.com',
    homeUrl: '/inc/apijson.php?ac=video&page=1',
    url: '/inc/apijson.php?ac=video&type_id=fyclass&page=fypage',
    detailUrl: '/inc/apijson.php?ac=detail&ids=fyid',
    searchUrl: '/inc/apijson.php?ac=video&keyword=**&page=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    timeout: 8000,
    limit: 20,
    searchable: 2,
    quickSearch: 1,
    filterable: 1,

    // 根据你提供的 categories 和 API 的 class 手动映射
    class_name: '动作片&喜剧片&爱情片&科幻片&恐怖片&剧情片&战争片&记录片&国产剧&欧美剧&日本剧&泰国剧&韩国剧&台湾剧&香港剧&大陆综艺&港台综艺&日韩综艺&欧美综艺&国产动漫&日韩动漫&欧美动漫&倫理片&福利',
    class_url: '5&6&7&8&9&10&11&20&12&15&18&17&14&13&16&62&63&64&65&66&67&68&61&19',

    play_parse: true,
    lazy: function () {
        // 原始配置中的 playUrl
        input = {
            jx: 1,
            url: 'https://vip.zykbf.com/?url=' + encodeURIComponent(input),
            parse: 1,
            header: {
                'Referer': 'https://vip.zykbf.com/',
                'User-Agent': 'Mozilla/5.0'
            }
        };
    },

    推荐: `js:
        let d = [];
        let res = request(rule.homeUrl);
        let list = JSON.parse(res).list || [];
        list.forEach(it => {
            d.push({
                title: it.vod_name,
                img: 'https://via.placeholder.com/300x400/1E90FF/FFFFFF?text=高清',
                desc: (it.type_name || '') + ' | ' + (it.vod_remarks || ''),
                url: it.vod_id
            });
        });
        VIDLIST = d;
    `,

    一级: `js:
        let d = [];
        let data = JSON.parse(input);
        let list = data.list || [];
        list.forEach(it => {
            d.push({
                title: it.vod_name,
                img: 'https://via.placeholder.com/300x400/4a86e8/FFFFFF?text=高清资源',
                desc: (it.type_name || '') + ' | ' + (it.vod_remarks || ''),
                url: it.vod_id
            });
        });
        VIDLIST = d;
    `,

    二级: `js:
        // ⚠️ 重要：当前 API 无 vod_play_url！
        // 但部分播放器会将 vod_play_from 当作“集名”，需伪造 play_url
        let data = JSON.parse(input);
        if (data.list && data.list[0]) {
            let vod = data.list[0];
            VOD = vod;
            // 伪造播放列表（仅用于显示集数，实际播放靠 lazy + 解析）
            let epis = vod.vod_remarks || '全1集';
            // 简单提取集数，如“更新至08集” → 生成 1~8 集
            let total = 1;
            let match = epis.match(/(\d+)/);
            if (match) total = parseInt(match[1]) || 1;
            let urls = [];
            for (let i = 1; i <= total; i++) {
                urls.push(`第${i}集$$$${vod.vod_play_from}`);
            }
            VOD.vod_play_from = '1080zyk';
            VOD.vod_play_url = urls.join('#');
        }
    `,

    搜索: `js:
        let d = [];
        let data = JSON.parse(input);
        let list = data.list || [];
        list.forEach(it => {
            d.push({
                title: it.vod_name,
                img: 'https://via.placeholder.com/300x400/FF6347/FFFFFF?text=搜索',
                desc: (it.type_name || '') + ' | ' + (it.vod_remarks || ''),
                url: it.vod_id
            });
        });
        VIDLIST = d;
    `
};
