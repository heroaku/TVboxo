// ==UserScript==
// @name         gaze
// @namespace    gmspider
// @version      2024.12.01
// @description  gaze GMSpider
// @author       Luomo
// @match        https://gaze.run/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@3.0.3/dist/ajaxhook.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/blob-util@2.0.2/dist/blob-util.min.js
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
console.log(JSON.stringify(GM_info));
(function () {
    Object.defineProperty(Object.prototype, '_detectLoopStopped', {
        set: function () {
            return true;
        },
        get: function () {
            console.log("devtools-detector disabled");
            return false;
        }
    });
})();
(function () {
    const GMSpiderArgs = {};
    if (typeof GmSpiderInject !== 'undefined') {
        let args = JSON.parse(GmSpiderInject.GetSpiderArgs());
        GMSpiderArgs.fName = args.shift();
        GMSpiderArgs.fArgs = args;
    } else {
        GMSpiderArgs.fName = "detailContent";
        GMSpiderArgs.fArgs = [true];
    }
    Object.freeze(GMSpiderArgs);

    let _gotData = function (data) {
        console.log("_gotData hook failed", data)
    };
    let hookRequestUrl = "";
    const {unProxy, originXhr} = proxy({
        onRequest: (config, handler) => {
            let params = {};
            switch (GMSpiderArgs.fName) {
                case "categoryContent":
                    let filter = GMSpiderArgs.fArgs[3];
                    params = {
                        mform: GMSpiderArgs.fArgs[0],
                        mcountry: filter?.mcountry ?? "all",
                        "tag_arr[]": filter?.mtag ?? "all",
                        page: GMSpiderArgs.fArgs[1],
                        sort: filter?.sort ?? "updatetime",
                        album: "all",
                        title: "",
                        years: filter?.years ?? "all",
                    };
                    break;
                case "searchContent":
                    let title = GMSpiderArgs.fArgs[0];
                    params = {
                        mform: "all",
                        mcountry: "all",
                        "tag_arr[]": "all",
                        page: GMSpiderArgs.fArgs[2],
                        sort: "updatetime",
                        album: "all",
                        title: GMSpiderArgs.fArgs[0],
                        years: "all",
                    };
                    break;
            }
            if (config.url.includes("filter_movielist")) {
                if (!$.isEmptyObject(params)) {
                    config.body = $.param(params)
                }
            }
            handler.next(config);
        },
        onResponse: (response, handler) => {
            if (response.config.url.includes("filter_movielist")) {
                let data = JSON.parse(response.response);
                _gotData(data);
            }
            handler.next(response);
        }
    }, unsafeWindow)

    let _gotSrc = function (src) {
        console.log("_gotSrc hook failed", data)
    };
    let _player;
    Object.defineProperty(unsafeWindow, 'player', {
        configurable: true,
        get: () => _player,
        set: (player) => {
            _player = new Proxy(player, {
                get(target, prop) {
                    if (prop === "src") {
                        // console.log("src", src);
                        return new Proxy(target[prop], {
                            apply: (target, thisArg, argumentsList) => {
                                _gotSrc(argumentsList[0]);
                                // return false;
                                return Reflect.apply(target, thisArg, argumentsList);
                            }
                        });
                    } else {
                        return Reflect.get(target, prop);
                    }
                }
            })
        },
    });
    const GmSpider = (function () {
        function listVideos(result) {
            return new Promise(function (resolve) {
                _gotData = resolve;
            }).then(async (movieList) => {
                console.log("movelist", movieList);
                movieList.mlist.forEach(function (item) {
                    result.list.push({
                        vod_id: item.mid,
                        vod_name: item.title,
                        vod_pic: item.cover_img,
                        vod_remarks: "豆瓣 " + item.grade,
                        vod_year: item.definition
                    })
                })
                result.pagecount = movieList.pages;
                return result;
            });
        }

        async function getPlay(src) {
            let playData = {};
            if (src.startsWith("blob:")) {
                let blob = await fetch(src).then(r => r.blob());
                await blobUtil.blobToBinaryString(blob).then(function (fileData) {
                    fileData = fileData.replaceAll('Â ', "");
                    playData = {
                        type: "file",
                        ext: {
                            header: {
                                "User-Agent": window.navigator.userAgent,
                                "Referer": window.location.href
                            },
                            file: fileData
                        }
                    }
                });
            } else {
                playData = {
                    type: "match"
                }
            }
            return playData;
        }

        return {
            homeContent: function (filter) {
                const defaultFilters = [{
                    key: "mcountry",
                    name: "地区",
                    value: []
                }, {
                    key: "mtag",
                    name: "类型",
                    value: []
                }, {
                    key: "sort",
                    name: "排序",
                    value: []
                }];
                defaultFilters.forEach((item) => {
                    $(`.${item.key} .filter-item a`).each(function () {
                        item.value.push({
                            n: $(this).text(),
                            v: $(this).data("filter")
                        });
                    })
                })
                let yearFilter = [{
                    n: "全部年份",
                    v: "all"
                }];
                let thisYear = new Date().getFullYear();
                for (let i = 0; i <= 20; i++) {
                    yearFilter.push({
                        n: thisYear - i,
                        v: thisYear - i,
                    })
                }
                defaultFilters.push({
                    key: "years",
                    name: "年份",
                    value: yearFilter
                })
                const result = {
                    class: [
                        {type_id: "1", type_name: "电影"},
                        {type_id: "2", type_name: "电视剧"},
                        {type_id: "bangumi", type_name: "番剧"},
                        {type_id: "chinese_cartoon", type_name: "国漫"},
                    ],
                    filters: {
                        "1": defaultFilters,
                        "2": defaultFilters,
                        "bangumi": defaultFilters,
                        "chinese_cartoon": defaultFilters,
                    },
                    list: []
                };
                return listVideos(result);
            },
            categoryContent: function (tid, pg, filter, extend) {
                console.log(tid, pg, filter, JSON.stringify(extend));
                let result = {
                    list: [],
                    limit: 24,
                    pagecount: 0
                };
                return listVideos(result);
            },
            detailContent: function (ids) {
                let media = [];
                $("#btngroup .playbtn").each(function () {
                    media.push({
                        name: $(this).text().trim(),
                        type: "webview",
                        ext: {
                            replace: {
                                mcid: unsafeWindow.mcid,
                                path: $(this).data("path")
                            }
                        }
                    })
                })
                return {
                    vod_id: ids[0],
                    vod_name: $(".d-flex .grade:first").text().trim(),
                    vod_pic: $(".d-flex .pimgs").attr("src"),
                    vod_remarks: $(".d-flex .grade:eq(1)").text().trim(),
                    vod_content: $(".d-flex p").text().trim(),
                    vod_play_data: [{
                        from: "注视影视",
                        media: media
                    }]
                };
            },
            playerContent: function (flag, id, vipFlags) {
                console.log(flag, id, unsafeWindow.mid);
                localStorage.setItem('mobj' + unsafeWindow.mid, JSON.stringify({
                    video_index: window.location.hash.split("#").at(1),
                    video_time: 1
                }));
                return new Promise(function (resolve) {
                    _gotSrc = resolve;
                }).then(async (playerSrc) => {
                    return await getPlay(playerSrc.src);
                });
            },
            searchContent: function (key, quick, pg) {
                const result = {
                    list: [],
                    page: pg,
                    pagecount: 0
                };
                return listVideos(result);
            }
        };
    })();
    $(unsafeWindow).on("load", async function () {
        if (document.readyState === 'complete') {
            const result = await GmSpider[GMSpiderArgs.fName](...GMSpiderArgs.fArgs);
            console.log(GMSpiderArgs.fName, JSON.stringify(result));
            if (typeof GmSpiderInject !== 'undefined') {
                GmSpiderInject.SetSpiderResult(JSON.stringify(result));
            }
        }
    });
})();

