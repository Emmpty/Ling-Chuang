<template>
  <view :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }">

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="万圣节装扮"
    />

    <view
      class="page"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >

      <!-- <view class='canvas-box '>
        <canvas id='canvas' class='canvas' canvas-id="firstCanvas" @touchstart="handleTouchStart"
          @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
      </view> -->
      <view class='canvas-box '>
        <canvas-drag
          class="canvas-box"
          ref="canvasRef"
          id="canvas-drag"
          :graph="graph"
          :width="360"
          :height="360"
          :enableUndo="true"
        ></canvas-drag>
      </view>

      <view
        class="dressup"
        :style="{ 'border-bottom': cueTheme == 'day-theme' ? '2rpx solid #F5F5F5' : '' }"
      >
        <view
          class="dressup-name"
          :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '#fff' }"
        >万圣节装扮</view>
        <view>
          <button
            open-type="share"
            type="button"
            class="dressup-share"
          >
            <image src="https://img.drawai.cn/icon/share.png"></image>分享
          </button>
          <button
            class="dressup-share"
            @click="llustrateStatus()"
          >
            <image src="https://img.drawai.cn/icon/share.png"></image>海报
          </button>
        </view>
      </view>

      <view class="flex-col space-y-26">
        <view class="flex-col">
          <view
            class="font_3 text_13"
            @click="functClick(1)"
          >
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }">装扮选择</view>
          </view>
          <scroll-view scroll-x="true">
            <view class="scroll">
              <view
                id="demo1"
                class="scroll-item"
              >
                <view
                  :class="modeIndex == index ? 'scroll-item-list scroll-item-active' : 'scroll-item-list'"
                  v-for="(item, index) in dressList"
                  :key="index"
                  @click="selectImage(item.url, index)"
                  :style="{ 'background': cueTheme != 'day-theme' ? '#fff' : '#F5F5F5' }"
                >
                  <image
                    class="icon"
                    :src="item.url"
                  ></image>
                  <view class="name">{{ item.name }}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!--<view class="flex-col">
        <text class="self-start font_3 text_13"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }">偏好选择</text>
        <view class="flex-row self-start equal-division" style="width:100%;">
          <u-slider v-model="weight" activeColor="#1affe8" inactiveColor="#c0c4cc" style="width:100%,margin:0 !important;"
            step="0.1" min="0.1" max="2" @change="start" />
        </view>
        <view class="gender" :style="{ 'color': cueTheme == 'day-theme' ? '#959595' : '#fff' }">
          <view >更男性</view>
          <view class="weight">{{ weight }}</view>
          <view>更女性</view>
        </view>
      </view>-->
      <button
        class="button"
        @click="savePoster()"
      >开始创作</button>
    </view>



    <sharePoster
      ref="sharePosterRef"
      title="万圣节装扮"
      imgUrl="https://img.drawai.cn/icon/poster-sharing.png"
    ></sharePoster>




  </view>
</template>

