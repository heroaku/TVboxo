var rule = { // 模板字典
            title: 'fositv',
            host: 'https://fositv.com/',
            // homeUrl:'/',
            url: '/vod_____type/fyclass-fypage.html',
            searchUrl: '/vod_____search/**----------fypage---.html',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 0,//是否启用分类筛选,
            headers: {//网站的请求头,完整支持所有的,常带ua和cookies
                'User-Agent': 'MOBILE_UA',
                // "Cookie": "searchneed=ok"
            },
            class_parse: '.dropdown-box&&ul&&li;a&&Text;a&&href;/(\\d+).html',
//cate_exclude:'电影|电视剧',//分类过滤
            play_parse: true,//播放是否解析
            lazy: '',//是否免嗅探
            limit: 6,
            推荐:'ul.myui-vodlist;a&&title;.lazyload&&data-original;;a&&href',
            double: true, // 推荐内容是否双层定位
            一级: 'ul.myui-vodlist;a&&title;.lazyload&&data-original;;a&&href',
            二级: {"title":"h3&&a&&Text","img":".lazyload&&data-original","desc":".col-pd&&p:eq(1)&&Text","content":".data&&Text","tabs":"ul.nav-tabs&&li","lists":".myui-content__list:eq(#id) a"},
        }
