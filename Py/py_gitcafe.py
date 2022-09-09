#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import requests

class Spider(Spider):
	def getDependence(self):
		return ['py_ali']
	def getName(self):
		return "py_gitcafe"
	def init(self,extend):
		self.ali = extend[0]
		print("============py_gitcafe============")
		pass
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def homeContent(self,filter):
		result = {}
		cateManual = {
			"hyds": "华语电视",
			"rhds": "日韩电视",
			"omds": "欧美电视",
			"qtds": "其他电视",
			"hydy": "华语电影",
			"rhdy": "日韩电影",
			"omdy": "欧美电影",
			"qtdy": "其他电影",
			"hydm": "华语动漫",
			"rhdm": "日韩动漫",
			"omdm": "欧美动漫",
			"jlp": "纪录片",
			"zyp": "综艺片",
			"jypx": "教育培训",
			"qtsp": "其他视频",
			"hyyy": "华语音乐",
			"rhyy": "日韩音乐",
			"omyy": "欧美音乐",
			"qtyy": "其他音乐",
			"kfrj": "娱乐软件",
			"xtrj": "系统软件",
			"wlrj": "网络软件",
			"bgrj": "办公软件",
			"qtrj": "其他软件",
			"mh": "漫画",
			"xs": "小说",
			"cbs": "出版书",
			"zspx": "知识培训",
			"qtwd": "其他文档",
			"bz": "壁纸",
			"rw": "人物",
			"fj": "风景",
			"qttp": "其他图片",
			"qt": "其他"
		}
		classes = []
		for k in cateManual:
			classes.append({
				'type_name':k,
				'type_id':cateManual[k]
			})
		result['class'] = classes
		return result
	def homeVideoContent(self):
		result = {}
		if len(self.homeData.keys()) == 0:
			url = self.baseUrl+'/alipaper/home.json'
			self.homeData = self.fetch(url,headers=self.header).json()
		cateList = self.homeData['data']
		videos = []
		for cate in cateList:
			if cate['info']['code'] in self.category:
				vodList = cate['data']		
				for vod in vodList:
					videos.append({
						"vod_id":"https://www.aliyundrive.com/s/" + vod['key'],
						"vod_name":vod['title'],
						"vod_pic":'https://txc.gtimg.com/data/375895/2022/0214/d6b96cc3799b6417d30e4715d2973f64.png',
						"vod_remarks":''
					})
		result['list']=videos
		return result
	def categoryContent(self,tid,pg,filter,extend):
		url = self.baseUrl+'/tool/alipaper/'
		form = {
			"action": "viewcat",
			"cat": tid,
			"num":pg
		}
		vodList = requests.post(url,headers=self.header,data=form).json()
		videos = []
		for vod in vodList:
			videos.append({
				"vod_id": 'https://www.aliyundrive.com/s/'+vod["key"],
				"vod_name": vod["title"],
				"vod_pic": "https://txc.gtimg.com/data/375895/2022/0214/d6b96cc3799b6417d30e4715d2973f64.png",
				"vod_remarks": vod['cat']
			})
		return videos
	header = {
		"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36"
	}
	category = ['hydm','hyds','hydy','omdm','omds','omdy','rhdm','rhds','rhdy','qtds','qtdy','qtsp','jlp','zyp']
	def detailContent(self,array):
		return self.ali.detailContent(newArray)
	def searchContent(self,key,quick):
		url = self.baseUrl+'/tool/alipaper/'
		form = {
			"action": "search",
			"keyword": key
		}
		vodList = requests.post(url,headers=self.header,data=form).json()
		videos = []
		for vod in vodList:
			videos.append({
				"vod_id": 'https://www.aliyundrive.com/s/'+vod["key"],
				"vod_name": vod["title"],
				"vod_pic": "https://txc.gtimg.com/data/375895/2022/0214/d6b96cc3799b6417d30e4715d2973f64.png",
				"vod_remarks": vod['cat']
			})
		return videos
	def playerContent(self,flag,id,vipFlags):
		return self.ali.playerContent(flag,id,vipFlags)
	homeData = {}
	baseUrl = 'https://gitcafe.net'
	config = {
		"player": {},
		"filter": {}
	}
	header = {
		"User-Agent": "Mozilla/5.0 (Linux; Android 12; V2049A Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36",
        "Referer": "https://u.gitcafe.net/"
	}
	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]