<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F7F7F7' : '#141414' }"
  >
    <block v-if="pageStatus">

      <nav-bar
        :backState="1000"
        :homeState="1000"
        title="详情"
      />

      <view class="flex-col flex-auto group_3">

        <view
          class="flex-col justify-start items-start section_3"
          v-if="goods.status >= 0"
        >
          <view class="section-item">
            <image
              class="preview-img"
              mode="widthFix"
              :src="goods.detailUrl"
              :webp="true"
              @click="previewImg"
              style="border-radius:44rpx;"
            />
            <block v-if="pictureSize == 4">
              <view class="sud1 ident">图1</view>
              <view class="sud2 ident">图2</view>
              <view class="sud3 ident">图3</view>
              <view class="sud4 ident">图4</view>
            </block>
          </view>
        </view>

        <!-- 作品制作失败 -->
        <view
          class="section_3"
          v-if="goods.status < 0"
        >
          <view
            class="fail"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image src="../static/img/clip/icon_tan.png" />作品制作失败
          </view>
          <view style="color:red;font-size:28rpx">失败原因：{{ goods.errors }}</view>
        </view>


        <view
          class="refine"
          v-if="goods.status >= 0"
        >
          <block
            v-for="(item, index) in showListbtns"
            :key="index"
          >
            <block v-if="item.status">
              <view
                class="refine-itembox"
                :style="{ 'background': cueTheme == 'day-theme' ? '#121212' : '' }"
                @click="taskBtns(item)"
              >
                {{ item.ButtonnNme }}
              </view>
            </block>
          </block>
        </view>


        <view class="flex-col group_4 space-y-22">
          <view
            v-if="goods.modelInfo.model != 10"
            class="items-baseline space-x-2"
            :style="{ 'background': cueTheme == 'day-theme' ? '#EEEEEE' : '' }"
          >
            <view
              class="font_1"
              @click="copyKeyword(goods.prompt, '关键词')"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >
              <view>关键词：</view>
              <view :class="cueTheme == 'day-theme' ? 'copy copyActive' : 'copy'">
                <image
                  :src="cueTheme == 'day-theme' ? '../static/img/detail/copy2.png' : '../static/img/detail/copy.png'">
                </image> 复制
              </view>
            </view>
            <view
              class="font_2"
              @click="copyKeyword(goods.prompt, '关键词')"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.prompt ? goods.prompt : '未公开' }}</view>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >
              <view>创作 ID：</view>
            </view>
            <view
              class="font_2"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.uuid }}</view>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >创作时间：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              {{ $u.timeFormat(new Date(goods.updateTime), "yyyy-mm-dd hh:MM:ss") }}
            </text>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >模型：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.modelInfo.model == 11 ? 'AI商品图' : goods.modelInfo.modelName }}</text>
          </view>
          <view
            class="items-baseline space-x-2"
            v-if="goods.modelInfo.aspect"
            @click="savePoster"
          >
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >尺寸：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ formatAspect(goods.modelInfo.aspect) }}</text>
          </view>
        </view>

      </view>


      <view
        class="footer"
        v-if="goods.status >= 0"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#2A2A2A' }"
      >
        <view
          class="footer-item"
          :class="{ 'ai-product': goods.model == 11 }"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.08)' : '' }"
        >
          <view
            class="tablist"
            @click="moreFeatures(3)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/clip/icon33.png' : '../static/img/clip/icon3.png'">
            </image><br />
            <view>删除</view>
          </view>
          <view
            v-if="goods.model != 11"
            class="tablist"
            @click="remakeWorks()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon22.png' : '../static/img/detail/icon2.png'">
            </image><br />
            <view>重做</view>
          </view>
          <view
            class="tablist"
            @click="downLoad()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon44.png' : '../static/img/detail/icon4.png'">
            </image><br />
            <view>下载</view>
          </view>
          <view
            v-if="goods.model != 11"
            class="tablist"
            @click="existingApply()"
            style="width:66px;"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon33.png' : '../static/img/detail/icon3.png'">
            </image><br />
            <view>申请存证</view>
          </view>
        </view>
        <button
          class="footer-item btns"
          :class="{ 'ai-product': goods.model == 11 }"
          style="margin:0"
          @click="llustrateStatus()"
        >
          <image src="../static/img/detail/forward.png"></image>
          分享
        </button>
      </view>

      <!-- 作品制作失败 -->
      <view
        class="footer"
        v-else
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="footer-items"
          @click="moreFeatures(3)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >删除
        </view>
      </view>

      <!-- 细化 延展 极速高清弹窗 -->
      <view
        class="model"
        v-if="btnsStatus"
        @click="btnsStatus = false"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ btnsTitle }}
            <image
              @click="btnsStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>
          <view class="download">
            <block v-if="btnsTitle == '极速高清'">
              <view
                class="download-item"
                v-for="(item, index) in btnsList"
                :key="index"
                @click="refineOperate(index)"
              >{{
                item.ButtonnNme }}</view>
            </block>
            <block v-else>
              <view
                class="download-item"
                v-for="(item, index) in btnsList"
                :key="index"
                @click="refineOperate(index)"
              >{{ item.ButtonnNme }}</view>
            </block>
            <view
              class="download-tips"
              v-if="btnsTitle == '精致细化（5灵力）'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              精致细化：增加作品更多细节，平均5分钟出图</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '极速高清'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              极速高清：更高清，尺寸更大的图像</view>

          </view>
        </view>
      </view>

      <!-- 下载弹窗 -->
      <view
        class="model"
        v-if="downloadStatus"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >下载
            <image
              @click="downloadStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>
          <view class="download">
            <view
              class="download-item"
              v-for="(item, index) in 4"
              :key="index"
              @click="pictureDownload(index)"
            >下载{{
              index + 1 }}</view>
          </view>
        </view>
      </view>

      <!-- 细化弹窗 -->
      <view
        class="model"
        v-if="refineStatus"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >细化
            <image
              @click="refineStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>

          <!-- MJ画板 -->
          <block v-if="goods.model < 10">
            <view
              class="refine-item"
              @click="refineOperate(false)"
            >极速高清（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '免费' : '10灵力' }}）</view>
            <view
              class="refine-item"
              @click="refineOperate(true)"
            >精致细化（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '10灵力' : '20灵力' }}）</view>
          </block>

          <!-- 灵创画板 -->
          <block v-if="goods.model >= 10">
            <view
              class="refine-item"
              @click="refineOperate(false)"
            >极速高清（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '免费' : '2灵力' }}）</view>
            <view
              class="refine-item"
              @click="refineOperate(true)"
            >精致细化（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '5灵力' : '10灵力' }}）</view>
          </block>

          <view class="refine-tips">
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }">极速高清：</text>
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }">不改变作品细节,平均30秒出图</text>
          </view>
          <view class="refine-tips">
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }">精致细化：</text>
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }">增加作品更多细节,平均5分钟出图</text>
          </view>
          <view class="refine-tips"></view>
        </view>
      </view>


      <!-- 申请存证 -->
      <e-model
        :showModel="existingStatus"
        title="请确定是否存证"
        tips="存证后可生成区块链存证，该存证可在法院起诉中作为证据"
        @cancelHandle="existingStatus = false"
        @confirmHandle="existingConfirm()"
      ></e-model>

      <u-popup
        :show="illustrates"
        mode="center"
        @close="illustrates = false"
        border-radius="40"
      >
        <view
          class="speak"
          style="padding:0;overflow: hidden; "
        >
          <canvas
            id='canvas'
            class='canvas'
            canvas-id="firstCanvas"
          ></canvas>
        </view>
      </u-popup>
      <view
        v-if="posterImage.length == 0 && illustrates"
        class="smegma"
      ></view>

    </block>

    <sharePoster
      ref="sharePosterRef"
      :title="goods.model == 11 ? 'AI商品图' : '万圣节装扮'"
      :imgUrl="goods.detailUrl"
    ></sharePoster>

  </view>
