<template>
	<view class="waterfall-item-container" >
		<!-- 画册列表 -->
		<view class="waterfall-item" @tap="onTap" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}" >
		    <view class="tips" v-if="params.label">{{ params.label }}</view>
			<image class="icon" v-if="statusBox" :src="params.statusBox? '../../../static/img/clip/status_active.png':'../../../static/img/clip/status.png'"/>
			<image class="imgicon" :src="params.thumbUrl" webp="true" mode="widthFix" @click="albumDetails(params.id)" @load="emitHeight" @error="emitHeight"></image>
			<view class="defeated" v-if="params.status == -1 " style="color:#FF6850;" @click="albumDetails(params.id)">制作失败</view>
			<view class="defeated" v-else-if="params.status == -3" style="color:#FF6850;" @click="albumDetails(params.id)">制作超时</view>
			<view class="defeated" v-else-if="params.status == -5" style="color:#FF6850;" @click="albumDetails(params.id)">参数有误</view>
			<view class="defeated" v-else-if="params.status == -6" style="color:#FF6850;" @click="albumDetails(params.id)">关键词异常</view>
			<view class="defeated" v-else-if="params.status == -7" style="color:#FF6850;" @click="albumDetails(params.id)">链接异常</view>
			<view class="defeated" v-else-if="params.status == -8" style="color:#FF6850;" @click="albumDetails(params.id)">审核不通过</view>
			<view class="defeated" v-else-if="params.status >0" style="color:#1AFFE8;" @click="albumDetails(params.id)">正在制作中</view>
			<view class="defeated" v-else-if="params.status <0 " style="color:#1AFFE8;" @click="albumDetails(params.id)">制作失败</view>
		</view>
		<!-- 画册集列表 -->

	</view>
</template>

<script>
	export default {
		name:"helangWaterfallItem",
		options:{
			virtualHost: true
		},
		props:{
			params:{
				type: Object,
				default(){
					return {}
				}
			},
			tag:{
				type:String | Number,
				default:''
			},
			index:{
				type:Number,
				default:-1
			},
			statusBox:{
				type:Boolean,
				default:()=>false
			},
			viewType:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 发出组件高度信息，在此处可以区分正确和错误的加载，给予错误的提示图片
			emitHeight(e){
				const query = uni.createSelectorQuery().in(this);
				query.select('.waterfall-item-container').boundingClientRect(data => {
					let height = Math.floor(data.height);
					this.$emit("height",height,this.$props.tag);
				}).exec();
			},
			onTap(){
				let that =this;
				// console.log(that.params,'哈哈哈哈')
				// that.$set(that.params, 'statusBox', !that.params.statusBox)
				that.$emit("click",that.$props.index,that.$props.tag);
			},

			 // 画册详情
			albumDetails(id){
				let that =this;
				if(!that.statusBox){
					uni.setStorageSync("albumName", "画册详情");
					if(this.params.status>0){ //制作中
						uni.navigateTo({
						    url:'/phome/make?id='+id
						})
						return;
					}
					uni.navigateTo({
					    url:"/pclip/detail?id="+id,
					})
				}
			},

			// 画册集详情
			albumList(id){
				let that =this;
				if(!that.statusBox){
					uni.navigateTo({
						url:"/pclip/draftlist?id="+id,
					})
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.waterfall-item{
	padding: 16rpx;
	border-radius:10rpx;
	font-size: 28rpx;
	color: #666;
	position: relative;
	image{
		display: block;
		width: 100%;
		// 默认设置一个图片的大约值
		height: 350rpx;
	}
	.imgicon{
		border-radius:10rpx;
	}
	.number{
		padding-top:14rpx;
		line-height:60rpx;
	}
	.tips{
		width: 88rpx;
		height: 34rpx;
		line-height:34rpx;
		font-size: 18rpx;
		text-align: center;
		background: rgba(250,160,24,0.8);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		color: white;
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		z-index: 99;
	}
	.icon{
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		width:40rpx;
		height:40rpx;
		z-index: 9;
	}
	.defeated{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		color: white;
		background: #666;
		border-radius: 4rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

}
</style>
