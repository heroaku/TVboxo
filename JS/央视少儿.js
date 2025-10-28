var rule = {
    title:'央视频',
    host:'https://api.cntv.cn',
    homeUrl: '/lanmu/columnSearch?&fl=&fc=&cid=&p=1&n=500&serviceId=tvcctv&t=json',
  //  url:'/list/getVideoAlbumList?fyfilter&area=&letter=&n=24&serviceId=tvcctv&t=json',
  url: '/NewVideo/getVideoListByColumn?id=fyclass&n=10&sort=desc&p=fypage&mode=0&serviceId=tvcctv',
    searchUrl:'',
    searchable:0,
    quickSearch:0,
    
class_name: '周末动画片&快乐体验&小小智慧树&智力快车&音乐快递&英雄出少年&快乐大巴&动漫世界&新闻袋袋裤&大风车&七巧板&大手牵小手&智慧树&动感特区&动画大放映&看我 72 变&快乐童行&风车剧场',
class_url:'TOPC1451559836238828&TOPC1451559479171411&TOPC1451559205464876&TOPC1451559756374759&TOPC1451559666055645&TOPC1451559695702690&TOPC1451559161446811&TOPC1451559448233349&TOPC1451559603261584&TOPC1451558929123462&TOPC1451559569040502&TOPC1451558967135492&TOPC1451447359806385&TOPC1451559378830189&TOPC1451559025546574&TOPC1451559131256781&TOPC1628144739712839&TOPC1573528152700717',

    filterable: 1,  
    headers:{
        'User-Agent':'PC_UA'
    },
    timeout:10000,
    play_parse:true,
    
    limit:6,
    double:false,
/*
    推荐: $js.toString(() => {
        var d = [];
        var list = JSON.parse(request(input)).response.docs;

        list.forEach(it => {
            // 一级标题
            let title1 = it.column_name;
            // 一级描述
            let desc1 = it.channel_name;
            // 一级图片URL
            let picUrl1 = it.column_logo;
            // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 更新至）
            let url1 = it.lastVIDE.videoSharedCode + '|' + '' + '|' + it.column_firstclass + '|' + it.column_name + '|' + '' + '|' + it.column_playdate + '|' + it.channel_name + '|' + it.column_brief + '|' + it.column_logo + '|' + '' + '|' + it.lastVIDE.videoTitle;

            d.push({
                desc : desc1,
                title : title1,
                pic_url : picUrl1,
                url : url1
            })
        })
        setResult(d);
    }),
*/
    
    一级: $js.toString(() => {

        var d = [];

           var list = JSON.parse(request(input)).data.list;
            list.forEach(it => {
            //一级id           
                let guid1 = it.guid;
                // 一级标题
                let title1 = it.title
                // 一级描述
                let desc1 = it.time;
                // 一级图片URL
                let picUrl1 = it.image;
                // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 集数）
             let url1 =it.guid + '|' + it.id + '|' + it.time + '|' + it.title + '|' + it.length + '|' + it.image + '|' + it.focus_date + '|' + it.brief  + '|' + it.url + '|'   + '' + '|' + MY_CATE;
                d.push({
                    desc : desc1,
                    title : title1,
                    pic_url : picUrl1,
                    guid : guid1,
                    url : url1
                })
            })
        setResult(d);
    }),

二级 : $js.toString(() => {
let info = input.split("|");
let guid = info[0].replaceAll('https://api.cntv.cn/lanmu/', '');
    VOD = {
            vod_id: info[1],
            vod_name: info[3],
            vod_pic: info[5],
            type_name: info[2],
            vod_year: info[2],
            vod_area: info[1],
            vod_remarks: 'ƪ(˘⌣˘)ʃ天微',
            vod_director: 'ƪ(˘⌣˘)ʃ天微',
            vod_actor: 'ƪ(˘⌣˘)ʃ天微',
            vod_content: info[7],
        vod_play_from: '央视频',
        //https://hls.cntv.myalicdn.com//asp/hls/2000/0303000a/3/default/https://api.cntv.cn/lanmu/1a01871d6d5f4d4bbe82b9c62650f100/2000.m3u8
        vod_play_url: '立即播放$https://hls.cntv.myhwcdn.cn/asp/hls/850/0303000a/3/default/' + guid + '/850.m3u8'
    };

}),
    搜索:'',
}