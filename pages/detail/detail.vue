<template>
	<view class="detail">
		<view class="container">
			<view v-if="loadState">
				<!-- // 骨架 -->
				<view class="loadingState">
					<u-skeleton rows="4" title loading></u-skeleton>
				</view>
			</view>
			<view v-else> 
				<view class="title">
					{{detailObj.title}}
				</view>
				<view class="userinfo">
					<view class="avator">
						<image :src="giveAvatar(detailObj)" mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="name">{{getName(detailObj)}}</view>
						<view class="small"><uni-dateformat :date="detailObj.publish_date" format="yyyy年MM月dd hh:mm:ss" :threshold="[0,0]"></uni-dateformat>·发布于{{detailObj.province}}</view>
					</view>
				</view>
				<view class="content">
						<view class="u-content">
							<u-parse :content="detailObj.content" :tagStyle="tagStyle"></u-parse>
						</view>						
				 </view>					
				 </view>
			
			<view class="like">
				<view class="btn" :class="detailObj.isLike?'active':''" @click="clickLike">
					<text class="iconfont icon-good"></text>
					<text v-if="detailObj.like_count">{{detailObj.like_count}}</text>
				</view>
				<view class="users">
					<template v-for="item in likeUserArr">
						<image :src="giveAvatar(item)" mode="aspectFill"></image>
					</template>
				</view>
				<view class="text">
					<text class="num">{{detailObj.view_count}}</text>个人看过
				</view>
			</view>
		</view>
		
		<view class="comment" >
			<view style="padding-bottom:60rpx" v-if="!commentList.length && noComment " class="">
				<u-empty
				        mode="comment"
				        icon="http://cdn.uviewui.com/uview/empty/comment.png"
				>
				</u-empty>
			</view>
			<view class="content"  v-else>
				<view class="item" v-for="item in commentList">
					<comment-item :item="item" @removeEnv="PremoveEnv"></comment-item>
				</view>
			</view>
		</view>
		
		
		
		<comment-frame :commentObj="commentObj" @commentEnv="PcommentEnv"></comment-frame>
	</view>
</template>

<script>
	import{store} from'@/uni_modules/uni-id-pages/common/store.js'
	import {giveAvatar,getName,likeFun} from"../../utils/tools.js"
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject("utilsObj",{customUI:true})
	export default {
		data() {
			return {
				loadState:true,
				artid: '',
				tagStyle:{
					p:"line-height:1.7em",
					img:"margin:20rpx 0"
				},
				detailObj:null,
				likeUserArr:[],
				commentObj:{
					"article_id":"",
					"comment_type":0
				},
				commentList:[],
				noComment:false
			};
		},
		onLoad(e) {
			if(!e.id){
				this.errFun()
				return;
			}
			this.artid = e.id;
			this.commentObj.article_id = e.id
			this.getData()
			this.readUpdate()
			this.getLikeUser()
			this.getComment()
		},
		methods:{
			// 删除评论后回调（删除评论无感操作）
			PremoveEnv(e){
				let index = this.commentList.findIndex(item=>{
					return item._id == e.id
				})
				this.commentList.splice(index,1)
			},
			// 评论成功后回调（新增评论无感操作）
			PcommentEnv(e){
				console.log(e);
				this.commentList.unshift({
					...this.commentObj,
					...e,
					user_id:[store.userInfo],	
				})
			},
			// 获取评论和用户部分信息
			getComment(){
				let commentTemp = db.collection("quanzi_comment").where(`article_id == '${this.artid}'`).orderBy("comment_date desc").limit(5).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file,username,nikename").getTemp();
				db.collection(commentTemp,userTemp).get().then(res=>{
					this.commentList = res.result.data
					if(res.result.data == 0) this.noComment = true
				})
			},
			giveAvatar,
			getName,
			// 获取部分点赞用户信息
			getLikeUser(){
				let likeTemp = db.collection("quanzi_like").where(`article_id=='${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file").getTemp();
				db.collection(likeTemp,userTemp).orderBy("publish_date desc").limit(5).get().then(res=>{
					res.result.data = res.result.data.reverse()
					this.likeUserArr = res.result.data
					
				})
			},
			// 点赞操作
			async clickLike(){
				if(!store.hasLogin){
					uni.showModal({
						title:"请登录后再点赞",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:"/uni_modules/uni-id-pages/pages/login/login-withpwd"
								})
							}
						}
					})
					return
				}
				// 防抖处理
				let time = Date.now();
				if(time-this.likeTime < 2000){
					uni.showToast({
						title:"操作太频繁了，请稍后....",
						icon:"none"
					})
					return
				}
				
				this.detailObj.isLike ? this.detailObj.like_count-- : this.detailObj.like_count++; 
				this.detailObj.isLike = !this.detailObj.isLike ;
				this.likeTime = time;
				// 操作数据库
				likeFun(this.artid);
			},
			
			
			// 修改阅读量
			readUpdate(){
				utilsObj.operation("quanzi_article","view_count",this.artid,1)
			},
			// 错误处理
			errFun(){
				uni.showToast({
					title:"参数有误",
					icon:"none"
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:"/pages/index/index"
					})
				},1000)
			},
			getData(){
				let artTemp = db.collection("quanzi_article").where(`_id == "${this.artid}"`).getTemp();
				let userTemp=db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let likeTemp = db.collection("quanzi_like").where(`article_id == "${this.artid}" && user_id==$cloudEnv_uid`).getTemp();
				let tempArr = [artTemp,userTemp];
				if(store.hasLogin){
					tempArr.push(likeTemp)
				}
				db.collection(...tempArr).get({getOne:true}).then(res=>{
					this.loadState = false;
					
					let isLike = false;
					if(store.hasLogin) isLike = res.result.data._id.quanzi_like.length? true : false;					
					res.result.data.isLike = isLike;
					
					this.detailObj = res.result.data;
					uni.setNavigationBarTitle({
						title:this.detailObj.title
					})
					if(!res.result.data){
						this.errFun()
						return
					}
				}).catch(err=>{
					this.errFun();
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 20rpx;
			background: #fff;

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.userinfo {
				padding: 30rpx 0;
				display: flex;

				.avator {
					width: 100rpx;
					height: 100rpx;

					image {
						height: 100%;
						width: 100%;
						overflow: hidden;
						border-radius: 50%;
					}
				}

				.text {
					padding-left: 20rpx;

					.small {
						font-size: 30rpx;
						color: #aaaaaa;
					}
				}
			}

			.content {
				// margin: 40rpx 0;
				font-size: 35rpx;
				font-weight: 500;
			}

			.like {
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 80rpx 50rpx 50rpx;

				.btn {
					width: 260rpx;
					height: 120rpx;
					background: #e4e4e4;
					color: #fff;
					font-size: 28rpx;
					border-radius: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.iconfont {
						font-size: 50rpx;
					}
					&.active{						
						background: #00ffff;
					}
				}

				.users {
					display: flex;
					justify-content: center;
					padding:30rpx 0;
					image {
						width: 80rpx;
						height: 80rpx;										
						border-radius: 50%;
						border:3px solid #fff;
						margin-left:-20rpx;
					}
				}

				.text {
					.num {
						color: #0fcbff;
					}
				}
			}
		}
		.comment{
			padding:30rpx;
			padding-bottom:120rpx;
			.item{
				padding:10rpx 0;
			}
		}

	}
</style>