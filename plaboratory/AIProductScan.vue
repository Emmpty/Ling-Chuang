<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      :title="!cutoutImg ? '抠图中...' : '智能抠图'"
    />

    <view
      v-if="!cutoutImg"
      class="image-container u-flex u-col-center u-row-center"
    >

      <image
        class="product-image"
        :src="imageUrl"
        :style="'width: ' + imageStyle.width + 'px; height: ' + imageStyle.height + 'px;'"
      ></image>
      <image
        class="scanning-image"
        mode="widthFix"
        src="https://cdn.lingchuang.art/lingchuang-static/image/scan.png"
      ></image>
    </view>

    <view
      v-else
      class="image-container transparent-box u-flex u-col-center u-row-center"
    >
      <image
        class="cutout-image"
        :src="cutoutImg"
        mode="widthFix"
      ></image>

      <view>
        <button
          class="footer-btn"
          @click="saveCutoutImg()"
        >
          保存图片
        </button>
      </view>
    </view>
  </view>
</template>

<script>

import { process } from "@/static/api/draw.js";
// import { aiCopywriting, estimate } from "@/static/api/draw.js";
import sizeModel from "@/components/creation-board/sizeModel.vue";
import moveModel from "@/components/e-model/moveModel.vue"
import utils from "@/static/utils/utils";

export default {
  components: { sizeModel, moveModel },
  data() {
    return {
      imageUrl: '',
      cutoutImg: '',
      sysInfo: {},
      imageStyle: {},
      createId: '',
      showType: '',
    };
  },
  watch: {
  },
  computed: {
  },

  onShow() {

  },
  async onLoad(option) {
    if (option.image) {
      this.imageUrl = option.image
      this.createId = option.createId
      this.showType = option.showType
      let systemInfo = uni.getSystemInfoSync()
      let { windowWidth, windowHeight } = systemInfo
      this.imageStyle = await this.initImageStyle(this.imageUrl, windowWidth, windowHeight)
      this.timer = setInterval(() => {
        this.getProcess()
      }, 2000);
    }
  },
  methods: {
    async getProcess() {
      try {
        const { result } = await process({ id: this.createId })
        if (result.segment) {
          clearTimeout(this.timer)
          if (this.showType == 'cutout') {
            this.cutoutImg = result.segment
            return
          }
          uni.$emit('cropImg', {
            imageUrl: result.segment,
          })
          uni.navigateBack({
            delta: 1
          });
        }
      } catch (error) {
        clearTimeout(this.timer)
        console.error(error);
      }
    },
    initImageStyle(imageSrc, windowWidth, windowHeight) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: imageSrc,
          success: (image) => {
            let width = 0, height = 0;
            // 图片宽高比
            let imgRate = image.width / image.height
            let windowRate = windowWidth / (windowHeight)
            if (windowRate > imgRate) {
              height = windowHeight * 0.85;
              width = height * imgRate;
            } else {
              width = windowWidth * 0.85;
              height = width / imgRate;
            }
            resolve({ width, height })
            console.log(image, this.imageStyle)
          },
          fail: (err) => {
            reject(err)
            console.log("getImageInfo err: ", err);
          }
        });
      })
    },
    saveCutoutImg() {
      utils.downLoadImage(this.cutoutImg)
    },
  },
};
</script>


<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.image-container {
  width: 100%;
  /* 父元素宽度 */
  height: calc(100vh - 300rpx);
  /* 父元素高度，根据需要调整 */
  overflow: hidden;
  /* 隐藏超出部分 */
  position: relative;
  /* 为子元素定位提供参考 */
  padding: 32rpx;

  &.transparent-box {
    height: calc(100vh - 400rpx);
    background: url('/static/img/activity/Group 127@2x.png');
  }
}

.cutout-image {
  width: 90%;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* 按比例缩放图片，不裁剪 */
}

.scanning-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* 图片宽度完全填充容器 */
  animation: scan 2s infinite linear;
  /* 应用动画 */
}

@keyframes scan {

  0% {
    transform: translateY(-100%);
    /* 动画开始和结束时，图片在容器顶部 */
  }

  100% {
    transform: translateY(200%);
    /* 动画中间时，图片移动到容器底部 */
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
</style>
