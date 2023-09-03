<template>
	<view class="blogitem">
		<view class="head">
			<view class="userinfo">
				<view class="avator">
					<image src="../../static/logo.png" mode="aspectFill"></image>
				</view>
				<view class="name">admin</view>
				<view class="time">
					<uni-dateformat :date="Date.now()" format="MM月dd hh:mm"
						:threshold="[60000,3600000*24*30]"></uni-dateformat>
				</view>
			</view>
			<view class="more">
				<view class="iconfont icon-elipsis">

				</view>
			</view>
		</view>
		<view class="body">
			<view class="title">默认标题</view>
			<view class="text">
				<view class="t">
					因为数仓侧独有的特点，数据按时间分区，比如某天数据只被影响了一个小的时段，也需要重新制作这一整天分区数据回溯，但发现得越早回溯的分区数据也就越少，效率还是有保障。
				</view>
			</view>
			<view class="piclist">
				<view class="pic" :class="picArr.length==1?'only':''" v-for="item in picArr" :key="item">
					<image src="../../static/xiao.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="info">
			<view class="box">
				<text class="iconfont icon-browse">
				</text>
				<text>111</text>
			</view>
			<view class="box">
				<text class="iconfont icon-comment">
				</text>
				<text>222</text>
			</view>
			<view class="box">
				<text class="iconfont icon-good">
				</text>
				<text>333</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "blog-item",
		data() {
			return {
				picArr: [1, 2, 3]
			};
		}
	}
</script>

<style lang="scss">
	.blogitem {
		margin: 20rpx;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;

			.userinfo {
				display: flex;
				align-items: center;

				.avator {
					width: 40rpx;
					height: 40rpx;
					overflow: hidden;
					border-radius: 50%;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}

				.name {
					color: #222;
					padding-left: 20rpx;
				}

				.time {
					margin-left: 20rpx;
					// padding-left: 20rpx;
					font-size: 22rpx;
					color: #bfbfbf;
				}
			}

			.more {
				padding: 5rpx;

				.iconfont {
					font-size: 50rpx;
					color: #888;
				}
			}
		}

		.body {
			padding: 15rpx 0 30rpx;

			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: #000;
				text-align: justify;
			}

			.text {
				font-size: 30rpx;
				color: #888;
				text-align: justify;
				padding: 10rpx 0;

				.t {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.piclist {
				padding-top: 20rpx;
				display: flex;

				.pic {
					width: 225rpx;
					height: 225rpx;
					margin-right: 6rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}

					&:first-child {
						border-radius: 20rpx 0 0 20rpx;
					}

					&:last-child {
						border-radius: 0 20rpx 20rpx 0;
					}

					&.only {
						border-radius: 20rpx;
					}
				}
			}
		}

		.info {
			display: flex;
			justify-content: space-around;
			color: #333;
			font-size: 26rpx;
			align-items: center;

			.box {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				padding: 15rpx 0 5rpx;

				.iconfont {
					font-size: 40rpx;
					padding-right: 10rpx;
				}
			}
		}
	}
</style>