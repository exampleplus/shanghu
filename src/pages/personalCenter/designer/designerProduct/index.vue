<template>
    <div class="content">
        <div class="works">
            <div class="pics" v-for="(item,index) in productList" :key="index">
                <img :src="item.works">
                <img src="/static/images/delProduct.png" class="del" @click="delWorks(item.id,index)">
            </div>
        </div>
        <div class="noOrder" v-if="productList.length <= 0 && hasData == true">
            <img src="/static/images/noOrder.png" alt="">
            <p>没有相关成品</p>
        </div>
         <last-page :last="{length: productList.length, lastPage: lastPage}"></last-page>
    </div>
</template>
<script>
import product from '@/components/product'
import lastPage from "@/components/lastPage"
import {getDesignerWorks ,delDesignerWorks} from "@/api/api";
import { toast } from "@/utils/index";
export default {
    components:{
        product,
        lastPage
    },
    data() {
        return {
             productList:[],
             hasNextPage:false,
             lastPage:false,
             pageIndex:1,
             pageSize:10,
             hasData:false
        }
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data())
        this._getDesignerWorks();
    },
      onReachBottom() {
        let that = this;
        that.loadMore();
    },
     methods:{
        loadMore(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this._getDesignerWorks();
            }
        },
        _getDesignerWorks() {
            let isSelf = true;
            let designerId = '';
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            getDesignerWorks({isSelf,designerId,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    if(list.length > 0) {
                        this.hasData = true;
                    } else {
                        this.hasData = false;
                    }
                    this.productList = this.productList.concat(list);
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
        //删除
        delWorks(id,index) {
            delDesignerWorks({id}).then(res => {
                if(!res.data.code) {
                    this.productList.splice(index,1)
                } else {
                    toast(res.data.msg)
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.works {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 15px;
        .pics {
        position: relative;
        img {
            width: 167px;
            height: 167px;
            margin-bottom: 10px;
            &.del {
                position: absolute;
                right: 0;
                top: 0;
                width: 20px;
                height: 20px;
                z-index: 10;
            }
        }
    }
}
.noOrder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
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
    
</style>
