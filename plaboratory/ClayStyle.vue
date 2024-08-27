<template>
  <view :style="{ background: cueTheme == 'day-theme' ? '#fff' : '#141416' }">
    <nav-bar :backState="1000" :homeState="1000" title="儿童节黏土风" />

    <view
      class="page"
      :style="{ background: cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="upload"
        @click="uploadImage()"
        :style="{ background: cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
      >
        <template v-if="!primaryUrl">
          <image
            class="upload-icon"
            src="https://img.drawai.cn/icon/Union%402x.png"
          ></image>
          <view class="upload-name">上传图片</view>
        </template>
        <image v-else mode="heightFix" class="upload-image" :src="primaryUrl">
        </image>
      </view>

      <view
        class="dressup"
        :style="{
          'border-bottom': cueTheme == 'day-theme' ? '2rpx solid #F5F5F5' : '',
        }"
      >
        <view
          class="dressup-name"
          :style="{ color: cueTheme == 'day-theme' ? '#121212' : '#fff' }"
        >
          儿童节黏土风
        </view>
        <view>
          <button open-type="share" type="button" class="dressup-share">
            <image src="https://img.drawai.cn/icon/share.png"></image>分享
          </button>
          <button class="dressup-share" @click="llustrateStatus()">
            <image src="https://img.drawai.cn/icon/share.png"></image>海报
          </button>
        </view>
      </view>
      <view class="flex-col">
        <text
          class="self-start font_3 text_13"
          :style="{ color: cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >偏好选择</text
        >
        <view
          class="flex-row self-start equal-division slider-box"
          style="width: 100%"
        >
          <u-slider
            v-model="weight"
            activeColor="#1affe8"
            inactiveColor="#c0c4cc"
            style="width: 100%; margin: 0 !important"
            step="0.1"
            min="0.1"
            max="2"
            @change="start"
          />
        </view>
        <view
          class="gender u-col-center"
          :style="{ color: cueTheme == 'day-theme' ? '#959595' : '#fff' }"
        >
          <view>更男性</view>
          <view class="weight">{{ weightFormat }}</view>
          <view>更女性</view>
        </view>
      </view>
      <button class="button" @click="savePoster()">{{btnText}}</button>
    </view>

    <sharePoster
      ref="sharePosterRef"
      title="儿童节黏土风"
      text="长按扫码立享免费作图"
      imgUrl="https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/nian-tu-poster1.png"
    ></sharePoster>
  </view>
</template>

<script>
import sharePoster from "@/components/sharePoster/index";
import { creativeDraw } from "@/static/api/index.js";

export default {
  data() {
    return {
      weight: 1,
      posterImage: [],
      llustrate: false,
      primaryUrl: "",
      imageWidth: 0,
      imageHeight: 0,
      infoImg: {},
      illustrates: false,
      customData: {},
    };
  },
  components: {
    sharePoster,
  },
  computed: {
    weightFormat() {
      return this.weight.toFixed(1);
    },
    btnText(){
      let userInfo = uni.getStorageSync('userInfo');
      if ((userInfo.vip || userInfo.anchor == 1)) {
        return '开始创作'
      } else {
        return '开始创作(5灵力)'
      }
    },
  },
  methods: {
    start() {
      // this.weight = this.weight.toFixed(1);
    },

    uploadImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          console.log("--------", res);
          this.primaryUrl = res.tempFilePaths[0];
          uni.getImageInfo({
            src: res.tempFilePaths[0],
            success: (image) => {
              this.imageWidth = image.width;
              this.imageHeight = image.height;
            },
          });
        },
      });
    },

    llustrateStatus() {
      this.$refs.sharePosterRef.llustrateStatus();
    },

    savePoster() {
      if (!this.primaryUrl) {
        return uni.showToast({
          title: "请先上传照片！",
          icon: "none",
          duration: 2000,
        });
      }
      uni.showLoading({ title: "加载中" });
      uni.request({
        url: "https://app.drawai.cn/task/creative/attachment",
        method: "POST",
        header: { Authorization: "Bearer " + uni.getStorageSync("token") },
        success: (res) => {
          const { result } = res.data;
          let formData = result.post.formData;
          let url = result.post.url;
          let id = result.id;
          uni.uploadFile({
            url: url,
            filePath: this.primaryUrl,
            name: "file",
            method: "POST",
            formData: formData,
            success: (res) => {
              const params = {
                template: 2,
                attachment: id,
                width: this.imageWidth,
                height: this.imageHeight,
                weight: +this.weightFormat,
              };
              creativeDraw(params)
                .then((res) => {
                  if (res.code == 200) {
                    uni.removeStorageSync("dressStatus");
                    uni.redirectTo({
                      url:
                        "/phome/make?id=" + res.result.taskId + "&typeurl=创意",
                    });
                  }
                })
                .catch((err) => {
                  console.error("err ", err);
                })
                .finally(() => {
                  uni.hideLoading();
                });
            },
            fail: (err) => {
              uni.hideLoading();
            },
            complete: (res) => {
              uni.hideLoading();
            },
            progress(res) {},
            error(err) {
              console.log(err, "666666666");
            },
          });
        },
        error(err) {},
      });
    },
  },

  onLoad(res) {
    let token = uni.getStorageSync("token");
    if (!token) {
      uni.navigateTo({
        url: "/plogin/logintype",
      });
    }
  },
  // #ifdef MP
  onShareAppMessage() {
    return {
      path: "/plaboratory/ClayStyle",
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  // #endif
};
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

  .upload-image {
    height: 100%;
  }

  .upload-name {
    color: #c0c0c0;
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
  top: -6rpx;

  .weight {
    width: 48rpx;
    height: 28rpx;
    text-align: center;
    line-height: 28rpx;
    color: #000000;
    background: #eeeeee;
    overflow: hidden;
    border-radius: 4rpx 4rpx 4rpx 4rpx;
  }
}

.dressup {
  display: flex;
  justify-content: space-between;
  padding-bottom: 32rpx;
  border-bottom: 2rpx solid #2b2b2d;

  .dressup-name {
    font-size: 44rpx;
    color: #ffffff;
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
    border: 2rpx solid #1affe8;
    color: #1affe8;
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

.space-y-26 > view:not(:first-child),
.space-y-26 > text:not(:first-child),
.space-y-26 > image:not(:first-child) {
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

.slider-box {
  /deep/ slider {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
