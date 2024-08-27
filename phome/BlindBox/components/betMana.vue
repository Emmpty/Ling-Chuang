<template>
  <u-popup
    :show="manaShow"
    mode="center"
    border-radius="40"
    style="background-color: #7171AE;"
  >
    <view class="content-box u-flex-col">
      <view class="title">投注灵力</view>
      <view class="content">
        <view class="mana-num">灵力余额： {{ userInfoData.point ? userInfoData.point / 10 : 0 }}</view>
        <view class="input-box">
          <input
            v-model="manaNum"
            type="number"
            :placeholder="inputPlaceholder"
            placeholder-style="color:#959595;font-size:24rpx"
          />
        </view>
      </view>
      <view class="footer-box u-flex u-col-center u-row-between">
        <view
          class="btn"
          @click="cancel()"
        >取消</view>
        <view
          class="btn active"
          @click="confirm()"
        >确定</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { userInfo } from '@/static/api/index.js'
import { addBet } from '@/static/api/lottery.js'

export default {
  props: {
    manaShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    detailData: {
      type: Object,
      default() {
        return {}
      }
    },
    toDetail: {
      type: Boolean,
      default() {
        return false
      }
    },
  },

  computed: {
    inputPlaceholder() {
      return `请输入您要投注的灵力数量，单次最低${this.detailData.minimum}灵力`;
    },
  },

  watch: {

  },
  data() {
    return {
      manaNum: '',
      userInfoData: {},
    };
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },

    async confirm() {
      if (+this.manaNum < this.detailData.minimum) {
        return uni.showToast({
          title: `单次投注灵力最少${this.detailData.minimum}`,
          icon: "none",
          duration: 2000
        });
      }
      const data = { amount: +this.manaNum, poolId: this.detailData.id || this.detailData.poolId };
      console.log('>>>>>>>>>>>>>>', data);
      try {
        const res = await addBet(data);
        if (res.code == 200) {
          this.$emit('confirm', data)
          uni.showToast({ title: "投注成功", icon: "none" });
          if (this.toDetail) {
            setTimeout(() => {
              uni.navigateTo({
                url: `/phome/BlindBox/detail?detailsData=${JSON.stringify(this.detailData)}`
              });
            }, 1000);
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    },
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
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  width: 660rpx;
  border-radius: 16rpx;
  background-color: #7171AE;
  padding: 32rpx;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
  }

  .content {
    margin: 40rpx 0;

    .mana-num {
      font-size: 28rpx;
      font-weight: bold;
      color: #FFFFFF;
      margin-bottom: 20rpx;
    }

    .input-box {
      padding: 20rpx 16rpx;
      background-color: #65659D;
      border-radius: 8rpx;

      input {
        color: #fff;
        font-size: 24rpx;
      }
    }
  }

  .footer-box {
    font-weight: bold;

    .btn {
      flex: 1;
      height: 84rpx;
      line-height: 84rpx;
      text-align: center;
      color: #fff;
      border-radius: 40rpx;
      border: 2rpx solid #FFFFFF;

      &.active {
        color: #1A1A1A;
        border: 0;
        margin-left: 36rpx;
        background-image: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      }
    }
  }
}
</style>
