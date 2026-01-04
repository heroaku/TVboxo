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
            url: '/frim/indexfyfilter-fypage.html',
            searchUrl: '/search.php?searchword=**',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
           	filterable:1,//是否启用分类筛选,
	          filter_url:'{{fl.cateId}}',
	          filter: {"1":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"1"},{"n":"动作片","v":"6"},{"n":"喜剧片","v":"7"},{"n":"爱情片","v":"8"},{"n":"科幻片","v":"9"},{"n":"恐怖片","v":"10"},{"n":"剧情片","v":"11"},{"n":"战争片","v":"12"}]}],"2":[{"key":"cateId","name":"分类","value":[{"n":"全部","v":"2"},{"n":"国产剧","v":"13"},{"n":"港台剧","v":"14"},{"n":"日韩剧","v":"15"},{"n":"欧美剧","v":"16"}]}]},
	          filter_def:{
		            1:{cateId:'1'},
		            2:{cateId:'2'},
		            3:{cateId:'3'},
		            4:{cateId:'4'}
	              },
            headers: {//网站的请求头,完整支持所有的,常带ua和cookies
                'User-Agent': 'MOBILE_UA', // "Cookie": "searchneed=ok"
            },
          //class_parse: '.myui-header__menu li:gt(0):lt(8);a&&Text;a&&href;/(\\d+).html',
          //cate_exclude: '明星|永久|更新', 
          class_name:'电影&电视剧&综艺&动漫',
          class_url:'1&2&3&4',
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
                "tabs": ".myui-panel__head:eq(0)&&.nav-tabs li",
                "lists": ".myui-content__list:eq(#id) li a"
            },
            搜索: '#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&p:eq(1) p&&Text',
        }
