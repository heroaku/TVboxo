var rule = {
    title: '暴风资源',
    host: 'https://bfzyapi.com',
    url: '/api.php/provide/vod/?ac=list&t=fyclass&pg=fypage',
    searchable: 2,
    quickSearch: false,
    filterable: false,
    headers: {
        'User-Agent': 'Mozilla/5.0',
    },
    class_parse: '.nav-item a[href*="t="]:not([href*="t=0"]):not([href*="t="*"]):lt(10);a&&Text;a&&href;/(\\d+)/',
    play_parse: true,
    lazy: function () {
        // bfzym3u8 通常是直链 m3u8，无需解析
        if (/bfzym3u8/.test(input)) {
            input = {
                jx: 0,
                url: input.split('$')[1],
                parse: 0,
                header: {
                    'Referer': 'https://bfzy.tv/',
                    'User-Agent': 'Mozilla/5.0'
                }
            };
        }
        // 若有其他线路需要解析（如使用 vip.vipuuvip.com），可在此扩展
    },
    limit: 6,
    // 搜索
    search_url: '/api.php/provide/vod/?ac=detail&wd=**',
    searchable: 2,
    // 详情页解析
    detail_url: '/api.php/provide/vod/?ac=detail&ids=fyid',
    detail_parse: function (doc, args) {
        let data = JSON.parse(doc).list[0];
        if (!data) return '{}';

        let vod = {
            vod_id: data.vod_id,
            vod_name: data.vod_name,
            vod_pic: data.vod_pic,
            type_name: data.type_name,
            vod_year: data.vod_year,
            vod_area: data.vod_area,
            vod_remarks: data.vod_remarks,
            vod_actor: data.vod_actor,
            vod_director: data.vod_director,
            vod_content: data.vod_content || ''
        };

        // 处理多线路
        let playFrom = [];
        let playList = [];

        let urls = data.vod_play_url.split('$$$');
        let froms = data.vod_play_from.split('$$$');

        for (let i = 0; i < froms.length; i++) {
            let from = froms[i].trim();
            let url = urls[i] || '';
            if (url && from) {
                playFrom.push(from);
                playList.push(url);
            }
        }

        vod.vod_play_from = playFrom.join('$$$');
        vod.vod_play_url = playList.join('$$$');

        return JSON.stringify({ list: [vod] });
    },
    // 列表解析
    parseVodList: function (doc) {
        let data = JSON.parse(doc);
        let vods = [];
        if (data.list && data.list.length > 0) {
            vods = data.list.map(item => ({
                vod_id: item.vod_id,
                vod_name: item.vod_name,
                vod_pic: item.vod_pic,
                vod_remarks: item.vod_remarks || ''
            }));
        }
        return JSON.stringify({ list: vods, total: data.total || vods.length, limit: 20 });
    }
};