<script>
import { creativeDraw, } from '../static/api/index.js'
import canvasDrag from "./components/canvas-drag/index";
import sharePoster from "@/components/sharePoster/index";
export default {
  data() {
    return {
      modeIndex: -1,
      dressList: [
        { url: 'https://img.drawai.cn/icon/dressurl1.png', name: '魔法帽贴纸' },
        { url: 'https://img.drawai.cn/icon/dressurl2.png', name: '南瓜头贴纸' },
        { url: 'https://img.drawai.cn/icon/dressurl3.png', name: '小幽灵贴纸' }
      ],

      weight: 1,
      userInfo: {},
      spreadData: [{}], //新海报数据
      hg: 0,
      wd: 0,
      spread: [
        { "pic": "https://img.drawai.cn/icon/poster.png?s" }
      ],
      posterImage: [],
      llustrate: false,
      customData: {
        ctx: null,
      },
      graph: {},
      illustrates: false
    }
  },
  components: {
    canvasDrag,
    sharePoster,
  },

  onLoad(res) {
    setTimeout(() => {
      this.$refs.canvasRef.changeBgImage(res.url)
    }, 300)
  },
  methods: {
    start() {
      this.weight = this.weight.toFixed(1)
    },

    selectImage(url, index) {
      this.modeIndex = index
      uni.setStorageSync('dressStatus', true);
      uni.getImageInfo({
        src: url,
        success: (info) => {
          this.graph = {
            w: 100,
            h: 100,
            type: 'image',
            url: info.path
          }
        }
      })
    },

    // 制作海报
    llustrateStatus() {
      this.$refs.sharePosterRef.llustrateStatus()
    },

    savePoster() {
      this.$refs.canvasRef.exportFun().then(filePath => {
        console.log(filePath);
        let dressStatus = uni.getStorageSync('dressStatus');
        if (!dressStatus) {
          uni.showModal({
            title: '温馨提示',
            content: '请选择装扮后再操作！',
            confirmText: "知道了",
            showCancel: false,
            success: function (res) {

            }
          })
          return
        }
        // return
        uni.showLoading({ title: '加载中' });
        uni.request({
          url: 'https://app.drawai.cn/task/creative/attachment',
          method: 'POST',
          header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
          success: (res) => {
            let formData = res.data.result.post.formData;
            let url = res.data.result.post.url;
            let id = res.data.result.id;
            uni.uploadFile({
              url: url,
              filePath: filePath,
              name: 'file',
              method: 'POST',
              formData: formData,
              success: (res) => {
                let info = {
                  template: 1,
                  attachment: id,
                  // weight: this.weight
                }
                creativeDraw(info).then(res => {
                  if (res.code == 200) {
                    uni.hideLoading()
                    uni.removeStorageSync('dressStatus');
                    uni.redirectTo({
                      url: '/phome/make?id=' + res.result.taskId + '&typeurl=创意'
                    })
                  }
                })
              },
              error(err) {
                console.log(err, '666666666')
              },
            });
          },
          error(err) { },
        });
      }).catch(e => {
        console.error(e);
      });
    }
  },

  // #ifdef MP
  onShareAppMessage() {
    return {
      path: '/plaboratory/dress',
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

}
</script>

<style scoped lang="scss">
.canvasid {
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
  background-repeat: repeat;
  width: 100%;
  min-height: 340px;
  border-radius: 30rpx;
  max-height: 448px;
  margin-bottom: 30rpx;
}



.speak {
  width: auto;
  background: none;
  border-radius: 32rpx;
}


.canvas-box {
  margin: 20rpx 0 48rpx;
  text-align: center;
}

.canvas {
  width: 360px;
  height: 360px;
  margin: 0 auto;
  border-radius: 32rpx;
  z-index: 1 !important;
}

.slider {
  margin: 0 !important;
}

.dressup {
  display: flex;
  justify-content: space-between;
  padding-bottom: 32rpx;
  border-bottom: 2rpx solid #2B2B2D;

  .dressup-name {
    font-size: 44rpx;
    color: #FFFFFF;
    font-weight: 800;
  }

  .dressup-share {
    display: inline-block;
    width: 106rpx;
    height: 44rpx;
    line-height: 40rpx;
    font-size: 24rpx;
    text-align: center;
    border-radius: 22rpx 22rpx 22rpx 22rpx;
    border: 2rpx solid #1AFFE8;
    color: #1AFFE8;
    margin-left: 32rpx !important;
    background: none;

    image {
      width: 20rpx;
      height: 20rpx;
      position: relative;
      right: 4rpx;
      top: 2rpx;
    }
  }
}

.scroll {
  min-width: 850rpx;
  max-width: 2850rpx;
}

.scroll-item {
  /* border: 1px solid red; */
  min-width: 850rpx;
  max-width: 1850px;
  // height:120px;
  overflow-x: auto;
}

.scroll-item-list {
  width: 170rpx;
  height: 170rpx;
  margin-right: 16rpx;
  background: white;
  border-radius: 16rpx;
  display: inline-block;
  position: relative;
  text-align: center;
}

.scroll-item-active {
  width: 170rpx;
  height: 170rpx;
  margin-right: 16rpx;
  display: inline-block;
  position: relative;
  border-radius: 16rpx;
  border: 2rpx solid #1affe8;
}


.scroll-item-list .icon {
  width: 70%;
  height: 70%;
  margin-top: 20rpx;
  border-radius: 16rpx;
}

.scroll-item-active .name {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: white;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0 0 16rpx 16rpx;
  background: rgba(0, 0, 0, 0.4);
}

.scroll-item-list .name {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: white;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0 0 16rpx 16rpx;
  background: rgba(0, 0, 0, 0.4);
}


.page {
  background-color: #141416;
  width: auto;
  min-height: 100vh;
  padding: 0 32rpx;
}




.space-y-26>view:not(:first-child),
.space-y-26>text:not(:first-child),
.space-y-26>image:not(:first-child) {
  margin-top: 32rpx;
}

.font_3 {
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  line-height: 30rpx;
  color: #ffffff;
}


.view {
  margin-left: 10rpx;
}

.text_13 {
  margin: 20rpx 22rpx 0 0rpx;
  display: flex;
  justify-content: space-between;
  width: auto;
  line-height: 70rpx;
}


.button {
  position: fixed;
  bottom: 140rpx !important;
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  height: 96rpx;
  line-height: 96rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}
</style>
