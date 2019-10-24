<template>
  <div class="content">
    <div class="goods" v-for="(item,index) in saleList" :key="index">
      <p class="top">
        <!-- <span class="storeName">店铺名称</span> -->
        <span class="orderTime">{{item.gmtCreate}}</span>
        <span class="orderStatus">{{item.refundStatus}}</span>
      </p>
      <div class="goodsInfo">
        <div class="goodsContent">
          <div class="goodsWrapper">
            <div class="goodsImg">
              <img
                :src="item.goodsImg"
                alt
              >
            </div>
            <div class="goodsIntro">
              <div class="goodsName">{{item.goodsName}}</div>
              <div class="goodsSize">
                <span>{{item.goodsSkuName}}</span>
                <!-- <span>L</span> -->
              </div>
              <div class="goodsMoney">
                <p>
                  <span class="goodsPrice">￥{{item.goodsPrice}}</span>
                  <span class="originalPrice">￥{{item.goodsMarketPrice}}</span>
                  <span class="goodsNum">x {{item.goodsNum}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="applyAftersale">
          <div class="afterSale" @click="orderDetail(item.id,item.refundStatus)">查看详情</div>
        </div>
      </div>
    </div>
    <div class="noOrder" v-if="saleList.length <= 0 && hasData == false">
      <img src="/static/images/noOrder.png" alt="">
      <p>没有相关订单</p>
    </div>
     <last-page :last="{length: saleList.length, lastPage: lastPage}"></last-page>
  </div>
</template>
<script>
import {checkSaleList} from '@/api/api';
import {toast} from '@/utils/index'
import {formatTime} from '@/utils/index'
import lastPage from "@/components/lastPage";

export default {
  data() {
    return {
      saleList:[],
      hasNextPage:false,
      lastPage:false,
      pageIndex:1,
      pageSize:10,
      hasData:true
    };
  },
  components: {
    lastPage
  },
  onLoad() {
     Object.assign(this.$data, this.$options.data())
    this._checkSaleList();
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },
  methods:{
     // 上拉加载更多
    loadMore(e) {
      if (!this.hasNextPage) {
        return;
      } else {
        this.pageIndex++;
        this._checkSaleList();
      }
    },
    //售后列表
    _checkSaleList() {
      let pageIndex = this.pageIndex;
      let pageSize = this.pageSize;
      wx.showLoading({
        title:"加载中",
        mask:true
      })
      checkSaleList({pageIndex,pageSize}).then(res => {
        if(!res.data.code) {
          wx.hideLoading();
          this.hasNextPage = res.data.hasNextPage;
          let list = res.data.list;
          if(list.legnth > 0) {
            this.hasData = true;
          } else {
            this.hasData = false
          }
          this.saleList = this.saleList.concat(list);
          this.saleList.map(ele => {
            let obj = ele;
            obj.gmtCreate = formatTime(obj.gmtCreate);
            if(obj.refundStatus == 0) {
              obj.refundStatus = '待处理'
            } else if(obj.refundStatus == 1) {
              obj.refundStatus = '已同意'
            } else if(obj.refundStatus == 2) {
              obj.refundStatus = '已拒绝'
            }
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
    },
    //查看详情
    orderDetail(id,refundStatus) {
          let url = '/pages/order/quitOrderDetail/main?id=' + id;
          wx.navigateTo({url})
      }
  }
};
</script>

<style lang="less" scoped>
.content {
  .goods {
    margin: 10px;
    background: #fff;
    padding: 10px 15px;
    border-radius: 6px;
     .top {
        display: flex;
        margin-bottom: 20px;
        .storeName {
          font-size:13px;
          font-weight:400;
          color:rgba(155,155,155,1);
          margin-right: 10px;
        }
        .orderTime {
          flex: 1;
          font-size:13px;
          font-weight:400;
          color:rgba(155,155,155,1);
        }
        .orderStatus {
          font-size:13px;
          font-weight:400;
          color:rgba(255,81,0,1);
        }
      }
    .goodsInfo {
      .goodsContent {
        .goodsWrapper {
          display: flex;
          .goodsImg {
            width: 96px;
            height: 96px;
            margin-right: 11px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }
          .goodsIntro {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .goodsName {
              font-size: 15px;
              font-weight: 400;
              color: rgba(9, 2, 3, 1);
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .goodsSize {
              font-size: 12px;
              font-weight: 400;
              color: rgba(155, 155, 155, 1);
            }
            .goodsMoney {
              p {
                display: flex;
                align-items: center;
                .goodsPrice {
                  font-size: 16px;
                  color: rgba(255, 81, 0, 1);
                  margin-right: 5px;
                  font-weight: 600;
                }
                .originalPrice {
                  flex: 1;
                  font-size: 12px;
                  color: rgba(155, 155, 155, 1);
                  text-decoration: line-through;
                }
                .goodsNum {
                  font-size: 14px;
                  color: rgba(9, 2, 3, 1);
                }
              }
            }
          }
        }
      }
      .applyAftersale {
        display: flex;
        justify-content: flex-end;
        margin-top: 25px;
        .afterSale {
          width: 72px;
          height: 28px;
          border-radius: 14px;
          font-size: 12px;
          color: rgba(74, 74, 74, 1);
          border: 1px solid rgba(74, 74, 74, 1);
          line-height: 28px;
          text-align: center;
        }
      }
    }
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
