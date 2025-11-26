var rule = {
    title: '好看影视',
    host: 'https://www.dushe9.app',
    //host: 'https://www.kkys01.com',    
    //url: '/show/fyclass-----3-fypage.html',
    url: '/show/fyclass-fyfilter-fypage.html',    
    filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
    searchUrl: '/search?k=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
   // class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    //cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    class_name: '电视剧&电影&动漫&综艺&短剧',
    class_url: '2&1&3&4&6',
    //tab_exclude: '可可影视提供',
    tab_order: ['超清', '蓝光9', '极速蓝光'],
    tab_remove: ['4K(高峰不卡)', 'FF线路'],
    /*
    tab_rename: {
        '超清': '🌺风言锋语88🌺超清',
        '蓝光9)': '🌺风言锋语88🌺蓝光9'
    },
    */
    play_parse: true,
    lazy: $js.toString(() => {
        input = {
            parse: 1,
            url: input,
            js: 'document.querySelector("#my-video video").click()',
        }
    }),
    limit: 20,
    推荐: '.section-box:eq(2)&&.module-box-inner&&.module-item;*;*;*;*',
    double: false,
    一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:last-of-type&&data-original;.v-item-bottom&&span&&Text;a&&href',
    二级: {
        title: '.detail-pic&&img&&alt;.detail-tags&&a:eq(2)&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags&&a&&Text;.detail-tags&&a:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text',
        content: '.detail-desc&&Text',
        tabs: '.source-item-label',
        //tabs: 'body&&.source-item-label[id]',
        lists: '.episode-list:eq(#id) a',
    },
    搜索: '.search-result-list&&a;.title:eq(1)&&Text;*;.search-result-item-header&&Text;a&&href;.desc&&Text',
    预处理: $js.toString(() => {
        let html = request(rule.host);
        let scripts = pdfa(html, 'script');
        let img_script = scripts.find(it => pdfh(it, 'script&&src').includes('rdul.js'));
        if (img_script) {
            let img_url = img_script.match(/src="(.*?)"/)[1];
            //console.log(img_url);
            let img_html = request(img_url);
            let img_host = img_html.match(/'(.*?)'/)[1];
            log(img_host);
            rule.图片替换 = rule.host + '=>' + img_host;
        }
    }),
    filter: 'H4sIAAAAAAAAA+2Zz08bRxTH/5c9c7ANbXFuPbRSpSqX9lCpiiIOrhQ1JYf+UKsIyWAbjCHYIMfEsQOkYDAJ/gFBjllj+5/ZmV3/F931m/dmnLYvm4bm0PqC+LzvzOx49u287+w+tKLWrW8fWt8nfrNuWe55T+xtWDPW4sIPCZN/Wbj/c2LccNEPi0x9lKoHYR+spRmI3k789N39e7+q8O3Pvv78yy++IVWsn8hURokKSCtV/QhqAKTl6k6/ihoAam72XI+pADW5XJDJktIUkJbKyZWnqAHQmLmW23+BYwKQdrItrnqoAdCYK2duaRvHBKDfUFvT/RSQtrozKp+iBkBjZp849jqOCUD9tlZF/gL7AZCWP/IOaa0BSGt2hN1ADQA15/rAa7aVpoDm0jh2Bgc4FwCtbXrZPdLGQGu233DX13DNAIx76xZ7+t4GQFp66L6soQaAmre8Kaq20hQs3QlUSGNRbYtNW6cxcZg0Fkcno/IqLkK3ISp9FcIWo+Oy7LYmWqiQvgFteTWYHANCtCyDLT+IywJAy7lbk9UzXE4Auvb+qe6ngJZl41xrCmjMV4+1poBmO3itNQWkPWoL+xg1AD1m2xyzbfZzulcj6qeAfvv2nsh08bcD0PVeX3q1IV4PQKfLgdwY+jeDMgaZrjpMu/1dWaKbQ0xzTuf9DiKLT5xmatEq+ih3O9iC2Nh2RLsoMvikaKY7URu6eT/Vy3gziOkqg1dwXcemjcgM0W/OdJwebmMKzFT3Wg2vntSpThwq1St9vz0ODkA/8uJIawqMRNOaAiN5tabASF6tKTAS1OgHEHYRxNWl0+sbzztymEWIRWIfqdj4XyM+p+NzZnxWx2fNeEzHY2Y8quNRMx7R8QjFo5Hx9A9Ji0bu+n/i1CDyZoNI0CCiG8QnG0Tj8chd/49uMP9mg/mgwbxuICuXchcfkUD7JD6x4HJrR9h5veDEkwvu9q5FIYtX0aNXk7KED0/MDLspzAC9rl4rLbK4H88F07gz4/f6d0yLojCmhTMfnKHhDAZrIriizpgkruBzRogzLUHBot+nIIxJ4kwLZ3aCQkfXUxDGmPhbob5HCsIYRM6UjVJ90V3BuQDctDGhsHXDxoSzD//UknDWgrMkrO14q4HizAdnWqYFNcQiTAvq/62gzn6ggpqry+SyvH45ce7ToTCFlz01cm8SmE2dLaBcIeSKHXOClYU994wKPUAoY8EUc+6k7eeB9zyJGgBplZwsY7VREMaQuL28cYwDoH4Hz0WFNh8A1D5dvOenFUjwP2XmsOCvPW6DAHS0sy9Eo4AVAYC2wWc78gmutAJd5jf8NaQyP4Yw1uEvrdFNvWPgyunby/z7vV14P5MwfccwfccwtUQmTy2R9d+0RHM3ZYlc+4XoP8Y0ByCtuu/YtntCtZmY5tZs694KSEufi/yh7q05lJHiPiEwRor7TOBWuuKQNi0Amm1uxa00caoAuhT//ScEzrhxluGrxMKPDxaVpoDmyX3mYYwUZ9xk+alzTTstwPSzxLS8TMvLtLz8ubx8/O7lRYfNuz9Krnq/U0oC0CNQrIomnnAU0KzKBf88hI8AAPU7HXqdHPYDoOutPXKL+3g9gDDlhv16zpzE2PMwc25nv55z7wIyHdFM6Uc1gA+eOX6KLP0BxXCgCpwhAAA=',

}
