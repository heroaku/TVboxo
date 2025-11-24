var rule = {
    title: '秀儿影视',
    host: 'https://www.xiuer.pro',
     //https://www.xiuer.pro/show/fyclass/page/fypage/
    //https://www.xiuer.pro/show/dianshiju/by/level/class/%E7%88%B1%E6%83%85/page/2/year/2025/
    url: '/show/fyfilter/',
    filter_url:'{{fl.cateId}}/by/{{fl.by}}/class/{{fl.class}}/page/fypage/year/{{fl.year}}',
//filter_url: '{{fl.cateId ? fl.cateId : fl.type}}/by/{{fl.by || "year"}}{{fl.year ? "/year/" + fl.year : ""}}{{fl.area ? "/area/" + encodeURIComponent(fl.area) : ""}}{{fl.class ? "/class/" + encodeURIComponent(fl.class) : ""}}{{fypage > 1 ? "/page/" + fypage : ""}}',
filter: {
  "dianying": [{"key":"cateId","name":"类型","value":[{"n":"全部","v":"dianying"},{"n":"动作","v":"dongzuopian"},{"n":"喜剧","v":"xijupian"},{"n":"爱情","v":"aiqingpian"},{"n":"科幻","v":"kehuanpian"},{"n":"恐怖","v":"kongbupian"},{"n":"剧情","v":"juqingpian"},{"n":"战争","v":"zhanzhengpian"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"美国","v":"美国"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"加拿大","v":"加拿大"},{"n":"澳大利亚","v":"澳大利亚"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}],
  "dianshiju": [{"key":"cateId","name":"类型","value":[{"n":"全部","v":"dianshiju"},{"n":"国产剧","v":"guochanju"},{"n":"欧美剧","v":"oumeiju"},{"n":"韩剧","v":"hanju"},{"n":"日剧","v":"riju"},{"n":"台湾剧","v":"taiwanju"},{"n":"香港剧","v":"xianggangju"},{"n":"泰国剧","v":"taiguoju"}]},{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"武侠","v":"武侠"},{"n":"古装","v":"古装"},{"n":"家庭","v":"家庭"},{"n":"犯罪","v":"犯罪"},{"n":"科幻","v":"科幻"},{"n":"恐怖","v":"恐怖"},{"n":"历史","v":"历史"},{"n":"战争","v":"战争"},{"n":"动作","v":"动作"},{"n":"冒险","v":"冒险"},{"n":"传记","v":"传记"},{"n":"剧情","v":"剧情"},{"n":"奇幻","v":"奇幻"},{"n":"惊悚","v":"惊悚"},{"n":"灾难","v":"灾难"},{"n":"歌舞","v":"歌舞"},{"n":"音乐","v":"音乐"},{"n":"同性","v":"同性"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}],
  "zongyi": [{"key":"cateId","name":"类型","value":[{"n":"全部","v":"zongyi"},{"n":"大陆综艺","v":"daluzongyi"},{"n":"港台综艺","v":"gangtaizongyi"},{"n":"日韩综艺","v":"rihanzongyi"},{"n":"欧美综艺","v":"oumei"}]},{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"真人秀","v":"真人秀"},{"n":"脱口秀","v":"脱口秀"},{"n":"音乐","v":"音乐"},{"n":"歌舞","v":"歌舞"},{"n":"选秀","v":"选秀"},{"n":"情感","v":"情感"},{"n":"访谈","v":"访谈"},{"n":"旅游","v":"旅游"},{"n":"美食","v":"美食"},{"n":"纪实","v":"纪实"},{"n":"曲艺","v":"曲艺"},{"n":"生活","v":"生活"},{"n":"游戏互动","v":"游戏互动"},{"n":"财经","v":"财经"},{"n":"求职","v":"求职"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}],
  "dongman": [{"key":"cateId","name":"类型","value":[{"n":"全部","v":"dongman"},{"n":"国产动漫","v":"guochandongman"},{"n":"日韩动漫","v":"rihandongman"},{"n":"欧美动漫","v":"oumeidongman"},{"n":"港台动漫","v":"gangtai"}]},{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"热血","v":"热血"},{"n":"奇幻","v":"奇幻"},{"n":"励志","v":"励志"},{"n":"灾难","v":"灾难"},{"n":"校园","v":"校园"},{"n":"少年","v":"少年"},{"n":"情感","v":"情感"},{"n":"推理","v":"推理"},{"n":"萝莉","v":"萝莉"},{"n":"动作","v":"动作"},{"n":"机战","v":"机战"},{"n":"运动","v":"运动"},{"n":"战争","v":"战争"},{"n":"少女","v":"少女"},{"n":"社会","v":"社会"},{"n":"原创","v":"原创"},{"n":"亲子","v":"亲子"},{"n":"益智","v":"益智"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}],
  "duanju": [{"key":"cateId","name":"类型","value":[{"n":"全部","v":"duanju"},{"n":"全部短剧","v":"quanbuduanju"},{"n":"重生民国","v":"zhongshengminguo"},{"n":"穿越年代","v":"chuanyueniandai"},{"n":"现代言情","v":"xiandaiyanqing"},{"n":"反转爽剧","v":"fanzhuanshuangju"},{"n":"女频恋爱","v":"nvpinlianai"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}],
  "jilupian": [{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"美国","v":"美国"},{"n":"英国","v":"英国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"台湾","v":"台湾"},{"n":"香港","v":"香港"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"意大利","v":"意大利"},{"n":"西班牙","v":"西班牙"},{"n":"印度","v":"印度"},{"n":"泰国","v":"泰国"},{"n":"俄罗斯","v":"俄罗斯"},{"n":"加拿大","v":"加拿大"},{"n":"澳大利亚","v":"澳大利亚"},{"n":"爱尔兰","v":"爱尔兰"},{"n":"瑞典","v":"瑞典"},{"n":"巴西","v":"巴西"},{"n":"丹麦","v":"丹麦"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"year"},{"n":"人气","v":"level"},{"n":"评分","v":"score"}]}]
},

filter_def: {
  "dianying": { cateId: "dianying" },
  "dianshiju": { cateId: "dianshiju" },
  "zongyi": { cateId: "zongyi"},
  "dongman": { cateId: "dongman" },
  "duanju": { cateId: "duanju"},
  "jilupian": { cateId: "jilupian"}
},
    searchUrl: '/vodshow/fyclass--------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 1, //是否启用分类筛选,
   // class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
   class_name: '电影&电视剧&综艺&动漫&短剧&纪录片',
   class_url: 'dianying&dianshiju&zongyi&dongman&duanju&jilupian',
play_parse: true,
lazy: '',
limit: 6, 
推荐: '.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double: true, // 推荐内容是否双层定位
一级: '.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href', 
二级: {
    "title": "h1&&Text;.video-info-item:eq(1)&&Text",
    "img": ".module-item-pic&&img&&data-src",
    "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    "content": "Text",
    "tabs": ".module-tab-item .tab-item",
    "lists": ".module-list:eq(#id)&&.sort-item&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
    一级f: `js:
    let classMap = {
        'dianying': '电影',
        'dianshiju': '电视剧',
        'zongyi': '综艺',
        'dongman': '动漫',
        'duanju': '短剧',
        'jilupian': '纪录片'
    };
    let filters = {};
    let pdfa = jsp.pdfa;
    let pdfh = jsp.pdfh;

    for (let [cateId, cateName] of Object.entries(classMap)) {
        let url = 'https://www.xiuer.pro/show/' + cateId + '/';
        let html = request(url);
        let data = [];

        // 提取「类型」筛选（子类）
        let typeValues = [{ n: "全部", v: cateId }];
        let typeLinks = pdfa(html, 'div.library-list:first a.library-item');
        for (let a of typeLinks) {
            let href = pdfh(a, 'a&&href');
            let text = pdfh(a, 'a&&Text').trim();
            if (href.startsWith('/show/') && href !== '/show/' + cateId + '/') {
                let subType = href.replace('/show/', '').replace('/', '');
                typeValues.push({ n: text, v: subType });
            }
        }
        data.push({ key: "cateId", name: "类型", value: typeValues });

        // 提取「地区」或「剧情」
        if (cateId === 'dianying' || cateId === 'jilupian') {
            // 电影/纪录片：用 area
            let areaValues = [{ n: "全部", v: "" }];
            let areaLinks = pdfa(html, 'a[href*="/area/"]');
            for (let a of areaLinks) {
                let href = pdfh(a, 'a&&href');
                let area = href.match(/area\\/([^\\/]+)/)?.[1];
                if (area) {
                    area = decodeURIComponent(area);
                    if (!areaValues.some(x => x.n === area)) {
                        areaValues.push({ n: area, v: area });
                    }
                }
            }
            data.push({ key: "area", name: "地区", value: areaValues });
        } else {
            // 电视剧/综艺/动漫/短剧：用 class
            let classValues = [{ n: "全部", v: "" }];
            let classLinks = pdfa(html, 'a[href*="/class/"]');
            for (let a of classLinks) {
                let href = pdfh(a, 'a&&href');
                let cls = href.match(/class\\/([^\\/]+)/)?.[1];
                if (cls) {
                    cls = decodeURIComponent(cls);
                    if (!classValues.some(x => x.n === cls)) {
                        classValues.push({ n: cls, v: cls });
                    }
                }
            }
            data.push({ key: "class", name: "剧情", value: classValues });
        }

        // 年份（从分页链接中提取）
        let yearValues = [{ n: "全部", v: "" }];
        let yearLinks = pdfa(html, 'a[href*="/year/"]');
        for (let a of yearLinks) {
            let href = pdfh(a, 'a&&href');
            let year = href.match(/year\\/([^\\/]+)/)?.[1];
            if (year && /^\d{4}$/.test(year) && !yearValues.some(x => x.n === year)) {
                yearValues.push({ n: year, v: year });
            }
        }
        data.push({ key: "year", name: "年份", value: yearValues });

        // 排序（固定）
        data.push({ key: "by", name: "排序", value: [
            { n: "时间", v: "year" },
            { n: "人气", v: "level" },
            { n: "评分", v: "score" }
        ]});

        filters[cateId] = data;
    }

    VODS = [filters];
    console.log("Gzip Base64 filter:");
    console.log(gzip(JSON.stringify(filters)));
`,
}
