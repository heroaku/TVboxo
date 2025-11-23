/*
@header({
  searchable: 2,
  filterable: 0,
  quickSearch: 0,
  title: 'GAZE',
  lang: 'ds'
})
*/

globalThis.window = globalThis.global = globalThis;

class Go {
  constructor() {
    let s = new TextEncoder("utf-8"),
      i = new TextDecoder("utf-8"),
      r = new DataView(new ArrayBuffer(8));
    var o = [];

    this._callbackTimeouts = new Map();
    this._nextCallbackTimeoutID = 1;
    let e = () => new DataView(this._inst.exports.m.buffer);
    let t = (e) => {
      r.setBigInt64(0, e, !0);
      let t = r.getFloat64(0, !0);
      if (0 === t) return;
      if (!isNaN(t)) return t;
      let n = 4294967295n & e;
      return this._values[n];
    };
    let n = (n) => {
      let s = e().getBigUint64(n, !0);
      return t(s);
    };
    let l = (e) => {
      if ("number" == typeof e)
        return isNaN(e)
          ? 2146959360n << 32n
          : 0 === e
          ? (2146959360n << 32n) | 1n
          : (r.setFloat64(0, e, !0), r.getBigInt64(0, !0));
      switch (e) {
        case void 0:
          return 0n;
        case null:
          return (2146959360n << 32n) | 2n;
        case !0:
          return (2146959360n << 32n) | 3n;
        case !1:
          return (2146959360n << 32n) | 4n;
      }
      let t = this._ids.get(e);
      void 0 === t &&
        (void 0 === (t = this._idPool.pop()) &&
          (t = BigInt(this._values.length)),
        (this._values[t] = e),
        (this._goRefCounts[t] = 0),
        this._ids.set(e, t)),
        this._goRefCounts[t]++;
      let n = 1n;
      switch (typeof e) {
        case "string":
          n = 2n;
          break;
        case "symbol":
          n = 3n;
          break;
        case "function":
          n = 4n;
      }
      return t | ((2146959360n | n) << 32n);
    };
    let a = (t, n) => {
      let s = l(n);
      e().setBigUint64(t, s, !0);
    };
    let c = (e, t, n) => new Uint8Array(this._inst.exports.m.buffer, e, t);
    let $ = (e, t, s) => {
      let i = Array(t);
      for (let r = 0; r < t; r++) i[r] = n(e + 8 * r);
      return i;
    };
    let d = (e, t) => i.decode(new DataView(this._inst.exports.m.buffer, e, t));
    let u = Date.now() - performance.now();
    this.importObject = {
      wasi_snapshot_preview1: {
        fd_write: function (t, n, s, r) {
          let l = 0;
          if (1 == t)
            for (let a = 0; a < s; a++) {
              let c = n + 8 * a,
                $ = e().getUint32(c + 0, !0),
                d = e().getUint32(c + 4, !0);
              l += d;
              for (let u = 0; u < d; u++) {
                let f = e().getUint8($ + u);
                if (13 == f);
                else if (10 == f) {
                  let h = i.decode(new Uint8Array(o));
                  (o = []), console.log(h);
                } else o.push(f);
              }
            }
          else console.error("invalid file descriptor:", t);
          return e().setUint32(r, l, !0), 0;
        },
        fd_close: () => 0,
        fd_fdstat_get: () => 0,
        fd_seek: () => 0,
        proc_exit(e) {
          if (globalThis.process) process.exit(e);
          else throw "trying to exit with code " + e;
        },
        random_get: (e, t) => (crypto.getRandomValues(c(e, t)), 0),
      },
      a: {
        "runtime.ticks": () => u + performance.now(),
        "runtime.sleepTicks": (e) => {
          setTimeout(this._inst.exports.t, e);
        },
        d(e) {
          console.error("d not implemented");
        },
        e(e, t) {
          let n = d(e, t);
          return l(n);
        },
        a(e, n, s) {
          let i = d(n, s),
            r = t(e),
            o = Reflect.get(r, i);
          return l(o);
        },
        f(e, n, s, i) {
          let r = t(e),
            o = d(n, s),
            l = t(i);
          Reflect.set(r, o, l);
        },
        "syscall/js.valueDelete"(e, n, s) {
          let i = t(e),
            r = d(n, s);
          Reflect.deleteProperty(i, r);
        },
        i: (e, n) => l(Reflect.get(t(e), n)),
        fIndex(e, n, s) {
          Reflect.set(t(e), n, t(s));
        },
        j(n, s, i, r, o, l, c) {
          let u = t(s),
            f = d(i, r),
            h = $(o, l, c);
          try {
            let g = Reflect.get(u, f);
            a(n, Reflect.apply(g, u, h)), e().setUint8(n + 8, 1);
          } catch (p) {
            a(n, p), e().setUint8(n + 8, 0);
          }
        },
        "syscall/js.valueInvoke"(n, s, i, r, o) {
          try {
            let l = t(s),
              c = $(i, r, o);
            a(n, Reflect.apply(l, void 0, c)), e().setUint8(n + 8, 1);
          } catch (d) {
            a(n, d), e().setUint8(n + 8, 0);
          }
        },
        g(n, s, i, r, o) {
          let l = t(s),
            c = $(i, r, o);
          try {
            a(n, Reflect.construct(l, c)), e().setUint8(n + 8, 1);
          } catch (d) {
            a(n, d), e().setUint8(n + 8, 0);
          }
        },
        h: (e) => t(e).length,
        b(n, i) {
          let r = String(t(i)),
            o = s.encode(r);
          a(n, o), e().setInt32(n + 8, o.length, !0);
        },
        c(e, n, s, i) {
          let r = t(e);
          c(n, s, i).set(r);
        },
        "syscall/js.valueInstanceOf": (e, n) => t(e) instanceof t(n),
        k(n, s, i, r, o) {
          let l = n + 4,
            a = c(s, i),
            $ = t(o);
          if (!($ instanceof Uint8Array || $ instanceof Uint8ClampedArray)) {
            e().setUint8(l, 0);
            return;
          }
          let d = $.subarray(0, a.length);
          a.set(d), e().setUint32(n, d.length, !0), e().setUint8(l, 1);
        },
        l(n, s, i, r, o) {
          let l = n + 4,
            a = t(s),
            $ = c(i, r);
          if (!(a instanceof Uint8Array || a instanceof Uint8ClampedArray)) {
            e().setUint8(l, 0);
            return;
          }
          let d = $.subarray(0, a.length);
          a.set(d), e().setUint32(n, d.length, !0), e().setUint8(l, 1);
        },
      },
    };
    this.importObject.env = this.importObject.a;
  }
  async run(instance) {
    this._inst = instance;
    this._values = [NaN, 0, null, true, false, globalThis, this];
    this._goRefCounts = [];
    this._ids = new Map();
    this._idPool = [];
    this.exited = false;
    while (true) {
      const resumePromise = new Promise((resolve) => {
        this._resolveCallbackPromise = () => {
          if (this.exited) {
            throw new Error("bad callback: Go program has already exited");
          }
          setTimeout(resolve, 0);
        };
      });

      this._inst.exports.r();
      if (this.exited) break;

      await resumePromise;
    }
  }
  _resume() {
    if (this.exited) {
      throw new Error("Go program has already exited");
    }
    this._inst.exports.s();
    if (this.exited) {
      this._resolveExitPromise();
    }
  }
  _makeFuncWrapper(funcId) {
    const self = this;
    return function () {
      const event = {
        id: funcId,
        this: this,
        args: arguments,
      };
      self._pendingEvent = event;
      self._resume();
      const result = event.result;
      return result;
    };
  }
}

