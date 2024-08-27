<template>
  <view class="conbox">

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="抽奖"
      bgColor="transparent"
    />

    <view class="container">
      <view class="option">
        <view class="option-item">银币次数：{{ userInfo.silver || 0 }}</view>
        <view class="option-item">金币次数：{{ userInfo.golden || 0 }}</view>
        <view
          class="option-item"
          @click="myPrize()"
        >我的奖品>></view>
      </view>

      <view class="turntable">
        <view
          :class="turnIndex == 1 ? 'turntable-item turntable-active' : 'turntable-item'"
          @click="turnClick(1)"
        >银币转盘</view>
        <view
          :class="turnIndex == 2 ? 'turntable-item turntable-active' : 'turntable-item'"
          @click="turnClick(2)"
        >金币转盘 <view
            v-if="turnIndex != 2"
            class="fiery"
          >火热</view>
        </view>
      </view>

      <view
        class="main"
        style="padding-top: 50rpx;"
      >
        <view
          class="canvas-container"
          v-if="turnIndex == 1"
        >
          <image
            class="canvas-back"
            src="https://img.drawai.cn/icon/lottery/lottery_back1.png"
            :animation="animationData"
          ></image>

          <view
            :animation="animationData"
            class="canvas-content"
            id="zhuanpano"
            style=""
          >
            <view class="canvas-line">
              <view
                class="canvas-litem"
                v-for="(item, index) in list"
                :key="index"
                :style="{ transform: 'rotate(' + (index * width + width / 2) + 'deg)' }"
              >
              </view>
            </view>
            <view class="canvas-list">
              <view
                class="canvas-item"
                :style="{ transform: 'rotate(' + (index * width) + 'deg)', zIndex: index, }"
                v-for="(iteml, index) in list"
                :key="index"
              >
                <view
                  class="canvas-item-text"
                  :style="'transform:rotate(' + (index) + ')'"
                >
                  <text class="b"> {{ iteml.value }}</text>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'month'"
                    src="https://img.drawai.cn/icon/lottery/icon1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'season'"
                    src="https://img.drawai.cn/icon/lottery/icon2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'year'"
                    src="https://img.drawai.cn/icon/lottery/icon3.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p10'"
                    src="https://img.drawai.cn/icon/lottery/power1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p50'"
                    src="https://img.drawai.cn/icon/lottery/power2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p100'"
                    src="https://img.drawai.cn/icon/lottery/power3.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p200'"
                    src="https://img.drawai.cn/icon/lottery/power4.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p500'"
                    src="https://img.drawai.cn/icon/lottery/power5.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p1000'"
                    src="https://img.drawai.cn/icon/lottery/power5.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p3000'"
                    src="https://img.drawai.cn/icon/lottery/power5.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'trail'"
                    src="https://img.drawai.cn/icon/lottery/vip1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'vip'"
                    src="https://img.drawai.cn/icon/lottery/vip2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'a1'"
                    src="https://img.drawai.cn/icon/lottery/evidence1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'a10'"
                    src="https://img.drawai.cn/icon/lottery/evidence2.png"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
          <image
            class="canvas-btn"
            src="https://img.drawai.cn/icon/lottery_button2.png"
            @click="playReward(false)"
          ></image>
        </view>

        <view
          class="canvas-container"
          v-if="turnIndex == 2"
        >
          <image
            class="canvas-back2"
            v-if="turnIndex == 2"
            src="https://img.drawai.cn/icon/lottery/lottery_back2.png"
            :animation="animationData2"
          ></image>
          <view
            :animation="animationData2"
            class="canvas-content"
            id="zhuanpano"
            style=""
          >
            <view class="canvas-line">
              <view
                class="canvas-litem"
                v-for="(item, index) in list"
                :key="index"
                :style="{ transform: 'rotate(' + (index * width + width / 2) + 'deg)' }"
              >
              </view>
            </view>
            <view class="canvas-list">
              <view
                class="canvas-item"
                :style="{ transform: 'rotate(' + (index * width) + 'deg)', zIndex: index, }"
                v-for="(iteml, index) in list"
                :key="index"
              >
                <view
                  class="canvas-item-text"
                  :style="'transform:rotate(' + (index) + ')'"
                >
                  <text class="b"> {{ iteml.value }}</text>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'month'"
                    src="https://img.drawai.cn/icon/lottery/icon1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'season'"
                    src="https://img.drawai.cn/icon/lottery/icon2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'year'"
                    src="https://img.drawai.cn/icon/lottery/icon3.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p10'"
                    src="https://img.drawai.cn/icon/lottery/power1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p50'"
                    src="https://img.drawai.cn/icon/lottery/power2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p100'"
                    src="https://img.drawai.cn/icon/lottery/power3.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p200'"
                    src="https://img.drawai.cn/icon/lottery/power4.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p500'"
                    src="https://img.drawai.cn/icon/lottery/power5.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p1000'"
                    src="https://img.drawai.cn/icon/lottery/power6.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'p3000'"
                    src="https://img.drawai.cn/icon/lottery/power7.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'trail'"
                    src="https://img.drawai.cn/icon/lottery/vip1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'vip'"
                    src="https://img.drawai.cn/icon/lottery/vip2.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'a1'"
                    src="https://img.drawai.cn/icon/lottery/evidence1.png"
                  >
                  </image>
                  <image
                    class="evidence"
                    v-if="iteml.key == 'a10'"
                    src="https://img.drawai.cn/icon/lottery/evidence2.png"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
          <image
            class="canvas-btn"
            src="https://img.drawai.cn/icon/lottery_button2.png"
            @click="playReward(false)"
          ></image>
        </view>
      </view>

      <view class="turntab">
        <image
          class="turntab-item"
          src="https://img.drawai.cn/icon/smoke1.png"
          @click="playReward(false)"
        ></image>
        <image
          class="turntab-item"
          src="https://img.drawai.cn/icon/smoke2.png"
          @click="playReward(true)"
        ></image>
      </view>

      <!-- 规则 -->
      <view
        class="guize"
        style="margin-top:60rpx;"
      >
        <view class="title">
          活动说明
        </view>
        <view class="g_item">
          1.用户每天登录即送2个银币，且仅限当日有效（2次银币抽奖机会）
        </view>
        <view class="g_item">
          2.邀请新用户注册即送3个银币（3次银币抽奖机会）
        </view>
        <view class="g_item">
          3.活动期间内有效月卡会员即送5个金币（5次金币抽奖机会）
        </view>
        <view class="g_item">
          4.活动期间内有效季卡会员即送15个金币（15次金币抽奖机会）
        </view>
        <view class="g_item">
          5.活动期间内有效年卡会员即送40个金币（40次金币抽奖机会）
        </view>
        <view class="g_item">
          6.活动时间（10月27日~11月5日），过期后未使用的银/金币到期自动清零
        </view>
      </view>
    </view>

    <u-popup
      :show="illustrates"
      mode="center"
      @close="illustrates = false"
      border-radius="40"
    >
      <view class="speak">
        <block
          v-for="(iteml, index) in lotteryList"
          :key="index"
        >
          <view class="speak-list">
            <view>
              <image
                class="evidence"
                v-if="iteml.key == 'month'"
                src="https://img.drawai.cn/icon/lottery/icon1.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'season'"
                src="https://img.drawai.cn/icon/lottery/icon2.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'year'"
                src="https://img.drawai.cn/icon/lottery/icon3.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p10'"
                src="https://img.drawai.cn/icon/lottery/power1.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p50'"
                src="https://img.drawai.cn/icon/lottery/power2.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p100'"
                src="https://img.drawai.cn/icon/lottery/power3.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p200'"
                src="https://img.drawai.cn/icon/lottery/power4.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p500'"
                src="https://img.drawai.cn/icon/lottery/power5.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p1000'"
                src="https://img.drawai.cn/icon/lottery/power6.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'p3000'"
                src="https://img.drawai.cn/icon/lottery/power7.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'trail'"
                src="https://img.drawai.cn/icon/lottery/vip1.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'vip'"
                src="https://img.drawai.cn/icon/lottery/vip2.png"
              ></image>
              <image
                class="evidence"
                v-if="iteml.key == 'a1'"
                src="https://img.drawai.cn/icon/lottery/evidence1.png"
              >
              </image>
              <image
                class="evidence"
                v-if="iteml.key == 'a10'"
                src="https://img.drawai.cn/icon/lottery/evidence2.png"
              >
              </image>
            </view>
            <view>{{ iteml.label }}</view>
          </view>
        </block>
        <view
          class="btnbox"
          style="display: flex;"
        >
          <button
            class="button"
            @click="illustrates = false"
          >关闭</button>
          <button
            class="button"
            @click="playReward(true)"
          >再抽十次</button>
        </view>
      </view>
    </u-popup>

    <view
      class="model"
      v-if="collecStatus"
    ></view>
    <view
      class="popup"
      v-if="collecStatus"
    >
      <view class="popup-title">温馨提示</view>
      <view class="popup-center">您的银币抽奖次数已不足！</view>
      <view class="popup-btn">
        <button
          class="li"
          @click="collecStatus = false"
        >取消</button>
        <button
          class="li active"
          open-type="share"
          @click="collecStatus = false"
        >获取银币</button>
      </view>
    </view>

  </view>
