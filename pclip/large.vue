<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
  >

    <nav-bar
      :backState="1000"
      :homeState="1000"
      title="详情"
    />

    <view class="flex-col flex-auto group_3">

      <view class="grid">
        <image
          class="grid-item"
          mode="widthFix"
          :webp="true"
          :src="draw.detailUrl"
          @click="previewImg"
        ></image>
      </view>

      <view
        class="user"
        v-if="!type"
      >
        <view
          class="user-item"
          @click="homePage(goods.userInfo.userId)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1AFFE8' }"
        >
          <image
            class="usericon"
            :src='goods.userInfo.avatar'
          ></image> <text>{{ goods.userInfo.nickname }}</text>
        </view>
        <view
          :class="cueTheme == 'day-theme' ? 'user-item follow2 black' : 'user-item follow2'"
          v-if="goods.isFollow"
          @click="followClick(1)"
        >已关注</view>
        <view
          :class="cueTheme == 'day-theme' ? 'user-item follow black' : 'user-item follow'"
          v-if="!goods.isFollow"
          @click="followClick(2)"
        >+关注</view>
      </view>

      <view
        class="user"
        v-if="type"
      >
        <view
          class="user-item"
          @click="homePage(draw.userId)"
        >
          <image
            class="usericon"
            :src='goods.userInfo.avatar'
          ></image>
          <text
            class="name"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1AFFE8' }"
          >{{ goods.userInfo.nickname }}</text>
        </view>

        <view
          class="user-item"
          style="margin-right:20rpx"
        >
          <view
            class="shift"
            v-if="type != 3 && draw.userId == userInfo.id"
            @click="moveGallery"
          >移出画廊</view>
          <view>
            <image
              class="stars"
              v-if="!draw.isLike"
              @click="addLike()"
              :src="!draw.isLike ? '../static/img/clip/stars.png' : '../static/img/gallery/xin_active.png'"
            />
            <image
              class="stars"
              v-if="draw.isLike"
              @click="removeLike()"
              :src="draw.isLike ? '../static/img/gallery/xin_active.png' : '../static/img/clip/stars.png'"
            />
            <text
              class="actions"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ draw.likeCount }}</text>
          </view>
        </view>
      </view>


      <view class="flex-col group_4 space-y-22">
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >创作时间：</view>
          <view
            class="font_2 text_3"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ $u.timeFormat(new
            Date(draw.createTime), "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >创作 ID:</view>
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ draw.uuid }}</view>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >关键词：</view>
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ draw.isVisible == 0 ? "仅作者可见"
            : '画同款可见' }}</view>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >模型：</view>
          <!-- <view class="font_2" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}" v-if="draw.userId == userInfo.id">{{goods.modelInfo.modelName}}</view>   -->
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            v-if="draw.isVisible == 0"
          >仅作者可见
          </view>
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            v-else-if="draw.isVisible != 0"
          >
            画同款可见</view>
        </view>
        <view class="items-baseline space-x-2">
          <view
            class="font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            v-if="goods.modelInfo.aspect"
          >尺寸：
          </view>
          <!--   <view class="font_2" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}" v-if="draw.userId == userInfo.id">{{goods.modelInfo.aspect}}</view>   -->
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            v-if="draw.isVisible == 0"
          >仅作者可见
          </view>
          <view
            class="font_2"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            v-else-if="draw.isVisible != 0"
          >
            画同款可见</view>
        </view>

        <view
          class="flex-row"
          v-if="type == 2"
        >
          <text
            class="shrink-0 self-start font_1"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >描述：</text>
          <view class="flex-col justify-start flex-auto relative group_5">
            <textarea
              class="textarea"
              name=""
              :disabled="textStatus"
              v-model="draw.description"
              id=""
              cols="30"
              rows="10"
            ></textarea>
            <view style="display: flex;">
              <view
                class="items"
                v-if="!textStatus"
                @click="textStatus = true"
              >取消</view>
              <view
                class="items"
                v-if="!textStatus"
                @click="saveDescription()"
              >保存</view>
              <view
                class="items"
                v-if="textStatus"
                @click="textStatus = false"
              >编辑</view>
            </view>
          </view>
        </view>
      </view>

      <view
        class="flex-row justify-center group_6 space-x-12"
        v-if="type == 1"
      >
        <!-- <view class="flex-col justify-start items-center relative text-wrapper_3" @click="closeToGallery"  style="color:white;">删除</view> -->
        <view
          class="flex-col justify-start items-center text-wrapper_1"
          @click="existingEvidence()"
        >申请存证</view>
        <view
          class="flex-col justify-start items-center text-wrapper_3"
          @click="downLoad()"
        >下载</view>
      </view>

      <view
        class="flex-row justify-center group_6 space-x-12"
        v-if="type == 2"
      >
        <view
          class="flex-col justify-start items-center text-wrapper_1 relative"
          style="width:50%"
          @click="setGalleryPrompt()"
        > {{ !draw.isVisible ? "公开关键词" : "隐藏关键词" }}</view>
        <button
          class="justify-start items-center text-wrapper_3"
          style="margin:0;width:50%"
          type=""
          fontColor="black"
          open-type="share"
          @click="appShare"
        >
          <image src="../static/img/clip/share-0.png" />分享
        </button>
      </view>

      <view
        class="flex-row justify-center group_6 space-x-12"
        v-if="type == 3"
      >
        <button
          class="flex-col justify-start items-center share text-wrapper_2"
          type=""
          fontColor="black"
          open-type="share"
          @click="appShare"
        >分享</button>
      </view>

      <view
        v-if="share"
        class="create"
        @click="createClick"
      >去创作</view>

      <view
        class="footer"
        v-if="!type"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >

        <view
          class="item"
          v-if="draw.isVisible != 0"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.08)' : '' }"
        >
          <view class="item-stars">
            <image
              class="stars"
              v-if="!draw.isLike"
              @click="addLike()"
              :src="!draw.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
            />
            <image
              class="stars"
              v-if="draw.isLike"
              @click="removeLike()"
              :src="!draw.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
            />
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }">{{ draw.likeCount }}</view>
          </view>
          <button
            class="item-starsa"
            open-type="share"
          >
            <image
              class="stars"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/forward.png' : '../static/img/detail/forward_gray.png'"
            />
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }">分享</view>
          </button>
        </view>
        <view
          class="item footer-active"
          v-if="draw.isVisible != 0"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '' }"
          @click="sameModel(false)"
        >
          <block v-if="goods.isCopy">
            <image src="../static/img/detail/hua.png" /> 画同款(已购)
          </block>
          <block v-else>
            <image src="../static/img/detail/hua.png" /> 画同款({{ draw.isVisible == 1 ? '免费' : draw.isVisibles + '灵力' }})
          </block>
        </view>

        <view
          class="footer-disa"
          v-if="draw.isVisible == 0"
        >
          <image
            class="stars"
            v-if="!draw.isLike"
            @click="addLike()"
            :src="!draw.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
          />
          <image
            class="stars"
            v-if="draw.isLike"
            @click="removeLike()"
            :src="!draw.isLike ? '../static/img/gallery/xin_hui.png' : '../static/img/gallery/xin_active.png'"
          />
          <text style="margin-left:10rpx;">{{ draw.likeCount }}</text>
        </view>
        <button
          class="footer-disab"
          open-type="share"
          v-if="draw.isVisible == 0"
        >
          <image
            class="icon"
            :src="cueTheme == 'day-theme' ? '../static/img/detail/forward_gray.png' : '../static/img/detail/forward.png'"
          />分享
        </button>
      </view>

      <!-- 发布画廊弹窗 -->
      <view
        class="model"
        v-if="moveModalShow"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >确定发布画廊吗？</view>
          <view
            class="title-tips"
            :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }"
            @click="illustrate = true"
          >关键词公开范围
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/tips_hui.png' : '../static/img/detail/tips.png'">
            </image>
          </view>
          <view
            class="title-selet"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
            @click="moveSelect = !moveSelect"
          >
            {{ sameList[sameIndex].name }}
            <image
              :class="moveSelect ? 'iconavt icons' : 'icons'"
              v-if="cueTheme == 'day-theme'"
              src="../static/img/detail/arry_hui.png"
            ></image>
            <image
              :class="moveSelect ? 'iconavt icons' : 'icons'"
              v-else
              src="../static/img/detail/arry.png"
            ></image>
            <view
              class="selist"
              :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
              v-if="moveSelect"
            >
              <block
                v-for="(item, index) in sameList"
                :key="index"
              >
                <view
                  class="selist-item"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
                  @click="limitsTtpe(index)"
                >{{ item.name }}</view>
              </block>
            </view>
          </view>
          <view
            class="title-tips"
            :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }"
            v-if="sameIndex == 5"
          >灵力设置</view>
          <view
            class="title-input title-selet"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
            v-if="sameIndex == 5"
          >
            <view
              class="yyds"
              @click="sameClick(1)"
            >-</view>
            <input
              type="text"
              value=""
              v-model="sameValue"
              maxlength="2"
            />
            <view
              class="yyds"
              @click="sameClick(2)"
            >+</view>
          </view>
          <view class="btns">
            <view
              class="btnsize"
              @click="moveModalShow = false"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
            >取消
            </view>
            <view
              class="btnsize actice"
              @click="moveToGallery"
            >确定</view>
          </view>
        </view>
      </view>

      <u-popup
        :show="illustrate"
        mode="center"
        border-radius="40"
        style="background-color: #00ebd3;"
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
            1.所有人不可画同款：仅作品发布到画廊，所有人不可见关键词<br />
            2.所有人可画同款：作品发布到画廊后，所有人都可见关键词<br />
            3.支付X灵力可画同款：作品发布到画廊后，其他人需支付X灵力可见关键词<br />
            4.所有人可画同款和所有人不可画同款的作品转为支付X灵力可画同款，其他人需支付X灵力后可见同款<br />
            5.支付X灵力可画同款改为支付Y灵力可画同款，已购用户无需再次购买</view>
          <view
            class="speak-btn"
            @click="illustrate = !illustrate"
          >知道了</view>
        </view>
      </u-popup>



      <view
        class="model"
        v-if="shareStatus"
      >
        <view class="model-body">
          <view class="title">分享后作品会发布到画廊,关键词默认不公开</view>
          <view class="items-switch"><u-switch
              activeColor="#1affe8"
              v-model="moveFlag"
              size="16"
              @change="switchClick"
            ></u-switch> <text>公开关键词</text></view>
          <!-- <view class="items" v-if="moveFlag"><u-switch activeColor="#1affe8" v-model="keyword" size="16"></u-switch>  <text>同时公开关键词</text></view> -->
          <view class="btns">
            <view
              class="btnsize"
              @click="shareStatus = false"
            >取消</view>
            <button
              class="btnsize actice"
              open-type="share"
              @click="moveToGallery"
            >分享</button>
          </view>
        </view>
      </view>
    </view>


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
          该作品画同款需要向作者支付{{ draw.isVisible == 1 ? '免费' : draw.isVisibles + '灵力' }}，确定要画同款吗？</view>
        <view class="popup-btn">
          <view
            class="item"
            @click="popupStatus = false"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
          >取消
          </view>
          <view
            class="item active"
            @click="sameModel(true)"
          >立即支付</view>
        </view>
      </view>
    </u-popup>

  </view>
