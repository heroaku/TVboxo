var rule = {
    title: '毒舌电影',
    host: 'https://www.dushe9.app',
    url: '/show/fyclass-----2-fypage.html',
	//https://www.dushe9.app/show/fyclass-----2-fypage.html
    searchUrl: '/vodsearch/**----------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 0, //是否启用分类筛选,
//class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
    class_name: '电视剧&电影&动漫&综艺&短剧',
    class_url: '2&1&3&4&6',
play_parse: true,
lazy: '',
limit: 6, 
    推荐: '.module-one-row-box&&.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;*;*;*',
    double: false,
    一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:eq(1)&&data-original;.v-item-bottom&&span&&Text;a&&href',
    二级: {
        title: '.detail-title&&Text;.detail-tags&&a:eq(-2)&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags&&a&&Text;.detail-tags&&a:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text',
        content: '.detail-desc&&Text',
        tabs: '.source-swiper-slide',
        lists: '.episode-list:eq(#id) a',
    },
    搜索: '.search-result-list&&a;.title&&Text;*;.search-result-item-header&&Text;a&&href;.desc&&Text',
}
