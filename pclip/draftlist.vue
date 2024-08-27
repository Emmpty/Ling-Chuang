<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="画册集"
    />

    <view
      class="navadmin"
      v-if="!statusbox"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', top: height }"
    >
      <view
        class="item"
        :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
      >共{{ list.length }}项</view>
      <view
        class="item"
        @click="choiceDelete()"
        :style="{ 'color': cueTheme != 'day-theme' ? '#fff' : '#141416' }"
      >
        <view class="navitem">
          <image :src="cueTheme != 'day-theme' ? '../static/img/clip/sort2.png' : '../static/img/clip/sort22.png'">
          </image>
          {{ statusbox ? "取消" : "编辑" }}
        </view>
      </view>
    </view>

    <view style="padding-top:70rpx">

      <waterfall_list
        :list="list"
        :statusBox="statusbox"
        ref="chaefall"
        @clickBox="onClick"
      >
      </waterfall_list>

      <view
        class="footer"
        v-if="!statusbox"
        :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
      >
        <view
          class="footer-btn"
          @click="showStatus = !showStatus"
        >
          <image
            @click="showStatus = false"
            :src="cueTheme != 'day-theme' ? '../static/img/clip/sort11.png' : '../static/img/clip/sort11.png'"
          ></image>
          查看关键词
        </view>
      </view>

      <view
        class="postiont"
        v-if="statusbox"
      >
        <view class="postiont-left">
          <image
            class="icon"
            @click="albumCancel()"
            :src="allStatus ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
          />
          <view>
            已选<text style="color:#00ebd3">{{ numberSize }}</text>项
          </view>
        </view>
        <view class="postiont-right">
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
              @click="collectionShow = false"
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
                :src="item.status ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
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


      <!-- 查看关键词 -->
      <u-popup
        :show="showStatus"
        mode="bottom"
        @close="showStatus = !showStatus"
        border-radius="40"
        height="600px"
      >
        <view
          class="label"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view
            class="label-title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >查看关键词
            <image
              @click="showStatus = false"
              :src="cueTheme != 'day-theme' ? '../static/img/detail/colse.png' : '../static/img/detail/colse_gray.png'"
            >
            </image>
          </view>
          <view
            :class="cueTheme == 'day-theme' ? 'label-name' : 'label-name'"
            @click="copyKeyword()"
          >
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }">关键词:</view>
            <view
              :class="cueTheme == 'day-theme' ? 'copy ' : 'copy'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >
              <image :src="cueTheme == 'day-theme' ? '../static/img/detail/copy2.png' : '../static/img/detail/copy.png'">
              </image>
              复制
            </view>
          </view>
          <view
            class="modelbox"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            @click="copyKeyword()"
          >{{
            modelInfo.prompt || '暂无关键词' }}</view>

          <view :class="cueTheme == 'day-theme' ? 'label-name' : 'label-black'">模型:</view>
          <view
            class="modelbox"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >{{
            modelInfo.modelInfo.modelName }}
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import { collectList, moveToCollect, collectAdd } from '../static/api/index.js'
import { taskpageList } from '../static/api/clip.js'
import waterfall_list from './components/waterfall/zero-waterfall'


