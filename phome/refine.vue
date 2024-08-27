<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="制作完成"
    />

    <view class="flex-col flex-auto group_3">

      <view
        class="flex-col justify-start items-start section_3"
        v-if="goods.status >= 0"
      >
        <view class="section-item">
          <image
            :src="goods.detailUrl"
            class="preview-img"
            mode="widthFix"
            webp="true"
            @click="previewImg"
            @error="onErrorHandler"
          />
          <block v-if="pictureSize == 4">
            <view class="sud1">图1</view>
            <view class="sud2">图2</view>
            <view class="sud3">图3</view>
            <view class="sud4">图4</view>
          </block>
        </view>
      </view>

      <!-- 作品制作失败 -->
      <view
        class="flex-col justify-start items-start section_3"
        v-if="goods.status < 0"
      >
        <view class="fail">
          <image src="../static/img/clip/icon_tan.png" />作品制作失败
        </view>
      </view>

      <view
        class="flex-col group_4 space-y-16"
        v-if="goods.status >= 0"
      >
        <view class="">
          <view
            class="flex-col justify-start items-center text-wrapper_2"
            v-for="(item, index) in goods.buttons"
            :key="index"
            @click="nextTask(goods.buttons[index], index)"
          >
            <text class="font_1">{{ item.ButtonnNme }}</text>
          </view>
          <view
            style="color:#ffffff;margin-top:20rpx;font-size:28rpx;"
            v-if="refineStatus && extension"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            细化：点击细化即可增加细节放大单张图片 <br /> 延展：点击延展即可出相似元素的四格图
          </view>
        </view>
      </view>

    </view>

    <view
      class="footer"
      v-if="goods.status >= 0"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="footer-item"
        @click="showMoreClick"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >更多
        <view
          class="mask"
          v-if="showMore"
        ></view>
        <view
          class="more"
          v-if="showMore"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view
            :class="moreIndex == 1 ? 'moreactive more-list' : 'more-list'"
            @click="moreFeatures(1)"
          >发布画廊</view>
          <view
            :class="moreIndex == 2 ? 'moreactive more-list' : 'more-list'"
            @click="moreFeatures(2)"
          >移至合集</view>
          <view
            :class="moreIndex == 3 ? 'moreactive more-list' : 'more-list'"
            @click="moreFeatures(3)"
          >删除</view>
        </view>
      </view>
      <view
        class="footer-item"
        @click="downLoad()"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >下载</view>
      <view
        class="footer-item"
        @click="existingEvidence()"
        style="width:66px;"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >申请存证</view>
      <view
        class="footer-item"
        @click="nextTask(redo, '')"
        v-if="redo"
        style="width:66px;"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >重做</view>
      <button
        class="footer-item btns"
        style="margin:0"
        v-if="goods.galleryId"
        type=""
        open-type="share"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >分享</button>
      <button
        class="footer-item btns"
        style="margin:0"
        v-else
        type=""
        @click="shareStatus = true"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >分享</button>
    </view>

    <!-- 制作失败只显示删除按钮 -->
    <view
      class="footer"
      v-else
    >
      <view
        class="footer-item"
        @click="moreFeatures(3)"
      >删除</view>
    </view>

    <view
      class="model"
      v-if="moveModalShow"
    >
      <view class="model-body">
        <view class="title">确定发布画廊吗？</view>
        <view class="items"><u-switch
            activeColor="#1affe8"
            v-model="keyword"
            size="16"
          ></u-switch> <text>同时公开关键词</text>
        </view>
        <view class="btns">
          <view
            class="btnsize"
            @click="moveModalShow = false"
          >取消</view>
          <view
            class="btnsize actice"
            @click="moveToGallery"
          >确定</view>
        </view>
      </view>
    </view>

    <!-- 移至合集 -->
    <u-popup
      :show="collecStatus"
      @close="closeColle"
      :round="10"
      :closeable="true"
    >
      <view
        class="popup-title"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >移至合集
      </view>
      <view
        class="models"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >
        <scroll-view
          scroll-y="true"
          style="height:600rpx;"
          @scrolltolower="bindscrolltolower"
        >
          <view
            class="models-list"
            v-for="(item, index) in collectList"
            :key="index"
            @click="selectCollection(item.id)"
          >
            <image
              class="icon"
              :src="item.status ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
            />
            {{ item.title }}
          </view>
        </scroll-view>
        <view class="models-btn">
          <view
            class="li"
            @click="closeColle"
          >取消</view>
          <view
            class="li active"
            @click="addCollection()"
          >确定</view>
        </view>
      </view>
    </u-popup>


    <!-- 分享确认弹窗 -->
    <view
      class="model"
      v-if="shareStatus"
    >
      <view
        class="model-body"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="title share-name"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >分享后作品会发布到画廊,关键词默认不公开</view>
        <view
          class="items items-switch"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        ><u-switch
            activeColor="#1affe8"
            v-model="keyword"
            size="16"
            @change="switchClick"
          ></u-switch> <text>公开关键词</text></view>
        <view class="btns">
          <view
            class="btnsize"
            @click="shareStatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#141416' }"
          >
            取消</view>
          <button
            class="btnsize actice"
            open-type="share"
            @click="moveToGallery"
          >分享</button>
        </view>
      </view>
    </view>

    <!-- 二次超分任务确认弹窗 -->
    <view
      class="model"
      v-if="fastStatus"
    >
      <view
        class="model-body"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="veryadd"
          @click="fastStatus = false"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >+</view>
        <view
          class="btns"
          style="margin-top:100rpx"
        >
          <view
            class="btnsize actice"
            @click="nextTask2(goods.buttons[fastIndex])"
            style="hieght:30rpx"
          >极速高清</view>
          <view
            class="btnsize actice"
            @click="nextTask(goods.buttons[fastIndex])"
            style="hieght:30rpx"
          >精致细化</view>
        </view>
        <view
          class="very-name"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          极速高清:不改变作品细节,平均30秒出图<br />精致细化:增加作品更多细节,平均5分钟出图</view>
        <view class="very-name"></view>
      </view>
    </view>

  </view>
