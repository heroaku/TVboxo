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
        GMSpiderArgs.fArgs = [1, 109];
    }
    Object.freeze(GMSpiderArgs);
    const GmSpider = MacCmsGMSpider({
        configPicUserAgent: false,
        pageCountStyle: ".stui-page__item li.hidden-xs:last:not(.active)",
        homeContent: {
            category: {
                select: ".stui-header__menu li",
                slice: [1, 7]
            }
        },
        detailContent: {
            customFunction: function (ids) {
                let items = {};
                $(".stui-content__detail .data").each(function () {
                    const item = $(this).text().trim().split("：");
                    items[item[0]] = item[1];
                });
                let vodPlayData = [];
                $(".stui-content__playlist:first").each(function (i) {
                    let media = [];
                    $(".stui-content__playlist:first a").each(function () {
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
                        from: "在线之家",
                        media: media
                    })
                })

                return vod = {
                    vod_id: ids[0],
                    vod_name: $(".stui-content__detail .title").text().trim(),
                    vod_pic: $(".stui-content__thumb img").data("original"),
                    vod_remarks: items?.["更新"] || "",
                    vod_director: items?.["导演"] || "",
                    vod_actor: items?.["主演"] || "",
                    vod_content: $(".stui-content__thumb .detail-content").text().trim(),
                    vod_play_data: vodPlayData
                };
            }
        },
        getVodList: function () {
            let vodList = [];
            $("a.stui-vodlist__thumb").each(function () {
                vodList.push({
                    vod_id: $(this).attr("href"),
                    vod_name: $(this).attr("title"),
                    vod_pic: $(this).data("original"),
                    vod_remarks: $(this).find(".pic-text").text().trim()
                })
            });
            return vodList;
        },
        getCategoryFilter: function () {
            const filters = [];
            $("#screenbox .clearfix:gt(0)").each(function () {
                const filter = {
                    key: "",
                    name: $(this).find("li:first").text().trim(),
                    value: []
                }
                $(this).find("a").each(function () {
                    const params = $(this).attr("href").split(/[/.]/).at(2).split("-").slice(1);
                    filter.key = "index" + params.findIndex((element) => element.length > 0)
                    filter.value.push({
                        n: $(this).text().trim(),
                        v: params.find((element) => element.length > 0) || ""
                    })
                })
                filters.push(filter);
            })
            return filters;
        }
    });
    $(document).ready(function () {
        const result = GmSpider[GMSpiderArgs.fName](...GMSpiderArgs.fArgs);
        console.log(JSON.stringify(result));
        if (typeof GmSpiderInject !== 'undefined') {
            GmSpiderInject.SetSpiderResult(JSON.stringify(result));
        }
    });
})();

