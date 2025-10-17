/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '火车太堵',
  lang: 'ds'
})
*/

var rule = {
    类型: '影视',
    title: '火车太堵',
    alias: '电影猎手',
    desc: 'mxpro模板纯js写法',
    // host: 'https://tdgo.shop',
    host: 'https://tdwin.wiki',
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    headers: {
        'User-Agent': 'PC_UA',
    },
    searchable: 1, quickSearch: 0, filterable: 0, double: true, play_parse: true, limit: 6,
    class_name: '电影&电视剧&动漫&短剧&综艺',
    class_url: '20&21&22&24&23',
    lazy: async function () {
        let {input, pdfa, pdfh, pd} = this
        const html = JSON.parse((await req(input)).content.match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (html.encrypt == "1") {
            url = unescape(url)
            return {parse: 0, url: url}
        } else if (html.encrypt == "2") {
            url = unescape(base64Decode(url))
            return {parse: 0, url: url}
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
            return {parse: 0, url: input}
        } else {
            return {parse: 1, url: input}
        }
    },
    推荐: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        // log(html);
        let d = [];
        let data = pdfa(html, '.tab-list.active');
        data.forEach((it) => {
            let data1 = pdfa(it, 'a.module-poster-item.module-item');
            data1.forEach((it1) => {
                d.push({
                    title: pdfh(it1, '.module-poster-item-title&&Text'),
                    pic_url: pd(it1, '.lazyload&&data-original'),
                    desc: pdfh(it1, '.module-item-note&&Text'),
                    url: pd(it1, 'a&&href'),
                })
            });
        });
        return setResult(d)
    },
    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, 'body a.module-poster-item.module-item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: pdfh(it, '.module-item-note&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    },
    二级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let VOD = {};
        VOD.vod_name = pdfh(html, 'h1&&Text');
        VOD.type_name = pdfh(html, '.module-info-tag-link:eq(-1)&&Text');
        VOD.vod_pic = pd(html, '.lazyload&&data-original||data-src||src');
        VOD.vod_content = pdfh(html, '.module-info-introduction&&Text');
        VOD.vod_remarks = pdfh(html, '.module-info-item:eq(-2)&&Text');
        VOD.vod_year = pdfh(html, '.module-info-tag-link&&Text');
        VOD.vod_area = pdfh(html, '.module-info-tag-link:eq(1)&&Text');
        VOD.vod_actor = pdfh(html, '.module-info-item:eq(2)&&Text');
        VOD.vod_director = pdfh(html, '.module-info-item:eq(1)&&Text');
        let playlist = pdfa(html, '.module-play-list')
        let tabs = pdfa(html, '.module-tab-item');
        let playmap = {};
        tabs.map((item, i) => {
            const form = pdfh(item, 'Text')
            const list = playlist[i]
            const a = pdfa(list, 'body&&a')
            a.map((it) => {
                let title = pdfh(it, 'a&&Text')
                let urls = pd(it, 'a&&href', input)
                if (!playmap.hasOwnProperty(form)) {
                    playmap[form] = [];
                }
                playmap[form].push(title + "$" + urls);
            });
        });
        VOD.vod_play_from = Object.keys(playmap).join('$$$');
        const urls = Object.values(playmap);
        const playUrls = urls.map((urllist) => {
            return urllist.join("#")
        });
        VOD.vod_play_url = playUrls.join('$$$');
        return VOD
    },
    搜索: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, 'body .module-item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, '.module-card-item-title&&Text'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: pdfh(it, '.module-item-note&&Text'),
                url: pd(it, 'a&&href'),
                content: pdfh(it, '.module-info-item-content&&Text'),
            })
        });
        return setResult(d)
    }
}