</template>

<script>
import { walletInfo, walletTurn } from '../../static/api/lottery.js'
export default {
  components: {
  },
  data() {
    return {
      list: [],
      width: 0,
      animationData: {},
      btnDisabled: '',

      animationData2: {},
      btnDisabled2: '',
      turnIndex: 1,
      userInfo: {},
      awardsInfo: {},
      illustrates: false,
      lotteryList: [],
      collecStatus: false,
    }
  },
  onLoad: function () {
    uni.request({
      url: 'https://cdn.drawai.cn/public/wheels.json',
      method: 'GET',
      success: ({ data, statusCode }) => {
        this.awardsInfo = data
        this.list = data.silver
        this.width = 360 / data.silver.length
      },
    });
    this.getUserinfo()
  },
  methods: {

    getUserinfo() {
      walletInfo({}).then(res => {
        if (res.code == 200) {
          this.userInfo = res.result
        }
      })
    },

    myPrize() {
      uni.navigateTo({
        url: "/phome/lottery/record",
      })
    },

    turnClick(type) {
      let that = this;
      that.turnIndex = type;
      if (type == 1) {
        that.list = that.awardsInfo.silver
        that.width = 360 / that.awardsInfo.silver.length
      } else {
        that.list = that.awardsInfo.golden
        that.width = 360 / that.awardsInfo.golden.length
      }
    },

    animation(index, duration) {
      //中奖index
      var list = this.list;
      var runNum = 4; //旋转8周
      // 旋转角度
      this.runDeg = this.runDeg || 0;
      this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - index * (360 / list.length)) + 1
      //创建动画
      var animationRun = uni.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      animationRun.rotate(this.runDeg).step();
      this.animationData = animationRun.export();
      this.btnDisabled = 'disabled';
    },

    animation2(index, duration) {
      //中奖index  
      var list = this.list;
      var runNum = 4; //旋转8周
      // 旋转角度
      this.runDeg = this.runDeg || 0;
      this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - index * (360 / list.length)) + 1
      //创建动画
      var animationRun = uni.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      animationRun.rotate(this.runDeg).step();
      this.animationData2 = animationRun.export();
      this.btnDisabled2 = 'disabled';
    },

    //发起抽奖
    playReward(status) {
      let that = this;
      let list = that.list;
      that.illustrates = false
      let data = {
        type: that.turnIndex == 1 ? 'silver' : 'golden',
        ten: status,
        Bearer: "Bearer",
      }
      // let index = 8,
      //       duration = 4000
      //     this.animation2(index, duration)
      //     setTimeout(() => {
      //         this.btnDisabled = '';
      //       }, duration + 1000)
      // return
      if (that.userInfo.silver == 0 && that.turnIndex == 1) {
        that.collecStatus = true;
        return
      }
      if (that.userInfo.golden == 0 && that.turnIndex == 2) {
        uni.showModal({
          title: '温馨提示',
          content: '您的金币抽奖次数已不足！',
          confirmText: "获取金币",
          // showCancel:false,
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pmnie/mnie/recharge",
              })
            }
          }
        })
        return
      }
      walletTurn(data).then(res => {
        if (res.code == 200) {
          that.getUserinfo();
          that.lotteryList = res.result;
          if (that.turnIndex == 1) {
            let index = 0,
              duration = 4000
            for (var i = 0; i < list.length; i++) {
              if (res.result[0].key == list[i].key) {
                index = i;
                break
              }
            }
            this.animation(index, duration)
            if (res.result.length > 1) { //10连抽
              setTimeout(() => {
                that.illustrates = true
                this.btnDisabled = '';
              }, duration + 1000)
            }
            if (res.result.length == 1) {
              setTimeout(() => {
                uni.showModal({
                  title: '温馨提示',
                  content: res.result[0].label,
                  confirmText: '再抽一次',
                  success: function (res) {
                    if (res.confirm) {
                      that.playReward(false)
                    }
                  }
                })
                this.btnDisabled = '';
              }, duration + 1000)
            }
          }

          if (this.turnIndex == 2) {
            let index = 0,
              duration = 4000
            for (var i = 0; i < list.length; i++) {
              if (res.result[0].key == list[i].key) {
                index = i
                break
              }
            }
            this.animation2(index, duration)
            if (res.result.length > 1) {
              setTimeout(() => {
                that.illustrates = true
                this.btnDisabled2 = '';
              }, duration + 1000)
            }

            if (res.result.length == 1) {
              setTimeout(() => {
                uni.showModal({
                  title: '温馨提示',
                  content: this.list[index].isNoPrize ? '抱歉，您未中奖' : '恭喜中奖' + res.result[0].label,
                  confirmText: '再抽一次',
                  success: function (res) {
                    if (res.confirm) {
                      that.playReward(false)
                    }
                  }
                })
                this.btnDisabled2 = '';
              }, duration + 1000)
            }
          }
        }
      })
    },
  }
}
</script>
<style scoped>
.speak {
  background: none;
  padding: 20rpx 0 30rpx;
}

