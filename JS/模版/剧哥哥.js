globalThis.verifyBox = function(HOST, rule) {
    const firstRes = request(HOST, {
        headers: rule.headers,
        withHeaders: true,
        redirect: false,
        method: 'GET'
    });
    const res = typeof firstRes === 'string' ? JSON.parse(firstRes) : firstRes;
    const html = res.body || firstRes;
    if (!html.includes('人机验证') && !html.includes('防火墙正在检查您的访问')) {
        return html;
    }
    const setCookie = res['set-cookie'] || '';
    let phpsessid = '';
    if (Array.isArray(setCookie)) {
        for (const c of setCookie) {
            if (c.includes('PHPSESSID')) {
                phpsessid = c.split(';')[0].trim();
                break;
            }
        }
    } else if (setCookie.includes('PHPSESSID')) {
        phpsessid = setCookie.split(';')[0].trim();
    }
    if (phpsessid) {
        rule.headers.cookie = phpsessid;
        if (typeof rule_fetch_params !== 'undefined') {
            rule_fetch_params.headers = {
                ...rule.headers
            };
        }
    }
    const tokenMatch = html.match(/var token = encrypt\("([^"]+)"\)/);
    if (!tokenMatch) return html;
    const encrypt = (str) => {
        const staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        let encodechars = "";
        for (let i = 0; i < str.length; i++) {
            const idx = staticchars.indexOf(str[i]);
            const code = idx === -1 ? str[i] : staticchars[(idx + 3) % 62];
            encodechars += staticchars[Math.floor(Math.random() * 62)] +
                code +
                staticchars[Math.floor(Math.random() * 62)];
        }
        try {
            return btoa(encodechars);
        } catch (e) {
            if (typeof Buffer !== 'undefined') {
                return Buffer.from(encodechars).toString('base64');
            }
            return encodechars;
        }
    };
    const value = encrypt(HOST);
    const token = encrypt(tokenMatch[1]);
    const postData = `value=${value}&token=${token}`;
    const verifyRes = request(`${rule.host}/robot.php`, {
        headers: {
            ...rule.headers,
            'content-type': 'application/x-www-form-urlencoded',
            'origin': rule.host,
            'referer': HOST
        },
        withHeaders: true,
        method: 'POST',
        body: postData
    });
    const verifyJson = typeof verifyRes === 'string' ? JSON.parse(verifyRes) : verifyRes;
    let verifyBody;
    if (typeof verifyJson.body === 'string') {
        try {
            verifyBody = JSON.parse(verifyJson.body);
        } catch {
            verifyBody = {
                msg: 'error'
            };
        }
    } else {
        verifyBody = verifyJson.body || verifyJson;
    }
    if (verifyBody.msg === 'ok') {
        const start = Date.now();
        while (Date.now() - start < 1500) {}
        const finalRes = request(HOST, {
            headers: rule.headers,
            withHeaders: false,
            redirect: false,
            method: 'GET'
        });
        return typeof finalRes === 'string' ? finalRes : (finalRes.body || finalRes);
    }
    return html;
};

globalThis.verifyLogin = function(url, options = {}) {
    const RULE_CK = options.storageKey || 'verify_cookie';
    const OCR_RETRY = options.maxRetry || 3;
    let cookie = getItem(RULE_CK, '');
    if (cookie) {
        let ret = request(url, {
            headers: {
                Referer: encodeUrl(url),
                Cookie: cookie,
            }
        });
        if (!/系统安全验证/.test(ret)) {
            return {
                cookie: cookie,
                html: ret
            };
        }
    }
    let cnt = 0;
    let r = Math.random();
    let yzm_url = getHome(url) + '/index.php/verify/index.html';
    let submit_url = getHome(url) + '/index.php/ajax/verify_check';
    while (cnt < OCR_RETRY) {
        try {
            let {
                cookie: newCookie,
                html
            } = reqCookie(yzm_url + '?r=' + r, {
                toBase64: true
            });
            let code = OcrApi.classification(html);
            html = post(submit_url, {
                headers: {
                    Cookie: newCookie
                },
                body: 'type=show&verify=' + code,
            });
            html = JSON.parse(html);
            if (html.code === 1) {
                cookie = newCookie;
                setItem(RULE_CK, cookie);
                let ret = request(url, {
                    headers: {
                        Referer: encodeUrl(url),
                        Cookie: cookie,
                    }
                });
                return {
                    cookie: cookie,
                    html: ret
                };
            } else if (html.code !== 1 && cnt + 1 >= OCR_RETRY) {
                cookie = '';
                setItem(RULE_CK, '');
            }
        } catch (e) {
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
                setItem(RULE_CK, '');
            }
        }
        cnt += 1;
    }
    return {
        cookie: '',
        html: ''
    };
};

