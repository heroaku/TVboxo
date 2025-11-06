var rule = {
    author: '小可乐/2408/第一版',
    title: '97电影网',
    类型: '影视',
    host: 'http://m.aogetu.com',
    headers: {'User-Agent': 'MOBILE_UA'},
    编码: 'gb2312',
    timeout: 5000,
    homeUrl: '/',
    url: '/fyfilter/indexfypage.html[/fyfilter]',
    filter_url: '{{fl.cateId}}',
    detailUrl: '',
    searchUrl: '/s.asp?page=fypage&searchword=**&searchtype=-1',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集&综艺&动漫&音乐&午夜',
    filter: 'H4sIAAAAAAAAA62VwW7aQBRF93yG10js8wdRFamLik2UxRC7eIgxTco0MQipVQQNqdTQqqVFRWGTFtImKVHUNuDA19jj8Bd9ZozjGY+RKrpCM5z7fP3um3E1pagYmRY288raZqqq7GiWsqZso7K2rippxURFDdbete2evoH1C2QQ2NisKiZsu/XB7HDgb8MirFNLB/8eD5xJ12u+FoCMWjLzFVJ6BusHuN11m30JfIALhCO9o2t6WJeQCO/CD8/237kjW8LuaDpBJsfSVy36si1jwW6O9wBW5R4KJOaBHn12xk0JW9GRWdE10fL4uzv5KCuNDd5Edv2xyDwlBo723/tgx5qvq5ZS26qlttIs++c6dPh/hM8KhU//MnHGfWiUSGTypLQNrx5h6UXfm76VsSVS1KJVZ9869PanjNQhJT+pKNw7BxdSGJngIur2ZEhHUxlaRnifN/vpK+1eyNA9nNM4A/RmmGAAqvIG6K8/7llb7hUMcJ2dXnm9SxmqEuY0SLcC7bCwRQxt1XgjlUIXZ/1Zp+HZd/fNcYzKqFCLLYXokgSL+AQRyyVJxLIRJJAPBJ8k2cN6XDEfvyTFfARFW/Xfjt1OUuziMloIFgcNlkVk+j9w8ax82vhqwpE7HtC7H1KSvUuwJw70Etl8sGMydmj/9WnBoVwiY4dT1LGWL9P5bQ9VQd/9PDayq/Y7qMKP/qx344xaHJGxkOlfbWAnMl1wX50MZXSkJBtaGfToSVZouYzKwUMLcA/kjYeZ2yeWViBzP6s2IFoq/FC1GvdX4ziQMYgZ/Qo1Ol63J8EOsOZ//ULQubXp+0sJWNFJrsTeKlX7C/ZMI3ixCAAA',
    class_url: 'dianying&dianshiju&zongyiyule&dongmandonghua&yuleMV&wuyejuchang',
    cate_exclude: '午夜',
    filter_def: {
        dianying: {cateId: 'dianying'},
        dianshiju: {cateId: 'dianshiju'},
        zongyiyule: {cateId: 'zongyiyule'},
        dongmandonghua: {cateId: 'dongmandonghua'},
        yuleMV: {cateId: 'yuleMV'},
        wuyejuchang: {cateId: 'wuyejuchang'}
    },
    play_parse: true,
    lazy: `js: input = { jx: 0, parse: 0, url: input } `,
    limit: 9,
    double: false,
    推荐: '*',
    一级: `js:
       VODS = [];
       let klists = pdfa(request(input), 'li:has([title])');
       klists.forEach((it) => {
       VODS.push({
        vod_name: pdfh(it,'a&&title'),
        vod_pic: pdfh(it,'img&&data-original'),
        vod_remarks: pdfh(it,'.title&&Text')||pdfh(it,'.name&&Text'),
        vod_id: pdfh(it,'a&&href')
        })
    })
    `,
    二级: `js:
       let khtml = request(input);
       let kdetail = pdfh(khtml, '.vod-body');
       VOD = {};
       VOD.vod_id = input;
       VOD.vod_name = pdfh(kdetail, 'h1&&Text');
       VOD.vod_pic = pdfh(kdetail, 'img&&src');
       VOD.type_name = pdfh(kdetail, 'p--em:eq(3)&&Text');
       VOD.vod_remarks = pdfh(kdetail, 'p:eq(1)&&Text');
       VOD.vod_year = pdfh(kdetail, 'p--em:eq(0)&&Text');
       VOD.vod_area = pdfh(kdetail, 'p--em:eq(5)&&Text');
       VOD.vod_director = pdfh(kdetail, 'p--em:eq(4)&&Text');
       VOD.vod_actor = pdfh(kdetail, 'p--em:eq(2)&&Text');
       VOD.vod_content = pdfh(khtml, '.vod_content&&Text');
       let jinput = pd(khtml, '.plau-ul-list:eq(0)&&a:eq(0)&&href', input);
       let jinput2 = pd(request(jinput), '.play&&script:eq(0)&&src', input);
       let kjson = JSON.parse(request(jinput2).match(/VideoListJson=(.*?),urlinfo=/)[1].replace(/'/g,'"'));
       let ktabs = [];
       let i = 1;
       kjson.forEach((jit) => {
       ktabs.push('👶线路' + i + '-' + jit[0]);
       i++
    });
       VOD.vod_play_from = ktabs.join('$$$');
       let kplists = [];
       kjson.forEach((jit) => {
       let plist = jit[1].map((it) => { return it.replace('$bdhd','').replace('$lzm3u8','') });
       plist = plist.join('#');
       kplists.push(plist)
    });
       VOD.vod_play_url = kplists.join('$$$')
    `,
    搜索: '*',
}
