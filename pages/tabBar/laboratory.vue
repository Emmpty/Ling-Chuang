<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <view
      class="nabbar"
      :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '' }"
    >
      <view
        :class="navIndex == 1 ? 'nabbar-item nabbar-active' : 'nabbar-item'"
        @click="laboratoryClick(1)"
      >创意</view>
      <view
        :class="navIndex == 2 ? 'nabbar-item nabbar-active' : 'nabbar-item'"
        @click="laboratoryClick(2)"
      >应用</view>
    </view>

    <!-- <view
      class="laboratory-title"
      :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '#fff' }"
    >创意功能</view> -->

    <view v-if="navIndex == 1">
      <view
        class="laboratory-item"
        @click="navClick(4)"
      >
        <image
          class="icon"
          src="https://cdn.lingchuang.art/sdv/aiker/aiker-video-bg.gif"
        ></image>
        <view class="model">
          <view class="model-name">{{ '图生视频' }}</view>
          <view class="model-tips">{{ '上传图片就能生成视频啦' }}</view>
        </view>
      </view>
      <view class="laboratory u-flex u-flex-wrap">
        <view
          class="laboratory-list"
          v-for="(item, index) in laboratoryList"
          :key="index"
          @click="navClick(item.type)"
        >
          <image
            class="icon"
            :src="item.img"
          >
          </image>
          <view class="model">
            <view class="model-name">{{ item.name }}</view>
            <view class="model-tips">{{ item.details }}</view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="navIndex == 2">
      <view class="apply">
        <view
          class="apply-list"
          v-for="(item, index) in appletsList"
          :key="index"
          @click="applydetail(index)"
        >
          <image
            class="icon"
            :src="item.image"
          > </image>
          <view class="model">
            <view class="model-name ">{{ item.name }}</view>
            <view class="model-tips ">{{ item.intro }}</view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>
