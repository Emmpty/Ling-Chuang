<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="提现"
    />

    <view class="flex-col flex-auto group_3 space-y-16">
      <view class="flex-col section_3 space-y-14">
        <view class="flex-row items-baseline">
          <text class="font_2">{{ wallet.score }}</text>
          <text class="font_1 text_3">灵石</text>
        </view>
        <text class="self-start font_1 text_4">我的余额</text>
      </view>
      <view
        class="flex-col section_4"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view class="flex-col group_4">
          <text
            class="self-start text_5"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >提现金额</text>
          <view
            class="flex-row items-center section_5 space-x-8"
            :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
          >
            <!-- <text class="font_3 text_6">¥</text> -->
            <input
              type="number"
              v-model="money"
              class="font_3 text_7"
              placeholder="请输入提现灵石数量"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
          </view>
          <view
            style="color:white;margin:24rpx;font-size:28rpx;"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            (单次提现最低5000灵石，最高50000灵石，单日可多次申请)</view>
          <view
            style="color:white;font-size:28rpx;"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >5个工作日内到账微信零钱
          </view>
        </view>
        <view
          class="flex-col justify-start items-center button"
          @click="Withdrawal"
        >提现</view>
      </view>
    </view>
  </view>
</template>

<script>
import { userInfo, walletCash } from '../../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      wallet: {},
      money: '',
    };
  },

  onLoad() {
    this.getwalletInfo()
  },
  methods: {
    getwalletInfo() {
      userInfo().then(res => {
        if (res.code == 200) {
          this.wallet = { ...res.result };
        }
      })
    },
    // 提交
    Withdrawal() {
      //  #ifndef MP
      uni.showModal({
        title: '温馨提示',
        content: '请前往微信小程序申请提现',
        showCancel: true,
        success: (res) => {
        }
      })
      //  #endif 

      //  #ifdef MP
      if (this.money < 5000 || this.money <= 0) {
        uni.showToast({
          title: '提现灵石数量需要大于5000',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if (this.money > 50000) {
        uni.showToast({
          title: '提现灵石数量最多为50000,请重新输入！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      if (this.money > this.wallet.score) {
        uni.showToast({
          title: '您的灵石不足,请重新输入！',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      uni.showModal({
        title: '提示',
        content: '是否提现',
        success: (res) => {
          if (res.confirm) {
            let temp = {
              realName: '',
              accountName: "",
              amount: this.money,
              openid: uni.getStorageSync('openid'),
              appid: getApp().globalData.appid,
            }
            walletCash(temp).then(res => {
              if (res.code == 200) {
                uni.showToast({
                  title: '申请提现成功！',
                  icon: 'none',
                  duration: 3000
                });
                this.money = '';
                this.getwalletInfo()
              }
            })
          }
        }
      });
      //  #endif 

    }
  },


  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },

  onShareTimeline() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }
};
</script>

<style scoped lang="less">
.page {
  background-color: #141416;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .group_3 {
    padding-top: 32rpx;
    overflow-y: auto;

    .section_3 {
      margin: 0 32rpx;
      padding: 44rpx 48rpx 36rpx;
      background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
      border-radius: 32rpx;

      .font_1 {
        font-size: 24rpx;
        font-family: PingFangSC-Regular;
        color: #141416;
      }

      .text_3 {
        line-height: 20rpx;
        margin-left: 12rpx;
      }

      .text_4 {
        line-height: 22rpx;
      }
    }

    .space-y-14 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 28rpx;
      }
    }

    .section_4 {
      padding: 0 32rpx 458rpx;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/4711e93cc840339c59a55f71a8c3ca0f.png');
      background-position: 0% 0%;
      background-size: 750rpx 1218rpx;
      background-repeat: no-repeat;

      .group_4 {
        padding-top: 48rpx;

        .text_5 {
          color: #ffffff;
          font-size: 32rpx;
          font-family: PingFangSC-Medium;
          line-height: 30rpx;
        }

        .section_5 {
          margin-top: 40rpx;
          padding: 32rpx 32rpx 44rpx;
          background-color: #ffffff14;
          border-radius: 32rpx;

          .font_3 {
            font-size: 36rpx;
            font-family: PingFangSC-Regular;
          }

          .text_6 {
            color: #ffffff;
            line-height: 26rpx;
          }

          .text_7 {
            color: #ffffff99;
            line-height: 34rpx;
            width: 100%;
          }
        }

        .space-x-8 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-left: 16rpx;
          }

          .text-wrapper {
            flex: 1 1 218rpx;
            padding: 64rpx 0;
            background-color: #ffffff12;
            border-radius: 32rpx;
            height: 160rpx;

            .font_4 {
              font-size: 48rpx;
              font-family: Montserrat;
              line-height: 35rpx;
              font-weight: 700;
              color: #ffffff;
            }
          }

          .text-wrapper_2 {
            padding: 64rpx 0;
            flex: 1 1 218rpx;
            background-image: linear-gradient(180deg, #61ffff 0%, #29ffaf 100%);
            border-radius: 32rpx;
            height: 160rpx;
          }
        }

        .group_5 {
          padding: 32rpx 0 48rpx;
        }
      }

      .button {
        padding: 28rpx 0 36rpx;
        background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
        border-radius: 48rpx;
        box-shadow: 0px 16rpx 32rpx #00dbc533;
        margin-top: 80rpx;
        // .text_8 {
        //   color: #000000;
        //   font-size: 36rpx;
        //   font-family: PingFangSC;
        //   line-height: 33rpx;
        // }
      }
    }

    .font_2 {
      font-size: 48rpx;
      font-family: Montserrat;
      line-height: 35rpx;
      font-weight: 700;
      color: #141416;
    }
  }

  .space-y-16 {

    &>view:not(:first-child),
    &>text:not(:first-child),
    &>image:not(:first-child) {
      margin-top: 32rpx;
    }
  }
}
</style>