</template>

<script>
import { tackdrawDetail, moveToGallery, attestAdd, taskDelete, collectList, moveToCollect, userInfo, taskNext, } from '../static/api/index.js'
import { taskDownload, taskUpscale, taskSuperreal } from '../static/api/detail.js'
import sharePoster from "@/components/sharePoster/index";
import shareMethod from "../static/utils/utils.js"

export default {
  components: { sharePoster },
  data() {
    return {
      goods: {
        modelInfo: {}
      },  // 作品详情
      moveModalShow: false,  //发布画廊弹窗
      illustrate: false,//发布画廊说明弹窗
      moveSelect: false,
      keyword: false, // 是否公开关键词
      moreIndex: 0,   // 更多功能下标
      showMore: false,// 更多功能状态
      collecStatus: false,// 合集弹窗状态
      collectList: [],  // 合集列表
      collectNum: 1,    // 合集列表分页
      collectTotal: 0,  // 合集个数
      shareStatus: false, // 是否开启分享弹窗
      downloadStatus: false, //图片下载弹窗状态
      refineStatus: false,//细化弹窗
      refineIndex: 0,//默认喜欢
      existingStatus: false,// 存证申请
      rechargeStatus: false,// 存证充值状态
      pictureSize: 0,
      redo: null,//是否重做
      userInfo: {},
      sameList: [
        { name: '所有人不可画同款', type: 0, },
        { name: '所有人可画同款', type: 1, },
        { name: '支付1灵力画同款', type: -1, },
        { name: '支付2灵力画同款', type: -2, },
        { name: '支付3灵力画同款', type: -3, },
        { name: '支付自定义灵力可见', type: '', },
      ],
      sameIndex: 0,
      sameValue: 1,
      customData: {
        ctx: null,
      },
      illustrates: false,
      id: 0,//作品ID
      btnsStatus: false,//细化延展极速高清按钮
      btnsList: [],
      btnsTitle: '',//弹窗标题
      showListbtns: [],  // 显示按钮
      pageStatus: false,
      spreadData: [{}], //新海报数据
      posterImage: [],
      my_inviter: '',
      canvasStatus: false,
    };
  },

  onLoad(res) {
    this.id = res.id;
    this.tackdrawDetail(res.id)
    this.getcollectList();
    userInfo({}).then((res) => {
      if (res.code == 200) {
        this.userInfo = res.result;
        this.my_inviter = Number(res.result.id).toString(16);
        uni.setStorageSync('myInviter', this.my_inviter); // 存储用户邀请码
      }
    });
  },
  mounted() { },
  methods: {
    formatAspect(aspect) {
      if (aspect == '1242:1660') {
        return '小红书'
      } else if (aspect == '1080:1920') {
        return '抖音'
      } else if (aspect == '800:800') {
        return '淘宝'
      }
      return aspect
    },
    // 制作海报
    llustrateStatus() {
      this.$refs.sharePosterRef.llustrateStatus()
    },
    // // 制作海报
    // llustrateStatus() {
    //   let that = this;
    //   if (that.posterImage.length > 0) {
    //     that.collectClick()
    //     return
    //   }
    //   uni.showLoading({
    //     title: '海报生成中',
    //     mask: true
    //   });
    //   that.illustrates = true;
    //   that.drawPoster()
    // },

    async drawPoster() {
      let that = this;
      let env = this.$baseURL == 'https://app.onefold.cn' ? 'trial' : 'release';
      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxec994b5f8ad8bfde/' + env;
      mpUrl = await this.downloadFilestoreImage(mpUrl);
      this.customData.ctx = uni.createCanvasContext('firstCanvas');
      uni.createSelectorQuery().select('#canvas').boundingClientRect(function (rect) {
        let canvasWidth = rect.width;
        let canvasHeight = rect.height
        that.customData.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        that.customData.ctx.rect(0, 0, canvasWidth, canvasHeight);
        that.customData.ctx.setFillStyle('white');
        that.drawRoundPath(that.customData.ctx, 0, 0, 326, 440, 14, 14, 14, 14)
        that.customData.ctx.fill();
        uni.getImageInfo({
          src: that.goods.detailUrl,
          success(res) {
            that.customData.ctx.drawImage(res.path, 0, 0, 326, 326,);
            that.customData.ctx.drawImage(mpUrl, 20, 340, 90, 90);
            that.customData.ctx.setFillStyle('#31312E');
            that.customData.ctx.setFontSize(20);
            that.drawText('万圣节装扮', "normal bold 19px Arial", "#121212", 130, 370)
            that.drawText('邀请您一起来体验灵创AI', "normal bold 13px Arial", "#A8A8A8", 130, 400)
            that.drawText('长按扫码立享免费作图', "normal bold 13px Arial", "#A8A8A8", 130, 420)
            that.customData.ctx.draw();
            that.illustrates = false;
            that.canvasStatus = true
            uni.hideLoading();
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: 'firstCanvas',
              success(res) {
                that.posterImage = [res.tempFilePath]
                that.collectClick()
              },
            })
          }
        })
      }).exec();
    },

    //  字体加粗
    drawText(text, font, fontColor, left, top) {
      this.customData.ctx.font = font;
      this.customData.ctx.fillStyle = fontColor;
      this.customData.ctx.fillText(text, left, top)
    },

    // 收藏
    collectClick() {
      let that = this;
      wx.showShareImageMenu({
        path: that.posterImage[0],
        success: (res) => {
          if (res.errMsg == 'showShareImageMenu:ok') {
            that.illustrates = false;
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
            that.illustrates = false;
          }
        }
      });
    },


    drawRoundPath(context, x, y, width, height, radian_1 = 0, radian_2 = -1, radian_3 = -1, radian_4 = -1) {
      // 设置弧度
      radian_2 = radian_2 === -1 ? radian_1 : radian_2;
      radian_3 = radian_3 === -1 ? radian_1 : radian_3;
      radian_4 = radian_4 === -1 ? radian_1 : radian_4;

      // 创建路径 - 绘制带圆边的矩形
      context.beginPath();
      context.moveTo(x + width / 2, y);
      context.arcTo(x + width, y, x + width, y + height, radian_1);
      context.arcTo(x + width, y + height, x, y + height, radian_2);
      context.arcTo(x, y + height, x, y, radian_3);
      context.arcTo(x, y, x + width, y, radian_4);
      // 关闭路径 - 结束绘制
      context.closePath();
      context.strokeStyle = "transparent";
      context.stroke();
      context.clip();
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
            // console.log(res, 'res520')
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


    // 更多功能列表
    moreFeatures(type) { //发布画廊
      let that = this
      that.moreIndex = type;
      if (type == 1) {  //开启更多功能
        that.moveModalShow = true; // 开启发布画廊
        that.showMore = false;
        that.moveFlag = false; //默认不公开画廊
        that.keyword = false; // 默认不公开关键词
        that.shareStatus = true;
      } else if (type == 2) { // 移至合集
        that.collecStatus = !that.collecStatus;
      } else if (type == 3) { // 删除
        uni.showModal({
          title: '温馨提示',
          content: '您确认要删除吗？',
          success: function (res) {
            if (res.confirm) {
              taskDelete({ id: that.goods.id }).then(data => {
                if (data.code == 200) {
                  uni.showToast({ title: "删除成功", icon: 'none', duration: 4000 })
                  setTimeout(function () { uni.navigateBack(); }, 1000)
                }
              })
            }
          }
        })
      }
    },

    // 作品详情
    tackdrawDetail(id) {
      uni.showLoading({ title: '加载中' });
      tackdrawDetail({ id: id, }).then(res => {
        if (res.code == 200) {
          uni.hideLoading()
          this.pageStatus = true;
          let goods = res.result;
          let btns = res.result.buttons ? JSON.parse(res.result.buttons) : [];
          let pictureSize = 0;
          let showListbtns = [
            { idx: 0, ButtonnNme: '精致细化（5灵力）', status: false, single: false },
            { idx: 1, ButtonnNme: '延展', status: false, single: false },
            { idx: 2, ButtonnNme: '变化', status: false, single: false },
            { idx: 3, ButtonnNme: '扩图', status: false, single: false },
            { idx: 4, ButtonnNme: '魔改', status: false, single: false },
            { idx: 5, ButtonnNme: '平移', status: false, single: false },
            { idx: 6, ButtonnNme: '极速高清', status: false, single: false },
            { idx: 7, ButtonnNme: '转为方形', status: false, single: false },
            { idx: 8, ButtonnNme: '减少细节', status: false, single: false },
            { idx: 9, ButtonnNme: '微调细节', status: false, single: false },
            { idx: 10, ButtonnNme: '精调细节', status: false, single: false },
            { idx: 11, ButtonnNme: '极速高清', status: false, single: false },
            { idx: 12, ButtonnNme: '局部重绘', status: false, single: false },
          ]; // 列表
          btns.map(item => {

            if (item.ButtonnNme.substring(0, 2) == '细化') {
              pictureSize += 1
              showListbtns[0].status = true;
              showListbtns[0].single = false;
              if (goods.model < 10) { //灵创画板不需要展示
                showListbtns[6].status = true;
              }
            }

            if (item.ButtonId.indexOf('upsample') == -1 && !showListbtns[0].single && pictureSize == 0) { //单个极速高清
              showListbtns[11].status = true;
              showListbtns[11].single = true;
            }
          })



          this.showListbtns = showListbtns
          this.pictureSize = pictureSize;
          goods.buttons = btns;
          goods.modelInfo.style = goods.modelInfo.style ? JSON.parse(goods.modelInfo.style) : {};
          goods.style = goods.modelInfo.style
          this.goods = goods;

          this.spread[0].pic = goods.url

          // 等待渲染完成在获取页面元素信息
          this.$nextTick(() => {
            let el = uni.createSelectorQuery().selectAll('.desc')
            el.boundingClientRect(res => {
              // 拿到类名为 desc 的全部元素信息
              this.elData = res;
            }).exec()
          })

        } else {
          this.pageStatus = true;
          uni.hideLoading()
        }
      }).catch(err => { })
    },

    // 关键词复制
    copyKeyword(text, name) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: name + "复制成功", icon: 'none', duration: 4000 })
        }
      });
    },


    // 
    limitsTtpe(index) {
      this.sameIndex = index;
    },

    onInput() {
      if (this.sameValue > 20) {
        this.sameValue = 20
      }
    },

    sameClick(type) {
      let that = this;
      if (type == 1) {
        if (that.sameValue <= 1) {
          uni.showToast({ title: "灵力设置最小值为1", icon: 'none', duration: 3000 })
          return
        }
        that.sameValue = parseInt(that.sameValue) - 1
      } else {
        if (that.sameValue >= 20) {
          uni.showToast({ title: "灵力设置最大值为20", icon: 'none', duration: 3000 })
          return
        }
        that.sameValue = parseInt(that.sameValue) + 1
      }
    },

    // 确定移至画廊
    moveToGallery() {
      let that = this;
      let data = {
        id: this.goods.id,
        isVisible: this.sameIndex == 5 ? -that.sameValue : that.sameList[that.sameIndex].type
      }
      moveToGallery(data).then(res => {
        if (res.code == 200) {
          uni.showToast({ title: "操作成功", duration: 3000 });
          setTimeout(function () {
            uni.navigateBack();
          }, 2000)
          this.moveModalShow = false;
          that.tackdrawDetail(that.id);
        } else {
          this.moveModalShow = false;
        }
      })
    },

    // 申请存证
    existingApply() {
      this.showMore = false;
      this.existingStatus = true;
    },

    // 确认存证
    existingConfirm() {
      let that = this;
      this.existingStatus = false
      shareMethod.attestAddFun(that.goods.id)
    },

    // 存证充值
    existingRecharge() {
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }
      uni.navigateTo({
        url: '/pmnie/mnie/recharge?epindex=attest'
      })
    },

    // 获取合集列表
    getcollectList() {
      let that = this;
      let data = {
        title: '',
        pageNum: this.collectNum,
        pageSize: 20,
      }
      collectList(data).then(res => {
        if (res.code == 200) {
          let resData = res.result.records;
          resData.map(item => {
            item.status = item.status
          })
          that.collectList = that.collectList.concat(resData);
          that.collectTotal = res.result.total;
          that.collectNum = that.collectNum + 1;
        }
      })
    },

    // 合集加载更多
    bindscrolltolower() {
      let that = this;
      if (that.collectList.length != that.collectTotal) {
        that.getcollectList()
      }
    },

    // 选择合集
    selectCollection(id) {
      let collectList = this.collectList;
      for (var i = 0; i < collectList.length; i++) {
        if (collectList[i].id == id) {
          collectList[i].status = !collectList[i].status;
        } else {
          collectList[i].status = false
        }
      }
    },

    // 是否开启合集
    closeColle() {
      this.collecStatus = !this.collecStatus;
      this.showMore = false;
    },

    // 确认添加合集
    addCollection() {
      let that = this;
      let collectList = that.collectList;
      let collectId = '';
      collectList.map(item => {
        if (item.status) {
          collectId = item.id
        }
      })
      moveToCollect({ taskList: [that.goods.id], collectId: collectId, }).then(res => {
        if (res.code == 200) {
          that.closeColle();
          uni.showToast({
            title: "添加成功", icon: 'none', duration: 3000
          })
          setTimeout(function () {
            uni.navigateBack();
            // uni.redirectTo({
            //   url:'/pclip/collection'
            // })
          }, 1500)
        }
      })
    },

    // 再创作
    remakeWorks() {
      this.showMore = false;
      let data = this.goods;
      console.log(data, 'data')
      if (data.flag == 8) {
        uni.navigateTo({
          url: '/plaboratory/applydetail?type=' + data.style.applet + "&prompt=" + data.prompt
        })
      } else {
        uni.navigateTo({
          url: '/plaboratory/ClayStyle'
        })
      }
    },

    // 图片放大
    previewImg: function (e) {
      let imgArr = [this.goods.url];
      uni.previewImage({
        current: this.goods.url,   //当前图片地址
        urls: imgArr,        //所有要预览的图片的地址集合 数组形式
      })
    },


    taskBtns(e) {
      let that = this;
      let data = that.goods;
      console.log(e, '0000  ')
      if (e.idx == 12) {
        uni.navigateTo({
          url: '/pclip/custom?url=' + data.url + "&goods=" + JSON.stringify(that.goods)
        })
        return
      }
      that.btnsStatus = !that.btnsStatus
      that.btnsTitle = e.ButtonnNme;
      that.btnsList = [];
      data.buttons.map(item => {
        console.log(item)
        if (e.ButtonnNme == '精致细化（5灵力）') {
          if (item.ButtonId.indexOf('upsample') >= 0) {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '延展') {
          if (item.ButtonnNme.substring(0, 2) == '延展') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '变化') {
          if (item.ButtonnNme.substring(0, 2) == '变化') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '扩图') {
          if (item.ButtonnNme.substring(0, 2) == '扩图') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '平移') {
          if (item.ButtonId.indexOf('pan_up') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向上'
            })
          } else if (item.ButtonId.indexOf('pan_down') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向下'
            })
          } else if (item.ButtonId.indexOf('pan_left') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向左'
            })
          } else if (item.ButtonId.indexOf('pan_right') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向右'
            })
          }
        } else if (e.ButtonnNme == '极速高清') {
          that.btnsList = [
            { ButtonnNme: '图1' },
            { ButtonnNme: '图2' },
            { ButtonnNme: '图3' },
            { ButtonnNme: '图4' }
          ]
        }
      })
    },

    // 选择细化
    refineType(index) {
      let that = this;
      that.refineStatus = true;
      that.refineIndex = index;
    },

    // 开始细化
    async refineOperate(e) {
      let that = this;
      let subList = {};
      console.log(e, '8888')
      uni.showLoading({ title: '加载中...', mask: true, })
      // that.refineStatus=false;
      // #ifdef MP
      let [err, setting] = await uni.getSetting({
        withSubscriptions: true
      });
      if (err || setting.subscriptionsSetting) {
        if (!setting.subscriptionsSetting.mainSwitch) {
          // 未打开消息提醒总开关
          console.log('订阅消息未开启');
        } else {

          var { miniProgram } = uni.getAccountInfoSync();
          if (miniProgram.appId == 'wx669342aeef7056e9') { //熊猫AI绘画  wx669342aeef7056e9
            var tmplIds = [
              'R0NH8O_55SnQ9w2SjeyysB-iNAXrLgftANtfYJwJ3T0',
            ]
          } else if (miniProgram.appId == 'wxc240253794ad4fa8') { // Ai画了个画 wxc240253794ad4fa8
            var tmplIds = [
              'EhyNVBUkPuQTwmW1DKgpNd0gsJhIL9jvDT1LbxSNmDM', //制作状态通知
            ]
          } else { // 灵创AI  AppID wxec994b5f8ad8bfde
            var tmplIds = [
              'O0qJT5bLPyJ4OEvdJQaalBZuCYLaaXK33vvfOqg_zbc', //制作状态通知
              '5lcJjf1V8X5lePJtn0eL-K7GWTad-Nby30U2ynuBgU8',
              '0vZdHaw50SXYC_KmYzjAbl4sJnG6e6DbaYMUA9dl_M4',
            ]
          }
          var subResp = await wx.requestSubscribeMessage({
            tmplIds
          });
          var moIdState = setting.subscriptionsSetting.itemSettings;
          subList = subResp;
          console.log({ moIdState, subResp });
        }
      } else {
        console.error("[getSetting]", err, setting);
      }
      // #endif


      let data = {
        id: that.goods.id,
        fastChannel: '0', // 加速通道加速通道时传1, 主播通道传2
        subList: subList,  // 订阅信息
        openid: uni.getStorageSync('openid') || '',
        appid: getApp().globalData.appid,
      }
      if (this.userInfo.vip) {
        data.fastChannel = 1;
      }
      if (this.userInfo.anchor == 1) {
        data.fastChannel = 2;
      }
      uni.hideLoading()
      data.serial = e; //
      data.high = this.btnsTitle == '极速高清' ? false : true;
      taskUpscale(data).then(res => {
        if (res.code == 200) {
          uni.removeStorageSync('albumName')
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
          uni.redirectTo({
            url: '/phome/make?id=' + res.result.id
          })
        }
      })

    },


    // 图片下载
    pictureDownload(index) {
      let that = this;
      uni.showLoading({
        title: '加载中...',
        mask: true,
      })
      that.downloadStatus = false;
      taskDownload({ id: that.goods.id, serial: index, }).then(res => {
        if (res.code == 200) {
          uni.hideLoading();
          shareMethod.downLoadImage(res.result.url)

        }
      })
    },
    downLoad() {
      this.showMore = false;
      if (this.pictureSize != 4) {
        shareMethod.downLoadImage(this.goods.url)
      } else {
        this.downloadStatus = true;
      }
      return;

      // #ifndef H5  
      getApp().globalData.downLoadImage(this.goods.url);
      // #endif

      // #ifndef MP  
      var fileName = new Date().getTime() + ".png";
      this.downloadByBlob(this.goods.url, fileName);
      // #endif

    },

    downloadByBlob(url, name) {
      let image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
      image.onload = () => {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, image.width, image.height)
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob)
          this.download(url, name)
          // 用完释放URL对象
          URL.revokeObjectURL(url)
        })
      }
    },

    download(href, name) {
      let eleLink = document.createElement('a')
      eleLink.download = name
      eleLink.href = href
      eleLink.click()
      eleLink.remove()
    },


  },

  //  用户点击右上角分享
  onShareAppMessage() {
    this.showMore = false;
    let goods = this.goods;
    return {
      path: '/pclip/large?albumId=' + goods.galleryId + "&taskId=" + goods.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: this.goods.thumbUrl,
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    return {
      path: '/pclip/large?albumId=' + goods.galleryId + "&taskId=" + goods.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }
};
</script>

<style scoped lang="scss">
.canvasb {
  min-height: 800rpx;
  width: 1024rpx;
  margin: 20rpx auto 0;
}

.smegma {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 999999;
}

.canvas {
  width: 326px;
  height: 440px;
  margin: 0 !important;
  border-radius: 32rpx !important;
  margin: 20rpx auto 0;
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


.popup {
  display: flex;
  justify-content: space-around;
}

.popup-title {
  text-align: center;
  line-height: 140rpx;
  color: white;
  font-weight: 600;
}

.section-item {
  position: relative;
  margin: 0 auto;
  width: 100%;
  .preview-img{
     /* 适配折叠屏双屏手机 */
    width: 100% !important;
  }
}

.section-item .ident {
  z-index: 999;
  width: 56rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: rgba(18, 18, 18, 0.46);
  color: white;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
}

.section-item .sud1 {
  position: absolute;
  top: 22rpx;
  left: 22rpx;
}

.section-item .sud2 {
  position: absolute;
  top: 22rpx;
  left: 54%;
}

.section-item .sud3 {
  position: absolute;
  top: 53%;
  left: 22rpx;
}

.section-item .sud4 {
  position: absolute;
  top: 53%;
  left: 54%;
}

.speak {
  width: auto;
  background: none;
  border-radius: 32rpx;
}

.speak .speak-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  line-height: 80rpx;
  border-radius: 80rpx;
}

.refine {
  margin-top: 42rpx;
  padding-bottom: 42rpx;
  border-bottom: 1px solid #2C2C2C;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

.refine .refine-itembox {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
  min-width: 164rpx;
  height: 80rpx;
  padding: 0 20rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  color: white;
  margin-bottom: 10rpx;
  margin-right: 10rpx;
}

.release {
  display: flex;
  justify-content: flex-end;
  margin-top: 42rpx;
}

.release .release-btn {
  width: 112rpx;
  height: 52rpx;
  line-height: 40rpx;
  text-align: center;
  background: rgba(41, 255, 175, 0.12);
  border-radius: 12rpx;
  border: 4rpx solid #0EF5E4;
  color: #0EF5E4;
  font-size: 24rpx;
}

.release .active {
  color: white !important;
  background: #121212 !important;
  border: 4rpx solid #121212;
}

.release .release-btn image {
  width: 32rpx;
  height: 32rpx;
  position: relative;
  top: 8rpx;
  left: -4rpx;
}

.models {
  padding: 0 0rpx;
}

.models-list {
  line-height: 80rpx;
  padding: 12rpx 20rpx;
}

.models-list .icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 10rpx;
  margin-right: 10rpx;
}

.models-btn {
  display: flex;
  justify-content: space-evenly;
  margin-top: 30rpx;
}

.models-btn .li {
  width: 165px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px;
  opacity: 1;
  border: 1px solid #FFFFFF;
}

.models-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px;
  color: #141416;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  background: #141416;
  bottom: 0;
  z-index: 999;
  display: flex;
  height: 150rpx;
  justify-content: space-between;
  padding: 16rpx 20rpx;
}

