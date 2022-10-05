#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..')
from base.spider import Spider
import re
import math
import json

class Spider(Spider):
	def getName(self):
		return "企鹅体育"
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
		url = 'https://m.jrskbs.com'
		rsp = self.fetch(url)
		html = self.html(rsp.text)
		aList = html.xpath("//div[contains(@class, 'contentList')]/a")
		videos = []
		numvL = len(aList)
		pgc = math.ceil(numvL/15)
		for a in aList:
			aid = a.xpath("./@href")[0]
			aid = self.regStr(reg=r'/live/(.*?).html', src=aid)
			img = a.xpath(".//div[@class='contentLeft']/p/img/@src")[0]
			home = a.xpath(".//div[@class='contentLeft']/p[@class='false false']/text()")[0]
			away = a.xpath(".//div[@class='contentRight']/p[@class='false false']/text()")[0]
			infoArray = a.xpath(".//div[@class='contentCenter']/p")
			remark = ''
			for info in infoArray:
				content = info.xpath('string(.)').replace(' ','')
				remark = remark + '|' + content
			videos.append({
				"vod_id": aid,
				"vod_name": home + 'vs' + away,
				"vod_pic": img,
				"vod_remarks": remark.strip('|')
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = pgc
		result['limit'] = numvL
		result['total'] = numvL
		return result

	def detailContent(self,array):
		aid = array[0]
		url = 'https://ddys.tv/{0}/'.format(aid)
		rsp = self.fetch(url)
		self.cookies = rsp.cookies
		self.url = url
		html = self.html(rsp.text)
		title = html.xpath("//div[@class='title']/a/text()")[0]
		infoList = html.xpath("//div[@class='abstract']/text()")
		cont = infoList[-1].replace('简介: ','').replace('\u3000',' ')
		pic = html.xpath("//div[@class='post']/img/@src")[0]
		remark = html.xpath("//div[@class='entry']/font/text()")[0]
		for info in infoList:
			if info.startswith('导演'):
				dir = info.replace('导演: ','').strip()
			if info.startswith('演员'):
				act = info.replace('演员: ','').replace(' / ','').strip()
			if info.startswith('类型'):
				typeName = info.replace('类型: ','').replace(' ','')
			if info.startswith('制片国家/地区'):
				area = info.replace('制片国家/地区: ','').replace(' ','')
			if info.startswith('年份'):
				year = info.replace('年份: ','').replace(' ','')
		vod = {
			"vod_id": aid,
			"vod_name": title,
			"vod_pic": pic,
			"type_name": typeName,
			"vod_year": year,
			"vod_area": area,
			"vod_remarks": remark,
			"vod_actor": act,
			"vod_director": dir,
			"vod_content": cont
		}
		rootList = html.xpath("//script[@class='wp-playlist-script']/text()")[0]
		jo = json.loads(rootList.replace(' ', '').replace('\n', ''))['tracks']
		playUrl = ''
		for tmpJo in jo:
			purl = tmpJo['src1']
			name = tmpJo['caption']
			playUrl = playUrl + '{0}${1}#'.format(name, purl)
		vod['vod_play_from'] = '低端影视'
		vod['vod_play_url'] = playUrl

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

		headers = {
			"referer": self.url,
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
		}
		url = 'https://ddys.tv/getvddr/video?id={0}&dim=1080P&type=mix'.format(id)
		rsp = self.fetch(url,cookies=self.cookies,headers=headers)
		jo = json.loads(rsp.text)
		url = jo['url']
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