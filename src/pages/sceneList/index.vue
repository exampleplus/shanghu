<template>
  <div class="content">
    <div class="top" :style="sceneList.length <= 0 ? 'padding-bottom:10px' : ''">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search">
        <input type="text" placeholder="搜索场景" v-model="searchName" confirm-type="search"  @confirm="search">
      </div>
    </div>
    <div class="sceneList">
        <div class="sceneItem" v-for="(item,index) in sceneList" :key="index" @click="sceneDetail(item.sceneId,item.level)">
          <div class="coverImg">
            <img :src="item.logo" alt>
          </div>
          <p>{{item.detail}}</p>
        </div>
    </div>
     <div class="nodata" v-if="sceneList.length <= 0">
        <img src="/static/images/nosearch.png" alt="">
        <p>抱歉，没有找到相关内容</p>
    </div>
    <last-page :last="{length: sceneList.length, lastPage: lastPage}"></last-page>
  </div>
</template>
<script>
import {typeSearch} from '@/api/api'
import {toast} from '@/utils/index'
import lastPage from "@/components/lastPage";
export default {
  data() {
    return {
      sceneList: [],
      type:2,
      searchName:'',
      pageIndex:1,
      pageSize:10
    };
  },
  components: {
    lastPage
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    if(this.$mp.query.type) {
      this.type = this.$mp.query.type
    }
    if(this.$mp.query.searchName) {
      this.searchName = this.$mp.query.searchName
    }
    this.initData();
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },
  methods: {
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
      // 上拉加载更多
    loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this.initData();
        }
      },
    initData() {
      let type = this.type;
      let searchName = this.searchName;
      let pageIndex = this.pageIndex;
      let pageSize = this.pageSize;
      typeSearch({type,searchName,pageIndex,pageSize}).then(res => {
          if(!res.data.code) {
             this.hasNextPage = res.data.hasNextPage;
             let list = res.data.list;
             this.sceneList = this.sceneList.concat(list);
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
    search() {
      this.sceneList = [];
      let searchName = this.searchName;
      let type = this.type;
      this.pageIndex = 1;
      this.initData();
    },
  }
};
</script>

<style lang="less" scoped>
.content {
  .top {
    display: flex;
    padding: 40rpx;
    background: #fff;
    padding-bottom: 0;
    .search {
      flex: 1;
      position: relative;
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
  }
  .sceneList {
    .sceneItem {
      background: #fff;
      margin-bottom: 10px;
      padding: 20px 0;
      .coverImg {
        padding:0 20px;
         img {
          width: 100%;
          height: 200px;
          vertical-align: middle;
          margin-bottom: 10px;
          padding-right: 20px;
        }
      }
      p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
        padding: 0 40rpx;
      }
    }
    .divi {
      width: 100%;
      height: 10px;
      background: #f6f6f6;
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