.footer .footer-item {
  width: 64%;
  height: 116rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 58rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-evenly;
  position: relative;

  &.ai-product {
    width: 49%;
  }
}

.footer-items {
  width: 80%;
  margin: 0 auto;
  height: 116rpx;
  line-height: 116rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 58rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-evenly;
  position: relative;
}

.tablist {
  text-align: center;
  width: 20%;
}

.tablist image {
  width: 44rpx;
  height: 44rpx;
  margin-top: 22rpx;
}

.footer .btns {
  color: #141416;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 58rpx;
  width: 35%;
  font-size: 36rpx;
  font-weight: 500;
  line-height: 116rpx;
  height: 116rpx;
  justify-content: center;
}

.footer .btns image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 44rpx;
  right: 10rpx;
}

.footer .footer-item .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: -2;
}

.footer .footer-item .more {
  position: absolute;
  left: 10rpx;
  top: -230rpx;
  width: 88px;
  background: #2A2A2A;
  z-index: -1;
  border-radius: 8rpx;
}

.footer .footer-item .more .more-list {
  height: 70rpx;
  line-height: 70rpx;
  padding-left: 20rpx;
}

.footer .footer-item .more .moreactive {
  color: #FF5D3B;
}

/*  */
.user {
  display: flex;
  justify-content: space-between;
  color: white;
  margin-top: 28rpx;
}

