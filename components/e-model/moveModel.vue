<template>
  <view
    class="model-box u-flex-col u-col-center"
    :class="{ cueTheme, 'touchend': isTouchEnd }"
    :style="{ transform: `translateY(${translateY}rpx)` }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- <view class="move-box u-flex u-row-center u-col-center">
      <view class="move-content"></view>
    </view> -->

    <view
      class="content-box"
      @touchmove="handleContentTouchMove"
    >
      <slot name="content" />
    </view>
  </view>
</template>

<script>

export default {
  props: {
    // translateY的最小值
    minY: {
      type: Number,
      default() {
        return 240
      }
    },
    // translateY的最大值
    maxY: {
      type: Number,
      default() {
        return 700
      }
    },
    value: {
      type: Number,
      default() {
        return 0
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        // this.$nextTick(() => {
        this.translateY = newValue
        this.maxY = newValue
        // })
      },
    },
  },
  computed: {
  },
  data() {
    return {
      isTouchEnd: false, // 是否滑动结束Flag
      movestyle: {},
      startY: 0, // 触摸开始时的Y坐标
      translateY: 700, // 元素的translateY值
      currentY: 0, // 当前的Y坐标（触摸移动时）
      touchStartTime: 0,
    };
  },
  mounted() {

  },
  methods: {
    handleTouchStart(event) {
      event.preventDefault()
      this.isTouchEnd = false
      // 记录触摸开始时的Y坐标
      this.startY = event.touches[0].clientY;
      this.currentY = this.translateY; // 初始化当前Y坐标为元素当前的translateY值
      this.touchStartTime = event.timeStamp;
    },

    handleTouchMove(event) {
      // event.preventDefault()
      // 计算触摸点移动的距离
      const touchY = event.touches[0].clientY;
      const deltaY = touchY - this.startY;

      // 根据移动的距离更新translateY值
      let newTranslateY = this.currentY + deltaY;

      // 应用最大和最小translateY值的限制
      if (newTranslateY < this.minY) {
        newTranslateY = this.minY;
      } else if (newTranslateY > this.maxY) {
        newTranslateY = this.maxY;
      }

      // 更新元素的translateY值
      this.translateY = newTranslateY;
    },
    handleContentTouchMove(event) {
      if (this.translateY == this.minY) {
        event.stopPropagation()
      }
    },
    handleTouchEnd(event) {
      this.isTouchEnd = true
      // 触摸结束时的处理，这里可以根据需要添加代码
      // 例如，可以在这里设置元素回弹到边界位置
      // 计算触摸结束时的速度
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchEndY - this.startY;
      const deltaTime = event.timeStamp - this.touchStartTime;

      // 速度 = 距离 / 时间 (px/ms)
      const velocity = deltaY / deltaTime;

      // 设定一个阈值，如果速度大于这个值，则认为是快速滑动
      const threshold = 0.5; // 你可以根据需要调整这个值

      if (Math.abs(velocity) > threshold) {
        // 根据滑动的方向和速度设置translateY的值
        this.translateY = velocity > 0 ? this.maxY : this.minY;
      } else {
        // 如果速度较慢，则根据当前的translateY值决定停靠位置
        if (Math.abs(this.translateY - this.minY) < Math.abs(this.translateY - this.maxY)) {
          this.translateY = this.minY;
        } else {
          this.translateY = this.maxY;
        }
      }
      this.$emit("overflowHandle", this.translateY)
    },
  },
};
</script>

<style lang="scss" scoped>
.model-box {
  position: fixed;
  bottom: 160rpx;
  left: 0;
  z-index: 55;
  width: 100%;
  height: calc(100vh - 200rpx);
  overflow-y: auto;
  background: #141416;
  border-radius: 40rpx 40rpx 0 0;
  color: var(--text-color);
  padding: 32rpx;
  // border-top: 2rpx solid #262626;

  &.touchend {
    transition-property: transform;
    transition-duration: .3s;
  }

  .move-box {
    height: 50rpx;
    width: 100%;

    .move-content {
      width: 100rpx;
      height: 12rpx;
      border-radius: 16rpx;
      background-color: var(--text-color);

    }
  }

  .content-box {
    width: 100%;
    height: calc(100vh - 400rpx);
    overflow-y: auto;
    background: var(--bg-color);
  }
}

// @media screen and (min-width: 400px) {

//   /* 当屏幕宽度大于400像素时应用的样式 */
//   .model-box {
//     bottom: calc(-50vh + 630rpx);
//   }
// }
</style>
