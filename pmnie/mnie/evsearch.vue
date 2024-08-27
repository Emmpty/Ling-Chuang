<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="区块链证书查询"
    />

    <view class="search">
      <input
        class="search-input"
        type="text"
        v-model="id"
        placeholder="请输入保全号"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      />
      <view
        class="search-item"
        @click="getSearch"
      >查询</view>
    </view>

    <view class='canvas-box'>
      <canvas
        id='canvas'
        class='canvas'
        canvas-id="firstCanvas"
      ></canvas>
    </view>

  </view>
</template>
 
<script>
import { attestSearch, } from '../../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      id: '',
      card: {
        company: '',
        real_name: 0,
        head_img: 'https://cdn.drawai.cn/public/default.jpg'
      },
      wx_qrcode: 'https://cdn.drawai.cn/public/20230215-143951.jpg',  //小程序二维码
      customData: {
        ctx: null,
      },
    };
  },

  methods: {

    getSearch() {
      uni.showLoading({
        title: '查询中...',
        mask: true,
      })
      attestSearch({ id: this.id }).then(res => {
        if (res.code == 200) {
          this.id = '';
          this.drawPoster(res.result.attest)
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
        } else {
          this.id = '';
        }
      })
    },

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
              // 
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
.page {
  height: 100vh;
  padding-bottom: 140rpx;
  background-color: #141416;
}

.search {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx 10rpx;
  font-size: 12px;
}

.search-input {
  width: 263px;
  height: 40px;
  background: #262628;
  border-radius: 70px;
  opacity: 1;
  border: 1px solid #262628;
  color: #1AFFE8;
  padding-left: 20rpx;
}

.search-item {
  width: 84px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  background: rgba(26, 255, 232, 0.1);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid #1AFFE8;
  text-align: center;
  color: #1AFFE8;
}

.page {
  padding-bottom: 140rpx;
  background-color: #141416;
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