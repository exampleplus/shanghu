<template>
  <div class="myOrder">
    <ul class="tabBar">
      <li @click="tab(10)" :class="[{active:activeIndex == 10}]">全部</li>
      <li @click="tab(0)" :class="[{active:activeIndex == 0}]">
        砍价中
      </li>
      <li @click="tab(1)" :class="[{active:activeIndex == 1}]">
        待付款
      </li>
      <li @click="tab(2)" :class="[{active:activeIndex == 2}]">
        待发货
      </li>
      <li @click="tab(4)" :class="[{active:activeIndex == 4}]">
        待收货
      </li>
      <li @click="tab(6)" :class="[{active:activeIndex == 6}]">
        待评价
      </li>
    </ul>

     <ul class="orderList">
      <li v-for="(item,index) in orderList" :key="index">
        <p class="top">
            <span class="storeName">{{item.shopName}}</span>
            <span class="orderTime">{{item.orderTime}}</span>
            <span class="orderStatus" v-if="item.orderStatus == 0">砍价中</span>
            <span class="orderStatus" v-if="item.orderStatus == 1">待付款</span>
            <span class="orderStatus" v-if="item.orderStatus == 2">待发货</span>
            <span class="orderStatus" v-if="item.orderStatus == 3">已取消</span>
            <span class="orderStatus" v-if="item.orderStatus == 4">待收货</span>
             <span class="orderStatus" v-if="item.orderStatus == 5">待使用</span>
            <span class="orderStatus" v-if="item.orderStatus == 6">待评价</span>
            <span class="orderStatus" v-if="item.orderStatus == 7">已完成</span>
            <span class="orderStatus" v-if="item.orderStatus == 8">砍价已结束</span>
        </p>
        <div class="goodsInfo" >
          <div class="goodsContent" @click="goodsDetail(item.orderStatus,item.bargainId,item.id,item.goodsId,item.skuId)" v-for="(good,idx) in item.orderDataList" :key="idx">
            <div class="goodsWrapper">
              <div class="shopLogo" v-if="good.shopLogo">
                <img :src="good.shopLogo" alt="">
              </div>
              <div class="goodsImg">
                <img :src="good.goodsImg" alt>
              </div>
              <div class="goodsIntro">
                <div class="goodsName">{{good.goodsName}}</div>
                <div class="goodsSize">
                  <span>{{good.skuName}}</span>
                </div>
                <div class="goodsMoney">
                  <p>
                    <span class="goodsPrice">￥{{good.orderAmount}}</span>
                    <span class="originalPrice">￥{{good.goodsMarketPrice}}</span>
                    <span class="goodsNum">x {{good.goodsNum}}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btns">
          <p class="totalPrice">
            <span>
              总计:￥ {{item.orderAmount}}
            </span>
          </p>
          <div class="btn" v-if="item.orderStatus == 1">
                <div class="cancelOrder" @click="_cancelOrder(item.id)">取消订单</div>
                <div class="pay" @click="payNow(item.orderNo)">立即支付</div>
          </div>

          <div class="btn" v-if="item.orderStatus == 4">
                <div class="cancelOrder" @click="checkShip(item)">查看物流</div>
                <div class="pay" @click="_confirmOrder(item.id)">确认收货</div>
          </div>

          <div class="btn" v-if="item.orderStatus == 6">
              <div class="pay" @click="evaluate(item)">立即评价</div>
          </div>

          <div class="btn" v-if="item.orderStatus == 7 || item.orderStatus == 3" @click="_delOrder(item.id)">
              <div class="cancelOrder">删除订单</div>
          </div>

        </div>
      </li>
    </ul>
    <div class="noOrder" v-if="orderList.length <= 0 && hasData == false">
      <img src="/static/images/noOrder.png" alt="">
      <p>没有相关订单</p>
    </div>
    <last-page :last="{length: orderList.length, lastPage: lastPage}"></last-page>

     <div class="hidden" v-if="ishidden"></div>
    <!-- 取消提示 -->
    <div class="modal" v-if="isCancelOrder">
      <p>是否确认取消该订单？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="confirmCancel">确定</a>
      </div>
    </div>
    <!-- 删除提示 -->
    <div class="modal" v-if="isdelOrder">
      <p>是否确认删除该订单？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="confirmDel">确定</a>
      </div>
    </div>
     <!-- 确认收货提示 -->
    <div class="modal" v-if="isConfirm">
      <p>是否确认收货？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="confirm">确定</a>
      </div>
    </div>
  </div>