.speak-list {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #000;
  font-size: 20rpx;
  padding: 0rpx 40rpx;
  line-height: 60rpx;
}

.speak-list .evidence {
  width: 68rpx;
  height: 44rpx;
  margin-top: 10rpx
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}

.popup {
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  border-radius: 20rpx;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 99999;
}

.popup .popup-title {
  font-weight: 600;
  line-height: 100rpx;
}

.popup .popup-center {
  font-size: 28rpx;
  padding-bottom: 30rpx;
}

.popup-btn {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.popup-btn .li {
  width: 50%;
  border-top: 1rpx solid #D8D3D3;
  border-right: 1rpx solid #D8D3D3;
  background: none;
  line-height: 100rpx;
  border-radius: 0;
  font-size: 30rpx;
}

.popup-btn .active {
  border-right: none !important;
  color: #576B95;
  font-weight: 600;
}

.btnbox {
  display: flex;
  justify-content: space-around;
  padding: 10rpx 0;
}

.btnbox button {
  width: 50%;
  font-size: 28rpx;
}

.option {
  display: flex;
  justify-content: space-around;
  padding-top: 48rpx;
}

.option .option-item {
  width: 176rpx;
  height: 52rpx;
  line-height: 52rpx;
  color: white;
  font-size: 20rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 15px;
  border: 1px solid #E8E8E8;
}

.turntable {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  padding: 0 40rpx;
}

.turntable-item {
  width: 124px;
  height: 37px;
  line-height: 37px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  position: relative;
  /* border: 1px solid red; */
}

.turntable-item .fiery {
  width: 72rpx;
  height: 44rpx;
  position: absolute;
  top: -20rpx;
  left: 174rpx;
  font-size: 24rpx;
  font-weight: 400;
  line-height: 40rpx;
  color: #F4F4F4;
  background: #F04455;
  border: 2rpx solid #F298A1;
  border-radius: 16rpx 16rpx 16rpx 0rpx;
}

.turntable-active {
  background: linear-gradient(180deg, #FFF384 0%, #FFD71A 100%);
  border-radius: 20px;
  color: #D54B00;
}

.turntab {
  display: flex;
  justify-content: space-around;
  margin-top: 58rpx;
}

.turntab .turntab-item {
  width: 296rpx;
  height: 92rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.conbox {
  width: 750upx;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background: linear-gradient(180deg, #7E3BAE 0%, #CB0F39 36%, #EE5F10 70%, #EE5F10 100%);
}

.canvas-container {
  margin: 0 auto;
  position: relative;
  width: 600upx;
  height: 600upx;
  /* background: url('https://img.drawai.cn/icon/lottery/back.png') no-repeat; */
  background-size: cover;
  border-radius: 50%;
}

.canvas-back {
  margin: 0 auto;
  position: relative;
  width: 640upx;
  height: 640upx;
  top: -20rpx;
  left: -20rpx;
  /* background: url('https://img.drawai.cn/icon/lottery/background1.png') no-repeat; */
  background-size: cover;
  border-radius: 50%;
  /* transform: rotate(22deg); */
}

.canvas-back2 {
  margin: 0 auto;
  position: relative;
  width: 640upx;
  height: 640upx;
  top: -20rpx;
  left: -20rpx;
  /* background: url('https://img.drawai.cn/icon/lottery/back2.png') no-repeat; */
  background-size: cover;
  border-radius: 50%;
  /* transform: rotate(18deg); */
}



.canvas-content {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  display: block;
  width: 600upx;
  height: 600upx;
  border-radius: inherit;
}

.canvas-list {
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;
  z-index: 9999;
  /* transform: rotate(24deg); */
}

.canvas-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #e4370e;
}

.canvas-item-text {
  position: relative;
  display: block;
  padding-top: 36rpx;
  /* margin: 10rpx auto 0; */
  text-align: center;
  -webkit-transform-origin: 50% 300upx;
  transform-origin: 50% 300upx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-item-text .evidence {
  width: 68rpx;
  height: 44rpx;
  margin-top: 10rpx;
}

.canvas-item-text text {
  font-size: 24rpx;
  font-weight: bold;
  color: #D7242D;
  /* padding-top:16rpx; */
}

/* 分隔线 */
.canvas-line {
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;
  z-index: 99;
}

.canvas-litem {}

/**
* 抽奖按钮
*/
.canvas-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 400;
  width: 168rpx;
  height: 192rpx;
  text-decoration: none;
  background-size: cover;
}


.typecheckbox view {
  border: 1px solid #FF3637;
  background: transparent;
  color: #FF3637;
  display: flex;
  height: 60upx;
  width: 140upx;
  border-radius: 50upx;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-left: 20upx;
}


.guize {
  width: auto;
  min-height: 288rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
  background: #F49768;
  border: 10rpx solid #DC421A;
  border-radius: 20rpx;
  margin: 48rpx;
  padding: 22rpx;
  color: #fff;
}

.guize .title {
  text-align: center;
  font-size: 24rpx;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.guize .g_item {
  font-family: PingFang-SC-Medium;
  font-size: 24rpx;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  text-align: justify;
  line-height: 20px;
}

.myrewards .title {
  font-family: PingFang-SC-Bold;
  font-size: 16px;
  color: #E4431A;
  letter-spacing: 0.57px;
  display: flex;
  padding-top: 36upx;
  justify-content: center;
}
</style>
