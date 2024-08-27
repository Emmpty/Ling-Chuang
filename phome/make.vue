<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="制作中"
    />

    <view class="percentage">
      <view class="model-body">
        <view
          class="title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >制作中...</view>

        <view
          class="tips"
          style="color:#61FFFF;padding-bottom:20rpx"
        >当前排队：<u-count-to
            :start-val="0"
            :end-val="taskInfo.queue ? taskInfo.queue : 0"
            color="#61FFFF;"
          ></u-count-to></view>

        <view
          class="tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >提示:
          MJ画板创作时间较长，可以去试试灵创画板~<br />两个画板可以同时创作哦~</view>
        <view
          class="tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >会员可在MJ画板免费无限作图，快速通道灵力节省50%~</view>
        <view
          class="tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >中途离开页面不会影响创作，但需前往画夹查看作品</view>
        <view
          class="tips"
          @click="dealwithVip()"
          v-if="!userInfo.vip && userInfo.anchor == 0"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >
          会员无需排队,<text style="color:#00C3FF;">点击办理会员</text>
        </view>

        <view
          class="tips viptips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          v-if="userInfo.fast_usable != 0 && instatus && passIndex == 0"
        >
          <view>体验会员通道剩余:{{ userInfo.fast_usable || 0 }} </view>
          <view
            class="dome"
            @click="instantlyDome()"
          >立即体验</view>
        </view>

        <view
          v-if="!userInfo.vip && userInfo.anchor == 0 && taskInfo.queue != 0"
          class="button"
          @click="unqueueClick"
        >
          取消排队
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { currentDraw, userInfo, cancelQueue } from "../static/api/index.js";
import { tryFast } from "../static/api/home.js";


export default {
  components: {},
  data() {
    return {
      godos: {},
      taskId: '', //任务ID
      userInfo: {},
      taskInfo: {},
      instatus: false,
      taskStatus: true,
      passIndex: 0,
      typeUrl: '',
    };
  },

  onLoad(res) {

    this.taskId = res.id;
    this.typeUrl = res.typeurl
    userInfo({}).then((res) => {
      if (res.code == 200) {
        if (res.result.fast_usable > 0 && !res.result.vip) {
          this.instatus = true;
        }
        this.userInfo = res.result;
        if (!res.result.vip && res.result.anchor == 1) {
          this.passIndex = 1;
        } else if (!res.result.vip && res.result.anchor == 0) {
          this.passIndex = 0;
        } else if (res.result.vip && res.result.anchor == 0) {
          this.passIndex = 1;
        } else if (res.result.vip && res.result.anchor == 1) {
          this.passIndex = 1;
        } else {
          this.passIndex = 0;
        }
        uni.setStorageSync("userInfo", res.result);
      }
    });
  },

  onShow() {
    var that = this;
    setTimeout(function () {
      that.countDown()
    }, 500)
  },

  methods: {

    // 倒计时
    countDown() {
      var that = this;
      var nsecond = 0;
      var appCount = setInterval(function () {
        if (!that.taskStatus) {
          clearInterval(appCount);
        }
        if (nsecond == 0) {
          // 倒计时5秒钟调用接口
          if (that.taskId) {
            that.getCurrentDraw(that.taskId)
          }
        }
        nsecond += 1;
        if (nsecond >= 5) {
          nsecond = 0;
        }
      }, 1000);
    },

    // 获取作品进度
    getCurrentDraw(id) {
      let that = this;
      currentDraw({ id: id }).then((res) => {
        if (res.code == 200) {
          let status = res.result.status;
          that.taskInfo = res.result;
          if (status === 0 || status === -2) {
            that.taskStatus = false;
            uni.showToast({
              title: '制作成功',
              duration: 3500
            });
            if (that.typeUrl == '创意') {
              setTimeout(function () {
                uni.redirectTo({
                  url: '/plaboratory/detail?id=' + res.result.id
                })
              }, 2000)
              return
            }else{
              setTimeout(function () {
                uni.redirectTo({
                  url: '/pclip/detail?id=' + res.result.id
                })
              }, 2000)
            }
          } else if (status === -1 || status === -3) {
            uni.showModal({
              title: status === -1 ? '绘图失败' : '绘图超时',
              confirmText: '知道了',
              showCancel: false,
              content: status === -1 ? res.result.errors ? res.result.errors : `您可继续绘图，稍后将会退回灵力。` : `您可继续绘图，稍后将会退回灵力。`,
              success: function (res) {
                uni.navigateBack({
                  delta: 1,
                })
              }
            });
          }
        }
      })
    },

    // 立即体验
    instantlyDome() {
      let that = this;
      tryFast({ id: that.taskId }).then((res) => {
        if (res.code == 200) {
          uni.showToast({
            title: '使用成功，正在制作中！',
            icon: 'none',
            duration: 3000
          });
          that.instatus = false;
          userInfo({}).then((res) => {
            if (res.code == 200) {
              that.userInfo = res.result;
              uni.setStorageSync("userInfo", res.result);
              that.getCurrentDraw(that.taskId)
            }
          });
        }
      })
    },

    // 取消排队
    unqueueClick() {
      let that = this;
      cancelQueue({ id: that.taskId }).then(res => {
        if (res.code == 200) {
          uni.showToast({ title: "取消排队成功，您的灵力已返还。", icon: 'none', duration: 3000 })
          setTimeout(function () {
            uni.navigateBack({
              delta: 1,
            })
          }, 1500)
        }
      })
    },

    // 办理会员
    dealwithVip() {
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }
      uni.navigateTo({
        url: "/pmnie/mnie/recharge"
      })
    },
  },

  onHide() {
    this.taskStatus = false;
  },

  onUnload() {
    this.taskStatus = false;
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
  min-height: 100vh;
}

.percentage {
  padding-top: 46%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-body {
  text-align: center;
  color: white;
}

.model-body .title {
  font-weight: 500;
  color: #FFFFFF;
  font-size: 18px;
  margin: 40rpx 0rpx;
}

.model-body .tips {
  font-size: 24rpx;
  font-family: 'PingFang SC-Regular, PingFang SC';
  font-weight: 400;
  line-height: 36rpx;
  color: rgba(255, 255, 255, 0.6);
}

.model-body .viptips {
  margin-top: 100rpx;
  font-weight: 600;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  height: 68rpx;
  line-height: 68rpx;
}

.model-body .viptips .dome {
  width: 140rpx;
  height: 58rpx;
  line-height: 58rpx;
  text-align: center;
  background: #00EBD3;
  font-weight: normal;
  font-size: 22rpx;
  border-radius: 70rpx;
  margin-left: 20rpx;
}

.button {
  position: fixed;
  bottom: 160rpx !important;
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  padding: 32rpx 0;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}
</style>