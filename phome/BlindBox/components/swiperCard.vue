<template>
  <view
    v-if="swiperList && swiperList.length > 0"
    class="tower-swiper"
    @touchmove="TowerMove"
    @touchstart="TowerStart"
    @touchend="TowerEnd"
  >
    <view
      class="tower-item"
      :class="[
        { 'none': item.zIndex < centerIndex - 1 },
        { 'transparent-08': item.zIndex == centerIndex - 1 },
        { 'current-center': item.zIndex == centerIndex }
      ]"
      v-for="(item, index) in swiperList"
      :key="index"
      :style="[{ '--index': item.zIndex, '--left': item.mLeft }]"
      :data-direction="direction"
    >
      <view class="swiper-item u-flex u-col-center u-row-center">
        <image
          v-show="item.zIndex == centerIndex"
          class="item-img"
          :src="item.cover"
          mode="widthFix"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default() {
        return 0
      }
    },
  },
  computed: {

  },
  watch: {
    list: {
      deep: true,
      handler(newValue, oldValue) {
        // this.$nextTick(() => {

        // })
      },
    },
  },
  data() {
    return {
      cardCur: 0,
      centerIndex: 0,
      dotStyle: false,
      towerStartPoin: 0,
      direction: '',
      swiperList: [],
    };
  },
  mounted() {
    this.swiperList = this.list
    // this.swiperList = newValue;
    this.centerIndex = parseInt(this.swiperList.length / 2) + 1;
    let index = this.currentIndex - this.centerIndex + 1
    // 初始化towerSwiper 传已有的数组名即可
    this.init(index)
  },
  methods: {
    init(index) {
      // index > 0 ,当前索引在中心索引右边
      this.direction = index > 0 ? 'left' : 'right'
      // console.log('~~~~~~~~~~~~index', this.currentIndex, this.centerIndex - 1, index, this.direction, this.swiperList);
      let absIndex = Math.abs(index)
      for (let i = 0; i < absIndex; i++) {
        this.changeList()

      }

    },
    DotStyle(e) {
      this.dotStyle = e.detail.value
    },
    // cardSwiper
    cardSwiper(e) {
      this.cardCur = e.detail.current
    },
    // towerSwiper


    // towerSwiper触摸开始
    TowerStart(e) {
      this.towerStartPoin = e.touches[0].pageX
    },

    // towerSwiper计算方向
    TowerMove(e) {

    },

    // towerSwiper计算滚动
    TowerEnd(e) {
      let value = parseInt(e.changedTouches[0].pageX) - parseInt(this.towerStartPoin)
      if (value == 0) return
      this.direction = value > 0 ? 'right' : 'left'
      this.$emit('swiperChange', value > 0 ? -1 : 1)
      this.changeList()
    },
    changeList() {
      let list = this.swiperList;
      // console.log('----------this.direction', this.direction);
      if (this.direction == 'right') {
        let mLeft = list[0].mLeft;
        let zIndex = list[0].zIndex;
        for (let i = 1; i < this.swiperList.length; i++) {
          this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
          this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
        }
        this.swiperList[list.length - 1].mLeft = mLeft;
        this.swiperList[list.length - 1].zIndex = zIndex;
      } else {
        let mLeft = list[list.length - 1].mLeft;
        let zIndex = list[list.length - 1].zIndex;
        for (let i = this.swiperList.length - 1; i > 0; i--) {
          this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
          this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
        }
        this.swiperList[0].mLeft = mLeft;
        this.swiperList[0].zIndex = zIndex;
      }
      // this.direction = ""
      this.swiperList = this.swiperList
      // this.swiperList.map((item) => {
      //   console.log('>>>>>>>>>>>>>list', item.id, item.zIndex, item.mLeft);
      // })
      // console.log('-------------------------------------------------------');
    }
  },
};
</script>

<style lang="scss" scoped>
.tower-swiper {
  height: 620rpx;
  position: relative;
  max-width: 624rpx;
  overflow: hidden;
  margin-left: calc(50% - 312rpx);

  .tower-item {
    position: absolute;
    width: 468rpx;
    height: 600rpx;
    top: 0;
    bottom: 0;
    left: 50%;
    margin: auto;
    transition: all 0.2s ease-in 0s;
    opacity: 1;
    // transform: scale(calc((6 + var(--index)) / 10));
    // margin-left: calc(var(--left) * 100rpx - 240rpx);
    z-index: var(--index);


    &.none {
      opacity: 0;
    }

    &.current-center {
      transform: scale(1);
      margin-left: calc(var(--left) * 100rpx - 240rpx);
    }

    &.transparent-08 {
      opacity: 0.8;
      transform: scale(0.8);
      margin-left: calc(var(--left) * 120rpx - 240rpx);
    }

    .swiper-item {
      width: 100%;
      height: 100%;
      border-radius: 6rpx;
      overflow: hidden;
      background-color: #fff;
      border-radius: 32rpx;

      .item-img {
        max-width: 90%;
        max-height: 90%;
        border-radius: 32rpx;
      }
    }
  }
}
</style>
