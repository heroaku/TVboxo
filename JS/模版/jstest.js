const axios = require('axios');
const crypto = require('crypto');

// 模拟全局变量
const HOST = 'https://www.netflixgc.com';
const VODS = [];

// 模拟md5函数
function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

// 模拟post请求
async function post(url, data) {
    try {
        const response = await axios.post(url, data.body, { headers: data.headers });
        return response.data;
    } catch (error) {
        console.error('POST请求失败:', error);
        return null;
    }
}

// 模拟规则中的一级分类代码
async function debugLevel1() {
    let input = '/index.php/api/vod#type=1&page=1';
    let body = input.split("#")[1];
    let t = Math.round(new Date / 1e3).toString();
    let key = md5("DS" + t + "DCC147D11943AF75");
    let url = input.split("#")[0];
    body = body + "&time=" + t + "&key=" + key;
    console.log('请求参数:', body);

    let fetch_params = {
        body: body,
        headers: {
            'Cookie': 'PHPSESSID=e6alj2s5i6gvk0urjp3iqkkfl0; ecPopup=1; _funcdn_token=5ff10ed9fc178af6e2645e44cd768d232acba767ebaa33a15e4d2682b97264a6; user_id=10992; user_name=yuanzl77; group_id=2; group_name=NXVIP; user_check=e59a37f5a4fec0072cb512869352f402; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png',
            'User-Agent': 'MOBILE_UA',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let html = await post(HOST + url, fetch_params);
    if (html) {
        console.log('响应数据:', html);
        let data = JSON.parse(html);
        // 处理图片链接
        data.list.forEach(it => {
            it.vod_pic = it.vod_pic.replace(/mac/, "https");
        });
        console.log('处理后的数据:', data.list);
        // 将数据赋值给VODS
        VODS.push(...data.list);
    } else {
        console.log('请求失败');
    }
}

debugLevel1();
