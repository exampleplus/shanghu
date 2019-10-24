<template>
  <div class="content">
    <div class="top" v-if="cartList.length > 0">
      <img
        src="/static/images/radio-uncheck.png"
        alt
        v-if="!isSelectAll"
        @click="selectProduct(isSelectAll)"
      />
      <img
        src="/static/images/radio-check.png"
        alt
        v-if="isSelectAll"
        @click="selectProduct(isSelectAll)"
      />
      <span class="selAll">全选</span>
      <span class="edit" v-if="showEdit" @click="editCart">编辑</span>
      <span class="edit" v-else @click="editCart">取消</span>
    </div>
    <div class="list">
      <ul class="cartList" v-for="(item,index) in cartList" :key="index" v-if="cartList.length > 0">
        <p class="storeName">{{item.shopName}}</p>
        <li class="cartItem" v-for="(good,idx) in item.carGoodsList" :key="idx">
          <img
            src="/static/images/radio-uncheck.png"
            alt
            class="radio"
            v-if="!good.selected"
            @click="good.selected=!good.selected"
          />
          <img
            src="/static/images/radio-check.png"
            alt
            class="radio"
            v-if="good.selected"
            @click="good.selected=!good.selected"
          />
          <div class="goodsPic">
            <img :src="good.goodsImg" alt />
          </div>
          <div class="goodsIntro">
            <div class="goodsName">{{good.goodsName}}</div>

            <div class="goodsMoney">
              <div class="goodsSize">
                <span>{{good.skuName}}</span>
              </div>
              <div class="sale">
                <span class="goodsPrice">￥{{good.goodsPrice}}</span>
                <div class="num">
                  <img src="/static/images/cart-reduce.png" class="reduce" @click="reduceNum(good)" />
                  <span class="buyNum">{{good.goodsNum}}</span>
                  <img src="/static/images/cart-add.png" class="add" @click="addNum(good)" />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="nocart" v-if="cartList.length == 0 && hasData == false">
      <img src="/static/images/nocart.png" alt />
      <p>购物车空空如也～</p>
    </div>
    <div class="bottom" v-if="cartList.length > 0">
      <div class="total">
        <p>
          <span>总计:</span>
          <span class="totalPrice">￥{{totalPrice}}</span>
        </p>
      </div>
      <div class="calculate" @click="calculate" v-if="showEdit">立即结算</div>
      <div class="del" @click="_delCart" v-else>删除</div>
    </div>

     <div class="hidden" v-if="ishidden"></div>
    <!-- 删除提示 -->
    <div class="modal" v-if="ishidden">
      <p>是否确认删除选中的商品？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="deleteSeltProducts">确定</a>
      </div>
    </div>
  </div>
