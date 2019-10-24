<template>
  <div class="page" @click="onPageClick">
    <div class="diy-box">
      <section class="diy-content">
        <diy
          ref="diy"
          :diyType="diyType"
          :isChange="isChange"
          :onRotateTouchmove="()=> this.setQuality()"
          :onElementSelectedChange="onElementSelectedChange"
          :elementSelected="elementSelected"
          :data="diyData"
          :isDiy="isDiy"
        />

        <div class="diy-person-rules" v-if="personDiy">
          <span>请进行您的个人diy定制</span>
        </div>

        <div class="diy-team-rules" v-if="diyType == 1" @click="teamRule">
          <div class="diy-quality-question"></div>
          <span>团队定制规则</span>
        </div>

        <div v-if="elementSelected !== null" class="diy-quality" @click="checkQuality">
          <div class="diy-quality-question"></div>
          <span>预判：</span>
          <quality :qualitySelect="new Array(quality)" :qualityUnSelect="new Array(5 - quality)" />
        </div>

        <div class="diy-edit" v-if="isDiy">
          <div v-if="editVisible && changeColorsVisible" class="diy-edit-content">
            <selectColor
              :isVertical="true"
              :selectedIndex="changeSelected"
              :onSelectedIndexChange="onSelectedIndexChange"
              :colors="changeColors"
            />
          </div>

          <ul v-else-if="editVisible" class="diy-edit-content">
            <li @click="onColorChangeClick">
              <i class="diy-edit-icon icon-color" />
              换颜色
            </li>

            <li @click="onReversalClick">
              <i class="diy-edit-icon icon-transform" />
              翻转
            </li>
            <li @click="changeBase" v-if="isChangeBase">
              <i class="diy-edit-icon icon-change" />
              换基材
            </li>
            <li @click="onDetailsClick">
              <i class="diy-edit-icon icon-details" />
              详情
            </li>
          </ul>
          <div @click="onEditVisibleChange" class="edit-icon"></div>
        </div>
      </section>
      <section class="diy-tools" v-if="isDiy" :style="isDiy ? 'padding-bottom:0;': '' ">
        <div class="diy-layer">
          <div
            v-for="(value,index) in diyData.elements"
            :key="index"
            @click.stop="() => onElementSelectedChange(value.id)"
            :class="'diy-layer-item ' + (elementSelected === value.id ? 'selected':'' )"
          >
            <span v-if="value.type === 'material'">素</span>
            <span v-else-if="value.type === 'text'">文</span>
            <span v-else-if="value.type === 'image'">图</span>
            <span v-else-if="value.type === 'doodling'">涂</span>
          </div>
        </div>
      </section>
      <div class="diy-completeBtn">
        <button @click="()=>!isLoading && onComplete()" class="button-yellow diy-complete">完成定制</button>
      </div>
      <div @click="addVisible = false" :class="'diy-mask ' + (addVisible ? 'visible':'')"></div>
      <!-- 添加素材 -->
      <section class="diy-add">
        <div :class="'diy-add-content ' + (addVisible ? 'visible':'')">
          <ul class="diy-add-nav" v-if="isDiy">
            <!-- <li
                            v-for="(value,index) in addNav"
                            :class="index === addSelected ? 'selected': ''"
                            :key="index"
                            @click="() => onAddNavClick(index)"
            >{{value}}</li>-->
            <!-- "素材", "图片", "文字", "涂鸦", "模板" -->
            <li :class="addSelected == 0 ? 'selected': ''" @click="() => onAddNavClick(0)">素材</li>
            <li
              v-if="isPic"
              :class="addSelected == 1 ? 'selected': ''"
              @click="() => onAddNavClick(1)"
            >图片</li>
            <li
              v-if="isFont"
              :class="addSelected == 2 ? 'selected': ''"
              @click="() => onAddNavClick(2)"
            >文字</li>
            <li :class="addSelected == 3 ? 'selected': ''" @click="() => onAddNavClick(3)">涂鸦</li>
            <li
              :class="addSelected == 4 ? 'selected': ''"
              @click="() => onAddNavClick(4)"
              v-if="canUsetemplate"
            >模板</li>
          </ul>
          <!-- 素材 -->
          <div :class="(addSelected === 0 && addVisible) ? 'add-content' : 'material-hide'">
            <material
              :diyData="diyData"
              :designerId="designerId"
              :onMaterialClick="onAdd"
              :materialNav="materialNav"
              :materialData="materialData"
              :isJoin="isJoin"
              ref="material"
            />
          </div>
          <!-- 图片 -->
          <section v-if="addSelected === 1 && addVisible" class="add-content add-image">
            <upload :diyData="diyData" :onClick="onAdd" />
            <div
              style="padding:30px;color:#ff5100;font-size:12px;margin-bottom:40px;"
            >版权声明：使用的DIY图片需为自有或者获得版权拥有者授权，并遵循国家相关法律、法规之规定。如因非法使用引起纠纷，一切后果由使用者承担</div>
          </section>

          <!-- 文字 -->
          <section :class="(addSelected === 2 && addVisible) ? 'add-content' : 'material-hide'">
            <font :diyData="diyData" :onFontAdd="onAdd" />
          </section>

          <!-- 涂鸦 -->
          <section v-if="addSelected === 3 && addVisible" class="add-content add-doodling">
            <doodling :diyData="diyData" :onDoodlingAdd="onAdd" />
          </section>

          <!-- 模板 -->
          <section :class="(addSelected === 4 && addVisible) ? 'add-content' : 'material-hide'">
            <templates ref="templates" :id="id" :onTemplatesAdd="onTemplatesAdd" />
          </section>
        </div>
      </section>
    </div>
    <clothes
      :visible="clothesVisible"
      :onClick="onClothesClick"
      :onHide="()=> clothesVisible = false"
    />
    <complete
      v-if="baseData && diyType==0"
      ref="complete"
      :designerId="designerId"
      :groupDiyId="groupDiyId"
      :isEdit="isEdit"
      :userId="userId"
      :isJoin="isJoin"
      :isShowBtn="isShowBtn"
      :remark="remark"
      :color="changeColors[changeSelected]"
      :baseData="baseData"
      :elements="elements"
      :visible="completeVisible"
      :onHide="()=> completeVisible = false"
      :colorId="getColorId"
      :colorSpec="getColorSpec"
      :onComplete="onDiyComplete"
      :joinToTeam="joinToTeam"
      :jupmToTeamOrder="jupmToTeamOrder"
    />
    <TeamComplete
      v-if="baseData && diyType==1 "
      ref="complete"
      :groupDiyId="groupDiyId"
      :color="changeColors[changeSelected]"
      :baseData="baseData"
      :elements="elements"
      :visible="completeVisible"
      :onHide="()=> completeVisible = false"
      :onComplete="onDiyComplete"
      :colorId="getColorId"
      :colorSpec="getColorSpec"
      :fontColor="fontColor"
    />
  </div>
