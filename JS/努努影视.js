var rule = {
    author: '/25-10/10/',
    title: '努努',
    类型: '影院',
    host: 'https://nnyy.la/',
    hostJs: ``,
headers: {'User-Agent': MOBILE_UA},
    url: 'https://nnyy.la/fyclass/?page=fypage',
    filter_url: '',
    homeUrl: '',
    detailUrl: 'https://nnyy.la/dianshiju/fyid-vkvkqmtyvkzp.html',  
    searchUrl: 'https://nnyy.la/search?page=fypage&wd=**',
  搜索: 'a:has(.note);img&&alt;img&&data-src;.note&&Text;a&&href',
    编码: 'utf-8',
    timeout: 5000,
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    limit: 9,
    double: false,
    class_name: '电影&电视剧&综艺&动漫&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&jilupian',
    推荐: '*',    
    一级: 'a:has(.note);img&&alt;img&&data-src;.note&&Text;a&&href',
二级: $js.toString(() => {
rule.playPrefix = input;
let khtml = fetch(input);
let ktabs = pdfa(khtml, '#slider&&dt').map((it) => { return '努努-' + pdfh(it, 'body&&Text') });
let kurls = pdfa(khtml, 'ul.sort-list').map((item) => { 
    let kurl = pdfa(item, 'a').map((it) => { return pdfh(it, 'body&&Text') + '$' + pdfh(it, 'a&&onclick') });
    return kurl.join('#')
});
VOD = {
    vod_id: input,
    vod_name: '📢:本线路仅作者学习测试使用切勿传播!♻️ 正片开始👉' + pdfh(khtml, 'h1&&Text'),
    type_name: pdfh(khtml, '.product-excerpt:contains(类型)&&Text').replace('类型：', ' '),
    vod_remarks: pdfh(khtml, '.product-excerpt:contains(又名)&&Text').replace('又名：', ' '),
    vod_year: pdfh(khtml, 'p:contains(年份)&&Text').replace('年份：', ' '),
    vod_area: pdfh(khtml, 'p:contains(制片国家/地区)&&Text').replace('制片国家/地区：', ' '),
    vod_director: pdfh(khtml, '.product-excerpt:contains(导演)&&Text').replace('导演：', ' '),
    vod_actor: pdfh(khtml, '.product-excerpt:contains(主演)&&Text').replace('主演：', ' '),
    vod_content: '作者提醒：广告勿信、祝您观影愉快!现为你介绍剧情:💕' + pdfh(khtml, '.product-excerpt:contains(剧情简介)&&Text').replace('剧情简介：', ' '),
    vod_play_from: ktabs.join('$$$'),
    vod_play_url: kurls.join('$$$')
};
}),
play_parse: true,
lazy: $js.toString(() => {
let [sid, nid] = input.match(/\d+/g).map(Number);
let purl = `${rule.playPrefix}?sid=${sid+1}&nid=${nid+1}`;
let kurl = fetch(purl).split('key = "')[1].split('"')[0];
if (/\.(m3u8|mp4)/.test(kurl)) {
    input = { parse: 0, url: kurl, header: rule.headers }
} else {
    input = { parse: 1, url: purl }
}
}),
}
