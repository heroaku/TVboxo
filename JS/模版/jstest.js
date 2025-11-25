var rule = {
    author: '书虫/250613/第1版',
    title: '泥视频',
    类型: '影视',
    //主页 网页的域名根
    host: 'https://www.nivod.vip/',
    hostJs: ``,
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    //不填就默认utf-8，根据网页源码所显示的格式填，根据需要可填UTF-8，GBK，GB2312
    编码: 'utf-8',
    timeout: 5000,
    //首页链接，可以是完整路径或者相对路径,用于分类获取和推荐获取
    homeUrl: '/',
    //分类链接,分类参数用fyclasss,页码用fypage，带筛选的用fyfilter，第一页无页码的用[]括起，处理方式同xbpq方式，fyfilter代表filter_url里内容
    
     //   https://www.nivod.vip/k/6-大陆-------2---2021/
    url: 'https://www.nivod.vip/k/fyfilter/',
    filter_url: '{{fl.cateId}}-{{fl.area}}-------fypage---{{fl.year}}',
    detailUrl: 'https://www.nivod.vip/nivod/fyid/',
    //搜索链接 可以是完整路径或者相对路径,用于分类获取和推荐获取 **代表搜索词 fypage代表页数
//    searchUrl: 'https://www.shkangping.com/vodsearch/**----------fypage---.html',
    //  搜索页找参数  数组标题图片副标题链接
//    搜索: '*',
    //rss搜索写法
  //    searchUrl: '/rss/index.xml?wd=**&page=fypage',
    //  ajax搜索写法
      searchUrl: '/index.php/ajax/suggest?mid=1&wd=**&page=fypage&limit=30',
      
      搜索: 'json:list;name;pic;en;id',  

    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    limit: 10,
    double: false,
    class_name: '电影&电视剧&综艺&动漫',
    //静态分类值
    class_url: '1&2&3&4',


    filter_def: {
        1: {
            cateId: '1'
        },
        2: {
            cateId: '2'
        },
        3: {
            cateId: '3'
        },
        4: {
            cateId: '4'
        }
    
        
    },
    //推荐列表可以单独写也是几个参数，和一级列表部分参数一样的可以用*代替，不一样写不一样的，全和一级一样，可以用一个*代替
    推荐: 'a:has(.lazyload);a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    //推荐页的json模式
    //推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    //数组、标题、图片、副标题、链接，分类页找参数
    一级: 'a:has(.module-item-pic);a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',


    //数组、标题、图片、副标题、链接，分类页找参数

    //一级: `js:
    //let klist=pdfa(request(input),'.vertical-box');
    // let k=[];
    //klist.forEach(it=>{
    // k.push({
    //title: pdfh(it,'.title&&Text'),
    // pic_url: !pdfh(it,'.lazyload&&data-original').startsWith('http') ? HOST + pdfh(it,'.lazyload&&data-original') : pdfh(it,'.lazyload&&data-original'),

    //desc: pdfh(it,''),
    // url: pdfh(it,'a&&href'),
    //content: ''    
    // })
    //});
    //setResult(k)
    //`,

    //普通搜索模板  搜索数组标题图片副标题链接
    //搜索: `js:

    //let klist=pdfa(request(input),'.hzixunui-vodlist__thumb');
    // let k=[];
    //klist.forEach(it=>{
    //k.push({
    //        title: pdfh(it,'a&&title'),
    //       pic_url: !pdfh(it,'a&&data-original').startsWith('http') ? HOST + pdfh(it,'a&&data-original') : pdfh(it,'a&&data-original'),
    //       desc: pdfh(it,'.text-right&&Text'),
    //        url: pdfh(it,'a&&href'),
    //        content: ''    
    //     })
    // });
    // setResult(k)
    // `,

    //rss搜索模板
    //  搜索: `js:
    //let klist=pdfa(request(input),'rss&&item');
    //   let k=[];
    //   klist.forEach(it=>{
    //    it=it.replace(/title|link|author|pubdate|description/g,'p');
    //    k.push({
    //         title: pdfh(it,'p:eq(0)&&Text'),
    //         pic_url: '',
    //       desc: pdfh(it,'p:eq(3)&&Text'),
    //         url: pdfh(it,'p:eq(1)&&Text').replace('cc','la'),    
    //      content: pdfh(it,'p:eq(4)&&Text')    
    //     })
    //     });
    // setResult(k)
    //" `,

    //详情页找参数
    //第一部分分别是对应参数式中的标题、类型、图片、备注、年份、地区、导演、主演、简介
    //第二部分分别对应参数式中的线路数组和线路标题
    //第三部分分别对应参数式中的播放数组、播放列表、播放标题、播放链接

    二级: `js:
let html = request(input);
VOD = {};
 VOD.vod_id = input;
VOD.vod_name = '集多提示本线路仅供学习交流，贩卖必究！！！标题:   '+pdfh(html, 'h1&&Text');
 VOD.type_name = pdfh(html, '.module-info-tag-link:eq(2)&&Text');
 VOD.vod_pic = pd(html, '.lazyload&&data-original', input);
 VOD.vod_remarks = pdfh(html, '.module-info-item:contains(集数)&&Text').replace('集数：','');
 VOD.vod_year = pdfh(html, '.module-info-tag-link:eq(0)&&Text');
VOD.vod_area = pdfh(html, '.module-info-tag-link:eq(1)&&Text');
 VOD.vod_director = pdfh(html, '.module-info-item:contains(导演)&&Text').replace('导演：','');
 VOD.vod_actor = pdfh(html, '.module-info-item:contains(主演)&&Text').replace('主演：','');
 VOD.vod_content = '集多祝您观影愉快！现为您介绍剧情:' + pdfh(html, '.module-info-introduction-content&&Text');
 
 let r_ktabs = pdfa(html,'#y-playList&&span');
 let ktabs = r_ktabs.map(it => pdfh(it, 'Text'));
 VOD.vod_play_from = ktabs.join('$$$');
 

let klists = [];
 let r_plists = pdfa(html, '.module-play-list');
 r_plists.forEach((rp) => {
     let klist = pdfa(rp, 'body&&a:not([rel])').map((it) => {
     return pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input);
     });
     klist = klist.join('#');
     klists.push(klist);
 });
 VOD.vod_play_url = klists.join('$$$')
 

 `,
    //是否启用辅助嗅探: 1,0
    sniffer: 0,
    // 辅助嗅探规则
    isVideo: 'http((?!http).){26,}\\.(m3u8|mp4|flv|avi|mkv|wmv|mpg|mpeg|mov|ts|3gp|rm|rmvb|asf|m4a|mp3|wma)',

    play_parse: true,
    //播放地址通用解析
    lazy: `js:
let kcode = JSON.parse(request(input).match(/var player_.*?=(.*?)</)[1]);
let kurl = kcode.url;
if (kcode.encrypt == '1') {
url = unescape(url)
} else if (kcode.encrypt == '2') {
url = unescape(base64Decode(url))
};
if (/\\.(m3u8|mp4)/.test(kurl)) {
input = { jx: 0, parse: 0, url: kurl }
} else {
input = { jx: 0, parse: 1, url: input }
}`,
    filter: {
        "1": [
        
        {
                "key": "cateId",
                "name": "类型",
                "value":[
    {"n": "全部", "v": "1"},
    {"n": "动作片", "v": "6"},
    {"n": "喜剧片", "v": "7"},
    {"n": "爱情片", "v": "8"},
    {"n": "科幻片", "v": "9"},
    {"n": "奇幻片", "v": "10"},
    {"n": "恐怖片", "v": "11"},
    {"n": "剧情片", "v": "12"},
    {"n": "战争片", "v": "20"},
    {"n": "纪录片", "v": "21"},
    {"n": "动画片", "v": "26"},
    {"n": "悬疑片", "v": "22"},
    {"n": "冒险片", "v": "23"},
    {"n": "犯罪片", "v": "24"},
    {"n": "惊悚片", "v": "45"},
    {"n": "歌舞片", "v": "46"},
    {"n": "灾难片", "v": "47"},
    {"n": "网络片", "v": "48"}
]

            },
            {
                "key": "area",
                "name": "地区",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "大陆", "v": "大陆"},
  {"n": "香港", "v": "香港"},
  {"n": "台湾", "v": "台湾"},
  {"n": "美国", "v": "美国"},
  {"n": "欧美", "v": "欧美"},
  {"n": "日本", "v": "日本"},
  {"n": "韩国", "v": "韩国"},
  {"n": "泰国", "v": "泰国"},
  {"n": "其他", "v": "其他"}
]
            },
            
            {
                "key": "year",
                "name": "年份",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "2025", "v": "2025"},
  {"n": "2024", "v": "2024"},
  {"n": "2023", "v": "2023"},
  {"n": "2022", "v": "2022"},
  {"n": "2021", "v": "2021"},
  {"n": "2020", "v": "2020"},
  {"n": "2019", "v": "2019"},
  {"n": "2018", "v": "2018"},
  {"n": "2017", "v": "2017"},
  {"n": "2016", "v": "2016"},
  {"n": "2015", "v": "2015"},
  {"n": "2014", "v": "2014"},
  {"n": "2013", "v": "2013"},
  {"n": "2012", "v": "2012"}
]

            }
        ],
        "2": [{
                "key": "cateId",
                "name": "类型",
                "value":[
    {"n": "全部", "v": "2"},
    {"n": "国产剧", "v": "13"},
    {"n": "港台剧", "v": "14"},
    {"n": "日剧", "v": "15"},
    {"n": "韩剧", "v": "33"},
    {"n": "欧美剧", "v": "16"},
    {"n": "泰剧", "v": "34"},
    {"n": "新马剧", "v": "35"},
    {"n": "其他剧", "v": "25"}
]

            },
            {
                "key": "area",
                "name": "地区",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "内地", "v": "内地"},
  {"n": "韩国", "v": "韩国"},
  {"n": "香港", "v": "香港"},
  {"n": "台湾", "v": "台湾"},
  {"n": "日本", "v": "日本"},
  {"n": "美国", "v": "美国"},
  {"n": "泰国", "v": "泰国"},
  {"n": "英国", "v": "英国"},
  {"n": "新加坡", "v": "新加坡"},
  {"n": "其他", "v": "其他"}
]
            },
            
            {
                "key": "year",
                "name": "年份",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "2025", "v": "2025"},
  {"n": "2024", "v": "2024"},
  {"n": "2023", "v": "2023"},
  {"n": "2022", "v": "2022"},
  {"n": "2021", "v": "2021"},
  {"n": "2020", "v": "2020"},
  {"n": "2019", "v": "2019"},
  {"n": "2018", "v": "2018"},
  {"n": "2017", "v": "2017"},
  {"n": "2016", "v": "2016"},
  {"n": "2015", "v": "2015"},
  {"n": "2014", "v": "2014"},
  {"n": "2013", "v": "2013"},
  {"n": "2012", "v": "2012"}
]

            }
            
        ],


        "3": [{
                "key": "cateId",
                "name": "类型",
                "value":[
    {"n": "全部", "v": "3"},
    {"n": "内地综艺", "v": "27"},
    {"n": "港台综艺", "v": "28"},
    {"n": "日本综艺", "v": "29"},
    {"n": "韩国综艺", "v": "36"},
    {"n": "欧美综艺", "v": "30"},
    {"n": "新马泰综艺", "v": "37"},
    {"n": "其他综艺", "v": "38"}
]

            },
            {
                "key": "area",
                "name": "地区",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "内地", "v": "内地"},
  {"n": "港台", "v": "港台"},
  {"n": "日韩", "v": "日韩"},
  {"n": "欧美", "v": "欧美"}
]
            },
            
            
            {
                "key": "year",
                "name": "年份",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "2025", "v": "2025"},
  {"n": "2024", "v": "2024"},
  {"n": "2023", "v": "2023"},
  {"n": "2022", "v": "2022"},
  {"n": "2021", "v": "2021"},
  {"n": "2020", "v": "2020"},
  {"n": "2019", "v": "2019"},
  {"n": "2018", "v": "2018"},
  {"n": "2017", "v": "2017"},
  {"n": "2016", "v": "2016"},
  {"n": "2015", "v": "2015"},
  {"n": "2014", "v": "2014"},
  {"n": "2013", "v": "2013"},
  {"n": "2012", "v": "2012"}
]

            }
        ],
        "4": [{
                "key": "cateId",
                "name": "类型",
                "value": [
    {"n": "全部", "v": "4"},
    {"n": "国产动漫", "v": "31"},
    {"n": "日本动漫", "v": "32"},
    {"n": "韩国动漫", "v": "39"},
    {"n": "港台动漫", "v": "40"},
    {"n": "新马泰动漫", "v": "41"},
    {"n": "欧美动漫", "v": "42"},
    {"n": "其他动漫", "v": "43"}
]

            },
            {
                "key": "area",
                "name": "地区",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "国产", "v": "国产"},
  {"n": "日本", "v": "日本"},
  {"n": "欧美", "v": "欧美"},
  {"n": "其他", "v": "其他"}
]
            },
            
            
            {
                "key": "year",
                "name": "年份",
                "value": [
  {"n": "全部", "v": ""},
  {"n": "2025", "v": "2025"},
  {"n": "2024", "v": "2024"},
  {"n": "2023", "v": "2023"},
  {"n": "2022", "v": "2022"},
  {"n": "2021", "v": "2021"},
  {"n": "2020", "v": "2020"},
  {"n": "2019", "v": "2019"},
  {"n": "2018", "v": "2018"},
  {"n": "2017", "v": "2017"},
  {"n": "2016", "v": "2016"},
  {"n": "2015", "v": "2015"},
  {"n": "2014", "v": "2014"},
  {"n": "2013", "v": "2013"},
  {"n": "2012", "v": "2012"}
]

            }
        ]
        
        



    }
}
