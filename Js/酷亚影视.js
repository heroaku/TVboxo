var rule= {
    title:'酷亚影视',
    host:'https://kuyatv.app',
    // url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    url:'/vodshow/fyclass/page/fypage.html',
    searchable: 2,//是否启用全局搜索,
    quickSearch: 0,//是否启用快速搜索,
    filterable:1,//是否启用分类筛选,
    //class_parse: '.stui-header__menu&&li:gt(0):lt(4);a&&Text;a&&href;.*/(.*?).html',
    class_name:'国产剧&日剧&欧美剧&韩剧&泰剧&其他剧&电视剧&综艺&动漫&电影&纪录片',
    class_url:'domestic-tv-series&japanese-tv-series&western-tv-series&korean-tv-series&thai-tv-series&other-tv-series&shows&tvshows&animation&movies&documentary',
    play_parse: true,
    lazy:'js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=="1"){url=unescape(url)}else if(html.encrypt=="2"){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}',
    limit: 6,
    searchUrl:'/vodsearch/**keyword/page/fypage/',
    detailUrl:'/detail/fyid.html', //非必填,二级详情拼接链接
    推荐: '.stui-pannel:eq(2);.stui-vodlist&&li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double: true, // 推荐内容是否双层定位
    一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级: {
        "title": "h1&&Text;.data&&Text",
        "img": "img&&data-original",
        "desc": ';;;.video-info-actor:eq(1)&&Text;.video-info-actor:eq(0)&&Text',
        "content": ".stui-pannel:eq(2)&&p&&Text",
        "tabs": "h3:eq(0)",
        "lists": ".stui-content__playlist:eq(#id) li"
    },
    搜索:'.stui-vodlist__media li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
}
