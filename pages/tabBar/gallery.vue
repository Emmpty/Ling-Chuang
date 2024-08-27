<template>
  <!-- <page-meta
    :background-color-top="cueTheme == 'day-theme' ? '#ffffff' : '#000000'"
    :background-color-bottom="cueTheme == 'day-theme' ? '#ffffff' : '#000000'"
  >
  </page-meta> -->
  <view
    class="u-page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <view
      class="swiper-box"
      style="padding:20rpx;"
    >
      <swiper
        :autoplay="true"
        :circular="true"
        indicator-active-color="#1AFFE8"
        indicator-color="#D9D9D9"
        :indicator-dots="advDrop > 1 ? true : false"
        style="height:324rpx;"
        v-if="advList.length > 0"
      >
        <block
          v-for="(item, index) in advList"
          :key="index"
        >
          <swiper-item
            v-if="item.hide == 0"
            @tap="openSheet(item)"
            style="height:324rpx;"
          >
            <image
              class="slide-image"
              :src="item.image"
              mode="widthFix"
              :show-menu-by-longpress="false"
              style="height:324rpx;"
            ></image>
          </swiper-item>
        </block>
      </swiper>
    </view>

    <u-sticky :bgColor="cueTheme == 'day-theme' ? '#fff' : '#141416'">
      <u-tabs
        :list="tabList"
        :current="tabCurrent"
        @change="tabChange"
        lineColor="#1affe8"
        :activeStyle="{
          color: '#1affe8',
          fontWeight: 'bold',
          transform: 'scale(1.05)'
        }"
        :inactiveStyle="{
          color: cueTheme == 'day-theme' ? '#666666' : '#fff',
          transform: 'scale(1)'
        }"
      >
        <view
          slot="right"
          style="padding-right: 1em"
        >
          <!-- <template>
            <image
              class="reload"
              :src="cueTheme == 'day-theme' ? '../../static/img/gallery/search_white.png' : '../../static/img/gallery/search_black.png'"
              alt=""
              @click="toManaBox()"
            ></image>
          </template> -->
          <template>
            <image
              class="reload"
              :src="cueTheme == 'day-theme' ? '../../static/img/gallery/search_white.png' : '../../static/img/gallery/search_black.png'"
              alt=""
              @click="getSearch()"
            ></image>
          </template>

          <template v-if="tabCurrent != 0">
            <image
              class="reload"
              :src="cueTheme == 'day-theme' ? '../../static/img/gallery/dressing.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/213c102764c575770023e1fb1b6387a6.png'"
              alt=""
              @tap="reload"
            ></image>
          </template>
        </view>
      </u-tabs>

      <scroll-view
        scroll-x="true"
        v-if="tabCurrent == 0"
      >
        <view class="wrap_subsection">
          <block
            v-for="(item, index) in recomList"
            :key="index"
          >
            <view
              :class="recomType == item.id ? 'subsection_item_check subsection_item' : 'subsection_item'"
              @click="recomTab(item.id)"
              v-if="item.hide == 0"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '' }"
            >
              {{ item.label }}</view>
          </block>
        </view>
      </scroll-view>
      <view
        style="height:20rpx;"
        v-if="tabCurrent == 1"
      ></view>
    </u-sticky>

    <!-- <view v-if="isupAppStatu" class="upAppBg">
      <view class="upAppBox">
        <view class="upAppBox_title">
          发现新版本 {{ versionApp.version || 0 }}
        </view>
        <view class="upAppBox_content" v-for="(item, index) in versionApp.update_content" :key="index">
          {{ item }}
        </view>
        <view v-show="updateprogress" style="width: 80%;margin-bottom: 30rpx;">
          <progress :percent="updatesum" activeColor="red" stroke-width="8" />
        </view>
        <view @click="upApp" class="upAppBox_btn">更新</view>
      </view>
    </view> -->

    <block v-if="!searchStatus && !isupAppStatu">

      <!-- 推荐 -->
      <view v-show="tabCurrent == 0">
        <waterfall_show
          :list="recommend"
          ref="uWaterfall"
          @clickBox="onClick"
        ></waterfall_show>
      </view>

      <!--最新  -->
      <view v-show="tabCurrent == 1">
        <waterfall_list
          :list="newList"
          ref="uWaterfall2"
        ></waterfall_list>
      </view>

      <!-- 热门 -->
      <view
        class="wrap"
        v-show="tabCurrent == 2"
        style="width:auto;"
      >
        <view class="">
          <view class="wrap_subsection">
            <view
              :class="rankType == index ? 'subsection_item_check subsection_item' : 'subsection_item'"
              v-for="(item, index) in rankSection"
              @click="sectionChange(index)"
              :key="index"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '' }"
            >{{ item }}</view>
          </view>
        </view>
        <waterfall_hot
          :list="dayRankList"
          ref="uWaterfall3"
        ></waterfall_hot>
      </view>
    </block>

    <u-back-top
      :scroll-top="scrollTop"
      top="600"
    ></u-back-top>

    <!-- 筛选弹窗 -->
    <u-popup
      :show="labelStatus"
      mode="bottom"
      @close="labelStatus = !labelStatus"
      border-radius="40"
    >
      <view
        class="label"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="label-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >筛选
          <image
            @click="labelStatus = false"
            :src="cueTheme != 'day-theme' ? '../../static/img/detail/colse.png' : '../../static/img/detail/colse_gray.png'"
          >
          </image>
        </view>
        <view class="label-size">
          <view
            class="label-size-list"
            @click="paintableSincere(0, '')"
          >
            <view
              v-if="cueTheme == 'day-theme'"
              :class="painIndex == 0 ? 'item active' : 'item blackb'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >全部</view>
            <view
              v-if="cueTheme != 'day-theme'"
              :class="painIndex == 0 ? 'item blackb' : 'item active'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >全部</view>
          </view>
        </view>
        <view :class="cueTheme == 'day-theme' ? 'label-name' : 'label-black'">可画同款</view>
        <view class="label-size">
          <view
            class="label-size-list"
            @click="paintableSincere(1, 1)"
          >
            <view
              v-if="cueTheme == 'day-theme'"
              :class="painIndex == 1 ? 'item active' : 'item blackb'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >免费</view>
            <view
              v-if="cueTheme != 'day-theme'"
              :class="painIndex == 1 ? 'item blackb' : 'item active'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >免费</view>
          </view>
          <view
            class="label-size-list"
            @click="paintableSincere(-1, -1)"
          >
            <view
              v-if="cueTheme == 'day-theme'"
              :class="painIndex == -1 ? 'item active' : 'item blackb'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >付费</view>
            <view
              v-if="cueTheme != 'day-theme'"
              :class="painIndex == -1 ? 'item blackb' : 'item active'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >付费</view>
          </view>
        </view>
        <view class="label-footer">
          <view
            class="resetting"
            @click="paintableSincere(0, '')"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >重置</view>
          <view
            class="deter"
            @click="gosearchList()"
          >确定</view>
        </view>
      </view>
    </u-popup>

    <!-- 画同款弹窗 -->
    <u-popup
      :show="popupStatus"
      mode="center"
      border-radius="40"
    >
      <view
        class="popup"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="popup-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >温馨提示</view>
        <view
          class="popup-tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >
          该作品画同款需要向作者支付“{{ maskInfo.isVisibles }}灵力”，确定要画同款吗？</view>
        <view class="popup-btn">
          <view
            class="item"
            @click="popupStatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
          >
            取消
          </view>
          <view
            class="item active"
            @click="sameModel(1)"
          >立即支付</view>
        </view>
      </view>
    </u-popup>

    <!--服务协议  -->
    <policy
      v-if="showPrivacy"
      @agreementStatus="agreementStatus"
    ></policy>

  </view>