</template>

<script>
import { galleryDetail, moveToGallery, deleteWorks, publicOnGallery, setGalleryPrompt, saveDescription, attestAdd, addLike, removeLike, followAdd, followRemove, galleryDelete } from '../static/api/index.js'
import { galleryCopyStyle } from "../static/api/home.js";

import shareMethod from "../static/utils/utils.js";

export default {
  components: {},
  data() {
    return {
      draw: {},
      album: {},
      goods: {
        userInfo: {},
        modelInfo: {},
      },
      userInfo: {},
      checkboxValue: [],
      type: 0,
      private: null,
      wordsStatus: true,//是否公开关键词
      textStatus: true,
      albumId: 0,
      moveFlag: false,//分享是否公开关键词
      shareStatus: false, //分享弹窗
      share: false, //是否开启去创作按钮
      popupStatus: false,//
      moveModalShow: false,
      moveSelect: false,
      illustrate: false,
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
    };
  },
  onLoad(res) {

    this.userInfo = uni.getStorageSync('userInfo')
    this.type = res.type;
    this.private = res.private || '';
    this.albumId = res.albumId;
    this.share = res.share;
    if (res.albumId || res.taskId) {
      this.galleryDetail(res.albumId, res.taskId)
    }

    // 保存邀请码
    if (res.inviter) {
      uni.setStorageSync("inviter", res.inviter);
    }
  },
  methods: {

    // 获取详情信息
    galleryDetail(id, taskId) {
      let that = this;
      let data = { id: id, }
      galleryDetail(data).then(res => {
        if (res.code == 200) {
          let data = res.result.gallery;
          data.createTime = data.createTime ? data.createTime.replace('T', ' ') : '',
            data.isVisible = data.isVisible
          data.isVisibles = Math.abs(data.isVisible)
          that.draw = data;
          that.goods = res.result;
          that.wordsStatus = res.result.gallery.isVisible == 1 ? true : false
          if (res.result.gallery.isPublic == 1) {
            that.checkboxValue = ['public'];
          }
        }
      }).catch(err => { })
    },


    // 个人主页
    homePage(id) {
      // 验证该用户是否登录
      if (!getApp().globalData.getLogin()) {
        return;
      }
      uni.navigateTo({
        url: "/psetup/homepage?userId=" + id
      })
    },

    // 是否关注取消用户
    followClick(type) {
      // 验证该用户是否登录
      if (!getApp().globalData.getLogin()) {
        return;
      }
      if (type == 2) {// 关注用户
        followAdd({ id: this.goods.gallery.userId }).then(res => {
          if (res.code == 200) {
            this.galleryDetail(this.albumId)
            uni.showToast({
              title: "操作成功",
              icon: 'none',
              duration: 3000,
            });
          }
        })
      } else { //取消关注
        followRemove({ id: this.goods.gallery.userId }).then(res => {
          if (res.code == 200) {
            this.galleryDetail(this.albumId)
            uni.showToast({
              title: "操作成功",
              icon: 'none',
              duration: 3000,
            });
          }
        })
      }
    },

    // 
    limitsTtpe(index) {
      this.sameIndex = index;
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
        id: this.goods.gallery.taskId,
        isVisible: this.sameIndex == 5 ? -that.sameValue : that.sameList[that.sameIndex].type
      }
      if (that.sameValue > 20) {
        uni.showToast({ title: "灵力设置最大值为20", icon: 'none', duration: 4000 })
        return
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

    // 是否公开
    checkboxChange(n) {
      let data = {
        id: this.draw.id,
        status: n.length > 0 ? 1 : 0,
      }
      publicOnGallery(data).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: n.length > 0 ? "已公开至画廊" : "已从画廊隐藏",
            icon: 'none',
            duration: 3000,
          });
        }
      }).catch(err => { })
    },

    // 移出画廊
    moveGallery() {
      let that = this;
      uni.showModal({
        title: '确定移出画廊吗？',
        content: '移出后该作品点赞数将丢失',
        success: function (res) {
          if (res.confirm) {
            galleryDelete({ id: that.goods.gallery.id }).then(res => {
              if (res.code == 200) {
                uni.showToast({
                  title: "操作成功", icon: 'none', duration: 3000,
                });
                setTimeout(function () { uni.navigateBack(); }, 1500)
              }
            })
          }
        }
      });
    },

    // 是否公开隐藏关键词
    setGalleryPrompt() {
      let data = {
        id: this.draw.id,
        status: this.wordsStatus ? 0 : 1,
      }
      this.wordsStatus = !this.wordsStatus;
      setGalleryPrompt(data).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: !this.wordsStatus ? "已隐藏关键词" : "已公开关键词",
            icon: 'none',
            duration: 3000,
          });
          this.galleryDetail(this.albumId)
        }
      }).catch(err => { })
    },

    // 分享是否关键词
    switchClick() {
      let data = {
        id: this.draw.id,
        status: this.moveFlag ? 0 : 1,
      }
      setGalleryPrompt(data).then(res => {
        if (res.code == 200) {
        }
      }).catch(err => { })
    },

    // 保存描述
    saveDescription() {
      let data = {
        id: this.draw.id,
        text: this.draw.description,
      }
      saveDescription(data).then(res => {
        if (res.code == 200) {
          this.textStatus = true;
          uni.showToast({
            title: "更新成功",
            icon: 'none',
            duration: 3000,
          });
        }
      }).catch(err => { })
    },

    // 复制关键词
    copyKeyword(text, name) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: name + "复制成功", icon: 'none', duration: 4000 })
        }
      });
    },

    // 删除作品
    // closeToGallery(){
    // 	let that =this;
    // 	uni.showModal({
    // 	    title: '温馨提示',
    // 	    content: '确认要从画册中删除吗？',
    // 	    success: function (res) {
    // 	      if (res.confirm) {
    //           let data={id:that.draw.id}
    //           deleteWorks(data).then(res=>{
    //             uni.showToast({title: "操作成功",duration: 2000});
    //           })
    // 	      } 
    // 	    }
    // 	});
    // },

    // 用户点赞
    addLike() {
      if (!getApp().globalData.getLogin()) { return }
      let that = this;
      let draw = that.draw;
      draw.isLike = true;
      draw.likeCount += 1;
      addLike({ id: draw.id }).then(res => {
        if (res.code == 200) {
          draw.isLike = true;

        }
      })
    },

    // 用户取消点赞
    removeLike() {
      if (!getApp().globalData.getLogin()) { return }
      let that = this;
      let draw = that.draw;
      draw.isLike = false;
      draw.likeCount -= 1;
      draw.likeCount = draw.likeCount < 0 ? 0 : draw.likeCount;
      removeLike({ id: draw.id }).then(res => {
        if (res.code == 200) {
          draw.isLike = false;
        }
      })
    },

    // 申请存证
    existingEvidence() {
      let that = this;
      uni.showModal({
        title: '温馨提示',
        content: '存证后可以生成区块链存证，该存证可在法院起诉中作为证据。',
        success: function (res) {
          if (res.confirm) {
            shareMethod.attestAddFun(that.goods.id)
          }
        }
      });
    },
    // 图片放大
    previewImg: function (e) {
      // let that = this;
      // let imgArr=[this.draw.url];
      // uni.previewImage({
      // current:this.draw.url,   //当前图片地址
      // urls: imgArr,        //所有要预览的图片的地址集合 数组形式
      // })
    },


    sameModel(status) {
      let that = this;
      uni.removeStorageSync('maskinfo'); //清除原有缓存
      if (!getApp().globalData.getLogin()) {
        uni.setStorageSync('goodsid', that.goods.gallery.id);
        return;//用户未登录
      }
      uni.removeStorageSync('goodsid') //清空原画廊ID
      // 免费 已购
      if (that.goods.gallery.isVisible == 1 || that.goods.isCopy) {
        galleryCopyStyle({ id: that.goods.gallery.id }).then(res => {
          if (res.code == 200) {
            let data = res.result;
            data.modelInfo.style = data.modelInfo.style ? JSON.parse(data.modelInfo.style) : {}
            data.style = data.style ? JSON.parse(data.style) : {}
            uni.setStorageSync('maskinfo', JSON.stringify(data));
            uni.navigateTo({
              url: '/phome/generate?maskinfo=' + JSON.stringify(data)
            })
            // uni.reLaunch({
            // 	url:'/pages/tabBar/index?maskinfo='+JSON.stringify(data)
            // })
          } else {
            uni.showModal({
              title: '温馨提示',
              content: '您的灵力不足，请前往充值',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/pmnie/mnie/recharge?epindex=point'
                  })
                }
              }
            })
          }
        })
        return;
      }
      that.popupStatus = !that.popupStatus;
      if (status) {
        galleryCopyStyle({ id: that.goods.gallery.id }).then(res => {
          if (res.code == 200) {
            let data = res.result;
            data.modelInfo.style = data.modelInfo.style ? JSON.parse(data.modelInfo.style) : {}
            data.style = data.style ? JSON.parse(data.style) : {}
            uni.setStorageSync('maskinfo', JSON.stringify(data));
            uni.navigateTo({
              url: '/phome/generate?maskinfo=' + JSON.stringify(data)
            })
            // uni.reLaunch({
            // 	url:'/pages/tabBar/index?maskinfo='+ JSON.stringify(data)
            // })
          } else {
            uni.showModal({
              title: '温馨提示',
              content: '您的灵力不足，请前往充值',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/pmnie/mnie/recharge?epindex=point'
                  })
                }
              }
            })
          }
        })
      }

      // if(status){
      //   if(that.draw.isVisible ==1 || that.goods.isCopy ){
      //     uni.reLaunch({ //免费画同款
      //       url:'/pages/tabBar/index?id='+ this.goods.gallery.id
      //     })
      //     return
      //   }
      //   that.popupStatus =true;
      // }else{
      //   that.popupStatus =false;
      //   uni.reLaunch({
      //     url:'/pages/tabBar/index?id='+ this.goods.gallery.id
      //   })
      // }
    },

    // 保存图片到相册
    downLoad() {
      // #ifndef H5  
      shareMethod.downLoadImage(this.sheetUrl)
      // getApp().globalData.downLoadImage(this.draw.url);
      // #endif

      // #ifndef MP  
      var fileName = new Date().getTime() + ".png";
      this.downloadByBlob(this.draw.url, fileName);
      // #endif

      this.showMore = false;
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

    createClick() {
      uni.switchTab({ url: '/pages/tabBar/index' });
    },
  },

  // 用户点击右上角分享
  onShareAppMessage() {
    this.showMore = false;
    this.shareStatus = false;
    let data = this.goods;
    return {
      path: '/pclip/large?albumId=' + data.gallery.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: data.gallery.thumbUrl,
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    this.showMore = false;
    this.shareStatus = false;
    let data = this.goods;
    return {
      path: '/pclip/large?albumId=' + data.gallery.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: data.gallery.thumbUrl,
    }
  }
};
</script>

