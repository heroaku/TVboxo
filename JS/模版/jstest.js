var rule = {
    author: '小可乐/240527/第一版',
    title: '爱看农民2[优]',
    host: 'https://m.emsdn.cn',
    hostJs: $js.toString(() => {
        print(HOST);
        let html = request(HOST, {headers: {"User-Agent": PC_UA}});
        let src = jsp.pdfh(html, "body&&a:eq(0)&&href") || jsp.pdfh(html, "body&&a:eq(0)&&Text");
        if (src && src.length > 5) {
            print(src);
            if (!src.startsWith('http')) {
                src = 'https://' + src
            }
            print("抓到主页:" + src);
            HOST = src
        }
    }),
    headers: {'User-Agent': 'IOS_UA'},
    编码: 'utf-8',
    timeout: 5000,

    homeUrl: '/',
    url: '/vod-list-id-fyfilter.html',
    filter_url: '{{fl.cateId}}-pg-fypage-order--by-{{fl.by or "time"}}-class-0-year-{{fl.year}}-letter-{{fl.letter}}-area-{{fl.area}}-lang-',
    searchUrl: '/index.php?m=vod-search&wd=**',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集&综艺&动漫&短剧',
    class_url: '1&2&3&4&26',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        26: {cateId: '26'}
    },
    play_parse: true,
    lazy: $js.toString(() => {
        let init_js = `Object.defineProperties(navigator, {platform: {get: () => 'iPhone'}});`;
        input = {
            parse: 1,
            url: input,
            js: `try{location.href = document.querySelectorAll("iframe")[1].src;}catch(err) {}document.querySelector(".line").click()`,
            parse_extra: '&init_script=' + encodeURIComponent(base64Encode(init_js)),
        }
    }),

    limit: 12,
    double: false,
    推荐: '*',
    一级: '.picTxt li;.sTit&&Text;img&&data-src;.emHot&&Text;a&&href',
    二级: {
        "title": "td--.sDes&&Text;.type-title&&Text",
        "img": ".posterPic&&img&&src",
        "desc": ".sDes:eq(0)&&Text;.detail-con&&em:eq(0)&&Text;;.sDes:eq(2)&&Text;.sDes:eq(1)&&Text",
        "content": ".detail-con&&p&&Text",
        "tabs": ".boxConWidth&&span",
        "tab_text": "body&&Text",
        "lists": ".dramaNumList:eq(#id)&&a",
        "list_text": "body&&Text",
        "list_url": "a&&href"
    },
    二级访问前: $js.toString(() => {
        if (/-play-/.test(MY_URL)) {
            MY_URL = MY_URL.replace(/play-id-(\d+).*?\.html/, 'detail-id-$1.html');
            //log(MY_URL);
        }
    }),
    搜索: '#data_list li;*;*;.sStyle&&Text;*',

    filter: 'H4sIAAAAAAAAA+1YzW5SQRjd8xh3zWIGyl/fwGdousBKYqPWhKIJISQqxRbQosaCrdSfxFtoRHtJTWNvbXkZZihv4dDOzPnowjTpwi5md885zMx35s4934RSxOPe/EKk5D3IFb15bylbyN2550W9leyjnMLjwYn41FD4afbhE0UslLwVRYtqb1LpTWkFuFeOarreG512xrV1rSSgtDqi1oWStMp4YyArVSgpKN234vgEStoq8vkb+awFJYN1at2Z2TjDoI0Po7BGJNQtK3X5YodIKE/46zNFcFXfYjlqNyybz2WxXaITiFfhv7cLU3/rTrZfalYDo032tuXvA61pYMc1A3l8ZsZdArtnZ5vi46nWNLBzft6HpoHdgbYvO32taWC1wwDjNLBaKxD1L2L3q5Ettqvu9+Wuf+4PR+GOWZtS1tXrQIR7xtUlMNp5Y4AKNEB1W7S6LaqpUmRjqLbWTGuxndkfjps/xrVtM7nF5hej4dr4tC1b5mUA21WqR+JnxSxxCWbOSDGXzeOMyPbRpP3rmmckxmJzmrt4JHwcfJzyMfAxynPwnPIMPCM8z1ieZyifBp+mfAp8ivJJ8EnKJ8AnKA+/nPrl8MupXw6/nPrl8MupXw6/nPpl8MuoXwa/jPpl8MuoXwa/jPpl8MuoXwa/jPpl8MuoXwa/jPpl8MuoXwa/DH55JmP8XjwSPg0+TfkU+CsZeLdITvfmOxE2r3m68SkoUFhWE9ivLgxl8F4r95cLq/hiD9bEhknN1aXH+dy0mMhiNOLFbtrJsJ8qRUZhV3UTYxqSiuJp6B4GRooTP/40VzEKL1T2u9M4hpRwfcT1EddHXB9xfeS29ZE47SMumF0wu2B2weyC+f8H89xNL/jYf1HvyT/fyX08fUUif/lk3FXddQTXEVxHcB3htnWEWNLd1V0yu2R2yeyS+RYlc6T8F3Lw1MtZHgAA'
}
