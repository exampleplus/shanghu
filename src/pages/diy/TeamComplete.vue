<template>
  <div>
    <section :class="'complete ' + (visible  ? 'visible' : '') ">
      <div @click="onClose" :class="'mask ' + (visible ? 'visible' : '') "></div>

      <!-- 团队定制 -->
      <section :class="'complete-content ' + (visible ? 'visible' : '') ">
        <div class="close" @click="onClose">+</div>
        <section class="head">
          <img class="img" :src="orderImage" />

          <div class="head-content">
            <p class="price">¥{{price}}</p>
            <p>
              <span>含素材费：</span>
              <span class="yellow">{{allMaterialPrice}}</span>
            </p>
          </div>
        </section>

        <section>
          <!-- 有效天数 -->
          <div class="num">
            <div class="selnum">有效天数</div>
            <div class="nums">
              <div class="reduse" @click="reduceMum">
                <img src="/static/images/icon-reduse.png" alt />
              </div>
              <div class="buyNum">{{days}}</div>
              <div class="addNum" @click="addNum">
                <img src="/static/images/icon-add.png" alt />
              </div>
            </div>
          </div>
          <!-- 可选项 -->
          <section class="selColor">
            <div class="selColor-top">团员可选择颜色</div>
            <div class="selColor-content">
              <scroll-view scroll-x class="font-color-scroll">
                <div class="font-list">
                  <div v-for="(item,index) in fontColor" :key="index">
                    <view
                      :style="{background: item.color}"
                      :class="'font-color-li ' + (item.color === '#FFFFFF' || item.color === '#ffffff' ? 'selected' : '')"
                      @click="() => onFontColorClick(index,item)"
                    >
                      <img
                        v-if="item.selected && (item.color === '#FFFFFF' || item.color === '#ffffff') "
                        src="../../../static/images/diy-color-selected-white.png"
                        class="font-color-selected"
                      />
                      <img
                        v-else-if="item.selected"
                        src="../../../static/images/diy-color-selected.png"
                        class="font-color-selected"
                      />
                    </view>
                  </div>
                </div>
              </scroll-view>
            </div>
            <div class="canDiy">
              <span>团员可diy</span>
              <switch color="#FF5100" :checked="isDiy" @change="diyChange" />
            </div>
            <div class="canDiy" v-if="isDiy">
              <span>团员可使用文字</span>
              <switch color="#FF5100" :checked="isFont" @change="fontChange" />
            </div>
            <div class="canDiy" v-if="isDiy">
              <span>团员可上传图片</span>
              <switch color="#FF5100" :checked="isPic" @change="picChange" />
            </div>
            <div class="generate" @click="onClick">生成模板</div>
          </section>
        </section>

        <canvasImage
          ref="canvasImage"
          :elements="elements"
          :baseData="baseData"
          :materialData="materialData"
          :color="color"
        />
      </section>
    </section>
    <div class="mask2" v-if="showSku" @click="onClose"></div>
    <div v-if="showSku" class="showSku">
      <div class="close" @click="onClose">+</div>
      <section class="select-box" v-for="(option,index) in baseData.specList" :key="index">
        <h3>{{option.goodsSpecName}}</h3>
        <ul class="select">
          <li
            v-for="(value,i) in option.goodsSkuSpecVals"
            @click="() => value.disabled || onLiClick(value,index)"
            :key="i"
            :class="(value.selected ? 'selected ' : '')+(value.disabled ? ' disabled':'')"
          >{{value.goodsSkuSpecValName}}</li>
        </ul>
      </section>
      <!-- 团长修改模板时 -->
      <div class="confirm editbtn" @click="editGroup" v-if="groupDiyId">确定</div>

      <!-- 普通进行团队定制时 -->
      <div class="confirm" @click="confirmGenerate" v-else>确定</div>
    </div>
  </div>
