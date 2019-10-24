<template>
    <div class="content">
        <div class="tabBar">
            <div class="tabItem" v-for="(item,index) in tabList" :key="index" :class="[activeIndex == index ? 'active' : '']" @click="tab(index)">
                {{item}}
            </div>
        </div>
        <!-- 商品 -->
        <scroll-view class="scroll-bar" :class="[goodsList.length <=0 ? 'scroll-bg' : '' ]" v-show="activeIndex == 0" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMore">
            <div class="list" >
                <goods-item :goodsList="goodsList" @goodsDetail="goodsDetail"></goods-item>
                 <div class="noOrder" v-if="goodsList.length <= 0 && hasGoods == false">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关商品</p>
                </div>
            </div>
             <div  class="showAll">
                <last-page :last="{length: goodsList.length, lastPage: lastPage}"></last-page>
            </div>
        </scroll-view>
        
        <!-- 素材 -->
        <scroll-view class="scroll-bar" :class="[souceList.length <=0 ? 'scroll-bg' : '' ]" v-show="activeIndex == 1"   scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreSource">
             <div class="list">
                <source-item :souceList="souceList" hasCollectIcon=false @detail="goSourceDetail" @collectSource="_collect" @cancelCollectSource="_cancelCollect"></source-item>
                  <div class="noOrder" v-if="souceList.length <= 0 && hasMatarial == false">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关素材</p>
                </div>
            </div>
              <div class="showAll">
                <last-page :last="{length: souceList.length, lastPage: lastPage2}"></last-page>
            </div>
        </scroll-view>

        <scroll-view class="scroll-bar" :class="[designerList.length <=0 ? 'scroll-bg' : '' ]" v-show="activeIndex == 2" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreDesigner">
            <div class="list">
                <designer-item :designerList="designerList" :isCollect="true" @designerHome="designerHome"></designer-item>
                 <div class="noOrder" v-if="designerList.length <= 0 && hasDesigner == false">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关设计师</p>
                </div>
            </div>
             <div class="showAll">
                <last-page :last="{length: designerList.length, lastPage: lastPage3}"></last-page>
            </div> 
        </scroll-view>

           <scroll-view class="scroll-bar" :class="[storeList.length <=0 ? 'scroll-bg' : '' ]" v-show="activeIndex == 3" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreStore">
            <div class="list">
                 <store-item :storeList="storeList" @storePage="storeDetail"></store-item>
                 <div class="noOrder" v-if="storeList.length <= 0 && hasStore == false">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关店铺</p>
                </div>
            </div>
            <div class="showAll">
                <last-page :last="{length: storeList.length, lastPage: lastPage4}"></last-page>
            </div> 
         </scroll-view>
    </div>
