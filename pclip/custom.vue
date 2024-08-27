<template>
  <view
    class="page flex-center "
    :style="{ 'background': cueTheme == 'day-theme' ? '#F7F7F7' : '#141414', 'padding-top': '40rpx' }"
  >
    <view class="redraw">
      <view
        class="redraw-item"
        @click="selectWritingOption(3)"
        style="margin-right:80rpx;"
      >
        <image
          class="icon"
          src="/static/img/custom/icon1.png"
        ></image>
        <view class="name">回退</view>
      </view>
      <view
        :class="typeIndex == 2 ? 'redraw-item redraw-active' : 'redraw-item'"
        @click="updateShape(shapes[2].shape, 2)"
      >
        <image
          class="icon"
          src="/static/img/custom/icon3.png"
        ></image>
        <view class="name">框选</view>
      </view>
      <view
        :class="typeIndex == 0 ? 'redraw-item redraw-active' : 'redraw-item'"
        @click="updateShape(shapes[0].shape, 0)"
      >
        <image
          class="icon"
          src="/static/img/custom/icon2.png"
        ></image>
        <view class="name">画笔</view>
      </view>
      <view
        class="redraw-start"
        @click="savePicture()"
      >开始重绘</view>
    </view>

    <view
      v-if="writing"
      class="full-screen1"
    >
      <view class="h-75vh flex-column flex-center">
        <yl-graffiti
          ref="graffiti"
          canvas-id="myCanvas"
          :width="canvasStyle.w"
          :height="canvasStyle.h"
          :shape="curShape"
          :lineColor="lineColor"
          :lineWidth="lineSize"
          :bgImage="picture"
          :typeIndex="typeIndex"
          @stepChanged="stepChanged"
        >
        </yl-graffiti>
      </view>

    </view>
  </view>
</template>

<script>
import utils from '../static/utils/utils';

