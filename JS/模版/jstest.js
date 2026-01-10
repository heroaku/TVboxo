//发布页https://www.ddys.site
var rule = {
    title: '低端影视',
    //host: 'https://ddys.pro',
    host: 'https://ddys.io',
    url: '/fyclass$fypage',
    searchUrl: '/?s=**&post_type=post',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,

    headers: {
        'User-Agent': 'MOBILE_UA',
        "Referer": "https://ddys.pro/"
    },
    class_name: '动漫&电影&剧集&综艺&记录',
    class_url: "category/anime/&category/movie/&category/airing/&category/variety/&category/documentary/",
    play_parse: true,
    lazy: `
    
    if (/(pan.quark.cn|www.aliyundrive.com|www.alipan.com)/.test(input)){
 input= getProxyUrl().replace('js',"quark")+'&type=push&url='+encodeURIComponent(input);
}else if(/¥/.test(input)){
    
    var jxurl= base64Decode(input.split("¥")[0]);
    
    
    var url=JSON.parse(fetch(jxurl,{headers:{"Referer": input.split("¥")[1]}})).url
    
            
        input = {
               url: url,
               parse: 0,
               jx:0
           }
    
     
         
     }else if(/mp4/.test(input)){
        input = {
             url: input,
             parse:0,
             jx:0,
             header:{
                 "Referer":"https://ddys.pro/"
             }
         }
         
     }`,
    limit: 6,
    推荐: '.tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    double: true,
    一级: `js: var M=input.split("$");
var page= M[1];
if(page==1){
var html=fetch(M[0])
}else{
html=fetch(M[0]+"page/"+page+"/")
}
var list= pdfa(html,"body&&article");
var d=[];
for(var it of list){
d.push({
title: pdfh(it,"h2&&Text"),
desc: pdfh(it,".post-box-meta&&Text"),
img: pdfh(it,".post-box-image&&style"),
url: pdfh(it,"h2&&a&&href")
})
}
setResult(d)
`,

    二级: {
        "title": "h1&&Text",
        //图片

        //主要描述;年份;地区;演员;导演
        "desc": "",
        //简介
        "content": "",
        //线路数组  


        "tabs": `js:
       pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
             TABS = ['主'];
             if (pdfa(html, '.page-links&&a').length > 0) {
             	TABS =['第1季']
            var as = pdfa(html, '.page-links&&a')
            var k=2
            for(var i in as){
                                           
                                           
                 TABS.push("第"+k+"季")   
                 k++                       
                                        
        }
            
            }
            if (/夸克网盘|视频下载/.test(html)) {
            TABS.push('夸克网盘');
            
        }
           `,



        lists: $js.toString(() => {
            pdfh = jsp.pdfh;
            pdfa = jsp.pdfa;
            pd = jsp.pd;

            var json = JSON.parse(pdfh(html, ".wp-playlist-script&&Html"))
            var plays = json["tracks"].map(x => {

                var url = 'https://v.ddys.pro' + x.src0;
                var f = false;
                /*if (x.src1 != "") {
                    var r = x.srctype == '1' ? '2' : '3';

                    url = base64Encode('https://ddys.pro/getvddr' + r + '/video?id=' + x.src1 + '&type=json') + "¥" + input;
                    f = true;
                }*/
                return x.caption + "$" + url

            })



            LISTS = [];
            LISTS.push(plays);
            if (pdfa(html, '.page-links&&a')
                .length > 0) {

                var as = pdfa(html, '.page-links&&a')
                    .map(h => {
                        return pdfh(h, 'a&&href')

                    });

                for (var i in as) {

                    var temp = [];
                    var htm = fetch(as[i]);
                    json = JSON.parse(pdfh(htm, ".wp-playlist-script&&Html"))
                    plays = json["tracks"].map(x => {

                        var url = 'https://v.ddys.pro' + x.src0;
                        var f = false;
                        if (x.src1 != "") {
                            var r = x.srctype == '1' ? '2' : '3';

                            url = base64Encode('https://ddys.pro/getvddr' + r + '/video?id=' + x.src1 + '&type=json') + "¥" + input;
                            f = true;
                        }
                        return x.caption + "$" + url

                    })

                    LISTS.push(plays)

                }
            }

            if (/夸克网盘|视频下载/.test(html)) {

                var b = [];
                var quark = pdfa(html, 'body&&a[href*="pan.quark.cn"]');
                var uc = pdfa(html, 'body&&a[href*="drive.uc"]');
                log(quark)
                if (quark.length >= 1) {
                    b.push("夸克网盘$" + pdfh(quark[0], "a&&href"))
                }
                if (uc.length >= 1) {
                    b.push("UC网盘$" + pdfh(uc[0], "a&&href"))
                }




                LISTS.push(b);
            }

        })
    },

    搜索: '#main&&article;h2&&Text;;.cat-links&&a&&Text;a&&href'
}
