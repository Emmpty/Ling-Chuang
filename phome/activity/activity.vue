<template>
  <view class="activity-box">
    <nav-bar
      bgColor="transparent"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>

    <view
      class="activity-content"
      :style="getBG"
    >
      <view class="footer-box u-flex u-flex-row u-col-center u-row-between">
        <view
          class="footer-btn  u-flex-1"
          @click="activityClickHandle('ios')"
        >
          <button class=" ios-btn"></button>
        </view>
        <view
          class="footer-btn  u-flex-1"
          @click="activityClickHandle('andriond')"
        >
          <button class=" andriond-btn"></button>
        </view>

      </view>
    </view>

  </view>
</template>

<script>
import shareMethod from "@/static/utils/utils.js";

export default {
  components: {
  },
  data() {
    return {
      deviceInfo: '',
      activityBgBaseUrl: 'https://draw-1315379716.cos.ap-guangzhou.myqcloud.com/public%2Fimage%2Factivity',
      // 双十一前，当天，之后
      activityBgImgType: 'After',  // Before,Current,After
      activityBgImg: '',
    };
  },
  onLoad(opt) {
    // 只在小程序执行
    // #ifdef MP
    this.deviceInfo = uni.getSystemInfoSync().platform
    // #endif
    if (opt.imgType) {
      console.log('>>>>>>>>>>>', opt.imgType);
      this.activityBgImgType = opt.imgType
    }
  },
  computed: {
    getBG() {
      let bgImgUrl = this.activityBgBaseUrl + this.activityBgImgType + '.png'
      return `background: url(${bgImgUrl}) no-repeat; background-size: 100% 100%`
    },
  },
  methods: {
    activityClickHandle(type) {
      if (getApp().globalData.getLogin()) {
        if (type == this.deviceInfo) {
          // ios端跳转客服
          return shareMethod.contactCustomer()
        } else {
          uni.navigateTo({
            url: `/pmnie/mnie/recharge`,
          });
        }
      }
    },
  },
}
</script>

<style lang="scss">
.activity-box {
  width: 100%;
  height: 100vh;
  background-color: #F3A291;

  .activity-content {
    position: relative;
    top: 0;
    height: calc(100% - 80rpx);

    .footer-box {
      padding: 0 60rpx;
      position: absolute;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      bottom: calc(60rpx + constant(safe-area-inset-bottom));
      bottom: calc(60rpx + env(safe-area-inset-bottom));
      z-index: 555;

      .footer-btn {
        height: 124rpx;
      }

      .ios-btn {
        width: 100%;
        height: 100%;
        background: url(https://draw-1315379716.cos.ap-guangzhou.myqcloud.com/public%2Fimage%2Fios-buy.png) no-repeat;
        background-size: 100% 100%;
      }

      .andriond-btn {
        width: 100%;
        height: 100%;
        background: url(https://draw-1315379716.cos.ap-guangzhou.myqcloud.com/public%2Fimage%2Fandroid-buy.png) no-repeat;
        background-size: 100% 100%;
      }

      .ios-btn:active,
      .andriond-btn:active {
        animation: roundTripAnimation .3s ease-out;
      }


      .footer-btn+.footer-btn {
        margin-left: 15rpx;
      }
    }
  }
}

@keyframes roundTripAnimation {

  // 从左开始
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}
</style>
