<template>
  <view
    class="page-box"
    :class="cueTheme"
  >
    <nav-bar
      bgColor="transparent"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>

    <view class="page-content">
      <view class="title">{{ detailsData.title }}</view>
      <view class="swiper-box  ">
        <SwiperCard
          :list="swiperList"
          :currentIndex="currentIndex"
          @swiperChange="swiperChange"
        ></SwiperCard>
      </view>

      <view class="probability-box u-flex u-col-center">
        <view class="probability-title">我的中奖概率</view>
        <view class="slider-box  u-flex-1">
          <u-line-progress
            :percentage="resultData.weight || 0"
            height="8"
            :showText="false"
            activeColor="#68F8D0"
            inactiveColor="#F5F5F5"
          ></u-line-progress>
        </view>
        <view class="slider-num"> {{ (resultData.weight || 0).toFixed(2) }}%</view>
      </view>

      <view class="detail-box">
        <view
          v-if="detailsData.activeTime"
          class="active-time u-flex u-col-center"
        >
          <view class="time-title">开奖时间</view>
          <view>：{{ $u.timeFormat(new Date(detailsData.activeTime), "yyyy-mm-dd") }}</view>

        </view>
        <view
          class="detail-content"
          v-html="detailsData.content"
        >
        </view>

      </view>

      <view class="footer-box">
        <view class="btn-box u-flex u-row-center">
          <button
            class="btn"
            :disabled="activeEnded"
            @click="queryResult()"
          >{{ btnText }}</button>
        </view>
        <view
          class="history-text"
          @click="toRank()"
        >投注榜单</view>
      </view>
    </view>

    <LotteryResult
      :showPopup="resultShow"
      :resultData="betItemData.reward ? { id: detailsData.id, ...resultData.reward } : null"
      @closeHandle="resultShow = false"
    ></LotteryResult>

    <BetMana
      v-if="manaShow"
      :manaShow="manaShow"
      :detailData="detailsData"
      @cancel="cancel()"
      @confirm="confirm()"
    ></BetMana>

  </view>
</template>

<script>
import SwiperCard from './components/swiperCard.vue';
import { betWeight } from '@/static/api/lottery.js'
import BetMana from './components/betMana.vue';

import LotteryResult from './components/lotteryResult.vue';

export default {
  components: { SwiperCard, BetMana, LotteryResult },
  data() {
    return {
      betWeight: 0,
      resultShow: true,
      manaShow: false,
      resultData: {},
      currentIndex: 0,
      detailsData: {},
      swiperList: [],
    };
  },
  watch: {

  },
  computed: {
    inputPlaceholder() {
      return '请输入您要投注的灵力数量，单次最低100灵力'
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
  onLoad(option) {
    if (option.detailsData) {
      console.log('>>>>>>>>>>>>>>option.detailsData', option.detailsData);
      this.detailsData = JSON.parse(decodeURIComponent(option.detailsData))
    }
    this.initData()
    this.getBetWeight()
  },
  onPullDownRefresh() {

    this.getBetWeight(true)
  },
  methods: {
    copyContent() {
      utils.copyText(this.resultData.reward.content)
      this.resultShow = false
    },
    async initData() {
      try {
        let list = this.detailsData.images.split(',').map((item) => {
          return {
            cover: item,
            zIndex: 0,
            mLeft: 0
          }
        })
        for (let i = 0; i < list.length; i++) {
          let centerIndex = parseInt(list.length / 2) + 1
          let differIndex = i - parseInt(list.length / 2)
          list[i].zIndex = centerIndex - Math.abs(differIndex)
          list[i].mLeft = differIndex
        }
        this.swiperList = list

      } catch (error) {
        console.error(error);
      }
    },
    async getBetWeight(refresh) {
      try {
        const res = await betWeight({ id: this.detailsData.id })
        refresh && uni.stopPullDownRefresh();

        if (res.code == 200) {
          this.resultData = res.result
          if (this.resultData.status == 2 && this.resultData.amount > 0) {
            // 已开奖
            this.resultShow = true;
          }
        }
      } catch (error) {

        refresh && uni.stopPullDownRefresh();
        console.error(error);
      }
    },
    queryResult() {
      if (this.resultData.status == 1) {
        // 未开奖
        this.manaShow = true
      } else {
        // 已开奖
        this.resultShow = true;
      }
    },
    swiperChange(index) {
      if (index > 0) {
        if (this.currentIndex === this.swiperList.length - 1) {
          this.currentIndex = 0
          return
        }
      } else {
        if (this.currentIndex === 0) {
          this.currentIndex = this.swiperList.length - 1
          return
        }
      }
      this.currentIndex = +this.currentIndex + +index
    },
    toRank() {
      uni.navigateTo({
        url: `/phome/BlindBox/rankingList?id=${this.detailsData.id}`
      });
    },
    cancel() {
      this.manaShow = false;
    },
    confirm() {
      this.manaShow = false;
      this.getBetWeight()
    },
  },

}
</script>

<style lang="scss" scoped>
.page-box {
  width: 100%;
  min-height: 100vh;
  background: url(https://cdn.lingchuang.art/lingchuang-static/mana-pool/mana-bg.png) no-repeat;
  background-size: 100% 100%;
  padding-bottom: calc(200rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
}

.page-content {
  position: relative;
  width: 100%;
  color: #fff;
  padding: 32rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 32rpx;
  text-align: center;
}

.swiper-box {
  width: 100%;
}


.probability-box {
  padding: 36rpx 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-top: 40rpx;

  .probability-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #1A1A1A;
    margin-right: 32rpx;
  }

  .slider-num {
    margin-left: 16rpx;
    font-size: 32rpx;
    color: #1A1A1A;
    font-weight: 400;
  }

  .slider-box {
    /deep/ slider {
      margin-left: 0;
    }
  }
}

.detail-box {
  margin: 36rpx 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #000000;

  .active-time {
    margin-bottom: 20rpx;

    .time-title {
      font-weight: bold;
    }
  }

  .detail-content {
    font-size: 28rpx;
    font-weight: 400;
    color: #000000;
    white-space: pre-wrap;
    line-height: 46rpx;
  }
}

.footer-box {
  position: fixed;
  left: 0;
  bottom: -2rpx;
  width: 100%;
  // height: 292rpx;
  border-radius: 60rpx 60rpx 0 0;
  background-color: #626294;
  padding: 40rpx;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));


  .btn-box {
    width: 100%;

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
    width: 100%;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
    margin-top: 32rpx;
  }
}
</style>
