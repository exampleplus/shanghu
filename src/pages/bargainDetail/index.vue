<template>
  <div class="content">
    <div class="swiper">
      <swiper @change="swiperChange">
        <swiper-item v-for="(item,val) in imgUrls" :key="val" class="swiperItem">
          <img :src="item" class="slide-image">
        </swiper-item>
      </swiper>
      <p class="dots">{{current}}/{{len}}</p>
    </div>
    <div class="goodsInfo">
        <img src="/static/images/bg-goodsDetail.png" class="bg-goods">
        <div class="info">
            <div class="priceInfo">
                <p class="mini">
                    <span class="sign">￥</span>
                    <span class="miniPrice">{{detailInfo.goodsPrice}}</span>
                    <span class="miniIntro">最低价</span>
                </p>
                <div class="saleInfo">
                    <p class="originalPrice"><span>原价￥</span> <span>{{detailInfo.goodsMarketPrice}}</span></p>
                   <p class="saleNum" v-if="detailInfo.saleCount"><span>销量:</span> <span>{{detailInfo.saleCount}}</span></p>
                    <p class="saleNum" v-else><span>销量:</span> <span>0</span></p>
                </div>
            </div>
            <div class="endTime">
                <p>距离结束还剩</p>
                <span class="square">{{day}}</span>
                <span class="colon">:</span>
                <span class="square">{{hour}}</span>
                <span class="colon">:</span>
                <span class="square">{{min}}</span>
                  <!-- <span class="square">{{ss}}</span> -->
            </div>
        </div>
    </div>
    <div class="goodsName">
       {{detailInfo.goodsName}}
    </div>
    <divi></divi>
    <!-- 商品详情 -->
    <div class="detailWrapper">
        <div class="top">
            <div class="border">

            </div>
            <div class="detail">
               <wxParse :content="detailInfo.goodsDetail" noData="" />
            </div>
        </div>
    </div>
     <div class="popup-mask" v-if="showMask" @click='closeMask'></div>
      <div class="show-popup" v-if="showMask">
      <div class="popup-contents">
        <div class="popup-goodsInfo">
            <div class="goodsImg">
              <img :src="goodsInfo.goodsSkuImg" alt="">
            </div>
            <div class="priceInfo">
              <div class="priceTop">
                <div class="price">
                  ￥{{goodsInfo.goodsBargainBottomPrice}}
                </div>
                  <img src="/static/images/close.png" class="closeImg" @click="closeMask">
              </div>
              <div class="stone">
                库存:{{goodsInfo.goodsBargainStock}}
              </div>
            </div>
        </div>
        <!-- 规格 -->
        <div class="size" v-for="(item,index) in specList" :key="index">
          <p>{{item.goodsSpecName}}</p>
          <div class="specifications"> 
             <div class="sizeItem" :class="it.isTrue ? 'act' : ''" v-for="(it,ix) in item.goodsSkuSpecVals" :key="ix" @click="choose(it,index)">{{it.goodsSkuSpecValName}}</div>
          </div>
        </div>
        <!-- <div class="num">
          <div class="selnum">
            数量
          </div>
          <div class="nums">
            <div class="reduse" @click='reduceMum'>
              <img src="/static/images/icon-reduse.png" alt="">
            </div>
            <div class="buyNum">
                {{buyNum}}
            </div>
            <div class="addNum" @click="addNum">
                <img src="/static/images/icon-add.png" alt="">
            </div>
          </div>
        </div> -->
        <div class="btn">
          <div class="addCart" @click="buyNow" v-if="showBuy">
            立即购买
          </div>
          <div class="buyNow" @click="releaseBargain" v-if="showBargain">
            发起砍价
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
        <div class="buy" @click="showBuyMask">
            <img src="/static/images/icon-addCart.png" alt="" >
            <span>立即购买</span>
        </div>
        <div class="bargain" @click="showBargainMask">
            发起砍价
        </div>
    </div>

  </div>
</template>
<script>
import divi from '@/components/divi'
import wxParse from 'mpvue-wxparse'
import { bargainDetail, bargainVerifyGoodsStock, getBargainId } from "@/api/api";
import { toast, formatTime, _debounce } from "@/utils/index";
import { timeFn } from '@/utils/util'