export default {
  components: {
    waterfall_list,

  },
  data() {
    return {
      showStatus: false, //查看关键词弹窗
      modelInfo: {
        modelInfo: {}
      }, //作品信息

      statusbox: false, // 是否开启管理
      collecStatus: false, //是否开启加入合集状态
      numberSize: 0,//已选个数
      allStatus: false,//全选 全不选
      collectList: [], //合集列表

      // 瀑布流组件相关
      list: [],
      numberList: [],
      height: 0,
      id: 0,
      collectionShow: false,
      addtext: '',
      sticky: false,
    }
  },
  onLoad(res) {
    // #ifdef MP
    let that = this;
    let demo = uni.getMenuButtonBoundingClientRect();
    that.paddingTop = demo.top * 2 + "rpx";
    let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    that.height = (statusBarHeight + 44) * 2 + 'rpx'
    // #endif

    this.getcollectList();
    this.id = res.id
  },

  onShow() {
    if (this.id) {
      this.list = []
      setTimeout(() => {
        this.$refs.chaefall.clear();
        this.getDrawList(this.id)
      }, 1000)
    }
  },

  onPullDownRefresh() {
    this.statusbox = false
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);
    if (this.id) {
      this.list = [];
      this.$refs.chaefall.clear();
      this.getDrawList(this.id)
    }
  },
  methods: {

    // 获取合集列表
    getcollectList() {
      let that = this;
      let data = {
        title: '',
        pageNum: 1,
        pageSize: 100,
      }
      collectList(data).then(res => {
        if (res.code == 200) {
          let resData = res.result.records;
          that.collectList = that.collectList.concat(resData)
        }
      })
    },

    // 获取草稿集列表
    getDrawList(id) {
      let that = this;
      let temp = {
        id: id,
        last: that.lastId,
        size: 99,
      }
      uni.showLoading({ title: '加载中...', mask: true, })
      taskpageList(temp).then(res => {
        if (res.code == 200) {
          that.modelInfo = res.result;
          res.result.records.map(item => {
            item.statusBox = false;
            item.url = item.url ? item.url + '!thumb' : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.list = res.result.records;
          setTimeout(() => {
            uni.hideLoading()
          }, 1000)
        }
      }).catch(err => { })
    },

    //  画册管理功能开启
    choiceDelete() {
      let that = this;
      that.statusbox = !that.statusbox;
    },


    // 管理--选择作品个数统计
    onClick(data) {
      this.numberSize = data.length;
      this.numberList = data;
    },

    // 管理--全选全不选
    albumCancel() {
      let that = this;
      that.allStatus = !that.allStatus
      this.$refs.chaefall.selectAll(that.allStatus);
    },

    // 管理--删除
    albumDelete() {
      let that = this;
      that.$refs.chaefall.albumDelete();
    },

    // 管理--选择合集列表
    selectCollection(id) {
      let collectList = this.collectList;
      for (var i = 0; i < collectList.length; i++) {
        if (collectList[i].id == id) {
          collectList[i].status = !collectList[i].status;
        } else {
          collectList[i].status = false;
        }
      }
      this.collectList = [...this.collectList]
    },

    // 是否开启合集
    closeColle() {
      this.collecStatus = !this.collecStatus;
    },


    // 新增合集
    collectAdd(e) {
      let that = this;
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
          that.collectionShow = false;
          that.getcollectList();
        }
      })
    },

    // 管理---添加合集
    addCollection() {
      let that = this;
      let collectList = that.collectList;
      let numberList = that.numberList //选择画册的列表
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
        if (item.statusBox) {
          arr.push(item.id)
        }
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
            that.collecStatus = false; // 关闭管理弹窗功能
            that.statusbox = false;
            uni.showToast({
              title: "添加成功", icon: 'none', duration: 3000
            })
          }
        }).finally(() => {
          uni.hideLoading()
        })

      }, 500)
    },


    // 
    copyKeyword() {
      uni.setClipboardData({
        data: this.modelInfo.prompt,
        success: function () {
          uni.showToast({ title: "关键词复制成功", icon: 'none', duration: 4000 })
        }
      });
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

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 0rpx 0rpx 240rpx;
  position: relative;
}

.navadmin {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 10rpx;
  background: #141416;
  position: fixed;
  z-index: 99;
  left: 0;
  // #ifndef MP 
  top: 60px !important;
  // #endif
  top: 0;
  right: 0;
}

.navadmin .navitem {
  width: 140rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 70rpx;
  font-size: 26rpx;
  margin: 0 10rpx 10rpx;
  display: flex;
  justify-content: flex-end;
}

.navadmin .navitem image {
  width: 36rpx;
  height: 36rpx;
  position: relative;
  top: 12rpx;
  right: 8rpx
}

.popup-title {
  text-align: center;
  line-height: 140rpx;
  color: white;
  font-weight: 600;
}

.postiont {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0rpx;
  background: rgba(51, 51, 51, 0.95);
  padding: 30rpx 30rpx 50rpx;
  display: flex;
  justify-content: space-between;
  z-index: 99;
}

.postiont .postiont-left {
  color: white;
  line-height: 100rpx;
  font-size: 24rpx;
  display: flex;
}

.postiont .postiont-left image {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 28rpx;
  margin-right: 10rpx;
}

.postiont .postiont-right {
  width: 70%;
  display: flex;
  justify-content: right;
}

.postiont .postiont-right .navitem {
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

.footer {
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(51, 51, 51, 0.95);
  padding: 30rpx 30rpx 50rpx;
}

.footer-btn {
  line-height: 88rpx;
  color: #121212;
  font-size: 32rpx;
  text-align: center;
  background: linear-gradient(45deg, #0FCCE0 0%, #10E597 100%);
  border-radius: 2000rpx 2000rpx 2000rpx 2000rpx;
}

.footer-btn image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 4rpx;
  right: 12rpx;
}

.label {
  padding: 30rpx 30rpx 100rpx;
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
  position: relative;
  padding-left: 10rpx;
  font-size: 28rpx;
  color: rgba(18, 18, 18, 0.66);
  font-weight: 400;
  display: flex;
}

.label-name image {
  width: 24rpx;
  height: 24rpx;
  position: relative;
  top: 4rpx;
  right: 4rpx;
}

.label-name .copy {
  border: 1px solid #f5f5f5;
  border-radius: 12rpx;
  margin-left: 18rpx;
  font-size: 20rpx;
  width: 84rpx;
  height: 40rpx;
  line-height: 40rpx;
  background: rgba(18, 18, 18, 0.08);
  text-align: center;
  margin-top: 22rpx;
}

.label-black {
  display: flex;
  color: rgba(244, 244, 244, 0.48);
}

.modelbox {
  color: white;
  padding: 20rpx;
  font-size: 28rpx;
  word-break: break-all;
  white-space: pre-wrap;
  border-radius: 24rpx;
  border: 2rpx solid rgba(18, 18, 18, 0.08);
}
</style>