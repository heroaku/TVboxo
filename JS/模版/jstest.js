var rule = {
    title: '量子资源',
    host: 'https://www.lzizy.com',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter_url: '',
    filter: {
        "1": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"动作片","v":"6"},{"n":"喜剧片","v":"7"},{"n":"爱情片","v":"8"},{"n":"科幻片","v":"9"},{"n":"恐怖片","v":"10"},{"n":"剧情片","v":"11"},{"n":"战争片","v":"12"},{"n":"纪录片","v":"20"},{"n":"伦理片","v":"34"}]}],
        "2": [{"key":"class","name":"地区","value":[{"n":"全部","v":""},{"n":"国产剧","v":"13"},{"n":"港剧","v":"14"},{"n":"韩剧","v":"15"},{"n":"欧美剧","v":"16"},{"n":"台剧","v":"21"},{"n":"日剧","v":"22"},{"n":"海外剧","v":"23"},{"n":"泰剧","v":"24"},{"n":"短剧","v":"46"}]}],
        "3": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"大陆综艺","v":"25"},{"n":"港台综艺","v":"26"},{"n":"日韩综艺","v":"27"},{"n":"欧美综艺","v":"28"}]}],
        "4": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国产动漫","v":"29"},{"n":"日韩动漫","v":"30"},{"n":"欧美动漫","v":"31"}]}],
        "36": [{"key":"class","name":"体育","value":[{"n":"全部","v":""},{"n":"足球","v":"37"},{"n":"篮球","v":"38"},{"n":"网球","v":"39"},{"n":"斯诺克","v":"40"}]}]
    },
    class_name: '电影&连续剧&综艺&动漫&体育&电影解说&短剧',
    class_url: '1&2&3&4&36&35&46',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 5000,

    // 首页推荐
    首页: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'ul.videoContent > li');
        VODS = [];
        list.forEach(li => {
            let title = pdfh(li, 'a.videoName&&Text').replace(/<i>.*<\/i>/, '').trim();
            let link = pdfh(li, 'a.videoName&&href');
            let img = ''; // 量子首页无图，可留空
            let note = '';
            if (title.includes('已完结') || title.includes('更新至')) {
                note = title.match(/(已完结|更新至.*)/)?.[0] || '';
                title = title.replace(/(已完结|更新至.*)/, '').trim();
            }
            VODS.push({
                vod_name: title,
                vod_id: link,
                vod_pic: img,
                vod_remarks: note
            });
        });
    }),

    // 一级列表
    一级: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'ul.videoContent > li');
        VODS = [];
        list.forEach(li => {
            let title = pdfh(li, 'a.videoName&&Text').replace(/<i>.*<\/i>/, '').trim();
            let link = pdfh(li, 'a.videoName&&href');
            let img = '';
            let note = '';
            if (title.includes('已完结') || title.includes('更新至')) {
                note = title.match(/(已完结|更新至.*)/)?.[0] || '';
                title = title.replace(/(已完结|更新至.*)/, '').trim();
            }
            VODS.push({
                vod_name: title,
                vod_id: link.replace(/.*?\/detail\/id\/(\d+)\.html/, '$1'),
                vod_pic: img,
                vod_remarks: note
            });
        });
    }),

    // 二级详情 & 播放列表
    二级: $js.toString(() => {
        let html = fetch(HOST + input);
        let vod_name = pdfh(html, 'h1&&Text') || pdfh(html, '.videoName&&Text') || '未知';
        let vod_pic = pdfh(html, 'img&&src') || '';
        let vod_year = pdfh(html, 'li:contains(年份)&&Text') || '';
        let vod_area = pdfh(html, 'li:contains(地区)&&Text') || '';
        let vod_actor = pdfh(html, 'li:contains(主演)&&Text') || '';
        let vod_director = pdfh(html, 'li:contains(导演)&&Text') || '';
        let vod_content = pdfh(html, 'div.vod_content&&Text') || '';

        // 提取播放源（通常只有一个 iframe）
        let iframe = pdfh(html, 'iframe&&src');
        let playUrl = '';
        if (iframe && iframe.includes('m3u8')) {
            playUrl = iframe;
        } else if (iframe) {
            // 尝试进入 iframe 页面提取 m3u8
            let iframeHtml = fetch(iframe.includes('http') ? iframe : HOST + iframe);
            let m3u8 = iframeHtml.match(/https?:\/\/[^\s"']+\.m3u8/)?.[0];
            if (m3u8) playUrl = m3u8;
        }

        // 如果没有找到，尝试从 script 中提取（备用）
        if (!playUrl) {
            let script = html.match(/player_aaaa\s*=\s*({.*?});/)?.[1];
            if (script) {
                try {
                    let obj = JSON.parse(script.replace(/'/g, '"').replace(/([\{\,])(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:\s*)/g, '$1"$3"$4'));
                    if (obj.url && obj.url.includes('m3u8')) {
                        playUrl = obj.url;
                    }
                } catch (e) {}
            }
        }

        VOD = {
            vod_id: input,
            vod_name: vod_name,
            vod_pic: vod_pic,
            vod_year: vod_year.replace(/\D+/g, ''),
            vod_area: vod_area.replace(/地区：/, ''),
            vod_actor: vod_actor.replace(/主演：/, ''),
            vod_director: vod_director.replace(/导演：/, ''),
            vod_content: vod_content,
            vod_play_from: '量子线路',
            vod_play_url: '第1集$' + playUrl
        };
    }),

    // 搜索
    搜索: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'ul.videoContent > li');
        VODS = [];
        list.forEach(li => {
            let title = pdfh(li, 'a.videoName&&Text').replace(/<i>.*<\/i>/, '').trim();
            let link = pdfh(li, 'a.videoName&&href');
            let note = '';
            if (title.includes('已完结') || title.includes('更新至')) {
                note = title.match(/(已完结|更新至.*)/)?.[0] || '';
                title = title.replace(/(已完结|更新至.*)/, '').trim();
            }
            VODS.push({
                vod_name: title,
                vod_id: link.replace(/.*?\/detail\/id\/(\d+)\.html/, '$1'),
                vod_remarks: note
            });
        });
    }),

    // 播放
    lazy: $js.toString(() => {
        // 量子资源多为直链，无需解密
        input = { jx: 0, parse: 0, url: input }
    }),

    // 编码与 UA
    编码: 'utf-8',
    headers: {
        'User-Agent': MOBILE_UA
    }
}
