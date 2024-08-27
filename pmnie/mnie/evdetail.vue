<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="存证详情"
    />

    <view class="flex-col flex-auto group_3">

      <view class="grid">
        <image
          class="grid-item"
          :src="draw.detailUrl"
          mode="widthFix"
        />
      </view>

      <view class="flex-col group_4 space-y-22">
        <view class="flex-row items-baseline space-x-2">
          <text
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >创作时间：</text>
          <text
            class="font_2 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ attest.updateTime }}</text>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            @click="copyKeyword(attest.id, '创作 ID')"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >创作 ID: (点击复制)</view>
          <view
            class="font_2"
            @click="copyKeyword(attest.id, '创作 ID')"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ attest.id }}</view>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            @click="copyKeyword(attest.prompt, '关键词')"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >关键词：(点击复制)</view>
          <view
            class="font_2"
            @click="copyKeyword(attest.prompt, '关键词')"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ attest.prompt ? attest.prompt : '未公开' }}</view>
        </view>
      </view>

      <view class="flex-row justify-center group_6 space-x-12">
        <view
          class="flex-col justify-start items-center text-wrapper_3"
          @click="getCertificate(1)"
        >查看证书</view>
        <view
          class="flex-col justify-start items-center text-wrapper_3"
          @click="getCertificate(2)"
        >区块链证据</view>
      </view>

    </view>
  </view>
</template>

<script>
import { attestDetail, attestDownload } from '../../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      draw: {},
      attest: {},
    };
  },

  onLoad(res) {
    this.galleryDetail(res.id)
  },

  methods: {
    galleryDetail(id) {
      let that = this;
      attestDetail({ id: id }).then(res => {
        if (res.code == 200) {
          that.draw = res.result.draw;
          that.attest = res.result.attest;
          let goods = res.result.attest;
          goods.createTime = goods.createTime ? goods.createTime.replace('T', ' ') : '',
            goods.updateTime = goods.updateTime ? goods.updateTime.replace('T', ' ') : '',
            uni.setStorageSync("attest", goods);
        }
      }).catch(err => { })
    },

    // 复制关键词
    copyKeyword(text, name) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: name + "复制成功", icon: 'none', duration: 4000 })
        }
      });
    },


    getCertificate(type) {
      if (type == 1) {
        uni.navigateTo({
          url: '/pmnie/mnie/certificate',
        })
      } else {
        attestDownload({ id: this.attest.id }).then(res => {
          if (res.code == 200) {
            uni.setClipboardData({
              data: res.result.pdfUrl,
              success: function () {

              }
            });
            uni.showModal({
              title: '温馨提示',
              content: '下载链接已复制，请自行前往浏览器下载！',
              confirmText: "知道了",
              showCancel: false,
              success: function (data) {

              }
            });

          }
        })
      }
    },

  },

  /**
 * 用户点击右上角分享
 */
  // #ifdef MP
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
  // #endif
};
</script>

<style scoped lang="css">
.page {
  background-color: #141416;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 140rpx;
}

.user {
  display: flex;
  justify-content: space-between;
  color: white;
  margin-top: 28rpx;
}

.user-item {
  display: flex;
}

.group_3 {
  padding: 32rpx;
  overflow-y: auto;
}

.grid {
  text-align: center;
}

.grid-item {
  border-radius: 32rpx;
}

.group_4 {
  margin-top: 52rpx;
}

.space-y-22>view:not(:first-child),
.space-y-22>text:not(:first-child),
.space-y-22>image:not(:first-child) {
  margin-top: 44rpx;
}

.space-x-2>view:not(:first-child),
.space-x-2>text:not(:first-child),
.space-x-2>image:not(:first-child) {
  margin-left: 4rpx;
}

.font_1 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 26rpx;
  color: #ffffff;
}

.font_2 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  color: #ffffffcc;
  margin-top: 16rpx;
}

.text_3 {
  line-height: 20rpx;
}

.group_5 {
  margin-right: 12rpx;

}

.textarea {
  color: white !important;
  border: 1px solid #ffffff;
  border-radius: 10rpx;
  height: 220rpx;
  padding: 12rpx;
}

.items {
  margin: 20rpx 10rpx 0;
  width: 140rpx;
  line-height: 58rpx;
  border: 1px solid #ffffff;
  border-radius: 70rpx;
  text-align: center;
  color: white;
  font-size: 26rpx;

}

.text_4 {
  line-height: 34rpx;
}

.text-wrapper {
  padding: 4rpx 0;
  background-color: #ffffff14;
  border-radius: 18rpx;
  width: 96rpx;
  border: solid 2rpx #ffffff66;
}

.pos_3 {
  padding: 4rpx 12rpx;
  margin-left: 12rpx;
}

.text_5 {
  color: #ffffff;
  font-size: 20rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 18rpx;
}

.group_6 {
  margin-top: 106rpx;
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 60rpx;
  z-index: 99;
}

.space-x-12>view:not(:first-child),
.space-x-12>text:not(:first-child),
.space-x-12>image:not(:first-child) {
  margin-left: 24rpx;
}

.text-wrapper_2 {
  padding: 32rpx 0;
  background-color: #141416 !important;
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 200rpx;
  height: 96rpx;
  margin-right: 20rpx;
  line-height: 96rpx;
  border: solid 2rpx #ffffff;
}

.share {
  width: 200rpx !important;
  height: 96rpx !important;
  border-radius: 70rpx;
  line-height: 96rpx;
  padding: 0 !important;
  margin-left: 20rpx !important;
  font-weight: normal;
  background: none;
  font-size: 30rpx;
  color: white;
  border: solid 2rpx #ffffff !important;
}

.font_3 {
  font-size: 32rpx;
  font-family: PingFangSC-Regular;
  line-height: 30rpx;
  color: #ffffff;
}

.text_6 {
  line-height: 29rpx;
}

.text-wrapper_3 {
  /* padding: 32rpx 0; */
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 240rpx;
  height: 96rpx;
  line-height: 96rpx;
}

.text_7 {
  color: #141416;
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  line-height: 30rpx;
}
</style>