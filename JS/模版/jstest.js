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
            let html = request(input);
            
            // 1. 直接从JSON-LD中提取contentUrl
            let match = html.match(/"contentUrl":"([^"]+)"/);
            if (match && match[1]) {
                let playUrl = match[1].replace(/\\/g, '');
                console.log('从JSON-LD提取到播放地址:', playUrl);
                return {parse: 0, url: playUrl, js: ''};
            }
            
            // 2. 如果没有JSON-LD，检查是否是剧集选择页面
            if (input.includes('/v/')) {
                return {parse: 0, url: '', js: '// 请选择具体剧集'};
            }
            
            // 3. 如果是剧集播放页面但没有找到地址
            if (input.match(/\/\d+\/\d+\/\d+$/)) {
                console.log('剧集播放页面，但未找到播放地址:', input);
                return {parse: 0, url: input, js: 'setTimeout(() => location.reload(), 1000)'};
            }
            
            return {parse: 0, url: input, js: ''};
            
        } catch(error) {
            console.log('lazy解析错误:', error);
            return {parse: 0, url: input, js: ''};
        }
    }),
    
    double: false,
    推荐: '*',
    
    // 一级解析：提取影视列表
    一级: '.embed-responsive:has(a[href*="/v/"]);a:eq(-1)&&Text;img&&src;.badge-success&&Text;a[href*="/v/"]&&href',
    
    二级: $js.toString(() => {
        try {
            let VOD = {};
            let html = request(input);
            
            // 提取影片ID
            let vodId = '';
            if (input.includes('/v/')) {
                vodId = input.split('/v/')[1];
            } else if (input.includes('/')) {
                let parts = input.split('/');
                vodId = parts[parts.length - 1];
            }
            
            // 提取标题
            VOD.vod_name = pdfh(html, 'h3.py-1&&Text') || 
                          pdfh(html, '.breadcrumb-item:last-child&&Text') ||
                          pdfh(html, 'title&&Text');
            
            // 提取封面
            let pic = pdfh(html, '.row.mb-3 img&&src') || 
                     pdfh(html, '.card-img-top&&src') ||
                     pdfh(html, 'img.img-fluid&&src');
            if (pic && !pic.startsWith('http')) {
                pic = 'https://ptt.red' + pic;
            }
            VOD.vod_pic = pic;
            
            // 提取基本信息
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
            
            // 提取剧情介绍
            VOD.vod_content = pdfh(html, 'h3:contains(劇情介紹)+p&&Text') || 
                             pdfh(html, 'h3:contains(剧情介绍)+p&&Text') ||
                             '';
            
            // 提取演员
            let actors = [];
            let actorElements = pdfa(html, 'h3:contains(領銜主演)+*+a, h3:contains(领衔主演)+*+a');
            actorElements.forEach(actor => {
                actors.push(pdfh(actor, '&&Text'));
            });
            if (actors.length > 0) {
                VOD.vod_actor = actors.join(',');
            }
            
            // ====== 关键部分：播放源和剧集解析 ======
            
            // 1. 提取播放源（琪雲、蓉雲、埔雲等）
            let sources = {};
            
            // 方式1：从导航标签提取
            let navSources = pdfa(html, '.nav-tabs .nav-link');
            navSources.forEach(source => {
                let href = pd(source, '&&href', input);
                let name = pdfh(source, '&&Text');
                if (href && name) {
                    let parts = href.split('/');
                    if (parts.length >= 4) {
                        let sourceId = parts[3];
                        sources[sourceId] = name;
                    }
                }
            });
            
            // 方式2：从ul#w1提取（备选方案）
            if (Object.keys(sources).length === 0) {
                let ulSources = pdfa(html, 'ul#w1 li a');
                ulSources.forEach(source => {
                    let href = pd(source, '&&href', input);
                    let name = pdfh(source, '&&Text') || pdfh(source, '&&title');
                    if (href && name) {
                        let parts = href.split('/');
                        if (parts.length >= 4) {
                            let sourceId = parts[3];
                            sources[sourceId] = name;
                        }
                    }
                });
            }
            
            // 如果没有找到播放源，设置默认
            if (Object.keys(sources).length === 0) {
                sources = {
                    '94': '琪雲',
                    '49': '蓉雲',
                    '57': '埔雲'
                };
            }
            
            // 2. 提取剧集列表
            let episodes = [];
            
            // 方式1：从.seqs提取
            let seqElements = pdfa(html, '.seqs a, a.seq.border, a.seq');
            seqElements.forEach(seq => {
                let href = pd(seq, '&&href', input);
                let name = pdfh(seq, '&&Text');
                if (href && name) {
                    let parts = href.split('/');
                    if (parts.length >= 3) {
                        let epNum = parts[2];
                        episodes.push({num: epNum, name: name});
                    }
                }
            });
            
            // 方式2：如果没有剧集，可能是电影
            if (episodes.length === 0) {
                episodes.push({num: '1', name: '播放'});
            }
            
            // 3. 构建播放列表
            let playFrom = [];
            let playUrl = [];
            
            for (let sourceId in sources) {
                let sourceName = sources[sourceId];
                let episodeList = [];
                
                episodes.forEach(ep => {
                    // 构建播放URL：vodId/epNum/sourceId
                    let playItem = ep.name + '$' + vodId + '/' + ep.num + '/' + sourceId;
                    episodeList.push(playItem);
                });
                
                playFrom.push(sourceName);
                playUrl.push(episodeList.join('#'));
            }
            
            VOD.vod_play_from = playFrom.join('$$$');
            VOD.vod_play_url = playUrl.join('$$$');
            
            console.log('解析结果:', {
                vodId: vodId,
                sources: sources,
                episodes: episodes,
                playFrom: VOD.vod_play_from,
                playUrl: VOD.vod_play_url
            });
            
            return VOD;
            
        } catch(error) {
            console.log('二级解析错误:', error);
            console.log('错误详情:', error.message);
            console.log('输入URL:', input);
            
            // 返回最小化的播放信息
            return {
                vod_name: '播放页面',
                vod_play_from: '默认$$$',
                vod_play_url: '播放$' + (input.includes('/v/') ? input.split('/v/')[1] + '/1/94' : input) + '$$$'
            };
        }
    }),
    
    搜索: $js.toString(() => {
        try {
            let html = request(input);
            let results = [];
            
            // 提取搜索结果
            let items = pdfa(html, '.card .embed-responsive:has(a[href*="/v/"])');
            
            items.forEach(item => {
                try {
                    let link = pdfa(item, 'a[href*="/v/"]')[0];
                    if (!link) return;
                    
                    let vod_id = pd(link, '&&href', input);
                    let vod_name = pdfh(item, 'img&&alt') || pdfh(link, '&&Text');
                    let vod_pic = pd(item, 'img&&src', input);
                    let vod_remarks = pdfh(item, '.badge-success&&Text');
                    
                    // 处理vod_id
                    if (vod_id && vod_id.includes('/v/')) {
                        vod_id = vod_id.split('/v/')[1];
                    }
                    
                    // 处理图片URL
                    if (vod_pic && !vod_pic.startsWith('http')) {
                        vod_pic = 'https://ptt.red' + vod_pic;
                    }
                    
                    if (vod_id && vod_name) {
                        results.push({
                            vod_id: vod_id,
                            vod_name: vod_name,
                            vod_pic: vod_pic,
                            vod_remarks: vod_remarks || ''
                        });
                    }
                } catch(e) {
                    console.log('单个搜索结果处理错误:', e);
                }
            });
            
            return results;
            
        } catch(error) {
            console.log('搜索解析错误:', error);
            return [];
        }
    }),
}
