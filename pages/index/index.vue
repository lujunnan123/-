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
			}" @change="clickNav"></u-tabs>
		</view>
		<view class="content">
			<view class="blog" v-for="item in datalist">
				<blog-item :item="item"></blog-item>
			</view>
		</view>
		<!-- // 骨架 -->
		<view class="loadingState" v-show="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>
		<view class="edit" @click="goEdit">
			<text class="iconfont icon-edit"></text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				title: 'Hello',
				list: [
					{
						name: '最新',
						type:"publish_date"
					}, 
					{
						name: '热门',
						type:"view_count"
					}],
				loadState: true,
				datalist:[],
				navAction:0
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			// 点击导航栏 切换查询逻辑：时间倒序=>浏览量排序
			clickNav(e) {
				this.loadState = true;
				this.datalist = [];
				this.navAction = e.index;
				this.getData()
			},
			goEdit(){
				uni.navigateTo({
					url:"/pages/edit/edit"
				})
			},
			getData(){
				let artTemp = db.collection("quanzi_article").field("user_id,title,description,picurls,publish_date,view_count,comment_count,like_count ").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avator_file").getTemp();
				db.collection(artTemp,userTemp).orderBy(this.list[this.navAction].type,"desc").get().then(res=>{
					// console.log(res);
					this.datalist = res.result.data
					// 数据请求成功后，隐藏骨架
					this.loadState = false
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