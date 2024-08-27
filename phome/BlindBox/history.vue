<template>
  <view
    class="page-box"
    :class="cueTheme"
  >
    <nav-bar
      title="投注记录"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>
    <view class="page-content">
      <u-sticky :bgColor="cueTheme == 'day-theme' ? '#fff' : '#141416'">
        <view style="height:10rpx"></view>
        <view class="u-flex u-col-center u-row-center">
          <u-tabs
            :list="navTabList"
            :current="navtabIndex"
            @change="tabChange"
            lineColor="#1affe8"
            :activeStyle="{
              color: '#1affe8',
              fontWeight: 'bold',
              fontSize: '28rpx',
              transform: 'scale(1.05)'
            }"
            :itemStyle="{
              width: '50%',
              height: '66rpx'
            }"
            :inactiveStyle="{
              color: cueTheme == 'day-theme' ? '#666666' : '#fff',
              fontSize: '28rpx',
              transform: 'scale(1)'
            }"
          ></u-tabs>
        </view>
      </u-sticky>

      <view class="list-box ">
        <view
          class="item-box u-flex u-row-between u-col-center"
          v-for="(item, index) in logList"
          :key="index"
        >
          <view class="item-info u-flex ">
            <view class="item-image-box u-flex u-row-between u-col-center">
              <image
                class="item-image"
                :src="item.pool.cover"
                mode="widthFix"
              ></image>
            </view>
            <view class="item-detail u-flex-col u-row-center">
              <view class="item-name"> {{ item.pool.title }}</view>
              <view class="item-mana"> 共投注灵力：{{ item.amount }}</view>
              <view
                class="item-time"
                v-if="item.pool.activeTime"
              >
                活动时间：{{ $u.timeFormat(new Date(item.pool.activeTime), "yyyy-mm-dd") }}
              </view>
            </view>
          </view>
          <button
            class="item-btn"
            @click="btnClick(item)"
          >{{ navtabIndex == 0 ? '投注灵力' : '查看结果' }}</button>
        </view>
      </view>
    </view>

    <!-- 中奖结果 -->
    <LotteryResult
      :showPopup="resultShow"
      :resultData="betItemData.reward ? { id: betItemData.id, ...betItemData.reward } : null"
      @closeHandle="resultShow = false"
    ></LotteryResult>
    <!-- 投注灵力 -->
    <BetMana
      v-if="manaShow"
      :manaShow="manaShow"
      :detailData="betItemData"
      @cancel="cancel()"
      @confirm="confirm()"
    ></BetMana>

  </view>
</template>

<script>
import { betLogs, betWeight } from '@/static/api/lottery.js'
import { userInfo } from '@/static/api/index.js'
import BetMana from './components/betMana.vue';
import LotteryResult from './components/lotteryResult.vue';

export default {
  components: { BetMana, LotteryResult },
  data() {
    return {
      navtabIndex: 0,
      navTabList: [{ name: "进行中", type: '1' }, { name: "已结束", type: '2' },],
      // 异步请求相关
      queryParam: {
        status: 1,
        pageNum: 1,
        pageSize: 10,
      },
      logList: [],
      noMoreData: false,
      manaShow: false,
      resultShow: false,
      manaNum: '',
      userInfoData: {},
      betItemData: {},
      total: 0,
    }
  },
  computed: {
    inputPlaceholder() {
      return `请输入您要投注的灵力数量，单次最低${this.betItemData.amount || 100}灵力`
    },

  },
  onLoad() {
    this.initData()
    this.getUserInfo()
  },
  onReachBottom() {
    if (this.logList.length < this.total) {
      this.initData(true)
    }
  },
  methods: {
    async getUserInfo() {
      try {
        const res = await userInfo()
        if (res.code == 200) {
          this.userInfoData = res.result
        }
      } catch (error) {
        console.error(error);
      }
    },
    tabChange({ index }) {
      this.navtabIndex = index
      this.queryParam.status = this.navTabList[index].type
      this.reset()
      this.initData()
    },
    // 数据初始化
    initData() {
      uni.$u.throttle(async () => {
        this.getList()
      }, 300)
    },
    //获取画册列表
    async getList() {
      try {
        uni.showLoading({ title: '加载中...', mask: true, })
        const { code, result } = await betLogs(this.queryParam)
        uni.hideLoading()
        if (code == 200) {
          let list = result.records;
          this.total = result.total
          this.logList = this.logList.concat(list)
        }
      } catch (error) {
        console.error(error);
        uni.hideLoading()
      }
    },
    async btnClick(item) {
      this.betItemData = item.pool
      if (this.navtabIndex == 0) {
        this.manaShow = true
      } else {
        try {
          const res = await betWeight({ id: this.betItemData.id })
          if (res.code == 200) {
            this.betItemData = { ...this.betItemData, ...res.result }
            this.resultShow = true
          }
        } catch (error) {
          console.error(error);
        }


      }
    },
    cancel() {
      this.manaShow = false
    },
    async confirm(data) {
      this.manaShow = false
      this.getUserInfo()

      let index = this.logList.findIndex((item) => item.pool.id == data.poolId)
      let itemData = this.logList[index]
      itemData.pool.amount += data.amount
      console.log('555555555', itemData);
      this.$set(this.logList, index, itemData)
    },
    reset() {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = 10
      this.total = 0
      this.logList = []
    },
  }
}
</script>


<style lang="scss" scoped>
.page-box {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
  padding-bottom: 40rpx;
}

.page-content {
  position: relative;
  width: 100%;
  color: #fff;

  .list-box {
    padding: 32rpx;

    .item-box {
      padding: 26rpx;
      background: #2C2F31;
      border-radius: 40rpx;

      .item-info {
        .item-image-box {
          width: 160rpx;
          height: 160rpx;
          border-radius: 16rpx;
          border: 1rpx solid rgba(255, 255, 255, 0.4);
          overflow: hidden;

          .item-image {
            width: 100%;
            height: 100%;
            border-radius: 16rpx;
          }
        }

        .item-detail {
          margin-left: 20rpx;
          font-size: 20rpx;
          color: rgba(255, 255, 255, 0.8);

          .item-name {
            font-size: 28rpx;
            font-weight: 600;
            color: #FFFFFF;
          }

          .item-mana {
            font-size: 20rpx;
            margin: 16rpx 0;
          }

          .item-time {
            font-size: 20rpx;
          }
        }
      }

      .item-btn {
        width: 168rpx;
        height: 68rpx;
        line-height: 68rpx;
        border-radius: 40rpx;
        text-align: center;
        font-size: 28rpx;
        font-weight: 600;
        color: #1A1A1A;
        background-image: linear-gradient(90deg, #60FDF8 0%, #2CFDB3 100%);
      }
    }

    .item-box+.item-box {
      margin-top: 16rpx;
    }
  }
}

/deep/ .u-tabs {
  width: 50%;
}
</style>