Object.assign(muban.mxpro.二级, {
    tab_text: 'div--small&&Text',
});
var rule = {
    模板: 'mxpro',
    title: '剧哥哥',
    host: 'https://www.jugege.vip',
    hostJs: $js.toString(() => {
        rule.headers = rule.headers || {};
        let Html = globalThis.verifyBox(HOST, rule);
        let url = jsp.pdfh(Html, "ul li:eq(1) a&&href");
        HOST = url;
    }),
    url: '/vodshow/fyfilter.html',
    searchUrl: '/rss/index.xml?wd=**',
    filter_url: '{{fl.cateId}}-{{fl.area}}-{{fl.by}}-{{fl.class}}-----fypage---{{fl.year}}',
    filter_def: {1: {cateId: '1'},2: {cateId: '2'},4: {cateId: '4'},3: {cateId: '3'}},    
    lazy: "js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    一级: $js.toString(() => {
        const result = globalThis.verifyLogin(MY_URL, {
            storageKey: 'verify_cookie',
            maxRetry: 3
        });
        let d = [];
        let p = 'body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href'.split(';');
        let arr = pdfa(result.html, p[0]);
        arr.forEach(it => {
            d.push({
                title: pdfh(it, p[1]),
                pic_url: pdfh(it, p[2]),
                desc: pdfh(it, p[3]),
                url: pdfh(it, p[4]),
            });
        });
        setResult(d);
    }),
    搜索: $js.toString(() => {
        let html = request(input);
        let items = pdfa(html, 'rss&&item');
        let d = [];
        items.forEach(it => {
            it = it.replace(/title|link|author|pubdate|description/g, 'p');
            let url = pdfh(it, 'p:eq(1)&&Text');
            d.push({
                title: pdfh(it, 'p&&Text'),
                url: url,
                desc: pdfh(it, 'p:eq(3)&&Text'),
                content: pdfh(it, 'p:eq(2)&&Text'),
                pic_url: "",
            });
        });
        setResult(d);
    }),    
    filter: 'H4sIAAAAAAAAA+2W308aQRDH/5d79sEDf9V/pfGBGpKaWpuAbUIMSSuCoFaEIEpFa1P5oRWB1lo5cvDP3O7Jf9GF3ZlZWnshbR/v7T7f2dmd2dnduQ3DNBafbhgvwjFj0VheDUWjxpSxFnoZFsgyNZ5ICn4TWn0dHo1bG8rJ+iBRH8oCjPiUUotlMV6pCsDmpttqIgKw8XcH/G1R2RTgnDt1xy7DnBJwzlqOdbowpwT0w8AJcL30sWNlYD0JYHtoVNnelbIpwPV2mq4NNgVanG6hS3EOAW2VbYpTAcbSqDq9c4hFAvql8oPSJfhJQL+zKxE5+EmYZD/55rVbzIFNAtoSO3zzA9gkYO7dLEveQ+4SwDY4zfPjirIpwDmL2w8ZC+aUgPn1btzCd2a3IUVkHJG9ePiMVZSAtv0Uy34FmwSsYv9A1ACqKIF2tcxPc7irI0DbVt/9ApkowB2wc263PBbwmBRfGo6UtygUCYe0S1RusT1r0kt0URuUUhCCBNzoaonfN2GjJdBWtXinh1s1Agy9t89ObAhaAhbo2yHZFOA27rbJpgD9jiq8fA1+EjDOj5fkp4CK/oNsCiiWlh5La8zvfYtZVfCTgH5bWbFTLA13hRgzqfTdbMPNlCAZZLrA53y3L9zwDgPjiOSd04VrpUAveiwcimhF79w6XXvCogemAzNKG31qepD0oK4HSA/oukm6qevTpE9ruvkEdfGp6QukL+j6POnzuj5H+pyuz5I+q+uUr6nna1K+pp6vSfmaer4m5Wvq+ZqUr/jUy/QsRkXi+3lmZX8rEj+6GxzdqgnWV8RQmNixLN4qKMvzlfUonbDmFkvDvY0uv4qEh6suTRmB/9VdPd5Cr47m1ZXZzR2zGmCTMGG3+2NX9up2Xl3Z6z336j5iDl6CR1EBlqvzid56BbjeYYo6qIJJ/lY8/zoe69h+X/D7gt8X/L7wS18Ian3BPyL+EXnkiMxoR+RfWseJ7Vj4fkmY5Lnm1zXRFMAmwX/0/BP91yc6/hNlKCPlbBIAAA==',    
}
