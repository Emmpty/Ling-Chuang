<template>
  <view :class="cueTheme">
    <view class="flex-col flex-auto group_2">
      <view class="flex-col group_3">

        <view class="flex-row items-center navtab">
          <view
            class="flex-col justify-start items-center relative group_4"
            v-for="(item, index) in navList"
            :key="index"
            @click="navbarClick(index)"
          >
            <text
              :class="navIndex == index ? 'font_1 text_3' : 'font_1'"
              :style="{ 'color': cueTheme == 'day-theme' ? '#2E2E33' : '#fff' }"
            >{{ item }}</text>
            <image
              class="image_6 pos"
              v-if="navIndex == index"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846375733230286.png"
            />
            <view
              class="tipss"
              v-if="navIndex != 1 && index == 1"
            >推荐</view>
            <view
              class="tipss-new"
              v-if="navIndex != 0 && index == 0"
            >最新</view>
          </view>
        </view>

        <view class="flex-row justify-between items-center group_5">
          <text
            class="text_5"
            :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '#fff' }"
          >绘画描述</text>
        </view>

        <view class="flex-col justify-start items-start text-wrapper_2">
          <textarea
            v-if="ai_mode"
            v-model="keyword2"
            cols="30"
            rows="10"
            placeholder="请输入您需要的画面关键词，支持中英文输入，没有灵感也可以试试下方的AI推荐词哦~"
            maxlength="50000"
            disabled="disabled"
          ></textarea>
          <textarea
            v-else
            class="text_8"
            v-model="keyword2"
            cols="30"
            rows="10"
            placeholder="请输入您需要的画面关键词，支持中英文输入，没有灵感也可以试试下方的AI推荐词哦~"
            :auto-height='true'
            @input="inputText"
            maxlength="50000"
          ></textarea>
        </view>

        <view class="flex-row justify-between group_6">
          <view
            class="flex-row items-center section_3 section_5 space-x-4"
            @click="switchAiMode(1)"
          >
            <image
              class="shrink-0 image_7"
              src="/static/img/home/magic.png"
            />
            <text class="">AI推荐词</text>
          </view>

          <view
            class="flex-row items-center section_4 space-x-4"
            v-if="!ai_mode"
            @click="exitAiMode"
            :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '' }"
          >
            <image
              class="shrink-0 image_7"
              :src="cueTheme == 'day-theme' ? '/static/img/gallery/delete.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846393506009806.png'"
            />
            <text
              class="font_2 text_9"
              :style="{ 'color': cueTheme == 'day-theme' ? '#666666' : '' }"
            >清空</text>
          </view>
          <view
            class=""
            v-if="ai_mode"
          ></view>
          <view
            class="flex-row items-center section_5 space-x-4"
            :style="{ 'background': cueTheme == 'day-theme' ? '#F5F5F5' : '' }"
            v-if="ai_mode"
            @click="exitAiMode()"
          >
            <text class="font_2 text_10">退出AI模式</text>
          </view>
        </view>

      </view>

      <image
        class="vipimg"
        mode="widthFix"
        @click="dealwithVip()"
        v-if="navIndex == 1 && passIndex == 0"
        src="https://image.drawai.cn/logo/vip.png"
      />
      <!-- 灵创画板 -->
      <view
        class="flex-col section_6"
        v-if="navIndex == 2"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >

        <view class="setup leftname">
          <view
            class="setup_name"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >模型选择</view>
        </view>
        <view class="flex-col space-y-26">
          <view class="flex-col">
            <view class="flex-tab">
              <view
                :class="(index == typesIndex) ? 'flex-tab-item tabactive' : 'flex-tab-item'"
                v-for="(item, index) in sketchpadInfo.types"
                :key="index"
                @click="typesClick(index)"
                :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
              >
                {{ item.name }}
              </view>
            </view>
            <scroll-view scroll-y="true">
              <view class="fusionb">
                <block
                  v-for="(item, index) in sketchpadInfo.models"
                  :key="index"
                >
                  <!-- <block
                    v-for="(items, idx) in item.types"
                    :key="idx"
                  > -->
                  <view
                    v-if="item.types && item.types.includes(sketchpadInfo.types[typesIndex].name)"
                    :class="modeIndexLc == index ? 'fusionb-item fusionb-active' : 'fusionb-item'"
                    @click="modeClickLC(index, item.model)"
                  >
                    <image
                      class="icon"
                      :src="item.image"
                    ></image>
                    <view class="name">{{ item.modelName }}</view>
                  </view>
                  <!-- </block> -->
                </block>
              </view>
            </scroll-view>
          </view>
        </view>
        <block>

          <view class="setup">
            <view
              class="setup_name leftname"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >尺寸比例
            </view>
          </view>

          <view class="scales">
            <block
              v-for="(item, index) in sketchpadInfo.models[modeIndexLc].aspect"
              :key="index"
            >
              <view
                class="scales-item u-flex-col u-col-center u-row-between"
                :class="{ 'scales-active': index == sizesIndex }"
                @click="modelsSize(index, item.param)"
              >
                <view
                  class="ratio"
                  v-if="item.name == '1:1'"
                  style="width:48rpx;height:48rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '2:3'"
                  style="width:36rpx;height:56rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '3:2'"
                  style="width:56rpx;height:36rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '3:4'"
                  style="width:46rpx;height:56rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '4:3'"
                  style="width:56rpx;height:46rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '9:16'"
                  style="width:32rpx;height:58rpx;"
                ></view>
                <view
                  class="ratio"
                  v-if="item.name == '16:9'"
                  style="width:58rpx;height:32rpx;"
                ></view>
                <view
                  class="name"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#121212' : '' }"
                > {{ item.name }}</view>
              </view>
            </block>
          </view>

          <!-- <view class="space-x-17">
            <block v-for="(item, index) in sketchpadInfo.models[modeIndexLc].aspect" :key="index">
              <view :class="index == sizesIndex ? ' quality active' : 'quality'" @click="modelsSize(index, item.param)"
                :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }">
                {{ item.name }}</view>
            </block>
          </view> -->
        </block>

        <block v-if="!formData.style.enable_hr">
          <!-- 灵创画板 -->
          <view class="setup leftname">
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >参考图</view>
          </view>
          <view
            class="picture"
            v-if="tempFilePaths.length > 0"
          >
            <image
              class="close"
              :src="cueTheme == 'day-theme' ? '/static/img/clip/icon2.png' : '/static/img/clip/icon2.png'"
              @click="deletePicture"
            />
            <image
              :src="tempFilePaths[0]"
              @error="deletePicture"
              style="width:100%;height:100%"
            />
          </view>
          <view
            class="picture"
            v-else
            :style="{ 'border': cueTheme == 'day-theme' ? '1rpx dashed #666666;' : '' }"
            @click="addPicture"
          >
            <image
              class="take"
              :src="cueTheme == 'day-theme' ? '/static/img/home/take_active.png' : '/static/img/home/take.png'"
            />
            <view
              class="name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >添加图片</view>
          </view>
          <view
            v-if="tempFilePaths.length > 0"
            class="slider-tips"
          >参考图权重（权重越大，相似度越明显）</view>
          <view
            class="slider-top"
            v-if="tempFilePaths.length > 0"
          >
            <view class="slider u-flex u-col-bottom">
              <u-slider
                active-color="#00ebd3"
                v-model="formData.style.denoising"
                min="1"
                max="100"
              ></u-slider>
            </view>
            <input
              value=""
              v-model="formData.style.denoising"
              type="text"
              :disabled="true"
              :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            />
          </view>
        </block>

        <view class="setup">
          <view
            class="setup_name"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >高级设置</view>
          <view class="setup_switch">
            <u-switch
              active-color="#00ebd3"
              v-model="setupStatus"
            ></u-switch>
          </view>
        </view>

        <block v-if="setupStatus">
          <view class="slider-top">
            <view class="slider u-flex u-flex-1 u-col-bottom">
              <view
                class="slider-name"
                :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
              >关键词相关性</view>
              <view  class="u-flex-1">
                <u-slider
                 
                  active-color="#00ebd3"
                  v-model="formData.style.cfg_scale"
                  step="0.50"
                  min="1"
                  max="30"
                ></u-slider>
              </view>
              <input
                value=""
                v-model="formData.style.cfg_scale"
                type="text"
                :disabled="true"
                :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
              />
            </view>
          </view>

          <view class="setup leftname">
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >采样方式</view>
          </view>
          <picker
            class="setup_picker"
            @change="bindPickerChange"
            :value="samplesIndex"
            :range="sketchpadInfo.models[modeIndexLc].samples"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
          >
            <view class="picker">
              {{ formData.style.sampler }}
              <image
                class="active"
                :src="cueTheme == 'day-theme' ? '/static/img/gallery/arrow.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839806547229511.png'"
              />
            </view>
          </picker>

          <view
            class="setup leftname"
            style="width:100%"
          >
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >
              融合模型 （{{ fusionSzie }}/3）
            </view>
            <view
              class="resetting"
              @click="fusionResetting()"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >
              <image
                v-if="cueTheme == 'day-theme'"
                src="/static/img/home/loop-right.png"
              ></image>
              <image
                v-else
                src="/static/img/home/loop-line.png"
              ></image>
              重置
            </view>
          </view>
          <view class="flex-col space-y-26">
            <view class="flex-col">
              <!-- 模型分类 -->
              <view class="flex-tab">
                <view
                  :class="index == fusionIndex ? 'flex-tab-item tabactive' : 'flex-tab-item'"
                  v-for="(item, index) in sketchpadInfo.fusionTypes"
                  :key="index"
                  @click="fusionType(index)"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
                >
                  {{ item.name }}
                  <view
                    class="drop"
                    v-if="item.status"
                  ></view>
                </view>
              </view>
              <!-- 模型选择 -->
              <scroll-view scroll-y="true">
                <view class="fusionb">
                  <block
                    v-for="(item, index) in sketchpadInfo.fusions"
                    :key="index"
                  >
                    <view
                      v-if="item.types && item.types.includes(sketchpadInfo.fusionTypes[fusionIndex].name)"
                      :class="item.status ? 'fusionb-item fusionb-active' : 'fusionb-item'"
                    >
                      <image
                        class="icon"
                        :src="item.image"
                        @click="fusionModel(index)"
                      ></image>
                      <view :class="item.status ? 'name top' : 'name'">{{ item.name }}</view>
                      <view
                        class="optice"
                        v-if="item.status"
                      >
                        <view
                          class="optice-item"
                          @click="fusionOptice(1, index, item.weight)"
                        >-</view>
                        <view class="optice-item active">{{ item.weight }}</view>
                        <view
                          class="optice-item"
                          @click="fusionOptice(2, index, item.weight)"
                        >+</view>
                      </view>
                    </view>
                  </block>
                </view>
              </scroll-view>
            </view>
          </view>

          <view class="setup">
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >面部修复</view>
            <view class="setup_switch">
              <u-switch
                active-color="#00ebd3"
                v-model="formData.style.restore_faces"
                @change="faceStatus(1)"
              ></u-switch>
            </view>
          </view>
          <view class="setup">
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >全景面部修复</view>
            <view class="setup_switch">
              <u-switch
                active-color="#00ebd3"
                v-model="formData.style.face_editor"
                @change="faceStatus(2)"
              ></u-switch>
            </view>
          </view>
          <view
            class="setup_tips"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >
            面部修复只适用于真人模型，其他模型请勿开启！</view>

          <view class="setup leftname">
            <view
              class="setup_name"
              :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
            >负面词</view>
          </view>
          <textarea
            class="textarea"
            maxlength="1200"
            :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#000' : '#fff' }"
            v-model="formData.style.negative"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="请输入不想出现在画面中的内容，支持中英文输入"
          ></textarea>
        </block>

      </view>
      <!-- XL、MJ 画板 -->
      <view
        class="flex-col section_6"
        v-if="navIndex != 2"
        :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '' }"
      >

        <view class="flex-col group_7 space-y-26">
          <view class="flex-col">
            <view
              class="font_3 text_13"
              @click="functClick(1)"
            >
              <view>模型选择</view>
            </view>
            <scroll-view
              scroll-x="true"
              v-if="statusSkill1"
            >
              <view class="scroll">
                <view
                  id="demo1"
                  class="scroll-item"
                  :style="{ 'width': 96 * modeList.length + 'px' }"
                >
                  <view
                    :class="modeIndex == index ? 'scroll-item-active' : 'scroll-item-list'"
                    v-for="(items, index) in modeList"
                    :key="index"
                    @click="modeClickMj(index, items.model)"
                  >
                    <image
                      class="icon"
                      :src="items.modelImage"
                    ></image>
                    <view class="name">{{ items.modelName }}</view>
                    <view
                      class="identifying"
                      style="background:#F04455;"
                      v-if="index == 0"
                    >推荐</view>
                    <view
                      class="identifying"
                      v-if="navIndex == 2 && index == 1"
                    >动漫</view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="flex-col">
            <view
              class="font_3 text_13"
              @click="functClick(4)"
            >
              <view>尺寸比例</view>
            </view>
            <!-- 尺寸比例 -->
            <view class="scales">
              <block
                v-for="(item, index) in modeList[modeIndex].algorithm[algorithmIndex == -1 ? 0 : algorithmIndex].aspect"
                :key="index"
              >
                <view
                  class="scales-item u-flex-col u-col-center u-row-between"
                  :class="{ 'scales-active': index == sizeIndex }"
                  @click="sizeMj(index)"
                >
                  <view
                    class="ratio"
                    v-if="item.name == '1:1'"
                    style="width:48rpx;height:48rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '2:3'"
                    style="width:36rpx;height:56rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '3:2'"
                    style="width:56rpx;height:36rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '3:4'"
                    style="width:46rpx;height:56rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '4:3'"
                    style="width:56rpx;height:46rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '9:16'"
                    style="width:32rpx;height:58rpx;"
                  ></view>
                  <view
                    class="ratio"
                    v-if="item.name == '16:9'"
                    style="width:58rpx;height:32rpx;"
                  ></view>
                  <view class="name"> {{ item.name }}
                  </view>
                </view>

              </block>
              <!-- 自定义尺寸 -->
              <view
                v-if="showCustomSize"
                class="scales-custom u-flex-col u-col-center u-row-between"
                :class="{ 'scales-active': -2 == sizeIndex }"
                @click="sizeMj(-2)"
              >
                <view class="custon-text">自定义</view>
                <view class="name"> {{ customSize.name }}
                </view>
              </view>
            </view>
            <!-- <view class="flex-row self-start equal-division">
              <view class="flex-col items-center equal-division-item"
                v-for="(item, index) in modeList[modeIndex].algorithm[algorithmIndex == -1 ? 0 : algorithmIndex].aspect"
                :key="index" @click="sizeMj(index)">
                <view :class="sizeIndex == index ? 'text_14' : 'font_5'"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '' }">{{ item.name }}</view>
              </view>
            </view> -->
          </view>
          <view class="flex-col">
            <view
              class="font_3 text_13"
              @click="functClick(3)"
            >
              <view>算法（模型版本）</view>
            </view>
            <view class="flex-row self-start equal-division">
              <view
                class="flex-col items-center equal-division-item"
                v-for="(item, index) in modeList[modeIndex].algorithm"
                :key="index"
                @click="algorithmMj(index)"
              >
                <view
                  :class="algorithmIndex == index ? 'text_14' : 'font_5'"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '' }"
                >{{ item.name }}</view>
              </view>
            </view>
          </view>

          <view
            class="flex-col"
            v-if="showArtStyle"
          >
            <view
              class="font_3 text_13"
              @click="functClick(2)"
            >
              <view>艺术风格</view>
              <image
                :class="statusSkill2 ? 'active' : 'icon'"
                :src="cueTheme == 'day-theme' ? '/static/img/gallery/arrow.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839806547229511.png'"
              />
            </view>
            <scroll-view
              scroll-x="true"
              v-if="statusSkill2"
            >
              <view class="scroll">
                <block
                  v-for="(item, idx) in modeList[modeIndex].style"
                  :key="idx"
                >
                  <view
                    id="demo1"
                    class="scroll-item"
                    :style="{ 'width': 110 * item.length + 'px' }"
                  >
                    <view
                      :class="items.status ? 'scroll-item-active' : 'scroll-item-list'"
                      v-for="(items, index) in item"
                      :key="index"
                      @click="styleClick(idx, index)"
                    >
                      <image
                        class="icon"
                        :src="items.image"
                      ></image>
                      <view class="name">{{ items.name }}</view>
                    </view>
                  </view>
                </block>
              </view>
            </scroll-view>
          </view>

          <view
            class="flex-col"
            v-if="modeList[modeIndex].artist && navIndex == 1"
          >
            <view
              class="font_3 text_13"
              @click="functClick(5)"
            >
              <view>艺术家</view>
              <image
                :class="statusSkill5 ? 'active' : 'icon'"
                :src="cueTheme == 'day-theme' ? '/static/img/gallery/arrow.png' : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/638efb435a7e3f03104e3133/63c3ea5cc86a89001105434b/16737839806547229511.png'"
              />
            </view>
            <scroll-view
              scroll-x="true"
              v-if="modeList[modeIndex].artist"
            >
              <view
                class="scroll"
                v-if="statusSkill5"
              >
                <block
                  v-for="(item, idx) in modeList[modeIndex].artist"
                  :key="idx"
                >
                  <view
                    id="demo1"
                    class="scroll-item"
                    :style="{ 'width': 110 * modeList[modeIndex].artist[idx].length + 'px' }"
                  >
                    <view
                      :class="items.status ? 'scroll-item-active' : 'scroll-item-list'"
                      v-for="(items, index) in item"
                      :key="index"
                      @click="artistClick(idx, index)"
                    >
                      <image
                        class="icon"
                        :src="items.image"
                      ></image>
                      <view class="name">{{ items.name }} </view>
                    </view>
                  </view>
                </block>
              </view>
            </scroll-view>
          </view>
          <!-- MJ、XL画板 -->
          <view class="flex-col">
            <text class="self-start font_3 text_13">参考图</text>
            <view class="flex-row self-start equal-division">
              <view
                class="picture"
                v-if="tempFilePaths.length > 0"
              >
                <image
                  class="close"
                  :src="cueTheme == 'day-theme' ? '/static/img/clip/icon2.png' : '/static/img/clip/icon2.png'"
                  @click="deletePicture"
                />
                <image
                  :src="tempFilePaths[0]"
                  @error="deletePicture"
                  style="width:100%;height:100%"
                />
              </view>
              <view
                class="picture"
                @click="addPicture"
                v-else
                :style="{ 'border': cueTheme == 'day-theme' ? '1rpx dashed #666666;' : '' }"
              >
                <image
                  class="take"
                  :src="cueTheme == 'day-theme' ? '/static/img/home/take_active.png' : '/static/img/home/take.png'"
                />
                <view
                  class="name"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
                >添加图片</view>
              </view>
            </view>
          </view>
          <template v-if="tempFilePaths.length > 0">
            <view
              class="flex-col"
              v-if="modeList[modeIndex].model > 10 && !(20 <= modeList[modeIndex].model && modeList[modeIndex].model <= 22)"
            >
              <text class="self-start font_3 text_13">引导力度</text>
              <view
                class="flex-row self-start equal-division"
                style="width:100%;"
              >
                <u-slider
                  v-model="formData.style.denoising"
                  activeColor="#1affe8"
                  inactiveColor="#c0c4cc"
                  style="width:100%"
                />
                <view :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }">引导力度值：
                  {{ formData.style.denoising || 0 }}
                </view>
              </view>
            </view>
            <view
              v-else
              style="margin-top: 0;"
            >
              <view class="slider-tips">参考图权重（权重越大，相似度越明显）</view>
              <view class="slider-top">
                <view class="slider u-flex u-col-bottom">
                  <u-slider
                    active-color="#00ebd3"
                    v-model="formData.style.iw"
                    min="0"
                    max="10"
                  ></u-slider>
                </view>
                <input
                  v-model="formData.style.iw"
                  type="text"
                  :disabled="true"
                  :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
                />
              </view>
            </view>
          </template>

          <view
            v-if="navIndex == 1"
            class="flex-col "
            style="margin-top:44rpx;"
          >
            <text
              class="self-start font_3 text_13"
              :class="{ 'disabled-rule-image': !isV6 }"
            >角色参考图（限v6/niji6算法）</text>
            <view class="flex-row self-start equal-division">
              <view
                class="picture"
                v-if="tempFilePaths_mj.length > 0 && isV6"
              >
                <image
                  class="close"
                  :src="cueTheme == 'day-theme' ? '/static/img/clip/icon2.png' : '/static/img/clip/icon2.png'"
                  @click="deleteMJPicture()"
                />
                <image
                  :src="tempFilePaths_mj[0]"
                  @error="deleteMJPicture()"
                  style="width:100%;height:100%"
                />
              </view>
              <view
                class="picture"
                @click="addMJPicture()"
                v-else
                :style="{ 'border': cueTheme == 'day-theme' ? '1rpx dashed #666666;' : '' }"
              >
                <image
                  class="take"
                  :src="cueTheme == 'day-theme' ? '/static/img/home/take_active.png' : '/static/img/home/take.png'"
                />
                <view
                  class="name"
                  :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
                >添加图片</view>
              </view>
            </view>
          </view>
          <view
            v-if="tempFilePaths_mj.length > 0"
            style="margin-top: 0;"
          >
            <view class="slider-tips">参考图权重（权重越大，相似度越明显）</view>
            <view class="slider-top">
              <view class="slider u-flex=1">
                <u-slider
                  active-color="#00ebd3"
                  v-model="formData.style.cw"
                  min="0"
                  max="10"
                ></u-slider>
              </view>
              <input
                v-model="formData.style.cw"
                type="text"
                :disabled="true"
                :style="{ 'background': cueTheme == 'day-theme' ? '#f5f5f5' : '', 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
              />
            </view>
            <view class="slider-tips">
              功能说明：该功能为仅参考画面中角色一致性，如将数值为0仅参考脸部，数值越大角色参考项越多 <span class="slider-tips-warn">【请勿上传风景类图像】</span></view>
          </view>
        </view>

      </view>
      <view
        v-if="navIndex !== 1"
        class="flex-col justify-start items-center button"
        @click="fabClick"
      >
        <text
          class="text_15"
          v-if="passIndex == 0"
        >开始生成({{ navIndex == 2 ? 2 : 5 }}灵力)</text>
        <text
          class="text_15"
          v-else
        >开始生成</text>
      </view>
      <template v-else>
        <!-- MJ画板会员免费、非会员10灵力 -->
        <!-- <view
          class="create"
          v-if="!fastStatus"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view
            class="create-make"
            @click="fabClick"
          >
            <image src="/static/img/home/create-left.png"></image>
            <view class="name">{{ fastStatus ? "快速生成" : "开始生成" }} <text v-if="passIndex == 0">(10灵力)</text></view>
          </view>
          <view
            class="create-fast"
            @click="fastStatus = !fastStatus"
          >
            <image
              class="back"
              src="/static/img/home/create-right.png"
            ></image>
            <image
              class="fast"
              :src="fastStatus ? '/static/img/home/shanactive.png' : '/static/img/home/shan.png'"
            ></image>
            <view class="name">{{ !fastStatus ? "快速通道" : "取消加速" }}</view>
          </view>
        </view> -->
        <!-- MJ画板会员20、非会员40灵力 -->
        <view
          class="create"
          :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
        >
          <view
            class="create-make"
            @click="fabClick"
          >
            <image src="/static/img/home/create-left.png"></image>
            <view class="name">
              {{ fastStatus ? "快速生成" : "开始生成" }}
              {{ createPoint }}
            </view>
          </view>
          <view
            class="create-fast"
            @click="fastStatus = !fastStatus"
          >
            <image
              class="back"
              src="/static/img/home/create-right.png"
            ></image>
            <image
              class="fast"
              :src="fastStatus ? '/static/img/home/shanactive.png' : '/static/img/home/shan.png'"
            ></image>
            <view class="name">{{ !fastStatus ? "快速通道" : "取消加速" }}</view>
          </view>
        </view>
      </template>
    </view>

    <!-- 添加关键词 -->
    <!-- <u-modal :show="keyWordModalShow" showCancelButton title="➕ 添加关键词" @confirm="addKeyword(2)" @cancel="addKeyword(1)"
      confirmColor="#00ebd3" cancelColor="#000" :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }">
      <view class="slot-content" style="width: 100%;" v-if="keyWordModalShow" :data-theme="cueTheme">
        <u--textarea v-model="keyWordAdd" placeholder="请输入关键词" autoHeight></u--textarea>
      </view>
    </u-modal> -->

    <!-- 公告 -->
    <view
      class="popup-layer"
      v-if="announStatus"
    ></view>
    <view
      class="popup"
      v-if="announStatus"
      :style="{ 'background': cueTheme == 'day-theme' ? '#fff' : '#141416' }"
    >
      <view
        class="popup-title"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
      >
        {{ startTimegoods.title }}
      </view>

      <view
        class="popup-content"
        :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
      >
        <image
          v-if="startTimegoods.image"
          class="tips-image"
          mode="widthFix"
          :src="startTimegoods.image"
        ></image>
        {{ startTimegoods.content }}
      </view>
      <image
        class="popup-close"
        @click="clickAnnoun()"
        src="/static/img/home/colse.svg"
      ></image>
    </view>



    <u-popup
      :show="linkStatus"
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
          检测到关键词中包含图片链接，图片链接失效会导致作图失败，是否删除图片链接
        </view>
        <view class="speak-item">
          <view
            class="option"
            @click="linkDelete"
            :style="{ 'color': cueTheme == 'day-theme' ? '#141416' : '#fff' }"
          >删除链接
          </view>
          <view
            class="option active"
            @click="continueClick"
          >不删除继续</view>
        </view>
      </view>
    </u-popup>

    <!-- 操作视频 -->
    <u-popup
      :show="showTutorial"
      mode="center"
      border-radius="40"
      style="background-color: #191919;"
    >
      <view
        v-if="showTutorial"
        class="content-box u-flex-col u-col-center "
      >
        <view class="title">新手入门教程</view>
        <video
          class="video-box"
          object-fit="contain"
          src="https://cdn.lingchuang.art/lingchuang-static/video/novice-tutorial.mp4"
          :controls="true"
          autoplay
          :show-fullscreen-btn="false"
          :show-center-play-btn="true"
          :show-progress="true"
        ></video>

        <view
          class="skip-btn"
          :class="{ 'skip-btn-while': cueTheme == 'day-theme' }"
          @click="list = null"
        >跳过</view>
      </view>

    </u-popup>
  </view>
