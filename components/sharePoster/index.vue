<template>
  <view>
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
          id='posterCanvas'
          canvas-id="firstCanvas"
          class='canvas'
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
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    subTitle: {
      type: String,
      default() {
        return '邀请您一起来体验灵创AI'
      }
    },
    text: {
      type: String,
      default() {
        return '长按扫码立即尝新使用'
      }
    },
    imgUrl: {
      type: String,
      default() {
        return ''
      }
    },
  },
  computed: {
  },
  data() {
    return {
      posterImage: [],
      llustrate: false,
      illustrates: false,
      canvasCtx: null,
    };
  },
  mounted() {
  },
  methods: {
    // 制作海报
    llustrateStatus() {
      if (this.posterImage.length > 0) {
        this.collectClick()
        return
      }
      uni.showLoading({
        title: '海报生成中',
        mask: true
      });
      this.illustrates = true;
      this.drawPoster()
    },

    async drawPoster() {
      let that = this;
      let env = this.$baseURL == 'https://app.onefold.cn' ? 'trial' : 'release';
      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxec994b5f8ad8bfde/' + env;
      mpUrl = await this.downloadFilestoreImage(mpUrl);
      // 组件内调用要加this
      this.canvasCtx = uni.createCanvasContext('firstCanvas', this);
      console.log();
      // 组件内调用要加.in(this)
      uni.createSelectorQuery().in(this).select('#posterCanvas').boundingClientRect((rect) => {
        let canvasWidth = rect.width;
        let canvasHeight = rect.height
        that.canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        that.canvasCtx.rect(0, 0, canvasWidth, canvasHeight);
        that.canvasCtx.setFillStyle('white');
        that.drawRoundPath(that.canvasCtx, 0, 0, 326, 440, 24, 24, 24, 24)
        that.canvasCtx.fill();
        uni.getImageInfo({
          src: that.imgUrl,
          success: (res) => {
            that.canvasCtx.drawImage(res.path, 0, 0, 326, 326,);
            that.canvasCtx.drawImage(mpUrl, 20, 340, 90, 90);
            that.canvasCtx.setFillStyle('#31312E');
            that.canvasCtx.setFontSize(20);
            that.drawText(that.title, "normal bold 19px Arial", "#121212", 130, 370)
            that.drawText(that.subTitle, "normal bold 13px Arial", "#A8A8A8", 130, 400)
            that.drawText(that.text, "normal bold 13px Arial", "#A8A8A8", 130, 420)
            that.canvasCtx.draw();
            that.illustrates = false;
            uni.hideLoading();
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: 'firstCanvas',
              success: (res) => {
                that.posterImage = [res.tempFilePath]
                that.collectClick()
              },
              fail: (err) => {
                console.error(err);
              }
            }, that)
          },
          fail: (err) => {
            console.error(err);
          }
        })
      }).exec();
    },

    //  字体加粗
    drawText(text, font, fontColor, left, top) {
      this.canvasCtx.font = font;
      this.canvasCtx.fillStyle = fontColor;
      this.canvasCtx.fillText(text, left, top)
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
    cancelHandle() {
      this.$emit("cancelHandle")
    },
    confirmHandle() {
      this.$emit("confirmHandle")
    }
  },
};
</script>

<style lang="scss" scoped>
.canvas {
  width: 360px;
  height: 360px;
  margin: 0 auto;
  border-radius: 32rpx;
  z-index: 1 !important;
}

.speak {
  width: auto;
  background: none;
  border-radius: 32rpx;
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
</style>
