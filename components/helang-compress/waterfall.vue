<template>
  <view class="wrap">
		<u-waterfall v-model="list" ref="uWaterfall">
			<template v-slot:left="{leftList}">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="index" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
					<u-lazy-load threshold="-450" border-radius="10" :loading-img="item.detailUrl" :image="item.thumbUrl" :index="index"  @click="draftlist(item.id)" ></u-lazy-load>
          <view class="chuang" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
            <button class="item button titlee" open-type="share" :data-img="item.detailUrl">
              <image :src="cueTheme=='day-theme'?'../../static/img/clip/share-0.png':'../../static/img/clip/share.png'"/>
            </button>
            <view class="item" style="color:#1AFFE8;"><image src="../../static/img/clip/stars.png"/> {{item.likeCount}}</view>
          </view>
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
					<u-lazy-load threshold="-450" border-radius="10" :loading-img="item.detailUrl" :image="item.thumbUrl" :index="index"  @click="draftlist(item.id)" ></u-lazy-load>
          <view class="chuang" :style="{'background':cueTheme=='day-theme'?'#f5f5f5':'#262628'}">
            <button class="item button titlee" open-type="share" :data-img="item.detailUrl">
              <image :src="cueTheme=='day-theme'?'../../static/img/clip/share-0.png':'../../static/img/clip/share.png'"/>
            </button>
            <view class="item" style="color:#1AFFE8;"><image src="../../static/img/clip/stars.png"/> {{item.likeCount}}</view>
          </view>
				</view>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
  import waterfallitem from'./waterfallitem'
export default {
	props:{
		list:{
			type: Array,
			default(){
				return {}
			}
		},

    tabIndex:{
      type:String,
      default(){
				return {}
			}
    }

	},
  data() {
    return {
      pic: "曾兴",
      canvasSize: {
        width: 0,
        height: 0,
      },

    };
  },
  methods: {

     
    //  清空列表数据
    clearList(res){
      this.$refs.uWaterfall.clear();
    },

    draftlist(id){
      if(!getApp().globalData.getLogin()){
        return;
      }
      console.log(this.tabIndex)
      if(this.tabIndex ==2){
        uni.navigateTo({
          url: '/pclip/largedetali?albumId=' +id 
        })
      }else{
        uni.navigateTo({
          url: '/pclip/large?albumId=' +id 
        })
      }
		},


    boxImg(index){
      let that =this;
      let list =that.list;
      list[index].statusBox = !list[index].statusBox
      that.list =list;

      console.log(this.list)
      console.log('我被点击了')
      this.$emit("done",{b:this.pic});
    }
  },
};
</script>

<style lang="scss" scoped>
.demo-warter {
  border-radius: 8px;
  margin: 5px;
  background: #262628;
  padding: 8px;
  position: relative;
  text-align: right;
}
.chuang {
      color: white;
      font-size:28rpx;
      line-height: 90rpx;
      height:90rpx;
	    padding:0 20rpx;
      background: #262628;
      display: flex;
      justify-content: space-between;
      border-radius:0 0 14rpx 14rpx ;
      .title2{
        width:120rpx;
        overflow: hidden;
      }
      .shstatuss{
        width:40rpx;
        height:40rpx;
        margin-top: 10rpx;
      }
      .button{
        // line-height: 22rpx;
        // color: white;
        background:none;
        margin:0 !important;
        padding: 0;
       
      }
      .item{
        image{
          width:40rpx;
          height:40rpx;
          position: relative;
          top: 8rpx;
        }
      }
    }

    .shstatus{
      width:50rpx;
      height:50rpx;
    }

</style>