</template>
<script>

import { createTask, notifyPull, taskPrompt, taskPage } from "@/static/api/index.js";
import { galleryCopyStyle } from "@/static/api/home.js";
import utils from "@/static/utils/utils";

export default {
  props: {
    drawByDetails: {
      type: Boolean,
      default() {
        return false
      }
    },
    passIndex: {
      type: String | Number,
      default() {
        return 0
      }
    },
  },
  components: {},
  data() {
    return {
      navIndex: 0, // 模型 二次元模型 标识
      navList: ['XL画板', 'MJ画板', '灵创画板'],
      keyword: '', // 关键词
      keyWordModalShow: false, // 添加关键词弹窗状态
      keyWordAdd: '',// 添加关键词

      ai_index: 0,
      ai_mode: false,
      keyword1: '', //灵创画板
      keyword2: '',

      userInfo: {},  // 用户信息
      tempFilePaths: [], //选择图片
      // modeIndex: 0, //模型下标
      modeIndexMJ: 0,
      modeIndexXL: 0,
      // algorithmIndex: -1, //算法下标
      algorithmIndexMJ: -1,
      algorithmIndexXL: 0,
      // sizeIndex: -1, //尺寸下标
      sizeIndexMJ: -1,
      sizeIndexXL: -1,
      styleIndex: 0, // 艺术风格
      artistIndex: 0, //艺术家
      styleMJ: {
        style: {
          algorithm: '',//算法
          ar: '',// 比例
          artist: '', //艺术家
        },
      }, // 
      styleXL: {
        style: {
          algorithm: '',//算法
          ar: '',// 比例
          artist: '', //艺术家
        },
      },

      tempFilePaths_mj: [], //选择图片
      //       
      startTimegoods: {}, //公告信息
      announStatus: false,

      // 新的
      index: 0,
      sketchpadInfo: {
        models: [{ aspect: [], }],//模型列表
        fusions: [],//融合模型列表
        types: [],//模型
        samples: [],//采样器列表
      },
      typesIndex: 0,// 模型下标
      sizesIndex: -1, //尺寸下标
      setupStatus: false,//高级设置状态
      fusionIndex: 0,//融合模型下标
      fusionSzie: 0,//
      samplesIndex: 0,//采样器下标
      modeIndexLc: 0,//灵创画板模型下标

      formData: {
        style: {
          algorithm: '',//算法
          ar: '',// 比例
          artist: '', //艺术家
          enable_hr: false, // 图片质量
          negative: '',//负面词
          restore_faces: false, //面部修复
          face_editor: false,// 全景面部修复
          cfg_scale: 7,//关键词相关性
          denoising: 75,//图片参考值
          iw: 5,
          cw: 10,
          sampler: '',//采样器
          face_editor: false,
        },//风格
      },
      statusSkill1: true,
      statusSkill2: false,
      statusSkill3: false,
      statusSkill4: true,
      statusSkill5: false,
      fastStatus: false,
      linkStatus: false,//关键词是否
      linkStatusNo: true,
      modeListMJ: [{ algorithm: [{ aspect: [] }], artist: [], style: [], }],
      modeListXL: [{ algorithm: [{ aspect: [] }], artist: [], style: [], }],
      showCustomSize: false,
      customSize: {
        name: '自定义',
        param: ''
      },
      list: null
    };
  },
  watch: {
  },
  computed: {
    createPoint(){
      let cost = '';
      if (this.passIndex === 0) { // 非会员
        if (this.fastStatus) {
          cost = this.isV6Fast ? '(20灵力)' : '(40灵力)';
        } else {
          cost = this.isV6Fast ? '(5灵力)' : '(10灵力)';
        }
      } else { // 会员
        if (this.fastStatus) {
          cost = this.isV6Fast ? '(10灵力)' : '(20灵力)';
        }
      }

      return cost;
    },
    showTutorial: {
      get: function () {
        console.log('showTutorial', this.list && this.list.length < 3 && !this.announStatus);
        return this.list && this.list.length < 3 && !this.announStatus
      },
      set: function (newValue) {
        this.list = []
      }
    },
    showArtStyle() {
      let modeIndex = this.modeIndex
      let modeList = this.modeList
      if (modeList[modeIndex] && modeList[modeIndex].style) {
        return modeList[modeIndex].style.length > 0 && this.navIndex == 1
      }
      return false
    },
    // 区分mj、 xl的JSON数据
    modeList: {
      get: function () {
        return this.navIndex == 1 ? this.modeListMJ : this.modeListXL
      },
      set: function (newValue) {
        if (this.navIndex == 1) {
          this.modeListMJ = newValue
        } else if (this.navIndex == 0) {
          this.modeListXL = newValue
        }
      }
    },
    // 区分mj、 xl的算法模型下标
    algorithmIndex: {
      get: function () {
        return this.navIndex == 1 ? this.algorithmIndexMJ : this.algorithmIndexXL
      },
      set: function (newValue) {
        if (this.navIndex == 1) {
          this.algorithmIndexMJ = newValue
        } else if (this.navIndex == 0) {
          this.algorithmIndexXL = newValue
        }
      }
    },
    // 区分mj、 xl的模型选择下标
    modeIndex: {
      get: function () {
        return this.navIndex == 1 ? this.modeIndexMJ : this.modeIndexXL
      },
      set: function (newValue) {
        if (this.navIndex == 1) {
          this.modeIndexMJ = newValue
        } else if (this.navIndex == 0) {
          this.modeIndexXL = newValue
        }
      }
    },
    // 区分mj、 xl的算法模型参数
    drawBoardStyle: {
      get: function () {
        return this.navIndex == 1 ? this.styleMJ : this.styleXL
      },
      set: function (newValue) {
        if (this.navIndex == 1) {
          this.styleMJ = newValue
        } else if (this.navIndex == 0) {
          this.styleXL = newValue
        }
      }
    },
    // 区分mj、 xl尺寸比例
    sizeIndex: {
      get: function () {
        return this.navIndex == 1 ? this.sizeIndexMJ : this.sizeIndexXL
      },
      set: function (newValue) {
        if (this.navIndex == 1) {
          this.sizeIndexMJ = newValue
        } else if (this.navIndex == 0) {
          this.sizeIndexXL = newValue
        }
      }
    },
    isV6() {
      if (this.drawBoardStyle.style && this.drawBoardStyle.style.algorithm) {
        return this.drawBoardStyle.style.algorithm.indexOf('6') > -1
      }
      return false
    },
    isV6Fast() {
      if (this.drawBoardStyle.style && this.drawBoardStyle.style.algorithm) {
        return this.drawBoardStyle.style.algorithm.indexOf('6.6') > -1
      }
      return false
    },
  },

  mounted() {
    this.getJsonData()

  },

  methods: {

    //获取画册列表
    getAlbumList() {
      let temp = {
        pageNum: 1,
        pageSize: 10,
      }
      taskPage(temp).then(res => {
        if (res.code == 200) {
          this.list = res.result.records || [];
        }
      })
    },
    async getJsonData() {
      let that = this;
      that.mjdrawingBoard()
      this.XLBoard()
      await that.drawingBoard()
      this.fetchNotify()
      this.getAlbumList()

      // 数据回显
      if (this.drawByDetails) {
        console.log('>>>>>>>>>>>>画同款、重做', this.drawByDetails);

        uni.showLoading({
          title: '加载中...',
          mask: true
        })

        // 画同款
        let goodsid = uni.getStorageSync('goodsid')
        if (goodsid) {
          this.drawSameModel(goodsid)
          return
        }
        // 重做
        if (uni.getStorageSync('maskinfo')) {
          let maskinfo = JSON.parse(uni.getStorageSync('maskinfo'))
          if (maskinfo) {
            this.repaint(maskinfo)
          } else {
            that.formData.model = that.sketchpadInfo.models[0].model;//默认填充模型值
            that.formData.style.sampler = that.sketchpadInfo.models[0].sample;//默认填充采样器
          }
        }
      } else {
        // 画册数量超过了10 显示灵创画板，否则显示MJ画板
        if (uni.getStorageSync('token')) {
          let temp = {
            pageNum: 1,
            pageSize: 10,
          }
          taskPage(temp).then(res => {
            if (res.code == 200) {
              that.navIndex = res.result.total >= 10 ? 0 : 1
            }
          })
        }
      }
    },
    // 画同款
    drawSameModel(goodsid) {
      galleryCopyStyle({ id: goodsid }).then(res => {
        if (res.code == 200) {
          let data = res.result;
          data.modelInfo.style = data.modelInfo.style ? JSON.parse(data.modelInfo.style) : {}
          data.style = data.style ? JSON.parse(data.style) : {}
          let jsoninfo = that.sketchpadInfo;
          let maskinfo = data
          that.initData(jsoninfo, maskinfo)
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
    },
    // 重绘
    repaint(maskinfo) {
      let that = this
      let jsoninfo = that.sketchpadInfo;
      that.initData(jsoninfo, maskinfo)
    },
    initData(jsoninfo, maskinfo,) {
      let that = this
      that.keyword2 = maskinfo.prompt;  // 关键词回显
      const currentModel = maskinfo.modelInfo.model
      const isXLModel = 20 <= currentModel && currentModel <= 22
      console.error('---------currentModel', currentModel, isXLModel);
      that.navIndex = currentModel >= 10 ? (isXLModel ? 0 : 2) : 1;    // 画板回显
      if (that.navIndex == 2) {
        //  模型回显
        jsoninfo.models.map((item, index) => {
          if (item.model == currentModel) {
            item.status = true;
            that.modeIndexLc = index;
          }
        })
        // 尺寸回显
        let sizeFlag = false
        jsoninfo.models[that.typesIndex].aspect.map((item, index) => {
          if (item.name == maskinfo.modelInfo.aspect) {
            that.sizesIndex = index;
            sizeFlag = true
            that.showCustomSize = false
            that.formData.style.ar = item.param;//默认填充采样器
            that.keyword2 = maskinfo.prompt.replace(item.param, '')
            uni.showToast({
              title: '识别到尺寸，已自动填写',
              icon: "none",
              duration: 2000
            });
          }
        })

        if (!sizeFlag) {
          that.sizesIndex = -2
          that.customSize = {
            name: maskinfo.modelInfo.aspect,
            param: ` --ar ${maskinfo.modelInfo.aspect} `
          }
          that.showCustomSize = true
          that.formData.style.ar = that.customSize.param
          uni.showToast({
            title: '识别到自定义尺寸，已自动填写',
            icon: "none",
            duration: 2000
          });
        }

        // 高级设置融合模型回显
        jsoninfo.fusions.map(item => {
          if (maskinfo.style.fusion.length > 0) {
            maskinfo.style.fusion.map(items => {
              if (item.lora == items.lora) {
                item.status = true;
                that.fusionSzie = that.fusionSzie + 1
              }
            })
          }
        })
      }

      if (that.navIndex == 0 || that.navIndex == 1) {
        setTimeout(() => {
          that.modeList.map((item, index) => {  //  模型回显
            if (item.model == currentModel) {
              that.modeIndex = index
              that.drawBoardStyle.model = currentModel
            }
          })

          that.modeList[that.modeIndex].algorithm.map((item, index) => {
            if (item.param == maskinfo.style.algorithm) {
              that.algorithmIndex = index;
              that.drawBoardStyle.style.algorithm = item.param
              that.keyword2 = maskinfo.prompt.replace(item.param, '')
            }
          })
          let sizeFlag = false
          console.log('--------------------', that.modeList, that.modeIndex);
          that.modeList[that.modeIndex].algorithm[0].aspect.map((item, index) => {
            console.log('--------------------', item.name == maskinfo.style.ar);
            if (item.name == maskinfo.style.ar) {
              sizeFlag = true
              that.showCustomSize = false
              item.param = item.param.replace(/(^\s*)|(\s*$)/g, "")
              that.drawBoardStyle.style.ar = item.param
              that.sizeIndex = index;
              that.keyword2 = maskinfo.prompt.replace(item.param, '')
              uni.showToast({
                title: '识别到尺寸，已自动填写',
                icon: "none",
                duration: 2000
              });
            }
          })
          if (!sizeFlag) {
            if (that.navIndex == 0 || that.navIndex == 1 && that.drawBoardStyle.style.algorithm.indexOf('--v 4') > -1) {
              that.sizeIndex = 0
              that.drawBoardStyle.style.ar = that.modeList[that.modeIndex].algorithm[that.algorithmIndex > 0 ? that.algorithmIndex : 0].aspect[that.sizeIndex].param
              uni.showToast({
                title: '您输入的--ar 参数无效，已默认为1:1尺寸比例',
                icon: "none",
                duration: 2000
              });
            } else {
              that.customSize = {
                name: maskinfo.modelInfo.aspect,
                param: ` --ar ${maskinfo.modelInfo.aspect} `
              }
              that.showCustomSize = true
              that.sizeIndex = -2
              that.drawBoardStyle.style.ar = that.customSize.param
              uni.showToast({
                title: '识别到自定义尺寸，已自动填写',
                icon: "none",
                duration: 2000
              });
            }
          }
        }, 1000)

      }
      let style = maskinfo.style;

      // 参考图
      if (style.image) {
        uni.downloadFile({
          url: style.image,
          success: (res) => {
            that.tempFilePaths = [res.tempFilePath];
          }
        })
      }
      if (style.crefImage) {
        uni.downloadFile({
          url: style.crefImage,
          success: (res) => {
            that.tempFilePaths_mj = [res.tempFilePath];
          }
        })
      }

      that.formData = {
        style: {
          algorithm: style.algorithm ? style.algorithm : that.formData.style.algorithm,//算法
          ar: that.formData.style.ar,// 比例
          artist: style.artist ? style.artist : that.formData.style.artist, //艺术家
          enable_hr: style.enable_hr ? style.enable_hr : that.formData.style.enable_hr, // 图片质量
          negative: style.negative ? style.negative : that.formData.style.negative,//负面词
          restore_faces: style.restore_faces ? style.restore_faces : that.formData.style.restore_faces, //面部修复
          face_editor: style.face_editor ? style.face_editor : that.formData.style.face_editor, //全景面部修复
          cfg_scale: style.cfg_scale ? style.cfg_scale : that.formData.style.cfg_scale,//关键词相关性
          denoising: style.denoising ? style.denoising : that.formData.style.denoising,//图片参考值
          iw: style.iw && style.iw || that.formData.style.iw,
          cw: style.cw && style.cw || that.formData.style.cw,
          sampler: style.sampler ? style.sampler : that.formData.style.sampler,//采样器
        },
        model: currentModel,
      };

      setTimeout(() => {
        uni.hideLoading()
      }, 1500);
    },
    fetchNotify() {
      let that = this
      // 公告
      let startTime = uni.getStorageSync('startTime') ? uni.getStorageSync('startTime') : null
      notifyPull({ startTime: startTime }).then(res => {
        if (res.code == 200) {
          uni.setStorageSync("startTime", utils.getTime());
          that.startTimegoods = res.result;
          that.announStatus = res.result.content ? true : false;
          console.log('---------- that.announStatus', that.announStatus);
        }
      })
    },
    // 关闭公告
    clickAnnoun() {
      this.announStatus = false;
    },
    // getKeyWordValue(str, keyWord) {
    //   // 没识别出来的自定义尺寸
    //   let index = str.indexOf(keyWord)
    //   if (index > -1) {
    //     let startIndex = index + keyWord.length + 1
    //     let customSizeKey = str.slice(startIndex, startIndex + 3)
    //     let customSizeValue = str.slice(index - 1, startIndex + 4)
    //     return {
    //       name: customSizeKey,
    //       param: customSizeValue
    //     }
    //   }
    //   return false
    // },

    // 获取关键词
    inputText(e) {
      let that = this;
      // (^|\s*)(-+|—)[aA][rR](\s*|$)(\d+(\.\d)?\d*$)
      // 匹配 --ar number:number
      let regex = /(^|\s*)(-+|—+)([aA][rR])(\s*|$)(\d+(:|：)\d+)/;
      uni.$u.debounce(() => {
        console.log('-----------------', regex.test(inputStr));
        let inputStr = utils.regFormat(e.detail.value)
        // that.sizesIndex = -1;
        if (that.navIndex == 2) { //灵创画板
          let sizeFlag = false
          that.sketchpadInfo.models[0].aspect.map((item, index) => {
            item.param = item.param.replace(/(^\s*)|(\s*$)/g, "")
            if (inputStr.indexOf(item.param) >= 0) {
              sizeFlag = true
              that.showCustomSize = false
              that.sizesIndex = index;
              inputStr = inputStr.replace(item.param, '')
              that.formData.style.ar = item.param;//默认填充采样器
              uni.showToast({
                title: '识别到尺寸，已自动填写',
                icon: "none",
                duration: 2000
              });
              return
            }
          })
          if (!sizeFlag) {

            inputStr = utils.regFormat(inputStr, 'v', '[vV]')
            inputStr = inputStr.replace(regex, (match) => {
              console.log('>>>>>>>>match灵创', match);
              that.sizesIndex = 0
              that.formData.style.ar = that.modeList[that.modeIndex].algorithm[that.algorithmIndex > 0 ? that.algorithmIndex : 0].aspect[that.sizesIndex].param;
              uni.showToast({
                title: '您输入的--ar 参数无效，已默认为1:1尺寸比例',
                icon: "none",
                duration: 2000
              });
              return ''
            })
          }
        }

        if (that.navIndex == 1 || that.navIndex == 0) {//MJ画板 || XL
          // 识别算法
          inputStr = utils.regFormat(inputStr, 'v', '[vV]')
          let algorithm = that.modeList[that.modeIndex].algorithm;
          for (var i = 0; i < algorithm.length; i++) {
            algorithm[i].param = algorithm[i].param.replace(/(^\s*)|(\s*$)/g, "")
            if (inputStr.indexOf(algorithm[i].param) >= 0) {
              that.algorithmIndex = i;
              inputStr = inputStr.replace(algorithm[i].param, '')
              that.drawBoardStyle.style.algorithm = algorithm[i].param
              uni.showToast({
                title: '识别到算法，已自动填写',
                icon: "none",
                duration: 2000
              });
              break;
            }
          }

          // 识别尺寸
          let sizeFlag = false
          that.modeList[that.modeIndex].algorithm[0].aspect.map((item, index) => {
            // 正则格式化
            item.param = item.param.replace(/(^\s*)|(\s*$)/g, "")
            if (inputStr.indexOf(item.param) >= 0) {
              sizeFlag = true
              that.showCustomSize = false
              that.sizeIndex = index;
              inputStr = inputStr.replace(item.param, '')
              that.drawBoardStyle.style.ar = item.param
              uni.showToast({
                title: '识别到尺寸，已自动填写',
                icon: "none",
                duration: 2000
              });
              return
            }
          })
          if (!sizeFlag) {
            if (that.navIndex == 0 || that.navIndex == 1 && that.drawBoardStyle.style.algorithm.indexOf('--v 4') > -1) {
              // console.log('>>>>>>>>>>>>>>>222',);
              inputStr = inputStr.replace(regex, (match) => {
                console.log('>>>>>>>>>>>>>>>match', match);
                that.sizeIndex = 0
                that.drawBoardStyle.style.ar = that.modeList[that.modeIndex].algorithm[that.algorithmIndex > 0 ? that.algorithmIndex : 0].aspect[that.sizeIndex].param
                uni.showToast({
                  title: '您输入的--ar 参数无效，已默认为1:1尺寸比例',
                  icon: "none",
                  duration: 2000
                });
                return ''
              })
            } else {
              inputStr = inputStr.replace(regex, (match) => {
                console.log('>>>>>>>>>>>>>>>match>', match);
                that.customSize = {
                  name: match.replace('--ar ', ''),
                  param: `${match} `
                }
                if (that.customSize) {
                  that.showCustomSize = true
                  that.sizeIndex = -2
                  that.drawBoardStyle.style.ar = that.customSize.param
                  uni.showToast({
                    title: '识别到自定义尺寸，已自动填写',
                    icon: "none",
                    duration: 2000
                  });
                  return ''
                }
              })

            }
          }
        }
        that.keyword2 = inputStr
      }, 500)
    },

    // 模型选择
    modeClickMj(index, modex) {
      let that = this;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      that.modeIndex = index;
      that.drawBoardStyle.model = modex; //模型ID 
      // 因为mj不同模型共用一个算法索引 ，切换模型时判断是否超出当前模型的算法长度 超出则设置为0
      if (that.algorithmIndex > that.modeList[that.modeIndex].algorithm.length - 1) {
        that.algorithmIndex = 0
      }

      let currentAlgorithm = that.modeList[that.modeIndex].algorithm[that.algorithmIndex]
      that.drawBoardStyle.style.algorithm = currentAlgorithm && currentAlgorithm.param
    },

    // 算法  
    algorithmMj(index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑modeList
        that.aimodelStatus()
        return
      }
      if (that.algorithmIndex == index) {
        that.drawBoardStyle.style.algorithm = '';
        that.algorithmIndex = -1;
      } else {
        that.algorithmIndex = index;
        that.drawBoardStyle.style.algorithm = modeList[that.modeIndex].algorithm[index].param;
      }
    },

    // 艺术风格
    styleClick(idx, index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      modeList[that.modeIndex].style.map(item => {
        item.map(items => {
          items.status = false
        })
      })
      modeList[that.modeIndex].style[idx][index].status = !modeList[that.modeIndex].style[idx][index].status;
      that.modeList = [...modeList]
      that.drawBoardStyle.style.style = modeList[that.modeIndex].style[idx][index].param;
      this.styleIndex = index;
    },

    // 艺术家
    artistClick(idx, index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      modeList[that.modeIndex].artist.map(item => {
        item.map(items => {
          items.status = false
        })
      })
      modeList[that.modeIndex].artist[idx][index].status = !modeList[that.modeIndex].artist[idx][index].status;
      that.modeList = [...modeList]
      that.drawBoardStyle.style.artist = modeList[that.modeIndex].artist[idx][index].param;
      this.artistIndex = index;
    },

    // 尺寸
    sizeMj(index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      if (index == -2) {
        if (that.sizeIndex == -2) {
          that.drawBoardStyle.style.ar = '';
          that.sizeIndex = -1;
        } else {
          that.drawBoardStyle.style.ar = this.customSize.param;
          that.sizeIndex = -2;
        }
        return
      }
      if (that.sizeIndex == index) {
        that.drawBoardStyle.style.ar = '';
        that.sizeIndex = -1;
      } else {
        that.sizeIndex = index;
        const algorithmIndex = that.algorithmIndex > 0 ? that.algorithmIndex : 0
        that.drawBoardStyle.style.ar = modeList[that.modeIndex].algorithm[algorithmIndex].aspect[index].param;
      }
    },


    // Ai模式不可以编辑
    aimodelStatus() {
      uni.showModal({
        title: '温馨提示',
        content: 'AI模式不可以编辑',
        confirmText: "知道了",
        showCancel: false,
        success: function (res) {
          if (res.confirm) { }
        }
      });
    },

    //  获取AI推荐关键词
    gettaskPrompt() {
      uni.$u.throttle(() => {
        this.ai_mode = true;
        var model
        if (this.navIndex == 2) {
          model = this.sketchpadInfo.models[this.modeIndex].model;//模型ID
        }  else {
          model = this.modeList[this.modeIndex].model;//模型ID
        }
        if (model) {
          taskPrompt({ model: model }).then(res => {
            if (res.code == 200) {
              if (this.ai_mode) {
                this.keyword2 = res.result.display;
                this.ai_index = res.result.origin.split(",");
              }
            }
          })
        }
      }, 500)
    },

    // 关键词链接删除
    linkDelete() {
      let that = this;
      let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      let urlList = that.keyword2.match(reg);
      that.linkStatus = false;
      urlList.map(item => {
        that.keyword2 = that.keyword2.replace(item, '')
      })
    },
    // 关键词不删除继续
    continueClick() {
      let that = this;
      that.linkStatus = false;
      that.linkStatusNo = false;
    },

    // 开始创作
    async fabClick(e) {
      let that = this;
      if (!getApp().globalData.getLogin()) {
        return;//用户未登录
      }

      //检测关键词是否包含链接
      let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      let urlList = that.keyword2.match(reg);
      // 检测关键词是否包含链接
      if (urlList && urlList.length > 0 && that.linkStatusNo) {
        that.linkStatus = true;
        return;
      }


      let keys = {};
      if (that.ai_mode) {
        // keys = that.keywordAI[that.ai_index].split(",");
        keys = this.ai_index
      } else {
        if (!that.keyword2) {
          uni.showToast({
            title: '输入不能为空',
            icon: "none",
            duration: 2000
          });
          return
        }
        that.keyword2 = that.keyword2.replace(/‘/ig, "'");
        that.keyword2 = that.keyword2.replace(/\s/gm, " ");
        that.keyword2 = that.keyword2.split(",").filter(Boolean).join();
        keys = that.keyword2.split(",");
      }


      // 订阅消息
      let subList = {};
      // #ifdef MP
      let [err, setting] = await uni.getSetting({
        withSubscriptions: true
      });
      if (err || setting.subscriptionsSetting) {
        if (!setting.subscriptionsSetting.mainSwitch) {
          // 未打开消息提醒总开关
          console.log('订阅消息未开启');
          // uni.openSetting({
          //   success: (res) => {
          //     console.log("openSetting的回调数据：", res);
          //     this.guidSubscribeMessageAuthAfter();
          //   },
          // });
          // return
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
              '5lcJjf1V8X5lePJtn0eL-K7GWTad-Nby30U2ynuBgU8', //制作完成通知
              '0vZdHaw50SXYC_KmYzjAbl4sJnG6e6DbaYMUA9dl_M4', //AI制作结果通知
            ]
          }
          var subResp = await wx.requestSubscribeMessage({
            tmplIds
          });
          var moIdState = setting.subscriptionsSetting.itemSettings;
          subList = subResp;
          console.log({
            moIdState,
            subResp
          });
        }
      } else {
        console.error("[getSetting]", err, setting);
      }
      // #endif

      // 灵创画板
      if (this.navIndex == 2) {
        var params = JSON.parse(JSON.stringify(this.formData));
        params.keywords = Array.isArray(keys) ? keys : keys.split(''); // 输入的文字
        params.subList = subList; // 订阅信息
        params.openid = uni.getStorageSync('openid') || ''; // openid
        params.appid = getApp().globalData.appid; // 订阅信息
        params.fastChannel = that.fastStatus ? 1 : 0;
        params.style.fusion = [];// 融合模型列表
        that.sketchpadInfo.fusions.map(item => {
          if (item.status) {
            params.style.fusion.push({
              prompt: item.prompt || '',
              weight: item.weight,
              lora: item.lora,
            })
          }
        })
      } else {
        // MJ画板 || XL画板
        var params = JSON.parse(JSON.stringify(this.drawBoardStyle));
        params.keywords = Array.isArray(keys) ? keys : keys.split(''); // 输入的文字
        params.subList = subList; // 订阅信息
        params.openid = uni.getStorageSync('openid') || ''; // openid
        params.appid = getApp().globalData.appid; // 订阅信息
        params.fastChannel = that.fastStatus ? 1 : 0;
      }


      if (that.tempFilePaths_mj.length > 0) {
        // 有角色参考图
        uni.showLoading({ title: '角色参考图上传中' });
        let filePath = that.tempFilePaths_mj[0]
        // 获取上传图片所需参数、上传地址
        const result = await utils.upLoadImage(filePath)
        params.style.cw = this.formData.style.cw
        params.style.crefAttachment = result.attachment
      }

      console.log(params, '制图参数')
      // return;
      if (that.tempFilePaths.length == 0) {  
        // 无参考图
        params.style.denoising = this.formData.style.denoising
        createTask(params).then((res) => {
          uni.hideLoading()
          if (res.code == 200) {
            that.tempFilePaths_mj = []
            // if(params.style.crefAttachment) delete params.style.crefAttachment
            uni.navigateTo({
              url: '/phome/make?id=' + res.result.id
            })
          }
        }).catch((err) => {
          uni.hideLoading()
        })
      } else { 
        // 有参考图
        params.style.iw = this.formData.style.iw

        uni.showLoading({ title: '参考图上传中' });
        uni.uploadFile({
          method: 'POST',
          header: { 'Authorization': 'Bearer ' + uni.getStorageSync('token'), },
          url: 'https://api.drawai.cn/user/imagine',
          filePath: that.tempFilePaths[0],
          formData: {
            draw: JSON.stringify(params),
          },
          name: 'file',
          success: (res) => {
            let data = JSON.parse(res.data);
            console.log(data, 'datadata')
            uni.hideLoading()
            if (data.code == 200) {
              that.tempFilePaths = [];
              that.tempFilePaths_mj = []
              // params.style.iw && delete params.style.iw
              // if(params.style.crefAttachment) delete params.style.crefAttachment
              // that.makeInfo = data.result;
              uni.navigateTo({
                url: '/phome/make?id=' + data.result.id
              })
            } else {
              uni.showToast({ title: data.message, icon: 'none', duration: 4000 })
            }
          },fail: (err) => {
            uni.hideLoading()
          }
        });
      }
    },


    exitAi() {
      let that = this;
      that.ai_mode = false; //退出ai模式
      that.keyword2 = '';
      that.taskId = '';
    },


    // 图中图 选择图片
    addPicture(type) {
      let that = this;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that.tempFilePaths = res.tempFilePaths;
        }
      });
    },

    // 图中图删除图片
    deletePicture() {
      let that = this;
      that.tempFilePaths = [];
    },
    // 图中图 选择图片
    addMJPicture(type) {
      let that = this;
      if (!this.isV6) {
        return uni.showToast({
          title: '角色参考图为v6算法专用',
          icon: "none",
          duration: 2000
        });
      }
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that.tempFilePaths_mj = res.tempFilePaths;
        }
      });
    },

    // 图中图删除图片
    deleteMJPicture() {
      let that = this;
      that.tempFilePaths_mj = [];
    },


    // 是否进入AI模式
    switchAiMode(type) {
      let that = this;
      // type: 1 进入AI模式  2 退出ai模式
      if (!that.ai_mode) {
        that.gettaskPrompt()
        that.ai_mode = true;
        that.tempFilePaths = [];//ai模式需清除图中图数据
        that.tempFilePaths_mj =[]
        uni.showToast({
          title: '进入AI模式不可编辑，请开始下一步创作',
          icon: "none",
          duration: 2000
        });
      } else {
        that.gettaskPrompt()
      }
    },

    // 退出AI模式
    exitAiMode() {
      if (this.ai_mode) {
        this.ai_index = [];
        this.keyword2 = "";
        this.ai_mode = false;
      } else {
        this.keyword2 = "";
      }
    },

    //模型类型
    typesClick(e) {
      this.typesIndex = e;
    },

    // 灵创模型选择
    modeClickLC(index, modex) {
      let that = this;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      that.modeIndexLc = index;
      that.formData.model = modex; //模型ID 
      //采样器赋值
      that.formData.style.sampler = that.sketchpadInfo.models[index].sample;
    },

    // 模型尺寸
    modelsSize(e, param) {
      let that = this;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      that.formData.style.ar = that.sizesIndex == e ? '' : param;
      that.sizesIndex = that.sizesIndex == e ? -1 : e;
    },

    // 融合模型类型
    fusionType(e) {
      let that = this;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      that.fusionIndex = e;
    },

    // 融合模型
    fusionModel(idx) {
      let that = this;
      let data = that.sketchpadInfo
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      if (that.fusionSzie == 3 && !data.fusions[idx].status) {
        uni.showModal({
          title: '温馨提示',
          content: '最多选择三个融合模型哦~',
          confirmText: "知道了",
          showCancel: false,
          success: function (res) { }
        })
        return
      }
      data.fusions[idx].status = !data.fusions[idx].status;
      data.fusions.map((item, index) => {
        if (index == idx && item.status) {
          that.fusionSzie += 1
          data.fusions.unshift(data.fusions.splice(index, 1)[0]);
          data.fusionTypes[that.fusionIndex].status = true
          if (!data.fusionTypes[that.fusionIndex].sizeBox) {
            data.fusionTypes[that.fusionIndex].sizeBox = 0
          }
          data.fusionTypes[that.fusionIndex].sizeBox += 1
        }
        if (index == idx && !item.status) {
          that.fusionSzie -= 1
          data.fusions.push(data.fusions.splice(index, 1)[0]);
          data.fusionTypes[that.fusionIndex].sizeBox -= 1
          data.fusionTypes[that.fusionIndex].status = data.fusionTypes[that.fusionIndex].sizeBox > 0 ? true : false
        }
      })
      that.sketchpadInfo = { ...data }
    },

    // 融合模型重置
    fusionResetting() {
      let that = this;
      that.sketchpadInfo.fusions.map(item => {
        item.status = false;
      })
      that.fusionSzie = 0;
    },

    fusionOptice(type, index, weight) {
      let that = this;
      let goods = that.sketchpadInfo;
      if (type == 1) {
        if ((Number(weight) - 0.05).toFixed(2) < 0.05) {
          return
        }
        goods.fusions[index].weight = (Number(weight) - 0.05).toFixed(2);
      } else {
        if ((Number(weight) + 0.05).toFixed(2) > 1) {
          return
        }
        goods.fusions[index].weight = (Number(weight) + 0.05).toFixed(2);
      }
      that.sketchpadInfo = { ...goods }
    },

    // 算法  
    algorithmClick(index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      if (that.algorithmIndex == index) {
        that.formData.style.algorithm = '';
        that.algorithmIndex = -1;
      } else {
        that.algorithmIndex = index;
        that.formData.style.algorithm = modeList[that.modeIndex].algorithm[index].param;
      }
    },

    // 尺寸
    sizeClick(index) {
      let that = this;
      let modeList = that.modeList;
      if (that.ai_mode) { //AI模式不可编辑
        that.aimodelStatus()
        return
      }
      if (that.sizeIndex == index) {
        that.formData.style.ar = '';
        that.sizeIndex = -1;
      } else {
        that.sizeIndex = index;
        that.formData.style.ar = modeList[that.modeIndex].algorithm[that.algorithmIndex > 0 ? that.algorithmIndex : 0].aspect[index].param;
      }
    },

    // 面部修复装
    faceStatus(type) {
      let that = this;
      if (type == 1) {
        that.formData.style.face_editor = false;
      }
      if (type == 2) {
        that.formData.style.restore_faces = false;
      }
    },

    // 是否展示
    functClick(e) {
      this.statusSkill1 = e == 1 ? !this.statusSkill1 : this.statusSkill1;
      this.statusSkill2 = e == 2 ? !this.statusSkill2 : this.statusSkill2;
      this.statusSkill3 = e == 3 ? !this.statusSkill3 : this.statusSkill3;
      this.statusSkill4 = e == 4 ? !this.statusSkill4 : this.statusSkill4;
      this.statusSkill5 = e == 5 ? !this.statusSkill5 : this.statusSkill5;
    },

    // 灵创画板
    drawingBoard() {
      let that = this;
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://cdn.drawai.cn/models/lc.json',
          method: 'GET',
          success: ({ data, statusCode }) => {
            that.sketchpadInfo = data;
            that.formData.model = data.models[0].model;//默认填充模型值
            that.formData.style.sampler = data.models[0].sample;//默认填充采样器
            console.log('11111');
            resolve()
          },
          fail: ((err) => {
            reject(err)
          })
        });
      })
    },

    // MJ 画板
    mjdrawingBoard() {
      let that = this;
      uni.request({
        url: 'https://cdn.drawai.cn/models/mj.json',
        method: 'GET',
        success: ({ data, statusCode }) => {
          that.modeListMJ = data;
          that.styleMJ.model = data[0].model;//默认填充模型值
          if (that.navIndex === 1) {
            that.drawBoardStyle.style.algorithm = data[0].algorithm[0].param;//默认填充算法
          }
        },
      });
    },

    // XL画板
    XLBoard() {
      let that = this;
      uni.request({
        // url: 'https://cdn.drawai.cn/models/xl.json?2',
        url: 'https://cdn.lingchuang.art/ling/xl.json', 
        method: 'GET',
        success: ({ data, statusCode }) => {
          that.modeListXL = data;
          that.styleXL.model = data[0].model;//默认填充模型值
          if (that.navIndex === 0) {
            that.drawBoardStyle.style.algorithm = data[0].algorithm[0].param;//默认填充算法
          }
        },
      });
    },

    // 采样器
    bindPickerChange(e) {
      this.formData.style.sampler = this.sketchpadInfo.models[this.modeIndexLc].samples[e.detail.value];
    },

    // 模型
    navbarClick(e) {
      let that = this;

      switch (e) {
        case 0:
          that.drawBoardStyle.model = that.modeList[that.modeIndex].model;//默认填充模型值
          break;
        case 1:
          that.drawBoardStyle.model = that.modeList[that.modeIndex].model;//默认填充模型值
          break;
        case 2:
          that.formData.model = that.sketchpadInfo.models[that.modeIndexLc].model;//默认填充模型值
          break;
      }

      that.navIndex = e;
      that.keyword2 = '';//关键词
      that.ai_mode = false;//AI推荐状态
      that.formData = {
        style: {
          algorithm: '',//算法
          ar: '',// 比例
          artist: '', //艺术家
          enable_hr: false, // 图片质量
          negative: '',//负面词
          restore_faces: false, //面部修复
          face_editor: false,
          cfg_scale: 7,//关键词相关性
          denoising: 75,//图片参考值
          iw: 5,   // xl、mj参考值
          cw: 10,  // xl、mj 角色参考值
          sampler: that.formData.style.sampler,//采样器
        },
        model: that.formData.model,
      };
      that.sizesIndex = -1; //尺寸下标
      // that.setupStatus = true;//高级设置状态
      that.fusionIndex = 0;//融合模型下标
      that.fusionSzie = 0;//
      that.samplesIndex = 0;//采样器下标
      if (e === 0) {
        this.algorithmIndex = 0
      }
    },

    // 通道
    // passclick(e) {
    //   if (!getApp().globalData.getLogin()) {
    //     return;//用户未登录
    //   }
    //   let userInfo = uni.getStorageSync('userInfo');
    //   if ((userInfo.vip || userInfo.anchor == 1) && e == 0) {
    //     uni.showModal({
    //       title: '温馨提示',
    //       content: '您已是会员，请使用会员通道！',
    //       showCancel: false,
    //       success: function (res) { }
    //     });
    //   }
    //   if ((!userInfo.vip && userInfo.anchor != 1) && e == 1) {
    //     uni.showModal({
    //       title: '温馨提示',
    //       content: '您还不是会员，点击跳转办理会员！',
    //       confirmText: "跳转",
    //       success: function (res) {
    //         if (res.confirm) {
    //           uni.navigateTo({
    //             url: "/pmnie/mnie/recharge"
    //           })
    //         }
    //       }
    //     });
    //   }
    // },

    // 办理会员
    dealwithVip(e) {
      uni.navigateTo({
        url: "/pmnie/mnie/recharge"
      })
    },

    // 开始解析
    // startParsing() {
    //   if (!getApp().globalData.getLogin()) {
    //     return;//用户未登录
    //   }
    //   let userInfo = uni.getStorageSync('userInfo');
    //   if (!userInfo.vip && userInfo.anchor != 1) {
    //     uni.showModal({
    //       title: '温馨提示',
    //       content: '您还不是会员，点击跳转办理会员！',
    //       confirmText: "跳转",
    //       success: function (res) {
    //         if (res.confirm) {
    //           uni.navigateTo({
    //             url: "/pmnie/mnie/recharge"
    //           })
    //         }
    //       }
    //     });
    //   } else {
    //     uni.navigateTo({
    //       url: "/phome/analysis"
    //     })
    //   }
    // },

  },
};
</script>

