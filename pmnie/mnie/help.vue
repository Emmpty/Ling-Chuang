<template>
  <view class="flex-col page">

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="帮助中心"
    />

    <view class=" group_3">
      <view class="title">常见问题</view>
      <u-collapse>
        <u-collapse-item
          :title="item.title"
          name=""
          v-for="(item, index) in helpList"
          :key="index"
        >
          <text class="u-collapse-content">{{ item.content }}</text>
        </u-collapse-item>
      </u-collapse>
    </view>
  </view>
</template>

<script>


export default {
  components: {},
  data() {
    return {
      helpList: [],
    };
  },
  onLoad() {
    this.helpList = getApp().globalData.jsonGoods.helpCenter;
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

<style>
page {
  background-color: #141416;
}
</style>
<style scoped lang="less">
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

  }
}
</style>