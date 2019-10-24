<template>
  <div @touchend="onCanvasTouchend">
    <h3>可在方框内随意涂鸦</h3>
    <div class="add-doodling-content">
      <div class="add-doodling-canvas-box">
        <canvas
          id="canvas"
          @touchmove="onCanvasTouchmove"
          @touchstart="onCanvasTouchstart"
          canvas-id="canvas"
          class="add-doodling-canvas"
        ></canvas>
      </div>
      <div class="diy-edit add-edit add-edit-thickness">
        <ul v-if="doodlingThicknessShow" class="diy-edit-content">
          <li v-for="(size,index) in doodlingThickness" :key="index" @click="doodlingLine(index)">
            <div
              :class="'doodling-line-box' + (index === doodlingThicknessSelected ? ' selected' : '')"
            >
              <div
                :style="{ height:size+'px' ,
                                                borderRadius: size/2+'px'}"
                class="doodling-line"
              ></div>
            </div>
          </li>
        </ul>
        <div @click="onDoodlingThicknessShowChange" class="edit-button">
          <i class="diy-edit-icon icon-pen" />
          <span>粗细</span>
        </div>
      </div>
      <div class="diy-edit add-edit">
        <ul v-if="doodlingColorShow" class="diy-edit-colors">
          <li v-for="(color,index) in doodlingColors" :key="index" @click="selColors(index)">
            <div :style="{ backgroundColor:color }" class="select-color">
              <img
                v-if="index === doodlingColorSelected"
                src="../../../static/images/diy-select-color-selected.png"
                class="font-color-selected"
              />
            </div>
          </li>
        </ul>
        <div @click="onDoodlingColorShowChange" class="edit-button-colors">
          <i class="diy-edit-icon icon-color" />
          <span>颜色</span>
        </div>
      </div>
    </div>
    <div class="add-button-box">
      <div class="button-content">
        <button @click="onDoodlingReset" class="button-yellow button-transparent font-add">重置</button>
      </div>
      <div class="button-content">
        <button @click="onAdd" class="button-yellow font-add">添加涂鸦</button>
      </div>
    </div>
  </div>
</template>
<script>
let touchMoveSt = [];
setInterval(() => {
  let fun = touchMoveSt[touchMoveSt.length - 1];
  if (fun) {
    touchMoveSt = [];
    fun();
  }
}, 8);
import { uploadImg } from "./utils.js";
export default {
  props: {
    onDoodlingAdd: Function,
    diyData: Object
  },
  data() {
    return {
      doodlingThicknessShow: false,
      doodlingThicknessSelected: 0,
      doodlingThickness: [1, 2, 3, 4],
      doodlingColorShow: false,
      doodlingColorSelected: 0,
      doodlingColors: ["#dcdcdc", "#000", "#ea5307", "#3586c9"],
      context: wx.createCanvasContext("canvas"),
      canvasPrev: { x: 0, y: 0 }
    };
  },
  onShow() {},
  computed: {},
  methods: {
    doodlingLine(index) {
      this.doodlingThicknessSelected = index;
      this.doodlingThicknessShow = !this.doodlingThicknessShow;
      this.doodlingColorShow = false;
    },
    selColors(index) {
      this.doodlingColorSelected = index;
      this.doodlingColorShow = !this.doodlingColorShow;
    },
    onCanvasTouchstart(e) {
      let { context } = this;
      let { x, y } = e;
      console.log("onCanvasTouchstart");
      context.moveTo(e.x, e.y);
      this.canvasPrev = { x, y };
    },

    onDoodlingThicknessShowChange() {
      this.doodlingThicknessShow = !this.doodlingThicknessShow;
      this.doodlingColorShow = false;
    },

    onDoodlingColorShowChange() {
      this.doodlingColorShow = !this.doodlingColorShow;
      this.doodlingThicknessShow = false;
    },

    onCanvasTouchend() {
      this.canvasPrev = null;
    },

    onCanvasTouchmove(e) {
      touchMoveSt.push(() => {
        console.log("onCanvasTouchmove");
        let { x, y } = e;
        let { context, canvasPrev } = this;

        if (canvasPrev === null) {
          this.canvasPrev = { x, y };
          return;
        }

        context.restore();
        context.setStrokeStyle(this.doodlingColors[this.doodlingColorSelected]);
        context.setLineWidth(
          this.doodlingThickness[this.doodlingThicknessSelected]
        );
        context.moveTo(canvasPrev.x, canvasPrev.y);
        context.lineTo(x, y);
        this.canvasPrev = { x, y };
        context.stroke();
        context.save();
        context.draw(true);
      });
    },

    onDoodlingReset() {
      this.context.clearRect(0, 0, 99999, 99999);
      this.context.draw();
    },

    async onAdd() {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      const query = wx.createSelectorQuery();
      query.select("#canvas").boundingClientRect();
      query.exec(([res]) => {
        let { width, height } = res;

        console.log(res);

        wx.canvasToTempFilePath({
          canvasId: "canvas",
          destWidth: width * 10,
          destHeight: height * 10,
          success: async res => {
            let path = await uploadImg(res.tempFilePath);
            this.onDoodlingAdd({
              type: "doodling",
              value: path,
              upload: false,
              realWidth: width * 10,
              realHeight: height * 10,
              width: this.diyData.diyRegion.width,
              height: this.diyData.diyRegion.width / width * height,
              angle: 0,
              left: 0,
              top: 0
            });
            wx.hideLoading();
          }
        });
      });
    }
  }
};
</script>
<style lang='less' scoped>
.add-doodling {
  h3 {
    padding-top: 9px;
    padding-bottom: 16px;
    font-size: 14px;
    text-align: center;
    color: #4a4a4a;
    line-height: 20px;
  }

  .add-button-box {
    margin: 20px;
    display: flex;
  }

  .button-content {
    flex: 1;

    &:nth-of-type(n) {
      padding-right: 7.5px;
    }

    &:nth-of-type(2n) {
      padding-left: 7.5px;
    }
  }
}

