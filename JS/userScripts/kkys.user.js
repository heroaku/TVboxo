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
        GMSpiderArgs.fArgs = [1];
    }
    Object.freeze(GMSpiderArgs);
    const GmSpider = MacCmsGMSpider({
        configPicUserAgent: false,
        pageCountStyle: ".page-item-next",
        homeContent: {
            category: {
                select: ".menu-item",
                slice: [1, 6]
            }
        },
        detailContent: {
            customFunction: function (ids) {
                let items = {};
                $(".detail-box-main .detail-info-row").each(function () {
                    items[$(this).find(".detail-info-row-side").text().trim().replace("：", "")] = $(this).find(".detail-info-row-main").text().trim();
                });
                let vodPlayData = [];
                $(".episode-box-header .source-item").each(function (i) {
                    if ($(this).find(".source-item-label").text().trim() === "4K(高峰不卡)") {
                        return true;
                    }
                    let media = [];
                    $(`.episode-list:eq(${i}) .episode-item`).each(function () {
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
                        from: $(this).find(".source-item-label").text().trim(),
                        media: media
                    })
                })

                return vod = {
                    vod_id: ids[0],
                    vod_name: $(".module-info-heading h1").text().trim(),
                    vod_pic: MacCmsGMSpiderTool.formatImgUrl($(".detail-box .detail-pic img").data("original") || $(".detail-box .detail-pic img").attr("src"), false, unsafeWindow?.RDUL[0]),
                    vod_director: items?.["导演"] || "",
                    vod_actor: items?.["演员"] || "",
                    vod_year: items?.["首映"] || "",
                    type_name: $(".detail-tags-item").map(function () {
                        return $(this).text().trim();
                    }).get().join(" "),
                    vod_content: $(".detail-box-main .detail-desc").text().trim(),
                    vod_play_data: vodPlayData
                };
            }
        },
        getVodList: function () {
            let vodList = [];
            $("a.v-item").each(function () {
                let vodPic;
                vodList.push({
                    vod_id: $(this).attr("href"),
                    vod_name: $(this).find(".v-item-title").text().trim(),
                    vod_pic: MacCmsGMSpiderTool.formatImgUrl($(this).find(".v-item-cover img").data("original") || $(this).find(".v-item-cover img").attr("src"), false, unsafeWindow?.RDUL[0]),
                    vod_remarks: $(this).find(".v-item-top-left").text().trim(),
                    vod_year: $(this).find(".v-item-bottom").text().trim()
                })
            });
            return vodList;
        },
        getCategoryFilter: function () {
            const filters = [];
            $(".filter-row").each(function () {
                const filter = {
                    key: "",
                    name: $(this).find(".filter-row-side").text().trim(),
                    value: []
                }
                $(this).find("a.filter-item").each(function () {
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
        console.log(result);
        if (typeof GmSpiderInject !== 'undefined') {
            GmSpiderInject.SetSpiderResult(JSON.stringify(result));
        }
    });
})();

