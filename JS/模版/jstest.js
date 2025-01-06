
var rule = {
     title: 'LIBHD',
     host: 'https://cnys.tv',
     模板:'短视2',
     searchUrl: '/vodsearch/**-------------.html',
     url: '/vodshow-fyclass/page/fypage.html',
     searchable: 2,//是否启用全局搜索,
     quickSearch: 1,//是否启用快速搜索,
     filterable: 0,//是否启用分类筛选,
     headers: {
       'User-Agent': 'MOBILE_UA',
     },
     class_name:'电影&剧集&动漫&综艺',
     class_url:'1&2&4&3',
    detailUrl:'/vodplay-fyid.html',
     play_parse: true,


     limit: 6,
     推荐: '*',
     double: true, // 推荐内容是否双层定位
     一级: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
         二级:{
		"title":".slide-info-title&&Text;.slide-info:eq(3)--strong&&Text",
		"img":".detail-pic&&data-original",
		"desc":".fraction&&Text;.slide-info-remarks:eq(1)&&Text;.slide-info-remarks:eq(2)&&Text;.slide-info:eq(2)--strong&&Text;.slide-info:eq(1)--strong&&Text",
		"content":"#height_limit&&Text",
		"tabs":".anthology.wow.fadeInUp.animated&&.swiper-wrapper&&a",
		"tab_text":".swiper-slide&&Text",
		"lists":".anthology-list-box:eq(#id)&&.anthology-list-play&&li"
	},
     搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href',
    }
