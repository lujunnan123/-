// 从富文本中截取图片url
export function getImgSrc(richtext, num = 3) {
	let imgList = [];
	richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		imgList.push(capture);
	});
	imgList = imgList.slice(0, num)
	return imgList
}
// 获取当前ip地址
export function getProvince() {
	return new Promise((resolve, reject) => {
		let historyProvince = uni.getStorageSync("historyProvince")
		if (historyProvince) {
			// 走缓存逻辑
			// 如果时间超出10天，重新获取IP属地
			if ((Date.now() - historyProvince.time) > 1000 * 60 * 60) {
				// 走重新请求网络逻辑
				getIp().then(res => {
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			}else{
				// 走直接读取缓存
				resolve(historyProvince.province)
			}
		} else {
			// 第一次直接走网络
			getIp().then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		}
	})
}

function getIp() {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: "https://restapi.amap.com/v3/ip?key=93139b2b66e33d2dfde3aea12a6fa872",
			success: res => {
				let str = ""
				if (typeof(res.data.province) == "string") {
					str = res.data.province
				} else {
					str = "IP未知"
				}
				resolve(str)
				let obj = {
					province: str,
					time: Date.now()
				}
				uni.setStorageSync("historyProvince", obj)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}
export function getName(item){
	return item.user_id[0].nickname ? item.user_id[0].nickname : item.user_id[0].username
}
export function giveAvatar(item){
	return item.user_id[0].avatar_file?.url ?? '../../static/images/用户.png'
}

// 点赞操作数据库方法
const db = uniCloud.database();
const utilsObj = uniCloud.importObject("utilsObj",{customUI:true});
export function likeFun(artid){
	// 判断现登录的用户是否已经点赞了改篇文章
	let count = db.collection("quanzi_like").where(`article_id == "${artid}" && user_id==$cloudEnv_uid`).count();
	if(count.result?.total){					
		// 向点赞表中移除该用户的文章记录
		db.collection("quanzi_like").where(`article_id == "${artid}" && user_id==$cloudEnv_uid`).remove()
		utilsObj.operation("quanzi_article","like_count",artid,-1)
	}else{			
		// 向点赞表中加入 用户id（user_id） 文章id(_id)
		db.collection("quanzi_like").add({
			article_id:artid
		})				
		utilsObj.operation("quanzi_article","like_count",artid,1)
	}
}