const decryptor = (() => {
  let wasmInstance = null;
  let go = new Go();

  const pedanticAe = function (buffer) {
    const decompressedSync = zlib.brotliDecompressSync(buffer);
    return decompressedSync;
  };
  const initWASM = async (func) => {
    const wasmBuffer = await fetchWASM();
    const { instance } = await WebAssembly.instantiate(
      wasmBuffer,
      go.importObject
    );
    wasmInstance = instance;
    go.run(instance);
  };
  const fetchWASM = async () => {
    const response = await axios.get(
      "https://temp-rs-1257790209.cos.ap-chengdu.myqcloud.com/IceDespair-V2.6.svg",
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/wasm",
        },
      }
    );
    return pedanticAe(new Uint8Array(response.data));
  };
  const parseUrlParams = (url) => {
    const params = {};
    const queryString = url.split("?")[1];
    if (!queryString) return params;

    queryString.split("-").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) params[key] = decodeURIComponent(value);
    });
    return params;
  };
  const getWasmFunc = (name, mid, key) => {
    return window[
      bytesToString(window["DimGive"](name, mid, decodeURIComponent(key)))
    ];
  };
  const decryptDataM3u = async (bytes, sign, mid, key) => {
    if (!wasmInstance) await initWASM();
    const result = getWasmFunc("nihilism", mid, key)(
      bytes,
      sign,
      mid,
      decodeURIComponent(key)
    );
    return bytesToString(pedanticAe(result));
  };
  const decryptData = async (data, mid, key) => {
    if (!wasmInstance) await initWASM();
    const result = getWasmFunc("8069", mid, key)(
      data,
      mid,
      decodeURIComponent(key)
    );
    return bytesToString(result);
  };
  const decryptStream = async (data, mid, key, url) => {
    if (!url.includes("gazes_v-@_info")) return url;
    const istr = url.split("/").at(-1);
    const ungzipped = pako.ungzip(data, {
      to: "string",
    });
    const bytes = processBytes(CryptoJS.enc.Base64.parse(ungzipped));
    const sign = CryptoJS.MD5(
      `${istr}- are we anti-socialists? against the government? spies? traitor? fresh blood? no, we are just weak, sick bystanders; we just need to rot little by little with formalism until we finally become food for new shoots. `
    )
      .toString()
      .substring(8, 24);
    return decryptDataM3u(bytes, sign, mid, key);
  };
  const processBytes = (base64Data) => {
    return Uint8Array.from(
      {
        length: base64Data.sigBytes,
      },
      (_, i) => (base64Data.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    );
  };
  const bytesToString = (byteArray) => {
    return String.fromCharCode.apply(null, byteArray);
  };
  const decryptPlay = async (playUrl, src) => {
    const params = parseUrlParams(playUrl);
    const encryptedSrc = src;
    const decryptedLink = await decryptData(
      Uint8Array.from(atob(encryptedSrc), (c) => c.charCodeAt(0)),
      params.mid,
      params[Object.keys(params).at(-1)]
    );
    return decryptedLink;
  };
  const decryptM3u8 = async (playUrl, src, decryptedLink) => {
    const params = parseUrlParams(playUrl);
    const encryptedSrc = src;
    const { data } = await axios.get(decryptedLink, {
      responseType: "arraybuffer",
    });
    const m3u8 = await decryptStream(
      data,
      params.mid,
      params[Object.keys(params).at(-1)],
      decryptedLink
    );
    return m3u8;
  };
  return {
    decryptM3u8,
    decryptPlay,
    parseUrlParams,
  };
})();

