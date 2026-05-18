const app = {
  version: '1.0.0',
  author: '20220518',
  site: '布布影视',
  url: 'https://bbys.app',
  categories: {
    '1': '电影',
    '2': '剧集', 
    '3': '动漫',
    '4': '综艺'
  }
};

function play(u) {
  let result = [];
  try {
    let html = request(u, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let playList = html.match(/class="module-play-list"([\s\S]*?)<\/div>/g);
    if (playList) {
      playList.forEach((item, index) => {
        let title = item.match(/<span>([^<]+)<\/span>/);
        let links = item.match(/href="([^"]+)"/g);
        if (links) {
          let episodes = [];
          links.forEach(link => {
            let url = link.match(/href="([^"]+)"/)[1];
            episodes.push(url);
          });
          result.push({
            title: title ? title[1] : `播放源${index + 1}`,
            urls: episodes
          });
        }
      });
    }
  } catch (e) {
    print('解析播放地址失败: ' + e.message);
  }
  return JSON.stringify(result);
}

function search(wd) {
  let result = [];
  try {
    let url = `${app.url}/index.php/ajax/suggest?mid=1&wd=${encodeURIComponent(wd)}&limit=500`;
    let data = request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    let json = JSON.parse(data);
    if (json.list) {
      json.list.forEach(item => {
        result.push({
          title: item.name,
          url: `${app.url}/play/${item.id}.html`,
          pic: item.pic
        });
      });
    }
  } catch (e) {
    print('搜索失败: ' + e.message);
  }
  return JSON.stringify(result);
}

function home() {
  let result = [];
  try {
    let html = request(app.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let items = html.match(/<a[\s\S]*?class="module-item"[\s\S]*?<\/a>/g);
    if (items) {
      items.forEach(item => {
        let title = item.match(/title="([^"]+)"/);
        let pic = item.match(/data-original="([^"]+)"/);
        let url = item.match(/href="([^"]+)"/);
        if (title && url) {
          result.push({
            title: title[1],
            url: url[1].startsWith('http') ? url[1] : app.url + url[1],
            pic: pic ? pic[1] : ''
          });
        }
      });
    }
  } catch (e) {
    print('获取首页失败: ' + e.message);
  }
  return JSON.stringify(result);
}

function category(tid, page) {
  let result = [];
  try {
    page = page || 1;
    let url = page === 1 ? `${app.url}/type/${tid}.html` : `${app.url}/type/${tid}/page/${page}.html`;
    let html = request(url, {
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
          if (title && url) {
            result.push({
              title: title[1],
              url: url[1].startsWith('http') ? url[1] : app.url + url[1],
              pic: pic ? pic[1] : ''
            });
          }
        });
      }
    }
  } catch (e) {
    print('获取分类失败: ' + e.message);
  }
  return JSON.stringify(result);
}

function detail(url) {
  let result = {};
  try {
    let html = request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      }
    });
    
    let title = html.match(/<h1[^>]*class="module-info-title"[^>]*>([^<]+)<\/h1>/);
    let pic = html.match(/class="module-info-image"[\s\S]*?src="([^"]+)"/);
    let desc = html.match(/introduction-content[^>]*><p>([^<]+)<\/p>/);
    
    result.title = title ? title[1] : '';
    result.pic = pic ? pic[1] : '';
    result.desc = desc ? desc[1] : '';
    
    let playList = html.match(/class="module-play-list"([\s\S]*?)<\/div>/g);
    let playSources = [];
    if (playList) {
      playList.forEach((item, index) => {
        let sourceName = item.match(/<span>([^<]+)<\/span>/);
        let links = item.match(/href="([^"]+)"/g);
        let episodes = [];
        if (links) {
          links.forEach(link => {
            episodes.push(link.match(/href="([^"]+)"/)[1]);
          });
        }
        playSources.push({
          title: sourceName ? sourceName[1] : `播放源${index + 1}`,
          urls: episodes
        });
      });
    }
    result.sources = playSources;
  } catch (e) {
    print('获取详情失败: ' + e.message);
  }
  return JSON.stringify(result);
}

function proxy(url) {
  return request(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
    }
  });
}

module.exports = {
  app: app,
  play: play,
  search: search,
  home: home,
  category: category,
  detail: detail,
  proxy: proxy
};
