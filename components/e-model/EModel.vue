<template>
  <view
    v-if="showModel"
    class="model"
    :class="cueTheme"
  >
    <view class="model-body">
      <view class="title">
        {{ title }}
      </view>
      <!-- 插槽 -->
      <template v-if="$slots.content">
        <slot name="content" />
      </template>
      <!-- 默认 -->
      <template v-else>
        <view
          class="title-illust"
          :style="{ 'color': getTheme ? '#8A8A8A' : '' }"
        >
          {{ tips }}
        </view>
      </template>


      <view class="btns">
        <view
          class="btnsize"
          @click="cancelHandle()"
          :style="{ 'background': getTheme ? '#f5f5f5' : '' }"
        >
          {{ cancelText || '取消' }}
        </view>
        <view
          class="btnsize actice"
          @click="confirmHandle()"
        >
          {{ confirmText || '确定' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    showModel: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      default() {
        return '温馨提示'
      }
    },
    tips: {
      type: String,
      default() {
        return ''
      }
    },
    cancelText: {
      type: String,
      default() {
        return ''
      }
    },
    confirmText: {
      type: String,
      default() {
        return ''
      }
    },
  },
  computed: {
    getTheme() {
      return this.cueTheme == 'day-theme'
    }
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
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
.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;

  .model-body {
    width: 300px;
    min-height: 162px;
    background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
    border-radius: 11rpx;
    color: white;
    position: fixed;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30rpx;
    background: var(--bg-color-model-content);

    .title {
      color: var(--text-color);
      padding: 30rpx 0;
      font-size: 36rpx;
      text-align: center;
      position: relative;
      font-weight: bold;
    }

    .title-illust {
      font-size: 26rpx;
      text-align: left;
      line-height: 40rpx;
      padding: 0 20rpx;
    }

    .btns {
      display: flex;
      justify-content: space-around;
      margin: 50rpx 0 30rpx;

      .btnsize {
        width: 126px;
        height: 44px;
        line-height: 44px;
        color: var(--text-color);
        background: rgba(18, 18, 18, 0.04);
        border-radius: 70rpx;
        opacity: 1;
        margin: 0;
        border: 2rpx solid #E4E4E4;
        text-align: center;

        &.actice {
          background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
          border: none;
          color: #141416;
        }
      }
    }


  }
}
</style>