export default {
  data() {
    return {
      title: '局部重绘',
      picture: "",
      picture22: '',
      writing: false,
      swiperCurrent: -1,
      canvasStyle: {},
      optIndex: 0,
      options: [{
        label: "",
        icon: "cuicon-write"
      }, {
        label: "删除",
        icon: "cuicon-delete"
      }],
      shapes: [ //画笔形状
        { icon: "cuicon-write", shape: "curve", active: false },
        { icon: "cuicon-move", shape: "line", active: false },
        { icon: "cuicon-square", shape: "rect", active: true },
        { icon: "cuicon-square", shape: "hollow-rect", active: false },
        { icon: "cuicon-round", shape: "circle", active: false },
        { icon: "cuicon-round", shape: "hollow-circle", active: false }
      ],
      colors: [ //画笔颜色 
        { color: "#ffffff", active: true },
        // { color: "#1c9d02", active: false },
        // { color: "#000000", active: false },
        // { color: "#006ce6", active: false },
        // { color: "#efaa03", active: false }
      ],
      sizes: [ //画笔粗细
        { thickness: 20, active: true },
        // { thickness: 4, active: false },
        // { thickness: 6, active: false },
        // { thickness: 8, active: false },
        // { thickness: 10, active: false }
      ],
      stepInfo: {
        curStep: -1,
        len: 0
      },
      saving: false,
      systemInfo: null,
      goods: {},
      typeIndex: 2,
    }
  },

  onLoad(res) {
    this.goods = res
    this.systemInfo = uni.getSystemInfoSync();
    uni.getImageInfo({
      src: res.url,
      success: image => {
        console.log(image)
        this.canvasStyle = this.caclCanvasStyle(image.height, image.width);
        this.picture = image.path;
        this.writing = true;
      },
      fail: err => {
        console.log("getImageInfo err: ", err);
      }
    });
  },

  computed: {
    /**
     * 涂鸦操作项
     */
    writingOptions() {
      const {
        curStep,
        len
      } = this.stepInfo;
      return [{
        label: "涂鸦",
        icon: "cuicon-write",
        color: 'text-black'
      }, {
        label: "颜色",
        icon: "cuicon-radioboxfill",
        color: 'text-black'
      }, {
        label: "粗细",
        icon: "cuicon-radiobox",
        color: 'text-black'
      }, {
        label: "撤销",
        icon: "cuicon-repeal",
        color: curStep == -1 ? 'text-gray' : 'text-black'
      }, {
        label: "重做",
        icon: "cuicon-repeal transform-180",
        color: curStep == len - 1 ? 'text-gray' : 'text-black'
      }, {
        label: "清空",
        icon: "custom-icon-clear",
        color: curStep == -1 ? 'text-gray' : 'text-black'
      }]
    },

    /**
     * 当前形状
     */
    curShape() {
      return this.shapes.filter(shape => shape.active)[0].shape;
    },

    /**
     * 线条颜色
     */
    lineColor() {
      return this.colors.filter(color => color.active)[0].color;
    },

    /**
     * 线条粗细 
     */
    lineSize() {
      return this.sizes.filter(size => size.active)[0].thickness;
    },
  },

  methods: {

    /**
     * 计算高
     * @param {Object} imgHeight
     * @param {Object} imgWidth
     */
    caclCanvasStyle(imgHeight, imgWidth) {
      let width = 0, height = 0;
      let { windowWidth, windowHeight } = this.systemInfo
      // 图片宽高比
      let imgScale = imgWidth / imgHeight
      let windowScale = windowWidth / windowHeight
      if (imgScale > windowScale) {
        width = windowWidth
        height = width / imgScale
        let maxImgHeight = windowHeight * 0.75
        if (height > maxImgHeight) {
          height = maxImgHeight
          width = height * imgScale
        }
      } else {
        height = windowHeight * 0.75
        width = height * imgScale
      }
      // if (imgWidth >= imgHeight) {
      //   if (this.systemInfo.windowWidth <= imgWidth) {
      //     width = this.systemInfo.windowWidth;
      //     height = (this.systemInfo.windowWidth / imgWidth) * imgHeight;
      //   } else {
      //     width = imgWidth;
      //     height = imgHeight;
      //   }
      // } else {
      //   if (this.systemInfo.windowHeight * 0.7 <= imgHeight) {
      //     height = this.systemInfo.windowHeight * 0.7;
      //     width = (this.systemInfo.windowHeight * 0.7 / imgHeight) * imgWidth;
      //     if (this.systemInfo.windowWidth <= width) {
      //       width = this.systemInfo.windowWidth * 0.8;
      //       height = (this.systemInfo.windowWidth * 0.8 / width) * height;
      //     }
      //   } else {
      //     width = imgWidth;
      //     height = imgHeight;
      //   }
      // }

      return {
        width: width.toFixed(0) + "px",
        height: height.toFixed(0) + "px",
        w: parseInt(width.toFixed(0)),
        h: parseInt(height.toFixed(0)),
        style: `width:${width.toFixed(0)}px;height:${height.toFixed(0)}px;`
      }
    },

    /**
     * 图片操作
     * @param {Object} index
     */
    selectOption(index) {
      switch (index) {
        case 0:
          this.writing = true;
          break;
        case 1:
          this.picture = "";
          break;
        default:
          break;
      }
    },

    /**
     * 选择涂鸦的类型
     * @param {Object} index
     */
    selectWritingOption(index) {
      switch (index) {
        case 0:
        case 1:
        case 2:
          this.optIndex = index;
          break;
        case 3:
          this.$refs.graffiti.repeal();
          break;
        case 4:
          this.$refs.graffiti.redo();
          break;
        case 5:
          this.$refs.graffiti.clearBoard();
          break;
        default:
          break;
      }
    },

    /**
     * 当前位置变化
     * @param {Object} e
     */
    stepChanged(e) {
      this.stepInfo = e;
    },

    /**
     * 更新线条形状
     * @param {Object} shape
     * @param {Object} index
     */
    updateShape(shape, index) {
      this.typeIndex = index;
      this.selectWritingOption(5)
      this.shapes.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 更新线条颜色
     * @param {Object} color
     * @param {Object} index
     */
    updateColor(color, index) {
      this.colors.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 更新线条尺寸
     * @param {Object} size
     * @param {Object} index
     */
    updateSize(size, index) {
      this.sizes.forEach((item, idx) => item.active = idx == index);
    },

    /**
     * 保存涂鸦
     */
    savePicture() {
      uni.showLoading();
      this.$refs.graffiti.saveCanvas().then(res => {
        uni.hideLoading();
        uni.uploadFile({
          method: 'POST',
          header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
          url: this.$baseURL + '/task/inpait/' + this.goods.id,
          filePath: res,
          formData: {},
          name: 'file',
          success: (res) => {
            let data = JSON.parse(res.data);
            uni.hideLoading()
            if (data.code == 200) {
              uni.redirectTo({
                url: '/phome/make?id=' + data.result.id
              })
            } else {
              uni.showToast({
                title: data.message,
                icon: 'none',
                duration: 4000
              })
            }
          },
        });
      });
    }
  }
}
</script>

<style  lang="scss">
.page {
  min-height: 100vh;
}

.full-screen {
  width: 100vw !important;
  height: 100vh !important;
}

.flex-center {
  justify-content: center !important;
  align-items: center !important;
}

.redraw {
  display: flex;
  padding: 0 20rpx 40rpx;
  position: relative;
  width: 100%;
}

.redraw .redraw-item {
  background: #353535;
  width: 92rpx;
  height: 92rpx;
  text-align: center;
  border-radius: 50%;
  margin-right: 20rpx;

  .icon {
    width: 30rpx;
    height: 30rpx;
    margin-top: 18rpx;
  }

  .name {
    font-size: 20rpx;
    color: white;
  }
}

.redraw .redraw-active {
  border: 2rpx solid #5DFFF9;
}

.redraw .redraw-start {
  width: 248rpx;
  height: 92rpx;
  text-align: center;
  line-height: 92rpx;
  background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  position: absolute;
  top: 0;
  right: 20rpx;
}

.create {
  color: #141416;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 58rpx;
  width: 85%;
  margin: 0 auto;
  font-size: 36rpx;
  font-weight: 500;
  line-height: 100rpx;
  height: 100rpx;
  text-align: center;
  justify-content: center;
}
</style>
