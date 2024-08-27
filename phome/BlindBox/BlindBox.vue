<template>
  <view class="page-box">
    <nav-bar
      bgColor="transparent"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>

    <view class="page-content">
      <view class="mana">
        <view class="title">灵力</view>
        <view class="mana-num"> {{ userInfoData.point ? userInfoData.point / 10 : 0 }}</view>

      </view>
      <view
        class="rules u-flex u-col-center"
        @click="toRule()"
      >
        规则 ❯
      </view>

      <view class="mana-box u-flex u-col-center u-row-center">

        <image
          class="mana-swiper-img previous"
          mode="widthFix"
          src="https://cdn.lingchuang.art/lingchuang-static/mana-pool/mane-swiper-previous.png"
          @click="changeSwiperIndex(-1)"
        ></image>
        <image
          class="mana-swiper-img next"
          mode="widthFix"
          src="https://cdn.lingchuang.art/lingchuang-static/mana-pool/mane-swiper-next.png"
          @click="changeSwiperIndex(1)"
        ></image>

        <view class="swiper-box">
          <image
            class="mana-swiper-bg-img"
            mode="widthFix"
            src="https://cdn.lingchuang.art/lingchuang-static/mana-pool/mana-swiper-bg.png"
          ></image>

          <swiper
            class="swiper-content float-element"
            :circular="true"
            :autoplay="false"
            :current="currentSwiperIndex"
            duration="500"
            interval="180000"
            @change="changeSwiper"
            previous-margin="0rpx"
            next-margin="0rpx"
          >

            <swiper-item
              class="u-flex u-col-center u-row-center"
              v-for="(item, index) in swiperList"
              :key="index"
              @click="toDetails(item)"
            >
              <image
                class=""
                :src="item.cover"
                mode="widthFix"
              ></image>

            </swiper-item>
          </swiper>

        </view>
      </view>

    </view>
    <view class="footer-content">
      <swiper
        class="card-swiper"
        :circular="true"
        :autoplay="false"
        :current="currentSwiperIndex"
        duration="500"
        interval="180000"
        previous-margin="170rpx"
        next-margin="170rpx"
        @change="changeSwiper"
        style="margin-top: -180rpx;"
      >
        <swiper-item
          v-for="(item, index) in swiperList"
          :key="index"
          :class="currentSwiperIndex == index ? 'cur' : ''"
          @click="toDetails(item)"
        >
          <view class="tnphone-white-min swiper-item   ">
            <image
              class="current-bg"
              src="https://cdn.lingchuang.art/lingchuang-static/mana-pool/mana-swiper-current.png"
              mode="widthFix"
            ></image>
            <view class="item-img-box u-flex u-col-center u-row-center">
              <image
                class="item-img"
                :src="item.cover"
                mode="widthFix"
              ></image>
            </view>
            <view class="mana-info u-flex-col u-col-center">
              <view
                class="title"
                v-html="formatTitle(item.title)"
              ></view>
              <view
                v-if="currentSwiperIndex == index"
                class="tip"
              >详情></view>
              <!-- <view class="mana-text">{{ item.minimum }}灵力</view> -->
            </view>

          </view>
        </swiper-item>
      </swiper>
      <view class="btn-box u-flex u-row-center">
        <button
          class="btn"
          :disabled="activeEnded"
          @click="betManaBtnClick()"
        >{{ btnText }}</button>
      </view>
      <view
        class="history-text"
        @click="toHistory()"
      >投注记录</view>
    </view>

    <BetMana
      v-if="manaShow"
      :manaShow="manaShow"
      :detailData="currentItemData"
      :toDetail="true"
      @cancel="cancel()"
      @confirm="confirm()"
    ></BetMana>

  </view>
</template>

<script>
import { betpools, betWeight } from '@/static/api/lottery.js'
import { userInfo } from '@/static/api/index.js'
import BetMana from './components/betMana.vue';

