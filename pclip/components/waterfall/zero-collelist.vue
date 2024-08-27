<template>
  <view class="container">
    <!-- 画册视图 -->
    <view class="waterfall_left">
      <block
        v-for="(item, index) in listLeft"
        :key="index"
      >
        <view
          class="waterfall_item"
          v-if="item && item.id > 0"
        >
          <view
            class="item_img"
            @tap="onTap(index, 1)"
          >
            <image
              class="shstatuss"
              v-if="statusBox"
              :src="item.statusBox ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
            />
            <image
              class="icon"
              :src="item.thumbUrl"
              @click="albumDetails(item)"
              mode="widthFix"
              @load="considerPush"
              @error="binderror($event, index, 1)"
            ></image>
            <view
              class="defeated"
              v-if="item.statusboy == 0 || item.id == undefined"
              style="color:#FF6850;"
              @click="albumDetails(item)"
            ></view>
            <block v-else>
              <view
                class="defeated"
                v-if="item.status == -1"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >制作失败</view>
              <view
                class="defeated"
                v-else-if="item.status == -3"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >制作超时</view>
              <view
                class="defeated"
                v-else-if="item.status == -5"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >参数有误</view>
              <view
                class="defeated"
                v-else-if="item.status == -6"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >关键词异常</view>
              <view
                class="defeated"
                v-else-if="item.status == -7"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >链接异常</view>
              <view
                class="defeated"
                v-else-if="item.status == -8"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >审核不通过</view>
              <view
                class="defeated"
                v-else-if="item.status > 0"
                style="color:#1AFFE8;"
                @click="albumDetails(item)"
              >正在制作中</view>
              <view
                class="defeated"
                v-else-if="item.status < 0"
                style="color:#1AFFE8;"
                @click="albumDetails(item)"
              >制作失败</view>
            </block>
          </view>
        </view>
      </block>
    </view>
    <view class="waterfall_right">
      <block
        v-for="(item, index) in listRight"
        :key="index"
      >
        <view
          class="waterfall_item"
          v-if="item && item.id > 0"
        >
          <view
            class="item_img"
            @tap="onTap(index, 2)"
          >
            <image
              class="shstatuss"
              v-if="statusBox"
              :src="item.statusBox ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
            />
            <image
              class="icon"
              :src="item.thumbUrl"
              @click="albumDetails(item)"
              mode="widthFix"
              @load="considerPush"
              @error="binderror($event, index, 1)"
            ></image>
            <view
              class="defeated"
              v-if="item.statusboy == 0 || item.id == undefined"
              style="color:#FF6850;"
              @click="albumDetails(item)"
            ></view>
            <block v-else>
              <view
                class="defeated"
                v-if="item.status == -1"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >制作失败</view>
              <view
                class="defeated"
                v-else-if="item.status == -3"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >制作超时</view>
              <view
                class="defeated"
                v-else-if="item.status == -5"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >参数有误</view>
              <view
                class="defeated"
                v-else-if="item.status == -6"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >关键词异常</view>
              <view
                class="defeated"
                v-else-if="item.status == -7"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >链接异常</view>
              <view
                class="defeated"
                v-else-if="item.status == -8"
                style="color:#FF6850;"
                @click="albumDetails(item)"
              >审核不通过</view>
              <view
                class="defeated"
                v-else-if="item.status > 0"
                style="color:#1AFFE8;"
                @click="albumDetails(item)"
              >正在制作中</view>
              <view
                class="defeated"
                v-else-if="item.status < 0"
                style="color:#1AFFE8;"
                @click="albumDetails(item)"
              >制作失败</view>
            </block>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>
