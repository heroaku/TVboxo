function verifyLogin(key) {
    let cnt = 0;
    let cookie = '';
    let content = '';
    let yzm_url = 'https://www.cpldq.com/include/vdimgck.php';
    log(`验证码链接:${yzm_url}`);
    let submit_url = 'https://www.cpldq.com/search.php?scheckAC=check&page=1&searchtype=&order=&tid=&area=&year=&letter=&yuyan=&state=&money=&ver=&jq=';
    log(`post登录链接:${submit_url}`);
    while (cnt < OCR_RETRY) {
        try {
            let {cookie, html} = reqCookie(yzm_url + '?t=' + new Date().getTime(), {toBase64: true});
            let code = OcrApi.classification(html);
            let code1 = eval(code.slice(0, -1));
            log(`第${cnt + 1}次验证码识别结果:${code}->${code1}`);
            html = post(submit_url, {
                headers: {Cookie: cookie},
                body: 'validate=' + code1 + '&searchword=' + key,
            });
            if (/相关搜索结果/.test(html)) {
                content = html;
                return {cookie, html: content} // 需要返回cookie
            } else if (!/相关搜索结果/.test(html) && cnt + 1 >= OCR_RETRY) {
                cookie = ''; // 需要清空返回cookie
            }
        } catch (e) {
            log(`第${cnt + 1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
            }
        }
        cnt += 1
    }
    return {cookie, html: content}
}

globalThis.verifyLogin = verifyLogin;

var rule = {
    title: '一起看[优]',
    host: 'http://www.cpldq.com',
    url: '/cptype/fyclass-fypage.html',
    searchUrl: '/search.php?page=fypage&searchword=**&searchtype=',
    searchable: 0,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '',
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    class_parse: '.top-nav&&li;a&&Text;a&&href;/(\\d+)\.html',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        input = {parse: 1, url: input, js: ''};
    }),
    double: true,
    推荐: '.main&&.bgte1130;ul&&.sb-film-one;*;*;*;*',
    一级: '.sb-area-index&&ul&&.qcontainer;i&&Text;.lazy&&data-original;.other&&Text;a&&href',
    二级: {
        title: '.name&&Text;.ct&&dd&&Text',
        img: '.lazy&&data-original',
        desc: '.ct&&dd:eq(1)&&Text;.ct&&dd:eq(2)&&Text;.ct&&dt:eq(2)&&Text;.ct&&dt&&Text;',
        content: 'div.ee&&Text',
        tabs: '.playfrom&&li',
        lists: '.playlist:eq(#id)&&ul&&li:not(:contains(滈凊))',
        tab_text: 'body--sup&&Text',
        list_text: 'body&&Text',
        list_url: 'a&&href'
    },
    //搜索: '*',
    搜索: $js.toString(() => {
        let cookie = getItem(RULE_CK, '') + ';ssea2_search=ok';
        log('储存的cookie:' + cookie);
        let ret = request(MY_URL, {
            headers: {
                Cookie: cookie,
            }
        });
        if (/系统安全验证/.test(ret)) {
            let login = verifyLogin(KEY);
            cookie = login.cookie;
            if (cookie) {
                log(`本次成功过验证,cookie:${cookie}`);
                setItem(RULE_CK, cookie);
            } else {
                log(`本次自动过搜索验证失败,cookie:${cookie}`);
            }
            ret = login.html;
            // ret = request(MY_URL, {
            //     headers: {
            //         Cookie: cookie,
            //     }
            // });
        }
        let d = [];
        let p = rule.一级.split(';');
        let arr = pdfa(ret, p[0]);
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),
                pic_url: pdfh(it, p[2]),
                desc: pdfh(it, p[3]),

                url: pdfh(it, p[4]),
                content: '',
            });

        });
        setResult(d);
    }),
}
