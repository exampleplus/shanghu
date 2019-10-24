<template>
    <div class="content">
        <tab-bar :selectNavIndex="selectNavIndex"></tab-bar>
        <div class="user-top">
            <div class="userInfo" v-if="isAuth">
                <img :src="userInfo.headimgurl" class="avator">
                <div class="nick">
                    <p class="nickName">{{userInfo.nickname}}</p>
                    <div class="levelWrapper">
                        <span class="level" v-if="userInfo.isLogin">尊贵会员</span>
                        <span class="level" v-if="userInfo.isDesigner">认证设计师</span>
                        <span class="level" v-if="userInfo.isMerchant">认证商家</span>
                        <span class="level" v-if="userInfo.isDistributor">认证推广商</span>
                    </div>
                </div>
            </div>
            <div class="userInfo" v-else>
                 <img src="/static/images/icon-avator.png" class="defaultAvator">
                 <p class="unregi" @click="_login">立即登陆</p>
                 <!-- <div class="btn-regi" @click="goRegi">
                     注册
                 </div> -->
            </div>
        </div>
        <div class="menu">
            <div class="menuItem" @click="goMyorder">
                <div class="myOrder">
                    <img src="/static/images/icon-order.png" alt="">
                </div>
                <p>我的订单</p>
            </div>
            <div class="menuItem" @click="quitOrder">
                <div class="afterSale">
                    <img src="/static/images/icon-afterSale.png" alt="">
                </div>
                <p>退款/售后</p>
            </div>
            <div class="menuItem"  @click="teamOrder">
                <div class="teamOrder">
                    <img src="/static/images/icon-teamOrder.png" alt="">
                </div>
                <p>团队订单</p>
            </div>
            <div class="menuItem"  @click="bargainOrder">
                <div class="bargainOrder">
                    <img src="/static/images/icon-bargainOrder.png" alt="">
                </div>
                <p>砍价订单</p>
            </div>
        </div>
        <div class="sheet">
            <ul class="tabList">
                <li @click="shopCart">
                    <div class="icon-wrapper">
                        <img src="/static/images/icon-mycart.png" alt class="bell">
                    </div> 
                    <span>购物车</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li @click="myAddress">
                    <div class="icon-wrapper">
                         <img src="/static/images/icon-address.png" alt class="rmb">
                    </div>
                    <span>收货地址</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li  @click="myInvoince">
                    <div class="icon-wrapper">
                          <img src="/static/images/icon-invoice.png" alt class="rmb">
                    </div>
                    <span>我的发票</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li  @click="myCollect">
                     <div class="icon-wrapper">
                          <img src="/static/images/myCollect.png" alt class="user">
                    </div>
                    <span>我的收藏</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
            </ul>
         </div>

          <div class="sheet">
            <ul class="tabList">
                <li @click="becomeDesigner" v-if="!userInfo.isDesigner">
                     <div class="icon-wrapper">
                          <img src="/static/images/icon-designer.png" alt class="designer">
                    </div>
                   
                    <span>成为设计师</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <!-- <li @click="becomeStore1">
                    <img src="/static/images/icon-store.png" alt class="store">
                    <span>成为设计师</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li> -->
                <li @click="becomeStore" v-if="!userInfo.isMerchant">
                     <div class="icon-wrapper">
                          <img src="/static/images/icon-store.png" alt class="store">
                    </div>  
                    <span>成为商家</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
            </ul>
         </div>

          <div class="sheet">
            <ul class="tabList">
                <li @click="designerManager" v-if="userInfo.isDesigner">
                     <div class="icon-wrapper">
                         <img src="/static/images/icon-designerManager.png" alt class="designerManager">
                    </div>
                    <span>设计师管理</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li @click="storemanager"  v-if="userInfo.isMerchant">
                     <div class="icon-wrapper">
                           <img src="/static/images/icon-storemanager.png" alt class="storemanager">
                    </div>
                    <span>店铺管理</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                 <li @click="lowerManager"  v-if="userInfo.isDistributor">
                    <div class="icon-wrapper">
                        <img src="/static/images/icon-lower.png" alt class="lower">
                    </div>
                    <span>推广管理</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
            </ul>
         </div>

         <div class="sheet">
            <ul class="tabList">
                <li class="contact-li"> 
                    <button open-type="contact" class="contact-btn">
                         <div class="icon-wrapper">
                               <img src="/static/images/icon-contect.png" alt class="contect">
                         </div>
                        <span>联系客服</span>
                        <img src="/static/images/user-arrow-right.png" alt class="arrow">
                    </button>
                </li>
            </ul>
         </div>

         <!-- <div class="sheet">

         </div> -->
    </div>
