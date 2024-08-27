<template>
  <view>
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
                :webp="true"
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
                  style="color:#FF6850;"
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
                :webp="true"
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
                  style="color:#FF6850;"
                  @click="albumDetails(item)"
                >制作失败</view>
              </block>
            </view>
          </view>
        </block>
      </view>
    </view>

    <view
      class="postiont"
      v-if="statusBox"
    >
      <view class="left">
        <image
          class="icon"
          @click="selectAlls()"
          :src="collectAll ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
        />
        <view>已选<text style="color:#00ebd3">{{ collectSize.length }}</text>项</view>
      </view>
      <view
        class="right"
        style="width:auto;"
      >
        <view
          class="navitem"
          @click="originalityDelete()"
        >删除</view>
        <view
          class="navitem"
          @click="originalityClose()"
        >取消</view>
      </view>
    </view>
  </view>
</template>
<script>
import { taskdeleteBatch, } from '../../../../static/api/index.js'
export default {
  name: "zero-waterfall",
  props: {
    // 需要在使用页面 onPageScroll 传进来
    list: {
      type: Array,
      required: true,
      default: []
    },
  },
  data() {
    return {
      listLeft: [],
      listRight: [],
      newList: [],
      statusBox: false,
      collectSize: [],
      collectAll: false,
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

    deleteStatus(status) {
      if (status) {
        this.statusBox = false
      } else {
        this.statusBox = !this.statusBox
      }
    },

    onTap(index, type) {
      let that = this;
      if (!that.statusBox) return
      if (type == 1) {
        that.listLeft[index].statusBox = !that.listLeft[index].statusBox;
      } else {
        that.listRight[index].statusBox = !that.listRight[index].statusBox;
      }
      that.collectSize = that.numberSize()
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
    selectAlls() {
      let that = this;
      let listLeft = that.listLeft
      let listRight = that.listRight
      that.collectAll = !that.collectAll
      for (var i = 0; i < listLeft.length; i++) {
        if (listLeft[i] && listLeft[i].id) {
          listLeft[i].statusBox = that.collectAll ? true : false
        }
      }
      for (var i = 0; i < listRight.length; i++) {
        if (listRight[i] && listRight[i].id) {
          listRight[i].statusBox = that.collectAll ? true : false
        }
      }
      that.collectSize = that.numberSize()
    },

    // 删除画册
    originalityDelete() {
      uni.showModal({
        title: '温馨提示',
        content: '你确认是否删除？',
        success: (res) => {
          if (res.confirm) {
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
            taskdeleteBatch(arr).then(res => {
              if (res.code == 200) {
                that.statusBox = false,
                  that.collectSize = [],
                  that.collectAll = false,
                  that.localDeletion()
              }
            }).catch(err => { })
          }
        }
      })
    },

    // 
    originalityClose() {
      this.statusBox = !this.statusBox
      this.$emit("originalityClose", this.statusBox);
    },

    // 删除本地
    localDeletion() {
      let that = this;
      uni.showToast({ title: "删除成功", duration: 3000 })
      that.statusbox = false;
      // 本地删除
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
          url: '/plaboratory/detail?id=' + item.id
        })
      }
    },


    async binderror(event, index, type) {
      if (event.detail.errMsg.indexOf("404") != -1) {
        if (this.viewType == 1) {
          if (type == 1) {
            this.listLeft[index].statusboy = 0;
            this.listLeft[index].url = 'https://cdn.lingchuang.art/ling/load-error.jpg'
          } else {
            this.listRight[index].statusboy = 0;
            this.listRight[index].url = 'https://cdn.lingchuang.art/ling/load-error.jpg'
          }
        } else {
          if (type == 1) {
            this.listLeft[index].statusboy = 0;
            this.listLeft[index].cover = 'https://cdn.lingchuang.art/ling/load-error.jpg'
          } else {
            this.listRight[index].statusboy = 0;
            this.listRight[index].cover = 'https://cdn.lingchuang.art/ling/load-error.jpg'
          }
        }
      }
    },

    // 触发重新排列
    init() {
      this.newList = [...this.list];
      this.listLeft = [];
      this.listRight = [];
      console.log(this.newList, '我被调用了')
      if (this.newList.length != 0) {
        console.log(this.newList.shift(), 'this.newList.shift()')
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
      // 	console.log(leftH,'左边')
      // console.log(rightH,'右边')
      // console.log(leftH,rightH,'哈哈哈')

      if (leftH == rightH || leftH < rightH) {
        // 相等 || 左边小  
        this.listLeft.push(this.newList.shift());
      } else {
        // 右边小
        this.listRight.push(this.newList.shift());
      }
    },
    // 计算排列
    // considerPush() {
    // 	if (this.newList.length == 0) return; //没有数据了
    // 	let leftH = 0,
    // 		rightH = 0; //左右高度
    // 	var query = uni.createSelectorQuery().in(this);

    // 	query.selectAll('.waterfall_left').boundingClientRect()
    // 	query.selectAll('.waterfall_right').boundingClientRect()
    // 	query.exec(res => {
    // 		// console.log('结果',res)
    // 		leftH = res[0].length != 0 ? res[0][0].height : 0; //防止查询不到做个处理
    // 		rightH = res[1].length != 0 ? res[1][0].height : 0;
    // 		// console.log('结果',leftH,rightH)
    // 		if (leftH == rightH || leftH < rightH) {
    // 			// 相等 || 左边小  
    // 			this.listLeft.push(this.newList.shift());
    // 		} else {
    // 			// 右边小
    // 			this.listRight.push(this.newList.shift());
    // 		}
    // 	});
    // },

  }

}
</script>
<style lang="scss" scoped>.container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  padding: 0rpx 6rpx;
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
    height: auto;
    position: relative;
    border-radius: 10rpx;

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