<template>
  <div class="sceneList">
    <div class="sceneItem" v-for="(item,index) in sceneList" :key="index" @click="sceneDetail(item.sceneId,item.level)"> 
      <img :src="item.logo" alt>
      <p v-if="item.detail">{{item.detail}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sceneList: {
      type: Array
    }
  },
  methods:{
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
    }
  }
};
</script>

<style lang="less" scoped>
.sceneList {
  padding: 0 20px;
  .sceneItem {
    padding-bottom: 20px;
    background: #fff;
    img {
      width: 100%;
      height: 200px;
      vertical-align: middle;
      // margin-bottom: 10px;
    }
    p {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
    }
  }
}
</style>
