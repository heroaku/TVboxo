var rule={
    title:'子子影视',
    host:'https://www.ziziys.com',
    // homeUrl:'/',
    //url:'/list/fyclass/page/fypage.html',
    searchUrl:'/vsearch/--.html?wd=**',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    url:'/list/fyfilter/page/fypage.html',
    filterable:1,//是否启用分类筛选,
	filter_url:'{{fl.cateId}}',
	filter: {"1":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"1"},{"n":"动漫片","v":"23"},{"n":"恐怖片","v":"24"},{"n":"历史传记片","v":"25"},{"n":"战争片","v":"26"},{"n":"情色片","v":"27"},{"n":"武侠古装","v":"28"},{"n":"记录片","v":"29"},{"n":"灾难片","v":"30"},{"n":"音乐歌舞","v":"31"},{"n":"运动片","v":"32"},{"n":"科幻片","v":"33"},{"n":"动作片","v":"6"},{"n":"剧情片","v":"7"},{"n":"喜剧","v":"8"},{"n":"爱情片","v":"9"},{"n":"惊悚片","v":"10"},{"n":"奇幻片","v":"11"},{"n":"悬疑片","v":"12"}]}],"2":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"2"},{"n":"国产剧","v":"13"},{"n":"欧美剧","v":"14"},{"n":"日韩剧","v":"15"},{"n":"泰剧","v":"16"}]}],"3":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"3"},{"n":"国漫","v":"20"},{"n":"日漫","v":"21"},{"n":"欧美动漫","v":"22"}]}]},
	filter_def:{
		1:{cateId:'1'},
		2:{cateId:'2'},
		3:{cateId:'3'}
	},
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&动漫',
    class_url:'1&2&3',
    lazy:'',
    limit:6,
    double:true, // 推荐内容是否双层定位
    // 推荐:'.module-item;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.module-items:eq(0);.module-item;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    一级:'.module-item;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    二级:{
    	"title":"h1&&Text;.video-info-header&&Text",
    	"img":".lazyload&&data-src",
    	// "desc":".video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    	"desc":";;;.video-info-main .video-info-actor:eq(1)&&Text;.video-info-main .video-info-actor:eq(0)&&Text",
    	"content":".vod_content&&Text",
    	"tabs":".module-tab-item",
    	"lists":".sort-item:eq(#id) a"
	},
    搜索:'.module-items;.lazyload&&alt;.lazyload&&data-src;.tag-link&&Text;*',
}