.user-item {
  display: flex;
}

.user-item .usericon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  position: relative;
  top: 10rpx;
}

.user-item text {
  margin-top: 20rpx;
}

/*  */
.page {
  background-color: #141416;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
}

.model-body {
  width: 300px;
  min-height: 162px;
  background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
  border-radius: 11rpx;
  color: white;
  position: fixed;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30rpx;
}

.model-body .title {
  padding: 30rpx 0;
  font-size: 16px;
  text-align: center;
  position: relative;
}

.model-body .title image {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  top: 22rpx;
  right: 0rpx;
}

.model-body .title-tips {
  font-size: 20rpx;
  text-align: left;
  padding: 20rpx 0;
}

.model-body .title-tips image {
  width: 28rpx;
  height: 28rpx;
  position: relative;
  top: 8rpx;
  left: 10rpx;
}

.model-body .title-illust {
  font-size: 26rpx;
  text-align: left;
  line-height: 40rpx;
  padding: 0 20rpx;
}

.download {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 30rpx;
}

.download .download-item {
  display: inline-block;
  width: 48%;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 16rpx;
  color: #000;
  height: 80rpx;
  line-height: 80rpx;
  margin-bottom: 20rpx;
}

.download .download-tips {
  font-size: 28rpx;
  margin: 10rpx 0 10rpx;
  word-break: break-all;
  white-space: pre-line;
  width: 100%;
}

