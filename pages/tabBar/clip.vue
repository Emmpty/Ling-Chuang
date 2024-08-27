<template>
  <view
    class="clip page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <view
      class="logged"
      v-if="!userInfo.id"
      :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', }"
    >您还未登录哦~
    </view>

    <view style="height:32rpx;"></view>
    <u-sticky
      offset-top="0"
      :bgColor="cueTheme == 'day-theme' ? '#fff' : '#141416'"
    >
      <view
        class="navtab"
        :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '' }"
      >
        <view
          :class="navtabIndx == index ? 'navtab-item navtab-active' : 'navtab-item'"
          v-for="(item, index) in navtabList"
          :key="index"
          @click="navtabClick(index)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#656565' : '#fff', }"
        >
          {{ item }}
        </view>
      </view>
      <view style="height:36rpx;"></view>

      <view
        class="tabs"
        v-if="navtabIndx == 0"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <block
          v-for="(item, index) in tabsList"
          :key="index"
        >
          <view
            v-if="cueTheme == 'day-theme'"
            :class="tabsIndex == index ? 'tabs-item tabs-activez' : 'tabs-item'"
            :style="{ 'color': cueTheme == 'day-theme' ? '#656565' : '#C5C5C5 ' }"
          >
            <block v-if="index == 0">
              <block v-if="item.status">
                <view
                  @click="albumView(index)"
                  v-if="viewType == 1"
                >画册</view>
                <view
                  @click="albumView(index)"
                  v-if="viewType == 2"
                >画册集</view>
              </block>
              <block v-else>
                <view @click="tabsbClick(index)">{{ viewType == 2 ? '画册集' : item.name }} </view>
              </block>
            </block>
            <view
              @click="tabsbClick(index)"
              v-else
            >{{ item.name }} </view>
            <image
              class="icon"
              @click="albumView()"
              v-if="index == 0"
              :src="cueTheme == 'day-theme' ? '../../static/img/clip/view_blue.png' : '../../static/img/clip/view_white.png'"
            >
            </image>
          </view>
          <view
            v-else
            :class="tabsIndex == index ? 'tabs-item tabs-active' : 'tabs-item'"
            :style="{ 'color': cueTheme == 'day-theme' ? '#656565' : '#C5C5C5 ' }"
          >
            <block v-if="index == 0">
              <block v-if="item.status">
                <view
                  @click="albumView(index)"
                  v-if="viewType == 1"
                >画册</view>
                <view
                  @click="albumView(index)"
                  v-if="viewType == 2"
                >画册集</view>
              </block>
              <block v-else>
                <view @click="tabsbClick(index)">{{ viewType == 2 ? '画册集' : item.name }} </view>
              </block>
            </block>
            <view
              @click="tabsbClick(index)"
              v-else
            >{{ item.name }} </view>
            <image
              class="icon"
              @click="albumView()"
              v-if="index == 0"
              :src="cueTheme == 'day-theme' ? '../../static/img/clip/view_blue.png' : '../../static/img/clip/view_white.png'"
            >
            </image>
          </view>
        </block>
      </view>

      <block v-if="navtabIndx == 0 && tabsIndex != 2">
        <!-- 画册操作 -->
        <view
          class="works"
          v-if="tabsIndex == 0 && !statusbox"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view @click="illustrate = !illustrate">
            <block>
              作品数量 <text :style="{ 'color': albumTotal > totleInfo.capacity ? 'red' : '' }"> {{ totleInfo.total || 0
              }}</text> /
              {{ totleInfo.capacity || 0 }}
            </block>
            <image
              class="icon-tips"
              v-if="totleInfo.isRed"
              src="../../static/img/detail/tips_red.png"
            >
            </image>
            <image
              class="icon-tips"
              v-else
              :src="cueTheme == 'day-theme' ? '../../static/img/detail/tips_hui.png' : '../../static/img/detail/tips.png'"
            >
            </image>
          </view>
          <view
            class="u-flex u-col-center"
            style="position: relative;"
          >
            <button
              v-if="viewType == 1 && albumTotal > totleInfo.capacity"
              class="clear-out-szie"
              @click="clearOutSzie()"
            >清除超出</button>
            <view class="icon-item">
              <image
                @click="albumSearch()"
                :src="cueTheme != 'day-theme' ? '../../static/img/clip/sort1.png' : '../../static/img/clip/sort11.png'"
              >
              </image>
            </view>
            <view class="icon-item">
              <image
                @click="choiceDelete()"
                :src="cueTheme != 'day-theme' ? '../../static/img/clip/sort2.png' : '../../static/img/clip/sort22.png'"
              >
              </image>
            </view>
            <view class="icon-item">
              <image
                class="icon"
                @click="albumSort(4)"
                v-if="!sortStatus"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon44.png' : '../../static/img/clip/view-icon4.png'"
              />
              <image
                class="icon"
                @click="albumSort(4)"
                v-if="sortStatus"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon33.png' : '../../static/img/clip/view-icon3.png'"
              />
            </view>
          </view>
        </view>

        <!-- 合集操作 -->
        <view
          class="works"
          v-if="tabsIndex == 1 && !collectBottom"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view @click="illustrate = !illustrate">
            <block>
              作品数量 <text :style="{ 'color': albumTotal > totleInfo.capacity ? 'red' : '' }"> {{ totleInfo.total || 0
              }}</text> /
              {{ totleInfo.capacity || 0 }}
            </block>
            <image
              class="icon-tips"
              v-if="totleInfo.isRed"
              src="../../static/img/detail/tips_red.png"
            >
            </image>
            <image
              class="icon-tips"
              v-else
              :src="cueTheme == 'day-theme' ? '../../static/img/detail/tips_hui.png' : '../../static/img/detail/tips.png'"
            >
            </image>
          </view>
          <view
            style="position: relative;"
            v-if="tabsIndex == 1"
          >
            <view class="icon-item">
              <image
                @click="albumSearch()"
                :src="cueTheme != 'day-theme' ? '../../static/img/clip/sort1.png' : '../../static/img/clip/sort11.png'"
              />
            </view>
            <view class="icon-item">
              <image
                @click="collectSearch(1)"
                :src="cueTheme != 'day-theme' ? '../../static/img/clip/sort2.png' : '../../static/img/clip/sort22.png'"
              />
            </view>
            <view class="icon-item">
              <image
                class="icon"
                @click="collectSort()"
                v-if="!isAsc"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon44.png' : '../../static/img/clip/view-icon4.png'"
              />
              <image
                class="icon"
                @click="collectSort()"
                v-if="isAsc"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon33.png' : '../../static/img/clip/view-icon3.png'"
              />
            </view>
          </view>
        </view>

        <!-- 创意操作 -->
        <view
          class="works"
          v-if="tabsIndex >= 3 && !originality"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view @click="illustrate = !illustrate">
            <block>
              作品数量 <text :style="{ 'color': albumTotal > totleInfo.capacity ? 'red' : '' }"> {{ totleInfo.total || 0
              }}</text> /
              {{ totleInfo.capacity || 0 }}
            </block>
            <image
              class="icon-tips"
              v-if="totleInfo.isRed"
              src="../../static/img/detail/tips_red.png"
            >
            </image>
            <image
              class="icon-tips"
              v-else
              :src="cueTheme == 'day-theme' ? '../../static/img/detail/tips_hui.png' : '../../static/img/detail/tips.png'"
            >
            </image>
          </view>
          <view
            style="position: relative;"
            v-if="tabsIndex >= 3"
          >
            <view class="icon-item">
              <image
                @click="originalityDelete()"
                :src="cueTheme != 'day-theme' ? '../../static/img/clip/sort2.png' : '../../static/img/clip/sort22.png'"
              />
            </view>
            <view class="icon-item">
              <image
                class="icon"
                @click="originalityScreen()"
                v-if="!originalityIsAsc"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon44.png' : '../../static/img/clip/view-icon4.png'"
              />
              <image
                class="icon"
                @click="originalityScreen()"
                v-if="originalityIsAsc"
                :src="cueTheme == 'day-theme' ? '../../static/img/clip/view-icon33.png' : '../../static/img/clip/view-icon3.png'"
              />
            </view>
          </view>
        </view>

      </block>
    </u-sticky>

    <block v-if="navtabIndx == 0">

      <u-back-top
        :scroll-top="scrollTop"
        top="600"
      ></u-back-top>


      <block v-if="tabsIndex == 0">
        <waterfall
          :list="waterfall.list"
          :statusBox="statusbox"
          :viewType="viewType"
          ref="chaefall"
          @clickBox="onClick"
        ></waterfall>
        <view
          class="postiont"
          v-if="statusbox"
        >
          <view class="left">
            <image
              class="icon"
              @click="albumCancel()"
              :src="allStatus ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            />
            <view>已选<text style="color:#00ebd3">{{ numberSize }}</text>项</view>
          </view>
          <view class="right">
            <view
              class="navitem"
              @click="collecStatus = true"
            >移至合集</view>
            <view
              class="navitem"
              @click="albumDelete()"
            >删除</view>
            <view
              class="navitem"
              @click="statusbox = false"
            >取消</view>
          </view>
        </view>
      </block>

      <!-- 合集搜索 -->
      <block v-if="tabsIndex == 1">
        <!-- 新增合集 -->
        <view
          class="collection"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          @click="collectAdd(1)"
        >+
          新增合集
        </view>

        <!-- 合集列表  -->
        <view class="wrap">
          <view class="collect">
            <view
              style="width:50%;display: inline-block; border-radius: 16px 16px 16px 16px;"
              v-for="(item, index) in collectList"
              :key="index"
              @click="collectSearch(5, index)"
            >
              <view class="collect-list">
                <image
                  :src="item.coverList[0]"
                  mode="center"
                />
                <view
                  class="under2"
                  v-if="!item.coverList || item.coverList.length == 0"
                >暂无封面</view>
                <image
                  class="shstatus"
                  v-if="collectBottom"
                  :src="item.statusBox ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
                />
                <view
                  class="top"
                  v-if="item.sort > 0"
                >置顶</view>
                <view class="chuang">
                  <view class="item titlee"> {{ item.title }}</view>
                  <view
                    class="item"
                    style="color: rgba(255,255,255,0.6);"
                  >{{ item.creation }}个创作</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view
          class="postiont"
          v-if="collectBottom"
        >
          <view class="left">
            <image
              class="icon"
              @click="collectSearch(2)"
              :src="collectAll ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            />
            <view>已选<text style="color:#00ebd3">{{ collectSize }}</text>项</view>
          </view>
          <view class="right">
            <view
              class="navitem"
              @click="collectDissolution()"
            >解散合集</view>
            <view
              class="navitem"
              @click="collectRemove()"
            >删除</view>
            <view
              class="navitem"
              @click="collectBottom = false"
            >取消</view>
          </view>
        </view>
      </block>

      <!-- 已发布 -->
      <zeroalbumList
        v-if="tabsIndex == 2"
        :list="galleryList"
        :tabIndex="2"
        ref="chaefall2"
        @clickBox="onClick"
      />

      <!-- 创意 -->
      <zerooriginalityList
        v-if="tabsIndex == 3"
        :list="originalityList"
        ref="chaefall5"
        @originalityClose="originalityClose"
      />

      <!-- 应用 -->
      <zerooriginalityList
        v-if="tabsIndex == 4"
        :list="originalityList"
        ref="chaefall5"
        @originalityClose="originalityClose"
      />

    </block>

    <!-- 赞过列表-->
    <view v-if="navtabIndx == 1">
      <zeroalbumList
        :list="likeList"
        :tabIndex="3"
        ref="chaefall3"
        @clickBox="onClick"
      />
    </view>

    <!--已购列表-->
    <view v-if="navtabIndx == 2">
      <zeroalbumList
        :list="buyList"
        :tabIndex="4"
        ref="chaefall4"
        @clickBox="onClick"
      />
    </view>


    <!-- 新增合集弹窗 -->
    <view
      class="model"
      v-if="collectionShow"
    >
      <view
        class="model-body"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#000' }"
      >
        <view
          class="title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >新增合集</view>
        <input
          type="text"
          v-model="addtext"
          placeholder="请输入名称"
          :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        />
        <view class="items">
          <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">置顶</view><u-switch
            activeColor="#1affe8"
            v-model="sticky"
            size="16"
          ></u-switch>
        </view>
        <view class="btns">
          <view
            class="btnsize"
            @click="collectAdd(1)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', }"
          >
            取消
          </view>
          <view
            class="btnsize actice"
            @click="collectAdd(2)"
          >确定</view>
        </view>
      </view>
    </view>

    <!-- 移至合集列表弹窗 -->
    <u-popup
      :show="collecStatus"
      @close="closeColle"
      :round="10"
      :closeable="true"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="popup-title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        移至合集
      </view>
      <view
        class="models"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <scroll-view
          scroll-y="true"
          v-if="collectList.length > 0"
          style="height:600rpx;"
          @scrolltolower="bindscrolltolower"
        >
          <view
            class="models-list"
            v-for="(item, index) in collectList"
            :key="index"
            @click="selectCollection(item.id)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              :src="item.status ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            />
            {{ item.title }}
          </view>
        </scroll-view>
        <view
          class="models-btn"
          v-if="collectList.length > 0"
        >
          <view
            class="li"
            @click="collectionShow = true"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            + 创建合集</view>
          <view
            class="li active"
            @click="addCollection()"
          >确定</view>
        </view>
        <view
          class="models-item"
          v-if="collectList.length == 0"
        >
          <image
            class="icon"
            src="https://img.drawai.cn/icon/nodata.png"
          ></image>
          <view
            class="tips"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >您还未创建合集哦~</view>
          <view
            class="create"
            @click="collectionShow = true"
          >+创建合集</view>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="illustrate"
      mode="center"
      border-radius="40"
    >
      <view
        class="speak"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="speak-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >温馨提示</view>
        <view
          class="speak-tips"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#aeaeae' }"
        >
          {{ totleInfo.tips }}</view>
        <view
          class="speak-btn"
          @click="illustrate = !illustrate"
        >知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { galleryList, searchMygallery, collectDeleteOutSize, likePage, collectList, collectAdd, taskPage, moveToCollect, collectDelete, departBatch, creativeList, capacityTips, appletList } from '../../static/api/index.js'
