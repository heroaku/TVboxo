var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
    url: '/show/fyclass/',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: { 'User-Agent': MOBILE_UA },

    class_name: '电影&电视剧&综艺&动漫&短剧&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&duanju&jilupian',

    filter: {
        "dianying": [
            {"key":"cateId","name":"类型","value":[{"n":"全部","v":"dianying"},{"n":"动作","v":"dongzuopian"},{"n":"喜剧","v":"xijupian"},{"n":"爱情","v":"aiqingpian"},{"n":"科幻","v":"kehuanpian"},{"n":"恐怖","v":"kongbupian"},{"n":"剧情","v":"juqingpian"},{"n":"战争","v":"zhanzhengpian"}]},
            {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"加拿大","v":"加拿大"},{"n":"澳大利亚","v":"澳大利亚"},{"n":"其他","v":"其他"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ],
        "dianshiju": [
            {"key":"cateId","name":"类型","value":[{"n":"全部","v":"dianshiju"},{"n":"国产剧","v":"guochanju"},{"n":"欧美剧","v":"oumeiju"},{"n":"韩剧","v":"hanju"},{"n":"日剧","v":"riju"},{"n":"台湾剧","v":"taiwanju"},{"n":"香港剧","v":"xianggangju"},{"n":"泰国剧","v":"taiguoju"}]},
            {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"武侠","v":"武侠"},{"n":"古装","v":"古装"},{"n":"家庭","v":"家庭"},{"n":"犯罪","v":"犯罪"},{"n":"科幻","v":"科幻"},{"n":"恐怖","v":"恐怖"},{"n":"历史","v":"历史"},{"n":"战争","v":"战争"},{"n":"动作","v":"动作"},{"n":"冒险","v":"冒险"},{"n":"传记","v":"传记"},{"n":"剧情","v":"剧情"},{"n":"奇幻","v":"奇幻"},{"n":"惊悚","v":"惊悚"},{"n":"灾难","v":"灾难"},{"n":"歌舞","v":"歌舞"},{"n":"音乐","v":"音乐"},{"n":"同性","v":"同性"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ],
        "zongyi": [
            {"key":"cateId","name":"类型","value":[{"n":"全部","v":"zongyi"},{"n":"大陆综艺","v":"daluzongyi"},{"n":"港台综艺","v":"gangtaizongyi"},{"n":"日韩综艺","v":"rihanzongyi"},{"n":"欧美综艺","v":"oumei"}]},
            {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"真人秀","v":"真人秀"},{"n":"脱口秀","v":"脱口秀"},{"n":"音乐","v":"音乐"},{"n":"歌舞","v":"歌舞"},{"n":"选秀","v":"选秀"},{"n":"情感","v":"情感"},{"n":"访谈","v":"访谈"},{"n":"旅游","v":"旅游"},{"n":"美食","v":"美食"},{"n":"纪实","v":"纪实"},{"n":"曲艺","v":"曲艺"},{"n":"生活","v":"生活"},{"n":"游戏互动","v":"游戏互动"},{"n":"财经","v":"财经"},{"n":"求职","v":"求职"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ],
        "dongman": [
            {"key":"cateId","name":"类型","value":[{"n":"全部","v":"dongman"},{"n":"国产动漫","v":"guochandongman"},{"n":"日韩动漫","v":"rihandongman"},{"n":"欧美动漫","v":"oumeidongman"},{"n":"港台动漫","v":"gangtai"}]},
            {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"热血","v":"热血"},{"n":"奇幻","v":"奇幻"},{"n":"励志","v":"励志"},{"n":"灾难","v":"灾难"},{"n":"校园","v":"校园"},{"n":"少年","v":"少年"},{"n":"情感","v":"情感"},{"n":"推理","v":"推理"},{"n":"萝莉","v":"萝莉"},{"n":"动作","v":"动作"},{"n":"机战","v":"机战"},{"n":"运动","v":"运动"},{"n":"战争","v":"战争"},{"n":"少女","v":"少女"},{"n":"社会","v":"社会"},{"n":"原创","v":"原创"},{"n":"亲子","v":"亲子"},{"n":"益智","v":"益智"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ],
        "duanju": [
            {"key":"cateId","name":"类型","value":[{"n":"全部","v":"duanju"},{"n":"全部短剧","v":"quanbuduanju"},{"n":"重生民国","v":"zhongshengminguo"},{"n":"穿越年代","v":"chuanyueniandai"},{"n":"现代言情","v":"xiandaiyanqing"},{"n":"反转爽剧","v":"fanzhuanshuangju"},{"n":"女频恋爱","v":"nvpinlianai"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ],
        "jilupian": [
            {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"美国","v":"美国"},{"n":"英国","v":"英国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"台湾","v":"台湾"},{"n":"香港","v":"香港"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"意大利","v":"意大利"},{"n":"西班牙","v":"西班牙"},{"n":"印度","v":"印度"},{"n":"泰国","v":"泰国"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"加拿大","v":"加拿大"},{"n":"澳大利亚","v":"澳大利亚"},{"n":"爱尔兰","v":"爱尔兰"},{"n":"瑞典","v":"瑞典"},{"n":"巴西","v":"巴西"},{"n":"丹麦","v":"丹麦"},{"n":"其他","v":"其他"}]},
            {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},
            {"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}
        ]
    },

    首页: $js.toString(() => {
        let html = fetch(HOST + '/show/dianshiju/');
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    一级: $js.toString(() => {
        let fyclass = input.split('/show/')[1]?.split('/')[0] || 'dianying';
        let page = input.match(/page\/(\d+)/)?.[1] || '1';
        let fl = {};
        try { fl = JSON.parse(input.split('fl=')[1]?.split('&')[0] || '{}'); } catch(e) {}

        let parts = [];
        // 主路径：优先用 cateId 子类
        if (fl.cateId && fl.cateId !== fyclass) {
            parts.push(fl.cateId);
        } else {
            parts.push(fyclass);
        }

        // 筛选字段：电影/纪录片用 area，其他用 class
        if (fyclass === 'dianying' || fyclass === 'jilupian') {
            if (fl.area) parts.push('area', fl.area);
        } else {
            if (fl.class) parts.push('class', fl.class);
        }

        // 排序 + 年份
        parts.push('by', fl.by || 'year');
        if (fl.year) parts.push('year', fl.year);

        // 拼接 URL（第1页不加 page/1）
        let url = HOST + '/show/' + parts.join('/') + (page === '1' ? '/' : `/page/${page}/`);

        // 请求并解析
        let html = fetch(url);
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    二级: $js.toString(() => {
        let html = fetch(HOST + '/detail/' + input + '.html');
        let vod_name = pdfh(html, 'h1&&Text') || input;
        let vod_pic = pdfh(html, 'img.lazy&&data-src');
        let vod_actor = pdfh(html, 'div:contains(主演)&&Text').replace(/主演：/, '').trim();
        let vod_content = '';

        // 尝试提取剧情
        let fullScript = html.match(new RegExp('var divEle = document.getElementById\\("blurb_' + vod_name.replace(/[^\w]/g, '_') + '"\\);divEle.innerHTML=s;'));
        if (fullScript) {
            let content = html.match(/if\("([^"]*)"\.length !== 0\)/)?.[1] || '';
            if (content) vod_content = content;
        }

        // 多线路
        let tabs = pdfa(html, '.module-player-tab a.module-tab-item');
        let vod_play_from = [];
        let vod_play_url = [];

        tabs.forEach(tab => {
            let tabName = pdfh(tab, 'span&&Text') || pdfh(tab, '&&Text');
            let tabHref = pdfh(tab, 'a&&href');
            if (!tabHref) return;

            let playHtml = fetch(HOST + tabHref);
            let episodes = pdfa(playHtml, '.module-blocklist a');
            let urls = [];
            episodes.forEach(ep => {
                let title = pdfh(ep, 'span&&Text') || pdfh(ep, '&&Text');
                let href = pdfh(ep, 'a&&href');
                if (title && href) urls.push(title + '$' + href);
            });
            if (urls.length > 0) {
                vod_play_from.push(tabName);
                vod_play_url.push(urls.join('#'));
            }
        });

        VOD = {
            vod_id: input,
            vod_name: vod_name,
            vod_pic: vod_pic,
            vod_actor: vod_actor,
            vod_content: vod_content,
            vod_play_from: vod_play_from.join('$$$'),
            vod_play_url: vod_play_url.join('$$$')
        };
    }),

    搜索: $js.toString(() => {
        let html = fetch(input);
        let list = pdfa(html, 'div.module-items > div.module-item');
        VODS = [];
        list.forEach(it => {
            VODS.push({
                vod_name: pdfh(it, 'a.module-item-title&&title'),
                vod_id: pdfh(it, 'a.module-item-title&&href').match(/\/detail\/([^\/]+)\.html/)?.[1] || '',
                vod_pic: pdfh(it, 'img.lazy&&data-src'),
                vod_remarks: pdfh(it, '.module-item-text&&Text') || ''
            });
        });
    }),

    lazy: $js.toString(() => {
        let html = fetch(HOST + input);
        let m3u8 = pdfh(html, 'a#bfurl&&href');
        if (!m3u8) {
            let script = html.match(/var player_aaaa=({.*?});/)?.[1];
            if (script) {
                try {
                    let obj = JSON.parse(script.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']'));
                    m3u8 = obj.url || '';
                } catch (e) {}
            }
        }
        if (m3u8) {
            input = { jx: 0, parse: 0, url: m3u8 };
        }
    })
};