<style scoped lang="css">
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
  min-height: 162px !important;
  background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
  border-radius: 11rpx;
  color: white;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30rpx;
}

.model-body .title {
  line-height: 100rpx;
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
  text-align: center;
}

.title-input .yyds {
  font-size: 46rpx;
  width: 76rpx;
  text-align: center;
}

.title-selet {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  height: 82rpx;
  line-height: 82rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  position: relative;
  text-align: left;
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

.popup {
  width: 580rpx;
  border-radius: 20rpx;
  padding: 0 30rpx 40rpx;
}

.popup .popup-title {
  line-height: 100rpx;
  text-align: center;
  font-size: 30rpx;
}

.popup .popup-tips {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(18, 18, 18, 0.46);
}

.popup .popup-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}

.popup .popup-btn .item {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(18, 18, 18, 0.04);
  border-radius: 80rpx;
  text-align: center;
  border: 2rpx solid #E4E4E4;
  font-size: 28rpx !important;
}

.popup .popup-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);

}

.create {
  position: fixed;
  left: 30rpx;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  right: 30rpx;
  bottom: 160rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border-radius: 24px 24px 24px 24px;
  opacity: 1;
}

.footer {
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2A2A2A;
  display: flex;
  justify-content: space-evenly;
  height: 140rpx;
  color: white;
  padding: 20rpx 0rpx;
  font-size: 26rpx;
}

