<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="证书详情"
    />

    <view class='canvas-box'>
      <canvas
        id='canvas'
        class='canvas'
        canvas-id="firstCanvas"
      ></canvas>
      <view class="footer">
        <view
          class="footer-item"
          @click="copyKeyword(attest.anoId)"
        >复制保全号</view>
        <view
          class="footer-item"
          @click="savePoster()"
        >保存证书</view>
        <view
          class="footer-item"
          @click="certificateQuery()"
        >证书查询</view>
      </view>
    </view>

  </view>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      card: {
        company: '',
        real_name: 55,
        head_img: 'https://cdn.drawai.cn/public/default.jpg'
      },   //后台返回的数据
      wx_qrcode: 'https://cdn.drawai.cn/public/20230215-143951.jpg',
      customData: {
        ctx: null,
      },
    }
  },

  onLoad() {
    this.visible = true
    console.log(uni.getStorageSync('attest'))
    this.attest = uni.getStorageSync('attest');
    this.drawPoster(uni.getStorageSync('attest'));
  },

  methods: {
    drawPoster(obj) {
      let that = this;
      this.customData.ctx = uni.createCanvasContext('firstCanvas');
      // 获取画布的宽高
      uni.createSelectorQuery().select('#canvas').boundingClientRect(function (rect) {
        let canvasWidth = rect.width;
        let canvasHeight = rect.height;
        // 清除画布
        that.customData.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // 绘制背景
        that.customData.ctx.rect(0, 0, canvasWidth, canvasHeight);
        that.customData.ctx.setFillStyle('white');
        that.customData.ctx.fill();

        uni.getImageInfo({
          src: that.wx_qrcode,
          success(res) {
            // // 绘制海报
            let posterHeight = canvasHeight + 100; // 海报高度
            that.customData.ctx.drawImage(res.path, 0, 0, 360, 580,);

            // 绘制文字
            that.customData.ctx.setFillStyle('#31312E');
            that.customData.ctx.setFontSize(10);
            if (JSON.stringify(that.card) !== '') {
              // 证书编号
              that.customData.ctx.fillText(obj.anoId, 94, 270);
              // 数字图片
              that.customData.ctx.fillText('数字图片', 94, 294);
              // 存证时间
              that.customData.ctx.fillText(obj.createTime, 94, 320);
              // 创作者
              that.customData.ctx.fillText(obj.userAddress, 82, 346);
              // 持有者
              that.customData.ctx.fillText(obj.userAddress, 82, 374);
              // 最新确权时间
              that.customData.ctx.fillText(obj.updateTime, 108, 400);
              //作品id
              that.customData.ctx.fillText(obj.id, 82, 424);
            }

            // 绘制二维码
            uni.getImageInfo({
              src: that.card.head_img,
              success(res) {
                that.customData.ctx.drawImage(res.path, 0, 0, res.width, res.height, canvasWidth - 80 - 10,
                  posterHeight + 10, 80, 80);
                that.customData.ctx.draw();
              }
            });

          }
        })
      }).exec();
    },

    savePoster() {
      let _ = this;
      uni.getSetting({
        success(res) {
          // 查询用户是否授权
          if (res.authSetting['scope.writePhotosAlbum']) {
            _.doSave();
          } else {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                _.doSave();
              },
              fail() {
              }
            })
          }
        }
      })
    },

    doSave() {
      uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'firstCanvas',
        success(res) {
          console.log(res)
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              uni.showToast({
                title: '保存成功',
              })
            },
            fail(err) {
              uni.showToast({
                title: '保存失败,请重试！',
                icon: 'none',
              })
            }
          })
        },
        fail(err) {
          uni.showToast({
            title: '保存失败',
          })
        },
      })
    },

    certificateQuery() {
      uni.navigateTo({
        url: '/pmnie/mnie/evsearch'
      })
    },

    // 关键词复制
    copyKeyword(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: "复制成功", icon: 'none', duration: 4000 })
        }
      });
    },

  },
  /**
   * 用户点击右上角分享
   */
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

<style scoped lang="less">
.page {
  padding-bottom: 140rpx;
  background-color: #141416;
  height: 100vh;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50rpx;
  display: flex;
  justify-content: space-around;

}

.footer .footer-item {
  width: 30%;
  line-height: 36px;
  height: 36px;
  text-align: center;
  color: #61ffff;
  background: rgba(26, 255, 232, 0.1);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid #1AFFE8;
  font-size: 12px;
}

.canvas {
  width: 360px;
  height: 580px;
  margin: 0 auto;
}

.btn {
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  text-align: center;
  height: 96rpx;
  line-height: 96rpx;
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 30rpx;
}
</style>