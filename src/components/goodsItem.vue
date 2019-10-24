<template>
  <ul class="goodsList">
    <li v-for="(item,index) in goodsList" :key="index" @click="detail(item.goodsId)">
      <img :src="item.shopLogo" class="logo" v-if="item.shopLogo">
      <img
        :src="item.logo"
        class="goodsImg"
      >
      <div class="bottom-info">
        <p class="title">{{item.goodsName}}</p>
        <p class="price-num">
          <span class="goodsPrice">¥{{item.goodsPrice}}</span>
          <span class="saleNum" v-if="item.saleCount">销量:{{item.saleCount}}</span>
          <span class="saleNum" v-else>销量:0</span>
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props:{
        goodsList:{
            type:Array
        }
    },
    methods:{
      detail(goodsId) {
        this.$emit("goodsDetail",goodsId)
      },
    }
}
</script>

<style lang="less" scoped>
    .goodsList {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 16px;
  }
  li {
    position: relative;
    margin-right: 12px;
    box-sizing: border-box;
    margin-bottom: 11px;
    width: 165px;
    border-radius:6px;
    border:1px solid rgba(232,234,235,1);
    padding-bottom: 13px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    .logo {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 5px;
      left: 5px;
      z-index: 10;
    }
    .goodsImg {
      width: 100%;
      height: 165px;
      border-top-left-radius: 6rpx;
      border-top-right-radius: 6rpx;
    }
    .bottom-info {
      .title {
        font-size: 28rpx;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding: 0 8px;
        margin-bottom: 5px;
        height: 38px;
      }
      .price-num {
        display: flex;
        align-items: center;
        padding:0 8px;
        .goodsPrice {
          flex: 1;
          font-size:19px;
          font-weight:600;
          color:rgba(255,81,0,1);
        }
        .saleNum {
          font-size:11px;
          color:rgba(155,155,155,1);
          text-align: right;
        }
      }
    }
  }
</style>