<script>
import datajosn from "../../static/utils/datajosn";
export default {
  components: {},
  data() {
    return {
      originality: {},
      navIndex: 1,
      laboratoryList: [
        // {
        //   type: 1,
        //   name: "儿童节黏土风",
        //   details: '上传图片，即可生成儿童节专属黏土风',
        //   img: "https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/niantu1.png"
        // },
        {
          type: 5,
          name: "AI商品图",
          details: '上传图片，即可配置海量商品背景图',
          img: "https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/ai-product.png"
        },
        {
          type: 2,
          name: "图生词",
          details: '上传图片，即可得到关键词',
          img: "https://img.drawai.cn/icon/words2.png"
        },

        {
          type: 6,
          name: "智能抠图",
          details: 'AI智能识别，2秒完成抠图',
          img: "https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/cutout.png"
        },
        {
          type: 3,
          name: "抖音加水印",
          details: '上传图片，一键生成AI水印',
          img: "https://img.drawai.cn/icon/words1.png"
        },
      ],
      appletsList: [],
    };
  },

  onLoad(e) {
    // uni.request({
    //   url: 'https://img.drawai.cn/icon/originality.json',
    //   method: 'GET',
    //   success: ({ data, statusCode }) => {
    //     this.originality = data
    //   },
    // });

    datajosn.applets((data) => {
      this.appletsList = data
    })

  },

  methods: {

    laboratoryClick(type) {
      this.navIndex = type
    },

    navClick(type) {
      if (type == 1) {
        uni.navigateTo({
          url: '/plaboratory/ClayStyle'
        })
      }
      if (type == 2) {
        uni.navigateTo({
          url: '/phome/analysis'
        })
      }
      if (type == 3) {
        uni.navigateTo({
          url: '/phome/watermark'
        })
      }
      if (type == 5) {
        uni.navigateTo({
          url: '/plaboratory/AIProductImage'
        })
      }
      if (type == 6) {
        uni.navigateTo({
          url: '/plaboratory/AICutout'
        })
      }

      if (type == 4) {
        // #ifdef MP-WEIXIN
        uni.navigateToMiniProgram({
          appId: 'wxb365bb4eb4350a44',
          path: 'pages/tabBar/gallery',
          extraData: {},
          envVersion: 'release',
          success(res) { },
          fail(res) { }
        })
        // #endif

        // #ifdef H5
        window.open('https://m.aiker.art/#/pages/tabBar/index', '_blank');
        // #endif

        // #ifdef APP-PLUS
        let wechat = null
        plus.share.getServices(res => {
          wechat = res.find(i => i.id === 'weixin')
          if (wechat) {
            wechat.launchMiniProgram({
              corpid: 'gh_2cab7758e3ab',  // 微信小程序原始id，不是appid
              path: '/pages/tabBar/index',
              type: 0,
              webUrl: 'https://m.aiker.art/#/pages/tabBar/index'
            }, (src) => {
              console.log('launchMiniProgram success', src)
            }, (err) => {
              console.error('launchMiniProgram error', err)
            })
          } else {
            uni.showToast({
              title: '当前环境不支持微信操作', icon: "error"
            });
          }
        });
        // #endif
      }
    },
    applydetail(index) {
      uni.navigateTo({
        url: '/plaboratory/applydetail?type=' + index
      })
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

<style lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx;

  .nabbar {
    display: flex;
    justify-content: space-between;
    width: 408rpx;
    height: 92rpx;
    line-height: 92rpx;
    margin: 0 auto 32rpx;
    background: #353535;
    border-radius: 46rpx 46rpx 46rpx 46rpx;

    .nabbar-item {
      flex: 1;
      color: #C5C5C5;
      font-size: 36rpx;
      font-weight: 500;
      text-align: center;
    }

    .nabbar-active {
      width: 204rpx;
      height: 92rpx;
      color: #141416;
      background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
      border-radius: 48rpx 48rpx 48rpx 48rpx;
    }
  }

  .laboratory-title {
    font-weight: bold;
    color: #FFFFFF;
    font-size: 40rpx;
    padding-top: 20rpx;
    padding-bottom: 32rpx;
  }

  .laboratory-item {
    position: relative;
    width: 100%;
    height: 356rpx;
    margin-bottom: 34rpx;
    border-radius: 16rpx;
    border: 2rpx solid #353535;
    box-sizing: content-box;

    .icon {
      width: 100%;
      height: 356rpx;
      border-radius: 16rpx;
    }

    .model {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 76rpx;
      background: rgba(69, 69, 69, 0.7);
      border-radius: 0rpx 0rpx 14rpx 14rpx;
      color: white;
      padding: 10rpx 20rpx;

      .model-name {
        font-size: 24rpx;
        font-weight: bold;
        line-height: 36rpx;
      }

      .model-tips {
        font-size: 16rpx;
        color: #C5C5C5;
      }
    }
  }


  .apply {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .apply-list {
      position: relative;
      width: 50%;
      height: 356rpx;
      margin-bottom: 32rpx;

      .icon {
        width: 100%;
        height: 356rpx;
        border-radius: 20rpx;
      }

      .model {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(31, 29, 29, 0.25), rgba(31, 29, 29, 0.95));
        border-radius: 0rpx 0rpx 14rpx 14rpx;
        color: white;
        padding: 12rpx 20rpx 14rpx 20rpx;

        .model-name {
          font-size: 32rpx;
          font-weight: bold;
          line-height: 36rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .model-tips {
          margin-top: 6rpx;
          font-size: 24rpx;
          color: #C5C5C5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .apply-list:nth-child(odd) {
      padding-right: 15rpx;

      .model {
        right: 15rpx;

      }
    }

    .apply-list:nth-child(even) {
      padding-left: 15rpx;

      .model {

        left: 15rpx;
      }
    }
  }



  .laboratory {
    // display: flex;
    // justify-content: space-between;


    .laboratory-list {
      position: relative;
      width: calc(50% - 15rpx);
      height: 356rpx;
      margin: 0 18rpx 24rpx 0;
      border-radius: 16rpx;
      border: 2rpx solid #353535;
      box-sizing: content-box;

      .icon {
        width: 100%;
        height: 356rpx;
        border-radius: 10rpx;
      }

      .model {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 76rpx;
        background: rgba(69, 69, 69, 0.7);
        border-radius: 0rpx 0rpx 14rpx 14rpx;
        color: white;
        padding: 10rpx 20rpx;

        .model-name {
          font-size: 24rpx;
          font-weight: bold;
          line-height: 36rpx;
        }

        .model-tips {
          font-size: 16rpx;
          color: #C5C5C5;
        }
      }
    }

    .laboratory-list:nth-of-type(even) {
      margin-right: 0;
    }

  }
}
</style>