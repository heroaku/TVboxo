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
            
            // 方法1：尝试从script标签中提取视频地址
            let scriptMatch = html.match(/<script[^>]*>[\s\S]*?(var\s+video\s*=|video\s*:\s*{)[\s\S]*?<\/script>/i);
            if (scriptMatch) {
                let scriptContent = scriptMatch[0];
                
                // 尝试提取m3u8地址
                let m3u8Match = scriptContent.match(/["']?(?:url|src|source|m3u8)["']?\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
                if (m3u8Match && m3u8Match[1]) {
                    let m3u8Url = m3u8Match[1];
                    if (!m3u8Url.startsWith('http')) {
                        m3u8Url = urljoin(input, m3u8Url);
                    }
                    return {parse: 0, url: m3u8Url, js: ''};
                }
                
                // 尝试提取mp4地址
                let mp4Match = scriptContent.match(/["']?(?:url|src|source|mp4)["']?\s*:\s*["']([^"']+\.mp4[^"']*)["']/i);
                if (mp4Match && mp4Match[1]) {
                    let mp4Url = mp4Match[1];
                    if (!mp4Url.startsWith('http')) {
                        mp4Url = urljoin(input, mp4Url);
                    }
                    return {parse: 0, url: mp4Url, js: ''};
                }
            }
            
            // 方法2：尝试从iframe中提取
            let iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
            if (iframeMatch && iframeMatch[1]) {
                let iframeUrl = iframeMatch[1];
                if (!iframeUrl.startsWith('http')) {
                    iframeUrl = urljoin(input, iframeUrl);
                }
                // 递归解析iframe
                input = iframeUrl;
                return rule.lazy;
            }
            
            // 方法3：尝试从video标签中提取
            let videoMatch = html.match(/<video[^>]*src=["']([^"']+)["'][^>]*>/i);
            if (videoMatch && videoMatch[1]) {
                let videoUrl = videoMatch[1];
                if (!videoUrl.startsWith('http')) {
                    videoUrl = urljoin(input, videoUrl);
                }
                return {parse: 0, url: videoUrl, js: ''};
            }
            
            // 方法4：尝试从source标签中提取
            let sourceMatch = html.match(/<source[^>]*src=["']([^"']+)["'][^>]*>/i);
            if (sourceMatch && sourceMatch[1]) {
                let sourceUrl = sourceMatch[1];
                if (!sourceUrl.startsWith('http')) {
                    sourceUrl = urljoin(input, sourceUrl);
                }
                return {parse: 0, url: sourceUrl, js: ''};
            }
            
            // 方法5：尝试提取通用的视频地址
            let videoUrls = html.match(/(https?:\/\/[^\s"']+\.(?:m3u8|mp4|flv|avi|mkv|mov|wmv|webm)[^\s"']*)/gi);
            if (videoUrls && videoUrls.length > 0) {
                return {parse: 0, url: videoUrls[0], js: ''};
            }
            
            // 如果没有找到视频地址，返回原始页面让播放器处理
            return {parse: 0, url: input, js: ''};
            
        } catch(error) {
            log('lazy解析错误: ' + error);
            return {parse: 0, url: input, js: ''};
        }
    }),
    double: false,
    推荐: '*',
    //α大佬方案去除推荐页广告
    一级: '#videos&&.card:not(:has(.badge-success:contains(广告)));a:eq(-1)&&Text;img&&src;.badge-success&&Text;a:eq(-1)&&href',
    二级: $js.toString(() => {
        try {
            let html = request(input);
            let VOD = {};
            
            // 影片标题
            VOD.vod_name = pdfh(html, 'h3.py-1&&Text');
            if (!VOD.vod_name) {
                VOD.vod_name = pdfh(html, 'h1&&Text') || pdfh(html, '.breadcrumb li:last-child&&Text');
            }
            
            // 封面图片
            VOD.vod_pic = pd(html, '.row.mb-3 img&&src', input);
            if (!VOD.vod_pic) {
                VOD.vod_pic = pd(html, 'img.card-img-top&&src', input);
            }
            
            // 基本信息表格提取
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
            
            // 如果没有提取到，使用备用选择器
            if (!VOD.vod_remarks) {
                VOD.vod_remarks = pdfh(html, '.imagelabel-bottom-right .badge-success&&Text');
            }
            
            // 演员列表 - 从"領銜主演"部分提取
            let actorSection = html.split('<h3 class="mt-3"><i class="fa fa-users"></i> 領銜主演</h3>')[1];
            if (actorSection) {
                actorSection = actorSection.split('<h3 class="mt-3">')[0];
                let actors = [];
                // 提取所有链接文本，过滤掉非演员内容
                let links = pdfa(actorSection, 'a');
                links.forEach(link => {
                    let text = pdfh(link, 'a&&Text');
                    // 过滤掉可能的关键字
                    if (text && !text.includes('href') && !text.includes('http') && 
                        text.length < 20 && !text.includes('搜索')) {
                        actors.push(text);
                    }
                });
                if (actors.length > 0) {
                    VOD.vod_actor = actors.join(',');
                }
            }
            
            // 剧情介绍
            let descMatch = html.match(/<h3 class="mt-3"><i class="fa fa-pie-chart"><\/i> 劇情介紹<\/h3>\s*<p>([\s\S]*?)<\/p>/);
            if (descMatch && descMatch[1]) {
                VOD.vod_content = descMatch[1].trim();
            } else {
                // 备用提取方式
                VOD.vod_content = pdfh(html, 'h3:contains(劇情介紹)+p&&Text');
            }
            
            // 提取剧集列表 - 关键部分
            VOD.vod_play_from = '默认';
            
            // 优先使用.seqs选择器提取剧集
            let episodes = pdfa(html, '.seqs&&a');
            let playList = episodes.map(ep => {
                let name = pdfh(ep, 'a&&Text');
                let url = pd(ep, 'a&&href', input);
                // 确保url是完整的
                if (url && !url.startsWith('http')) {
                    url = urljoin(input, url);
                }
                return name + '$' + url;
            });
            
            // 如果没有找到.seqs，尝试其他选择器
            if (playList.length === 0) {
                episodes = pdfa(html, '.mb-2.fullwidth&&a');
                playList = episodes.map(ep => {
                    let name = pdfh(ep, 'a&&Text');
                    let url = pd(ep, 'a&&href', input);
                    if (url && !url.startsWith('http')) {
                        url = urljoin(input, url);
                    }
                    return name + '$' + url;
                });
            }
            
            // 如果还是没有，尝试从页面中查找所有可能的分集链接
            if (playList.length === 0) {
                // 查找所有数字链接
                let allLinks = pdfa(html, 'a[href*="' + input.split('/').pop() + '/"]');
                allLinks.forEach(link => {
                    let href = pd(link, 'a&&href', input);
                    let text = pdfh(link, 'a&&Text');
                    // 过滤：链接应该是类似 /571317/1 这样的格式
                    if (href && href.match(/\/\d+\/\d+$/)) {
                        if (href && !href.startsWith('http')) {
                            href = urljoin(input, href);
                        }
                        playList.push((text || '第' + href.split('/').pop() + '集') + '$' + href);
                    }
                });
            }
            
            // 去重
            let uniqueList = [];
            let seen = new Set();
            playList.forEach(item => {
                if (item && !seen.has(item)) {
                    seen.add(item);
                    uniqueList.push(item);
                }
            });
            
            VOD.vod_play_url = uniqueList.join('#');
            
            return VOD;
            
        } catch(error) {
            log('二级解析错误: ' + error);
            // 返回最基本的VOD信息
            let html = request(input);
            return {
                vod_name: pdfh(html, 'h3&&Text') || pdfh(html, 'h1&&Text'),
                vod_play_from: '默认',
                vod_play_url: '#'
            };
        }
    }),
    搜索: '*',
}
