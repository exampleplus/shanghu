<template>
    <div class="content">
        <ul class="cashList">
            <li v-for="(item,index) in drawList" :key="index">
                <p class="parah mbt8">
                    <span class="reason">提现</span>
                    <span class="time">{{item.gmtCreate}}</span>
                </p>
                <p class="parah">
                    <span class="status" v-if="item.status == 2">已驳回 {{item.rejectReason}}</span>
                    <span class="status" v-if="item.status == 1">已提现</span>
                    <span class="status" v-if="item.status == 0">待审核</span>
                    <span class="money">{{item.count}}</span>
                </p>
            </li>
        </ul>
        <div class="showAll">
             <last-page :last="{length: drawList.length, lastPage: lastPage}"></last-page>
        </div>
         <div class="noOrder" v-if="drawList.length <= 0 && hasData == false">
            <img src="/static/images/noIncome.png" alt="">
            <p>没有相关提现记录</p>
        </div>
    </div>
</template>
<script>
import lastPage from "@/components/lastPage"
import { withDrawList } from "@/api/api";
import { toast } from "@/utils/index";
export default {
    data() {
        return {
           pageSize:10,
           pageIndex:1,
           hasNextPage:false,
           lastPage:false,
           drawList:[],
           hasData:true
        }
    },
    components:{
        lastPage
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data());
        this._withDrawList();
    },
    onReachBottom() {
        let that = this;
        that.loadMore();
    },
    methods:{
        loadMore() {
             if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this._withDrawList();
            }
        },
        _withDrawList() {
            let type = this.$mp.query.type;
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            withDrawList({type,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    if(list.length > 0) {
                        this.hasData = true;
                    } else {
                        this.hasData = false;
                    }
                    this.drawList = this.drawList.concat(list);
                    this.drawList.map(ele => {
                        let obj = ele;
                        // obj.count = obj.count.toFixed(2)
                        return obj;
                    })
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
        }
    },
}
</script>

<style lang="less" scoped>
.content {
    .cashList {
        background: #fff;
        li {
            padding: 15px;
            border-bottom: 1px solid #eee;
           .parah {
               display: flex;
               align-items: center;
               justify-content: space-between;
               &.mbt8 {
                   margin-bottom: 8px;
               }
               .reason {
                    font-size:14px;
                    font-weight:600;
                    color:rgba(9,2,3,1);
               }
               .time {
                    font-size:12px;
                    color:rgba(74,74,74,1);
               }
               .status {
                    font-size:12px;
                    font-weight:600;
                    color:rgba(255,81,0,1);
               }
               .money {
                    font-size:12px;
                    color:rgba(74,74,74,1);
               }
           }
        }
    }
    .showAll {
        padding-top: 20px;
    }
    .noOrder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-bottom: 20px;
            padding-top: 100px;
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
