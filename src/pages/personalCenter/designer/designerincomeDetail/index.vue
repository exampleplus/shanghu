<template>
    <div class="content">
        <div class="income" v-for="(item,index) in incomelist" :key="index">
            <div class="top">
                <div class="avator">
                    <img :src="item.headimgurl" alt="">
                </div>
                <div class="incomeInfo">
                    <div class="userInfo">
                        <span class="name">{{item.orderPerson}}</span>
                        <span class="time">{{item.orderTime}}</span>
                    </div>
                    <div class="order">
                        <span class="orderMoney">订单金额:{{item.orderAmount}}</span>
                        <span class="sourceProfit" v-if="item.materialAmount">素材获利：+{{item.materialAmount}}</span>
                        <span class="sourceProfit" v-else>素材获利：+0</span>
                    </div>
                </div>
            </div>
            <div class="profitFrom">
                <div class="profitItem" v-for="(matarial,idx) in item.materialInfoList" :key="idx">
                    <img :src="matarial.logo" alt="">
                    <span class="sourname">{{matarial.name}}</span>
                    <p class="profitNum" v-if="matarial.materialAmount"><span>素材获利：</span> <span>+{{matarial.materialAmount}}</span></p>
                    <p class="profitNum" v-else><span>素材获利：</span> <span>+0</span></p>
                </div>
            </div>
        </div>
        <div class="noIncome" v-if="incomelist.length <= 0 && hasData == false">
            <img src="/static/images/noIncome.png" alt="">
            <p>暂无明细</p>
        </div>
         <last-page :last="{length: incomelist.length, lastPage: lastPage}"></last-page>
    </div>
</template>
<script>
import { designerProfit} from "@/api/api";
import { toast } from "@/utils/index";
import lastPage from "@/components/lastPage";
export default {
    data() {
        return {
            pageIndex:1,
            pageSize:10,
            hasNextPage:false,
            lastPage:false,
            incomelist:[],
            hasData:true
        }
    },
     components:{
        lastPage
    },
    onReachBottom() {
        let that = this;
        that.loadMore();
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data())
        this._designerProfit();
    },
    methods:{
        loadMore (e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this._designerProfit();
            }
        },
        _designerProfit () {
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            designerProfit({pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    if(list.length > 0) {
                        this.hasData = true;
                    } else {
                        this.hasData = false;
                    }
                    this.incomelist = this.incomelist.concat(list);
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
    },
}
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
        .noIncome {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 120px;
            img {
                width: 111px;
                height: 125px;
                margin-bottom: 20px;
            }
            p {
                font-size:14px;
                color:rgba(153,153,153,1);
            }
        }
        .income {
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            padding-top: 14px;
            background: #fff;
            margin-bottom: 10px;
            .top {
                display: flex;
                align-items: center;
                padding-left: 15px;
                padding-right: 15px;
                margin-bottom: 10px;
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
                        }
                    }
                }
            }
            .profitFrom {
                background:#fff;
                padding-left:70px;
                padding-right:15px;
                .profitItem {
                    display: flex;
                    align-items: center;
                    background: #f6f6f6;
                    padding: 8px;
                    img {
                        width: 30px;
                        height: 30px;
                        margin-right: 15px;
                    }
                    .sourname {
                        font-size:12px;
                        color:rgba(74,74,74,1);
                        flex: 1;
                    }
                    .profitNum {
                        font-size:12px;
                        color:rgba(155,155,155,1);
                    }
                }
                
            }
        }
    }
</style>
