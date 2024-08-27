<template >
  <view class="page">
    <view class="cropper">
      <nav-bar
        :backState="1000"
        :homeState="1000"
        title="图片裁剪"
      />
      <bt-cropper
        :imageSrc="imageSrc"
        @change="onChange"
        ref="cropper"
      ></bt-cropper>
      <button
        class="button"
        @click="crop"
      > 确定 </button>
    </view>
  </view>
</template>

<script>
import btCropper from '../uni_modules/bt-cropper/components/bt-cropper/bt-cropper.vue';

export default {
  components: {
    'bt-cropper': btCropper,

  },
  name: "cropper",
  data() {
    return {

      imageSrc: '', //原图地址
    };
  },
  onLoad(options) {
    this.imageSrc = decodeURIComponent(options.src)
  },
  methods: {
    onChange(ev) {
      console.log(ev)
    },
    crop() {
      this.$refs.cropper.crop().then(res => {
        uni.redirectTo({
          url: '/plaboratory/box?url=' + res + "&type=1"
        })
        // this.$emit('getupdateUrl', res)
        // uni.$emit('updateUrl', res)
        // uni.navigateBack({
        // 	delta: 1
        // })
      })
    }
  }
}
</script>

<style lang="scss">
.page {
  background: rgba(0, 0, 0, 0.8);
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.cropper {
  margin: 0 auto;
  width: 100%;
  height: 70vh;
}

.button {
  position: fixed;
  bottom: 140rpx !important;
  left: 30rpx;
  right: 30rpx;
  z-index: 99;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  height: 96rpx;
  line-height: 96rpx;
  background-image: linear-gradient(90deg, #61ffff 0%, #29ffaf 100%);
  border-radius: 48rpx;
  box-shadow: 0px 16rpx 32rpx #00dbc533;
}
</style>
