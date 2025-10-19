var rule = {
    title: '老网影视',
    host: 'https://www.laowang.co',
     //https://www.laowang.co/vs/fyclass--------fypage---.html
    url: '/vs/fyfilter.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 1, //是否启用分类筛选,
    filter: "H4sIAAAAAAAAA+1Z204bVxT9F0vnjTZzfJ3Jm03MT1R5iFokoiZBKjRVFUUi4WZDjKEidq04hCYGA+ViN4QEm4Gf8ZkZ/0XPXM7ZexwfilpZTdXhibWW9/ZZe/bsPRo/idHY7W+exL6f/Dl2O2a3u2xrNTYWe3Tv4STGj+89+HHS++CjEM1B7OmYz7LFvf78XsBSoFf2embdLi4HShqUSp0Vm6BkpGIX2tb8Iig6KM0Ndt4FxZCK9WzdmquAQjX4omIzlI6i0+0sh/IlIMoq/NrrFFFUHE6xcmKbByClktiudfG7vfmBmW2hpqTau9i115fQ1/HAu67o15/VW+xFB+ovcbj+QCvrD2yj2a8tBWwAhNbfrVmfTgItADKu3LLOL0WcD6T9yzX2ygy0AMiqvX8JWgCE5qy2QQuAjKvuWPVDEecDec43+xAXAHnOy4+gBQDO0sJnaYXiSi3W2RVxPpBxC2VeKVbYF6ESSyc7V3b5yC7WhBmJoQ+2rdUrHia+QmK4Xme9bkXIPgg1w/lpr2uiZhB4oBkk/dfNENfiyYDz/kV8AvgE5uPAxzFPgaeY14DXEE8NyVMD8zrwOuYzwGcwnwY+jfkU8CnMg1+K/VLwS7FfCn4p9kvBL8V+Kfil2K8GfjXsVwO/GvargV8N+9XAr4b9auBXw3418KuFZ4tzcuTszUE7SRxuJ6BvMFtemfzjooN9gO510AIg58cfDdACgO510AKAZgRoAUBzB2k+QDMCndMH6C5kx/NwF7oAl81a+4V1ylA2icNlAxoXyKqe9aunATt7nyeQi6DTsVqbgTJ1f3YGCneywApiYM98O/3DpHueu2Ox+EgWdRxfzV6nyXel2HdwX/DFwFcAkpL4mrgTGSToRuuw6S4HkKCBrQ8fWaMCUgLuKbtzwMyXsCLdMTLiFbm0yD8uWsAHN1k9f3d9Xrfqrl+t6nV27WqttPj2Ya9/E6ESR6soWkXRKlKuoqrJSlW0jST+p8vqv7N0EiNZOgl83fjSsbsXTlFM63gG15BXNaxCq/r7Jawa/+ay8NekuOQ+CFuBdnBB2IjQfBCN32j8RuP3/z5+kyMZv0l83dxnfu+dlWiXz57tQ+pnj/chNT3y8esdGBrNBTd5rh46YqOn32j8RuM3Gr/K8ZsazeNvCj3/lkuOeWgXTHgXksa/Trzvv92wnq3aBfFjQhq9sCk3nHeLvW6td7ktVJTZHUfv7P0r52xFqHDjOQsb1umW9fzQrmwIFdrXXmvx2P68yT49F+rAaPd+UkEzUeCBmShpZTFuPZ7+bmZq+qdbqcRX8Pf11OzDBwNOhwaQfIroEySbJHmdZBNETylSNEq97rIyBY/X75B8kuRyRM8oUlx0nDn1KXLjJJd1T6FrylOECj6YIk30OMmOk3yGGGli0OEp7M06O95WpOCRSWKMe47yJKspUuxsOe0DZYpsihh510iOkmxWkQL31ZAUBslNeCm4KUUKp7bOO1uRQieGQQzNKwolem54iv7ckvP2SJHC8C5E2usLXtc7ihTLJXvzjTpFxusLv64TCiPrL9jxa7URfgpxRYzBU3whjxlf4PR9+ifVeZVYmx4AAA==",
    filter_url: "{{fl.类型}}-{{fl.地区}}-{{fl.排序}}--{{fl.语言}}----fypage---{{fl.年份}}",
    filter_def: {
        1: {类型: 1},
        2: {类型: 2},
        3: {类型: 3},
        4: {类型: 4},
        53: {类型: 53}
    },
class_parse: '.nav&&ul&&li;a&&Text;a&&href;.*/(.*?).html',
play_parse: true,
lazy: '',
limit: 6, 
推荐: '.module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
double: true, // 推荐内容是否双层定位
一级: '.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href', 
二级: {
    "title": "h1&&Text;.video-info-item:eq(1)&&Text",
    "img": ".module-item-pic&&img&&data-src",
    "desc": ".video-info-items:eq(0)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(2)&&Text;.video-info-items:eq(3)&&Text",
    "content": "Text",
    "tabs": ".module-tab-item",
    "lists": ".module-list:eq(#id)&&.scroll-content&&a"
}, 搜索: '.module-items&&.module-search-item;a&&title;img&&data-src;.video-info&&a&&Text;a&&href',
}
