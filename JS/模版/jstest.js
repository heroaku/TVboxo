var rule= {
            title: '',
            host: 'https://6080z.com',
            url: '/vodshow/fyclass--------fypage---.html',
            //https://6080z.com/vodshow/2--------2---.html
            searchUrl: '/search/**----------fypage---.html',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 0,//是否启用分类筛选,
            class_parse: '.nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html',
            play_parse: true,
            lazy: '',
            limit: 6,
            推荐: '.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
            double: true, // 推荐内容是否双层定位
            一级: '.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
            二级: {
                "title": "h1&&Text;.tag-link&&Text",
                "img": ".module-item-pic&&img&&data-src",
                "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
                "content": ".vod_content&&Text",
                "tabs": ".module-tab-item",
                "lists": ".module-player-list:eq(#id)&&.scroll-content&&a"
            }
