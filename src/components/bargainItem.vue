<template>
  <div class="bargainList">
    <div class="bargainItem" v-for="(item,index) in bargainList" :key="index" @click="bargainDetail(item.goodsId)">
      <div class="goodsImg">
        <img :src="item.logo">
      </div>
      <div class="goodsInfo">
        <div class="goods">
          <p class="goodsName">{{item.goodsName}}</p>
          <span class="bargainSign">砍价</span>
          <div class="mini">
            <span class="miniPrice">￥{{item.bottomPrice}}</span>
            <span class="miniText">最低价</span>
          </div>
        </div>
        <div class="sale">
          <span class="originalPrice">￥{{item.marketPrice}}</span>
          <p class="sailInfo">
            <span class="saleNum">销量:</span>
            <span class="saleNum" v-if="item.saleCount">{{item.saleCount}}</span>
             <span class="saleNum" v-else>0</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bargainList: {
      type: Array
    }
  },
  methods:{
    bargainDetail(goodsId) {
      this.$emit("detail",goodsId)
    },
  }
};
</script>

<style lang='less' scoped>
.bargainList {
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 10px;
  .bargainItem {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
    &:last-of-type {
      margin-bottom: 0;
      padding-bottom: 20px;
    }
    .goodsImg {
      width: 140px;
      height: 140px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }
    .goodsInfo {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods {
        .goodsName {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .bargainSign {
          height: 16px;
          line-height: 16px;
          text-align: center;
          padding: 3px 4px;
          background: rgba(196, 67, 71, 1);
          border-radius: 2px;
          font-size: 11px;
          color: rgba(255, 255, 255, 1);
        }
        .mini {
          display: flex;
          align-items: center;
          margin-top: 15px;
          .miniPrice {
            font-size: 24px;
            font-weight: 600;
            color: rgba(255, 81, 0, 1);
            margin-right: 5px;
          }
          .miniText {
            height: 14px;
            line-height: 14px;
            text-align: center;
            padding: 2px 3px;
            font-size: 11px;
            color: rgba(255, 81, 0, 1);
            background: rgba(247, 243, 241, 1);
            border-radius: 2px;
          }
        }
      }
      .sale {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: rgba(155, 155, 155, 1);
        .originalPrice {
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>