</template>

<script>
import { galleryDayRankNew, galleryNewList, removeLike, addLike, galleryRecommend, } from "../../static/api/index.js";
import policy from "./components/policy/policy.vue";
import waterfall_show from "./components/gallery/zero-waterfallshow.vue";
import waterfall_list from "./components/gallery/zero-waterfallshowList.vue";
import waterfall_hot from "./components/gallery/zero-waterfallshowHot.vue";
import utils from "../../static/utils/utils";
import datajosn from "../../static/utils/datajosn";
export default {
  name: "index",
  components: {
    policy,
    waterfall_show,
    waterfall_list,
    waterfall_hot
  },
  props: {},
  data() {
    return {
      tabList: [{ name: "推荐" }, { name: "最新" }, { name: "热门" }],
      tabCurrent: 0,
      rankSection: ["　日榜　", "　周榜　", "　月榜　"],
      rankType: 0, //热门下标
      dayRankList: [], // 热门列表
      dayRankLast: 0,
      recommend: [],// 推荐列表
      arrId: [], // // 推荐列表分页Id

      newNum: 1,//最新分页
      newList: [],//最新列表
      newTotal: 0, //最新总条数
      redStatus: false, // 推荐筛选状态
      newStatus: false,// 最新筛选状态
      visStatus: false, // 热门筛选状态
      filterIndex: null, // 筛选状态 1公开 2隐藏
      prompt: '',//搜索关键词

      // 
      searchList: [],
      searchNum: 1,
      searchStatus: false,

      labelStatus: false,
      popupStatus: false,//
      maskInfo: {},
      painIndex: 0,
      scrollTop: 0,

      versionApp: {},//app信息
      isupAppStatu: false, // 更新提示框
      updatesys: '', // 更新系统型号
      isupAppList: {}, // 更新系统型号
      updatesum: 0, // 更新进度条
      updateprogress: false, // 更新进行状态
      version: '',
      showPrivacy: false,//是否显示隐私协议
      recomType: 0,  // 推荐分类下标
      recomList: [], // 推荐分类列表
      advList: [], //轮播列表
      advDrop: 0, //是否显示轮播点
    };
  },

  onLoad(option) {
    this.galleryRecommend();
    // 保存邀请码
    if (option.inviter) {
      uni.setStorageSync("inviter", option.inviter);
    }
    if (option.scene) {
      const code = decodeURIComponent(option.scene);
      uni.setStorageSync("inviter", code);
    }


    datajosn.settings((data) => {
      let advList = data.adv
      let advDrop = 0;
      advList.map((item, index) => {
        if (item.hide == 0) {
          advDrop += 1
        }
      })
      this.recomList = data.classifyType
      this.advDrop = advDrop
      this.advList = advList
    })

    // 是否需要弹出隐私协议
    //#ifdef MP-WEIXIN
    wx.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          this.showPrivacy = true;
          uni.hideTabBar()
        }
      },
      fail: () => { },
      complete: () => { }
    })
    //#endif 
  },

  // 上拉
  onReachBottom() {

    if (this.tabCurrent == 0) {  // 推荐
      this.galleryRecommend();
    }
    if (this.tabCurrent == 1) {// 最新
      if (this.newTotal != this.newList.length) {
        this.getNewList();
      } else {
        uni.showToast({
          title: "已加载全部了",
          icon: 'none',
          duration: 4000
        })
      }
    }
    if (this.tabCurrent == 2) {  // 热门
      this.getRankList();
    }
  },

  // 
  onRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 2000);
  },

  methods: {
    onClick() {

    },
    getTurntable() {
      uni.navigateTo({
        url: '/phome/lottery/turntable',
      });
    },

    openSheet(item) {
      if (item.type == 'page') {
        uni.navigateTo({
          url: item.target,
        });
      } else if (item.type == 'ma') {
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
      } else {
        uni.navigateTo({
          url: '/pmnie/mnie/webview?url=' + item.target,
        });
      }
    },

    agreementStatus() {
      this.showPrivacy = false;
      uni.showTabBar()
    },

    // 更新app
    // upApp() {
    //   let that = this;
    //   uni.showToast({
    //     title: "正在更新中，请稍后~",
    //     icon: 'none',
    //     duration: 4000,
    //   })
    //   const downloadTask = uni.downloadFile({
    //     url: that.versionApp.download_url,
    //     success: (res) => {
    //       if (res.statusCode === 200) {
    //         this.updateprogress = false
    //         plus.runtime.install(res.tempFilePath); // 自动安装apk文件
    //         plus.runtime.quit();
    //       } else {
    //         this.updateprogress = false
    //       }
    //     }
    //   })
    //   // 监控下载apk的进度
    //   downloadTask.onProgressUpdate((res) => {
    //     this.updatesum = res.progress
    //   });
    // },
    // toManaBox() {
    //   uni.navigateTo({
    //     url: "/phome/BlindBox/BlindBox",
    //   });
    // },
    getSearch() {
      let type = 1
      if (this.tabCurrent == 2) {
        type = 2
      }
      uni.navigateTo({
        url: "/phome/search?type=" + type,
      });
    },

    //返回顶部
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },

    //获取推荐列表
    galleryRecommend() {
      let that = this;
      let data = {
        size: 10,
        exclude: that.arrId,
        type: this.recomType == 0 ? null : this.recomType
      }
      if (that.redStatus) {
        data.isVisible = 1;
      } else {
        delete data.isVisible;
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      galleryRecommend(data).then(res => {
        if (res.code == 200) {
          let arrId = that.arrId;
          if (that.arrId.length == 100) {
            arrId.splice(0, 10)
          }
          res.result.map(item => {
            item.isVisible = item.isVisible
            item.isVisibles = Math.abs(item.isVisible)
            arrId.push(item.id)
          })
          that.arrId = arrId;
          setTimeout(function () {
            uni.hideLoading()
            that.recommend = that.recommend.concat(res.result);
          }, 300)
        }
      })
    },

    // 画廊切换 
    tabChange({ index }) {
      this.tabCurrent = index;
      this.prompt = '';//清空关键词
      this.searchStatus = false;
      this.$refs.uWaterfall && this.$refs.uWaterfall.clear();
      this.$refs.uWaterfall2 && this.$refs.uWaterfall2.clear();
      this.$refs.uWaterfall3 && this.$refs.uWaterfall3.clear();
      uni.pageScrollTo({
        scrollTop: 0
      })
      if (index == 0) {//推荐列表
        this.arrId = [];
        this.recomType = 0;
        this.recommend = [];
        this.galleryRecommend()
      } else if (index == 1) { //最新列表
        this.newNum = 1;
        this.painIndex = 0;
        this.getNewList();
      } else { //热门列表
        this.dayRankLast = 0;
        this.painIndex = 0;
        this.getRankList();
      }
    },

    // 推荐分类
    recomTab(typeId) {
      this.recomType = typeId;
      this.arrId = [];
      this.recommend = [];
      uni.pageScrollTo({
        scrollTop: 0
      })
      // this.onPageScroll({scrollTop:this.scrollTop})
      this.$refs.uWaterfall && this.$refs.uWaterfall.clear();
      this.galleryRecommend()
    },

    // 筛选 （推荐，最新，热门） 
    reload() {
      // if (this.tabCurrent != 0) {
      this.labelStatus = true;
      // return;
      // }
      // this.filterClose();   
    },

    // 刷选条件 画空
    paintableSincere(index) {
      this.painIndex = index;
      if (index == 0) { // 重置
        return;
      }
    },

    // 筛选开启关闭
    filterClose() {
      // this.filterModel =!this.filterModel;
    },

    // 筛选状态
    filterClick(e) {
      this.filterIndex = e; // 筛选状态 1公开 2隐藏
      if (this.tabCurrent == 0) {
        this.redStatus = e == 2 ? true : false;
        this.recommend = [];
        this.exclude = [];
        this.galleryRecommend();
      } else if (this.tabCurrent == 1) { // 最新
        // 选择弹窗 是否关键词 
        if (this.searchList.length > 0) {
          this.$refs.uWaterfall2 && this.$refs.uWaterfall2.clear();
        }
        this.newStatus = e == 2 ? true : false;
        this.isVisible = null;
        this.searchStatus = false;
        this.prompt = '';
        this.newNum = 1;
        this.newList = [];
        this.getNewList();
      } else {  // 热门
        this.visStatus = e == 2 ? true : false;
        this.dayRankLast = 0;
        this.dayRankList = [];
        this.getRankList();
      }
      this.filterClose();
    },


    gosearchList() {
      this.labelStatus = false;
      if (this.tabCurrent == 1) {
        // this.$refs.uWaterfall2.clear();
        this.newNum = 1;
        this.getNewList()
      }
      if (this.tabCurrent == 2) {
        this.$refs.uWaterfall3 && this.$refs.uWaterfall3.clear();
        this.dayRankLast = 1
        this.getRankList()
      }
    },

    // 获取最新数据列表
    getNewList() {
      let that = this;
      let temp = {
        pageNum: that.newNum,
        pageSize: 10,
        isVisible: this.painIndex == 0 ? null : this.painIndex,
      };
      uni.showLoading({ title: '加载中...', mask: true, })
      galleryNewList(temp).then((res) => {
        if (res.code == 200) {
          uni.hideLoading()
          that.newNum = that.newNum + 1;
          that.newTotal = res.result.total;
          that.newList = that.newList.concat(res.result.records);
        }
      });
    },

    // 热门切换 日榜 周榜 月榜
    sectionChange(index) {
      this.rankType = index;
      this.dayRankLast = 0;
      this.painIndex = 0;
      this.$refs.uWaterfall3 && this.$refs.uWaterfall3.clear();
      this.getRankList();
    },

    // 热门列表
    getRankList() {
      let that = this
      let temp = {
        type: that.rankType,
        isVisible: this.painIndex == 0 ? null : this.painIndex,
        last: that.dayRankLast,
      };
      galleryDayRankNew(temp).then((data) => {
        if (data.code == 200) {
          let resData = data.result.records;
          that.dayRankLast = data.result.last;
          that.dayRankList = that.dayRankList.concat(resData)
        }
      });
    },


    // 推荐点赞
    recommendLike(type, e) {
      let that = this;
      let recommend = that.recommend;
      recommend.map(item => {
        if (item.id == e.id) {
          item.isLike = true;
          item.likeCount += 1;
        }
      })
      that.recommend = [...recommend];

      // leftList[index].isLike=true;
      //   leftList[index].likeCount+= 1;
      //   addLike({id:item.id}).then(res => {
      //     if (res.code == 200) {
      //        leftList[index].isLike=true;
      //     }
      //   })
    },

    // 用户点赞
    addLike(type, item, index) {
      console.log(item, '000')
      // let userInfo = uni.getStorageSync("login");
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }
      let leftList = this.leftList;
      let rightList = this.rightList;
      let leftList2 = this.leftList2;
      let rightList2 = this.rightList2;
      if (type == 1) {
        leftList[index].isLike = true;
        leftList[index].likeCount += 1;
        addLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            leftList[index].isLike = true;
          }
        })
      } else if (type == 2) {
        rightList[index].isLike = true;
        rightList[index].likeCount += 1;
        addLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            rightList[index].isLike = true;
          }
        })
      } else if (type == 3) {
        leftList2[index].isLike = true;
        leftList2[index].likeCount += 1;
        addLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            leftList2[index].isLike = true;
          }
        })
      } else {
        rightList2[index].isLike = true;
        rightList2[index].likeCount += 1;
        addLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            rightList2[index].isLike = true;
          }
        })
      }
      // item.isLike = true;
      // item.likeCount += 1;
      // addLike({id:item.id}).then(res => {
      //   if (res.code == 200) {
      //     item.isLike = true;
      //   }
      // })
    },

    // 用户取消点赞
    removeLike(type, item, index) {
      if (!getApp().globalData.getLogin()) {
        return;
      }
      let leftList = this.leftList;
      let rightList = this.rightList;
      let leftList2 = this.leftList2;
      let rightList2 = this.rightList2;
      if (type == 1) {
        leftList[index].isLike = false;
        leftList[index].likeCount -= 1;
        leftList[index].likeCount = leftList[index].likeCount < 0 ? 0 : leftList[index].likeCount;
        removeLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            leftList[index].isLike = false;
          }
        })
      } else if (type == 2) {
        rightList[index].isLike = false;
        rightList[index].likeCount -= 1;
        rightList[index].likeCount = rightList[index].likeCount < 0 ? 0 : rightList[index].likeCount;
        removeLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            rightList[index].isLike = false;
          }
        })
      } else if (type == 3) {
        leftList2[index].isLike = false;
        leftList2[index].likeCount -= 1;
        leftList2[index].likeCount = leftList2[index].likeCount < 0 ? 0 : leftList2[index].likeCount;
        removeLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            leftList2[index].isLike = false;
          }
        })
      } else {
        rightList2[index].isLike = false;
        rightList2[index].likeCount -= 1;
        rightList2[index].likeCount = rightList2[index].likeCount < 0 ? 0 : rightList2[index].likeCount;
        removeLike({ id: item.id }).then(res => {
          if (res.code == 200) {
            rightList2[index].isLike = false;
          }
        })
      }
    },

    // 跳转详情
    goPreview(id) {
      // if(!getApp().globalData.getLogin()){
      //   return;
      // }
      uni.navigateTo({
        url: "/pclip/large?albumId=" + id,
      });
    },

    // 制作同款
    sameModel(e) {
      this.maskInfo = e != 1 ? e : this.maskInfo;
      this.popupStatus = !this.popupStatus;
      if (e == 1) {
        uni.reLaunch({
          url: '/pages/tabBar/index?id=' + this.maskInfo.id
        })
      }

    }

  },

  onShow() {

    // this.filterModel =false;
    // 清除记录画夹详情
    uni.removeStorageSync('albumName');
    let that = this;
    //  app 强制更新
    // #ifdef APP-PLUS
    uni.request({
      url: 'https://img.drawai.cn/android/androidupdate.json?time=' + utils.getTime(),
      method: 'GET',
      success: ({ data, statusCode }) => {
        that.versionApp = data;
        // 获取本地应用资源版本号
        plus.runtime.getProperty(plus.runtime.appid, (info) => {
          if (data.version == info.version) {
            that.isupAppStatu = true;
            uni.hideTabBar();
          }
        })
      },
    });
    //#endif

  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    if (this.tabCurrent == 0) {
      this.recommend = [];// 推荐列表
      this.arrId = []; // // 推荐列表分页Id
      this.$refs.uWaterfall && this.$refs.uWaterfall.clear();
      this.galleryRecommend();   // 推荐
    } else if (this.tabCurrent == 1) {//最新
      this.newNum = 1;
      this.$refs.uWaterfall2 && this.$refs.uWaterfall2.clear();
      this.getNewList();
    } else if (this.tabCurrent == 2) {    // 热门
      this.$refs.uWaterfall3 && this.$refs.uWaterfall3.clear();
      this.dayRankLast = 0;
      this.getRankList();
    }
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 618);
  },

  onReady() {

  },
  // 页面处理函数--用户点击右上角分享
  onShareAppMessage(options) {
    if (options.from === "button") {
      // 来自页面内分享按钮
      console.log(options.target);
    }
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



<style scoped="scoped" lang="scss">
.scroll {
  position: relative;
  height: 80rpx;
}

.tabber-tips {
  position: absolute;
  top: 0rpx;
  right: 0;
  background: white;
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
}

.tabber-tips image {
  width: 36rpx;
  height: 36rpx;
}

.tabber .tabber-item {
  display: inline-block;
  width: 130rpx;
  text-align: center;
  line-height: 60rpx;
  border-radius: 70rpx;
  border: 2rpx solid rgba(18, 18, 18, 0.08);
  margin: 10rpx;
  font-size: 24rpx;
}

.tabber .tabber-active {
  background: #121212;
  color: white;
}

.label {
  padding: 30rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.label-title {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 36rpx;
  color: #121212;
  font-weight: 500;
}

.label-title image {
  width: 42rpx;
  height: 42rpx;
  position: absolute;
  top: 10rpx;
  right: 0rpx;
}

.label-name {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  color: rgba(18, 18, 18, 0.66);
  font-weight: 400;
}

.label-black {
  line-height: 84rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: white;
}

.label-size .label-size-list {
  width: 33.3%;
  display: inline-block;
  text-align: center;
  font-size: 28rpx;
}

.label-size .label-size-list .item {
  height: 80rpx;
  width: 218rpx;
  line-height: 80rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.16);
  border-radius: 70rpx;
  margin: 8rpx;
  color: rgba(255, 255, 255, 0.66);
}

.label-size .label-size-list .active {
  background: #141416;
  color: white !important;
}

.label-size .label-size-list .blackb {
  background: rgba(50, 255, 187, 0.08);
  border-radius: 40rpx;
  opacity: 1;
  color: #141416;
  border: 2rpx solid #61ffff;
}

.label-footer {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 100rpx;
}

.label-footer .resetting {
  width: 36%;
  height: 86rpx;
  line-height: 86rpx;
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  opacity: 1;
  color: white;
  border: 2rpx solid #f8f8f8;
}

.label-footer .deter {
  width: 60%;
  height: 86rpx;
  line-height: 86rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 43rpx 43rpx 43rpx 43rpx;
  opacity: 1;
}

.u-page {
  min-height: 100vh;
}

.navadmin {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx;
  background: #141416;
}

.navadmin .input {
  width: 280px;
  height: 40px;
  background: #262628;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  padding-left: 20rpx;
}

.navadmin .inputv {
  width: 280px;
  height: 40px;
  background: #F5F5F5;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  padding-left: 20rpx;
}

.navadmin .navitem {
  width: 140rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 70rpx;
  border: 1px solid #1AFFE8;
  text-align: center;
  background: #262628;
  color: #1AFFE8;
  font-size: 26rpx;
  margin-top: 12rpx;
}

.reload {
  width: 34px;
  height: 34px;
  margin-top: 10rpx;
  margin-left: 20rpx;
}

.demo-warter {
  border-radius: 8px;
  margin: 5px;
  // background: #262628;
  padding: 10px;
  position: relative;
  text-align: right;
}

.chuang {
  color: white;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 70rpx;
  padding: 0 10rpx;
  background: #262628;
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 14rpx 14rpx;

  .title2 {
    width: 120rpx;
    overflow: hidden;
  }

  .shstatuss {
    width: 40rpx;
    height: 40rpx;
    margin-top: 10rpx;
  }

  .button {
    // line-height: 22rpx;
    // color: white;
    background: none;
    margin: 0 !important;
    padding: 0;

  }

  .item {
    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
      margin-right: 10rpx;
    }
  }
}

