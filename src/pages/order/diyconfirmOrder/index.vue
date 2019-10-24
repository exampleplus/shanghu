<template>
  <div class="content">
    <div class="address">
      <div class="addressIn" v-if="addressInfo" @click="chooseAddress">
        <div class="leftImg">
          <img src="/static/images/address.png" alt>
        </div>
        <div class="addressContent">
          <div class="contentTop">
            <p class="addressee">
              <span>收件人:</span>
              <span>{{addressInfo.name}}</span>
            </p>
            <span>{{addressInfo.phone}}</span>
          </div>
          <div class="contentBot">收货地址: {{addressInfo.provinceName}}{{addressInfo.cityName}}{{addressInfo.districtName}}{{addressInfo.address}}</div>
        </div>
        <div class="selAdd">
          <img src="/static/images/user-arrow-right.png" alt>
        </div>
      </div>

      <div class="addressIn" v-else @click="chooseAddress">
        <div class="leftImg icon-address">
          <img src="/static/images/address.png" alt>
        </div>
        <div class="addAddress">
          添加收货地址
        </div>
        <div class="selAdd">
          <img src="/static/images/user-arrow-right.png" alt>
        </div>
      </div>

    </div>
    <div class="goods">
      <div class="goodsInfo">
        <div class="goodsContent" v-for="(item,index) in goodsList" :key="index">
          <p class="storeName">{{item.shopName}}</p>
          <div class="goodsWrapper" v-for="(goods,idx) in item.goodsList" :key="idx">
            <div class="shopLogo" v-if="item.shopLogo">
              <img :src="goods.shopLogo" alt="">
            </div>
            <div class="goodsImg">
              <img
                :src="goods.logo"
                alt
              >
            </div>
            <div class="goodsIntro">
              <div class="goodsName">{{goods.goodsName}}</div>
              <div>
                <div class="goodsSize">
                  <span>{{goods.skuName}}</span>
                </div>
                <div class="goodsMoney">
                  <p>
                    <span class="goodsPrice">￥{{totalMoney}}</span>
                    <span class="originalPrice">含素材费￥{{goods.materialPrice}}</span>
                    <!-- <span class="goodsNum">x {{goods.goodsNum}}</span> -->
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="money">
      <div class="goodsPrice">
        <span>商品金额</span>
        <span class="goodsMoney">￥{{totalPrice}}</span>
      </div>
      <div class="sheeping">
        <span>运费</span>
        <span>￥{{shipFree}}</span>
      </div>
    </div>

    <div class="invoince">
      <div class="selInvoince" @click="selInvoince">
        <span class="invo">发票</span>
        <p class>
          <span>请选择</span>
          <img src="/static/images/user-arrow-right.png" class="arrow">
        </p>
      </div>
      <div class="invoinceInfo">
        <span>备注</span>
        <input
          type="text"
          v-model="orderRemarks"
          placeholder="选填，可填写您的要求"
          placeholder-style="font-size:14px;color:#9B9B9B;"
        >
      </div>
    </div>
    <!-- <div class="isPay">
        <div class="setDefault">是否线下支付</div>
        <section class="setAddress">
            <switch @change="switchChange" :checked="isDefault" color="#FF5100"/>
        </section>
    </div> -->
    <div class="bottom">
      <div class="total">
        <p>
          <span>总计:</span>
          <span class="totalPrice">￥{{totalMoney}}</span>
        </p>
      </div>
      <div class="calculate" @click="calculate" >支付</div>
       <!-- <div class="calculate disabled" v-else>支付</div> -->
    </div>
  </div>
