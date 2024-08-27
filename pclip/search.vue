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
        :src="cueTheme == 'day-theme' ? '../static/img/clip/sort11.png' : '../static/img/clip/sort1.png'"
      ></image>
      <input
        class="search-input"
        placeholder="搜索"
        v-model="albumPrompt"
        type="text"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      />
      <image
        class="search-close"
        v-if="albumPrompt"
        @click="resettingText()"
        :src="cueTheme == 'day-theme' ? '../static/img/clip/colse.png' : '../static/img/clip/colse_white.png'"
      />
      <button
        class="search-btn"
        @click="albumSearch()"
      >搜索</button>
    </view>

    <u-sticky
      offset-top="0"
      v-if="list.length > 0"
    >
      <view
        class="navadmin"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view class="item"></view>
        <view
          class="item"
          @click="choiceDelete()"
          :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
        >
          <view class="navitem">
            <image :src="cueTheme == 'day-theme' ? '../static/img/clip/sort22.png' : '../static/img/clip/sort2.png'">
            </image>
            {{ statusbox ? "取消" : "管理" }}
          </view>
        </view>
      </view>
    </u-sticky>

    <waterfallList
      :list="list"
      :statusBox="statusbox"
      ref="chaefall"
      @clickBox="onClick"
    ></waterfallList>

    <view
      class="postiont"
      v-if="statusbox"
    >
      <view class="postiont-left">已选<text style="color:#00ebd3">{{ numberSize }}</text>项</view>
      <view class="postiont-right">
        <view
          class="navitem"
          @click="albumCancel()"
        >{{ !allStatus ? '全选' : '全不选' }}</view>
        <view
          class="navitem"
          @click="collecStatus = true"
        >移至合集</view>
        <view
          class="navitem"
          @click="albumDelete()"
        >删除</view>
      </view>
    </view>

    <!-- 移至合集列表弹窗 -->
    <u-popup
      :show="collecStatus"
      @close="collecStatus = false"
      :round="10"
      :closeable="true"
      height="800px"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="popup-title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >移至合集
      </view>
      <view
        class="models"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <scroll-view
          scroll-y="true"
          style="height:600rpx;"
          @scrolltolower="bindscrolltolower"
        >
          <view
            class="models-list"
            v-for="(item, index) in collectList"
            :key="index"
            @click="selectCollection(item.id)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              :src="item.status ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
            />
            {{ item.title }}
          </view>
        </scroll-view>
        <view class="models-btn">
          <view
            class="li"
            @click="collecStatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >取消</view>
          <view
            class="li active"
            @click="addCollection()"
          >确定</view>
        </view>
      </view>
    </u-popup>

    <u-back-top
      :scroll-top="scrollTop"
      top="600"
    ></u-back-top>

  </view>
</template>

<script>
import { collectList, moveToCollect, searchMytask } from '../static/api/index.js'

import waterfallList from './components/waterfall/zero-waterfall'

export default {
  components: {
    waterfallList
  },
  data() {
    return {
      statusbox: false, // 是否开启管理
      collecStatus: false, //是否开启加入合集状态
      numberSize: 0,//已选个数
      allStatus: false,//全选 全不选
      collectList: [], //合集列表
      albumPrompt: '',//搜索
      page: 1,
      list: [],
      scrollTop: 0,
    }
  },
  onLoad(res) {
    this.getcollectList();
  },
  onReachBottom() {
    this.albumSearchList()
  },
  methods: {

    // 获取合集列表
    getcollectList() {
      let that = this;
      let data = {
        title: '',
        pageNum: 1,
        pageSize: 100,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      collectList(data).then(res => {
        if (res.code == 200) {
          let resData = res.result.records;
          setTimeout(function () {
            uni.hideLoading()
            that.collectList = that.collectList.concat(resData)
          }, 300)
        }
      })
    },

    // 清除搜索内容
    resettingText() {
      let that = this;
      that.albumPrompt = '';
    },

    // 搜素
    albumSearch() {
      let that = this
      if (!that.albumPrompt) {
        uni.showToast({ title: "请输入搜索关键词", icon: "none", duration: 3000 })
        return
      }
      if (that.list.length > 0) {
        that.$refs.chaefall.clear();
      }
      that.page = 1
      that.list = []


      that.albumSearchList();
    },

    // 搜素列表
    albumSearchList() {
      let that = this;
      let temp = {
        prompt: that.albumPrompt,
        pageNum: that.page,
        pageSize: 10,
        Bearer: "Bearer",
      }
      searchMytask(temp).then(res => {
        if (res.code == 200) {
          if (res.result.records.length == 0 && that.page == 1) {
            uni.showToast({
              title: "未搜索到相关作品",
              icon: "none",
              duration: 3000
            })
            return
          }
          res.result.records.map(item => {
            item.statusBox = false;
            item.url = item.thumbUrl ? item.thumbUrl : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.albumTotal = res.result.total;
          that.page = that.page + 1;
          that.list = that.list.concat(res.result.records);
        }
      })
    },

    //  画册管理功能开启
    choiceDelete() {
      let that = this;
      that.statusbox = !that.statusbox;
      if (!that.statusbox) {
        this.$refs.chaefall.selectAll(false);
      }
    },

    // 管理--选择作品个数统计
    onClick(data) {
      this.numberSize = data.length;
      this.numberList = data;
    },

    // 管理--全选全不选
    albumCancel() {
      let that = this;
      that.allStatus = !that.allStatus
      that.$refs.chaefall.selectAll(that.allStatus);
    },

    // 管理--删除
    albumDelete() {
      let that = this;
      that.$refs.chaefall.albumDelete();
    },

    // 管理--选择合集列表
    selectCollection(id) {
      let collectList = this.collectList;
      for (var i = 0; i < collectList.length; i++) {
        if (collectList[i].id == id) {
          collectList[i].status = !collectList[i].status;
        } else {
          collectList[i].status = false;
        }
      }
      this.collectList = [...this.collectList]
    },

    // 管理---添加合集
    addCollection() {
      let that = this;
      let collectList = that.collectList;
      let numberList = that.numberList //选择画册的列表
      let collectId = '';
      if (that.numberSize == 0) {
        uni.showToast({
          title: "请选择需要加入的合集作品", icon: 'none', duration: 3000
        })
        return
      }
      collectList.map(item => { // 获取合集ID
        if (item.status) {
          collectId = item.id
        }
      })
      var arr = []; // 获取需要加入合集的id列表
      numberList.map(item => {
        if (item.statusBox) {
          arr.push(item.id)
        }
      })
      if (!collectId) {
        uni.showToast({
          title: "请选择需要加入的合集", icon: 'none', duration: 3000
        })
        return
      }
      moveToCollect({ taskList: arr, collectId: collectId, }).then(res => {
        if (res.code == 200) {
          that.collecStatus = false; // 关闭管理弹窗功能
          uni.showToast({
            title: "添加成功", icon: 'none', duration: 3000
          })
        }
      })
    },

    //返回顶部
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },

    // 
    copyKeyword() {
      uni.setClipboardData({
        data: this.prompt,
        success: function () {
          uni.showToast({ title: "关键词复制成功", icon: 'none', duration: 4000 })
        }
      });
    }

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
  z-index: 998;
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