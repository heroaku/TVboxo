/*
@header({
  searchable: 2,
  filterable: 0,
  quickSearch: 0,
  title: '美剧窝',
  '类型': '影视',
  lang: 'ds'
})
*/

var rule={
            title: '美剧窝',
            host: 'https://mianfeidianying.club',
            //https://mianfeidianying.club/frim/index2-2.html
            //https://mianfeidianying.club/search.php?searchword=**
            url: '/frim/indexfyclass-fypage.html',
            searchUrl: '/search.php?searchword=**',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 0,//是否启用分类筛选,
            headers: {//网站的请求头,完整支持所有的,常带ua和cookies
                'User-Agent': 'MOBILE_UA', // "Cookie": "searchneed=ok"
            },
          class_parse: '.myui-header__menu li:gt(0):lt(8);a&&Text;a&&href;/(\\d+).html',
          //cate_exclude: '明星|永久|更新',       
            play_parse: true,
            lazy: '',
            limit: 6,
            推荐: 'ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
            double: true, // 推荐内容是否双层定位
            一级: '.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
            二级: {
                "title": ".myui-content__detail .title&&Text;.myui-content__detail p:eq(-2)&&Text",
                "img": ".myui-content__thumb .lazyload&&data-original",
                "desc": ".myui-content__detail p:eq(0)&&Text;.myui-content__detail p:eq(1)&&Text;.myui-content__detail p:eq(2)&&Text",
                "content": ".content&&Text",
                "tabs": ".myui-panel__head.active.bottom-line h3",
                "lists": ".myui-content__list:eq(#id) a"
            },
            搜索: '#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&p:eq(1) p&&Text',
        }
