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
    class_parse: '.nav-tabs&&a;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        try {
            // 二级二层页面直接解析播放地址
            let html = request(input);
            
            // 1. 先尝试从页面中的script标签提取
            let scripts = pdfa(html, 'script&&Html');
            for (let script of scripts) {
                // 查找m3u8链接
                let m3u8Matches = script.match(/["']([^"']+\.m3u8[^"']*)["']/gi);
                if (m3u8Matches) {
                    for (let match of m3u8Matches) {
                        let url = match.replace(/["']/g, '');
                        if (url && !url.includes('sharethis')) { // 排除sharethis的脚本
                            if (!url.startsWith('http')) {
                                url = urljoin('https://pttptt.cc', url);
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
                                url = urljoin('https://pttptt.cc', url);
                            }
                            return {parse: 0, url: url, js: ''};
                        }
                    }
                }
            }
            
            // 2. 尝试从video标签提取
            let videoSrc = pdfh(html, 'video&&src') || pdfh(html, 'video source&&src');
            if (videoSrc) {
                if (!videoSrc.startsWith('http')) {
                    videoSrc = urljoin('https://pttptt.cc', videoSrc);
                }
                return {parse: 0, url: videoSrc, js: ''};
            }
            
            // 3. 如果是二级一层页面，返回空让用户选择剧集
            if (input.includes('/v/')) {
                return {parse: 0, url: '', js: '// 请选择具体剧集'};
            }
            
            return {parse: 0, url: input, js: ''};
            
        } catch(error) {
            return {parse: 0, url: input, js: ''};
        }
    }),
    double: false,
    推荐: '*',
    // 一级解析到二级一层
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
                if (actors.length > 0) {
                    VOD.vod_actor = actors.map(a => pdfh(a, '&&Text')).join(',');
                }
                
                // 提取剧集列表（二级二层链接）
                let episodes = pdfa(html, '.seqs&&a');
                let playList = [];
                
                episodes.forEach(ep => {
                    let name = pdfh(ep, '&&Text');
                    let url = pd(ep, '&&href', input);
                    // 确保是二级二层地址（/571317/1 格式）
                    if (url && !url.includes('/v/')) {
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
                    VOD.vod_name = '第' + epNum + '集';
                    
                    // 尝试获取完整标题
                    let fullTitle = pdfh(html, 'h3.py-1&&Text') || 
                                   pdfh(html, '.breadcrumb-item:nth-child(2)&&Text');
                    if (fullTitle) {
                        VOD.vod_name = fullTitle + ' 第' + epNum + '集';
                    }
                }
                
                // 设置播放源
                VOD.vod_play_from = '直接播放';
                VOD.vod_play_url = '播放$' + input;
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
    搜索: '*',
}
