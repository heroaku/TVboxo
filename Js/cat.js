import { _ } from 'assets://js/lib/cat.js';

/**
 * 布布影视 (bbys.app) 爬虫
 */

const site = 'https://bbys.app';
const homeData = {
  "class": [
    {"type_id": "1", "type_name": "电影"},
    {"type_id": "2", "type_name": "剧集"},
    {"type_id": "3", "type_name": "动漫"},
    {"type_id": "4", "type_name": "综艺"}
  ]
};

function init(ext) {
}

function home(filter) {
  if (filter) return JSON.stringify(homeData);
  return JSON.stringify({
    'class': homeData.class
  });
}

function homeVod(params) {
  try {
    let html = request(site, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let videos = [];
    let items = html.match(/<a[\s\S]*?class="module-item"[\s\S]*?<\/a>/g);
    if (items) {
      items.forEach(item => {
        let title = item.match(/title="([^"]+)"/);
        let pic = item.match(/data-original="([^"]+)"/);
        let url = item.match(/href="([^"]+)"/);
        let remark = item.match(/<span[^>]*class="module-item-note"[^>]*>([^<]*)<\/span>/);
        
        if (title && url) {
          let fullUrl = url[1].startsWith('http') ? url[1] : site + url[1];
          videos.push({
            'vod_id': fullUrl,
            'vod_name': title[1].trim(),
            'vod_pic': pic ? pic[1] : '',
            'vod_remarks': remark ? remark[1].trim() : ''
          });
        }
      });
    }
    
    return JSON.stringify({
      'list': videos
    });
  } catch (e) {
    print('获取首页推荐失败: ' + e.message);
  }
  return JSON.stringify({'list': []});
}

function category(tid, pg, filter, extend) {
  try {
    pg = pg || 1;
    let page = parseInt(pg);
    let url = page === 1 ? `${site}/type/${tid}.html` : `${site}/type/${tid}/page/${page}.html`;
    
    let html = request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let videos = [];
    let moduleItems = html.match(/class="module-items"([\s\S]*?)class="module-fixedGroup"/);
    
    if (moduleItems) {
      let items = moduleItems[1].match(/<a[\s\S]*?<\/a>/g);
      if (items) {
        items.forEach(item => {
          let title = item.match(/title="([^"]+)"/);
          let pic = item.match(/data-original="([^"]+)"/);
          let url = item.match(/href="([^"]+)"/);
          let remark = item.match(/<span[^>]*class="module-item-note"[^>]*>([^<]*)<\/span>/);
          
          if (title && url) {
            let fullUrl = url[1].startsWith('http') ? url[1] : site + url[1];
            videos.push({
              'vod_id': fullUrl,
              'vod_name': title[1].trim(),
              'vod_pic': pic ? pic[1] : '',
              'vod_remarks': remark ? remark[1].trim() : ''
            });
          }
        });
      }
    }
    
    let pageCount = videos.length >= 24 ? page + 1 : page;
    
    return JSON.stringify({
      'page': page,
      'pagecount': pageCount,
      'limit': 24,
      'total': videos.length,
      'list': videos
    });
  } catch (e) {
    print('获取分类失败: ' + e.message);
  }
  return JSON.stringify({'page': 1, 'pagecount': 1, 'limit': 24, 'total': 0, 'list': []});
}

function detail(id) {
  try {
    let html = request(id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let title = html.match(/<h1[^>]*class="module-info-title"[^>]*>([^<]+)<\/h1>/);
    let pic = html.match(/class="module-info-image"[\s\S]*?src="([^"]+)"/);
    let year = html.match(/<span[^>]*class="module-info-item"[^>]*>\s*([^<]+)\s*<\/span>/);
    let area = html.match(/年份：([^<]+)/);
    let director = html.match(/导演：([^<]+)/);
    let actor = html.match(/主演：([^<]+)/);
    let desc = html.match(/introduction-content[^>]*><p>([^<]+)<\/p>/);
    let type = html.match(/类型：([^<]+)/);
    
    let vod = {
      'vod_id': id,
      'vod_name': title ? title[1].trim() : '',
      'vod_pic': pic ? pic[1] : '',
      'type_name': type ? type[1].trim() : '',
      'vod_year': year ? year[1].trim() : '',
      'vod_area': area ? area[1].trim() : '',
      'vod_director': director ? director[1].trim() : '',
      'vod_actor': actor ? actor[1].trim() : '',
      'vod_content': desc ? desc[1].trim() : ''
    };
    
    let playList = html.match(/class="module-play-list"([\s\S]*?)<\/div>/g);
    if (playList) {
      let playUrls = [];
      playList.forEach((item, index) => {
        let sourceName = item.match(/<span[^>]*>([^<]+)<\/span>/);
        let links = item.match(/href="([^"]+)"/g);
        let episodes = [];
        
        if (links) {
          links.forEach(link => {
            let url = link.match(/href="([^"]+)"/)[1];
            let fullUrl = url.startsWith('http') ? url : site + url;
            episodes.push(fullUrl);
          });
        }
        
        let sourceTitle = sourceName ? sourceName[1].trim() : `播放源${index + 1}`;
        playUrls.push(sourceTitle + '$' + episodes.join('#'));
      });
      
      vod.vod_play_from = '线路1';
      vod.vod_play_url = playUrls.join('#');
    }
    
    return JSON.stringify({
      'list': [vod]
    });
  } catch (e) {
    print('获取详情失败: ' + e.message);
  }
  return JSON.stringify({'list': []});
}

