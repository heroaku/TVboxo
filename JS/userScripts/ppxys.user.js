// ==UserScript==
// @name         maccms-mxonepro
// @namespace    gmspider
// @version      2025.1.11
// @description  maccms GMSpider
// @author       Luomo
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/gh/CatVodSpider-GM/SFW-Spiders@main/Spiders-Lib/maccms-1.0.2.js
// @grant        unsafeWindow
// ==/UserScript==
console.log(JSON.stringify(GM_info));
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
    const GmSpider = MacCmsGMSpider({
        configPicUserAgent: false,
        homeContent: {
            category: {
                select: ".navbar-item",
                slice: [1, 4]
            }
        },
        detailContent: {
            customFunction: function (ids) {
                let vodPlayData = [];
                $(".player-list").each(function (i) {
                    let media = [];
                    $(this).find(".module-play-list .module-play-list-link").each(function () {
                        media.push({
                            name: $(this).text().trim(),
                            type: "webview",
                            ext: {
                                replace: {
                                    playUrl: $(this).attr("href"),
                                }
                            }
                        });
                    })
                    vodPlayData.push({
                        from: $(this).find(".module-tab-item").children().remove().end().text().trim(),
                        media: media
                    })
                })

                return vod = {
                    vod_id: ids[0],
                    vod_name: $(".module-player-side .module-info-heading h1").text().trim(),
                    type_name: $(".module-player-side .module-info-tag-link a").map(function () {
                        return $(this).attr("title");
                    }).get().join(" "),
                    vod_play_data: vodPlayData
                };
            }
        },
        getCategoryFilter: function () {
            const filters = [];
            $(".module-class-item").each(function (i) {
                const filter = {
                    key: "",
                    name: $(this).find(".module-item-title").text().trim(),
                    value: []
                }
                $(this).find(".module-item-box a").each(function () {
                    const params = $(this).attr("href").split(/[/.]/);
                    if (params.length > 4) {
                        filter.key = "index" + i;
                        filter.value.push({
                            n: $(this).text().trim(),
                            v: `/${params[3]}/${params[4]}`
                        })
                    }
                })
                filters.push(filter);
            })
            return filters;
        }
    });
    $(document).ready(function () {
        const result = GmSpider[GMSpiderArgs.fName](...GMSpiderArgs.fArgs);
        if (typeof GmSpiderInject !== 'undefined') {
            GmSpiderInject.SetSpiderResult(JSON.stringify(result));
        }
    });
})();

