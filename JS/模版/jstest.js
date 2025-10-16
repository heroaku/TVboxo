globalThis.safePlay = function(whatTMDwhatTMDPPPP, whatTMDwhatTMDKKKK) {
    eval(getCryptoJS());


    let _0x568646 = "VNF9aVQF!G*0ux@2hAigUeH3";

    var _0x527427 = CryptoJS.enc.Utf8.parse(whatTMDwhatTMDKKKK || _0x568646);
    let _0x264b22 = whatTMDwhatTMDPPPP;
    var _0x33e517 = CryptoJS.enc.Base64.parse(_0x264b22);
    const _0x240c87 = {
        ciphertext: _0x33e517
    };
    var _0x358b25 = CryptoJS.AES.decrypt(_0x240c87, _0x527427, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var _0x4f3e21 = _0x358b25.toString(CryptoJS.enc.Utf8);
    return _0x4f3e21;
};
//    "备注": "与毒舌，网飞猫同一站，就主页网址不一样，可可：https://www.keke7.app，毒舌: https://www.dushe7.app，网飞猫: https://www.ncat2.com:51111",

var rule = {
    author: '小可乐/2409/第二版',
    title: '可可影视',
    类型: '影视',
    host: 'https://www.kkys03.com',
    // host: 'https://dl.keke12.com:51111',
    // hostJs: 'HOST = pdfh(request(HOST), ".section-row-subtitle:eq(0)&&Text")',
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    编码: 'utf-8',
    timeout: 5000,

    homeUrl: '/',
    url: '/show/fyclass-----fyfilter-fypage.html',
    filter_url: '{{fl.class}}-{{fl.area}}-{{fl.lang}}-{{fl.year}}-{{fl.by}}',
    detailUrl: '',
    searchUrl: '/search?os=pc&k=**&page=fypage',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,

    class_name: '电影&剧集&综艺&动漫&短剧',
    class_url: '1&2&4&3&6',
    filter_def: {},
    图片替换: 'https://www.kkys02.com=>https://vres.wbadl.cn',

    tab_remove: ['4K(高峰不卡)'],
    play_parse: true,
    lazy: $js.toString(() => {
        let html = request(input);
        var TMDKKKK = "";
        var TMDPPPP = html.match(/window\.whatTMDwhatTMDPPPP\s*=\s*'([^']+)';/)[1];
        if (html.match(/window\.whatTMDwhatTMDKKKK\s*=\s*'([^']+)';/)) {
            TMDKKKK = html.match(/window\.whatTMDwhatTMDKKKK\s*=\s*'([^']+)';/)[1];

        } else {
            TMDKKKK = "FNF9aVQF!G*0ux@2hAigUeB3";
        };
        var url = safePlay(TMDPPPP, TMDKKKK)

        input = {
            url: url
        };
    }),
    limit: 9,
    double: false,
    推荐: '*',
    一级: '.module-item;.v-item-title:eq(1)&&Text;img:eq(-1)&&data-original;span:eq(-1)&&Text;a&&href',
    二级: {
        title: '.detail-title&&strong:eq(1)&&Text;.detail-tags&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags-item:eq(0)&&Text;.detail-tags-item:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main:eq(0)&&Text',
        content: '.detail-desc&&Text',
        tabs: 'body&&.source-item-label',
        lists: '.episode-list:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },
    搜索: '.search-result-item;img:eq(-1)&&title;*;.search-result-item-header&&Text;*',

    filter: 'H4sIAAAAAAAAA+2Zz08bVxDH7/4rKp852IBanFsPjVSpyqU9VIqiyK3cKipxpdBWRQjJYBuMIdggx8SxC6RgMAn+AUGOWWP7n9m3u/4v+pZ5M2+dVJNVQnNofEF85vt+7ezsm3nPC4FgOHjrs7uBheAvsfngreCPs9G5ueBEMB59GJNon3XF7rrkP6Kzv0vD3YVgXJpFujZM1lyzhODiBFjvxH77afbBn8p856vvbn/z9fekirVjK5lWogLSihVpQQ2AtGzN7FVQA0DNzpzpMRWgZi3lrURRaQpIS2at5WeoAdCY2abde4FjApB2vCUuu6gB0JjLp3ZxC8cEoGeorup+Ckhb2R6WTlADoDEzT01jDccEoH6bKyJ3jv0ASMsdOgfkawDSGm1h1FEDQM282ncaLaUpoLXUj8z+Pq4FQGsbTmaXtGsgn+3V7bVV9BmA593aha5+ty6QlhrYL6uoAaDmLG2IiqE0BYv3FicojKOPYlEdxaLSEhuGzygWh8fD0gr6oFMX5Z4yYYvhUcnqNEdaKJP2f8u67I+OASbySn9TGtErAOTNnapVOUVvAtDceye6nwLyyvqZ1hTQmK+eaE0Brbb/WmsKSHvcEsYRagB6zJZ3zJa3n9m5HFI/BfTsW7si3cFnB6D5Xl841QHOB6CjZd9aH8iXQQGDTLMOUnZvxyrSyyGmNadysoPI4AenmVo0CxKtnTa2IPbsOqJVEGn8UDTTm6gO7JyM9BK+DGKapf8K5jUN2oe8JnrmdNvs4i6mYCTSZ6Pxn3WkO826U0v4jfRyT7bHsQHoGc8PtabAE2daU+CJXa0p8MSu1hR44tPTD8C3D+Zj0Ueer/3ywuz2fPpgMjQ5rWzX/3rsU9o+5bVPavuk1x7W9rDXHtL2ENnDoetlHpAWDt2XfyLUIPRmg5DbIKQbREYbhCOR0H35RzeYebPBjNtgRjewyhfWDn4IrvZFZNSvP8xrr1qb28LIveVVu3sl8hmcQg9dSVhF/D4mvWY7iW9ZO9VppkQGt9xpdw2BexMB2e8/qkwU+alMuAqDq1q4KoKtFLjMzVRCXFbnqh2uMnHTEj2fAj+VEFeZcBWNm85oPgV+qg+54+l3pMBPFchVXsNkT3SWcS0AN1x9kDl4w9UHVyO8b93B1Q9c3cHWFu+skrgKg6tMxllznDU/1aw5fWNZ0zZeiN4TjGYA0ip7pmHYxwmUiWl5jZburYC01JnIHejemn3dFnAnXyYnc6dbu9wRB1TQA9Bqs8t2uYFLBfBz8uXyizPIywyOYwKg9m0sOvdrXGkKfN1OMCdtK79rn1LNAUBa6Zl5RfUBwPg0Pc4h4xzyqeaQqY918srWrMSSdfVy5BZQm3xlA+4OkbtXZnZn9qTFnZi4UxFzn8ntzuwJlDn1cdlAhoLznFI3gM6EWauE5xIFfk6udjfnudUDoH77z0WZ9hgA1L6MP5BhBRL87ydHmsa5qOcxJwDQbvfXtvUUPa1AnwfXpQ9xJQB+zpj/eoa+oRzJZah3588Py44fdpoc3ziPb5zHdc+47vm/1D2fv0fdo83etzxMrDh/U+QBUKQXKqKBeUYBLayUl1kJIx2A+p0MnHYW+wHQfKuP7cIezgfgp3pif9Fm8iFblTDVE/uLNleRpduikdRfpAsfN3LcEAks/gPD+wzBMSEAAA=='
}
