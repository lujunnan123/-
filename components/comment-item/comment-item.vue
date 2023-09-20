<template>
			<view class="comment-item">
				<view class="avatar">
					<u-avatar :src="giveAvatar(item)" size="26"></u-avatar>
				</view>
				<view class="wrap">
					<view class="username">
						{{getName(item)}}
						<text class="iconfont icon-close" @click="delComment"></text>
					</view>
					<view class="comment-content">{{item.comment_content}}</view>
					<view class="info">
						<view class="reply-btn">3回复</view>
						<view class="">
							<uni-dateformat :date="item.comment_date" :threshold="[60000,36000000]"></uni-dateformat>
						</view>
						<view class="">
							{{item.province}}
						</view>
					</view>
				</view>
			</view>

</template>

<script>
	
	import {giveAvatar,getName,likeFun} from"../../utils/tools.js"
	const db = uniCloud.database()
	export default {
		props:{
			item:{
				type:Object,
				default(){
					return
				}
			}
		},
		name: "comment-item",
		data() {
			return {

			};
		},
		methods:{
			giveAvatar,getName,
			
			removeComment(){
				db.collection("quanzi_comment").doc(this.item._id).remove().then(res=>{
					uni.showToast({
						title:'删除成功'
					})
					this.$emit("removeEnv",{id:this.item._id})
				})
			},
			delComment(){
				uni.showModal({
					title:"是否删除",
					success: (res) => {
						if(res.confirm){
							this.removeComment()
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.comment-item {
		display: flex;

		.wrap {
			flex: 1;
			padding-left: 20rpx;
			padding-bottom: 20rpx;

			.username {
				font-size: 26rpx;
				color: #666;
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.iconfont{
					font-size: 20rpx;
					padding:10rpx;
					color: #999;
				}
				.iconfont {
					font-size: 20rpx;
					padding: 10rpx;
					color: #999;
				}
			}

			.comment-content {
				font-size: 34rpx;
				color: #111;
				line-height: 1.8em;
			}

			.info {
				font-size: 26rpx;
				color: #666;
				display: flex;
				padding: 10rpx 0;
				align-items: center;

				view {
					margin-right: 25rpx;
				}

				.reply-btn {
					padding: 6rpx 18rpx;
					background: #e4e4e4;
					border-radius: 30rpx;
				}
			}
		}
	}
</style>