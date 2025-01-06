var rule = {
    author: '小虎斑',
    title: '小虎斑',

    host: 'https://4k-av.com',
    hostJs: '',
    headers: {
        'User-Agent': 'IOS_UA'
    },
    编码: 'utf-8',
    timeout: 5000,
    homeUrl: '/',
    url: '/fyclassfyfilter/page-fypage.html[/fyclassfyfilter]',
    filter_url: '{{fl.class}}',
    detailUrl: '',
    searchUrl: '/s?q=**',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集',
    class_url: 'movie&tv',
    filter_def: {},
    play_parse: true,
    proxy_rule: $js.toString(() => {
        if (input) {
            //console.log(url);   
            var url = `http://dm.sds11.top/jsdm.php?id=` + input.url;
            var htt = fetch(url);
            input = [200, "text/xml", htt];
        }
    }),
    lazy: $js.toString(() => {
        console.log(VOD.name);
        const parts = input.split('|');
        if (/m3u8|mp4/.test(parts[0])) {
            // const parts = input.split('|');
            input = {
                jx: 0,
                parse: 0,
                url: parts[0],
                danmaku: getProxyUrl() + '&url=' + getYoukuVideoUrl(VOD.vod_name, parts[1])
            };
        } else {
            let matchResult = request(parts[0]).match(/<source src="(.*?)"/);
            let kurl = matchResult ? matchResult[1] : '';
            if (kurl) {
                input = {
                    jx: 0,
                    parse: 0,
                    url: kurl,
                    danmaku: getProxyUrl() + '&url=' + getYoukuVideoUrl(VOD.vod_name, parts[1])
                };
            } else {
                input = {
                    jx: 0,
                    parse: 1,
                    url: parts[0],
                    danmaku: getProxyUrl() + '&url=' + getYoukuVideoUrl(VOD.vod_name, parts[1])
                };
            }
        }
    }),

    limit: 9,
    double: false,
    推荐: '*',
    一级: '.NTMitem;a&&title;img&&src;.tags&&Text;a&&href',
    二级: `js:
let khtml = request(input);
VOD = {};
VOD.vod_id = input;
VOD.vod_name = pdfh(khtml, '#tophead h1&&title') || '未知';
VOD.vod_name = VOD.vod_name.split(' ')[0];
VOD.type_name = pdfh(khtml, '.tags--span&&Text');
VOD.vod_pic = pdfh(khtml, '#MainContent_poster&&img&&src');
VOD.vod_remarks = pdfh(khtml, '.videodetail&&label:eq(0)&&Text');
VOD.vod_year = pdfh(khtml, '.videodetail&&a&&Text');
VOD.vod_area = pdfh(khtml, '.videodetail&&label:eq(1)&&Text');
VOD.vod_director = '未知';
VOD.vod_actor = '未知';
VOD.vod_content = pdfh(khtml, '.videodesc&&Text');
VOD.vod_play_from = '四维空间';

let klists = [];
let kcode = pdfa(khtml, 'ul#rtlist&&li');
if ( kcode == 0) {
    kcode = pdfa(khtml, '#MainContent_poster&&a');
    kcode.forEach((kc) => {
    let kname = pdfh(kc, 'a&&title').replace('电影海报','');
    let khref = pdfh(kc, 'a&&href').replace('poster.jpg','');
    let klist = kname + '$' + khref + '|' + kname;;
    klists.push(klist);
    });
    VOD.vod_play_url = klists.join('#');
} else {
    kcode;
    kcode.forEach((kc) => {
    let kname = pdfh(kc, 'span&&Text');
    let khref = pdfh(kc, 'img&&src').replace('screenshot.jpg','');
    let klist = kname + '$' + khref + '|' + kname;
    klists.push(klist);
    });
    VOD.vod_play_url = klists.join('#');
}
`,
    搜索: '*',

    filter: {
        "tv": [{
                "key": "class",
                "name": "剧情",
                "value": [{
                    "n": "全部",
                    "v": ""
                }, {
                    "n": "动作",
                    "v": "/tag/动作"
                }, {
                    "n": "剧情",
                    "v": "/tag/剧情"
                }, {
                    "n": "冒险",
                    "v": "/tag/冒险"
                }, {
                    "n": "喜剧",
                    "v": "/tag/喜剧"
                }, {
                    "n": "国产剧",
                    "v": "/tag/国产剧"
                }, {
                    "n": "恐怖",
                    "v": "/tag/恐怖"
                }, {
                    "n": "战争",
                    "v": "/tag/战争"
                }, {
                    "n": "科幻",
                    "v": "/tag/科幻"
                }, {
                    "n": "动画",
                    "v": "/tag/动画"
                }, {
                    "n": "韩剧",
                    "v": "/tag/韩剧"
                }, {
                    "n": "犯罪",
                    "v": "/tag/犯罪"
                }, {
                    "n": "纪录片",
                    "v": "/tag/纪录片"
                }]
            },
            {
                "key": "class",
                "name": "剧情",
                "value": [{
                    "n": "全部",
                    "v": ""
                }, {
                    "n": "2024",
                    "v": "/2024"
                }, {
                    "n": "2023",
                    "v": "/2023"
                }, {
                    "n": "2022",
                    "v": "/2022"
                }, {
                    "n": "2021",
                    "v": "/2021"
                }, {
                    "n": "2020",
                    "v": "/2020"
                }, {
                    "n": "2019",
                    "v": "/2019"
                }]
            }
        ]
    }
}

globalThis.getYoukuVideoUrl = function(wd, flag) {
    try {
        let api = `https://search.youku.com/api/search?pg=1&keyword=${encodeURIComponent(wd)}`;
        let response = request(api);
        let json = JSON.parse(response);
        // 获取 showId
        let showId = json.pageComponentList?.[0]?.commonData?.showId;
        if (!showId) {
            throw new Error('ShowId not found.');
        }
        // 第二个 API 请求，获取集数信息
        api = `https://search.youku.com/api/search?appScene=show_episode&showIds=${showId}`;
        response = request(api);
        // 匹配 flag 中的 "第x集" 或 "第x话"
        json = JSON.parse(response);
        let matches = String(flag).match(/第\s*(\d+)\s*集/) ||
            String(flag).match(/第\s*(\d+)\s*话/) ||
            String(flag).match(/(\d+)/);
        let url = '';
        if (matches && matches[1]) {
            // 获取对应集数的 URL 或 videoId
            let episodeIndex = parseInt(matches[1], 10) - 1;

            url = json.serisesList?.[episodeIndex]?.url || json.serisesList?.[episodeIndex]?.videoId;
        }
        // 如果没有匹配到 flag，取第一个集数的 URL
        if (!url) {
            url = json.serisesList?.[0]?.url || json.serisesList?.[0]?.videoId;
        }
        // 如果 URL 不是以 http 开头，则拼接成完整的 Youku 视频地址
        if (url && !url.startsWith('http')) {
            url = `https://v.youku.com/v_show/id_${url}.html`;
        }
        return url || 'https://v.youku.com/';
    } catch {
        return 'https://v.youku.com/1111';
    }
}