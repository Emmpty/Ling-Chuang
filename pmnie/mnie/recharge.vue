<template>
  <view
    class="flex-col justify-start relative page"
    :class="cueTheme"
  >
    <nav-bar
      title="充值中心"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>
    <remind
      v-if="deviceInfo == 'ios'"
      :jsonInfo="jsonInfo"
    />

    <view
      class="flex-col"
      v-else
    >
      <view
        v-if="!showUserPhoneInput"
        class="user"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : 'rgba(244,244,244,0.08)' }"
      >
        <view
          class="user-name"
          :style="{ 'color': cueTheme == 'day-theme' ? '' : '#fff' }"
        >
          {{ userInfo.level == 0 ? '普通用户' : '尊享会员' }}
          <vipLevel :userVipLevel="userInfo.level"></vipLevel>
        </view>
        <view
          class="user-time"
          :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
        >
          <view>有效时间 {{ wallet.expire_date ? wallet.expire_date : "您还不是灵创会员" }}</view>
          <view
            class="added"
            @click="addedServices()"
          >增值服务 <text> > </text> </view>
        </view>


        <view class="user-item">
          <view :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.76)' }">存证确权：{{
      wallet.attest_usable
    }}次</view>
          <view :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.76)' }">灵力{{ wallet.point / 10 }}点
            <text
              style="color:#1DCCAF;margin-left:20rpx;"
              @click="goDetail()"
            >明细 <text style="margin-left: 20rpx;"> > </text> </text>
          </view>
        </view>
      </view>

      <view
        v-else
        class="form-box"
      >
        <u-form
          ref="uForm"
          label-position="top"
          label-width="180"
          :model="userInfoFormData"
          :label-style="formLabelStyle"
        >
          <u-form-item label="充值账号(必填)">
            <input
              class="input-box"
              v-model="userInfoFormData.phone"
              placeholder="请输入充值手机号"
              placeholder-class="placeholder_class"
              type="number"
              @blur="phoneInputBlur()"
            />
          </u-form-item>
        </u-form>
      </view>

      <view
        class="flex-col section_5 space-y-24"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <!-- menBar -->
        <scroll-view scroll-x="true">
          <view class="tabitem">
            <view
              v-for="(item, index) in rechargeList "
              :key="index"
              :class="[cueTheme != 'day-theme' ? 'tabitem-item' : 'tabwhite-item', { 'tabitem-active': packId == item.key }]"
              @click="packageClick(item, index)"
            >{{ item.name }}</view>
          </view>
        </scroll-view>

        <!-- 套餐栏 -->
        <view
          class="flex-col space-y-12"
          v-if="showVipCard"
        >

          <view class="card">
            <view
              :class="powerIndex == index ? 'card-item card-active' : 'card-item'"
              v-for="(item, index) in currentSelectPack.list"
              :key="index"
              @click="powerType(index, item)"
            >
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#f4f4f4' }"
              >
                {{ item.title }}
              </view>
              <!-- 划线价 -->
              <view
                class="orargy"
                v-if="item.original_price > 0"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                ￥{{ item.original_price }}
              </view>
              <!-- 折扣 -->
              <view
                class="prefer"
                v-if="item.discount != '0'"
                :style="{ background: item.bgColor }"
              >
                {{ item.discount }}
              </view>
              <view
                :class="powerIndex == index ? 'price_hei' : 'price_white'"
                :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '#F4F4F4' }"
              >
                <text>￥</text>{{ item.price }}
                <text>/{{ item.month }}</text>
              </view>
            </view>
          </view>

          <view
            class="font_10 handle "
            @click="contactService"
            :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
          >
            办理会员后<text style="color: #1DCCAF;">联系客服</text>加入会员专属群
            <!-- <p style="margin-top: 8rpx;font-size: 24rpx;">虚拟产品一经使用后无法退款</p> -->
          </view>

          <view class="equityTab">
            <view
              class="equityTab-left"
              :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
            >会员臻享权益</view>
            <view
              class="equityTab-right"
              @click="moreBenefits()"
              :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
            >
              更多权益 <image
                :src="cueTheme == 'day-theme' ? '/static/img/detail/arry_hui.png' : '/static/img/detail/arry.png'"
              >
              </image>
            </view>
          </view>

          <view class="tips">
            <image
              class="iconimg"
              :src="cueTheme == 'day-theme' ? '/static/img/payment/icon1.png' : '/static/img/payment/icon11.png'"
            ></image>
            <view class="tips-item">
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
              >容量升级</view>
              <view
                class="texo"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                作品容量扩充至
                {{ playInfo.capacity }}个
              </view>
            </view>
          </view>
          <view class="tips">
            <image
              class="iconimg"
              :src="cueTheme == 'day-theme' ? '/static/img/payment/icon2.png' : '/static/img/payment/icon22.png'"
            ></image>
            <view class="tips-item">
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
              >尊享会员专属通道</view>
              <view
                class="texo"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                MJ画板专属会员通道免费（不消耗灵力）<br />
                灵创画板生成和极速高清免费（不消耗灵力）
              </view>
            </view>
          </view>
          <view class="tips">
            <image
              class="iconimg"
              :src="cueTheme == 'day-theme' ? '/static/img/payment/icon3.png' : '/static/img/payment/icon33.png'"
            ></image>
            <view class="tips-item">
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
              >增值更优惠</view>
              <view
                class="texo"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                MJ画板快速通道比普通用户便宜50%<br />
                灵创画板精致细化比普通用户便宜50%
              </view>
            </view>
          </view>
          <view class="tips">
            <image
              class="iconimg"
              :src="cueTheme == 'day-theme' ? '/static/img/payment/icon4.png' : '/static/img/payment/icon44.png'"
            ></image>
            <view class="tips-item">
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
              >新功能抢先体验</view>
              <view
                class="texo"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                享受新功能抢先体验，优秀关键词分享
              </view>
            </view>
          </view>
          <view class="tips">
            <image
              class="iconimg"
              :src="cueTheme == 'day-theme' ? '/static/img/payment/icon5.png' : '/static/img/payment/icon55.png'"
            ></image>
            <view class="tips-item">
              <view
                class="name"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : '#F4F4F4' }"
              >会员专属群</view>
              <view
                class="texo"
                :style="{ 'color': cueTheme == 'day-theme' ? '' : 'rgba(244,244,244,0.48)' }"
              >
                加入会员专属群，获得与各位大佬交流写词心得
              </view>
            </view>
          </view>

        </view>

        <!-- 灵力充值 -->
        <view
          class="flex-col space-y-12"
          v-if="packId == 'point'"
        >
          <view
            :class="powerIndex == index ? 'flex-col section_6 space-y-10 active' : 'flex-col section_6 space-y-10'"
            v-for="(item, index) in currentSelectPack.list"
            :key="index"
            @click="powerType(index, item)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#141416' }"
          >
            <view class="flex-row justify-between items-center">
              <view
                class="font_5"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ item.title }}
                <text
                  class="font_active"
                  v-if="item.discount != '0'"
                  :style="{ background: item.bgColor }"
                >
                  {{ item.discount }}
                </text>
              </view>
              <view class="group_5 view">
                <text
                  class="font_6"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >¥</text>
                <text
                  class="font_2"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >{{ item.price }}</text>
              </view>
            </view>
            <view class="flex-row justify-between items-baseline group_7">
              <text
                class="font_7 text_8"
                :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
              >{{ item.subtitle }}</text>
              <text
                class="font_1 text_16"
                :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '#fff' }"
                v-if="item.original_price > 0"
              >¥{{ item.original_price }}</text>
            </view>
          </view>
        </view>

        <!-- 存证确权 -->
        <view
          class="flex-col space-y-12"
          v-if="packId == 'attest'"
        >
          <view
            :class="powerIndex == index ? 'flex-col section_6 space-y-10 active' : 'flex-col section_6 space-y-10'"
            v-for="(item, index) in currentSelectPack.list"
            :key="index"
            @click="powerType(index, item)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#141416' }"
          >
            <view class="flex-row justify-between items-center">
              <text
                class="font_5"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ item.title }}</text>
              <view class="group_5 view">
                <text
                  class="font_6"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >¥</text>
                <text
                  class="font_2"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >{{ item.price }}</text>
              </view>
            </view>
            <view class="flex-row justify-between items-baseline group_7">
              <text
                class="font_7 text_8"
                :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
              >{{ item.subtitle }}</text>
              <text
                class="font_1 text_16"
                :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '#fff' }"
                v-if="item.original_price > 0"
              >¥{{ item.original_price }}</text>
            </view>
          </view>
        </view>

        <!-- 存证确权介绍 -->
        <view
          class="flex-col space-y-20"
          v-if="packId == 'attest'"
        >
          <view class="self-start group_8">
            <view
              class="font_4 text_18"
              :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
            >存证权益</view>
            <view
              class="font_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
            >（1）该存证已上区块链被永久保存。</view>
            <view
              class="font_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
            >（2）该存证被法院认可，可作为诉讼中的区块链证据
            </view>
            <view
              class="font_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
            >（3） 详细的诉讼流程可点击查看（诉讼操作步骤）
            </view>
            <!-- <view class="font_10"  @click="contactService">办理会员后<text style="color:#00C3FF;">联系客服</text>加入会员专属群</view> -->
          </view>
        </view>

        <!-- 增值服务 -->
        <view
          class="flex-col space-y-12"
          v-if="packId == 'addition'"
          style="padding-bottom: 240rpx;"
        >
          <view
            :class="powerIndex == index ? 'flex-col section_6 space-y-10 active' : 'flex-col section_6 space-y-10'"
            v-for="(item, index) in currentSelectPack.list"
            :key="index"
            @click="powerType(index, item)"
            :style="{ 'background': cueTheme == 'day-theme' ? '#ffffff' : '#141416' }"
          >
            <view class="flex-row justify-between items-center">
              <text
                class="font_5"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >{{ item.title }}</text>
              <view class="group_5 view">
                <text
                  class="font_6"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >¥</text>
                <text
                  class="font_2"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#1affe8' }"
                >{{ item.price }}</text>
              </view>
            </view>
            <view class="flex-row justify-between items-baseline group_7">
              <text
                class="font_7 text_8"
                :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
              >{{ item.subtitle }}</text>
              <text
                class="font_1 text_16"
                :style="{ 'color': cueTheme == 'day-theme' ? 'rgba(18,18,18,0.52)' : '#fff' }"
                v-if="item.original_price > 0"
              >¥{{ item.original_price }}</text>
            </view>
          </view>
        </view>

      </view>


    </view>


    <view
      class="refooter"
      v-if="deviceInfo != 'ios'"
      :style="{ 'background': cueTheme == 'day-theme' ? '' : '#3B3B3B' }"
    >
      <view
        class="refooter-numll"
        :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '#fff' }"
      >￥{{
      showVipCard ? playInfo.actual_payment : playInfo.price }}
        <text
          class="actual"
          :style="{ 'color': cueTheme == 'day-theme' ? '' : '#fff' }"
        >实付</text>
        <text
          class="first"
          v-if="playInfo.save_money > 0"
        >立省{{ playInfo.save_money }}元</text>
      </view>
      <view
        class="refooter-play"
        @click="immediatePayment()"
      >立即支付</view>
    </view>


    <u-popup
      :show="moveModalShow"
      mode="center"
      mask-close-able="true"
      zIndex="998"
    >
      <view class="section u-flex u-col-center u-row-center">
        <view
          class="flex-col section_7 space-y-28"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <text
            class="self-center font_9 text_9"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >请输入折扣码</text>
          <view class="flex-col space-y-24">
            <view class="flex-col justify-start items-start text-wrapper_2">
              <input
                type="text"
                placeholder="请输入折扣码"
                v-model="codeValue"
                name='phone'
                maxlength="24"
                style="width:100%"
                :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              >
            </view>
            <view class="flex-row space-x-16">
              <view
                class="flex-col justify-start items-center text-wrapper_3"
                @click="getModalShow"
                :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '#141416' }"
              >
                <text
                  class="font_5 text_11"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff', }"
                >取消</text>
              </view>
              <view
                class="flex-col justify-start items-center text-wrapper_4"
                @click="moveToGallery"
              >
                <text
                  class="font_9 text_12"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#000' }"
                >确定</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 会员---套餐-->
    <u-popup
      :show="status"
      mode="bottom"
      border-radius="40"
      height="800"
      mask-close-able="true"
      zIndex="998"
    >
      <view
        class="speak"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="speak-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >请确认购买信息
          <image
            @click="cancelPackage()"
            :src="cueTheme == 'day-theme' ? '../../static/img/detail/colse_gray.png' : '../../static/img/detail/colse.png'"
          />
        </view>
        <view class="flex-col space-y-24">
          <view class="self-center group_6">
            <view
              class="font_9 text_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >购买产品：{{ playInfo.title }}
            </view>
            <view
              class="font_9 text_12"
              v-if="discountObj.pay"
              style="text-decoration:line-through;margin:12rpx 0;"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >折扣前价格：¥{{ playInfo.actual_payment }}</view>
            <view
              class="font_9 text_11"
              style="margin:12rpx 0;"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              支付金额</view>
            <view
              class="pricek"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              <text>¥</text>{{ discountObj.pay ? discountObj.pay / 100 : playInfo.actual_payment }}
            </view>
            <view
              class="font_9 text_12"
              v-if="!discountObj.pay"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              若有折扣码， <text
                class="font_9 text_13"
                @click="getModalShow"
              >请点击输入</text></view>
          </view>
        </view>

        <!-- #ifndef MP-->
        <view
          class="paytype"
          v-if="!isWeixin"
          :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : ' #f4f4f414' }"
        >
          <view
            class="paytype-item"
            @click="playType(1)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/wechat.png"
            ></image>
            微信支付
            <image
              class="play"
              :src="payIndex == 1 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
          <view class="paytype-border"></view>
          <view
            class="paytype-item"
            @click="playType(2)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/alipay.png"
            ></image>
            支付宝支付
            <image
              class="play"
              :src="payIndex == 2 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
        </view>
        <!-- #endif -->

        <view class="speak-footer">
          <view
            class="item left"
            @click="cancelPackage()"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >取消
          </view>
          <view
            class="item right"
            @click="eqPayment()"
          >确定支付</view>
        </view>
      </view>
    </u-popup>

    <!-- 灵力-充值-->
    <u-popup
      :show="powerStatus"
      mode="bottom"
      border-radius="40"
      height="800"
      zIndex="998"
    >
      <view
        class="speak"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="speak-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >请确认购买信息
          <image
            @click="powerStatus = !powerStatus"
            :src="cueTheme == 'day-theme' ? '../../static/img/detail/colse_gray.png' : '../../static/img/detail/colse.png'"
          />
        </view>
        <view class="flex-col space-y-24">
          <view
            class="self-center group_6"
            style="text-align:center;"
          >
            <view
              class="font_9 text_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              v-if="playInfo"
            >
              购买产品:{{ playInfo.title }}</view>
            <view
              class="font_9 text_11"
              style="margin:12rpx 0;"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              支付金额：</view>
            <view
              class="pricek"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              v-if="playInfo.price"
            >
              <text>¥</text>{{ playInfo.price }}
            </view>
          </view>
        </view>

        <!-- #ifndef MP-->
        <view
          class="paytype"
          v-if="!isWeixin"
          :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : ' #f4f4f414' }"
        >
          <view
            class="paytype-item"
            @click="playType(1)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/wechat.png"
            ></image>
            微信支付
            <image
              class="play"
              :src="payIndex == 1 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
          <view class="paytype-border"></view>
          <view
            class="paytype-item"
            @click="playType(2)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/alipay.png"
            ></image>
            支付宝支付
            <image
              class="play"
              :src="payIndex == 2 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
        </view>
        <!-- #endif -->

        <view class="speak-footer">
          <view
            class="item left"
            @click="powerStatus = !powerStatus"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >取消</view>
          <view
            class="item right"
            @click="eqPayment()"
          >确定支付</view>
        </view>
      </view>
    </u-popup>

    <!-- 存证---确权-->
    <u-popup
      :show="eqStatus"
      mode="bottom"
      border-radius="40"
      height="800"
      zIndex="99998"
    >
      <view
        class="speak"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >
        <view
          class="speak-title"
          :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
        >请确认购买信息
          <image
            @click="eqStatus = !eqStatus"
            :src="cueTheme == 'day-theme' ? '../../static/img/detail/colse_gray.png' : '../../static/img/detail/colse.png'"
          />
        </view>
        <view class="flex-col space-y-24">
          <view
            class="self-center group_6"
            style="text-align:center;"
          >
            <view
              class="font_9 text_10"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              v-if="playInfo.title"
            >
              购买产品：{{ playInfo.title }}</view>
            <view
              class="font_9 text_11"
              style="margin:12rpx 0;"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            >
              支付金额：</view>
            <view
              class="pricek"
              :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
              v-if="playInfo.price"
            >
              <text>¥</text>{{ playInfo.price }}
            </view>
          </view>
        </view>

        <!-- #ifndef MP-->
        <view
          class="paytype"
          v-if="!isWeixin"
          :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : ' #f4f4f414' }"
        >
          <view
            class="paytype-item"
            @click="playType(1)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/wechat.png"
            ></image>
            微信支付
            <image
              class="play"
              :src="payIndex == 1 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
          <view class="paytype-border"></view>
          <view
            class="paytype-item"
            @click="playType(2)"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <image
              class="icon"
              src="../../static/img/payment/alipay.png"
            ></image>
            支付宝支付
            <image
              class="play"
              :src="payIndex == 2 ? '../../static/img/clip/status_active.png' : '../../static/img/clip/status.png'"
            ></image>
          </view>
        </view>
        <!-- #endif -->

        <view class="speak-footer">
          <view
            class="item left"
            @click="eqStatus = !eqStatus"
            :style="{ 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >取消
          </view>
          <view
            class="item right"
            @click="eqPayment()"
          >确定支付</view>
        </view>
      </view>
    </u-popup>

    <e-model
      :showModel="needRegister"
      title="温馨提示"
      confirmText="前往注册"
      @cancelHandle="needRegister = false"
      @confirmHandle="register()"
    >
      <template v-slot:content>
        <view class="content-box u-flex-col u-col-center">
          <view>该手机号还未注册</view>
          <view class="mgt-4">注册完成后享受更多惊喜哦~</view>
        </view>
      </template>
    </e-model>

  </view>
