var rule ={
    title: '短剧网',
    host: 'https://www.quickvod.cc',
    url: '/show/fyclass--------fypage---.html',
    //https://www.quickvod.cc/show/fyclass--------fypage---.html
    searchUrl: '/vodsearch/-------------.html?wd=**',
    searchable: 2,//是否启用全局搜索,
    quickSearch: 0,//是否启用快速搜索,
    filterable:0,//是否启用分类筛选,
    headers:{//网站的请求头,完整支持所有的,常带ua和cookies
		'User-Agent':'MOBILE_UA'
	},
    class_parse: '.stui-header__menu li;a&&Text;a&&href;.*/(.*?).html',
    play_parse: true,
    lazy: '',
    limit: 6,
    推荐: '.stui-pannel_bd;*;*;*;*;*',
    double: true, // 推荐内容是否双层定位
    一级: '.stui-pannel_bd .stui-vodlist__box;a&&title;img&&src;.pic-text&&Text;a&&href',
    二级: {
        "title": "h3&&Text;.pic-text&&Text",
        "img": "img&&src",
        "desc": "p:eq(0)&&Text;p:eq(1)&&Text;p:eq(2)&&Text;p:eq(3)&&Text;p:eq(4)&&Text",
        "content": ".detail-content&&Text",
        "tabs": "body&&.stui-pannel__head",
        "lists": ".stui-content__playlist:eq(#id) li"
        },
        搜索: '.stui-pannel_bd .thumb;a&&title;img&&src;.pic-text&&Text;a&&href',
        }
