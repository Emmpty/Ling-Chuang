<template>
  <view
    class="page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="关键词解析"
    />

    <view
      class="analysis"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', top: height }"
    >
      <view
        class="analysis-capacity"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
      >存储容量 {{ total }}/500</view>
      <!-- <view class="analysis-admin" v-if="operStatus" @click="selectAll()">{{ !allStatus ? '全选' : '全不选' }}</view> -->
      <!-- <view class="analysis-admin" v-if="operStatus" @click="deleteAnalysis()">删除</view> -->
      <!-- <view class="analysis-admin" v-if="operStatus" @click="operationalState()">取消</view> -->
      <view
        class="analysis-admin analysis-active"
        v-if="!operStatus"
        @click="operationalState()"
      >管理</view>
    </view>

    <view class="analysis-list">
      <waterfall_list
        ref="child"
        :status="waterfall.status"
        :list="waterfall.list"
        :reset="waterfall.reset"
        :statusBox="operStatus"
        @clickBox="onClick"
        @getList="getList"
        @done="onDone"
      />
    </view>

    <view
      class="footer"
      v-if="!operStatus"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        :class="[cueTheme == 'day-theme' ? 'footer-upder' : 'footer-upder footer-white']"
        @click="addPicture()"
      >
        <image
          v-if="tempFilePaths.length == 0"
          class="icon"
          :src="cueTheme == 'day-theme' ? '../static/img/home/take_active.png' : '../static/img/home/take.png'"
        />
        <view v-if="tempFilePaths.length == 0">上传图片</view>
        <image
          class="chart"
          :src="tempFilePaths[0]"
          v-if="tempFilePaths.length > 0"
        />
      </view>
      <view
        class="footer-star"
        @click="startParsing()"
      >开始解析</view>
    </view>

    <view
      class="postiont"
      v-if="operStatus"
    >
      <view class="left">
        <image
          class="icon"
          @click="selectAll()"
          :src="allStatus ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
        />
        <view>已选<text style="color:#00ebd3">{{ numberSize }}</text>项</view>
      </view>
      <view class="right">
        <view
          class="navitem"
          @click="deleteAnalysis()"
        >删除</view>
        <view
          class="navitem"
          @click="operStatus = false"
        >取消</view>
      </view>
    </view>

  </view>
</template>

<script>
import { describePage, } from '../static/api/analysis.js'
import waterfall_list from './components/waterfall/waterfall-list.vue'


