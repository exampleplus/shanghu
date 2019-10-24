<template>
  <div class="content">
    <div class="top">
      <img :src="shopInfo.shopLogo" alt />
      <span>{{shopInfo.name}}</span>
    </div>
    <div class="swiper">
      <swiper class="swiperWrapper" :autoplay="autoplay" circular="true" @change="swiperChange">
        <swiper-item v-for="(item,index) in bannerList" :key="index">
          <img :src="item" class="slide-image" />
        </swiper-item>
      </swiper>
      <div class="dots" :style="[{ width: dotsWidth + 'px', marginLeft: dotsmgl + 'px' }]">
        <div v-for="(item,index2) in bannerList" :key="index2">
          <div class="dot" :class="[{active:index2 == currentSwiper}]"></div>
        </div>
      </div>
    </div>
    <!-- 类型 -->
      <scroll-view>
          <div class="typeList">
            <div
                class="typeItem"
                v-for="(item,index) in shopInfo.classifyList"
                :key="index"
                :class="[activeIndex == index ? 'active' : '']"
                @click="tabClassify(item.classifyId,index)"
              >{{item.name}}
            </div>
         </div>
      </scroll-view>
    <!-- 排序 -->
    <ul class="bar">
      <li :class="[{active:standard == 1}]" @click="tab(1)">综合</li>
      <li :class="[{active:standard == 2}]" @click="tab(2)">销量</li>
      <li :class="[{active:standard == 3}]" @click="tab(3)">价格</li>
    </ul>

    <div class="goodsWrapper">
      <goods-item :goodsList="goodsList" @goodsDetail="goodsDetail"></goods-item>
      <div class="showAll">
        <last-page :last="{length: goodsList.length, lastPage: lastPage}"></last-page>
      </div>
       <div class="noOrder" v-if="goodsList.length <= 0">
        <img src="/static/images/noOrder.png" alt="">
        <p>没有相关商品</p>
      </div>
    </div>
    <div class="bottomFixed">
       <div class="collect" v-if="isSelf == 0">
        <div class="share" v-if="!isCollect" @click="_collect">
          <img src="/static/images/icon-collect-shop.png" alt />
          <span>收藏</span>
        </div>
        <div class="share" v-else @click="_cancelCollect">
          <img src="/static/images/icon-collect-shop-active.png" alt />
          <span>收藏</span>
        </div>
      </div>
      <div class="share2">
        <button open-type="share" class="shareBtn">分享</button>
      </div>
    </div>
    <div class="fixedBtns">
      <div class="backHome" @click="backHome">
        <img src="/static/images/icon-home.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import goodsItem from "@/components/goodsItem";
