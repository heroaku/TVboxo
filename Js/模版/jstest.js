var rule = { 
    title: '23影视',
    host: 'https://222.186.150.32',
    // homeUrl:'/',
    url: '/vodshow/id/fyclass/page/fypage.html',
    searchUrl: '/vodsearch/page/fypage/wd/**.html',
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'1&2&3&4&5',
    searchable: 2,//是否启用全局搜索,
    quickSearch: 0,//是否启用快速搜索,
    filterable: 0,//是否启用分类筛选,
    headers: {//网站的请求头,完整支持所有的,常带ua和cookies
                'User-Agent': 'MOBILE_UA',
                // "Cookie": "searchneed=ok"
            },
    play_parse: true,//播放是否解析
    lazy: '',//是否免嗅探
    limit: 6,
    推荐:'ul;li.leo-video-item;a&&title;img&&data-original;.leo-video-remark&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'li.leo-video-item;a&&title;img&&data-original;.leo-video-remark&&Text;a&&href',
    二级:{"title":"h1&&Text;.t-muted:eq(-1)&&Text","img":".lazyload&&data-original","desc":";;.vod-detail-info&&ul&&li:eq(2)&&Text;.vod-detail-info&&ul&&li:eq(3)&&Text;.vod-detail-info&&ul&&li:eq(4)&&Text","content":".vod-detail-info&&ul&&li:eq(10)&&Text","tabs":".play_source_tab&&.swiper-wrapper a","lists":".play_list_box:eq(#id)&&.playlist_notfull li"},
    搜索:'li.leo-video-item;a&&title;*;*;a&&href;.text-muted:eq(-1)&&Text',
        }
