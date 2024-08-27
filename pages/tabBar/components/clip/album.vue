<template>
  
    <view class="picture">
      <image :src="params.thumbUrl" mode="widthFix" style="width:100%"  @click="draftlist(params.id)"/>
      <image class="icon" v-if="statusBox" :src="params.statusBox? '/static/img/clip/status_active.png':'/static/img/clip/status.png'"/>
      {{ params.statusBox }}
    </view>
</template>

<script>

export default {
	name:"",
	options:{},
	props:{
		params:{
			type: Object,
			default(){
				return {}
			}
		},
    albumList:{
      type: Array,
			default(){
				return {}
			}
    }
	},
	data() {
		return {
      statusBox:true,
		};
	},
  observer:{
			"$props.params"(newValue,oldValue){
				console.log(newValue,'111')
        console.log(oldValue,'222')


			}
		},
	methods:{
		draftlist(){
      let that =this;
      console.log(that.albumList,'albumList')
      that.params.statusBox =!that.params.statusBox
      console.log(that.params.statusBox )
    }
	}
}
</script>

<style lang="scss" scoped>
  .picture {
    position: relative;
  }
  .picture .icon{
    position: absolute;
		top: 20rpx;
		left: 20rpx;
		width:50rpx;
		height:50rpx;
		z-index: 9;
  }
</style>
