var rule = {
          title: '',
            host: 'https://www.moguvodw.com',
            searchUrl: '/v_search/**----------fypage---.html',
     //https://www.moguvodw.com/vodshow/2--------2---.html
            url: '/vodshow/fyclass--------fypage---.html',
            headers: {
                'User-Agent': 'MOBILE_UA'
            },
            class_parse: '.hl-nav li:gt(0):lt(6);a&&Text;a&&href;.*/(.*?).html',
            cate_exclude: '明星|专题|最新|排行',
            play_parse: true,
            lazy: '',
            推荐: '.hl-vod-list;li;a&&title;a&&data-original;.remarks&&Text;a&&href',
            double: true,
            一级: '.hl-vod-list li;a&&title;a&&data-original;.remarks&&Text;a&&href',
            二级: {
                "title": ".hl-infos-title&&Text;.hl-text-conch&&Text",
                "img": ".hl-lazy&&data-original",
                "desc": ".hl-infos-content&&.hl-text-conch&&Text",
                "content": ".hl-content-text&&Text",
                "tabs": ".hl-tabs&&a",
                "lists": ".hl-plays-list:eq(#id)&&li"
            },
            搜索: '.hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href',
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 0,//是否启用分类筛选,
        }
