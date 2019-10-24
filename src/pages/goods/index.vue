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
     <divi></divi>  
     <div class="goodsWrapper" :style="goodsList.length <= 0 ? 'padding-top:0' : ''">
         <goods-item :goodsList="goodsList" @goodsDetail="goodsDetail"></goods-item>
     </div>
      <div class="nodata" v-if="goodsList.length == 0 && hasData == false">
        <img src="/static/images/nosearch.png" alt="">
        <p>抱歉，没有找到相关内容</p>
    </div>
      <last-page :last="{length: goodsList.length, lastPage: lastPage}"></last-page>
  </div>
</template>
<script>
import divi from '@/components/divi'
import goodsItem from '@/components/goodsItem'
import {typeSearch} from '@/api/api'
import {toast} from '@/utils/index'
import lastPage from "@/components/lastPage";
export default {
  data() {
    return {
        standard:1,
        goodsList:[],
        searchName:'',
        type:1,
         priceArrow: "/static/images/default.png",
        pageIndex:1,
        pageSize:10,
        hasNextPage:false,
        lastPage:false,
        sortType:1,
        hasData:true,
        isUp:true,
    };
  },
    components:{
      divi,
      goodsItem,
      lastPage
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    if(this.$mp.query.type) {
      this.type = this.$mp.query.type
    }
    if(this.$mp.query.searchName) {
      this.searchName = this.$mp.query.searchName
    }
    this.initData();
  },
   methods:{
      tab(standard) {
          this.standard = standard;
          if(standard == 3) {
              if (this.isUp) {
                //降序
                this.sortType = 3;
                this.priceArrow = "/static/images/down.png";
                this.isUp = false;
                this.goodsList = [];
                this.pageIndex = 1;
                this.hasData = true;
                this.initData();
               
              }else {
                 //升序
                this.sortType = 4;
                this.priceArrow = "/static/images/up.png";

                this.isUp = true;
                this.goodsList = [];
                this.pageIndex = 1;
                this.hasData = true;
                this.initData();
               
              }

          }

          //综合排序
          if(standard == 1) {
            this.priceArrow = "/static/images/default.png";
            this.sortType = 1;
            this.goodsList = [];
            this.pageIndex = 1;
            this.hasData = true;
            this.initData();
          }
      //销量排序
           if(standard == 2) {
            this.priceArrow = "/static/images/default.png";
            this.sortType = 2;
            this.goodsList = [];
            this.pageIndex = 1;
            this.hasData = true;
            this.initData();
          }


         
          // this.sortType = standard;
         
      },
       // 上拉加载更多
      loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this.initData();
        }
      },
      initData() {
        let type = this.type;
        let sortType = this.sortType;
        let searchName = this.searchName;
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;
        wx.showLoading({
          title:"加载中",
          mask:true
        })
        typeSearch({type,searchName,pageIndex,pageSize,sortType}).then(res => {
          if(!res.data.code) {
            wx.hideLoading();
             this.hasNextPage = res.data.hasNextPage;
             let list = res.data.list;
             if(list.legnth > 0) {
               this.hasData = true
             } else {
               this.hasData = false;
             }
             this.goodsList = this.goodsList.concat(list);
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
      //商品详情
      goodsDetail(goodsId) {
        let url = '/pages/goodsDetail/main?goodsId=' + goodsId;
        wx.navigateTo({url})
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
      color: #9b9b9b;
      img {
        width: 6px;
        height: 10px;
      }
      &.active {
        color: #ff5100;
      }
    }
  }
  .goodsWrapper {
      background: #FFF;
      padding-top: 10px;
      margin-bottom: 10px;
  }
  .nodata {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
      img {
          width: 118px;
          height: 115px;
          margin-bottom: 30px;
      }
      p {
            font-size:14px;
            color:rgba(153,153,153,1);
      }
  }
}
</style>
