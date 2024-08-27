<template>
  <view
    class="flex-col page"
    :class="cueTheme"
  >
    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="个人主页"
    />

    <view class="flex-col section space-y-25">
      <view class="flex-row items-center group space-x-16">
        <image
          class="image"
          :src="userInfo.avatar"
        />
        <text class="text_3">{{ userInfo.nickname }}</text>
      </view>
      <view class="flex-row self-start equal-division space-x-4">
        <view class="flex-col equal-division-item_3 space-y-10">
          <view class="flex-row justify-evenly items-baseline group_2">
            <text class="font_1 ">{{ userInfo.fans }}</text>
          </view>
          <text class="self-center font_3 text_5">粉丝数</text>
        </view>
        <view
          class="flex-col equal-division-item_3 space-y-10"
          @click="test()"
        >
          <view class="flex-row justify-evenly items-baseline group_2">
            <text class="font_1">{{ userInfo.follow }}</text>
          </view>
          <text class="self-center font_3 text_5">关注数</text>
        </view>
        <view
          class="flex-col equal-division-item_3 space-y-10"
          @click="test(1)"
        >
          <view class="flex-row justify-evenly items-baseline group_2">
            <text class="font_1">{{ userInfo.praise }}</text>
          </view>
          <text class="self-center font_3 text_5">获赞总数</text>
        </view>
        <view class="flex-col equal-division-item_3 space-y-10">
          <view class="flex-row justify-evenly items-baseline group_2">
            <text class="font_1">{{ userInfo.inviters }}</text>
            <!-- <text class="font_2">w</text> -->
          </view>
          <text class="self-center font_3 text_5">邀请总数</text>
        </view>
      </view>
    </view>

    <view
      class="flex-col relative section_2"
      :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '#141416', }"
    >
      <view class="flex-row justify-end group_2 space-x-23-reverse">
        <view
          :class="scrIndex == 0 ? 'font_5 text_10' : 'font_5 text_11'"
          @click="screenClick(0)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >最新</view>
        <view
          :class="scrIndex == 1 ? 'font_5 text_10' : 'font_5 text_11'"
          @click="screenClick(1)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >最热</view>
      </view>

      <!--  -->
      <u-waterfall
        v-model="worksList"
        ref="uWaterfall"
      >
        <template v-slot:left="{ leftList }">
          <view
            class="demo-warter"
            v-for="(item, index) in leftList"
            :key="index"
            @click="getDetail(item.id)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#262628' }"
          >
            <u-lazy-load
              threshold="-450"
              :loading-img="item.detailUrl"
              border-radius="6"
              :image="item.detailUrl"
              :index="index"
            ></u-lazy-load>
            <view class="chuang">
              <view>
                <image
                  class="avact"
                  :src="cueTheme == 'day-theme' ? '../static/img/clip/share-0.png' : '../static/img/clip/share.png'"
                />
              </view>
              <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">
                <block v-if="cueTheme == 'day-theme'"> <!-- 白色主题 -->
                  <image
                    class="avact"
                    v-if="!item.isLike"
                    @click="addLike(worksList[index])"
                    :src="!item.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
                  />
                  <image
                    class="avact"
                    v-if="item.isLike"
                    @click="removeLike(worksList[index], index)"
                    :src="item.isLike ? '../static/img/gallery/xin_active.png' : '../static/img/gallery/xin_hui.png'"
                  />
                </block>
                <block v-else> <!-- 黑色主题 -->
                  <image
                    class="avact"
                    v-if="!item.isLike"
                    @click="addLike(worksList[index])"
                    :src="!item.isLike ? '../static/img/gallery/xin.png' : '../static/img/gallery/xin_active.png'"
                  />
                  <image
                    class="avact"
                    v-if="item.isLike"
                    @click="removeLike(worksList[index], index)"
                    :src="item.isLike ? '../static/img/gallery/xin_active.png' : '../static/img/gallery/xin.png'"
                  />
                </block>
                {{ item.likeCount }}
              </view>
            </view>
          </view>
        </template>
        <template v-slot:right="{ rightList }">
          <view
            class="demo-warter"
            v-for="(item, index) in rightList"
            :key="index"
            @click="getDetail(item.id)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#262628' }"
          >
            <u-lazy-load
              threshold="-450"
              :loading-img="item.detailUrl"
              border-radius="6"
              :image="item.detailUrl"
              :index="index"
            ></u-lazy-load>
            <view class="chuang">
              <view>
                <image
                  class="avact"
                  :src="cueTheme == 'day-theme' ? '../static/img/clip/share-0.png' : '../static/img/clip/share.png'"
                />
              </view>
              <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">
                <block v-if="cueTheme == 'day-theme'"> <!-- 白色主题 -->
                  <image
                    class="avact"
                    v-if="!item.isLike"
                    @click="addLike(worksList[index])"
                    :src="!item.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
                  />
                  <image
                    class="avact"
                    v-if="item.isLike"
                    @click="removeLike(worksList[index], index)"
                    :src="item.isLike ? '../static/img/gallery/xin_active.png' : '../static/img/gallery/xin_hui.png'"
                  />
                </block>
                <block v-else> <!-- 黑色主题 -->
                  <image
                    class="avact"
                    v-if="!item.isLike"
                    @click="addLike(worksList[index])"
                    :src="!item.isLike ? '../static/img/gallery/xin.png' : '../static/img/gallery/xin_active.png'"
                  />
                  <image
                    class="avact"
                    v-if="item.isLike"
                    @click="removeLike(worksList[index], index)"
                    :src="item.isLike ? '../static/img/gallery/xin_active.png' : '../static/img/gallery/xin.png'"
                  />
                </block>
                {{ item.likeCount }}
              </view>
            </view>
          </view>
        </template>
      </u-waterfall>

    </view>
  </view>
