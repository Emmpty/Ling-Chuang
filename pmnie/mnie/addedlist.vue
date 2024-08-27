<template>
  <view
    class="flex-col justify-start relative page"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="增值服务明细"
    />

    <view class="adTab">
      <view class="adTab-item adTab-active">作品数量</view>
    </view>

    <view
      class="added"
      v-for="(item, index) in list"
      :key="index"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
    >
      <view class="added-name">{{ item.amount }}作品数量</view>
      <view class="added-time">有效时间{{ item.expireDate }}</view>
    </view>


  </view>
</template>

<script>
import { capacityList } from '../../static/api/index.js'
import utils from '../../static/utils/utils';

export default {
  components: {},
  data() {
    return {
      nextId: 0,
      list: [],
    };
  },

  onLoad(res) {
    this.getList()
  },

  methods: {

    getList() {
      let data = {
        size: 20,
        isAsc: false,
      }
      if (this.nextId > 0) {
        data.nextId = this.nextId
      }
      capacityList(data).then((res) => {
        if (res.code == 200) {
          this.list = res.result.list;
          if (res.result.nextId) {
            this.nextId = res.result.nextId
          } else {
            this.nextId = 0
          }
        }
      });
    }

  },

  onPullDownRefresh() {
    if (this.nextId > 0) {
      this.getList()
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
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  padding-bottom: 140rpx;
  background-color: var(--bg-color-page);

  .adTab {
    margin: 20rpx 32rpx 24rpx;

    .adTab-item {
      width: 128rpx;
      height: 32rpx;
      font-weight: 800;
      text-align: center;
      color: var(--text-color);
      z-index: 1;
    }

    .adTab-active {
      position: relative;
    }

    .adTab-active::before {
      position: absolute;
      content: '';
      bottom: -10rpx;
      width: 128rpx;

      height: 8rpx;
      left: 0;
      background: #1DCCAF;
      border-radius: 5rpx 5rpx 5rpx 5rpx;
    }
  }

  .added {
    display: flex;
    justify-content: space-between;
    height: 84rpx;
    background: #232323;
    line-height: 84rpx;
    margin: 28rpx 32rpx 0;
    border-radius: 24rpx;
    padding: 0 24rpx;

    .added-name {
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: var(--text-color);
    }

    .added-time {
      font-size: 24rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #959595;
    }
  }
}
</style>