.refine-item {
  width: 90%;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 16rpx;
  color: #000;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 auto 20rpx;
}

.refine-tips {
  font-size: 23rpx;
  line-height: 40rpx;
  height: 40rpx;
}

.title-selet {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  height: 82rpx;
  line-height: 82rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  position: relative;
}

.title-selet .icons {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  top: 26rpx;
  right: 20rpx;
}

.title-selet .iconavt {
  transform: rotate(180deg) !important;
}

.selist {
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 20rpx;
  z-index: 99;
  background: #2A2A2A;
  border-radius: 8rpx;
  padding: 20rpx 0
}

.selist .selist-item {
  line-height: 66rpx;
  padding-left: 24rpx;
  font-size: 26rpx;
}

.title-input {
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  line-height: 74rpx;
}

.title-input input {
  height: 82rpx;
  width: 160rpx;
  text-align: center;
}

.title-input .yyds {
  font-size: 46rpx;
  width: 76rpx;
  text-align: center;
}

.model-body .share-name {
  line-height: 40rpx;
  font-size: 16px;
  width: 388rpx;
  margin: 60rpx auto 10rpx;
}

.model-body .items {
  display: flex;
  text-align: center;
  padding: 20rpx 0;
  padding-left: 150rpx;
  font-size: 30rpx;
}

