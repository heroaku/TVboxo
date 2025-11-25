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
好的！我们来 **逐句详细解析** 你提供的这个 drpy2 规则，**重点聚焦在 `预处理` 部分**，也会顺带解释其他关键字段的用途和逻辑。

---

## 🧾 一、整体结构说明

这是一个标准的 **drpy2 规则对象（`var rule = {...}`）**，用于在 **支持 drpy 的影视 App（如月光宝盒、C15、旧版 OK 影视）** 中加载自定义影视站。

关键特征：
- 使用了 **`$js.toString(() => {...})`** 语法（这是 drpy 提供的“安全包装”写法）
- 包含 **预处理（自动获取 Cookie）** 和 **lazy（播放页解析）**
- 属于 **完整 JS 规则**，**不适用于新版 OK 影视（无 JS 引擎）**

---

## 🔍 二、`预处理` 逐句解析

```js
预处理: $js.toString(() => {
```
> ✅ **`$js.toString()`** 是 drpy 的特殊语法，它会把里面的函数体转换成字符串，供 drpy 内部 `eval()` 执行。  
> 这样写的好处是：**避免 JS 语法错误提前报错，也便于调试**。

---

### 第 1 行：发起带 `withHeaders: true` 的请求
```js
const res = request(HOST, {
    headers: rule.headers,
    withHeaders: true,
    redirect: false,
    method: 'GET'
});
```
- **`request(HOST, {...})`**：向 `https://www.03yy.live` 发起 GET 请求
- **`withHeaders: true`**：**关键！** 表示不仅要返回网页内容，还要返回 **响应头（headers）**
- **`redirect: false`**：禁止自动跳转（用于检测是否触发了验证页或 302 跳转）
- **目的**：获取网站返回的 `Set-Cookie` 头，用于后续请求携带 Cookie，**绕过人机验证**

---

### 第 2 行：解析响应结果
```js
const resJson = typeof res === 'string' ? JSON.parse(res) : res;
```
- 因为 `withHeaders: true` 的 `request()` 返回的是 **JSON 字符串**（格式：`{"header1": "val", "header2": "val", "body": "网页内容"}`）
- 所以这里判断：如果是字符串，就 `JSON.parse()` 成对象；否则直接用（兼容性处理）

---

### 第 3–7 行：提取 `Set-Cookie`
```js
const setCookie = resJson['set-cookie'] || '';
```
- 从响应头中提取 `set-cookie` 字段（注意：**header key 是小写**）
- 如果没有，设为空字符串

---

### 第 8–15 行：处理 Cookie 格式
```js
let cookies = '';
if (Array.isArray(setCookie)) {
    cookies = setCookie.map(c => c.split(';')[0].trim()).join('; ');
} else if (setCookie) {
    cookies = setCookie.split(';')[0].trim();
}
```
- 有些网站会返回 **多个 `Set-Cookie`**，此时 `set-cookie` 是数组
- 有些只返回一个，就是字符串
- **`.split(';')[0]`**：只取 cookie 的 **key=value 部分**，丢弃 `Path=`、`Domain=`、`HttpOnly` 等属性
- 最终合并成 `key1=val1; key2=val2` 格式的字符串

> ✅ **为什么只取第一段？**  
> 因为人机验证通常只需要一个 `btwaf` 或 `verify` 类型的 token，其他 cookie 不重要。

---

### 第 16–20 行：更新规则的 headers
```js
if (cookies) {
    rule.headers["cookie"] = rule.headers["cookie"] ?
        rule.headers["cookie"] + '; ' + cookies : cookies;
    rule_fetch_params.headers = Object.assign({}, rule.headers);
}
```
- 如果提取到 cookie，就**追加到 `rule.headers["cookie"]` 中**
- 然后同步更新 `rule_fetch_params.headers`（这是 drpy 内部用于后续请求的全局参数）
- **这样，后续所有 `request()` 都会自动带上这个 Cookie**

---

### 第 22–23 行：日志输出（调试用）
```js
console.log(`提取的Cookie: ${cookies || '无'}`);
console.log(`最终Cookie: ${rule.headers["cookie"] || '无'}`);
```
- 方便在 App 的日志中查看是否成功获取 Cookie

