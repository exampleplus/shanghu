<template>
  <div class="content">
    <div class="top">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search" />
        <input type="text" placeholder="搜索"  v-model="searchName" confirm-type="search"  @confirm="search"/>
      </div>
      <span class="cancel" @click="cancelSearch">取消</span>
    </div>
      <div class="goodsResult" v-if="goodsList.length > 0">
          <div class="type">
              <div class="title">
                  商品
              </div>
              <div class="checkMore" @click="moreGoods">
                  <span class="more">更多</span>
                  <span class="arrow"></span>
              </div>
          </div>
        <goods-item :goodsList="goodsList" @goodsDetail="goodsDetail"></goods-item>
      </div>
      
      <div class="goodsResult" v-if="sceneList.length > 0">
          <div class="type">
              <div class="title">
                  场景
              </div>
              <div class="checkMore" @click="moreScene">
                  <span class="more">更多</span>
                  <span class="arrow"></span>
              </div>
          </div>
          <scene-item :sceneList="sceneList"></scene-item>
      </div>

      <div class="goodsResult" v-if="storeList.length > 0">
          <div class="type">
              <div class="title">
                  店铺
              </div>
              <div class="checkMore" @click="moreStore">
                  <span class="more">更多</span>
                  <span class="arrow"></span>
              </div>
          </div>
          <store-item :storeList="storeList" @storePage="goStoreDetail"></store-item>
      </div>

      <div class="goodsResult" v-if="designerList.length > 0">
          <div class="type">
              <div class="title">
                  设计师
              </div>
              <div class="checkMore" @click="moreDesigner">
                  <span class="more">更多</span>
                  <span class="arrow"></span>
              </div>
          </div>
          <designer-item :designerList="designerList" @designerHome="designerHome"></designer-item>
      </div>

      <div class="goodsResult" v-if="souceList.length > 0">
          <div class="type">
              <div class="title">
                  素材
              </div>
              <div class="checkMore" @click="moremataral">
                  <span class="more">更多</span>
                  <span class="arrow"></span>
              </div>
          </div>
          <source-item :souceList="souceList" :hasCollectIcon="true" @detail="goSourceDetail" @cancelCollectSource="cancelCollectSource" @collectSource="collectSource"></source-item>
      </div>

    <div class="nodata" v-if="souceList.length == 0 && storeList.length == 0 && sceneList.length == 0 && goodsList.length == 0 && designerList.length == 0">
        <img src="/static/images/nosearch.png" alt="">
        <p>抱歉，没有找到相关内容</p>
    </div>
  </div>
