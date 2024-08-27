<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="灵石提现"
    />

    <view
      class="income"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
    >
      <view class="income-item">
        <view
          class="telter"
          style="width:40%;"
        >
          <view
            class="name"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >总收益</view>
          <view
            class="total"
            :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
          >{{ walletInfo.total || 0 }}</view>
        </view>
        <view class="telter">
          <view
            class="name"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >可提现</view>
          <view
            class="total"
            @click="withdrawalDel()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
          >
            {{ walletInfo.score || 0 }} <text class="cash">提现</text></view>
        </view>
      </view>
      <view class="income-item">
        <view class="telter">
          <view
            class="name"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >收益与提现说明</view>
        </view>
      </view>
      <view
        class="income-bottom"
        :style="{ 'border-top': cueTheme == 'day-theme' ? '2px solid #ECECEC' : '2px solid #2C2C2C' }"
      >
        <view class="li">
          <view
            class="total"
            :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
          >{{ walletInfo.lastDay || 0 }}</view>
          <view
            class="tips"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >昨日总收益</view>
        </view>
        <view class="li">
          <view
            class="total"
            :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
          >{{ walletInfo.curMonth || 0 }}</view>
          <view
            class="tips"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >本月总收益</view>
        </view>
        <view class="li">
          <view
            class="total"
            :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
          >{{ walletInfo.lastMonth || 0 }}</view>
          <view
            class="tips"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >上月总收益</view>
        </view>
      </view>
    </view>

    <view
      class="invite"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
    >
      <view
        class="invite-name"
        :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
      >邀请好友 <view class="rebate">返佣20%
        </view>
      </view>

      <view
        class="invite-code"
        @click="copyKeyword()"
      >专属邀请码：<text :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }">{{ my_inviter }}</text>
        <image :src="cueTheme == 'day-theme' ? '/static/img/detail/copy2.png' : '/static/img/detail/copy.png'"></image>
      </view>

      <view
        class="invite-tab"
        :style="{ 'border-top': cueTheme == 'day-theme' ? '1px solid #ECECEC' : '' }"
      >
        <view
          class="conpt"
          @click="llustrateStatus()"
          :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '', 'border-right': cueTheme == 'day-theme' ? '1px solid #ECECEC' : '' }"
        >
          <image src="/static/img/payment/download.png"></image> 海报邀请
        </view>
        <button
          class="conpt"
          open-type="share"
          type="button"
          :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
        >
          <image src="/static/img/payment/wechat_icon.png" />
          <text>直接邀请</text>
        </button>
      </view>
    </view>


    <view
      class="swiper-box tn-padding-top tn-margin"
      v-if="bannerImgs.length > 0"
    >
      <swiper
        @change="swiperChange"
        :autoplay="true"
        :circular="true"
        :indicator-dots="true"
      >
        <swiper-item
          v-for="(item, index) in bannerImgs"
          :key="index"
          @tap="openSheet(item.url)"
        >
          <image
            class="slide-image"
            :src="item.image"
            mode="widthFix"
            @longtap="openSheet(item.url)"
            :show-menu-by-longpress="false"
          >
          </image>
        </swiper-item>
      </swiper>
    </view>

    <view
      class="record"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
    >
      <view class="record-item">
        <view
          :class="tabIndex == 1 ? 'tab active' : 'tab'"
          @click="recordType(1)"
          :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
        >邀请记录</view>
        <view
          :class="tabIndex == 2 ? 'tab active' : 'tab'"
          @click="recordType(2)"
          :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
        >收益记录</view>
        <view
          :class="tabIndex == 3 ? 'tab active' : 'tab'"
          @click="recordType(3)"
          :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
        >提现记录</view>
      </view>

      <block v-if="tabIndex == 1">
        <view
          class="record-list"
          v-for="(item, index) in inviteList"
          :key="index"
        >
          <view
            class="icon"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ECECEC' : '' }"
          >
            <image :src="cueTheme == 'day-theme' ? '/static/img/detail/avter1.png' : '/static/img/detail/avter.png'">
            </image>
          </view>
          <view class="">
            <view
              class="name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
            >{{ item.userId }}</view>
            <view
              class="phone"
              :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
            >{{ item.phone }}</view>
          </view>
          <view
            class="time"
            :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
          >{{ $u.timeFormat(new
            Date(item.createTime), "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
      </block>
      <block v-if="tabIndex == 2">
        <view
          class="record-list"
          v-for="(item, index) in scoreList"
          :key="index"
        >
          <view
            class="icon"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ECECEC' : '' }"
          >
            <image :src="cueTheme == 'day-theme' ? '/static/img/detail/money1.png' : '/static/img/detail/money.png'">
            </image>
          </view>
          <view class="">
            <view
              class="name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
            >{{ item.remark }}</view>
            <view
              class="phone"
              :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
            >{{ $u.timeFormat(new
              Date(item.logTime), "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view class="amount"> +{{ item.changeAmount }}</view>
        </view>
      </block>
      <block v-if="tabIndex == 3">
        <view
          class="record-list"
          v-for="(item, index) in cashList"
          :key="index"
        >
          <view class="icon">
            <image :src="cueTheme == 'day-theme' ? '/static/img/detail/money1.png' : '/static/img/detail/money.png'">
            </image>
          </view>
          <view class="">
            <view
              class="name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
            >{{ item.name }}</view>
            <view
              class="phone"
              :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
            >{{ $u.timeFormat(new
              Date(item.updateTime), "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view class="amount"> +{{ item.cashAmount }}</view>
        </view>
      </block>
      <view
        class="record-more"
        @click="seeMore()"
        :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '' }"
      >查看更多
        ></view>
    </view>

    <view
      class="poster"
      v-show="llustrate"
      @click="llustrate = !llustrate"
    >
      <swiper
        class="swiper"
        :indicator-dots="false"
        :autoplay="false"
        :circular="false"
        interval="3000"
        duration="500"
        @change="bindchange"
        previous-margin="40px"
        next-margin="40px"
      >
        <block
          v-for="(item, index) in spreadData"
          :key="index"
          class="img-list"
        >
          <swiper-item class="aaa">
            <div
              class="box"
              ref="bill"
              :class="swiperIndex == index ? 'active' : 'quiet'"
            >
              <view class="user-msg">
                <view class="user-code">
                  <image
                    class="canvas"
                    :style="{ height: hg + 'px' }"
                    :src="posterImage[index]"
                    v-if="posterImage[index]"
                  >
                  </image>
                  <canvas
                    class="canvas"
                    :style="{ height: hg + 'px' }"
                    :canvas-id="'myCanvas' + index"
                    v-else
                  ></canvas>
                </view>
              </view>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </view>

    <u-popup
      :show="false"
      mode="bottom"
      border-radius="40"
    >
      <view
        class="share"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view class="share-item">
          <button
            class="list"
            open-type="share"
            type="button"
          >
            <view class="icons">
              <image src="/static/img/mnie/share_icon1.png"></image>
            </view>
            <view :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : 'white' }">发送给朋友</view>
          </button>
          <button
            class="list"
            @click="collectClick()"
          >
            <view class="icons">
              <image src="/static/img/mnie/share_icon2.png"></image>
            </view>
            <view :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : 'white' }">收藏</view>
          </button>
          <view
            class="list"
            @click="savePosterPathMp(posterImage[swiperIndex])"
            shape="circle"
          >
            <view class="icons">
              <image
                :src="cueTheme == 'day-theme' ? '/static/img/mnie/share_icon3.png' : '/static/img/mnie/share_icon33.png'"
              >
              </image>
            </view>
            <view :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : 'white' }">保存至相册</view>
          </view>
        </view>
        <view
          class="share-colse"
          @click="llustrate = !llustrate"
        >取消</view>
      </view>
    </u-popup>


  </view>
</template>

<script>
import { walletProfit, inviteList, scoreList, cashList, userInfo } from '../../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      walletInfo: {},
      tabIndex: 1,
      my_inviter: "",//邀请码
      inviteList: [],
      scoreList: [],
      cashList: [],
      userInfo: {},
      spreadData: [{}], //新海报数据
      hg: 0,
      wd: 0,
      spread: [
        { "pic": "https://cdn.drawai.cn/public/poster.jpg" }
      ],
      swiperIndex: 0,
      posterImage: [],
      llustrate: false,
      bannerImgs: [],
      sheetUrl: "",
      sheetShow: false,
      sheetList: [
        { name: '跳转链接', type: "turn", index: 0 },
        { name: '保存图片', type: "save", index: 1 },
      ],
    };
  },

  onLoad() {
    this.walletProfit();
    this.inviteListon(); // 邀请记录
    this.scoreListon();  // 收益记录
    this.cashListon();   // 提现记录
    this.bannerImgs = getApp().globalData.jsonGoods.lingshibanner || [];
    userInfo({}).then((res) => {
      if (res.code == 200) {
        var my_inviter = Number(res.result.id).toString(16);
        this.my_inviter = my_inviter;
        this.userInfo = res.result
      }
    });
  },

  methods: {

    llustrateStatus() {
      let that = this;
      that.llustrate = !that.llustrate
      this.$nextTick(() => {
        let selector = uni.createSelectorQuery().select('.aaa');
        selector.fields({
          size: true
        }, data => {
          this.wd = data.width
          this.hg = data.height
        }).exec();
      })

      if (that.spreadData[0].pic) {
        that.collectClick()
        return;
      }
      uni.showLoading({
        title: '海报生成中',
        mask: true
      });

      setTimeout(function () {
        that.spreadMsgs()
      }, 500)
    },

    bindchange(e) {
      let spreadList = this.spreadList;
      this.swiperIndex = e.detail.current;
      this.poster = spreadList.poster[e.detail.current]
    },

    //获取图片
    async spreadMsgs() {
      // let res = {
      //   data: {
      //     qrcode: "test",
      //     spread: [
      //       { "pic": "https://cdn.drawai.cn/public/poster.jpg" }
      //     ]
      //   }
      // }
      this.spreadData = this.spread
      this.nickName = this.userInfo.name;
      this.siteName = "灵创"
      let env = this.$baseURL == 'https://app.onefold.cn' ? 'trial' : 'release';
      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxec994b5f8ad8bfde/' + env;
      mpUrl = await this.downloadFilestoreImage(mpUrl);
      this.qrcode = mpUrl
      for (let i = 0; i < this.spread.length; i++) {
        let that = this
        let img = this.spread[i].pic
        img = await this.downloadFilestoreImage(img);
        let arr2 = [this.qrcode || this.codeSrc, img]
        that.userPosterCanvas(arr2, that.userInfo.name, that.siteName, i, that.wd, that.hg, (tempFilePath) => {
          that.$set(that.posterImage, i, tempFilePath);
          wx.showShareImageMenu({
            path: that.posterImage[0],
            success: (res) => {
              if (res.errMsg == 'showShareImageMenu:ok') {
                that.llustrate = false;
                uni.showToast({
                  title: '保存成功！',
                  icon: 'none',
                  duration: 3000,
                })
              }
            },
            fail: (res) => {
              if (res.errMsg.indexOf('deny') != -1 || res.errMsg.indexOf('denied') != -1) {
                uni.showToast({
                  title: '保存相册失败，请设置权限！',
                  icon: 'none',
                  duration: 2000,
                })
              } else {
                that.llustrate = false;
              }
            }
          });
        });
      }
      uni.hideLoading();
    },
    userPosterCanvas: function (arr2, nickname, sitename, index, w, h, successFn) {
      let that = this;
      const ctx = uni.createCanvasContext('myCanvas' + index);
      ctx.clearRect(0, 0, 0, 0);
      console.log(arr2)
      uni.getImageInfo({
        src: arr2[1],
        success: function (res) {
          const WIDTH = res.width;
          const HEIGHT = res.height;
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(arr2[1], 0, 0, w, h);
          ctx.setTextAlign('left')
          ctx.setFontSize(12);
          ctx.setFillStyle('#333');
          let codex = 0.32
          let codey = 0.51
          let codeSize = 0.35
          let namex = 0.4283
          let namey = 0.8215
          let markx = 0.4283
          let marky = 0.8685
          ctx.drawImage(arr2[0], w * codex, h * codey, w * codeSize, w * codeSize);
          ctx.save();
          ctx.draw(true, function () {
            uni.canvasToTempFilePath({
              canvasId: 'myCanvas' + index,
              fileType: 'png',
              quality: 1,
              success: function (res) {
                successFn && successFn(res.tempFilePath);
              }
            })
          });
        },
        fail: function (err) {
          uni.hideLoading();
          console.warn(err)
          uni.$u.toast("无法获取图片信息");
        }
      })
    },

    //图片转符合安全域名路径
    downloadFilestoreImage(url) {
      return new Promise((resolve, reject) => {
        let that = this;
        uni.downloadFile({
          url: url,
          header: {
            Authorization: uni.getStorageSync('token')
          },
          success: function (res) {
            console.log(res, 'res520')
            resolve(res.tempFilePath);
          },
          fail: function () {
            return that.$util.Tips({
              title: ''
            });
          }
        });
      })
    },

    savePosterPathMp(url) {
      let that = this;
      uni.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                uni.saveImageToPhotosAlbum({
                  filePath: url,
                  success: function (res) {
                    uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
                  },
                  fail: function (res) {
                    uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
                  }
                });
              }
            });
          } else {
            uni.saveImageToPhotosAlbum({
              filePath: url,
              success: function (res) {
                uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
              },
              fail: function (res) {
                uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
              }
            });
          }
        }
      });
    },

    // 收藏
    collectClick() {
      let that = this;
      wx.showShareImageMenu({
        path: that.posterImage[0],
        success: (res) => {
          if (res.errMsg == 'showShareImageMenu:ok') {
            that.llustrate = false;
            uni.showToast({
              title: '保存成功！',
              icon: 'none',
              duration: 3000,
            })
          }
        },
        fail: (res) => {
          if (res.errMsg.indexOf('deny') != -1 || res.errMsg.indexOf('denied') != -1) {
            uni.showToast({
              title: '保存相册失败，请设置权限！',
              icon: 'none',
              duration: 2000,
            })
          } else {
            that.llustrate = false;
          }
        }
      });
    },

    swiperChange(e) {
      this.current = e.detail.current;
    },

    // 轮播图跳转
    openSheet(url) {
      this.sheetUrl = url;
      uni.navigateTo({
        url: '/pmnie/mnie/webview?url=' + url
      })
    },


    // 收益统计
    walletProfit() {
      let that = this;
      walletProfit({}).then(res => {
        if (res.code == 200) {
          that.walletInfo = res.result
        }
      })
    },

    recordType(e) {
      this.tabIndex = e;
    },

    // 邀请列表
    inviteListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      inviteList(data).then(res => {
        if (res.code == 200) {
          that.inviteList = res.result.records
          setTimeout(function () {
            uni.hideLoading()
          }, 500)
        }
      })
    },

    // 获取收益记录列表
    scoreListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      scoreList(data).then(res => {
        if (res.code == 200) {
          that.scoreList = res.result.records;
          setTimeout(function () {
            uni.hideLoading()
          }, 500)
        }
      })
    },

    // 获取提现记录列表
    cashListon() {
      let that = this;
      let data = {
        pageNum: 1,
        pageSize: 4,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      cashList(data).then(res => {
        if (res.code == 200) {
          let records = res.result.records;
          records.map(item => {
            item.name = item.status == 0 ? '申请处理中' : item.status == 1 ? "提现成功" : '提现退回'
          })
          setTimeout(function () {
            uni.hideLoading()
            that.cashList = that.cashList.concat(records);
          }, 500)
        }
      })
    },

    // 复制 
    copyKeyword() {
      uni.setClipboardData({
        data: this.my_inviter,
        success: function () {
          uni.showToast({ title: "复制成功", icon: 'none', duration: 2000 })
        }
      });
    },

    // 提现
    withdrawalDel() {
      uni.navigateTo({
        url: "/pmnie/mnie/redeem",
      })
    },

    // 查看更多
    seeMore() {
      uni.navigateTo({
        url: "/pmnie/mnie/cashlist",
      })
    },

    // 
    getRedeem() {
      uni.navigateTo({
        url: "/pmnie/mnie/redeem",
      })
    },
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
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.income {
  background: rgba(244, 244, 244, 0.08);
  border-radius: 32rpx;
  color: white;
  padding: 40rpx;
  margin: 30rpx;
}

.income-item .telter {
  display: inline-block;
  position: relative;
}

.income-item .telter .name {
  color: rgba(244, 244, 244, 0.48);
  font-size: 20rpx;
  margin-bottom: 10rpx;
}

.income-item .telter .total {
  font-size: 56rpx;
  color: #F4F4F4;
}

.income-item .telter .cash {
  padding: 10rpx 26rpx;
  margin-left: 25rpx;
  background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
  border-radius: 46rpx;
  text-align: center;
  line-height: 56rpx;
  font-size: 24rpx;
  position: relative;
  top: -12rpx;
}

.income-bottom {
  display: flex;
  justify-content: space-between;
  border-top: 2px solid #ECECEC;
  padding: 30rpx 0 0;
  margin-top: 20rpx;
  text-align: center;
}

.income-bottom .total {
  font-size: 32rpx;
  color: #F4F4F4;
}

.income-bottom .tips {
  color: rgba(244, 244, 244, 0.48);
  font-size: 20rpx;
  margin-top: 10rpx;
}

.poster {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.52);
  z-index: 10075;
}

