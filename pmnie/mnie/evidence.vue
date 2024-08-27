<template>
  <view
    class="Index"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="存证确权"
    />

    <view class="search">
      <view
        class="search-item"
        @click="getSearch"
      >查询</view>
    </view>

    <view class="pubuBox">
      <view
        class="pubuItem"
        v-if="evList.length > 0"
      >
        <view
          class="item-masonry"
          v-for="(item, index) in evList"
          :key="index"
        >
          <image
            :src="item.cover"
            mode="widthFix"
            @click="evdetail(index)"
          />
        </view>
      </view>
      <view
        class="nodata"
        v-if="evList.length == 0"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >暂无数据~</view>
    </view>

  </view>
</template>
 
<script>
import { attestPage, } from '../../static/api/index.js'

export default {
  components: {},
  data() {
    return {
      evList: [],
      pageNum: 1,
      total: 0,
    };
  },

  onLoad() {
    this.evidenceList();
  },

  onReachBottom() {
    if (this.evList.length >= this.total) {
      return;
    } else {
      this.evidenceList();
    }
  },

  methods: {

    //列表
    evidenceList() {
      let that = this;
      let temp = {
        pageNum: that.pageNum,
        pageSize: 10,
      }
      attestPage(temp).then(res => {
        if (res.code == 200) {
          uni.hideLoading();
          let resData = res.result.records;
          that.pageNum = that.pageNum + 1;
          that.evList = that.evList.concat(resData)
          that.total = res.result.total;
        }
      })
    },

    evdetail(index) {
      uni.navigateTo({
        url: "/pmnie/mnie/evdetail?id=" + this.evList[index].id
      })
    },

    getSearch() {
      uni.navigateTo({
        url: "/pmnie/mnie/evsearch"
      })
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


<style scoped="scoped" lang="scss">
.search {
  display: flex;
  justify-content: flex-end;
  padding: 10rpx 20rpx;
}

.search-item {
  width: 64px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  background: rgba(26, 255, 232, 0.1);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid #1AFFE8;
  text-align: center;
  color: #1AFFE8;
}

.Index {
  min-height: 100vh;
}

.pubuBox {
  padding: 22rpx;
}

.pubuItem {
  column-count: 2;
  column-gap: 20rpx;
}

.nodata {
  text-align: center;
  margin-top: 180rpx;
  color: white;
}

.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  break-inside: avoid;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
  position: relative;

  .shstatus {
    position: absolute;
    width: 54rpx;
    height: 54rpx;
    z-index: 9;
    margin: 20rpx;
  }

  .under {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220rpx;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: 600;
  }
}

.item-masonry image {
  width: 100%;
}

.listtitle {
  padding-left: 22rpx;
  font-size: 24rpx;
  padding-bottom: 22rpx;


  .listtitle2 {
    color: white;
    font-size: 32rpx;
    line-height: 32rpx;
    font-weight: bold;
    padding-top: 22rpx;
    display: flex;
    padding-right: 22rpx;
    justify-content: space-between;

    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
      right: 10rpx;
    }
  }

  .listtitle3 {
    font-size: 28rpx;
    color: #909399;
    line-height: 32rpx;
    padding-top: 22rpx;
  }
}
</style>