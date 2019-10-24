<template>
  <div>
    <scroll-view scroll-x>
      <ul class="diy-material-nav">
        <li
          v-for="(value,index) in materialNav"
          :class="index === materialNavSelected ? 'selected' : ''"
          @click="() => onMaterialNavClick(index)"
          :key="index"
        >{{value.name}}</li>
      </ul>
    </scroll-view>

    <scroll-view scroll-y class="material-list-scroll" @scrolltolower="onMaterialPush">
      <div
        class="diy-material-li"
        v-for="(value,index) in materialData"
        @click="() => onClick(value)"
        :key="index"
      >
        <img
          :src=" value.logo +'?x-oss-process=image/resize,w_320' "
          class="img-box"
          mode="aspectFit"
        />
        <!-- <div class="img-box" :style="{backgroundImage:'url('+value.logo+'?x-oss-process=image/resize,p_20' +')'}"></div> -->
        <p class="material-price">¥{{value.price}}</p>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { get } from "@/api/api";
import { guid, toast } from "@/utils/index";
import { uploadImg, getImageIntro } from "./utils.js";
export default {
  props: {
    diyData: Object,
    onMaterialClick: Function,
    designerId: String,
    isJoin: String,
    remark: String
  },
  data() {
    return {
      materialNavSelected: 0,
      materialNav: [],
      materialData: []
    };
  },
  onShow() {},
  computed: {},
  mounted() {
    this.getLabel();
  },
  onLoad() {
    //  this.getLabel();
  },
  methods: {
    onMaterialNavClick(index) {
      this.materialNavSelected = index;
      this.getMaterialData();
    },

    async getLabel() {
      let { data } = await get("diy/label");
      this.materialNav = data;
      this.getMaterialData();
    },

    async onClick(material) {
      let len = this.diyData.elements.length;
      if (len >= 8) {
        toast("最多添加8个素材");
        return;
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      });

      const { ImageWidth, ImageHeight } = await getImageIntro(material.logo);
      let width = ImageWidth.value;
      let height = ImageHeight.value;
      this.onMaterialClick({
        id: guid(),
        content: material.name,
        materialId: material.materialId,
        type: "material",
        value: material.logo,
        realWidth: Number(ImageWidth.value),
        realHeight: Number(ImageHeight.value),
        price: material.price,
        width: this.diyData.diyRegion.width,
        height: height / width * this.diyData.diyRegion.width,
        angle: 0,
        left: 0,
        top: 0
      });
      wx.hideLoading();
    },

    getImageResizeUrl(width) {
      if (width < wx.getSystemInfoSync().windowWidth * 1.5) {
        return "";
      } else {
        return (
          "?x-oss-process=image/resize,w_" +
          wx.getSystemInfoSync().windowWidth * 1.5
        );
      }
    },

    async getMaterialData() {
      let isGroup = 0;
      if (this.isJoin == 1) {   //加入团队时 只能选免费素材
        isGroup = 1;
      } else {
        isGroup = 0;
      }
      let { data } = await get("diy/material", {
        labelId: this.materialNav[this.materialNavSelected].id,
        designerId: this.designerId,
        isGroup: isGroup
      });
      this.materialData = data;
    },

    onMaterialPush() {
      if (!this.materiallPushing) {
        this.materiallPushing = true;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.diy-material-nav {
  display: flex;
  padding-left: 30px;
  background-color: #fefffe;

  li {
    line-height: 40px;
    font-size: 15px;
    color: #4a4a4a;
    padding-right: 34px;
    white-space: nowrap;
    background-color: #fefffe;
  }

  .selected {
    color: #ff5100;
  }
}

.material-list-scroll {
  background-color: rgba(0, 0, 0, 0.05);
  height: 420px;
}

.diy-material-li {
  float: left;
  width: 50%;
  box-sizing: border-box;
  padding: 17px 28px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  &:nth-of-type(2n) {
    border-right: none;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    // height: 100%;
    height: 130px;
  }

  .img-box {
    position: relative;
    width: 100%;
    // padding-top: 100%;
    // background-size: contain;
    // background-position: center center;
    // background-repeat: no-repeat;
  }
  .material-price {
    font-size: 16px;
    text-align: center;
    color: #e7172d;
  }
}
</style>
