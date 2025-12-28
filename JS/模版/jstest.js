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
    host: 'https://pttptt.cc',
    homeUrl: '/',
    url: '/p/fyclass?page=fypage',
    searchUrl: '/q/**?page=fypage',
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
    class_parse: 'ul.nav-sidebar&&a.nav-link;a&&Text;a&&href;(\\d+)',
    cate_exclude: '播放器快捷鍵|切換為簡體',
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
    推荐: '#videos&&.item:not(:has(a[rel="nofollow"]));.lines2 a&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    // 修改一级规则：排除广告内容
    一级: '#videos&&.item:not(:has(a[rel="nofollow"]));.lines2 a&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    二级: $js.toString(() => {
        try {
            let html = request(input);
            let VOD = {};
            
            // 标题 - 从面包屑导航获取
            let breadcrumbItems = pdfa(html, '.breadcrumb-item');
            if (breadcrumbItems.length > 0) {
                VOD.vod_name = pdfh(breadcrumbItems[breadcrumbItems.length - 1], '&&Text').trim();
            } else {
                VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || pdfh(html, 'h1&&Text');
            }
            
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
            let contentSelectors = [
                'h3:contains(劇情介紹)+p',
                'h3:contains(剧情介绍)+p',
                'h3 i.fa-pie-chart+*+p'
            ];
            
            for (let selector of contentSelectors) {
                let content = pdfh(html, selector + '&&Text');
                if (content) {
                    VOD.vod_content = content;
                    break;
                }
            }
            
            // 演员
            let actors = pdfa(html, 'h3:contains(領銜主演)+*+a');
            if (actors.length > 0) {
                let actorList = actors.map(actor => pdfh(actor, '&&Text')).join(',');
                VOD.vod_actor = actorList;
            }
            
            // 剧集列表
            let episodes = pdfa(html, '.seqs&&a');
            let playList = episodes.map(ep => {
                let name = pdfh(ep, '&&Text');
                let url = pd(ep, '&&href', input);
                return name + '$' + url;
            });
            
            if (playList.length === 0) {
                // 如果没有找到剧集列表，尝试直接播放
                playList.push('第1集$' + input);
            }
            
            VOD.vod_play_from = '默认';
            VOD.vod_play_url = playList.join('#');
            
            return VOD;
            
        } catch(error) {
            console.log('二级解析错误:', error);
            return {
                vod_name: '加载中',
                vod_play_from: '默认',
                vod_play_url: '第1集$' + input
            };
        }
    }),
    
    搜索: $js.toString(() => {
        try {
            let html = request(input);
            let items = pdfa(html, '#videos&&.item');
            
            let d = [];
            items.forEach(item => {
                // 排除广告内容
                let hasNofollow = pdfa(item, 'a[rel="nofollow"]').length > 0;
                if (hasNofollow) return;
                
                let name = pdfh(item, '.lines2 a&&Text');
                let pic = pd(item, 'img&&src', input);
                let remarks = pdfh(item, '.badge-success&&Text');
                let href = pd(item, 'a[href*="/v/"]&&href', input);
                
                if (name && href) {
                    d.push({
                        title: name,
                        pic_url: pic,
                        desc: remarks,
                        url: href
                    });
                }
            });
            
            return JSON.stringify(d);
        } catch(error) {
            return '[]';
        }
    }),
}