.footer-disa {
  width: 35%;
  color: #000;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 80rpx;
  text-align: center;
  line-height: 90rpx;
  margin-left: 20rpx;
}

.footer-disa text {
  position: relative;
  top: 6rpx;
}

.footer-disab {
  width: 55%;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 80rpx;
  color: #121212;
  text-align: center;
  line-height: 90rpx;
}

.footer-disab .icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 10rpx;
  left: -10rpx;
}

.footer .item {
  margin: 0;
  padding: 0;
  width: 47%;
  height: 96rpx;
  background: none;
  font-weight: normal;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 48rpx;
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  font-size: 22rpx;
}

.footer .item .item-stars {
  position: relative;
}

.footer .item .item-stars::before {
  position: absolute;
  right: -24px;
  top: 30rpx;
  content: '';
  width: 2rpx;
  height: 32rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rpx;
}

.footer .item-starsa {
  background: none !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 30rpx;
  font-size: 22rpx;
}

.footer .item .stars {
  width: 44rpx;
  height: 44rpx;
  position: relative;
  top: 14rpx;
  margin-bottom: 10rpx;
}

.footer-active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%) !important;
  line-height: 96rpx;
  font-size: 32rpx !important;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #121212 !important;
  position: relative;

}

.footer-active image {
  width: 38rpx !important;
  height: 38rpx !important;
  position: absolute;
  top: 32rpx;
  left: 36rpx;
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
  min-height: 200px;
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
  line-height: 40rpx;
  font-size: 16px;
  width: 388rpx;
  margin: 60rpx auto 10rpx;
}

