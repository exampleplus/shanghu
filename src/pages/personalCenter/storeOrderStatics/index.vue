<template>
    <div>
        <div class="tabBar">
            <div class="bar" v-for="(item,index) in tabList" :key="index" :class="[activeIndex == index ? 'active' : '']" @click="tab(index,item.type)">
                {{item.name}}
            </div>
        </div>

        <ul class="statics">
            <li>
                <span class="desc">订单数</span>
                <span class="num">{{info.orderNum}}</span>
            </li>
            <li>
                <span class="desc">订单金额</span>
                <span class="num">{{info.orderAmount}}</span>
            </li>
            <li>
                <span class="desc">下单人数</span>
                <span class="num">{{info.personNum}}</span>
            </li>
            <li>
                <span class="desc total">总收入</span>
                <span class="num totalIncome">{{info.totalAmount}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import { shopStatistics } from "@/api/api";
import lastPage from "@/components/lastPage";
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            type:0,
            activeIndex:0,
            info:{},
            tabList:[{name:"当天",type:0},{name:"当月",type:1}]
        }
    },
    onLoad() {
        this._shopStatistics();
    },
    methods:{
        tab(index,type) {
            this.type = type;
            this.activeIndex = index;
            this._shopStatistics();
        },
        _shopStatistics() {
            let type = this.type;
            shopStatistics({type}).then(res => {
                if(!res.data.code) {
                    this.info = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .tabBar {
        display: flex;
        background: #fff;
        padding: 15px 87px;
        justify-content: space-between;
        margin-bottom: 10px;
        .bar {
            font-size:14px;
            font-weight:600;
            color:rgba(155,155,155,1);
            &.active {
                font-size:14px;
                font-weight:600;
                color:rgba(9,2,3,1);
            }
        }
    }
    .statics {
        background: #fff;
        li {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #eee;
            &:last-of-type {
                border-bottom: none;
            }
            .desc {
                font-size:14px;
                color:rgba(74,74,74,1);
            }
            .num {
                font-size:14px;
                color:rgba(74,74,74,1);
            }
            .total {
                font-size:18px;
                font-weight:600;
                color:rgba(74,74,74,1);
            }
            .totalIncome {
                font-size:18px;
                font-weight:600;
                color:rgba(255,81,0,1);
            }
        }
    }
</style>
