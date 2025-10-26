var rule = {
    title:'老地影视',
    host:'https://www.laodifang.cc',
     //https://www.laodifang.cc/vodshow/fyclass--------fypage---.html
    //https://www.laodifang.cc/vodsearch/**----------fypage---.html
    url: '/vodshow/fyfilter.html',
    //url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:1,//是否启用分类筛选,
   //filter: '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',
   filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
    filter_def: {
        "1": {"类型": "1"},
        "2": {"类型": "2"},
        "3": {"类型": "3"},
        "4": {"类型": "4"},
        "5": {"类型": "5"}
    },
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    class_parse:'.top_nav&&ul li:gt(0):lt(25);a&&Text;a&&href;.*/(.*?).html',
    //class_name:'电影&电视剧&综艺&动漫&短剧&纪录片',
    //class_url:'1&2&3&4&20&5',
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
