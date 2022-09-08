#coding=utf-8
#!/usr/bin/python
import sys
sys.path.append('..') 
from base.spider import Spider
import json

class Spider(Spider):  # 元类 默认的元类 type
	def getDependence(self):
		return ['py_ali']
	def getName(self):
		return "YYDS"
	def init(self,extend=""):
		self.ali = extend[0]
		print("============YYDS============".format(extend))
		pass
	def homeContent(self,filter):
		result = {}
		cateManual = {
			"热门":"0",
			"电影":"3",
			"剧集":"12",
			"综艺":"10"
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
		result = {
			'list':[]
		}
		return result
	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		form = {
			'limit': 24,
			'skip': int(pg) * 24 - 24,
			'keyword': '',
			'category_id': tid,
		}
		rsp = self.post("https://cmn.yydshd.com/api/posts",data=form)
		jo = json.loads(rsp.text)
		vodList = jo['data']['list']
		videos = []
		for vod in vodList:
			name = vod['title']
			pic = vod['cover']
			sid = vod['id']
			suffix = ''
			if vod['is_vip'] == 1:
				suffix = ' 会员'
			mark = str(vod['score']) + suffix
			videos.append({
				"vod_id":sid,
				"vod_name":name,
				"vod_pic":pic,
				"vod_remarks":mark
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = 9999
		result['limit'] = 90
		result['total'] = 999999
		return result
	token = ''
	def getHeader(self,force=False):
		if len(self.token) == 0 or force:
			form = {
				'email': '',
				'password': ''
			}
			if len(form['password']) > 0:
				rsp = self.post("https://cmn.yydshd.com/api/login",data=form)
				jo = json.loads(rsp.text)
				self.token = jo['data']['token']
		return {
			'token':self.token,
			'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.70'
		}
	def detailContent(self,array):
		tid = array[0]
		result = {}
		form = {
			'id': tid
		}
		rsp = self.post("https://cmn.yydshd.com/api/post-info",data=form,headers=self.getHeader())
		jo = json.loads(rsp.text)
		if(jo['status_code'] == 403):
			retry = self.post("https://cmn.yydshd.com/api/post-info",data=form,headers=self.getHeader(True))
			jo = json.loads(retry.text)
			if jo['status_code'] == 403:
				return {'list':[]}
		vodInfo = jo['data']
		videos = []
		name = vodInfo['title']
		pic = vodInfo['cover']
		mark = vodInfo['score']
		vod = {
			"vod_id":tid,
			"vod_name":name,
			"vod_pic":pic,
			"type_name":"",
			"vod_year":vodInfo['year'],
			"vod_area":vodInfo['region'],
			"vod_remarks":mark,
			"vod_actor":vodInfo['actors'],
			"vod_director":vodInfo['director'],
			"vod_content":vodInfo['desc']
		}
		playList = vodInfo['links']
		tmpLink = ''
		for play in playList:
			if play['name'] == '阿里网盘':
				if len(play['item']) > 0:
					tmpLink = play['item'][0]['link']
				break
		if len(tmpLink) > 0:
			vod['vod_play_from'] = 'AliYun$$$AliYun原画'
			newArray = [tmpLink]
			rs = self.ali.detailContent(newArray)
			vod['vod_play_url'] = rs['list'][0]['vod_play_url']
		result = {
			'list':[
				vod
			]
		}
		return result

	def searchContent(self,key,quick):		
		result = {}
		form = {
			'limit': 24,
			'skip': 0,
			'keyword': key,
			'category_id': -1,
		}
		rsp = self.post("https://cmn.yydshd.com/api/posts",data=form)
		jo = json.loads(rsp.text)
		vodList = jo['data']['list']
		videos = []
		for vod in vodList:
			name = vod['title']
			pic = vod['cover']
			sid = vod['id']
			suffix = ''
			if vod['is_vip'] == 1:
				suffix = ' 会员'
			mark = str(vod['score']) + suffix
			videos.append({
				"vod_id":sid,
				"vod_name":name,
				"vod_pic":pic,
				"vod_remarks":mark
			})
		result = {
			'list':videos
		}
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {
		"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
	}
	def playerContent(self,flag,id,vipFlags):		
		return self.ali.playerContent(flag,id,vipFlags)
	def isVideoFormat(self,url):
		pass
	def manualVideoCheck(self):
		pass
	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]