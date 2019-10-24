<template>
  <section :class="'complete ' + (visible  ? 'visible' : '') ">
    <div @click="onClose" :class="'mask ' + (visible ? 'visible' : '') "></div>
    <section :class="'complete-content ' + (visible ? 'visible' : '') ">
      <section class="head">
        <img class="img" :src="orderImage" />

        <div class="head-content">
          <p class="price">¥{{price}}</p>
          <p>
            <span>含素材费：</span>
            <span class="yellow">{{allMaterialPrice}}</span>
          </p>
          <p>请选择您的尺码</p>
        </div>
      </section>

      <section v-if="baseData">
        <section class="select-box" v-for="(option,index) in baseData.specList" :key="index">
          <h3>{{option.goodsSpecName}}</h3>
          <ul class="select">
            <li
              v-for="(value,i) in option.goodsSkuSpecVals"
              @click="() => value.disabled || onLiClick(value,index)"
              :key="i"
              :class="(value.hide ? 'hide ' : '')+(value.selected ? 'selected ' : '')+(value.disabled ? ' disabled':'')"
            >{{value.goodsSkuSpecValName}}</li>
          </ul>
        </section>
      </section>
      <!-- 加入团队时 -->
      <button
        class="button member"
        @click="memberClick"
        v-if="remark && isJoin == 1 && joinToTeam == 'joinToTeam' "
      >确定</button>

      <!-- 团长修改团员 和 修改团长自己 数据时 -->
      <button
        class="button edit"
        @click="editClick"
        v-if="isEdit == 1 && isJoin == 1 && !joinToTeam"
      >确定</button>

      <!-- //团长自己diy -->
      <!-- <button class="button edit" @click="editClick" v-if="isEdit == 1 && isJoin == 1 && jupmToTeamOrder=='jupmToTeamOrder'">确定</button> -->

      <!-- 个人diy时 -->
      <button class="button" @click="onClick" v-if="isShowBtn == 1">确定</button>

      <div class="close" @click="onClose">+</div>
      <canvasImage
        ref="canvasImage"
        :elements="elements"
        :baseData="baseData"
        :materialData="materialData"
        :color="color"
      />
    </section>
  </section>
