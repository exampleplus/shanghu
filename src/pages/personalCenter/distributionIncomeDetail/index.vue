<template>
    <div class="content">
        <scroll-view scroll-y="true" class="scroll-bar" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreSource">
            <div class="income" v-for="(item,index) in incomoList" :key="index">
                <div class="top">
                    <div class="avator">
                        <img :src="item.headimgurl" alt="">
                    </div>
                    <div class="incomeInfo">
                        <div class="userInfo">
                            <span class="name">{{item.nickname}}</span>
                            <span class="time">{{item.gmtCreate}}</span>
                        </div>
                        <div class="order">
                            <span class="orderMoney">商品金额:￥{{item.orderAmount}}</span>
                            <p class="sourceProfit">
                                <span class="mr5">返佣：{{item.rate}}%</span>
                                <span>推广获利：+{{item.profitAmount}}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="showAll">
             <last-page :last="{length: incomoList.length, lastPage: lastPage}"></last-page>
            </div>
            <div class="noOrder" v-if="incomoList.length == 0 && hasData == false">
                <img src="/static/images/noIncome.png" alt="">
                <p>没有相关收入记录</p>
            </div>
        </scroll-view>
         
    </div>
</template>
<script>
import { distributorProfit } from "@/api/api";
import lastPage from "@/components/lastPage"
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            pageIndex:1,
            pageSize:10,
            contentHeight:'',
            hasNextPage:false,
            lastPage:false,
            incomoList:[],
            hasData:true
        }
    },
     components:{
        lastPage
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data());
        let that = this;
         wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight;
            }
        })
        that.getProfit();
    },
    methods:{
         loadMoreSource(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this.getProfit();
            }
        },
        getProfit() {
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            distributorProfit({pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    console.log("res",res)
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    if(list.length > 0) {
                        this.hasData = true;
                    } else {
                        this.hasData = false;
                    }
                    this.incomoList = this.incomoList.concat(list);
                    if (!this.hasNextPage) {
                        //最后一页
                        this.lastPage = true;
                    } else {
                        this.lastPage = false;
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
        background: #fff;
        .scroll-bar {
            ::-webkit-scrollbar {
                width: 0;
                height: 0;
                color: transparent;
            }
        }
        .showAll {
            margin-top: 10px;
        }
        .income {
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            padding-top: 14px;
            .top {
                display: flex;
                align-items: center;
                padding-left: 15px;
                padding-right: 15px;
                .avator {
                    width: 40px;
                    height: 40px;
                    margin-right: 15px;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .incomeInfo {
                    flex:1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .userInfo {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        .name {
                            font-size:14px;
                            font-weight:600;
                            color:rgba(9,2,3,1);
                        }
                        .time {
                            font-size:12px;
                            color:rgba(74,74,74,1);
                        }
                    }
                    .order {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .orderMoney {
                            font-size:12px;
                            color:rgba(74,74,74,1);
                        }
                        .sourceProfit {
                            font-size:12px;
                            color:rgba(255,81,0,1);
                            .mr5 {
                                margin-right: 5px;
                            }
                        }
                    }
                }
            }
        }
         .noOrder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-bottom: 20px;
            padding-top: 120px;
            img {
                width: 119px;
                height: 124px;
                margin-bottom: 20px;
            }
            p {
                font-size:14px;
                color:rgba(153,153,153,1);
            }
    }
   }
</style>
