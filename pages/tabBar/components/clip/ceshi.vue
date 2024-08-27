<template>
    <view>
      8
      <image class="shstatuss" style="width:40rpx;height:40rpx;visibility: hidden" :src="params.statusBox? '/static/img/clip/status_active.png':'/static/img/clip/status.png'"/>
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
    statusbox:{
      type:Boolean,
    }
	},
	data() {
		return {

		};
	},
	methods:{
		
	}
}
</script>

<style lang="scss" >

</style>
