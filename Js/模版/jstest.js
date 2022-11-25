
//muban.首图2.二级.content = '.stui-content__desc&&Text';
//muban.首图2.二级.title = '.stui-content__detail&&h3&&Text;.stui-content__detail&&p:eq(1)&&Text;';
muban.首图2.二级.重定向='js:let url = jsp.pd(html,".playbtn&&a&&href");log("重定向到:"+url);html = request(url)';
muban.首图2.二级.tabs='.t-ul&&li';
muban.首图2.二级.lists='.stui-content__playlist:eq(#id)&&li';

var rule = Object.assign(muban.首图2,{
title:'4K电影',
host:'https://www.4kvm.com',
url:'/fyclass/page/fypage',
searchUrl:'/xssearch?s=**',



    searchable:2,//是否启用全局搜索,
    quickSearch:0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent':'MOBILE_UA',
        // "Cookie": "searchneed=ok"
    },
    //class_parse:'.conch-nav&&ul&&li;a&&Text;a&&href;./(\\d+).html',
    //cate_exclude:'',
    class_name:'电影&电视剧&综艺&动漫&国剧&港剧&台剧&韩剧&日剧&泰剧&欧美剧',
    class_url:'movie&tvshows&variety&anime&china&hkg&taiwan&kr&jp&tailan&usa',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'body&&.hl-list-wrap;ul&&li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
    double:true, // 推荐内容是否双层定位
    一级:'.animation-2.items&&.item;h3&&Text;img&&src;.hl-pic-text&&Text;a&&href',
    二级:{"title":".hl-dc-title&&Text;.hl-col-xs-12&&em&&.hl-text-muted:eq(-2)&&Text","img":".hl-lazy&&data-original","desc":";;.hl-col-xs-12:eq(5)&&Text;.hl-col-xs-12:eq(3)&&Text;.hl-col-xs-12:eq(4)&&Text","content":".hl-content-text&&Text","tabs":".hl-plays-from a","lists":".hl-plays-list:eq(#id) li"},
    搜索:'.hl-list-wrap&&ul&&li;.hl-item-thumb&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
});
