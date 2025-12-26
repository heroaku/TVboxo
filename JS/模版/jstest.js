/*
@header({
  searchable: 1,
  filterable: 1,
  quickSearch: 1,
  title: '03影视',
  author: '小可乐/250915/第一版',
  '类型': '影视',
  lang: 'dr2'
})
*/

var rule = {
    author: '小可乐/250915/第一版',
    title: '03影视',
    类型: '影视',
    host: 'https://www.03yy.live',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9'
    },
    编码: 'utf-8',
    timeout: 5000,
    url: '/type/indexfyfilter-fypage.html',
    filter_url: '{{fl.cateId}}',
    searchUrl: '/search.php?searchword=**',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,

    class_name: '电影&电视剧&综艺&动漫',
    class_url: '1&2&3&4',
      filter: {
        "1":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"1"},{"n":"动作片","v":"5"},{"n":"喜剧片","v":"10"},{"n":"爱情片","v":"6"},{"n":"科幻片","v":"7"},{"n":"恐怖片","v":"8"},{"n":"剧情片","v":"12"},{"n":"动画片","v":"25"}]}]}],
        "2":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"2"},{"n":"大陆剧","v":"13"},{"n":"香港剧","v":"14"},{"n":"台湾剧","v":"46"},{"n":"韩国剧","v":"26"},{"n":"日本剧","v":"16"},{"n":"欧美剧","v":"27"},{"n":"泰国剧","v":"47"},{"n":"海外剧","v":"28"}]}]}],
        "3":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"3"},{"n":"大陆综艺","v":"29"},{"n":"港台综艺","v":"30"},{"n":"日韩综艺","v":"31"},{"n":"欧美综艺","v":"32"}]}]}],
        "4":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"4"},{"n":"大陆动漫","v":"33"},{"n":"港台动漫","v":"36"},{"n":"日韩动漫","v":"34"},{"n":"欧美动漫","v":"35"},{"n":"其他动漫","v":"37"},{"n":"少儿动画","v":"64"}]}]}]
        },
    filter_def:{
        1:{cateId:'1'},
        2:{cateId:'2'},
        3:{cateId:'3'},
        4:{cateId:'4'}
    },


    预处理: $js.toString(() => {
        // 使用withHeaders: true来获取响应头
        const res = request(HOST, {
            headers: rule.headers,
            withHeaders: true,
            redirect: false,
            method: 'GET'
        });
        const resJson = typeof res === 'string' ? JSON.parse(res) : res;

        // 提取set-cookie头
        const setCookie = resJson['set-cookie'] || '';

        // 处理cookie格式
        let cookies = '';
        if (Array.isArray(setCookie)) {
            cookies = setCookie.map(c => c.split(';')[0].trim()).join('; ');
        } else if (setCookie) {
            cookies = setCookie.split(';')[0].trim();
        }

        // 更新rule.headers中的cookie
        if (cookies) {
            rule.headers["cookie"] = rule.headers["cookie"] ?
                rule.headers["cookie"] + '; ' + cookies : cookies;
            rule_fetch_params.headers = Object.assign({}, rule.headers);
        }

        console.log(`提取的Cookie: ${cookies || '无'}`);
        console.log(`最终Cookie: ${rule.headers["cookie"] || '无'}`);
    }),
    play_parse: true,
    lazy: $js.toString(() => {
        let html = request(input, {
            headers: rule.headers,
            withHeaders: true,
            redirect: false,
            method: 'GET'
        });

        // 处理转义引号：将 \" 替换为 "
        html = html.replace(/\\"/g, '"');

        // 匹配参数
        const nowMatch = html.match(/var\s+now\s*=\s*base64decode\s*\(\s*["']([^"']+)["']\s*\)/);
        const prePageMatch = html.match(/var\s+prePage\s*=\s*["']([^"']+)["']/);
        const nextPageMatch = html.match(/var\s+nextPage\s*=\s*["']([^"']+)["']/);
        var now = nowMatch[1];
        now = base64Decode(now);
        console.log("now:" + now);
        
        if (/\.(m3u8|mp4|mkv|jpg)/.test(now)) {
            input = {parse: 0, url: now}
        } else {
            const prePage = prePageMatch[1];
            const nextPage = nextPageMatch[1];
            console.log("prePage:" + prePage);
            console.log("nextPage:" + nextPage);
            
            let jx = `${HOST}/api/dplayer.php?url=${now}&ref=${encodeURIComponent(prePage)}&next=${encodeURIComponent(nextPage)}`;
            
            console.log("请求URL:" + jx);
            
            let videohtml = request(jx, {
                headers: rule.headers,
                withHeaders: true,
                redirect: false,
                method: 'GET'
            });
            console.log("videohtml:" + videohtml);
            
            const mediaInfoRegex = /mediaInfo\s*=\s*(\[.*?\]);/gis;
            const mediaInfoMatch = mediaInfoRegex.exec(videohtml);
            let videoUrl = "";
            
            if (mediaInfoMatch && mediaInfoMatch[1]) {
                const mediaInfoContent = mediaInfoMatch[1];
                const qualityLevels = ["1080", "720", "540", "360"];
                const urls = [];
                for (const quality of qualityLevels) {
                    const urlRegex = new RegExp(
                        `definition.*?${quality}.*?url.*?:.*?"(https.*?)"`, 
                        'is'
                    );
                    const urlMatch = mediaInfoContent.match(urlRegex);
                    if (urlMatch && urlMatch[1]) {
                        videoUrl = urlMatch[1];
                        videoUrl = videoUrl.replace(/\\\\\//g, '/').replace(/\\+/g, '');
                        console.log(`找到${quality}清晰度的URL:`, videoUrl);
                        urls.push(quality, videoUrl);
                    }
                }
                input = { parse: 0, url: urls };
                if (!videoUrl) {
                    console.log("未找到任何已知清晰度的URL");
                }
            } else {
                console.error("未匹配到mediaInfo");
            }
        }
    }),
    limit: 9,
    double: true,
    推荐: '.Pic-list&&.pic-content;a&&title;img&&src;span&&Text;a&&href',
    一级: '.type-box&&.pic-height-a;a&&title;img&&src;span&&Text;a&&href',
    二级: {
        title: 'h2&&Text;.m-content&&ul&&li:eq(4)',
        img: 'img&&src',
        desc: '.color-red&&Text;.m-content&&ul&&span:eq(2)&&Text;.m-content&&ul&&span:eq(0)&&Text;.m-content&&ul&&li:eq(1)&&Text;.m-content&&ul&&li:eq(0)&&Text',
        content: '.m-intro&&Text',
        tabs: '#playlist&&li',
        tab_text: 'body&&Text',
        lists: '.play_list:eq(#id)&&li',
        list_text: 'body&&Text',
        list_url: 'a&&href'
    },
    搜索: '*',
}
