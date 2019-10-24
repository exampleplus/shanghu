// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import {
    getDesignerWallet,
    designerProfit,
    groupOrderDetail,
    getUserInfo
} from '../api/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {},
    state: {
        info: [],
        distributionInfo: [],
        shopWalletInfo: [],
        detailInfo: [],
        userInfo: []
    },
    mutations: {
        RECORD_WALLET: (state, info) => {
            state.info = info
        },
        RECORD_DISTRIWALLET: (state, distributionInfo) => {
            state.distributionInfo = distributionInfo
        },
        RECORD_SHOPWALLET: (state, shopWalletInfo) => {
            state.shopWalletInfo = shopWalletInfo
        },
        RECORD_diyGroupInfo: (state, detailInfo) => {
            state.detailInfo = detailInfo
        },
        record_userInfo: (state, data) => {
            state.userInfo = data
        }

    },
    actions: {
        getDesignerWallet({
            state,
            commit,
            dispatch
        }, params) {
            return new Promise(async(resolve, reject) => {
                const {
                    data
                } = await getDesignerWallet(params)
                commit('RECORD_WALLET', data)
                resolve(data)
            })
        },

        getDistributionWallet({
            state,
            commit,
            dispatch
        }, params) {
            return new Promise(async(resolve, reject) => {
                const {
                    data
                } = await getDesignerWallet(params)
                commit('RECORD_DISTRIWALLET', data)
                resolve(data)
            })
        },

        getShopWallet({
            state,
            commit,
            dispatch
        }, params) {
            return new Promise(async(resolve, reject) => {
                const {
                    data
                } = await getDesignerWallet(params)
                commit('RECORD_SHOPWALLET', data)
                resolve(data)
            })
        },

        //团队订单详情
        getGroupOrderInfo({
            state,
            commit,
            dispatch
        }, params) {
            return new Promise(async(resolve, reject) => {
                const {
                    data
                } = await groupOrderDetail(params)
                commit('RECORD_diyGroupInfo', data)
                resolve(data)
            })
        },
        //用户信息
        updateUserData({ state, commit }) {
            // wx.showLoading({ title: "加载中" })
            return new Promise(async(resolve, reject) => {
                const { data } = await getUserInfo()
                wx.setStorageSync('userInfo', data)
                commit('record_userInfo', data)
                resolve(data)
                    // wx.hideLoading();

            })
        },
    },
    getters: {
        userInfo: state => state.userInfo || wx.getStorageSync('userInfo')
    }
})

export default store