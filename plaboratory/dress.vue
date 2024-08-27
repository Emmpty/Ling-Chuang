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
      <view
        class="upload"
        @click="uploadImage()"
        v-if="!primaryUrl"
        :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
      >
        <image
          class="upload-icon"
          src="https://img.drawai.cn/icon/Union%402x.png"
        ></image>
        <view class="upload-name">上传图片</view>
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

    <u-popup
      :show="illustrates"
      mode="center"
      @close="illustrates = false"
      border-radius="40"
    >
      <view
        class="speak"
        style="padding:0;overflow: hidden; "
      >
        <canvas
          id='canvas'
          class='canvas'
          canvas-id="firstCanvas"
          style="width:326px;height:440px;margin:0 !important;"
        ></canvas>
      </view>
    </u-popup>

    <view
      v-if="posterImage.length == 0 && illustrates"
      class="smegma"
    ></view>

  </view>
</template>

<script>

export default {
  data() {
    return {
      canvas: null,
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
      swiperIndex: 0,
      posterImage: [],
      llustrate: false,
      primaryUrl: '',
      infoImg: {},
      illustrates: false,
      customData: {}
    }
  },
  components: {

  },

  methods: {

    start() {
      this.weight = this.weight.toFixed(1)
    },

    uploadImage() {
      const that = this;
      this.chooseImage().then(src => {
        uni.navigateTo({
          url: `/plaboratory/cropping?src=${decodeURIComponent(src)}`
        })
      })
    },

    chooseImage() {
      return new Promise(resolve => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            resolve(res.tempFilePaths[0])
          }
        })
      })
    },

    async selectImage(url, index) {
      let that = this;
      if (!this.primaryUrl) {
        uni.showModal({
          title: '温馨提示',
          confirmText: '知道了',
          showCancel: false,
          content: '请上传图片后再操作',
          success: function (res) {
          }
        });
        return
      }
    },

    llustrateStatus() {
      let that = this;
      if (that.posterImage.length > 0) {
        that.collectClick()
        return
      }
      uni.showLoading({
        title: '海报生成中',
        mask: true
      });
      that.illustrates = true;
      that.drawPoster()
    },

    // 海报中
    async drawPoster() {
      let that = this;
      let env = this.$baseURL == 'https://app.onefold.cn' ? 'trial' : 'release';
      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxec994b5f8ad8bfde/' + env;
      mpUrl = await this.downloadFilestoreImage(mpUrl);
      this.customData.ctx = uni.createCanvasContext('firstCanvas');
      uni.createSelectorQuery().select('#canvas').boundingClientRect(function (rect) {
        let canvasWidth = rect.width;
        let canvasHeight = rect.height
        that.customData.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        that.customData.ctx.rect(0, 0, canvasWidth, canvasHeight);
        that.customData.ctx.setFillStyle('white');
        that.drawRoundPath(that.customData.ctx, 0, 0, 326, 440, 24, 24, 24, 24)
        that.customData.ctx.fill();
        uni.getImageInfo({
          src: 'https://img.drawai.cn/icon/poster-sharing.png',
          success(res) {
            that.customData.ctx.drawImage(res.path, 0, 0, 326, 326,);
            that.customData.ctx.drawImage(mpUrl, 20, 340, 90, 90);
            that.customData.ctx.setFillStyle('#31312E');
            that.customData.ctx.setFontSize(20);
            that.drawText('万圣节装扮', "normal bold 19px Arial", "#121212", 130, 370)
            that.drawText('邀请您一起来体验灵创AI', "normal bold 13px Arial", "#A8A8A8", 130, 400)
            that.drawText('长按扫码立享免费作图', "normal bold 13px Arial", "#A8A8A8", 130, 420)
            that.customData.ctx.draw();
            that.illustrates = false;
            uni.hideLoading();
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: 'firstCanvas',
              success(res) {
                that.posterImage = [res.tempFilePath]
                that.collectClick()
              },
            })
          }
        })
      }).exec();
    },

    drawRoundPath(context, x, y, width, height, radian_1 = 0, radian_2 = -1, radian_3 = -1, radian_4 = -1) {
      // 设置弧度
      radian_2 = radian_2 === -1 ? radian_1 : radian_2;
      radian_3 = radian_3 === -1 ? radian_1 : radian_3;
      radian_4 = radian_4 === -1 ? radian_1 : radian_4;
      // 创建路径 - 绘制带圆边的矩形
      context.beginPath();
      context.moveTo(x + width / 2, y);
      context.arcTo(x + width, y, x + width, y + height, radian_1);
      context.arcTo(x + width, y + height, x, y + height, radian_2);
      context.arcTo(x, y + height, x, y, radian_3);
      context.arcTo(x, y, x + width, y, radian_4);
      // 关闭路径 - 结束绘制
      context.closePath();
      context.strokeStyle = "transparent";
      context.stroke();
      context.clip();
    },

    //  字体加粗
    drawText(text, font, fontColor, left, top) {
      this.customData.ctx.font = font;
      this.customData.ctx.fillStyle = fontColor;
      this.customData.ctx.fillText(text, left, top)
    },

    savePoster() {
      uni.showModal({
        title: '温馨提示',
        confirmText: '知道了',
        showCancel: false,
        content: '请上传图片后再操作',
        success: function (res) {
        }
      });
    },

    // 收藏
    collectClick() {
      let that = this;
      wx.showShareImageMenu({
        path: that.posterImage[0],
        success: (res) => {
          if (res.errMsg == 'showShareImageMenu:ok') {
            that.llustrate = false;
            uni.showToast({
              title: '保存成功！',
              icon: 'none',
              duration: 3000,
            })
          }
        },
        fail: (res) => {
          if (res.errMsg.indexOf('deny') != -1 || res.errMsg.indexOf('denied') != -1) {
            uni.showToast({
              title: '保存相册失败，请设置权限！',
              icon: 'none',
              duration: 2000,
            })
          } else {
            that.llustrate = false;
          }
        }
      });
    },

    //图片转符合安全域名路径
    downloadFilestoreImage(url) {
      return new Promise((resolve, reject) => {
        let that = this;
        uni.downloadFile({
          url: url,
          header: {
            Authorization: uni.getStorageSync('token')
          },
          success: function (res) {
            console.log(res, 'res520')
            resolve(res.tempFilePath);
          },
          fail: function () {
            return that.$util.Tips({
              title: ''
            });
          }
        });
      })
    },

    savePosterPathMp(url) {
      let that = this;
      uni.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                uni.saveImageToPhotosAlbum({
                  filePath: url,
                  success: function (res) {
                    uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
                  },
                  fail: function (res) {
                    uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
                  }
                });
              }
            });
          } else {
            uni.saveImageToPhotosAlbum({
              filePath: url,
              success: function (res) {
                uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
              },
              fail: function (res) {
                uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
              }
            });
          }
        }
      });
    },
  },

  onLoad(res) {
    let token = uni.getStorageSync('token')
    if (!token) {
      uni.navigateTo({
        url: '/plogin/logintype'
      })
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


.smegma {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 999999;
}

.speak {
  width: auto;
  background: none;
  border-radius: 32rpx;
}

.canvas {
  width: 100%;
  border-radius: 32rpx;
}

.upload {
  height: 384rpx;
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  opacity: 1;
  border: 2rpx dashed #959595;
  margin: 48rpx 0;
  text-align: center;
  z-index: 999;

  .upload-icon {
    width: 122rpx;
    height: 96rpx;
    margin-top: 100rpx;
  }

  .upload-name {
    color: #C0C0C0;
    font-size: 38rpx;
  }
}

.slider {
  margin: 0 !important;
}

.gender {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: white;
  position: relative;
  top: -16rpx;

  .weight {
    width: 48rpx;
    height: 28rpx;
    text-align: center;
    line-height: 28rpx;
    color: #000000;
    background: #EEEEEE;
    overflow: hidden;
    border-radius: 4rpx 4rpx 4rpx 4rpx;
  }
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




.text_13 {
  margin: 20rpx 22rpx 0 0rpx;
  display: flex;
  justify-content: space-between;
  width: auto;
  line-height: 70rpx;
}





.button {
  position: fixed;
  bottom: 220rpx !important;
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
