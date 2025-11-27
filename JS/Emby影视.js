globalThis.Token = "8b0b16aae7e8403cb3d19969b82c3902";
globalThis.Users="80e861cbff1343bfa0bedcea78895b91";

var rule = {
    title: 'Emby[优]',
    host: 'https://emby.bangumi.ca',
    url: `/emby/Users/80e861cbff1343bfa0bedcea78895b91/Items?SortBy=DateLastContentAdded%2CSortName&SortOrder=Descending&IncludeItemTypes=Series&Recursive=true&Fields=BasicSyncInfo%2CCanDelete%2CContainer%2CPrimaryImageAspectRatio%2CPrefix&StartIndex=((fypage-1)*50)&ParentId=fyclass&EnableImageTypes=Primary%2CBackdrop%2CThumb&ImageTypeLimit=1&Limit=50&X-Emby-Token=8b0b16aae7e8403cb3d19969b82c3902`,
    homeUrl: `/emby/Users/80e861cbff1343bfa0bedcea78895b91/Views?X-Emby-Client=Emby+Web&X-Emby-Device-Name=Android+WebView+Android&X-Emby-Device-Id=ea27caf7-9a51-4209-b1a5-374bf30c2ffd&X-Emby-Client-Version=4.9.0.31&X-Emby-Token=8b0b16aae7e8403cb3d19969b82c3902&X-Emby-Language=zh-cn`,

    searchUrl: '/emby/Users/80e861cbff1343bfa0bedcea78895b91/Items?SortBy=SortName&SortOrder=Ascending&Fields=BasicSyncInfo%2CCanDelete%2CContainer%2CPrimaryImageAspectRatio%2CProductionYear%2CStatus%2CEndDate&StartIndex=0&EnableImageTypes=Primary%2CBackdrop%2CThumb&ImageTypeLimit=1&Recursive=true&SearchTerm=**&GroupProgramsBySeries=true&Limit=50&X-Emby-Token=8b0b16aae7e8403cb3d19969b82c3902',
    searchable: 2,
    quickSearch: 0,
    timeout: 5000,
    class_parse: $js.toString(() => {
        let html = request(rule.homeUrl);
        var json=JSON.parse(html).Items;
         var tabs = [];
            for (var i in json) {
                var it = json[i]
                
                if (it.CollectionType=="tvshows"||it.CollectionType=="movies") {
                    tabs.push({
                       type_name: it.Name,
                        type_id: it.Id,
                        
                    })
                }
            };
        
        input = tabs
        
    }),
    play_parse: true,
    lazy: $js.toString(() => {
        var bo = {
            "DeviceProfile": {
                "MaxStaticBitrate": 140000000,
                "MaxStreamingBitrate": 140000000,
                "MusicStreamingTranscodingBitrate": 192000,
                "DirectPlayProfiles": [{
                    "Container": "mp4,m4v",
                    "Type": "Video",
                    "VideoCodec": "h264,h265,hevc,av1,vp8,vp9",
                    "AudioCodec": "ac3,eac3,mp3,aac,opus,flac,vorbis"
                }, {
                    "Container": "mkv",
                    "Type": "Video",
                    "VideoCodec": "h264,h265,hevc,av1,vp8,vp9",
                    "AudioCodec": "ac3,eac3,mp3,aac,opus,flac,vorbis"
                }, {
                    "Container": "flv",
                    "Type": "Video",
                    "VideoCodec": "h264",
                    "AudioCodec": "aac,mp3"
                }, {
                    "Container": "mov",
                    "Type": "Video",
                    "VideoCodec": "h264",
                    "AudioCodec": "ac3,eac3,mp3,aac,opus,flac,vorbis"
                }, {
                    "Container": "opus",
                    "Type": "Audio"
                }, {
                    "Container": "mp3",
                    "Type": "Audio",
                    "AudioCodec": "mp3"
                }, {
                    "Container": "mp2,mp3",
                    "Type": "Audio",
                    "AudioCodec": "mp2"
                }, {
                    "Container": "aac",
                    "Type": "Audio",
                    "AudioCodec": "aac"
                }, {
                    "Container": "m4a",
                    "AudioCodec": "aac",
                    "Type": "Audio"
                }, {
                    "Container": "mp4",
                    "AudioCodec": "aac",
                    "Type": "Audio"
                }, {
                    "Container": "flac",
                    "Type": "Audio"
                }, {
                    "Container": "webma,webm",
                    "Type": "Audio"
                }, {
                    "Container": "wav",
                    "Type": "Audio",
                    "AudioCodec": "PCM_S16LE,PCM_S24LE"
                }, {
                    "Container": "ogg",
                    "Type": "Audio"
                }, {
                    "Container": "webm",
                    "Type": "Video",
                    "AudioCodec": "vorbis,opus",
                    "VideoCodec": "av1,VP8,VP9"
                }],
                "TranscodingProfiles": [{
                    "Container": "aac",
                    "Type": "Audio",
                    "AudioCodec": "aac",
                    "Context": "Streaming",
                    "Protocol": "hls",
                    "MaxAudioChannels": "2",
                    "MinSegments": "1",
                    "BreakOnNonKeyFrames": true
                }, {
                    "Container": "aac",
                    "Type": "Audio",
                    "AudioCodec": "aac",
                    "Context": "Streaming",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "mp3",
                    "Type": "Audio",
                    "AudioCodec": "mp3",
                    "Context": "Streaming",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "opus",
                    "Type": "Audio",
                    "AudioCodec": "opus",
                    "Context": "Streaming",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "wav",
                    "Type": "Audio",
                    "AudioCodec": "wav",
                    "Context": "Streaming",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "opus",
                    "Type": "Audio",
                    "AudioCodec": "opus",
                    "Context": "Static",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "mp3",
                    "Type": "Audio",
                    "AudioCodec": "mp3",
                    "Context": "Static",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "aac",
                    "Type": "Audio",
                    "AudioCodec": "aac",
                    "Context": "Static",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "wav",
                    "Type": "Audio",
                    "AudioCodec": "wav",
                    "Context": "Static",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "mkv",
                    "Type": "Video",
                    "AudioCodec": "ac3,eac3,mp3,aac,opus,flac,vorbis",
                    "VideoCodec": "h264,h265,hevc,av1,vp8,vp9",
                    "Context": "Static",
                    "MaxAudioChannels": "2",
                    "CopyTimestamps": true
                }, {
                    "Container": "m4s,ts",
                    "Type": "Video",
                    "AudioCodec": "ac3,mp3,aac",
                    "VideoCodec": "h264,h265,hevc",
                    "Context": "Streaming",
                    "Protocol": "hls",
                    "MaxAudioChannels": "2",
                    "MinSegments": "1",
                    "BreakOnNonKeyFrames": true,
                    "ManifestSubtitles": "vtt"
                }, {
                    "Container": "webm",
                    "Type": "Video",
                    "AudioCodec": "vorbis",
                    "VideoCodec": "vpx",
                    "Context": "Streaming",
                    "Protocol": "http",
                    "MaxAudioChannels": "2"
                }, {
                    "Container": "mp4",
                    "Type": "Video",
                    "AudioCodec": "ac3,eac3,mp3,aac,opus,flac,vorbis",
                    "VideoCodec": "h264",
                    "Context": "Static",
                    "Protocol": "http"
                }],
                "ContainerProfiles": [],
                "CodecProfiles": [{
                    "Type": "VideoAudio",
                    "Codec": "aac",
                    "Conditions": [{
                        "Condition": "Equals",
                        "Property": "IsSecondaryAudio",
                        "Value": "false",
                        "IsRequired": "false"
                    }]
                }, {
                    "Type": "VideoAudio",
                    "Conditions": [{
                        "Condition": "Equals",
                        "Property": "IsSecondaryAudio",
                        "Value": "false",
                        "IsRequired": "false"
                    }]
                }, {
                    "Type": "Video",
                    "Codec": "h264",
                    "Conditions": [{
                        "Condition": "EqualsAny",
                        "Property": "VideoProfile",
                        "Value": "high|main|baseline|constrained baseline|high 10",
                        "IsRequired": false
                    }, {
                        "Condition": "LessThanEqual",
                        "Property": "VideoLevel",
                        "Value": "62",
                        "IsRequired": false
                    }]
                }, {
                    "Type": "Video",
                    "Codec": "hevc",
                    "Conditions": []
                }],
                "SubtitleProfiles": [{
                    "Format": "vtt",
                    "Method": "Hls"
                }, {
                    "Format": "eia_608",
                    "Method": "VideoSideData",
                    "Protocol": "hls"
                }, {
                    "Format": "eia_708",
                    "Method": "VideoSideData",
                    "Protocol": "hls"
                }, {
                    "Format": "vtt",
                    "Method": "External"
                }, {
                    "Format": "ass",
                    "Method": "External"
                }, {
                    "Format": "ssa",
                    "Method": "External"
                }],
                "ResponseProfiles": [{
                    "Type": "Video",
                    "Container": "m4v",
                    "MimeType": "video/mp4"
                }]
            }
        };

        var html = post(input, {

            body: bo
        });



        var playlist = JSON.parse(html).MediaSources;
        var urls = [];
        var names = [];
        for (var it of playlist) {
            names.push(it.Name)
            urls.push(rule.host + it.DirectStreamUrl)
        }



        input = {
            parse: 0,
            jx: 0,
            url: urls[0]
        }



    }),
    一级: `js:  
    var d=[];
    var html = fetch(input);
    
    
            var list = JSON.parse(html).Items;
            for (var it of list) {
                var url =rule.host+ "/emby/Users/"+Users+"/Items/" + it.Id + "?X-Emby-Token="+Token ;
                
                if(it.Type=="Series"||it.Type=="Movie"){
                d.push({
                    title: it.Name,
                    desc: it.UserData.UnplayedItemCount?it.UserData.UnplayedItemCount.toString():"",
                    img: rule.host+"/emby/Items/" + it.Id + "/Images/Primary?maxHeight=300&maxWidth=200&tag=" + it.ImageTags.Primary + "&quality=90",
                    url: url
                })
                }
            }
          setResult(d)
    
    `,
    二级: `js:
    VOD = {
            type_name: "",
            vod_actor: "",
            vod_director: "",
            vod_area: "",
            vod_content: "",
            vod_name: "",
            vod_remarks: "",
            vod_year: "",
            
        }
var host = rule.host;
var  info = JSON.parse(fetch(input));
VOD.type_name = info.Genres.join(" ");
VOD.vod_name = info.Name;
VOD.vod_remarks = "评分：" + info.PlayAccess;
VOD.vod_content = info.Overview;
 
var id=info.Id;
if(info.Type=="Series"){
var shows=host+"/emby/Shows/" + id + "/Seasons?UserId="+Users+"&Fields=BasicSyncInfo%2CCanDelete%2CContainer%2CPrimaryImageAspectRatio&EnableTotalRecordCount=false&X-Emby-Token="+Token;
        
        var Season = JSON.parse(fetch(shows));

        
        let result=[];
        let from=[]
        try {
           for(var it of Season.Items){
          from.push(it.Name);
            let playlist = [];          
            let res = fetch(host+"/emby/Shows/" + id + "/Episodes?SeasonId=" + it.Id + "&ImageTypeLimit=1&UserId="+Users+"&Fields=Overview%2CPrimaryImageAspectRatio&Limit=1000&X-Emby-Token="+Token);
            let data = JSON.parse(res).Items;
            for (let item of data) {
              
                let title =item.Name;
                let url =host+ "/emby/Items/"+item.Id+"/PlaybackInfo?UserId="+Users+"&StartTimeTicks=0&IsPlayback=false&AutoOpenLiveStream=false&MaxStreamingBitrate=7000000&X-Emby-Client=Emby+Web&X-Emby-Device-Name=Android+WebView+Android&X-Emby-Device-Id=09d93358-fdd6-4d0b-9e13-d988795e8742&X-Emby-Client-Version=4.8.0.62&X-Emby-Token="+Token+"&X-Emby-Language=zh-cn&reqformat=json";
                playlist.push(title + '$' + url);
            }
            let vod_play_url = playlist.join("#")
            result.push(vod_play_url)
            }
            
            VOD.vod_play_url = result.join("$$$");
            VOD.vod_play_from=from.join("$$$")
        } catch (e) {
            log("解析片名海报等基础信息发生错误:" + e.message)
        }
    }else{
           var arr = []
           
          for(var it of info.MediaSources){
              arr.push(it.Name+"$"+host + "/emby/Items/" + id + "/PlaybackInfo?UserId=" + Users + "&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&AudioStreamIndex=5&SubtitleStreamIndex=2&MediaSourceId=" + it.Id + "&MaxStreamingBitrate=7000000&X-Emby-Client=Emby+Web&X-Emby-Device-Name=Android+WebView+Android&X-Emby-Device-Id=09d93358-fdd6-4d0b-9e13-d988795e8742&X-Emby-Client-Version=4.8.0.62&X-Emby-Token=" + Token + "&reqformat=json")
          }
        VOD.vod_play_url = arr.join("$$$");
            VOD.vod_play_from= "在线播放"
          
    }
    
    `,
    搜索: '*',
}
