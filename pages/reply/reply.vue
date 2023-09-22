<template>
	<view class="reply">
		<view class="top">
			<comment-item :childState="true" :closeBtn="true"  :item="replyItem"></comment-item>
		</view>
		<view class="list">
			<view class="row" v-for="item in commentChildList">
				<comment-item @removeEnv = "commentEnv" :childState="true" :item="item"></comment-item>				
			</view>
		</view>
		<view class="">
			<comment-frame 
			:placeholder="`回复:${getName(this.replyItem)}`" 
			:commentObj="commentObj"
			@commentEnv = "commentEnv"
			></comment-frame>		
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import {giveAvatar,getName} from "../../utils/tools.js"
	export default {
		data() {
			return {
				replyItem:null,
				commentObj:{
					"article_id":"",
					"comment_type":1,
					"reply_user_id":"",
					"reply_comment_id":""
				},
				commentChildList:[]
			};
		},
		onLoad(e) {
			let replyItem = uni.getStorageSync("replyItem"); 
			if(!replyItem) return uni.navigateBack();
			this.replyItem = replyItem || {};
			this.commentObj.article_id = this.replyItem.article_id;
			this.commentObj.reply_user_id = this.replyItem.user_id[0]._id;
			this.commentObj.reply_comment_id = this.replyItem._id;
			this.getComment()
		},
		methods:{
			// 评论后回调
			commentEnv(){
				this.commentChildList=[];
				this.getComment()
			},
			giveAvatar,getName,
			// 获取子集评论和用户部分信息
			getComment(){
				let commentTemp = db.collection("quanzi_comment")
				.where(`article_id == '${this.replyItem.article_id}' &&
				 comment_type == 1 && reply_comment_id == "${this.replyItem._id}`).orderBy("comment_date desc").limit(10).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file,username,nikename").getTemp();
				db.collection(commentTemp,userTemp).get().then(res=>{
					console.log(res);
					this.commentChildList = res.result.data
					// if(res.result.data == 0) this.noComment = true
				})
			},
		}
	}
</script>

<style lang="scss">
	.reply{
		.top{
			padding:30rpx;
			padding-bottom:120rpx;
			border-bottom: 15rpx solid #eee;
			.item{
				padding:10rpx 0;
			}
		}
		.list{
			padding:30rpx 60rpx;
			.row{
				padding-bottom: 15rpx;
			}
		}
		
	}
</style>