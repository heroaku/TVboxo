var rule={
		title:'小猫咪影视',
		host:'https://www.xdn8.com',
		url:'/index.php/vod/show/id/fyclass/page/fypage.html',
 		searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
		searchable:2,//是否启用全局搜索,
		quickSearch:0,//是否启用快速搜索,
		filterable:0,//是否启用分类筛选,
		//class_parse:'.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
	        //cate_exclude:'演员',
	        class_name:'电影&电视剧&综艺&动漫&纪录片&国产剧&港台剧&日韩剧&欧美剧',
                class_url:'1&2&35&3&34&13&16&14&15',
		play_parse:true,
		lazy:'',
		limit:6,
		推荐:'body .main;.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
		double:true, // 推荐内容是否双层定位
		一级:'.module-items .module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
		二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-1)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item&&Text;.video-info-items:eq(-2)&&.video-info-item&&Text","content":".zkjj_a&&Text","tabs":".module-tab-items-box&&.module-tab-item.tab-item","lists":".module-list:eq(#id)&&.module-play-list-content a"},
		搜索:'.module-card-item-poster;.lazy&&alt;*;.module-item-note&&Text;*',
}

var rule={
title:'兰花影院',
host:'https://www.lanhua.tv/',
url:'/vodshow/fyclass--------fypage---.html',
searchUrl:'/vodsearch/**----------fypage---.html',
searchable:2,
quickSearch:0,
filterable:0,
headers:{'User-Agent':'MOBILE_UA', },
class_name:'电影&电视剧&综艺&动漫&记录片',
class_url:'1&2&3&4&5',
play_parse:true,
lazy:'',
limit:6,
推荐:'.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
二级:{"title":"h1&&Text;.video-info-aux&&div&&a:eq(0)&&Text","img":".module-item-pic&&img&&data-src","desc":";.video-info-aux&&a:eq(1)&&Text;.video-info-aux&&a:eq(2)&&Text;.video-info-items:eq(1)&&.video-info-actor&&Text;.video-info-items:eq(0)&&.video-info-actor&&Text","content":".video-info-items:eq(7)&&.video-info-content&&Text","tabs":".module-tab-item.tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
搜索:'.module-items&&.module-search-item;h3&&Text;*;.video-serial&&Text;*',
}

var rule = {
    title:'天天视频',
    host:'http://www.ttsp.tv',
    // homeUrl:'/',
    url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist.vodlist_wi;li;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'li.vodlist_item;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    二级:{"title":"h1&&Text;.text-muted:eq(-1)&&Text","img":".content_thumb .vodlist_thumb&&data-original","desc":".text-muted:eq(-1)&&Text;.text-muted:eq(-1)&&Text;.text-muted:eq(-1)&&Text;.content_detail.content_min.fl&&ul&&li:eq(3)&&a&&Text;.content_detail.content_min.fl&&ul&&li:eq(4)&&a&&Text","content":".content&&Text","tabs":".play_source_tab:eq(0) a","lists":".play_list_box:eq(#id) .playlist_notfull&&ul li"},
    搜索:'body .searchlist_item;a&&title;.vodlist_thumb.lazyload&&data-original;.pic_text.text_right&&Text;a&&href',
}



var rule={
    title:'片库网',
    host:'http://www.piankumi.cc',
    url:'/show/fyclass--------fypage---.html',
    searchUrl:'/search/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":".myui-content__detail .title&&Text;.text-muted:eq(-1)&&Text","img":".myui-content__thumb .lazyload&&data-original","desc":".text-muted:eq(-1)&&Text;.text-muted:eq(-1)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(3)&&Text;.myui-content__detail p:eq(4)&&Text","content":".content&&Text","tabs":".nav-tabs:eq(0) li","lists":".myui-content__list:eq(#id) li"},
    搜索:'#searchList li;a&&title;.lazyload&&data-original;.myui-vodlist__thumb&&span:eq(3)&&Text;a&&href;.text-muted:eq(-1)&&Text',
}




//!!!!本站需翻墙!!!!
//已知问题:除了pluto player无法正常嗅探,其他壳都可以正常嗅探播放(js mode 0 or 1 都OK)
//其他壳播放遇到嗅探的问题时,试着把"解析"改回"🌐Ⓤ",然后就可以快乐的看片了!
//{"name":"🌐Ⓤ","type":0,"url":"","header":{"User-Agent":"Mozilla/5.0"}},

var rule = Object.assign(muban.首图,{
	title:'独播库',
	// host:'https://www.duboku.tv',
	host:'https://u.duboku.io',
	class_parse:'.nav-list li;a&&Text;a&&href;.*/(.*?).html',
	lazy:'js:let html=fetch(input, fetch_params);var player=JSON.parse(html.match(/var player_(.*?)=(.*?)</)[2]);var jsurl=player.url;input=jsurl',
	搜索:'#searchList&&li;h4&&Text;a&&data-original;.detail&&p:eq(2)&&Text;a&&href;.detail&&p:eq(3)&&Text',
	url: '/vodshow/fyclass-fyfilter',
	filter_url:'{{fl.地区}}-{{fl.排序}}-{{fl.剧情}}-----fypage---{{fl.年份}}.html',
	filter:{'13':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'14':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'16':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'15':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'2':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'地区','name':'按地区','value':[{'n':'全部','v':''},{'n':'内地','v':'内地'},{'n':'韩国','v':'韩国'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'美国','v':'美国'},{'n':'英国','v':'英国'},{'n':'巴西','v':'巴西'},{'n':'西班牙','v':'西班牙'},{'n':'泰国','v':'泰国'},{'n':'德国','v':'德国'},{'n':'法国','v':'法国'},{'n':'日本','v':'日本'},{'n':'荷兰','v':'荷兰'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'3':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'真人秀','v':'真人秀'},{'n':'选秀','v':'选秀'},{'n':'竞演','v':'竞演'},{'n':'情感','v':'情感'},{'n':'访谈','v':'访谈'},{'n':'播报','v':'播报'},{'n':'旅游','v':'旅游'},{'n':'音乐','v':'音乐'},{'n':'美食','v':'美食'},{'n':'纪实','v':'纪实'},{'n':'曲艺','v':'曲艺'},{'n':'生活','v':'生活'},{'n':'游戏互动','v':'游戏互动'}]},{'key':'地区','name':'按地区','value':[{'n':'全部','v':''},{'n':'内地','v':'内地'},{'n':'香港','v':'香港'},{'n':'台湾','v':'台湾'},{'n':'韩国','v':'韩国'},{'n':'美国','v':'美国'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'4':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'玄幻','v':'玄幻'},{'n':'武侠','v':'武侠'},{'n':'情感','v':'情感'},{'n':'科幻','v':'科幻'},{'n':'热血','v':'热血'},{'n':'推理','v':'推理'},{'n':'搞笑','v':'搞笑'},{'n':'冒险','v':'冒险'},{'n':'萝莉','v':'萝莉'},{'n':'校园','v':'校园'},{'n':'动作','v':'动作'},{'n':'机战','v':'机战'},{'n':'运动','v':'运动'},{'n':'战争','v':'战争'},{'n':'少年','v':'少年'},{'n':'少女','v':'少女'},{'n':'社会','v':'社会'},{'n':'亲子','v':'亲子'},{'n':'益智','v':'益智'},{'n':'励志','v':'励志'},{'n':'其他','v':'其他'}]},{'key':'地区','name':'按地区','value':[{'n':'全部','v':''},{'n':'国产','v':'国产'},{'n':'日本','v':'日本'},{'n':'美国','v':'美国'},{'n':'法国','v':'法国'},{'n':'其他','v':'其他'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'20':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'战争','v':'战争'},{'n':'青春','v':'青春'},{'n':'偶像','v':'偶像'},{'n':'喜剧','v':'喜剧'},{'n':'家庭','v':'家庭'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'},{'n':'乡村','v':'乡村'},{'n':'年份','v':'年份'},{'n':'警匪','v':'警匪'},{'n':'谍战','v':'谍战'},{'n':'冒险','v':'冒险'},{'n':'罪案','v':'罪案'},{'n':'宫廷','v':'宫廷'},{'n':'BL','v':'BL'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}],'21':[{'key':'剧情','name':'按剧情','value':[{'n':'全部','v':''},{'n':'悬疑','v':'悬疑'},{'n':'武侠','v':'武侠'},{'n':'科幻','v':'科幻'},{'n':'都市','v':'都市'},{'n':'爱情','v':'爱情'},{'n':'古装','v':'古装'},{'n':'喜剧','v':'喜剧'},{'n':'犯罪','v':'犯罪'},{'n':'奇幻','v':'奇幻'},{'n':'剧情','v':'剧情'}]},{'key':'年份','name':'按年份','value':[{'n':'全部','v':''},{'n':'2022','v':'2022'},{'n':'2021','v':'2021'},{'n':'2020','v':'2020'},{'n':'2019','v':'2019'},{'n':'2018','v':'2018'},{'n':'2017','v':'2017'}]},{'key':'排序','name':'按排序','value':[{'n':'排序','v':''},{'n':'时间','v':'time'},{'n':'人气','v':'hits'},{'n':'评分','v':'score'}]}]},
});



var rule = {
    title:'看片狂人',
    host:'https://www.kpkuang.de',
    // homeUrl:'/',
    url:'/vodshow/fyclass--------fypage-----.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&国产剧&港剧&日剧&欧美剧&台剧&泰剧&越南剧&韩剧&海外剧',
    class_url:'1&2&3&4&13&14&15&16&20&21&22&23&30',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.uk-switcher.uk-margin;.fed-week-boxs li;.fed-list-pics&&title;.fed-list-pics&&data-original;.fed-list-remarks&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.fed-list-info&&.fed-list-item;a&&title;.fed-list-pics&&data-original;.fed-list-remarks&&Text;a&&href',
    二级:{"title":"h1&&Text;.uk-list&&li:eq(3)&&Text","img":".cover-shadow-xs&&data-original","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-4)&&Text;.module-info-content&&.module-info-item:eq(-3)&&Text;.uk-list&&li:eq(0)&&Text;.uk-list&&li:eq(1)&&Text","content":".fed-col-xs12.fed-show-md-block&&Text","tabs":"ul.yunlist&&li a","lists":".fed-play-item.fed-drop-item:eq(#id) ul.fed-part-rows:eq(1) li"},
    搜索:'.fed-back-whits.uk-margin&&.uk-text-center;a&&title;.fed-list-pics&&data-original;.uk-overlay&&Text;a&&href',
}



var rule = {
    title:'云雀视频',
    host:'https://v.yunque.vip',
    // homeUrl:'/',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'20&21&22&23',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    二级:{"title":"h1&&Text;.module-info-tag&&Text","img":".lazyload&&data-original","desc":".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&.module-info-item-content&&Text;.module-info-item:eq(2)&&.module-info-item-content&&Text;.module-info-item:eq(1)&&.module-info-item-content&&Text","content":".module-info-introduction&&Text","tabs":".module-tab-item.tab-item","lists":".module-play-list:eq(#id) a"},
    搜索:'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text', 
}
//验证码待解决







var rule = {
    title:'简单影院',
    host:'https://www.ysjd.top',
    // homeUrl:'/',
    url:'/vodtype/fyclass-fypage.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.videoul;.videoul-li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.videoul.classification-ul&&li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',
    二级:{"title":".pageHead-text&&Text;.video-info-aux&&Text","img":"img&&lay-src","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".vod-info-text&&Text","tabs":".play-zu-ul li","lists":".play-ji-ul:eq(#id) li"},
    搜索:'.videoul-li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',   
}



var rule = {
    title:'海兔影院',
    host:'https://www.haitu.tv',
    // homeUrl:'/',
    url:'/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    //class_name:'电影&电视剧&综艺&动漫&纪录片',
    //class_url:'1&2&3&4&55',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.module-items;.module-item;.module-item-cover&&.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-list&&.module-item;.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    二级:{"title":"h1.page-title&&Text;.video-info-aux&&Text","img":".lazyload&&data-src","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".video-info-item.video-info-content.vod_content&&Text","tabs":".module-tab-item.tab-item","lists":".module-blocklist.scroll-box:eq(#id) a"},
    搜索:'.module-search-item;h3&&Text;img&&data-src;.module-item-text&&Text;a&&href',   
}



var rule = {
    title:'HoHo影视',
    host:'https://www.hoho.tv',
    // homeUrl:'/',
    url:'/vod/show/fyclass/page/fypage.html',
    searchUrl:'/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'1&2&3&4&20',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-list&&.module-item;.module-item-pic&&a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    二级:{"title":"h1&&Text;.video-info-aux.scroll-content&&Text","img":".lazyload&&data-src","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".video-info-item.video-info-content.vod_content&&Text","tabs":".module-tab-content&&.module-tab-item.tab-item","lists":".module-blocklist.scroll-box.scroll-box-y:eq(0)&&.scroll-content a"},
    搜索:'.module-search-item;.lazy.lazyload&&alt;img&&data-src;.video-serial&&Text;a.video-serial&&href',
}


var rule = {
    title:'起飞影院',
    host:'http://www.qfitv.com',
    // homeUrl:'/',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'1&2&3&4&55',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.module-items;.module-poster-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.module-poster-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
    二级:{"title":"h1&&Text;.module-info-tag-link:eq(2)&&Text","img":".ls-is-cached.lazy.lazyload&&data-original","desc":".module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(-2)&&Text;.module-info-content&&.module-info-item:eq(2)&&.module-info-item-content&&Text","content":".module-info-introduction-content&&Text","tabs":".module-tab-items-box:eq(0)&&.module-tab-item","lists":".module-play-list-content:eq(0) a"},
    搜索:'.module-card-item.module-item;.module-card-item-title&&Text;img&&data-original;.module-item-note&&Text;a.play-btn-o&&href',
}


var rule={
    title:'if101',
    host:'https://www.oulevod.tv',
    // homeUrl:'/',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search.html?wd=**',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_parse:'.conch-nav&&ul&&li;a&&Text;a&&href;./(\\d+).html',
    cate_exclude:'',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'body&&.hl-list-wrap;ul&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.hl-vod-list&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    二级:{"title":".hl-dc-title&&Text;.hl-col-xs-12&&em&&.hl-text-muted:eq(0)&&Text","img":".hl-lazy&&data-original","desc":".hl-col-xs-12&&em&&.hl-text-muted:eq(-2)&&Text;.hl-col-xs-12&&em&&.hl-text-muted:eq(1)&&Text;.hl-col-xs-12&&em&&.hl-text-muted:eq(2)&&Text","content":".hl-content-text&&Text","tabs":".hl-plays-wrap","lists":".hl-plays-list:eq(#id) li"},
    搜索:'.hl-list-wrap&&ul&&li;h3&&Text;.hl-lazy&&data-original;.hl-item-title:eq(0)&&Text;a&&href',
}




var rule = {
    title:'KUBO影视',
    host:'https://123kubo.tv',
    // homeUrl:'/',
    url:'/show/fyclass/page/fypage.html',
    searchUrl:'/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    //class_parse:'.myui-panel-box&&ul&&li;a&&Text;a&&href;/v/(.*)/',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.hl-vod-list;li;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.hl-list-item;a&&title;.hl-item-thumb.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    二级:{"title":".hl-item-thumb.hl-lazy&&title;.hl-full-box&&ul li:eq(1)&&Text","img":".hl-item-thumb.hl-lazy&&data-original","desc":".hl-full-box&&ul&&li:eq(5)&&Text;.hl-full-box&&ul&&li:eq(2)&&Text;.hl-full-box&&ul&&li:eq(3)&&Text","content":".hl-col-xs-12.blurb&&Text","tabs":".hl-plays-from:eq(0) a","lists":".hl-plays-list:eq(#id) li"},
    搜索:'.hl-item-div;a&&title;.hl-item-thumb&&data-original;.hl-lc-1&&Text;a&&href;.text-muted:eq(-1)&&Text',
}




var rule={
    title:'唐人街影视',
    host:'https://www.tangrenjie.tv',
    url:'/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.top_nav&&ul li:gt(0):lt(25);a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist.vodlist_wi;li;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'li.vodlist_item;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    二级:{"title":"h2&&Text;.content_detail.content_min.fl .data_style&&Text","img":".content_thumb .vodlist_thumb&&data-original","desc":".content_detail.content_min.fl li:eq(0)&&Text;.content_detail.content_min.fl li:eq(2)&&Text;.content_detail.content_min.fl li:eq(3)&&Text","content":".content&&Text","tabs":".play_source_tab:eq(0) a","lists":".content_playlist:eq(#id) li"},
    搜索:'body .searchlist_item;a&&title;.vodlist_thumb&&data-original;.pic_text.text_right&&Text;a&&href;.vodlist_sub&&Text',
}


var rule={
    title:'小宝影院',
    host:'https://xiaoheimi.net',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":".myui-content__detail .title&&Text;.myui-content__detail p:eq(-2)&&Text","img":".myui-content__thumb .lazyload&&data-original","desc":".myui-content__detail p:eq(0)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(2)&&Text","content":".content&&Text","tabs":".nav-tabs:eq(0) li","lists":".myui-content__list:eq(#id) li"},
    搜索:'#searchList li;a&&title;.lazyload&&data-original;.pic_text.text_right&&Text;a&&href;.text-muted:eq(-1)&&Text',
}


var rule={
    title:'小宝影视',
    host:'https://xiaobao.tv',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.top_nav&&ul li:gt(0):lt(25);a&&Text;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&记录片',
    class_url:'1&2&3&4&24',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist.vodlist_wi;li;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'li.vodlist_item;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    二级:{"title":"h2&&Text;.content_detail.content_min.fl .data_style&&Text","img":".content_thumb .vodlist_thumb&&data-original","desc":".content_detail.content_min.fl li:eq(0)&&Text;.content_detail.content_min.fl li:eq(2)&&Text;.content_detail.content_min.fl li:eq(3)&&Text","content":".content&&Text","tabs":".play_source_tab:eq(0) a","lists":".content_playlist:eq(#id) li"},
    搜索:'body .searchlist_item;a&&title;.vodlist_thumb&&data-original;.pic_text.text_right&&Text;a&&href;.vodlist_sub&&Text',
}



//未完成

var rule={
    title:'欧乐影院',
    host:'https://www.olevod.com',
    url:'/index.php/vod/show/id/fyclass/page/fypage.html',
    searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.top_nav&&ul li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级:{"title":"h2&&Text;.data_style&&Text","img":".vodlist_thumb&&data-original","desc":".content_detail.content_min li:eq(0)&&Text;.content_detail.content_min li:eq(2)&&Text;.content_detail.content_min li:eq(3)&&Text","content":".content_desc.full_text&&Text","tabs":".title_nav:eq(0) li","lists":".content__playlist:eq(#id) li"},
    搜索:'#searchList li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',
}
//需三级

var rule={
    title:'188影视',
    host:'https://188kan.com',
    // homeUrl:'/',
    url:'/vodshow/fyclass--------fypage---.html',
    searchUrl:'/vod-search-page-fypage-wd-**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav&&ul&&li;a&&title;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.module-main.tab-list.active&&.module-items.module-poster-items-base&&a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
double:true, // 推荐内容是否双层定位
一级:'.module&&a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text","content":".vod_content&&Text","tabs":".module-tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
搜索:'.module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href',
}


var rule={
    title:'追剧达人',
    host:'http://zjdr.tv',
    url:'/vodshow/id/fyclass/page/fypage.html',
    searchUrl:'/vod/search/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{
        'User-Agent':'UC_UA',
    },
    // class_parse:'.fed-pops-navbar&&ul.fed-part-rows&&a.fed-part-eone:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    //class_parse:'.myui-header__menu&&li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
    class_name:'电影&电视剧&综艺&动漫',
    class_url:'1&2&3&4',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'.module-main.tab-list&&.module-items.module-poster-items-base&&a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
   double:true, // 推荐内容是否双层定位
   一级:'.module&&a;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
   二级:{"title":"h1&&Text;.tag-link&&Text","img":".module-item-pic&&img&&data-src","desc":".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text","content":".vod_content&&Text","tabs":".module-tab-item","lists":".module-player-list:eq(#id)&&.scroll-content&&a"},
   搜索:'.module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href',
}


var rule = {
    title:'23影院',
    host:'https://www.23wm.net',
    // homeUrl:'/',
    url:'/vodshow/id/fyclass/page/fypage.html',
    searchUrl:'/vodsearch/page/fypage/wd/**.html',
    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.nav-menu-items&&li;a&&title;a&&href;/(\\d+).html',
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'1&2&3&4&20',
    play_parse:true,
    lazy:'',
    limit:6,
    //推荐:'.module-item;.module-item-cover&&.module-item-pic;a&&title;.lazyloaded&&data-src;.module-item-text&&Text;a&&href',
    推荐:'.leo-video-item;h2&&Text;img&&data-original;.leo-video-remark&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.leo-video-item;h2&&Text;img&&data-original;.leo-video-remark&&Text;a&&href',
    二级:{"title":".leo-lazy&&alt;.video-info-aux&&Text","img":"img&&data-original","desc":".video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(-2)&&Text;.video-info-items:eq(0)&&.video-info-item.video-info-actor&&Text;.video-info-items:eq(1)&&.video-info-item.video-info-actor&&Text","content":".leo-color-e.leo-fs-s.leo-ellipsis-2&&Text","tabs":".play-zu-ul li","lists":".play-ji-ul:eq(#id) li"},
    搜索:'.videoul-li;.pone.videoul-title&&Text;img&&lay-src;.pone.videoul-tips1&&Text;a&&href',   
}


