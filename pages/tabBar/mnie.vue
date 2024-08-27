<template>
  <view
    class=" page"
    :class="cueTheme"
  >
    <view class=" flex-auto group_2">
      <view class="flex-col group_3 space-y-24">
        <view class="flex-col relative section_3">
          <view class="flex-row items-center space-x-16">
            <image
              class="image_7"
              :src="userInfo.avatar"
              mode="scaleToFill"
            />
            <view
              class="flex-col items-start space-y-14"
              v-if="userInfo.id"
            >
              <view class="text_3">
                <view class="text">{{ userInfo.name }} </view>
                <vipLevel
                  :userVipLevel="userInfo.level"
                  imgStyle="top: -6rpx;left: 10rpx;width: 126rpx;height: 45rpx;"
                ></vipLevel>
              </view>
              <view class="font_1 text_4">ID:{{ userInfo.id }}</view>
            </view>
            <view
              class="flex-col items-start space-y-14"
              v-else
              @click="gotoLogin"
            >
              <text class="text_3">去登录/注册</text>
            </view>
          </view>

          <view class="flex-row self-center equal-division">
            <view
              class="flex-col equal-division-item space-y-14"
              @click="followList(1)"
            >
              <text class="self-end22 font_2">{{ userInfo.info.follow || 0 }}</text>
              <text class="self-center font_3 text_5">关注</text>
            </view>
            <view
              class="flex-col equal-division-item space-y-14"
              @click="followList(2)"
            >
              <text class="self-end22 font_2">{{ userInfo.info.fans || 0 }}</text>
              <text class="self-center font_3 text_5">粉丝</text>
            </view>
          </view>
          <image
            class="image_6 pos"
            @click="getSetup"
            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839820200589975.png"
          />
        </view>
      </view>

      <view
        class="mnie"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="mnie-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >常用功能</view>
        <block
          v-for="(item, index) in commonList"
          :key="index"
        >
          <view
            class="mnie-list"
            v-if="index < 4"
            @click="onClick(index)"
          >
            <image :src="cueTheme == 'day-theme' ? item.icon2 : item.icon"></image>
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">{{ item.name }}</view>
          </view>
        </block>
        <view style="clear: both;"></view>
      </view>

      <view
        class="mnie"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="mnie-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >其他功能</view>
        <block
          v-for="(item, index) in commonList"
          :key="index"
        >
          <view
            class="mnie-list"
            v-if="index >= 4"
            @click="onClick(index)"
          >
            <block v-if="index == 8">

              <!-- #ifdef MP -->
              <cell
                class="add-cell"
                iconUrl=""
                contactText=" "
                style="z-index:22222;position: absolute;opacity: 0.00003;"
                url='https://work.weixin.qq.com/gm/1a483f4e22b172b99738394aaa5ef892'
              />
              <!-- #endif  -->

              <view class="btns">
                <image
                  :src="cueTheme == 'day-theme' ? item.icon2 : item.icon"
                  style="pointer-events: none;"
                ></image>
                <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">{{ item.name }}</view>
              </view>
            </block>
            <block v-else>
              <image :src="cueTheme == 'day-theme' ? item.icon2 : item.icon"></image>
              <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">{{ item.name }}</view>
            </block>
          </view>
        </block>
        <view style="clear: both;"></view>
      </view>


      <view class="swiper-box tn-padding-top tn-margin">
        <swiper
          :style="{ height: imgheights[current] }"
          @change="swiperChange"
          :autoplay="true"
          :circular="true"
          :indicator-dots="true"
        >
          <swiper-item
            v-for="(item, index) in bannerImgs"
            :key="index"
            @tap="openSheet(item.image)"
          >
            <image
              class="slide-image"
              @load="getswiperImgH($event, index)"
              :src="item.image"
              mode="widthFix"
              @longtap="openSheet(item.image)"
              :show-menu-by-longpress="false"
            >
            </image>
          </swiper-item>
        </swiper>
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

      <u-action-sheet
        :closeOnClickOverlay="true"
        :closeOnClickAction="true"
        cancelText="取消"
        :actions="sheetList"
        @close="sheetClose"
        @select="sheetClick"
        :show="sheetShow"
      ></u-action-sheet>

    </view>
  </view>
</template>

<script>
import { userInfo } from "../../static/api/index.js";
import shareMethod from "../../static/utils/utils.js";
import vipLevel from '@/components/vipLevel/vipLevel';
import datajosn from "../../static/utils/datajosn";
import utils from "@/static/utils/utils";

