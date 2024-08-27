<template>
  <view class="remind">
    <view
      class="remind-item"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#262628' }"
    >
      <view
        class="title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#fff' : '' }"
      >温馨提示</view>
      <image src="https://image.drawai.cn/logo/ios-no.png"></image>
      <view
        class="spec"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >由于相关规范，IOS商城功能暂不可用请谅解~</view>
      <view
        class="contact"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        v-if="jsonInfo.recharge_info.service_status == 'true'"
      ></view>
      <view
        class="service"
        @click="contactService"
        v-if="jsonInfo.recharge_info.service_status == 'true'"
      >联系客服</view>
    </view>
  </view>
</template>

<script>
import utils from '@/static/utils/utils';

export default {
  components: {},
  props: {
    // 组件状态
    jsonInfo: {
      type: Object,
      default: ''
    },
  },
  data() {
    return {

    };
  },
  onLoad() {

  },
  methods: {
    //  联系客服
    contactService() {
      utils.contactCustomer()
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
.remind {
  padding: 20rpx;
  margin-top: 40rpx;
}

.remind .remind-item {
  background: rgba(244, 244, 244, 0.04);
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  margin: 30rpx;
  height: 948rpx;
  position: relative;
  text-align: center;
  padding: 30rpx 40rpx;
}

.remind .remind-item image {
  width: 328rpx;
  height: 328rpx;
  margin-top: 100rpx;
}

.remind .remind-item .title {
  width: 272rpx;
  height: 104rpx;
  background: #333333;
  color: white;
  border-radius: 64rpx 64rpx 64rpx 64rpx;
  text-align: center;
  line-height: 104rpx;
  position: absolute;
  left: 50%;
  top: -50rpx;
  transform: translate(-50%);
}

.remind .remind-item .spec {
  font-size: 34rpx;
  font-family: 'PingFang SC-Medium, PingFang SC';
  font-weight: 500;
  line-height: 56rpx;
  color: white;
  margin-top: 30rpx;
}

.remind .remind-item .contact {
  font-size: 28rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(244, 244, 244, 0.76);
  margin-top: 100rpx;
  margin-bottom: 30rpx;
}

.remind .remind-item .service {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
}
</style>