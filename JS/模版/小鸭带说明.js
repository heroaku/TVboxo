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
    
    // 使用您提供的工作的一级规则
    推荐: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    
    一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    
    // 二级使用JS解析来处理复杂页面结构
    二级: $js.toString(() => {
        let html = request(input);
        let $ = cheerio.load(html);
        
        // 提取基本信息
        let title = $('.stui-content__detail .title').text().trim();
        let img = $('.stui-content__thumb .lazyload').attr('data-original') || 
                  $('.stui-content__thumb .lazyload').attr('src') || '';
        
        // 提取描述信息
        let descArray = [];
        $('.stui-content__detail p.data').each(function() {
            descArray.push($(this).text().trim());
        });
        let desc = descArray.join(' / ');
        
        // 提取剧情介绍
        let content = $('#desc .stui-content__desc').text().trim();
        
        // 提取播放线路
        let playFrom = [];
        let playUrl = [];
        
        $('.stui-pannel').each(function() {
            let panelTitle = $(this).find('.stui-pannel__head h4.title').text().trim();
            let playlist = $(this).find('.stui-content__playlist li a');
            
            // 排除非播放面板
            if (playlist.length > 0 && panelTitle && 
                panelTitle !== '劇情介紹' && panelTitle !== '猜你喜歡') {
                
                playFrom.push(panelTitle);
                
                let episodes = [];
                playlist.each(function() {
                    let epTitle = $(this).text().trim();
                    let epUrl = $(this).attr('href');
                    
                    // 确保URL完整
                    if (epUrl && !epUrl.startsWith('http')) {
                        epUrl = 'https:' + epUrl;
                    }
                    
                    episodes.push(epTitle + '$' + epUrl);
                });
                
                playUrl.push(episodes.join('#'));
            }
        });
        
        // 构建VOD对象
        VOD = {
            vod_name: title,
            vod_pic: img,
            vod_content: content,
            vod_remarks: desc,
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playUrl.join('$$$')
        };
    }),
    
    // 搜索规则与一级类似
    搜索: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
}
