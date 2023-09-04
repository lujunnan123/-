<template>
	<view class="edit">
		<view class="title">
			<input type="text" v-model="artObj.title" placeholder="请输入标题" placeholder-class="placeholder">
		</view>
		<view class="content">
			<editor id="editor" 
			class="myedit" 
			placeholder="写点什么吧~~"
			show-img-size
			show-img-toolbar
			@focus="onFocus"
			@ready="onEditReady"
			@statuschange="status"
			></editor>
		</view>
		<view class="btnGroup">
			<u-button type="primary" :disabled="!artObj.title.length" text="确认提交" @click="onSubmit"></u-button>
		</view>
		
		<view class="tools" v-show="toolshow">
			<view class="item" @click="clickHead" ><text class="iconfont icon-zitiyanse" :class="headShow ? 'active' : ''"></text></view>
			<view class="item" @click="clickbold"><text class="iconfont icon-jiacu" :class="boldShow ? 'active' : ''" ></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-xieti" :class="italicShow ? 'active' : ''"></text></view>
			<view class="item" @click="createDivider" ><text class="iconfont icon-xiahuaxian"></text></view>
			<view class="item" @click="clickInsertImage"><text class="iconfont icon-tupian"></text></view>
			<view class="item" @click="editOK"><text class="iconfont icon-gou"></text></view>
		</view>
	</view>
</template>

<script>
	import {getImgSrc,getProvince} from "../../utils/tools.js"
	export default {
		data() {
			return {
				toolshow:false,
				headShow:false,
				boldShow:false,
				italicShow:false,
				artObj:{
					title:"",
					content:"",
					description:""
				}
			};
		},
		onLoad() {
			getProvince().then(res=>{
				console.log(res);
			})
		},
		methods:{
			// 点击提交按钮
			onSubmit(){
				this.editorCtx.getContents({
					success:res=>{
						//存储 纯文本信息:用于首页新闻简介内容
						this.artObj.description = res.text.slice(0,50);
						this.artObj.content = res.html;
						this.artObj.picurls = getImgSrc(res.html)
						console.log(this.artObj.picurls);
					}
				})
			},
			// 初始化
			onEditReady(){
				uni.createSelectorQuery().in(this).select('#editor').fields({
					size:true,
					context:true
				},res=>{
					this.editorCtx = res.context
				}).exec()
			},
			onFocus(){
				this.toolshow = true
			},
			// 添加大标题
			clickHead(){
				this.headShow = !this.headShow;
				this.editorCtx.format("header",this.headShow?'H2':false);
			},
			// 加粗
			clickbold(){
				this.boldShow = !this.boldShow;
				this.editorCtx.format("bold");
			},
			// 添加斜体
			clickItalic(){
				this.italicShow = !this.italicShow;
				this.editorCtx.format("italic")
			},
			// 添加分割线
			createDivider(){
				this.editorCtx.insertDivider()
			},
			// 完成 隐藏
			editOK(){
				this.toolshow=false
			},
			// 检验tools中属性状态
			checkStatus(name,detail,obj){
				if(detail.hasOwnProperty(name)){
					this[obj] = true
				}else{
					this[obj] = false
				}
			},
			// 富文本编辑器状态管理
			status(e){
				let detail = e.detail;
				this.checkStatus("header",detail,"headShow")
				this.checkStatus("bold",detail,"boldShow")
				this.checkStatus("italic",detail,"italicShow")
			},
			// 添加图像
			clickInsertImage(){
				uni.chooseImage({
					success:async res=>{
						uni.showLoading({
							title:"上传中请稍后",
							mask:true
						})
						// console.log(res.tempFiles);
						for(let item of res.tempFiles){
							let res = await uniCloud.uploadFile({
								filePath:item.path,
								cloudPath:item.name
							})
							// 在富文本中插入图片
							this.editorCtx.insertImage({
								src:res.fileID
							})
								
						}
						uni.hideLoading()
					}
				})
			}
		}
		
	}
</script>

<style lang="scss">
.edit{
	.title{
		input{
			height: 120rpx;
			font-size: 46rpx;
			border-bottom: 1px solid #e4e4e4;
			margin-bottom: 30rpx;
		}
		.placeholder{
			color:#e0e0e0
		}
	}
	.content{
		.myedit{
			height: calc(100vh - 500rpx);
			margin-bottom: 30rpx;
		}
	}
	.tools{
		width: 100%;
		height: 80rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.iconfont{
			font-size: 36rpx;
			color: #333;
			&.active{
				color: #0199FE;
			}
		}
	}
}
</style>
