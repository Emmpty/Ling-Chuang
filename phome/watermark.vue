<template>
  <view
    class="watermark"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="抖音加水印"
    />

    <view
      :class="cueTheme == 'day-theme' ? 'watermark-item watermark-white' : 'watermark-item'"
      v-if="!status"
      @click="watermarkUpload()"
    >
      <image
        v-if="tempFilePaths.length > 0"
        class="pirpct"
        mode=""
        :webp="true"
        :src="tempFilePaths[0]"
      ></image>
      <image
        v-if="tempFilePaths.length == 0"
        class="take"
        :src="cueTheme == 'day-theme' ? '../static/img/home/take_active.png' : '../static/img/home/take.png'"
      />
      <view
        v-if="tempFilePaths.length == 0"
        :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
      >上传图片</view>
    </view>



    <view
      class="grid"
      v-if="status"
    >
      <image
        class="grid-item"
        mode="widthFix"
        :webp="true"
        :src="watermarkInfo.result"
        @click="watermarkPreview()"
      >
      </image>
    </view>

    <view
      class="dressup"
      :style="{ 'border-bottom': cueTheme == 'day-theme' ? '2rpx solid #F5F5F5' : '' }"
    >
      <view
        class="dressup-name"
        :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '#fff' }"
      >抖音加水印</view>
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

    <view
      class="watermark-tips watermark-name"
      :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
    >
      会员免费，普通用户收取1灵力<br />提示：上传图片时请选择原图
    </view>
    <view
      class="watermark-tips"
      :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
      @click="watermarkRule()"
    >
      点击查看 <text style="color:#1affe8;"> 《抖音AI作品发布规则》</text>
    </view>

    <view
      class="making"
      v-if="!status"
      @click="watermarkProduction()"
      :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
    >开始生成( {{ (userInfo.vip || userInfo.anchor == 1) ? '免费' : '1灵力'
    }} )</view>
    <view
      class="footer"
      v-if="status"
    >
      <view
        class="footer-item"
        @click="watermarkRedo()"
        :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
      >再来一张
      </view>
      <view
        class="footer-item footer-active"
        @click="watermarkDownload()"
        :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '' }"
      >下载图片</view>
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
  components: {},
  data() {
    return {
      destWidth: 370,
      destHeight: 320,
      tempFilePaths: [],
      status: false,
      watermarkInfo: {},
      userInfo: {},
      maskStatus: true,
      posterImage: [],
      llustrate: false,
      illustrates: false,
      customData: {}
    };
  },
  onLoad() {
    this.userInfo = uni.getStorageSync('userInfo');
  },
  methods: {

    // 水印上传
    watermarkUpload() {
      let that = this
      uni.chooseImage({
        count: 1,
        //album 从相册选图，camera 使用相机，默认二者都有。
        sourceType: ['album'],
        success: function (res) {
          that.tempFilePaths = res.tempFilePaths;
        }
      })
    },

    // 水印制作
    watermarkProduction() {
      var that = this;
      if (this.tempFilePaths.length == 0) {
        return
      }
      if (!that.maskStatus) { return }
      that.maskStatus = false
      uni.showLoading({ title: '制作中...', mask: true, })
      uni.uploadFile({
        method: 'POST',
        header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
        url: this.$baseURL + '/task/reqWatermark',
        filePath: this.tempFilePaths[0],
        formData: {},
        name: 'file',
        success: (res) => {
          let data = JSON.parse(res.data);
          uni.hideLoading()
          if (data.code == 200) {
            that.status = true;
            that.maskStatus = true;
            that.watermarkInfo = data;
            uni.hideLoading()
          } else {
            uni.showToast({ title: data.message, icon: 'none', duration: 4000 })
          }
        }
      });
    },

    // 水印重做
    watermarkRedo() {
      let that = this;
      that.tempFilePaths = []
      that.status = false;
    },

    // 图片放大
    watermarkPreview(e) {
      let imgArr = [this.watermarkInfo.result];
      uni.previewImage({
        current: this.watermarkInfo.result,
        urls: imgArr,
      })
    },

    //  水印下载
    watermarkDownload() {
      // #ifndef H5  
      getApp().globalData.downLoadImage(this.watermarkInfo.result);
      // #endif
    },

    // 水印规则
    watermarkRule() {
      uni.navigateTo({
        url: "/pmnie/mnie/webview?type=5"
      })
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
          src: 'https://img.drawai.cn/icon/words1.png',
          success(res) {
            that.customData.ctx.drawImage(res.path, 0, 0, 326, 326,);
            that.customData.ctx.drawImage(mpUrl, 20, 340, 90, 90);
            that.customData.ctx.setFillStyle('#31312E');
            that.customData.ctx.setFontSize(20);
            that.drawText('抖音加水印', "normal bold 19px Arial", "#121212", 130, 370)
            that.drawText('邀请您一起来体验灵创AI', "normal bold 13px Arial", "#A8A8A8", 130, 400)
            that.drawText('上传图片，一键生成AI水印', "normal bold 13px Arial", "#A8A8A8", 130, 420)
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
}
</script>

<style lang="scss">
page {
  min-height: 100vh;
}

.watermark {
  min-height: 100vh;
  padding: 0rpx 0 200rpx
}

.watermark-item {
  width: auto;
  height: 400rpx;
  margin: 32rpx 32rpx 48rpx 32rpx;
  border-radius: 10rpx;
  border: 1px dashed white;
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.watermark-white {
  border: 1px dashed #000 !important;
}

.watermark-name {
  margin-top: 152rpx;
  margin-bottom: 136rpx;
}

.watermark-tips {
  text-align: center;
  color: white;
  font-size: 26rpx;
}

.watermark-item .pirpct {
  width: 100%;
  height: 100%;
}

.dressup {
  display: flex;
  justify-content: space-between;
  padding-bottom: 32rpx;
  margin: 0 32rpx;
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

.smegma {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 999999;
}

.take {
  width: 120rpx;
  height: 120rpx;
  margin-top: 110rpx;
}

.making {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 60rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  color: #141416 !important;
  border: none !important;
  padding: 0 !important;
  line-height: 50px;
  font-weight: normal;
  border-radius: 70rpx;
  text-align: center;
}

.footer {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 60rpx;
  display: flex;
  justify-content: space-between;
}

.footer .footer-item {
  color: white;
  width: 48%;
  border: 1px solid white;
  text-align: center;
  border-radius: 70rpx;
  line-height: 96rpx;
  font-size: 30rpx;
  background: rgba(255, 255, 255, 0.08);
}

.footer .footer-active {
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  color: #141416;
}

.grid {
  text-align: center;
  margin-bottom: 48rpx;
}

.grid-item {
  border-radius: 32rpx;
}
</style>
