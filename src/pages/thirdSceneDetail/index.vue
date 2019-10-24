<template>
  <div class="content">
    <!-- <div class="coverImg">
      <img
        :src="coverImg"
        alt
      >
    </div> -->
    <!-- <div class="secondScene">
      <div class="secondItem" v-for="(item,index) in sceneList" :key="index">
        <img
          :src="item.icon"
          alt
        >
        <p>{{item.name}}</p>
      </div>
    </div> -->
    <ul class="bar">
      <li :class="[{active:standard == 1}]" @click="tab(1)">综合</li>
      <li :class="[{active:standard == 2}]" @click="tab(2)">销量</li>
      <li :class="[{active:standard == 3}]" @click="tab(3)">价格</li>
    </ul>
    <scroll-view scroll-y="true" class="scroll-bar" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreGoods">
       <div class="goodsWrapper">
         <goods-item :goodsList="goodsList"  @goodsDetail="goodsDetail"></goods-item>
          <last-page :last="{length: goodsList.length, lastPage: lastPage}"></last-page>
         <div class="nogoods" v-if="goodsList.length <= 0">暂无数据</div>
     </div>
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
      sceneId:'',    //场景id
      coverImg:"", //场景封面
      twoBar:1,
      sortType:1,//排序方式
      type:1, //默认显示商品
      pageIndex:1,
      pageSize:10,
      hasNextPage:false,
      lastPage:false,
      sceneList:[], //三级场景
      goodsList:[] //商品列表
    };
  },
  onLoad(options) {
      Object.assign(this.$data, this.$options.data())
      this.sceneId = this.$mp.query.sceneId;
        let that = this;
        wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight - 50;
            }
        })
    //查询场景
    // this.queryScene();
    //查询商品
    this._querySceneGoods();
  },
  methods: {
      tabBar(twoBar) {
          this.twoBar = twoBar;
      },
      //商品筛选
      tab(standard) {
          this.standard = standard;
          this.goodsList = [];
          this.pageIndex = 1;
          this._querySceneGoods();
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
       //加载更多商品
      loadMoreGoods() {
         if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this._querySceneGoods();
        }
      },
      //查询商品
      _querySceneGoods() {
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;
        let type = 1;
        let sortType = this.standard;  //排序方式
        let sceneId =  this.$mp.query.sceneId;
        querySceneGoods({pageIndex,pageSize,type,sortType,sceneId}).then(res => {
          if(!res.data.code) {
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
            toast(res.data.msg)
          }
        })
      },
      //商品详情
      goodsDetail(goodsId) {
        let url = '/pages/goodsDetail/main?goodsId=' + goodsId;
        wx.navigateTo({url})
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
    justify-content: space-between;
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
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 100;
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
  .scroll-bar {
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }
  .goodsWrapper {
    background: #fff;
    .nogoods {
      text-align: center;
      padding: 10px 0;
      color: #333;
      font-size: 16px;
    }
  }
  .sourceWrapper {
    background: #fff;
  }
}
</style>
