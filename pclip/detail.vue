<template>
  <view
    class="flex-col page"
    :style="{ 'background': cueTheme == 'day-theme' ? '#F7F7F7' : '#141414' }"
  >
    <block v-if="pageStatus">

      <nav-bar
        :backState="1000"
        :homeState="1000"
        :title="titleName"
      />

      <view class="flex-col flex-auto group_3">

        <view
          class="flex-col justify-start items-start section_3"
          v-if="goods.status >= 0"
        >
          <view class="section-item">
            <image
              class="preview-img"
              mode="widthFix"
              :src="goods.detailUrl"
              :webp="true"
              @click="previewImg"
              style="border-radius:44rpx;"
            />
            <block v-if="pictureSize == 4">
              <view class="sud1 ident">图1</view>
              <view class="sud2 ident">图2</view>
              <view class="sud3 ident">图3</view>
              <view class="sud4 ident">图4</view>
            </block>
          </view>
        </view>

        <!-- 作品制作失败 -->
        <view
          class="section_3"
          v-if="goods.status < 0"
        >
          <view
            class="fail"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image src="../static/img/clip/icon_tan.png" />作品制作失败
          </view>
          <view style="color:red;font-size:28rpx">失败原因：{{ goods.errors }}</view>
        </view>


        <view
          class="refine"
          v-if="goods.status >= 0"
        >
          <block
            v-for="(item, index) in showListbtns"
            :key="index"
          >
            <block v-if="item.status">
              <view
                class="refine-itembox"
                v-if="goods.model >= 10"
                :style="{ 'background': cueTheme == 'day-theme' ? '#121212' : '' }"
                @click="refineType(index)"
              >
                {{ item.ButtonnNme }}
              </view>
              <view
                class="refine-itembox"
                v-else-if="item.single"
                :style="{ 'background': cueTheme == 'day-theme' ? '#121212' : '' }"
                @click="refineOperate(item.ButtonId)"
              >
                {{ item.ButtonnNme }}
              </view>
              <view
                class="refine-itembox"
                v-else
                :style="{ 'background': cueTheme == 'day-theme' ? '#121212' : '' }"
                @click="taskBtns(item)"
              >
                {{ item.ButtonnNme }}
              </view>
            </block>
          </block>
        </view>

        <view
          class="release"
          v-if="goods.status >= 0"
        >
          <view
            :class="cueTheme == 'day-theme' ? 'release-btn active' : 'release-btn'"
            @click="moreFeatures(1)"
          >
            <image
              :src="cueTheme == 'day-theme' ? '../static/img/detail/release2.png' : '../static/img/detail/release.png'"
            />
            发布
          </view>
        </view>

        <view class="flex-col group_4 space-y-22">
          <view
            class="items-baseline space-x-2"
            :style="{ 'background': cueTheme == 'day-theme' ? '#EEEEEE' : '' }"
          >
            <view
              class="font_1"
              @click="copyKeyword(goods.prompt, '关键词')"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >
              <view>关键词：</view>
              <view :class="cueTheme == 'day-theme' ? 'copy copyActive' : 'copy'">
                <image
                  :src="cueTheme == 'day-theme' ? '../static/img/detail/copy2.png' : '../static/img/detail/copy.png'">
                </image> 复制
              </view>
            </view>
            <view
              class="font_2"
              @click="copyKeyword(goods.prompt, '关键词')"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.prompt ? goods.prompt : '未公开' }}</view>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >
              <view>创作 ID：</view>
            </view>
            <view
              class="font_2"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.uuid }}</view>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >创作时间：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              {{ $u.timeFormat(new Date(goods.updateTime), "yyyy-mm-dd hh:MM:ss") }}
            </text>
          </view>
          <view class="items-baseline space-x-2">
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >模型：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.modelInfo.modelName }}</text>
          </view>
          <view
            class="items-baseline space-x-2"
            v-if="goods.modelInfo.aspect"
            @click="savePoster"
          >
            <view
              class="font_1"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
            >尺寸：</view>
            <text
              class="font_2 text_3"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >{{ goods.modelInfo.aspect }}</text>
          </view>
        </view>
      </view>

      <view
        class="footer"
        v-if="goods.status >= 0"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#2A2A2A' }"
      >
        <view
          class="footer-item"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.08)' : '' }"
        >
          <view
            class="mask"
            v-if="showMore"
            @click="showMoreClick"
          ></view>
          <view
            class="more"
            v-if="showMore"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
          >
            <!-- <view :class="moreIndex == 1 ? 'moreactive more-list' : 'more-list'" @click="moreFeatures(1)">发布画廊</view> -->
            <view
              :class="moreIndex == 2 ? 'moreactive more-list' : 'more-list'"
              @click="moreFeatures(2)"
            >移至合集</view>
            <view
              :class="moreIndex == 3 ? 'moreactive more-list' : 'more-list'"
              @click="moreFeatures(3)"
            >删除</view>
          </view>
          <view
            class="tablist"
            @click="showMoreClick"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon11.png' : '../static/img/detail/icon1.png'">
            </image><br />
            <view>更多</view>
          </view>
          <view
            class="tablist"
            @click="remakeWorks()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon22.png' : '../static/img/detail/icon2.png'">
            </image><br />
            <view>重做</view>
          </view>
          <view
            class="tablist"
            @click="downLoad()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon44.png' : '../static/img/detail/icon4.png'">
            </image><br />
            <view>下载</view>
          </view>
          <view
            class="tablist"
            @click="existingApply()"
            style="width:66px;"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#8A8A8A' }"
          >
            <image :src="cueTheme == 'day-theme' ? '../static/img/detail/icon33.png' : '../static/img/detail/icon3.png'">
            </image><br />
            <view>申请存证</view>
          </view>
        </view>

        <button
          class="footer-item btns"
          style="margin:0"
          v-if="goods.galleryId"
          type=""
          open-type="share"
        >
          <image src="../static/img/detail/forward.png"></image>
          分享
        </button>
        <button
          class="footer-item btns"
          style="margin:0"
          v-else
          type=""
          @click="moreFeatures(1)"
        >
          <image src="../static/img/detail/forward.png"></image>
          分享
        </button>
      </view>

      <!-- 作品制作失败 -->
      <view
        class="footer"
        v-else
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
      >
        <view
          class="footer-items"
          @click="moreFeatures(3)"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
        >删除
        </view>
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
          >{{ shareStatus ? '分享后作品会发布到画廊,' : '' }}
            <br />确定发布画廊吗？
          </view>
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
              @input="onInput"
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



      <!-- 细化 延展 极速高清弹窗 -->
      <view
        class="model"
        v-if="btnsStatus"
        @click="btnsStatus = false"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >{{ btnsTitle }}
            <image
              @click="btnsStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>
          <view class="download">
            <block v-if="btnsTitle == '极速高清'">
              <view
                class="download-item"
                v-for="(item, index) in btnsList"
                :key="index"
                @click="refineOperate(index)"
              >{{
                item.ButtonnNme }}</view>
            </block>
            <block v-else>
              <view
                class="download-item"
                v-for="(item, index) in btnsList"
                :key="index"
                @click="refineOperate(item.ButtonId)"
              >{{ item.ButtonnNme }}</view>
            </block>
            <view
              class="download-tips"
              v-if="btnsTitle == '细化'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              细化：更多细节和调节功能</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '极速高清'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              极速高清：更高清，尺寸更大的图像</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '延展'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              延展：更多的延展图片</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '变化'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              变化：增加更多的图像变化</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '扩图'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              扩图：扩展放大更多的画面与细节</view>
            <view
              class="download-tips"
              v-if="btnsTitle == '平移'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              平移：按方向扩展放大更多画面与细节</view>
            <block v-if="btnsTitle != '极速高清'">
              <view
                class="download-tips"
                v-if="goods.mode == 6 || goods.mode == 8"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'font-size': '20rpx' }"
              >
                提示：该作品已开启快速通道模式，二次创作将继续消耗灵力</view>
            </block>
          </view>
        </view>
      </view>

      <!-- 下载弹窗 -->
      <view
        class="model"
        v-if="downloadStatus"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >下载
            <image
              @click="downloadStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>
          <view class="download">
            <view
              class="download-item"
              v-for="(item, index) in 4"
              :key="index"
              @click="pictureDownload(index)"
            >下载{{
              index + 1 }}</view>
          </view>
        </view>
      </view>

      <!-- 细化弹窗 -->
      <view
        class="model"
        v-if="refineStatus"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >细化
            <image
              @click="refineStatus = false"
              :src="cueTheme == 'day-theme' ? '../static/img/detail/colse_gray.png' : '../static/img/detail/colse.png'"
            ></image>
          </view>

          <!-- MJ画板 -->
          <block v-if="goods.model < 10">
            <view
              class="refine-item"
              @click="refineOperate(false)"
            >极速高清（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '免费' : '10灵力' }}）</view>
            <view
              class="refine-item"
              @click="refineOperate(true)"
            >精致细化（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '10灵力' : '20灵力' }}）</view>
          </block>

          <!-- 灵创画板 -->
          <block v-if="goods.model >= 10">
            <view
              class="refine-item"
              @click="refineOperate(false)"
            >极速高清（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '免费' : '2灵力' }}）</view>
            <view
              class="refine-item"
              @click="refineOperate(true)"
            >精致细化（{{ (userInfo.vip ||
              userInfo.anchor == 1) ? '5灵力' : '10灵力' }}）</view>
          </block>

          <view class="refine-tips">
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }">极速高清：</text>
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }">不改变作品细节,平均30秒出图</text>
          </view>
          <view class="refine-tips">
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }">精致细化：</text>
            <text :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }">增加作品更多细节,平均5分钟出图</text>
          </view>
          <view class="refine-tips"></view>
        </view>
      </view>


      <!-- 申请存证 -->
      <e-model
        :showModel="existingStatus"
        title="请确定是否存证"
        tips="存证后可生成区块链存证，该存证可在法院起诉中作为证据"
        @cancelHandle="existingStatus = false"
        @confirmHandle="existingConfirm()"
      ></e-model>


      <view
        class="model"
        v-if="rechargeStatus"
      >
        <view
          class="model-body"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
        >
          <view
            class="title"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >温馨提示</view>
          <view
            class="title-illust"
            :style="{ 'color': cueTheme == 'day-theme' ? '#8A8A8A' : '' }"
          >存证次数不足，是否前往充值？</view>
          <view class="btns">
            <view
              class="btnsize"
              @click="rechargeStatus = false"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '' }"
            >取消
            </view>
            <view
              class="btnsize actice"
              @click="existingRecharge()"
            >确定</view>
          </view>
        </view>
      </view>


      <u-popup
        :show="illustrates"
        mode="center"
        @close="illustrates = false"
        border-radius="40"
        style="background-color: #00ebd3;"
      >
        <view
          class="speak"
          style="padding:0 0 20rpx 0;overflow: hidden; "
        >
          <canvas
            id='canvas'
            :class="goods.modelInfo.aspect == '9:16' ? 'canvasb' : 'canvas'"
            canvas-id="firstCanvas"
            :style="{ 'height': lineBgHeight + 'rpx' }"
          ></canvas>
          <view
            class="speak-btn"
            @click="savePoster"
            style="width:94%;margin:50rpx auto 0"
          >保存</view>
        </view>
      </u-popup>



      <!-- 移至合集弹窗 -->
      <u-popup
        :show="collecStatus"
        @close="closeColle"
        :round="10"
        :closeable="true"
      >
        <view
          class="popup-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >移至合集
        </view>
        <view
          class="models"
          style="color:white"
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
            >+ 创建合集</view>
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
            >+ 创建合集</view>
          </view>
        </view>
      </u-popup>

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
            class="addtext"
            type="text"
            v-model="addtext"
            placeholder="请输入名称"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#353535', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          />
          <view class="topping">
            <view :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }">
              置顶</view>
            <u-switch
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

    </block>
  </view>
