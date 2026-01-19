// 写法示例：{"key": "dr_菊朵朵","name": "菊朵朵","type": 3,"api": "./libs/drpy2.min.js","click":"document.querySelector(\"#playleft iframe\").contentWindow.document.querySelector(\"#start\").click();","ext": "./js/影视/菊朵朵.js"},
globalThis.verifyHandler = function(url, options = {}) {
    const opts = {
        type: 'auto', // 'auto', 'firewall', 'captcha'
        ocrRetry: 3,
        withHeaders: false,
        cookie: '',
        autoRetry: true,
        maxLoops: 3, // 最大验证轮次
        ...options
    };
    
    const sendRequest = (requestUrl, requestOptions = {}) => {
        const res = request(requestUrl, {
            headers: rule?.headers || {},
            withHeaders: true,
            redirect: false,
            method: 'GET',
            ...requestOptions
        });
        return typeof res === 'string' ? JSON.parse(res) : res;
    };
    
    const getPhpSessionId = (response) => {
        const cookies = response['set-cookie'] || [];
        const cookieArr = Array.isArray(cookies) ? cookies : [cookies];
        const phpsessid = cookieArr.find(c => c?.includes('PHPSESSID'))?.split(';')[0]?.trim();
        return phpsessid || '';
    };
    
    const encrypt = (str) => {
        const chars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
        const len = chars.length;
        const result = new Array(str.length * 3);

        for (let i = 0, j = 0; i < str.length; i++, j += 3) {
            const char = str[i];
            const idx = chars.indexOf(char);
            const r1 = Math.random() * len | 0;
            const r2 = Math.random() * len | 0;
            result[j] = chars[r1];
            result[j + 1] = idx === -1 ? char : chars[(idx + 3) % len];
            result[j + 2] = chars[r2];
        }

        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result.join('')));
    };
    
    const handleFirewall = (firstRes, originalUrl, cookie = '') => {
        const html = firstRes.body || firstRes;
        let verifycookie = cookie || getPhpSessionId(firstRes);
        
        const tokenMatch = html.match(/var token = encrypt\("([^"]+)"\)/);
        if (!tokenMatch) {
            return { success: false, cookie: verifycookie, content: html, message: '未找到验证token', type: 'firewall' };
        }
        
        const value = encrypt(originalUrl);
        const token = encrypt(tokenMatch[1]);
        const data = 'value=' + value + "&token=" + token;
        const yz_url = (rule?.host || getHome(originalUrl)) + '/robot.php';
        
        const verifyRes = sendRequest(yz_url, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'origin': rule?.host || getHome(originalUrl),
                'referer': rule?.host || getHome(originalUrl),
                'cookie': verifycookie || ''
            },
            method: 'POST',
            body: data
        });
        
        const verifyData = verifyRes.body || verifyRes;
        const verifyMsg = typeof verifyData === 'string' ? (() => {
            try { return JSON.parse(verifyData); } catch { return { msg: verifyData }; }
        })() : verifyData;
        
        if (verifyMsg.msg === 'ok') {
            const start = Date.now();
            while (Date.now() - start < 1000) {}
            
            const finalRes = request(originalUrl, {
                headers: { 'cookie': verifycookie || '' },
                withHeaders: opts.withHeaders,
                redirect: false,
                method: 'GET'
            });
            
            const finalContent = typeof finalRes === 'string' ? finalRes : (finalRes.body || finalRes);
            return {
                success: true,
                cookie: verifycookie,
                content: finalContent,
                message: '防火墙验证通过',
                type: 'firewall'
            };
        }
        
        return { success: false, cookie: verifycookie, content: html, message: '防火墙验证失败', type: 'firewall' };
    };
    
    const handleCaptcha = (firstRes, originalUrl, cookie = '') => {
        let cnt = 0;
        let verifycookie = cookie || getPhpSessionId(firstRes);
        
        const yzm_url = getHome(originalUrl) + '/index.php/verify/index.html';
        const submit_url = getHome(originalUrl) + '/index.php/ajax/verify_check';
        
        while (cnt < opts.ocrRetry) {
            try {
                const r = Math.random();
                const { cookie: captchaCookie, html: captchaHtml } = reqCookie(yzm_url + '?r=' + r, { 
                    toBase64: true,
                    headers: { 'Cookie': verifycookie || '' }
                });
                
                const code = OcrApi.classification(captchaHtml);
                log(`验证码识别[${cnt + 1}/${opts.ocrRetry}]: ${code}`);
                
                const postRes = post(submit_url, {
                    headers: { 
                        'Cookie': verifycookie || captchaCookie || '',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'type=show&verify=' + code,
                });
                
                const result = typeof postRes === 'string' ? JSON.parse(postRes) : postRes;
                
                if (result.code === 1) {
                    log(`验证码验证成功`);
                    
                    const finalRes = request(originalUrl, {
                        headers: { 'cookie': verifycookie || '' },
                        withHeaders: opts.withHeaders,
                        redirect: false,
                        method: 'GET'
                    });
                    
                    const finalContent = typeof finalRes === 'string' ? finalRes : (finalRes.body || finalRes);
                    return {
                        success: true,
                        cookie: verifycookie,
                        content: finalContent,
                        message: '验证码验证通过',
                        type: 'captcha'
                    };
                } else if (cnt + 1 >= opts.ocrRetry) {
                    return {
                        success: false,
                        cookie: verifycookie,
                        content: '',
                        message: '验证码验证失败，超过重试次数',
                        type: 'captcha'
                    };
                }
            } catch (e) {
                log(`验证码验证失败: ${e.message}`);
                if (cnt + 1 >= opts.ocrRetry) {
                    return {
                        success: false,
                        cookie: verifycookie,
                        content: '',
                        message: `验证码验证失败: ${e.message}`,
                        type: 'captcha'
                    };
                }
            }
            cnt += 1;
        }
        
        return { success: false, cookie: verifycookie, content: '', message: '验证码验证失败', type: 'captcha' };
    };
    
    const detectVerifyType = (html) => {
        if (/人机验证|防火墙正在检查/.test(html)) {
            return 'firewall';
        } else if (/系统安全验证/.test(html)) {
            return 'captcha';
        }
        return 'none';
    };
    
    let loopCount = 0;
    let currentCookie = opts.cookie || '';
    let currentContent = '';
    let lastResult = null;
    let verifyHistory = []; // 记录验证历史
    
    while (loopCount < opts.maxLoops) {
        loopCount++;
        log(`第 ${loopCount}/${opts.maxLoops} 轮验证`);
        
        const currentRes = loopCount === 1 ? sendRequest(url) : 
            sendRequest(url, { headers: { 'cookie': currentCookie || '' } });
        
        currentContent = currentRes.body || currentRes;
        
        if (loopCount === 1) {
            currentCookie = opts.cookie || getPhpSessionId(currentRes);
        }
        
        let verifyType = opts.type;
        if (opts.type === 'auto') {
            verifyType = detectVerifyType(currentContent);
        }
        
        if (verifyType === 'none') {
            return {
                success: true,
                cookie: currentCookie,
                content: currentContent,
                message: loopCount === 1 ? '无需验证' : `验证通过，共 ${loopCount} 轮`,
                type: 'none',
                loops: loopCount,
                history: verifyHistory
            };
        }
        
        let verifyResult;
        switch (verifyType) {
            case 'firewall':
                verifyResult = handleFirewall({ body: currentContent }, url, currentCookie);
                break;
            case 'captcha':
                verifyResult = handleCaptcha({ body: currentContent }, url, currentCookie);
                break;
            default:
                continue;
        }
        
        verifyHistory.push({
            loop: loopCount,
            type: verifyType,
            success: verifyResult.success
        });
        
        if (!verifyResult.success) {
            return {
                success: false,
                cookie: currentCookie,
                content: currentContent,
                message: `第 ${loopCount} 轮验证失败: ${verifyResult.message}`,
                type: verifyType,
                loops: loopCount,
                history: verifyHistory
            };
        }
        
        currentCookie = verifyResult.cookie;
        currentContent = verifyResult.content;
        lastResult = verifyResult;
        
        log(`第 ${loopCount} 轮验证成功: ${verifyResult.message}`);                
        if (opts.type !== 'auto') {
            return {
                success: true,
                cookie: currentCookie,
                content: currentContent,
                message: `${verifyType}验证通过`,
                type: verifyType,
                loops: loopCount,
                history: verifyHistory
            };
        }
    }
    
    return {
        success: false,
        cookie: currentCookie,
        content: currentContent,
        message: `超过最大验证轮次 (${opts.maxLoops})`,
        type: lastResult?.type || 'unknown',
        loops: loopCount,
        history: verifyHistory
    };
};