export default {
  components: { BetMana },
  data() {
    return {
      swiperList: [],
      currentSwiperIndex: 0,
      manaShow: false,
      manaNum: '',
      userInfoData: {},
      resultData: {},
    };
  },
  watch: {
    currentSwiperIndex: {
      immediate: true,
      handler(newValue, oldValue) {
        this.getRewardResult()
      },
    },
  },
  computed: {
    currentItemData() {
      return this.swiperList[this.currentSwiperIndex] || {};
    },
    btnText() {
      if (this.resultData.status == 2) {
        if (this.resultData.amount > 0) {
          return '查看结果'
        } else {
          return '已结束'
        }
      }
      return '投注灵力'
    },
    activeEnded() {
      return this.btnText == '已结束'
    }
  },
  onLoad(opt) {
    // this.currentSwiperIndex = parseInt(this.swiperList.length / 2) + 1;  
    this.initData();
  },
  onPullDownRefresh() {

    this.initData(true);
    this.getUserInfo();
    this.getRewardResult()
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    getRewardResult() {
      uni.$u.debounce(() => {
        this.getBetWeight()
      }, 300)
    },
    async getBetWeight() {
      try {
        const res = await betWeight({ id: this.currentItemData.id })

        if (res.code == 200) {
          this.resultData = res.result
        }
      } catch (error) {

        console.error(error);
      }
    },
    async getUserInfo() {
      try {
        const res = await userInfo();
        if (res.code == 200) {
          this.userInfoData = res.result;
        }
      }
      catch (error) {

        console.error(error);
      }
    },
    async initData(refresh) {
      try {
        const res = await betpools();
        refresh && uni.stopPullDownRefresh();

        if (res.code == 200) {
          this.swiperList = res.result;
        }
      }
      catch (error) {
        refresh && uni.stopPullDownRefresh();

        console.error(error);
      }
    },
    clickSwiper(index) {
      console.log(index);
      this.currentSwiperIndex = index;
    },
    changeSwiper(e) {
      // 当前的激活索引
      const { current } = e.detail;
      this.currentSwiperIndex = current;
    },
    changeSwiperIndex(number) {
      if (number > 0) {
        if (this.currentSwiperIndex === this.swiperList.length - 1) {
          this.currentSwiperIndex = 0;
          return;
        }
      }
      else {
        if (this.currentSwiperIndex === 0) {
          this.currentSwiperIndex = this.swiperList.length - 1;
          return;
        }
      }
      this.currentSwiperIndex += number;
    },
    betManaBtnClick() {
      if (this.currentItemData.status == 1) {
        return this.manaShow = true;
      }
      this.toDetails(this.currentItemData)
    },
    cancel() {
      this.manaShow = false;
    },
    confirm() {
      this.manaShow = false;
    },
    toRule() {
      uni.navigateTo({
        url: '/phome/BlindBox/rule'
      });
    },
    toDetails(item) {
      console.log('------------item', item);
      uni.navigateTo({
        url: `/phome/BlindBox/detail?detailsData=${encodeURIComponent(JSON.stringify(item))}`
      });
    },
    toHistory() {
      uni.navigateTo({
        url: `/phome/BlindBox/history`
      });
    },
    formatTitle(title) {
      let centerIndex = parseInt(title.length / 2)
      if (centerIndex > 5) {
        return title.slice(0, centerIndex) + '<br\>' + title.slice(centerIndex)
      } else {
        return title
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.page-box {
  width: 100%;
  min-height: 100vh;
  background: url(https://cdn.lingchuang.art/lingchuang-static/mana-pool/mana-bg.png) no-repeat;
  background-size: 100% 100%;
  background-color: #C3D8FF;
  position: relative;
}

.page-content {
  position: relative;
  width: 100%;
  height: 100%;
  height: calc(100vh - 176rpx);
  color: #fff;

  .mana-box {
    width: 100%;
    padding: 32rpx;
    position: relative;
    z-index: 99;

    .swiper-box {
      width: 100%;
      height: 100%;
      position: relative;
      min-height: 700rpx;

      // background: url(https://cdn.lingchuang.art/lingchuang-static/mana-pool/mana-swiper-bg.png) no-repeat;
      // background-size: 100% 100%;
      .mana-swiper-bg-img {
        width: 100%;
      }
    }

    .swiper-content {
      width: calc(100% - 300rpx);
      height: 50%;
      position: absolute;
      left: 150rpx;
      bottom: 23%;

      swiper-item {
        width: 100% !important;
        box-sizing: border-box;
        overflow: initial;
      }
    }

    .mana-swiper-img {
      position: absolute;
      top: calc(50% - 32rpx);
      width: 64rpx;
      height: 64rpx;
      border-radius: 100%;
      z-index: 666;

      &.previous {
        left: 32rpx;
      }

      &.next {
        right: 32rpx;
      }
    }
  }

  .mana {
    top: 32rpx;
    position: absolute;
    left: 0;
    z-index: 555;
    background: linear-gradient(180deg, #60FDF8 0%, #2CFDB3 100%);
    padding: 10rpx 32rpx 10rpx 20rpx;
    color: #1A1A1A;
    font-size: 26rpx;
    border-radius: 0 16rpx 16rpx 0;

    .title {
      font-size: 20rpx;
      margin-bottom: 8rpx;
    }

    .mana-num {
      font-size: 28rpx;
      font-family: Bebas, Bebas;
      font-weight: bold;
      color: #1A1A1A;
    }
  }

  .rules {
    top: 32rpx;
    position: absolute;
    right: 0;
    z-index: 555;
    padding: 16rpx 20rpx 16rpx 32rpx;
    color: #1A1A1A;
    font-size: 26rpx;
    border-radius: 16rpx 0 0 16rpx;
    background: #FFFFFF;
  }

}

.footer-content {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 630rpx;
  border-radius: 32rpx 32rpx 0 0;
  background: #7171AE;
  padding-bottom: 32rpx;
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));

  .current-bg {
    position: absolute;
    width: 75%;
    left: calc(50% - 138rpx);
    top: 32rpx;
  }

  /* 轮播 start */
  /* .tnphone-white-min 细边框*/
  .tnphone-white-min {
    width: 380rpx;
    height: 550rpx;
    border-radius: 40rpx;
    padding: 7rpx;
    display: table;
    color: #fff;
    box-sizing: border-box;
    // box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 0, 0, 0.15);
    cursor: default;
    position: relative;

    .item-img-box {
      position: absolute;
      width: 65%;
      height: 240rpx;
      left: 18.5%;
      top: 58rpx;

      .item-img {
        width: 100%;
        height: 100%;
        max-height: 240rpx;
      }
    }



    .mana-info {
      position: absolute;
      width: 100%;
      top: 360rpx;
      // left: 17.5%;

      .title {
        font-size: 44rpx;
        text-align: center;
      }

      .tip {
        color: #29ffaf;
        font-size: 40rpx;
        margin-top: 16rpx;
        text-align: center;
      }

      .mana-text {
        font-size: 32rpx;
      }
    }

  }

  /* 轮播样机样式 start*/
  .card-swiper {
    position: absolute;
    top: 16rpx;
    left: 0;
    width: 100%;
    height: 550rpx !important;

    swiper-item {
      width: 260rpx !important;
      // left: 170rpx;
      // width: 380rpx !important;
      box-sizing: border-box;
      padding: 0rpx 15rpx 20rpx 15rpx;
      overflow: initial;

      .swiper-item {
        display: block;
        transform: scale(0.55);
        transition: all 0.2s ease-in 0s;
        overflow: hidden;
        transform-origin: bottom;
      }
    }

    swiper-item.cur .swiper-item {
      transform: scale(0.65);
      transition: all 0.2s ease-in 0s;
      transform-origin: bottom;
    }
  }


  .image-banner {
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 100%;
      height: 150rpx;
      // border: 1rpx solid red;
    }

  }

  .btn-box {
    width: 100%;
    position: absolute;
    top: 420rpx;

    .btn {
      width: 665rpx;
      height: 90rpx;
      line-height: 90rpx;
      background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
      border-radius: 50rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #1A1A1A;
    }
  }

  .history-text {
    position: absolute;
    top: 550rpx;
    width: 100%;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
  }

}

.float-element {
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(-30rpx);
  }

  50% {
    transform: translateY(10rpx);
  }

  100% {
    transform: translateY(-30rpx);
  }
}

/* CSS样式 */
@media screen and (min-width: 400px) {

  /* 当屏幕宽度大于400像素时应用的样式 */
  .page-content {

    height: calc(100vh - 170rpx);
  }
}
</style>
