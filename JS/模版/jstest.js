
var rule = {
     title: 'CN影视',
     host: 'https://ty1010.com',
    //https://ty1010.com/index.php/vod/type/id/fyclass/page/fypage.html
     模板:'短视2',
     searchUrl: 'vodsearch/page/fypage/wd/**.html',
     url: '/index.php/vod/type/id/fyclass/page/fypage.html',
     searchable: 2,//是否启用全局搜索,
     quickSearch: 1,//是否启用快速搜索,
     filterable: 0,//是否启用分类筛选,
     headers: {
       'User-Agent': 'MOBILE_UA',
     },
     class_name:'电影&剧集&动漫&综艺',
     class_url:'1&2&4&3',
    //detailUrl:'/vodplay-fyid.html',
     play_parse: true,


     limit: 6,
     推荐: '*',
     double: true, // 推荐内容是否双层定位
     一级: '.public-list-box;.time-title&&Text;img&&data-src;.ft2&&Text;a&&href',
  二级: {
    title: 'h3&&Text;.hl-ma0&&Text',
    img: '.mask-0&&data-src',
    desc: '.detail-info .slide-info:eq(1)--strong&&Text;.deployment.none.cor5&&span&&Text;.deployment.none.cor5&&span:eq(2)&&Text;.detail-info .slide-info:eq(3)--strong&&Text;.detail-info .slide-info:eq(2)--strong&&Text',
    content: '#height_limit&&Text',
    tabs: '.swiper-slide a',
    lists: '.anthology-list-play:eq(#id)&&li',
    tab_text: 'body&&Text',
    list_text: 'body&&Text',
    list_url: 'a&&href',
  },
     搜索: '.public-list-box;.thumb-txt&&Text;.public-list-exp&&img&&data-src;.public-list-prb&&Text;a&&href',
    }
