<template>
  <div class="add-font">
    <h3>选字体</h3>
    <scroll-view scroll-x class="font-list-scroll">
      <div class="font-list">
        <div v-for="(font,index) in fontList" :key="index">
          <view
            :class="'font-list-li ' + (fontSelected === index * 2 ? 'selected' : '')"
            @click="() => onFontFamilyClick(index * 2)"
          >
            <img :src="font[0].img" />
          </view>
          <view
            v-if="font[1]"
            :class="'font-list-li ' + (fontSelected === index * 2 + 1? 'selected' : '')"
            @click="() => onFontFamilyClick(index * 2 + 1)"
          >
            <img :src="font[1].img" />
          </view>
        </div>
      </div>
    </scroll-view>
    <h3 class="color-h3">选颜色</h3>
    <scroll-view scroll-x class="font-color-scroll">
      <div class="font-list">
        <div v-for="(color,index) in fontColor" :key="index">
          <view
            :style="{backgroundColor: color}"
            :class="'font-color-li ' + (color === '#fbfbfb' ? 'selected' : '')"
            @click="() => onFontColorClick(index)"
          >
            <img
              v-if="index === colorSelected && color === '#fbfbfb'"
              src="../../../static/images/diy-color-selected-white.png"
              class="font-color-selected"
            />
            <img
              v-else-if="index === colorSelected"
              src="../../../static/images/diy-color-selected.png"
              class="font-color-selected"
            />
          </view>
        </div>
      </div>
    </scroll-view>
    <div class="font-input-box" @click="onFontInputClick">
      <input
        type="text"
        id="font-input"
        :focus="fontInputFocus"
        @blur="onFontInputBlur"
        @input="onFontInput"
        :value="fontText"
        class="font-input"
        maxlength="10"
        placeholder="请输入文字"
      />
    </div>
    <button @click="onAdd" class="button-yellow font-add">添加</button>
  </div>
</template>
<script>
import { get, join } from "@/api/api";
import { uploadImg, getImageIntro } from "./utils.js";
export default {
  props: {
    diyData: Object,
    onFontAdd: Function
  },
  data() {
    return {
      fontList: [],

      fontColor: [
        "#2a2e34",
        "#fbfbfb",
        "#8b8b8b",
        "#e62c17",
        "#e84017",
        "#f08118",
        "#f4b113",
        "#f5e723",
        "#b8d21e",
        "#6db62d",
        "#309e39",
        "#008270",
        "#4a6774",
        "#01a4c0",
        "#2e83c6",
        "#2f3591",
        "#4c308f",
        "#7c2f8d",
        "#a71858",
        "#d82a4a"
      ],
      fontSelected: 0,
      colorSelected: 0,
      fontInputFocus: false,
      fontText: "",
      drawing: false
    };
  },
  computed: {
    getStyle() {
      let { diyData } = this;
      let width = diyData.diyRegion.width * 3;

      return "";
      return `width: ${width}px;
                    height:${width / this.getFontLength(this.fontText) * 2}px`;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getMessage() {},
    async getData() {
      let { data } = await get("diy/font");

      let fontList = [];
      for (let index = 0; index < data.length; index += 2) {
        let fonts = [data[index]];
        if (data[index + 1]) {
          fonts[1] = data[index + 1];
        }
        fontList.push(fonts);
      }

      this.fontList = fontList;
    },
    getFontLength(str) {
      var realLength = 0,
        len = str.length,
        charCode = -1;
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
      return realLength;
    },
    onFontFamilyClick(index) {
      this.fontSelected = index;
    },

    onFontColorClick(index) {
      this.colorSelected = index;
    },

    onFontInputBlur() {
      this.fontInputFocus = false;
    },

    onFontInputClick() {
      this.fontInputFocus = true;
    },

    async onAdd() {
      if (this.fontText === "") {
        wx.showToast({
          title: "请输入文字",
          duration: 2000,
          icon: "none"
        });
        return;
      }
      let { fontSelected, diyData, fontColor, colorSelected } = this;
      let fontFamily = this.fontList[Math.trunc(fontSelected / 2)][
        fontSelected % 2
      ];

      wx.showLoading({
        title: "加载中",
        mask: true
      });

      try {
        let width = diyData.diyRegion.width;
        let height = parseInt(width / this.getFontLength(this.fontText) * 2);

        let rgb = this.colorRgba(fontColor[colorSelected]);
        let { data } = await get("diy/font/pic", {
          id: fontFamily.id,
          fontSize: height * 15,
          text: this.fontText,
          rgb0: rgb[0],
          rgb1: rgb[1],
          rgb2: rgb[2]
        });

        const { ImageWidth, ImageHeight } = await getImageIntro(data);
        let imageWidth = ImageWidth.value;
        let imageHeight = ImageHeight.value;

        this.onFontAdd({
          type: "text",
          value: data,
          realWidth: Number(imageWidth),
          realHeight: Number(imageWidth),
          content: this.fontText,
          width,
          height,
          angle: 0,
          left: 0,
          top: 0
        });
        wx.hideLoading();
      } catch (error) {
        console.log(error);
        wx.hideLoading();
      }
    },

    onFontInput(text) {
      this.fontText = text.target.value;
    },
    colorRgba(sHex) {
      // 十六进制颜色值的正则表达式
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      /* 16进制颜色转为RGB格式 */
      let sColor = sHex.toLowerCase();
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //  处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      // return sColorChange.join(',')
      // 或
      return sColorChange;
    }
  }
};
</script>
<style lang='less' scoped>
.add-font {
  position: relative;
  height: 420px;
  padding: 16px 20px;
  box-sizing: border-box;
  h3 {
    font-size: 14px;
    color: #9b9b9b;
  }

  .color-h3 {
    margin-top: 17px;
  }

  .font-list {
    display: flex;
    margin-top: 10px;
  }

  .font-list-li {
    border: 1px solid white;
    width: 90px;
    height: 40px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-bottom: 12px;
    img {
      width: 100%;
      height: 100%;
    }

    &.selected {
      border: 1px solid #ff5100;
    }
  }

  .font-color-li {
    width: 44px;
    height: 44px;
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

  .font-input-box {
    margin-top: 35px;
    padding: 10px 12px;
    border: 1px solid #d6d6d6;
    width: 100%;
    height: 110px;
    box-sizing: border-box;
    background-color: white;
  }

  .font-input {
    font-size: 14px;
    line-height: 20px;
  }

  .font-add {
    margin-top: 28px;
  }
}

.font-color-selected {
  width: 22px;
  height: 22px;
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

.canvas {
  // display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  // top: 9999px;
  // left: 9999px;
  // opacity: 0;
}
</style>
