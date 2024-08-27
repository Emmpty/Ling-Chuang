<template>
  <view
    class="page-box"
    :class="cueTheme"
  >
    <nav-bar
      title="规则"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>

    <view class="page-content">
      <view class="rule-box">
        <view
          class="rule-item u-flex-col"
          v-for="(item, index) in ruleList"
          :key="index"
        >
          <view class="rule-title">{{ item.title }}</view>
          <view class="rule-detail-box u-flex-col">
            <view
              class="rule-detail-item"
              v-for="(detailItem, detailIndex) in item.list"
              :key="detailIndex"
            >
              {{ detailItem }}
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ruleList: [
        { title: '1、参与资格', list: ['· 活动仅对注册用户开放'] },
        { title: '2、投注规则', list: ['· 每次投注不得少于100灵力', '· 可对同一礼盒进行多次投注'] },
        { title: '3、中奖机制', list: ['· 中奖结果随机生成。投注灵力越多，中奖概率越大', '· 中奖名单将在该礼盒活动结束后公布'] },
        { title: '4、活动时间', list: ['· 每个礼盒的活动时间都不一样，详情可查看礼盒详情'] },
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.page-box {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
}

.page-content {
  position: relative;
  width: 100%;
  color: #fff;
}

.rule-box {
  padding: 38rpx;
}

.rule-item {
  .rule-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 26rpx;
  }

  .rule-detail-box {
    .rule-detail-item {
      font-weight: 500;
      font-size: 28rpx;
    }

    .rule-detail-item+.rule-detail-item {
      margin-top: 28rpx;
    }
  }
}

.rule-item+.rule-item {
  margin-top: 78rpx;
}
</style>
