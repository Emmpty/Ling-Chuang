<template>
  <view>
    <!-- :style="{ top: top, left: left }" -->
    <image
      class="vip-img"
      v-if="item.level == userVipLevel"
      v-for="(item, index) in vipList"
      :key="item.level"
      :style="imgStyle"
      :src="item.imageUrl"
    ></image>
  </view>
</template>

<script>

export default {
  props: {
    userVipLevel: {
      type: String | Number,
      default() {
        return ''
      }
    },
    imgStyle: {
      type: String | Object,
      default() {
        return {}
      }
    },

  },
  computed: {

  },
  data() {
    return {
      vipList: [
        {
          level: 0, imageUrl: require('@/static/img/payment/vip0.png'),
        },
        {
          level: 1, imageUrl: require('@/static/img/payment/vip1.png'),
        },
        {
          level: 2, imageUrl: require('@/static/img/payment/vip2.png'),
        },
        {
          level: 3, imageUrl: require('@/static/img/payment/vip3.png'),
        },
        {
          level: 4, imageUrl: require('@/static/img/payment/vip4.png'),
        },
      ]
    };
  },
  mounted() {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.vip-img {
  position: relative;
  top: 0rpx;
  width: 146rpx;
  height: 52rpx;
  margin-left: 20rpx;
}
</style>
