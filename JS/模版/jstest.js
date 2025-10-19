var rule = {
    title: '老网影视',
    host: 'https://www.laowang.co',
     //https://www.laowang.co/vs/fyclass--------fypage---.html
    url: '/vs/fyclassfyfilter.html.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    searchable: 2, //是否启用全局搜索,
    quickSearch: 0, //是否启用快速搜索,
    filterable: 1, //是否启用分类筛选,
    filter: 'H4sIAAAAAAAAA+2ZWW8aVxTHvwvPruSxszVv2fd9T5WHPPipbd5aqYos2cYQwAvYckwoeGuMcVyDwXZdAwW+zNwZ+BYdc8/5n4sUj1DjVmo0b/z+Z+527py5f2behqzQ+e/ehr4f+SV0PuRW6mp5KjQQevP6xxGTf379w08j3QvfeLKKbHbCm0eyB6HRAVIXcypeIJWAY26s4oQjFCPgmDOecsYWKUaAPhObdiPHfWpAn4U5Va1znxrQLl6Q8QgwXuyDXYvzeBo41i5uqOktihFgvMSO2+AYgTFPd6Eu8zwCxPLvZJ4EmEtxw26u8lw0oF10vpP5xO00oN3yljdzbqehn3w6E9vu4hzHNCAWTjgTv3JMA9ZeT6rIIa9dA8c6S/POhzzFCNDn4rt2vMZ9asD6miV34Q/VqPASwbgiud7+iF3UgNhsVCV3OaYBu9hKeXvAu6hBsppzluaQ1S4gNtlyf+eVECADjTm3nuuZcI80+uroSl1GKldW0zUpI3BfZbRe6GSiPAkNSPVGxjnc4VRrkGSVnWoTyeoCJt+cVdkGT1sDtmjvvcQIkMipisQI0C6dd3Lb3E4D5rnySdoRyLb/KTECmUvZnEu5p91MWdU2uJ0GtJtMeplSMa4WYawk33KTRTee4cWApYRXnamW1wxVzIwrIgd2nQuLoGfbq/t2vWFsO3M/2z40OHSKtO5PQx8WfdjUh0QfMnVLdMvUB0UfNHTrW+jeT0M/J/o5Uz8r+llTPyP6GVM/LfppU5f1WuZ6LVmvZa7XkvVa5notWa9lrteS9Xo/zY1q7xTbm2OyUeC+6jPb8K7nu0CDUS8SI0AN7q5LjAD1km6ombSEhY2KMsIajEqUGIFR3UZMg1GJxko0GPe6KoXlXj+Cnnu9mHZ2Zox7nbmfFF4g4QKUi6RchHKJlEtQLpNyGcoVUq5AuUrKVSjXSLkG5Top16HcIOUGlJuk3IRyi5RbUG6TchvKHVLuQLlLyl0o90i5B+U+KfehPCDlAZSHpDyE8oiUR1Aek/IYyhNSnkB5SspTKM9IeQblOSnPobwg5QWUl6S8hDL4DT9GurX2aiA0dGLG0scG+Jk57UXU+IEKJ3vsCUn9GFdVOlA11IiGPg3hscbVzxD6GVc/y+Nn0OzqmlgeAjF9ESfDjoIA472PiskkMOyQ5Iyg73Pyi+xRNOJdD//WhX5sxz+1Tn42x99WHW9lfG3VYtlzHmppDaaZObAhgQ35v9qQwE4EduIL7cTwSdmJzljcLYzxPazBPA4nV4zj0ANUVanVLse4qjSg3XzRSfCbAwKpi4hzyEczgdTTnl1NoZ66YJwunY88FwLEaluqtMwxDRgvu2u8c9GAdgsrzj7emWlAu8NDJ5a0a/Py7qRHQh72f/MMBudBA/qoTLTHp7m1hv/k6PeOc+/gxrS7YDyYvEeVPJiOALHtgpdajmkIDtPgMA0O0+AwDX29h+mpkzpM/Q5Mvw80brjYXuNDmAB9zm66KX4DToBYatndxgcMDXI+HP/BpJ1aas/yewIC9Lm6prKoNQ3o0+d/vJOrGR9hNGA8n08Qfu8sVNlL0z6Pp8GM5feMmAfI53rT/os/3hCg3eyKimW5nQaO2bVdVWQDQoA+swknw0aCQPJSUa008tIF4/n0L/7/zzbsGl7WaDAemsf+V//sQd/vhAMTEJiAwAQEJuBrMgGjfwPB443K+yEAAA==',
  filter_url: '-{{fl.地区}}--{{fl.类型}}-{{fl.语言}}-{{fl.字母}}---fypage---{{fl.年份}}',
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
