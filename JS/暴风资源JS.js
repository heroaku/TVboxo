var rule = {
    title: '暴风资源',
    host: 'https://bfzyapi.com',
    homeUrl: '/api.php/provide/vod/?ac=detail&t=13',
    detailUrl: '/api.php/provide/vod/?ac=detail&ids=fyid',
    searchUrl: '/api.php/provide/vod/?wd=**&pg=fypage',
    url: '/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    timeout: 5000,
    class_parse: 'json:class;',
    limit: 20,
    multi: 1,
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    play_parse: true,
    parse_url: '',
    lazy: function () {
        // 自动识别播放源（如 bfzym3u8），直链播放，无需解析
        if (/bfzym3u8|ffm3u8|1080zyk|lzm3u8|wjm3u8/.test(input)) {
            let purl = input.split('$')[1];
            if (purl) {
                input = {
                    jx: 0,
                    url: purl,
                    parse: 0,
                    header: {
                        'Referer': 'https://www.ece8.com/',
                        'User-Agent': 'Mozilla/5.0'
                    }
                };
            }
        }
    },
    推荐: '*',
    一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
    二级: `js:
        let html = request(input);
        let data = JSON.parse(html).list;
        VOD = data[0];
    `,
    搜索: '*',
    cate_exclude: '电影片|连续剧|综艺片|动漫片|电影解说|体育|演员|新闻资讯'
}
