var rule = {
    类型: '影视',
    title: '剧巴巴',
    host: 'https://www.jubaba.cc',
    hostJs: `
        // 人机验证处理函数
        const encrypt = str => {
            const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
            let encodechars = "";
            for(let i=0; i<str.length; i++) {
                const idx = staticchars.indexOf(str[i]);
                const code = idx === -1 ? str[i] : staticchars[(idx+3)%62];
                const rand1 = staticchars[Math.floor(Math.random()*62)];
                const rand2 = staticchars[Math.floor(Math.random()*62)];
                encodechars += rand1 + code + rand2;
            }
            return base64.encode(encodechars);
        };

        // 处理验证流程
        const processVerification = () => {
            const value = encrypt(location.href);
            const token = encrypt("MTc1MDU2NTQ5OA==");
            const data = 'value=' + value + "&token=" + token;
            
            // 发送验证请求
            const res = request('/robot.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: data
            });
            
            // 获取验证Cookie
            return res.headers['Set-Cookie'] || '';
        };

        // 主处理流程
        let html = request(HOST, {headers: {'User-Agent': MOBILE_UA}});
        if (html.includes('verifyBox')) {
            const cookie = processVerification();
            html = request(HOST, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'Cookie': cookie
                }
            });
        }
        HOST = pdfh(html, ".content-top&&a:eq(0)&&href") || HOST;
    `,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    编码: 'utf-8',
    timeout: 5000,
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    play_parse: true,
    lazy: $js.toString(() => {
        let pclick = 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()';
        input = {
            parse: 1,
            url: input,
            js: pclick,
            click: pclick
        }
    }),
    limit: 9,
    double: false,
    推荐: '*',
    一级: '.lazyload;.lazyload&&title;.lazyload&&data-original;.text-right&&Text;a&&href',
    二级: {
        title: 'h1&&span:eq(0)&&Text;.data--span:eq(0)&&Text',
        img: 'img.lazyload&&data-original',
        desc: '.v-thumb&&span&&Text;.data:eq(0)&&a:eq(-1)&&Text;.data:eq(0)&&a:eq(-2)&&Text;.data--span:eq(1)&&Text;.data--span:eq(2)&&Text',
        content: 'meta[name^=description]&&content',
        tabs: '.nav-tabs&&a',
        tab_text: 'body&&Text',
        lists: '.ewave-content__playlist:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },
    搜索: '*',
}
