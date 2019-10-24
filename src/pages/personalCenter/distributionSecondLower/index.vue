<template>
    <div>
        <!-- <div class="tabBar">
            <div class="bar" v-for="(item,index) in tabList" :key="index" :class="[activeIndex == index ? 'active' : '']" @click="tab(index,item.type)">
                {{item.name}}
            </div>
        </div> -->
        <!-- <scroll-view scroll-y="true" class="scroll-bar" v-if="activeIndex == 0" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreSource">
            <ul class="userList" > 
                <li v-for="(item,index) in partnerList" :key="index">
                    <img :src="item.headimgurl" alt="">
                    <span class="name">{{item.nickname}}</span>
                    <p class="total"><span>总收入：</span><span class="profit" v-if="item.totalAmount">+{{item.totalAmount}}</span> <span class="profit" v-else>+0</span></p>
                </li>
            </ul>
            <div class="showAll">
                <last-page :last="{length: partnerList.length, lastPage: lastPage}"></last-page>
            </div>
        </scroll-view> -->

        <scroll-view class="scroll-bar" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreCustomer">
            <ul class="userList" > 
                <li v-for="(item,index) in customerList" :key="index">
                    <img :src="item.headimgurl" alt="">
                    <span class="name">{{item.nickname}}</span>
                </li>
            </ul>
            <div class="showAll">
                <last-page :last="{length: customerList.length, lastPage: lastPage2}"></last-page>
            </div>
        </scroll-view>
        
    </div>
</template>
<script>
import { distributorNext } from "@/api/api";
import lastPage from "@/components/lastPage"
import { toast } from "@/utils/index";
export default {
     components:{
        lastPage
    },
    data() {
        return {
            contentHeight:'',
            activeIndex:0,
            tabList:[{name:"合伙人",type:0},{name:"客户",type:1}],
            type:0,
            pageIndex:1,
            pageSize:10,
            hasNextPage:false,
            lastPage:false,

            customPageIndex:1,
            customPageSize:10,
            hasNextPage2:false,
            lastPage2:false,
            
            partnerList:[],
            customerList:[]
        }
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
         let that = this;
         wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight;
            }
        })
        this.getCustomer();
    },
    methods:{
        loadMoreSource(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this.getNext();
            }
        },
        loadMoreCustomer(e) {
             if (!this.hasNextPage2) {
                return;
            } else {
                this.customPageIndex++;
                this.getCustomer();
            }
        },
        tab(index,type) {
            this.activeIndex = index;
        },
        
        getCustomer() {
            let type = 1;
            let pageIndex = this.customPageIndex;
            let pageSize = this.customPageSize;
            distributorNext({type,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage2 = res.data.hasNextPage;
                    let list = res.data.list;
                    this.customerList = this.customerList.concat(list);
                    if (!this.hasNextPage2) {
                        //最后一页
                        this.lastPage2 = true;
                    } else {
                        this.lastPage2 = false;
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
    .tabBar {
        display: flex;
        background: #fff;
        padding-bottom: 15px;
        justify-content: space-around;
        margin-bottom: 10px;
        position: sticky;
        position: -webkit-sticky;
        top: 0;/*阈值*/
        z-index: 100;
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
    .scroll-bar {
        ::-webkit-scrollbar {
            width: 0;
            height: 0;
            color: transparent;
        }
    }
    .userList {
        background: #fff;
        li {
            display: flex;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #eee;
            &:last-of-type {
                border-bottom: none;
            }
            img {
                width: 40px;
                height:40px;
                border-radius: 50%;
                margin-right: 15px;
            }
            .name {
                font-size:14px;
                font-weight:600;
                color:rgba(9,2,3,1);
                flex:1;
            }
            .total {
                span {
                    color: #4A4A4A;
                    font-size: 14px;
                    &.profit {
                        color: #FF5100;
                    }
                }
            }
        }
    }
    .showAll {
        margin-top: 10px;
    }
</style>

