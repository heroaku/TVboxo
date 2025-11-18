const cheerio = createCheerio()
const CryptoJS = createCryptoJS()

const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

let appConfig = {
    ver: 1,
    title: '廠長',
    site: 'https://www.czzymovie.com',
}

async function getConfig() {
    let config = appConfig
    config.tabs = await getTabs()
    return jsonify(config)
}

async function getTabs() {
    let list = [
        {
            name: '电影',
            ext: {
                url: appConfig.site + '/movie_bt/movie_bt_series/dyy',
            },
        },
    ]
    let ignore = ['关于', '公告', '官方', '备用', '群', '地址', '求片', '分类']
    function isIgnoreClassName(className) {
        return ignore.some((element) => className.includes(element))
    }

    const { data } = await $fetch.get(appConfig.site, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)

    let allClass = $('ul.submenu_mi > li > a')
    allClass.each((i, e) => {
        const name = $(e).text()
        const href = $(e).attr('href')
        const isIgnore = isIgnoreClassName(name)
        if (isIgnore) return

        list.push({
            name,
            ext: {
                url: appConfig.site + href,
            },
        })
    })

    return list
}

async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, url } = ext

    if (page > 1) {
        url += `/page/${page}`
    }

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    $('.bt_img.mi_ne_kd.mrb ul > li').each((_, element) => {
        const href = $(element).find('a').attr('href')
        const title = $(element).find('img').attr('alt')
        const cover = $(element).find('img').attr('data-original')
        const subTitle = $(element).find('.jidi span').text()
        const hdinfo = $(element).find('.hdinfo span').text()
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: subTitle || hdinfo,
            ext: {
                url: href,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}

async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let url = ext.url

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    $('.paly_list_btn a').each((_, e) => {
        const name = $(e).text()
        const href = $(e).attr('href')
        tracks.push({
            name: `${name}`,
            pan: '',
            ext: {
                url: href,
            },
        })
    })

    const panlist = $('.ypbt_down_list')
    if (panlist) {
        panlist.find('ul li').each((_, e) => {
            const name = $(e).find('a').text().trim()
            const href = $(e).find('a').attr('href')
            if (!/ali|quark|115|uc/.test(href)) return
            tracks.push({
                name: name,
                pan: href,
            })
        })
    }

    // $utils.toastInfo('不能看的在群裡回報')

    return jsonify({
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
}

async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    let playurl

    try {
        const $ = cheerio.load(data)

        // 1
        const jsurl = $('iframe').attr('src')
        // $print('jsurl = ' + jsurl)
        if (jsurl) {
            let headers = {
                'user-agent': UA,
                Referer: `${appConfig.site}/`,
            }
            if (jsurl.includes('player-v2') || jsurl.includes('player-v4')) {
                headers['sec-fetch-dest'] = 'iframe'
                headers['sec-fetch-mode'] = 'navigate'
                headers['referer'] = `${appConfig.site}/`
            }

            const jsres = await $fetch.get(jsurl, { headers: headers })
            const html = jsres.data

            const player = html.match(/var player = "(.*?)"/)
            const rand = html.match(/var rand = "(.*?)"/)
            const mysvg = html.match(/\bmysvg\b\s*=\s*['"]([^'"]+)['"]/i)
            const artUrl = html.match(/art\.url\s*=\s*['"]([^'"]+)['"]/i)

            if (player && rand) {
                function decrypt(text, key, iv, type) {
                    let key_value = CryptoJS.enc.Utf8.parse(key || 'PBfAUnTdMjNDe6pL')
                    let iv_value = CryptoJS.enc.Utf8.parse(iv || 'sENS6bVbwSfvnXrj')
                    let content
                    if (type) {
                        content = CryptoJS.AES.encrypt(text, key_value, {
                            iv: iv_value,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7,
                        })
                    } else {
                        content = CryptoJS.AES.decrypt(text, key_value, {
                            iv: iv_value,
                            padding: CryptoJS.pad.Pkcs7,
                        }).toString(CryptoJS.enc.Utf8)
                    }
                    return content
                }

                let content = JSON.parse(decrypt(player[1], 'VFBTzdujpR9FWBhe', rand[1]))
                // $print(JSON.stringify(content))
                playurl = content.url
            } else if (mysvg) {
                playurl = mysvg[1]
            } else if (artUrl) {
                playurl = artUrl[1]
            } else {
                let data = html.split('"data":"')[1].split('"')[0]
                let encrypted = data.split('').reverse().join('')
                let temp = ''
                for (let i = 0x0; i < encrypted.length; i = i + 0x2) {
                    temp += String.fromCharCode(parseInt(encrypted[i] + encrypted[i + 0x1], 0x10))
                }
                playurl =
                    temp.substring(0x0, (temp.length - 0x7) / 0x2) + temp.substring((temp.length - 0x7) / 0x2 + 0x7)
            }
            //     const $2 = cheerio.load(jsres.data)
            //     const scripts = $2('script')
            //     // $print(scripts)
            //     if (scripts.length - 2 > 0) {
            //         let code = scripts.eq(scripts.length - 2).text()
            //         $print(code)

            //         if (code.includes('var player')) {
            //             let player = code.match(/var player = "(.*?)"/)
            //             let rand = code.match(/var rand = "(.*?)"/)

            //             function decrypt(text, key, iv, type) {
            //                 let key_value = CryptoJS.enc.Utf8.parse(key || 'PBfAUnTdMjNDe6pL')
            //                 let iv_value = CryptoJS.enc.Utf8.parse(iv || 'sENS6bVbwSfvnXrj')
            //                 let content
            //                 if (type) {
            //                     content = CryptoJS.AES.encrypt(text, key_value, {
            //                         iv: iv_value,
            //                         mode: CryptoJS.mode.CBC,
            //                         padding: CryptoJS.pad.Pkcs7,
            //                     })
            //                 } else {
            //                     content = CryptoJS.AES.decrypt(text, key_value, {
            //                         iv: iv_value,
            //                         padding: CryptoJS.pad.Pkcs7,
            //                     }).toString(CryptoJS.enc.Utf8)
            //                 }
            //                 return content
            //             }

            //             let content = JSON.parse(decrypt(player[1], 'VFBTzdujpR9FWBhe', rand[1]))
            //             // $print(JSON.stringify(content))
            //             playurl = content.url
            //         } else {
            //             let data = code.split('"data":"')[1].split('"')[0]
            //             let encrypted = data.split('').reverse().join('')
            //             let temp = ''
            //             for (let i = 0x0; i < encrypted.length; i = i + 0x2) {
            //                 temp += String.fromCharCode(parseInt(encrypted[i] + encrypted[i + 0x1], 0x10))
            //             }
            //             playurl =
            //                 temp.substring(0x0, (temp.length - 0x7) / 0x2) + temp.substring((temp.length - 0x7) / 0x2 + 0x7)
            //         }
            //     }
            // } else {
            //     // 2
            //     const script = $('script:contains(window.wp_nonce)')
            //     if (script.length > 0) {
            //         let code = script.eq(0).text()
            //         let group = code.match(/(var.*)eval\((\w*\(\w*\))\)/)
            //         const md5 = CryptoJS
            //         const result = eval(group[1] + group[2])
            //         playurl = result.match(/url:.*?['"](.*?)['"]/)[1]
            //     }
        }
    } catch (error) {
        $print(jsonify(error))
    }

    return jsonify({ urls: [playurl], headers: [{ 'User-Agent': UA }] })
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    // let url = `${appConfig.site}/daoyongjiek0shibushiyoubing?q=${text}$f=_all&p=${page}`
    let url = `https://czzy.xn--m7r412advb92j21st65a.tk/czzysearch.php?wd=${text}`
    if (page > 1) return jsonify({ list: [] })

    try {
        const { data } = await $fetch.get(url, {
            headers: {
                'User-Agent': UA,
            },
        })

        let results = data.split('$$$')

        results.forEach((part, _) => {
            let info = part.split('|')

            let id = info[0]
            let name = info[1]
            let image = info[2]
            let remark = info[3]

            let url = `${appConfig.site}/movie/${id}.html`

            cards.push({
                vod_id: id.toString(),
                vod_name: name,
                vod_pic: image,
                vod_remarks: remark,
                url: url,
                ext: {
                    url: url,
                },
            })
        })
    } catch (error) {
        $print(error)
    }

    // const $ = cheerio.load(data)

    // $('div.bt_img > ul li').each((_, element) => {
    //     const href = $(element).find('a').attr('href')
    //     const title = $(element).find('img.thumb').attr('alt')
    //     const cover = $(element).find('img.thumb').attr('data-original')
    //     const subTitle = $(element).find('.jidi span').text()
    //     const hdinfo = $(element).find('.hdinfo .qb').text()
    //     cards.push({
    //         vod_id: href,
    //         vod_name: title,
    //         vod_pic: cover,
    //         vod_remarks: subTitle || hdinfo,
    //         url: href,
    //         ext: {
    //             url: href,
    //         },
    //     })
    // })

    return jsonify({
        list: cards,
    })
}
