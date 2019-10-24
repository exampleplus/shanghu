<template>
  <div class="content">
     <scroll-view class="scroll-bar" scroll-y="true" :style="{height: contentHeight + 'px'}"  lower-threshold="50" @scrolltolower="loadMoreData">
    <div class="coverImg">
      <img
        :src="coverImg"
        alt
      >
    </div>
    <div class="secondScene" v-if="sceneList.length > 0">
      <div class="secondItem" v-for="(item,index) in sceneList" :key="index"  @click="sceneDetail(item.sceneId,item.level)">
        <img
          :src="item.icon"
          alt
        >
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="twoBar">
      <div :class="[{active:twoBar == 1}]"  @click="tabBar(1)">商品</div>
      <div :class="[{active:twoBar == 2}]" @click="tabBar(2)">素材</div>
    </div>

    <ul class="bar" v-if="twoBar == 1">
      <li :class="[{active:standard == 1}]" @click="tab(1)">综合</li>
      <li :class="[{active:standard == 2}]" @click="tab(2)">销量</li>
      <li :class="[{active:standard == 3}]" @click="tab(3)">
        <span>价格</span>
         <img :src="priceArrow" alt="">
        </li>
    </ul>

     <ul class="bar" v-if="twoBar == 2">
      <li :class="[{active:sourceBar == 1}]" @click="tabSource(1)">综合</li>
      <li :class="[{active:sourceBar == 2}]" @click="tabSource(2)">销量</li>
      <li :class="[{active:sourceBar == 3}]" @click="tabSource(3)">
        <span>价格</span>
         <img :src="matarailPriceArrow" alt="">
        </li>
    </ul>

    <!-- <scroll-view  class="scroll-bar" v-show="twoBar == 1" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreGoods"> -->
       <div class="goodsWrapper" v-show="twoBar == 1">
         <goods-item :goodsList="goodsList"  @goodsDetail="goodsDetail"></goods-item>
          <last-page :last="{length: goodsList.length, lastPage: lastPage}"></last-page>
           <div class="noOrder" v-if="goodsList.length <= 0 && hasGoods == false">
              <img src="/static/images/noOrder.png" alt="">
              <p>没有相关商品</p>
          </div>
     </div>
    <!-- </scroll-view> -->
    
    <!-- <scroll-view  class="scroll-bar" v-show="twoBar == 2"  scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreSource"> -->
       <div class="sourceWrapper"  v-show="twoBar == 2">
         <source-item :souceList="souceList" @detail="goSourceDetail"></source-item>
         <last-page :last="{length: souceList.length, lastPage: lastPage2}"></last-page>
         <div class="noOrder" v-if="souceList.length <= 0 && hasSource == false">
              <img src="/static/images/noOrder.png" alt="">
              <p>暂无相关素材数据</p>
          </div>
     </div>
    <!-- </scroll-view> -->
    
  </scroll-view>
  </div>
