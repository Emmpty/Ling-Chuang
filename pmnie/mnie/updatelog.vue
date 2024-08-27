<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="更新日志"
    />

    <view class="group_3">
      <view
        class="title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >更新日志</view>

      <view
        class="help"
        v-for="(item, index) in helpList"
        :key="index"
        @click="getHelp(index)"
      >
        <view
          class="help-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >{{ item.title }}</view>
        <view
          class="help-text"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          v-if="idx == index"
        >
          {{ item.content }}
        </view>
      </view>

    </view>
  </view>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      helpList: [],
      idx: -1,
    };
  },

  onLoad() {
    this.helpList = getApp().globalData.jsonGoods.updateLog;
  },

  methods: {
    getHelp(e) {
      this.idx = this.idx == e ? -1 : e;
    }

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
  min-height: 100vh;
}

.u-collapse-content {
  line-height: 40rpx;
  color: white !important;
}

.page {
  .group_3 {
    padding: 40rpx 32rpx 0rpx;
    color: white;

    .title {
      padding-bottom: 40rpx;
      font-weight: 700;
    }

    .help {
      .help-title {
        line-height: 100rpx;
        padding: 0 20rpx;
        border-bottom: 1px solid white;
      }

      .help-text {
        font-size: 28rpx;
        padding: 20rpx;
      }
    }
  }
}
</style>