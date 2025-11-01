var rule = {
    title: '爱迪影视',
    host: 'https://bcvod.com',
    //host:'https://adys123.com',  //网址发布站
    url:'/vodshow/fyclass--------fypage---.html',
	//https://bcvod.com/vodshow/dianshiju--------2---.html
    //url: '/vodshow/fyfilter.html',
    filterable: 0,//是否启用分类筛选,
    //filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
   // filter: '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',
    //filter_def: {
     //   dianying: {cateId: 'dianying'},
     //   dianshiju: {cateId: 'dianshiju'},
      //  zongyi: {cateId: 'zongyi'},
     //   duanju: {cateId: 'duanju'},
   //     dongman: {cateId: 'dongman'}
        //jilu:{cateId:'jilu'}
   // },
    // searchUrl:'/vsearch/-------------.html?wd=**&submit=',
    searchUrl: '/vsearch/**----------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    headers: {'User-Agent': 'MOBILE_UA',},
    // class_parse: '.top_nav li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse: '.nav_list li:gt(0):lt(7);a&&title;a&&href;.*/(.*?).html',
    //cate_exclude: '纪录',
    //tab_remove: ['VIP线路', 'app专用'], // VIP线路 需登录会员
	class_name:'电影&电视剧&综艺&动漫&短剧&纪录片&国产剧&日韩剧&欧美剧&港台剧&海外剧&其他剧',
    class_url:'dianying&dianshiju&zongyi&dongman&duanju&118&201&203&204&202&205&206',
    play_parse: true,
    lazy: `js:
        var url = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]).url;
        url.indexOf('http') == -1 ? input = request('https://adys.tv/player/?url=' + url, {}).match(/url":.*?['"](.*?)['"]/)[1] :input = url

    `,
    推荐: '*',
    一级:'.vodlist.vodlist_wi li;a&&title;.lazyload&&data-original;.pic_text&&Text;a&&href',
    //一级: '.vodlist.vodlist_wi li;a&&title;.lazyload&&data-background-image;.xszxj&&Text;a&&href',
    二级: {
        "title": "h1&&Text;li.data--span:eq(0)&&Text",
        // "img":".lazyload&&data-original",
        "img": ".bgi.lazyload&&data-background-image",
        // "desc":";.content_min li:eq(1)&&Text;;.content_min li:eq(2)&&Text;.content_min li:eq(3)&&Text;.data:eq(4)&&Text",
        "desc": "li.data:eq(4)&&Text;;;li.data--span:eq(3)&&Text;li.data--span:eq(2)&&Text",
        // "content":".context.clearfix&&Text",
        "content": ".full_text&&span&&Text",
        "tabs": ".play_source_tab--i&&a",
        "lists": ".content_playlist.list_scroll:eq(#id) li"
    },
    搜索: '.vodlist.clearfix li.vodlist_item;*;*;*;*',
}