</template>
<script>
import { getcart, changeCart ,delCart, verifyGoodsStock} from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      ishidden:false,
      showEdit:true, //默认显示编辑
      cartList: [],
      hasData:true,
      idList:[],  //删除商品的数组
    };
  },
  computed: {
      //计算全选状态 循环购物车列表当每件商品都被选中时 全选设为true
    isSelectAll() {
      let cartList = this.cartList;
      return cartList.every(ele => {
        return ele.carGoodsList.every(val => {
          return val.selected
        })
      })
    },
    //计算商品总价
    totalPrice() {
    //选中的商品
    // let proList = [];
    // for(let i = 0; i <  this.cartList.length; i++) {
    //   this.cartList[i].carGoodsList.filter(ele => {
    //     proList.push(ele)
    //     return ele.selected
    //   })
    // }
    // var selList = proList.filter(function(val) {
    //     return val.selected;
    //   }); 

    //   return selList;
      let selList = this.selGoods;
      var totalPrice = 0; //默认总价
      for (let i = 0, len = selList.length; i < len; i++) {
        //总价累加
        // console.log("goodsNum",selList[i].goodsNum)
        // console.log("goodsPrice",selList[i].goodsPrice)
        totalPrice += selList[i].goodsNum * selList[i].goodsPrice;
      }
      return totalPrice.toFixed(2);
    },


    //选中的商品
    selGoods() {
       let proList = [];
       for(let i = 0; i <  this.cartList.length; i++) {
        this.cartList[i].carGoodsList.filter(ele => {
          proList.push(ele)
          return ele.selected
        })
      }
       var selList = proList.filter(function(val) {
        return val.selected;
       }); 

      return selList
    }

  },
  onShow() {
       Object.assign(this.$data, this.$options.data())
      this._getcart();
  },
  onLoad() {
    
  },
  methods: {
    //获取购物车
    _getcart() {
      let _this = this;
      wx.showLoading({title:"加载中"})
      getcart().then(res => {
        if (!res.data.code) {
          wx.hideLoading();
          this.cartList = res.data;
          if(this.cartList.length > 0) {
            this.hasData = true
          } else {
            this.hasData = false;
          }
           _this.cartList.map(function(item) {
            item.carGoodsList.map(ele => {
              _this.$set(ele, "selected", false);
            })
          });
        } else {
          toast(res.data.msg);
        }
      });
    },
    //增加商品数量
    addNum(item) {
      let that = this;
      let params = {
        id: item.id,
        goodsNum: item.goodsNum + 1
      };
      changeCart(params).then(res => {
          if (res.data.code) {
            //有code代表报错
            toast(res.data.msg);
          } else {
            item.goodsNum++;
          }
        })
        .catch(response => {
          console.log("status", response.status);
        });
    },

    //减去商品数量
    reduceNum(item) {
       if( item.goodsNum <= 1) {
            item.goodsNum = 1;
            return;
        }
      let that = this;
      let params = {
        id: item.id,
        goodsNum: item.goodsNum - 1
      };
      changeCart(params).then(res => {
          if (res.data.code) {
            //有code代表报错
            toast(res.data.msg);
          } else {
            
            item.goodsNum--;
           
          }
        })
        .catch(response => {
          console.log("status", response.status);
        });
    },
    //全选与取消全选
    selectProduct(_isSelect) {
      //遍历cartList，每件商品的状态全部取反(与isSelectedAll相反)
      for (var i = 0, len = this.cartList.length; i < len; i++) {
        for(let j = 0; j <  this.cartList[i].carGoodsList.length; j++) {
            this.cartList[i].carGoodsList[j].selected = !_isSelect;
        }
      }
    },
    //编辑购物车
    editCart() {
      this.showEdit = !this.showEdit;
    },

     //删除选中的商品的id数组
    getIds() {
      let ids = [];
      //遍历选中的商品
      let selGoodsList = this.selGoods;
       for (let i = 0; i < selGoodsList.length; i++) {
        const element = selGoodsList[i];
        if (element.selected) {
          ids.push(element.id);
        }
      }
      return ids;
    },
    //删除购物车
    _delCart() {
      let selGoodsList = this.selGoods;
      if(selGoodsList.length <= 0) {
        toast("请选择要删除的商品");
        return;
      }
      let idList = this.getIds();
      this.idList = idList;
      this.ishidden = true;
    },
    //确认删除
    deleteSeltProducts() {
       let idList = this.idList;
       delCart({idList}).then(res => {
        if(!res.data.code) {
          toast("删除成功")
          this._getcart();
          this.ishidden = false;
        } else {
          toast(res.data.msg)
        }
      })
    },
    cancel() {
      this.ishidden = false;
    },
    //结算
    calculate() {
      let shopIds = [];
      let selGoodsList = this.selGoods;

      if(selGoodsList.length <= 0) {
        toast("请选择商品");
        return;
      }

      for(let i = 0; i < selGoodsList.length; i++) {
        shopIds.push(selGoodsList[i].shopId)
      }

     var anary = [...new Set(shopIds.sort())];
     if(anary.length >= 2) {
       toast("不能同时结算多个店铺的商品");
       return;
     }
      let goodsArr = [];
       for (let i = 0; i < selGoodsList.length; i++) {
          goodsArr.push({
              id:selGoodsList[i].goodsId,
              skuId:selGoodsList[i].skuId,
              goodsNum:selGoodsList[i].goodsNum,
              shopId:selGoodsList[i].shopId
          })
      }
      let shopId = goodsArr[0].shopId;
       verifyGoodsStock(goodsArr).then(res => {
        if(!res.data.code) {
            goodsArr = JSON.stringify(goodsArr)
            let url = '/pages/order/confirmOrder/main?goodsArr=' + goodsArr + '&isCarPay=' + true + '&shopId=' + shopId;
            wx.navigateTo({url})
        } else {
          toast(res.data.msg)
        }
      })
     
    },

  }
};
</script>

<style lang="less" scoped>
.content {
  .top {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    background: #fff;
    img {
      width: 32rpx;
      height: 32rpx;
      margin-right: 14rpx;
    }
    .selAll {
      font-size: 28rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #090203;
      flex: 1;
    }
    .edit {
      font-size: 14px;
      color: rgba(255, 81, 0, 1);
    }
  }
  .list {
    padding-bottom: 110rpx;
  }
  .cartList {
    background: #fff;
    margin: 10px;
    border-radius: 6px;
    padding: 12px;
    .storeName {
      font-size: 13px;
      color: rgba(9, 2, 3, 1);
      margin-bottom: 20px;
    }
    li {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0rpx;
      }
      .radio {
        width: 32rpx;
        height: 32rpx;
        margin-right: 24rpx;
        align-self: center;
      }
      .goodsPic {
        width: 96px;
        height: 96px;
        border-radius: 4px;
        margin-right: 24rpx;
        img {
          width: 100%;
          height: 100%;
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

        .goodsMoney {
          .goodsSize {
            font-size: 12px;
            font-weight: 400;
            color: rgba(155, 155, 155, 1);
          }
          .sale {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .goodsPrice {
              font-size: 16px;
              color: rgba(255, 81, 0, 1);
            }
            .num {
              .reduce,
              .add {
                width: 33px;
                height: 24px;
                vertical-align: middle;
              }
              .buyNum {
                display: inline-block;
                width: 38px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                color: #343333;
                font-size: 14px;
                background: #edebeb;
                margin: 0 1px;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
  .nocart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 130px;
    img {
      width: 130px;
      height: 109px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
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
    .total {
      flex: 1;
      padding-left: 16px;
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
    .del {
      width: 110px;
      height: 49px;
      line-height: 49px;
      text-align: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      background:#F01420;
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
