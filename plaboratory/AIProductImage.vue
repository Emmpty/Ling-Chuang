<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="AI商品图"
    />

    <view
      v-show="!imageUrl"
      class="padding-32"
    >
      <view
        class="upload-box u-flex u-col-center u-row-center"
        @click="uploadImage()"
      >
        <view class="upload-image-box u-flex u-flex-col u-col-center u-row-center">
          <image
            class="upload-image"
            src="https://img.drawai.cn/icon/Union%402x.png"
            mode="widthFix"
          ></image>
          <view class="upload-text">上传图片</view>
        </view>
      </view>
    </view>
    <!--  -->
    <autoSizeDrag
      v-show="imageUrl"
      ref="autoSizeDragRef"
      :segmentImg="imageUrl"
      :showCanvas="showCanvas"
      :ratio="currentRatio"
      :sizeItem="currentSizeItem"
      @reUpload="reUploadHandle"
    ></autoSizeDrag>

    <view class="page-title border-bottom padding-32 u-flex u-row-between u-col-center">
      <view class="ai-title">AI商品图</view>
      <view class="u-flex  u-col-center">
        <button
          open-type="share"
          type="button"
          class="dressup-share"
        >
          <image src="https://img.drawai.cn/icon/share.png"></image>分享
        </button>
        <button
          class="dressup-share"
          @click="llustrateStatus()"
        >
          <image src="https://img.drawai.cn/icon/share.png"></image>海报
        </button>
      </view>

    </view>


    <moveModel
      :value="translateY"
      catchtouchmove="ture"
      @overflowHandle="overflowHandle"
    >
      <template slot="content">
        <view class="content-box">
          <view class="page-item">
            <view class="page-title">尺寸比例</view>
            <view class="size-select-box u-flex u-flex-wrap u-col-center">
              <view
                class="scales-item u-flex-col u-col-center u-row-between"
                v-for="(item, index) in sizeList"
                :key="index"
                :class="{ 'scales-active': index == currentSizeIndex }"
                @click="changeSizeModel(item, index)"
              >
                <view class="u-flex-1 u-flex u-col-center u-row-center">
                  <template v-if="!item.img">
                    <view
                      class="ratio"
                      :style="{ width: item.width, height: item.height }"
                    ></view>
                  </template>
                  <template v-else>
                    <image
                      class="item-img"
                      :class="{ 'xiaohongshu': item.name == '1242:1660' }"
                      :src="item.img"
                      mode="aspectFit"
                    ></image>
                  </template>
                </view>
                <view
                  v-if="!item.img"
                  class="name"
                > {{ item.name }}</view>
              </view>
            </view>
          </view>
          <view
            class="page-item"
            style="margin-top: 44rpx;"
          >
            <view
              class="u-flex u-col-bottom"
              style="margin-bottom: 28rpx;"
            >
              <view
                class="scene-title"
                :class="{ 'no-active': sceneIndex != 0 }"
                @click="changeSceneIndex(0)"
              >推荐场景</view>
              <view
                class="scene-title"
                style="margin-left: 36rpx;"
                :class="{ 'no-active': sceneIndex != 1 }"
                @click="changeSceneIndex(1)"
              >自定义场景</view>
            </view>
            <template v-if="sceneIndex == 0">
              <scroll-view
                class="size-box u-flex u-flex-nowrap u-col-center"
                :scroll-x="true"
              >
                <view
                  v-for="(item, index) in suggestList"
                  :key="index"
                  class="size-item"
                  :class="{ 'active': index == currentTagIndex }"
                  @click="changeTagIndex(item, index)"
                >
                  <view class="size-text">{{ item.name }}</view>
                </view>
              </scroll-view>

              <ModelTemplate2
                :propList="templateList"
                :propIndex="templateId"
                selectOne
                @changeItemHandle="changeModelTemplate"
              ></ModelTemplate2>

              <!-- <modelTemplate
                :propList="templateList1"
                :propIndex="templateId"
                selectOne
                @changeItemHandle="changeModelTemplate"
              ></modelTemplate>

              <modelTemplate
                :propList="templateList2"
                :propIndex="templateId"
                selectOne
                @changeItemHandle="changeModelTemplate"
              ></modelTemplate> -->

            </template>

            <template v-else>
              <view class="scene-box">
                <view class="scene-title">请形容您想要商品置于什么环境？</view>
                <view class="textarea-box">
                  <textarea
                    class="textarea-content"
                    v-model="environment"
                    disable-default-padding
                    placeholder="例：商品在桌子上"
                    :auto-height="true"
                    maxlength="50000"
                  ></textarea>
                </view>
              </view>
              <view class="scene-box">
                <view class="scene-title">请形容您想要商品的背景有什么？</view>
                <view class="textarea-box">
                  <textarea
                    class="textarea-content"
                    v-model="background"
                    disable-default-padding
                    placeholder="例: 背景有树木，花朵"
                    :auto-height="true"
                    maxlength="50000"
                  ></textarea>
                </view>
              </view>
              <view class="scene-box">
                <view class="scene-title">请形容您想要商品的细节修饰增加什么？</view>
                <view class="textarea-box">
                  <textarea
                    class="textarea-content"
                    v-model="detail"
                    disable-default-padding
                    placeholder="例：光从窗户照着进来"
                    :auto-height="true"
                    maxlength="50000"
                  ></textarea>
                </view>
              </view>
            </template>
          </view>
        </view>
      </template>
    </moveModel>

    <view>
      <button
        class="footer-btn"
        @click="beginCreation()"
      >
        开始生成
        <template v-if="needEstimate != 0"> {{ `（${needEstimate}点数）` }} </template>
      </button>
    </view>

    <e-model
      :showModel="showImageTip"
      title="温馨提示"
      tips="当前图片像素过低，会影响图片输出质量，建议重新上传图片"
      cancelText="仍要制作"
      confirmText="重新上传"
      @cancelHandle="recognitionImage()"
      @confirmHandle="selectImage()"
    ></e-model>

    <sharePoster
      ref="sharePosterRef"
      title="AI商品图"
      imgUrl="https://cdn.lingchuang.art/lingchuang-static/image/plaboratory/ai-product-poster.png"
    ></sharePoster>

  </view>