.model-body .items text {
  margin-left: 20rpx;
}

.model-body .btns {
  display: flex;
  justify-content: space-around;
  margin: 50rpx 0 30rpx;

}

.model-body .btns .btnsize {
  width: 126px;
  height: 44px;
  line-height: 44px;
  background: rgba(18, 18, 18, 0.04);
  border-radius: 70rpx;
  opacity: 1;
  margin: 0;
  border: 2rpx solid #E4E4E4;
  text-align: center;
}

.model-body .btns .actice {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border: none;
  color: #141416;
}

.group_3 {
  padding: 32rpx;
  overflow-y: auto;
}

.items-baseline:nth-child(1) {
  background: #2C2C2C;
  border-radius: 24rpx;
  padding: 20rpx;
}

.section_3 .fail {
  width: 320rpx;
  height: 320rpx;
  line-height: 320rpx;
  text-align: center;
  margin: 0 auto;
  /* border: 1px solid red; */
  color: red;
}

.section_3 .fail image {
  width: 50rpx;
  height: 50rpx;
  position: relative;
  top: 14rpx;
}

.grid {
  /* height: 686rpx; */
  /* display: grid; */
  /* grid-template-columns: repeat(2, 1fr); */
  /* row-gap: 32rpx; */
  /* column-gap: 32rpx; */
  text-align: center;
}