.model-body .items {
  padding-left: 150rpx;
}

.page {
  background-color: #141416;
  height: 100vh;
}

.user {
  display: flex;
  justify-content: space-between;
  color: white;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1px solid rgba(18, 18, 18, 0.08);
}

.user-item {
  display: flex;
}

.user-item .name {
  margin-left: 28rpx;
}

.user-item .usericon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  position: relative;
  top: 20rpx;
}

.user-item text {
  /* color: #1AFFE8; */
}

.user-item .actions {
  position: relative;
  top: 6rpx;
  font-size: 28rpx;
}

.user-item .shift {
  background-color: #141416 !important;
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border: 1px solid #FFFFFF;
  color: white !important;
  text-align: center;
  width: 140rpx;
  height: 56rpx;
  font-size: 22rpx;
  line-height: 56rpx;
  border-radius: 48rpx;
  margin-top: 20rpx;
  margin-right: 20rpx;
}

.user-power {
  display: flex;
  color: white;
  font-size: 28rpx;
  height: 50rpx;
  line-height: 50rpx;
  margin-top: 20rpx;
}

.user-power .btn {
  width: 120rpx;
  height: 50rpx;
  text-align: center;
  border: 1px solid #00EBD3;
  border-radius: 70rpx;
  line-height: 50rpx;
  margin-left: 20rpx;
}

