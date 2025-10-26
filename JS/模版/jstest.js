var rule = {
  类型: '影视',
  title: '壹影视',
  desc: '源动力出品',
  host: 'https://light-ios.yiys04.com',
  url: '/api/vod/v1/vod/list?pageNum=fypage&pageSize=12&tid=fyclass&by=time&area=&lang=&year=&class=',
  searchUrl: '/api/search?pageNum=fypage&pageSize=12&key=**',
  searchable: 2,
  quickSearch: 0,
  timeout: 5000,
  play_parse: true,
  filterable: 0,
  class_name: '电影&电视剧&综艺&动漫&短剧',
  class_url: '1&2&3&4&5&22',
  playMap: {
    '官方专线1': 'y1',
    '官方专线2': 'z1',
    '全球蓝光': 'w',
    '蓝光4': 't1',
    '极速蓝光1': 'e',
    '极速蓝光2': 'a',
    '极速1': 'n',
    '极速2': 'v',
    '极速3': 'b',
    '极速4': 'x',
    '优质': 'i',
    '优质1': 'l',
  },
  预处理: async () => {
    return []
  },
  推荐: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const url = `${rule.host}/api/topic/v1/list?tid=0&pageNum=1&pageSize=6`
    const html = await request(url);
    const response = JSON.parse(html);
    const data = response.data.List;
    let d = [];
    data.forEach((it) => {
      const itemData = it.vod_list;
      itemData.forEach((it) => {
        d.push({
          vod_name: it.vod_name,
          vod_pic: it.vod_pic,
          vod_desc: it.vod_blurb,
          vod_id: it.vod_id,
          vod_remarks: it.vod_remarks
        })
      })

    });
    return d;
  },
  一级: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input);
    const response = JSON.parse(html);
    const data = response.data.List;
    let d = [];
    data.forEach((it) => {
      d.push({
        vod_name: it.vod_name,
        vod_pic: it.vod_pic,
        vod_desc: it.vod_blurb,
        vod_id: it.vod_id,
        vod_remarks: it.vod_remarks
      })
    });
    return d;
  },
  二级: async function (ids) {
    const { input, pdfa, pdfh, pd } = this;
    const d = [];
    for (let id of ids) {
      const url = `${rule.host}/vod/play/id/${id}/nid/1`;
      let html = await request(url);
      const detail = {
        vod_id: id,
      };
      const $ = pq(html);

      // 提取名称
      const name = $('div.vod-episode-list span.text-lg.pr-5.line-clamp-2').text().trim();
      detail.vod_name = name;
      // 提取年份和类型
      const yearAndGenres = $('div.vod-episode-list .text-sm.text-white\\/75.py-1.pt-3').first().text().trim();
      const year = yearAndGenres.split(' ')[0];
      detail.vod_year = year;
      const genres = yearAndGenres.split(' ').slice(1).join(', ');
      detail.type_name = genres;

      // 提取更新日期
      const updateDate = $('div.vod-episode-list .text-sm.text-white\\/75.py-1').text().split(' ')[0];
      detail.vod_remarks = `更新:${updateDate}`;

      // 提取播放源
      const playSources = $('.whitespace-nowrap.text-sm').map((index, element) => {
        return $(element).text().trim();
      }).get();
      detail.vod_play_from = playSources.join('$$$');

      const episodes = [];
      $('div.vod-episode-list ul > div > a').each((index, element) => {
        const episode = {};
        // 提取剧集名称
        const name = $(element).find('li > label > div').text().trim();
        episode.name = name;
        // 提取 a 链接的 href
        const href = $(element).attr('href');
        episode.href = href;
        // 将提取的信息添加到数组中
        episodes.push(episode);
      });
      // console.log(episodes);

      const play = [];
      playSources.forEach((playSource, lineIndex) => {
        const key = rule.playMap[playSource];
        const lineEpisodes = episodes.map(episode => {
          const hrefParts = episode.href.split('/');
          hrefParts[hrefParts.length - 1] = key;
          const newHref = `${rule.host}${hrefParts.join('/')}`;
          return `${episode.name}$${newHref}`;
        });
        play[lineIndex] = lineEpisodes.join('#');
      });
      detail.vod_play_url = play.join('$$$');

      // console.log(detail);
      d.push(detail);
    };
    console.log(d)

    return d[0];
  },
  搜索: async function (wd, quick, pg) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input);
    const response = JSON.parse(html);
    const data = response.data.List;
    let d = [];
    data.forEach((it) => {
      d.push({
        vod_name: it.vod_name,
        vod_pic: it.vod_pic,
        vod_desc: it.vod_blurb,
        vod_id: it.vod_id,
        vod_remarks: it.vod_remarks
      })
    });
    return d;
  },
  // lazy: async function (flag, id, flags) {
  //   const { input, pdfa, pdfh, pd } = this;
  //   const url = `${rule.host}/api/playurl?`;
  //   let html = await post(url, {
  //     data: {
  //       urlEncode: id,
  //       sourceCode: flag
  //     }
  //   });
  //   const response = JSON.parse(html);
  //   const realUrl = response?.data?.url || "";
  //   if (/m3u8|mp4/.test(realUrl)) {
  //     return { parse: 0, url: realUrl }
  //   } else {
  //     if (/m3u8|mp4/.test(realUrl)) {
  //       return { parse: 0, url: input }
  //     } else {
  //       return { parse: 1, url: input }
  //     }
  //   }
  // }
}
