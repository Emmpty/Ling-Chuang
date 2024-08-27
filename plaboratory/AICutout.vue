<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="智能抠图"
    />

    <view class="padding-32">
      <view
        class="upload-box u-flex u-col-center u-row-center"
        @click="uploadImage()"
      >
        <view
          v-if="!imageUrl"
          class="upload-image-box u-flex u-flex-col u-col-center u-row-center"
        >
          <image
            class="upload-image"
            src="https://img.drawai.cn/icon/Union%402x.png"
            mode="widthFix"
          ></image>
          <view class="upload-text">上传图片</view>
        </view>
        <image
          v-else
          class="darw-image"
          :src="imageUrl"
          mode="heightFix"
        ></image>
      </view>
    </view>

    <view class="page-title border-bottom padding-32 u-flex u-row-between u-col-center">
      <view class="ai-title">智能抠图</view>
      <view class="u-flex  u-col-center">
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
    <view class="page-title u-flex-col u-row-between u-col-center">
      <view class="landscape-tips margin-box">会员免费，普通用户收取1灵力</view>
      <view class="landscape-tips">提示：上传图片时请选择原图</view>
    </view>

    <view>
      <button
        class="footer-btn"
        @click="beginCreation()"
      >
        开始生成
      </button>
    </view>

    <e-model
      :showModel="showImageTip"
      title="温馨提示"
      tips="当前图片像素过低，会影响图片输出质量，建议重新上传图片"
      cancelText="仍要制作"
      confirmText="重新上传"
      @cancelHandle="continueCreation()"
      @confirmHandle="selectImage()"
    ></e-model>

    <sharePoster
      ref="sharePosterRef"
      title="智能抠图"
      imgUrl="https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/cutout-poster.png"
    ></sharePoster>

  </view>
</template>
<script>
import { create } from "@/static/api/draw.js";
import utils from "@/static/utils/utils";
import sharePoster from "@/components/sharePoster/index";

export default {
  components: { sharePoster },
  data() {
    return {
      imageUrl: '',
      drawParam: {
        attachment: '',
      },
      filePath: '',
      needEstimate: 0,
      showImageTip: false,
      currentSizeIndex: 0,
      currentRatio: 1,
    };
  },
  watch: {
  },
  computed: {
  },

  onShow() {

  },
  onLoad() {

  },
  methods: {
    // 制作海报
    llustrateStatus() {
      this.$refs.sharePosterRef.llustrateStatus()
    },
    uploadImage() {
      this.selectImage()
    },
    selectImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          this.showImageTip = false
          this.filePath = res.tempFilePaths[0]
          // 判断图片像素是否大于50W
          const result = await utils.checkImage(this.filePath)
          if (result) {
            this.showImageTip = result
          } else {
            this.imageUrl = this.filePath
            console.log('----------this.imageUrl', this.imageUrl);
          }
        },
        fail: (err) => {
          console.log("chooseImage err: ", err);
        }
      })
    },
    continueCreation() {
      this.showImageTip = false
      this.imageUrl = this.filePath
    },
    async beginCreation() {
      if (!this.imageUrl) {
        return uni.showToast({ title: "请先上传参考图", icon: "none", platform: 2000 })
      }

      uni.showLoading()
      try {
        // 获取上传图片所需参数、上传地址
        const result = await utils.upLoadImage(this.imageUrl)
        this.drawParam.attachment = result.attachment
        const drawRes = await create(this.drawParam)
        uni.hideLoading()
        if (drawRes.code != 200) {
          this.showImageTip = false
          return
        }
        this.resetData()
        setTimeout(() => {
          uni.navigateTo({
            url: `/plaboratory/AIProductScan?image=${decodeURIComponent(this.imageUrl)}&createId=${drawRes.result.id}&showType=cutout`
          })
        }, 500);
      } catch (error) {
        uni.hideLoading()
        console.error('catch', error);
      }
    },
    resetData() {
      this.drawParam = {
        attachment: '',
      }
    },
    reUploadHandle() {
      this.imageUrl = ''
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
};
</script>

<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 100vh;

  // .page-item+.page-item {
  //   margin-top: 56rpx;
  // }
  .margin-box {
    margin-top: 136rpx;
  }

  .landscape-tips {
    font-size: 24rpx;
    font-weight: 500;
    color: #C5C5C5;
    margin-bottom: 16rpx;
  }

  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
  }

  .border-bottom {
    border-bottom: 2rpx solid #2B2B2D;
  }

  .upload-box {
    height: 384rpx;
    background-color: var(--bg-color-2);
    border-radius: 32rpx;

    .upload-image-box {
      .upload-image {
        width: 72rpx;
        height: 56rpx;
      }

      .upload-text {
        margin-top: 20rpx;
        color: var(--text-color);
        font-size: 24rpx;
      }
    }

    .darw-image {
      height: 100%;
    }

  }

  .footer-btn {
    position: fixed;
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
    bottom: 30rpx;
    bottom: calc(30rpx + constant(safe-area-inset-bottom));
    bottom: calc(30rpx + env(safe-area-inset-bottom));
  }

  .ai-title {
    font-size: 44rpx;
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

  .padding-32 {
    padding: 32rpx;
  }

  .content-box {
    padding-bottom: 140rpx;
  }
}
</style>