<template>
  <div class="content">
    <div class="top">
      <div class="search" @click="goSearch">
        <img src="/static/images/search.png" class="icon-search" />
        <input type="text" disabled="true" placeholder="搜索商品、场景、素材、设计师、店铺" />
      </div>
      <div class="filter" @click="goClassify">
        <img src="/static/images/filter.png" alt />
      </div>
    </div>
    <div class="swiper">
      <swiper class="swiperWrapper" :autoplay="autoplay" circular="true" @change="swiperChange">
        <swiper-item v-for="(item,index) in bannerList" :key="index" @click="typeDetail(item)">
          <img :src="item.banner" class="slide-image" />
        </swiper-item>
      </swiper>
      <div class="dots" :style="[{ width: dotsWidth + 'rpx', marginLeft: dotsmgl + 'rpx' }]">
        <div v-for="(item,index2) in bannerList" :key="index2">
          <div class="dot" :class="[{active:index2 == currentSwiper}]"></div>
        </div>
      </div>
    </div>
    <!-- 场景 -->
    <div class="station">
      <div
        class="stationItem"
        v-for="(item,index) in firstScene"
        :key="index"
        @click="sceneDetail(item.sceneId,item.level)"
      >
        <img :src="item.icon" alt />
        <p>{{item.name}}</p>
      </div>
    </div>
    <div
      class="slowdown"
      v-if="allfirstScene.length > 8"
      @click="slowDown"
      :class="[down ? 'up' : '' ]"
    >
      <img src="/static/images/slowdown.png" alt />
    </div>
    <!-- 热门场景 -->
    <div class="designer" style="padding-top:0;">
      <div class="border"></div>
      <div class="hot">热门场景</div>
    </div>
    <scene-item :sceneList="sceneList"></scene-item>
    <div class="division"></div>
    <!-- 设计师 -->
    <div class="designer">
      <div class="border"></div>
      <div class="hot">设计师榜</div>
      <div class="more" @click="moreDesigner">
        <span>更多</span>
        <span class="arrow"></span>
      </div>
    </div>
    <div class="designerList">
      <div class="designWrapper">
        <div class="designerItem" v-for="(item,index) in designerList" :key="index" @click="designerHome(item.designerId)">
          <div class="desi">
            <div class="No" v-if="index == 0">
             <img src="/static/images/no1.png" alt="">
            </div>
            <div class="No" v-if="index == 1">
              <img src="/static/images/no2.png" alt="">
            </div>
            <div class="No" v-if="index == 2">
              <img src="/static/images/no3.png" alt="">
            </div>
            <div class="No" v-if="index > 2">
            
            </div>
            <div class="headImg">
              <img :src="item.headimgurl" alt="">
            </div>
            <div class="level">
              lv{{item.level}}
            </div>
            <div class="designerName">
              {{item.designerName}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="division"></div>
    <!-- 砍价活动 -->
    <div v-if="bargainList.length > 0">
      <div class="designer">
        <div class="border"></div>
        <div class="hot">砍价活动</div>
        <div class="more" @click="moreBargain">
          <span>更多</span>
          <span class="arrow"></span>
        </div>
      </div>
      <bargain-item :bargainList="bargainList" @detail="bargainDetail"></bargain-item>
      <div class="division"></div>
    </div>

    <!-- 热门商品 -->
    <div class="designer">
      <div class="border"></div>
      <div class="hot">热门商品</div>
    </div>
    <div class="hotGoods">
      <goods-item :goodsList="goodsList" @goodsDetail="goodsDetail"></goods-item>
    </div>

    <tab-bar :selectNavIndex="selectNavIndex"></tab-bar>
  </div>
</template>

<script>
import tabBar from "@/components/tabBar";
import goodsItem from "@/components/goodsItem";
import bargainItem from "@/components/bargainItem";
import sceneItem from "@/components/sceneItem";
import { getIndex ,getUserInfo, binding, getNickName } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      selectNavIndex: 0,
      autoplay: true,
      currentSwiper: 0,
      down: false,
      isCanBind:false,
      allfirstScene: [], //全部场景
      firstScene: [], //一级场景
      bannerList: [], //banner
      designerList:[], //设计师
      sceneList: [], //热门场景
      bargainList: [], //砍价商品
      goodsList: [] //热门商品
    };
  },
  components: {
    tabBar,
    goodsItem,
    bargainItem,
    sceneItem
  },
  computed: {
    //轮播圆点宽度
    dotsWidth() {
      let bannerLen = this.bannerList.length;
      return bannerLen * 32 - 7;
    },
    dotsmgl() {
      let dotsml = (this.bannerList.length * 32 - 7) / 2;
      return -dotsml;
    }
  },
   onShareAppMessage(res) {
    return {
      title: `尚乎`,
      imageUrl: this.bannerList[0].banner,
      path: "/pages/home/main"
    };
  },
   onShow() {
    wx.hideTabBar();
       //绑定上下级
       let token = wx.getStorageSync('token');
       if(this.isCanBind) {
         return;
       } else {
          if (this.$mp.query.scene) {
            let scene = decodeURIComponent(this.$mp.query.scene);
            wx.setStorageSync("scene",scene);
          }
          let userId = wx.getStorageSync("scene");
          if(userId) {
              if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url})
              return;
            } else {
              //  getNickName({id:userId}).then(res => {
              //   let nickName = res.data;
              //   toast(`您正在成为${nickName}的二级分销商`)
              // })
                 toast(`您正在成为尚乎推广商`)
                 binding({userId}).then(res => {
                  if(!res.data.code) {
                    this.isCanBind = true;
                    wx.removeStorageSync('scene')
                  } else {
                    toast(res.data.msg)
                  }
                })
            }
          }
       }
  },
  onLoad(options) {
    this.initData();
    this._getUserInfo();
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    //模拟加载
    let that = this;
     that.down = false;
    setTimeout(function() {
      that.initData();
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  },
  methods: {
     //获取用户信息
        _getUserInfo() {
              this.$store.dispatch('updateUserData')
            // wx.showLoading({title:"加载中"})
            // getUserInfo().then(res => {
            //     if(!res.data.code) {
            //         wx.hideLoading();
            //         this.userInfo = res.data;    
            //         this.headimgurl = res.data.headimgurl;
            //         this.nickName = res.data.nickname
            //     } else {
            //         toast(res.data.msg)
            //     }
            // })
        },

    //获取首页信息
    initData() {
      let that = this;
      getIndex().then(res => {
        if (!res.data.code) {
          that.allfirstScene = res.data.FIRSTSCENE;
          that.firstScene = res.data.FIRSTSCENE.slice(0, 8);
          that.sceneList = res.data.SCENE;
          that.goodsList = res.data.GOODS;
          that.bannerList = res.data.BANNER;
          that.designerList = res.data.DESIGNER;
          that.bargainList = res.data.BARGAINGOODS;
        } else {
          toast(res.data.msg);
        }
      });
    },
    swiperChange(e) {
      this.currentSwiper = e.mp.detail.current;
    },
    //展开更多场景
    slowDown() {
      if (this.down == false) {
        let allfirstScene = this.allfirstScene;
        this.firstScene = allfirstScene;
        this.down = true;
      } else if (this.down == true) {
        let allfirstScene = this.allfirstScene;
        this.firstScene = this.allfirstScene.slice(0, 8);
        this.down = false;
      }
    },
    //banner跳转
    typeDetail(item) {
      let type = item.type;
      let typeId = item.typeId;
      if (type == 1) {
        //商品详情
        let url = "/pages/goodsDetail/main?goodsId=" + typeId;
        wx.navigateTo({ url });
      } else if (type == 2) {
        //商品分类
        let url = "/pages/classify/main";
        wx.navigateTo({ url });
      } else if (type == 3) {
        //场景详情
        let url = "/pages/sceneDetail/main?sceneId=" + typeId;
        wx.navigateTo({ url });
      } else if (type == 4) {
        //场景详情
        let url = "/pages/designerDetail/main?designerId=" + typeId;
        wx.navigateTo({ url });
      } else if (type == 5) {
        //场景详情
        let url = "/pages/storePage/main?shopId=" + typeId;
        wx.navigateTo({ url });
      }
    },
    //搜索
    goSearch() {
      let url = "/pages/search/main";
      wx.navigateTo({ url });
    },
    //全部分类
    goClassify() {
      let url = "/pages/classify/main";
      wx.navigateTo({ url });
    },
    //更多砍价
    moreBargain() {
      let url = "/pages/activity/main";
      wx.navigateTo({ url });
    },
    //更多设计师
    moreDesigner() {
        let type = 4;
        let searchName = ''
        let url = '/pages/designerList/main?type=' + type + '&searchName=' + searchName;
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
    //一级场景详情
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
    //活动商品详情
    bargainDetail(goodsId) {
      let url = "/pages/bargainDetail/main?goodsId=" + goodsId;
      wx.navigateTo({ url });
    },
    //商品详情
    goodsDetail(goodsId) {
      let url = "/pages/goodsDetail/main?goodsId=" + goodsId;
      wx.navigateTo({ url });
    }
   
  }
};
</script>

<style lang='less' scoped>
.content {
  background: #fff;
  .top {
    height: 184rpx;
    box-sizing: border-box;
    background: url(data:image/png;base64,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);
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    padding: 30rpx 20rpx;
    .search {
      flex: 1;
      position: relative;
      margin-right: 28rpx;
      .icon-search {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        top: 16rpx;
        left: 22rpx;
      }
      input {
        height: 60rpx;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #9b9b9b;
        padding-left: 60rpx;
      }
    }
    .filter {
      width: 40rpx;
      height: 28rpx;
      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
  .swiper {
    position: relative;
    top: -36px;
    padding: 0 20rpx;
    .swiperWrapper {
      height: 418rpx;
      swiper-item {
        height: 100%;
        img {
          width: 100%;
          height: 418rpx;
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
      // margin-left:-100rpx;
      .dot {
        width: 30rpx;
        height: 6rpx;
        border-radius: 3rpx;
        margin-right: 6rpx;
        background-color: rgba(255, 255, 255, 0.4);
        &.active {
          background-color: #ff5100;
        }
      }
    }
  }
  .station {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: -15px;
    .stationItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
      margin-bottom: 40rpx;
      text-align: center;
      img {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        margin-bottom: 16rpx;
      }
      p {
        font-size: 24rpx;
        font-weight: 400;
        width:80%;
        color: rgba(52, 51, 51, 1);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
  .slowdown {
    text-align: center;
    margin: 15px 0;
    margin-top: 0;
    &.up {
      transform: rotate(180deg);
    }
    img {
      width: 22px;
      height: 22px;
    }
  }
  .hotScene {
    display: flex;
    align-items: center;
    .border {
      width: 6px;
      height: 19px;
      background: rgba(255, 81, 0, 1);
    }
    .hot {
      font-size: 18px;
      font-weight: 600;
      color: rgba(9, 2, 3, 1);
      margin-left: 14px;
    }
  }
  .division {
    width: 100%;
    height: 10px;
    background: #f6f6f6;
  }
  .designer {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding-top: 20px;
    padding-right: 15px;
    .border {
      width: 6px;
      height: 19px;
      background: rgba(255, 81, 0, 1);
    }
    .hot {
      font-size: 18px;
      font-weight: 600;
      color: rgba(9, 2, 3, 1);
      margin-left: 14px;
      flex: 1;
    }
    .more {
      display: flex;
      align-items: center;
      span {
        font-size: 13px;
        font-weight: 400;
        color: rgba(9, 2, 3, 1);
        &.arrow {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-right: 1px solid #090203;
          border-bottom: 1px solid #090203;
          transform: rotate(-45deg);
          margin-left: 8px;
        }
      }
    }
  }
  .designerList {
    display: flex;
    padding-left: 15px;
    ::-webkit-scrollbar {
          width: 0;
          height: 0;
          color: transparent;
      }
    .designWrapper {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      padding-bottom: 15px;
      .designerItem {
        display: inline-block;
        width: 118px;
        padding: 12px 0;
        background: linear-gradient(
          270deg,
          rgba(208, 224, 238, 1) 0%,
          rgba(234, 241, 249, 1) 100%
        );
        border-radius: 6px;
        margin-right: 10px;
        .desi {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .No {
            width: 29px;
            height: 24px;
            position: relative;
            bottom: -5px;
            // z-index: 10;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .headImg {
            width: 60px;
            height: 60px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .level {
            background:rgba(255,81,0,1);
            box-shadow:0px 2px 4px 0px rgba(255,194,166,1);
            border-radius:10px;
            color: #fff;
            font-size: 11px;
            padding:3px 6px;
            position: relative;
            top: -5px;
            // z-index: 10;
          }
          .designerName {
            width: 76px;
            text-align: center;
            font-size:14px;
            color:rgba(74,74,74,1);
            margin-top: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .hotGoods {
    padding-bottom: 55px;
  }
}
</style>