<template>
  <div class="content">
    <div class="top">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search">
        <input type="text" :placeholder="placeholder" confirm-type="search" v-model="searchName" @confirm="search">
      </div>
    </div>
  </div>
</template>
<script>

import {toast} from '@/utils/index'
import goodsItem from "@/components/goodsItem";
export default {
   components: {
    goodsItem,
  },
  data() {
    return {
      searchName:'',
      type:'',
      placeholder:'搜索'
    };
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
    this.type = this.$mp.query.type;
    let type = this.$mp.query.type;
    if(type == 1) {
      this.placeholder = '搜索商品'
    } else if(type == 2) {
      this.placeholder = '搜索场景'
    }  else if(type == 3) {
      this.placeholder = '搜索店铺'
    } else if(type == 4) {
      this.placeholder = '搜索设计师'
    } else if(type == 5) {
      this.placeholder = '搜索素材'
    }
  },
  methods:{
    search() {
      let type = this.type;
      let searchName = this.searchName;
      if(type == 1) {
        let url = '/pages/goods/main?type=' + type + '&searchName=' + searchName;
        wx.navigateTo({url})
      } else if(type == 2) {
        let url = '/pages/sceneList/main?type=' + type + '&searchName=' + searchName;
        wx.navigateTo({url})
      } else if(type == 3) {
        let url = '/pages/storeList/main?type=' + type + '&searchName=' + searchName;
        wx.navigateTo({url})
      } else if(type == 4) {
        let url = '/pages/designerList/main?type=' + type + '&searchName=' + searchName;
        wx.navigateTo({url})
      }else if(type == 5) {
        let url = '/pages/sourceList/main?type=' + type +  '&searchName=' + searchName;
        wx.navigateTo({url})
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
.content {
    background: #fff;
    height: 100%;
}
.top {
  display: flex;
  padding: 40rpx;
  background: #fff;
  align-items: center;
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
  .cancel {
        font-size:14px;
        color:rgba(155,155,155,1);
  }
}
.searchAppointed {
    text-align: center;
    margin: 24px 0;
    font-size:14px;
    font-weight:600;
    color:rgba(214,214,214,1);
}
.searchDesign {
    text-align: center;
    span {
        font-size:14px;
        color:rgba(74,74,74,1);
        border-right:1px solid #eee;
        padding: 0 16px;
        &:last-of-type {
            border-right: none;
        }
    }
}
</style>
