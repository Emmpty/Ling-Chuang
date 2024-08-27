<template>
	<view :style="{'background':cueTheme=='day-theme'?'#fff':'#141416'}">
		<view class="waterfall-box h-flex-x h-flex-2" v-if="showList">
			<view>
				<view v-for="(item,index) in leftList" :key="item._render_id" 
					class="list-item" 
					:class="{'show': showPage > item._current_page }"
				>
					<helang-waterfall-item
						:params="item" 
						tag="left"
						:index="index"
						:statusBox="statusBox"
						@height="onHeight"
						@click="onClick"
						
					></helang-waterfall-item>
				</view>
			</view>
			<view>
				<view v-for="(item,index) in rightList" :key="item._render_id" 
					class="list-item"
					:class="{'show': showPage > item._current_page }"
				>
					<helang-waterfall-item
						:params="item" 
						:statusBox="statusBox"
						@height="onHeight"
						@click="onClick"
						tag="right"
						:index="index"
					></helang-waterfall-item>
				</view>
			</view>
		</view>
		
		<slot name="default"></slot>
	</view>
</template>

<script>
  import {taskdeleteBatch} from '../../../../static/api/index.js'
	import helangWaterfallItem from "./waterfall-item.vue"
		
	export default {
		name:"helangWaterfallList",
		options:{
			virtualHost: true
		},
		components: {
			"helang-waterfall-item": helangWaterfallItem
		},
		props:{
			// 组件状态
			status:{
				type: String,
				default:''
			},
			// 待渲染的数据
			list:{
				type: Array,
				default(){
					return [];
				}
			},
			// 重置列表，设置为 true 时，瀑布流会自动重新渲染列表
			reset:{
				type: Boolean,
				default:false
			},
			statusBox:{
				type:Boolean,
	
			}
		},
		watch:{
			"$props.status"(newValue,oldValue){
				// 状态变更为 加载成功 时，执行瀑布流数据渲染	
			console.log(newValue,'newValue')
				if(newValue == 'success'){
					this.startRender();
				}else if(!this.showList){
					this.resetData();
				}
			}
		},
		computed:{
			showList(){
				return !["fail","empty"].includes(this.$props.status);
			}
		},
		data() {
			return {
				// 左侧列表高度
				leftHeight: 0,
				// 右侧列表高度
				rightHeight: 0,
				// 左侧列表数据
				leftList: [],
				// 右侧列表数据
				rightList: [],
				// 待渲染列表
				awaitRenderList:[],
				// 当前展示页码数据
				showPage:1,
				collectSize:0,
			}
		},
		mounted() {
			if(this.$props.status == 'success'){
				this.startRender();
			}
		},
		methods: {
			// 监听高度变化
			onHeight(height, tag) {
				// console.log(height,tag,'tagtagtag')
				// console.log(index,height,tag,item,'52222222222222')
				/**
				 * 这个为实际渲染后 CSS 中 margin-buttom 的值，本示例默认为20rpx
				 * 用于解决实际渲染后因为数据条数关系，高度差计算偏差的问题
				 * */
				let marginBottom = uni.upx2px(20);
				// console.log(`左高：${this.leftHeight},右高：${this.rightHeight},当前高：${height},插入方向：${tag}`)
				if (tag == 'left') {
					// console.log(height + marginBottom)
					this.leftHeight += (height + marginBottom);
				} else {
					// console.log(height + marginBottom)
					this.rightHeight += (height + marginBottom);
				}
				this.renderList();
			},

			// 组件点击事件
			onClick(index, tag){
                let that =this;
				let data= tag == 'left'?this.leftList[index]:this.rightList[index];
				if(tag == 'left'){
					that.leftList=that.leftList.map(item=>{
						const{ statusBox,id}=item;
						item.statusBox = data.id==id?!statusBox:statusBox;
						return item;
					})
				}else{
					that.rightList=that.rightList.map(item=>{
						const{ statusBox,id}=item;
						item.statusBox = data.id==id?!statusBox:statusBox;
						return item;
					})
				}
				// 个数统计
                this.$emit("clickBox",that.numberSize());
			},
             
			// 取消选中画册
			albumCancel(res){
				let that =this;
				that.leftList=that.leftList.map(item=>{
					item.statusBox =res? true:false;
					return item;
				})
				that.rightList=that.rightList.map(item=>{
					item.statusBox = res? true:false;
					return item;
				})
				this.$emit("clickBox",that.numberSize());
			},

			// 全部选中
			// selectAll(res){
			// 	let that =this;
			// 	that.leftList=that.leftList.map(item=>{
			// 		item.statusBox =res? true:false;
			// 		return item;
			// 	})
			// 	that.rightList=that.rightList.map(item=>{
			// 		item.statusBox = res? true:false;
			// 		return item;
			// 	})
			// 	this.$emit("clickBox",that.numberSize());
			// },

			// 删除画册
			albumDelete(){
				uni.showModal({
					title: '温馨提示',
					content: '你确认是否删除？',
					success: (res) => {
					if (res.confirm) {
						let that =this;
						var albumList =that.leftList.concat(that.rightList);
						var arr=[];
						albumList.map(item=>{ if(item.statusBox){ arr.push(item.id)}})
						if(arr.length==0){
							uni.showToast({ title: "请选择需要删除的作品",icon:"none",duration: 3000 })
							return
						}
						taskdeleteBatch(arr).then(res => {
							if(res.code ==200){
								uni.showToast({ title: "删除成功", duration: 3000 })
								that.statusbox=false;
								// 本地删除
								const leftList = that.leftList.filter((item, i, arr) => {
								    return !item.statusBox
								})
								const rightList = that.rightList.filter((item, i, arr) => {
								    return !item.statusBox
								})
								that.leftList=leftList;
								that.rightList=rightList;
								
								this.$emit("clickBox",that.numberSize());
							}
						}).catch(err => {})
					}
					}
				})
			},

			// 画册选中个数统计
			numberSize(e){
				let that=this;
				let list = that.leftList.concat(that.rightList)
				const newArr = list.filter((item, i, arr) => {
					return item.statusBox
				})
		        return newArr;
			},

			// 渲染列表，这里实现瀑布流的左右分栏
			renderList() {
				// 待渲染长度为 0 时表示已渲染完成
				if(this.awaitRenderList.length < 1){
					this.showPage++;
					this.$emit("done");
					
					// 为防止 js 数值类型最大值溢出，当高度值大于 1亿时重置高度
					if(this.leftHeight > 100000000){
						if(this.leftHeight > this.rightHeight){
							this.leftHeight = 2;
							this.rightHeight = 1;
						}else{
							this.leftHeight = 1;
							this.rightHeight = 2;
						}
					}
					return;
				}
				let item = {
					...this.awaitRenderList.splice(0,1)[0],
					// 当前数据添加当前页面标识
					_current_page:this.showPage,
					// 当前数据添加一个渲染id，解决 v-for 重复会出现不执行 load 的 BUG
					_render_id:new Date().getTime()
				};

				// console.log(this.leftHeight,'this.leftHeight')

				// console.log(this.rightHeight,'this.rightHeight')
				
				if(this.leftHeight > this.rightHeight){
					this.rightList.push(item);
				}else{
					this.leftList.push(item);
				}
			},
			// 重置数据
			resetData(){
				this.leftHeight = 0;
				this.rightHeight = 0;
				this.leftList = [];
				this.rightList = [];
				this.awaitRenderList = [];
				// 当前展示页码数据
				this.showPage = 1;
			},
			// 启动渲染
			startRender(){
				if(!this.showList){
					this.resetData();
					return;
				}
				
				// console.log('11111')
				if(!this.$props.list || this.$props.list.length < 1){
					console.log('河浪瀑布流插件提示：当前数据为空，不会触发列表渲染');
					return;
				}
				// console.log('222222')
				// 若本次渲染为 重置 则先恢复组件的默认参数
				if(this.$props.reset){
					this.resetData();
				}
				// console.log('33333')
				this.awaitRenderList = [...this.$props.list];
				this.renderList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.waterfall-box {
		padding: 20rpx 10rpx;
		box-sizing: border-box;

		>view {
			padding: 0 10rpx;
		}
		
		.list-item{
			margin-bottom: 0;
			// 设置透明，默认是可视的
			opacity: 0;
			// 默认超出隐藏，不影响加载中的文字显示效果
			overflow: hidden;
			height: 0;
			
			&.show{
				margin-bottom: 20rpx;
				opacity: 1;
				overflow: auto;
				height: auto;
			}
		}
	}

	.h-flex-x {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;

		&.h-flex-2 {
			>view {
				width: 50%;
			}
		}
	}
</style>