function play(flag, id, flags) {
  try {
    let html = request(id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
        'Referer': site
      }
    });
    
    let videoUrl = '';
    
    let iframeMatch = html.match(/<iframe[^>]*src="([^"]+)"[^>]*>/);
    if (iframeMatch) {
      let iframeUrl = iframeMatch[1];
      let iframeHtml = request(iframeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
          'Referer': id
        }
      });
      
      let urlMatch = iframeHtml.match(/url\s*[=:]\s*['"]([^'"]+)['"]/);
      if (urlMatch) {
        videoUrl = urlMatch[1];
      } else {
        let srcMatch = iframeHtml.match(/src\s*[=:]\s*['"]([^'"]+)['"]/);
        if (srcMatch) {
          videoUrl = srcMatch[1];
        }
      }
    }
    
    if (!videoUrl) {
      let m3u8Match = html.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/);
      if (m3u8Match) {
        videoUrl = m3u8Match[1];
      }
    }
    
    if (!videoUrl) {
      let mp4Match = html.match(/(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/);
      if (mp4Match) {
        videoUrl = mp4Match[1];
      }
    }
    
    return JSON.stringify({
      'parse': 0,
      'playUrl': '',
      'url': videoUrl
    });
  } catch (e) {
    print('获取播放地址失败: ' + e.message);
  }
  return JSON.stringify({'parse': 0, 'playUrl': '', 'url': ''});
}

function search(wd, quick) {
  try {
    let url = `${site}/index.php/ajax/suggest?mid=1&wd=${encodeURIComponent(wd)}&limit=500`;
    let data = request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': site
      }
    });
    
    let json = JSON.parse(data);
    let videos = [];
    
    if (json.list) {
      json.list.forEach(item => {
        videos.push({
          'vod_id': `${site}/play/${item.id}.html`,
          'vod_name': item.name,
          'vod_pic': item.pic || '',
          'vod_remarks': ''
        });
      });
    }
    
    if (videos.length === 0) {
      let searchUrl = `${site}/search/${encodeURIComponent(wd)}.html`;
      let html = request(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
        }
      });
      
      let moduleItems = html.match(/class="module-items"([\s\S]*?)class="module-fixedGroup"/);
      if (moduleItems) {
        let items = moduleItems[1].match(/<a[\s\S]*?<\/a>/g);
        if (items) {
          items.forEach(item => {
            let title = item.match(/title="([^"]+)"/);
            let pic = item.match(/data-original="([^"]+)"/);
            let url = item.match(/href="([^"]+)"/);
            let remark = item.match(/<span[^>]*class="module-item-note"[^>]*>([^<]*)<\/span>/);
            
            if (title && url) {
              let fullUrl = url[1].startsWith('http') ? url[1] : site + url[1];
              videos.push({
                'vod_id': fullUrl,
                'vod_name': title[1].trim(),
                'vod_pic': pic ? pic[1] : '',
                'vod_remarks': remark ? remark[1].trim() : ''
              });
            }
          });
        }
      }
    }
    
    return JSON.stringify({
      'list': videos
    });
  } catch (e) {
    print('搜索失败: ' + e.message);
  }
  return JSON.stringify({'list': []});
}

__JS_SPIDER__ = {
  init: init,
  home: home,
  homeVod: homeVod,
  category: category,
  detail: detail,
  play: play,
  search: search
}
