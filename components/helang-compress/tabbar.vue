<template>
	<view class="tabbar" :style="{'background':cueTheme=='day-theme'?'#fff':'#141416'}">
		<view class="navigator">
			<view class="navigator-item" v-for="(item,index) in tabBar.list" :key="index" @click="switchTab(index,item.pagePath)">
		
				<!-- 白色主题  -->
				<block v-if="cueTheme=='day-theme'">
				<image :src="tabIndex ==index? item.selectedIconPath :item.iconActive" class="icon"></image>
				</block>

				<!-- 黑色主题 -->
				<block v-else>
				<image :src="tabIndex ==index?item.selectedIconPath : item.iconPath " class="icon"></image>
				</block>
				<!-- <img :src="item.iconPath" class="icon" v-if="selectedIndex !== index"> -->
				<!-- <img :src="item.selectedIconPath" class="icon" v-else> -->
				<text :class="tabIndex ==index?'text-active':'item-text'" :style="{'color':cueTheme=='day-theme'?'#000':'#fff'}">{{item.text}}</text>
			</view>
		</view>
	</view>

</template>

 
<script>
	export default {
    props:{
      tabIndex:{
        type: String,
        default(){
          return {}
        }
      },
    },
		data() {
			return {
				selectedIndex: 0,
				showselected: false,
				tabBar: {
					"list": [
					{
                "text": "画廊",
                "pagePath": "/pages/tabBar/gallery",
				"pagePath2": "/pages/tabBar/gallery_white",
                "selectedIconPath": "../../static/img/tabbar/information_tncur.png",
                "iconPath": "../../static/img/tabbar/information_tn.png",
                "iconActive": "../../static/img/tabbar/information_hei.png"
              },{
                "text": "创作",
                "pagePath": "/pages/tabBar/index",
                "selectedIconPath": "../../static/img/tabbar/home_tncur.png",
                "iconPath": "../../static/img/tabbar/home_tn.png",
                "iconActive": "../../static/img/tabbar/home_hei.png", 
              },
              
              {
                "text": "画夹",
                "pagePath": "/pages/tabBar/clip",
				"pagePath2":"/pages/tabBar/clip_white",
                "iconPath": "../../static/img/tabbar/case_tn.png",
                "selectedIconPath": "../../static/img/tabbar/case_tncur.png",
                "iconActive": "../../static/img/tabbar/case_hei.png"
              },
              {
                "text": "我的",
                "pagePath": "/pages/tabBar/mnie",
                "iconPath": "../../static/img/tabbar/mine_tn.png",
                "selectedIconPath":"../../static/img/tabbar/mine_tncur.png",
                "iconActive":"../../static/img/tabbar/mine_hei.png",
              }
              
            ]
				},
			}
		},

		methods: {
			switchTab(index,e) {

				console.log(this.cueTheme,index)
			    let that =this;
				// if(that.cueTheme=='day-theme' && index==1){
				// 	console.log(that.tabBar.list[index].pagePath2)
				// 	uni.reLaunch({
				// 	  url:that.tabBar.list[index].pagePath2,
				// 	})
				// 	return
				// }
				
				uni.switchTab({
					url:e,
				})

				// if(that.cueTheme=='day-theme' && index==2){
				// 	console.log(that.tabBar.list[index].pagePath2)
				// 	uni.reLaunch({
				// 	  url:that.tabBar.list[index].pagePath2,
				// 	})
				// 	return
				// }else{
				// 	uni.switchTab({
				// 	  url:e,
				// 	})
				// }
			}
		},
	}
</script>
 
<style>
	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
    /* padding-bottom: 30rpx; */
		z-index: 999;
		/* background: #F5F5F5; */
		/* border-top: 1rpx solid #eee; */
	}
 
	.navigator {
		display: flex;
		justify-content:space-around;
		margin: 0 auto;
		padding: 20rpx 0;
	}
 
	.navigator-item {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 25%;
		height: 100%;
	}
  .navigator-item img{
    width:44rpx;
    height:44rpx;
  }
 
	.item-text {
		margin-top: 4rpx;
		font-size: 24rpx;
	}
 
	.text-active {
    margin-top: 4rpx;
    font-size: 24rpx;
		color: #1affe8 !important;
	}
 
	.icon {
		width: 20px;
		height: 20px;
	}
</style>