var rule = {
    title: '萌番[漫]',
    host: 'http://www.dubokutv.cn',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl: '/search/wd/**/page/fypage/',
  //http://www.dubokutv.cn/index.php/vod/show/id/fyclass/page/fypage.html
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    class_name: '新番&番剧&剧场',
    class_url: '1&2&3',
    limit: 6,
    play_parse: true,
    lazy:"js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    double: false,
    推荐: '*',
    一级: '.hl-vod-list li;.hl-item-thumb&&title;.hl-item-thumb&&data-original;.remarks&&Text;.hl-item-thumb&&href',
    二级: {
        title: 'h2&&Text',
        desc: '.hl-full-box&&li:eq(-2)&&Text',
        content: '.blurb&&Text',
        img: '.hl-item-thumb&&data-original',
        tabs: '.hl-plays-from a',
        lists: '.hl-plays-list:eq(#id)&&li',
    },
    搜索: '*',
}

