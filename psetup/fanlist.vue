<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="粉丝列表"
    />

    <view
      class="list"
      v-for="(item, index) in list"
      :key="index"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="item"
        @click="getDetail(item.userId)"
      >
        <image :src="item.avatar" />
        <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">
          <view class="name"> {{ item.nickname }}</view>
          <!-- <view class="name tips">画廊67｜粉丝{{item.fans}}</view> -->
        </view>
      </view>
      <view
        :class="!item.followed ? 'btn' : 'active'"
        @click="followClick(index)"
        :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >
        {{ !item.followed ? '回关' : "取消关注" }}
      </view>
    </view>
  </view>
</template>

<script>
import { fansList, followAdd, followRemove } from '../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      pageNum: 1,
      list: [],
      total: 0,
    };
  },

  onLoad(res) {
    this.fansList()
  },

  //上拉
  onReachBottom() {
    if (this.list.length >= this.total) {
      return;
    } else {
      this.fansList()
    }
  },

  methods: {

    fansList() {
      let that = this;
      let data = {
        pageNum: that.pageNum,
        pageSize: 20,
      }
      fansList(data).then(res => {
        if (res.code == 200) {
          that.pageNum = that.pageNum + 1;
          that.list = that.list.concat(res.result.records);
          that.total = res.result.total;
        }
      })
    },

    // 详情
    getDetail(id) {
      uni.navigateTo({
        url: "/psetup/homepage?userId=" + id,
      });
    },

    // 是否关注取消用户
    followClick(index) {
      let that = this;
      let list = that.list;
      if (!list[index].followed) {// 关注用户
        followAdd({ id: list[index].userId }).then(res => {
          if (res.code == 200) {
            list[index].followed = !list[index].followed;
            uni.showToast({
              title: "关注成功",
              icon: 'none',
              duration: 3000,
            });
          }
        })
      } else { //取消关注
        followRemove({ id: list[index].userId }).then(res => {
          if (res.code == 200) {
            list[index].followed = !list[index].followed;
            uni.showToast({
              title: "取关成功",
              icon: 'none',
              duration: 3000,
            });
          }
        })
      }
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
  // #endif
};
</script>

<style scoped lang="less">
.page {
  background-color: #141416;
  min-height: 100vh;
}

.list {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  color: white;
  line-height: 70rpx;
}

.list .item {
  display: flex;
  color: white;
  width: 80%;
}

.list .item .name {
  line-height: 50rpx;
  font-size: 28rpx;
}

.list .item .tips {
  font-size: 26rpx;
}

.list image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  position: relative;
  top: 0rpx;
  margin-right: 10rpx;
}

.list .btn {
  width: 64px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
  margin-top: 30rpx;
}

.list .active {
  width: 64px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  border: 1px solid #61FFFF;
  color: #61FFFF;
  line-height: 28px;
  font-size: 12px;
  text-align: center;
  margin-top: 30rpx;
}
</style>