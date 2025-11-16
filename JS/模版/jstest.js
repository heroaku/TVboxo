var rule = {
author: '小可乐/2503/第一版',
title: '小红影视',
类型: '影视',
host: 'https://www.xiaohys.com',
hostJs: '',
headers: {'User-Agent': MOBILE_UA},
编码: 'utf-8',
timeout: 5000,
homeUrl: '/',
url: '/index.php/api/vod',
filter_url: '',
searchUrl: '/index.php/ajax/suggest?mid=1&limit=60&wd=**',
detailUrl: '/detail/fyid',
limit: 9,
double: false,
class_name: '电影&剧集&综艺&动漫',
class_url: '1&2&3&4',
filter_def: {},
推荐: '.public-list-exp;a&&title;img&&data-src;.ft2&&Text;a&&href',
一级: $js.toString(() => {
let t = new Date().getTime().toString();
let key = md5(`DS${t}DCC147D11943AF75`);
let fbody = {
    "type": MY_CATE.toString(),
    "class": (MY_FL.class || "").toString(),
    "area": (MY_FL.area || "").toString(),
    "year": (MY_FL.year || "").toString(),
    "letter": (MY_FL.letter || "").toString(),
    "by": (MY_FL.by || "").toString(),
    "page": MY_PAGE,
    "time": t,
    "key": key
};
let khtml = fetch(input, {
    headers: rule.headers,
    body: fbody,
    method: 'POST'
});
VODS = JSON.parse(khtml).list
}),
搜索: 'json:list;name;pic;en;id',
二级: $js.toString(() => {
let khtml = fetch(input);
let kdetail = pdfh(khtml, '.search-show');
let ktabs = pdfa(khtml, '.anthology-tab&&a').map((it) => { return '👶' + pdfh(it, 'body--span&&Text') });
let kurls = pdfa(khtml, '.anthology-list-play').map((item) => {
    let kurl = pdfa(item,'a').map((it) => { return pdfh(it, 'body&&Text') + '$' + pd(it, 'a&&href', input) });
    return kurl.join('#')
});
VOD = {
    vod_id: input,
    vod_name: pdfh(khtml,'h3&&Text'),
    vod_pic: pdfh(khtml,'.detail-pic&&img&&data-src'),
    type_name: pdfh(kdetail,'li:contains(类型)--em&&Text'),
    vod_remarks: pdfh(kdetail,'li:contains(状态)--em&&Text'),
    vod_year: pdfh(kdetail,'li:contains(年份)--em&&Text'),
    vod_area: pdfh(kdetail,'li:contains(地区)--em&&Text'),
    vod_lang: pdfh(kdetail,'li:contains(语言)--em&&Text'),
    vod_director: pdfh(kdetail,'li:contains(导演)--em&&Text'),
    vod_actor: pdfh(kdetail,'li:contains(主演)--em&&Text'),
    vod_content: pdfh(kdetail,'.top26--em&&Text'),
    vod_play_from: ktabs.join('$$$'),
    vod_play_url: kurls.join('$$$')
}
}),

play_parse: true,
lazy: $js.toString(() => {
let kdata = fetch(input).split('aaaa=')[1].split('<')[0];
let kurl = JSON.parse(kdata).url;
if (/\.(m3u8|mp4)/.test(kurl)) {
    input = { jx: 0, parse: 0, url: kurl, header: rule.headers }
} else {
    let furl = `${HOST}/static/player/artplayer/api.php?ac=getdate`;
    let fbody = `url=${kurl}`;
    let khtml = fetch(furl, {
        headers: rule.headers,
        body: fbody,
        method: 'POST'
    });
    kdata = JSON.parse(khtml).data;
    let iv = JSON.parse(khtml).iv;
    iv = CryptoJS.enc.Utf8.parse(iv);
    const key = CryptoJS.enc.Utf8.parse('d978a93ffb4d3a00');
    let decrypted = CryptoJS.AES.decrypt(kdata, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    kdata = decrypted.toString(CryptoJS.enc.Utf8);
    kurl = JSON.parse(kdata).url;
    input = { jx: 0, parse: 0, url: kurl, header: rule.headers }
}
}),
filter: 'H4sIAAAAAAAAA+2ZWU8bVxTH3/kYfqbSDNAkzVv2fd8T5cGNrDYqpRLQSgghGYyJIWAbRCCuzdawhWIwSynYNf4yvjPmW+Ta92xuy8hqaV8yb/79z9w755w7M/fvmd6mgB04+6KpN/BdqCdwNvCqPdjVFWgOdAS/D2lUwytOJKr5p2D7j1p40RvoqMrR1aPIalXWEOhrBnUqo48HFQBjbmwLJmLAmNOfdMJTEAOgOUdWy8UMzmmA5lwZVwcFnNMAjaPEGeh8sffl/DCezwDGKtllNboGMQA638imW8QYgMjTnSxwnlWg2NIbzhOAcskulw/nMRcDNG5o4ij1EccZoHGzazpzHGeAYgPr7tQ4xgxQLDLiDPyMMQNUXyGhovtYnwGMHc1MOO+XIAZAc069qQzncU4DVMPhhjv5mypuYRnEdERisfKBVsoAxeJDKrGNMQO0UqWk7jOulAHuXMaZGafO1YBigyX3V6wEgDpQHHcLmbqE66S+l33NdKsEO0NBcadkcmo03+idsrhylBrCHAxQp5dTzv4mdtoA9yrnHBxSr2pAuR/GVbqIWRugFdp5xzEA6uPbLY4B0LjpJSezjuMMUJ5zH3kcAK/67xwD4FxyMpdc3bixnMov4zgDNG4woTulYnhDMFMlSyU3kXWHU1gMMd+l887bkh5GNyoyHRHdKxfwWQRQt+rtwY5veNUrm9nKarjRVU8X9fE4twGxChwDoJXdXuQYAK3CdFGNTXOYWayTCBsQ68sxAHHNiJgBsb6iEgOig2ojwh2sQl0He0LBTnHfHOyWC8UGO9hitXwJWu2n0NtYb5N6K+utUm9hvUXqNuu21C3WLaHbX5Gufwr9DOtnpH6a9dNSP8X6Kalzvbas1+Z6bVmvzfXasl6b67VlvTbXa8t6ba7XlvVaXK8l67W4XkvWa3G9lqzX4notWa/F9VqyXovr1T/r78hQd3dIXlHZaWdzrMEr6hwI50g5D8p5Ui6AcoGUi6BcJOUSKJdIuQzKZVKugHKFlKugXCXlGijXSLkOynVSboByg5SboNwk5RYot0i5DcptUu6AcoeUu6DcJeUeKPdIuQ/KfVIegPKAlIegPCTlESiPSHkMymNSnoDyhJSnoDwl5Rkoz0h5DspzUqwv8CKt/qq7Vr7u4evEiU+ofOIv14mTCTtTOZig+7U+lJ6ImbAbwafet6+7u/jpvTmoYrifd736oTNUPW3Ty+amQMuJuWsPn+TlaI1ZU/17KpKo828gNeLe1caeytPz3kCDrvhY9+7lir3cu5cn9HKw5YMF9oQA7IqjTgo9FwCd790QO20A4Re5ZwANO4l/4x+Hovp48rc1aMSX/VNv6eUDvX3n8V7P03dO5bQ1UzML9KcC2fdpf/Zpvt/y/Zbvt3y/5futmt9qPSm/dRQedlfC+Dw2IP3C4JzwCxoot41SJRfDHcIAjZvIOiP47gmAn/FRZx+9CwDvDTvlgyTtDTUQ++/RB8wFgGL5NbUxizEDdL70tnhrZ4DGTc45u/Rm1QCN2993YolyfoLfvtVJ1IfdX7QDwz4YoDm2Bir9ozjawP/hjbTf0c6Gsq6B2GP1rst7bBUotr6iO4sxA77b8N2G7zZ8t+G7jc/YbbSdlNvwchRe3zl1ypUFdCkANGd81U1i3gAUS8666/SN0ADvoMd/d6wkZypxfNMEQHPOL6g07RsGaE6PN0FOJi++ZRqg83l85fN666Vyuk27eD4DMra0I2IaqJ+Lh+U/8PsoAI2Lz6lYGscZwFg5v62y6NAAaM70iJNCpwXAfdlSpWnqSw3EXvvfvUHy+ALp9bbnb51Qo/n6Lsl3Sb5L8l1SwHdJn49Laur7BLEioANkJgAA'
}