</template>
<script>
import canvasImage from "./canvasImage.vue";
import { uploadImg } from "./utils.js";
import { toast } from "@/utils/index";
import {
  BaseMaterialStock,
  addWorks,
  groupTemplate,
  groupModify
} from "@/api/api";
export default {
  components: {
    canvasImage
  },
  props: {
    elements: Array,
    baseData: Object,
    materialData: Object,
    color: String,
    visible: Boolean,
    onHide: Function,
    onComplete: Function,
    designerId: String,
    groupDiyId: String,
    colorId: String,
    fontColor: Array,
    colorSpec: Object
  },

  data() {
    return {
      showVisible: false,
      visibleMask: false, //生成模板蒙城
      showSku: false,
      isDiy: true,
      isPic: true,
      isFont: true,
      days: 1,
      orderImage: "",
      curentSkuId: [],
      price: this.baseData.baseMaterialPrice,
      allMaterialPrice: (0).toFixed(2),
      colorSelected: 0
      // fontColor: []
    };
  },
  mounted() {
    // let colors = this.baseData.baseColorSpec;
    // let fontColor = [];
    // for (let i = 0; i < colors.length; i++) {
    //   fontColor.push({ color: colors[i].name, selected: false });
    // }
    // this.fontColor = fontColor;
  },
  onShow() {
    this.showSku = false;
  },
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
    }
  },
  methods: {
    triggerLiClick() {
      this.curentSkuId = [];
      let clickValue;
      let index = this.baseData.specList.findIndex(value => {
        clickValue = value.goodsSkuSpecVals.find(
          value => value.id === this.colorSpec.specColorId
        );

        return clickValue;
      });

      this.onLiClick(clickValue, index);
    },
    //团员可选颜色
    onFontColorClick(index, item) {
      const selected = !item.selected;

      if (!selected && item.color === this.color) {
        wx.showToast({
          title: "已经选择颜色禁止取消",
          icon: "none",
          duration: 2000
        });
        return;
      }

      item.selected = selected;
    },

    selColors(index) {
      this.doodlingColorSelected = index;
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

      return !idList.find(element => !ids.find(value => value === element));
    },

    idsEqualToIdList(ids, idList) {
      ids = [...ids].map(value => parseInt(value)).sort();
      idList = [...idList].map(value => parseInt(value)).sort();
      return ids.every((element, index) => idList[index] === element);
    },
    onClose() {
      this.orderImage = "";
      this.onHide();
      this.showSku = false;
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

    setDisabled() {
      const { curentSkuId, baseData } = this;
      let specList = [...baseData.specList];
      for (const index in specList) {
        const element = specList[index];
        for (const key in element.goodsSkuSpecVals) {
          const value = element.goodsSkuSpecVals[key];
          value.selected = this.isSelected(value);
          value.disabled = this.isDisabled(value, index);
          // value.disabled = this.isHide(value, index);
        }
      }
      baseData.specList = specList;
    },
    isSelected(value) {
      const { curentSkuId } = this;

      // 颜色联动
      if (this.colorSpec.specColorId === value.id) {
        return true;
      }

      return curentSkuId.includes(value.id);
    },
    isDisabled(item, index) {
      const { enabledList, curentSkuId } = this;
      const currentIds = [...curentSkuId];
      currentIds[index] = item.id;

      // 颜色联动
      if (
        this.baseData.specList[index].goodsSkuSpecVals.find(
          value => this.colorSpec.specColorId === value.id
        )
      ) {
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

    async setImage() {
      this.orderImage = await this.$refs.canvasImage.getImage();
    },
    reduceMum() {
      let days = this.days;
      days--;
      if (days <= 1) {
        days = 1;
      }
      this.days = days;
    },
    addNum() {
      let days = this.days;
      days++;
      this.days = days;
    },
    diyChange(e) {
      this.isDiy = e.mp.detail.value;
      if (!this.isDiy) {
        this.isFont = false;
        this.isPic = false;
      }
    },
    fontChange(e) {
      this.isFont = e.mp.detail.value;
    },
    picChange(e) {
      this.isPic = e.mp.detail.value;
    },

    async onClick() {
      let fontColor = this.fontColor;
      let selColors = fontColor.filter(ele => {
        return ele.selected;
      });
      if (selColors.length <= 0) {
        toast("请选择团员可以使用的颜色");
        return;
      }
      // this.onHide();
      // this.showSku = true;
      if (this.groupDiyId) {
        this.editGroup();
      } else {
        this.confirmGenerate();
      }
    },

    //团长修改模板
    async editGroup() {
      if (this.orderImage === "") {
        wx.showToast({
          title: "定制生成中请稍等",
          icon: "none"
        });
        return true;
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      console.log("修改模板");
      let logo = await uploadImg(this.orderImage);
      let options = [];
      this.baseData.specList.forEach(value =>
        value.goodsSkuSpecVals.forEach(value => {
          value.selected && options.push(value);
        })
      );

      try {
        let diyInfoList = [];
        let materialIdList = [];
        this.elements[0].forEach(value => {
          let scale = value.width / value.realWidth;
          if (value.type === "material") {
            materialIdList.push(value.materialId);
          }
          diyInfoList.push(
            this.getMaterial({
              ...value,
              isFront: true,
              isTemplate: true,
              scale
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
              scale
            })
          );
        });

        let id = this.baseData.id;
        let goodsNum = 1;
        // let { id: skuId, goodsSkuRetailPrice } = this.findSkuObj(
        //   this.curentSkuId
        // );
        let orderAmount = this.getPrice();

        let diyConfig = {
          id: this.groupDiyId,
          validDay: this.days,
          logo: logo,
          isDiy: this.isDiy,
          isPic: this.isPic,
          isFont: this.isFont,
          baseId: this.baseData.id,
          // skuId: skuId,
          colorId: this.colorId
        };
        // 生成模板参数
        let teamParams = {
          diyInfoList,
          diyConfig
        };
        this.showSku = false;

        groupModify(teamParams).then(res => {
          wx.hideLoading();
          if (!res.data.code) {
            let groupDiyId = wx.getStorageSync("groupDiyId");
            this.$store.dispatch("getGroupOrderInfo", { groupDiyId });
            wx.navigateBack();
          } else {
            toast(res.data.msg);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    //确定生成模板
    async confirmGenerate() {
      const token = wx.getStorageSync("token");
      console.log("token", token);
      if (!token) {
        let url = "/pages/authorization/main";
        wx.navigateTo({ url });
        return;
      }
      if (this.orderImage === "") {
        wx.showToast({
          title: "定制生成中请稍等",
          icon: "none"
        });
        return true;
      }

      wx.showLoading({
        title: "加载中"
      });
      console.log("生成模板");

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
            this.getMaterial({
              ...value,
              isFront: true,
              isTemplate: true,
              scale
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
              scale
            })
          );
        });

        let id = this.baseData.id;
        let goodsNum = 1;

        // let { id: skuId, goodsSkuRetailPrice } = this.findSkuObj(
        //   this.curentSkuId
        // );
        // let orderAmount = this.getPrice();
        let fontColor = this.fontColor;
        let selColors = fontColor.filter(ele => {
          return ele.selected;
        });
        if (selColors.length <= 0) {
          toast("请选择团员可以使用的颜色");
          return;
        }
        let colors = [];
        for (let i = 0; i < selColors.length; i++) {
          colors.push(selColors[i].color);
        }
        let color = colors.join(",");

        let colorId = this.colorId;

        let diyConfig = {
          validDay: this.days,
          logo: logo,
          isDiy: this.isDiy,
          isPic: this.isPic,
          isFont: this.isFont,
          baseId: this.baseData.id,
          // skuId: skuId,
          color: color,
          colorId
        };
        // 生成模板参数
        let teamParams = {
          diyInfoList,
          diyConfig
        };
        this.showSku = false;
        groupTemplate(teamParams).then(res => {
          wx.hideLoading();
          if (!res.data.code) {
            this.changeDiyInfo(res.data, wx.getStorageSync("userInfo").id);
          } else {
            toast(res.data.msg);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    changeDiyInfo(groupDiyId, userId) {
      wx.setStorageSync("groupDiyId", groupDiyId);
      let url = `/pages/diy/main?groupDiyId=${groupDiyId}&userId=${userId}&isJoin=1&type=0&isEdit=1&isShowBtn=0&jupmToTeamOrder=jupmToTeamOrder&personDiy=personDiy`;
      wx.redirectTo({ url });
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
  opacity: 0;
  transition: opacity 0.4s;
  &.visible {
    left: 0;
    opacity: 1;
  }
}
.showSku {
  position: fixed;
  z-index: 100000;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  transition: bottom 0.4s;
  .confirm {
    width: 345px;
    height: 40px;
    margin: 20px auto;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(
      90deg,
      rgba(254, 121, 0, 1) 0%,
      rgba(255, 81, 0, 1) 100%
    );
    border-radius: 20px;
  }
}

.mask {
  background: rgb(0, 0, 0);
  opacity: 0;
  transition: opacity 0.4s;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: -30px;

  &.visible {
    opacity: 0.4;
  }
}
.mask2 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  transition: opacity 0.4s;
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
.sku-box {
  box-sizing: border-box;
  position: absolute;
  left: 100%;
  bottom: 0;
  padding-bottom: 8px;
  width: 100%;
  background-color: white;
  transition: bottom 0.4s;
  &.visible {
    left: 0;
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

  .selected {
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
  // margin: 23px 0;
  margin-bottom: 20px;
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
    margin-bottom: 10px;
    padding-left: 15px;
    .font-list {
      display: flex;
      .font-color-li {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin-right: 20px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        &.selected {
          border: 2px solid #d6d6d6;
        }
      }
      .font-color-selected {
        width: 22px;
        height: 22px;
      }
    }
  }
  .canDiy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px 15px 15px;
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