</template>
<script>
import { create, start, suggest } from "@/static/api/draw.js";
// import { aiCopywriting, estimate } from "@/static/api/draw.js";
import modelTemplate from "@/components/creation-board/modelTemplate.vue";
import moveModel from "@/components/e-model/moveModel.vue"
import autoSizeDrag from "./components/autoSizeDrag/index";
import sharePoster from "@/components/sharePoster/index";
import utils from "@/static/utils/utils";
import ModelTemplate2 from "../components/creation-board/modelTemplate2.vue";

export default {
  components: { modelTemplate, moveModel, autoSizeDrag, sharePoster, ModelTemplate2 },
  data() {
    return {
      imageUrl: '',
      drawParam: {
        attachment: '',
        aspect: '1:1',
        input: [],
        suggest: '',
      },
      sceneIndex: 0,
      suggestList: [],
      currentTagIndex: -1,
      templateList: [],
      templateId: '',
      needEstimate: 0,
      sizeList: [
        { name: '1:1', width: '48rpx', height: '48rpx', ratio: 1 / 1, canvasWidth: 768, canvasHeight: 768, },
        { name: '2:3', width: '36rpx', height: '56rpx', ratio: 2 / 3, canvasWidth: 576, canvasHeight: 864, },
        { name: '3:2', width: '56rpx', height: '36rpx', ratio: 3 / 2, canvasWidth: 864, canvasHeight: 576, },
        { name: '3:4', width: '42rpx', height: '56rpx', ratio: 3 / 4, canvasWidth: 600, canvasHeight: 800, },
        { name: '4:3', width: '56rpx', height: '42rpx', ratio: 4 / 3, canvasWidth: 800, canvasHeight: 600, },
        { name: '9:16', width: '36rpx', height: '58rpx', ratio: 9 / 16, canvasWidth: 704, canvasHeight: 1280, },
        { name: '16:9', width: '58rpx', height: '36rpx', ratio: 16 / 9, canvasWidth: 1024, canvasHeight: 576, },
        { name: '1242:1660', width: '64rpx', height: '54rpx', ratio: 1242 / 1660, canvasWidth: 1242, canvasHeight: 1660, img: '/static/img/activity/xiaohongshu.png' },
        { name: '1080:1920', width: '36rpx', height: '64rpx', ratio: 1080 / 1920, canvasWidth: 1080, canvasHeight: 1920, img: '/static/img/activity/douyin.png' },
        { name: '800:800', width: '64rpx', height: '36rpx', ratio: 1 / 1, canvasWidth: 800, canvasHeight: 800, img: '/static/img/activity/taobao.png' },
      ],
      showImageTip: false,
      showCanvas: true,
      currentSizeIndex: 0,
      currentRatio: 1,
      environment: '',
      background: '',
      detail: '',
      currentTranslateY: 0,
      translateY: 700,
      touchBoxTop: 400,

    };
  },
  watch: {
    templateId(newValue, oldValue) {
      this.drawParam.suggest = newValue
    },
    currentTagIndex(newValue, oldValue) {
      console.log(newValue, this.suggestList[newValue]);
      this.templateList = this.suggestList[newValue].suggests
      this.templateId = this.suggestList[newValue].suggests[0].id
      this.drawParam.suggest = this.templateList[0].id
    },
  },
  computed: {
    currentSizeItem() {
      return this.sizeList[this.currentSizeIndex] || {}
    },
    // templateList1() {
    //   let centerIndex = this.templateList.length / 2
    //   if (centerIndex > 4) {
    //     return this.templateList.slice(0, centerIndex)
    //   }
    //   return this.templateList.slice(0, 4)
    // },
    // templateList2() {
    //   let centerIndex = this.templateList.length / 2
    //   if (centerIndex > 4) {
    //     return this.templateList.slice(centerIndex)
    //   }
    //   return this.templateList.slice(4)
    // },
  },

  onShow() {
    // 拿到剪裁后的图片
    uni.$once('cropImg', (data) => {
      console.log('监听到事件来自 update ，携带参数 msg 为：' + data.imageUrl);
      this.imageUrl = data.imageUrl
      this.translateY = 1040
      // this.touchBoxTop = 540
      // this.$refs.touchboxRef.setBottom(this.touchBoxTop)
    })

  },
  onLoad() {
    // this.getestimate()
    this.getTemplateList()
  },
  methods: {
    changeSceneIndex(index) {
      this.sceneIndex = index
      this.currentTagIndex = 0
      this.templateId = this.suggestList[0].suggests[0].id
    },
    changeTagIndex(item, index) {
      this.currentTagIndex = index
      this.templateId = this.suggestList[this.currentTagIndex].suggests[0].id
    },
    changeModelTemplate({ item, index }) {
      this.templateId = item.id
      console.log('>>>>>>>>>>>>>>this.templateId', this.templateId);
    },
    // 获取画板配置
    async getTemplateList() {
      try {
        const { result, code } = await suggest()
        if (code == 200) {
          this.suggestList = result.filter((item) => item.suggests && item.suggests.length > 0) || []
          this.currentTagIndex = 0

        }
      } catch (error) {
        console.error(error);
      }
    },
    // 制作海报
    llustrateStatus() {
      this.$refs.sharePosterRef.llustrateStatus()
    },
    changeSizeModel(item, index) {
      this.currentSizeIndex = index
      this.drawParam.aspect = item.name
      this.currentRatio = item.ratio
      if (this.currentTranslateY < 250) {
        if (this.imageUrl) {
          if (this.translateY > 1040) {
            this.translateY = 1040
          } else {
            this.translateY = 1041
          }
        } else {
          if (this.translateY > 700) {
            this.translateY = 700
          } else {
            this.translateY = 701
          }
        }
        this.showCanvas = true
        console.error('-------', this.translateY);
      }
    },
    uploadImage() {
      console.log(this.currentTranslateY);
      if (this.currentTranslateY < 250) {
        this.translateY = 702
        // this.touchBoxTop = 401
        // this.$refs.touchboxRef.setBottom(this.touchBoxTop)
        this.showCanvas = true
      }
      this.selectImage()
    },
    selectImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          this.showImageTip = false
          this.filePath = res.tempFilePaths[0]
          // 判断图片像素是否大于50W
          const result = await utils.checkImage(this.filePath)
          if (result) {
            this.showImageTip = result
          } else {
            this.recognitionImage()
          }
        }
      })
    },
    async recognitionImage() {
      try {
        uni.showLoading()
        // 获取上传图片所需参数、上传地址
        const result = await utils.upLoadImage(this.filePath)
        const drawRes = await create(result)
        this.showImageTip = false
        uni.hideLoading()
        if (drawRes.code == 200) {
          uni.navigateTo({
            url: `/plaboratory/AIProductScan?image=${decodeURIComponent(this.filePath)}&createId=${drawRes.result.id}`
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error(error);
      }
    },
    // 获取创作点数
    getestimate() {
      uni.$u.debounce(async () => {
        try {
          const { code, result } = await estimate({ type: 3, ...this.drawParam })
          if (code == 200) {
            this.needEstimate = result
          }
        } catch (error) {
          console.error(error);
        }
      }, 300)
    },
    async beginCreation() {
      console.log('>>>>>>>>>>>>>>', this.drawParam.suggest);
      if (!this.imageUrl) {
        return uni.showToast({ title: "请先上传参考图", icon: "none", platform: 2000 })
      }
      if (this.sceneIndex == 0) {
        this.drawParam.input = []
      } else {
        if (!this.environment && !this.background && !this.detail) {
          return uni.showToast({ title: "请至少输入一条自定义场景描述", icon: "none", platform: 2000 })
        }
        this.drawParam.suggest = ''
        this.drawParam.input = [this.environment, this.background, this.detail]
      }

      // this.touchBoxTop = 541
      // this.$refs.touchboxRef.setBottom(this.touchBoxTop)
      this.translateY = 1042
      this.showCanvas = true
      uni.showLoading()
      try {
        const filePath = await this.$refs.autoSizeDragRef.exportImage()

        // 获取上传图片所需参数、上传地址
        const result = await utils.upLoadImage(filePath)
        this.drawParam.attachment = result.attachment

        const drawRes = await start(this.drawParam)
        if (drawRes.code == 200) {

          this.resetData()
          uni.hideLoading()
          // uni.$emit('newCreativity')
          uni.setStorageSync("newCreativity", 1);
          uni.switchTab({
            url: '/pages/tabBar/clip'
          });

        }
      } catch (error) {
        uni.hideLoading()
        console.error('catch', error);
      }
    },
    resetData() {
      this.imageUrl = ''
      this.drawParam.attachment = ''
      this.drawParam.input = []
    },
    touchboxHandle(touch) {
      console.log('<<<<<<<<<<<<<<<', touch);
    },
    overflowHandle(translateY) {
      this.currentTranslateY = translateY
      if (translateY < 250) {
        this.showCanvas = false
      } else {
        this.showCanvas = true
      }
    },
    reUploadHandle() {
      this.imageUrl = ''
      this.translateY = 700
    },
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

<style lang="scss" scoped>
.page-content {
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 100vh;


  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
  }

  .scene-title {
    font-size: 36rpx;
    font-weight: bold;

    &.no-active {
      font-size: 28rpx;
      font-weight: 500;
      color: #959595;
    }
  }

  .border-bottom {
    border-bottom: 2rpx solid #2B2B2D;
  }

  .size-box {
    width: 100%;
    white-space: nowrap;
    // margin-bottom: 24rpx;

    .size-item {
      display: inline-block;
      position: relative;
      width: 156rpx;
      height: 64rpx;
      line-height: 64rpx;
      background: var(--bg-color-2);
      color: var(--text-color);
      border-radius: 32rpx;
      text-align: center;


      &.active {
        border: #00EBD3 2rpx solid;
        background: var(--bg-color-3);
        color: var(--text-color);
      }

      .size-text {}

      .vip-img {
        height: 24rpx;
        position: absolute;
        top: -12rpx;
        right: 8rpx;
      }
    }

    .size-item+.size-item {
      margin-left: 20rpx;
    }
  }

  .scene-box {
    .scene-title {
      font-size: 24rpx;
      font-weight: 500;
      color: #F5F5F5;
    }

    .textarea-box {
      margin-top: 16rpx;
      background-color: var(--bg-color-2);
      border-radius: 12rpx;
      margin-bottom: 24rpx;

      // padding: 20rpx;
      /deep/ textarea {
        line-height: 36rpx;
        padding: 20rpx;
      }

      .textarea-content {
        width: 100%;
        color: var(--text-color);
        width: 100% !important;
        font-size: 20rpx;
        line-height: 36rpx;
        height: 128rpx !important;
        word-break: break-all;
        white-space: pre-wrap;
        overflow: scroll;
      }
    }

  }

  .upload-box {
    height: 384rpx;
    background-color: var(--bg-color-2);
    border-radius: 32rpx;

    .upload-image-box {
      .upload-image {
        width: 72rpx;
        height: 56rpx;
      }

      .upload-text {
        margin-top: 20rpx;
        color: var(--text-color);
        font-size: 24rpx;
      }
    }

    .darw-image {
      height: 100%;
    }

  }

}

.size-select-box {
  .scales-item {
    width: 120rpx;
    height: 120rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    // border: 2rpx solid #6BE7D3;
    position: relative;
    margin: 0 10rpx 20rpx 6rpx;
    // padding: 20rpx;
    padding-bottom: 16rpx;
    font-size: 24rpx;

    &.scales-active {
      border: #00EBD3 2rpx solid;
      // color: #00EBD3;
    }

    .item-img {
      max-width: 48rpx;
      max-height: 48rpx;
      margin-top: 16rpx;

      &.xiaohongshu {
        max-width: 68rpx;
      }
    }

    .ratio {
      max-width: 80rpx;
      max-height: 66rpx;
      background: var(--bg-color-3);
      margin: 0 auto;
      border-radius: 4rpx 4rpx 4rpx 4rpx;
    }

    .name {
      color: var(--text-color);
      height: 20rpx;
      line-height: 20rpx;
      margin-top: 8rpx;
    }

    .custon-text {
      font-size: 24rpx;
      color: var(--text-color);
    }
  }
}

.footer-btn {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  z-index: 105;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  height: 96rpx;
  line-height: 96rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  bottom: 30rpx;
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
  bottom: calc(30rpx + env(safe-area-inset-bottom));

}

.ai-title {
  font-size: 44rpx;
  font-weight: 800;
}

.dressup-share {
  display: inline-block;
  width: 106rpx;
  height: 44rpx;
  line-height: 40rpx;
  font-size: 24rpx;
  text-align: center;
  border-radius: 22rpx 22rpx 22rpx 22rpx;
  border: 2rpx solid #1AFFE8;
  color: #1AFFE8;
  margin-left: 32rpx !important;
  background: none;

  image {
    width: 20rpx;
    height: 20rpx;
    position: relative;
    right: 4rpx;
    top: 2rpx;
  }
}

.padding-32 {
  padding: 32rpx;
}
</style>