<template>
	<view class="waterfall-item-container" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
		<view class="waterfall-item" @tap="onTap" >
			<image class="icon" v-if="statusBox" :src="params.statusBox? '../../../static/img/clip/status_active.png':'../../../static/img/clip/status.png'" />
			<image class="url" :src="params.image" mode="widthFix" @click="albumDetails(params.id)" @load="emitHeight" @error="emitHeight"></image>
			<view class="defeated" v-if="params.status < 0" style="color:#FF6850;" @click="albumDetails(params.id)">解析失败</view>
		    <view class="defeated" v-if="params.status ==2" style="color:#1AFFE8;" @click="albumDetails(params.id)">正在解析中···</view>
		</view>
	</view>
</template>

<script>

	export default {
		name:"helangWaterfallItem",
		props:{
			params:{
				type: Object,
				default(){
					return {}
				}
			},
			statusBox:{
				type:Boolean,
				default:()=>false
			},
			tag:{
				type:String | Number,
				default:''
			},
			index:{
				type:Number,
				default:-1
			}
		},
		data() {
			return {
			};
		},
		watch:{
			"$props.params"(newValue,oldValue){

			}
		},
		onLoad(res){
     
			console.log(this.params,'params123')
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
				that.$set(that.params, 'statusBox', !that.params.statusBox)
				// console.log(that.params,'0000')
				that.$emit("click",that.$props.index,that.$props.tag);
			},

			 
			// 画册详情
			albumDetails(id){
				let that =this;
				if(!that.statusBox){
					if(that.params.status==2){
						uni.showToast({
							title: "图片正在解析中，请稍后重试！",
							icon:'none',
							duration: 3000
					    })
						return
					}
					uni.navigateTo({
						url:"/phome/ending?id="+that.params.id
					})
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
.waterfall-item-container{
	border-radius: 4px;
}
.waterfall-item{
	// padding: 16rpx;
	// background: #262628;
	border-radius: 4px;
	font-size: 28rpx;
	color: #666;
	position: relative;
	.icon{
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		width:50rpx;
		height:50rpx;
		z-index: 9;
	}
	.url{
		display: block;
		width: 100%;
		border-radius:14rpx;
		// 默认设置一个图片的大约值
		height: 350rpx;
	}
	.defeated{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		color: white;
		background: rgba(0,0,0,0.6);
		border-radius: 4rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

}
</style>
