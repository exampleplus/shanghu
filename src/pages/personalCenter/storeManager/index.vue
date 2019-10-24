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
                <li @click="myPage"> 
                    <img src="/static/images/icon-homepage.png" alt class="homepage">
                    <span>我的主页</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
            </ul>
         </div>

         <div class="sheet">
            <ul class="tabList">
                <li class="border" @click="myWallet"> 
                    <img src="/static/images/icon-wallet.png" alt class="wallet">
                    <span>我的明细</span>
                    <img src="/static/images/user-arrow-right.png" alt class="arrow">
                </li>
                <li class="border"  @click="orderStatics"> 
                    <img src="/static/images/icon-orderStatic.png" alt class="orderStatic">
                    <span>订单统计</span>
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
             userInfo:{},
        }
    },
     onLoad() {
        this._getUserInfo()
    },
    methods:{
        //店家信息
        _getUserInfo() {
            let isSelf = this.isSelf;
            let designerId = this.designerId;
            getUserInfo().then(res => {
                if(!res.data.code) {
                    this.userInfo = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        myPage() {
             let url = '/pages/storePage/main?isSelf=' + 1 + '&shopId=' + '';
             wx.navigateTo({url})
        },
        //钱包
        myWallet() {
              let url = '/pages/personalCenter/storeIncomeDetail/main';
              wx.navigateTo({url})
        },
        //订单统计
        orderStatics() {
             let url = '/pages/personalCenter/storeOrderStatics/main';
             wx.navigateTo({url})
        },
    },
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
                   .source {
                       width: 15px;
                       height: 15px;
                       margin-right: 15px;
                   }
                   .cloth {
                       width: 16px;
                       height: 16px;
                       margin-right: 15px;
                   }
                   .orderStatic {
                       width: 16px;
                       height: 16px;
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
