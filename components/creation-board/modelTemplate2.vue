<template>
  <!-- 横向滚动选择列表 -->
  <scroll-view
    :scroll-x="true"
    :scroll-left="scrollLeft"
    :scroll-with-animation="true"
    class="scroller"
  >
    <view class="u-flex-col">
      <view class="u-flex u-flex-nowrap u-col-center">
        <view
          v-for="(item, index) in list1"
          :key="index"
          @click="changeItem(item, index)"
          class="item-box u-flex-col u-col-center u-row-center"
          :class="{
            'active': currentIndex === item.id
          }"
        >
          <image
            class="item-img"
            :src="currentIndex === item.id ? (item.gif || item.image) : item.image"
            @error="loadError"
            mode="widthFix"
          ></image>
          <view class="item-name u-line-1">{{ item.title }}</view>
        </view>


      </view>
      <view
        class="u-flex u-flex-nowrap u-col-center"
        style="margin-top: 16rpx;"
      >
        <view
          v-for="(item, index) in list2"
          :key="index"
          @click="changeItem(item, index)"
          class="item-box u-flex u-col-center u-row-center"
          :class="{
            'active': currentIndex === item.id
          }"
        >
          <image
            class="item-img"
            :src="currentIndex === item.id ? (item.gif || item.image) : item.image"
            @error="loadError"
            mode="widthFix"
          ></image>
          <view class="item-name u-line-1">{{ item.title }}</view>
        </view>
      </view>

    </view>
  </scroll-view>
</template>

<script>

export default {
  props: {
    propList: {
      type: Array,
      default() {
        return []
      }
    },
    propIndex: {
      type: Number,
      default() {
        return -1
      }
    },
    selectOne: {
      type: Boolean,
      default() {
        return false
      }
    },
  },
  data() {
    return {
      scrollLeft: 0,
    };
  },
  watch: {
  },
  computed: {
    list() {
      return this.propList || []
    },
    list1() {
      let centerIndex = this.list.length / 2
      if (centerIndex > 4) {
        return this.list.slice(0, centerIndex)
      }
      return this.list.slice(0, 4)
    },
    list2() {
      let centerIndex = this.list.length / 2
      if (centerIndex > 4) {
        return this.list.slice(centerIndex)
      }
      return this.list.slice(4)
    },
    currentIndex() {
      return this.propIndex || 0
    },
  },
  mounted() {
  },
  methods: {
    changeItem(item, index) {
      // if (index > 2) {
      //   this.scrollLeft = (index - 1) * 95
      // } else {
      //   this.scrollLeft = 0
      // }
      if (this.currentIndex === item.id) {
        if (!this.selectOne) {
          this.$emit("changeItemHandle", { item: {}, index: -1 })
        }
      } else {
        this.$emit("changeItemHandle", { item, index })
      }
    },
    loadError(e) {
      console.error(e);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroller {
  touch-action: none;
  margin-top: 24rpx;

  .item-box {
    position: relative;
    width: 168rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx;
    border: var(--bg-color-2) 2rpx solid;

    &.active {
      border: #00EBD3 2rpx solid;
      // color: #00EBD3;
    }

    .item-img {
      will-change: transform;
      width: 100%;
      height: 100%;
      border-radius: 12rpx;
    }

    .item-name {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 42rpx;
      line-height: 42rpx;
      font-size: 24rpx;
      padding: 0 2rpx;
      color: white;
      border-radius: 0 0 12rpx 12rpx;
      background: rgba(0, 0, 0, 0.4);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .item-box+.item-box {
    margin-left: 20rpx;
  }
}
</style>
