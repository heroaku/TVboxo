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
            
            // 检查是否是多播放源页面（二级二层）
            if (input.match(/\/\d+\/\d+$/)) {
                // 1. 尝试从schema.org数据提取
                let schemaMatch = html.match(/"contentUrl":"([^"]+)"/);
                if (schemaMatch && schemaMatch[1]) {
                    let url = schemaMatch[1];
                    if (url.includes('.m3u8')) {
                        return {parse: 0, url: url, js: ''};
                    }
                }
                
                // 2. 从script标签中查找
                let scripts = pdfa(html, 'script&&Html');
                for (let script of scripts) {
                    // 查找m3u8链接
                    let m3u8Matches = script.match(/["']([^"']+\.m3u8[^"']*)["']/gi);
                    if (m3u8Matches) {
                        for (let match of m3u8Matches) {
                            let url = match.replace(/["']/g, '');
                            if (url && !url.includes('sharethis')) {
                                if (!url.startsWith('http')) {
                                    url = url.startsWith('//') ? 'https:' + url : urljoin('https://pttptt.cc', url);
                                }
                                return {parse: 0, url: url, js: ''};
                            }
                        }
                    }
                    
                    // 查找mp4链接
                    let mp4Matches = script.match(/["']([^"']+\.mp4[^"']*)["']/gi);
                    if (mp4Matches) {
                        for (let match of mp4Matches) {
                            let url = match.replace(/["']/g, '');
                            if (url) {
                                if (!url.startsWith('http')) {
                                    url = url.startsWith('//') ? 'https:' + url : urljoin('https://pttptt.cc', url);
                                }
                                return {parse: 0, url: url, js: ''};
                            }
                        }
                    }
                }
                
                // 3. 尝试从video标签提取
                let videoSrc = pdfh(html, 'video&&src') || pdfh(html, 'video source&&src');
                if (videoSrc) {
                    if (!videoSrc.startsWith('http')) {
                        videoSrc = urljoin('https://pttptt.cc', videoSrc);
                    }
                    return {parse: 0, url: videoSrc, js: ''};
                }
                
                // 4. 检查是否有多个播放源
                let sources = pdfa(html, '.nav-tabs a.nav-link');
                if (sources.length > 0) {
                    return {parse: 0, url: '', js: '// 请选择播放源'};
                }
            }
            
            // 5. 如果是二级一层页面，返回空让用户选择剧集
            if (input.includes('/v/')) {
                return {parse: 0, url: '', js: '// 请选择具体剧集'};
            }
            
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
            
            // 判断是二级一层还是二级二层
            let isSecondLayer = input.includes('/v/');
            
            if (isSecondLayer) {
                // 二级一层：显示剧集介绍和列表
                
                // 标题
                VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || pdfh(html, '.breadcrumb-item:last-child&&Text');
                
                // 封面
                VOD.vod_pic = pd(html, '.row.mb-3 img&&src', input);
                if (VOD.vod_pic && !VOD.vod_pic.startsWith('http')) {
                    VOD.vod_pic = urljoin('https://pttptt.cc', VOD.vod_pic);
                }
                
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
                
                // 剧情介绍
                let content = pdfh(html, 'h3:contains(劇情介紹)+p&&Text') || 
                              pdfh(html, 'h3:contains(剧情介绍)+p&&Text');
                VOD.vod_content = content;
                
                // 演员
                let actors = pdfa(html, 'h3:contains(領銜主演)+*+a');
                if (actors.length === 0) {
                    actors = pdfa(html, 'h3:contains(领衔主演)+*+a');
                }
                if (actors.length > 0) {
                    VOD.vod_actor = actors.map(a => pdfh(a, '&&Text')).join(',');
                }
                
                // 提取剧集列表（二级二层链接）
                let episodes = pdfa(html, '.seqs a, .seq.border');
                let playList = [];
                
                episodes.forEach(ep => {
                    let name = pdfh(ep, '&&Text');
                    let url = pd(ep, '&&href', input);
                    
                    // 确保是二级二层地址（/571317/1 格式）
                    if (url && !url.includes('/v/') && !url.includes('javascript')) {
                        if (!url.startsWith('http')) {
                            url = urljoin('https://pttptt.cc', url);
                        }
                        playList.push(name + '$' + url);
                    }
                });
                
                // 如果没有找到.seqs链接，尝试其他选择器
                if (playList.length === 0) {
                    let altEpisodes = pdfa(html, 'a[href*="/"][href*="/"][href$="/1"]');
                    altEpisodes.forEach(ep => {
                        let url = pd(ep, '&&href', input);
                        if (url && !url.includes('/v/')) {
                            let match = url.match(/\/(\d+)\/\d+$/);
                            if (match) {
                                let epNum = url.split('/').pop();
                                if (!url.startsWith('http')) {
                                    url = urljoin('https://pttptt.cc', url);
                                }
                                playList.push('第' + epNum + '集$' + url);
                            }
                        }
                    });
                }
                
                // 设置播放源
                if (playList.length > 0) {
                    VOD.vod_play_from = '剧集列表';
                    VOD.vod_play_url = playList.join('#');
                } else {
                    // 如果没有剧集列表，可能是电影，直接使用当前页面
                    VOD.vod_play_from = '直接播放';
                    VOD.vod_play_url = '播放$' + input;
                }
                
            } else {
                // 二级二层：具体剧集播放页面
                
                // 从页面中提取剧集信息
                let titleMatch = input.match(/\/(\d+)\/(\d+)$/);
                if (titleMatch) {
                    let vid = titleMatch[1];
                    let epNum = titleMatch[2];
                    
                    // 尝试获取完整标题
                    let breadcrumbItems = pdfa(html, '.breadcrumb-item');
                    if (breadcrumbItems.length > 0) {
                        let mainTitle = pdfh(breadcrumbItems[breadcrumbItems.length-2], '&&Text');
                        if (mainTitle) {
                            VOD.vod_name = mainTitle + ' 第' + epNum + '集';
                        } else {
                            VOD.vod_name = '第' + epNum + '集';
                        }
                    } else {
                        VOD.vod_name = '第' + epNum + '集';
                    }
                }
                
                // 检查是否有多个播放源
                let sources = pdfa(html, '.nav-tabs a.nav-link');
                if (sources.length > 0) {
                    // 有多个播放源，提取播放源列表
                    let sourceList = [];
                    sources.forEach(source => {
                        let sourceName = pdfh(source, '&&Text');
                        let sourceUrl = pd(source, '&&href', input);
                        if (sourceName && sourceUrl) {
                            sourceList.push(sourceName + '$' + sourceUrl);
                        }
                    });
                    
                    if (sourceList.length > 0) {
                        VOD.vod_play_from = sourceList.map(s => s.split('$')[0]).join('#');
                        VOD.vod_play_url = sourceList.join('#');
                    } else {
                        VOD.vod_play_from = '默认';
                        VOD.vod_play_url = '播放$' + input;
                    }
                } else {
                    // 单播放源
                    VOD.vod_play_from = '播放';
                    VOD.vod_play_url = '播放$' + input;
                }
                
                // 尝试获取封面
                let pic = pd(html, '.lazyimage&&src', input) || pd(html, 'img.card-img-top&&src', input);
                if (pic) {
                    if (!pic.startsWith('http')) {
                        pic = urljoin('https://pttptt.cc', pic);
                    }
                    VOD.vod_pic = pic;
                }
                
                // 尝试获取剧情简介
                let desc = pdfh(html, 'meta[name="description"]&&content') || 
                          pdfh(html, 'meta[property="og:description"]&&content');
                if (desc) {
                    VOD.vod_content = desc;
                }
            }
            
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
    
    搜索: $js.toString(() => {
        try {
            let html = request(input);
            let d = [];
            let list = pdfa(html, '#videos .card');
            
            list.forEach(item => {
                try {
                    d.push({
                        vod_id: pd(item, 'a&&href', input),
                        vod_name: pdfh(item, 'a:eq(-1)&&Text'),
                        vod_pic: pd(item, 'img&&src', input),
                        vod_remarks: pdfh(item, '.badge-success&&Text')
                    });
                } catch(e) {
                    console.log('搜索项解析错误:', e);
                }
            });
            
            return d;
        } catch(error) {
            console.log('搜索解析错误:', error);
            return [];
        }
    }),
}