export default {
  components: { waterfall_list, },
  data() {
    return {
      heightStatus: true,
      tempFilePaths: [],
      total: 0, //总条数
      operStatus: false, // 功能状态
      statusBox: true, //选中状态
      allStatus: false,//是否全选
      pageNum: 1,// 页数
      ids: [], //需要删除的id
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
        list: [],

      },
      height: '56px',
      paddingTop: '10px',
      numberSize: 0,
    };
  },

  onLoad(res) {
    let that = this;
    // #ifdef MP
    let demo = uni.getMenuButtonBoundingClientRect();
    that.paddingTop = demo.top * 2 + "rpx";
    let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    that.height = (statusBarHeight + 44) * 2 + 'rpx'
    // #endif

    that.describeList();
  },

  methods: {
    operationalState() {
      this.operStatus = !this.operStatus;
    },

    // 全选 全不选
    selectAll() {
      let that = this
      that.allStatus = !that.allStatus;
      that.$refs.child.selectAll(that.allStatus);
    },

    // 选择图片
    addPicture() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that.tempFilePaths = res.tempFilePaths;
        },
        fail(res) {
          console.log(res, '选择图片')
        }
      });
    },

    startParsing() {
      let that = this;
      if (that.tempFilePaths.length == 0) {
        uni.showToast({
          title: '请上传图片后再操作',
          icon: "none",
          duration: 4000
        });
        return
      }
      uni.showLoading({ title: '图片解析中' });
      uni.uploadFile({
        method: 'POST',
        header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
        url: this.$baseURL + '/task/describe',
        filePath: this.tempFilePaths[0],
        formData: {},
        name: 'file',
        success: (res) => {
          let data = JSON.parse(res.data);
          uni.hideLoading()
          if (data.code == 200) {
            that.tempFilePaths = [];
            that.pageNum = 1;
            that.ajax.load = true;
            that.describeList();
          } else {
            uni.showToast({ title: data.message, icon: 'none', duration: 4000 })
          }
        },
      });
    },

    onDone() {
      this.waterfall.reset = false;
      this.ajax.load = true;
      this.ajax.page++;
      this.waterfall.status = 'await';
      uni.hideLoading()
    },

    // 获取列表
    describeList() {
      let that = this;
      if (!that.ajax.load) {
        return;
      }
      that.ajax.load = false;
      uni.showLoading({ title: '加载中...' });
      let data = {
        title: '',
        pageNum: that.pageNum,
        pageSize: 10,
      }

      describePage(data).then(res => {
        if (res.code == 200) {
          if (that.pageNum == 1) { //充值
            that.waterfall.reset = true;
          }
          if (res.result.records.length == 0) { // 关闭
            that.waterfall.status = 'finish';
            uni.hideLoading()
            return
          }
          res.result.records.map(item => {
            item.image = item.image ? item.image : 'https://cdn.lingchuang.art/ling/load-error.jpg';
          })
          that.waterfall.list = [...res.result.records];
          that.waterfall.status = 'success';
          that.total = res.result.total;
          that.pageNum = that.pageNum + 1;
        }
      })
    },

    getList() {
      let that = this;
      that.ajax.load = true;
      that.pageNum = 1;
      that.describeList();
    },

    // 删除解析
    deleteAnalysis() {
      let that = this;
      if (that.waterfall.list.length == 0) {
        return
      }
      that.$refs.child.albumDelete();
    },

    // 解析详情
    detailsAnalysis(index) {
      let that = this;
      let data = that.List;
      if (that.operStatus) {
        data[index].statusBox = !data[index].statusBox
        that.List = [...data]
        return;
      }
      uni.setStorageSync('goods', data[index]);
      uni.navigateTo({
        url: "/phome/ending"
      })
    },

    // 画册点击事件
    onClick(data) {
      console.log(data,)
      this.numberSize = data.length;
      let ids = []
    },

    onReachBottom() {
      let that = this;
      that.describeList();
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
  padding: 0rpx 0rpx 400rpx;
  min-height: 100vh;
}

.analysis {
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 24rpx;
  line-height: 74rpx;
  padding: 20rpx;
  position: fixed;
  left: 0rpx;
  top: 0;
  right: 0rpx;
  z-index: 999;
}

.analysis .analysis-capacity {
  width: 40%;
}

.analysis .analysis-admin {
  width: 128rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  color: #141416;
  font-size: 24rpx;
  background: #F5F5F5;
  border-radius: 32rpx 32rpx 32rpx 32rpx;
}

.analysis .analysis-active {
  background: #00EBD3 !important;
}

.analysis-list {
  padding-top: 100rpx;

}

.analysis-list-item {
  position: relative;
  display: inline-block;
  width: 48%;
  margin: 6rpx;
}

.analysis-list-item .icon {
  width: 50rpx;
  height: 50rpx;
  position: absolute;
  top: 20rpx;
  left: 20rpx;
}

.analysis-list-item image {
  width: 100%;

}


.postiont {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0rpx;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  height: 140rpx;
  z-index: 99;
  padding-top: 20rpx;
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
  width: 48%;
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

.footer {
  position: fixed;
  bottom: 0rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0 40rpx;
  background: white;
  z-index: 99999;
}

.footer .footer-upder {
  width: 176rpx;
  height: 128rpx;
  text-align: center;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  border: 2rpx dashed #1A1A1A;
  font-size: 24rpx;
}

.footer-white {
  width: 176rpx;
  height: 128rpx;
  text-align: center;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  border: 2rpx dashed white !important;
  color: white !important;
  font-size: 24rpx;
}

.footer .footer-upder .icon {
  width: 48rpx;
  height: 48rpx;
  margin-top: 20rpx;
}

.footer .footer-upder .chart {
  width: 100%;
  height: 100%;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
}

.footer .footer-star {
  width: 462rpx;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0rpx 16rpx 32rpx 2rpx rgba(0, 219, 197, 0.2);
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  opacity: 1;
  color: #141416;
  margin-top: 20rpx;
}
</style>