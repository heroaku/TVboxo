var rule = {
  title: 'SKR影院',
  host: 'https://xymv.com',
	//https://xymv.com/vodshow/dianshiju-----------.html
  url: '/vodshow/fyclass--------fypage---.html',
  //https://www.skr2.cc/vodshow/32--------2---/
  //https://www.ketv.cc/search/**----------fypage---.html
  searchUrl: '/search/**----------fypage---.html',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  //class_parse: '.top_nav.clearfix li;a&&Text;a&&href;/.*-(.*?).html',
  //class_name:'电影&电视剧&综艺&动漫&国产剧&港台剧&日本剧&海外剧&纪录片',
  //class_url:'1&2&3&4&82&32&83&88',
  class_name: '电影&电视剧&综艺&动漫&短剧&解说&体育',
  class_url: 'dianying&dianshiju&zongyi&dongman&duanju&dianyingjieshuo&tiyu',
  play_parse: true,
  lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
  limit: 6,
  推荐: '.cbox_list li;.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
  double: true,
  一级: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
    二级: $js.toString(() => {
        let html = request(input);
        let $ = cheerio.load(html);

        // 标题
        let title = $('h2.title a').text().trim();

        // 封面图
        let img = $('.play_vlist_thumb.vnow').attr('data-original') || '';

        // desc: 年份/地区/类型 + 导演 + 主演 + 更新提示
        let descParts = [];
        let yearInfo = $('.play_text').text().trim();
        if (yearInfo) {
            let parts = yearInfo.split('/');
            if (parts.length >= 3) {
                descParts.push(parts[0].trim(), parts[1].trim(), parts[2].trim());
            } else {
                descParts.push(yearInfo);
            }
        }

        $('.panel.play_content p').each(function () {
            let text = $(this).text().trim();
            if (text.includes('导演：') || text.includes('主演：')) {
                descParts.push(text.replace(/^导演：|主演：/, '').trim());
            }
        });

        // 更新提示（如“每天 21:00 更新2集”）
        let updateTip = $('.panel:contains("每天")').text().trim();
        if (updateTip) descParts.push(updateTip);

        let desc = descParts.filter(x => x).join(' ⬥ ');

        // 剧情简介
        let content = $('.play_text').text().trim();

        // 播放源（tabs）和播放列表（lists）
        let playFrom = [];
        let playUrl = [];

        // 提取所有线路名称（从 .title_nav）
        let tabLinks = $('#bofy .title_nav li a');
        let tabs = [];
        tabLinks.each(function () {
            let tabText = $(this).text().replace(/高清线路\s*/, '').trim();
            if (tabText) tabs.push(tabText);
        });

        if (tabs.length === 0) tabs = ['默认线路'];

        // 当前页面只有一份播放列表（.content_playlist）
        let currentEpisodes = [];
        $('.content_playlist li a').each(function () {
            let epTitle = $(this).text().trim();
            let epHref = $(this).attr('href');
            if (epHref && !epHref.startsWith('http')) {
                epHref = 'https://xymv.com' + epHref;
            }
            currentEpisodes.push(epTitle + '$' + epHref);
        });

        // 所有线路共享同一份剧集列表（解决“线路少一半”问题）
        for (let tab of tabs) {
            playFrom.push(tab);
            playUrl.push(currentEpisodes.join('#'));
        }

        VOD = {
            vod_name: title,
            vod_pic: img,
            vod_content: content,
            vod_remarks: desc,
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playUrl.join('$$$')
        };
    }),
  搜索: '.vodlist_item;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
}