<style
  scoped
  lang="scss"
>
.navtab {
  display: flex;
  justify-content: space-around;
}

.create {
  display: flex;
  justify-content: space-between;
  position: fixed;
  //#ifdef MP
  bottom: 60rpx !important;
  //#endif 

  //#ifndef MP
  bottom: 160rpx !important;
  //#endif 

  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  border-radius: 148rpx;
  // background: #141416;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}

.vipimg {
  width: auto;
  margin: 0 30rpx 30rpx;
}

.create .create-make {
  height: 94rpx;
  width: 70%;
  position: relative;
  // left:-2rpx
}

.create .create-make .name {
  height: 94rpx;
  width: 100%;
  text-align: center;
  line-height: 94rpx;
  position: absolute;
  top: 0;
}

.create .create-make image {
  width: 100%;
  height: 94rpx;
  position: relative;
}

.create .create-fast {
  width: 30%;
  height: 94rpx;
  position: relative;
  // right:-4rpx
}

.create .create-fast .back {
  width: 100%;
  height: 94rpx;
  position: relative;
}

.create .create-fast .fast {
  width: 48rpx;
  height: 48rpx;
  position: absolute;
  left: 50%;
  transform: translate(-50%, );
  margin-top: 10rpx;
}

.create .create-fast .name {
  width: 100%;
  text-align: center;
  position: absolute;
  font-size: 22rpx;
  bottom: 10rpx;
  color: white;
}

.popup-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}

