var rule = {
    模板: '海螺3',
    title: '宝片视频',
    host: 'https://ibaopian.pro',
    searchUrl: '/vod/search/page/fypage/wd/**.html',
    url: '/vod/show/id/fyclass/page/fypage.html',
    class_name:'电视剧&电影&动漫&综艺&纪录片&短剧',
    class_url:'2&1&4&3&5&8',
    二级: {
        title: '.hl-dc-title&&Text;.hl-dc-content&&li:eq(6)&&Text',
        img: '.hl-lazy&&data-original',
        desc: '.hl-dc-content&&li:eq(10)&&Text;.hl-dc-content&&li:eq(4)&&Text;.hl-dc-content&&li:eq(5)&&Text;.hl-dc-content&&li:eq(2)&&Text;.hl-dc-content&&li:eq(3)&&Text',
        content: '.hl-content-text&&Text',
        tabs: '.hl-tabs&&a',
        lists: '.hl-plays-list:eq(#id)&&li',
    },
}


var rule={
    title: '宝片视频',
    host: 'https://ibaopian.pro',
    searchUrl: '/vod/search/page/fypage/wd/**.html',
    url: '/vod/show/id/fyclass/page/fypage.html',
    class_name:'电视剧&电影&动漫&综艺&纪录片&短剧',
    class_url:'2&1&4&3&5&8',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    //cate_exclude: '专题',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.myui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.myui-vodlist li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":".myui-content__detail .title&&Text;.t-muted:eq(-1)&&Text","img":".myui-content__thumb&&.lazyload&&data-original","desc":";;.myui-content__detail p:eq(2)&&Text;.myui-content__detail p:eq(3)&&Text;.myui-content__detail p:eq(4)&&Text","content":".content&&Text","tabs":".nav-tabs:eq(0) li","lists":".myui-content__list:eq(#id) li"},
    搜索:'.myui-vodlist__media li;a&&title;*;*;a&&href;.text-muted:eq(-1)&&Text',
}