import { shopDetail, shopGoods, collect, cancelCollect } from "@/api/api";
import { toast } from "@/utils/index";
import lastPage from "@/components/lastPage";
export default {
  components: {
    goodsItem,
    lastPage
  },
  data() {
    return {
      autoplay: false,
      activeIndex: 0,
      standard: 1,
      currentSwiper: 0,
      shopInfo: {},
      classifyId: "",
      sortType: 1,
      pageIndex: 1,
      pageSize: 10,
      isCollect: false,
      hasNextPage: false,
      lastPage: false,
      goodsList: [],
      storeId:'',
      bannerList: [],
      isSelf: 0, //是否店家本人
      shopId: "" //店家id
    };
  },
  computed: {
    //轮播圆点宽度
    dotsWidth() {
      let bannerLen = this.bannerList.length;
      return (bannerLen + 1) * 8;
    },
    dotsmgl() {
      let dotsml = (this.bannerList.length + 1) * 8 / 2;
      return -dotsml;
    }
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    wx.removeStorageSync("typeStoreId")
    wx.removeStorageSync("collectStore")
    if (this.$mp.query.shopId) {
      this.shopId = this.$mp.query.shopId;
    }
    if (this.$mp.query.isSelf) {
      this.isSelf = this.$mp.query.isSelf;
    }
    this.queryShopDetail();
  },
  onReachBottom() {
    let that = this;
    that.loadMore();
  },
  onShareAppMessage(res) {
        let that = this;
        let shopName = that.shopInfo.name;
        let shopId = that.shopInfo.shopId;
        return {
            title: `${shopName}这家店铺很棒快来看看`,
            imageUrl: that.shopInfo.shopLogo,
            path: "/pages/storePage/main?shopId=" + shopId
        };
    },
  methods: {
    backHome() {
         let url = '/pages/home/main';
         wx.switchTab({url})
    },
    queryShopDetail() {
      let shopId = this.shopId;
      let isSelf = this.isSelf;
      // wx.showLoading({
      //   title:"加载中",
      //   mask:true
      // })
      shopDetail({ shopId, isSelf }).then(res => {
        if (!res.data.code) {
          // wx.hideLoading();
          this.shopInfo = res.data;
          this.storeId = res.data.shopId;
          this.isCollect = res.data.isCollect;
          this.bannerList = res.data.bannerList;
          console.log("this.bannerList ",this.bannerList )
          if(res.data.classifyList.length > 0) {
             this.classifyId = res.data.classifyList[0].classifyId;
            this.getShopGoods(this.classifyId, this.sortType);
          }
        } else {
          toast(res.data.msg);
        }
      });
    },
    _collect() {
      let typeId = this.$mp.query.shopId;
      let type = 4;
      this.isCollect = true;
      wx.setStorageSync("typeStoreId",typeId);
      wx.setStorageSync("collectStore", this.isCollect)
      let params = {
        typeId,
        type
      };
      collect(params).then(res => {
        if (!res.data.code) {
          
        } else {
          toast(res.data.msg);
        }
      });
    },

    //取消收藏
    _cancelCollect() {
      let typeId = this.$mp.query.shopId;
      let type = 4;
      this.isCollect = false;
       wx.setStorageSync("typeStoreId",typeId);
       wx.setStorageSync("collectStore", this.isCollect)
      let params = {
        typeId,
        type
      };
      cancelCollect(params).then(res => {
        if (!res.data.code) {
         
        } else {
          toast(res.data.msg);
        }
      });
    },
    // 上拉加载更多
    loadMore(e) {
      let classifyId = this.classifyId;
      let sortType = this.sortType;
      if (!this.hasNextPage) {
        return;
      } else {
        this.pageIndex++;
        this.getShopGoods(classifyId,sortType);
      }
    },
    //商品列表
    getShopGoods(classifyId, sortType) {
      wx.showLoading({title:"加载中",mask:true})
      let pageIndex = this.pageIndex;
      let pageSize = this.pageSize;

      shopGoods({ classifyId, sortType, pageIndex, pageSize }).then(res => {
        if (!res.data.code) {
          wx.hideLoading()
          this.hasNextPage = res.data.hasNextPage;
          let list = res.data.list;
          this.goodsList = this.goodsList.concat(list);
          if (!this.hasNextPage) {
            //最后一页
            this.lastPage = true;
          } else {
            this.lastPage = false;
          }
        } else {
          toast(res.data.msg);
        }
      });
    },
    swiperChange(e) {
      this.currentSwiper = e.mp.detail.current;
    },
    tab(index) {
      if(index == this.standard) {
        return;
      }
      this.goodsList = [];
      this.standard = index;
      this.sortType = index;
      let classifyId = this.classifyId;
      let sortType = this.sortType;
      this.pageIndex = 1;
      this.getShopGoods(classifyId, sortType);
    },

    tabClassify(classifyId, index) {
      if (index == this.activeIndex) {
        return;
      }
       this.activeIndex = index;
      this.classifyId = classifyId;
      this.goodsList = [];
      this.pageIndex = 1;
      let sortType = this.sortType;
      this.getShopGoods(classifyId, sortType);
    },

    goodsDetail(goodsId) {
      let shopId = this.storeId;
      let url = "/pages/goodsDetail/main?goodsId=" + goodsId + '&shopId=' + shopId;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../common/styles/elements";
.content {
  background: #fff;
  .top {
    width: 100%;
    height: 140px;
    background: rgba(51, 52, 52, 1);
    box-sizing: border-box;
    padding-top: 11px;
    padding-left: 13px;
    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
    span {
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .swiper {
    position: relative;
    margin-top: -165rpx;
    padding: 0 20rpx;
    .swiperWrapper {
      height: 209px;
      swiper-item {
        height: 100%;
        img {
          width: 100%;
          height: 209px;
          border-radius: 8rpx;
        }
      }
    }
    .dots {
      display: flex;
      flex-direction: row;
      position: absolute;
      justify-content: center;
      bottom: 20rpx;
      left: 50%;
      .dot {
        width: 8px;
        height: 6rpx;
        margin-right: 8px;
        background-color: rgba(255, 255, 255, 0.4);
        &.active {
          background-color: #ff5100;
        }
      }
    }
  }
  .typeList {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid #eee;
    padding-left: 10px;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .typeItem {
      white-space: nowrap;
      font-size: 15px;
      color: rgba(155, 155, 155, 1);
      padding-top: 10px;
      padding-bottom: 17px;
      padding-left: 5px;
      padding-right: 5px;
      margin-right: 34px;
      display: flex;
      justify-content: center;
      &.active {
        color: #ff5100;
        border-bottom: 2px solid #ff5100;
      }
    }
  }
  .bar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 15px 0;
    background: #fff;
    li {
      height: 40rpx;
      font-size: 14px;
      font-weight: 600;
      line-height: 40rpx;
      text-align: center;
      color: #9b9b9b;
      &.active {
        color: #ff5100;
      }
    }
  }
  .goodsWrapper {
    padding-bottom: 40px;
    .noOrder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
  .bottomFixed {
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
    .collect {
        flex:1;
        height:80rpx;
        text-align:center;
        border-radius:40rpx;
        border:2rpx solid #ececec;
        display:flex;
        align-items:center;
        justify-content:center;
        .share {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            margin-right: 2px;
          }
          span {
              font-size:14px;
              font-weight:400;
              color:rgba(9,2,3,1);
          }
        }
    }
    .share2 {
        flex:1;
        margin-left: 15px;
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:20px;
        font-size:16px;
        button {
          color:#fff;
          display: flex;
          height:40px;
          line-height: 40px;
          text-align: center;;
          align-items: center;
          justify-content: center;
          background: transparent;
          padding: 0;
          border-radius: 0;
            &::after {
              border: none;
          }
        }
    }
  }
  .fixedBtns {
    position: fixed;
    bottom: 90px;
    right: 0;
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
}
</style>