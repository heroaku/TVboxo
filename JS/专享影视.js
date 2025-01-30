var rule={
    title: '专享影视',
    host: 'https://zxys.cc',
    url: '/show/id/fyclass/page/fypage.html',
    searchUrl: '/search/page/fypage/wd/**.html',
    headers: {'User-Agent': 'UC_UA'},
    searchable: 1, quickSearch: 0, filterable: 0, double: true, play_parse: true, limit: 6,
    class_name: '电影&电视剧&动漫&短剧&综艺',
    class_url: 'dianying&dianshi&dongman&duanju&zongyi',
play_parse:true,
lazy:'',
limit:6,
    推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-list&&.module-item;.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    二级:{"title":"h1&&Text;.video-info-aux.scroll-content&&Text","img":".lazyload&&data-src","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text","content":".video-info-item.video-info-content.vod_content&&Text","tabs":".module-tab-content&&.module-tab-item.tab-item","lists":".module-blocklist.scroll-box.scroll-box-y:eq(#id)&&.scroll-content a"},
    搜索:'.module-search-item;.lazy.lazyload&&alt;img&&data-src;.video-serial&&Text;a.video-serial&&href',
}