</template>
<script>

import { getUserInfo, getUserInfos, checkDesignerProcess, checkShopProcess} from "@/api/api";
import { toast } from "@/utils/index";
import tabBar from "@/components/tabBar";
export default {
    data() {
        return {
            selectNavIndex:2,
            headimgurl:'',
            nickName:'',
            isLogin:false,
            isAuth:false,
            checkDesigner:true,
            checkShop:true
            // userInfo:{}       
        }
    },
    components:{
        tabBar
    },
    onShow() {
         const token = wx.getStorageSync('token')
         if(!token){
            this.isAuth = false;
         } else {
             this.isAuth = true;
         }


        wx.hideTabBar();
        wx.removeStorageSync("typeMatiralId");
        wx.removeStorageSync("collect")
        wx.removeStorageSync("typeGoodsId")
        wx.removeStorageSync("collectGoods")
        wx.removeStorageSync("typeDesignerId")
        wx.removeStorageSync("collectDesigner")
        wx.removeStorageSync("typeStoreId")
        wx.removeStorageSync("collectStore")

         this._getUserInfo();
    
         this._checkDesignerProcess();
         this._checkShopProcess();

        //  wx.setStorageSync("backUrl",'/pages/user/main')
    },
    computed:{
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
   
    methods:{
        //去授权
        _login() {
            let url = '/pages/authorization/main';
            wx.navigateTo({url})
        },
        //获取用户信息
        _getUserInfo() {
              this.$store.dispatch('updateUserData').then(res => {
                  console.log(res)
              })
            // wx.showLoading({title:"加载中"})
            // getUserInfo().then(res => {
            //     if(!res.data.code) {
            //         wx.hideLoading();
            //         this.userInfo = res.data;    
            //         this.headimgurl = res.data.headimgurl;
            //         this.nickName = res.data.nickname
            //     } else {
            //         toast(res.data.msg)
            //     }
            // })
        },
     
        goMyorder() {
            const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                 let isLogin = this.userInfo.isLogin;
                 if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/order/myOrder/main';
                    wx.navigateTo({url})
                }
            }
        },
        quitOrder() {
            const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                 let isLogin = this.userInfo.isLogin;
                 if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/order/quitOrder/main';
                    wx.navigateTo({url})
                }
            }
        },
        teamOrder() {
            const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/order/teamOrder/teamOrders/main';
                    wx.navigateTo({url})
                }
            }
        },
        bargainOrder() {
            const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/order/bargainOrder/main';
                    wx.navigateTo({url})
                }
            }
        },
        shopCart() {
             const token = wx.getStorageSync('token')
             if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/shoppingCart/main';
                    wx.navigateTo({url})
                }
            }
        },
        myAddress() {
             const token = wx.getStorageSync('token')
             if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/myAddress/main';
                    wx.navigateTo({url})
                }
            }
        },
        myInvoince() {
             const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/myInvoince/main';
                    wx.navigateTo({url})
                }
            }
        },
        myCollect() {
             const token = wx.getStorageSync('token')
             if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/myCollect/main';
                    wx.navigateTo({url})
                }
            }
        },
        //校验设计师审核状态
        _checkDesignerProcess() {
            checkDesignerProcess().then(res => {
                if(!res.data.code) {
                    this.checkDesigner = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        becomeDesigner() {
             const token = wx.getStorageSync('token')
           if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                let checkDesigner = this.checkDesigner;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    if(checkDesigner == true) {
                        let url = '/pages/personalCenter/becomeDesigner/main';
                        wx.navigateTo({url})
                    } else {
                        toast("正在审核中")
                    }
                }
            }
        },

        _checkShopProcess() {
            checkShopProcess().then(res =>{
                if(!res.data.code) {
                    this.checkShop = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        becomeStore() {
             const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                let checkShop = this.checkShop;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    if(checkShop == true) {
                        let url = '/pages/personalCenter/becomeStore/main';
                        wx.navigateTo({url})
                    } else {
                            toast("正在审核中")
                    }
                }
            }
            
        },

        becomeStore1() {
              let url = '/pages/personalCenter/becomeDesigner/main';
              wx.navigateTo({url})
        },
        designerManager() {
             const token = wx.getStorageSync('token')
             if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                 let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/designer/designerManager/main';
                    wx.navigateTo({url})
                }
            }
            
        },

        storemanager() {
              const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/storeManager/main';
                    wx.navigateTo({url})
                }
            }
             
            
        },
        lowerManager() {
            const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let isLogin = this.userInfo.isLogin;
                if(!isLogin) {
                    wx.navigateTo({url:'/pages/regisiter/main'})
                } else {
                    let url = '/pages/personalCenter/distributionManager/main';
                    wx.navigateTo({url})
                }
            }
             
        },
    },
     onLoad() {
        this._getUserInfo();
    },
}
</script>

