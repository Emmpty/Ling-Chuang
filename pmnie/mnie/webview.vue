<template>
  <!-- #ifdef MP -->
  <web-view :src="mpurl"></web-view>
  <!-- #endif  -->
</template>

<script>
export default {
  data() {
    return {
      mpurl: 'https://m.drawai.cn/docs/1610611105528926209',
    }
  },
  onLoad: function (optics) {
    let that = this;

    if (optics.url) { //灵石提现轮播地址 以及 邀请好友查看规则
      that.mpurl = optics.url;
      return
    }

    if (optics.type == 1) { //加入群聊
      that.mpurl = 'https://m.drawai.cn/docs/1611281992580759553'
    } else if (optics.type == 2) {
      let bannerImgs = getApp().globalData.jsonGoods.banner;
      // 从轮播图过来的
      that.mpurl = bannerImgs[optics.index].url;
    } else if (optics.type == 3) {
      // 招募推广大使
      that.mpurl = 'https://m.drawai.cn/docs/1620662665770827777'
    } else if (optics.type == 4) {
      // 帮助中心
      that.mpurl = 'https://mp.weixin.qq.com/s?__biz=Mzg4Mjg5NDc1OA==&mid=2247484053&idx=1&sn=785146c82eb728cddeb5beedcd391d67&chksm=cf4ef05cf839794ad69c2c01805ee0c04d9d095aae74c90b09e5002a19f96931f6f0314b8d66#rd'
    } else if (optics.type == 5) {
      // 抖音AI作品发布规则
      that.mpurl = 'https://m.drawai.cn/docs/1664548318782595074'
    } else if (optics.type == 6) {
      // 会员充值 更多权益链接
      that.mpurl = 'https://m.drawai.cn/docs/1677153370466619393'
    } else if(optics.type==7){
      // 做任务 关注公众号
      that.mpurl = 'https://mp.weixin.qq.com/s?__biz=Mzg4Mjg5NDc1OA==&mid=2247492736&idx=1&sn=b6258fe9870ad40fe7534192ff83a00b&chksm=cf4d1649f83a9f5f85714c6fecb631eaa6e00fc349c264300042230c8742708e40f4fa5ec298&token=1884085272&lang=zh_CN#rd'
    }else if(optics.type==8){
      that.mpurl = 'https://m.drawai.cn/docs/1686961937088409601'
    }else{
      // 招募推广大使
      that.mpurl = getApp().globalData.jsonGoods.promotion
      // return
    }
    // #ifndef MP
    window.location.href = that.mpurl;
    // #endif 
  },
  // #ifdef MP
  onShareAppMessage() {
    return {
      path: getApp().globalData.sharePath,
      title: getApp().globalData.shareTitle,
      imageUrl: getApp().globalData.shareImage,
    };
  },
  // #endif
}
</script>

<style></style>