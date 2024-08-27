<template>
	<view>
		<view class="popup">
			<view class="popup-body" :style="{'background': cueTheme == 'day-theme' ? '#FFFFFF' :''}">
				<view class="title" :style="{'color': cueTheme == 'day-theme' ? '#353535' : '' }">会员兑换码</view>
				<view class="content">
					<input type="text" v-model="code" maxlength="10" placeholder="请输入兑换码" :style="{'background': cueTheme == 'day-theme' ? '#EFEFEF' :''}"/>
				</view>
				<view class="operate">
					<view class="operate-item" @click="disagreeAgreement()"  :style="{'background': cueTheme == 'day-theme' ? '#AAAAAA' :''}">取消</view>
					<button type="button" id="agree-btn"  @click="ConfirmRedemption" class="operate-item operate-active">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {exchangeCode} from '../../../static/api/index.js'
export default {
	props:{
	},
	data() {
		return {
			code:''
		};
	},
	methods:{
		disagreeAgreement(){
			this.$emit('getcodeStatus')
		},
		ConfirmRedemption(){
			if(!this.code){
				uni.showToast({
					title: "请输入兑换码",
					icon:"none"
				});
				return
			}
			exchangeCode({code:this.code}).then((res) => {
				if (res.code == 200) {
					uni.showToast({
						title: "兑换成功",
						icon:"none",
						default:4000
					});
					this.$emit('getcodeStatus')
				}
			});
		},

	}
}
</script>

<style lang="scss">
.popup{
	background: rgba(0,0,0,0.7);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	.popup-body{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 566rpx;
		height: 334rpx;
		background: #353535;
		padding:30rpx 40rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		.title{
			font-size: 32rpx;
			font-weight: 500;
			text-align: center;
            color: #FFFFFF;
			padding: 0rpx 0 30rpx;
		}
		.content{
			color: #AAAAAA;
			line-height:42rpx;
			font-size: 28rpx;
            line-height: 42rpx;
			letter-spacing: 4rpx;
			padding-left:10rpx;
			input{
				height: 82rpx;
				border-radius:14rpx;
				padding-left:20rpx;
                background: #2B2B2B;
			}
		}
		.operate{
			display: flex;
			justify-content: space-around;
			position: absolute;
			bottom: 30rpx;
			left: 40rpx;
			right: 40rpx;
			.operate-item{
				width: 228rpx;
                height: 72rpx; 
				line-height:72rpx;
				font-size: 28rpx !important;
				font-weight: 500;
				border-radius: 70rpx;
				text-align: center;
				background: #656565;
				color: white;
			}
			.operate-active{
				background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
                color: #353535;
				margin-left: 30rpx !important;
			}
		}
	}
}

</style>
