var rule = {
    title: '金牌',
    host: 'https://zzoc.cc',
    url: '/vodshow/fyclass--------fypage---.html',
	//https://zzoc.cc/vodshow/fyclass--------fypage---.html
    searchUrl: '/vod/search/**',
    searchable: 2,
    filterable: 0,
    class_name: '电影&电视剧&综艺&动漫',
    class_url: '1&2&3&4',
    play_parse: true,
    headers: {
                'User-Agent': 'PC_UA',
            },
            //图片替换: 'https://m.cfkj86.com=>https://obs.gduamoe.com',
            lazy: '',
            limit: 6,
            推荐: '',
            double: true, // 推荐内容是否双层定位
            一级: '.movie-ul a;.title&&Text;img&&src;.bottom&&Text;a&&href',
            二级: {
                "title": "h1&&Text;.tag&&Text",
                "img": "*",
                "desc": ";;;.director:eq(1)&&Text;.director:eq(0)&&a&&Text",
                "content": ".wrapper_more_text&&Text",
                "tabs": ".swiper-wrapper li",
                "lists": ".tab-content&&.lists-box:eq(#id) a"
            },

            搜索: 'ul a;.title&&Text;img&&src;.bottom&&Text;a&&href',
}