</template>
<script>
import goodsItem from "@/components/goodsItem";
import sceneItem from "@/components/sceneItem";
import storeItem from "@/components/storeItem";
import sourceItem from "@/components/sourceItem";
import designerItem from '@/components/designerItem'
import { allSearch, getUserInfo, collect, cancelCollect } from '@/api/api';
import {toast} from '@/utils/index'
export default {
  components:{
      goodsItem,
      sceneItem,
      storeItem,
      sourceItem,
      designerItem
  },
  data() {
    return {
        storeList: [],
        souceList:[],
        sceneList:[],
        goodsList: [],
        designerList:[],
        searchName:''
    };
  },
   onUnload() {
     wx.removeStorageSync("typeMatiralId")
     wx.removeStorageSync("collect")
  },
  onShow() {
    let typeMatiralId = wx.getStorageSync("typeMatiralId");
    if(typeMatiralId) {
      let isCollect = wx.getStorageSync("collect")
      let souceList = this.souceList;
      for(let i = 0; i < souceList.length; i++) {
        if(souceList[i].materialId == typeMatiralId) {
          souceList[i].isCollect = isCollect;
        }
      }
    }
  },
  onLoad() {
    let searchName = this.$mp.query.searchName;
    this.searchName = searchName;
    this.initData();
  },
  methods:{
    cancelSearch() {
      wx.navigateBack()
    },
    initData() {
        let searchName = this.searchName;
        allSearch({searchName}).then(res => {
          if(!res.data.code) {
            this.goodsList = res.data.GOODS;
            this.sceneList = res.data.SCENE;
            this.souceList = res.data.MATERIAL;
            this.designerList = res.data.DESIGNER
            this.storeList = res.data.SHOP;
            this.storeList.map(ele => {
              let obj = ele;
              obj.labelList = obj.labelNames.split(',');
              return obj
            })

          } else {
            toast(res.data.msg)
          }
        })
    },

    //搜索
    search() {
      this.initData();
    },
    
    //更多场景
     moreScene() {
      let searchName = this.searchName;
      let type = 2;
      let url = '/pages/sceneList/main?type=' + type + '&searchName=' + searchName;
      wx.navigateTo({url})
    },

    //更多素材
    moremataral() {
      let type = 5;
      let searchName = this.searchName;
      let url = '/pages/sourceList/main?type=' + type + "&searchName=" + searchName;
      wx.navigateTo({url})
    },
    //素材详情
    goSourceDetail(id) {
      let url = '/pages/sourceDetail/main?id=' + id;
      wx.navigateTo({url})
    },

     //更多设计师
    moreDesigner() {
      let type = 4;
      let searchName = this.searchName;
      let url = '/pages/designerList/main?type=' + type + "&searchName=" + searchName;
      wx.navigateTo({url})
    },
    //设计师详情
   async designerHome(designerId) {
      const { data } = await getUserInfo({});
      let userId = data.id;
      let isSelf = 0;
      if(userId == designerId) {
          isSelf = 1;
         let url = `/pages/designerDetail/main?designerId=${designerId}&isSelf=${isSelf}`;
         wx.navigateTo({ url });
       } else {
         isSelf = 0
         let url = `/pages/designerDetail/main?designerId=${designerId}&isSelf=${isSelf}`;
         wx.navigateTo({ url });
       }
    },

     //更多店铺
    moreStore() {
      let type = 3;
      let searchName = this.searchName;
      let url = '/pages/storeList/main?type=' + type + '&searchName=' + searchName;
      wx.navigateTo({url})
    },
    //店铺详情
    async goStoreDetail(shopId,uid) {
      let isSelf = 0;
      const { data } = await getUserInfo({});
      let userId = data.id;
      if( userId == uid) {
        isSelf = 1;
      } else {
        isSelf = 0;
      }
      let url = '/pages/storePage/main?shopId=' + shopId + '&isSelf=' + isSelf;
      wx.navigateTo({url})
    },

    //更多商品
     moreGoods() {
      let searchName = this.searchName;
      let type = 1;
      let url = '/pages/goods/main?type=' + type + '&searchName=' + searchName;
      wx.navigateTo({url})
    },

     //商品详情
    goodsDetail(goodsId) {
      let url = "/pages/goodsDetail/main?goodsId=" + goodsId;
      wx.navigateTo({ url });
    },

    //收藏素材
    collectSource(item) {
        let type = 2;
        let typeId = item.materialId;
        collect({type,typeId}).then(res => {
            if(!res.data.code) {
                 item.isCollect = !item.isCollect;
            } else {
                toast(res.data.msg)
            }
        })
    },
     //取消收藏
    cancelCollectSource(item) {
        let type = 2;
        let typeId = item.materialId;
        cancelCollect({type,typeId}).then(res => {
            if(!res.data.code) {
                item.isCollect = !item.isCollect;
            } else {
                toast(res.data.msg)
            }
        })
    },
  },
 
};
</script>

<style lang="less" scoped>
@import '../../common/styles/elements';
.content {
  .top {
    display: flex;
    padding: 40rpx;
    background: #fff;
    align-items: center;
    .search {
      flex: 1;
      position: relative;
      margin-right: 18px;
      .icon-search {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        top: 16rpx;
        left: 22rpx;
      }
      input {
        height: 60rpx;
        background: #f5f5f5;
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #9b9b9b;
        padding-left: 60rpx;
      }
    }
    .cancel {
      font-size: 14px;
      color: rgba(155, 155, 155, 1);
    }
  }
  .goodsResult {
      background: #fff;
      margin-bottom: 10px;
      &:last-of-type {
          margin-bottom: 0;
      }
      .type {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32rpx;
          padding-bottom: 10px;
          padding-top: 10px;
          margin-bottom: 10px;
          .border-bottom(#eee);
          .title {
                font-size:14px;
                font-weight:600;
                color:rgba(9,2,3,1);
          }
          .checkMore {
                font-size:13px;
                font-weight:400;
                color:rgba(74,74,74,1);
               .arrow {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-right: 1px solid #090203;
                    border-bottom: 1px solid #090203;
                    transform: rotate(-45deg);
                    margin-left: 8px;
                }
          }
      }
  }
  .nodata {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
      img {
          width: 118px;
          height: 115px;
          margin-bottom: 30px;
      }
      p {
            font-size:14px;
            color:rgba(153,153,153,1);
      }
  }
}
</style>
