<template>
  <view
    class="flex-col page"
    :class="cueTheme"
  >
    <!--创作 -->
    <creationBoard :passIndex="passIndex"></creationBoard>


  </view>
</template>
<script>
import creationBoard from "@/components/creation-board/index.vue";

export default {
  components: { creationBoard },
  data() {
    return {
      // 标记是否为会员
      passIndex: 0,// 通道 标识
      list: null
    };
  },
  computed: {

  },
  async onLoad(e) {

  },

  methods: {

  },

  onShow() {
    // 通道回显
    let userInfo = uni.getStorageSync('userInfo');
    this.userInfo = uni.getStorageSync('userInfo');
    if (!userInfo.vip && userInfo.anchor == 1) {
      this.passIndex = 1;
    } else if (!userInfo.vip && userInfo.anchor == 0) {
      this.passIndex = 0;
    } else if (userInfo.vip && userInfo.anchor == 0) {
      this.passIndex = 1;
    } else if (userInfo.vip && userInfo.anchor == 1) {
      this.passIndex = 1;
    } else {
      this.passIndex = 0;
    }
    // 清除记录画夹详情
    uni.removeStorageSync('albumName');

  },

  // 页面周期函数--监听页面隐藏
  onHide() {

  },
  // 页面周期函数--监听页面卸载
  onUnload() {

  },
  // 页面周期函数--监听页面加载
  created() {
    // this.taskId = uni.getStorageSync('taskId');
    // this.makeInfo = uni.getStorageSync('makeInfo');
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

<style lang="scss" scoped>
.page {
  background-color: var(--bg-color);
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40rpx;
}
</style>