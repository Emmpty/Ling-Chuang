<template>
  <view
    class="flex-col page conter"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="设置"
    />

    <view class="flex-col flex-auto group_3">

      <view class="flex-col group_4">

        <view class="flex-col list space-y-8">
          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(1)"
            :data-theme="cueTheme"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >个人资料</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(2)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >手机号码</text>
            <view
              class="flex-row items-center space-x-4"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              <text
                class="font_2"
                v-if="userInfo.phone"
              >{{ userInfo.phone }}</text>
              <text
                class="font_2"
                v-else
              >去绑定</text>
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(3)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >登录密码</text>
            <view class="flex-row items-center space-x-4">
              <text
                class="font_2"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >修改</text>
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>


          <view
            class="flex-row justify-between items-center list-item"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
            v-if="userInfo.inviter"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >上级邀请码</text>
            <view class="flex-row items-center space-x-4">
              <text
                class="font_2"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ userInfo.inviter }}</text>

            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(4)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >更新日志</text>
            <view class="flex-row items-center space-x-4">
              <text class="font_2"></text>
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(5)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >当前版本</text>
            <view class="flex-row items-center space-x-4">
              <text
                class="font_2"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ oldversion ||
                '1.0.0' }}</text>
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(6)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >会员兑换码</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(7)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >用户协议</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

          <view
            class="flex-row justify-between items-center list-item"
            @click="setupClick(8)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628' }"
          >
            <text
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >隐私协议</text>
            <view class="flex-row items-center space-x-4">
              <image
                class="shrink-0 image_8"
                :src="cueTheme == 'day-theme' ? '../static/img/gallery/arrow.png' : icon"
              />
            </view>
          </view>

        </view>
      </view>
      <view
        class="flex-col justify-start items-center button"
        :data-theme="cueTheme"
        :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#262628', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        @click="logoutClick"
      >退出登录</view>
    </view>

    <!-- 主题弹窗 -->
    <u-popup
      :show="filterModel"
      mode="bottom"
      @close="filterClose"
    >
      <view
        class="filter"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view class="filter-top">
          <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">选择主题</view>
        </view>
        <view
          :class="filterIndex == 1 ? 'filter-active' : ' filter-list'"
          @click="filterClick('night-theme')"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >黑色</view>
        <view
          :class="filterIndex == 2 ? 'filter-active' : ' filter-list'"
          @click="filterClick('day-theme')"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >白色</view>
      </view>
    </u-popup>

    <!-- 会码兑换 -->
    <policy
      v-if="codeStatus"
      @getcodeStatus="getcodeStatus"
    />

  </view>
</template>

<script>
import { unbindWx, userInfo, wxmRegister, wxmAuth, } from '../static/api/index.js'

import policy from './components/policy/policy.vue';

