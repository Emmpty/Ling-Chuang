<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >
    <block v-if="orderInfo.payStatus == 0 || orderInfo.payStatus == 1">
      <image
        class="pay-icon"
        src="https://cdn.drawai.cn/avatar/733987.jpg?t=1688105566885"
      ></image>
      <view
        class="pay-title"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >支付成功</view>
      <view
        class="pay-tips"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >感谢你的支持</view>
      <view
        :class="cueTheme != 'day-theme' ? 'pay payactive' : 'pay'"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="pay-item"
          :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '' }"
        >支付详情</view>
        <view
          class="pay-item"
          :style="{ 'color': cueTheme != 'day-theme' ? '#ccc' : '' }"
        >订单编号：<text :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }">{{ orderInfo.id }}</text></view>
        <view
          class="pay-item"
          :style="{ 'color': cueTheme != 'day-theme' ? '#ccc' : '' }"
        >下单时间：<text :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }">{{ orderInfo.createTime }}</text>
        </view>
        <view
          class="pay-item"
          :style="{ 'color': cueTheme != 'day-theme' ? '#ccc' : '' }"
        >实付金额：<text :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }">￥{{ orderInfo.totalFee }}</text>
        </view>
        <view
          class="pay-item"
          :style="{ 'color': cueTheme != 'day-theme' ? '#ccc' : '' }"
        >支付方式：
          <text :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }">{{ orderInfo.payMethod == 0 ? '微信支付' :
            '支付宝支付' }}</text>
        </view>
      </view>
      <view
        class="cueTheme!='day-theme'?'pay-btn  payactive':'pay-btn '"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
        @click="getHome"
      >去首页逛逛</view>
    </block>
    <block v-else>
      <image
        class="pay-icon"
        src="https://cdn.drawai.cn/avatar/733987.jpg?t=1688107335100"
      ></image>
      <view
        class="pay-title"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >支付失败</view>
      <view
        class="pay-tips"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >感谢你的支持</view>
      <view
        class="pay-btn"
        @click="getHome"
      >回首页</view>
    </block>
  </view>
</template>

<script>
import { orderQuery } from '../../static/api/home.js'
export default {
  components: {},
  data() {
    return {
      orderInfo: {},
      timer: null,
      time: 0,
      timeOut: 5000,
    };
  },

  onLoad(res) {
    let that = this;
    if (uni.getStorageSync('orderid')) {
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.time >= 5000) {
          this.timer && clearInterval(this.timer)
          this.timer = null
          return
        }
        this.getOrder()
        this.time += 1000
      }, 1000);
    }
  },
  onShow() {

  },
  onHide() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getHome() {
      uni.reLaunch({
        url: '/pages/tabBar/gallery'
      })
    },
    getOrder() {
      orderQuery({ id: uni.getStorageSync('orderid') }).then(res => {
        if (res.code == 200) {
          that.orderInfo = res.result
        }
      })
    },

  },

  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }

};
</script>

<style scoped lang="less">
.page {
  padding: 32rpx;
  background-color: #141416;
  width: 100%;
  height: 100vh;
  text-align: center;
}

.pay-icon {
  width: 320rpx;
  height: 320rpx;
  margin: o auto;
}

.pay-title {
  color: white;
  text-align: center;
  font-size: 44rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #121212;
  margin-bottom: 20rpx;
}

.pay-tips {
  text-align: center;
  font-size: 24rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18, 18, 18, 0.78);
  margin-bottom: 50rpx;
}

.pay {
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  opacity: 1;
  border: 2rpx solid rgba(18, 18, 18, 0.08);
  padding: 30rpx 40rpx;
  margin: 30rpx 0;
  text-align: left;
}

.payactive {
  background: rgba(244, 244, 244, 0.04) !important;
}

.pay .pay-item {
  color: rgba(18, 18, 18, 0.52);
  font-size: 26rpx;
  line-height: 58rpx;
}

.pay .pay-item:nth-child(1) {
  font-size: 32rpx;
  font-weight: 500;
}

.pay .pay-item text {
  color: #141416;
}

.pay-btns {}

.pay-btn {
  background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  height: 88rpx;
  text-align: center;
  line-height: 88rpx;
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 140rpx;
}
</style>