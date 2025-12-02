/*
@header({
  searchable: 1,
  filterable: 1,
  quickSearch: 0,
  title: '视觉',
  lang: 'ds'
})
*/

var rule = {
    "类型": "影视",
    title: "视觉",
    host: "https://www.shijue.pro/token.txt",
    url: "/api/ex/v3/security/drama/list",
    homeUrl: "/api/v3/drama/getCategory?orderBy=type_id",
    detailUrl: "/api/v3/drama/getDetail?id=fyid",
    searchUrl: "/api/ex/v3/security/drama/list",
    headers: {
        "User-Agent": "okhttp/3.12.1",
        "Content-Type": "application/json;"
    },
    searchable: 1,
    quickSearch: 0,
    filterable: 1,
    play_parse: true,
    playHeader: {
        "User-Agent": "okhttp/3.12.1"
    },
    key: ["TFLYWVJ5EG5YB1PLZLVVMGVLBGRIDCSW", "nj6E5K4yYYT5W4ScJ3J3rJ2zrzcJkpTk"],
    hostJs: async function () {
        let {HOST} = this;
        try {
            let html = await request(HOST);
            return JSON.parse(html).domain
        } catch (e) {
            return "http://118.25.18.217:6632"
        }
    },
    "预处理": async function () {
    },
    class_parse: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let data = JSON.parse(html);
        const dy = {
            class: "类型",
            area: "地区",
            lang: "语言",
            year: "年份",
            letter: "字母",
            by: "排序",
            sort: "排序"
        };
        const filters = {};
        const classes = [];
        const json_data = data["data"];
        for (let item of json_data) {
            let has_non_empty_field = false;
            const jsontype_extend = JSON.parse(item["converUrl"]);
            classes.push({
                type_name: item["name"],
                type_id: item["id"]
            });
            for (let key in dy) {
                if (key in jsontype_extend && jsontype_extend[key].trim() !== "") {
                    has_non_empty_field = true;
                    break
                }
            }
            if (has_non_empty_field) {
                filters[String(item["id"])] = [];
                for (let dkey in jsontype_extend) {
                    if (dkey in dy && jsontype_extend[dkey].trim() !== "") {
                        const values = jsontype_extend[dkey].split(",");
                        const value_array = values.map(value => {
                                value = value.trim();
                                if (value !== "") {
                                    return {
                                        n: value,
                                        v: value
                                    }
                                }
                            }
                        ).filter(item => item !== undefined);
                        filters[String(item["id"])].push({
                            key: dkey,
                            name: dy[dkey],
                            value: value_array
                        })
                    }
                }
            }
        }
        return {
            class: classes,
            filters: filters
        }
    },
    lazy: async function (flag, id, flags) {
        let {input, getProxyUrl} = this;
        let url = id;
        if (url.includes("vodPlayFrom")) {
            try {
                const path = aes(aes(id, this.key[1], "encrypt"), this.key[0], "encrypt", true);
                const response = await request(`${rule.host}/api/ex/v3/security/videoUsableUrl?query=${path}`);
                const responseData = JSON.parse(response);
                const data = responseData.data;
                log("data:", data);
                url = aes(aes(data, this.key[0], "decrypt"), this.key[1], "decrypt", true).playUrl
            } catch (e) {
                console.error(e)
            }
        }
        if (url.includes(".jpg") || url.includes(".jpeg") || url.includes(".png")) {
            url = `${getProxyUrl()}&url=${base64Encode(unescape(encodeURIComponent(url)))}&type=m3u8`
        }
        return {
            parse: 0,
            url: url,
            header: rule.playHeader
        }
    },
    "推荐": async function () {
        let {input, pdfa, pdfh, pd} = this;
        let VODS = [];
        let html = await request(`${rule.host}/api/ex/v3/security/tag/list`);
        let json = JSON.parse(html);
        let data = json.data;
        let data1 = aes(aes(data, this.key[0]), this.key[1], "decrypt", true);
        data1[0].carousels.forEach(item => {
                let id = item["link"].split("id=")[1];
                VODS.push({
                    vod_id: id,
                    vod_name: item.title,
                    vod_pic: item.cover,
                    vod_remarks: item.sort
                })
            }
        );
        return VODS
    },
    "一级": async function (tid, pg, filter, extend) {
        let {input} = this;
        const params = [];
        if (extend.area) {
            params.push(`vodArea=${extend.area}`)
        }
        if (extend.classs) {
            params.push(`vodClass=${extend.classs}`)
        }
        params.push("pagesize=20");
        params.push(`typeId1=${tid}`);
        params.push(`page=${pg}`);
        if (extend.year) {
            params.push(`vodYear=${extend.year}`)
        }
        const body = params.join("&");
        const path = aes(aes(body, this.key[1], "encrypt"), this.key[0], "encrypt", true);
        let html = await request(`${input}?query=${path}`, {
            headers: this.headers
        });
        const responseData = JSON.parse(html);
        let data = aes(aes(responseData.data, this.key[0], "decrypt"), this.key[1], "decrypt", true);
        const VODS = data.list.map(item => ({
            vod_id: item.id,
            vod_pic: item.coverImage?.path || "",
            vod_name: item.name,
            vod_year: item.year,
            vod_remarks: item.remark
        }));
        return VODS
    },
    "二级": async function (ids) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await post(input);
        const responseData = JSON.parse(html);
        const data = responseData.data;
        const vod = {
            vod_name: data.name || "",
            vod_area: data.area || "",
            type_name: data.clazz || "",
            vod_actor: data.actor || "",
            vod_director: data.director || "",
            vod_content: (data.brief || "").trim()
        };
        const play = [];
        const names = [];
        const plays = {};
        data.videos.forEach(itt => {
                if (!names.includes(itt.sourceCn)) {
                    plays[itt.source] = [];
                    names.push(itt.sourceCn)
                }
                let url = `vodPlayFrom=${itt.source}&playUrl=${itt.path}`;
                if (/\.(mp4|m3u8|flv)$/.test(itt.path)) {
                    url = itt.path
                }
                plays[itt.source].push(`${itt.titleOld}$${url}`)
            }
        );
        for (const key in plays) {
            play.push(plays[key].join("#"))
        }
        vod.vod_play_from = names.join("$$$");
        vod.vod_play_url = play.join("$$$");
        return vod
    },
    "搜索": async function (wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        const body = `pagesize=20&page=${pg}&searchKeys=${wd}`;
        const path = aes(aes(body, this.key[1], "encrypt"), this.key[0], "encrypt", true);
        const response = await request(`${input}?query=${path}`);
        const responseData = JSON.parse(response);
        let data = aes(aes(responseData.data, this.key[0], "decrypt"), this.key[1], "decrypt", true);
        const list = data.list.map(item => ({
            vod_id: item.id,
            vod_pic: item.coverImage?.path || "",
            vod_name: item.name,
            vod_year: item.year,
            vod_remarks: item.remark
        }));
        return list
    },
    proxy_rule: async function (params) {
        let {input, MY_URL} = this;
        const url = decodeURIComponent(base64Decode(input));
        const durl = url.substring(0, url.lastIndexOf("/"));
        const response = await request(url);
        const lines = response.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].includes("#EXT") && !lines[i].includes("http")) {
                lines[i] = durl + (lines[i].startsWith("/") ? "" : "/") + lines[i]
            }
        }
        const updatedData = lines.join("\n");
        return [200, "application/vnd.apple.mpegurl", updatedData]
    }
};

function aes(word, key, mode = "decrypt", parseJson = false) {
    const utf8Key = CryptoJS.enc.Utf8.parse(key);
    let result;
    if (mode === "decrypt") {
        const decodedWord = CryptoJS.enc.Base64.parse(word);
        const decrypted = CryptoJS.AES.decrypt({
            ciphertext: decodedWord
        }, utf8Key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        result = decrypted.toString(CryptoJS.enc.Utf8);
        if (parseJson) {
            result = JSON.parse(result)
        }
    } else if (mode === "encrypt") {
        const utf8Word = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.AES.encrypt(utf8Word, utf8Key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        result = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        if (parseJson) {
            result = encodeURIComponent(result)
        }
    }
    return result
}
