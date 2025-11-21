var rule = {
    title: '爱看机器人',
    host: 'https://v.aikanbot.com',
    url: '/hot/index-fyclass-fyfilter-p-fypage.html[/hot/index-fyclass-fyfilter.html]',
    searchUrl: '/search?q=**&p=fypage[/search?q=**]',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter_url: '{{fl.tag}}',
    filter: {
        "movie": [{
            "key": "tag",
            "name": "标签",
            "value": [
                { "n": "热门", "v": "热门" },
                { "n": "最新", "v": "最新" },
                { "n": "经典", "v": "经典" },
                { "n": "豆瓣高分", "v": "豆瓣高分" },
                { "n": "冷门佳片", "v": "冷门佳片" },
                { "n": "华语", "v": "华语" },
                { "n": "欧美", "v": "欧美" },
                { "n": "韩国", "v": "韩国" },
                { "n": "日本", "v": "日本" },
                { "n": "动作", "v": "动作" },
                { "n": "喜剧", "v": "喜剧" },
                { "n": "爱情", "v": "爱情" },
                { "n": "科幻", "v": "科幻" },
                { "n": "悬疑", "v": "悬疑" },
                { "n": "恐怖", "v": "恐怖" },
                { "n": "治愈", "v": "治愈" },
                { "n": "豆瓣top250", "v": "豆瓣top250" }
            ]
        }],
        "tv": [{
            "key": "tag",
            "name": "标签",
            "value": [
                { "n": "热门", "v": "热门" },
                { "n": "美剧", "v": "美剧" },
                { "n": "英剧", "v": "英剧" },
                { "n": "韩剧", "v": "韩剧" },
                { "n": "日剧", "v": "日剧" },
                { "n": "国产剧", "v": "国产剧" },
                { "n": "港剧", "v": "港剧" },
                { "n": "日本动画", "v": "日本动画" },
                { "n": "综艺", "v": "综艺" },
                { "n": "纪录片", "v": "纪录片" }
            ]
        }]
    },
    filter_def: {
        movie: { tag: '热门' },
        tv: { tag: '国产剧' },
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    },
    class_name: '电影&剧集',
    class_url: 'movie&tv',
    play_parse: true,
    double: true,
    tab_remove: ['wjm3u8', 'ikm3u8', 'sdm3u8', 'M3U8', 'jinyingm3u8', 'fsm3u8', 'ukm3u8'],
    tab_order: ['bfzym3u8', '1080zyk', 'kuaikan', 'lzm3u8', 'ffm3u8', 'snm3u8', 'qhm3u8', 'gsm3u8', 'zuidam3u8', 'bjm3u8', 'wolong', 'xlm3u8', 'yhm3u8'],
    tab_rename: {
        'bfzym3u8': '暴风', '1080zyk': '优质', 'kuaikan': '快看', 'lzm3u8': '量子', 'ffm3u8': '非凡',
        'snm3u8': '索尼', 'qhm3u8': '奇虎', 'haiwaikan': '海外看', 'gsm3u8': '光速', 'zuidam3u8': '最大',
        'bjm3u8': '八戒', 'wolong': '卧龙', 'xlm3u8': '新浪', 'yhm3u8': '樱花', 'tkm3u8': '天空',
        'jsm3u8': '极速', 'wjm3u8': '无尽', 'sdm3u8': '闪电', 'kcm3u8': '快车', 'jinyingm3u8': '金鹰',
        'fsm3u8': '飞速', 'tpm3u8': '淘片', 'lem3u8': '鱼乐', 'dbm3u8': '百度', 'tomm3u8': '番茄',
        'ukm3u8': 'U酷', 'ikm3u8': '爱坤', 'hnzym3u8': '红牛资源', 'hnm3u8': '红牛', '68zy_m3u8': '68',
        'kdm3u8': '酷点', 'bdxm3u8': '北斗星', 'hhm3u8': '豪华', 'kbm3u8': '快播'
    },
    推荐: '.v-list;div.item;*;*;*;*',
    
    // 一级规则 - 正确的5项格式，描述项为空
    一级: '.v-list&&div.item;p&&Text;img&&data-src;;a&&href',
    
    // 搜索规则 - 5项格式，包含描述
    搜索: '.col-md-8&&.media;h5&&a&&Text;a&&img&&data-src;.label&&Text;a&&href',

    // 二级规则保持不变
    二级: `
        js:
        pdfh = jsp.pdfh;
        function getToken(html1) {
            let currentId = pdfh(html1, '#current_id&&value');
            let eToken = pdfh(html1, '#e_token&&value');
            if (!currentId || !eToken) return '';
            let idLength = currentId.length;
            let subId = currentId.substring(idLength - 4, idLength);
            let keys = [];
            for (let i = 0; i < subId.length; i++) {
                let curInt = parseInt(subId[i]);
                let splitPos = curInt % 3 + 1;
                keys[i] = eToken.substring(splitPos, splitPos + 8);
                eToken = eToken.substring(splitPos + 8, eToken.length);
            }
            return keys.join('');
        }
        try {
            VOD = {};
            let html1 = request(input);
            VOD.vod_id = pdfh(html1, '#current_id&&value');
            VOD.vod_name = pdfh(html1, 'h2&&Text');
            VOD.vod_pic = pdfh(html1, '.item-root&&img&&data-src');
            VOD.vod_actor = pdfh(html1, '.meta:eq(4)&&Text');
            VOD.vod_area = pdfh(html1, '.meta:eq(3)&&Text');
            VOD.vod_year = pdfh(html1, '.meta:eq(2)&&Text');
            VOD.vod_remarks = '';
            VOD.vod_director = '';
            VOD.vod_content = pdfh(html1, '#line-tips&&Text');

            var v_tks = getToken(html1);
            log('v_tks ===> ' + v_tks);

            input = HOST + '/api/getResN?videoId=' + input.split('/').pop() + '&mtype=2&token=' + v_tks;

            let html = request(input, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                    'Referer': MY_URL
                }
            });

            html = JSON.parse(html);
            let episodes = html.data.list;
            let map = {};
            let arr = [];
            let name = {
                'bfzym3u8': '暴风', '1080zyk': '优质', 'kuaikan': '快看', 'lzm3u8': '量子', 'ffm3u8': '非凡',
                'snm3u8': '索尼', 'qhm3u8': '奇虎', 'haiwaikan': '海外看', 'gsm3u8': '光速', 'zuidam3u8': '最大',
                'bjm3u8': '八戒', 'wolong': '卧龙', 'xlm3u8': '新浪', 'yhm3u8': '樱花', 'tkm3u8': '天空',
                'jsm3u8': '极速', 'wjm3u8': '无尽', 'sdm3u8': '闪电', 'kcm3u8': '快车', 'jinyingm3u8': '金鹰',
                'fsm3u8': '飞速', 'tpm3u8': '淘片', 'lem3u8': '鱼乐', 'dbm3u8': '百度', 'tomm3u8': '番茄',
                'ukm3u8': 'U酷', 'ikm3u8': '爱坤', 'hnzym3u8': '红牛资源', 'hnm3u8': '红牛', '68zy_m3u8': '68',
                'kdm3u8': '酷点', 'bdxm3u8': '北斗星', 'hhm3u8': '豪华'
            };

            episodes.forEach(function(ep) {
                let data = JSON.parse(ep.resData);
                data.forEach(val => {
                    if (!map[val.flag]) {
                        map[val.flag] = [val.url.replaceAll('##', '#')];
                    } else {
                        map[val.flag].push(val.url.replaceAll('##', '#'));
                    }
                });
            });

            for (var key in map) {
                let sort = 8;
                if (key === 'bfzym3u8') sort = 1;
                else if (key === '1080zyk') sort = 2;
                else if (key === 'kuaikan') sort = 3;
                else if (key === 'lzm3u8') sort = 4;
                else if (key === 'ffm3u8') sort = 5;
                else if (key === 'snm3u8') sort = 6;
                else if (key === 'qhm3u8') sort = 7;

                arr.push({
                    flag: name[key] || key,
                    url: map[key],
                    sort: sort
                });
            }

            arr.sort((a, b) => a.sort - b.sort);

            let playFrom = [];
            let playList = [];
            arr.forEach(val => {
                if (!/undefined/.test(val.flag)) {
                    playFrom.push(val.flag);
                    playList.push(val.url);
                }
            });

            VOD.vod_play_from = playFrom.join('$$$');
            VOD.vod_play_url = playList.join('$$$');
        } catch (e) {
            log('解析出错，请尝试刷新或重试：' + e.message);
        }
    `
}
