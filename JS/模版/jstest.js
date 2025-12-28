var rule = {
    title: '小鸭影音',
    host: 'https://777tv.ai',
    url: '/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/vod/search/page/fypage/wd/**.html',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 5000,
    class_name: '全部&电视剧&电影&动漫&综艺&短剧',
    class_url: '0&2&1&30&29&short_series',
    limit: 20,
    
    推荐: '.stui-vodlist__bd .stui-vodlist__item;.stui-vodlist__title&&Text;.stui-vodlist__thumb&&data-original;.stui-vodlist__title a&&href;.pic-text&&Text',
    
    一级: '.stui-vodlist__bd .stui-vodlist__item;.stui-vodlist__title&&Text;.stui-vodlist__thumb&&data-original;.stui-vodlist__title a&&href;.pic-text&&Text',
    
    二级: $js.toString(() => {
        VOD = {};
        let html = request(input);
        
        // 解析基础信息
        let $ = cheerio.load(html);
        
        // 标题
        let title = $('.stui-content__detail .title').text().trim();
        
        // 图片
        let img = $('.stui-content__thumb .lazyload').attr('data-original');
        
        // 描述信息
        let descs = [];
        $('.stui-content__detail p.data').each(function(i, el) {
            descs.push($(this).text().trim());
        });
        
        // 剧情介绍
        let content = $('#desc .stui-content__desc').text().trim();
        
        // 播放线路和列表
        let play_from = [];
        let play_url = [];
        
        // 遍历所有面板，提取播放线路
        $('.stui-pannel').each(function(i, panel) {
            let $panel = $(panel);
            let title = $panel.find('.stui-pannel__head h4.title').text().trim();
            let playlist = $panel.find('.stui-content__playlist li a');
            
            // 判断是否是播放线路面板（包含播放列表且不是剧情介绍和猜你喜欢）
            if (playlist.length > 0 && title && title !== '劇情介紹' && title !== '猜你喜歡') {
                play_from.push(title);
                
                let episodes = [];
                playlist.each(function(j, a) {
                    let episodeTitle = $(a).text().trim();
                    let episodeUrl = $(a).attr('href');
                    // 确保URL是完整的
                    if (episodeUrl && !episodeUrl.startsWith('http')) {
                        episodeUrl = 'https:' + episodeUrl;
                    }
                    episodes.push(episodeTitle + '$' + episodeUrl);
                });
                
                play_url.push(episodes.join('#'));
            }
        });
        
        // 构建VOD对象
        VOD = {
            vod_name: title,
            vod_pic: img,
            vod_content: content,
            vod_remarks: descs.join(' / '),
            vod_play_from: play_from.join('$$$'),
            vod_play_url: play_url.join('$$$')
        };
        
        // 调试信息（可选）
        log('标题: ' + title);
        log('线路数: ' + play_from.length);
    }),
    
    搜索: $js.toString(() => {
        let d = [];
        let html = request(input);
        let $ = cheerio.load(html);
        
        $('.stui-vodlist__item').each(function(i, item) {
            let $item = $(this);
            let title = $item.find('.stui-vodlist__title a').text().trim();
            let img = $item.find('.stui-vodlist__thumb').attr('data-original');
            let href = $item.find('.stui-vodlist__title a').attr('href');
            let remarks = $item.find('.pic-text').text().trim();
            
            d.push({
                title: title,
                img: img,
                url: href,
                desc: remarks
            });
        });
        
        setResult(d);
    }),
}