.swiper {
  width: 100%;
  height: 1000rpx;
  position: relative;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10076;
}

.canvas {
  width: 100%;
}

.box {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 18rpx;
  overflow: hidden;

  .user-msg {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .user-code {
      width: 100%;
      // height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-between;

      image {
        width: 100%;
      }
    }
  }
}

.invite {
  background: rgba(244, 244, 244, 0.08);
  border-radius: 32rpx;
  color: white;
  // padding:30rpx;
  margin: 30rpx;
}

.invite .invite-name {
  font-size: 34rpx;
  font-weight: 500;
  line-height: 120rpx;
  padding-left: 30rpx;
  position: relative;
}

.invite .invite-name .rebate {
  width: 96rpx;
  height: 32rpx;
  line-height: 26rpx;
  color: white;
  background: #F04455;
  border-radius: 8rpx 8rpx 8rpx 0rpx;
  opacity: 1;
  border: 2rpx solid rgba(244, 244, 244, 0.48);
  position: absolute;
  top: 20px;
  left: 168rpx;
  font-size: 18rpx;
  text-align: center;
}

.invite .invite-code {
  border: 1px dashed #434343;
  height: 132rpx;
  line-height: 132rpx;
  text-align: center;
  color: #787878;
  border-radius: 20rpx;
  margin: 0 30rpx;
}