</template>

<script>

import { userId, galleryPage } from '../static/api/index.js'


export default {
  components: {},
  data() {
    return {
      userInfo: {},
      worksList: [],
      total: 0,
      pageNum: 1, // 页数
      scrIndex: 0, //最新最热
      uidtype: 0,
      themeOjb: [
        {
          value: [
            { name: '--bg-color', value: '#FFFFFF' },
            { name: '--text-color', value: '#141416' }
          ],
          name: '白色'
        },
        {
          value: [
            { name: '--bg-color', value: '#141416' },
            { name: '--text-color', value: '#FFFFFF' }
          ],
          name: '黑色'
        },
      ],
    };
  },
  computed: {
  },
  onLoad(res) {
    let that = this;
    that.uidtype = res.uidtype;
    that.userId = res.userId;
    userId({ id: res.userId }).then((res) => {
      if (res.code == 200) {
        that.userInfo = res.result;
      }
    });
    that.galleryPage();
  },

  //上拉加载
  onReachBottom() {
    let that = this;
    if (that.worksList.length != that.total) {
      that.galleryPage()
    }
  },

  methods: {
    galleryPage() {
      let that = this;
      uni.showLoading({ title: '加载中~~' });
      let data = {
        userId: that.userId,
        pageNum: that.pageNum,
        pageSize: 10,
        isAsc: false,
        orderBy: this.scrIndex == 0 ? "task_id" : "like_count",
      }
      galleryPage(data).then(res => {
        if (res.code == 200) {
          uni.hideLoading();
          let resData = res.result.records;
          for (let i = 0; i < resData.length; i++) {
            let item = JSON.parse(JSON.stringify(resData[i]))
            this.worksList.push(item);
          }
          that.pageNum = that.pageNum + 1;
          that.total = res.result.total;
        }
      })
    },

    // 详情
    getDetail(id) {
      if (this.uidtype == 1) {
        uni.navigateTo({
          url: "/pclip/largedetali?albumId=" + id
        });
      } else {
        uni.navigateTo({
          url: "/pclip/large?albumId=" + id,
        });
      }
    },

    screenClick(e) {
      this.scrIndex = e;
      this.worksList = [];
      this.pageNum = 1;
      this.$refs.uWaterfall.clear();
      this.galleryPage()
    },
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
  // #endif
};
</script>
<style>
page {
  background-color: #141416;
}
</style>
<style scoped lang="scss">
.page {
  min-height: 100vh;
}

.demo-warter {
  border-radius: 8px;
  margin: 10px 6px 0 10px;
  background: rgba(255, 255, 255, 0.08);
  position: relative;
}

.demo-warter .under2 {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 320rpx;
  transform: translate(-50%, -50%);
  color: #141416;
  font-weight: 500;
  text-align: center;
}

.demo-warter .top {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  background: #00C1F6;
  border-radius: 8rpx 0rpx 8rpx 0rpx;
  opacity: 1;
  color: white;
}

.chuang {
  color: white;
  font-size: 28rpx;
  line-height: 90rpx;
  height: 90rpx;
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;

  image {
    width: 40rpx;
    height: 40rpx;
    position: relative;
    top: 8rpx;
    right: 10rpx;
  }
}


.page {
  background-color: #141416;
}

.section {
  padding: 104rpx 0;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846360033331633.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.space-y-25>view:not(:first-child),
.space-y-25>text:not(:first-child),
.space-y-25>image:not(:first-child) {
  margin-top: 50rpx;
}

.group {
  padding: 0 32rpx;
}

.text {
  color: #ffffff;
  font-size: 40rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 37rpx;
}

.text-wrapper {
  padding: 8rpx 0;
  background-color: #1affe81a;
  border-radius: 48rpx;
  width: 96rpx;
  height: 48rpx;
  border: solid 2rpx #1affe8;
}

.text_2 {
  color: #1affe8;
  font-size: 28rpx;
  font-family: PingFangSC;
  line-height: 26rpx;
}

.space-x-16>view:not(:first-child),
.space-x-16>text:not(:first-child),
.space-x-16>image:not(:first-child) {
  margin-left: 32rpx;
}

.image {
  border-radius: 68rpx;
  width: 136rpx;
  height: 136rpx;
}

.text_3 {
  color: #ffffff;
  font-size: 32rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 24rpx;
}

.equal-division {
  width: 683rpx;
}

.space-x-4>view:not(:first-child),
.space-x-4>text:not(:first-child),
.space-x-4>image:not(:first-child) {
  margin-left: 8rpx;
}

.equal-division-item {
  padding: 8rpx 16rpx 8rpx 32rpx;
  flex: 1 1 166rpx;
}

.font_1 {
  font-size: 40rpx;
  font-family: Montserrat;
  line-height: 29rpx;
  font-weight: 700;
  color: #fff;
}

.text_4 {
  line-height: 35rpx;
}

.font_3 {
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  line-height: 22rpx;
  color: #ffffff;
}

.text_5 {
  opacity: 0.8;
}

.equal-division-item_2 {
  flex: 1 1 166rpx;
  padding: 8rpx 32rpx;
  width: 166rpx;
}

.space-x-8>view:not(:first-child),
.space-x-8>text:not(:first-child),
.space-x-8>image:not(:first-child) {
  margin-left: 16rpx;
}

.font_2 {
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  line-height: 13rpx;
  color: #ffffff;
}

.equal-division-item_3 {
  padding: 8rpx 0;
  flex: 1 1 166rpx;
  width: 166rpx;
}

.space-y-10>view:not(:first-child),
.space-y-10>text:not(:first-child),
.space-y-10>image:not(:first-child) {
  margin-top: 20rpx;
}

.group_2 {
  padding: 0 28rpx;
}

.section_2 {
  margin-top: -62rpx;
  padding-top: 32rpx;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/49007ad96efabbbfa4963fa793fb30a9.png');
  background-position: 0% 0%;
  background-size: 750rpx 1030rpx;
  background-repeat: no-repeat;
  background-color: #23262F;
}

.group_3 {
  padding: 0 34rpx;
  display: flex;
  justify-content: space-around;
}

.text-wrapper_2 {
  padding: 20rpx 0;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846345213353964.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 120rpx;
  height: 64rpx;
}

.text_6 {
  color: #ffffff;
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  line-height: 26rpx;
}

.font_4 {
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  line-height: 26rpx;
  color: #ffffff99;
}

.text_7 {
  margin-left: 104rpx;
  line-height: 24rpx;
}

.text_8 {
  margin-left: 130rpx;
}

.text_9 {
  margin-left: 132rpx;
}

.view {
  margin-top: 20rpx;
}

.space-x-23-reverse {
  padding-bottom: 20rpx;
}

.font_5 {
  font-size: 24rpx;
  font-family: PingFangSC;
  line-height: 19rpx;
  margin: 0 20rpx;
}

.text_10 {
  color: #ffffff;
  font-size: 22rpx;
  line-height: 20rpx;
}

.text_11 {
  color: #ffffff99;
  font-size: 22rpx;
  line-height: 20rpx;
}

.group_4 {
  margin: 40rpx 0 -240rpx;
}

.waterfall {
  margin: 0 32rpx;
}

.space-x-9>view:not(:first-child),
.space-x-9>text:not(:first-child),
.space-x-9>image:not(:first-child) {
  margin-left: 18rpx;
}

.group_5 {
  flex: 1 1 334rpx;
}

.waterfall-item {
  padding-bottom: 36rpx;
  background-color: #ffffff14;
  border-radius: 32rpx;
}

.space-y-14>view:not(:first-child),
.space-y-14>text:not(:first-child),
.space-y-14>image:not(:first-child) {
  margin-top: 28rpx;
}

.image_2 {
  width: 334rpx;
  height: 496rpx;
}

.font_6 {
  font-size: 24rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 22rpx;
  color: #ffffff99;
}

.text_13 {
  margin-left: 26rpx;
}

.group_6 {
  flex: 1 1 334rpx;
}

.space-y-8>view:not(:first-child),
.space-y-8>text:not(:first-child),
.space-y-8>image:not(:first-child) {
  margin-top: 16rpx;
}

.image_3 {
  width: 334rpx;
  height: 334rpx;
}

.text_12 {
  margin-left: 20rpx;
}

.equal-division_2 {
  background-color: #ffffff;
  backdrop-filter: blur(60rpx);
}

.pos {
  position: absolute;
  left: 0;
  right: 0;
  top: 756rpx;
}

.equal-division-item_4 {
  padding: 8rpx 0;
  width: 188rpx;
}

.section_3 {
  background-color: #00000000;
  width: 48rpx;
  height: 48rpx;
}

.font_7 {
  font-size: 20rpx;
  font-family: PingFangSC;
  line-height: 19rpx;
  color: #ffffff;
}

.text_14 {
  line-height: 18rpx;
}

.group_7 {
  margin-left: 92rpx;
}

.space-y-4>view:not(:first-child),
.space-y-4>text:not(:first-child),
.space-y-4>image:not(:first-child) {
  margin-top: 8rpx;
}

.image_4 {
  width: 48rpx;
  height: 48rpx;
}

.text_15 {
  color: #ffffff;
  font-size: 20rpx;
  font-family: PingFangSC-Regular;
  line-height: 19rpx;
}

.group_8 {
  margin-left: 92rpx;
}

.space-y-6>view:not(:first-child),
.space-y-6>text:not(:first-child),
.space-y-6>image:not(:first-child) {
  margin-top: 12rpx;
}

.text_16 {
  color: #1affe8;
  line-height: 18rpx;
}

.pos_2 {
  position: absolute;
  right: 0;
  top: 0;
}
</style>