export default {
  components: { vipLevel },
  data() {
    return {
      tabIndex: "3",
      userInfo: {
        info: { follow: 0, fans: 0 }
      }, // 用户信息
      // 功能列表
      commonList: [
        { name: '我的主页', icon: '../../static/img/mnie/icon1.png', icon2: '../../static/img/mnie/icon11.png', url: "/psetup/homepage" },
        { name: '充值中心', icon: '../../static/img/mnie/icon2.png', icon2: '../../static/img/mnie/icon22.png', url: "/pmnie/mnie/recharge" },
        { name: '存证确权', icon: '../../static/img/mnie/icon3.png', icon2: '../../static/img/mnie/icon33.png', url: "/pmnie/mnie/evidence", },
        { name: '推广招募', icon: '../../static/img/mnie/icon4.png', icon2: '../../static/img/mnie/icon44.png', url: "/pmnie/mnie/webview" },
        { name: "免费灵力", icon: '../../static/img/mnie/menu1.png', icon2: '../../static/img/mnie/menu11.png', url: "/pmnie/mnie/getmana", },
        { name: "邀请好友", icon: '../../static/img/mnie/menu2.png', icon2: '../../static/img/mnie/menu22.png', url: "/pmnie/mnie/poster", },
        { name: "灵石提现", icon: '../../static/img/mnie/menu3.png', icon2: '../../static/img/mnie/menu33.png', url: "/pmnie/mnie/cash", },
        // {name:"帮助中心",icon:'../../static/img/mnie/menu4.png',url:"/pmnie/mnie/help",},
        { name: "帮助中心", icon: '../../static/img/mnie/menu4.png', icon2: '../../static/img/mnie/menu44.png', url: "/pmnie/mnie/webview?type=4", },
        { name: "加交流群", icon: '../../static/img/mnie/menu5.png', icon2: '../../static/img/mnie/menu55.png', url: "", },
        { name: "主题切换", icon: '../../static/img/mnie/menu6.png', icon2: '../../static/img/mnie/menu66.png', url: "", },
        { name: "联系客服", icon: '../../static/img/mnie/menu7.png', icon2: '../../static/img/mnie/menu77.png', url: "", },
        { name: "艺马", icon: '../../static/img/mnie/menu8.png', icon2: '../../static/img/mnie/menu88.png', url: "", },
        // {name:"退出登录",icon:'../../static/img/mnie/menu6.png',url:"",},
      ],
      filterModel: false,//主题切换弹窗状态
      current: '',
      imgheights: [],
      sheetUrl: "",
      sheetShow: false,
      sheetList: [
        { name: '联系客服', type: "turn", index: 0 },
        { name: '保存图片', type: "save", index: 1 },
      ],
      bannerImgs: [],  // 轮播图
      filterIndex: 0,//主题颜色
    };
  },
  onLoad() {

    // 轮播图
    let that = this;
    datajosn.settings((data) => {
      that.bannerImgs = data.banner;
    })

  },

  onShow() {

    if (uni.getStorageSync('token') && uni.getStorageSync('loginStatus') != 1) {
      this.userInfo = uni.getStorageSync('userInfo') || { info: { follow: 0, fans: 0 } }
    } else {
      this.userInfo = { info: { follow: 0, fans: 0 } };
    }
    // 清除记录画夹详情
    uni.removeStorageSync('albumName');

  },

  methods: {
    // 去登录
    gotoLogin() {
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
    },

    // 关注 粉丝 列表
    followList(type) {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: type == 1 ? "/psetup/followlist" : "/psetup/fanlist"
      })
    },

    swiperChange(e) {
      this.current = e.detail.current;
    },

    openSheet(url) {
      utils.contactCustomer()
      // this.sheetUrl = url;
      // this.sheetShow = true;
    },

    sheetClose() {
      this.sheetShow = false;
    },

    sheetClick(item) {
      if (item.type == "save") {
        shareMethod.downLoadImage(this.sheetUrl)
        // getApp().globalData.downLoadImage(this.sheetUrl);
      } else if (item.type == "turn") {
        utils.contactCustomer()
        return;

        // let url = this.bannerImgs[item.index].url
        // uni.navigateTo({
        //   url: "/pmnie/mnie/webview?url=" + url
        // })
      }
      this.sheetShow = false;
    },

    getswiperImgH(e, index) {
      //获取当前屏幕的宽度
      let winWid = uni.getSystemInfoSync().windowWidth;
      //减去两侧间距
      winWid = winWid - 16 * 2;
      //图片高度
      let imgh = e.detail.height;
      //图片宽度
      let imgw = e.detail.width;
      //计算的高度值
      let swiperH = winWid * imgh / imgw + 'px'
      //把每一张图片的高度记录到数组里
      this.imgheights[index] = swiperH;
      // 如果是第一次加载，初始化current
      if (this.current === undefined && index == 0) {
        this.current = 0;
      }
    },

    getSetup() {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: "/psetup/setup",
      });
    },

    //  
    onClick(index) {
      let that = this;
      let commonList = that.commonList;
      if (index != 3 && index != 7 && index != 8 && index != 9 && index != 10 && index != 11) {
        if (!getApp().globalData.getLogin()) { // 验证登录手机状态
          return;
        }
      }

      if (commonList[index].name == "联系客服") {
        utils.contactCustomer()
        return;
      }
      console.log('rrrrrr')
      if (commonList[index].url) {
        uni.navigateTo({
          url: commonList[index].url + "?userId=" + that.userInfo.id + '&uidtype=1',
        });
      } else if (commonList[index].name == '主题切换') {
        that.filterModel = true;
      } else if (index == 8) {
        return
      } else {

        uni.navigateToMiniProgram({
          appId: 'wx1947c42dbace0eb9',
          path: 'pages/index',
          extraData: {},
          envVersion: 'release',
          success(res) { },
          fail(res) { }
        })

        return
        uni.showModal({
          title: '温馨提示',
          content: '功能正在开发中,敬请期待~~',
          confirmText: "知道了",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { }
          }
        });
      }
    },
    filterClose() {
      this.filterModel = false;
    },

    // 
    filterClick(e) {
      //修改主题
      this.cueGetTheme(e)
      //设置主题缓存
      this.themeCache(e)
      //设置 全局背景色
      this.getSystemBg()
      // this.switchTheme(e)
      this.filterModel = false
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

<style scoped lang="less">
.btns {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.add-cell {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.enterprise-weixin {
  height: 88rpx !important;
  width: 160rpx;
}

.icon_row {
  display: none !important;
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

.mnie {
  color: white;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/461f1e4279d1298a43dd8887cbac1dfa.png');
  background-position: 0% 0%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 30rpx;
  margin: 30rpx 30rpx 0;
  padding-bottom: 20rpx;
}

.mnie .mnie-title {
  padding-left: 30rpx;
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 100rpx;
}

.mnie .mnie-list {
  width: 25%;
  height: 140rpx;
  float: left;
  text-align: center;
  font-size: 12px;
  margin-bottom: 20rpx;
  position: relative;
}

.mnie .mnie-list image {
  width: 70rpx;
  height: 70rpx;
  margin-bottom: 10rpx;
}

.swiper-box {
  position: relative;
  padding-top: 0 !important;
}

.swiper-box swiper image,
.swiper-box .slide-image {
  width: 100%;
}

.page {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20rpx;
  background-color: var(--bg-color-page);

  .group_2 {
    overflow-y: auto;

    .group_3 {
      padding: 30rpx 32rpx 0;

      .section_3 {
        padding: 32rpx 32rpx 40rpx;
        border-radius: 40rpx;
        background-image: url("https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839789045186863.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .space-x-16 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-left: 32rpx;
          }

          .image_7 {
            width: 136rpx;
            height: 136rpx;
            border: 1px solid #1affe8;
            border-radius: 50%;
          }
        }

        .equal-division {
          margin-top: 12rpx;

          .equal-division-item {
            text-align: center;
            padding: 12rpx 40rpx;
            width: 228rpx;

            .font_2 {
              font-size: 48rpx;
              font-family: Montserrat;
              line-height: 34rpx;
              font-weight: 700;
              color: #ffffff;
            }

            .font_3 {
              font-size: 24rpx;
              font-family: PingFangSC-Regular;
              line-height: 19rpx;
              color: #ffffff;
            }

            .text_5 {
              line-height: 21rpx;
              opacity: 0.8;
            }
          }
        }

        .space-y-14 {

          &>view:not(:first-child),
          &>text:not(:first-child),
          &>image:not(:first-child) {
            margin-top: 28rpx;
          }

          .text_3 {
            color: #ffffff;
            font-size: 36rpx;
            font-family: PingFangSC-Medium;
            line-height: 33rpx;
            display: flex;
          }

          .text_3 .text {
            max-width: 200rpx;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .text_4 {
            color: #ffffff99;
            line-height: 20rpx;
          }
        }

        .image_6 {
          width: 80rpx;
          height: 80rpx;
        }

        .pos {
          position: absolute;
          right: 20rpx;
          top: 20rpx;
        }
      }

      .space-y-8 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 16rpx;
        }

        .section_4 {
          padding: 40rpx 32rpx;
          background-color: #ffffff14;
          border-radius: 32rpx;

          .image_8 {
            width: 14rpx;
            height: 26rpx;
          }
        }
      }

      .font_1 {
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        line-height: 26rpx;
        color: #ffffff;
      }
    }

    .space-y-24 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 48rpx;
      }
    }

    .equal-division_2 {
      margin-top: -36rpx;
      background-color: #ffffff;
      backdrop-filter: blur(60rpx);

      .equal-division-item_2 {
        padding: 8rpx 0;
        width: 188rpx;

        .section_5 {
          background-color: #00000000;
          width: 48rpx;
          height: 48rpx;
        }

        .font_4 {
          font-size: 20rpx;
          font-family: PingFangSC;
          line-height: 19rpx;
          color: #ffffff;
        }

        .text_6 {
          line-height: 18rpx;
        }

        .image_10 {
          width: 48rpx;
          height: 48rpx;
        }

        .text_7 {
          color: #ffffff;
          font-size: 20rpx;
          font-family: PingFangSC-Regular;
          line-height: 19rpx;
        }

        .text_8 {
          line-height: 18rpx;
        }

        .text_9 {
          color: #1affe8;
        }
      }

      .space-y-6 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 12rpx;
        }
      }

      .group_4 {
        margin-left: 92rpx;
      }

      .space-y-4 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 8rpx;
        }
      }

      .group_5 {
        margin-left: 92rpx;
      }

      .pos_2 {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>