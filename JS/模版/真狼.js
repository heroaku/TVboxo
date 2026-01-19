globalThis.slideBox = function (url) {
  let new_html = request(url, { headers: { 'User-Agent': MOBILE_UA, 'Referer': HOST } });
  if (/滑动验证|人机识别/.test(new_html)) {
    let new_src = pdfh(new_html, 'script[src*="huadong"]&&src', HOST);
    let hhtml = request(new_src, { withHeaders: true, headers: { 'User-Agent': MOBILE_UA, 'Referer': url } });
    let json = JSON.parse(hhtml);
    let html = json.body;
    let key = html.split('key="')[1]?.split('"')[0] || '';
    let value = html.split('value="')[1]?.split('"')[0] || '';
    let val = '';
    for (let i = 0; i < value.length; i++) {
      val += (value.charCodeAt(i) + 1).toString();
    }
    let md5value = md5(val);
    let yz_url = HOST + '/a20be899_96a6_40b2_88ba_32f1f75f1552_yanzheng_huadong.php?type=ad82060c2e67cc7e2cc47552a4fc1242&key=' + key + '&value=' + md5value;
    hhtml = request(yz_url, { withHeaders: true, headers: { 'User-Agent': MOBILE_UA, 'Referer': new_src } });
    json = JSON.parse(hhtml);
    let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
    let cookie = setCk ? json[setCk].split(';')[0] : '';
    setItem('slidecookie', cookie);
    return cookie;
  }
  return '';
};

var rule = {
  title: '真狼影视',
  host: 'https://www.zhenlang.cc',
  url: '/vodshow/fyclass--------fypage---.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  class_parse: '.top_nav li;a&&Text;a&&href;.*/(.*?)\.html',
  cate_exclude: '自助解析|硬核指南|👄Ai女友',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  headers: {
    'User-Agent': MOBILE_UA,
  },
  play_parse: true,
  lazy: "js:\n  let html = request(input);\n  let hconf = html.match(/r player_.*?=(.*?)</)[1];\n  let json = JSON5.parse(hconf);\n  let url = json.url;\n  if (json.encrypt == '1') {\n    url = unescape(url);\n  } else if (json.encrypt == '2') {\n    url = unescape(base64Decode(url));\n  }\n  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {\n    input = {\n      parse: 0,\n      jx: 0,\n      url: url,\n    };\n  } else {\n    input;\n  }",
  limit: 6,
  double: true,
  推荐: '.cbox_list;ul.vodlist li;a&&title;a&&data-original;.pic_text&&Text;a&&href',
  一级二: 'ul.vodlist li;a&&title;a&&data-original;.pic_text&&Text;a&&href',
  一级: $js.toString(() => {
    let cookie = getItem('slidecookie');
    let ret = request(MY_URL, {
      headers: {
        'User-Agent': MOBILE_UA,
        'Referer': encodeUrl(MY_URL),
        'Cookie': cookie,
      }
    });
    if (/滑动验证|人机识别/.test(ret)) {
      cookie = slideBox(MY_URL);
      if (cookie) {
        setItem('slidecookie', cookie);
        ret = request(MY_URL, {
          headers: {
            'User-Agent': MOBILE_UA,
            'Referer': encodeUrl(MY_URL),
            'Cookie': cookie,
          }
        });
      }
    }
    let d = [];
    let p = rule.一级二.split(';');
    let arr = pdfa(ret, p[0]);
    arr.forEach(it => {
      d.push({
        title: pdfh(it, p[1]),
        pic_url: pdfh(it, p[2]),
        desc: pdfh(it, p[3]),
        url: pdfh(it, p[4]),
      });
    });
    setResult(d);
  }),
  二级: {
    title: 'h2&&Text;.content_detail:eq(1)&&li&&a:eq(2)&&Text',
    img: '.vodlist_thumb&&data-original',
    desc: '.content_detail:eq(1)&&li:eq(1)&&Text;.content_detail:eq(1)&&li&&a&&Text;.content_detail:eq(1)&&li&&a:eq(1)&&Text;.content_detail:eq(1)&&li:eq(2)&&Text;.content_detail:eq(1)&&li:eq(3)&&Text',
    content: '.content_desc&&span&&Text',
    tabs: '.play_source_tab&&a',
    lists: '.content_playlist:eq(#id) li',
  },
  搜索: '*',
}