import { purchaseList, albumPage } from '../../static/api/clip.js'
import waterfall from "./components/clip/zero-waterfall.vue";
import zeroalbumList from "./components/clip/zero-albumList.vue";
import zerooriginalityList from "./components/clip/zero-originalityList.vue";
export default {
  components: {
    waterfall,
    zeroalbumList,
    zerooriginalityList
  },
  data() {
    return {
      navtabList: ['作品', '赞过', '已购'],
      navtabIndx: 0,
      tabsList: [{ name: '画册', status: false }, { name: '合集' }, { name: '已发布' }, { name: '创意' },
      { name: '应用' }
      ],
      tabsIndex: 0,
      tabIndexs: "2",
      tabIndex: 0,
      statusbox: false, // 底部删除选项
      numberSize: 0, //删除个数
      prompt: '', //合集搜索关键词

      albumPrompt: '',//画册搜素关键词
      albumList: [], // 画册列表
      albumNum: 1, // 画册页数
      albumTotal: 0,// 画册总个数
      numberList: [],// 画册选中列表
      allStatus: false,
      sortStatus: false, //画册排序
      albumModel: false, // 视图弹窗状态
      viewType: '2',// 视图类型
      sortIndex: 1, //画册搜索类型	
      lastId: null,//画册集列表字段穿最后一个id

      // 异步请求相关
      ajax: {
        load: true,// 是否可以加载
        rows: 10,  // 每页的请求条件
        page: 1, // 页码
        dataList: [],// 数据列表
      },
      // 瀑布流组件相关
      waterfall: {
        status: "",
        reset: false,
        list: []
      },

      title: '',   //合集搜索关键词
      collectList: [], // 合集列表 
      collectNum: 1,    // 合集页数
      collectTotal: 0,  //合集个数
      collecStatus: false, //合集弹窗列表
      collectBottom: false, //合集底部菜单
      collectSize: '0', // 合集删除总个数
      collectAll: false,
      isAsc: false,// 合集排序状态

      galleryPrompt: '', // 搜索关键词
      galleryList: [],   // 画廊列表
      galleryNum: 1,     // 画廊页数
      galleryTotal: 0,   //画廊总个数

      likeList: [], //赞过列表
      likeNum: 1,    // 赞过页数
      likeTotal: 0,  //赞过总个数

      collectionShow: false, // 合集弹窗
      addtext: '', // 新增合集名称
      sticky: false, // 是否置顶
      pic: '',
      illustrate: false,
      totleInfo: {},//全局json 文件
      userInfo: {},

      scrollTop: 0, //顶部距离

      buyList: [], //已购列表
      buyNum: 1,   // 已购页数
      buyStatus: false, // 是否可加载下一页
      show: true,
      originalityList: [],
      originalityIsAsc: false,//创意状态
      originality: false,
      nextId: '',//创意分页
      // appletIsAsc:false,// 应用排序
      // appletnextId:'',//应用分页
      // appletLists:[],// 应用列表
    };
  },

  async onShow() {
    let that = this;
    let userInfo = uni.getStorageSync('userInfo');
    if (uni.getStorageSync('albumName') != "画册详情" && this.tabsIndex == 0 && userInfo.phone) {
      that.viewType = uni.getStorageSync('viewType') || '1';
      that.ajax.page = 1;
      that.ajax.load = true;
      that.waterfall.list = [];
      that.tabsIndex = 0
      setTimeout(() => {
        that.$refs && that.$refs.chaefall.clear();
        if (that.viewType == '1') {//画册列表
          that.getAlbumList()
        }
        if (that.viewType == '2') { //画册集列表
          that.lastId = null;//还原初始
          that.getalbumPage()
        }
      }, 600)
    }
    console.error('---------------onShow',);
    if (uni.getStorageSync("newCreativity") == 1) {
      uni.setStorageSync("newCreativity", 0);
      this.tabsbClick(3)
    }
    // setTimeout(() => {
    //   // AI商品图制作任务
    //   uni.$once('newCreativity', (data) => {
    //     console.error('监听到事件来自 newCreativity ，AI商品图，携带参数 msg 为：' + data);
    //     this.tabsbClick(3)
    //   })
    // }, 500);

    // 应用加载
    if (that.tabsIndex == 4) {
      that.originalityList = [];
      that.originalityIsAsc = false;
      that.nextId = null;
      setTimeout(() => {
        that.$refs.chaefall5.clear();
        that.$refs.chaefall5.deleteStatus(true);
        that.getappletList(); //获取列表
      }, 300)
    }

    // else if (!userInfo && this.tabsIndex == 0) {
    //   that.$refs.mychild.resetData();
    //   that.ajax.page = 1;
    //   that.ajax.load = true;
    //   that.waterfall.list = [];
    // } else if (!userInfo && this.tabIndex == 1) {
    //   that.collectList = [];
    // } else if (!userInfo && this.tabIndex == 2) {
    //   that.$refs.uWaterfall2.clear();
    // } else if (!userInfo && this.tabIndex == 3) {
    //   that.$refs.uWaterfall3.clear();
    // } else if (!userInfo && this.tabIndex == 4) {
    //   that.$refs.uWaterfall4.clear();
    // }

    if (uni.getStorageSync('token') && uni.getStorageSync('loginStatus') != 1) {
      that.userInfo = uni.getStorageSync('userInfo');
    } else {
      that.userInfo = { info: { follow: 0, fans: 0 } };
    }

  },

  onHide() {
    this.albumModel = false;
  },

  onLoad() {
    let that = this;
    if (uni.getStorageSync('token')) {
      that.infoTips();
      that.getcollectList();
    }
  },

  methods: {

    infoTips() {
      capacityTips({}).then(res => {
        if (res.code == 200) {
          this.totleInfo = res.result;
        }
      })
    },

    navtabClick(idx) {
      let that = this;
      that.navtabIndx = idx
      if (idx == 0) {
        that.tabsbClick(0)
      } else if (idx == 1) {
        that.likeList = [];
        that.likeNum = 1;    // 赞过页数
        setTimeout(() => {
          that.$refs.chaefall3.clear();
          that.getlikePage()//赞过列表
        }, 500)
      } else {
        that.buyNum = 1;
        that.buyList = [];
        that.buyStatus = false;
        setTimeout(() => {
          that.$refs.chaefall4.clear();
          that.getpurchaseList()
        }, 500)
      }
    },

    tabsbClick(idx) {
      let that = this;
      that.tabsIndex = idx;
      that.numberSize = 0;
      that.numberList = [];
      that.collectAll = false;
      that.allStatus = false;
      that.statusbox = false;
      that.collectSize = 0;
      that.collectAll = false;
      that.collectBottom = false;
      this.originality = false;
      if (idx == 0) {
        that.ajax.page = 1;
        that.ajax.load = true;
        that.waterfall.list = [];
        // if(!that.tabsList[0].status){
        //   that.tabsList[0].status= true
        //   if (that.viewType == '1') {//画册列表
        //     that.getAlbumList()
        //   } else { //画册集列表
        //     that.lastId = null;//还原初始
        //     that.getalbumPage()
        //   }
        // }else{
        that.tabsList[0].status = true
        if (that.tabsList[0].status) {
          // that.viewType = that.viewType==1?2:1; //视图类型
          setTimeout(() => {
            that.$refs.chaefall.clear();
            if (that.viewType == '1') {//画册列表
              that.getAlbumList()
            } else { //画册集列表
              that.lastId = null;//还原初始
              that.getalbumPage()
            }
          }, 500)
        }
        // }
        return
      }
      that.tabsList[0].status = false
      if (idx == 1) {
        uni.removeStorageSync('albumName')
        that.collectList = []; // 合集列表 
        that.collectNum = 1;   // 合集页数
        that.getcollectList();
      }
      if (idx == 2) {
        uni.removeStorageSync('albumName')
        that.galleryList = [];
        that.galleryNum = 1;    // 画廊页数
        setTimeout(() => {
          that.$refs.chaefall2.clear();
          that.getgalleryList(); //获取列表
        }, 500)
      }
      if (idx == 3) {
        that.originalityList = [];
        that.nextId = '';
        that.originalityIsAsc = false;
        setTimeout(() => {
          that.$refs.chaefall5.clear();
          that.$refs.chaefall5.deleteStatus(true);
          that.getcreativeList(); //获取列表
        }, 300)
      }
      if (idx == 4) { //应用列表
        that.originalityList = [];
        that.nextId = '';
        that.originalityIsAsc = false;
        setTimeout(() => {
          that.$refs.chaefall5.clear();
          that.$refs.chaefall5.deleteStatus(true);
          that.getappletList(); //获取列表
        }, 300)
      }
    },

    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
      this.albumModel = false;
    },

    // 画册点击事件
    onClick(data) {
      this.numberSize = data.length;
      this.numberList = data;
      this.allStatus = data.length > 0 ? true : false;
    },

    // 画册视图
    albumView() {
      let that = this;
      that.ajax.page = 1;
      that.viewType = that.viewType == 1 ? 2 : 1; //视图类型
      that.albumModel = false; //更多弹窗
      that.statusbox = false; //是否显示管理
      that.$refs.chaefall.clear();
      that.lastId = null;
      uni.pageScrollTo({
        scrollTop: 0
      })// 画册视图 
      uni.setStorageSync('viewType', that.viewType)
      if (that.viewType == 1) {//画册列表
        setTimeout(() => {
          that.getAlbumList()
        }, 200)
      } else { //画册集列表
        setTimeout(() => {
          that.getalbumPage()
        }, 200)
      }
    },

    // 画册排序
    albumSort(type) {
      let that = this;
      that.ajax.page = 1;
      that.ajax.load = true;
      that.albumModel = false;
      that.statusbox = false;
      that.$refs.chaefall.clear();
      uni.pageScrollTo({
        scrollTop: 0
      })
      that.sortStatus = !that.sortStatus;
      if (that.viewType == '1') {//画册列表
        that.getAlbumList()
      } else { //画册集列表
        that.lastId = null;//还原初始
        that.getalbumPage()
      }
    },

    //获取画册列表
    getAlbumList() {
      let that = this;
      let temp = {
        pageNum: that.ajax.page,
        pageSize: 10,
        asc: that.sortStatus,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      taskPage(temp).then(res => {
        if (res.code == 200) {
          let list = res.result.records;
          list.map(item => {
            item.statusBox = false;
            item.url = (item.status == 0 && item.url) ? item.url + '!thumb' : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.albumTotal = res.result.total;
          that.ajax.page = that.ajax.page + 1
          that.waterfall.list = that.waterfall.list.concat(list);
          uni.hideLoading()
        }
      })
    },

    // 获取画册集列表    
    getalbumPage() {
      let that = this;
      let temp = {
        last: that.lastId,
        size: 10,
        asc: that.sortStatus,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      albumPage(temp).then(res => {
        if (res.code == 200) {
          let list = res.result.records;
          res.result.records.map(item => {
            item.statusBox = false;
            item.cover = item.cover ? item.cover : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.lastId = list.length > 0 ? list[list.length - 1].id : null;
          that.albumTotal = res.result.total;
          that.ajax.page = that.ajax.page + 1
          setTimeout(function () {
            that.waterfall.list = that.waterfall.list.concat(res.result.records);
            uni.hideLoading()
          }, 200)
        }
      })
    },

    //画册还原初始状态 
    albumOriginal() {
      let that = this;
      that.albumNum = 1;
      that.albumList = [];
    },

    // 画册删除取消选择
    albumCancel() {
      let that = this;
      that.allStatus = !that.allStatus
      that.$refs.chaefall.selectAll(that.allStatus);
    },

    // 画册删除
    albumDelete() {
      let that = this;
      that.$refs.chaefall.albumDelete();
    },

    //合集排序
    collectSort() {
      let that = this;
      that.isAsc = !that.isAsc;
      that.collectNum = 1;
      that.title = '';
      that.collectList = []
      that.getcollectList();
    },

    // 获取合集列表
    getcollectList() {
      let that = this;
      let data = {
        title: this.title,
        pageNum: this.collectNum,
        pageSize: 10,
        isAsc: that.isAsc
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      collectList(data).then(res => {
        if (res.code == 200) {
          let resData = res.result.records;
          resData.map((item, index) => {
            item.coverList = item.coverList ? JSON.parse(item.coverList) : []
            item.statusBox = false;
            item.status = false;
          })
          that.collectTotal = res.result.total;
          that.collectNum = that.collectNum + 1;
          that.title = '';
          setTimeout(function () {
            uni.hideLoading()
            that.collectList = that.collectList.concat(resData)
          }, 200)
        }
      })
    },

    // 合集功能
    collectSearch(type, index) {
      let that = this;
      let collectList = that.collectList;
      if (!getApp().globalData.getLogin()) { //检测用户是否登录
        return
      }
      if (!type) {  // 搜索功能   
        that.collectList = []; // 合集列表 
        that.collectNum = 1;   // 合集页数
        that.getcollectList();
      }
      if (type == 1) {  // 
        this.collectBottom = !this.collectBottom;
      }
      if (type == 2) { // 全选 全不选
        that.collectAll = !that.collectAll
        collectList.map(item => { item.statusBox = that.collectAll ? true : false; })
        that.collectSize = that.collectAll ? collectList.length : 0;
        that.collectList = collectList;
        return;
      }

      if (type == 5) {  //选择需要删除的合集，或者跳转合集详情页面
        if (this.collectBottom) { //选中删除的合集
          that.collectList[index].statusBox = !that.collectList[index].statusBox;
          //  合集统计个数
          if (that.collectList[index].statusBox) {
            that.collectSize = parseInt(that.collectSize) + 1
          } else {
            that.collectSize = parseInt(that.collectSize) - 1
          }
          that.collectAll = that.collectSize > 0 ? true : false
        } else { // 跳转详情合集页面
          let data = collectList[index]
          uni.navigateTo({
            url: '/pclip/collection?id=' + data.id + "&title=" + data.title + "&sort=" + data.sort
          })
        }
      }
    },

    // 新增合集
    collectAdd(e) {
      let that = this;
      if (!getApp().globalData.getLogin()) {
        return;
      }
      if (e == 1) {
        this.collectionShow = !this.collectionShow
        return;
      }
      if (!this.addtext) {
        uni.showToast({
          title: "请输入名称", icon: 'none', duration: 3000
        })
        return
      }
      collectAdd({ title: this.addtext, sticky: that.sticky }).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: "创建成功", icon: 'none', duration: 3000
          })
          that.collectNum = 1;
          that.collectList = [];
          that.addtext = '';
          that.collectAdd(1)
          that.getcollectList();
        }
      })
    },

    // 解散合集 
    collectDissolution() {
      let that = this;
      let array = [];
      let collectList = that.collectList;
      collectList.map(item => {
        if (item.statusBox) {
          array.push(parseInt(item.id))
        }
      })
      if (array.length == 0) {
        uni.showToast({ title: "请选择需要解散的合集", icon: 'none', duration: 3000 })
        return;
      }
      uni.showModal({
        title: '温馨提示',
        content: '您确认要解散合集吗？',
        success: function (res) {
          if (res.confirm) {
            departBatch(array).then(res => {
              if (res.code == 200) {
                uni.showToast({ title: "解散合集成功", icon: 'none', duration: 3000 })
                that.collectList = []; // 合集列表 
                that.collectNum = 1;   // 合集页数
                that.collectSize = 0; // 还原个数
                that.collectAll = false;
                that.getcollectList();
              }
            })
          }
        }
      });
    },

    // 删除合集
    collectRemove() {
      let that = this;
      let array = [];
      let collectList = that.collectList;
      collectList.map(item => {
        if (item.statusBox) {
          array.push(parseInt(item.id))
        }
      })
      if (array.length == 0) {
        uni.showToast({ title: "请选择需要删除的合集", icon: 'none', duration: 3000 })
        return;
      }
      uni.showModal({
        title: '温馨提示',
        content: '您确认要删除吗？删除后将无法找回该作品哦~',
        success: function (res) {
          if (res.confirm) {
            collectDelete(array).then(res => {
              if (res.code == 200) {
                uni.showToast({ title: "删除成功", icon: 'none', duration: 3000 })
                that.collectList = []; // 合集列表 
                that.collectNum = 1;   // 合集页数
                that.collectSize = 0; // 还原个数
                that.collectAll = false;
                that.getcollectList();
              }
            })
          }
        }
      });
    },

    // 画册 --搜索
    albumSearch() {
      let that = this;
      that.albumModel = false;
      that.statusbox = false;
      uni.navigateTo({
        url: "/pclip/search",
      })
    },
    clearOutSzie() {
      uni.$u.debounce(async () => {
        uni.showModal({
          title: '温馨提示',
          content: '确定清除超出作品数量以外的作品吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: '删除中，请稍等...', mask: true })
              collectDeleteOutSize().then((res) => {
                uni.hideLoading()
                if (res.code == 200) {
                  uni.showToast({
                    title: "清除成功", icon: 'none', duration: 3000
                  })
                  this.ajax.page = 1;
                  this.ajax.load = true;
                  this.waterfall.list = [];
                  this.tabsIndex = 0
                  this.getAlbumList()
                }
              }).catch((err) => {
                uni.hideLoading()
                console.error(err);
              })
            }
          }
        });
      }, 300)
    },
    // 画册--管理功能
    choiceDelete() {
      let that = this;
      that.statusbox = !that.statusbox;
      that.albumModel = false;
    },
    // 画册--更多 
    choiceModel() {
      let that = this;
      that.albumModel = !that.albumModel;
      that.statusbox = false;
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

    // 合集加载更多
    bindscrolltolower() {
      let that = this;
      if (that.collectList.length != that.collectTotal) {
        that.getcollectList()
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
      let numberList = that.numberList; //选择画册的列表
      let collectId = '';
      if (that.numberSize == 0) {
        uni.showToast({
          title: "请选择需要加入的合集作品", icon: 'none', duration: 3000
        })
        return
      }
      collectList.map(item => { // 获取合集ID
        if (item.status) {
          collectId = item.id
        }
      })
      var arr = []; // 获取需要加入合集的id列表
      numberList.map(item => {
        if (item.statusBox) { arr.push(item.id) }
      })
      if (!collectId) {
        uni.showToast({
          title: "请选择需要加入的合集", icon: 'none', duration: 3000
        })
        return
      }
      uni.$u.debounce(() => {
        uni.showLoading({ title: '加载中...', mask: true, })
        moveToCollect({ taskList: arr, collectId: collectId, }).then(res => {
          if (res.code == 200) {
            that.closeColle();
            that.statusbox = false; // 关闭管理弹窗功能
            that.albumOriginal();
            that.getAlbumList()
            uni.showToast({
              title: "添加成功", icon: 'none', duration: 3000
            })
          }
        }).finally(() => {
          uni.hideLoading()
        })
      }, 500)
    },

    // 画廊搜索
    gallerySearch() {
      if (!this.galleryPrompt) {
        uni.showToast({ title: "请输入搜索关键词", icon: "none", duration: 3000 })
        return;
      }
      this.galleryNum = 1;
      this.$refs.uWaterfall2.clear();
      this.gallerySearchList()
    },

    // 画廊搜索列表
    gallerySearchList() {
      let that = this;
      let temp = {
        pageSize: 10,
        pageNum: that.galleryNum,
        prompt: that.galleryPrompt,//搜索关键词
        Bearer: "Bearer",
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      searchMygallery(temp).then(res => {
        if (res.code == 200) {
          uni.hideLoading()
          let resData = res.result.records;
          if (resData.length == 0 && that.galleryNum == 1) {
            uni.showToast({
              title: "未查询到数据", icon: 'none', duration: 3000
            })
          }
          that.galleryNum = that.galleryNum + 1;
          that.galleryTotal = res.result.total;
          that.galleryList = that.galleryList.concat(resData);
        } else { uni.hideLoading() }
      })
    },

    // 获取画廊列表
    getgalleryList() {
      let that = this;
      let temp = {
        pageSize: 10,
        pageNum: that.galleryNum,
        status: that.tabIndex == 1 ? '' : 1,
        prompt: that.prompt,//搜索关键词
        isAsc: false, // 排序规则
        orderBy: 'id', // 排序规则
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      galleryList(temp).then(res => {
        if (res.code === 200) {
          that.galleryNum = that.galleryNum + 1;
          that.galleryTotal = res.result.total;
          uni.hideLoading()
          that.galleryList = that.galleryList.concat(res.result.records);
        } else { uni.hideLoading() }
      })
    },

    // 赞过列表
    getlikePage() {
      let that = this;
      let data = {
        pageNum: that.likeNum,
        pageSize: 10,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      likePage(data).then(res => {
        if (res.code == 200) {
          if (res.result.records.length > 10) { return }
          that.likeNum = that.likeNum + 1;
          that.likeTotal = res.result.total;
          uni.hideLoading()
          that.likeList = that.likeList.concat(res.result.records);
        } else { uni.hideLoading() }
      })
    },

    // 已购列表
    getpurchaseList() {
      let that = this;
      let data = {
        pageNum: that.buyNum,
        pageSize: 10,
        userId: that.userInfo.id,
      }
      if (that.buyStatus) {
        return
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      purchaseList(data).then(res => {
        if (res.code == 200) {
          that.buyNum = that.buyNum + 1;
          that.buyStatus = res.result.records.length > 0 ? false : true;
          uni.hideLoading()
          that.buyList = that.buyList.concat(res.result.records);
        } else { uni.hideLoading() }
      })
    },

    // 创意列表
    getcreativeList(init) {
      let that = this;
      let data = {
        size: 10,
        isAsc: that.originalityIsAsc,
      }
      if (that.nextId) {
        data.nextId = that.nextId
      }
      if (init) {
        delete data.nextId
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      creativeList(data).then(res => {
        if (res.code == 200) {
          uni.hideLoading()
          res.result.list.map(item => {
            item.statusBox = false;
            item.thumbUrl = item.thumbUrl ? item.thumbUrl : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.originalityList = that.originalityList.concat(res.result.list)
          that.nextId = res.result.nextId ? res.result.nextId : '';
        } else { uni.hideLoading() }
      })
    },

    // 创意删除
    originalityDelete() {
      this.originality = !this.originality
      this.$refs.chaefall5.deleteStatus();
    },
    // 创意取消
    originalityClose(res) {
      this.originality = res;
    },

    // 创意筛选
    originalityScreen() {
      this.originalityIsAsc = !this.originalityIsAsc;
      this.originalityList = [];
      this.$refs.chaefall5.deleteStatus(true);
      this.$refs.chaefall5.clear();
      setTimeout(() => {
        if (this.tabsIndex == 3) { //创意列表
          this.getcreativeList(true);
        } else { //应用列表
          this.getappletList();
        }
      }, 200)
    },

    // 应用列表
    getappletList() {
      let that = this;
      let data = {
        size: 10,
        isAsc: that.originalityIsAsc,
      }
      if (that.nextId) {
        data.nextId = that.nextId
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      appletList(data).then(res => {
        if (res.code == 200) {
          uni.hideLoading()
          res.result.list.map(item => {
            item.statusBox = false;
            item.thumbUrl = item.thumbUrl ? item.thumbUrl : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.originalityList = that.originalityList.concat(res.result.list)
          that.nextId = res.result.nextId ? res.result.nextId : '';
        } else { uni.hideLoading() }
      })
    }
  },

  // 下拉
  onPullDownRefresh() {
    let that = this;
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);

    if (!getApp().globalData.getLogin()) {
      return
    }
    that.infoTips();
    if (that.navtabIndx == 0) {
      if (that.tabsIndex == 0) {
        if (that.albumPrompt) {
          return;
        }
        that.ajax.page = 1;
        that.statusbox = false;
        that.albumModel = false;
        that.numberSize = 0;
        that.ajax.load = true;
        that.lastId = null;
        that.$refs.chaefall.clear();
        that.waterfall.list = [];
        setTimeout(() => {
          if (that.viewType == '1') {//画册列表
            that.getAlbumList()
          } else { //画册集列表
            that.getalbumPage()
          }
        }, 500);
      }

      if (that.tabsIndex == 1) {
        that.collectList = []; // 合集列表 
        that.collectNum = 1;   // 合集页数
        that.getcollectList();
      }

      if (that.tabsIndex == 2) {
        that.galleryList = [];
        that.galleryNum = 1;    // 画廊页数
        setTimeout(() => {
          that.$refs.chaefall2.clear();
          that.getgalleryList(); //获取列表
        }, 500)
      }

      if (that.tabsIndex == 3) {
        that.originalityList = [];
        that.nextId = '';
        setTimeout(() => {
          that.$refs.chaefall5.clear();
          that.$refs.chaefall5.deleteStatus(true);
          that.getcreativeList(); //获取列表
        }, 300)
      }

      if (that.tabsIndex == 4) { //应用列表
        that.originalityList = [];
        that.nextId = '';
        that.originalityIsAsc = false;
        setTimeout(() => {
          that.$refs.chaefall5.clear();
          that.$refs.chaefall5.deleteStatus(true);
          that.getappletList(); //获取列表
        }, 300)
      }

    } else if (that.navtabIndx == 1) {
      that.likeList = [];
      that.likeNum = 1;    // 赞过页数
      setTimeout(() => {
        that.$refs.chaefall3.clear();
        that.getlikePage()//赞过列表
      }, 500)
    } else {
      that.buyNum = 1;
      that.buyList = [];
      that.buyStatus = false;
      setTimeout(() => {
        that.$refs.chaefall4.clear();
        that.getpurchaseList()
      }, 500)
    }
  },

  //上拉
  onReachBottom() {
    let that = this;
    // 作品模块
    if (that.navtabIndx == 0) {
      //画册列表
      if (that.tabsIndex == 0) {
        if (that.viewType == '1') {
          that.getAlbumList()
        } else { //画册集列表
          that.getalbumPage()
        }
      }
      // 合集
      if (that.tabsIndex == 1) {
        if (that.collectList.length == 0) { return }
        if (that.collectList.length != that.collectTotal) {
          that.getcollectList() // 合集加载分页
        }
      }
      // 已发布
      if (that.tabsIndex == 2) {
        if (that.galleryList.length != that.galleryTotal) {
          that.getgalleryList() // 画廊加载分页
        }
        return
      }

      // 创意
      if (that.tabsIndex == 3) {
        if (that.nextId) {
          that.getcreativeList()
        }
        return
      }

      // 应用
      if (that.tabsIndex == 4) {
        if (that.nextId) {
          that.getappletList()
        }
        return
      }
    }

    // 赞过模块
    if (that.navtabIndx == 1) {
      if (that.likeList.length != that.likeTotal) {
        that.getlikePage()
      }
    }

    // 已购模块
    if (that.navtabIndx == 2) {
      that.getpurchaseList();
    }
  },

  // #ifdef MP
  onShareAppMessage(options) {
    console.log(options, 'options')
    if (options.from === "button") {
      // 来自页面内分享按钮
      return {
        path: getApp().globalData.sharePath,
        title: getApp().globalData.shareTitle,
        imageUrl: options.target.dataset.img,
      };
    } else {
      return {
        path: getApp().globalData.sharePath,
        title: getApp().globalData.shareTitle,
        imageUrl: getApp().globalData.shareImage,
      };
    }
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
<style lang="scss">
.navtab {
  display: flex;
  justify-content: space-around;
  color: white;
  width: 80%;
  // height: 92rpx; 
  // padding: 0 40rpx ;
  background: #353535;
  border-radius: 46rpx 46rpx 46rpx 46rpx;
  line-height: 92rpx;
  margin: 0 auto;
  text-align: center;

  .navtab-item {
    width: 33.3%;
    height: 92rpx;
  }

  .navtab-active {
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    color: #141416 !important;
    border-radius: 46rpx;
    font-size: 34rpx;
    // font-weight: bold;
    height: 92rpx;
  }
}

.tabs {
  display: flex;
  color: white;
  font-size: 32rpx;
  padding-left: 20rpx;
  padding-bottom: 28rpx;

  // padding-top:44rpx;
  .tabs-item {
    margin-right: 52rpx;
    position: relative;

    .icon {
      width: 20rpx;
      height: 20rpx;
      position: absolute;
      right: -28rpx;
      top: 16rpx;
    }
  }

  .tabs-item:first-child {
    margin-right: 80rpx;
  }

  .tabs-activez {
    position: relative;
    color: #000 !important;
  }

  .tabs-activez::before {
    position: absolute;
    content: '';
    left: 50%;
    transform: translate(-50%);
    z-index: 999;
    bottom: -14rpx;
    width: 64rpx;
    height: 6rpx;
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    border-radius: 48rpx;
  }

  .tabs-active {
    position: relative;
    color: white !important;
  }

  .tabs-active::before {
    position: absolute;
    content: '';
    left: 50%;
    transform: translate(-50%);
    z-index: 999;
    bottom: -14rpx;
    width: 64rpx;
    height: 6rpx;
    background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
    border-radius: 48rpx;
  }
}


.works {
  padding: 20rpx 40rpx 20rpx 20rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
}

.works .icon-tips {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 8rpx;
  left: 16rpx;
}

.works .icon-item {
  width: 80rpx;
  // height: 56rpx;
  display: inline-block;
  text-align: right;
}

.works .icon-item image {
  width: 40rpx;
  height: 40rpx;
}

.works .tips-model {
  z-index: 10072 !important;
  width: 380rpx;
  height: 384rpx;
  background: #3B3B3B;
  position: absolute;
  top: 60rpx;
  right: -20rpx;
  border-radius: 20rpx;
}

.works .tips-model .item {
  line-height: 96rpx;
  border-bottom: 1rpx solid #808080;
  padding-left: 80rpx;
  position: relative;
}

.works .tips-model .item .icon {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  top: 32rpx;
  left: 30rpx;
}

.works .tips-model .item .cancel {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  top: 32rpx;
  right: 18rpx
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

.speak .speak-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  line-height: 80rpx;
  border-radius: 80rpx;
}

.clip {
  min-height: 100vh;
}

.popup {
  display: flex;
  justify-content: space-around;
  z-index: 9999;
}

.popup-title {
  text-align: center;
  line-height: 140rpx;
  color: white;
  font-weight: 600;
}

.demo-warter {
  border-radius: 8px;
  // margin:10px 6px;
  margin: 5px;
  background: #262628;
  padding: 8px;
  position: relative;
  text-align: right;

}

.demo-warter .drop {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 44rpx;
  height: 44rpx;
  z-index: 9;
  border-radius: 50%;
  border: 1px solid white;
}

.demo-warter .under {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 320rpx;
  transform: translate(-50%, -50%);
  color: #141416;
  font-weight: 500;
  text-align: center;
}

.demo-warter .under image {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 8rpx;
  right: 10rpx;
}

.demo-warter .shstatus {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 44rpx;
  height: 44rpx;
  z-index: 9;
}

.collect {
  padding: 10rpx;
}

.collect .collect-list {
  // border: 1px solid red;
  box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.04);
  border-radius: 14rpx;
  margin: 10rpx;
  position: relative;
  background: #262628;
}

.collect .collect-list image {
  width: 100%;
  height: 171.594px;
  border-radius: 14rpx 14rpx 0 0;
  position: relative;
}

.collect .collect-list .top {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  background: #00C1F6;
  border-radius: 14rpx 0rpx 14rpx 0rpx;
  opacity: 1;
  color: white;
}

.collect .collect-list .under2 {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 320rpx;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 500;
  text-align: center;

  image {
    width: 40rpx;
    height: 40rpx;
    position: relative;
    top: 10rpx;
  }
}

.collect .collect-list .shstatus {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 44rpx;
  height: 44rpx;
  z-index: 9;
}

.collect .collect-list .chuang {
  color: white;
  font-size: 28rpx;
  line-height: 90rpx;
  height: 90rpx;
  padding: 0 20rpx;
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

  .titlee {
    width: 140rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item {

    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
    }
  }
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
  margin: 30rpx 0 40rpx;
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

.models-item {
  text-align: center;
  padding-bottom: 140rpx;
}

.models-item .icon {
  width: 570rpx;
  height: 252rpx;
  margin: 120rpx auto 40rpx;
}

.models-item .tips {
  text-align: center;
  color: #FFFFFF;
  font-size: 28rpx;
  margin-bottom: 60rpx;
}

.models-item .create {
  width: 476rpx;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  margin: 10rpx auto;
  font-weight: bold;
  color: #121212;
  font-size: 32rpx;
  background: linear-gradient(90deg, #60FFFE 0%, #2AFFB0 100%);
  border-radius: 48rpx 48rpx 48rpx 48rpx;
}

.collection {
  text-align: center;
  color: white;
  font-size: 30rpx;
  line-height: 80rpx;
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999999;
}

.model-body {
  width: 300px;
  height: 235px;
  background: #2E2E33;
  border-radius: 16px 16px 16px 16px;
  color: white;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.model-body .title {
  line-height: 100rpx;
  font-size: 16px;
}

.model-body input {
  width: 268px;
  height: 48px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px 12px 12px 12px;
  font-size: 28rpx;
  text-align: left;
  margin-left: 20rpx;
  padding-left: 20rpx;
}

.model-body .items {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  font-size: 30rpx;
}

.model-body .btns {
  display: flex;
  justify-content: space-around;
  margin-top: 30rpx;
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
}

.navadmin {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx;
  background: #141416;
}

.navadmin .navinput {
  width: 263px;
  height: 40px;
  background: #262628;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid #262628;
  font-size: 12px;
  padding-left: 20rpx;
}

.navadmin .navactive {
  width: 263px;
  height: 40px;
  color: #141416;
  background: #F5F5F5;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid #F5F5F5;
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
  background: rgba(26, 255, 232, 0.1);
  color: #1AFFE8;
  font-size: 26rpx;
  margin-top: 12rpx;
}

.postiont {
  position: fixed;
  left: 0;
  right: 0;
  // #ifdef MP
  bottom: 0rpx;
  // #endif
  // #ifdef H5
  bottom: 98rpx;
  // #endif
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  z-index: 99;
}

.postiont .left {
  color: white;
  line-height: 100rpx;
  margin-left: 14rpx;
  font-size: 24rpx;
  display: flex;

  .icon {
    width: 40rpx;
    height: 40rpx;
    margin-top: 32rpx;
    margin-right: 10rpx;
  }
}

.postiont .right {
  width: 70%;
  display: flex;
  justify-content: right;
}

.postiont .right .navitem {
  width: 140rpx;
  height: 66rpx;
  line-height: 66rpx;
  border-radius: 70rpx;
  border: 1px solid white;
  text-align: center;
  font-size: 26rpx;
  color: white;
  margin: 16rpx;
}

.logged {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32rpx;
}

.clear-out-szie {
  border-radius: 48rpx;
  width: 128rpx;
  height: 44rpx;
  line-height: 44rpx;
  color: #000;
  font-size: 24rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  display: inline-block;
}
</style>