> ✅ **这个预处理的核心目的**：**自动过宝塔防火墙的 5 秒盾验证**。  
> 因为很多站点（如 03影视）首次访问会返回验证页，但只要带上 `Set-Cookie`，后续请求就能正常返回数据。

---

## 🎯 三、`lazy` 播放解析逻辑简析

```js
lazy: $js.toString(() => {
    let html = request(input, { ... });
    html = html.replace(/\\"/g, '"'); // 修复转义引号
```
- `input` 是播放页 URL（如 `/play/123.html`）
- 有些站点会把 JS 代码中的引号转义成 `\"`，这里先还原

---

### 提取关键变量
```js
const nowMatch = html.match(/var\s+now\s*=\s*base64decode\s*\(\s*["']([^"']+)["']\s*\)/);
const prePageMatch = html.match(/var\s+prePage\s*=\s*["']([^"']+)["']/);
const nextPageMatch = html.match(/var\s+nextPage\s*=\s*["']([^"']+)["']/);
```
- 从播放页源码中提取：
  - `now`：**Base64 编码的真实视频地址或 token**
  - `prePage`：当前页面（用于 Referer）
  - `nextPage`：下一集链接（用于拼接）

---

### 解码并判断是否为直链
```js
var now = nowMatch[1];
now = base64Decode(now);
if (/\.(m3u8|mp4|mkv|jpg)/.test(now)) {
    input = {parse: 0, url: now} // 直接播放
}
```
- 如果 `now` 解码后是 `.m3u8` 或 `.mp4`，说明是**直链**，直接返回

---

### 否则走代理解析
```js
let jx = `${HOST}/api/dplayer.php?url=${now}&ref=${encodeURIComponent(prePage)}&next=${encodeURIComponent(nextPage)}`;
let videohtml = request(jx, { ... });
```
- 调用站点自己的 **解析接口**（`/api/dplayer.php`）
- 拿到返回的 JS 代码，从中提取 `mediaInfo = [...]`

---

### 正则提取多清晰度地址
```js
const mediaInfoRegex = /mediaInfo\s*=\s*(\[.*?\]);/gis;
// ...
const urlRegex = new RegExp(`definition.*?${quality}.*?url.*?:.*?"(https.*?)"`, 'is');
```
- 从 `mediaInfo` 数组中匹配 1080P、720P 等清晰度的视频地址
- 最终 `input = { parse: 0, url: ["1080", "https://...", "720", "https://..."] }`  
  （drpy 会自动识别这种数组格式为多线路）

---

## 📌 四、其他关键字段说明

| 字段 | 说明 |
|------|------|
| `url: '/type/indexfyclass-fypage.html'` | 分类页模板，`fyclass` 和 `fypage` 会被替换 |
| `searchUrl: '/search.php?searchword=**'` | 搜索地址，`**` 被替换为关键词 |
| `double: true` | 推荐/一级使用双层定位（`.Pic-list` 内再找 `.pic-content`）|
| `推荐 / 一级 / 二级 / 搜索` | 标准 drpy 解析语法，用 `&&` 分隔选择器 |
| `play_parse: true` | 启用 `lazy` 字段进行播放页解析 |

---

## ✅ 总结

### 这个规则的核心亮点：
1. **自动处理 Cookie 验证**（通过预处理）
2. **智能判断直链 or 代理解析**
3. **支持多清晰度提取**

### 适用环境：
- **✅ 月光宝盒、C15、OK影视 v3.5.8（带 drpy.jar）**
- **❌ 新版 OK 影视（无 JS 引擎）—— 无法执行 `预处理` 和 `lazy`**

### 调试建议：
- 在 App 中开启 **日志**，查看是否成功打印 `提取的Cookie`
- 如果分类页仍返回“人机验证”，说明 `HOST` 请求仍被拦截，可尝试在 `request(HOST, ...)` 前加 `console.log("请求首页...")` 确认是否执行

---


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
    url: '/type/indexfyclass-fypage.html',
    filter_url: '',
    searchUrl: '/search.php?searchword=**',
    searchable: 1,
    quickSearch: 1,
    filterable: 1,

    class_name: '电影&电视剧&综艺&动漫',
    class_url: '1&2&3&4',
    filter_def: {},
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
