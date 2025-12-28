/*
@header({
  searchable: 2,
  filterable: 1,
  quickSearch: 0,
  title: 'PTT追剧大师',
  '类型': '影视',
  lang: 'ds'
})
*/

var rule = {
    类型: '影视',//影视|听书|漫画|小说
    title: 'PTT追剧大师',
    host: 'https://ptt.red',
    homeUrl: '/zh-cn',
    url: '/zh-cn/p/fyclass?page=fypage',
    searchUrl: '/zh-cn/q/**?page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    class_parse: '.nav-tabs&&a;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        let html = request(input);
        let sdata = pdfh(html, '.container-fluid&&script&&Html');
        // log(sdata);
        let json = JSON.parse(sdata);
        if (json.contentUrl) {
            input = {parse: 0, url: json.contentUrl, js: ''};
        }
    }),
    double: false,
    推荐: '*',
    //α大佬方案去除推荐页广告
    一级: '#videos&&.card:not(:has(.badge-success:contains(广告)));a:eq(-1)&&Text;img&&src;.badge-success&&Text;a:eq(-1)&&href',
    二级: $js.toString(() => {
        let html = request(input);
        let data = html.split('node:')[1].split('},')[0] + '}';
        data = data.trim();
        //   log(data);
        let json = JSON.parse(data);
        //   log(json);
        VOD = {};

        VOD.vod_name = json.title;
        VOD.type_name = json.type;
        VOD.vod_id = input;
        VOD.vod_pic = urljoin(input, json.thumbnail);
        VOD.vod_year = json.year;
        VOD.vod_area = json._area;
        VOD.vod_remarks = json.note;
        VOD.vod_content = json.description;
        VOD.vod_director = json.director;
        VOD.vod_actor = json.actors;
        let v_tabs = pdfa(html, '.nav-tabs&&li');
        let v_tab_urls = v_tabs.map(it => pd(it, 'a&&href', input));
        v_tabs = v_tabs.map(it => pdfh(it, 'a&&title'));
        // log(v_tab_urls);
        VOD.vod_play_from = v_tabs.join('$$$');
        let lists = [];
        let list1 = pdfa(html, '.mb-2.fullwidth&&a').map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input));
        // log(list1);
        lists.push(list1);
        if (v_tab_urls.length > 1) {
            let reqUrls = v_tab_urls.slice(1).map(it => {
                return {
                    url: it,
                    options: {
                        timeout: 5000,
                        headers: rule.headers
                    }
                }
            });
            let htmls = batchFetch(reqUrls);
            htmls.forEach((ht) => {
                if (ht) {
                    let list0 = pdfa(ht, '.mb-2.fullwidth&&a').map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input));
                    lists.push(list0);
                } else {
                    lists.push([]);
                }
            });
        }
        let playUrls = lists.map(it => it.join('#'));
        VOD.vod_play_url = playUrls.join('$$$');
    }),
    搜索: '*',
}