</template>
<script>
import canvasImage from "./canvasImage.vue";
import { uploadImg, getImageIntro } from "./utils.js";
import { toast } from "@/utils/index";
import {
  BaseMaterialStock,
  addWorks,
  groupTemplate,
  joinTeam,
  memberModify
} from "@/api/api";
export default {
  components: {
    canvasImage
  },
  props: {
    joinToTeam: String,
    jupmToTeamOrder: String,
    diyType: String,
    elements: Array,
    baseData: Object,
    materialData: Object,
    color: String,
    visible: Boolean,
    onHide: Function,
    onComplete: Function,
    designerId: String,
    remark: String,
    groupDiyId: String,
    isEdit: String,
    userId: String,
    isShowBtn: Boolean,
    isJoin: Boolean,
    colorId: String,
    colorSpec: Object
  },

  data() {
    return {
      orderImage: "",

      curentSkuId: [],
      price: this.baseData.baseMaterialPrice,
      allMaterialPrice: (0).toFixed(2)
    };
  },
  mounted() {},
  onShow() {},
  computed: {
    enabledList() {
      return this.baseData.skuList.filter(
        value => value.disable && value.goodsSkuStock > 0
      );
    },
    getMaterialPrice() {
      let price = 0;
      this.elements[0].forEach(
        value => value.type === "material" && (price += value.price)
      );
      this.elements[1].forEach(
        value => value.type === "material" && (price += value.price)
      );
      return price;
    }
  },
  watch: {
    visible() {
      this.curentSkuId = [];
      this.triggerLiClick();
      // this.getPrice();
      // this.setDisabled();
    }
  },
  methods: {
    getPrice() {
      let sku = this.findSkuObj(this.curentSkuId);
      let price = 0;
      if (sku) {
        price = sku.goodsSkuRetailPrice;
      } else {
        price = this.baseData.baseMaterialPrice;
      }

      price += this.getAllMaterialPrice();
      this.price = price.toFixed(2);
      return price;
    },
    findSkuObj(skuIdArray) {
      return this.baseData.skuList.find(value =>
        this.idsEqualToIdList(value.goodsSkuIds.split(","), skuIdArray)
      );
    },
    getAllMaterialPrice() {
      let price = 0;
      this.elements[0].forEach(
        value => value.type === "material" && (price += value.price)
      );
      this.elements[1].forEach(
        value => value.type === "material" && (price += value.price)
      );

      this.allMaterialPrice = price.toFixed(2);
      return price;
    },

    // 判断ids是否包含idList
    verificationIds(ids, idList) {
      if (idList.length === 0) {
        return true;
      }

      ids = [...ids]
        .filter(value => value !== undefined)
        .map(value => parseInt(value));

      idList = [...idList]
        .filter(value => value !== undefined)
        .map(value => parseInt(value));

      console.log("ids, idList", ids, idList);
      return !idList.find(element => !ids.find(value => value === element));
    },

    idsEqualToIdList(ids, idList) {
      ids = [...ids].map(value => parseInt(value)).sort();
      idList = [...idList].map(value => parseInt(value)).sort();

      return ids.every((element, index) => idList[index] === element);
    },

    isSelected(value) {
      const { curentSkuId } = this;
      return curentSkuId.includes(value.id);
    },
    onClose() {
      this.orderImage = "";
      this.onHide();
    },
    getMaterialPrice() {
      let price = 0;
      this.elements[0].forEach(
        value => value.type === "material" && (price += value.price)
      );
      this.elements[1].forEach(
        value => value.type === "material" && (price += value.price)
      );
      return price.toFixed(2);
    },

    triggerLiClick() {
      let clickValue;
      let index = this.baseData.specList.findIndex(value => {
        clickValue = value.goodsSkuSpecVals.find(
          value => value.id === this.colorSpec.specColorId
        );

        return clickValue;
      });

      this.onLiClick(clickValue, index);
    },

    onLiClick(value, index) {
      const { curentSkuId, baseData } = this;
      if (curentSkuId.includes(value.id)) {
        curentSkuId[index] = undefined;
      } else {
        curentSkuId[index] = value.id;
      }

      this.setDisabled();
      this.getPrice();
    },
    isDisabled(item, index) {
      if (this.colorSpec.specColorId === item.id) {
        return true;
      }

      const { enabledList, curentSkuId } = this;
      const currentIds = [...curentSkuId];

      // 颜色联动
      let specVals = this.baseData.specList[index].goodsSkuSpecVals.find(
        value => this.colorSpec.specColorId === value.id
      );

      if (specVals) {
        curentSkuId[index] = this.colorSpec.specColorId;
        return true;
      }

      return !enabledList.find(value =>
        this.verificationIds(value.goodsSkuIds.split(","), currentIds)
      );
    },
    isHide(item, index) {
      const { enabledList, curentSkuId } = this;
      let specVals = this.baseData.specList[index].goodsSkuSpecVals.find(
        value => this.colorSpec.specColorId === value.id
      );

      if (specVals) {
        curentSkuId[index] = this.colorSpec.specColorId;
        return true;
      } else {
        return false;
      }
    },
    setDisabled() {
      const { curentSkuId, baseData } = this;
      let specList = [...baseData.specList];
      for (const index in specList) {
        const element = specList[index];
        for (const key in element.goodsSkuSpecVals) {
          const value = element.goodsSkuSpecVals[key];
          value.selected = this.isSelected(value);
          value.disabled = this.isDisabled(value, index);
          // value.hide = this.isHide(value, index);
        }
      }
      baseData.specList = specList;
    },
    async setImage() {
      this.orderImage = await this.$refs.canvasImage.getImage();

      // console.time("速度");
      // this.$refs.canvasImage.getMaterialImage().then(value => {
      //   console.timeEnd("速度");
      //   console.log(value[0], value[1]);
      // });
    },

    //个人diy定制
    async onClick() {
      const token = wx.getStorageSync("token");
      console.log("token", token);
      if (!token) {
        let url = "/pages/authorization/main";
        wx.navigateTo({ url });
        return;
      }
      if (this.verification()) {
        return;
      }

      wx.showLoading({
        title: "加载中",
        mask: true
      });
      let logo = await uploadImg(this.orderImage);
      if (this.designerId) {
        //设计师添加作品
        let works = logo;
        addWorks({ works }).then(res => {
          wx.hideLoading();
          if (!res.data.code) {
            wx.navigateBack();
          } else {
            toast(res.data.msg);
          }
        });

        return;
      }

      try {
        let diyInfoList = [];
        let materialIdList = [];
        this.elements[0].forEach(value => {
          console.log("value", value);
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({
              ...value,
              isFront: true,
              isTemplate: true,
              scale: scale
            })
          );
        });
        this.elements[1].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({
              ...value,
              isFront: false,
              isTemplate: true,
              scale: scale
            })
          );
        });

        console.log("this.base", this.baseData);
        let id = this.baseData.id;
        let goodsNum = 1;
        let { id: skuId, goodsSkuRetailPrice } = this.findSkuObj(
          this.curentSkuId
        );

        console.log("skuId", skuId);

        let orderAmount = this.getPrice();
        console.log(
          "订单参数",
          id,
          skuId,
          goodsNum,
          materialIdList,
          logo,
          orderAmount,
          diyInfoList
        );
        let params = {
          id,
          skuId,
          goodsNum,
          materialIdList,
          logo,
          orderAmount,
          diyInfoList
        };
        let diyInfo = [];
        diyInfo.push(params);
        console.log("diyInfo", diyInfo);
        diyInfo = JSON.stringify(diyInfo);
        let diyArr = [];
        diyArr.push({ skuId, id, goodsNum });

        BaseMaterialStock(diyArr).then(res => {
          wx.hideLoading();
          if (!res.data.code) {
            let url = "/pages/order/diyconfirmOrder/main?diyInfo=" + diyInfo;
            wx.navigateTo({ url });
          } else {
            toast(res.data.msg);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    // 加入团队时定制
    async memberClick() {
      if (this.verification()) {
        return;
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      });

      let logo = await uploadImg(this.orderImage);
      try {
        let diyInfoList = [];
        let materialIdList = [];
        this.elements[0].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({ ...value, isFront: true, scale })
          );
        });
        this.elements[1].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({ ...value, isFront: false, scale })
          );
        });

        let id = this.baseData.id;
        let goodsNum = 1;
        let { id: skuId, goodsSkuRetailPrice } = this.findSkuObj(
          this.curentSkuId
        );
        let orderAmount = this.getPrice();
        console.log("diyInfoList", diyInfoList);
        console.log(
          "订单参数",
          id,
          skuId,
          goodsNum,
          materialIdList,
          logo,
          orderAmount,
          diyInfoList
        );
        let params = {
          id,
          skuId,
          goodsNum,
          materialIdList,
          logo,
          orderAmount,
          diyInfoList
        };
        let diyInfo = [];
        diyInfo.push(params);
        diyInfo = JSON.stringify(diyInfo);
        let diyArr = [];
        diyArr.push({ skuId, id, goodsNum });
        let diyConfig = {
          id: this.groupDiyId,
          baseId: this.baseData.id,
          skuId: skuId,
          logo: logo,
          remark: this.remark,
          colorId: this.colorId
        };
        console.log("colorId", this.colorId);
        let memberDiyInfo = {
          diyConfig,
          diyInfoList
        };
        console.log("memberDiyInfo", memberDiyInfo);
        joinTeam(memberDiyInfo).then(res => {
          wx.hideLoading();
          if (!res.data.code) {
            let groupDiyId = wx.getStorageSync("groupDiyId");
            this.$store.dispatch("getGroupOrderInfo", { groupDiyId });
            wx.navigateBack({ delta: 2 });
          } else {
            toast(res.data.msg);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    verification() {
      if (this.orderImage === "") {
        wx.showToast({
          title: "定制生成中请稍等",
          icon: "none"
        });
        return true;
      }

      let options = [];
      this.baseData.specList.forEach(value =>
        value.goodsSkuSpecVals.forEach(value => {
          value.selected && options.push(value);
        })
      );
      if (this.baseData.specList.length !== options.length) {
        wx.showToast({
          title: "请选择定制规格",
          icon: "none"
        });
        return true;
      }

      return false;
    },

    //团长修改团员数据时
    async editClick() {
      if (this.verification()) {
        return;
      }

      wx.showLoading({
        title: "加载中",
        mask: true
      });
      let logo = await uploadImg(this.orderImage);

      try {
        let diyInfoList = [];
        let materialIdList = [];
        this.elements[0].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({ ...value, isFront: true, scale })
          );
        });
        this.elements[1].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({ ...value, isFront: false, scale })
          );
        });

        let id = this.baseData.id;

        let goodsNum = 1;
        let { id: skuId, goodsSkuRetailPrice } = this.findSkuObj(
          this.curentSkuId
        );

        let orderAmount = this.getPrice();

        console.log("团长定制", diyInfoList);
        let diyConfig = {
          id: this.groupDiyId,
          userId: this.userId,
          baseId: this.baseData.id,
          skuId: skuId,
          logo: logo,
          remark: this.remark,
          colorId: this.colorId
        };
        let memberDiyInfo = {
          diyConfig,
          diyInfoList
        };
        console.log("memberDiyInfo", memberDiyInfo);
        memberModify(memberDiyInfo).then(res => {
          if (!res.data.code) {
            let groupDiyId = wx.getStorageSync("groupDiyId");
            this.$store.dispatch("getGroupOrderInfo", { groupDiyId });
            if (this.jupmToTeamOrder) {
              wx.navigateTo({ url: "/pages/order/teamOrder/teamOrders/main" });
            } else {
              wx.navigateBack({ delta: 1 });
            }
          } else {
            toast(res.data.msg);
          }
        });
      } catch (error) {
        console.log(error);
      }
      wx.hideLoading();
    },

    getMaterial({
      type,
      materialId,
      value,
      price,
      angle,
      width,
      height,
      content,
      left,
      top,
      isFront,
      isTemplate,
      scale
    }) {
      return {
        materialId,
        type: this.getTypeString(type),
        angle,
        xaxes: left,
        yaxes: top,
        width,
        height,
        content,
        img: value,
        isFront,
        isTemplate,
        scale
      };
    },

    getTypeString(key) {
      switch (key) {
        case "material":
          return 1;
        case "doodling":
          return 2;
        case "text":
          return 3;
        case "image":
          return 4;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.complete {
  position: fixed;
  left: 100%;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  &.visible {
    left: 0;
  }
  &.teamvisible {
    left: 0;
  }
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0;
  transition: opacity 0.4s;
  &.visible {
    opacity: 0.3;
  }
  &.teamvisible {
    opacity: 0.3;
  }
}

.complete-content {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: -2000px;
  padding-bottom: 8px;
  width: 100%;
  background-color: white;
  transition: bottom 0.4s;
  &.visible {
    bottom: 0px;
  }
  &.teamvisible {
    bottom: 0px;
  }
}

.head {
  padding: 0 15px;
  display: flex;

  .img {
    width: 96px;
    height: 96px;
    margin-top: -11px;
  }

  .price {
    font-size: 25px;
    margin-bottom: 10px;
    font-size: 18px;
    color: #ff5100;
  }

  .head-content {
    font-size: 12px;
    line-height: 20px;
    padding-left: 14px;
    padding-top: 11px;
    color: #615454;
  }
}

h3 {
  margin-top: 22px;
  color: #343333;
  font-size: 14px;
  padding: 0 15px;
}

.select-box {
  &:last-of-type .select {
    border-bottom: none;
  }
}

.select {
  display: flex;
  margin-top: 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid #ebebeb;
  padding: 0 15px;

  li {
    box-sizing: border-box;
    margin-bottom: 12px;
    margin-right: 12px;
    font-size: 12px;
    border-radius: 4px;
    padding: 4px 15px;
    height: 26px;
    background-color: #f6f6f6;
    border: 1px solid #f6f6f6;
  }

  .disabled {
    color: #9b9b9b;
  }

  .hide {
    display: none;
  }
  .selected {
    display: block;
    color: #ff5100;
    background-color: #fdf4f2;
    border: 1px solid #ff5100;
  }
}

.button {
  margin: 25px 15px 0 15px;
  box-sizing: border-box;
  background: linear-gradient(#fe7900, #ff5100);
  font-size: 16px;
  color: white;
  border-radius: 20px;
  border: none;
  height: 40px;
  line-height: 40px;
}

.num {
  display: flex;
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  margin: 23px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  .selnum {
    font-size: 14px;
    font-weight: 400;
    color: rgba(52, 51, 51, 1);
  }
  .nums {
    display: flex;
    align-items: center;
    .reduse {
      width: 33px;
      height: 30px;
      line-height: 18px;
      text-align: center;
      background: rgba(245, 245, 245, 1);
      border-radius: 0px 2px 2px 0px;
      img {
        width: 12px;
        height: 2px;
      }
    }
    .buyNum {
      width: 38px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: rgba(52, 51, 51, 1);
      background: rgba(237, 235, 235, 1);
      margin: 0 2px;
    }
    .addNum {
      width: 33px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(245, 245, 245, 1);
      border-radius: 0px 2px 2px 0px;
      img {
        width: 12px;
        height: 12px;
      }
    }
  }
}
.selColor {
  .selColor-top {
    font-size: 14px;
    color: rgba(52, 51, 51, 1);
    margin-bottom: 15px;
    padding-left: 15px;
  }
  .selColor-content {
    display: flex;
    margin-bottom: 20px;
    padding-left: 15px;
    .color-item {
      width: 28px;
      height: 28px;
      background: #000;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .canDiy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px 20px 15px;
    border-top: 1px solid #eee;
    span {
      font-size: 14px;
      color: rgba(52, 51, 51, 1);
    }
  }
  .generate {
    width: 345px;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background: linear-gradient(
      90deg,
      rgba(254, 121, 0, 1) 0%,
      rgba(255, 81, 0, 1) 100%
    );
    border-radius: 20px;
  }
}
.close {
  position: absolute;
  top: 16px;
  right: 16px;
  line-height: 30px;
  font-size: 40px;
  color: #baadad;
  transform: rotate(45deg);
}

.yellow {
  color: #ff5100;
}
</style>