.popup-close {
  color: white;
  position: fixed;
  bottom: -140rpx;
  font-weight: 700;
  font-size: 50rpx;
  height: 80rpx;
  width: 80rpx;
  line-height: 50rpx;
  text-align: center;
  border-radius: 50%;
  left: 44%;
}

.popup-title {
  text-align: center;
  margin-bottom: 30rpx;
  font-weight: 600;
}

.analysis {
  height: 96rpx;
  line-height: 96rpx;
  background: #F0FCFB;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;
}

.analysisbox {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
}

.analysis .analysis-btn image {
  width: 28rpx;
  height: 48rpx;
  position: relative;
  left: 30rpx;
  margin-right: 40rpx;
  top: 10rpx;
}

.analysis .analysis-star {
  width: 160rpx;
  height: 64rpx;
  text-align: center;
  line-height: 64rpx;
  color: #000000 !important;
  background: #00EBD3;
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  margin: 14rpx 20rpx 14rpx 0;
}

.popup {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  border-radius: 12rpx;
  z-index: 99999;
  background: #2E2E33;
  white-space: pre-wrap;
  color: white;
  // text-align: center;
  padding: 50rpx 30rpx 20rpx;
  // overflow: scroll;
}

.popup-content {
  min-height: 460rpx;
  max-height: 860rpx;
  overflow: scroll;

  .tips-image {
    width: 100%;
    margin-bottom: 36rpx;
  }
}