</template>

<script>
import { tackdrawDetail, moveToGallery, attestAdd, taskDelete, collectList, moveToCollect, userInfo, taskNext, collectAdd } from '../static/api/index.js'
import { taskDownload, taskUpscale, taskSuperreal } from '../static/api/detail.js'

import shareMethod from "../static/utils/utils.js"
export default {
  components: {},
  data() {
    return {
      titleName: '详情',
      goods: {
        modelInfo: {}
      },  // 作品详情
      moveModalShow: false,  //发布画廊弹窗
      illustrate: false,//发布画廊说明弹窗
      moveSelect: false,
      keyword: false, // 是否公开关键词
      moreIndex: 0,   // 更多功能下标
      showMore: false,// 更多功能状态
      collecStatus: false,// 合集弹窗状态
      collectList: [],  // 合集列表
      collectNum: 1,    // 合集列表分页
      collectTotal: 0,  // 合集个数
      shareStatus: false, // 是否开启分享弹窗
      downloadStatus: false, //图片下载弹窗状态
      refineStatus: false,//细化弹窗
      refineIndex: 0,//默认喜欢
      existingStatus: false,// 存证申请
      rechargeStatus: false,// 存证充值状态
      pictureSize: 0,
      redo: null,//是否重做
      userInfo: {},
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

      card: {
        company: '',
        real_name: 0,
        head_img: 'https://cdn.drawai.cn/public/default.jpg'
      },
      wx_qrcode: 'https://cdn.drawai.cn/public/20230215-143951.jpg',  //小程序二维码
      customData: {
        ctx: null,
      },

      illustrates: false,
      lineBgHeight: 0,
      lineBgwidth: 380,
      id: 0,//作品ID

      posterStatus: false,
      btnsStatus: false,//细化延展极速高清按钮
      btnsList: [],
      btnsTitle: '',//弹窗标题
      showListbtns: [],  // 显示按钮
      pageStatus: false,
      collectionShow: false,
      addtext: '',//添加合集标题
      sticky: false,//合集是否置顶
    };
  },
  onLoad(res) {
    this.id = res.id;
    this.tackdrawDetail(res.id)
    this.getcollectList();
    userInfo({}).then((res) => {
      if (res.code == 200) {
        this.userInfo = res.result;
      }
    });

  },
  mounted() { },
  methods: {



    savePoster() {
      let that = this;
      uni.getSetting({
        success(res) {
          // 查询用户是否授权
          if (res.authSetting['scope.writePhotosAlbum']) {
            that.doSave();
          } else {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.doSave();
              },
              fail() {
              }
            })
          }
        }
      })
    },

    doSave() {
      uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'firstCanvas',
        success(res) {
          console.log(res)
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              uni.showToast({
                title: '保存成功',
              })
            },
            fail(err) {
              uni.showToast({
                title: '保存失败,请重试！',
                icon: 'none',
              })
            }
          })
        },
        fail(err) {
          uni.showToast({
            title: '保存失败',
          })
        },
      })
    },


    async getShare() {
      let env = this.$baseURL == 'https://app.onefold.cn' ? 'trial' : 'release';
      let mpUrl = this.$baseURL + '/user/invite/getWxaCode/wxec994b5f8ad8bfde/' + env;
      mpUrl = await this.downloadFilestoreImage(mpUrl);
    },

    //图片转符合安全域名路径
    downloadFilestoreImage(url) {
      return new Promise((resolve, reject) => {
        let that = this;
        uni.downloadFile({
          url: url,
          header: {
            Authorization: uni.getStorageSync('token')
          },
          success: function (res) {
            resolve(res.tempFilePath);
          },
          fail: function () {
            return that.$util.Tips({
              title: ''
            });
          }
        });
      })
    },

    // 更多功能列表
    moreFeatures(type) { //发布画廊
      let that = this
      that.moreIndex = type;
      if (type == 1) {  //开启更多功能
        that.moveModalShow = true; // 开启发布画廊
        that.showMore = false;
        that.moveFlag = false; //默认不公开画廊
        that.keyword = false; // 默认不公开关键词
        that.shareStatus = true;
      } else if (type == 2) { // 移至合集
        that.collecStatus = !that.collecStatus;
      } else if (type == 3) { // 删除
        uni.showModal({
          title: '温馨提示',
          content: '您确认要删除吗？删除后将无法找回该作品哦~',
          success: function (res) {
            if (res.confirm) {
              taskDelete({ id: that.goods.id }).then(data => {
                if (data.code == 200) {
                  uni.showToast({ title: "删除成功", icon: 'none', duration: 4000 })
                  setTimeout(function () { uni.navigateBack(); }, 1000)
                }
              })
            }
          }
        })
      }
    },

    // 作品详情
    tackdrawDetail(id) {
      uni.showLoading({ title: '加载中' });
      tackdrawDetail({ id: id, }).then(res => {
        if (res.code == 200) {
          uni.hideLoading()
          this.pageStatus = true;
          let goods = res.result;
          let btns = res.result.buttons ? JSON.parse(res.result.buttons) : [];
          let pictureSize = 0;
          let showListbtns = [
            { idx: 0, ButtonnNme: '细化', status: false, single: false },
            { idx: 1, ButtonnNme: '延展', status: false, single: false },
            { idx: 2, ButtonnNme: '变化', status: false, single: false },
            { idx: 3, ButtonnNme: '扩图', status: false, single: false },
            { idx: 4, ButtonnNme: '魔改', status: false, single: false },
            { idx: 5, ButtonnNme: '平移', status: false, single: false },
            { idx: 6, ButtonnNme: '极速高清', status: false, single: false },
            { idx: 7, ButtonnNme: '转为方形', status: false, single: false },
            { idx: 8, ButtonnNme: '减少细节', status: false, single: false },
            { idx: 9, ButtonnNme: '微调细节', status: false, single: false },
            { idx: 10, ButtonnNme: '精调细节', status: false, single: false },
            { idx: 11, ButtonnNme: '极速高清', status: false, single: false },
            { idx: 12, ButtonnNme: '局部重绘', status: false, single: false },
          ]; // 列表

          btns.map(item => {
            if (item.ButtonnNme.substring(0, 2) == '细化') {
              pictureSize += 1
              showListbtns[0].status = true;
              if (goods.model < 10) { //灵创画板不需要展示
                showListbtns[6].status = true;
              }
            } else if (item.ButtonnNme.substring(0, 2) == "延展") {
              showListbtns[1].status = true;
            } else if (item.ButtonnNme.substring(0, 2) == "变化") {
              if (item.ButtonId.indexOf('high_variation') >= 0 || item.ButtonId.indexOf('low_variation') >= 0) {// 多个变化 变强 变弱
                showListbtns[2].status = true;
              } else { // 单个变化 
                showListbtns[2].status = true;
                showListbtns[2].single = true;
                showListbtns[2].ButtonId = item.ButtonId;
              }
            } else if (item.ButtonnNme.substring(0, 2) == '扩图') {
              showListbtns[3].status = true;
              showListbtns[3].ButtonId = item.ButtonId;
            } else if (item.ButtonnNme == "魔改") {
              showListbtns[4].status = true;
              showListbtns[4].single = true;
              showListbtns[4].ButtonId = item.ButtonId;
            } else if (item.ButtonId.indexOf('pan_up') >= 0 || item.ButtonId.indexOf('pan_down') >= 0 || item.ButtonId.indexOf('pan_left') >= 0 || item.ButtonId.indexOf('pan_right') >= 0) {
              showListbtns[5].status = true;
              showListbtns[5].ButtonId = item.ButtonId;
            } else if (item.ButtonnNme == "转为方形") { //转为方形
              showListbtns[7].status = true;
              showListbtns[7].single = true;
              showListbtns[7].ButtonId = item.ButtonId;
            } else if (item.ButtonId.indexOf('upsample_light') >= 0) { // 减少细节
              showListbtns[8].status = true;
              showListbtns[8].single = true;
              showListbtns[8].ButtonId = item.ButtonId;
            } else if (item.ButtonId.indexOf('upsample_beta') >= 0) { // 微调细节
              showListbtns[9].status = true;
              showListbtns[9].single = true;
              showListbtns[9].ButtonId = item.ButtonId;
            } else if (item.ButtonId.indexOf('upsample') >= 0 && item.ButtonnNme == '精调细节') { // 精调细节
              showListbtns[10].status = true;
              showListbtns[10].single = true;
              showListbtns[10].ButtonId = item.ButtonId;
            } else if (item.ButtonId.indexOf('Inpaint') >= 0) { // 局部重绘
              showListbtns[12].status = true;
            }

            if (item.ButtonId.indexOf('upsample') == -1 && !showListbtns[0].single && pictureSize == 0) { //单个极速高清
              showListbtns[11].status = true;
              showListbtns[11].single = true;
            }
          })
          this.showListbtns = showListbtns
          this.pictureSize = pictureSize;
          goods.buttons = btns;
          goods.modelInfo.style = goods.modelInfo.style ? JSON.parse(goods.modelInfo.style) : {};
          goods.style = goods.modelInfo.style
          this.goods = goods;

          // 等待渲染完成在获取页面元素信息
          this.$nextTick(() => {
            let el = uni.createSelectorQuery().selectAll('.desc')
            el.boundingClientRect(res => {
              this.elData = res;
            }).exec()
          })

          uni.getImageInfo({
            src: this.goods.detailUrl,
            success(res) {
              this.lineBgHeight = res.height > 900 ? 800 : 580
            }
          })
        } else {
          this.pageStatus = true;
          uni.hideLoading()
        }
      }).catch(err => { })
    },

    // 关键词复制
    copyKeyword(text, name) {
      uni.setClipboardData({
        data: text,
        success: function () {
          uni.showToast({ title: name + "复制成功", icon: 'none', duration: 4000 })
        }
      });
    },

    // 
    limitsTtpe(index) {
      this.sameIndex = index;
    },

    onInput() {
      if (this.sameValue > 20) {
        this.sameValue = 20
      }
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
        id: this.goods.id,
        isVisible: this.sameIndex == 5 ? -that.sameValue : that.sameList[that.sameIndex].type
      }
      moveToGallery(data).then(res => {
        if (res.code == 200) {
          uni.showToast({ title: "操作成功", duration: 3000 });
          setTimeout(function () {
            uni.navigateBack();
          }, 2000)
          this.moveModalShow = false;
          that.tackdrawDetail(that.id);
        } else {
          this.moveModalShow = false;
        }
      })
    },

    // 申请存证
    existingApply() {
      this.showMore = false;
      this.existingStatus = true;
    },

    // 确认存证
    existingConfirm() {
      let that = this;
      uni.showLoading({
        title: '申请存证中...',
        mask: true,
      })
      attestAdd({ id: that.goods.id }).then(res => {
        this.existingStatus = false
        if (res.code == 200) {
          setTimeout(function () {
            uni.hideLoading()
          }, 1500)
          uni.showModal({
            title: '温馨提示',
            content: '区块链存证申请成功',
            success: function (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pmnie/mnie/evidence',
                })
              }
            }
          });
        } else if (res.code == 888) {
          uni.hideLoading()
          that.rechargeStatus = true;
        } else {
          uni.hideLoading()
        }
      })
    },

    // 存证充值
    existingRecharge() {
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }
      this.rechargeStatus = false
      uni.navigateTo({
        url: '/pmnie/mnie/recharge?epindex=attest'
      })
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
      if (!collectId) {
        uni.showToast({
          title: "请选择需要加入的合集", icon: 'none', duration: 3000
        })
        return
      }
      uni.$u.debounce(() => {
        uni.showLoading({ title: '加载中...', mask: true, })
        moveToCollect({ taskList: [that.goods.id], collectId: collectId, }).then(res => {
          if (res.code == 200) {
            that.closeColle();
            uni.showToast({
              title: "添加成功", icon: 'none', duration: 3000
            })
            setTimeout(function () {
              uni.navigateBack();
            }, 1500)
          }
        }).finally(() => {
          uni.hideLoading()
        })

      }, 500)
    },

    // 再创作
    remakeWorks() {
      this.showMore = false;
      let data = this.goods;
      uni.setStorageSync('maskinfo', JSON.stringify(data));
      uni.navigateTo({
        url: '/phome/generate?maskinfo=' + JSON.stringify(data)
      })
    },

    // 图片放大
    previewImg: function (e) {
      let imgArr = [this.goods.url];
      uni.previewImage({
        current: this.goods.url,   //当前图片地址
        urls: imgArr,        //所有要预览的图片的地址集合 数组形式
      })
    },

    taskBtns(e) {
      let that = this;
      let data = that.goods;
      if (e.idx == 12) {
        uni.navigateTo({
          url: '/pclip/custom?url=' + data.url + "&id=" + that.goods.id
        })
        return
      }
      that.btnsStatus = !that.btnsStatus
      that.btnsTitle = e.ButtonnNme;
      that.btnsList = [];
      data.buttons.map(item => {
        if (e.ButtonnNme == '细化') {
          if (item.ButtonnNme.substring(0, 2) == '细化') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '延展') {
          if (item.ButtonnNme.substring(0, 2) == '延展') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '变化') {
          if (item.ButtonnNme.substring(0, 2) == '变化') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '扩图') {
          if (item.ButtonnNme.substring(0, 2) == '扩图') {
            that.btnsList.push(item)
          }
        } else if (e.ButtonnNme == '平移') {
          if (item.ButtonId.indexOf('pan_up') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向上'
            })
          } else if (item.ButtonId.indexOf('pan_down') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向下'
            })
          } else if (item.ButtonId.indexOf('pan_left') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向左'
            })
          } else if (item.ButtonId.indexOf('pan_right') >= 0) {
            that.btnsList.push({
              ButtonId: item.ButtonId,
              ButtonnNme: '向右'
            })
          }
        } else if (e.ButtonnNme == '极速高清') {
          that.btnsList = [
            { ButtonnNme: '图1' },
            { ButtonnNme: '图2' },
            { ButtonnNme: '图3' },
            { ButtonnNme: '图4' }
          ]
        }
      })
    },

    // 选择细化
    refineType(index) {
      let that = this;
      that.refineStatus = true;
      that.refineIndex = index;
    },

    // 开始细化
    async refineOperate(e) {
      let that = this;
      let subList = {};
      uni.showLoading({ title: '加载中...', mask: true, })
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
              '5lcJjf1V8X5lePJtn0eL-K7GWTad-Nby30U2ynuBgU8',
              '0vZdHaw50SXYC_KmYzjAbl4sJnG6e6DbaYMUA9dl_M4',
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

      console.log(e, '哈哈哈哈哈')

      let data = {
        id: that.goods.id,
        buttonId: e,
        fastChannel: '0', // 加速通道加速通道时传1, 主播通道传2
        subList: subList,  // 订阅信息
        openid: uni.getStorageSync('openid') || '',
        appid: getApp().globalData.appid,
      }
      if (this.userInfo.vip) {
        data.fastChannel = 1;
      }
      if (this.userInfo.anchor == 1) {
        data.fastChannel = 2;
      }
      uni.hideLoading()

      if (this.goods.model >= 10) {
        delete data.buttonId
        delete data.fastChannel
        data.high = e;
        data.serial = that.refineIndex,
          taskUpscale(data).then(res => {
            if (res.code == 200) {
              uni.removeStorageSync('albumName')
              setTimeout(function () {
                uni.hideLoading()
              }, 2000)
              uni.redirectTo({
                url: '/phome/make?id=' + res.result.id
              })
            }
          })
        return
      }

      //   单个极速高清
      if (!this.btnsTitle && !e) {
        delete data.buttonId
        delete data.fastChannel
        taskSuperreal(data).then(res => {
          if (res.code == 200) {
            uni.removeStorageSync('albumName')
            setTimeout(function () {
              uni.hideLoading()
            }, 2000)
            uni.redirectTo({
              url: '/phome/make?id=' + res.result.id
            })
          }
        })
        return
      }

      // 多个极速高清
      if (this.btnsTitle == '极速高清' && Number(e) >= 0) {
        delete data.buttonId
        delete data.fastChannel
        data.serial = e; //
        data.high = false;
        taskUpscale(data).then(res => {
          if (res.code == 200) {
            uni.removeStorageSync('albumName')
            setTimeout(function () {
              uni.hideLoading()
            }, 2000)
            uni.redirectTo({
              url: '/phome/make?id=' + res.result.id
            })
          }
        })
        return
      }

      // 普通单个操作
      taskNext(data).then(res => {
        if (res.code == 200) {
          uni.removeStorageSync('albumName')
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
          uni.redirectTo({
            url: '/phome/make?id=' + res.result.id
          })
        }
      })
    },


    // 图片下载
    pictureDownload(index) {
      let that = this;
      uni.showLoading({
        title: '加载中...',
        mask: true,
      })
      that.downloadStatus = false;
      taskDownload({ id: that.goods.id, serial: index, }).then(res => {
        if (res.code == 200) {
          uni.hideLoading();
          shareMethod.downLoadImage(res.result.url)

        }
      })
    },
    downLoad() {
      this.showMore = false;
      if (this.pictureSize != 4) {
        shareMethod.downLoadImage(this.goods.url)
      } else {
        this.downloadStatus = true;
      }
      return;

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


  },

  //  用户点击右上角分享
  onShareAppMessage() {
    this.showMore = false;
    let goods = this.goods;
    return {
      path: '/pclip/large?albumId=' + goods.galleryId + "&taskId=" + goods.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: this.goods.thumbUrl,
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    return {
      path: '/pclip/large?albumId=' + goods.galleryId + "&taskId=" + goods.id + "&inviter=" + getApp().globalData.my_inviter + "&share=true",
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    }
  }
};
</script>

