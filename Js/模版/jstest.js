var rule={
    title:'熊猫影视',
    host:'https://www.pandavod.com/',
    // homeUrl:'/',
    //url:'/list/fyclass/page/fypage.html',
    searchUrl:'/vodsearch/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    url:'/vodshow/fyfilter/page/fypage.html',
    filterable:1,//是否启用分类筛选,
	filter_url:'{{fl.cateId}}',
	filter: {"dianying":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"dianying"},{"n":"动作片","v":"dongzuopian"},{"n":"喜剧片","v":"xijupian"},{"n":"爱情片","v":"aiqingpian"},{"n":"战争片","v":"zhanzhengpian"},{"n":"惊悚片","v":"jingsongpian"},{"n":"犯罪片","v":"fanzuipian"},{"n":"冒险片","v":"maoxianpian"},{"n":"科幻片","v":"kehuanpian"},{"n":"恐怖片","v":"kongbupian"},{"n":"剧情片","v":"juqingpian"},{"n":"动画片","v":"donghuapian"},{"n":"悬疑片","v":"xuanyipian"},{"n":"武侠片","v":"wuxiapian"},{"n":"纪录片","v":"jilupian"},{"n":"伦理片","v":"lunlipian"},{"n":"网络电影","v":"wangluodianying"},{"n":"其他片","v":"qitapian"}]}],"lianxuju":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"lianxuju"},{"n":"国产剧","v":"guochanju"},{"n":"欧美剧","v":"oumeiju"},{"n":"台湾剧","v":"taiwanju"},{"n":"日本剧","v":"ribenju"},{"n":"韩国剧","v":"hanguoju"},{"n":"香港剧","v":"xianggangju"},{"n":"泰国剧","v":"taiguoju"},{"n":"海外剧","v":"haiwaiju"}]}],"zongyi":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"zongyi"},{"n":"大陆综艺","v":"daluzongyi"},{"n":"港台综艺","v":"gangtaizongyi"},{"n":"日韩综艺","v":"rihanzongyi"},{"n":"欧美综艺","v":"oumeizongyi"}]}],"dongman":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"dongman"},{"n":"国产动漫","v":"guochandongman"},{"n":"日韩动漫","v":"rihandongman"},{"n":"欧美动漫","v":"oumeidongman"},{"n":"港台动漫","v":"gangtaidongman"},{"n":"海外动漫","v":"haiwaidongman"}]}]},
	filter_def:{
		dianying:{cateId:'dianying'},
		lianxuju:{cateId:'lianxuju'},
		zongyi:{cateId:'zongyi'},
		dongman:{cateId:'dongman'},
		tiyu:{cateId:'tiyu'}
	},
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&体育',
    class_url:'dianying&lianxuju&zongyi&dongman&tiyu',
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
    搜索:'.module-items;.lazyload&&alt;.lazyload&&data-src;.video-serial&&Text;*',
}