export default {
  components: { policy },
  data() {
    return {
      userInfo: {},
      phone: '',
      icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839806547229511.png',
      filterModel: false,
      filterIndex: 0,
      oldversion: '',//当前版本号
      codeStatus: false,
    };
  },
  onLoad(res) {
    let that = this;
    // #ifdef MP 
    let accountInfo = uni.getAccountInfoSync();
    that.oldversion = accountInfo.miniProgram.version; // 1.0.0 小程序版本号
    //#endif

    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
      that.oldversion = wgtinfo.versionCode //通过该方法才可以获取到versionCode
    });
    //#endif

  },
  onShow() {
    this.getuserInfo()
  },
  methods: {

    getcodeStatus() {
      this.codeStatus = !this.codeStatus
    },

    getuserInfo() {
      userInfo({}).then((res) => {
        if (res.code == 200) {
          let data = res.result;
          data.inviter = data.inviter ? Number(data.inviter).toString(16) : '';
          this.userInfo = data;
        }
      });
    },

    // 一键绑定
    onGetPhoneNumber(e) {
      uni.login({
        provider: 'weixin',
        onlyAuthorize: true,
        success: (res) => {
          wxmAuth({ code: res.code },).then((res) => {
            console.log(res.code, 'res.code')
            if (res.code == 404) {
              let data = {
                code: e.detail.code,
                inviter: uni.getStorageSync('inviter') || '',
                session: res.result.session,
              }
              wxmRegister(data).then((res) => {
                if (res.code == 200) {
                  uni.setStorageSync('token', res.result.token);
                  userInfo({ token: res.result.token }).then((res) => {  // 获取用户最新信息
                    if (res.code == 200) {
                      this.userInfo = res.result;
                      uni.setStorageSync("userInfo", res.result);
                      uni.removeStorageSync('session');
                      uni.showToast({ title: "绑定成功", duration: 4000 });
                    }
                  });
                }
              })
            }
          })
        }
      })
    },

    setupClick(type) {
      let that = this;
      if (type == 1) {
        uni.navigateTo({
          url: '/psetup/personal'
        })
      } else if (type == 2) {
        uni.navigateTo({
          url: '/psetup/updatephone'
        })
      } else if (type == 3) {
        uni.navigateTo({
          url: "/plogin/register?type=4",
        })
      } else if (type == 4) { //更新日志
        uni.navigateTo({
          url: "/pmnie/mnie/updatelog",
        })
      } else if (type == 6) {//会员兑换码
        that.codeStatus = true;
      } else if (type == 7) {
        uni.navigateTo({
          url: "/plogin/user_agree",
        })
      } else if (type == 8) {
        uni.navigateTo({
          url: "/plogin/privacy_agree",
        })
      } else { //解绑微信
        if (!that.userInfo.wx_openid) {
          return
        }
        // uni.showModal({
        //   title: '温馨提示',
        //   content: '您确认要解绑微信吗?',
        //   success: function (res) {
        //     if (res.confirm) {
        //       unbindWx().then(res => {
        //         if (res.code == 200) {
        //           uni.showToast({ title: "解绑成功", duration: 4000 });
        //           let userInfo = that.userInfo;
        //           userInfo.wx_openid = '';
        //           that.userInfo = userInfo;
        //         }
        //       })
        //     }
        //   }
        // });
      }
    },

    // 
    logoutClick() {
      uni.showModal({
        title: '温馨提示',
        content: '您确认要退出吗?',
        success: function (res) {
          if (res.confirm) {
            uni.removeStorageSync('taskId'); //清除任务ID
            uni.removeStorageSync('userInfo'); // 清除用户信息
            uni.removeStorageSync('token'); //清除用户token
            uni.removeStorageSync('loginType'); //清除用户账号登录类型
            uni.setStorageSync("loginStatus", 1);
            uni.removeStorageSync('session');    // 清除session 
            uni.switchTab({ url: '/pages/tabBar/index' });
          }
        }
      });
    },
    formatTel(tel) {
      tel = "" + tel;
      let newTel = tel.substr(0, 6) + "****" + tel.substr(10)
      return newTel;
    },


    filterClose() {
      this.filterModel = false;
    },


    // 主题切换
    themeSwitching() {
      this.filterModel = true;
    },

    filterClick(e) {
      //修改主题
      this.cueGetTheme(e)
      //设置主题缓存
      this.themeCache(e)
      //设置 全局背景色
      this.getSystemBg()
      // this.switchTheme(e)
      this.filterModel = false;
    }

  },

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
<style>
page {
  min-height: 100vh;
}
</style>
<style scoped lang="scss">
// 全局背景色
.conter {
  height: 100%;
  background-color: $page-bg;
}

.css-theme {
  @include text-color();
  @include base-background();
  @include border-color();
  @include shadow-color();
}

.filter {
  background: #2E2E33;
  border-radius: 16px 16px 0px 0px;
  opacity: 1;
  z-index: 999;
  // color:white;
  padding: 0 30rpx 30rpx;
}

.filter-top {
  text-align: center;
  line-height: 120rpx;
  margin-bottom: 10rpx;
}

.filter-list {
  line-height: 100rpx;
  text-align: center;
}

.filter-active {
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.page {
  height: 100vh;

  .group_3 {
    padding: 60rpx 32rpx 20rpx;
    overflow-y: auto;

    .image-wrapper_2 {
      padding-top: 96rpx;
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
      padding: 0rpx 0 48rpx;

      .section_3 {
        padding: 40rpx 24rpx 48rpx 36rpx;
        background-color: #262628;
        border-radius: 32rpx;

        .text_3 {
          text-align: right;
          color: #ffffff;
        }
      }

      .list {
        padding: 16rpx 0;

        .list-item {
          padding: 40rpx 32rpx;
          border-radius: 32rpx;

          .space-x-4 {

            &>view:not(:first-child),
            &>text:not(:first-child),
            &>image:not(:first-child) {
              margin-left: 8rpx;
            }

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

        .bunt {
          margin: 16rpx 0 0 !important;
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
        line-height: 26rpx;
      }

      .font_2 {
        font-size: 28rpx;
        font-family: PingFangSC;
        line-height: 26rpx;
      }
    }

    .button {
      padding: 28rpx 0 36rpx;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
    }
  }
}
</style>