</template>
<script>
import divi from "@/components/divi";
import goodsItem from '@/components/goodsItem';
import sourceItem from '@/components/sourceItem';
import lastPage from "@/components/lastPage";
import {queryLowerScene,querySceneGoods} from '@/api/api'
import {toast} from '@/utils/index'
export default {
  components: {
    divi,
    goodsItem,
    sourceItem,
    lastPage
  },
  data() {
    return {
      contentHeight:'',
      standard: 1,
      sourceBar:1,
      sceneId:'',    //场景id
      coverImg:"", //场景封面
      twoBar:1,
      sortType:1,//排序方式
      type:1, //默认显示商品
      pageIndex:1,
      pageSize:10,
      sourcePageIndex:1,
      sourcepageSize:10,
      hasNextPage:false,
      lastPage:false,
      hasNextPage2:false,
      lastPage2:false,
      hasGoods:true,
      hasSource:true,
      isGoodsUp:true,
      isMatarialUp:true,
      priceArrow: "/static/images/default.png",
      matarailPriceArrow:"/static/images/default.png",
      sceneList:[], //二级场景
      souceList:[], //素材列表
      goodsList:[] //商品列表
    };
  },
  onLoad(options) {
      Object.assign(this.$data, this.$options.data())
      this.sceneId = this.$mp.query.sceneId;
        let that = this;
        wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight;
            }
        })
    //查询场景
    this.queryScene();
    this._querySceneGoods();
    this._querySource();
  },
  methods: {
    //三级场景
    sceneDetail(sceneId,level) {
       if(level == 1) {
          let url = "/pages/sceneDetail/main?sceneId=" + sceneId;
          wx.navigateTo({ url });
        } else if(level == 2) {
          let url = "/pages/secondeSceneDetail/main?sceneId=" + sceneId;
          wx.navigateTo({ url });
        } else if(level == 3) {
            let url = "/pages/thirdSceneDetail/main?sceneId=" + sceneId;
          wx.navigateTo({ url });
        }
    },
      tabBar(twoBar) {
          this.twoBar = twoBar;
      },
      //商品筛选
      tab(standard) {
          this.standard = standard;
          if(standard == 3) {
            if (this.isGoodsUp) {
               //降序
                this.sortType = 3;
                this.priceArrow = "/static/images/down.png";
                this.isGoodsUp = false;
                this.goodsList = [];
                this.pageIndex = 1;
                this._querySceneGoods();
            } else {
              //升序
                this.sortType = 4;
                this.priceArrow = "/static/images/up.png";

                this.isGoodsUp = true;
                this.goodsList = [];
                this.pageIndex = 1;
                this._querySceneGoods();
            }
          }
          //销量
          if(standard == 2) {
              this.priceArrow = "/static/images/default.png";
              this.sortType = 2;
              this.goodsList = [];
              this.pageIndex = 1;
              this._querySceneGoods();
          }
          //综合排序
          if(standard == 1) {
            this.priceArrow = "/static/images/default.png";
            this.sortType = 1;
            this.goodsList = [];
            this.pageIndex = 1;
            this._querySceneGoods();
          }
      },
      //素材筛选
      tabSource(sourceBar) {
            this.sourceBar = sourceBar;
          if(sourceBar == 3) {
            if(this.isMatarialUp) {
              //降序
                this.sourceBar = 3;
                this.matarailPriceArrow = "/static/images/down.png";
                this.isMatarialUp = false;
                this.souceList = [];
                this.sourcePageIndex = 1;
                this._querySource();
            } else {
              //升序
                this.sourceBar = 4;
                this.matarailPriceArrow = "/static/images/up.png";
                this.isMatarialUp = false;
                this.souceList = [];
                this.sourcePageIndex = 1;
                this._querySource();
            }
          }

          if(sourceBar == 2) {
              this.matarailPriceArrow = "/static/images/default.png";
              this.sourceBar = 2;
              this.souceList = [];
              this.sourcePageIndex = 1;
              this._querySource();
          }

          if(sourceBar == 1) {
              this.matarailPriceArrow = "/static/images/default.png";
              this.sourceBar = 1;
              this.souceList = [];
              this.sourcePageIndex = 1;
              this._querySource();
          }
      },
      //查询场景
      queryScene() {
        let sceneId = this.$mp.query.sceneId;
        queryLowerScene({sceneId}).then(res => {
          if(!res.data.code) {
            this.coverImg = res.data.logo;
            this.sceneList = res.data.infoList;
          } else {
            toast(res.data.msg)
          }
        })
      },

       //加载更多
      loadMoreData() {
        let active = this.twoBar;
        if(active == 1) {    //加载商品
        // console.log("更多商品")
            if (!this.hasNextPage) {
                return;
              } else {
                this.pageIndex++;
                this._querySceneGoods();
              }
        } else if(active == 2) {    //加载素材
        //  console.log("更多素材")
              if (!this.hasNextPage2) {
                return;
              } else {
              
                this.sourcePageIndex++;
                this._querySource();
              }
        }
      },


       //加载更多商品
      loadMoreGoods() {
         if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this._querySceneGoods();
        }
      },
       //加载更多素材
      loadMoreSource() {
         if (!this.hasNextPage2) {
          return;
        } else {
          this.sourcePageIndex++;
          this._querySource();
        }
      },
      //查询商品
      _querySceneGoods() {
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;
        let type = 1;
        let sortType = this.sortType;  //排序方式
        let sceneId =  this.$mp.query.sceneId;
        querySceneGoods({pageIndex,pageSize,type,sortType,sceneId}).then(res => {
          if(!res.data.code) {
             this.hasNextPage = res.data.hasNextPage;
             let list = res.data.list;
             if(list.length > 0) {
               this.hasGoods = true
             } else {
               this.hasGoods = false;
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

      //查询素材
      _querySource() {
        let pageIndex = this.sourcePageIndex;
        let pageSize = this.sourcepageSize;
        let type = 2;
        let sortType = this.sourceBar;  //排序方式
        let sceneId =  this.$mp.query.sceneId;
        querySceneGoods({pageIndex,pageSize,type,sortType,sceneId}).then(res => {
          if(!res.data.code) {
             this.hasNextPage2 = res.data.hasNextPage;
             let list = res.data.list;
              if(list.length > 0) {
               this.hasSource = true
             } else {
               this.hasSource = false;
             }
             this.souceList = this.souceList.concat(list);
             if (!this.hasNextPage2) {
              //最后一页
              this.lastPage2 = true;
            } else {
              this.lastPage2 = false;
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
      //素材详情
      goSourceDetail(id) {
            let token = wx.getStorageSync("token");
            if(!token) {
                  let url = '/pages/authorization/main';
                  wx.navigateTo({url})
                  return;
            } else {
              let url = '/pages/sourceDetail/main?id=' + id;
              wx.navigateTo({url})
            }
            
      },
     
  },
};
</script>
<style lang="less" scoped>
@import "../../common/styles/elements";
.content {
  .coverImg {
    height: 224px;
    width: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .secondScene {
    display: flex;
    padding: 20px 18px;
    overflow-x: auto;
    // justify-content: space-between;
    background: #fff;
    margin-bottom: 10px;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .secondItem {
      margin-right: 35px;
      text-align: center;
      flex-basis: 112rpx;
      flex-shrink: 0;
      white-space: nowrap;
      &:last-of-type {
        margin-right: 0;
      }
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
      p {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .twoBar {
    padding: 20px 84px 0 84px;
    display: flex;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
    background: #fff;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 100;
    & > div {
      font-size: 15px;
      color: rgba(155, 155, 155, 1);
      &.active {
        padding-bottom: 15px;
        font-size: 15px;
        color: rgba(255, 81, 0, 1);
        border-bottom: 3px solid rgba(255, 81, 0, 1);
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
       img {
        width: 6px;
        height: 10px;
        margin-left: 2px;
      }
      &.active {
        color: #ff5100;
      }
    }
  }
  .scroll-bar {
     ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }
  .goodsWrapper {
    background: #fff;
    .noOrder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-bottom: 20px;
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
  .sourceWrapper {
    background: #fff;
     .noOrder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-bottom: 20px;
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
}
</style>