</template>
<script>
import {checkDiyOrderInfo,getDiyRreight,diyconfirmOrder} from '@/api/api'
import {toast} from '@/utils/index'
export default {
  data() {
    return {
        loading:false,
        isDefault:false,
        addressInfo:{},
        hasAddress:false,
        isInvoice:0,
        invoiceId:'',
        totalPrice:0, //总计金额
        orderRemarks:'',//订单备注
        goodsList:[],
        diyInfo:[],  //diy订单信息
        isCarPay:false,  //是否是购物车下单
        shipId:'', //收货地址id
        shipFree:0,// 运费
        showPay:true,
    };
  },
 onShow() {
    this.isCarPay = false;
    this.loading = false;
    this.showPay = true;
    if(this.$mp.query.isCarPay) { //如果从购物者进入该页面
      this.isCarPay = true
   }
   this._getPayInfo();
 },
 onUnload() {
    wx.removeStorageSync('addressInfo')
    wx.removeStorageSync('invoinceInfo')
 },
 computed:{
   //商品信息
    selGoods() {
       let proList = [];
       for(let i = 0; i <  this.goodsList.length; i++) {
        this.goodsList[i].goodsList.map(ele => {
          proList.push({id:ele.id,goodsNum:ele.goodsNum})
          return ele
        })
      }
      return proList
    },
    //总价
    totalMoney() {
      let shipFree = this.shipFree;
      let totalMoney = this.totalPrice
      return (shipFree + totalMoney).toFixed(2);
    },
 },
  methods: {
    //选择地址
    chooseAddress() {
      let url = '/pages/personalCenter/myAddress/main?type=order'
      wx.navigateTo({url})
    },
    _getPayInfo() {
      let diyInfo = JSON.parse(this.$mp.query.diyInfo);
      this.diyInfo = diyInfo;
      this.totalPrice = diyInfo[0].orderAmount;
      checkDiyOrderInfo(diyInfo).then(res => {
        if(!res.data.code) { 
           this.goodsList = res.data.baseList;
           if(!wx.getStorageSync('addressInfo')) {
              this.addressInfo = res.data.address;
              let shipId = res.data.address.id;
              this.shipId = shipId;
              let goodsList = this.selGoods;
              let baseMaterialList = goodsList;
              let params = {
                baseMaterialList,
                shipId
              }
              this._getRreight(params);
           } else {   //从地址列表选地址
              this.addressInfo = JSON.parse(wx.getStorageSync("addressInfo"));
              let shipId = this.addressInfo.id;
              this.shipId = shipId;
              let goodsList = this.selGoods;
              let baseMaterialList = goodsList;
               let params = {
                baseMaterialList,
                shipId
              }
              this._getRreight(params);
           }
         
        } else {
          toast(res.data.msg)
        }
      })
    },

    //获取运费
    _getRreight(params) {
      getDiyRreight(params).then(res => {
        if(!res.data.code) {
          this.shipFree = res.data;
        } else {
          toast(res.data.msg)
        }
      })
    },

   
   //选择发票
    selInvoince() {
      let url = '/pages/personalCenter/myInvoince/main?type=order';
      wx.navigateTo({url})
    },

    //去支付
    calculate() {
    if(this.loading) {
       return;
     }
     let _this = this;
     this.loading = true;
     let orderFreight = this.shipFree;
     let orderAmount = this.totalMoney;
     let isCarPay = this.isCarPay;
     let shipId = this.shipId;
     let orderRemarks = this.orderRemarks;
     let invoinceInfo = wx.getStorageSync("invoinceInfo");
     if(invoinceInfo) {
       this.isInvoice = 1;
       this.invoiceId = JSON.parse(invoinceInfo).id;
     }
     let isInvoice = this.isInvoice;
     let invoiceId = this.invoiceId;
     let orderDataList = JSON.parse(this.$mp.query.diyInfo);
     let diyInfoList = orderDataList[0].diyInfoList;
     let params = {
      orderDataList,
      diyInfoList,
      orderFreight,
      orderAmount,
      isCarPay,
      shipId,
      orderRemarks,
      isInvoice,
      invoiceId,
     }
     diyconfirmOrder(params).then(res => {
       if(!res.data.code) {
         let orderId = res.data.orderId;
         wx.requestPayment({
              timeStamp: res.data.pay.timeStamp,
              nonceStr: res.data.pay.nonceStr,
              package: res.data.pay.pkg,
              signType: res.data.pay.signType,
              paySign: res.data.pay.paySign,
              success: () => {
                this.success = true;
                setTimeout(() => {
                   _this.loading = false;
                    wx.reLaunch({
                      url: "/pages/order/paySuccess/main?id=" + orderId
                    });
                },200)
                
              },
              fail: () => {
                _this.loading = false;
                toast("支付失败");
                //  wx.redirectTo({
                //   url: '/pages/order/myOrder/main'
                // });
                 wx.redirectTo({
                  url: '/pages/order/orderDetail/main?id=' + orderId + '&type=confirm'
                });
              }
            });
       } else {
         toast(res.data.msg)
         _this.loading = false;
       }
     })
    },
  }
};
</script>

<style lang="less" scoped>
.address {
  background: #fff;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  .addressIn {
    display: flex;
    align-items: center;
    padding-right: 24px;
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
    .icon-address {
      margin-top: 0;
    }
    .addAddress {
      font-size:14px;
      color:rgba(74,74,74,1);
      flex: 1;
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
    .selAdd {
      img {
        width: 8px;
        height: 15px;
      }
    }
  }
}
.goods {
  margin-bottom: 10px;
  .goodsInfo {
    background: #fff;
    // padding: 10px 15px;
    .goodsContent {
      .storeName {
        font-size: 13px;
        font-weight: 400;
        color: rgba(9, 2, 3, 1);
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .goodsWrapper {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 10px 15px;
        position: relative;
        .shopLogo {
          position: absolute;
          top: 15px;
          left: 20px;
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
            margin-bottom: 10px;
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
                // text-decoration: line-through;
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
.money {
  background: #fff;
  margin-bottom: 10px;
  .goodsPrice {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding: 15px;
    span {
      font-size: 14px;
      color: rgba(74, 74, 74, 1);
      &.goodsMoney {
        font-size: 14px;
        color: rgba(255, 81, 0, 1);
      }
    }
  }
  .sheeping {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    span {
      font-size: 14px;
      color: rgba(74, 74, 74, 1);
    }
  }
}
.invoince {
  background: #fff;
  margin-bottom: 10px;
  .selInvoince {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #4a4a4a;
    padding: 15px;
    border-bottom: 1px solid #eee;
    .arrow {
      width: 6px;
      height: 12px;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .invoinceInfo {
    padding: 15px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #4a4a4a;
    input {
      flex: 1;
      color: #333;
      padding-left: 30px;
    }
  }
}
.isPay {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: #fff;
    margin-bottom: 70px;
    .setDefault {
        font-size:14px;
        color:rgba(74,74,74,1);
    }
}
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 49px;
  line-height: 49px;
  display: flex;
  background: #fff;
  z-index: 10;
  .total {
    flex: 1;
    padding-left: 15px;
    p {
      font-size: 30rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .totalPrice {
        color: #f34f1e;
        margin-left: 6rpx;
      }
    }
  }
  .calculate {
    width: 110px;
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(
      90deg,
      rgba(254, 121, 0, 1) 0%,
      rgba(255, 81, 0, 1) 100%
    );
    &.disabled {
      background: #ccc;
    }
  }
}
</style>
