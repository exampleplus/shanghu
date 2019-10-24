<template>
  <div class="content" :style="showMask ? 'position:fixed;overflow:hidden;height:100%;width:100%;' :''">
    <div class="swiper">
      <swiper @change="swiperChange">
        <swiper-item v-for="(item,val) in bannerList" :key="val" class="swiperItem">
          <img :src="item" class="slide-image" mode="aspectFill">
        </swiper-item>
      </swiper>
      <p class="dots">{{current}}/{{len}}</p>
    </div>
    <div class="goodsInfo">
      <p class="goodsName">{{detail.goodsName}}</p>
      <div class="goods">
        <div class="price">
          <span class="bargainPrice">￥{{detail.goodsPrice}}</span>
          <span class="originalPrice">￥{{detail.goodsMarketPrice}}</span>
        </div>
        <div class="sale">
          <span>销量:</span>
          <span v-if="detail.saleCount">{{detail.saleCount}}</span>
          <span v-else>0</span>
        </div>
      </div>
    </div>
    <divi></divi>
    <section class="selectNum" @click="selSize">
      <p>
        <span>选择规格</span>
        <img src="/static/images/arrow-right.png" alt>
      </p>
    </section>
    <divi></divi>
    <div class="designer">
      <div class="border"></div>
      <div class="hot">评价 ({{detail.evaluateCount}})</div>
      <div class="more" @click="checkEvaluate" v-if="detail.evaluateCount > 0">
        <span>查看全部</span>
        <span class="arrow"></span>
      </div>
    </div>
    <!-- 评价 -->
    <ul class="judgeList">
      <li class="item" v-for="(item,index) in judgeList" :key="index">
        <div class="top">
          <img :src="item.headimgurl" alt v-if="item.headimgurl">
          <span class="nickName">{{item.userName}}</span>
        </div>
        <div class="times">
          <p>
            <span class="gmtCreate">{{item.gmtCreate}}</span>
            <span class="size">{{item.skuName}}</span>
          </p>
        </div>
        <div class="content">{{item.evaluateName}}</div>
        <div class="imgs" v-if="item.img"> 
            <img v-for="(pic,val) in item.imgs"  :key="val" :src="pic" alt="" @click='previewImg(item.imgs,pic)'>
        </div>
        <div class="shopReply" v-if="item.returnDesc">
          <div class="shoper">
            <img src="/static/images/icon-shoper.png" alt="">
            <span>店家回复</span>
          </div>
          <div class="reply-conent">
           {{item.returnDesc}}
          </div>
        </div>
      </li>
    </ul>
    <divi></divi>
    <div class="designer" v-if="hasShop">
      <div class="border"></div>
      <div class="hot">店铺介绍</div>
    </div> 
     <div class="storeItem" v-if="hasShop">
      <img
        :src="shopLogo"
        alt
      >
      <div class="storeInfo">
        <div class="store">
          <div class="stroeName">
            <p class="name">{{shopName}}</p>
            <div class="lableList">
              <div class="label" v-for="(label,idx) in labelList" :key="idx" >{{label}}</div>
            </div>
          </div>
        </div>
        <div class="hot">
          <img src="/static/images/icon-hot.png" class="icon-hot">
          <span class="storeHot">商家热度:</span>
          <span class="hotNum">{{shopViewNum}}</span>
          <span class="flex1"></span>
          <p @click="storePage"> 
             <span class="goStore">进店逛逛</span>
            <span class="arrow"></span>
          </p>
        </div>
      </div>
    </div> 
     <divi v-if="hasShop"></divi>
    <!-- 商品详情 -->
     <div class="detailWrapper">
        <div class="top">
            <div class="border">

            </div>
            <div class="detail">
                商品详情
            </div>
        </div>
        <!-- 富文本详情 -->
        <div class="goodsDetailCont">
             <wxParse :content="detail.goodsDetail"/> 
        </div>
    </div>
    <!-- 底部弹框 -->
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
                  ￥{{goodsInfo.goodsSkuRetailPrice}}
                </div>
                  <img src="/static/images/close.png" class="closeImg" @click="closeMask">
              </div>
              <div class="stone">
                库存:{{goodsInfo.goodsSkuStock}}
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
        
        <div class="num">
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
        </div>
        <!-- 确定加入购物车 -->
        <div class="confirmBtn" v-if="showConfirmBtn" @click="_addCart">
              确定
        </div>

        <!-- 确定购买 -->
        <div class="confirmBtn" v-if="buyConfirmBtn" @click="buyNow">
              确定
        </div>

        <div class="btn" v-if="!showConfirmBtn && !buyConfirmBtn">
          <div class="addCart" @click="_addCart">
            加入购物车
          </div>
          <div class="buyNow" @click="buyNow">
            立即购买
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="bottomFixed">
           <button open-type="share" class="share">
            <img src="/static/images/icon-share.png" alt>
              <span>分享</span>
          </button>
        <div class="cart" @click="goShopCart">
          <img src="/static/images/icon-cart.png" alt="">
          <span>购物车</span>
          <div class="cartNum" v-if="cartNum > 0">
            {{cartNum}}
          </div>
        </div>
        <div class="collect" @click="_collect" v-if="!isCollect">
          <img src="/static/images/icon-collect.png" alt="">
          <span>收藏</span>
        </div>
         <div class="collect" @click="_cancelCollect" v-else>
          <img src="/static/images/collect-active.png" alt="">
          <span>收藏</span>
        </div>
        <div class="addCart" @click="selAddCart">
          加入购物车
        </div>
        <div class="buyNow" @click="selBuy">
          立即购买
        </div>
    </div>
    <div class="fixedBtns">
      <div class="contact">
        <button open-type="contact" class="contact-btn">
          <img src="/static/images/contact.png" alt="">
        </button>
      </div>
      <div class="backHome" @click="backHome">
        <img src="/static/images/icon-home.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import divi from "@/components/divi";
