// ==UserScript==
// @name         hitv
// @namespace    gmspider
// @version      2024.11.12
// @description  Hi视频 GMSpider
// @author       Luomo
// @match        https://www.upfuhn.com/*
// @require      https://cdn.jsdelivr.net/gh/CatVodSpider-GM/Spiders-Lib@main/lib/browser-extension-url-match-1.2.0.min.js
// @require      https://cdn.jsdelivr.net/gh/CatVodSpider-GM/SFW-Spiders@main/Spiders-Lib/ajaxHooker-1.4.3.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
console.log(JSON.stringify(GM_info));
(function () {
    const GMSpiderArgs = {};
    if (typeof GmSpiderInject !== 'undefined') {
        let args = JSON.parse(GmSpiderInject.GetSpiderArgs());
        GMSpiderArgs.fName = args.shift();
        GMSpiderArgs.fArgs = args;
    } else {
        // GMSpiderArgs.fName = "homeContent";
        // GMSpiderArgs.fArgs = [true];
        GMSpiderArgs.fName = "searchContent";
        GMSpiderArgs.fArgs = ["82", 2, true, {tag: "动作", y: "2024", o: "1", a: "大陆"}];
    }
    Object.freeze(GMSpiderArgs);
    let hookConfigs = {
        "homeContent": [
            {
                matcher: matchPattern("https://*/*/meta/*.json").assertValid(),
                onResponseHook: function (response) {
                    let executed = false;
                    unsafeWindow.useNuxtApp().hook('link:prefetch', () => {
                        if (!executed) {
                            Array.from(document.querySelectorAll(".left-wrap .tab-box:nth-child(2) .swiper-slide span")).find(el => el.textContent === "全部").dispatchEvent(new Event("click"));
                        }
                        executed = true;
                    });
                }
            },
            {
                dataKey: "ys_video_sites", matcher: matchPattern("https://*/v1/ys_video_sites?*").assertValid()
            }
        ],
        "categoryContent": [{
            matcher: matchPattern("https://*/*/meta/*.json").assertValid(),
            onResponseHook: function (response) {
                const extend = GMSpiderArgs.fArgs[3];
                let tag = extend?.tag ?? "全部"
                let executed = false;
                unsafeWindow.useNuxtApp().hook('link:prefetch', () => {
                    if (!executed) {
                        Array.from(document.querySelectorAll(".left-wrap .tab-box:nth-child(2) .swiper-slide span"))
                            .find(el => el.textContent === tag).dispatchEvent(new Event("click"));
                    }
                    executed = true;
                });
            }
        }, {
            dataKey: "ys_video_sites",
            matcher: matchPattern("https://*/v1/ys_video_sites?*").assertValid(),
            onRequestHook: function (response) {
                const page = GMSpiderArgs.fArgs[1];
                const filter = GMSpiderArgs.fArgs[2];
                const extend = GMSpiderArgs.fArgs[3];
                const url = new URL(response.url);
                const params = new URLSearchParams(url.search);
                params.set("pn", page)
                if (filter) {
                    params.set("a", extend?.a ?? "");
                    params.set("y", extend?.y ?? "");
                    params.set("o", extend?.o ?? 0);
                }
                url.search = params.toString();
                response.url = url.toString();
            }
        }],
        "detailContent": [{
            dataKey: "meta",
            matcher: matchPattern("https://*/*/meta/*.json").assertValid(),
        }],
        "searchContent": [{
            dataKey: "meta",
            matcher: matchPattern("https://*/*/meta/*.json").assertValid(),
        }],
    };
    const GmSpider = (function () {
        const categoryFilterCachePrefix = "category_";
        const filterTag = {
            key: "tag", name: "分类", value: []
        };
        const filterArea = {
            key: "o", name: "地区", value: []
        };
        const filterYear = {
            key: "y", name: "年份", value: []
        };
        const filterSort = {
            key: "o",
            name: "排序",
            value: [{n: "综合", v: "0"}, {n: "最新", v: "2"}, {n: "最热", v: "1"}, {n: "评分", v: "5"},]
        };
        return {
            homeContent: function (filter) {
                //清理cookie
                document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                let result = {
                    class: [{type_id: "85", type_name: "短剧"}, {type_id: "81", type_name: "电影"}, {
                        type_id: "82",
                        type_name: "电视剧"
                    }, {type_id: "83", type_name: "综艺"}, {type_id: "84", type_name: "动漫"},], filters: {}, list: []
                };
                document.querySelectorAll(".left-wrap .tab-box:nth-child(3) .swiper-slide span").forEach((filter) => {
                    filterArea.value.push({
                        n: filter.textContent, v: filter.textContent,
                    })
                });
                document.querySelectorAll(".left-wrap .tab-box:nth-child(4) .swiper-slide span").forEach((filter) => {
                    filterYear.value.push({
                        n: filter.textContent, v: filter.textContent,
                    })
                });
                result.class.forEach((category) => {
                    const categoryFilter = [];
                    const cacheFilter = localStorage.getItem(categoryFilterCachePrefix + category.type_id);
                    if (typeof cacheFilter !== "undefined" && cacheFilter !== null) {
                        categoryFilter.push(JSON.parse(cacheFilter));
                    }
                    categoryFilter.push(filterArea, filterYear, filterSort);
                    result.filters[category.type_id] = categoryFilter;
                })
                hookResult.ys_video_sites.data.data.forEach((media) => {
                    result.list.push({
                        vod_id: media.video_site_id,
                        vod_name: media.video_name,
                        vod_pic: media.video_vertical_url,
                        vod_remarks: "评分：" + media.score,
                        vod_year: media.years
                    })
                });
                return result;
            }, categoryContent: function (tid, pg, filter, extend) {
                let result = {
                    list: [], pagecount: Math.ceil(hookResult.ys_video_sites.data.total / 21)
                };
                document.querySelectorAll(".left-wrap .tab-box:nth-child(2) .swiper-slide span").forEach((filter) => {
                    filterTag.value.push({
                        n: filter.textContent, v: filter.textContent,
                    })
                });
                localStorage.setItem(categoryFilterCachePrefix + tid, JSON.stringify(filterTag));
                hookResult.ys_video_sites.data.data.forEach((media) => {
                    result.list.push({
                        vod_id: media.video_site_id,
                        vod_name: media.video_name,
                        vod_pic: media.video_vertical_url,
                        vod_remarks: "评分：" + media.score,
                        vod_year: media.years
                    })
                })
                return result;
            }, detailContent: function (ids) {
                let playUrl = [];
                let vod = {};
                const nuxtData = JSON.parse(JSON.stringify(unsafeWindow.__NUXT__.data));
                for (const [key, value] of Object.entries(nuxtData)) {
                    if (typeof (value.data?.ys_video_site) != "undefined") {
                        value.data.data.forEach((item) => {
                            playUrl.push({
                                name: item.series_num,
                                type: "finalUrl",
                                ext: {
                                    header: {
                                        "User-Agent": window.navigator.userAgent,
                                        "Referer": window.location.href
                                    },
                                    url: item.video_url
                                }
                            })
                        })
                        const ysVideoSite = value.data.ys_video_site;
                        vod = {
                            vod_id: ysVideoSite.video_site_id,
                            vod_name: ysVideoSite.video_name,
                            vod_content: ysVideoSite.video_desc,
                            vod_year: ysVideoSite.years,
                            vod_area: ysVideoSite.area,
                            vod_actor: ysVideoSite.main_actor,
                            type_name: ysVideoSite.tag,
                            vod_play_data: [{
                                from: "Hi视频",
                                media: playUrl
                            }]
                        };

                    }
                }
                return vod;
            }, searchContent: function (key, quick, pg) {
                const result = {
                    list: [],
                    page: pg,
                    pagecount: 1
                };
                const nuxtData = JSON.parse(JSON.stringify(unsafeWindow.__NUXT__.data));
                for (const [key, value] of Object.entries(nuxtData)) {
                    if (typeof (value.data?.first_video_series) != "undefined") {
                        if (value.data.first_video_series != null) {
                            const firstVideo = value.data.first_video_series
                            result.list.push({
                                vod_id: firstVideo.video_site_id,
                                vod_name: firstVideo.video_name,
                                vod_pic: firstVideo.video_vertical_url,
                                vod_remarks: firstVideo.tag,
                                vod_year: firstVideo.years
                            })
                        }
                        value.data.video_sites.forEach((video) => {
                            result.list.push({
                                vod_id: video.video_site_id,
                                vod_name: video.video_name,
                                vod_pic: video.video_vertical_url,
                                vod_remarks: video.tag,
                                vod_year: video.years
                            })
                        })
                    }
                }
                return result;
            }
        };
    })();
    let spiderExecuted = false;
    let dataReadyCount = 0;
    let hookResult = {};
    ajaxHooker.hook(request => {
        hookConfigs[GMSpiderArgs.fName].forEach((hookConfig) => {
            if (typeof hookConfig.onRequestHook === "function" && hookConfig.matcher.match(request.url.startsWith("http") ? request.url : unsafeWindow.window.location.origin + request.url)) {
                hookConfig.onRequestHook(request);
            }
        });
        if (!spiderExecuted) {
            let dataTodoCount = 0;
            hookConfigs[GMSpiderArgs.fName].forEach((hookConfig) => {
                if (typeof hookConfig.dataKey !== "undefined") {
                    if (hookConfig?.require !== false) {
                        dataTodoCount++;
                    }
                }
                if (hookConfig.matcher.match(request.url.startsWith("http") ? request.url : unsafeWindow.window.location.origin + request.url)) {
                    request.response = res => {
                        if (typeof hookConfig.onResponseHook === "function") {
                            hookConfig.onResponseHook(res);
                        }
                        if (typeof hookConfig.dataKey !== "undefined") {
                            if (hookConfig?.require !== false) {
                                dataReadyCount++;
                            }
                            let data = JSON.parse(res.text);
                            if (typeof data === 'object' && data) {
                                hookResult[hookConfig.dataKey] = data;
                            } else {
                                hookResult[hookConfig.dataKey] = res.text;
                            }
                            if (dataTodoCount === dataReadyCount) {
                                spiderExecuted = true;
                                const result = GmSpider[GMSpiderArgs.fName](...GMSpiderArgs.fArgs);
                                console.log(result);
                                if (typeof GmSpiderInject !== 'undefined' && spiderExecuted) {
                                    GmSpiderInject.SetSpiderResult(JSON.stringify(result));
                                }
                            }
                        }
                    };
                }

            });
        }
    });
})();