</template>

<script>
import { tackdrawDetail, taskNext, moveToGallery, attestAdd, taskDelete, collectList, moveToCollect, taskUpscale } from '../static/api/index.js'

export default {
  components: {},
  data() {
    return {
      goods: {},
      redo: null,//是否重做
      moveModalShow: false,
      moveFlag: false,
      keyword: false,
      moreIndex: 0, //更多功能下标
      showMore: false, //更多功能状态
      collecStatus: false, //合集弹窗状态
      collectList: [], //合集列表
      collectNum: 1, //合集列表分页
      collectTotal: 0,  //合集个数
      shareStatus: false,// 分享弹窗状态
      refineStatus: false,// 是否有细化
      extension: false,// 是否有延展
      fastStatus: false,// 是否开起急速细化弹窗
      fastIndex: 0, //急速细化下标
      taskId: 0,
      pictureSize: 0,
    };
  },
  onLoad(res) {
    this.prompt = res.prompt;
    if (res.taskId) {
      this.taskId = res.taskId;
      this.tackdrawDetail(res.taskId)
      this.getcollectList();
    }
  },

  methods: {
    // 更多功能
    moreFeatures(type) { //发布画廊
      let that = this
      that.moreIndex = type;
      if (type == 1) {  //开启更多功能
        that.moveModalShow = true; // 开启发布画廊
        that.showMore = false;
      } else if (type == 2) { // 移至合集
        that.collecStatus = !that.collecStatus;
      } else if (type == 3) { // 删除
        taskDelete({ id: that.goods.id }).then(res => {
          if (res.code == 200) {
            uni.showToast({ title: "删除成功", icon: 'none', duration: 4000 })
            setTimeout(function () { uni.navigateBack(); }, 2000)
          }
        })
      }
    },

    // 作品详情
    tackdrawDetail(id) {
      tackdrawDetail({ id: id, }).then(res => {
        if (res.code == 200) {
          let goods = res.result;
          goods.updateTime = goods.updateTime ? goods.updateTime.replace('T', ' ') : '';
          let btns = JSON.parse(res.result.buttons);
          let pictureSize = 0;
          btns.map(item => {
            if (item.ButtonnNme.substring(0, 2) == '细化') {
              pictureSize += 1
              this.refineStatus = true;
            }
            if (item.ButtonnNme.substring(0, 2) == '延展') {
              this.extension = true;
            }
          })

          this.pictureSize = pictureSize;
          this.redo = btns.find(item => item.ButtonnNme === "重做");
          goods.buttons = btns.filter(item => item.ButtonnNme != "重做");
          this.goods = goods;
          // 等待渲染完成在获取页面元素信息
          this.$nextTick(() => {
            let el = uni.createSelectorQuery().selectAll('.desc')
            el.boundingClientRect(res => {
              this.elData = res;
            }).exec()
          })

        }
      }).catch(err => { })
    },

    // 图片加载失败
    onErrorHandler(err) {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      })
      let that = this;
      that.progressCountdown();
    },

    progressCountdown() {
      let that = this;
      let percentage = 0
      let appCount = setInterval(function () {
        // clearInterval(appCount);
        if (percentage == 4) {
          percentage = 0;
          uni.hideLoading()
          // location.reload()
          that.tackdrawDetail(that.taskId)
        } else {
          percentage += 1
        }
        console.log(percentage, 'nsecond')
      }, 1000);
    },

    //  作品细化
    async nextTask(btn, index) {
      if (btn.ButtonnNme.substring(0, 2) == '细化' && !this.fastStatus) {
        this.fastStatus = !this.fastStatus;
        this.fastIndex = index;
        return;
      }
      let buttonId = btn.ButtonId;
      let subList = {};
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
      let userInfo = uni.getStorageSync('userInfo');
      let data = {
        id: this.goods.id,
        buttonId: buttonId,
        subList: subList,   // 订阅信息
        openid: uni.getStorageSync('openid') || '',  //
        appid: getApp().globalData.appid || '',  //
      }
      if (userInfo.vip) { // 会员通道
        data.fastChannel = 2;
      } else if (userInfo.anchor == 1) { //主播通道
        data.fastChannel = 3;
      } else { //普通通道
        data.fastChannel = 0;
      }
      taskNext(data).then(res => {
        if (res.code == 200) {
          uni.redirectTo({
            url: '/phome/make?id=' + res.result.id
          })
        }
      })
    },

    //超分细化
    async nextTask2(btn) {
      // return;
      let buttonId = btn.ButtonId;
      let subList = {};
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
      let userInfo = uni.getStorageSync('userInfo');
      let data = {
        id: this.goods.id,
        buttonId: buttonId,
        serial: this.fastIndex,
        subList: subList,   // 订阅信息
        openid: uni.getStorageSync('openid') || '',  //
        appid: getApp().globalData.appid || '',  //
      }
      if (userInfo.vip) { // 会员通道
        data.fastChannel = 2;
      } else if (userInfo.anchor == 1) { //主播通道
        data.fastChannel = 3;
      } else { //普通通道
        data.fastChannel = 0;
      }

      //超分细化
      taskUpscale(data).then(res => {
        if (res.code == 200) {
          this.fastStatus = !this.fastStatus
          uni.redirectTo({
            url: '/phome/make?id=' + res.result.id
          })
        }
      })
    },

    // 关键词复制
    copyKeyword(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: "关键词复制成功", icon: 'none', duration: 4000 })
        }
      });
    },

    // 确定移至画册
    moveToGallery() {
      let data = {
        id: this.goods.id,
        status: 1,
        isVisible: this.keyword ? 1 : 0
      }
      moveToGallery(data).then(res => {
        if (res.code == 200) {
          uni.showToast({ title: "操作成功", duration: 3000 });
          setTimeout(function () { uni.navigateBack(); }, 2000)
          this.moveModalShow = false;
        } else {
          this.moveModalShow = false;
        }
      })
    },

    // 申请存证
    existingEvidence() {
      let that = this;
      let userInfo = uni.getStorageSync('userInfo');
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }
      if (userInfo.attest_usable <= 0) {
        uni.showModal({
          title: '温馨提示',
          content: '存证次数不足，是否前往充值',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pmnie/mnie/recharge?epindex=point'
              })
            }
          }
        });
        return;
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '存证后可以生成区块链存证，该存证可在法院起诉中作为证据。',
          success: function (res) {
            if (res.confirm) {
              attestAdd({ id: that.goods.id }).then(res => {
                if (res.code == 200) {
                  uni.showToast({ title: "申请成功", duration: 3000 });
                  // 存证成功需要更新用户信息接口
                  getApp().globalData.userInfo();
                  uni.showModal({
                    title: '温馨提示',
                    content: '区块链存证申请成功',
                    success: function (res) {
                      if (res.confirm) {
                        uni.showToast({ title: "功能正在开发中", duration: 2000 });
                      }
                    }
                  });
                }
              })
            }
          }
        });
      }
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
          setTimeout(function () { uni.navigateBack(); }, 1500)
        }
      })
    },

    // 再创作
    remake() {
      uni.switchTab({
        url: '/phome/refine?taskId=' + this.goods.id
      })
    },

    // 图片放大
    previewImg: function (e) {
      let imgArr = [this.goods.url];
      uni.previewImage({
        current: this.goods.url,
        urls: imgArr,
      })
    },

    // 图片下载
    downLoad() {
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

    // 关闭更多弹窗
    showMoreClick() {
      this.showMore = !this.showMore;
    }

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

<style scoped lang="scss">
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
  padding-bottom: 20rpx;
}

