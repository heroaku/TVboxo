var rule = {
    title: '毒舌电影',
    host: 'https://www.dushe9.app',
   // url: '/show/fyclass-----2-fypage.html',
	//https://www.dushe9.app/show/fyclass-----2-fypage.html
   url: '/show/fyclass-fyfilter-fypage.html',
   filter_url:'{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
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
filter:'H4sIAAAAAAAAA+2Zz08bRxTH/xefOdgGtTi3HlqpUpVLe6hURREHV4qa0kN/qFWEZLANxhBsEDFx7AIpGEyCf0CQY9bY/md2Ztf/RWf95r0ZR+3LtqGRqviC+LzvzOzs7Nt531k/isQid755FPku+VvkTsS76In9jchMZHHh+6TNvyw8/Dk5briowiJbH6XrQVhBZGkGoneTP3378MGvOnz3068+++Lzr0kV66cyndWiBtJKVRVBDYC0fN3tV1EDQM3LXZgxNaAml4syVdKaBtLSebnyDDUAGjPf8vovcEwA0k63xXUPNQAac+XcK23jmAB0D7U1008Daas7o/IZagA0Zu6p66zjmADUb2tVFC6xHwBphWP/iNYagLRmRzgN1ABQc28O/WZbaxpoLo0Td3CIcwEw2qaf2ydtDLRmBw1vfQ3XDMB6tt5uzzzbAEjLDL2XNdQAUPOXN0XV0ZqGpXuBCmksqm2x6Zg0Jg6TxuL4dFRexUXoNkSlr0PYYnRSlt3WRAsdMg+gLa8Hk2NAiJZlsKWCuCwAtJx7NVk9x+UEoGsfnJl+GmhZNi6MpoHGfPXEaBpotoPXRtNA2uO2cE5QAzBjtu0x23Y/t3s9on4a6N6390W2i/cOQNd7feXXhng9AJMuh3JjqB4GZQwyXXWY8fp7skQPh5jmnCmoDiKHb5xhatHaVSj3OtiC2Np2RHtXZPFNMUxPojb0CirVy/gwiOkqg1dwXdehjcgO0T1nO24PtzENdqr7rYZfT5lUJw6V6pW+ao+DA9BNXh4bTYOVaEbTYCWv0TRYyWs0DVaCWv0Awi6CuL5ye33rfUcOswjxaHxOx8b/WvFZE5+143ETj9vxmInH7HjUxKMUj0XH0zwiLRa9r/4kqEH0zQbRoEHUNEhMNoglEtH76o9pMP9mg/mgwbxpICtXcg9fhUD7ODGxsHJrRzgFs7DEkwvr9W5EMYdXMaNXU7KEL0ncDntpfNJmXf1WRuRw350LpnFvRvX6b8yJpjDmhDMZnHHhjARrFrjizZghrrBzhoczJ0FhovvTEMYMceaEMzVBQaPraQhjQNSWZ56RhjBGkDNfo3RfdFdwLgC3bUAoHLllA8LZhH9rPTgLwVkP1l681ShxJoMzJ9PCOS2cH3DhnH1PhTNfl6llefNy4hxnQqFO/9wpkPsywGzebKHkCh5X1JgTqSzue+dU0AFCGQimaHMnZ5UH/vMUagCkVfKyjFVFQxjj4fUK1rEMgPodPhcV2mQAUPtk8YFKK5Dgf8rMYVGtPW53AHRUcy5Fo4g7PwBtd7/vyKe40hpMOd9Qa0jlfAxhLMJfWqDb+mbAlc23l/N3+1rwbmZg+s1g+s1gan1snlqf/7n1mbst6+M5L0T/CaYzAGnVA9dxvFOqwcQ0t2bb9NZAWuZCFI5Mb8OhDBP36Z8xTNznfa/SFUe0OQHQbPMrXqWJUwUwJffvP/1zBo2zBl8mF378YVFrGmie3M8zjGHiDJosP3NvaEcFmP6cMC0j0zLyIZeRj/55GTFh+ymPUqv+H5R6AJTqu1XRxBOLBppVuajON5jqANTvbOh38tgPgK639tjbPcDrAYQpK+yv28zJij3fMudw9tdt7myf7Yhm2rySAbz3zFEpsvQnK+G0IDwhAAA=',
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
