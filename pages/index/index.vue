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
				<blog-item @delEvent="P_delEvent" :item="item"></blog-item>
			</view>
		</view>
		<view class="loadmore">
			<uni-load-more :status="uniLoad"></uni-load-more>
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
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		data() {
			return {
				title: 'Hello',
				uniLoad:"more",
				noMore:false,
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
			this.uniLoad ='loading'
			this.getData()
		},
		onReachBottom() {
			if(this.noMore==true)return
			this.getData()
		},
		methods: {
			// 点击更多 删除数据后，清空列表并重新发起数据请求
			P_delEvent(){
				this.datalist = [],
				this.getData()
			},
			// 点击导航栏 切换查询逻辑：时间倒序=>浏览量排序
			clickNav(e) {
				this.loadState = true;
				this.datalist = [];
				this.uniLoad = 'more'
				this.noMore = false
				this.navAction = e.index;
				this.getData()
			},
			goEdit(){
				uni.navigateTo({
					url:"/pages/edit/edit"
				})
			},
			getData(){
				let artTemp = db.collection("quanzi_article").where(`delState != true`).field("user_id,title,description,picurls,publish_date,view_count,comment_count,like_count ").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				db.collection(artTemp,userTemp).orderBy(this.list[this.navAction].type,"desc").skip(this.datalist.length).limit(5).get().then(async res=>{
					// console.log(res);
					// 将请求结果中的文章id提取出来
					let idArr = [];
					let oldArr = this.datalist;
					if(res.result.data.length==0){	
						this.uniLoad = 'noMore'
						this.noMore = true
					}
					let resDataArr =[...oldArr, ...res.result.data];
		
					resDataArr.forEach(item=>{
						idArr.push(item._id)
					})
					// 查询quanli_like表 筛选出文章id和当前用户id一致的数据（即获取该用户点赞过的文章id）
					let likeRes = await db.collection("quanzi_like").where({
						article_id:dbCmd.in(idArr),
						user_id:uniCloud.getCurrentUserInfo().uid
					}).get()
					// 拿文章id（likeRes）与列表中所有数据（resDataArr）进行匹配，看是否在列表中，并返回该条数据的索引
					likeRes.result.data.forEach(item=>{
						let findIndex = resDataArr.findIndex(find=>{
							return item.article_id == find._id
						})
						// 将该条存在点赞表中的数据 的isLike属性设置为true
						resDataArr[findIndex].isLike = true
					})
					
					this.datalist = resDataArr
					// 数据请求成功后，隐藏骨架
					this.loadState = false
				}).catch(err=>{
					console.log(err);
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