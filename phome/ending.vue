<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="关键词解析"
    />

    <view style="padding:0rpx 30rpx 40rpx;">
      <view class="ending-img">
        <image
          :src="godos.image"
          mode="widthFix"
        />
      </view>
      <view
        class="ending-name"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
      >关键词 解析</view>
      <view
        class="ending-list"
        v-for="(item, index) in godos.prompt"
        :key="index"
      >
        <view
          class="ending-list-top"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >关键词{{ index + 1 }} <view
            class="copy"
            @click="copyKeyword(index)"
          >复制</view>
        </view>
        <view class="ending-list-text">{{ item }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { detail } from '../static/api/analysis.js'


export default {
  components: {},
  data() {
    return {
      godos: {}
    };
  },
  onLoad(res) {
    let that = this;
    detail({ id: res.id }).then(res => {
      if (res.code == 200) {
        let data = res.result;
        data.prompt = data.prompt ? JSON.parse(data.prompt) : []
        that.godos = data
      }
    })
  },
  mounted() { },
  methods: {
    // 关键词复制
    copyKeyword(index) {
      let that = this;
      let godos = that.godos;
      uni.setClipboardData({
        data: godos.prompt[index],
        success: function () {
          uni.showToast({ title: "关键词复制成功", icon: 'none', duration: 4000 })
        },
        fail(res) {
        }
      });
    },
  },

  // #ifdef MP
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
  // #endif
};
</script>

<style scoped >
.page {

  height: 100%;
  min-height: 100vh;

}

.ending-img {
  margin: 20rpx auto;
  text-align: center;

}

.ending-img image {
  width: 240rpx;
  height: 240rpx;
  border-radius: 10rpx;
}

.ending-name {
  font-size: 36rpx;
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #2E2E33;
  line-height: 52rpx;
}

.ending-list {
  margin: 40rpx 0 50rpx;

}

.ending-list .ending-list-top {
  display: flex;
  font-size: 32rpx;
  font-weight: normal;
  color: #141416;
}

.ending-list .ending-list-top .copy {
  width: 74rpx;
  height: 32rpx;
  text-align: center;
  line-height: 32rpx;
  color: #141416;
  font-size: 20rpx;
  background: #F5F5F5;
  border-radius: 18rpx 18rpx 18rpx 18rpx;
  margin: 10rpx;
}

.ending-list .ending-list-text {
  font-size: 28rpx;
  font-weight: 400;
  color: #666666;
  line-height: 40rpx;
  margin-top: 40rpx;
}
</style>