.scroll {
  width: 100%;

}

.scroll-item {
  /* border: 1px solid red; */
  min-width: 100%;
  // height:120px;
  overflow-x: auto;
}

.scroll-item-list {
  width: 170rpx;
  height: 170rpx;
  margin: 10rpx;
  /* border:1px solid red; */
  display: inline-block;
  position: relative;

}

.scroll-item-active {
  width: 170rpx;
  height: 170rpx;
  margin: 10rpx;
  display: inline-block;
  position: relative;
  border-radius: 16rpx;
  border: 2rpx solid #1affe8;
}

.scroll-item-active .icon {
  width: 100%;
  height: 100%;
  border-radius: 14rpx;
}

.scroll-item-list .icon {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.scroll-item-active .name {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2rpx;
  line-height: 42rpx;
  height: 42rpx;
  color: white;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0 0 16rpx 16rpx;
  background: rgba(0, 0, 0, 0.8);
}

.scroll-item-list .name {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2rpx;
  line-height: 42rpx;
  height: 42rpx;
  color: white;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0 0 16rpx 16rpx;
  background: rgba(0, 0, 0, 0.8);
}

.identifying {
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: 99;
  width: 44px;
  height: 24px;
  line-height: 20px;
  text-align: center;
  color: white;
  background: #9D44F0;
  border-radius: 0px 16rpx 0px 16rpx;
  border: 2px solid rgba(255, 255, 255, 0.66);
  font-size: 22rpx;
}

.page {
  background-color: var(--bg-color);
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40rpx;
}


.percentage {
  margin: 0 30rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-body {
  width: 96%;
  text-align: center;
  color: white;
}

.model-body .title {
  font-weight: 500;
  color: #FFFFFF;
  font-size: 18px;
  margin: 40rpx 0rpx;
}

.model-body .tips {
  font-size: 24rpx;
  font-family: 'PingFang SC-Regular, PingFang SC';
  font-weight: 400;
  line-height: 36rpx;
  color: rgba(255, 255, 255, 0.6);
}

.model-body .viptips {
  margin-top: 100rpx;
  font-weight: 600;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  height: 68rpx;
  line-height: 68rpx;
}

.model-body .viptips .dome {
  width: 140rpx;
  height: 58rpx;
  line-height: 58rpx;
  text-align: center;
  background: #00EBD3;
  font-weight: normal;
  font-size: 26rpx;
  border-radius: 70rpx;
  margin-left: 20rpx;
}

.group_2 {
  overflow-y: auto;
}

.group_3 {
  padding: 18rpx 32rpx 0;
}

.space-x-17 {
  // display: flex;
}

.group_4 {
  padding: 20rpx 0;
  width: 170rpx;
}

.tipss,
.tipss-new {
  position: absolute;
  right: 2rpx;
  top: -10rpx;
  font-size: 20rpx;
  color: white;
  width: 56rpx;
  text-align: center;
  line-height: 26rpx;
  height: 32rpx;
  background: #F04455;
  border-radius: 10rpx 10rpx 10rpx 0rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.66);
}

.tipss-new {
  background: #9D44F0;
}

.space-x-17 .quality {
  border: 1px solid #1AFFE8;
  border-radius: 70rpx;
  display: inline-block;
  margin-right: 10rpx;
  margin-bottom: 16rpx;
  width: 130rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 28rpx;
  color: white;
  // color: rgba(255,255,255,0.8);
}

.space-x-17 .active {
  border: 1px solid #1AFFE8;
  background: #1AFFE8;
  color: #000 !important;
}

.font_1 {
  font-size: 28rpx;
  font-family: PingFangSC;
  line-height: 26rpx;
  color: #ffffff99;
}

.text_3 {
  color: #ffffff;
}

.image_6 {
  width: 176rpx;
  height: 64rpx;
}

.pos {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.group_5 {
  margin-top: 32rpx;
}

.text_5 {
  color: #ffffff;
  font-size: 36rpx;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 33rpx;
}

.section_3 {
  padding: 24rpx 20rpx 24rpx 28rpx;
  border-radius: 44rpx;
  height: 68rpx;
  // border: solid 4rpx #1affe8;
  font-size: 24rpx;
}

.image_7 {
  width: 32rpx;
  height: 32rpx;
}

.text_6 {
  color: #1affe8;
  font-size: 28rpx;
  font-family: TsangerYuYangT-W02;
  line-height: 26rpx;
}

.font_2 {
  font-size: 24rpx;
  font-family: PingFangSC-Regular;
  line-height: 22rpx;
  color: #ffffffcc;
}

.text_7 {
  margin-top: 12rpx;
  color: #ffffff99;
  line-height: 23rpx;
}

.text-wrapper_2 {
  margin-top: 28rpx;
  background-color: var(--bg-color-2);
  border-radius: 32rpx;
  min-height: 240rpx !important;
  margin-bottom: 24rpx;
  padding: 20rpx
}

.text-wrapper_2 textarea {
  width: 100%;
  color: var(--text-color);
}

.text_8 {
  // margin: 0 20rpx;
  width: 100% !important;
  color: #ffffffcc;
  font-size: 28rpx;
  line-height: 36rpx;
  min-height: 240rpx !important;
  max-height: 560rpx;
  word-break: break-all;
  white-space: pre-wrap;
  overflow: scroll;
  // padding-bottom: 10rpx;
}

.group_6 {
  // padding: 24rpx 0 48rpx;
  margin-bottom: 26rpx;
}

.section_4 {
  padding: 16rpx 24rpx;
  background-color: #ffffff14;
  border-radius: 36rpx;
  height: 64rpx;
  border: solid 2rpx #ffffff66;
}

.text_9 {
  color: #ffffff;
}

.section_5 {
  padding: 16rpx 24rpx;
  background-color: #00ebd3;
  border-radius: 32rpx;
  height: 64rpx;
}

.space-x-4>view:not(:first-child),
.space-x-4>text:not(:first-child),
.space-x-4>image:not(:first-child) {
  margin-left: 8rpx;
}

.text_10 {
  color: #141416;
}

.section_6 {
  // background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/461f1e4279d1298a43dd8887cbac1dfa.png');
  background-position: 0% 0%;
  background-size: 750rpx 1060rpx;
  background-repeat: no-repeat;
  padding-bottom: 100rpx;
  border-radius: 70rpx 70rpx 0 0;
  // background-color: #23262F;
  background: #141416;
}

.flex-tab {
  display: flex;
  color: white;
  margin: 0rpx 0 30rpx;

  .flex-tab-item {
    width: 146rpx;
    text-align: center;
    line-height: 60rpx;
    position: relative;
    // margin-right:14rpx;
    border-radius: 70rpx;

    .drop {
      width: 14rpx;
      height: 14rpx;
      background: red;
      border-radius: 50%;
      position: absolute;
      top: 26%;
      right: 28rpx;
    }

    .active {
      position: absolute;
      width: 120rpx;
      height: 60rpx;
      left: 0;
      right: 0;
      bottom: 0;
      line-height: 60rpx;
    }
  }

  .tabactive {
    border: 1px solid #1AFFE8;
    color: #1AFFE8 !important;
  }
}


.fusionb {}

.fusionb .fusionb-item {
  width: 170rpx;
  height: 170rpx;
  // margin: 10rpx;
  margin-right: 8rpx;
  margin-bottom: 14rpx;
  display: inline-block;
  position: relative;
  border-radius: 8rpx;
}

.fusionb .fusionb-item .icon {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.fusionb .fusionb-item .name {
  background: rgba(0, 0, 0, 0.4);
  // opacity: 0.3;
  // background: #FFFFFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 40rpx;
  height: 40rpx;
  color: white;
  font-size: 24rpx;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0 0 8rpx 8rpx;
  font-size: 24rpx;
}

.fusionb .fusionb-item .top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0 !important;
  border-radius: 8rpx 8rpx 0rpx 0rpx !important;
}

.fusionb .fusionb-active {
  border: 1rpx solid #1affe8;
}

.fusionb .fusionb-item .optice {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 12rpx 12rpx;
}

.fusionb .fusionb-item .optice .optice-item {
  text-align: center;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

.fusionb .fusionb-item .optice .active {
  font-size: 24rpx;
}


.section_6 {
  // border: 1px solid red;
  padding: 0 20rpx;
  padding-bottom: 160rpx;

  .leftname {
    text-align: left !important;
  }

  .setup {
    display: flex;
    justify-content: space-between;
    color: white;
    line-height: 120rpx;

    .setup_name {
      font-weight: 600;
      font-size: 32rpx;
      display: flex;
      justify-content: space-between;
    }

    .resetting {
      font-weight: 400;
      width: 146rpx;
      text-align: center;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 70rpx;
      margin-top: 30rpx;

      image {
        width: 30rpx;
        height: 30rpx;
        position: relative;
        top: 2rpx;
        right: 6rpx;
      }
    }

    .setup_switch {
      padding-top: 34rpx;
    }
  }

  .scales {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    text-align: center;
    color: white;
    font-size: 26rpx;
  }

  .scales .scales-item {
    width: 120rpx;
    height: 120rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    // border: 2rpx solid #6BE7D3;
    position: relative;
    margin: 12rpx;
    padding: 20rpx;
    padding-bottom: 8rpx;

    .custon-text {
      font-size: 24rpx;
      color: var(--text-color);
    }
  }

  .scales-custom {
    min-width: 120rpx;
    max-width: 300rpx;
    height: 120rpx;
    background: var(--bg-color-2);
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    // border: 2rpx solid #6BE7D3;
    position: relative;
    margin: 12rpx;
    padding: 20rpx;
    padding-bottom: 8rpx;

    .custon-text {
      font-size: 24rpx;
      color: var(--text-color);
    }
  }

  .scales .scales-active {
    border: #00EBD3 2rpx solid;
    // color: #00EBD3;
  }

  .scales .scales-item .ratio {
    max-width: 56rpx;
    max-height: 56rpx;
    background: var(--bg-color-3);
    margin: 0 auto;
    border-radius: 4rpx 4rpx 4rpx 4rpx;
  }

  .scales .scales-item .name {
    color: var(--text-color);
    height: 32rpx;
    margin-top: 8rpx;
  }

  .slider-tips {
    font-size: 24rpx;
    color: var(--text-color);
    margin: 24rpx 0 0 4rpx;
    .slider-tips-warn{
      color: #EC4040;
    }
  }

  .slider-top {
    display: flex;
    justify-content: space-between;

    .slider {
      width: 85% !important;
      margin-left: -30rpx;

      .slider-name {
        width: 176rpx;
        margin-left: 30rpx;
        // border:1px solid red;
      }


    }

    /deep/ slider {
      margin: 18px 18px 0 18px;
    }


    input {
      width: 100rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      color: white;
      text-align: center;
    }
  }

  .picture {
    width: 160rpx;
    height: 160rpx;
    text-align: center;
    border-radius: 10rpx;
    color: white;
    border: 1rpx dashed white;
    font-size: 14px;
    position: relative;
    margin-right: 20rpx;
  }

  .picture .close {
    position: absolute;
    top: -14px;
    right: -16rpx;
    width: 40rpx;
    height: 40rpx;
    z-index: 99;
    background: #00ebd3;
    border-radius: 50%;
    transform: rotate(-45deg);
  }

  .picture .take {
    width: 60rpx;
    height: 60rpx;
    margin-top: 30rpx;
  }

  .textarea {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 22rpx;
    height: 184rpx;
    width: auto;
    font-size: 26rpx;
    padding: 20rpx;
    color: #A6A6A6;
  }

  .setup_picker {
    background: rgba(245, 245, 245, 0.08);
    border-radius: 22rpx;
    height: 112rpx;
    line-height: 112rpx;
    color: white;
    padding: 0 20rpx;
  }

  .setup_picker .picker {
    position: relative;
  }

  .setup_picker .picker .active {
    width: 20rpx;
    height: 32rpx;
    position: absolute;
    top: 20px;
    right: 18rpx;
    transform: rotate(90deg);
  }

  .setup_tips {
    color: white;
    font-size: 24rpx;
  }
}

.group_7 {
  padding: 32rpx 0 0 0;
  // margin-top:20rpx;
}

.space-y-26>view:not(:first-child),
.space-y-26>text:not(:first-child),
.space-y-26>image:not(:first-child) {
  margin-top: 32rpx;
}

.group_8 {
  padding-left: 28rpx;
}

.font_3 {
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  line-height: 30rpx;
  color: var(--text-color);
}

.group_9 {
  margin-top: 28rpx;
  overflow: hidden;
}

.horiz-list {
  overflow-x: auto;
}

.space-x-12>view:not(:first-child),
.space-x-12>text:not(:first-child),
.space-x-12>image:not(:first-child) {
  margin-left: 24rpx;
}

.horiz-list-item {
  width: 192rpx;
}

.section_7 {
  border-radius: 24rpx;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846401407344191.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.section_8 {
  padding: 8rpx 0 144rpx;
  border-radius: 24rpx;
  width: 192rpx;
  border: solid 4rpx #1affe8;
}

.text-wrapper_4 {
  margin-left: 8rpx;
  padding: 8rpx 0;
  background-color: #7836ff;
  border-radius: 16rpx;
  box-shadow: 0px 6rpx 12rpx #7836ff4d;
  width: 72rpx;
}

.font_4 {
  font-size: 20rpx;
  font-family: Montserrat;
  line-height: 14rpx;
  font-weight: 700;
  color: #ffffff;
}

.section_9 {
  padding: 8rpx 0 152rpx;
  border-radius: 24rpx;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63c3eb225a7e3f0310c02512/63c3eb3cc86a890011054412/16737846401407344191.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.text-wrapper_3 {
  margin-left: 8rpx;
  padding: 8rpx 0;
  background-color: #ff5d3b;
  border-radius: 16rpx;
  box-shadow: 0px 6rpx 12rpx #7836ff4d;
  width: 72rpx;
}

.view {
  margin-left: 10rpx;
}

.image_8 {
  border-radius: 24rpx;
  width: 192rpx;
  height: 192rpx;
}

.text_11 {
  line-height: 23rpx;
}

.text_12 {
  margin-top: 52rpx;
}

.horiz-list-item_2 {
  padding-bottom: 8rpx;
  width: 192rpx;
}

.section_10 {
  border-radius: 24rpx;
  height: 192rpx;
  border: solid 4rpx #1affe8;
}

.horiz-list-item_3 {
  padding-bottom: 8rpx;
}

.space-y-10>view:not(:first-child),
.space-y-10>text:not(:first-child),
.space-y-10>image:not(:first-child) {
  margin-top: 20rpx;
}

.text_13 {
  margin: 0 22rpx 0 0rpx;
  display: flex;
  justify-content: space-between;
  width: auto;
  line-height: 70rpx;
  /* border: 1px solid red; */
}

.text_13 .icon {
  width: 18rpx;
  height: 32rpx;
  margin-top: 20rpx;
  transform: rotate(90deg);
}

.text_13 .active {
  width: 18rpx;
  height: 32rpx;
  margin-top: 20rpx;
  transform: rotate(-90deg);
}

.equal-division {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap !important;
}

.equal-division-item {
  min-width: 120rpx;
  /* padding:0 10rpx; */
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 80rpx;
  margin-right: 12rpx;
  margin-bottom: 20rpx;
  /* border: 1px solid #1affe8; */
}

.picture {
  width: 160rpx;
  height: 160rpx;
  text-align: center;
  border-radius: 10rpx;
  color: white;
  border: 1rpx dashed white;
  font-size: 14px;
  position: relative;
  margin-right: 20rpx;
}

.picture .close {
  position: absolute;
  top: -14px;
  right: -16rpx;
  width: 40rpx;
  height: 40rpx;
  background: #00ebd3;
  border-radius: 50%;
  transform: rotate(-45deg);
}

.picture .take {
  width: 60rpx;
  height: 60rpx;
  margin-top: 30rpx;
}

.space-y-12>view:not(:first-child),
.space-y-12>text:not(:first-child),
.space-y-12>image:not(:first-child) {
  margin-top: 24rpx;
}

.image_9 {
  width: 64rpx;
  height: 64rpx;
}

.font_5 {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  /* line-height: 18rpx; */
  color: #ffffffcc;
  min-width: 120rpx;
  padding: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 70rpx;
  border: 1px solid #1affe8;

}

.text_14 {
  color: #000000;
  min-width: 120rpx;
  padding: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 70rpx;
  font-size: 14px;
  border: 1px solid #1affe8;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);

}

.image_10 {
  opacity: 0.5;
  width: 64rpx;
  height: 64rpx;
}

.button {
  position: fixed;
  // #ifdef MP
  bottom: 60rpx !important;
  //#endif 

  // #ifndef MP
  bottom: 140rpx !important;
  //#endif 
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  /* margin: 44rpx 32rpx 0 24rpx; */
  padding: 32rpx 0;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}

.text_15 {
  color: #000000;
  font-size: 36rpx;
  font-family: PingFangSC-Medium;
  line-height: 33rpx;
}

.equal-division_2 {
  background-color: #ffffff;
  backdrop-filter: blur(60rpx);
}

.equal-division-item_2 {
  padding: 8rpx 0;
  width: 188rpx;
}

.space-y-6>view:not(:first-child),
.space-y-6>text:not(:first-child),
.space-y-6>image:not(:first-child) {
  margin-top: 12rpx;
}

.section_11 {
  background-color: #00000000;
  width: 48rpx;
  height: 48rpx;
}

.font_6 {
  font-size: 20rpx;
  font-family: PingFangSC;
  line-height: 18rpx;
  color: #ffffff;
}

.text_16 {
  color: #1affe8;
}

.group_10 {
  margin-left: 92rpx;
}

.image_11 {
  width: 48rpx;
  height: 48rpx;
}

.text_17 {
  line-height: 19rpx;
}

.group_11 {
  margin-left: 92rpx;
}

.space-y-4>view:not(:first-child),
.space-y-4>text:not(:first-child),
.space-y-4>image:not(:first-child) {
  margin-top: 8rpx;
}

.pos_2 {
  position: absolute;
  right: 0;
  top: 0;
}

.text_18 {
  line-height: 19rpx;
}

.content-box {
  width: 678rpx;
  height: 1074rpx;
  background: var(--bg-color);
  border-radius: 30rpx;
  padding: 32rpx;
  color: var(--text-color);

  .title {
    font-size: 36rpx;
    font-weight: bold;
  }

  .video-box {
    width: 100%;
    height: 818rpx;
    margin: 32rpx 0;
  }

  .skip-btn {
    width: 256rpx;
    height: 84rpx;
    line-height: 84rpx;
    border-radius: 48rpx 48rpx 48rpx 48rpx;
    border: 2rpx solid #FFFFFF;
    font-size: 32rpx;
    font-weight: 500;
    color: #F4F4F4;
    text-align: center;

    &.skip-btn-while {
      background-color: #F2F2F2;
      color: #000;
      border: 0;
    }
  }
}

.disabled-rule-image {
  opacity: 0.7;
}
</style>