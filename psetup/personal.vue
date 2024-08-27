<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="个人资料"
    />

    <view class="flex-col flex-auto group_3">

      <view
        class="flex-col justify-start items-end self-center image-wrapper_2"
        :style="'background-image: url(' + userInfo.avatar + ')'"
        @click="openImagePage()"
      >
        <image
          class="image_7"
          src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/7b41032b198b8ad8e76679b53b7e1783.png"
        />
      </view>

      <view class="flex-col group_4">
        <view
          class="flex-row justify-between section_3"
          :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
        >
          <text
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff', }"
          >昵称:</text>
          <input
            class="font_2 text_3"
            type="text"
            v-model="userInfo.name"
            :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff' }"
          >
        </view>
        <view class="flex-col list space-y-8">

          <view
            class="flex-row justify-between items-center list-item"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff' }"
            >I D :</text>
            <view class="flex-row items-center space-x-4">
              <text
                class="font_2"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000000' : '#61ffff' }"
              >{{ userInfo.id }}</text>
              <image
                class="shrink-0 image_9"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/fbfa5f0e12929619bcd405dc28ec952a.png"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff' }"
            >区块链地址:</text>
            <view
              class="flex-row items-center space-x-4"
              @click="copyKeyword(userInfo.info.address)"
            >
              <view
                class="font_2 font_3"
                :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff' }"
              >{{ userInfo.info.address2 }}</view>
              <text
                class="pocy"
                :style="{ 'color': cueTheme == 'day-theme' ? '#262628' : '#fff' }"
              >复制</text>
            </view>
          </view>

        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        @click="saveChanges"
      ><text class="text_6">保存修改</text></view>
    </view>
  </view>
</template>

<script>
import { updateInfo, userInfo } from '../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      userInfo: {},
      icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839782114203785.png',
    };
  },
  onLoad(res) {
    let userinfo = uni.getStorageSync('userInfo');
    userinfo.info.address2 = userinfo.info.address
    userinfo.info.address2 = this.visibilityChange(userinfo.info.address2);
    this.userInfo = userinfo;
  },
  methods: {

    visibilityChange(val) {
      let _len = val.length
      return val.substring(0, 6) + '*******' + val.substring(_len - 6, _len)
    },

    saveChanges() {
      let data = {
        name: this.userInfo.name,
        avatar: this.userInfo.avatar
      }
      updateInfo(data).then(res => {
        if (res.code == 200) {
          userInfo({}).then((res) => {
            if (res.code == 200) {
              uni.showToast({ title: "更新成功", duration: 4000 });
              uni.setStorageSync("userInfo", res.result);
            }
          })
        }
      })
    },

    // 选择图片
    openImagePage() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        crop: {
          quality: 10,
        },
        width: 160,
        height: 160,
        success: function (res) {
          uni.showLoading({
            title: '图片上传中'
          });
          if (res.tempFiles[0].size > 1572864) {
            uni.showToast({ title: "图片不能超过1.5MB,请重新上传！", icon: "none", duration: 4000 });
            uni.hideLoading()
            return
          } else {
            uni.uploadFile({
              method: 'POST',
              header: { 'Authorization': uni.getStorageSync('token') },
              url: that.$baseURL + '/user/info/uploadAvatar',
              filePath: res.tempFilePaths[0],
              name: 'file',
              success: (res) => {
                let data = JSON.parse(res.data);
                let userInfo = that.userInfo;
                userInfo.avatar = data.result.avatar;
                that.userInfo = userInfo;
                uni.hideLoading()
              }
            });
          }
        }
      });
    },

    // 开始图片上传
    getuploadImage(tempFilePaths) {
      uni.hideLoading()
      let _this = this;
      uni.uploadFile({
        method: 'POST',
        header: { 'Authorization': uni.getStorageSync('token') },
        url: _this.$baseURL + '/user/info/uploadAvatar',
        filePath: tempFilePaths[0],
        name: 'file',
        success: (res) => {
          let data = JSON.parse(res.data)
          _this.userInfo.avatar = data.result.avatar;
        }
      });
    },

    //  小程序设置
    Setting: function () {
      uni.openSetting({
        success: function (res) {

        }
      });
    },

    // 复制
    copyKeyword(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: "复制成功", icon: 'none', duration: 4000 })
        }
      });
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
  // #endif
};
</script>

<style scoped lang="less">
.page {
  background-color: #141416;
  height: 100vh;

  .group_3 {
    padding: 60rpx 32rpx 504rpx;
    overflow-y: auto;

    .image-wrapper_2 {
      padding-top: 96rpx;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839787430766661.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 50%;
      width: 160rpx;

      .image_7 {
        margin-left: 96rpx;
        width: 64rpx;
        height: 64rpx;
      }
    }

    .group_4 {
      padding: 64rpx 0 48rpx;

      .section_3 {
        padding: 40rpx 32rpx;
        border-radius: 32rpx;

        .text_3 {
          text-align: right;
        }
      }

      .list {
        padding: 16rpx 0;

        .list-item {
          padding: 40rpx 32rpx;
          border-radius: 32rpx;

          .space-x-4 {
            position: relative;

            .image_8 {
              width: 14rpx;
              height: 26rpx;
            }

            .image_9 {
              width: 32rpx;
              height: 32rpx;
            }
          }
        }
      }

      .space-y-8 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 16rpx;
        }
      }

      .font_1 {
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
      }

      .font_2 {
        font-size: 28rpx;
        font-family: PingFangSC;
        line-height: 26rpx;
      }

      .font_3 {
        width: 320rpx;
      }

      .pocy {
        padding: 8rpx 24rpx;
        border-radius: 12rpx;
        font-size: 12px;
        border: 1px solid white;
      }
    }

    .button {
      padding: 28rpx 0 36rpx;
      background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
      border-radius: 48rpx;
      box-shadow: 0px 16rpx 32rpx #00dbc533;

      .text_6 {
        color: #000000;
        font-size: 36rpx;
        font-family: PingFangSC;
        line-height: 33rpx;
      }
    }
  }
}
</style>