var rule = {
  title: '小鴨影音',
  host: 'https://777tv.ai',
  url: '/vod/show/id/fyclass/page/fypage.html',
  searchUrl: '/vod/search/wd/**/page/fypage.html', // 注意：777tv.ai 搜索路径可能不同
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  class_parse: '.stui-header__menu li:gt(0):lt(6); a&&Text; a&&href; /vod/show/id/(\\d+).html',
  play_parse: false, // 播放页已是直链，无需解析
  lazy: '',
  limit: 6,
  推荐: '.stui-vodlist__item; li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
  double: false,
  一级: '.stui-vodlist__item li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
二级: `js:
  pdfh = jsp.pdfh; pdfa = jsp.pdfa; pd = jsp.pd;
  let html = input;

  // 提取基础信息
  let title = pdfh(html, '.stui-content__detail .title&&Text') || '未知';
  let img = pdfh(html, '.stui-content__thumb .lazyload&&data-original');
  let content = pdfh(html, '#desc .stui-content__desc&&Text');

  // 提取详情字段（年份、主演、导演、状态、更新）
  let desc = {};
  pdfa(html, '.stui-content__detail p.data').forEach(p => {
    let text = pdfh(p, '&&Text');
    if (text.includes('年份：')) desc.year = text.replace('年份：', '').trim();
    else if (text.includes('主演：')) desc.actor = text.replace('主演：', '').trim();
    else if (text.includes('導演：')) desc.director = text.replace('導演：', '').trim();
    else if (text.includes('狀態：')) desc.status = text.replace('狀態：', '').trim();
    else if (text.includes('更新：')) desc.update = text.replace('更新：', '').trim();
  });

  // 提取有效播放组：只保留包含 .stui-content__playlist 的 .stui-pannel
  let tabs = [];
  let urls = [];

  pdfa(html, '.stui-pannel').forEach(pan => {
    let episodes = pdfa(pan, '.stui-content__playlist li');
    if (episodes.length > 0) {
      let tabName = pdfh(pan, 'h4.title&&Text');
      if (tabName && tabName.trim()) {
        tabs.push(tabName);
        let playList = episodes.map(li => {
          let name = pdfh(li, 'a&&Text');
          let url = pd(li, 'a&&href');
          return name + '$' + url;
        }).join('#');
        urls.push(playList);
      }
    }
  });

  // 如果没提取到任何线路，防止空转（调试用）
  if (tabs.length === 0) {
    tabs = ['无有效线路'];
    urls = ['请检查规则'];
  }

  VOD = {
    vod_name: title,
    vod_pic: img,
    vod_year: desc.year || '',
    vod_actor: desc.actor || '',
    vod_director: desc.director || '',
    vod_content: content,
    vod_remarks: (desc.status || '') + ' / ' + (desc.update || ''),
    vod_play_from: tabs.join('$$$'),
    vod_play_url: urls.join('$$$')
  };
`,
  搜索: '.stui-vodlist__item li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
};