<script>
import { taskdeleteBatch } from '../../../static/api/index.js'
export default {
  name: "zero-waterfall",
  props: {
    list: {
      type: Array,
      required: true,
      default: []
    },
    // 是否显示选择框
    statusBox: {
      type: Boolean,
    },
    // 视图类型
    viewType: {
      type: [String, Number]
    }
  },

  data() {
    return {
      listLeft: [],
      listRight: [],
      newList: [],
    }
  },

  watch: {
    list(newValue, oldValue) {
      this.newList = newValue.slice(oldValue.length);
      this.considerPush()
    },
  },

  mounted() {
    // this.init()
  },

  methods: {

    onTap(index, type) {
      let that = this;
      if (!that.statusBox) return
      if (type == 1) {
        that.listLeft[index].statusBox = !that.listLeft[index].statusBox;
        that.listLeft = [...that.listLeft]
      } else {
        that.listRight[index].statusBox = !that.listRight[index].statusBox;
        that.listRight = [...that.listRight]
      }
      that.$emit("clickBox", that.numberSize());
    },

    // 画册选中个数统计
    numberSize(e) {
      let that = this;
      let list = that.listLeft.concat(that.listRight)
      const newArr = list.filter((item, i, arr) => {
        if (item && item.id) {
          return item.statusBox
        }
      })
      return newArr;
    },

    // 全选全不选
    selectAll(status) {
      console.log(status)
      let that = this;
      let listLeft = that.listLeft
      let listRight = that.listRight
      for (var i = 0; i < listLeft.length; i++) {
        if (listLeft[i] && listLeft[i].id) {
          listLeft[i].statusBox = status ? true : false
        }
      }
      for (var i = 0; i < listRight.length; i++) {
        if (listRight[i] && listRight[i].id) {
          listRight[i].statusBox = status ? true : false
        }
      }
      this.$emit("clickBox", that.numberSize());
    },

    // 删除画册
    albumDelete() {
      let that = this;
      let albumList = that.listLeft.concat(that.listRight);
      let arr = [];
      albumList.map(item => {
        if (item && item.statusBox) {
          arr.push(item.id)
        }
      })
      if (arr.length == 0) {
        uni.showToast({ title: "请选择需要删除的作品", icon: "none", duration: 3000 })
        return
      }
      uni.showModal({
        title: '温馨提示',
        content: '你确认是否删除？',
        success: (res) => {
          if (res.confirm) {
            taskdeleteBatch(arr).then(res => {
              if (res.code == 200) {
                that.localDeletion()
              }
            }).catch(err => { })
          }
        }
      })
    },

    // 删除本地
    localDeletion() {
      let that = this;
      uni.showToast({ title: "删除成功", duration: 3000 })
      that.statusbox = false;
      const listLeft = that.listLeft.filter((item, i, arr) => {
        if (item && !item.statusBox) {
          return !item.statusBox
        }
      })
      const listRight = that.listRight.filter((item, i, arr) => {
        if (item && !item.statusBox) {
          return !item.statusBox
        }
      })
      that.listLeft = [...listLeft];
      that.listRight = [...listRight];
      that.$emit("clickBox", that.numberSize());
    },

    // 画册详情
    albumDetails(item) {
      let that = this;
      if (!that.statusBox) {
        uni.setStorageSync("albumName", "画册详情");
        if (item.status > 0) { //制作中
          uni.navigateTo({
            url: '/phome/make?id=' + item.id
          })
          return;
        }
        uni.navigateTo({
          url: "/pclip/detail?id=" + item.id,
        })
      }
    },

    async binderror(event, index, type) {
      if (event.detail.errMsg.indexOf("404") != -1) {
        if (type == 1) {
          this.listLeft[index].statusboy = 0;
          this.listLeft[index].url = 'https://cdn.lingchuang.art/ling/load-error.jpg'
        } else {
          this.listRight[index].statusboy = 0;
          this.listRight[index].url = 'https://cdn.lingchuang.art/ling/load-error.jpg'
        }
      }
    },

    // 触发重新排列
    init() {
      this.newList = [...this.list];
      this.listLeft = [];
      this.listRight = [];
      if (this.newList.length != 0) {
        this.listLeft.push(this.newList.shift()); //触发排列
        // this.listRight.push(this.newList[1]); //触发排列
      }
    },

    // 清空数据列表
    clear() {
      this.listLeft = [];
      this.listRight = [];
      // 同时清除父组件列表中的数据
      this.$emit('clear', []);
      this.newList = [];
    },

    async considerPush() {
      if (this.newList.length == 0) return; //没有数据了
      let leftH = 0,
        rightH = 0; //左右高度
      var query = uni.createSelectorQuery().in(this);

      query.selectAll('.waterfall_left').boundingClientRect()
      query.selectAll('.waterfall_right').boundingClientRect()

      // 等待 exec 完成
      let res = await new Promise((resolve) => {
        query.exec(resolve);
      });

      leftH = res[0].length != 0 ? res[0][0].height : 0; //防止查询不到做个处理
      rightH = res[1].length != 0 ? res[1][0].height : 0;
      if (leftH == rightH || leftH < rightH) {
        // 相等 || 左边小  
        this.listLeft.push(this.newList.shift());
      } else {
        // 右边小
        this.listRight.push(this.newList.shift());
      }
    },
  }
}
</script>
<style lang="scss" scoped>.container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20rpx 10rpx;
}

.waterfall_left,
.waterfall_right {
  width: 50%;
}

.waterfall_item {
  width: 100%;
  padding: 6rpx 10rpx;

  .item_img {
    width: 100%;
    position: relative;
    border-radius: 10rpx;

    // padding:14rpx;
    .icon {
      width: 100%;
      border-radius: 10rpx;
    }

    .shstatuss {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      width: 40rpx;
      height: 40rpx;
      z-index: 99;
    }

    .tips {
      min-width: 88rpx;
      height: 34rpx;
      line-height: 34rpx;
      font-size: 18rpx;
      padding: 0 12rpx;
      text-align: center;
      background: rgba(250, 160, 24, 0.8);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      color: white;
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      z-index: 9;
    }

    .defeated {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: white;
      background: #666;
      border-radius: 4rpx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .number {
      color: #666;
      padding-top: 14rpx;
      line-height: 60rpx;
      z-index: 999;
    }
  }


}</style>