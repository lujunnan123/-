<template>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" @confirm="goComment" suffixIcon="paperplane"  v-model="replyContent" :placeholder="placeholder" @iconClick="goComment">	
			</uni-easyinput>
		</view>
</template>

<script>
	import {getProvince} from "@/utils/tools.js"
	const db = uniCloud.database()
	export default {
		name:"comment-frame",
		props:{
			commentObj:{
				type:Object,
				default:()=>{
					return {
						
					}
				}
			}
		},
		onLoad() {
		},
		data() {
			return {
				replyContent:"",
				placeholder:"评论点什么的吧~"
			};
		},
		methods:{
			async goComment(){
				let province = await getProvince();
				if(!this.replyContent){
					uni.showToast({
						title:"内容不能为空",
						icon:"none"
					})
					return
				}
				db.collection("quanzi_comment").add({
					"comment_content":this.replyContent,
					"province":province,
					...this.commentObj
				}).then(res=>{
					uni.showToast({
						title:"评论成功"
					})
					this.$emit("commentEnv",{_id:res.result.id,comment_content:this.replyContent,"province":province,comment_date:Date.now()})
					this.replyContent = ""
				})
			}
		}
	}
</script>

<style lang="scss">
	.commentFrame{
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
</style>