<template>
    <div class="content">
       <div class="user-top">
            <img src="/static/images/bg-userTop.png" alt="">
        </div>
        <div class="userInfo">
            <div class="avator">
             <img :src="userInfo.headimgurl" alt="">

            </div>
            <p class="nickName">{{userInfo.nickname}}</p>
            <div class="status">
                <span>尊贵会员</span>
                <span v-if="userInfo.isDesigner">认证设计师</span>
                <span v-if="userInfo.isDistributor">认证推广商</span>
                <span v-if="userInfo.isMerchant">认证商家</span>
            </div>
        </div>

         <div class="sheet">
            <ul class="tabList">
                <li class="border" @click="myWallet"> 
                    <img src="/static/images/icon-wallet.png" alt class="wallet">
                    <span>我的钱包</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li class="border"  @click="myLower"> 
                    <img src="/static/images/icon-user.png" alt class="lower">
                    <span>我的下级</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                 <li @click="myqrCode" v-if="userInfo.isFirstDistributor && isFirst == true"> 
                    <img src="/static/images/icon-code.png" alt class="code">
                    <span>我的二维码</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
            </ul>
         </div>
    </div>
</template>
<script>
import { getUserInfo } from "@/api/api";
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            isFirst:false,
            userInfo:{}
        }
    },
     onLoad() {
        this._getUserInfo()
    },
    computed:{
        // userInfo() {
        //     return this.$store.getters.userInfo
        // }
    },
    methods:{
        //分销商信息
        _getUserInfo() {
            getUserInfo().then(res => {
                if(!res.data.code) {
                    this.userInfo = res.data;
                    if(res.data.isFirstDistributor == true) {
                        this.isFirst = true
                    } else {
                        this.isFirst = false
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        
        myWallet() {
          
                 let url = '/pages/personalCenter/distributionWallet/main';
                 wx.navigateTo({url})
           
        },
        myLower() {
              let isFirstDistributor = this.userInfo.isFirstDistributor;
             if(isFirstDistributor) {
                   let url = '/pages/personalCenter/distributionLower/main';
                   wx.navigateTo({url})
            } else {
                let url = '/pages/personalCenter/distributionSecondLower/main';
                wx.navigateTo({url})
            }
         
        },
        myqrCode() {
             let url = '/pages/personalCenter/distributionQrcode/main';
            wx.navigateTo({url})
        },
    }
}
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
        background: #fff;
        .user-top {
            width: 100%;
            height: 110px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .userInfo {
            background: #fff;
            width:345px;
            margin: 0 auto;
            height:123px;
            box-sizing: border-box;
            box-shadow:0px 2px 7px 0px rgba(0,0,0,0.07);
            border-radius:4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: -43px;
            position: relative;
            z-index: 2;
            .avator {
                 width: 70px;
                 height: 70px;
                 margin-top: -70px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .nickName {
                font-size:20px;
                font-weight:600;
                color:rgba(9,2,3,1);
                margin: 10px 0;
            }
            .status {
                span {
                    display: inline-block;
                    height:20px;
                    line-height: 20px;
                    text-align: center;
                    background:rgba(246,246,246,1);
                    border-radius:10px;
                    padding: 3px 5px;
                    font-size:12px;
                    color:rgba(155,155,155,1);
                }
            }
        }
          .sheet {
            background: #fff;
            margin-top: 15px;
            .tabList {
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 7px 0px rgba(0,0,0,0.07);
                border-radius:4px;
                display: flex;
                flex-direction: column;
                margin:15px;
                li {
                    display:flex;
                    align-items:center;
                    margin-left:15px;
                    padding-top: 22px;
                    padding-bottom: 22px;
                    padding-right:15px;
                    &.border {
                        border-bottom: 1px solid #eee;
                    }
                   .homepage {
                       width: 15px;
                       height: 16px;
                       margin-right: 15px;
                   }
                   .wallet {
                       width: 16px;
                       height: 14px;
                       margin-right: 15px;
                   }
                   .lower {
                       width: 16px;
                       height: 17px;
                       margin-right: 15px;
                   }
                   .code {
                       width: 16px;
                       height: 18px;
                       margin-right: 15px;
                   }
                    span {
                        flex: 1;
                        font-size: 28rpx;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(51, 51, 51, 1);
                    }
                    .arrow {
                        width: 6px;
                        height: 12px;
                    }
                }
            }
        }
    }
</style>