<style scoped lang="scss">
.canvasb {
  min-height: 800rpx;
  width: 1024rpx;
  margin: 20rpx auto 0;
}

.canvas {
  min-height: 380rpx;
  margin: 20rpx auto 0;
}

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

.section-item {
  position: relative;
  margin: 0 auto;
  width: 100%;
  .preview-img{
     /* 适配折叠屏双屏手机 */
    width: 100% !important;
  }
}

.section-item .ident {
  z-index: 999;
  width: 56rpx;
  text-align: center;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  background: rgba(18, 18, 18, 0.46);
  color: white;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
}

.section-item .sud1 {
  position: absolute;
  top: 22rpx;
  left: 22rpx;
}

.section-item .sud2 {
  position: absolute;
  top: 22rpx;
  left: 54%;
}

.section-item .sud3 {
  position: absolute;
  top: 53%;
  left: 22rpx;
}

.section-item .sud4 {
  position: absolute;
  top: 53%;
  left: 54%;
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
  line-height: 50rpx;
}

.speak .speak-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  line-height: 80rpx;
  border-radius: 80rpx;
}

.refine {
  margin-top: 42rpx;
  padding-bottom: 42rpx;
  border-bottom: 1px solid #2C2C2C;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

.refine .refine-itembox {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
  width: 164rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  color: white;
  margin-bottom: 10rpx;
  margin-right: 10rpx;
}

.release {
  display: flex;
  justify-content: flex-end;
  margin-top: 42rpx;
}

.release .release-btn {
  width: 112rpx;
  height: 52rpx;
  line-height: 40rpx;
  text-align: center;
  background: rgba(41, 255, 175, 0.12);
  border-radius: 12rpx;
  border: 4rpx solid #0EF5E4;
  color: #0EF5E4;
  font-size: 24rpx;
}

.release .active {
  color: white !important;
  background: #121212 !important;
  border: 4rpx solid #121212;
}

.release .release-btn image {
  width: 32rpx;
  height: 32rpx;
  position: relative;
  top: 8rpx;
  left: -4rpx;
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
  border-radius: 24px;
  opacity: 1;
  border: 1px solid #FFFFFF;
}

.models-btn .active {
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 24px;
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
  left: 0;
  right: 0;
  background: #141416;
  bottom: 0;
  z-index: 999;
  display: flex;
  height: 150rpx;
  justify-content: space-between;
  padding: 16rpx 20rpx;
}

.footer .footer-item {
  width: 64%;
  height: 116rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 58rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-evenly;
  position: relative;
}

.footer-items {
  width: 80%;
  margin: 0 auto;
  height: 116rpx;
  line-height: 116rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 58rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-evenly;
  position: relative;
}

.tablist {
  text-align: center;
  width: 20%;
}

.tablist image {
  width: 44rpx;
  height: 44rpx;
  margin-top: 22rpx;
}

.footer .btns {
  color: #141416;
  background: linear-gradient(180deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 58rpx;
  width: 35%;
  font-size: 36rpx;
  font-weight: 500;
  line-height: 116rpx;
  height: 116rpx;
  justify-content: center;
}

.footer .btns image {
  width: 34rpx;
  height: 34rpx;
  position: relative;
  top: 44rpx;
  right: 10rpx;
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
  left: 10rpx;
  top: -150rpx;
  width: 88px;
  background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
  z-index: -1;
  border-radius: 8rpx;
}

.footer .footer-item .more .more-list {
  height: 70rpx;
  line-height: 70rpx;
  padding-left: 20rpx;
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
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
}

.model-body {
  width: 300px;
  min-height: 162px;
  background: linear-gradient(226deg, #172828 0%, #0F1817 100%);
  border-radius: 11rpx;
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30rpx;
}

.model-body .addtext {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  border-radius: 70rpx;
}

.model-body .topping {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.model-body .title {
  padding: 30rpx 0;
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

.download {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 30rpx;
}

.download .download-item {
  display: inline-block;
  width: 48%;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 16rpx;
  color: #000;
  height: 80rpx;
  line-height: 80rpx;
  margin-bottom: 20rpx;
}

.download .download-tips {
  font-size: 28rpx;
  margin: 10rpx 0 10rpx;
  word-break: break-all;
  white-space: pre-line;
  width: 100%;
}

.refine-item {
  width: 90%;
  text-align: center;
  background: linear-gradient(90deg, #61FFFF 0%, #29FFAF 100%);
  border-radius: 16rpx;
  color: #000;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 auto 20rpx;
}

.refine-tips {
  font-size: 23rpx;
  line-height: 40rpx;
  height: 40rpx;
}

.title-selet {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  height: 82rpx;
  line-height: 82rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  position: relative;
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
  width: 160rpx;
  text-align: center;
}

.title-input .yyds {
  font-size: 46rpx;
  width: 76rpx;
  text-align: center;
}

.model {
  z-index: 99999;
}

.model-body .share-name {
  line-height: 40rpx;
  font-size: 16px;
  width: 388rpx;
  margin: 60rpx auto 10rpx;
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

.group_3 {
  padding: 32rpx;
  overflow-y: auto;
}

.items-baseline:nth-child(1) {
  background: #2C2C2C;
  border-radius: 24rpx;
  padding: 20rpx;
}

.section_3 .fail {
  width: 320rpx;
  height: 320rpx;
  line-height: 320rpx;
  text-align: center;
  margin: 0 auto;
  /* border: 1px solid red; */
  color: red;
}

.section_3 .fail image {
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
  font-size: 30rpx;
  font-family: TsangerYuYangT-W05;
  line-height: 46rpx;
  color: rgba(255, 255, 255, 0.46);
  display: flex;
}

.font_1 image {
  width: 26rpx;
  height: 26rpx;
  position: relative;
  top: 6rpx;
  left: -4rpx;
}

.font_1 .copy {
  padding: 0rpx 12rpx;
  background: rgba(255, 255, 255, 0.1);
  font-size: 20rpx;
  height: 45rpx;
  line-height: 45rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.26);
}

.font_1 .copyActive {
  border: 1px solid rgba(18, 18, 18, 0.08) !important;
}

.font_2 {
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  color: #ffffff;
  margin-top: 16rpx;
  word-break: break-all;
  white-space: pre-wrap;
}

.textprompt {
  /* 超过三行 */
  max-height: 160rpx;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  position: relative;
  /* border: 1px solid red; */
}

.more-text {
  position: absolute;
  right: 0;
  bottom: -4rpx;
  color: white;
  width: 160rpx;
  height: 22px;
  background: #141416;
  text-align: center;
  line-height: 18px;
}

.more-text text {
  padding: 4rpx 30rpx;
  width: 48px;
  height: 16px;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9px 9px 9px 9px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
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
  padding: 32rpx 0;
  /* background-color: #ffffff; */
  background: #909399;
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
  width: 200rpx;
  height: 96rpx;
  border: solid 2rpx #ffffff;
  z-index: 999;
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