var rule = {
  类型: "影视",
  title: "GAZE",
  desc: "源动力+L佬+秋秋+嗷呜 联合出品",
  host: "https://gaze.run",
  url: "/filter_movielist",
  searchUrl: "/filter_movielist",
  searchable: 2,
  quickSearch: 0,
  timeout: 5000,
  play_parse: true,
  filterable: 0,
  class_name: "电影&剧集&番剧&国漫",
  class_url: "1&2&bangumi&chinese_cartoon",
  headers: {
    "User-Agent": PC_UA,
    Origin: "https://gaze.run",
  },
  预处理: async () => {
    await rule.dealHeaders();
  },
  推荐: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input);
    const d = [];
    const data = pdfa(html, ".row .card");
    data.forEach((it) => {
      d.push({
        title: pdfh(it, ".card-body .card-title&&Text"),
        pic_url: pdfh(it, ".view img.load-imgs&&data-src"),
        desc: pdfh(it, ".view .dbadge-box .badge-default&&Text"),
        url: pdfh(it, ".view a&&href").replace("play/", ""),
      });
    });
    return setResult(d);
  },
  一级: async function (tid, pg, filter, extend) {
    const { input } = this;
    const html = await request(input, {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: {
        mform: tid,
        mcountry: "all",
        "tag_arr[]": "all",
        album: "all",
        years: "all",
        sort: "updatetime",
        title: "",
        page: pg,
      },
    });
    const resp = JSON.parse(html);
    const d = [];
    resp.mlist.forEach((it) => {
      d.push({
        title: it.title,
        pic_url: it.cover_img,
        desc: `${it.grade}|${it.definition}`,
        url: it.mid,
      });
    });
    return setResult(d);
  },
  二级: async function (ids) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(`${this.host}/play/${ids[0]}`, {
      headers: this.headers,
    });
    const vod = {
      vod_id: ids[0],
      vod_name: pdfh(html, ".row.p-2 img&&alt"),
      vod_pic: pdfh(html, ".row.p-2 img&&src"),
      type_name: pdfa(html, ".row.p-2 a")
        .map((it) => pdfh(it, "a&&Text"))
        .join("/"),
      vod_remarks: pdfh(html, ".row.p-2 h5:eq(-1)&&Text"),
      vod_year: pdfh(html, ".row.p-2 a:eq(-1)&&Text"),
      vod_area: pdfh(html, ".row.p-2 a:eq(-2)&&Text"),
      vod_content: pdfh(html, ".row.p-2 p&&Text"),
      vod_play_from: "源动力偷的线路",
      vod_play_url: pdfa(html, ".col-md-12&&.sbtn-block")
        .map(
          (it) =>
            `${pdfh(it, "button--i&&Text").trim()}$${ids[0]}|${pdfh(
              it,
              "button&&data-src"
            )}`
        )
        .join("#"),
    };
    return vod;
  },
  搜索: async function (wd, quick, pg) {
    const { input } = this;
    const html = await request(input, {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: {
        mform: "all",
        mcountry: "all",
        "tag_arr[]": "all",
        album: "all",
        years: "all",
        sort: "updatetime",
        title: wd,
        page: pg,
      },
    });
    const resp = JSON.parse(html);
    const d = [];
    resp.mlist.forEach((it) => {
      d.push({
        title: it.title,
        pic_url: it.cover_img,
        desc: `${it.grade}|${it.definition}`,
        url: it.mid,
      });
    });
    return setResult(d);
  },
  lazy: async function (flag, id, flags) {
    const { pdfa, pdfh } = this;
    const [data_id, data_src] = id.split("|");
    const sourceReqUrl = `${this.host}/play/${data_id}`;
    console.warn(data_id, data_src);
    const source = await axios.get(sourceReqUrl, { headers: this.headers });
    const script = pdfa(source.data, "script");
    const scriptContent = script.filter((e) =>
      e.includes("configs-n26.1.js")
    )[0];
    const sourceUrl = pdfh(scriptContent, "script&&src");
    console.warn("sourceUrl", sourceUrl);

    let play = await decryptor.decryptPlay(sourceUrl, data_src);

    if (play.includes("gazes_v-@_info")) {
      return {
        parse: 0,
        url:
          getProxyUrl() +
          "&playdata=" +
          encodeURIComponent(JSON.stringify([sourceUrl, data_src, play])) +
          "&t=0",
      };
    } else {
      if (play.includes("cloud.189.cn")) {
        let js_data = decryptor.parseUrlParams(sourceUrl);
        const thirdKey = Object.keys(js_data)[2];

        try {
          const re_link = await axios.post(
            `${this.host}/fetch_189c_murl`,
            {
              urls: play,
              mid: js_data.mid,
            },
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                Accept: "*/*",
                Origin: this,
                [thirdKey]: encodeURIComponent(js_data[thirdKey]),
                Cookie: source.headers["set-cookie"]
                  .map((it) => it.split(";")[0])
                  .join(";"),
              },
            }
          );
          console.log("API Response:", re_link.data);
          play = re_link.data?.url;
        } catch (error) {
          console.error("Request Failed:", error);
        }
      }
      return {
        parse: 0,
        url: play,
      };
    }
  },
  proxy_rule: async function (params) {
    try {
      const segments = JSON.parse(decodeURIComponent(params.playdata));
      let [sourceUrl, data_src, play] = segments;
      console.log(segments);

      let m3u8 = await decryptor.decryptM3u8(sourceUrl, data_src, play);
      return [200, "text/text", m3u8];
    } catch (e) {
      console.log(e);
    }
  },
  dealHeaders: async function () {
    const resp = await axios.get(`${this.host}/filter`, {
      headers: this.headers,
    });
    // cookie 处理
    const headers = resp.headers;
    const cookies = headers["set-cookie"];
    const cookie = cookies.map((item) => item.split(";")[0]).join("; ");
    this.headers.Cookie = cookie;
    // 请求头处理
    const html = resp.data;
    const kv_macth = html.match(/'headers':({[^{}]*})/)[1];
    const kv_headers = new Function(`return ${kv_macth}`)();
    for (const key in kv_headers) {
      this.headers[key] = kv_headers[key];
    }
    console.warn("headers", this.headers);
  },
};
