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
    host: 'https://ptt.red',
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
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
    },
    timeout: 5000,
    class_parse: '.nav-tabs&&a;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    
    lazy: $js.toString(() => {
        try {
            // 直接从JSON-LD中提取contentUrl
            let html = request(input);
            let match = html.match(/"contentUrl":"([^"]+)"/);
            if (match && match[1]) {
                let playUrl = match[1].replace(/\\/g, '');
                console.log('从JSON-LD提取到播放地址:', playUrl);
                return {parse: 0, url: playUrl, js: ''};
            }
            
            // 如果没找到，尝试其他方式
            if (input.match(/\/\d+\/\d+\/\d+$/)) {
                return {parse: 0, url: '', js: '// 需要进一步解析播放地址'};
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
            
            // 提取影视基本信息
            VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || 
                           pdfh(html, '.breadcrumb-item:last-child&&Text');
            
            // 封面
            let pic = pdfh(html, '.row.mb-3 img&&src') || 
                     pdfh(html, '.card-img-top&&src');
            if (pic && !pic.startsWith('http')) {
                pic = urljoin('https://ptt.red', pic);
            }
            VOD.vod_pic = pic;
            
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
                             pdfh(html, 'h3:contains(剧情介绍)+p&&Text');
            
            // 演员
            let actors = [];
            let actorLinks = pdfa(html, 'h3:contains(領銜主演)+*+a, h3:contains(领衔主演)+*+a');
            actorLinks.forEach(link => {
                actors.push(pdfh(link, '&&Text'));
            });
            if (actors.length > 0) {
                VOD.vod_actor = actors.join(',');
            }
            
            // 关键部分：提取播放源和剧集
            let flags = {}; // 播放源映射 {播放源ID: 播放源名称}
            let playUrls = []; // 每个播放源的剧集列表
            
            // 1. 提取所有播放源（琪雲、蓉雲、埔雲等）
            let sourceElements = pdfa(html, '.nav-tabs a.nav-link, ul#w1 li a');
            sourceElements.forEach(source => {
                let sourceUrl = pd(source, '&&href', input);
                let sourceName = pdfh(source, '&&Text');
                
                if (sourceUrl && sourceName) {
                    // 解析播放源ID：/571317/1/94 中的 94
                    let parts = sourceUrl.split('/');
                    if (parts.length >= 4) {
                        let sourceId = parts[3];
                        flags[sourceId] = sourceName;
                    }
                }
            });
            
            // 如果没有播放源，使用默认播放源
            if (Object.keys(flags).length === 0) {
                flags['94'] = '默认'; // 默认使用琪雲
            }
            
            // 2. 提取剧集列表
            let episodeElements = pdfa(html, '.seqs a, a.seq.border');
            let episodes = [];
            episodeElements.forEach(ep => {
                let epUrl = pd(ep, '&&href', input);
                let epName = pdfh(ep, '&&Text');
                
                if (epUrl && epName) {
                    // 解析剧集号：/571317/1 中的 1
                    let parts = epUrl.split('/');
                    if (parts.length >= 3) {
                        let epNum = parts[2];
                        episodes.push({name: epName, num: epNum});
                    }
                }
            });
            
            // 如果没有剧集，可能是电影
            if (episodes.length === 0) {
                episodes.push({name: '播放', num: '1'});
            }
            
            // 3. 为每个播放源构建剧集播放列表
            let vodPlayFrom = [];
            let vodPlayUrl = [];
            
            for (let sourceId in flags) {
                let sourceName = flags[sourceId];
                let epList = [];
                
                episodes.forEach(ep => {
                    // 构建播放URL格式：/影视ID/剧集号/播放源ID
                    let playUrl = '';
                    if (input.includes('/v/')) {
                        // 从 /v/571317 提取 571317
                        let vodId = input.split('/').pop();
                        playUrl = vodId + '/' + ep.num + '/' + sourceId;
                    } else {
                        // 已经是在播放页面
                        let vodId = input.split('/')[1];
                        playUrl = vodId + '/' + ep.num + '/' + sourceId;
                    }
                    
                    epList.push(ep.name + '$' + playUrl);
                });
                
                vodPlayFrom.push(sourceName);
                vodPlayUrl.push(epList.join('#'));
            }
            
            VOD.vod_play_from = vodPlayFrom.join('$$$');
            VOD.vod_play_url = vodPlayUrl.join('$$$');
            
            return VOD;
            
        } catch(error) {
            console.log('二级解析错误:', error);
            return {
                vod_name: '播放页面',
                vod_play_from: '默认$$$',
                vod_play_url: '播放$' + input + '$$$'
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
                    let vod_name = pdfh(item, 'a:eq(-1)&&Text') || 
                                  pdfh(item, 'img&&alt');
                    let vod_pic = pd(item, 'img&&src', input);
                    let vod_remarks = pdfh(item, '.badge-success&&Text');
                    
                    if (vod_id && vod_name) {
                        // 补全URL
                        if (vod_id.startsWith('/v/')) {
                            vod_id = vod_id.substring(3); // 去掉 /v/
                        }
                        
                        if (vod_pic && !vod_pic.startsWith('http')) {
                            vod_pic = urljoin('https://ptt.red', vod_pic);
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
