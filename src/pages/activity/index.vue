<template>
  <div class="content">
    <ul class="bar">
      <li :class="[{active:standard == 1}]" @click="tab(1)">综合</li>
      <li :class="[{active:standard == 2}]" @click="tab(2)">销量</li>
      <li :class="[{active:standard == 3}]" @click="tab(3)">
        <span>
          价格
        </span>
        <img :src="priceArrow" alt="">
      </li>
      
    </ul>
     <divi types="sd"></divi>  
     <div class="bargainWrapper" :style="bargainList.length <= 0 ? 'padding-top:0' :''">
         <bargain-item :bargainList="bargainList" @detail="bargainDetail"></bargain-item>
     </div>
     <div class="noOrder" v-if="bargainList.length <= 0 && hasData == false" >
      <img src="/static/images/noOrder.png" alt="">
      <p>没有相关商品</p>
    </div>
      <last-page :last="{length: bargainList.length, lastPage: lastPage}"></last-page>
  </div>
</template>
<script>
import divi from '@/components/divi'
import bargainItem from '@/components/bargainItem'
import lastPage from "@/components/lastPage";
import { bargainList } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
         standard:1,
         sortType:1,
         bargainList:[],
         pageIndex:1,
         pageSize:10,
         hasNextPage:false,
         lastPage:false,
         hasData:true,
         isUp:true,
         priceArrow: "/static/images/default.png"
    };
  },
  components:{
        lastPage,
        divi,
        bargainItem
    },
   onLoad() {
        Object.assign(this.$data, this.$options.data())
        this.getBargainList()
    },
    onReachBottom() {
      let that = this;
      that.loadMore();
    },
  methods:{
      tab(standard) {
         this.standard = standard;
        //价格排序
        if(standard == 3 ) {
          if(this.isUp) {
            //降序
            this.sortType = 3;
            this.priceArrow = "/static/images/down.png";
            this.isUp = false;
            this.pageIndex = 1;
            this.bargainList = [];
            this.getBargainList();
          } else {
             this.sortType = 4;
             this.priceArrow = "/static/images/up.png";
             this.isUp = true;
             this.pageIndex = 1;
             this.bargainList = [];
             this.getBargainList();
          }
        }

        //综合排序
        if(standard == 1) {
           this.priceArrow = "/static/images/default.png";
           this.sortType = 1;
           this.pageIndex = 1;
           this.bargainList = [];
           this.getBargainList();
        }

        if(standard == 2) {
           this.priceArrow = "/static/images/default.png";
           this.sortType = 2;
           this.pageIndex = 1;
           this.bargainList = [];
           this.getBargainList();
        }

          // wx.showLoading({title:"加载中"})
          // this.standard = standard;
          // this.sortType = standard;
          // this.pageIndex = 1;
          // this.bargainList = [];
          // this.getBargainList();
          // wx.hideLoading();
      },
       loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this.getBargainList();
        }
      },
      getBargainList () {
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;
        let sortType = this.sortType;
        wx.showLoading({
          title:'加载中',
          mask:true
        })
        bargainList({pageIndex,pageSize,sortType}).then(res => {
          if(!res.data.code) {
            wx.hideLoading();
             this.hasNextPage = res.data.hasNextPage;
             let list = res.data.list;
             if(list.length > 0) {
               this.hasData = true
             } else {
               this.hasData = false;
             }
              this.bargainList = this.bargainList.concat(list);
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
      //活动商品详情
      bargainDetail(goodsId) {
        let url = "/pages/bargainDetail/main?goodsId=" + goodsId;
        wx.navigateTo({ url });
      },
  }
};
</script>
<style lang="less" scoped>
.content {
  .bar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 15px 0;
    background: #fff;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index:10;
    background: #fff;
    li {
      height: 40rpx;
      font-size: 14px;
      font-weight: 600;
      line-height: 40rpx;
      text-align: center;
      color: #9B9B9B;
      img {
        width: 6px;
        height: 10px;
      }
      &.active {
        color:#FF5100;
      }
    }
  }
  .bargainWrapper {
      padding-top: 10px;
      background: #fff;
  }
  .noOrder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 140px;
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