.models-btn .li {
  width: 165px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid #FFFFFF;
}

.models-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
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
  height: 140rpx;
  /* line-height:140rpx; */
  justify-content: space-evenly;
}

.footer .footer-item {
  width: 60px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 18px 18px 18px 18px;
  opacity: 1;
  border: 1px solid #141416;
  color: white;
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-top: 20rpx !important;
  position: relative;
  z-index: 2 !important;
}

.footer .btns {
  color: #141416;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 18px 18px 18px 18px;
  opacity: 1;
  /* z-index: -3 !important; */
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
  left: -10rpx;
  top: -290rpx;
  width: 68px;
  height: 182px;
  background: #2E2E33;
  z-index: -1;
  border-radius: 20px 20px 20px 20px;
}

.footer .footer-item .more .more-list {
  height: 70rpx;
  line-height: 70rpx;
  /* color: white; */
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
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.model-body {
  width: 340px;
  height: 200px;
  background: #2E2E33;
  border-radius: 16px 16px 16px 16px;
  color: white;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.model-body .veryadd {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  transform: rotate(-45deg);
  font-size: 86rpx;
  font-weight: 800;
}

.model-body .title {
  line-height: 100rpx;
  font-size: 16px;
}

.model-body .very-name {
  margin-left: 20rpx;
  text-align: left;
  padding-top: 40rpx;
  line-height: 50rpx !important;
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
  margin-top: 50rpx;
}

.model-body .btns .btnsize {
  width: 126px;
  height: 48px;
  line-height: 48px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.model-body .btns .actice {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  color: #141416;
  margin: 0 !important;
}

.group_3 {
  padding: 32rpx;
  overflow-y: auto;
}

.section_3 image {
  margin: 0 auto;
  position: relative;
}

.section-item {
  position: relative;
  margin: 0 auto;
  width: 100%;
  .preview-img {
     /* 适配折叠屏双屏手机 */
    width: 100% !important;
  }
}

.section-item .sud1 {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  z-index: 999;
  width: 80rpx;
  border-radius: 10rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

.section-item .sud2 {
  position: absolute;
  top: 12rpx;
  left: 52%;
  z-index: 999;
  width: 80rpx;
  border-radius: 10rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

.section-item .sud3 {
  position: absolute;
  top: 52%;
  left: 12rpx;
  z-index: 999;
  width: 80rpx;
  border-radius: 10rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

.section-item .sud4 {
  position: absolute;
  top: 52%;
  left: 52%;
  z-index: 999;
  width: 80rpx;
  border-radius: 10rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
}

.fail {
  width: 320rpx;
  height: 320rpx;
  line-height: 320rpx;
  text-align: center;
  margin: 0 auto;
  border: 1px solid red;
  color: red;
}

.fail image {
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
  font-size: 28rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 26rpx;
  color: #141416;
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
  background-color: #00ebd3;
  border-radius: 36rpx;
  width: 148rpx;
  height: 64rpx;
  line-height: 64rpx;
  color: #141416 !important;
  margin: 10rpx;
  display: inline-block;
  text-align: center;
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