<template>
    <view>
		<view class="chuang" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
			<button class="item button titlee" open-type="share" :data-img="params.detailUrl">
				<image :src="cueTheme=='day-theme'?'../../../../static/img/clip/share-0.png':'../../../../static/img/clip/share.png'"/>
			</button>
			<view class="item" style="color:#1AFFE8;"><image src="../../../../static/img/clip/stars.png"/> {{params.likeCount}}</view>
		</view>
	</view>
</template>

<script>

export default {
	name:"",
	options:{},
	props:{
		params:{
			type: Object,
			default(){
				return {}
			}
		},
	},
	data() {
		return {

		};
	},
	methods:{
		
	}
}
</script>

<style lang="scss" scoped>
.chuang {
      color: white;
      font-size:28rpx;
      line-height: 90rpx;
      height:90rpx;
	    padding:0 20rpx;
      background: #262628;
      display: flex;
      justify-content: space-between;
      border-radius:0 0 14rpx 14rpx ;
      .title2{
        width:120rpx;
        overflow: hidden;
      }
      .shstatuss{
        width:40rpx;
        height:40rpx;
        margin-top: 10rpx;
      }
      .button{
        background:none;
        margin:0 !important;
        padding: 0;
       
      }
      .item{
        image{
          width:40rpx;
          height:40rpx;
          position: relative;
          top: 8rpx;
        }
      }
    }
.same{
//   padding:16rpx 0 0rpx;
  display: flex;
  justify-content: space-between;
  line-height:60rpx;
}
.same .same-avact{
	font-size:24rpx;
}
.same .same-avact .avact{
  width: 45rpx;
  height:45rpx;
  border-radius:50%;
  margin-right:10rpx;
  position: relative;
  top: 14rpx;
}

.same .same-right image{
  width:34rpx;
  height:34rpx;
  position: relative;
  top: 18rpx;
  right:6rpx
}
.same .same-right{
	font-size: 22rpx;
	margin-right: 10rpx;
}
.same .same-right text{
	position: relative;
	top: 10rpx;
	right:0rpx
}

.popup{
  width:580rpx;
  border-radius:20rpx;
  padding:0 30rpx 40rpx;
}
.popup .popup-title{
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
}
.popup .popup-tips{
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18,18,18,0.46);
  text-align: left;
}
.popup .popup-btn{
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}
.popup .popup-btn .item{
  width: 48%;
  height: 80rpx;
  line-height:80rpx;
  background: rgba(18,18,18,0.04);
  border-radius: 80rpx;
  text-align: center;
  border: 2rpx solid #E4E4E4;
  font-size: 28rpx !important;
}
.popup .popup-btn .active{
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);

}

</style>