export default {
  data() {
    return {
        detailInfo:{},  //商品详情
        showMask:false,  //遮罩
        showBuy:false,
        showBargain:false,
        current:1,
        len:'',
        imgUrls:[],    //轮播图
        day:'00',
        hour:'00',
        min:'00',
        ss:'00',
        endTimeInfo:'',
        timer:null,
        isCanBuy:false,
        buyNum:1,   //购买数量
        goodsInfo:{},
        goodsSkuId:'',  // skuid
        specList:[], //规格
        skuList:[],  //规格集合

    };
  },
  components:{
      divi,
      wxParse
  },
  onShow() {
    this.showMask = false;
    this.day='00'
    this.hour='00'
    this.min='00'
    // clearInterval(this.timer)
  },
  // onLoad() {
  //      Object.assign(this.$data, this.$options.data())
  //      this.queryBargainDetail();
  // },
  onUnload() {
    clearInterval(this.timer)
  },
   mounted() {
       Object.assign(this.$data, this.$options.data())
       this.queryBargainDetail();
  },
  methods:{
       swiperChange(e) {
            this.current = Number(e.mp.detail.current) + 1;
        },
        queryBargainDetail() {
            let goodsId = this.$mp.query.goodsId;
            let that = this;
            bargainDetail({goodsId}).then(res => {
                if(!res.data.code) {
                    this.detailInfo = res.data;
                    // this.detailInfo.goodsDetail = this.detailInfo.goodsDetail.replace(/<img/gi, '< img style="vertical-align:middle;display:block" ')
                    this.specList = res.data.specList;  //规格
                    this.skuList = res.data.skuList;  //规格集合
                    this.goodsInfo = res.data.skuList[0];
                    this.goodsSkuId = this.goodsInfo.id;
                     this.specList.forEach(item => {
                        item.goodsSkuSpecVals.forEach((it,ix) => {
                            this.$set(it, 'isTrue', false)
                            if (ix === 0) it.isTrue = true // 默认选中第一个规格
                        })
                    })
                    
                    this.imgUrls =  res.data.banner.split(',')
                    this.len = this.imgUrls.length;
                    let startTime = res.data.startTime;
                    let endTime = res.data.endTime;
                    let timeArr;
                    this.timer =  setInterval(() => {
                    that.endTimeInfo = that.isReady(
                        startTime,
                        endTime
                    );
                      timeArr = that.endTimeInfo.split(":");
                      that.day = timeArr[0];
                      that.hour = timeArr[1];
                      that.min = timeArr[2];
                      that.ss = timeArr[3];
                    }, 1000);
                } else {
                    toast(res.data.msg)
                }   
            })
        },
         // 选择规格
        choose(it,index) {
            this.specList[index].goodsSkuSpecVals.forEach(item => {
                item.isTrue = false;
            })
            it.isTrue = true
            this.findGoodsNum()
        },
        findGoodsNum() {
        // 确定已选择完规格
            let goodsName = []
            this.specList.forEach(item => {
                goodsName.push(item.goodsSkuSpecVals.filter(it => it.isTrue)[0].goodsSkuSpecValName)
            })
            console.log("goodsName",goodsName)
            // 判断对应的规格数据
            goodsName = goodsName.join('_')

            let asd = this.skuList.filter(item => item.goodsSkuName === goodsName || item.goodsSkuName.split('_').reverse().join('_') === goodsName) 
            console.log("asd",asd)
            this.goodsInfo = asd[0]
            this.goodsSkuId = asd[0].id // 选中的规格id
        },
        //倒计时
        isReady(startTime, endTime) {
            if (new Date().getTime() > startTime && new Date().getTime() < endTime) {
                return timeFn(endTime, "day");
            } else if (new Date().getTime() < startTime) {
                return timeFn(startTime, "day");
            } else if (new Date().getTime() > endTime) return 1;
        },
        reduceMum() {
          let buyNum = this.buyNum;
              buyNum--;
              if (buyNum <= 1) {
                  buyNum = 1
              }
              this.buyNum = buyNum;
        },
        addNum() {
            let buyNum = this.buyNum;
            buyNum++;
            this.buyNum = buyNum;
        },

        //关闭弹框
         closeMask() {
            this.showMask = false;
        },
        //立即购买弹框
        showBuyMask() {
            this.showMask = true;
            this.showBuy = true;
            this.showBargain = false;
        },

        //发起砍价弹框
        showBargainMask() {
            this.showMask = true;
            this.showBuy = false;
            this.showBargain = true;
        },
        //立即购买
         buyNow() {
              let _this = this;
              let skuId = _this.goodsSkuId;
              let goodsNum = _this.buyNum;
              let id = _this.$mp.query.goodsId;
              let params = {
                skuId,
                goodsNum,
                id
              }
              let goodsArr = [];
              goodsArr.push(params);
              bargainVerifyGoodsStock({skuId,goodsId:id}).then(res => {
                if(!res.data.code) {
                  _this.showMask = false;
                  goodsArr = JSON.stringify(goodsArr)
                  let url = '/pages/order/confirmOrder/main?goodsArr=' + goodsArr + '&bargainOrder=1';
                  wx.navigateTo({url})
                } else {
                  toast(res.data.msg)
                }
              })
         },
          
        //发起砍价
        releaseBargain() {
            let skuId = this.goodsSkuId;
            let goodsId = this.$mp.query.goodsId;
            let goodsNum = this.buyNum;
            getBargainId({skuId,goodsId}).then(res => {
                if(!res.data.code) {
                     let id = res.data;
                     let url = "/pages/order/twoshareBargainDetail/main?id=" + id + "&goodsNum=" +  goodsNum + "&goodsId=" + goodsId + "&skuId=" + skuId;
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
@import "../../common/styles/elements.less";
.content {
    background: #fff;
}
.swiper {
  height:360px;
  background:rgba(243,244,241,1);
  position: relative;
  swiper {
    height: 100%;
    .swiperItem {
      height: 100%;
      width: 100%;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    bottom: 32rpx;
    right: 23rpx;
    width: 80rpx;
    height: 44rpx;
    line-height: 44rpx;
    text-align: center;
    background: rgba(0, 0, 0, 1);
    border-radius: 32rpx;
    opacity: 0.5;
    color: #fff;
    font-size: 20rpx;
  }
}
.goodsInfo {
    width: 100%;
    height: 64px;
    position: relative;
    .bg-goods {
        width: 100%;
        height: 64px;
        position:absolute;
        top:0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1;
    }
    .info {
        display: flex;
        padding:0 15px;
        justify-content: space-between;
        position: relative;
        z-index: 5;
        .priceInfo {
            padding-top: 5px;
            .mini {
                display: flex;
                align-items: center;
                color: #fff;
                margin-bottom: 5px;
                .sign {
                    font-size: 18px;
                    align-self: flex-end;
                }
                .miniPrice {
                    font-size:24px;
                    font-family:PingFangSC-Medium;
                    font-weight:600;
                    margin:0 5px;
                }
                .miniIntro {
                    width:39px;
                    height:14px;
                    line-height: 14px;
                    text-align: center;
                    background:rgba(255,255,255,0.9);
                    border-radius:2px;
                    font-size:11px;
                    font-weight:400;
                    color:rgba(255,81,0,1);
                }
            }
            .saleInfo {
                display: flex;
                align-items: center;
                font-size:11px;
                color:rgba(255,255,255,1);
                .originalPrice {
                    text-decoration: line-through;
                    margin-right: 15px;
                }
            }
        }
        .endTime {
            padding-top: 19px;
            text-align: center;
            p {
                font-size:12px;
                font-family:PingFangSC-Medium;
                font-weight:600;
                color:rgba(255,255,255,1);
            }
            span {
                color: #fff;
                &.colon {
                    margin:0 5px;
                }
                &.square {
                    width:30px;
                    height:17px;
                    line-height: 17px;
                    padding:2px 8px;
                    text-align: center;
                    background:rgba(255,86,12,1);
                    border-radius:4px;
                    font-size: 12px;
                    font-weight: 600;
                }
            }
        }
    }
}
.goodsName {
    font-size:18px;
    font-family:PingFangSC-Medium;
    font-weight:600;
    color:rgba(9,2,3,1);
    margin:11px 14px 18px 15px;
}
.detailWrapper {
    padding-bottom: 120rpx;
    .top {
        display: flex;
        align-items: center;
        // padding:15px;
        .border{
            width:4px;
            height:13px;
            background:rgba(255,81,0,1);
        }
        .detail {
            font-size:14px;
            font-weight:600;
            color:rgba(9,2,3,1);
            // margin-left: 8px;
        }
    }
}
.popup-mask{
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
}
.show-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  .popup-contents {
    // height: 400px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 6;
    padding-bottom: 10px;
    // overflow-y: auto;
    .popup-goodsInfo {
      display: flex;
      padding-left: 15px;
       padding-right: 16px;
      .goodsImg {
        width: 96px;
        height: 96px;
        margin-right: 14px;
        margin-top: -12px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .priceInfo {
        flex:1;
        display: flex;
        flex-direction: column;
        padding-top:12px;
       
        .priceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
           margin-bottom: 8px;
          .price {
            font-size:18px;
            font-weight:600;
            color:rgba(255,81,0,1);
          }
            .closeImg {
              width: 15px;
              height:15px;
            }
        }
        .stone {
          font-size:12px;
          font-weight:400;
          color:rgba(97,84,84,1);
        }
      }
    }
    .size {
      padding:0 15px;
      margin-top: 22px;
      .border-bottom(#eee);
      p {
        font-size:14px;
        font-weight:400;
        color:rgba(52,51,51,1);
        margin-bottom: 8px;
      }
      .specifications {
        display: flex;
        flex-wrap: wrap;
        .sizeItem {
          height:26px;
          line-height: 26px;
          text-align: center;
          font-size:12px;
          color:rgba(52,51,51,1);
          background:rgba(246,246,246,1);
          border-radius:4px;
          margin-right: 15px;
          margin-bottom: 12px;
          padding: 0 10px;
          &.act {
            color: #FF5100;
            border: 1px solid #FF5100;
          }
        }
      }
      
    }
    .num {
      display: flex;
      padding: 0 15px;
      align-items: center;
      justify-content: space-between;
      margin:23px 0;
      .selnum {
        font-size:14px;
        font-weight:400;
        color:rgba(52,51,51,1);
      }
      .nums {
        display: flex;
        align-items: center;
        .reduse {
          width:33px;
          height:30px;
          line-height: 18px;
          text-align: center;
          background:rgba(245,245,245,1);
          border-radius:0px 2px 2px 0px;
          img {
            width: 12px;
            height: 2px;
          }
        }
        .buyNum {
          width:38px;
          height:30px;
          line-height: 30px;
          text-align: center;
          font-size:14px;
          color:rgba(52,51,51,1);
          background:rgba(237,235,235,1);
          margin:0 2px;
        }
        .addNum {
            width:33px;
            height:30px;
            line-height: 30px;
            text-align: center;
            background:rgba(245,245,245,1);
            border-radius:0px 2px 2px 0px;
          img {
            width: 12px;
            height: 12px;
          }
        }
      }

    }
    .btn {
      margin-top: 15px;
      padding:0 15px;
      display: flex;
      justify-content: space-between;
      .addCart {
        flex: 1;
        height:40px;
        line-height: 40px;
        border-radius:22px;
        text-align: center;
        font-size:16px;
        color:rgba(255,81,0,1);
        border:1px solid rgba(255,81,0,1);
      }
      .buyNow {
        flex: 1;
        height:40px;
        line-height: 40px;
        text-align: center;
        font-size:16px;
        font-weight:400;
        color:rgba(255,255,255,1);
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:22px;
      }
    }
  }
}
.bottom {
    position: fixed;
    bottom:0px;
    left:0;
    right:0;
    z-index: 100;
    height:42px;
    background:rgba(255,255,255,1);
    padding:8px 15px;
    display: flex;
    justify-content: space-between;
    .buy {
        width:246rpx;
        height:80rpx;
        text-align:center;
        border-radius:40rpx;
        border:2rpx solid #ececec;
        display:flex;
        align-items:center;
        justify-content:center;
        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 2px;
        }
        span {
            font-size:14px;
            font-weight:400;
            color:rgba(9,2,3,1);
        }
    }
    .bargain {
        width:207px;
        height:40px;
        line-height: 40px;
        text-align: center;;
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:20px;
        font-size:16px;
        font-weight:600;
        color:rgba(255,255,255,1);
    }
}
</style>
