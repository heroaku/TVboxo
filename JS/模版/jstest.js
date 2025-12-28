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
    // 保持原有的一级规则不变
    一级: '#videos&&.card:not(:has(.badge-success:contains(广告)));a:eq(-1)&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    二级: $js.toString(() => {
        try {
            let html = request(input);
            let VOD = {};
            
            // 标题 - 从面包屑导航获取更准确
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
                } else if (th.includes('語言') || th.includes('语言')) {
                    VOD.vod_lang = td;
                } else if (th.includes('年代') || th.includes('年份')) {
                    VOD.vod_year = td;
                }
            });
            
            // 剧情介绍 - 改进选择器
            let contentSelectors = [
                'h3:contains(劇情介紹)+p',
                'h3:contains(剧情介绍)+p',
                'h3 i.fa-pie-chart+*+p',
                'h3:has(i.fa-pie-chart)+p'
            ];
            
            for (let selector of contentSelectors) {
                let content = pdfh(html, selector + '&&Text');
                if (content && content.trim()) {
                    VOD.vod_content = content.trim();
                    break;
                }
            }
            
            // 演员信息
            let actorSections = [
                'h3:contains(領銜主演)+*+a',
                'h3:contains(主演)+*+a',
                'h3:has(i.fa-users)+*+a'
            ];
            
            let actors = [];
            for (let section of actorSections) {
                let actorElements = pdfa(html, section);
                if (actorElements.length > 0) {
                    actors = actorElements.map(actor => pdfh(actor, '&&Text')).filter(a => a.trim());
                    break;
                }
            }
            
            if (actors.length > 0) {
                VOD.vod_actor = actors.join(',');
            }
            
            // 剧集列表
            let episodes = pdfa(html, '.seqs&&a');
            let playList = episodes.map(ep => {
                let name = pdfh(ep, '&&Text');
                let url = pd(ep, '&&href', input);
                return name + '$' + url;
            });
            
            if (playList.length === 0) {
                // 如果没有找到剧集列表，可能是电影或单集，使用页面本身作为播放地址
                playList.push('播放$' + input);
            }
            
            VOD.vod_play_from = '默认';
            VOD.vod_play_url = playList.join('#');
            
            return VOD;
            
        } catch(error) {
            console.log('二级解析错误:', error);
            return {
                vod_name: '加载中',
                vod_play_from: '默认',
                vod_play_url: '播放$' + input
            };
        }
    }),
    
    搜索: '*',
}
