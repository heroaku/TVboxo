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
    类型: '影视',
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
    class_parse: '.nav-tabs&&a;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    
    lazy: $js.toString(() => {
        try {
            let html = request(input);
            
            // 1. 尝试从JSON-LD中提取m3u8地址（最可靠）
            let jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
            if (jsonLdMatch) {
                try {
                    let jsonData = JSON.parse(jsonLdMatch[1]);
                    if (jsonData.contentUrl && jsonData.contentUrl.includes('.m3u8')) {
                        console.log('从JSON-LD提取到播放地址:', jsonData.contentUrl);
                        return {parse: 0, url: jsonData.contentUrl, js: ''};
                    }
                } catch(e) {
                    console.log('JSON-LD解析失败:', e);
                }
            }
            
            // 2. 查找包含m3u8的script标签
            let scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
            for (let script of scripts) {
                // 查找明显的m3u8链接
                let m3u8Match = script.match(/["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/);
                if (m3u8Match) {
                    console.log('从script提取到播放地址:', m3u8Match[1]);
                    return {parse: 0, url: m3u8Match[1], js: ''};
                }
                
                // 查找base64编码的可能包含m3u8的数据
                if (script.includes('eval(function')) {
                    // 尝试解码一些常见模式
                    let base64Match = script.match(/['"]([A-Za-z0-9+/=]+)['"]/);
                    if (base64Match) {
                        try {
                            let decoded = atob(base64Match[1]);
                            if (decoded.includes('.m3u8')) {
                                let m3u8Url = decoded.match(/(https?:\/\/[^\s'"]+\.m3u8[^\s'"]*)/);
                                if (m3u8Url) {
                                    console.log('从base64解码得到播放地址:', m3u8Url[0]);
                                    return {parse: 0, url: m3u8Url[0], js: ''};
                                }
                            }
                        } catch(e) {}
                    }
                }
            }
            
            // 3. 如果是二级二层页面但没有找到播放地址，可能需要选择播放源
            if (input.match(/\/\d+\/\d+$/)) {
                let sourceLinks = html.match(/<a class="nav-link[^>]*href="([^"]+)"[^>]*>/g) || [];
                if (sourceLinks.length > 0) {
                    console.log('发现多个播放源，需要选择');
                    return {parse: 0, url: '', js: '// 请选择播放源'};
                }
            }
            
            // 4. 如果是二级一层页面，让用户选择剧集
            if (input.includes('/v/')) {
                return {parse: 0, url: '', js: '// 请选择具体剧集'};
            }
            
            console.log('未找到播放地址，使用原始URL');
            return {parse: 0, url: input, js: ''};
            
        } catch(error) {
            console.log('lazy解析错误:', error);
            return {parse: 0, url: input, js: ''};
        }
    }),
    
    double: false,
    推荐: '*',
    
    一级: '#videos&&.card:not(:has(.badge-success:contains(广告)));a:eq(-1)&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    二级: $js.toString(() => {
        try {
            let html = request(input);
            let VOD = {};
            
            // 判断页面类型
            let isDetailPage = input.includes('/v/');
            
            if (isDetailPage) {
                // 二级一层：影视详情页
                
                // 标题
                VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || 
                               pdfh(html, '.breadcrumb-item:last-child&&Text') ||
                               pdfh(html, 'title&&Text');
                
                // 封面
                let pic = pdfh(html, '.row.mb-3 img&&src') || 
                         pdfh(html, '.card-img-top&&src') ||
                         pdfh(html, 'meta[property="og:image"]&&content');
                VOD.vod_pic = pic ? (pic.startsWith('http') ? pic : urljoin('https://pttptt.cc', pic)) : '';
                
                // 基本信息表格
                let infoRows = pdfa(html, '.table-about tbody tr');
                infoRows.forEach(row => {
                    let label = pdfh(row, 'th&&Text').trim();
                    let value = pdfh(row, 'td&&Text').trim();
                    
                    if (label.includes('狀態') || label.includes('状态')) VOD.vod_remarks = value;
                    else if (label.includes('類別') || label.includes('类别')) VOD.type_name = value;
                    else if (label.includes('導演') || label.includes('导演')) VOD.vod_director = value;
                    else if (label.includes('國家') || label.includes('国家')) VOD.vod_area = value;
                    else if (label.includes('語言') || label.includes('语言')) VOD.vod_lang = value;
                    else if (label.includes('年代') || label.includes('年份')) VOD.vod_year = value;
                });
                
                // 剧情介绍
                VOD.vod_content = pdfh(html, 'h3:contains(劇情介紹)+p&&Text') || 
                                 pdfh(html, 'h3:contains(剧情介绍)+p&&Text') ||
                                 pdfh(html, 'meta[name="description"]&&content');
                
                // 演员
                let actors = [];
                let actorLinks = pdfa(html, 'h3:contains(領銜主演)+*+a, h3:contains(领衔主演)+*+a');
                actorLinks.forEach(link => {
                    actors.push(pdfh(link, '&&Text'));
                });
                if (actors.length > 0) {
                    VOD.vod_actor = actors.join(',');
                }
                
                // 提取剧集列表 - 关键修复！
                let episodes = [];
                
                // 方法1：使用 .seqs 下的链接
                let seqLinks = pdfa(html, '.seqs a, .seq.border, a.seq');
                seqLinks.forEach(link => {
                    let name = pdfh(link, '&&Text');
                    let href = pd(link, '&&href', input);
                    
                    if (name && href && !href.includes('/v/')) {
                        // 确保是完整的URL
                        if (!href.startsWith('http')) {
                            href = urljoin('https://pttptt.cc', href);
                        }
                        episodes.push(name + '$' + href);
                    }
                });
                
                // 方法2：如果没找到，尝试其他模式
                if (episodes.length === 0) {
                    let allLinks = pdfa(html, 'a');
                    allLinks.forEach(link => {
                        let href = pd(link, '&&href', input);
                        if (href && href.match(/\/\d+\/\d+$/)) {
                            let name = pdfh(link, '&&Text') || '播放';
                            if (!href.startsWith('http')) {
                                href = urljoin('https://pttptt.cc', href);
                            }
                            episodes.push(name + '$' + href);
                        }
                    });
                }
                
                // 设置播放列表
                if (episodes.length > 0) {
                    VOD.vod_play_from = '剧集';
                    VOD.vod_play_url = episodes.join('#');
                } else {
                    // 可能是电影，直接播放
                    VOD.vod_play_from = '播放';
                    VOD.vod_play_url = '播放$' + input;
                }
                
            } else {
                // 二级二层：播放页
                
                // 提取剧集信息
                let match = input.match(/\/(\d+)\/(\d+)/);
                if (match) {
                    let seriesId = match[1];
                    let episodeNum = match[2];
                    
                    // 尝试从面包屑导航获取标题
                    let breadcrumbs = pdfa(html, '.breadcrumb-item');
                    if (breadcrumbs.length >= 2) {
                        let seriesTitle = pdfh(breadcrumbs[breadcrumbs.length - 2], '&&Text');
                        VOD.vod_name = seriesTitle + ' 第' + episodeNum + '集';
                    } else {
                        VOD.vod_name = '第' + episodeNum + '集';
                    }
                } else {
                    VOD.vod_name = '播放';
                }
                
                // 检查是否有多个播放源
                let sourceTabs = pdfa(html, '.nav-tabs .nav-link');
                let sources = [];
                
                if (sourceTabs.length > 0) {
                    // 有多个播放源
                    sourceTabs.forEach(tab => {
                        let sourceName = pdfh(tab, '&&Text');
                        let sourceHref = pd(tab, '&&href', input);
                        if (sourceName && sourceHref) {
                            if (!sourceHref.startsWith('http')) {
                                sourceHref = urljoin('https://pttptt.cc', sourceHref);
                            }
                            sources.push(sourceName + '$' + sourceHref);
                        }
                    });
                    
                    if (sources.length > 0) {
                        VOD.vod_play_from = sources.map(s => s.split('$')[0]).join('#');
                        VOD.vod_play_url = sources.join('#');
                    } else {
                        VOD.vod_play_from = '播放';
                        VOD.vod_play_url = '播放$' + input;
                    }
                } else {
                    // 单播放源
                    VOD.vod_play_from = '播放';
                    VOD.vod_play_url = '播放$' + input;
                }
                
                // 尝试获取封面
                let coverImg = pdfh(html, 'meta[property="og:image"]&&content') ||
                              pdfh(html, '.lazyimage&&src');
                if (coverImg && !coverImg.startsWith('http')) {
                    coverImg = urljoin('https://pttptt.cc', coverImg);
                }
                VOD.vod_pic = coverImg || '';
                
                // 获取描述
                VOD.vod_content = pdfh(html, 'meta[property="og:description"]&&content') ||
                                 pdfh(html, 'meta[name="description"]&&content');
            }
            
            return VOD;
            
        } catch(error) {
            console.log('二级解析错误:', error);
            return {
                vod_name: '播放页面',
                vod_play_from: '默认',
                vod_play_url: '播放$' + input
            };
        }
    }),
    
    搜索: $js.toString(() => {
        try {
            let html = request(input);
            let results = [];
            let items = pdfa(html, '#videos .card');
            
            items.forEach(item => {
                try {
                    let vod_id = pd(item, 'a[href*="/v/"]&&href', input);
                    let vod_name = pdfh(item, 'a:eq(-1)&&Text');
                    let vod_pic = pd(item, 'img&&src', input);
                    let vod_remarks = pdfh(item, '.badge-success&&Text');
                    
                    if (vod_id && vod_name) {
                        // 补全图片URL
                        if (vod_pic && !vod_pic.startsWith('http')) {
                            vod_pic = urljoin('https://pttptt.cc', vod_pic);
                        }
                        
                        results.push({
                            vod_id: vod_id,
                            vod_name: vod_name,
                            vod_pic: vod_pic,
                            vod_remarks: vod_remarks || ''
                        });
                    }
                } catch(e) {
                    console.log('搜索项处理错误:', e);
                }
            });
            
            return results;
            
        } catch(error) {
            console.log('搜索解析错误:', error);
            return [];
        }
    }),
}
