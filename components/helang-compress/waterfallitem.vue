<template>
  <view class="wrap">
		<u-waterfall v-model="list" ref="uWaterfall">
			<template v-slot:left="{leftList}">
        <!-- <goodsitem :leftList="leftList"></goodsitem> -->
        <block  v-for="(item, index) in leftList" :key="index">
          <!-- <goodsitem></goodsitem> -->
          <view class="demo-warter">
            <u-lazy-load threshold="-450" border-radius="10" :loading-img="item.detailUrl" :image="item.thumbUrl" :index="index"  @click="draftlist(item.id)" ></u-lazy-load>
            <view class="chuang">
              <button class="item button titlee" open-type="share" :data-img="item.detailUrl"><image src="../../static/img/clip/share.png"/></button>
              <view class="item">
                <view class="shstatuss" :style="{'visibility':statusbox?'show':'hidden'}"></view>
                <!-- <image class="shstatuss" v-if="statusbox" :src="item.statusBox? '../../static/img/clip/status_active.png':'../../static/img/clip/status.png'"/> -->
              </view>
            </view>
          </view>
        </block>
			</template>
			<template v-slot:right="{rightList}">
        <!-- <block  v-for="(item, index) in rightList" :key="index">
           <goodsitem></goodsitem>
        </block> -->
        <!-- <goodsitem :rightList="rightList"></goodsitem> -->
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
					<u-lazy-load threshold="-450" border-radius="10" :loading-img="item.detailUrl" :image="item.thumbUrl" :index="index"  @click="draftlist(item.id)" ></u-lazy-load>
          <view class="chuang">
            <button class="item button titlee" open-type="share" :data-img="item.detailUrl"><image src="../../static/img/clip/share.png"/></button>
            <view class="item">
               <view class="shstatuss" :style="{'visibility':statusbox?'show':'hidden'}"></view>
              <!-- <image class="shstatuss" v-if="statusbox" :src="item.statusBox? '../../static/img/clip/status_active.png':'../../static/img/clip/status.png'"/> -->
            </view>
          </view>
				</view>
			</template>
		</u-waterfall>
	</view>
</template>




<script>
  import goodsitem from'./item.vue'
  // console.log(goodsitem,'goodsitem')
export default {
  components: {
			"goodsitem": goodsitem
		},
	props:{
		list:{
			type: Array,
			default(){
       
				return {}
			}
		},
    statusbox:{
      type:Boolean,
      default:{}
    }
	},
  data() {
    return {
       statusbox:false,
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
      uni.navigateTo({
        url: '/pclip/large?albumId=' +id + "&type="+this.tabIndex + "&private=1"
      })
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
        border: 1px solid red;
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
