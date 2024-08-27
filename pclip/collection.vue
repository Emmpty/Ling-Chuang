<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', }"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      :title="titleName"
    />

    <view class="flex-col flex-auto group_3">

      <view
        class="tipstop"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', top: height }"
        v-if="topStatus"
      >
        <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">共{{ total }}项</view>
        <view>
          <!-- <view class="select" @click="topClick">{{ topStatus ? "选择" : "取消" }}</view> -->
          <image
            @click="topClick()"
            :src="cueTheme != 'day-theme' ? '../static/img/clip/sort2.png' : '../static/img/clip/sort22.png'"
          >
          </image>
          <image
            @click="litipsClick(2)"
            :src="cueTheme == 'day-theme' ? '../static/img/clip/icon11.png' : '../static/img/clip/icon1.png'"
          >
          </image>
        </view>
        <!-- <view class="select" @click="topClick">{{ topStatus ? "选择" : "取消" }}</view>
        <view class="funct">
          <image class="icon" @click="litipsClick('')"
            :src="cueTheme == 'day-theme' ? '../static/img/clip/icon44.png' : '../static/img/clip/icon4.png'" />
          <view class="funct-model" v-if="functStatus" @click="litipsClick('')"></view>
          <view class="funct-item" v-if="functStatus"
            :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">
            <view class="li" @click="litipsClick(1)">
              <image :src="cueTheme == 'day-theme' ? '../static/img/clip/icon11.png' : '../static/img/clip/icon1.png'" />添加作品
            </view>
            <view class="li" @click="litipsClick(2)">
              <image :src="cueTheme == 'day-theme' ? '../static/img/clip/icon22.png' : '../static/img/clip/icon2.png'" />编辑合集
            </view>
            <view class="li" @click="litipsClick(3)">
              <image :src="cueTheme == 'day-theme' ? '../static/img/clip/icon33.png' : '../static/img/clip/icon3.png'" />删除合集
            </view>
          </view>
        </view> -->
      </view>



      <zeroCollelist
        :list="list"
        :statusBox="!topStatus"
        ref="chaefall"
        @clickBox="onClick"
      />


      <!-- <helang-waterfall-list ref="child" :status="waterfall.status" :list="waterfall.list" :reset="waterfall.reset"
        :statusBox="!topStatus" @clickBox="onClick" @done="onDone" @albumCancel="albumCancel">
        <template>

        </template>
      </helang-waterfall-list> -->

      <!-- <view style="height: 100vh;" v-if="waterfall.list.length ==0"></view> -->
    </view>

    <!--  -->
    <view
      class="flex"
      v-if="!topStatus"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="choose"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        @click="albumCancel()"
      >
        <image
          class="icon"
          :src="allStatus ? '../static/img/clip/status_active.png' : '../static/img/clip/status.png'"
        />
        <view>
          已选 <text style="color:#1AFFE8;">{{ listTotle }}</text> 项
        </view>
      </view>
      <!-- <view :class="cueTheme == 'day-theme' ? 'btnactive' : 'btn'" @click="selectAll()">{{ allStatus ? "全不选" : '全选' }}</view> -->
      <view
        :class="cueTheme == 'day-theme' ? 'btnactive' : 'btn'"
        @click="removeClick(1)"
      >移除合集</view>
      <view
        :class="cueTheme == 'day-theme' ? 'btnactive' : 'btn'"
        @click="removeClick(2)"
      >删除</view>
      <view
        :class="cueTheme == 'day-theme' ? 'btnactive' : 'btn'"
        @click="topStatus = true"
      >取消</view>
    </view>

    <!-- 编辑合集弹窗 -->
    <view
      class="model"
      v-if="collectionShow"
    >
      <view
        class="model-body"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >编辑合集</view>
        <input
          type="text"
          v-model="addtext"
          placeholder="请输入名称"
          :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        />
        <view
          class="items"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >
          <view>置顶</view> <u-switch
            activeColor="#1affe8"
            v-model="sticky"
            size="16"
          ></u-switch>
        </view>
        <view class="btns">
          <view
            class="btnsize"
            @click="collectionShow = false"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#141416', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            取消</view>
          <view
            class="btnsize actice"
            @click="collectEdit()"
          >确定</view>
        </view>
      </view>
    </view>


    <!-- 添加 -->
    <view
      class="add"
      @click="taskClick(1)"
      v-if="topStatus"
    ><text>+</text></view>

    <!-- 列表展示 -->
    <view
      class="popup-model"
      v-if="popupShow"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'height': '980rpx' }"
    >
      <view
        class="popup"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416', 'height': '980rpx' }"
      >
        <view
          class="title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >添加作品
          <view
            class="close"
            @click="taskClick(1)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >+</view>
        </view>

        <scroll-view
          scroll-y="true"
          style="height:980rpx;margin-bottom:140rpx"
          @scrolltolower="bindscrolltolower"
        >

          <addList
            ref="child2"
            :status="waterfall2.status"
            :list="waterfall2.list"
            :reset="waterfall2.reset"
            @clickBox="numberSize"
            @getdone="onDone2"
          ></addList>

        </scroll-view>
        <view
          class="btn"
          @click="taskClick(2)"
        >确定</view>
      </view>
    </view>

  </view>