.add-doodling-content {
  position: relative;
  margin: 0 20px;
  border: 1px solid #d6d6d6;
  background-color: white;
  height: 338px;
}

.doodling-line-box {
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid #d6d6d6;
  width: 26px;
  padding: 0 2px;
  height: 26px;
  display: flex;
  align-items: center;
  &.selected {
    border: 1px solid #4a4a4a;
  }
}

.add-doodling-canvas-box {
  position: absolute;
  top: 0;
  // left: 15%;
  // width: 70%;
  left: 0;
  width: 100%;
  height: 85%;
}

.add-doodling-canvas {
  width: 100%;
  height: 100%;
}

.doodling-line {
  width: 100%;
  height: 1px;
  background-color: #4a4a4a;
}

.diy-edit {
  position: absolute;
  bottom: 18px;
  right: 18px;
  // width: 46px;
  z-index: 10;

  &.add-edit {
    right: 10px;
    bottom: 10px;
  }

  &.add-edit-thickness {
    left: 10px;
    right: auto;
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

  .diy-edit-content {
    box-sizing: border-box;
    border: 1px solid #d6d6d6;
    background-color: white;
    font-size: 11px;
    color: #4a4a4a;
    border-radius: 23px;
    padding-left: 56px;
    display: flex;
    // padding-bottom: 33px;
    // padding-top: 16px;
  }

  .diy-edit-colors {
    box-sizing: border-box;
    border: 1px solid #d6d6d6;
    background-color: white;
    font-size: 11px;
    color: #4a4a4a;
    border-radius: 23px;
    padding-left: 15px;
    display: flex;
    padding-right: 56px;
  }
  li {
    display: flex;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    position: relative;
    top: 11px;
  }

  .diy-edit-icon {
    display: block;
    width: 20px;
    height: 20px;
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
  .edit-button-colors {
    position: absolute;
    bottom: 0;
    right: 0;
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
}

.diy-edit-icon {
  display: block;
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
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

.font-color-selected {
  width: 22px;
  height: 22px;
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

.button-transparent {
  background: transparent;
  color: #ff5100;
  border: 1px solid #ff5100;
}
</style>
