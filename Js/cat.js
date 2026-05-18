/**
 * 布布影视 (bbys.app) 爬虫
 */

import { load, log, request } from 'assets://js/lib/cat.js';

const site = 'https://bbys.app';
const UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';

function init(ext) {}

function home(filter) {
    const classes = [
        { type_id: '1', type_name: '电影' },
        { type_id: '2', type_name: '剧集' },
        { type_id: '3', type_name: '动漫' },
        { type_id: '4', type_name: '综艺' }
    ];
    return JSON.stringify({
        class: classes
    });
}

function homeVod() {
    try {
        const html = request(site, {
            headers: {
                'User-Agent': UA,
                'Referer': site
            }
        });

        const $ = load(html);
        const list = [];

        $('.module-items .module-item').each((_, el) => {
            const vod = {};
            const a = $(el).find('a');
            
            let href = a.attr('href') || '';
            if (!href.startsWith('http')) {
                href = site + href;
            }
            vod.vod_id = href;
            
            vod.vod_name = a.attr('title') || 
                $(el).find('.module-poster-item-title').text().trim();
            
            vod.vod_pic = $(el).find('img').attr('data-original') || 
                $(el).find('img').attr('src') || '';
            
            vod.vod_remarks = $(el).find('.module-item-note').text().trim();
            
            list.push(vod);
        });

        return JSON.stringify({
            list: list
        });
    } catch (e) {
        log('homeVod error:' + e.message);
    }
    return JSON.stringify({ list: [] });
}

function category(tid, pg, filter, extend) {
    try {
        pg = pg || 1;
        let url;
        if (pg == 1) {
            url = site + '/type/' + tid + '.html';
        } else {
            url = site + '/type/' + tid + '/page/' + pg + '.html';
        }

        const html = request(url, {
            headers: {
                'User-Agent': UA,
                'Referer': site
            }
        });

        const $ = load(html);
        const list = [];

        $('.module-items .module-item').each((_, el) => {
            const vod = {};
            const a = $(el).find('a');
            
            let href = a.attr('href') || '';
            if (!href.startsWith('http')) {
                href = site + href;
            }
            vod.vod_id = href;
            
            vod.vod_name = a.attr('title') || 
                $(el).find('.module-poster-item-title').text().trim();
            
            vod.vod_pic = $(el).find('img').attr('data-original') || 
                $(el).find('img').attr('src') || '';
            
            vod.vod_remarks = $(el).find('.module-item-note').text().trim();
            
            list.push(vod);
        });

        const hasMore = $('.page-next').length > 0 || 
            html.includes('下一页');

        return JSON.stringify({
            page: parseInt(pg),
            pagecount: hasMore ? parseInt(pg) + 1 : parseInt(pg),
            limit: 24,
            total: 9999,
            list: list
        });
    } catch (e) {
        log('category error:' + e.message);
    }
    return JSON.stringify({
        page: 1,
        pagecount: 1,
        limit: 24,
        total: 0,
        list: []
    });
}

function detail(id) {
    try {
        const html = request(id, {
            headers: {
                'User-Agent': UA,
                'Referer': site
            }
        });

        const $ = load(html);
        const vod = {};

        vod.vod_id = id;
        vod.vod_name = $('.module-info-heading h1').text().trim();
        vod.vod_pic = $('.module-item-pic img').attr('data-original') || 
            $('.module-item-pic img').attr('src') || '';
        vod.type_name = $('.module-info-tag a').eq(0).text().trim();
        vod.vod_year = $('.module-info-tag a').eq(1).text().trim();
        vod.vod_area = $('.module-info-tag a').eq(2).text().trim();
        vod.vod_actor = $('.module-info-item').text().replace(/\s+/g, ' ');
        vod.vod_content = $('.show-desc').text().trim();

        const playFrom = [];
        const playUrls = [];

        $('.module-tab-item').each((i, tab) => {
            const from = $(tab).text().trim() || '线路' + (i + 1);
            playFrom.push(from);

            const urls = [];

            $('.module-play-list').eq(i).find('a').each((_, a) => {
                const name = $(a).text().trim();
                let href = $(a).attr('href') || '';
                if (!href.startsWith('http')) {
                    href = site + href;
                }
                urls.push(name + '$' + href);
            });

            playUrls.push(urls.join('#'));
        });

        vod.vod_play_from = playFrom.join('$$$');
        vod.vod_play_url = playUrls.join('$$$');

        return JSON.stringify({
            list: [vod]
        });
    } catch (e) {
        log('detail error:' + e.message);
    }
    return JSON.stringify({
        list: []
    });
}

function play(flag, id, flags) {
    try {
        const html = request(id, {
            headers: {
                'User-Agent': UA,
                'Referer': site
            }
        });

        const player = html.match(/player_aaaa=(\{[\s\S]*?\});/);
        if (player) {
            try {
                const data = JSON.parse(player[1]);
                let url = data.url || '';

                if (data.encrypt == '1') {
                    url = unescape(url);
                } else if (data.encrypt == '2') {
                    url = unescape(base64Decode(url));
                }

                if (url.startsWith('http')) {
                    return JSON.stringify({
                        parse: 0,
                        url: url
                    });
                }
            } catch (e) {
                log('解析player数据失败: ' + e.message);
            }
        }

        const iframe = html.match(/<iframe[^>]+src="([^"]+)"/);
        if (iframe) {
            let iframeUrl = iframe[1];
            if (!iframeUrl.startsWith('http')) {
                iframeUrl = site + iframeUrl;
            }

            const iframeHtml = request(iframeUrl, {
                headers: {
                    'User-Agent': UA,
                    'Referer': id
                }
            });

            const m3u8 = iframeHtml.match(/(https?:\/\/[^"' ]+\.m3u8[^"' ]*)/);
            if (m3u8) {
                return JSON.stringify({
                    parse: 0,
                    url: m3u8[1]
                });
            }
        }

    } catch (e) {
        log('play error:' + e.message);
    }

    return JSON.stringify({
        parse: 1,
        url: id
    });
}

function search(wd, quick, pg) {
    try {
        const url = site + '/index.php/ajax/suggest?mid=1&wd=' + encodeURIComponent(wd);

        const data = request(url, {
            headers: {
                'User-Agent': UA,
                'Referer': site
            }
        });

        const json = JSON.parse(data);
        const list = [];

        (json.list || []).forEach(it => {
            list.push({
                vod_id: site + '/play/' + it.id + '.html',
                vod_name: it.name,
                vod_pic: it.pic || '',
                vod_remarks: ''
            });
        });

        return JSON.stringify({
            list: list
        });
    } catch (e) {
        log('search error:' + e.message);
    }
    return JSON.stringify({
        list: []
    });
}

function base64Decode(text) {
    return java.lang.String(
        java.util.Base64.getDecoder().decode(text)
    ).toString();
}

__JS_SPIDER__ = {
    init,
    home,
    homeVod,
    category,
    detail,
    play,
    search
};
