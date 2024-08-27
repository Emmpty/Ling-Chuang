<template>
  <view class="container-box u-flex u-col-center u-row-center">
    <view
      class="bg-box"
      :style="'width: ' + canvasWidth + 'px; height: ' + canvasHeight + 'px;'"
    >
      <canvasDrag
        v-show="showCanvas"
        class="canvas-box"
        ref="canvasRef"
        id="canvas-drag"
        canvasBGColor="rgba(255, 255, 255, 0)"
        :showDelete="false"
        :graph="imageInfo"
        :width="canvasWidth"
        :height="canvasHeight"
        :enableUndo="true"
      ></canvasDrag>
    </view>

    <cover-view
      v-show="showCanvas"
      class="re-upload-btn"
      @click="reUpload()"
    >重新上传</cover-view>
  </view>
</template>

<script>
import canvasDrag from "../canvas-drag/index";
import utils from "@/static/utils/utils";

export default {
  components: { canvasDrag },
  props: {
    ratio: {
      type: Number,
      default() {
        return 1
      }
    },
    sizeItem: {
      type: Object,
      default() {
        return {}
      }
    },
    segmentImg: {
      type: String,
      default() {
        return ''
      }
    },
    showCanvas: {
      type: Boolean,
      default() {
        return true
      }
    },
  },
  data() {
    return {
      imageInfo: {
        x: 0,
        y: 0,
        w: 150,
        h: 150,
        type: 'image',
        url: '',
        canvasWidth: 0,
        canvasHeight: 0,
      },
      canvasWidth: 0,
      canvasHeight: 0,
      containerWidth: 0,
      containerHeight: 0,
      containerRate: 1, // 容器宽高比
      segmentImgRate: 1,
    };
  },
  watch: {
    ratio: {
      handler(newValue, oldValue) {
        // this.$refs.canvasRef && this.$refs.canvasRef.clearCanvas()
        this.initCanvasStyle(newValue,)
      },
    },
    segmentImg: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        newValue && uni.showLoading()
        this.initImageStyle(newValue, this.imageInfo.w, this.imageInfo.h)
      },
    },

  },
  computed: {
  },
  async mounted() {
    let systemInfo = uni.getSystemInfoSync()
    let { windowWidth } = systemInfo
    this.canvasWidth = this.containerWidth = windowWidth
    this.canvasHeight = this.containerHeight = windowWidth
    // this.imageInfo.url = this.segmentImg
    // uni.downloadFile({
    //   url: this.segmentImg, //仅为示例，并非真实的资源
    //   success: (res) => {
    //     if (res.statusCode === 200) {
    //       console.log('下载成功11111111：' + res.tempFilePath);
    //       this.imageInfo.url = res.tempFilePath;
    //     }
    //   }
    // })
    // let imageStyle = await this.initImageStyle(this.segmentImg, 150, 150)
    // this.imageInfo.w = imageStyle.width
    // this.imageInfo.h = imageStyle.height
  },
  methods: {
    initCanvasStyle(imgRate) {
      if (!this.segmentImg) return
      if (this.containerRate > imgRate) {
        this.canvasHeight = this.containerHeight
        this.canvasWidth = this.canvasHeight * imgRate;
        this.imageInfo.w = this.canvasWidth / this.containerWidth * 150
        this.imageInfo.h = this.imageInfo.w / this.segmentImgRate
      } else {
        this.canvasWidth = this.containerWidth
        this.canvasHeight = this.canvasWidth / imgRate;
        this.imageInfo.h = this.canvasHeight / this.containerHeight * 150
        this.imageInfo.w = this.imageInfo.h * this.segmentImgRate
      }
      this.imageInfo.x = (this.canvasWidth - this.imageInfo.w) / 2
      this.imageInfo.y = (this.canvasHeight - this.imageInfo.h) / 2
      // this.initImageStyle(this.segmentImg, this.imageInfo.w, this.imageInfo.h)
      this.imageInfo.canvasWidth = this.sizeItem.canvasWidth
      this.imageInfo.canvasHeight = this.sizeItem.canvasHeight
      // console.error('1111', this.imageInfo);
    },
    initImageStyle(imageSrc, windowWidth, windowHeight) {
      // return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: imageSrc,
        success: (image) => {
          let width = 0, height = 0;
          this.imageInfo.url = image.path
          // 图片宽高比
          let imgRate = image.width / image.height
          this.segmentImgRate = imgRate
          let windowRate = windowWidth / (windowHeight)
          if (windowRate > imgRate) {
            height = windowHeight
            width = height * imgRate;
          } else {
            width = windowWidth
            height = width / imgRate;
          }
          this.imageInfo.w = width
          this.imageInfo.h = height
          // resolve({ width, height })
          this.initCanvasStyle(this.ratio)
          console.log('抠图信息', this.imageInfo)
        },
        fail: (err) => {
          // reject(err)
          console.log("getImageInfo err: ", err);
        }
        // });
      })
    },
    exportImage() {
      return new Promise((resolve, reject) => {
        try {
          const filePath = this.$refs.canvasRef && this.$refs.canvasRef.exportFun()
          resolve(filePath)
        } catch (error) {
          reject(error)
        }
      })
    },
    reUpload() {
      this.$refs.canvasRef && this.$refs.canvasRef.clearCanvas()
      this.$emit('reUpload')
    },
  },
};
</script>


<style lang="scss" scoped>
.container-box {
  position: relative;
  z-index: 44;
  width: 750rpx;
  height: 750rpx;

  .re-upload-btn {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    padding: 8rpx 20rpx;
    box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(255, 255, 255, 0.25);
    border-radius: 24rpx;
    background: rgba(20, 20, 22, 0.7);
    border: 1rpx solid #FFFFFF;
    font-size: 24rpx;

  }

  .bg-box {
    // background-position: 0 0, 8px 8px;
    // background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
    // background-image: conic-gradient(#eee 0 25%, transparent 0 50%, #eee 0 75%, transparent 0);
    // background-size: 16px 16px;
    background: url('/static/img/activity/Group 127@2x.png');
    transition: all 0.2s;
  }
}
</style>