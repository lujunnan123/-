<template>
	<view class="edit">
		<view class="title">
			<input type="text" placeholder="请输入标题" placeholder-class="placeholder">
		</view>
		<view class="content">
			<editor id="editor" 
			class="ql-container" 
			placeholder="写点什么吧~~"
			show-img-size
			show-img-toolbar
			@focus="onFocus"
			@ready="onEditReady"
			></editor>
		</view>
		<view class="btnGroup">
			<u-button type="primary" disabled="" text="确认提交"></u-button>
		</view>
		
		<view class="tools" v-show="toolshow">
			<view class="item" @click="clickHead" ><text class="iconfont icon-zitiyanse" :class="headShow ? 'active' : ''"></text></view>
			<view class="item" @click="clickbold"><text class="iconfont icon-jiacu" :class="boldShow ? 'active' : ''" ></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-xieti" :class="italicShow ? 'active' : ''"></text></view>
			<view class="item" @click="createDivider" ><text class="iconfont icon-xiahuaxian"></text></view>
			<view class="item"><text class="iconfont icon-tupian"></text></view>
			<view class="item" @click="editOK"><text class="iconfont icon-gou"></text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				toolshow:false,
				headShow:false,
				boldShow:false,
				italicShow:false
			};
		},
		methods:{
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
		height: calc(100vh - 500rpx);
		margin-bottom: 30rpx;
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