<style lang='less' scoped>
@import '../../common/styles/elements';
    .content {
        background: #f6f6f6;
        .user-top {
            width: 100%;
            height: 121px;
            position: relative;
            padding-top:27px;
            padding-left:20px;
            box-sizing:border-box;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAADyAQMAAAAoWNJAAAAABlBMVEU2Nzc0NTXeWbIoAAAJIUlEQVR42uWcva/SUBjGT62GGzQ2DsYRTLyJg+ifAEFNDHeVmDDgLrNxLKOji3Ht4ODgRwfUxYBh1EQWXRwuqxH8GGw6oK14FR+F85xzPG0TjU10kOR3n7z8fHl6gCu6qem12xEbl//joQvi1ytdXZ/FA2P8l9tVhn9XZfjYGB9Hm+nrPx66wfATY/x03GDpnz1l+NT4SuY0/ef+7z8U+JkxfjajT+2MPrUj8/hhn6VPApb+mjE9OkfTRw2SPqP3dan3/j/tvf8fet8r1PuEez/8l71PuPdn/sB78fd5PzXFTwr2/o3Ce4bvmXt/5S/xPv2nvU+tvA9svI/z8J6aY+79CxvvP5ibc4cNZ4nJ7P1i1mL4xe/eO7l57+u8v5TJ+9VDgqXvGoffpcNJXjeyeA+5Sfp5laQ39z6OQ74UcvD+2ZikX/fesfP+Ok0/594vsni/eqiR3fshn/0T6n3b3PuGjfdT09F3LjB80qHDqWXx3tF6/ziT96tXgj7DP8/ivaP1/rQBGHKzpSAYvjcz9v4CSb/uvfvr7A3Eh9wk/YDO3tz7V4LOPhIsfedyBu+d1UMiu/d3Tb13rbyH3MBrvT87Mb6thdzrOcfEnIzeO1rvd0y9n0m8d1feU3MeGXs/CGj6QZ/hD1yzrjkAvaTpW90M9d6F9wS//SDDcU5p9V9i7V+BP2buPU0f86XQnEzt630J3pP0hz5Y39Yi55ym3+mZrvsrgqVfvKWzH4ys6z1AIff+UgbvvR+PnaPpy90M9b4E7wl+u5ah3nvSO14PeHH0cWxZc5Az/kTTN59P7et9ZfVSQNMb3/3Mr9PhJG9o+oO9mWXNQfrFFZ7+8ci25iB9SNM7bd+y5iB9dI6mL3cu29f7Crxnw6nZ1hyct3yprv9QDMfU+6hP08chTb+vObGsOUj/YkzTi8O2p/fAJ9f57Hdm1u9a4RiTp380sl33SB9SvL7owG1+jEnxhgs/Qc0hb1sR/PYZ63Uv5I/Vf8UfjWOjdf+QDyfms0fR0a97fpzD02+ZFZ3313n6z32K5wtff5rjpPCe4cXISPxhIEmPxyjeaZut+4b2thYjAx4LX7fuKT55rRpO7YNJu8e6lzTYKk1vuPDj6IZQ3NZy/D4j8Seyde/Ce4oXh63XPeo9x6PhK7XvCV7vZ5sn1MA/Gtmte6QfKGZPG75+3ZdwW8vTl7uW7R71XoXfrtmuew8ViOLR8DXtntf7SJW++XyibznSde9Jb2ud3/Fbp03a/ZYCP+fpsfB1hzm83r8VNL2h+IOA4HFby/Dnr+m1bwvJVZfe1rpr3re6Bi2HDAfe0/TbD6wOc1DvA1V6cSuOtdpHfY6PPynxWPjKwxz+kb2xCk+OdPh7tcDjQYZn4vOWg0tec0pr+EDfdIZhX5E+VKY/0LZpOUgfNZTpy52u9gxTNZxd9XD0TefLPZn2jvy1wFvDO48hPtP+hgIfh4r0aDralsNrDk/PxectB+lR7zl+B+LzlsNrjvy2FvjBaGSjvYt6T9NT8XnLQXrUe55eL34C7aU1p6HGVzXif4HZ0ldy6W0t8EcgPtE+ZHjUe56+OYb4cu2x0SWccUOdXpz+YKo9rzkcfxDiE+1h9iZnMZOsaeAhPtc+UA1n0Ofpifh67cF5qUtf7nZ12nN80tHhj0N8vfbgyD+vlm7gIT7VnuPjSJOei8+1R8zpWJdenPqg057jkzc6PMTn2vPTnJb0n4GH+Fx7jk9CRfqV+PEfa++i5ijSY+PTbt8ieNQcjicbn5ccvJpIT+/dDTzE59pzfBwq0mvFnzLtPdQcXXpedbj2HmqODr9FxV/MoL38rpbXe6QPIT4pOTT9k0CPP9C+Rm9pob103UebPxV4iD9Va8/vahv69NXaPXaSg9Ma+eKdV9XpVx0/llmPbk+Gg5qjwO9rPpebP3mGGiNfXWPaAYEXh+6zk5w7QjMczVO76vgzufYtgk9Rc/Tpg0dy84cDor2Dr2EZ4J3z8pUfnRdCjT/HOiDwe6c6Xan1OMmRr/ukY4IX27UP0mV/gmhfIh/L9+X4mxLz4+X1sK9OH39Up8fKn0xly76h3scvxkbpt069l71dhQNMMpzkjhH+4Kb5C77sIeD6CWcqx4uBxPwROg7DJ2ZPrTgA8yXLnq/7hiY9Vn53d836bqelwSe7hsOpbpr/jlqPIayVf4fhnYffzI8h/Z71Nyge694Iv2/P/Omv0j8j1mMIvOYAD/Op9Rw/F/r0MH+2wKZfWk+eWWAWM/pKDjzMH/0q/aMw6FM87mp1w4H51355aqP2eWo9MC+FYfp95dY39ZM9nZPdpfSdFmbPVk5Hj4f5995B+m/WU+09su49jnf2dj6uCNZTfBzp8TD/2fPJ8pp+++u5ynpRIXe1FY4XW4fuvn+/cv79/C63Hgvzjj49zN/p9WY/rl5v5wLH13FXa5xeBINHw9HeNRwOBmGgxyehER7qt9tXr15d/n3+vFBcPln3dRW+3Gp1Okv5u53l1Wop8CnWvQEe6m/XaveWV21bJj0cZm/k+kr8kZsPv6/9hw8hvQIfxzf+JH2z2Rz/uJrNBse7ZN2LlODh/qlTp+6eOrkF6VX4uTAZDug7P66WEl8i616bPgjCb1cQ9FV4j6x7jse1f/9+obkqZN07Wny5XG4t/5jhk44pHu7vXWp8nXzZ3OV4fnF8HFngG1q8T9Z9KZ/0eCO3iOE4KVn3Xr74JCxiOC778qGXDx7rvgi8x9Z9JVc8DntyxVfYuq/ni5+LIvA+W/d+Pnis+yLS/wRcJA9kxGPdFzAcl/2OBSfNFR9/KmI4JXxup4j0HtZ9EfgK+zKKmys+HQZF4Ots3Zdywfv4dHIReJxfV8lzngXvkC+j5IR36a+SquSDx7ovAF/C6T5RKhMeEw77BeAr9J1c3w5PMu52ihiOTz+dnFrhGSQOCxiOk6LlsEey46E9H46d9nTd54pPB0EBw6nQ7x6W8sGj5RQwnDr9dLKXB97Hui9iOClrOaKSBQ890HLyH47LP51cJ3g77YdhAcPx+G/U8QneUvsLBQzHpy1HpLng0XIKwPNfmOlY4SljLvLHl/gvzHRzxSdhP398hX9erZQnPtltFYD3+XewvA38V05LnJmLlWu0AAAAAElFTkSuQmCC");
            background-size: cover;
            background-repeat: no-repeat;

            // .userTopImg {
            //     width: 100%;
            //     height: 100%;
            //     position: absolute;
            //     left: 0;
            //     right: 0;
            //     top: 0;
            //     bottom: 0;
            //     z-index: -1;
            // }
            .userInfo {
                display: flex;
                align-items: center;
                .avator {
                    width:64px;
                    height:64px;
                    border-radius: 50%;
                    margin-right: 15px;
                }
                .nick {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 64px;
                    .nickName {
                        font-size:20px;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                    }
                    .levelWrapper {
                        .level {
                            display: inline-block;
                            height:16px;
                            line-height: 16px;
                            padding:2px 6px;
                            text-align: center;
                            font-size:11px;
                            color:rgba(246,246,246,1);
                            background:rgba(255,255,255,0.2);
                            border-radius:8px;
                            margin-right: 5px;
                        }
                    }
                }
                .defaultAvator {
                    width: 60px;
                    height: 60px;
                    margin-right: 10px;
                }
                .unregi {
                    font-size:20px;
                    font-weight:700;
                    color:rgba(255,255,255,1);
                }
                .btn-regi {
                    width:62px;
                    height:23px;
                    line-height: 23px;
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    background:rgba(255,81,0,1);
                    border-radius:12px;
                    margin-left: auto;
                }
            }
        }
        .menu {
            background:rgba(255,255,255,1);
            border-radius:10px 10px 0px 0px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: -10px;
            position: relative;
            padding-top: 18px;
            margin-bottom: 10px;
            padding-bottom: 13px;
            .menuItem {
                display: flex;
                flex-direction: column;
                align-items: center;
                p {
                    font-size:11px;
                    color:rgba(9,2,3,1);
                }
                .myOrder {
                    width: 29px;
                    height: 27px;
                    margin-bottom: 8px;
                    img {
                        width: 27px;
                        height: 25px;
                    }
                }
                .afterSale {
                    width: 29px;
                    height: 27px;
                    margin-bottom: 8px;
                    img {
                        width: 25px;
                        height: 25px;
                    }
                }
                .teamOrder {
                    width: 29px;
                    height: 27px;
                    margin-bottom: 6px;
                    img {
                        width: 26px;
                        height: 27px;
                    }
                }
                .bargainOrder {
                    width: 29px;
                    height: 27px;
                    margin-bottom: 8px;
                    img {
                        width: 29px;
                        height: 27px;
                    }
                }
            }
        }
        .sheet {
            background: #fff;
            margin-bottom: 10px;
            &:last-of-type {
             padding-bottom: 60px;
            }
            .tabList {
                display: flex;
                flex-direction: column;
                li {
                    display:flex;
                    align-items:center;
                    padding:32rpx 0rpx;
                    // border-bottom:2rpx solid #f5f5f5;
                    margin-left:15px;
                    padding-right:15px;
                    .border-bottom(#f5f5f5);
                    .icon-wrapper {
                        width: 20px;
                        height: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 18px;
                    }
                    .bell {
                        width: 20px;
                        height: 18px;
                        // margin-right: 18px;
                    }
                    .rmb {
                        width: 16px;
                        height: 15px;
                        // margin-right: 18px;
                    }
                    .share-user {
                        width: 16px;
                        height: 15px;
                        // margin-right: 18px;
                    }
                    .user {
                        width: 14px;
                        height: 16px;
                        // margin-right: 18px;
                        background: none;
                    }
                    .designer {
                        width: 15px;
                        height: 17px;
                        // margin-right: 18px;
                    }
                    .store {
                        width: 18px;
                        height: 18px;
                        // margin-right: 18px;
                    }
                    .designerManager {
                        width: 19px;
                        height: 19px;
                        // margin-right: 18px;
                    }
                    .storemanager {
                        width: 16px;
                        height: 16px;
                        // margin-right: 18px;
                    }
                    .lower {
                        width: 18px;
                        height: 15px;
                        // margin-right: 15px;
                    }

                    .contect {
                        width: 18px;
                        height: 18px;
                        // margin-right: 18px;
                    }
                    span {
                        flex: 1;
                        font-size: 28rpx;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(51, 51, 51, 1);
                    }
                    .arrow {
                        width: 8px;
                        height: 14px;
                    }
                    &.contact-li {
                        display: block;
                    }
                    .contact-btn {
                        display:flex;
                        align-items:center;
                        background: transparent;
                        padding: 0;
                        line-height: inherit;
                        border-radius: 0;
                        text-align: left;
                        &::after {
                            border: none;
                        }
                         .contect {
                            width: 18px;
                            height: 18px;
                            // margin-right: 18px;
                        }
                        span {
                            flex: 1;
                            font-size: 28rpx;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            color: rgba(51, 51, 51, 1);
                        }
                        .arrow {
                            width: 8px;
                            height: 14px;
                        }
                    }
                }
            }
        }
    }
</style>