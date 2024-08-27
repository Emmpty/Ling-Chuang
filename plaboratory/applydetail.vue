<template>
  <view :class="cueTheme">

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="AI应用详情页"
    />

    <view class="page">
      <!-- 应用logo图 -->
      <view class="upload">
        <image
          class="upload-icon"
          :src="goodsInfo.image"
        ></image>
      </view>

      <view class="dressup">
        <view class="dressup-name">{{ goodsInfo.name }}</view>
        <button
          open-type="share"
          type="button"
          class="dressup-share"
        >
          <image src="https://img.drawai.cn/icon/share.png"></image>分享
        </button>
      </view>

      <view
        class="start dressup"
        :style="{ 'border-bottom': cueTheme == 'day-theme' ? '2rpx solid #F5F5F5' : '' }"
      >
        <view style="display: flex;line-height: 56rpx;">
          <image
            class="start-icon"
            src="../static/img/login/logo.png"
          ></image>
          <view class="start-name">灵创AI</view>
        </view>
        <button
          class="dressup-share"
          @click="llustrateStatus()"
        >
          <image src="https://img.drawai.cn/icon/share.png"></image>海报
        </button>
      </view>

      <view class="introduce">应用介绍：{{ goodsInfo.intro }}</view>
      <view class="introduce">
        说明：{{ goodsInfo.description }}
      </view>
      <!-- 配置标题、输入框 -->
      <block v-if="goodsInfo.input && goodsInfo.input.length > 0">
        <view
          class="apply"
          v-for="(item, index) in goodsInfo.input"
          :key="index"
        >
          <view class="apply-name">{{ item.title }}</view>
          <textarea
            class="apply-text"
            v-model="item.text"
            :placeholder="item.placeholder"
            maxlength="10000"
          ></textarea>
        </view>
      </block>

      <view
        class="apply"
        v-if="goodsInfo.upload == 1"
      >
        <view class="apply-name">上传参考图</view>
        <image
          class="apply-upload"
          :src="tempFilePaths[0]"
          v-if="tempFilePaths.length > 0"
        ></image>
        <view
          class="apply-upload"
          @click="uploadImage"
        >
          <image
            class="icon"
            src="https://img.drawai.cn/icon/Union%402x.png"
          ></image>
          <view :style="{ 'color': cueTheme == 'day-theme' ? '#C0C0C0' : '', }">上传图片</view>
        </view>
      </view>

      <view
        class="apply"
        v-if="goodsInfo.aspect && goodsInfo.aspect.length > 0"
      >
        <view class="apply-name">尺寸比例</view>
        <scroll-view scroll-x="true">
          <view class="scales">
            <block
              v-for="(item, index) in goodsInfo.aspect"
              :key="index"
            >
              <view
                :class="index == sizesIndex ? 'scales-item scales-active' : 'scales-item'"
                @click="modelsSize(index, item)"
              >
                <view
                  class="ratio"
                  v-if="item.name == '1:1'"
                  style="width:48rpx;height:48rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '2:3'"
                  style="width:36rpx;height:56rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '3:2'"
                  style="width:56rpx;height:36rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '3:4'"
                  style="width:46rpx;height:56rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '4:3'"
                  style="width:56rpx;height:46rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '9:16'"
                  style="width:32rpx;height:58rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '16:9'"
                  style="width:58rpx;height:32rpx;"
                ></view>
                <view
                  class="name"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
                > {{ item.name }}</view>
              </view>
            </block>
          </view>
        </scroll-view>
      </view>

      <button
        class="button"
        @click="savePoster()"
      >开始生成 <text v-if="userInfo.level == 0">（{{ goodsInfo.cost }}灵力）</text></button>

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
import datajosn from "../static/utils/datajosn";
import { appletDraw, } from '../static/api/index.js'

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
      infoImg: {},
      illustrates: false,
      customData: {},
      sizeList: [
        { name: '1:1' },
        { name: '2:3' },
        { name: '3:2' },
        { name: '3:4' },
        { name: '4:3' },
        { name: '9:16' },
        { name: '16:9' },],
      appletsList: [],
      goodsInfo: {},
      sizesIndex: 0,
      formData: {},
      tempFilePaths: [],
      attachment: 0,
    }
  },

  components: {

  },

  onLoad(res) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (res.prompt) { ///重做 数据回显
      datajosn.applets((data) => {
        data.map(item => {
          if (item.id == res.type) {
            this.goodsInfo = item
            this.spread[0].pic = item.image
            this.formData.applet = item.id
            this.goodsInfo.input[0].text = res.prompt
          }
        })
      })
    } else {
      datajosn.applets((data) => {
        let goods = data[res.type];
        this.goodsInfo = data[res.type];
        this.formData.applet = goods.id
        this.spread[0].pic = goods.image
      })
    }
  },

  methods: {

    uploadImage() {
      const that = this;
      uni.chooseImage({
        count: 1,
        success: (res) => {
          that.tempFilePaths = res.tempFilePaths
          let filePath = res.tempFilePaths[0]
          uni.request({
            url: 'https://app.drawai.cn/task/creative/attachment', // 正式环境
            // url: 'http://develop.drawai.cn:8888/task/creative/attachment', //测试环境
            method: 'POST',
            header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
            success: (res) => {
              let formData = res.data.result.post.formData;
              let url = res.data.result.post.url;
              let id = res.data.result.id;
              that.attachment = id;
              uni.uploadFile({
                url: url,
                filePath: filePath,
                name: 'file',
                method: 'POST',
                formData: formData,
                success: (res) => {
                },
                error(err) {
                },
              });
            },
          });
        }
      })
    },

    modelsSize(index, item) {
      this.sizesIndex = index;
    },

    // 开启创作
    savePoster() {
      let inputList = [];
      let data = {
        applet: this.goodsInfo.id,
        aspect: this.goodsInfo.aspect.length > 0 ? this.goodsInfo.aspect[this.sizesIndex].param : null,
        input: inputList,
      }
      if (this.goodsInfo.upload != 0) {
        data.attachment = this.attachment
      }
      this.goodsInfo.input.map(item => {
        if (item.text) {
          inputList.push(item.text)
        }
      })

      if (inputList.length != this.goodsInfo.input.length) { // 必填
        uni.showToast({
          title: '请输入关键词',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      if (this.goodsInfo.upload == 1 && this.tempFilePaths.length == 0) { // 必传
        uni.showToast({
          title: '请上传参考图',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      uni.showLoading({ title: '加载中' });
      appletDraw(data).then((res) => {
        if (res.code == 200) {
          uni.hideLoading()
          uni.redirectTo({
            url: '/phome/make?id=' + res.result.taskId + "&typeurl=创意"
          })
        } else {
          uni.hideLoading()
        }
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
          src: that.goodsInfo.image,
          success(res) {
            that.customData.ctx.drawImage(res.path, 0, 0, 326, 326,);
            that.customData.ctx.drawImage(mpUrl, 20, 340, 90, 90);
            that.customData.ctx.setFillStyle('#31312E');
            that.customData.ctx.setFontSize(20);
            that.drawText(that.goodsInfo.name, "normal bold 19px Arial", "#121212", 130, 370)
            that.drawText(that.goodsInfo.poster, "normal bold 13px Arial", "#A8A8A8", 130, 400)
            that.drawText('长按扫码立享尝新应用', "normal bold 13px Arial", "#A8A8A8", 130, 420)
            that.customData.ctx.draw();
            that.illustrates = false;
            uni.hideLoading();

            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: 'firstCanvas',
              success(res) {
                that.posterImage = [res.tempFilePath]
                /* #ifndef H5 */
                that.collectClick()
                /* #endif */
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
.introduce {
  font-size: 24rpx;
  font-weight: 500;
  color: #ACACAC;
  line-height: 32rpx;
  margin-bottom: 16rpx;
}

.apply {
  padding-bottom: 20rpx;
  clear: both;

  .apply-name {
    line-height: 80rpx;
    font-size: 30rpx;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: var(--text-color);
  }

  .apply-text {
    width: auto;
    height: 126rpx;
    background: var(--bg-color-2);
    border-radius: 8rpx 8rpx 8rpx 8rpx;
    padding: 10rpx 20rpx 20rpx 20rpx;
    font-size: 28rpx;
    color: var(--text-color);
  }

  .apply-upload {
    width: 152rpx;
    height: 152rpx;
    background: var(--bg-color-2);
    border-radius: 8rpx 8rpx 8rpx 8rpx;
    text-align: center;
    color: white;
    font-size: 16rpx;
    float: left;
    margin-right: 20rpx;

    .icon {
      width: 52rpx;
      height: 40rpx;
      margin-top: 40rpx;
      margin-bottom: 16rpx;
    }
  }
}

.scales {
  display: flex;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 26rpx;
}

.scales .scales-item {
  width: 120rpx;
  height: 120rpx;
  background: var(--bg-color-2);
  border-radius: 12rpx 12rpx 12rpx 12rpx;
  position: relative;
  margin: 12rpx;
  margin-top: 0;
}

.scales .scales-active {
  border: #00EBD3 2rpx solid;
}

.scales .scales-item .ratio {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-color-3);
  margin: 0 auto;
  border-radius: 4rpx 4rpx 4rpx 4rpx;
}

.scales .scales-item .name {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translate(-50%);

}


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
  height: 686rpx;
  border-radius: 32rpx;
  margin-bottom: 48rpx;
  z-index: 999;
  background-color: var(--bg-color-2);

  .upload-icon {
    width: 100%;
    height: 686rpx;
    border-radius: 32rpx;
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

.start {
  border-bottom: 2rpx solid var(--border-color-dividing);
  margin-bottom: 24rpx;

  .start-icon {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    border: 1px solid #ACACAC;
  }

  .start-name {
    font-size: 30rpx;
    color: var(--text-color);
    margin-left: 16rpx;
  }
}

.dressup {
  display: flex;
  justify-content: space-between;
  padding-bottom: 32rpx;
  // border-bottom: 2rpx solid #2B2B2D;

  .dressup-name {
    font-size: 44rpx;
    color: var(--text-color);
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
  background-color: var(--bg-color);
  width: auto;
  min-height: 100vh;
  padding: 32rpx 32rpx 240rpx;
}


.group_2 {
  overflow-y: auto;
}

.group_3 {
  padding: 18rpx 32rpx 0;
}

.group_4 {
  padding: 20rpx 0;
  width: 170rpx;
}


.font_1 {
  font-size: 28rpx;
  font-family: PingFangSC;
  line-height: 26rpx;
  color: #ffffff99;
}

.text_3 {
  color: #ffffff;
}

.image_6 {
  width: 176rpx;
  height: 64rpx;
}

.pos {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.group_5 {
  margin-top: 32rpx;
}

.text_5 {
  color: #ffffff;
  font-size: 36rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 33rpx;
}

.section_3 {
  padding: 24rpx 20rpx 24rpx 28rpx;
  border-radius: 44rpx;
  height: 68rpx;
  border: solid 4rpx #1affe8;
}

.image_7 {
  width: 32rpx;
  height: 32rpx;
}

.text_6 {
  color: #1affe8;
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 26rpx;
}

.font_2 {
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  line-height: 22rpx;
  color: #ffffffcc;
}

.text_7 {
  margin-top: 12rpx;
  color: #ffffff99;
  line-height: 23rpx;
}

.text-wrapper_2 {
  margin-top: 28rpx;
  // padding: 20rpx 0 20rpx;
  background-color: #ffffff14;
  border-radius: 32rpx;
  min-height: 240rpx !important;
  margin-bottom: 20rpx;
  padding: 20rpx
}

.text-wrapper_2 textarea {
  width: 100%;
}

.text_8 {
  // margin: 0 20rpx;
  width: 100% !important;
  color: #ffffffcc;
  font-size: 28rpx;
  line-height: 36rpx;
  min-height: 240rpx !important;
  max-height: 560rpx;
  word-break: break-all;
  white-space: pre-wrap;
  overflow: scroll;
  // padding-bottom: 10rpx;
}

.group_6 {
  padding: 24rpx 0 48rpx;
}

.section_4 {
  padding: 16rpx 24rpx;
  background-color: #ffffff14;
  border-radius: 36rpx;
  height: 64rpx;
  border: solid 2rpx #ffffff66;
}

.text_9 {
  color: #ffffff;
}

.section_5 {
  padding: 16rpx 24rpx;
  background-color: #00ebd3;
  border-radius: 32rpx;
  height: 64rpx;
}

.space-x-4>view:not(:first-child),
.space-x-4>text:not(:first-child),
.space-x-4>image:not(:first-child) {
  margin-left: 8rpx;
}

.text_10 {
  color: #141416;
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

.group_9 {
  margin-top: 28rpx;
  overflow: hidden;
}

.horiz-list {
  overflow-x: auto;
}

.space-x-12>view:not(:first-child),
.space-x-12>text:not(:first-child),
.space-x-12>image:not(:first-child) {
  margin-left: 24rpx;
}

.horiz-list-item {
  width: 192rpx;
}

.text-wrapper_4 {
  margin-left: 8rpx;
  padding: 8rpx 0;
  background-color: #7836ff;
  border-radius: 16rpx;
  box-shadow: 0px 6rpx 12rpx #7836ff4d;
  width: 72rpx;
}

.font_4 {
  font-size: 20rpx;
  font-family: Montserrat;
  line-height: 14rpx;
  font-weight: 700;
  color: #ffffff;
}

.text-wrapper_3 {
  margin-left: 8rpx;
  padding: 8rpx 0;
  background-color: #ff5d3b;
  border-radius: 16rpx;
  box-shadow: 0px 6rpx 12rpx #7836ff4d;
  width: 72rpx;
}

.view {
  margin-left: 10rpx;
}

.image_8 {
  border-radius: 24rpx;
  width: 192rpx;
  height: 192rpx;
}

.text_11 {
  line-height: 23rpx;
}

.text_12 {
  margin-top: 52rpx;
}

.horiz-list-item_2 {
  padding-bottom: 8rpx;
  width: 192rpx;
}

.section_10 {
  border-radius: 24rpx;
  height: 192rpx;
  border: solid 4rpx #1affe8;
}

.horiz-list-item_3 {
  padding-bottom: 8rpx;
}

.space-y-10>view:not(:first-child),
.space-y-10>text:not(:first-child),
.space-y-10>image:not(:first-child) {
  margin-top: 20rpx;
}

.text_13 {
  margin: 20rpx 22rpx 0 0rpx;
  display: flex;
  justify-content: space-between;
  width: auto;
  line-height: 70rpx;
}

.space-y-12>view:not(:first-child),
.space-y-12>text:not(:first-child),
.space-y-12>image:not(:first-child) {
  margin-top: 24rpx;
}

.image_9 {
  width: 64rpx;
  height: 64rpx;
}

.font_5 {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  /* line-height: 18rpx; */
  color: #ffffffcc;
  min-width: 120rpx;
  padding: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 70rpx;
  border: 1px solid #1affe8;

}

.text_14 {
  color: #000000;
  min-width: 120rpx;
  padding: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 70rpx;
  font-size: 14px;
  border: 1px solid #1affe8;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);

}

.image_10 {
  opacity: 0.5;
  width: 64rpx;
  height: 64rpx;
}

.button {
  position: fixed;
  bottom: 100rpx !important;
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

.text_15 {
  color: #000000;
  font-size: 36rpx;
  font-family: PingFangSC-Medium;
  line-height: 33rpx;
}


.space-y-6>view:not(:first-child),
.space-y-6>text:not(:first-child),
.space-y-6>image:not(:first-child) {
  margin-top: 12rpx;
}


.font_6 {
  font-size: 20rpx;
  font-family: PingFangSC;
  line-height: 18rpx;
  color: #ffffff;
}

.text_16 {
  color: #1affe8;
}

.group_10 {
  margin-left: 92rpx;
}

.image_11 {
  width: 48rpx;
  height: 48rpx;
}

.text_17 {
  line-height: 19rpx;
}

.group_11 {
  margin-left: 92rpx;
}

.space-y-4>view:not(:first-child),
.space-y-4>text:not(:first-child),
.space-y-4>image:not(:first-child) {
  margin-top: 8rpx;
}

.pos_2 {
  position: absolute;
  right: 0;
  top: 0;
}

.text_18 {
  line-height: 19rpx;
}</style>