.waterfall-item {
  background: #141416;
}

.u-close {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
}

.demo-image {
  width: 100%;
  border-radius: 4px;
}

.demo-title {
  font-size: 30rpx;
  margin-top: 5px;
  color: $u-main-color;
}

.demo-tag {
  display: flex;
  margin-top: 5px;
}

.demo-tag-owner {
  // background-color: $u-error;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 4rpx 14rpx;
  border-radius: 50rpx;
  font-size: 20rpx;
  line-height: 1;
}

.demo-tag-text {
  border: 1px solid $u-primary;
  color: $u-primary;
  margin-left: 10px;
  border-radius: 50rpx;
  line-height: 1;
  padding: 4rpx 14rpx;
  display: flex;
  align-items: center;
  border-radius: 50rpx;
  font-size: 20rpx;
}

.demo-price {
  font-size: 30rpx;
  // color: $u-error;
  color: $u-tips-color;
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

.demo-shop {
  font-size: 22rpx;
  color: $u-tips-color;
  margin-top: 5px;
  display: flex;
  // justify-content: flex-end;
}

.load-icon {
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto 20rpx auto;
  display: block;
}

.load-txt {
  padding: 0 0 20rpx 0rpx;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}

.wrap_subsection {
  display: flex;
  margin: 0 20rpx;
  padding: 20rpx 0;

  .subsection_item {
    width: 64px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10rpx 0;
    color: #ffff;
  }

  .subsection_item_check {
    color: #141416;
    background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
    border-radius: 18px;
  }
}
</style>

<style scoped="scoped" lang="scss">
// 00000000000000000
.filter {
  background: #2E2E33;
  border-radius: 16px 16px 0px 0px;
  opacity: 1;
  z-index: 999;
  color: white;
  padding: 0 30rpx 40rpx;

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
  background: #262628;
  color: white !important;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.pubuBox {
  background: #141416;
  padding: 22rpx;
  height: 100%;
}

.pubuItem {
  column-count: 2;
  column-gap: 20rpx;
  break-inside: avoid;
  ;
  /*视为一个整体 不会被分开*/
}

.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background: #262628;
  /* // background-color: #141416; */
  break-inside: avoid;
  /*避免在元素内部插入分页符*/
  box-sizing: border-box;
  margin-bottom: 20rpx;
  box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
  position: relative;

  .shstatus {
    position: absolute;
    width: 54rpx;
    height: 54rpx;
    z-index: 9;
    margin: 20rpx;
  }

  .under {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220rpx;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: 600;
  }
}

.item-masonry image {
  width: 100%;
}

.listtitle {
  padding-left: 22rpx;
  font-size: 24rpx;
  padding-bottom: 22rpx;

  .listtitle2 {
    color: white;
    font-size: 26rpx;
    line-height: 32rpx;
    // font-weight: bold;
    // padding-top: 22rpx;
    display: flex;
    padding-right: 22rpx;
    justify-content: space-between;

    .avact {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }

    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
      right: 10rpx;
    }
  }

  .listtitle3 {
    font-size: 28rpx;
    color: #909399;
    line-height: 32rpx;
    padding-top: 22rpx;
  }
}

.Index {
  width: 100%;
  height: 100%;
}

.upAppBg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upAppBox {
  width: 600rpx;
  padding: 20rpx 0 50rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upAppBox_title {
  line-height: 80rpx;
  font-weight: bold;
}

.upAppBox_content {
  padding: 10rpx 0 0rpx;
  font-size: 26rpx;
}

.upAppBox_btn {
  margin-top: 50rpx;
  width: 500rpx;
  line-height: 80rpx;
  text-align: center;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 24px;
}
</style>