.grid-item {
  border-radius: 32rpx;
  /* width: 320px;
    height: 320px; */
}

.group_4 {
  margin-top: 52rpx;
  padding-bottom: 140rpx;
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
  font-size: 30rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 46rpx;
  color: rgba(255, 255, 255, 0.46);
  display: flex;
}

.font_1 image {
  width: 26rpx;
  height: 26rpx;
  position: relative;
  top: 6rpx;
  left: -4rpx;
}

.font_1 .copy {
  padding: 0rpx 12rpx;
  background: rgba(255, 255, 255, 0.1);
  font-size: 20rpx;
  height: 45rpx;
  line-height: 45rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
}

.font_1 .copyActive {
  border: 1px solid rgba(18, 18, 18, 0.08) !important;
}

.font_2 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  color: #ffffff;
  margin-top: 16rpx;
  word-break: break-all;
  white-space: pre-wrap;
}

.textprompt {
  /* 超过三行 */
  max-height: 160rpx;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  position: relative;
  /* border: 1px solid red; */
}

.more-text {
  position: absolute;
  right: 0;
  bottom: -4rpx;
  color: white;
  width: 160rpx;
  height: 22px;
  background: #141416;
  text-align: center;
  line-height: 18px;
}

.more-text text {
  padding: 4rpx 30rpx;
  width: 48px;
  height: 16px;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9px 9px 9px 9px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.text_3 {
  line-height: 20rpx;
}

.group_5 {
  margin-right: 12rpx;
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
  position: absolute;
  right: 61rpx;
  top: 36rpx;
}

.text_5 {
  color: #ffffff;
  font-size: 20rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 38rpx;
  padding: 10rpx 20rpx;
  width: 180rpx;
  text-align: center;
  border-radius: 70rpx;
  margin-top: 10rpx;
  border: solid 4rpx #1affe8;
}

.group_6 {
  margin-top: 36rpx;
  position: fixed;
  bottom: 60rpx;
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
}

.space-x-12>view:not(:first-child),
.space-x-12>text:not(:first-child),
.space-x-12>image:not(:first-child) {
  margin-left: 24rpx;
}

.text-wrapper_2 {
  padding: 32rpx 0;
  /* background-color: #ffffff; */
  background: #909399;
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 200rpx;
  height: 96rpx;
  border: solid 2rpx #ffffff;
  z-index: 999;
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
  padding: 32rpx 0;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 240rpx;
  height: 96rpx;
}

.text_7 {
  color: #141416;
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  line-height: 30rpx;
}
</style>