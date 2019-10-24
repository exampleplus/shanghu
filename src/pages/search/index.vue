<template>
  <div class="content">
    <div class="top">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search">
        <input type="text" placeholder="搜索" confirm-type="search" v-model="searchName" @confirm="search">
      </div>
      <span class="cancel" @click="cancel">取消</span>
    </div>
    <p class="searchAppointed">搜索指定内容</p>
    <p class="searchDesign">
         <span @click="searchType(1)">商品</span>
         <span @click="searchType(2)">场景</span>
         <span @click="searchType(3)">店铺</span>
         <span @click="searchType(4)">设计师</span>
         <span @click="searchType(5)">素材</span>
    </p>
  </div>
</template>
<script>
import {allSearch} from '@/api/api';
import {toast} from '@/utils/index'
export default {
  data() {
    return {
      searchName:''
    };
  },
  methods:{
    onLoad() {
      Object.assign(this.$data, this.$options.data());
    },
    search() {
      let searchName = this.searchName;
      if(!searchName) {
        toast("搜索内容不能为空");
        return;
      }
      let url = '/pages/searchResult/main?searchName=' + searchName
      wx.navigateTo({url})
    },
    //搜索指定
    searchType(type) {
      let searchName = this.searchName;
      let url = '/pages/searchType/main?type=' + type;
      wx.navigateTo({url})
      
    },
    cancel() {
      wx.navigateBack({
          delta: 1
        })
    },
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
