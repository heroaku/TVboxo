var rule = {
author: '小可乐/240701/第一版',
title: '2345one',
类型: '影视',
host: 'http://142.171.220.28',
hostJs: '',
headers: {'User-Agent': 'MOBILE_UA'},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/',
url: '/vodshow/fyfilter',
filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
detailUrl: '',
searchUrl: '/vodsearch/**----------fypage---',
searchable: 1, 
quickSearch: 1, 
filterable: 1, 

class_name: '电影天堂&电视剧集&樱花动漫&综艺娱乐',
class_url: 'dianying&dianshiju&dongman&zongyi',
filter_def: {
dianying: {cateId: 'dianying'},
dianshiju: {cateId: 'dianshiju'},
dongman: {cateId: 'dongman'},
zongyi: {cateId: 'zongyi'}
},

play_parse: true,
lazy: `js:
let kcode = JSON.parse(request(input).match(/var player_.*?=(.*?)</)[1]);
let kurl = kcode.url;
if (/\\.(m3u8|mp4)/.test(kurl)) {
input = { jx: 0, parse: 0, url: kurl };
} else {
input = { jx: 0, parse: 1, url: kurl };
}
`,

limit: 9,
double: false,
推荐: '*',
一级: 'li.col-lg-2;a:eq(0)&&title;.lazyload&&data-original;p&&Text;a:eq(0)&&href',
二级: `js:
let html = request(input);
VOD = {};
VOD.vod_id = input;
VOD.vod_name = pdfh(html, '.info&&h3&&Text');
VOD.vod_pic = pd(html, 'img&&data-original', input);
VOD.type_name = pdfh(html, 'p.row&&span:eq(0)&&Text').replace('分类：','');
VOD.vod_remarks = pdfh(html, 'p.row&&span:eq(-1)&&Text');
VOD.vod_year = pdfh(html, 'p.row&&span:eq(2)&&Text').replace('年份：','');
VOD.vod_area = pdfh(html, 'p.row&&span:eq(1)&&Text').replace('地区：','');
VOD.vod_actor = pdfh(html, 'p.row&&span:eq(-2)&&Text').replace('主演：','');
VOD.vod_director = pdfh(html, 'p.row&&span:eq(-3)&&Text').replace('导演：','');
VOD.vod_content = pdfh(html, '.pb-10&&Text');

let ktabs = pdfa(html,'.ewave-tab').map((it) => { return pdfh(it, 'body&&Text') });
VOD.vod_play_from = ktabs.join('$$$');

let klists = [];
pdfa(html, '.ewave-playlist-content').forEach((pl) => {
    let klist = pdfa(pl, 'body&&a').map((it) => {
    return pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input);
    });
    klist = klist.join('#');
    klists.push(klist)
});
VOD.vod_play_url = klists.join('$$$')
`,
搜索: '*',

filter: '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'
}
