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
        try {
            let html = request(input);
            
            // 尝试从script标签中提取
            let scripts = pdfa(html, 'script&&Html');
            for (let script of scripts) {
                if (script.includes('m3u8') || script.includes('.mp4')) {
                    let m3u8Match = script.match(/["']([^"']+\.m3u8[^"']*)["']/i);
                    if (m3u8Match && m3u8Match[1]) {
                        let url = m3u8Match[1];
                        if (!url.startsWith('http')) {
                            url = urljoin(input, url);
                        }
                        return {parse: 0, url: url, js: ''};
                    }
                    
                    let mp4Match = script.match(/["']([^"']+\.mp4[^"']*)["']/i);
                    if (mp4Match && mp4Match[1]) {
                        let url = mp4Match[1];
                        if (!url.startsWith('http')) {
                            url = urljoin(input, url);
                        }
                        return {parse: 0, url: url, js: ''};
                    }
                }
            }
            
            return {parse: 0, url: input, js: ''};
            
        } catch(error) {
            return {parse: 0, url: input, js: ''};
        }
    }),
    double: false,
    推荐: '*',
    // 修改一级规则：正确提取详情页链接
    一级: '#videos&&.card:not(:has(.badge-success:contains(广告)));a:eq(-1)&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    二级: $js.toString(() => {
        try {
            let html = request(input);
            let VOD = {};
            
            // 标题
            VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || pdfh(html, 'h1&&Text');
            
            // 封面
            VOD.vod_pic = pd(html, '.row.mb-3 img&&src', input);
            
            // 基本信息
            let tableRows = pdfa(html, '.table-about&&tbody&&tr');
            tableRows.forEach(row => {
                let th = pdfh(row, 'th&&Text').trim();
                let td = pdfh(row, 'td&&Text').trim();
                
                if (th.includes('狀態') || th.includes('状态')) {
                    VOD.vod_remarks = td;
                } else if (th.includes('類別') || th.includes('类别')) {
                    VOD.type_name = td;
                } else if (th.includes('導演') || th.includes('导演')) {
                    VOD.vod_director = td;
                } else if (th.includes('國家') || th.includes('国家')) {
                    VOD.vod_area = td;
                } else if (th.includes('年代') || th.includes('年份')) {
                    VOD.vod_year = td;
                }
            });
            
            // 剧情
            VOD.vod_content = pdfh(html, 'h3:contains(劇情介紹)+p&&Text');
            
            // 剧集列表
            let episodes = pdfa(html, '.seqs&&a');
            let playList = episodes.map(ep => {
                let name = pdfh(ep, 'a&&Text');
                let url = pd(ep, 'a&&href', input);
                return name + '$' + url;
            });
            
            VOD.vod_play_from = '默认';
            VOD.vod_play_url = playList.join('#');
            
            return VOD;
            
        } catch(error) {
            return {
                vod_name: '加载中',
                vod_play_from: '默认',
                vod_play_url: '第1集$' + input + '/1'
            };
        }
    }),
    搜索: '*',
}
