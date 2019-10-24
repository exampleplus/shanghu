<template>
  <div>
    <div class="storeItem" v-for="(item,index) in storeList" :key="index" @click="storeDetail(item.shopId,item.userId)">
      <img :src="item.logo" alt>
      <div class="storeInfo">
        <div class="store">
          <div class="stroeName">
            <p class="name">{{item.name}}</p>
            <div class="lableList">
              <div class="label" v-for="(label,index2) in item.labelList" :key="index2">{{label}}</div>
            </div>
          </div>
        </div>
        <div class="hot">
          <img src="/static/images/icon-hot.png" class="icon-hot">
          <span class="storeHot">商家热度:</span>
          <span class="hotNum">{{item.viewNum}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    storeList: {
      type: Array
    }
  },
  methods:{
    storeDetail(shopId,userId) {
      this.$emit("storePage",shopId,userId)
    },
  }
};
</script>

<style lang="less" scoped>
.storeItem {
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin: 10px;
  padding: 10px;
  border-radius: 6px;
  img {
    width: 110px;
    height: 110px;
    border-radius: 6px;
    margin-right: 10px;
  }
  .storeInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .store {
      .stroeName {
        .name {
          font-size: 16px;
          font-weight: 600;
          color: rgba(9, 2, 3, 1);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .lableList {
          display: flex;
          flex-wrap: wrap;
          .label {
            box-sizing: border-box;
            width: 61px;
            height: 17px;
            text-align: center;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAiCAYAAACQhM1+AAADJElEQVR4Xu2aT0wTQRSH39tAut0/U4IkGi4EjZ5EvYN6B+MdEu82erfRu0TvNnqXxDsY7qCevNDoucYDYoiRnZ12t6TdZ1qCEaX09eRs+nrdN7vffL920jY/hCFeLWOuZdTZGWKJjFpggBDWcRiOxOhVIKoMs0Zm/78BAlhmB01E2GroOhHM/H90IeAaQIC4EKgL7KATrW8C0hb3ATJnhwEH8XUhUPfYQaeNqEoZlO3AFwquAXRg0fVLm6ygiT6Op+byNwA4x32AzFlhYN8N1DQitllBN7S+4yCtW4EuEGwDCPDCDUsPuwtYQbdMvJZRtsJ+ggxaYYAI5z2lPrCCJiI/jaPvgOhbQS8QLAOIUC/46hIiEivoljErGXXWWHeXIYsM4NNiqJ4cAw08uhMdvQWERYt2ICgMAw44Vwth+JkVNGk9lSLtAsA4494yYokBRNxxA3XjT5wzP9FpIy5TllUt4RcMpgEH8VEhUM/ZQSdx9A4A5pn3lzELDCBiljntWc+b/MoKOkmSGWgf1rk/wSzYoyD0DOBWMVS3/5bR9+huGV3JiFbFXr4MoOPcd/3wFTvo1OgaEc3la5ujTYuIh4cZTCulfrCCbhkzl1GnNtra8rd7RFh3g9Ld08hPPbqlYJC/kLvEDsByISy9YQXdLRiksa4DSsEgZ3EbN1DnEbHJCrrZ1AvYoe2cbXLkcY8LBv1E/HN0p3FUJZCCQd7eOeiMLbq+v8kK+qhgcGUXgKbyttHR5sV9Nwh7BQNW0GkjWqIMNkZbWv52TwBVLyw9OIv8xNGdmGgNCKRgkLOsiXDBU+o9K2ja2/NTz5WCQc5CBoIvbqguHhcMBh7dTROtIIEUDPIWNNJqMZh4PAj799GdmmiDCJYGLZDrdhloQ2cuDCc/DaLqBa21nhqXgsEgV9ZdJ6CaF05c54D1gk7jgzIBSsGAY8yiGQexUgjUMw5SL+gkjrr/hC1wFsiMHQaOCgZjs57nnSgY9P0yliQ/Z6DtSMHAjvyGoMDtYqhucRdgU+sKohQMuMJsmUOgshtOvOTyYBIf1ABQCgZcYxbMnVUw6If3CyFYBfjcFNUoAAAAAElFTkSuQmCC");
            background-repeat: no-repeat;
            background-size: cover;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 81, 0, 1);
            margin-bottom: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .hot {
      display: flex;
      align-items: center;
      .icon-hot {
        width: 10px;
        height: 12px;
        margin-right: 3px;
      }
      .storeHot {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 81, 0, 1);
        margin-right: 5px;
      }
      .hotNum {
        font-size: 18px;
        font-weight: 600;
        color: rgba(255, 81, 0, 1);
      }
    }
  }
}

</style>
