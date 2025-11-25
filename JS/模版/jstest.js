var rule = {
    title: '达达趣影视',
    host: 'https://www.dadaqu.cc',
    homeUrl: '/',
    url: '/show/fyclass--------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
    },
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    推荐: 'div.module-items:eq(1) a.module-poster-item;div.module-poster-item-title&&Text;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    double: false,
    一级: `
js:
let url = 'https://www.dadaqu.cc/show/' + MY_CATE + '--------' + MY_PAGE + '---.html';
let html = request(url);
if (html.includes('防火墙正在检查您的访问') || html.includes('btwaf')) {
    let match = html.match(/btwaf(.*?)"/);
    if (match) {
        let btwaf = match[1];
        let newUrl = 'https://www.dadaqu.cc/show/' + MY_CATE + '--------' + MY_PAGE + '---.html?btwaf' + btwaf;
        let res = request(newUrl, { withHeaders: true });
        let setCk = Object.keys(res.headers).find(k => k.toLowerCase() === 'set-cookie');
        if (setCk) {
            let cookie = res.headers[setCk].split(';')[0];
            rule.headers = rule.headers || {};
            rule.headers['Cookie'] = cookie;
            fetch_params.headers['Cookie'] = cookie;
        }
        html = res.body || res.content || '';
    }
}
pdfa(html, 'div.module-items:eq(1) a.module-poster-item').map(it => {
    let title = pdfh(it, 'div.module-poster-item-title&&Text');
    let img = pd(it, '.module-item-pic&&img&&data-original');
    let desc = pdfh(it, '.module-item-note&&Text');
    let url = pdfh(it, 'a&&href');
    VODS.push({
        vod_name: title,
        vod_pic: img,
        vod_remarks: desc,
        vod_id: url
    });
});
`,
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(0)&&Text',
        img: '.module-item-pic&&img&&src',
        desc: '.module-info-item-content:eq(4)&&Text;.module-info-item-content:eq(5)&&Text;.module-info-item-content:eq(3)&&Text;.module-info-item-content:eq(2)&&Text',
        content: '.module-info-introduction-content&&Text',
        tabs: '.module-tab-item span',
        lists: '.module-play-list:eq(#id) a'
    },
    搜索: 'div.module-items a.module-poster-item;div.module-poster-item-title&&Text;.module-item-pic&&img&&data-original;.module-item-note&&Text;a&&href',
    lazy: '',
    play_parse: false,
    limit: 6
};