/*
// 手动调用人机验证函数
globalThis.verifyBox = function(url) {
    return globalThis.verifyHandler(url, { type: 'firewall' });
};
// 手动调用数字验证函数
globalThis.verifyLogin = function(url) {
    const result = globalThis.verifyHandler(url, { type: 'captcha', withHeaders: false });
    return result.success ? result.cookie : '';
};

// 自动处理验证函数
globalThis.smartVerify = function(url, cookie = '') {
    return globalThis.verifyHandler(url, { 
        type: 'auto',
        cookie: cookie,
        withHeaders: false,
        maxLoops: 3
    });
};
*/

var rule = {
    title: '菊朵朵',
    host: 'https://www.jddzx.cc',    
    url: '/vodshowfyfilter/page/fypage.html',
    detailUrl: '/vod/fyid.html',
    searchUrl: '/index.php/rss.xml?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: 'dianying&juji&dongman&zongyi&duanju',
    filter: {"dianying":[{"key":"type","name":"类型","value":[{"n":"全部","v":""},{"n":"动作片","v":"/id/dongzuopian"},{"n":"喜剧片","v":"/id/xijupian"},{"n":"爱情片","v":"/id/aiqingpian"},{"n":"科幻片","v":"/id/kehuanpian"},{"n":"恐怖片","v":"/id/kongbupian"},{"n":"剧情片","v":"/id/juqingpian"},{"n":"战争片","v":"/id/zhanzhengpian"},{"n":"动画片","v":"/id/donghuapian"}]},{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"Netflix","v":"/class/Netflix"},{"n":"喜剧","v":"/class/喜剧"},{"n":"爱情","v":"/class/爱情"},{"n":"恐怖","v":"/class/恐怖"},{"n":"动作","v":"/class/动作"},{"n":"科幻","v":"/class/科幻"},{"n":"剧情","v":"/class/剧情"},{"n":"战争","v":"/class/战争"},{"n":"犯罪","v":"/class/犯罪"},{"n":"动画","v":"/class/动画"},{"n":"奇幻","v":"/class/奇幻"},{"n":"武侠","v":"/class/武侠"},{"n":"冒险","v":"/class/冒险"},{"n":"枪战","v":"/class/枪战"},{"n":"悬疑","v":"/class/悬疑"},{"n":"惊悚","v":"/class/惊悚"},{"n":"古装","v":"/class/古装"},{"n":"历史","v":"/class/历史"},{"n":"家庭","v":"/class/家庭"},{"n":"同性","v":"/class/同性"},{"n":"运动","v":"/class/运动"},{"n":"儿童","v":"/class/儿童"},{"n":"经典","v":"/class/经典"},{"n":"青春","v":"/class/青春"},{"n":"文艺","v":"/class/文艺"},{"n":"微电影","v":"/class/微电影"},{"n":"纪录片","v":"/class/纪录片"},{"n":"网络电影","v":"/class/网络电影"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"日本","v":"/area/日本"},{"n":"泰国","v":"/area/泰国"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"新加坡","v":"/area/新加坡"},{"n":"马来西亚","v":"/area/马来西亚"},{"n":"印度","v":"/area/印度"},{"n":"英国","v":"/area/英国"},{"n":"法国","v":"/area/法国"},{"n":"德国","v":"/area/德国"},{"n":"加拿大","v":"/area/加拿大"},{"n":"西班牙","v":"/area/西班牙"},{"n":"俄罗斯","v":"/area/俄罗斯"},{"n":"其它","v":"/area/其它"}]},{"key":"lang","name":"语言","value":[{"n":"全部","v":""},{"n":"汉语普通话","v":"/lang/汉语普通话"},{"n":"国语","v":"/lang/国语"},{"n":"英语","v":"/lang/英语"},{"n":"粤语","v":"/lang/粤语"},{"n":"闽南语","v":"/lang/闽南语"},{"n":"韩语","v":"/lang/韩语"},{"n":"日语","v":"/lang/日语"},{"n":"法语","v":"/lang/法语"},{"n":"德语","v":"/lang/德语"},{"n":"其它","v":"/lang/其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"/year/2026"},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2021","v":"/year/2021"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"},{"n":"2009","v":"/year/2009"},{"n":"2008","v":"/year/2008"},{"n":"2007","v":"/year/2007"},{"n":"2006","v":"/year/2006"},{"n":"2005","v":"/year/2005"},{"n":"2004","v":"/year/2004"},{"n":"2003","v":"/year/2003"},{"n":"2002","v":"/year/2002"},{"n":"2001","v":"/year/2001"},{"n":"2000","v":"/year/2000"},{"n":"1999","v":"/year/1999"},{"n":"1998","v":"/year/1998"},{"n":"1997","v":"/year/1997"},{"n":"1996","v":"/year/1996"},{"n":"1995","v":"/year/1995"},{"n":"1994","v":"/year/1994"},{"n":"1993","v":"/year/1993"},{"n":"1992","v":"/year/1992"},{"n":"1991","v":"/year/1991"},{"n":"1990","v":"/year/1990"},{"n":"1989","v":"/year/1989"},{"n":"1988","v":"/year/1988"},{"n":"1987","v":"/year/1987"},{"n":"1986","v":"/year/1986"},{"n":"1985","v":"/year/1985"},{"n":"1984","v":"/year/1984"},{"n":"1983","v":"/year/1983"},{"n":"1982","v":"/year/1982"},{"n":"1981","v":"/year/1981"},{"n":"1980","v":"/year/1980"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],"juji":[{"key":"type","name":"类型","value":[{"n":"全部","v":""},{"n":"国产剧","v":"/id/guochanju"},{"n":"港台剧","v":"/id/gangtaiju"},{"n":"日韩剧","v":"/id/rihanju"},{"n":"欧美剧","v":"/id/oumeiju"},{"n":"泰国剧","v":"/id/taiguoju"}]},{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"Netflix","v":"/class/Netflix"},{"n":"爱情","v":"/class/爱情"},{"n":"言情","v":"/class/言情"},{"n":"都市","v":"/class/都市"},{"n":"家庭","v":"/class/家庭"},{"n":"战争","v":"/class/战争"},{"n":"喜剧","v":"/class/喜剧"},{"n":"古装","v":"/class/古装"},{"n":"武侠","v":"/class/武侠"},{"n":"偶像","v":"/class/偶像"},{"n":"历史","v":"/class/历史"},{"n":"悬疑","v":"/class/悬疑"},{"n":"科幻","v":"/class/科幻"},{"n":"冒险","v":"/class/冒险"},{"n":"惊悚","v":"/class/惊悚"},{"n":"犯罪","v":"/class/犯罪"},{"n":"运动","v":"/class/运动"},{"n":"恐怖","v":"/class/恐怖"},{"n":"剧情","v":"/class/剧情"},{"n":"奇幻","v":"/class/奇幻"},{"n":"纪录片","v":"/class/纪录片"},{"n":"灾难","v":"/class/灾难"},{"n":"动作","v":"/class/动作"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"日本","v":"/area/日本"},{"n":"泰国","v":"/area/泰国"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"新加坡","v":"/area/新加坡"},{"n":"马来西亚","v":"/area/马来西亚"},{"n":"印度","v":"/area/印度"},{"n":"英国","v":"/area/英国"},{"n":"法国","v":"/area/法国"},{"n":"德国","v":"/area/德国"},{"n":"加拿大","v":"/area/加拿大"},{"n":"西班牙","v":"/area/西班牙"},{"n":"俄罗斯","v":"/area/俄罗斯"},{"n":"其它","v":"/area/其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"/year/2026"},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2021","v":"/year/2021"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"},{"n":"2009","v":"/year/2009"},{"n":"2008","v":"/year/2008"},{"n":"2007","v":"/year/2007"},{"n":"2006","v":"/year/2006"},{"n":"2005","v":"/year/2005"},{"n":"2004","v":"/year/2004"},{"n":"2003","v":"/year/2003"},{"n":"2002","v":"/year/2002"},{"n":"2001","v":"/year/2001"},{"n":"2000","v":"/year/2000"},{"n":"1999","v":"/year/1999"},{"n":"1998","v":"/year/1998"},{"n":"1997","v":"/year/1997"},{"n":"1996","v":"/year/1996"},{"n":"1995","v":"/year/1995"},{"n":"1994","v":"/year/1994"},{"n":"1993","v":"/year/1993"},{"n":"1992","v":"/year/1992"},{"n":"1991","v":"/year/1991"},{"n":"1990","v":"/year/1990"},{"n":"1989","v":"/year/1989"},{"n":"1988","v":"/year/1988"},{"n":"1987","v":"/year/1987"},{"n":"1986","v":"/year/1986"},{"n":"1985","v":"/year/1985"},{"n":"1984","v":"/year/1984"},{"n":"1983","v":"/year/1983"},{"n":"1982","v":"/year/1982"},{"n":"1981","v":"/year/1981"},{"n":"1980","v":"/year/1980"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],"dongman":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"Netflix","v":"/class/Netflix"},{"n":"奇幻","v":"/class/奇幻"},{"n":"动作","v":"/class/动作"},{"n":"科幻","v":"/class/科幻"},{"n":"喜剧","v":"/class/喜剧"},{"n":"冒险","v":"/class/冒险"},{"n":"后宫","v":"/class/后宫"},{"n":"爱情","v":"/class/爱情"},{"n":"悬疑","v":"/class/悬疑"},{"n":"机战","v":"/class/机战"},{"n":"战争","v":"/class/战争"},{"n":"其他","v":"/class/其他"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"日本","v":"/area/日本"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"英国","v":"/area/英国"},{"n":"法国","v":"/area/法国"},{"n":"加拿大","v":"/area/加拿大"},{"n":"西班牙","v":"/area/西班牙"},{"n":"俄罗斯","v":"/area/俄罗斯"},{"n":"其它","v":"/area/其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"/year/2026"},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2021","v":"/year/2021"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"},{"n":"2009","v":"/year/2009"},{"n":"2008","v":"/year/2008"},{"n":"2007","v":"/year/2007"},{"n":"2006","v":"/year/2006"},{"n":"2005","v":"/year/2005"},{"n":"2004","v":"/year/2004"},{"n":"2003","v":"/year/2003"},{"n":"2002","v":"/year/2002"},{"n":"2001","v":"/year/2001"},{"n":"2000","v":"/year/2000"},{"n":"1999","v":"/year/1999"},{"n":"1998","v":"/year/1998"},{"n":"1997","v":"/year/1997"},{"n":"1996","v":"/year/1996"},{"n":"1995","v":"/year/1995"},{"n":"1994","v":"/year/1994"},{"n":"1993","v":"/year/1993"},{"n":"1992","v":"/year/1992"},{"n":"1991","v":"/year/1991"},{"n":"1990","v":"/year/1990"},{"n":"1989","v":"/year/1989"},{"n":"1988","v":"/year/1988"},{"n":"1987","v":"/year/1987"},{"n":"1986","v":"/year/1986"},{"n":"1985","v":"/year/1985"},{"n":"1984","v":"/year/1984"},{"n":"1983","v":"/year/1983"},{"n":"1982","v":"/year/1982"},{"n":"1981","v":"/year/1981"},{"n":"1980","v":"/year/1980"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],"zongyi":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"Netflix","v":"/class/Netflix"},{"n":"纪录片","v":"/class/纪录片"},{"n":"真人秀","v":"/class/真人秀"},{"n":"音乐","v":"/class/音乐"},{"n":"喜剧","v":"/class/喜剧"},{"n":"脱口秀","v":"/class/脱口秀"},{"n":"文化","v":"/class/文化"},{"n":"美食","v":"/class/美食"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"美国","v":"/area/美国"},{"n":"韩国","v":"/area/韩国"},{"n":"日本","v":"/area/日本"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"印度","v":"/area/印度"},{"n":"英国","v":"/area/英国"},{"n":"法国","v":"/area/法国"},{"n":"德国","v":"/area/德国"},{"n":"加拿大","v":"/area/加拿大"},{"n":"西班牙","v":"/area/西班牙"},{"n":"俄罗斯","v":"/area/俄罗斯"},{"n":"其它","v":"/area/其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"/year/2026"},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2021","v":"/year/2021"},{"n":"2020","v":"/year/2020"},{"n":"2019","v":"/year/2019"},{"n":"2018","v":"/year/2018"},{"n":"2017","v":"/year/2017"},{"n":"2016","v":"/year/2016"},{"n":"2015","v":"/year/2015"},{"n":"2014","v":"/year/2014"},{"n":"2013","v":"/year/2013"},{"n":"2012","v":"/year/2012"},{"n":"2011","v":"/year/2011"},{"n":"2010","v":"/year/2010"},{"n":"2009","v":"/year/2009"},{"n":"2008","v":"/year/2008"},{"n":"2007","v":"/year/2007"},{"n":"2006","v":"/year/2006"},{"n":"2005","v":"/year/2005"},{"n":"2004","v":"/year/2004"},{"n":"2003","v":"/year/2003"},{"n":"2002","v":"/year/2002"},{"n":"2001","v":"/year/2001"},{"n":"2000","v":"/year/2000"},{"n":"1990","v":"/year/1990"},{"n":"1980","v":"/year/1980"},{"n":"1970","v":"/year/1970"},{"n":"1960","v":"/year/1960"},{"n":"1950","v":"/year/1950"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],"duanju":[{"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"都市","v":"/class/都市"},{"n":"古装","v":"/class/古装"},{"n":"穿越","v":"/class/穿越"},{"n":"重生","v":"/class/重生"},{"n":"逆袭","v":"/class/逆袭"},{"n":"赘婿","v":"/class/赘婿"},{"n":"战神","v":"/class/战神"},{"n":"神医","v":"/class/神医"},{"n":"甜宠","v":"/class/甜宠"},{"n":"虐恋","v":"/class/虐恋"},{"n":"言情","v":"/class/言情"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}]},
    filter_url: '{{fl.area}}{{fl.by}}{{fl.class}}{{fl.type}}{{fl.lang}}{{fl.year}}',
    filter_def: { dianying: { type: '/id/dianying' }, juji: { type: '/id/juji' }, dongman: { type: '/id/dongman' }, zongyi: { type: '/id/zongyi' }, duanju: { type: '/id/duanju' } },        
    lazy: $js.toString(() => {
        let html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (html.encrypt == '1') {
            url = unescape(url)
        } else if (html.encrypt == '2') {
            url = unescape(base64Decode(url))
        }
        if (/\.m3u8|\.mp4/.test(url)) {
            input = {
                jx: 0,
                url: url,
                parse: 0
            }
        }
    }),
    limit: 9,
    double: false,
    推荐: $js.toString(() => {
        let cookie = getItem('recommend_cookie') || '';
        let result = globalThis.verifyHandler(MY_URL, cookie);        
        let html = '';
        if (result.success && result.cookie) {
            setItem('recommend_cookie', result.cookie);
            html = request(MY_URL, {
                headers: {
                    Referer: rule.host,
                    Cookie: result.cookie,
                    'User-Agent': rule.headers['User-Agent']
                }
            });
        } else {
            html = result.content;
        }        
        let d = [];
        let list = pdfa(html, 'a.module-poster-item.module-item');
        d = list.map(it => ({
            title: pdfh(it, 'a&&title'),
            pic_url: pdfh(it, '.module-item-pic&&img&&data-original'),
            desc: pdfh(it, '.module-item-note&&Text'),
            url: pdfh(it, 'a&&href'),              
        }));
        setResult(d);
    }),    
    一级: $js.toString(() => {
        let cookie = getItem('home_cookie') || '';
        let result = globalThis.verifyHandler(MY_URL, cookie);        
        let html = '';
        if (result.success && result.cookie) {
            setItem('home_cookie', result.cookie);
            html = request(MY_URL, {
                headers: {
                    Referer: rule.host,
                    Cookie: result.cookie,
                    'User-Agent': rule.headers['User-Agent']
                }
            });
        } else {
            html = result.content;
        }        
        let d = [];
        let list = pdfa(html, 'a.module-poster-item.module-item');
        d = list.map(it => ({
            title: pdfh(it, 'a&&title'),
            pic_url: pdfh(it, '.module-item-pic&&img&&data-original'),
            desc: pdfh(it, '.module-item-note&&Text'),
            url: pdfh(it, 'a&&href'),
        }));
        setResult(d);
    }),    
    二级: {
        title: 'h1&&Text;.module-info-tag-link:eq(2)&&Text',
        img: 'img.lazyload&&data-original||src',
        desc: '.module-info-item:eq(4)&&Text;.module-info-item:eq(3)&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text',
        content: 'meta[name^=description]&&content',
        tabs: '.module-tab-items-box span',
        tab_text: 'body&&Text',
        lists: '.module-play-list-content:eq(#id)&&a',
        list_text: 'body&&Text',
        list_url: 'a&&href',
    },    
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
}
