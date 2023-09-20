<template>
	<view class="user">
		<view class="top">
			<view class="group"  @click="toUserInfo"> 
				<view class="userinfo">
					<view class="avator">
						<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"
							mode="aspectFill"></image>
						<image v-else src="../../uni_modules/uni-id-pages/static/login/uni-fab-login/user.png"
							mode="aspectFill"></image>
					</view>
					<view class="users" v-if="hasLogin">
						<view class="nickname">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</view>
						<view class="year">
							<uni-dateformat :date="userInfo.register_date" format="MM月dd hh:mm"
								:threshold="[60000,3600000*24*7]"></uni-dateformat>注册
						</view>
					</view>
					<view class="text" v-else>
						<view class="nickname">点击登录</view>
					</view>
				</view>
				<view class="more">
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="bg">
				<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"
					mode="aspectFill"></image>
				<image v-else src="../../uni_modules/uni-id-pages/static/login/uni-fab-login/user.png"
					mode="aspectFill"></image>
			</view>
		</view>

		<view class="main">
			<view class="info">
				<view class="item">
					<text>{{total.likeNum}}</text>获赞
				</view>
				<view class="item">
					<text>22</text>评论
				</view>
				<view class="item">
					<text>{{total.artNum}}</text>发文
				</view>
			</view>

			<view class="list">
				<view class="group">
					<view class="item">
						<view class="left" @click="goContent"><text class="iconfont icon-edit"></text>我的长文</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
					<view class="item">
						<view class="left"  @click="goContent"><text class="iconfont icon-good"></text>我的点赞</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
					<view class="item">
						<view class="left"><text class="iconfont icon-comment"></text>评论过的</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
				</view>
				<view class="group">
					<view class="item">
						<view class="left"><text class="iconfont icon-prompt"></text>关于</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
					<view class="item" @click="goFeedBack()">
						<view class="left" ><text class="iconfont icon-discount" ></text>意见反馈</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
				</view>
				<view class="group">
					<view class="item" @click="logout">
						<view class="left" ><text class="iconfont icon-sign-out"></text>退出登录</view>
						<view class="right"><text class="iconfont icon-arrow-right"></text></view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import{
		store,mutations
	} from'@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {
				title: 'Hello',
				total:{
					artNum:0,
					likeNum:0
				}
			}
		},
		onLoad() {
			console.log(store.userInfo);
			this.getTotal()
		},
		computed:{
			userInfo(){
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			}
		},
		methods: {
			async getTotal(){
				if(!this.hasLogin) return
				let artCount = await db.collection("quanzi_article").where(`user_id == $cloudEnv_uid`).count()
				this.total.artNum =artCount.result.total;
				let likeCount = await db.collection("quanzi_article").where(`user_id == $cloudEnv_uid`)
				.groupBy('user_id')
				.groupField('sum(like_count) as totalScore').get()
				this.total.likeNum = likeCount.result.data[0].totalScore
			},
			// 跳转 意见反馈
			goFeedBack(){
				if(this.goLoginPage()) return
				uni.navigateTo({
					url:"/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback"
				})
			},
			// 跳转喜欢
			goLike(){
				if(this.goLoginPage()) return
				uni.navigateTo({
					url:"/pages/quanzi_like/list"
				})
			},
			// 跳转长文
			goContent(){
				if(this.goLoginPage()) return
				uni.navigateTo({
					url:"/pages/quanzi_article/list"
				})
			},
			// 编辑个人资料
			toUserInfo(){
				uni.navigateTo({
					url:"/uni_modules/uni-id-pages/pages/userinfo/userinfo"
				})
			},
			logout(){
				if(this.goLoginPage()) return
				uni.showModal({
					title:"是否确认退出",
					success: (res) => {
						console.log(res);
						if(res.confirm){
							mutations.logout()
						}
					}
				})
			},
			goLoginPage(){
				if(!this.hasLogin){
					uni.showToast({
						title:"未登录",
						icon:"none"
					})
					return true
				}
				return false
			}
		}
	}
</script>

<style lang="scss">
	.user {
		.top {
			padding: 0 30rpx;
			padding-top: var(--status-bar-height);
			background-color: #ada8a8;
			height: 300rpx;
			position: relative;
			display: flex;
			align-items: center;

			.group {
				position: relative;
				z-index: 10;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #ffffff;
				width: 100%;

				.userinfo {
					width: 100%;
					display: flex;
					align-items: center;
					.avator {
						height: 120rpx;
						width: 120rpx;
						border-radius: 50%;
						overflow: hidden;
						background-color: #aaffff;	
						border: 2px solid #fff;
						image {
							width: 100%;
							height: 100%;
						}
					}

					.users {
						padding-left: 15rpx;

					}
					.text{
						padding-left: 15rpx;
						font-size: 50rpx;
					}
				}
			}

			.bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0.5;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					filter: blur(20px);
					transform: scale(2);
				}

			}

		}

		.main {
			width: 100%;
			min-height: 200rpx;
			background: #fff;
			border-radius: 30rpx;
			transform: translateY(-30rpx);
			padding: 30rpx 0;
			.info{
				display: flex;
				font-size: 30rpx;
				.item{
					padding-left: 20rpx;
					color: #888;
					text{
						font-weight: 800;
						color: #333;
					}
				}
			}
			.list {
				.group {
					padding: 15rpx 30rpx;
					border-bottom: #f4f4f4 solid 15rpx;

					.item {
						font-size: 40rpx;
						display: flex;
						justify-content: space-between;
						padding: 25rpx 0;
						border-bottom: 1rpx solid #f8f8f8;

						.left {
							// display: flex;
							// justify-content: center;
							text-align: center;

							.iconfont {
								padding-right: 10rpx;
								font-size: 35rpx;
							}
						}
					}
				}
			}

		}

	}
</style>