</template>
<script>
import {getBargainOrder,checkSheeping,cancelOrder,delOrder,confirmOrder,pay} from '@/api/api';
import { toast } from '@/utils/index'
import lastPage from "@/components/lastPage";
export default {
  data() {
    return {
      activeIndex:10,
      pageIndex:1,
      pageSize:5,
      orderStatus:10,
      hasNextPage:false,
      lastPage:false,
      orderList:[],
      cancelId:'',  //取消的订单id
      delId:"",  //删除的订单id
      confirmId:'',// 确认收货id
      ishidden:false,
      isCancelOrder:false,
      isdelOrder:false,
      isConfirm:false,
      name:"asdf",
      hasData:true
    };
  },
   components:{
      lastPage
  },
  onLoad(options) {
     Object.assign(this.$data, this.$options.data());
     this.pageIndex = 1;
     this._getOrderList();
    //  if(options.activeIndex) {
    //     this.changeData(options.activeIndex);
    //  }
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },
  methods:{
    changeData(activeIndex) {
      this.activeIndex = activeIndex;
    },
    tab(index) {
      this.activeIndex = index;
      this.orderStatus = index;
      this.orderList = [];
      this.pageIndex = 1;
      this._getOrderList();
    },
     // 上拉加载更多
      loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this._getOrderList();
        }
      },
    _getOrderList() {
      let pageIndex = this.pageIndex;
      let pageSize = this.pageSize;
      let orderStatus = this.orderStatus;
      wx.showLoading({
        title:"加载中",
        mask:true
      })
      getBargainOrder({pageIndex,pageSize,orderStatus}).then(res => {
        if(!res.data.code) {
            wx.hideLoading()
            this.hasNextPage = res.data.hasNextPage;
            let list = res.data.list;
            if(list.length > 0) {
                this.hasData = true;
            } else {
              this.hasData = false;
            }
             this.orderList = this.orderList.concat(list);
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
    //订单详情
    goodsDetail(orderStatus,bargainId,id,goodsId,skuId) {
      if(orderStatus == 0) {   //砍价中
        let activeIndex = this.activeIndex;
        let url = '/pages/order/twoshareBargainDetail/main?id=' + bargainId + '&goodsId='+ goodsId + '&skuId=' + skuId + '&activeIndex=' + activeIndex;
        wx.navigateTo({url})
      } else if(orderStatus == 8) {  //砍价结束
        let activeIndex = this.activeIndex;
        let url = '/pages/order/twoshareBargainDetail/main?id=' + bargainId + '&isEnd=' + true + '&goodsId='+ goodsId + '&skuId=' + skuId + '&activeIndex=' + activeIndex;
        wx.navigateTo({url})
      } else {
        let activeIndex = this.activeIndex;
        let url = '/pages/order/orderDetail/main?id=' + id + '&activeIndex=' + activeIndex;
        wx.navigateTo({url})
      }
      
    },
    //查看物流
    checkShip(item) {
      let expressCode = item.expressCode;
      let expressNumber = item.expressNumber;
       let url = '/pages/checkSheeping/main?expressNumber=' + expressNumber + '&expressCode=' + expressCode;
       wx.navigateTo({url})
    },
    cancel() {
      this.ishidden = false;
      this.isCancelOrder = false;
      this.isdelOrder = false;
      this.isConfirm = false;
    },
    //取消订单
    _cancelOrder(id) {
      this.cancelId = id;
      this.ishidden = true;
      this.isCancelOrder = true;
    },
    confirmCancel() {
      let id  = this.cancelId;
      cancelOrder({id}).then(res => {
        if(!res.data.code) {  
            this.cancel();
            this.pageIndex = 1;
            this.orderList = [];
            this._getOrderList()
        } else {
          this.cancel();
          toast(res.data.msg)
        }
      })
    },

    //删除订单
    _delOrder(id) {
      this.delId = id;
      this.ishidden = true;
      this.isdelOrder = true;
    },
    confirmDel() {
      let id = this.delId;
      delOrder({id}).then(res => {
        if(!res.data.code) {
            this.cancel();
            this.pageIndex = 1;
            this.orderList = [];
            this._getOrderList()
        } else {
          toast(res.data.msg)
        }
      })
    },

    //确认收货
    _confirmOrder(id) {
      this.confirmId = id;
      this.ishidden = true;
      this.isConfirm = true;
    },
    confirm() {
      let id = this.confirmId
      confirmOrder({id}).then(res => {
        if(!res.data.code) {
            this.cancel();
            this.pageIndex = 1;
            this.orderList = [];
            this._getOrderList()
        } else {
          toast(res.data.msg)
        }
      })
    },

    //支付
    payNow(orderNo) {
      pay({orderNo}).then(res => {
        if(!res.data.code) {
          let orderId = res.data.orderId;
           wx.requestPayment({
              timeStamp: res.data.pay.timeStamp,
              nonceStr: res.data.pay.nonceStr,
              package: res.data.pay.pkg,
              signType: res.data.pay.signType,
              paySign: res.data.pay.paySign,
              success: () => {
                wx.redirectTo({
                  url: "/pages/order/paySuccess/main?id=" + orderId
                });
              },
              fail: () => {
                toast("支付失败");
              }
            });
        } else {
          toast(res.data.msg)
        }
      })
    },

    //去评价
    evaluate(item) {
      if(item.isDiy) {   //diy订单
        let orderDetail = JSON.stringify(item)
        let url = '/pages/relanchDiyEvaluate/main?orderDetail=' + orderDetail + '&type=myOrder';
        wx.navigateTo({url})
      } else {
        let orderDetail = JSON.stringify(item)
        let url = '/pages/relanchEvaluate/main?orderDetail=' + orderDetail + '&type=myOrder';
        wx.navigateTo({url})
      }
     
    },
  },
};
</script>
<style lang="less" scoped>
.myOrder {
  height: 100%;
  background: #f5f5f5;
  .tabBar {
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding-top: 32rpx;
    position:-webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 10;
    li {
      font-size:13px;
      font-weight:600;
      color:rgba(155,155,155,1);
      padding-bottom: 13px;
      position: relative;
      span {
        position: absolute;
        right: -20rpx;
        top: -12rpx;
        line-height: 30rpx;
        color: white;
        text-align: center;
        background: #f34f1e;
        border-radius: 50%;
        width: 30rpx;
        height: 30rpx;
        text-align: center;
        font-size: 20rpx;
      }
      &.active {
        font-size:13px;
        font-weight:600;
        color:rgba(255,81,0,1);
        border-bottom:2px solid #FF5100;
      }
    }
  }
  .orderList {
    margin-top: 24rpx;
    margin-left: 10px;
    margin-right: 10px;
    li {
      background: #fff;
      padding: 10px;
      padding-top: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      .top {
        display: flex;
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
        margin-top: 32rpx;
        .goodsContent {
          margin-bottom: 20px;
          // &:first-child {
          //   margin-bottom: 20px;
          // }
          .goodsWrapper {
            display: flex;
            position: relative;
            .shopLogo {
              position: absolute;
              top: 5px;
              left: 5px;
              z-index: 10;
              width: 20px;
              height: 19px;
              img {
                width: 100%;
                height: 100%;
              }
            }
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
                font-size:15px;
                font-weight:400;
                color:rgba(9,2,3,1);
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .goodsSize {
                font-size:12px;
                font-weight:400;
                color:rgba(155,155,155,1);
              }
              .goodsMoney {
                p {
                  display: flex;
                  align-items: center;
                  .goodsPrice {
                    font-size:16px;
                    color:rgba(255,81,0,1);
                    margin-right: 5px;
                    font-weight: 600;
                  }
                  .originalPrice {
                    flex: 1;
                    font-size:12px;
                    color:rgba(155,155,155,1);
                    text-decoration: line-through;
                  }
                  .goodsNum {
                    font-size:14px;
                    color:rgba(9,2,3,1);
                  }
                }
              }
            }
          }
        }
      }
      
      .btns {
        display: flex;
        align-items: center;
        margin-top: 25px;
        justify-content: space-between;
        .totalPrice {
          font-size:13px;
          font-weight:400;
          color:rgba(155,155,155,1);
        }
        .btn {
           display: flex;
           & > div {
            width:72px;
            height:28px;
            line-height: 28px;
            border-radius:16px;
            font-size: 12px;
            border:1px solid rgba(74,74,74,1);
            text-align: center;
            color: #4A4A4A;
            margin-right: 10px;
            &:last-of-type {
              margin-right: 0;
            }
            &.pay,
            &.confirm {
              color: #FF5100;
              border: 1px solid #FF5100;
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

  .hidden {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    top: 392rpx;
    left: 100rpx;
    right: 100rpx;
    background: #fff;
    z-index: 3;
    border-radius: 12rpx;
    p {
      margin-top: 84rpx;
      margin-bottom: 84rpx;
      text-align: center;
      font-size: 30rpx;
      color: #333333;
    }
    div {
      // .list(row, flex-start, center);
      height: 96rpx;
      border-top: 2rpx solid rgba(0, 0, 0, 0.1207);
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #999;
      a {
        flex: 1;
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
      }
      a:last-of-type {
        color: #0068b6;
        border-left: 2rpx solid rgba(0, 0, 0, 0.1207);
      }
    }
  }
}
</style>