.invite .invite-code text {
  color: white;
}

.invite .invite-code image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 8rpx;
  left: 10rpx;
}

.invite-tab {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(244, 244, 244, 0.04);
  margin-top: 50rpx;

}

.invite-tab .conpt {
  color: white;
  height: 116rpx;
  font-size: 32rpx !important;
  line-height: 116rpx !important;
  width: 50% !important;
  text-align: center;
}

.invite-tab .conpt:last-child {
  border-left: 1px solid rgba(244, 244, 244, 0.04);
}

.invite-tab .conpt image {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  position: relative;
  top: 8rpx;
  right: 18rpx;
}

.record {
  background: rgba(244, 244, 244, 0.08);
  margin: 30rpx;
  padding: 30rpx;
  color: white;
  border-radius: 24rpx;
}

.record .record-item {
  display: flex;
  line-height: 100rpx;
  color: rgba(244, 244, 244, 0.48);
}

.record .record-item .tab {
  font-size: 32rpx;
  margin-right: 50rpx;
  margin-bottom: 30rpx;
}

.record .record-item .active {
  color: white;
  position: relative;
}

.record .record-item .active:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 128rpx;
  height: 8rpx;
  border-radius: 30rpx;
  background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
}

.record-list {
  display: flex;
  position: relative;
  padding: 30rpx 0rpx;
}