</template>
<script>
import goodsItem from '@/components/goodsItem';
import sourceItem from '@/components/sourceItem';
import storeItem from '@/components/storeItem';
import designerItem from '@/components/designerItem';
import lastPage from "@/components/lastPage";
import { checkUserCollect ,collect ,cancelCollect,getUserInfo} from "@/api/api";
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            contentHeight:0, //内容高度
            type:1,
            pageIndex:1,
            pageSize:10,
            sourcepageIndex:1,
            sourcepageSize:10,
            designerpageIndex:1,
            designerpageSize:10,
            activeIndex:0,
            hasNextPage:false,
            lastPage:false,
            hasNextPage2:false, //素材
            lastPage2:false,//素材
            hasNextPage3:false, //设计师
            lastPage3:false,//设计师
            storepageIndex:1,
            storepageSize:10,
             hasNextPage4:false, //店铺
            lastPage4:false,//店铺
            tabList:["商品","素材","设计师","店铺"],
             goodsList:[],  //商品列表
             souceList:[], //素材列表
            designerList:[],
            storeList: [],
            hasGoods:true,
            hasMatarial:true,
            hasDesigner:true,
            hasStore:true
        }
    },
    components:{
        goodsItem,
        sourceItem,
        storeItem,
        designerItem,
        lastPage
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
        let that = this;
        wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight - 58;
            }
        })
         
        this.getGoodsList();
        this.getSourceList();
        this.getDesignerList();
        this.getStoreList();
    },
    //  onReachBottom() {
    //     let that = this;
    //     that.loadMore();
    // },
    onUnload() {
        wx.removeStorageSync("typeMatiralId");
        wx.removeStorageSync("collect")
        wx.removeStorageSync("typeGoodsId")
        wx.removeStorageSync("collectGoods")
        wx.removeStorageSync("typeDesignerId")
        wx.removeStorageSync("collectDesigner")
        wx.removeStorageSync("typeStoreId")
        wx.removeStorageSync("collectStore")
    },
    onShow() {
        //取消收藏素材
        let typeMatiralId = wx.getStorageSync("typeMatiralId");
        if(typeMatiralId) {
            let souceList = this.souceList;
            for(let i = 0; i < souceList.length; i++) {
                if(souceList[i].materialId == typeMatiralId) {
                    souceList.splice(i,1)
                }
            }
            if(souceList.length == 0) {
                this.hasMatarial = false;
            }
        }

        //取消收藏商品
        let typeGoodsId = wx.getStorageSync("typeGoodsId");
        if(typeGoodsId) {
            let goodsList = this.goodsList;
            for(let i = 0; i < goodsList.length; i++) {
                if(goodsList[i].goodsId == typeGoodsId) {
                    goodsList.splice(i,1)
                }
            }
            if(goodsList.length == 0) {
                this.hasGoods = false;
            }
        }
        //取消收藏设计师
        let typeDesignerId = wx.getStorageSync("typeDesignerId");
        if(typeDesignerId) {
            let designerList = this.designerList;
            for(let i = 0; i < designerList.length; i++) {
                if(designerList[i].designerId == typeDesignerId) {
                    designerList.splice(i,1)
                }
            }
             if(designerList.length == 0) {
                this.hasDesigner = false;
            }
        }
        //取消收藏店铺
        let typeStoreId = wx.getStorageSync("typeStoreId");
        if(typeStoreId) {
            let storeList = this.storeList;
            for(let i = 0; i < storeList.length; i++) {
                if(storeList[i].shopId == typeStoreId) {
                    storeList.splice(i,1)
                }
            }
            if(storeList.length == 0) {
                this.hasStore = false;
            }
        }
    },
    methods:{
        tab(index) {
            this.activeIndex = index;
            this.type = index + 1;
        },
        //获取收藏商品
        getGoodsList() {
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            let type = 1;
            checkUserCollect({pageIndex,pageSize,type}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    if ( list.length > 0 ) {
                        this.hasGoods = true
                    } else {
                         this.hasGoods = false
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
          //更多商品
         loadMore(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this.getGoodsList();
            }
        },
        //获取收藏素材
        getSourceList() {
            let pageIndex = this.sourcepageIndex;
            let pageSize = this.sourcepageSize;
            let type = 2;
            checkUserCollect({pageIndex,pageSize,type}).then(res => {
                if(!res.data.code) {
                       this.hasNextPage2 = res.data.hasNextPage;
                        let list = res.data.list;
                         if ( list.length > 0 ) {
                            this.hasMatarial = true
                        } else {
                            this.hasMatarial = false
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
        //更多素材
        loadMoreSource() {
            if (!this.hasNextPage2) {
                    return;
                } else {
                    this.sourcepageIndex++;
                    this.getSourceList();
                }
        },
        //获取收藏设计师
         getDesignerList() {
            let pageIndex = this.designerpageIndex;
            let pageSize = this.designerpageSize;
            let type = 3;
            checkUserCollect({pageIndex,pageSize,type}).then(res => {
                if(!res.data.code) {
                       this.hasNextPage3 = res.data.hasNextPage;
                        let list = res.data.list;
                        if ( list.length > 0 ) {
                            this.hasDesigner = true
                        } else {
                            this.hasDesigner = false
                        }
                        this.designerList = this.designerList.concat(list);
                        if (!this.hasNextPage3) {
                            //最后一页
                            this.lastPage3 = true;
                        } else {
                            this.lastPage3 = false;
                        }
                } else {
                    toast(res.data.msg)
                }
            })
        },
         //更多设计师
        loadMoreDesigner() {
            if (!this.hasNextPag3) {
                    return;
                } else {
                    this.designerpageIndex++;
                    this.getDesignerList();
                }
        },

        //收藏店铺
        getStoreList() {
            let pageIndex = this.storepageIndex;
            let pageSize = this.storepageSize;
            let type = 4;
            checkUserCollect({pageIndex,pageSize,type}).then(res => {
                if(!res.data.code) {
                        console.log("店铺",res.data)
                        this.hasNextPage4 = res.data.hasNextPage;
                        let list = res.data.list;
                         if ( list.length > 0 ) {
                            this.hasStore = true
                        } else {
                            this.hasStore = false
                        }
                        this.storeList = this.storeList.concat(list);
                        this.storeList.map(ele => {
                            let obj = ele;
                            obj.labelList = obj.labelNames.split(',')
                            return obj;
                        })
                        if (!this.hasNextPage4) {
                            //最后一页
                            this.lastPage4 = true;
                        } else {
                            this.lastPage4 = false;
                        }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        

        //更多店铺
        loadMoreStore() {
             if (!this.hasNextPag4) {
                    return;
                } else {
                    this.storepageIndex++;
                    this.getStoreList();
                }
        },

         //收藏素材
        _collect(item) {
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
         

         //取消收藏素材
        _cancelCollect(item) {
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


        //商品详情
        goodsDetail(goodsId) {
            let url = '/pages/goodsDetail/main?goodsId=' + goodsId;
            wx.navigateTo({url})
        },
        //素材详情
        goSourceDetail(id) {
            let url = '/pages/sourceDetail/main?id=' + id;
            wx.navigateTo({url})
        },
        //店铺详情
        storeDetail(shopId,userId) {
            let url = '/pages/storePage/main?shopId=' + shopId + '&isSelf=' + 0;
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
    }
}
</script>

<style lang="less" scoped>
    .content {
        .tabBar {
            background: #fff;
            display: flex;
            justify-content: space-around;
            margin-bottom: 10px;
            position: sticky;
            top: 0;/*阈值*/
            z-index: 100;
            .tabItem {
                font-size:13px;
                font-weight:600;
                color:rgba(74,74,74,1);
                padding-top: 16px;
                padding-bottom: 14px;
                padding-left: 5px;
                padding-right: 5px;
                &.active {
                    color: #FF5100;
                    border-bottom: 1px solid #FF5100;
                }
            }
        }
        .showAll {
            padding-top: 10px;
        }
        .nogoods {
            text-align: center;
            font-size: 14px;
            padding: 10px 0;
            padding-top: 0;
        }
         .noOrder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 100px;
            // padding-bottom: 20px;
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
        .scroll-bar {
            ::-webkit-scrollbar {
                 width: 0;
                 height: 0;
                 color: transparent;
            }
        }
        .scroll-bg {
            background: #fff;
        }
        .list {
            background: #fff;
            padding-top: 10px;
        }
        .storelist {
            background: #f5f5f5;
        }
    }
</style>
