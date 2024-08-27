<template>
  <u-popup
    :show="showPopup"
    mode="center"
    border-radius="40"
    style="background-color: #7171AE;"
  >
    <view class="content-box u-flex-col u-col-center">
      <view class="result-title">{{ resultData ? '恭喜你中奖啦' : '很遗憾没中奖' }}</view>
      <view class="scroll-box u-flex-col u-col-center">
        <image
          class="result-img"
          :src="resultData && resultData.image || 'https://cdn.lingchuang.art/lingchuang-static/mana-pool/Capa%202%402x.png'"
          mode="widthFix"
        ></image>
        <view
          v-if="resultData.content"
          class="result-content"
        >
          {{ resultData.content }}
        </view>
      </view>
      <view class="btn-box u-flex u-col-center u-row-between">
        <view
          v-if="resultData.id == 8"
          class="btn active"
          @click="copyContent()"
        >复制链接</view>
        <view
          v-else
          class="btn active"
          @click="closeHandle()"
        >关闭</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import utils from "@/static/utils/utils";

export default {
  props: {
    showPopup: {
      type: Boolean,
      default() {
        return false
      }
    },
    resultData: {
      type: Object,
      default() {
        return null
      }
    },
  },

  computed: {

  },

  watch: {

  },
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {
    closeHandle() {
      this.$emit('closeHandle')
    },
    copyContent() {
      utils.copyText(this.resultData.content)
      this.$emit('closeHandle')
    },
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  width: 560rpx;
  // min-height: 580rpx;
  max-height: 680rpx;
  border-radius: 16rpx;
  background-color: #7171AE;
  padding: 32rpx;
  position: relative;

  .result-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #FFFFFF;

  }

  .scroll-box {
    width: 100%;
    max-height: 420rpx;
    overflow-y: auto;
    margin: 28rpx 0;

    .result-img {
      width: 260rpx;
    }

    .result-content {
      width: 100%;
      font-size: 28rpx;
      color: #FFFFFF;
      line-height: 40rpx;
      margin-top: 20rpx;
    }

  }

  .btn-box {
    font-weight: bold;
    width: 100%;
    // position: absolute;
    // left: 32rpx;
    // bottom: 32rpx;

    .btn {
      flex: 1;
      height: 84rpx;
      line-height: 84rpx;
      text-align: center;
      color: #fff;
      border-radius: 16rpx;
      border: 1rpx solid #FFFFFF;

      &.active {
        color: #1A1A1A;
        border: 0;
        background-image: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      }
    }
  }
}
</style>
