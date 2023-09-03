<template>
	<view class="home">
		<view class="topnav">
			<u-tabs :list="list" :activeStyle="{
				color:'#333',
				fontWeight:'bold',
				transform:'scale(1.08)'
			}" :inactiveStyle="{
				transform:'scale(1)',
				color:'#888'
			}" @change="change"></u-tabs>
		</view>
		<view class="content">
			<view class="blog" v-for="item in datalist">
				<blog-item></blog-item>
			</view>
		</view>
		<view class="loadingState" v-show="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>
		<view class="edit" @click="goEdit">
			<text class="iconfont icon-edit"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				list: [{
					name: '最新'
				}, {
					name: '热门'
				}],
				loadState: false,
				datalist:[1,2,3]
			}
		},
		onLoad() {

		},
		methods: {
			change(index) {
				this.current = index;
			},
			goEdit(){
				uni.navigateTo({
					url:"/pages/edit/edit"
				})
			}
		}
	}
</script>

<style lang="scss">
	.home {
		.edit {
			position: fixed;
			z-index: 100;
			bottom: 150rpx;
			right: 50rpx;
			width: 120rpx;
			height: 120rpx;
			color: #fff;
			border-radius: 50%;
			background: #0199FE;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

			text {
				font-size: 50rpx;
			}
		}
	}
</style>