.follow {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #00EBD3;
  color: #00EBD3;
  font-size: 12px;
  border-radius: 12rpx;
  justify-content: center;
  margin-top: 24rpx;
}

.follow2 {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #00EBD3;
  color: #00EBD3;
  font-size: 12px;
  border-radius: 12rpx;
  justify-content: center;
  margin-top: 24rpx;
}

.user .black {
  background: #121212 !important;
  color: white !important;
  border: none;
}

.stars {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 14rpx;
}

.group_3 {
  padding: 32rpx 32rpx 140rpx;
  overflow-y: auto;
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
  width: 320px;
  /* 适配折叠屏双屏手机 */
  max-width: 86% !important;
  height: 320px;
}

.group_4 {
  margin-top: 32rpx;
  padding-bottom: 60rpx;
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
  color: #8A8A8A;
}

.font_2 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  margin-top: 24rpx;
}

.text_3 {
  line-height: 20rpx;
}

.group_5 {
  margin-right: 12rpx;

}

.textarea {
  color: white !important;
  /* border: 1px solid #ffffff; */
  border-radius: 10rpx;
  height: 220rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.08);
}

.items {
  margin: 20rpx 10rpx 0;
  width: 140rpx;
  line-height: 58rpx;
  border: 1px solid #ffffff;
  border-radius: 70rpx;
  text-align: center;
  color: white;
  font-size: 26rpx;

}