.record-list .icon {
  background: rgba(244, 244, 244, 0.12);
  border-radius: 16rpx;
  width: 77rpx;
  height: 80rpx;
  text-align: center;
  margin-right: 20rpx;
}

.record-list .icon image {
  width: 40rpx;
  height: 40rpx;
  margin-top: 18rpx;
}

.record-list .name {
  font-size: 28rpx;
  font-weight: 500;
  color: #F4F4F4;
  line-height: 44rpx;
}

.record-list .phone {
  font-size: 20rpx;
  color: #F4F4F4;
  line-height: 28rpx;
  margin-top: 8rpx;
}

.record-list .time {
  position: absolute;
  top: 26rpx;
  right: 10rpx;
  font-size: 20rpx;
  color: rgba(244, 244, 244, 0.48);
}

.record-list .amount {
  color: #F04455;
  font-size: 32rpx;
  position: absolute;
  top: 40rpx;
  right: 10rpx;
}

.record-more {
  text-align: center;
  line-height: 40rpx;
  padding-bottom: 30rpx;
  color: rgba(244, 244, 244, 0.48);
  font-size: 22rpx;
}

.share {
  padding: 10rpx 0 0;
  height: 420rpx;
  border-top: 1px solid #3D3D3D;
  background: #121212;
  border-radius: 48rpx 48rpx 0 0;
}

.share-item {
  display: flex;
  justify-content: space-around;

  color: rgba(18, 18, 18, 0.52);
  line-height: 28rpx;
  margin: 40rpx 0 50rpx
}

.share-item .list {
  text-align: center;
  font-size: 20rpx !important;
}

.share-item .icons {
  width: 112rpx;
  height: 112rpx;
  background: rgba(244, 244, 244, 0.08);
  border-radius: 20rpx;
  margin-bottom: 30rpx
}

.share-item image {
  width: 64rpx;
  height: 64rpx;
  margin-top: 20rpx;
}

.share-colse {
  background: #242424;
  text-align: center;
  line-height: 160rpx;
  color: #777777;
}

button {
  background: none !important;
}

.swiper-box {
  position: relative;
  padding-top: 0 !important;
  border-radius: 30rpx;
}

.swiper-box swiper image,
.swiper-box .slide-image {
  width: 100%;
  border-radius: 30rpx;
}
</style>