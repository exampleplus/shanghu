<template>
  <div class="content">
    <div class="top">
      <div class="orderStatus">
        <img src="/static/images/icon-clock.png" class="icon-clock" />
        <span v-if="orderInfo.orderStatus == 1">待付款</span>
        <span v-else-if="orderInfo.orderStatus == 2">待发货</span>
        <span v-else-if="orderInfo.orderStatus == 3">已取消</span>
        <span v-else-if="orderInfo.orderStatus == 4">待收货</span>
        <span v-else-if="orderInfo.orderStatus == 6">待评价</span>
        <span v-else-if="orderInfo.orderStatus == 7">已完成</span>
      </div>
      <p class="lastTime" v-if="orderInfo.orderStatus == 4 ">剩{{hour}}小时{{min}}分钟自动确认收货</p>
      <div v-if="orderInfo.orderStatus == 1">
         <p class="lastTime">订单号:{{orderInfo.orderNo}}</p>
      </div>
      <p
        class="lastTime"
        v-if="orderInfo.orderStatus == 6"
      >剩{{hour}}小时{{min}}分钟自动关闭</p>
    </div>
    <div class="address">
      <div class="addressIn">
        <div class="leftImg">
          <img src="/static/images/address.png" alt />
        </div>
        <div class="addressContent">
          <div class="contentTop">
            <p class="addressee">
              <span>收件人:</span>
              <span>{{orderInfo.receiptPerson}}</span>
            </p>
            <span>{{orderInfo.receiptPhone}}</span>
          </div>
          <div
            class="contentBot"
          >收货地址: {{orderInfo.receiptAddr}}</div>
        </div>
      </div>
    </div>
    <div class="goods">
      <div class="goodsInfo">
        <div class="goodsContent" v-for="(goods,index) in orderInfo.orderDataList" :key="index">
          <div class="goodsWrapper">
            <div class="goodsImg">
              <img :src="goods.goodsImg" alt />
            </div>
            <div class="goodsIntro">
              <div class="goodsName">{{goods.goodsName}}</div>
              <div class="goodsSize">
                <span>团队人数:{{orderInfo.groupNum}}</span>
              </div>
              <div class="goodsMoney">
                <p>
                  <span class="goodsPrice">￥{{orderInfo.orderAmount}}</span>
                  <span class="originalPrice">(含素材费￥{{orderInfo.materialPrice}})</span>
                  <!-- <span class="goodsNum">x {{goods.goodsNum}}</span> -->
                </p>
              </div>
            </div>
          </div>
          <div v-if="!orderInfo.isDiy">
            <div
                  class="applyAftersale"
                  v-if="orderInfo.orderStatus == 6 || orderInfo.orderStatus == 7"
                >
                <div class="afterSale" @click="applyAftersale(index)">申请售后</div>
            </div>
          </div>
        </div>
        <div class="checkUserList">
          <div class="checkBtn" @click="checkUser">
             查看成员
          </div>
        </div>
      </div>
    </div>
    <div class="goodsTotalWrapper">
      <ul class="cost">
        <li>
          <span class="regular">商品总额</span>
          <span class="gray">￥ {{orderInfo.goodsAmount}}</span>
        </li>
        <li>
          <span class="regular">运费</span>
          <span class="gray">￥{{orderInfo.orderFreight}}</span>
        </li>

          <!-- <li>
          <span class="regular">素材费</span>
          <span class="gray">￥{{orderInfo.materialPrice}}</span>
        </li> -->

        
        <li>
          <span class="weight">需付费</span>
          <span class="orange">￥ {{orderInfo.orderAmount}}</span>
        </li>
      </ul>
    </div>
    <div class="invoince" v-if="orderInfo.isInvoice">
      <div class="invoinceType">
        <span>发票类型：</span>
        <span v-if="orderInfo.invoiceType == 1">电子普通发票</span>
        <span v-if="orderInfo.invoiceType == 2">增值税专用发票</span>
      </div>
      <div class="invoinceType">
        <p class="invoicePayable">
          <span>发票抬头：</span>
          <span v-if="orderInfo.normalType == 1">个人</span>
          <span v-if="orderInfo.normalType == 2">企业</span>
        </p>
        <span class="checkInvoince" @click="checkInvoince">查看发票</span>
      </div>
      <div class="invoinceType">
        <span>发票内容：</span>
        <span>{{orderInfo.invoiceContent}}</span>
      </div>
    </div>

    <div
      class="sheeeping"
      v-if="orderInfo.orderStatus == 4 || orderInfo.orderStatus == 6 || orderInfo.orderStatus == 7"
    >
      <p class="sheepingType">
        <span>{{orderInfo.expressName}}：</span>
        <span>{{orderInfo.expressNumber}}</span>
      </p>
      <span class="checkSheeping" @click="checkSheep">查看物流</span>
    </div>
    <div class="orderInfo">
      <div class="orderNum" v-if="orderInfo.orderStatus==1 || orderInfo.orderStatus==2">
        <p class="order">
          <span>订单编号：</span>
          <span>{{orderInfo.orderNo}}</span>
        </p>
        <span class="copy" @click="copyOrderNum">复制</span>
      </div>
      <div class="orderNum">
        <span class="order">下单时间</span>
        <span>{{orderInfo.orderTime}}</span>
      </div>

      <div
        class="orderNum"
        v-if="orderInfo.orderStatus == 4 || orderInfo.orderStatus==6 || orderInfo.orderStatus == 7"
      >
        <span class="order">发货时间</span>
        <span>{{orderInfo.deliverAt}}</span>
      </div>
      <div class="orderNum" v-if="orderInfo.orderStatus==6 || orderInfo.orderStatus == 7">
        <span class="order">收货时间</span>
        <span>{{orderInfo.confirmAt}}</span>
      </div>
      <div class="orderNum" v-if="orderInfo.orderStatus == 7">
        <span class="order">评价时间</span>
        <span>{{orderInfo.evaluateAt}}</span>
      </div>
      <div class="orderNum" v-if="orderInfo.orderStatus == 3">
        <span class="order">取消时间</span>
        <span>{{orderInfo.cancelAt}}</span>
      </div>
    </div>

   
    <div class="bottom" v-if="orderInfo.orderStatus==1 && type == 0 && !payType">
      <div @click="_cancelOrder(orderInfo.id)" v-if="!payType">取消订单</div>
      <div class="confirm" v-if="!payType" @click="payNow(orderInfo.orderNo)">立即支付</div>
    </div>

    <div class="bottom" v-if="orderInfo.orderStatus==4 && type == 0">
      <div class="confirm" @click="_confirmOrder(orderInfo.id)">确认收货</div>
    </div>
    <div class="bottom" v-if="orderInfo.orderStatus==6 && type == 0" @click="eva(orderInfo)">
      <div class="confirm">立即评价</div>
    </div>
    <div class="bottom" v-if="(orderInfo.orderStatus==7 || orderInfo.orderStatus==3) && type == 0">
      <div class="confirm" @click="_delOrder(orderInfo.id)">删除订单</div>
    </div>

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
import {
  getOrderDetail,
  pay,
  cancelOrder,
  delOrder,
  confirmOrder
} from "@/api/api";
import { toast } from "@/utils/index";
import { timeFn } from "@/utils/util";
export default {
  data() {
    return {
      orderId: "",
      orderInfo: {},
      endTimeInfo: "",
      hour: "00",
      min: "00",
      cancelId: "", //取消的订单id
      delId: "", //删除的订单id
      confirmId: "", // 确认收货id
      ishidden: false,
      isCancelOrder: false,
      isdelOrder: false,
      isConfirm: false,
      payType:'',
      type:0,// 我发起的0  我参与的1
    };
  },
  onLoad() {
    this.orderId = this.$mp.query.id;
    this.type = this.$mp.query.type;
    this.payType = this.$mp.query.payType;
    this._getOrderDetail();
  },
  methods: {
    //获取订单详情
    _getOrderDetail() {
      let that = this;
      let id = this.$mp.query.id;
      // wx.showLoading({
      //   title:"加载中",
      //   msak:true
      // })
      getOrderDetail({ id }).then(res => {
        // wx.hideLoadiing();
        if (!res.data.code) {
          that.orderInfo = res.data;
          let beginTime = new Date().getTime();
          let timeArr;
          if(res.data.orderStopTime) {
            setInterval(() => {
              that.endTimeInfo = that.isReady(
                beginTime,
                res.data.orderStopTime
              );
              timeArr = that.endTimeInfo.split(":");
              that.hour = timeArr[0];
              that.min = timeArr[1];
            }, 1000);
          }
        } else {
          toast(res.data.msg);
        }
      });
    },

    //倒计时
    isReady(beginTime, endTime) {
      if (new Date().getTime() > beginTime && new Date().getTime() < endTime) {
        return timeFn(endTime, "hours");
      } else if (new Date().getTime() < beginTime) {
        return timeFn(beginTime, "hours");
      } else if (new Date().getTime() > endTime) return 1;
    },
    //申请售后
    applyAftersale(index) {
      let orderInfo = JSON.stringify(this.orderInfo);
      let url = "/pages/order/applyAftersale/main?orderInfo=" + orderInfo + '&index=' + index;
      wx.navigateTo({ url });
    },
    //查看物流
    checkSheep() {
      let expressCode = this.orderInfo.expressCode;
      let expressNumber = this.orderInfo.expressNumber;
      let url ="/pages/checkSheeping/main?expressNumber=" +expressNumber +"&expressCode=" + expressCode;
      wx.navigateTo({ url });
    },
    //查看发票
    checkInvoince() {
      let orderInfo = JSON.stringify(this.orderInfo);
      let url = "/pages/order/invoinceDetail/main?orderInfo=" + orderInfo;
      wx.navigateTo({ url });
    },
    //查看成员
    checkUser() {
      let orderId = this.orderInfo.id;
      let url = '/pages/order/teamOrder/memberList/main?orderId=' + orderId
      wx.navigateTo({url})
    },
    //复制订单编号
    copyOrderNum() {
      wx.setClipboardData({
        data: this.orderInfo.orderNo,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data); // data
            }
          });
        }
      });
    },
    //立即支付
    payNow(orderNo) {
      pay({ orderNo }).then(res => {
        if (!res.data.code) {
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
          toast(res.data.msg);
        }
      });
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
      let id = this.cancelId;
       let from = this.$mp.query.from; 
      cancelOrder({ id }).then(res => {
        if (!res.data.code) { //如果有from 表示从确认订单页过来  取消订单之后直接返回到上一页
          if(from) {
             wx.navigateBack({
               delta:1
             });
             this.cancel();
          } else {
              let pages = getCurrentPages(); //当前页面栈
              if (pages.length > 1) {
                let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                beforePage.onLoad(); //触发父页面中的方法
                wx.navigateBack()
              }
              this.cancel();
          }
         
        } else {
          this.cancel();
          toast(res.data.msg);
        }
      });
    },

    //删除订单
    _delOrder(id) {
      this.delId = id;
      this.ishidden = true;
      this.isdelOrder = true;
    },
    confirmDel() {
      let id = this.delId;
      delOrder({ id }).then(res => {
        if (!res.data.code) {
          let pages = getCurrentPages(); //当前页面栈
          if (pages.length > 1) {
            let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
            // beforePage.onLoad({activeIndex:activeIndex}); //触发父页面中的方法
             beforePage.onLoad()
            wx.navigateBack()
          }
            this.cancel();
        } else {
          toast(res.data.msg);
        }
      });
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
           let pages = getCurrentPages(); //当前页面栈
            if (pages.length > 1) {
              let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
              beforePage.onLoad(); //触发父页面中的方法
              wx.navigateBack()
            }
            this.cancel();
        } else {
          toast(res.data.msg)
        }
      })
    },

    //评价
    eva(detail) {
         if(detail.isDiy) {
              let orderDetail = JSON.stringify(detail)
              let url = '/pages/relanchDiyEvaluate/main?orderDetail=' + orderDetail + '&type=orderDetail';
              wx.navigateTo({url})
         } else {
            let orderDetail = JSON.stringify(detail)
            let url = '/pages/relanchEvaluate/main?orderDetail=' + orderDetail + '&type=orderDetail';
            wx.navigateTo({url})
         }
        
    },

  }
};
</script>
<style lang="less" scoped>
.content {
  background: #f5f5f5;
  .top {
    width: 100%;
    height: 80px;
    background: url("data:image/png;base64,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");
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .orderStatus {
      .icon-clock {
        width: 17px;
        height: 17px;
        vertical-align: middle;
        margin-right: 5px;
      }
      span {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
    }
    .lastTime {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      margin-top: 10px;
    }
  }
  .address {
    background: #fff;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    .addressIn {
      display: flex;
      align-items: center;

      .leftImg {
        width: 30rpx;
        height: 34rpx;
        margin-right: 11px;
        margin-top: 26rpx;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .addressContent {
        flex: 1;
        padding-right: 24px;
        .contentTop {
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          .addressee {
            flex: 1;
          }
          span {
            font-size: 14px;
            color: #4a4a4a;
          }
        }
        .contentBot {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #4a4a4a;
        }
      }
    }
  }
  .goods {
    margin-bottom: 10px;
    .goodsInfo {
      background: #fff;
      padding: 10px 15px;
      .goodsContent {
        margin-bottom: 10px;
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
      .checkUserList {
        display: flex;
        justify-content: flex-end;
        .checkBtn {
           width:72px;
          height:28px;
          line-height: 28px;
          text-align: center;
          border-radius:16px;
          border:1px solid rgba(255,81,0,1);
          font-size:12px;
          color:rgba(255,81,0,1);
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
  .goodsTotalWrapper {
    background: #fff;
    padding: 13px 15px;
    margin-bottom: 10px;
    .cost {
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24rpx;
        &:last-of-type {
          margin-bottom: 0;
        }
        span {
          &.regular {
            font-size: 12px;
            color: rgba(74, 74, 74, 1);
          }
          &.gray {
            font-size: 12px;
            color: rgba(155, 155, 155, 1);
          }
          &.weight {
            font-size: 14px;
            font-weight: 600;
            color: rgba(52, 51, 51, 1);
          }
          &.orange {
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 81, 0, 1);
          }
        }
      }
    }
  }
  .invoince {
    background: #fff;
    padding: 13px 15px;
    margin-bottom: 10px;
    .invoinceType {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .invoicePayable {
        flex: 1;
      }
      .checkInvoince {
        width: 72px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 14px;
        font-size: 12px;
        color: rgba(74, 74, 74, 1);
        border: 1px solid rgba(74, 74, 74, 1);
      }
      &:last-of-type {
        margin-bottom: 0;
      }
      span {
        font-size: 12px;
        color: rgba(74, 74, 74, 1);
      }
    }
  }
  .sheeeping {
    background: #fff;
    padding: 13px 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .sheepingType {
      flex: 1;
      font-size: 12px;
      color: rgba(74, 74, 74, 1);
    }
    .checkSheeping {
      width: 72px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 14px;
      font-size: 12px;
      color: rgba(74, 74, 74, 1);
      border: 1px solid rgba(74, 74, 74, 1);
    }
  }
  .orderInfo {
    background: #fff;
    padding: 13px 15px;
    margin-bottom: 80px;
    .orderNum {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      &:last-of-type {
        margin-bottom: 0;
      }
      span {
        font-size: 12px;
        color: rgba(74, 74, 74, 1);
      }
      .order {
        flex: 1;
      }
      .copy {
        width: 72px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 14px;
        font-size: 12px;
        color: rgba(74, 74, 74, 1);
        border: 1px solid rgba(74, 74, 74, 1);
      }
    }
  }
  .bottom {
    height: 49px;
    background: rgba(255, 255, 255, 1);
    position: fixed;
    z-index: 30;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 32rpx;
    & > div {
      width: 144rpx;
      height: 56rpx;
      font-size: 24rpx;
      line-height: 56rpx;
      text-align: center;
      border-radius: 32rpx;
      border: 1px solid rgba(153, 153, 153, 1);
      color: #999999;
      margin-right: 32rpx;
      &:last-of-type {
        margin-right: 0;
      }
      &.confirm {
        border: 1px solid rgba(255, 81, 0, 1);
        color: #ff5100;
      }
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
