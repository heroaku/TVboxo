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
    "二级": "js:var html = request(input);var $ = cheerio.load(html);var result = {};result.title = $('.stui-content__detail .title').text().trim();result.img = $('.stui-content__thumb .lazyload').attr('data-original');result.desc = $('#desc .stui-content__desc').text().trim();var tabs = [];var lists = {};$('.stui-pannel').each((i, panel) => {var $panel = $(panel);var title = $panel.find('.stui-pannel__head h4.title').text().trim();if (title && $panel.find('.stui-content__playlist').length > 0) {tabs.push(title);lists[title] = $panel.find('.stui-content__playlist li a').map((j, a) => ({name: $(a).text().trim(),url: $(a).attr('href')})).get();}});result.tabs = tabs;result.lists = lists;JSON.stringify(result);",
  搜索: '.stui-vodlist__item li; a&&title; .lazyload&&data-original; .pic-text&&Text; a&&href',
};
