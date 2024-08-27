<template>
  <view class="popup">
    <view
      class="popup-body"
      :style="{ 'background': cueTheme == 'day-theme' ? '#FFFFFF' : '' }"
    >
      <view
        class="title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#353535' : '' }"
      >服务协议及隐私政策</view>
      <view class="content">
        欢迎您使用灵创AI及相关服务！<br />本应用尊重并保护所有用户的个人隐私权。本应用将通过 <text @click="jumpType(1)">《灵创AI用户协议》</text>和<text
          @click="jumpType(2)"
        >《灵创AI隐私政策》</text>
        提供更精确、更有个性化的服务帮助您更好的了解我们收集、处理您的个人信息情况。
      </view>
      <view class="operate">
        <view
          class="operate-item"
          @click="disagreeAgreement()"
          :style="{ 'background': cueTheme == 'day-theme' ? '#AAAAAA' : '' }"
        >不同意</view>
        <button
          type="button"
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
          class="operate-item operate-active"
        >同意</button>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    params: {

    },
  },
  data() {
    return {
      showPrivacy: false,
    };
  },
  methods: {

    handleAgreePrivacyAuthorization(res) {
      wx.requirePrivacyAuthorize({
        success: res => {
          console.log(res)
          this.showPrivacy = false;
          this.$emit('agreementStatus', false)
        }
      });
    },

    disagreeAgreement() {
      uni.showToast({
        title: "需同意后才可继续使用灵创AI",
        default: 4000,
        icon: "none",
      });
    },

    jumpType(type) {
      let typeObj = {
        '1': '/plogin/user_agree',
        '2': '/plogin/privacy_agree',
      }
      uni.navigateTo({
        url: typeObj[type],
      });
    },
  }
}
</script>

<style lang="scss">
.popup {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;

  .popup-body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 566rpx;
    height: 558rpx;
    background: #353535;
    padding: 40rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;

    .title {
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      color: #FFFFFF;
      padding: 0rpx 0 30rpx;
    }

    .content {
      color: #AAAAAA;
      line-height: 42rpx;
      font-size: 28rpx;
      line-height: 42rpx;
      letter-spacing: 4rpx;
      padding-left: 10rpx;

      text {
        color: #2AEEC3;
      }
    }

    .operate {
      display: flex;
      justify-content: space-around;
      position: absolute;
      bottom: 50rpx;
      left: 40rpx;
      right: 40rpx;

      .operate-item {
        width: 228rpx;
        height: 72rpx;
        line-height: 72rpx;
        font-size: 28rpx !important;
        font-weight: 500;
        border-radius: 70rpx;
        text-align: center;
        background: #656565;
        color: white;
      }

      .operate-active {
        background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
        color: #353535;
        margin-left: 30rpx !important;
      }
    }
  }
}</style>