.text_4 {
  line-height: 34rpx;
}

.text-wrapper {
  padding: 4rpx 0;
  background-color: #909399;
  border-radius: 18rpx;
  width: 96rpx;
  border: solid 2rpx #ffffff66;
}

.pos_3 {
  /* position: absolute;
    right: 61rpx;
    top: 36rpx; */
  padding: 4rpx 12rpx;
  margin-left: 12rpx;
}

.text_5 {
  color: #ffffff;
  font-size: 20rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 18rpx;
}

.group_6 {
  /* margin-top: 106rpx; */
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 60rpx;
  z-index: 99;
}

.space-x-12>view:not(:first-child),
.space-x-12>text:not(:first-child),
.space-x-12>image:not(:first-child) {
  margin-left: 24rpx;
}

.text-wrapper_2 {
  padding: 32rpx 0;
  background-color: #141416 !important;
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 200rpx;
  height: 96rpx;
  margin-right: 20rpx;
  line-height: 96rpx;
  border: solid 2rpx #ffffff;
}

.share {
  width: 200rpx !important;
  height: 96rpx !important;
  border-radius: 70rpx;
  line-height: 96rpx;
  padding: 0 !important;
  margin-left: 20rpx !important;
  font-weight: normal;
  background: none;
  font-size: 30rpx;
  color: white;
  border: solid 2rpx #ffffff !important;
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

.text-wrapper_1 {
  background-color: #141416 !important;
  box-shadow: 0px 8px 16px 1px rgba(0, 219, 197, 0.2);
  border: 1px solid #FFFFFF;
  color: white !important;
  opacity: 1;
  width: 240rpx;
  height: 76rpx;
  font-size: 28rpx;
  line-height: 76rpx;
  border-radius: 48rpx;
  margin-right: 20rpx;
}

.text-wrapper_3 {
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 240rpx;
  height: 76rpx;
  font-size: 28rpx;
  line-height: 76rpx;
}

.text-wrapper_3 image {
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: 10rpx;
  margin-right: 10rpx;
}

.text_7 {
  color: #141416;
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  line-height: 30rpx;
}
</style>