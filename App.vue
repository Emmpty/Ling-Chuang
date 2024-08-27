<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-ui/index.scss";
@import '@/uni_modules/tuniao-ui/libs/css/main.scss';
@import '@/uni_modules/tuniao-ui/libs/css/color.scss';
</style>

<script>
import { mapMutations, mapState } from 'vuex';
import { refreshToken, userInfo, wxmAuth } from "static/api/index.js";
import datajosn from "./static/utils/datajosn";

export default {
  globalData: {
    album: {},
    my_inviter: "", //当前用户邀请码
    appid: '',
    sharePath: "/pages/tabBar/gallery",
    shareTitle: "我发现了一幅绝美艺术画，快来看看！",
    shareImage: "https://cdn.drawai.cn/aIke-video/images/share.jpg",
    userInfo: uni.getStorageSync('userInfo') || {},
    jsonGoods: {}, // json 文件

    downLoadImage(url) {
      // 先下载图片
      uni.showLoading({ title: '' });
      uni.downloadFile({
        url: url,
        success: (res) => {
          uni.hideLoading();
          console.log("[downLoadImage]", res)
          if (res.statusCode === 200) {
            // 获取到图片本地地址后再保存图片到相册（因为此方法不支持远程地址）
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                uni.showToast({ title: "保存成功！", });
              },
              fail: () => {
                uni.showToast({
                  title: "保存失败",
                  icon: "none",
                });
              }
            });
          } else {
            if (res.errMsg)
              uni.showToast({ title: "失败" + res.errMsg, icon: "none" });
            else {
              uni.showToast({ title: "图片获取失败", icon: "none" });
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: "图片获取失败", icon: "none" });
        }
      });
    },

    // 检测用户是否登录
    getLogin(e) {
      let token = uni.getStorageSync('token');
      let userInfo = uni.getStorageSync('userInfo');
      console.log(token, '用户token')
      console.log(userInfo, '用户信息')
      if (!uni.getStorageSync('token') || !userInfo.id) {//用户未登录
        if (e != 'tips') {
          // #ifdef MP 
          let url = uni.getStorageSync('session') ? '/plogin/logintype?onekey=true' : "/plogin/logintype";
          uni.navigateTo({
            url: url
          })
          // #endif

          // #ifndef MP 
          uni.navigateTo({
            url: "/plogin/login"
          })
          // #endif
        } else {
          uni.showModal({
            title: '你还未登录',
            content: '请授权手机号登录，同步其他平台',
            confirmText: "去登录",
            // showCancel:false,
            success: function (res) {
              if (res.confirm) {
                // session 为真 说明该用户是新用户

                // #ifdef MP 
                let url = uni.getStorageSync('session') ? '/plogin/logintype?onekey=true' : "/plogin/logintype";
                uni.navigateTo({
                  url: url
                })
                // #endif

                // #ifndef MP 
                let urls = "/plogin/login"
                uni.navigateTo({
                  url: urls
                })
                // #endif
              }
            }
          });
          return false;
        }
      } else if (!userInfo.phone || userInfo.phone == null) { // 老用户未绑定手机号
        uni.showModal({
          title: "温馨提示",
          content: "根据相关法规图片生成服务需要核实用户身份，请绑定手机号。",
          confirmText: "去绑定",
          cancelText: "退出登录",
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "/plogin/register?type=2",
              });
            } else {
              uni.removeStorageSync('taskId'); //清除任务ID
              uni.removeStorageSync('userInfo'); // 清除用户信息
              uni.removeStorageSync('token'); //清除用户token
              uni.removeStorageSync('loginType'); //清除用户账号登录类型
              uni.setStorageSync("loginStatus", 1);
              uni.switchTab({ url: '/pages/tabBar/index' });
            }
          },
        });
        return false;
      } else { // 已登录，已绑定手机号 
        return true;
      }
    },

    // 更新用户的最新信息
    userInfo() {
      var that = this;
      userInfo({}).then((res) => {
        if (res.code == 200) {
          if (uni.getStorageSync('loginStatus') != 1) {  //  用户没有退出登录
            uni.setStorageSync("userInfo", res.result);
            // 当前用户的邀请码
            var my_inviter = Number(res.result.id).toString(16);
            getApp().globalData.my_inviter = my_inviter;
            getApp().globalData.sharePath = `/pages/tabBar/gallery?inviter=${my_inviter}`;
            uni.setStorageSync('myInviter', my_inviter); // 存储用户邀请码
          } else {
            uni.setStorageSync("userInfo", {});
          }
        } else {
          uni.removeStorageSync('taskId'); //清除任务ID
          uni.removeStorageSync('userInfo'); // 清除用户信息
          uni.removeStorageSync('token'); //清除用户token
          uni.removeStorageSync('loginType'); //清除用户账号登录类型
        }
      });
    },


  },
  onLaunch: function () {
    let that = this;
    //#ifdef MP-WEIXIN

    let { miniProgram } = uni.getAccountInfoSync();
    that.globalData.appid = miniProgram.appId;

    const updateManager = uni.getUpdateManager() // 小程序版本更新管理器
    updateManager.onCheckForUpdate(res => { // 检测新版本后的回调
      if (res.hasUpdate) { // 如果有新版本提醒并进行强制升级
        uni.showModal({
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false,
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              updateManager.onUpdateReady(res => { // 新版本下载完成的回调
                updateManager.applyUpdate() // 强制当前小程序应用上新版本并重启
              })
              updateManager.onUpdateFailed(res => { // 新版本下载失败的回调
                // 新版本下载失败，提示用户删除后通过冷启动重新打开
                uni.showModal({
                  content: '下载失败，请删除当前小程序后重新打开',
                  showCancel: false,
                  confirmText: '知道了'
                })
              })
            }
          }
        })
      }
    })
    //#endif 

    // loginType 2，手机账号密码登录  否则小程序登录
    let loginType = uni.getStorageSync('loginType');
    if (loginType == 2) { //手机账号密码登录
      refreshToken({ token: uni.getStorageSync('token') }).then((res) => {
        if (res.code == 200) {
          uni.setStorageSync('token', res.result.token);
          that.globalData.userInfo();
        } else if (res.code == 401) {
          uni.removeStorageSync('userInfo');
          uni.removeStorageSync('token');
        }
      })
      that.userLogin();
    } else { //小程序登录
      that.userLogin();
    }


    datajosn.settings((data) => {
      that.globalData.jsonGoods = data;
    })

  },

  methods: {

    userLogin: async function () {
      //#ifdef MP-WEIXIN
      // 登录
      let that = this;
      uni.login({
        provider: 'weixin',
        onlyAuthorize: true,
        success: async ({ code }) => {
          uni.login({
            provider: 'weixin',
            onlyAuthorize: true,
            success: (res) => {
              wxmAuth({ code: code },).then((res) => {
                if (res.code == 200) {

                  // 存储用户的openid
                  uni.setStorageSync('openid', res.result.openid);

                  let loginType = uni.getStorageSync('loginType');
                  if (loginType == 2) { return } //手机账号密码登录 拦截，不执行以下代码
                  uni.setStorageSync('token', res.result.token);
                  uni.setStorageSync('loginUser', res.result);

                  if (res.result.drawCount == 0) {
                    uni.showModal({
                      title: "温馨提示",
                      content: "不知道如何使用灵创AI？点击查看获取新使用教程!",
                      confirmText: "查看",
                      cancelText: "不用我会",
                      success: function (res) {
                        if (res.confirm) {
                          uni.navigateTo({
                            url: '/pmnie/mnie/webview?type=8'
                          })
                        }
                      }
                    })
                  }
                  if (uni.getStorageSync('loginStatus')) {
                    return
                  }

                  // 用户未设置密码
                  if (res.result.needPasseword && res.result.phone) {
                    uni.showModal({
                      title: '温馨提示',
                      content: '您还未设置登录密码，是否前往设置登录密码？',
                      confirmText: "去设置",
                      success: function (res) {
                        if (res.confirm) {
                          uni.navigateTo({
                            url: "/plogin/register?type=4",
                          })
                        }
                      }
                    });
                  }

                  // 用户token有效续期
                  refreshToken({ token: res.result.token }).then((res) => {
                    if (res.code == 200) {
                      uni.setStorageSync('token', res.result.token);
                      // 获取用户的最新信息
                      that.globalData.userInfo();
                    } else if (res.code == 401) {
                      uni.removeStorageSync('userInfo');
                      uni.removeStorageSync('token');
                    }
                  })


                } else if (res.code == 404) { //该用户为新用户
                  // uni.showModal({
                  //   title: "温馨提示",
                  //   content: "不知道如何使用灵创AI？点击查看获取新使用教程!",
                  //   confirmText: "查看",
                  //   cancelText: "不用我会",
                  //   success: function (res) {
                  //     if (res.confirm) {
                  //       uni.navigateTo({
                  //         url: '/pmnie/mnie/webview?type=8'
                  //       })
                  //     }
                  //   }
                  // })
                  // 存储以下信息 
                  uni.setStorageSync('session', res.result.session);
                  uni.setStorageSync('openid', res.result.openid);
                  let loginType = uni.getStorageSync('loginType');
                  if (loginType == 2) { return }
                  // 清除以下缓存
                  uni.removeStorageSync('userInfo');
                  uni.removeStorageSync('token');
                  uni.removeStorageSync('loginStatus');
                }
              })
            }
          })
        },
        fail: ({ errMsg }) => { }
      })
      //#endif 
    },

    // switchTheme() {
    //   let theme = 'night-theme'
    //   //修改主题
    //   this.cueGetTheme(theme)
    //   //设置主题缓存
    //   this.themeCache(theme)
    //   //设置 全局背景色
    //   this.getSystemBg()
    //   this.switchTheme(e)
    // },

  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style lang="scss">
/* uni-app中的条件判断语句 */
/* #ifdef APP-PLUS  || H5 */
uni-swiper .uni-swiper-dot {
  width: 8rpx;
  height: 8rpx;
}

uni-swiper .uni-swiper-dot-active {
  width: 8rpx;
  border-radius: 6rpx;
}

/* #endif */

/* #ifdef MP-WEIXIN */
wx-swiper .wx-swiper-dot {
  width: 8rpx;
  height: 8rpx;
  margin: 0;
}

wx-swiper .wx-swiper-dot-active {
  width: 8rpx;
  height: 8rpx;
  border-radius: 6rpx;
  margin: 0;
}

/* #endif */

.swiper-box {
  position: relative;
  padding-top: 0 !important;
}

.swiper-box swiper image,
.swiper-box .slide-image {
  width: 100%;
}

.service-container {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
}

.service-container .row .nickname {
  display: none !important;
}

.service-cell {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center !important;
  height: 100%;
  z-index: 2;
  border: 1px solid red;
  width: 100%;

}

.cell--bubble {
  width: 100rpx !important;
  height: 100rpx !important;
  opacity: 0;
}

.cell--btn-hover {
  opacity: 0 !important;
}

.wrapper {
  border: 1px solid red !important;
}

.service-cell .wrapper .row {
  border: 1px solid yellow !important;
}

/* 组件加载更多 */
.load-txt {
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
}

/*每个页面公共css */
.u-slider {
  width: 100% !important;
}

.small_padding .u-modal__content {
  padding-left: 12px !important;
  padding-right: 12px !important;
}

.u-cell__title-text {
  color: #fff;
}

.u-popup__content.data-v-3a231fda {
  border-radius: 32rpx
}

.u-safe-area-inset-bottom {
  padding-bottom: 0rpx;
}

.u-action-sheet__cancel-text.data-v-b62b882e .u-action-sheet__cancel-text.data-v-b62b882e {
  color: white !important;
}

view.data-v-b138c5b2,
scroll-view.data-v-b138c5b2,
swiper-item.data-v-b138c5b2 {
  /* display: none !important; */
  margin: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  width: 100%;
  transform: scaleY(0.5);
  border-color: #d6d7d9;
  height: 0 !important;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', 'Microsoft Yahei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

view,
image,
text {
  box-sizing: border-box;
  flex-shrink: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.justify-evenly {
  justify-content: space-evenly;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.items-baseline {
  align-items: baseline;
}

.items-stretch {
  align-items: stretch;
}

.self-start {
  align-self: flex-start;
}

.self-end {
  align-self: flex-end;
}

.self-center {
  align-self: center;
}

.self-baseline {
  align-self: baseline;
}

.self-stretch {
  align-self: stretch;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-auto {
  flex: 1 1 auto;
}

.grow {
  flex-grow: 1;
}

.grow-0 {
  flex-grow: 0;
}

.shrink {
  flex-shrink: 1;
}

.shrink-0 {
  flex-shrink: 0;
}

.relative {
  position: relative;
}

.u-flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  // align-items: center;
}

.u-flex-wrap {
  flex-wrap: wrap;
}

.u-flex-nowrap {
  flex-wrap: nowrap;
}

.u-col-center {
  align-items: center;
}

.u-col-top {
  align-items: flex-start;
}

.u-col-bottom {
  align-items: flex-end;
}

.u-row-center {
  justify-content: center;
}

.u-row-left {
  justify-content: flex-start;
}

.u-row-right {
  justify-content: flex-end;
}

.u-row-between {
  justify-content: space-between;
}

.u-row-around {
  justify-content: space-around;
}

.u-text-left {
  text-align: left;
}

.u-text-center {
  text-align: center;
}

.u-text-right {
  text-align: right;
}

.u-flex-col {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

// 定义flex等分
@for $i from 0 through 12 {
  .u-flex-#{$i} {
    flex: $i;
  }
}


.speak {
  width: 580rpx;
  border-radius: 20rpx;
  padding: 0 30rpx 50rpx;
  background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
}

.speak .speak-title {
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: 700;
}

.speak .speak-tips {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18, 18, 18, 0.46);
}

.speak .speak-item {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
  font-size: 26rpx;
}

.speak .speak-item .option {
  width: 42%;
  line-height: 74rpx;
  text-align: center;
  border-radius: 80rpx;
  color: white;
  border: 1px solid gray;
}

.speak .speak-item .active {
  color: #0F1817;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

button::after {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

button {
  /* background-color: transparent !important; */
  padding: 0 !important;
  /* line-height: inherit !important; */
  margin: 0 !important;
  /* width: auto !important; */
  /* font-weight: 500 !important; */
  border-radius: none !important;
}

button[disabled] {
  opacity: 0.7 !important;
}

/* @import "libs/colorui/index.scss"; */

/**
     * 工程自定义样式
     * 不支持的复合样式，条件编译在内部解决
     */
@import "common/css/index.scss";
</style>
