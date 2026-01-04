var rule={
            title: '免费影视',
            host: 'https://mianfeidianying.club',
            //https://mianfeidianying.club/frim/index2-2.html
            //https://mianfeidianying.club/search.php?searchword=**
            url: '/frim/indexfyfilter-fypage.html',
            searchUrl: '/search.php?searchword=**',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
           	filterable:1,//是否启用分类筛选,
	        filter_url:'{{fl.cateId}}',
			filter: {"1": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "1"},{"n": "Netflix电影", "v": "57"},{"n": "纪录片", "v": "11"},{"n": "4k电影", "v": "58"},{"n": "动漫电影", "v": "60"},{"n": "动作片", "v": "5"},{"n": "喜剧片", "v": "10"},{"n": "爱情片", "v": "6"},{"n": "科幻片", "v": "7"},{"n": "恐怖片", "v": "8"},{"n": "剧情片", "v": "12"},{"n": "战争片", "v": "9"}]}],"2": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "2"},{"n": "Netflix剧", "v": "59"},{"n": "国产剧", "v": "13"},{"n": "港台剧", "v": "14"},{"n": "日韩剧", "v": "16"},{"n": "欧美剧", "v": "15"},{"n": "泰国剧", "v": "35"},{"n": "海外剧", "v": "27"}]}],"3": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "3"},{"n": "大陆综艺", "v": "29"},{"n": "港台综艺", "v": "28"},{"n": "日韩综艺", "v": "30"},{"n": "欧美综艺", "v": "31"}]}],"4": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "4"},{"n": "国产动漫", "v": "32"},{"n": "日韩动漫", "v": "33"},{"n": "港台动漫", "v": "41"},{"n": "欧美动漫", "v": "34"},{"n": "海外动漫", "v": "42"}]}],"46": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "46"},{"n": "短文爽剧", "v": "47"},{"n": "擦边短剧", "v": "48"},{"n": "女频恋爱", "v": "50"},{"n": "反转爽剧", "v": "51"},{"n": "古装仙侠", "v": "52"},{"n": "年代穿越", "v": "53"},{"n": "脑洞悬疑", "v": "54"},{"n": "现代都市", "v": "55"},{"n": "言情总裁", "v": "62"},{"n": "国民重生", "v": "63"}]}],"36": [{"key": "cateId","name": "分类","value": [{"n": "全部", "v": "36"},{"n": "篮球", "v": "37"},{"n": "足球", "v": "38"},{"n": "斯诺克", "v": "44"},{"n": "羽毛球", "v": "64"},{"n": "LPL", "v": "65"},{"n": "德甲", "v": "73"},{"n": "意甲", "v": "74"},{"n": "英超", "v": "75"},{"n": "西甲", "v": "76"},{"n": "法甲", "v": "77"},{"n": "NBA", "v": "78"},{"n": "CBA", "v": "79"},{"n": "WCBA", "v": "80"}]}]},          
	    filter_def:{
		            1:{cateId:'1'},
		            2:{cateId:'2'},
		            3:{cateId:'3'},
		            4:{cateId:'4'},
		            46:{cateId:'46'},
		            36:{cateId:'36'}		
	              },
            headers: {//网站的请求头,完整支持所有的,常带ua和cookies
                'User-Agent': 'MOBILE_UA', // "Cookie": "searchneed=ok"
            },
          //class_parse: '.myui-header__menu li:gt(0):lt(8);a&&Text;a&&href;/(\\d+).html',
          //cate_exclude: '明星|永久|更新', 
          class_name:'电影&电视剧&综艺&动漫&短剧&体育',
          class_url:'1&2&3&4&46&36',
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