</template>

<script>
import { collectTaskpage, taskPage, moveToCollect, moveOutCollect, deleteInCollect, collectDelete, collectEdit } from '../static/api/index.js'
import addList from "./components/add-list"

import zeroCollelist from "./components/waterfall/zero-collelist"
export default {
  components: {
    addList,
    zeroCollelist,
  },
  data() {
    return {
      titleName: '合集',
      topStatus: true,// 选择状态       
      functStatus: false, // 功能状态
      collectionShow: false, // 编辑合集弹窗
      listTotle: 0,   // 选择个数
      datalist: [], // 合集列表

      // 异步请求相关
      // ajax: {
      //   load: true,// 是否可以加载
      //   rows: 10,  // 每页的请求条件
      //   page: 1, // 页码
      //   dataList: [],// 数据列表
      // },

      // 瀑布流组件相关
      waterfall: { status: "", reset: false, list: [] },
      numberList: [],//选中列表


      allStatus: false,// 全选状态       
      popupShow: false, // 添加合集弹窗
      // 异步请求相关
      ajax2: {
        load: true,// 是否可以加载
        rows: 10,  // 每页的请求条件
        page: 1, // 页码
        dataList: [],// 数据列表
      },
      // 瀑布流组件相关
      waterfall2: { status: "", reset: false, list: [] },

      list: [],//合集列表
      total: 0,//合集总个数
      page: 1,//合集分页

      pageNum2: 1,//添加作品分页
      pageTotal: 0,//添加作品分页总个数
      draftlist: [], //添加草稿列表
      id: 0, // 合集列表ID
      addtext: '',  // 编辑合集名称
      sticky: false, // 编辑合集是否置顶
      height: 0,
    };
  },
  onLoad(res) {

    // #ifdef MP
    let that = this;
    let demo = uni.getMenuButtonBoundingClientRect();
    that.paddingTop = demo.top * 2 + "rpx";
    let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    that.height = (statusBarHeight + 44) * 2 + 'rpx'
    // #endif

    if (res.title) {
      uni.setNavigationBarTitle({
        title: res.title,
      })
      this.addtext = res.title;
      this.sticky = res.sort == 0 ? false : true;
    }
    this.id = res.id;
    uni.setStorageSync("id", res.id);
    // this.getDrawList(res.id)
    this.taskPage()
  },


  onShow() {
    // 此处是用户在详情页删除作品后，返回合集页，需要刷新合集列表接口
    if (uni.getStorageSync('id')) {
      this.getDrawList(uni.getStorageSync('id'))
    }

  },

  //上拉 加载
  onReachBottom() {
    let that = this;
    if (that.list.length >= that.total) {
      return
    } else {
      this.getDrawList(this.id)
    }
  },

  methods: {

    // 获取数据
    getDrawList(id) {
      let that = this;
      uni.showLoading({ title: '加载中' });
      let temp = {
        collectId: parseInt(id),
        pageNum: that.page,
        pageSize: 10,
      }
      collectTaskpage(temp).then(res => {
        if (res.code == 200) {
          res.result.records.map(item => {
            item.statusBox = false
            item.thumbUrl = item.thumbUrl ? item.thumbUrl : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          that.list = that.list.concat(res.result.records);
          that.total = res.result.total
          that.page = that.page + 1
          uni.hideLoading()
        }
      }).catch(err => { })
    },

    // 画册点击事件
    onClick(data) {
      if (data.length != this.list.length) {
        this.allStatus = false
      }
      this.listTotle = data.length;
      this.numberList = data;
    },

    // 选择取消
    topClick() {
      this.topStatus = !this.topStatus;
      this.functStatus = false;
    },

    //  添加作品 ，编辑合集 ， 删除合集
    litipsClick(type) {
      let that = this;
      that.topStatus = true;
      that.popupShow = false; //关闭合集弹窗
      that.functStatus = !that.functStatus
      if (type == 1) { //添加作品
        that.taskClick(1);
      } else if (type == 2) {  // 编辑合集
        that.collectionShow = true;
      } else if (type == 3) { //删除合集
        uni.showModal({
          title: '温馨提示',
          content: '您确认要删除吗？',
          success: function (res) {
            if (res.confirm) {
              let array = [];
              array.push(parseInt(that.id))
              collectDelete(array).then(res => {
                if (res.code == 200) {
                  uni.showToast({
                    title: "删除成功", icon: 'none', duration: 3000
                  })
                  uni.navigateBack();
                }
              })
            }
          }
        });

      }
    },

    // 选择列表
    chooseClick(index) {
      this.datalist[index].status = !this.datalist[index].status;
      if (this.datalist[index].status) {
        this.listTotle = this.listTotle + 1
      } else {
        this.listTotle = this.listTotle - 1
      }
    },

    // 编辑合集
    collectEdit() {
      let that = this;
      let data = {
        title: that.addtext,
        collectId: that.id,
        sticky: that.sticky,
      }
      collectEdit(data).then(res => {
        if (res.code == 200) {
          that.collectionShow = false;
          uni.setNavigationBarTitle({
            title: that.addtext,
          })
          uni.showToast({
            title: "编辑成功", icon: 'none', duration: 3000
          })
        }
      })
    },

    // 全选
    albumCancel() {
      let that = this;
      that.allStatus = !that.allStatus
      this.$refs.chaefall.selectAll(that.allStatus);
    },

    // 移除合集
    removeClick(type) {
      let removeId = [];
      this.numberList.map(item => { removeId.push(item.id) })
      if (removeId.length == 0) {
        uni.showToast({
          title: "请选择需要" + (type == 1 ? '移除' : '删除') + "的作品", icon: 'none', duration: 3000
        })
        return;
      }
      if (type == 1) { //移除合集
        moveOutCollect({ taskList: removeId, collectId: this.id, }).then(res => {
          if (res.code == 200) {
            this.list = []
            this.page = 1
            this.$refs.chaefall.clear()
            this.listTotle = 0;
            setTimeout(() => {
              this.getDrawList(this.id);
            }, 300)
            uni.showToast({
              title: "移除成功", icon: 'none', duration: 3000
            })
          }
        })
      } else { // 删除合集
        deleteInCollect({ taskList: removeId, collectId: this.id, }).then(res => {
          if (res.code == 200) {
            this.list = []
            this.page = 1
            this.$refs.chaefall.clear()
            this.listTotle = 0;
            setTimeout(() => {
              this.getDrawList(this.id);
            }, 300)
            uni.showToast({
              title: "删除成功", icon: 'none', duration: 3000
            })
          }
        })
      }
    },

    // 瀑布流组件渲染完成
    onDone2() {
      // 设置组件为 非重置，这行代码保留不删即可
      this.waterfall2.reset = false;
      // 恢复 getList 方法的调用
      this.ajax2.load = true;
      this.ajax2.page++;
      // 设置组件状态为 等待加载
      this.waterfall2.status = 'await';
    },

    numberSize(data) {
      this.draftlist = data;
    },
    // 获取草稿合集列表
    taskPage() {
      let that = this
      if (!that.ajax2.load) {
        return;
      }
      that.ajax2.load = false;
      // 设置状态为加载中
      that.waterfall2.status = 'loading';
      let temp = {
        pageNum: that.ajax2.page,
        pageSize: 6,
      }
      taskPage(temp).then(res => {
        if (res.code == 200) {
          // this.pageNum2 =this.pageNum2 +1;
          // this.pageTotal =res.result.total;
          // let resData =res.result.records
          // resData.map(item=>{ item.statusBox=false;})
          // this.draftlist=this.draftlist.concat(resData);

          res.result.records.map(item => {
            item.thumbUrl = item.status == 0 ? item.thumbUrl : 'https://cdn.lingchuang.art/ling/load-error.jpg'
          })
          // 第一页数据执行以下代码
          if (that.ajax2.page == 1) {
            uni.stopPullDownRefresh();  // 关闭下拉
            // 设置组件状态为 重置，可供下拉刷新这类需要重置列表功能时使用
            that.waterfall2.reset = true;
          }

          // 数据无效时处理
          if (!res.result.records || res.result.records.length < 1) {
            // 设置组件为 加载结束 状态
            that.waterfall2.status = 'finish';
            return;
          }

          // 将数据赋值给瀑布流 list 属性
          that.waterfall2.list = [...res.result.records];
          // 设置组件为 加载成功 状态，此时瀑布流组件开始计算当前数据的布局
          that.waterfall2.status = 'success';

          // 缓存当前数据给其他需要该数据的功能使用
          if (that.ajax2.page == 1) {
            that.ajax2.dataList = res.result.records;
          } else {
            that.ajax2.dataList = [...that.ajax2.dataList, ...res.result.records];
          }
          // 记录本次数据长度，意义请看 done 事件的回调
          that.ajax2.dataCount = res.result.records.length || 0;

        }
      }).catch(err => { })
    },

    // 获取草稿合集列表 分页
    bindscrolltolower() {
      // if(this.pageTotal == this.draftlist.length){
      //   return
      // }else{
      this.taskPage()
      // }
    },

    // 添加作品
    taskClick(e) {
      let that = this;
      let draftlist = that.draftlist;
      let taskList = [];
      if (e == 1) {
        that.popupShow = !that.popupShow;
        this.waterfall2 = { status: "", reset: false, list: [] },
          this.ajax2.load = true;
        this.ajax2.page = 1;
        that.taskPage()
        return
      }
      draftlist.map(item => {
        if (item.statusBox) {
          taskList.push(item.id)
        }
      })
      if (taskList.length == 0) {
        uni.showToast({
          title: "请选择需要添加的作品", icon: 'none', duration: 3000
        })
        return;
      }
      moveToCollect({ taskList: taskList, collectId: that.id, }).then(res => {
        if (res.code == 200) {
          that.popupShow = !that.popupShow;
          uni.showToast({
            title: "添加成功", icon: 'none', duration: 3000
          })
          that.list = []
          that.page = 1;
          that.$refs.chaefall.clear();
          setTimeout(() => {
            that.getDrawList(that.id);   // 更新合集列表
          }, 300)
          // 更新添加作品列表
          that.pageNum2 = 1;
          that.draftlist = [];
          that.taskPage()
        }
      })
    },
    // 选择要添加的合集
    screenDel(idx, ids) {
      let that = this;
      // that.draftlist.forEach((item,index)=>{
      // const{ statusBox,id}=item;
      // item.statusBox = ids==id?!statusBox:statusBox;
      // this.$set(data2[index], "status", !data2[index].status);
      // that.$set(that.draftlist[index],'statusBox',ids==id?!statusBox:statusBox)
      // })
      //  that.draftlist = JSON.parse(JSON.stringify(that.draftlist)); 
      //  console.log( that.draftlist,' that.draftlist')

      //  this.$set(data2[index], "status", !data2[index].status);
      // that.popupShow =false;
      // setTimeout(function(){
      //   that.popupShow =true;
      // },300)
      //  that.$forceUpdate()
      // that.draftlist[index].statusBox = !that.draftlist[index].statusBox
    },

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
<style>
.page {
  /* background-color: #141416; */
  margin-bottom: 100rpx;
  min-height: 100vh;
}
</style>
<style lang="scss">
.demo-warter {
  border-radius: 8px;
  margin: 5px;
  background: #262628;
  padding: 8px;
  position: relative;
  text-align: right;

  .shstatuss {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    width: 45rpx;
    height: 45rpx;
  }
}

.add {
  position: fixed;
  right: 30rpx;
  bottom: 50rpx;
  width: 53px;
  height: 53px;
  line-height: 50px;
  text-align: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
}

.add text {
  font-size: 80rpx;
  font-weight: 700;
}

.collect {
  padding: 10rpx;
}

.collect .collect-list {
  // border: 1px solid red;
  border-radius: 14rpx;
  margin: 10rpx;
  position: relative;
  background: rgba(255, 255, 255, 0.08);
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
  background: rgba(255, 255, 255, 0.08);
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
    }
  }
}



.tipstop {
  position: fixed;
  top: 0;
  left: 0rpx;
  right: 0rpx;
  display: flex;
  padding: 0 30rpx 10rpx;
  justify-content: space-between;
  // justify-content: flex-end;
  color: white;
  // padding-bottom:30rpx;
  z-index: 99;
  background-color: #141416;
}

.tipstop image {
  width: 40rpx;
  height: 40rpx;
  margin-left: 30rpx;
}

.tipstop .select {
  width: 64px;
  height: 24px;
  line-height: 24px;
  background: rgba(26, 255, 232, 0.1);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  text-align: center;
  font-size: 12px;
  color: #1AFFE8;
  border: 1px solid #1AFFE8;
  z-index: -2;
}

.tipstop .funct {
  position: relative;
}

.tipstop .funct .funct-model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0rpx;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
}

.tipstop .funct .funct-item {
  position: absolute;
  top: 40rpx;
  right: 34rpx;
  width: 124px;
  height: 124px;
  background: #262628;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  z-idnex: 3;
}

.tipstop .funct .funct-item .li {
  font-size: 14px;
  line-height: 40px;
  padding-left: 20rpx;
}

.tipstop .funct .funct-item .li image {
  width: 30rpx;
  height: 30rpx;
  position: relative;
  top: 4rpx;
  margin-right: 16rpx;
}

.tipstop .funct .icon {
  width: 50rpx;
  height: 50rpx;
  margin-left: 30rpx;
  z-index: 4;
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

/* 11 */
.pubuBox {
  background: #141416;
  padding: 22rpx;
  height: 100%;
}

.pubuItem {
  column-count: 2;
  column-gap: 20rpx;
}

.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
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

    image {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      top: 8rpx;
    }
  }

  .icon {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    // margin-left: 30rpx;
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


/* .tipstop */
.flex {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 66px;
  line-height: 66px;
  background: #000;
  display: flex;
  justify-content: space-between;
  color: white;
  padding: 0 20rpx;
  z-index: 9999;
}

.flex .choose {
  width: 240rpx;
  display: flex;
}

.flex .choose .icon {
  width: 36rpx;
  height: 36rpx;
  position: relative;
  top: 40rpx;
  margin-right: 10rpx;
}

.flex .btn {
  width: 68px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 18px 18px 18px 18px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-top: 30rpx;
  z-index: 9999;
}

.flex .btnactive {
  width: 68px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background: #f5f5f5;
  color: #141416;
  border-radius: 18px 18px 18px 18px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-top: 30rpx;
}

.popup-model {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90%;
  border-radius: 20rpx 20rpx 0 0;
  background: #141416;
  border: 1px solid rgba(18, 18, 18, 0.04) !important;
  z-index: 999999;

}

.popup {
  color: white;
  border-radius: 20rpx 20rpx 0 0;
}

.popup .title {
  // background-color: #2E2E33;
  line-height: 100rpx;
  text-align: center;
  position: relative;
}

.popup .title .close {
  position: absolute;
  top: 10rpx;
  right: 28rpx;
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 54rpx;
  color: white;
  transform: rotate(-45deg);
}

.popup .input {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  width: 343px;
  height: 40px;
  margin: 0 auto 20rpx;
  padding-left: 20rpx;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.popup .list {
  width: 47%;
  margin: 10rpx;
  height: 340rpx;
  display: inline-block;
  position: relative;
}

.popup .list .icon {
  width: 40rpx;
  height: 40rpx;
  z-index: 99;
  position: absolute;
  top: 20rpx;
  left: 20rpx;
}

.popup .list .ipce {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.popup .btn {
  height: 48px;
  line-height: 48px;
  color: #141416;
  text-align: center;
  position: fixed;
  bottom: 20rpx;
  left: 30rpx;
  right: 30rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
  z-index: 9999;
}

.page {
  background-color: #141416;
  padding-bottom: 140rpx;
}

.group_3 {
  padding: 60rpx 0rpx 0;
  // overflow-y: auto;
  // height: 100vh;
}

.grid {
  // max-height: 686rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 32rpx;
  column-gap: 32rpx;
}

.grid .grid-item {
  position: relative;
}

.grid .grid-item .icon {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 40rpx;
  height: 40rpx;
}

.grid-lsit {
  border: 1px solid white;
  border-radius: 32rpx;
}

.grid-lsit .name {
  font-size: 30rpx;
  line-height: 328rpx;
  height: 328rpx;
  color: white;
  text-align: center;
}

.grid-item {
  border-radius: 32rpx;
  width: 328rpx !important;
  // height: 328rpx !important;
}

.group_4 {
  margin-top: 52rpx;
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
  color: #ffffff;
}

.font_2 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  color: #ffffffcc;
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
</style>