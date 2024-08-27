<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="搜索"
    />

    <view class="search">
      <image
        class="search-icon"
        :src="cueTheme == 'day-theme' ? '/static/img/clip/sort11.png' : '/static/img/clip/sort1.png'"
      ></image>
      <input
        class="search-input"
        placeholder="搜索"
        v-model="prompt"
        type="text"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      />
      <image
        class="search-close"
        v-if="prompt"
        @click="resettingText()"
        :src="cueTheme == 'day-theme' ? '/static/img/clip/colse.png' : '/static/img/clip/colse_white.png'"
      />
      <button
        class="search-btn"
        @click="albumSearch()"
      >搜索</button>
    </view>

    <u-back-top
      :scroll-top="scrollTop"
      top="600"
    ></u-back-top>

    <waterfall
      :list="searchList"
      ref="uWaterfall"
      @clickBox="onClick"
    />

  </view>
</template>

<script>
import { searchGallery } from "../static/api/index.js";

import waterfall from "@/pages/tabBar/components/clip/zero-waterfallshow.vue";
export default {
  components: { waterfall, },
  data() {
    return {
      prompt: '',
      searchNum: 1,
      searchList: [],
      scrollTop: 0,
    }
  },

  onLoad(res) {
    this.type = res.type;
  },

  methods: {

    albumSearch() {
      // if (!this.prompt) { return; }
      this.searchNum = 1,
        this.$refs.uWaterfall.clear();
      this.searchGalleryList()
    },

    // 画廊搜索列表  
    searchGalleryList() {
      let that = this;
      let data = {
        prompt: this.prompt,
        pageNum: this.searchNum,
        isVisible: null,
        pageSize: 10,
        scoreMode: this.type == 1 ? 2 : 1, //评分模式 2.最新 1 获赞
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      searchGallery(data).then(res => {
        if (res.code == 200) {
          if (res.result.records.length == 0 && that.searchNum == 1) {
            uni.showToast({
              mask: true,
              title: "画廊里面没有搜到这个关键词哦",
              icon: 'none',
              duration: 2000,
            })
            this.prompt = "";
            this.searchStatus = false;
            return;
          }
          that.searchNum = res.result.records.length > 0 ? that.searchNum + 1 : that.searchNum;
          if (res.result.records.length == 0 && that.searchNum > 1) {
            uni.showToast({
              mask: true,
              title: "已加载全部数据",
              icon: 'none',
              duration: 2000,
            })
            return;
          }
          res.result.records.map(item => {
            item.isVisibles = Math.abs(item.isVisible)
          })
          setTimeout(function () {
            uni.hideLoading()
            that.searchList = that.searchList.concat(res.result.records);
          }, 300)
        }
      })
    },

    onClick() {

    },

    // 清除搜索内容
    resettingText() {
      let that = this;
      that.prompt = '';
    },

    //返回顶部
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },


  },


  onReachBottom() {
    this.searchGalleryList()
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

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 0rpx 0rpx 140rpx;
}

.search {
  display: flex;
  justify-content: space-between;
  line-height: 90rpx;
  background: linear-gradient(45deg, #0FCCE0 0%, #10E597 100%);
  border-radius: 80rpx;
  height: 90rpx;
  position: relative;
  margin: 0 20rpx;
}

.search .search-icon {
  width: 34rpx;
  height: 34rpx;
  position: absolute;
  top: 30rpx;
  left: 40rpx;
}

.search .search-close {
  width: 34rpx;
  height: 34rpx;
  position: absolute;
  top: 30rpx;
  right: 26%;
  margin-right: 20rpx;
  z-index: 99;
}

.search .search-input {
  width: 74%;
  height: 84rpx;
  margin: 5rpx;
  line-height: 90rpx;
  background: #121212;
  color: white;
  padding-left: 80rpx;
  border-radius: 80rpx 0 0 80rpx;
}

.search .search-btn {
  width: 26%;
  background: linear-gradient(45deg, #0FCCE0 0%, #10E597 100%);
  border-radius: 0 80rpx 80rpx 0;
  font-size: 30rpx;
  line-height: 90rpx;
}

.navadmin {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx;
  background: #141416;
}

.navadmin .navitem {
  width: 140rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 70rpx;
  font-size: 26rpx;
  margin-top: 30rpx;
  margin-right: 10rpx;
  display: flex;
  justify-content: flex-end;
}

.navadmin .navitem image {
  width: 36rpx;
  height: 36rpx;
  position: relative;
  top: 12rpx;
  right: 8rpx
}

.popup-title {
  text-align: center;
  line-height: 120rpx;
  color: white;
  font-weight: 600;
}

.postiont {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0rpx;
  background: rgba(51, 51, 51, 0.95);
  padding: 30rpx 30rpx 50rpx;
  display: flex;
  justify-content: space-between;
  z-index: 99;
}

.postiont .postiont-left {
  color: white;
  line-height: 100rpx;
  margin-left: 14rpx;
  font-size: 24rpx;
}

.postiont .postiont-right {
  width: 70%;
  display: flex;
  justify-content: right;
}

.postiont .postiont-right .navitem {
  width: 140rpx;
  height: 66rpx;
  line-height: 66rpx;
  border-radius: 70rpx;
  border: 1px solid white;
  text-align: center;
  font-size: 26rpx;
  color: white;
  margin: 16rpx;
}

.models {
  padding: 0 0rpx;
}

.models-list {
  line-height: 80rpx;
  padding: 12rpx 20rpx;
}

.models-list .icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 10rpx;
  margin-right: 10rpx;
}

.models-btn {
  display: flex;
  justify-content: space-evenly;
  margin: 30rpx 0 40rpx;
}

.models-btn .li {
  width: 165px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid #FFFFFF;
}

.models-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  color: #141416;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(51, 51, 51, 0.95);
  padding: 30rpx 30rpx 50rpx;
}

.footer-btn {
  line-height: 88rpx;
  color: #121212;
  font-size: 32rpx;
  text-align: center;
  background: linear-gradient(45deg, #0FCCE0 0%, #10E597 100%);
  border-radius: 2000rpx 2000rpx 2000rpx 2000rpx;
}

.footer-btn image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 4rpx;
  right: 12rpx;
}

.label {
  padding: 30rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.label-title {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 36rpx;
  color: #121212;
  font-weight: 500;
}

.label-title image {
  width: 42rpx;
  height: 42rpx;
  position: absolute;
  top: 10rpx;
  right: 0rpx;
}

.label-name {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  color: rgba(18, 18, 18, 0.66);
  font-weight: 400;
}

.label-black {
  color: rgba(244, 244, 244, 0.48);
}

.model {
  color: white;
  padding: 20rpx 0;
  font-size: 28rpx;
}
</style>