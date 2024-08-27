<template>
  <view
    class="page-box"
    :class="cueTheme"
  >
    <nav-bar
      title="夺宝榜单"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>
    <view class="page-content">
      <view class="list-box ">
        <view
          class="item-box u-flex u-col-center"
          v-for="(item, index) in list"
          :key="index"
        >
          <view
            class="item-index"
            :style="{ color: index < 3 ? colorList[index] : 'rgba(255, 255, 255, 0.40)' }"
          >{{ index + 1 }}</view>
          <view class="item-info u-flex ">
            <view class="item-image-box">
              <image
                class="item-image"
                :src="item.avatar"
              ></image>
            </view>
            <view class="item-detail u-flex-col u-row-center">
              <view class="item-name"> {{ item.nickname }}</view>
              <view class="item-mana"> 共投注灵力：{{ item.amount }}</view>
            </view>
          </view>

        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { betRank } from '@/static/api/lottery.js'
export default {
  data() {
    return {
      colorList: ['#07E9D3', '#FA7F37', '#FFCE00'],
      // 异步请求相关
      queryParam: {
        id: ''
      },
      noMoreData: false,
      list: [],
    }
  },
  onLoad(option) {
    this.queryParam.id = option.id
    this.getList()
  },
  onPullDownRefresh() {
    uni.showLoading({
      title: '刷新中...',
      icon: 'none'
    });
    this.getList(true)
  },
  methods: {

    //获取画册列表
    async getList(refresh) {
      try {
        const { code, result } = await betRank(this.queryParam)
        setTimeout(() => {
          uni.hideLoading();
        }, 1400);
        refresh && uni.stopPullDownRefresh();
        if (code == 200) {
          this.list = result
        }
      } catch (error) {
        uni.hideLoading();
        refresh && uni.stopPullDownRefresh();
        console.error(error);
      }
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

      .item-index {
        font-size: 53rpx;
        font-family: Alimama ShuHeiTi, Alimama ShuHeiTi;
        font-weight: bold;
      }

      .item-info {
        .item-image-box {
          width: 120rpx;
          height: 120rpx;
          border-radius: 100%;
          border: 1rpx solid rgba(255, 255, 255, 0.4);
          overflow: hidden;
          margin: 0 20rpx 0 28rpx;

          .item-image {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }

        .item-detail {

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
