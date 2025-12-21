var rule = {
     title: '海兔影视',
     host: 'https://www.haituu.tv',
     //https://www.haitu.xyz
     模板:'短视2',
    //https://www.haituu.tv/index.php/vod/show/id/fyclass/page/fypage.html
     //https://www.haituu.tv/index.php/vod/search/page/2/wd/ai.html
     searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
     url: '/index.php/vod/show/id/fyclass/page/fypage.html',
     searchable: 2,//是否启用全局搜索,
     quickSearch: 1,//是否启用快速搜索,
     filterable: 0,//是否启用分类筛选,
     headers: {
       'User-Agent': 'MOBILE_UA',
     },
     class_name: '电影&电视剧&综艺&动漫&短剧&国产剧&泰国剧&日韩剧&港台剧&欧美剧&海外剧',
     class_url: '1&2&3&4&23&13&38&15&14&16&37',
    //detailUrl:'/vodplay-fyid.html',
     play_parse: true,


     limit: 6,
     推荐: '*',
     double: true, // 推荐内容是否双层定位
     一级: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
  二级: {
    title: 'h3&&Text;.hl-ma0&&Text',
    img: '.mask-0&&data-src',
    desc: '.detail-info .slide-info:eq(1)--strong&&Text;.deployment.none.cor5&&span&&Text;.deployment.none.cor5&&span:eq(2)&&Text;.detail-info .slide-info:eq(3)--strong&&Text;.detail-info .slide-info:eq(2)--strong&&Text',
    content: '#height_limit&&Text',
    tabs: '.anthology-tab a',
    lists: '.anthology-list-play:eq(#id)&&li',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
  },
     搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href',
    }