import { goodsDetail, collect, cancelCollect, getcartNum, addCart, verifyGoodsStock, distributorBinding, getUserInfo } from '@/api/api';
import { toast } from '@/utils/index'
import wxParse from 'mpvue-wxparse'

export default {
  components: {
    divi,
    wxParse
  },
  data() {
    return {
      current: 1,
      showMask:false,
      showConfirmBtn:false,//加入购物车确定按钮
      buyConfirmBtn:false, //确定购买按钮
      goodsInfo:{}, 
      cartNum:0,  //购物车数量
      buyNum:1,    //购买数量
      goodsId:"", //商品id
      goodsSkuId:'', //sku id
      skuList:[],  //规格集合
      specList:[],  //规格
      detail:{}, //详情
      judgeList: [],  //评论列表
      isCollect:"false",//是否收藏
      len: "",  //baneer长度
      hasShop:false,  //店铺信息
      shopName:'',
      shopLogo:'',
      shopViewNum:0,
      labelList:[],
      userId:'',
      bannerList: [] //banner
    };
  },
  onLoad() {
       Object.assign(this.$data, this.$options.data())
       wx.removeStorageSync("typeGoodsId")
       wx.removeStorageSync("collectGoods")
     if(this.$mp.query.goodsId) {
      this.goodsId = this.$mp.query.goodsId;
    }

    this._getUserInfo();
    this._queryDetail();
  },
  onShow() {
     wx.removeStorageSync('addressInfo')
     this._getcartNum();
     if(this.$mp.query.userId) {
      let userId = this.$mp.query.userId
      wx.setStorageSync("userId",userId);
    }

    let userIds = wx.getStorageSync("userId");
    if(userIds) {
       this._distributorBinding();
    } 
  },
   onShareAppMessage(res) {
    let that = this;
    let userId = that.userId;
    return {
      // 强烈推荐+商品标题名称+商品主图。
      title: `强烈推荐${that.detail.goodsName}`,
      imageUrl: that.detail.img,
      path: "/pages/goodsDetail/main?goodsId=" + that.$mp.query.goodsId + '&userId=' + userId
    };
  },
  methods: {
    // 如果是分享页面打开 绑定上下级
    _distributorBinding() {
      let userId = wx.getStorageSync("userId");
      distributorBinding({userId}).then(res => {
        if(!res.data.code) {
            wx.removeStorageSync('userId')
          console.log("分享",res)
        } else {
          toast(res.data.msg)
        }
      })
    },
    // 获取用户信息
    _getUserInfo() {
      getUserInfo().then(res => {
        if(!res.data.code) {
           this.userId = res.data.id;
        } else {
          toast(res.data.msg)
        }
      })
    },
    //商品详情
    _queryDetail() {
      let goodsId = this.$mp.query.goodsId;
      let shopId = 0;
      if(this.$mp.query.shopId) {
        shopId = this.$mp.query.shopId;
      }
      goodsDetail({goodsId,shopId}).then(res => {
        if(!res.data.code) {
          this.detail = res.data;
          // this.detail.goodsDetail = this.detail.goodsDetail.replace(/<img /g, '<img class="rich_img" style="vertical-align:middle;height:auto;"')
          // .replace(/<p/gi, '<p style="margin:0;vertical-align:middle;" ')
          // .replace(/<a/gi, '<a style="margin:0;vertical-align:middle;" ')
             
          this.bannerList = res.data.banner.split(',');
          this.len = this.bannerList.length;
          this.isCollect = res.data.isCollect;
          this.specList = res.data.specList;
          this.skuList = res.data.skuList;
          
          this.goodsInfo = res.data.skuList[0];
          this.goodsSkuId = this.goodsInfo.id;
          let isShop = res.data.shop;

          if(isShop) { 
              this.hasShop = true;
              this.shopName = res.data.shop.name;
              this.shopLogo = res.data.shop.logo;
              this.shopViewNum = res.data.shop.viewNum;
              if(res.data.shop.labelNames) {
                  this.labelList = res.data.shop.labelNames.split(',');
              }
          } else {
            this.hasShop = false;
          }
          this.specList.forEach(item => {
          item.goodsSkuSpecVals.forEach((it,ix) => {
            this.$set(it, 'isTrue', false)
            if (ix === 0) it.isTrue = true // 默认选中第一个规格
          })
        })
          let judgeList = res.data.evaluateList.map(ele => {
            let obj = ele;
            obj.imgs = obj.img.split(',');
            return obj;
          })
          this.judgeList = judgeList;

        } else {
          toast(res.data.msg)
        }
      })
    },

    preview(src,e) {
      console.log(src)
       console.log(e)
       let url = e.mp.currentTarget.dataset.src
       let urls = [];
       urls.push(src)
       wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [], // 需要预览的图片http链接列表
            success(res) {
            }
        })
    },

    //回到首页
    backHome() {
      let url = '/pages/home/main';
      wx.switchTab({url})
    },
    //预览图片
    previewImg(urls,url) {
       wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
            success(res) {
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
      // 判断对应的规格数据
      goodsName = goodsName.join('_')

      let asd = this.skuList.filter(item => item.goodsSkuName === goodsName || item.goodsSkuName.split('_').reverse().join('_') === goodsName)
      this.goodsInfo = asd[0]
      this.goodsSkuId = asd[0].id // 选中的规格id
    },
    //获取购物车数量
    _getcartNum() {
      getcartNum().then(res => {
        if(!res.data.code) {  
          this.cartNum = res.data;
        } else {
          toast(res.data.msg)
        }
      })
    },
    //购物车
    goShopCart() {
       const token = wx.getStorageSync('token')
       if(!token) {
            let url = '/pages/authorization/main';
            wx.navigateTo({url})
       } else {
           let url = '/pages/personalCenter/shoppingCart/main';
          wx.navigateTo({url})
       }
    },
    //收藏
    _collect() {
       let typeId = this.$mp.query.goodsId;
      let type = 1;
      let params = {
        typeId,
        type
      }
      collect(params).then(res => {
        if(!res.data.code) {
          wx.setStorageSync("typeGoodsId",typeId)
          this.isCollect = true;
          wx.setStorageSync("collectGoods",this.isCollect)
        } else {
          toast(res.data.msg)
        }
      })
    },

    //取消收藏
    _cancelCollect() {
      let typeId = this.$mp.query.goodsId;
       let type = 1;
      let params = {
        typeId,
        type
      }
      cancelCollect(params).then(res => {
        if(!res.data.code) {
              wx.setStorageSync("typeGoodsId",typeId)
              this.isCollect = false;
               wx.setStorageSync("collectGoods",this.isCollect)
        } else {
          toast(res.data.msg)
        }
      })
    },
    closeMask() {
      this.showMask = false;
    },

    //选择规格
    selSize() {
      this.showMask = true;
      this.showConfirmBtn = false;
      this.buyConfirmBtn = false;
    },

    //加入购物车
    selAddCart() {
      this.showMask = true;
      this.showConfirmBtn = true;
      this.buyConfirmBtn = false;
    },

    //确定购买
    selBuy() {
          this.showMask = true;
          this.buyConfirmBtn = true;
          this.showConfirmBtn = false;
     },


    swiperChange(e) {
      this.current = Number(e.mp.detail.current) + 1;
    },
    //查看全部评论
    checkEvaluate() {
      let goodsId = this.$mp.query.goodsId;
      let url = '/pages/allEvaluate/main?goodsId=' + goodsId;
      wx.navigateTo({url})
    },
    //店铺首页
    async storePage() {
      let shopId = this.detail.shop.shopId;
      let isSelf = 0;
      let userId = this.detail.shop.userId;
      const { data } = await getUserInfo({});
      let id = data.id;
      if( userId == id) {
        isSelf = 1;
      } else {
        isSelf = 0;
      }
       console.log("userId",userId)
       console.log("id",id)
       let url = '/pages/storePage/main?shopId=' + shopId + '&isSelf=' + isSelf;
      wx.navigateTo({url})
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
    //加入购物车
    _addCart() {
      let goodsId = this.$mp.query.goodsId;
      let goodsNum = this.buyNum;
      let skuId = this.goodsSkuId;
      let shopId = "";
      if(this.$mp.query.shopId) {
        shopId = this.$mp.query.shopId
      }
       let params = {
        skuId,
        goodsNum,
        id:goodsId
      }
      let that = this;
      let goodsArr = [];
      goodsArr.push(params);
      verifyGoodsStock(goodsArr).then(res => {
        if(!res.data.code) {
           this.showMask = false;
          addCart({goodsId,goodsNum,skuId,shopId}).then(result => {
            if(!result.data.code) {
              toast("加入购物车成功")
              that._getcartNum();
            } else {
              toast(result.data.msg)
            }
          })
        } else {
          toast(res.data.msg)
        }
      })

      
    },
    //立即购买
    buyNow() {
      let skuId = this.goodsSkuId;
      let goodsNum = this.buyNum;
      let id = this.$mp.query.goodsId;
      let shopId = '';
      if(this.$mp.query.shopId) {
        shopId = this.$mp.query.shopId
      }
      let params = {
        skuId,
        goodsNum,
        id,
        shopId
      }
      let goodsArr = [];
      goodsArr.push(params);
      this.showMask = false;
      verifyGoodsStock(goodsArr).then(res => {
        if(!res.data.code) {
           goodsArr = JSON.stringify(goodsArr)
          let url = '/pages/order/confirmOrder/main?goodsArr=' + goodsArr + '&shopId=' +  shopId;
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
.rich_img {
  vertical-align: middle;
}
.swiper {
  height: 360px;
  background: rgba(243, 244, 241, 1);
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
  .goodsName {
    margin: 11px 18px 12px 15px;
    font-size: 18px;
    font-weight: 600;
    color: rgba(9, 2, 3, 1);
  }
  .goods {
    margin: 0 18px 12px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .price {
      .bargainPrice {
        color: #ff5100;
        font-size: 26px;
        font-weight: 600;
        margin-right: 5px;
      }
      .originalPrice {
        font-size: 16px;
        color: #999;
        text-decoration: line-through;
      }
    }
    .sale {
      font-size: 12px;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
    }
  }
}
.selectNum {
  font-size: 14px;
  p {
    color: #333;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    span {
      flex: 1;
    }
    img {
      width: 14rpx;
      height: 22rpx;
    }
  }
}
.designer {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  padding-top: 17px;
  padding-right: 15px;
  padding-left: 15px;

  .border {
    width: 4px;
    height: 13px;
    background: rgba(255, 81, 0, 1);
    margin-right: 8px;
  }
  .hot {
    font-size: 14px;
    font-weight: 600;
    color: rgba(9, 2, 3, 1);
    flex: 1;
  }
  .more {
    display: flex;
    align-items: center;
    span {
      font-size: 13px;
      font-weight: 400;
      color: #4a4a4a;
      &.arrow {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-right: 1px solid #989393;
        border-bottom: 1px solid #989393;
        transform: rotate(-45deg);
        margin-left: 8px;
      }
    }
  }
}

.judgeList {
  .item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #eee;
    padding: 0 32rpx;
    padding-top: 15px;
    padding-bottom: 10px;
    &:last-of-type {
      border-bottom: none;
    }
    .top {
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .nickName {
        font-size: 12px;
        color: rgba(9, 2, 3, 1);
      }
    }
    .content {
      font-size: 14px;
      font-weight: 400;
      color: rgba(9, 2, 3, 1);
      margin: 10px 0;
    }
    .imgs {
      img {
        width: 60px;
        height: 60px;
        vertical-align: middle;
        margin-right: 24rpx;
        border-radius: 8rpx;
      }
    }
    .shopReply {
      margin-top: 10px;
      padding: 12px;
      background: #F8F8F8;
      .shoper {
        margin-bottom: 8px;
        img {
          width: 13px;
          height: 13px;
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          font-size:12px;
          color:rgba(87,87,87,1);
        }
      }
      .reply-conent {
         font-size:12px;
         color:rgba(87,87,87,1);
      }
    }
    .times {
      margin-top: 24rpx;
      p {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        .gmtCreate {
          margin-right: 15px;
        }
      }
    }
  }
}
.storeItem {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding-right: 15px;
  padding-left: 15px;
  margin-top: 20px;
  padding-bottom: 10px;
  img {
    width: 110px;
    height: 110px;
    border-radius: 6px;
    margin-right: 10px;
  }
  .storeInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .store {
      .stroeName {
        .name {
          font-size: 16px;
          font-weight: 600;
          color: rgba(9, 2, 3, 1);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .lableList {
          display: flex;
          flex-wrap: wrap;
          .label {
            box-sizing: border-box;
            width: 61px;
            height: 17px;
            text-align: center;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAiCAYAAACQhM1+AAADJElEQVR4Xu2aT0wTQRSH39tAut0/U4IkGi4EjZ5EvYN6B+MdEu82erfRu0TvNnqXxDsY7qCevNDoucYDYoiRnZ12t6TdZ1qCEaX09eRs+nrdN7vffL920jY/hCFeLWOuZdTZGWKJjFpggBDWcRiOxOhVIKoMs0Zm/78BAlhmB01E2GroOhHM/H90IeAaQIC4EKgL7KATrW8C0hb3ATJnhwEH8XUhUPfYQaeNqEoZlO3AFwquAXRg0fVLm6ygiT6Op+byNwA4x32AzFlhYN8N1DQitllBN7S+4yCtW4EuEGwDCPDCDUsPuwtYQbdMvJZRtsJ+ggxaYYAI5z2lPrCCJiI/jaPvgOhbQS8QLAOIUC/46hIiEivoljErGXXWWHeXIYsM4NNiqJ4cAw08uhMdvQWERYt2ICgMAw44Vwth+JkVNGk9lSLtAsA4494yYokBRNxxA3XjT5wzP9FpIy5TllUt4RcMpgEH8VEhUM/ZQSdx9A4A5pn3lzELDCBiljntWc+b/MoKOkmSGWgf1rk/wSzYoyD0DOBWMVS3/5bR9+huGV3JiFbFXr4MoOPcd/3wFTvo1OgaEc3la5ujTYuIh4cZTCulfrCCbhkzl1GnNtra8rd7RFh3g9Ld08hPPbqlYJC/kLvEDsByISy9YQXdLRiksa4DSsEgZ3EbN1DnEbHJCrrZ1AvYoe2cbXLkcY8LBv1E/HN0p3FUJZCCQd7eOeiMLbq+v8kK+qhgcGUXgKbyttHR5sV9Nwh7BQNW0GkjWqIMNkZbWv52TwBVLyw9OIv8xNGdmGgNCKRgkLOsiXDBU+o9K2ja2/NTz5WCQc5CBoIvbqguHhcMBh7dTROtIIEUDPIWNNJqMZh4PAj799GdmmiDCJYGLZDrdhloQ2cuDCc/DaLqBa21nhqXgsEgV9ZdJ6CaF05c54D1gk7jgzIBSsGAY8yiGQexUgjUMw5SL+gkjrr/hC1wFsiMHQaOCgZjs57nnSgY9P0yliQ/Z6DtSMHAjvyGoMDtYqhucRdgU+sKohQMuMJsmUOgshtOvOTyYBIf1ABQCgZcYxbMnVUw6If3CyFYBfjcFNUoAAAAAElFTkSuQmCC");
            background-repeat: no-repeat;
            background-size: cover;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 81, 0, 1);
            margin-bottom: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .hot {
      display: flex;
      align-items: center;
      .icon-hot {
        width: 10px;
        height: 12px;
        margin-right: 3px;
      }
      .storeHot {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 81, 0, 1);
        margin-right: 5px;
      }
      .hotNum {
        font-size: 18px;
        font-weight: 600;
        color: rgba(255, 81, 0, 1);
      }
      .goStore {
        font-size:12px;
        font-weight:400;
        color:rgba(155,155,155,1);
        
      }
      .flex1 {
        flex:1;
      }
      .arrow {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-right: 1px solid rgba(155,155,155,1);
          border-bottom: 1px solid rgba(155,155,155,1);
          transform: rotate(-45deg);
          margin-left: 8px;
      }
    }
  }
}
.detailWrapper {
  padding-bottom: 50px;
    .top {
        display: flex;
        align-items: center;
        padding:15px;
        .border{
            width:4px;
            height:13px;
            background:rgba(255,81,0,1);
        }
        .detail {
            font-size:14px;
            font-weight:600;
            color:rgba(9,2,3,1);
            margin-left: 8px;
        }
    }
    .goodsDetailCont {
      // padding: 0 30rpx;
      font-size: 14px;
      image {
        vertical-align: middle;
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
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 6;
    padding-bottom: 10px;
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
          border:1px solid transparent;
          height:26px;
          line-height: 26px;
          text-align: center;
          font-size:12px;
          color:rgba(52,51,51,1);
          background:rgba(246,246,246,1);
          border-radius:4px;
          margin-right: 15px;
          margin-bottom: 12px;
          padding:0 10px;
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
    .confirmBtn {
      width:345px;
      margin: 0 auto;
      height:40px;
      line-height: 40px;
      text-align: center;
      background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
      border-radius:22px;
      font-size:16px;
      color:rgba(255,255,255,1);
    }
    .btn {
      padding:0 15px;
      display: flex;
      justify-content: space-between;
      .addCart {
        width:165px;
        height:40px;
        line-height: 40px;
        border-radius:22px;
        text-align: center;
        font-size:16px;
        color:rgba(255,81,0,1);
        border:1px solid rgba(255,81,0,1);
      }
      .buyNow {
        width:165px;
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
.bottomFixed {
  width:100%;
  height:49px;
  position: fixed;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  .share {
      flex:1;
      background: transparent;
      padding: 0;
      line-height: inherit;
      border-radius: 0;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center
      &::after {
        border: none;
      }
      img {
        width: 18px;
        height: 18px;
        margin-bottom: 2px;
      }
       span {
        font-size:10px;
        font-weight:600;
        color:rgba(53,53,53,1);
      }
    }
   
   
  .cart {
    flex:1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 49px;
    justify-content: center; 
    position:relative;
    img {
      width: 21px;
      height: 21px;
      margin-bottom: 2px;
    }
    span {
      font-size:10px;
      font-weight:600;
      color:rgba(53,53,53,1);
    }
     .cartNum {
          font-size:10px;
          color:rgba(255,255,255,1);
          color:#fff;
          left:70%;
          top:0.2em;
          padding:0 0.25em;
          text-align:center;
          min-width:1.2em;
          line-height:1.2;
          position:absolute;
          border-radius:.6em;
          box-sizing:border-box;
          background-color:#f44;
          -webkit-transform:translateX(-50%);
          transform:translateX(-50%);
      }
  }
  .collect {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 49px;
    justify-content: center;
    img {
      width: 16px;
      height: 19px;
      margin-bottom: 2px;

    }
    span {
      font-size:10px;
      font-weight:600;
      color:rgba(53,53,53,1);
    }
  }
  .addCart {
    box-sizing: border-box;
    width:110px;
    height:49px;
    line-height: 49px;
    text-align: center;
    background:rgba(9,2,3,1);
    font-size: 14px;
    color: #fff;
  }
  .buyNow {
    box-sizing: border-box;
    width:110px;
    height:49px;
    background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
    line-height: 49px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
}
.fixedBtns {
    position: fixed;
    bottom: 90px;
    right: 0;
    .contact {
      width: 56px;
      height: 56px;
      .contact-btn {
        width: 56px;
        height: 56px;
        background: transparent;
        padding: 0;
        line-height: inherit;
        border-radius: 0;
        &::after {
          border: none;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .backHome {
      width: 56px;
      height: 56px;
      text-align: center;
      img {
        width:40px;
        height: 40px;
      }
    }
  }
</style>