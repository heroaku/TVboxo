var rule = {
    title: '热播之家',
    host: 'https://rebozj.pro',
    //url: '/type/fyclass-fypage.html',
    url: '/show/fyfilter.html',
    filterable: 1,//是否启用分类筛选,
    filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by or "time"}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
    filter: 'H4sIAAAAAAAAA+1Z704bRxB/l/vMhzuDDeQN+gxVPrip1UalVAJaCUVIJMbUNsQ2UWOXQPmjYuwUDAZSEmxsXsZ7Z79Fz97dmVlymV6x2yqSv/n3m9u9mdmd3d+cn1mO9ejLZ9Z3iWXrkfUkvpT44mtrwpqPf5/wsbuZ8S6aYm/Dp36Kz/2YGDw771tEqtpLVvu0DxxrZULR2WqntavoGNLFXZGpKHoaaC994SZTip5BurIlbpqKngXafV5wV4v6lTZOnqngLA764qZ/7TQymo9YK4/7FhXoXHxx0YgTZ/l0nMGvVCAwVgUC06NAYDIUgFCSWffFG2VTIDAtCsCc2XOv9YeeUwIY9+LUK27pcRKAn+uvettvtZ8SBK6OAjCu/DPaFAhcDgVg3Nm1aNT0OAnAllsX+UttkwBs+aPu77AOEmhb5/age1ZXNgXAl9pxp32gfZFA23r7V52bgrIpoG3du4K/asqmAM652U3vwZwDAOPKd7iLFIB8Pm/33rR1PiWgWzW+kIibO3W3LjYbYXfqUaW3va4zJAFEerztfjjXkUqAma27N23I7ACAx+2c2GlpjyWALFy9RpsCkIWNC7QpAONKZXf3VI+TAFfkLY5TAPxsv0ebAuhLnfpSN8a9rIvGsR4nAYxby/uZEmldAIjJenr5mpfZxiVVGCv9wN2484dBsWsMT6SuO01dtwrQdV9OxBfMdb9512m2Qq57xI5MKW7wk/CTyE9SPoJ8hPIO8g7lbeRtwjuzwDuzlJ9Bfoby08hPUz6GfIzyUeSjlMd4HRqvg/E6NF4H43VovA7G69B4HYy3f/mQlZqLz39jrFT3vNatroat0J2W/7zeBxKQikGbAlCFl0doUwAqptQSL0toRkxqipglILWINgVIfRObBKQWSSQSkN0uzpK42/uA5vCrZZLB3CvRyH+UPrd03Su9U1MsPfUfhaO+0XDrvyjLt0+XFjGB52sirY+/xSc/LCT6b308YUWGVz0RuoSdRgVvfbLP/DPVPz2JaYqmuX+YoQl3s/vne3FUJKbYKNULpzQ4ZcPdF6zSYG5+ToVwyoa7+bnbnVM2nDrjlA2n+Djl9lDVwyqwwVbE06QPwJfTin9ba18kGPb+lTtVj5Mg1P0bpC9Gp3rWU/7zsMoDECaahyoiLnu8Wvp0hli1VKz7gkL8dqiHAh6ri7G6sD5bdfGPVMJm5r8QCpPDC4XJUV7efhsrWq/1okkQpuXlLpSHtrzePuyQfbJ1OCkA2sL4vMF9GuA+Rfy7rTNziUhZpz2WwNR1uMH7gL2Cx8fyqI7lQcVODV+xmDol7bNV9/ZEv+ojCW9Yo/c2iWmN3dsKpnV6lCdFgHMGxYRoUIzDBsWEbVD3mhzjOUqFkuycLOc+tnIS+oEfd9m2ipP6a3feSVnbJAjTHgWfvuwnSqYZ4e4ArhFjz26mSWNvCaaB4z6zsk1TMy9SH/T7JIA5C3veKWRZgjDS3g/XLZYw9j4A28Gh2AGZIwH4kqx1D1e1LxJADIWcOIM6lCBMA2fW771KS6a6mUtY9wGAcfUtUb7S4yQAP0/23Cz4KQHMedl019J6TgnAlqt6BS2mFBjhvcy1uNxqcdkbt0vWuF0at0tDt0vR4cUX7iP5f5XXvO1mGspIdqUUFaZ1hubNz6RhJZUhy9+0OiMQX9G/myPEQRcdnzyfz8kDvI3x2jReG+O1abw2xmvTeG2M16bx2hivTeO1MV57ahQn4f/2p8zKXyGn+e2MIgAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        5: {cateId: '5'}
    },
    searchUrl: '/type/id-.html?wd=**',
    searchable: 2,//是否启用全局搜索,
    quickSearch: 0,//是否启用快速搜索,
    headers: {
        'User-Agent': 'UC_UA',
    },
    class_parse: '.stui-header__menu li:lt(6);a&&Text;a&&href;.*/(.*?).html',
    play_parse: true,
    tab_remove:['蓝光专享1','夸克4K','极速有广①','极速有广②'],
    lazy: '',
    limit: 6,
    推荐: 'ul.stui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href',
    double: true, // 推荐内容是否双层定位
    一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
    二级: {
        "title": ".stui-content__detail .title&&Text;.stui-content__detail p:eq(-2)&&Text",
        "img": ".stui-content__thumb .lazyload&&data-original",
        "desc": ".stui-content__detail p:eq(0)&&Text;.stui-content__detail p:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text",
        "content": ".detail&&Text",
        "tabs": ".nav.nav-tabs li",
        "lists": ".stui-content__playlist:eq(#id) li"
    },
    搜索: '*',
}
