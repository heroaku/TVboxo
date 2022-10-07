#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import re
import math

class Spider(Spider):
	def getName(self):
		return "体育直播"
	def init(self,extend=""):
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		cateManual = {
			"全部": ""
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name': k,
				'type_id': cateManual[k]
			})

		result['class'] = classes
		if (filter):
			result['filters'] = self.config['filter']
		return result
	def homeVideoContent(self):
		result = {}
		return result

	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		url = 'http://www.freezb.live/'
		rsp = self.fetch(url)
		html = self.html(rsp.text)
		aList = html.xpath("//tr[@class='match_main']")
		videos = []
		img = 'https://s1.ax1x.com/2022/10/07/x3NPUO.png'
		for a in aList:
			urlList = a.xpath("./td[@class='update_data live_link']/a")
			stat = a.xpath("./td[contains(@style, 'font-weight:bold')]/sapn/@title")[0]
			time = a.xpath("./td[contains(@style, 'font-weight:bold')]/sapn/text()")[0]
			if '比分' not in urlList[0].xpath("./text()")[0] and stat == '直播中':
				remark = a.xpath(".//p[@class='raceclass matchcolor']/@title")[0].replace('直播','') + '|' + time
				name = a.xpath("string(./td[4])").replace(' ','').replace('\tVS','VS')
				if 'VS' not in name:
					names = name.split('\t')
					remark = names[0] + '|' + time
					name = names[-1].replace('vs','VS')
				aid = ''
				for url in urlList:
					title = url.xpath("./text()")[0]
					aurl = url.xpath("./@href")[0]
					aurl = self.regStr(reg=r'/tv/(.*?).html', src=aurl)
					if '比分' not in title:
						aid = aid + title + '@@@' + aurl + '#'
				videos.append({
					"vod_id": name + '###' + remark.split('|')[0] + '###' + aid,
					"vod_name": name,
					"vod_pic": img,
					"vod_remarks": remark
				})
		numvL = len(videos)
		pgc = math.ceil(numvL/15)
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = pgc
		result['limit'] = numvL
		result['total'] = numvL
		return result

	def detailContent(self,array):
		aid = array[0]
		aids = aid.split('###')
		name = aids[0]
		typeName = aids[1]
		tus = aids[2].strip('#').split('#')
		pic = 'https://s1.ax1x.com/2022/10/07/x3NPUO.png'
		vod = {
			"vod_id": name,
			"vod_name": name,
			"vod_pic": pic,
			"type_name": typeName,
			"vod_year": "",
			"vod_area": "",
			"vod_remarks": '',
			"vod_actor": '',
			"vod_director":'',
			"vod_content": ''
		}
		purl = ''
		for tu in tus:
			title = tu.split('@@@')[0]
			uid = tu.split('@@@')[1]
			url = "http://www.freezb.live/tv/{0}.html".format(uid)
			rsp = self.fetch(url)
			root = self.html(rsp.text)
			phpurl = root.xpath("//div[@class='media']/iframe/@src")[0]
			purl = purl + '{0}${1}@@@{2}'.format(title,phpurl,uid) + '#'
		vod['vod_play_from'] = '体育直播'
		vod['vod_play_url'] = purl
		result = {
			'list': [
				vod
			]
		}
		return result

	def searchContent(self,key,quick):
		result = {}
		return result

	def playerContent(self,flag,id,vipFlags):
		result = {}
		ids = id.split('@@@')
		url = ids[0]
		vid = ids[1]
		headers = {
			"referer": "http://www.freezb.live/tv/{0}.html".format(vid),
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
		}
		rsp = self.fetch(url,headers=headers)
		aurl = self.regStr(reg=r'\"../(.*?)\"', src=rsp.text)
		if aurl =='':
			url = self.regStr(reg=r"url: \'(.*?)\'", src=rsp.text)
		else:
			pheaders = {
				"referer": url,
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
			}
			purl = self.regStr(reg=r'(.*)/', src=url) + '/' + aurl
			prsp = self.fetch(purl, headers=pheaders)
			url = self.regStr(reg=r"url: \'(.*?)\'", src=prsp.text)
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = url
		result["header"] = ''
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {}

	def localProxy(self,param):
		action = {
			'url':'',
			'header':'',
			'param':'',
			'type':'string',
			'after':''
		}
		return [200, "video/MP2T", action, ""]