</template>
<script>
import tabBar from "@/components/tabBar";
import diy from "./diy/index";
import { guid, toast } from "../../utils/index";
import doodling from "./doodling.vue";
import quality from "./quality.vue";
import material from "./material.vue";
import clothes from "./clothes.vue";
import templates from "./templates.vue";
import upload from "./upload.vue";
import complete from "./complete.vue";
import TeamComplete from "./TeamComplete.vue";
import selectColor from "./selectColor.vue";
import { get, join, editUserDiyInfo, getUserInfo } from "@/api/api";
import font from "./font.vue";
import { uploadImg, getImageIntro } from "./utils.js";
import { async } from "q";

let initData = {
  id: "1",
  editVisible: false,
  addVisible: false,
  clothesVisible: false,
  completeVisible: false,
  changeColorsVisible: false,
  quality: 0,
  isShowBtn: 0,
  addSelected: 0,
  addNav: ["素材", "图片", "文字", "涂鸦", "模板"],
  canSelColors: [], //基材全部颜色
  changeSelected: 0,
  changeColors: [],
  colors: null,
  personDiy: false,
  materiallPushing: false,
  jupmToTeamOrder: "",
  elementSelected: null,
  diyData: {
    // 位置
    // 整体高宽
    width: 300,
    height: 350,
    x: 0,
    y: 0,
    // 背景图 衣服
    backgroundImage: "",
    // diy区域
    diyRegion: {
      left: 80,
      top: 76,
      width: 140,
      height: 200,
      backgroundImage: ""
    },
    // diy内容
    elements: []
  },

  elements: [[], []], //正反面
  fontColor: [],
  baseData: null, // 基材
  isFront: true,
  isChangeBase: true, //是否可换基材
  createData: null,
  materialData: [],
  isPic: true, //是否可用图片
  isFont: true, // 是否可用文字
  isDiy: true, //是否可diy
  groupInfo: {}, //团员配置信息
  remark: "", //团员定制备注
  isJoin: "",
  groupDiyId: "", //团长修改模板是的id
  diyType: "", //定制类型 person个人定制 team团队定制
  designerId: "", //设计师id
  isEdit: "", //团长修改团员diy内容
  userId: "", //团长修改的成员id
  colorId: null,
  canUsetemplate: true,
  isLoading: true,
  joinToTeam: ""
};
export default {
  components: {
    tabBar,
    doodling,
    quality,
    font,
    material,
    clothes,
    templates,
    complete,
    upload,
    selectColor,
    diy,
    TeamComplete
  },
  data() {
    return {
      ...initData
    };
  },
  onShareAppMessage(res) {
    return {
      // 强烈推荐+商品标题名称+商品主图。
      title: `和我一起来DIY`,
      path: "/pages/diy/main?type=" + 0 + "&isShowBtn=1"
    };
  },

  onLoad() {
    Object.assign(this.$data, JSON.parse(JSON.stringify(initData)));
  },

  async mounted() {
    wx.hideTabBar();
    this.$refs.material.getLabel();
    this.$refs.templates.getData();
    let param = this.$mp.query;
    if (param.isJoin) {
      // 加入团队标识
      this.isJoin = param.isJoin;
    }
    if (param.isEdit) {
      //查看团员配置信息
      this.isEdit = param.isEdit;
      this.userId = param.userId;
      await this.showModelData();
    }
    if (param.materialId) {
      this.addMaterial(param.materialId);
    }
    if (param.isShowBtn) {
      this.isShowBtn = param.isShowBtn;
    }
    if (param.designerId) {
      //设计师id
      this.designerId = param.designerId;
    }
    if (param.type) {
      //定制类型 0个人 1团队
      this.diyType = param.type;
    }
    if (param.groupDiyId) {
      //团队模板id
      this.groupDiyId = param.groupDiyId;
    }
    if (param.remark) {
      // 加入团队备注
      this.remark = param.remark;
    }

    if (param.joinToTeam) {
      // 加入团队
      this.joinToTeam = param.joinToTeam;
    }

    if (param.jupmToTeamOrder) {
      this.jupmToTeamOrder = param.jupmToTeamOrder;
    }

    if (param.personDiy) {
      this.personDiy = param.personDiy;
    }

    await this.getBase(this.id);

    //  if(this.$mp.query.joinTeam) {
    //       this.changeColors = wx.getStorageSync("changeColors")
    //   }
  },

  computed: {
    getColorId() {
      if (this.baseData) {
        let { baseColorSpec } = this.baseData;
        let colorSpec = this.baseData.baseColorSpec.find(
          value =>
            value.name.toUpperCase() === this.changeColors[this.changeSelected].toUpperCase()
        );
        return colorSpec ? colorSpec.id : "";
      } else {
        return "";
      }
    },
    getColorSpec() {
      if (this.baseData) {
        let { baseColorSpec } = this.baseData;
        let colorSpec = this.baseData.baseColorSpec.find(
          value =>
            value.name.toUpperCase() === this.changeColors[this.changeSelected].toUpperCase()
        );
        return colorSpec ? colorSpec : {};
      } else {
        return {};
      }
    }
  },

  onUnload() {
    this.clearDiyData();
  },

  methods: {
    clearDiyData() {
      this.diyData.elements = [];
      this.elements = [[], []];
    },
    onClothesClick(id) {
      this.clothesVisible = false;

      this.getBase(id, true);
    },

    //换基材
    changeBase() {
      this.clothesVisible = true;
      this.changeSelected = 0;
    },

    //团队定制规则
    teamRule() {
      let url = "/pages/teamRules/main";
      wx.navigateTo({ url });
    },

    async addMaterial(id) {
      let { data } = await get("goods/material/" + id);
      console.log("应用素材", data);
      wx.getImageInfo({
        src: data.logo,
        success: res => {
          this.onAdd({
            materialId: data.materialId,
            type: "material",
            value: data.logo,
            width: this.diyData.diyRegion.width,
            price: data.price,
            content: data.name,
            height: res.height / res.width * this.diyData.diyRegion.width,
            angle: 0,
            left: 0,
            top: 0
          });
        }
      });
    },

    async getBase(id, rest) {
      try {
        wx.showLoading({
          title: "加载中",
          mask: true
        });
        let { data } = await get("diy/base/" + id);
        if (!data.code) {
          this.baseData = data;
          this.initBase(rest);
        } else {
          toast(data.msg);
        }

        this.isLoading = false;
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
      }
    },

    initBase(rest) {
      let { baseColorSpec } = this.baseData;
      // this.changeSelected = 0;
      this.changeColors = baseColorSpec.map(value => value.name);

      if (this.colors !== null && parseInt(this.$mp.query.type) === 0) {
        this.changeColors = this.colors.split(",");
      }

      this.canSelColors = baseColorSpec.map(value => value.name);
      this.diyData.elements = this.isFront
        ? this.elements[0]
        : this.elements[1];
      let fontColor = [];

      for (let i = 0; i < baseColorSpec.length; i++) {
        fontColor.push({ color: baseColorSpec[i].name, selected: true });
      }
      this.fontColor = fontColor;

      this.setDiyData();

      if (this.colorId) {
        let color = this.baseData.baseColorSpec
          .find(value => value.id === this.colorId)
          .name.toUpperCase();
        this.onSelectedIndexChange(
          this.changeColors.findIndex(value => value.toUpperCase() === color)
        );
      }

      if (rest) {
        // 清空素材样式
        let { diyRegion } = this.diyData;
        [...this.elements[0], ...this.elements[1]].map(value => {
          value.height = diyRegion.width / value.width * value.height;
          value.width = diyRegion.width;
          value.left = 0;
          value.top = 0;
          value.angle = 0;
        });
      }
    },
    //修改团员数据和修改模板时 数据回显
    showModelData() {
      let groupDiyId = this.$mp.query.groupDiyId;
      let userId = this.$mp.query.userId;
      let _this = this;
      return editUserDiyInfo({ userId, groupDiyId }).then(res => {
        console.log("res", res.data.groupDiyInfoList[0]);

        if (!res.data.code) {
          this.groupInfo = res.data;
          let isLeader = res.data.isLeader;
          console.log("isLeader", isLeader);
          if (parseInt(this.$mp.query.type) === 0) {
            this.isChangeBase = false;
            this.canUsetemplate = false; //不能使用模板
          }

          if (this.$mp.query.joinTeam) {
            //如果来自团员加入
            this.isChangeBase = false; //不能更换基材
            this.canUsetemplate = false; //不能使用模板
            this.changeColors = res.data.color.split(","); //团员可选颜色
            //  wx.setStorageSync("changeColors", this.changeColors)
          } else {
            this.changeColors = this.canSelColors; //如果是团长
            console.log("canSelColors", this.changeColors);

            //  if(parseInt(this.$mp.query.type) !== 0) {
            //   res.data.groupDiyInfoList.forEach(element => {
            //    element.isTemplate = false;
            //  });
            // }
          }
          this.isDiy = res.data.isDiy;
          this.isPic = res.data.isPic;
          this.isFont = res.data.isFont;
          if (parseInt(this.$mp.query.type) !== 0) {
            //如果是修改模板
            this.isDiy = true;
            this.isPic = true;
            this.isFont = true;
          }

          this.id = res.data.baseId;
          this.colorId = res.data.colorId;
          this.colors = res.data.color;
          this.materialData = res.data.groupDiyInfoList;
          try {
            this.setReal().then(() => {
              console.log("qqqqqqqqqqq",this.materialData);
              this.setElements();
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          toast(res.data.msg);
        }
      });
    },

    setReal() {
      return Promise.all(
        this.materialData.map(value => {
          return getImageIntro(value.img).then(
            ({ ImageWidth, ImageHeight }) => {
              value.realWidth = Number(ImageWidth.value);
              value.realHeight = Number(ImageHeight.value);
            }
          );
        })
      );
    },

    setDiyData() {
      let { baseColorSpec, baseConfig, baseDiyConfig } = this.baseData;
      let { diyData, isFront } = this;

      let baseColor = baseColorSpec.find(
        value => value.name === this.changeColors[this.changeSelected]
      );

      console.log("this.isFront", this.isFront);
      if (isFront) {
        diyData.backgroundImage = baseColor.frontImg;
      } else {
        diyData.backgroundImage = baseColor.backImg;
      }
      let baseConfigFind = baseConfig.find(value => isFront === value.isFront);
      diyData.width = baseConfigFind.width;
      diyData.height = baseConfigFind.height;
      diyData.x = baseConfigFind.xaxes;
      diyData.y = baseConfigFind.yaxes;

      let { diyRegion } = diyData;
      let baseDiyConfigFind = baseDiyConfig.find(
        value => isFront === value.isFront
      );
      diyRegion.width = baseDiyConfigFind.width;
      diyRegion.height = baseDiyConfigFind.height;
      diyRegion.left = baseDiyConfigFind.xaxes;
      diyRegion.top = baseDiyConfigFind.yaxes;
      diyRegion.backgroundImage = baseColor.shadeImg;
    },

    setElements() {
      console.log("???", this.elements[0]);
      this.elements = [
        this.materialData
          .filter(value => value.isFront === true)
          .map(value => this.getElement(value)),
        this.materialData
          .filter(value => value.isFront === false)
          .map(value => this.getElement(value))
      ];
      if (this.isFront) {
        this.diyData.elements = this.elements[0];
      } else {
        this.diyData.elements = this.elements[1];
      }
    },

    getElement({
      materialId,
      materialLogo,
      img,
      width,
      height,
      xaxes,
      yaxes,
      price,
      isTemplate,
      materialPrice,
      realWidth,
      realHeight,
      angle = 0
    }) {
      return {
        id: guid(),
        type: "material",
        materialId,
        value: materialLogo || img,
        price: price === undefined ? materialPrice : price,
        angle,
        width,
        height,
        isTemplate,
        realWidth,
        realHeight,
        left: xaxes,
        top: yaxes
      };
    },

    onComplete() {
      this.completeVisible = true;
      this.$refs.complete.setImage();
    },

    onColorChangeClick() {
      this.changeColorsVisible = true;
    },

    onReversalClick() {
      this.isFront = !this.isFront;

      if (this.isFront) {
        this.elements[1] = this.diyData.elements;
        this.diyData.elements = this.elements[0];
      } else {
        this.elements[0] = this.diyData.elements;
        this.diyData.elements = this.elements[1];
      }
      this.setDiyData();
    },

    async onDetailsClick() {
      wx.showLoading({
        title: "加载中",
        mask: true
      });

      try {
        // let { data } = await get("/rich_text", {
        //     id: this.baseData.id
        // });
        // let content = this.baseData.content.replace(new RegExp('<a href=\\','g'), '<a href=')
        let content = this.baseData.content;
        wx.setStorageSync("diyContent", content);
        console.log("content", content);
        wx.navigateTo({
          url: `/pages/richText/main?title=DIY基材详情`
        });
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
      }
    },

    onEditVisibleChange() {
      this.changeColorsVisible = false;
      this.editVisible = !this.editVisible;
    },

    onAddNavClick(index) {
      this.addSelected = index;
      this.addVisible = true;
    },

    onAdd(element) {
      this.diyData.elements.push({
        id: guid(),
        ...element
      });

      this.addVisible = false;
    },

    onTemplatesAdd(materialData) {
      this.materialData = materialData;
      this.addVisible = false;
      this.setElements();
    },

    onPageClick() {
      this.elementSelected = null;
    },

    onElementSelectedChange(id) {
      this.elementSelected = id;
      try {
        this.setQuality(id);
      } catch (error) {
        console.log(error);
      }
    },

    checkQuality() {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content:
          "预判效果即为DIY添加文字/素材等后打印效果的判断。温馨提示：效果预判低于3点时不建议打印"
      });
    },

    async setQuality(id = this.elementSelected) {
      let { baseDiyConfig } = this.baseData;
      let { actualWidth, actualHeight, width, height } = baseDiyConfig.find(
        value => value.isFront === this.isFront
      );

      let elements = this.isFront ? this.elements[0] : this.elements[1];
      let material = elements.find(value => value.id === id);

      let mw;
      let mh;
      if (material.realWidth === undefined) {
        let imageRes = await this.getImageInfo(material.value);
        mw = imageRes.width;
        mh = imageRes.height;
      } else {
        mw = material.realWidth;
        mh = material.realHeight;
      }

      console.log("mw", material);
      console.log("mw", mw);
      console.log("mh", mh);
      let tw = actualWidth;
      let th = actualHeight;
      let dw = width;
      let dh = height;
      let sw = material.width;
      let sh = material.height;
      let s1 = tw / (dw / sw);
      let s2 = th / (dh / sh);
      let wQuality = mw / 110 / s1;
      let hQuality = mh / 110 / s2;
      let quality = wQuality > hQuality ? hQuality : wQuality;

      if (quality > 0.9) {
        quality = 5;
      } else if (quality > 0.8) {
        quality = 4;
      } else if (quality > 0.7) {
        quality = 3;
      } else if (quality > 0.65) {
        quality = 2;
      } else {
        quality = 1;
      }

      this.quality = quality;
    },

    getImageInfo(src) {
      return new Promise(reslove => {
        wx.getImageInfo({
          src,
          success: function(res) {
            reslove(res);
          }
        });
      });
    },

    onDiyComplete() {
      this.completeVisible = false;
    },

    onSelectedIndexChange(index) {
      this.editVisible = false;
      this.changeSelected = index;
      this.changeColorsVisible = false;

      this.setDiyData();
    }
  }
};
</script>

<style lang='less' scoped>
.page {
  height: 100%;
  background-color: white;
  overflow: hidden;
}

.diy-box {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.diy-content {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  overflow: hidden;
}
.diy-tools {
  border-top: 0.5px solid rgb(239, 239, 239);
  padding-bottom: 74px;
}
.diy-completeBtn {
  padding-bottom: 74px;
}
.diy-layer {
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.diy-layer-item {
  margin: 0 10px;
  border: 2px solid #d6d6d6;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  box-sizing: border-box;
  line-height: 24px;
  font-size: 14px;
  color: #9b9b9b;
  text-align: center;

  &.selected {
    border-color: #ff5100;
    color: #ff5100;
  }
}

.diy-complete {
  margin: 0 15px;
}

.diy-quality {
  position: absolute;
  left: 0px;
  width: 100%;
  bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  font-size: 11px;
}

.diy-quality-question {
  margin-right: 6px;
  width: 16px;
  height: 16px;
  background-image: url(../../../static/images/question.png);
  background-size: 100% 100%;
}

.diy-edit {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 46px;

  .diy-edit-content {
    box-sizing: border-box;
    border: 1px solid #d6d6d6;
    background-color: white;
    font-size: 11px;
    color: #4a4a4a;
    border-radius: 23px;
    padding-bottom: 33px;
    padding-top: 16px;
  }

  li {
    display: flex;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .diy-edit-icon {
    display: block;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
  }

  .edit-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 46px;
    height: 46px;
    background-image: url(../../../static/images/diy-edit-icon.png);
    background-size: 100% 100%;
  }

  .edit-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 46px;
    height: 46px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1px solid #d6d6d6;
    background-color: white;
    font-size: 11px;
    color: #4a4a4a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .icon-color {
    background-image: url(../../../static/images/diy-edit-color-icon.png);
  }

  .icon-transform {
    background-image: url(../../../static/images/diy-edit-transform-icon.png);
  }
  .icon-change {
    background-image: url(../../../static/images/diy-edit-change-icon.png);
  }

  .icon-details {
    background-image: url(../../../static/images/diy-edit-details-icon.png);
  }

  .icon-pen {
    background-image: url(../../../static/images/diy-edit-pen-icon.png);
  }
}

.diy-team-rules {
  position: absolute;
  top: 24px;
  right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  font-size: 12px;
  color: #4a4a4a;
}

.diy-person-rules {
  position: absolute;
  top: 24px;
  left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  font-size: 12px;
  color: #4a4a4a;
}

.diy-material-nav {
  display: flex;
  padding-left: 30px;

  li {
    line-height: 40px;
    font-size: 15px;
    color: #4a4a4a;
    margin-right: 34px;
    white-space: nowrap;
  }

  .selected {
    color: #ff5100;
  }
}

.diy-mask {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 100;

  &.visible {
    top: 0;
    opacity: 0.3;
  }
}

.diy-add {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 100;

  .add-content {
    height: 460px;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }

  .diy-add-content {
    display: flex;
    flex-direction: column;
    height: 55px;
    &.visible {
      transition: height 0.4s;
      height: 515px;
    }
  }

  .diy-add-nav {
    display: flex;
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.05);
    height: 54px;
    justify-content: space-between;
    padding: 0 15px;
    line-height: 54px;
    font-size: 15px;
    color: #090203;
    background-color: white;

    li {
      padding: 0 10px;
    }

    .selected {
      color: #ff5100;
      border-bottom: 2px solid #ff5100;
    }
  }
}

.material-hide {
  height: 0;
  overflow: hidden;
}

.add-image {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

.button-yellow {
  box-sizing: border-box;
  background: linear-gradient(#fe7900, #ff5100);
  font-size: 16px;
  color: white;
  border-radius: 20px;
  border: none;
  height: 40px;
  line-height: 40px;
}

.select-color {
  box-sizing: border-box;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;

  .font-color-selected {
    width: 13px;
    height: 13px;
  }
}
</style>


