#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import json
import time
import base64

class Spider(Spider):
	def getName(self):
		return "一席"
	def init(self,extend=""):
		print("============{0}============".format(extend))
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		url = 'https://yixi.tv/api/site/category/?_=1'
		jo = self.fetch(url,headers=self.header).json()
		category = jo['data']['items']
		classes = []
		classes.append({
				'type_name':'全部',
				'type_id':''
			})
		for cat in category:
			classes.append({
				'type_name':cat['title'],
				'type_id':cat['id']
			})
		result['class'] = classes
		if(filter):
			result['filters'] = self.config['filter']
		return result
	def homeVideoContent(self):
		# url = 'https://yixi.tv/api/site/album/?page=1&page_size=4&_=1'
		url = 'https://yixi.tv/api/site/album/22/detail/?page=1&page_size=24&_=1'
		jo = self.fetch(url,headers=self.header).json()
		videos = []
		vodList = jo['data']['items']
		for vod in vodList:
			videos.append({
				"vod_id":vod['id'],
				"vod_name":vod['title'],
				"vod_pic":vod['cover'],
				"vod_remarks":vod['time']
			})	
		result = {
			'list':videos
		}
		return result
	def categoryContent(self,tid,pg,filter,extend):		
		result = {}
		url = 'https://yixi.tv/api/site/speech/?page={1}&page_size=12&category_id={0}&order_by=0&_=1'.format(tid,pg)
		jo = self.fetch(url,headers=self.header).json()
		videos = []
		vodList = jo['data']['items']
		for vod in vodList:
			videos.append({
				"vod_id":vod['id'],
				"vod_name":vod['title'],
				"vod_pic":vod['cover'],
				"vod_remarks":vod['time']
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = 9999
		result['limit'] = 90
		result['total'] = 999999
		return result
	def detailContent(self,array):
		tid = array[0]
		url = "https://yixi.tv/api/site/speech/{0}/detail/?_=1".format(tid)
		jo = self.fetch(url,headers=self.header).json()

		vod = {
			"vod_id":jo['data']['speech']['id'],
			"vod_name":jo['data']['speech']['title'],
			"vod_pic":jo['data']['speech']['cover'],
			"type_name":jo['data']['speech']['first_category'],
			"vod_year":"",
			"vod_area":"",
			"vod_remarks":jo['data']['speech']['date'],
			"vod_actor":"",
			"vod_director":"",
			"vod_content":jo['data']['speech']['titlelanguage']
		}

		vod['vod_play_from'] = '一席'
		pList = []
		for vUrl in jo['data']['speech']['video_url']:
			pList.append(vUrl['type_name']+"$"+vUrl['video_url'])
		vod['vod_play_url'] = '#'.join(pList)
		result = {
			'list':[
				vod
			]
		}
		return result
	def searchContent(self,key,quick):
		result = {
			'list':[]
		}
		return result
	def playerContent(self,flag,id,vipFlags):
		result = {}
		result["parse"] = 0
		result["playUrl"] = ''
		result["url"] = id
		result["header"] = ''
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {
		"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36"
	}

	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]