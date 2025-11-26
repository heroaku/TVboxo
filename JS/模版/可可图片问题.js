var rule = {
    title: '可可影视[优]',
    host: 'https://www.keke8.app',
    //host: 'https://www.kkys01.com',    
    //url: '/show/fyclass-----3-fypage.html',
    url: '/show/fyclass-fyfilter-fypage.html',    
    filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
    searchUrl: '/search?k=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
    cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
    tab_exclude: '可可影视提供',
    tab_order: ['超清', '蓝光9', '极速蓝光'],
    tab_remove: ['4K(高峰不卡)', 'FF线路'],
    /*
    tab_rename: {
        '超清': '🌺风言锋语88🌺超清',
        '蓝光9)': '🌺风言锋语88🌺蓝光9'
    },
    */
    play_parse: true,
    lazy: $js.toString(() => {
        input = {
            parse: 1,
            url: input,
            js: 'document.querySelector("#my-video video").click()',
        }
    }),
    limit: 20,
    推荐: '.section-box:eq(2)&&.module-box-inner&&.module-item;*;*;*;*',
    double: false,
    一级: '.module-box-inner&&.module-item;.v-item-title:eq(1)&&Text;img:last-of-type&&data-original;.v-item-bottom&&span&&Text;a&&href',
    二级: {
        title: '.detail-pic&&img&&alt;.detail-tags&&a:eq(2)&&Text',
        img: '.detail-pic&&img&&data-original',
        desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags&&a&&Text;.detail-tags&&a:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text',
        content: '.detail-desc&&Text',
        tabs: '.source-item-label',
        //tabs: 'body&&.source-item-label[id]',
        lists: '.episode-list:eq(#id) a',
    },
    搜索: '.search-result-list&&a;.title:eq(1)&&Text;*;.search-result-item-header&&Text;a&&href;.desc&&Text',
    预处理: $js.toString(() => {
        let html = request(rule.host);
        let scripts = pdfa(html, 'script');
        let img_script = scripts.find(it => pdfh(it, 'script&&src').includes('rdul.js'));
        if (img_script) {
            let img_url = img_script.match(/src="(.*?)"/)[1];
            //console.log(img_url);
            let img_html = request(img_url);
            let img_host = img_html.match(/'(.*?)'/)[1];
            log(img_host);
            rule.图片替换 = rule.host + '=>' + img_host;
        }
    }),
    filter: 'H4sIAAAAAAAAA+2Zz08bRxTH/5c9c7ANbXFuPbRSpSqX9lCpiiIOrhQ1JYf+UKsIyWAbjCHYIMfEsQOkYDAJ/gFBjllj+5/ZmV3/F931m/dmnLYvm4bm0PqC+LzvzOx49u287+w+tKLWrW8fWt8nfrNuWe55T+xtWDPW4sIPCZN/Wbj/c2LccNEPi0x9lKoHYR+spRmI3k789N39e7+q8O3Pvv78yy++IVWsn8hURokKSCtV/QhqAKTl6k6/ihoAam72XI+pADW5XJDJktIUkJbKyZWnqAHQmLmW23+BYwKQdrItrnqoAdCYK2duaRvHBKDfUFvT/RSQtrozKp+iBkBjZp849jqOCUD9tlZF/gL7AZCWP/IOaa0BSGt2hN1ADQA15/rAa7aVpoDm0jh2Bgc4FwCtbXrZPdLGQGu233DX13DNAIx76xZ7+t4GQFp66L6soQaAmre8Kaq20hQs3QlUSGNRbYtNW6cxcZg0Fkcno/IqLkK3ISp9FcIWo+Oy7LYmWqiQvgFteTWYHANCtCyDLT+IywJAy7lbk9UzXE4Auvb+qe6ngJZl41xrCmjMV4+1poBmO3itNQWkPWoL+xg1AD1m2xyzbfZzulcj6qeAfvv2nsh08bcD0PVeX3q1IV4PQKfLgdwY+jeDMgaZrjpMu/1dWaKbQ0xzTuf9DiKLT5xmatEq+ih3O9iC2Nh2RLsoMvikaKY7URu6eT/Vy3gziOkqg1dwXcemjcgM0W/OdJwebmMKzFT3Wg2vntSpThwq1St9vz0ODkA/8uJIawqMRNOaAiN5tabASF6tKTAS1OgHEHYRxNWl0+sbzztymEWIRWIfqdj4XyM+p+NzZnxWx2fNeEzHY2Y8quNRMx7R8QjFo5Hx9A9Ji0bu+n/i1CDyZoNI0CCiG8QnG0Tj8chd/49uMP9mg/mgwbxuICuXchcfkUD7JD6x4HJrR9h5veDEkwvu9q5FIYtX0aNXk7KED0/MDLspzAC9rl4rLbK4H88F07gz4/f6d0yLojCmhTMfnKHhDAZrIriizpgkruBzRogzLUHBot+nIIxJ4kwLZ3aCQkfXUxDGmPhbob5HCsIYRM6UjVJ90V3BuQDctDGhsHXDxoSzD//UknDWgrMkrO14q4HizAdnWqYFNcQiTAvq/62gzn6ggpqry+SyvH45ce7ToTCFlz01cm8SmE2dLaBcIeSKHXOClYU994wKPUAoY8EUc+6k7eeB9zyJGgBplZwsY7VREMaQuL28cYwDoH4Hz0WFNh8A1D5dvOenFUjwP2XmsOCvPW6DAHS0sy9Eo4AVAYC2wWc78gmutAJd5jf8NaQyP4Yw1uEvrdFNvWPgyunby/z7vV14P5MwfccwfccwtUQmTy2R9d+0RHM3ZYlc+4XoP8Y0ByCtuu/YtntCtZmY5tZs694KSEufi/yh7q05lJHiPiEwRor7TOBWuuKQNi0Amm1uxa00caoAuhT//ScEzrhxluGrxMKPDxaVpoDmyX3mYYwUZ9xk+alzTTstwPSzxLS8TMvLtLz8ubx8/O7lRYfNuz9Krnq/U0oC0CNQrIomnnAU0KzKBf88hI8AAPU7HXqdHPYDoOutPXKL+3g9gDDlhv16zpzE2PMwc25nv55z7wIyHdFM6Uc1gA+eOX6KLP0BxXCgCpwhAAA=',

}
/*

let html = request(rule.host);
→ 请求主页（https://www.keke8.app）
let scripts = pdfa(html, 'script');
→ 用 pdfa（解析 DOM 提取多个元素）提取页面中所有 <script> 标签
let img_script = scripts.find(...)
→ 找到 src 属性中包含 rdul.js 的那个 <script> 标签
→ 说明网站会动态加载一个叫 rdul.js 的 JS 文件，用于处理图片域名
let img_url = img_script.match(/src="(.*?)"/)[1];
→ 从 <script src="..."> 中正则提取 JS 文件完整 URL
→ 例如：https://www.keke8.app/js/rdul.js?v=123
let img_html = request(img_url);
→ 请求这个 rdul.js 文件内容
let img_host = img_html.match(/'(.*?)'/)[1];
→ 从 JS 文件中提取第一个单引号内的字符串
→ 极大概率是图片 CDN 域名，例如：https://img.kekecdn.com
rule.图片替换 = rule.host + '=>' + img_host;
→ 设置一个 图片域名替换规则
→ 含义：所有以 rule.host（即 https://www.keke8.app）开头的图片链接，自动替换为 img_host 开头
💡 为什么需要这个？
网站可能将图片托管在独立 CDN 域名上（如 img.kekecdn.com）
但网页源码中的 data-original 可能仍写成相对路径或主站域名（如 /uploads/xxx.jpg 或 https://www.keke8.app/uploads/xxx.jpg）
但实际图片在 CDN 上：https://img.kekecdn.com/uploads/xxx.jpg
因此，通过预处理动态获取 真实图片域名，然后做全局替换，确保封面图能正常加载
🔄 示例：
假设：

rule.host = 'https://www.keke8.app'
从 rdul.js 中获取到 img_host = 'https://img.kekecdn.com'
则设置：

js
rule.图片替换 = 'https://www.keke8.app=>https://img.kekecdn.com';

1
rule.图片替换 = 'https://www.keke8.app=>https://img.kekecdn.com';
之后，当解析到图片 URL 为：

html
<img data-original="https://www.keke8.app/uploads/123.jpg">

1
<img data-original="https://www.keke8.app/uploads/123.jpg">
系统会自动替换为：
https://img.kekecdn.com/uploads/123.jpg


1
https://img.kekecdn.com/uploads/123.jpg
✅ 这是应对 图片防盗链 / 动态 CDN 切换 的常见手段。
这个 预处理 脚本确实巧妙地解决了前两天你遇到的“图片无法正确抓取”的问题，而且从代码逻辑来看：

✅ 1. 问题根源：图片域名动态加载
网站并没有直接在 HTML 中使用完整的图片 CDN 地址（如 https://img.xxx.com/xxx.jpg），而是：

在 HTML 中使用相对路径或主站路径（如 /uploads/xxx.jpg 或 https://www.keke8.app/uploads/xxx.jpg）
但真实图片托管在另一个动态域名上（例如 https://img.kekecdn.com）
而这个真实域名不是写死的，而是通过一个 JS 文件（如 rdul.js）动态注入
这就导致：

如果直接抓取 data-original 中的图片链接，会得到一个 403/404 或防盗链拒绝 的结果
因为主站可能不托管图片，或者图片服务做了 Referer 校验
✅ 2. 解决方案：动态提取 + 全局替换
这个 预处理 脚本做了三件事：

主动请求 rdul.js 文件（这是关键，绕过了仅解析 HTML 的局限）
从中提取出真实的图片 CDN 域名（通过正则匹配 '...'）
设置 rule.图片替换 = 原站 => CDN，让后续所有图片链接自动重写
这是一种典型的“前端资源动态配置”反爬策略，但并非加密，只是间接引用。
所以你说“没有加密”是对的 —— 没有 Base64 混淆、没有 AES、没有动态 eval 解密，只是普通的 JS 配置加载。 

✅ 3. 对比你前两天的问题
回顾你之前的描述：

“一级图片没抓到”
“二级图片也是一样的，可能图片需要解码，所以处理起来比较麻烦”
现在看来，根本不是“解码”问题，而是“域名替换”问题。
你误以为图片 URL 被“编码”了，其实只是路径正确但域名错误，导致图片加载失败。

而这个 预处理 逻辑正好对症下药：
✅ 不动一级/二级解析逻辑
✅ 不修改图片选择器（仍用 data-original）
✅ 只在全局层面修复图片域名 —— 干净、高效、低侵入


