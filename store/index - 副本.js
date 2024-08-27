import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
	state:{
		token: '',
        userInfo: {} ,
        getuserInfo:{},
	},
    mutations: {  
        appLogin(state, provider) {
            console.log("[appLogin]",provider);
            state.hasLogin = true;  
            state.hasActive = provider.active;  
            state.userInfo = { ...state.userInfo, ...provider };
            state.token = provider.token; 
            uni.setStorageSync('login', provider);

            let my_inviter = Number(provider.id).toString(16);
            
            uni.setStorageSync('myInviter', my_inviter);

            getApp().globalData.my_inviter = my_inviter;
            getApp().globalData.sharePath = `/pages/index/index?inviter=${my_inviter}`;
        },
        getuserInfo(state, provider) {
            state.getuserInfo = { ...state.userInfo, ...provider };
        },
        appLogout(state) {  
            state.hasLogin = false;  
            state.hasActive = false;  
            state.userInfo = {}; 
            state.token = '';
        },
        changPhone(state, phone) {
            state.userInfo["phone"] = phone;
        },
        changInfo(state, info) {
            console.log({state, info});
            state.userInfo.name = info.name;
            // ?t=时间戳 在后端加，避免重进后仍然读取缓存
            state.userInfo.avatar = info.avatar;
        },
    }
})
export default store