</template>

<script>
import { discountCode, walletBuy, walletBuyByPhone, checkUserRegisterByPhone, userInfo } from '@/static/api/index.js'
import { mpOauth, mpToOpenIdOauth } from '@/static/api/home.js'
import remind from "./components/remind.vue";

import vipLevel from '@/components/vipLevel/vipLevel';
import utils from '@/static/utils/utils';

export default {
  components: { remind, vipLevel },
  data() {
    return {
      vipList: [],
      vipIndex: 0,
      status: false,
      moveModalShow: false,
      codeValue: '', //折扣码
      wallet: {},
      discountObj: {},
      packId: -1,
      eqIndex: 0, //权益下标
      eqStatus: false,
      powerIndex: 0,//灵力下标
      powerStatus: false,
      deviceInfo: '',//手机系统IOS 
      isWeixin: false,//是否微信内置浏览器
      code: '', //微信h5内置浏览器支付使用
      illustrate: '',
      payIndex: 0, //选择支付方式
      jsonInfo: {},
      // playInfo: {}, //支付信息
      userInfo: {}, //用户信息
      // menuBarList: [
      //   { name: '活动特惠', }, { name: '会员套餐', }, { name: '灵力充值', }, { name: '存证确权', },
      // ],
      rechargeList: [],
      currentSelectPack: null,
      // 标记双十一活动用户手机输入框
      showUserPhoneInput: false,
      userInfoFormData: {
        phone: '',
      },
      formLabelStyle: {
        color: 'fff',
      },
      // 标记手机号填写错误
      phoneFail: false,
      // 是否已注册
      needRegister: false,
      // 失焦时才判断手机号是否已注册，防止失焦立马点击支付弹出两个弹框
      canBuy: false,
    };
  },
  watch: {
    packId: {
      handler(newV, oldV) {
        let item = this.rechargeList.find((item) => item.key == newV)
        this.currentSelectPack = item || this.rechargeList[0]
      },
      immediate: true
    },
    'userInfoFormData.phone'(newVal, oldVal) {
      console.log('>>>>>>>>>>>>>newVal', newVal)
      this.checkPhone()
    }

    // powerIndex(newV, oldV) {
    //   this.playInfo = this.currentSelectPack.list[this.powerIndex]
    // }
  },
  computed: {
    playInfo() {
      return this.currentSelectPack && this.currentSelectPack.list[this.powerIndex] || {}
    },
    showVipCard() {
      return this.packId == 'vip' || this.packId == 'special'
    },
  },
  onLoad(res) {
    let that = this;
    if (res.epindex) {
      that.packId = res.epindex;
    }

    // 只在小程序执行
    // #ifdef MP
    that.deviceInfo = uni.getSystemInfoSync().platform
    // #endif

    // 活动充值页 不需要登陆，直接展示数据
    if (res.navType && res.navType === 'activity') {
      this.showUserPhoneInput = true
      this.formLabelStyle.color = this.cueTheme == 'day-theme' ? '#000' : '#fff'
      this.getVipRecharge()
    }

    // #ifdef WEB
    // 验证是否微信内置浏览器
    let ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      console.log('是微信内置浏览器')
      that.isWeixin = true;

      if (!uni.getStorageSync('openid')) {
        // 活动页进来的充值使用静默授权
        that.getCodeFun()
      }

    } else {
      that.payIndex = 2;
      that.isWeixin = false;
      console.log('不是微信内置浏览')
    }
    // #endif

  },

  onShow() {
    let that = this;
    if (!that.status && !this.showUserPhoneInput) {
      that.getuserInfo();
    }
  },

  methods: {
    phoneInputBlur() {
      // this.checkPhone()
    },
    async checkPhone() {
      let phoneReg = /^1(([378][\d])|(4[01456789])|([59][012356789])|(6[2567]))[\d]{8}$/
      let newValue = this.userInfoFormData.phone
      let length = newValue.toString().length
      this.canBuy = false
      if ((length == 11) && phoneReg.test(newValue)) {
        this.phoneFail = false
        try {
          uni.showLoading({
            title: '充值账号校验中...',
          })
          const res = await checkUserRegisterByPhone(newValue)
          setTimeout(() => {
            uni.hideLoading()
          }, 500);
          if (res.code == 200) {
            this.canBuy = true
            this.needRegister = false
          } else if (res.code == 404) {
            this.canBuy = false
            this.needRegister = true
          }
        } catch (error) {
          uni.hideLoading()
        }
      } else {
        this.phoneFail = true
      }
    },
    register() {
      this.needRegister = false
      uni.navigateTo({
        url: '/plogin/register?type=1'
      })
    },

    async getuserInfo() {
      let that = this;
      that.vipList = [];
      const userRes = await userInfo()
      that.wallet = { ...userRes.result };
      that.userInfo = { ...userRes.result };
      uni.setStorageSync("userInfo", userRes.result);
      this.getVipRecharge()
    },

    getVipRecharge() {
      let that = this;
      let jsonUrl = 'https://cdn.drawai.cn/public/recharge.json?time='
      if (this.$baseURL == "https://app.onefold.cn") {
        //测试环境
        jsonUrl = 'https://cdn.drawai.cn/public/recharge_test.json?time='
      }
      uni.request({
        url: jsonUrl + utils.getTime(),
        method: 'GET',
        success: ({ data }) => {
          const { service_status, capacity, capacity_month, capacity_season, capacity_year, recharge_list } = data
          that.jsonInfo = {
            service_status, capacity, capacity_month, capacity_season, capacity_year,
          };
          // 过滤三天会员
          if (this.wallet.formal != 0) {
            recharge_list.map((item) => {
              if (item.key == 'vip') {
                item.list.shift()
              }
            })
          }
          that.rechargeList = recharge_list
          let packItem = recharge_list.find((item) => item.key == that.packId)
          if (!packItem) {
            that.currentSelectPack = recharge_list[0]
            that.packId = that.currentSelectPack.key
          } else {
            that.currentSelectPack = packItem
          }
          // that.playInfo = that.currentSelectPack.list[0]
          // console.log(this.$baseURL, '$baseURL')

        },
        fail: (err) => { }
      });
    },

    getCode() { // 非静默授权，第一次有弹框
      let that = this;
      this.code = ''
      let appid = 'wxb4060d6d02a88364'
      that.code = that.getUrlCode().code  // 截取code
      let webSiteUrl = 'https://m.drawai.cn'
      if (this.$baseURL == "https://app.onefold.cn") {
        //测试环境
        webSiteUrl = 'https://dev.drawai.cn'
      }
      if (!that.code) { // 如果没有code，则去请求
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${webSiteUrl}/pmnie/mnie/recharge&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        if (this.showUserPhoneInput) {
          // ${encodeURIComponent(JSON.stringify(param))}
          url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${webSiteUrl}/pmnie/mnie/recharge?navType=activity&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        }
        window.location.href = url
      } else {
        // if (this.showUserPhoneInput) {
        // 调用新code换取openid接口
        mpToOpenIdOauth({ code: that.code }).then(res => {
          console.log(res, '授权后得到的数据')
          if (res.code == 200) {
            uni.setStorageSync("openid", res.result);
            // window.location.reload();
          }
        }).catch((err) => {
        })
        // } else {
        //   mpOauth({ code: that.code }).then(res => {
        //     console.log(res, '授权后得到的数据')
        //     if (res.code == 200) {
        //       uni.setStorageSync("openid", res.result.openid);
        //       window.location.reload();
        //     } else {
        //       // window.location.reload();
        //     }
        //   })

        // }
      }
    },

    // 截取url中的code方法
    getUrlCode() {
      var url = location.search
      this.winUrl = url
      var theRequest = new Object()
      if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
        }
      }
      return theRequest
    },

    addedServices() {
      uni.navigateTo({
        url: '/pmnie/mnie/addedlist'
      })
    },


    packageClick(clickItem, index) {
      this.packId = clickItem.key
      this.powerIndex = 0;
    },

    // 联系客服
    contactService() {
      utils.contactCustomer()
    },

    moveToGallery() {
      let that = this;
      let data = {
        type: that.playInfo.type,
        code: that.codeValue,
      }
      if (!data.code) {
        uni.showToast({
          title: '折扣码不能为空',
          icon: 'none',
          duration: 3000
        });
        return
      }
      discountCode(data).then(res => {
        if (res.code == 200) {
          // 金额转换
          that.discountObj = res.result;
          that.moveModalShow = false;
          that.status = true;
          that.code = '';
          uni.showToast({
            title: '折扣成功',
            icon: 'none',
            duration: 3000
          });
        }
      })
    },


    // 选择购买灵力
    powerType(index, res) {
      let that = this;
      that.powerIndex = index;
      // that.playInfo = res; //支付信息
      if (!uni.getStorageSync('openid') && that.isWeixin) {
        // 活动页进来的充值使用静默授权
        that.getCodeFun()
        return
      }
    },

    cancelPackage() {
      let that = this;
      that.status = false;
      that.codeValue = '';
      that.discountObj = {};
    },

    // 立即支付
    immediatePayment() {
      let that = this;
      if (this.showUserPhoneInput) {
        if (!this.userInfoFormData.phone || this.phoneFail) {
          return uni.showToast({
            title: '请输入正确的充值账户', icon: 'none', duration: 3500
          })
        } else if (!this.canBuy) {
          // setTimeout(() => {
          // 注册弹框弹出，用户点击取消，仍然点击立即支付时弹出提示
          if (!this.needRegister) {
            this.needRegister = true
          }
          // }, 300);
          return
        }
      }

      if (that.showVipCard) {
        that.status = true;
      }
      if (that.packId == 'point') {
        that.powerStatus = true
      }
      if (that.packId == 'attest' || that.packId == 'addition') {
        that.eqStatus = true
      }
    },

    //支付购买权益次数
    async eqPayment() {
      uni.$u.debounce(async () => {

        let that = this;
        //微信内置浏览器 必须要有openID 
        if (!uni.getStorageSync('openid') && that.isWeixin) {
          that.getCode();
          return
        }
        let data = {
          type: that.playInfo.type,
          amount: that.playInfo.date,
          method: that.payIndex == 0 ? 'wxpay_ma' : that.payIndex == 1 ? 'wxpay_h5' : 'alipay_h5', // alipay_h5 :支付宝  wxpay_ma：微信小程序 wxpay_h5:微信H5
          appid: getApp().globalData.appid || 'wxb4060d6d02a88364',
          openid: uni.getStorageSync('openid'),
          code: that.codeValue,
        }
        try {
          uni.showLoading()
          let res
          if (this.showUserPhoneInput) {
            res = await walletBuyByPhone(data, this.userInfoFormData.phone)
          } else {
            res = await walletBuy(data)
          }
          console.error('>>>>>>>>>>res', res);
          if (res.code == 200) {
            const { order_id, prepay_param } = res.result;
  
            that.powerStatus = false;
            that.eqStatus = false;
  
            // 以下微信H5支付
            // #ifdef H5
            if (that.isWeixin) { //微信内置浏览器
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                "appId": prepay_param.appId, //公众号名称，由商户传入
                "timeStamp": prepay_param.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": prepay_param.nonceStr, //随机串
                "package": prepay_param.packageValue,
                "signType": prepay_param.signType, //微信签名方式：
                "paySign": prepay_param.paySign //微信签名
              },
                function (res) {
                  console.log(res, '支付成功', !this.showUserPhoneInput)
                  that.status = false
                  if (!that.showUserPhoneInput) {
                    // 更新用户信息
                    that.getuserInfo();
                  }
                }
              )
            } else { //不是微信内置浏览器
  
              if (that.payIndex == 1) {//外置浏览器 微信h5支付
                document.location.href = res.result.prepay_param.mwebUrl
  
              }
  
              if (that.payIndex == 2) {//外置浏览器 支付宝h5支付
                document.querySelector('body').innerHTML = res.result.pay_form
                //调用submit方法
                document.forms[0].submit()
              }
  
            }
            // #endif   
            // #ifdef MP-WEIXIN
            uni.requestPayment({
              timeStamp: prepay_param.timeStamp,
              nonceStr: prepay_param.nonceStr,
              package: prepay_param.packageValue,
              signType: prepay_param.signType,
              paySign: prepay_param.paySign,
              success: (res) => {
                uni.showToast({
                  title: '支付成功', icon: 'success', duration: 3500
                })
                that.status = false
                // 更新用户信息
                if (!that.showUserPhoneInput) {
                  // 更新用户信息
                  that.getuserInfo();
                }
              },
              fail: (err) => {
                console.error('支付失败', err)
                uni.showToast({
                  title: '支付失败', icon: 'none'
                })
              }
            })
  
            // #endif   
  
            // #ifdef APP-PLUS
  
            // 微信的orderInfo是 Object, 支付宝的是 String
            let orderInfo
            if (this.payIndex == 1) {
              orderInfo = {
                appid: prepay_param.appId,  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
                noncestr: prepay_param.nonceStr, // 随机字符串
                package: prepay_param.packageValue,        // 固定值
                partnerid: prepay_param.partnerId,      // 微信支付商户号
                prepayid: prepay_param.prepayId, // 统一下单订单号 
                timestamp: prepay_param.timeStamp,        // 时间戳（单位：秒）
                sign: prepay_param.sign // 签名，这里用的 MD5 签名
              }
            }
            uni.requestPayment({
              provider: this.payIndex == 1 ? 'wxpay' : 'alipay',
              orderInfo: orderInfo,
              success: (res) => {
                uni.showToast({
                  title: '支付成功', icon: 'success', duration: 3500
                })
                that.status = false
                // 更新用户信息
                if (!that.showUserPhoneInput) {
                  // 更新用户信息
                  that.getuserInfo();
                }
              },
              fail: (err) => {
                console.error('支付失败', err)
                uni.showToast({
                  title: '支付失败', icon: 'none'
                })
              }
            })
  
            // #endif   
          }
        } catch (error) {
  
        } finally {
          uni.hideLoading()
        }
      },300)
    },


    goDetail() {
      uni.navigateTo({
        url: '/pmnie/mnie/detailed?point=' + this.wallet.score
      })
    },

    // 更多权益
    moreBenefits() {
      uni.navigateTo({
        url: '/pmnie/mnie/webview?type=6',
      });
    },

    getViptype(type) {
      let that = this;
      that.vipIndex = type;
      if (!uni.getStorageSync('openid') && that.isWeixin) {
        // 活动页进来的充值使用静默授权
        that.getCodeFun()
        return
      }
      that.discountObj = {};
      that.status = !that.status;
    },

    getCodeFun() {
      let that = this;
      // if (this.showUserPhoneInput) {
      that.getCode();
      // } else {
      //   setTimeout(() => {
      //     // 弹框授权
      //     uni.showModal({
      //       title: '温馨提示',
      //       content: '为保证支付成功，请同意授权',
      //       success: res => {
      //         if (res.confirm) {
      //           that.getCode();
      //         }
      //       }
      //     })
      //   }, 15000);
      // }

    },
    getStatus() {
      this.status = !this.status;
    },

    getModalShow() {
      this.moveModalShow = !this.moveModalShow;
      this.codeValue = '';
      this.status = !this.status;
    },




    // 选择支付方式
    playType(e) {
      this.payIndex = e;
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

<style
  scoped
  lang="less"
>
.page {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  padding-bottom: 140rpx;
  background-color: var(--bg-color-page);

  .active {
    border: 2px solid #61ffff !important;
    background: rgba(0, 194, 187, 0.08) !important;
  }

  .tabitem {
    display: flex;


    .tabitem-item {
      width: 170rpx;
      height: 68rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(244, 244, 244, 0.48);
      line-height: 68rpx;
      text-align: center;

      &.tabitem-active {
        background: #F4F4F4;
        border-radius: 44rpx;
        color: #121212;
      }
    }

    .tabwhite-item {
      width: 170rpx;
      height: 68rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(18, 18, 18, 0.52);
      line-height: 68rpx;
      text-align: center;

      &.tabitem-active {
        background: #121212;
        border-radius: 44rpx;
        color: #F4F4F4;
      }
    }
  }

  .user {
    width: auto;
    height: 274rpx;
    background: #FFFFFF;
    border-radius: 32rpx;
    margin: 32rpx;
    padding: 40rpx 30rpx;
  }

  .user .user-name {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 10rpx;
    color: #121212;
    display: flex;
  }

  .user .user-name .ident image {
    width: 146rpx;
    height: 52rpx;
    position: relative;
    top: 0rpx;
    margin-left: 20rpx;
  }

  .user .user-time {
    font-size: 22rpx;
    font-weight: 400;
    color: rgba(18, 18, 18, 0.52);
    line-height: 80rpx;
    display: flex;
    justify-content: space-between;
  }

  .user .user-time .added {
    font-size: 28rpx;
  }

  .user .user-time .added text {
    color: #1DCCAF;
    margin-left: 20rpx;
  }

  .user .user-item {
    display: flex;
    justify-content: space-between;
    border-top: 2rpx solid #f6f6f6;
    line-height: 80rpx;
    font-size: 26rpx;
    color: rgba(18, 18, 18, 0.78);

  }

  .tips {
    display: flex;
    margin-bottom: 32rpx;
  }

  .tips .iconimg {
    width: 64rpx;
    height: 64rpx;
    margin-right: 18rpx;
  }

  .tips .tips-item .name {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #121212;
  }

  .tips .tips-item .texo {
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(18, 18, 18, 0.52);
    line-height: 40rpx;
  }

  .card {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

  }

  .card-item {
    width: 218rpx;
    height: 284rpx;
    background: rgba(244, 244, 244, 0.16);
    border-radius: 32rpx 96rpx 32rpx 32rpx;
    opacity: 1;
    border: 4rpx solid rgba(18, 18, 18, 0.12);
    padding: 30rpx;
    position: relative;
    margin-bottom: 20rpx;
  }

  .card-item .name {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #121212;
  }

  .card-item .prefer {
    // padding: 6rpx 8rpx;
    // margin-top: 30rpx;
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    bottom: 90rpx;
    // width: 120rpx;
    height: 44rpx;
    border-radius: 16rpx;
    color: white;
    font-size: 24rpx;
    text-align: center;
    line-height: 40rpx;
    border: 2rpx solid rgba(244, 244, 244, 0.48);
  }

  .card-item .orargy {
    font-size: 24rpx;
    text-decoration: line-through;
    color: rgba(18, 18, 18, 0.52);
  }

  .card-item .price_white {
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    bottom: 30rpx;
    font-weight: 500;
    color: #121212;
    font-size: 44rpx;
  }

  .card-item .price_hei {
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    bottom: 30rpx;
    font-weight: 500;
    font-size: 44rpx;
    color: #1DCCAF !important;
  }

  .card-item .price_white text {
    font-size: 22rpx;
  }

  .price_hei text {
    font-size: 22rpx;
  }

  .card-active {
    border: 4rpx solid #61ffff;
    background: rgba(0, 194, 187, 0.08);
    color: #1ED6B7;
  }

  .handle {
    margin: 50rpx 0 30rpx;
    padding-top: 20rpx;
  }

  .equityTab {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }

  .equityTab .equityTab-left {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #121212;
  }

  .equityTab .equityTab-right {
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(18, 18, 18, 0.52);
  }

  .equityTab .equityTab-right image {
    width: 32rpx;
    height: 32rpx;
    transform: rotate(-90deg);
    position: relative;
    top: 8rpx;
  }

  .refooter {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    background: white;
    height: 140rpx;
    line-height: 140rpx;
    padding: 0 30rpx;
    box-shadow: 0rpx -4rpx 24rpx 0rpx rgba(0, 0, 0, 0.08);
  }

  .refooter-numll {
    position: relative;
    font-size: 36rpx;
    color: #121212;
    font-weight: 500;
  }

  .refooter .actual {
    position: absolute;
    top: -34rpx;
    left: 10rpx;
    font-size: 20rpx;
    color: rgba(18, 18, 18, 0.52);
  }

  .refooter .first {
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #F04455;
    line-height: 40rpx;
    margin-left: 10rpx;
  }

  .refooter-play {
    width: 351rpx;
    height: 84rpx;
    background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
    border-radius: 70rpx;
    text-align: center;
    line-height: 84rpx;
    margin-top: 20rpx;
  }


  .speak {
    width: 100%;
    min-height: 500rpx;
    padding-bottom: 200rpx;
  }

  .speak .speak-title {
    margin-bottom: 40rpx;
    position: relative;
  }

  .speak .speak-title image {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    top: 28rpx;
    right: 0rpx;
  }

  .pricek {
    font-size: 96rpx;
  }

  .pricek text {
    font-size: 30rpx;
    margin-right: 10rpx;
  }

  .paytype {
    background: rgba(18, 18, 18, 0.04);
    border-radius: 32rpx;
    margin-top: 80rpx;
  }

  .paytype-item {
    height: 144rpx;
    line-height: 144rpx;
    position: relative;
  }

  .paytype-border {
    height: 1rpx;
    background: #cccccc;
    margin-left: 100rpx;
  }

  .paytype-item .icon {
    width: 50rpx;
    height: 50rpx;
    position: relative;
    top: 10rpx;
    margin: 0 20rpx 0 40rpx;
  }

  .paytype-item .play {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    top: 50rpx;
    right: 30rpx;
  }

  .speak-footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 20rpx;
    right: 20rpx;
    bottom: 40px;
  }

  .speak-footer .item {
    line-height: 80rpx;
    text-align: center;
    border-radius: 70rpx;
    font-size: 28rpx;
  }

  .speak-footer .left {
    width: 35%;
    background: rgba(18, 18, 18, 0);
    border-radius: 43rpx;
    color: #000;
    border: 1px solid #f5f5f5;
  }

  .speak-footer .right {
    width: 60%;
    background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
    border-radius: 43rpx;
  }

  .group {
    padding: 0 12rpx 32rpx 32rpx;

    .group_2 {
      padding-left: 44rpx;
      padding-right: 20rpx;

      .space-x-4 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-left: 8rpx;
        }

        .image {
          width: 34rpx;
          height: 22rpx;
        }

        .image_2 {
          width: 30rpx;
          height: 22rpx;
        }

        .image_3 {
          width: 48rpx;
          height: 23rpx;
        }
      }
    }

    .group_3 {
      padding: 16rpx 0;

      .image_4 {
        width: 18rpx;
        height: 34rpx;
      }

      .pos_3 {
        position: absolute;
        left: 2rpx;
        top: 50%;
        transform: translateY(-50%);
      }

      .text {
        color: #ffffff;
        font-size: 36rpx;
        font-family: TsangerYuYangT-W05;
        line-height: 33rpx;
      }

      .section_2 {
        padding: 12rpx 24rpx;
        background-color: #ffffff99;
        border-radius: 50rpx;
        border: solid 1rpx #97979733;

        .image-wrapper {
          width: 38rpx;

          .image_6 {
            width: 38rpx;
            height: 14rpx;
          }

          .image_5 {
            width: 34rpx;
            height: 34rpx;
          }
        }

        .section_3 {
          background-color: #00000033;
          width: 1rpx;
          height: 37rpx;
        }
      }

      .space-x-12 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-left: 24rpx;
        }
      }

      .pos_2 {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .section_4 {
      margin-right: 20rpx;
      padding: 44rpx 24rpx 36rpx 48rpx;
      background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 99.3%);
      border-radius: 32rpx;

      .space-y-14 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 28rpx;
        }

        .text_2 {
          color: #141416;
        }

        .font_3 {
          font-size: 26rpx;
          font-weight: 500;
          font-family: PingFangSC-Regular;
          color: #141416;
        }

        .text_3 {
          line-height: 20rpx;
        }

        .text_5 {
          line-height: 22rpx;
        }
      }

      .text-wrapper {
        padding: 16rpx 0;
        background-color: #ffffff99;
        border-radius: 36rpx;
        width: 128rpx;
        height: 56rpx;

        .text_4 {
          color: #141416;
          font-size: 24rpx;
          font-family: TsangerYuYangT-W02;
          line-height: 22rpx;
        }
      }
    }
  }

  .space-y-22 {

    &>view:not(:first-child),
    &>text:not(:first-child),
    &>image:not(:first-child) {
      margin-top: 44rpx;
    }
  }

  .section_5 {
    padding: 32rpx 32rpx 44rpx;
    background-position: 0% 0%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-radius: 48rpx 48rpx 0 0;
    background: rgba(244, 244, 244, 0.08);
    box-shadow: inset 0rpx 2rpx 0rpx 0rpx rgba(244, 244, 244, 0.04);

    .space-y-12 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 24rpx;
      }

      .section_6 {
        padding: 48rpx 32rpx;
        background-color: #ffffff12;
        border-radius: 32rpx;
        border: 4rpx solid #f6f6f6;

        .font_5 {
          font-size: 32rpx;
          font-family: Montserrat;
          line-height: 31rpx;
          // font-weight: 600;
          color: #ffffff;
          position: relative;

          .font_active {
            margin-left: 10rpx;
            font-size: 24rpx;
            padding: 4rpx 10rpx;
            border-radius: 20rpx;
            color: white;
            border-radius: 8px 8px 8px 0px;
            border: 1px solid rgba(255, 255, 255, 0.66);
          }

          .font_grayb {
            margin-left: 10rpx;
            font-size: 24rpx;
            padding: 4rpx 10rpx;
            border-radius: 20rpx;
            color: white;
            border-radius: 8px 8px 8px 0px;
            border: 1px solid rgba(255, 255, 255, 0.66);
          }
        }

        .group_5 {
          line-height: 35rpx;
          height: 35rpx;

          .font_6 {
            font-size: 24rpx;
            font-family: Montserrat;
            line-height: 17rpx;
            font-weight: 700;
            color: #1affe8;
          }
        }

        .view {
          margin-right: 4rpx;
        }

        .font_7 {
          font-size: 24rpx;
          font-family: Montserrat;
          line-height: 23rpx;
          color: #ffffff;
        }

        .text_8 {
          opacity: 0.8;
        }

        .group_7 {
          padding: 0 4rpx;

          .text_16 {
            line-height: 18rpx;
            text-decoration: line-through;
          }
        }
      }

      .space-y-10 {

        &>view:not(:first-child),
        &>text:not(:first-child),
        &>image:not(:first-child) {
          margin-top: 20rpx;
        }
      }
    }

    .space-y-20 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 40rpx;
      }

      .button_3 {
        padding: 32rpx 0;
        background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
        border-radius: 48rpx;
        box-shadow: 0px 16rpx 32rpx #00dbc533;

        .text_17 {
          color: #000000;
          font-size: 36rpx;
          font-family: PingFangSC;
          line-height: 33rpx;
        }
      }

      .group_8 {
        line-height: 28rpx;

        .text_18 {
          line-height: 34rpx;
        }

        .font_10 {
          font-size: 28rpx;
          font-family: PingFangSC-Regular;
          line-height: 58rpx;
          color: #ffffff;
        }
      }
    }

    .font_4 {
      font-size: 28rpx;
      font-family: PingFangSC-Medium;
      color: #ffffff;
    }
  }

  .space-y-24 {

    &>view:not(:first-child),
    &>text:not(:first-child),
    &>image:not(:first-child) {
      margin-top: 48rpx;
    }

    .text-wrapper_2 {
      margin-top: 10rpx;
      padding: 26rpx 0 26rpx 10px;
      background-color: var(--bg-color-2);
      border-radius: 24rpx;
      width: 536rpx;
      color: white;

      .text_10 {
        margin-left: 32rpx;
        line-height: 26rpx;
      }
    }

    .group_6 {
      // line-height: 34rpx;
      text-align: center;
      padding-bottom: 40rpx;

      .text_10 {
        line-height: 34rpx;
      }

      .text_11 {
        line-height: 34rpx;
      }

      .text_12 {
        line-height: 34rpx;
      }

      .text_13 {
        color: #00ebd3;
        line-height: 34rpx;
      }
    }

    .space-x-16 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-left: 32rpx;
      }

      .button {
        padding: 32rpx 0;
        background-color: #ffffff14;
        border-radius: 48rpx;
        width: 252rpx;
        height: 96rpx;
        border: solid 2rpx #ffffff66;

        .text_14 {
          line-height: 26rpx;
        }
      }

      .button_2 {
        padding: 32rpx 0;
        background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
        border-radius: 48rpx;
        width: 252rpx;
        height: 96rpx;

        .text_15 {
          color: #141416;
          line-height: 30rpx;
        }
      }

      .text-wrapper_3 {
        padding: 32rpx 0;
        background-color: #ffffff14;
        border-radius: 48rpx;
        width: 252rpx;
        height: 96rpx;
        border: solid 2rpx #ffffff66;

        .text_11 {
          color: #ffffff;
          line-height: 26rpx;
        }
      }

      .text-wrapper_4 {
        padding: 32rpx 0;
        background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
        border-radius: 48rpx;
        width: 252rpx;
        height: 96rpx;

        .text_12 {
          color: #141416;
          line-height: 30rpx;
        }
      }
    }

    .font_9 {
      font-size: 28rpx;
      font-family: PingFangSC-Regular;
      line-height: 35rpx;
      color: #ffffff;
    }
  }

  .font_2 {
    font-size: 48rpx;
    font-family: Montserrat;
    line-height: 35rpx;
    font-weight: 700;
    color: #1affe8;
  }

  .font_1 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    line-height: 17rpx;
    color: #ffffff;
  }

  .section {

    .section_7 {
      padding: 40rpx 32rpx 32rpx;
      background-color: #323234;
      border-radius: 28rpx;

      .font_8 {
        font-size: 32rpx;
        font-family: PingFangSC-Medium;
        line-height: 31rpx;
      }

      .text_9 {
        color: #ffffff;
        line-height: 30rpx;
      }
    }

    .space-y-28 {

      &>view:not(:first-child),
      &>text:not(:first-child),
      &>image:not(:first-child) {
        margin-top: 56rpx;
      }
    }
  }
}

.form-box {
  padding: 32rpx;

  .input-box {
    width: 100%;
    margin-top: 20rpx;
    background: #262628;
    border-radius: 55rpx 55rpx 55rpx 55rpx;
    height: 68rpx;
    padding: 0 32rpx;
    color: #fff;
  }

  .placeholder_class {
    background: #262628;
    color: #fff;
  }
}

.content-box {
  color: #959595;
  font-size: 28rpx;
}

/deep/ .u-popup {
  z-index: 997 !important;
}

/deep/ .u-transition.u-fade-enter-to.u-fade-enter-active {
  z-index: 997 !important;
}
</style>