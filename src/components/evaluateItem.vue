<template>
  <ul class="judgeList">
    <li class="item" v-for="(item,index) in judgeList" :key="index">
      <div class="top">
        <img :src="item.headimgurl" alt v-if="item.headimgurl">
        <span class="nickName">{{item.userName}}</span>
      </div>
      <div class="times">
        <p>
          <span class="gmtCreate">{{item.gmtCreate}}</span>
          <span class="size">{{item.skuName}}</span>
        </p>
      </div>
      <div class="content">{{item.evaluateName}}</div>
      <div class="imgs" v-if="item.img">
        <img
          v-for="(pic,val) in item.imgs"
          :key="val"
          :src="pic"
          alt
          @click="previewImg(item.imgs,pic)"
        >
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    judgeList: {
      type: Array
    }
  },
  methods:{
     previewImg(urls,url) {
       wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
            success(res) {
                // console.log("预览",res)
            }
        })
    }
  },
};
</script>

<style lang="less" scoped>
.judgeList {
  .item {
      background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 32rpx;
    padding-top: 15px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    &:last-of-type {
      border-bottom: none;
    }
    .top {
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .nickName {
        font-size: 12px;
        color: rgba(9, 2, 3, 1);
      }
    }
    .content {
      font-size: 14px;
      font-weight: 400;
      color: rgba(9, 2, 3, 1);
      margin: 10px 0;
    }
    .imgs {
      img {
        width: 60px;
        height: 60px;
        vertical-align: middle;
        margin-right: 24rpx;
        border-radius: 8rpx;
      }
    }
    .times {
      margin-top: 24rpx;
      p {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        .gmtCreate {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>