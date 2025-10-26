var rule = {
    title:'老地影视',
    host:'https://www.laodifang.cc',
     //https://www.laodifang.cc/vodshow/fyclass--------fypage---.html
    //https://www.laodifang.cc/vodsearch/**----------fypage---.html
    url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.top_nav&&ul li:gt(0):lt(25);a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫&短剧&纪录片',
    class_url:'1&2&3&4&20&5',
    play_parse:true,
    lazy:'',
    limit:6,
        推荐: '.vodlist_item;.vodlist_thumb;*;*;*;*',
    一级: 'ul.vodlist&&li;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    二级: {
        title: 'h2&&Text;.detail_list&&ul:eq(1)&&li&&a:eq(2)&&Text',
        img: '.lazyload&&data-original',
        desc: 'content_detail&&li:eq(1)&&Text;.detail_list&&ul:eq(1)&&li&&a&&Text;.detail_list&&ul:eq(1)&&li&&a:eq(1)&&Text;.detail_list&&ul:eq(1)&&li:eq(2)&&Text;.detail_list&&ul:eq(1)&&li:eq(3)&&Text',
        content: '.content_desc&&span&&Text',
        tabs: '.play_source_tab--i&&a',
        lists: 'ul.list_scroll:eq(#id)&&li'
    },
    搜索: '*',
}
