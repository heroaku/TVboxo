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

    // 基础信息（标题、封面、简介）
    let title = $('h2.title a').text().trim();
    let img = $('.play_vlist_thumb.vnow').attr('data-original') || '';
    let content = $('.play_text').text().trim();

    // desc：年份/地区/类型 + 导演 + 主演 + 更新提示
    let descParts = [];
    let yearInfo = $('.play_text').text().trim();
    if (yearInfo) {
        let parts = yearInfo.split('/');
        if (parts.length >= 3) {
            descParts.push(parts[0].trim(), parts[1].trim(), parts[2].trim());
        }
    }
    $('.panel.play_content p').each((i, el) => {
        let text = $(el).text().trim();
        if (text.includes('导演：') || text.includes('主演：')) {
            descParts.push(text.replace(/^导演：|主演：/, '').trim());
        }
    });
    let updateTip = $('.panel:contains("每天")').text().trim();
    if (updateTip) descParts.push(updateTip);
    let desc = descParts.filter(x => x).join(' ⬥ ');

    // 提取所有线路 tab（含 href）
    let tabs = [];
    let tabUrls = [];
    $('#bofy .title_nav li a').each((i, el) => {
        let name = $(el).text().replace(/高清线路\s*/, '').trim();
        let href = $(el).attr('href');
        if (name && href) {
            // 当前线路可能是 javascript:;，需从 input 推断
            if (href === 'javascript:;' || href === '#') {
                href = input; // 当前页
            } else if (!href.startsWith('http')) {
                href = 'https://xymv.com' + href;
            }
            tabs.push(name);
            tabUrls.push(href);
        }
    });

    if (tabs.length === 0) {
        // 降级：使用当前页
        tabs = ['默认线路'];
        tabUrls = [input];
    }

    // 为每个线路单独请求，提取其播放列表
    let playFrom = [];
    let playUrl = [];

    for (let i = 0; i < tabs.length; i++) {
        let tabName = tabs[i];
        let url = tabUrls[i];

        try {
            let tabHtml = request(url);
            let $tab = cheerio.load(tabHtml);
            let episodes = [];
            $tab('.content_playlist li a').each((j, el) => {
                let epTitle = $tab(el).text().trim();
                let epLink = $tab(el).attr('href');
                if (epLink && !epLink.startsWith('http')) {
                    epLink = 'https://xymv.com' + epLink;
                }
                episodes.push(epTitle + '$' + epLink);
            });

            if (episodes.length > 0) {
                playFrom.push(tabName);
                playUrl.push(episodes.join('#'));
            }
        } catch (e) {
            // 请求失败，跳过该线路
            console.log('线路加载失败:', tabName, e.message);
        }
    }

    // 如果全部失败，至少保留当前页
    if (playFrom.length === 0) {
        let episodes = [];
        $('.content_playlist li a').each((i, el) => {
            let t = $(el).text().trim();
            let u = $(el).attr('href');
            if (u && !u.startsWith('http')) u = 'https://xymv.com' + u;
            episodes.push(t + '$' + u);
        });
        playFrom = ['默认线路'];
        playUrl = [episodes.join('#')];
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
