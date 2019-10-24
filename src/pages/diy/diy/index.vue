<template>
  <div class="diy" id="diy">
    <div class="diy-content" id="diy-content">
      <div class="diy-box" :style="getDiyBoxStyle">
        <div class="diy-region" :style="getDiyRegionStyle">
          <div
            class="diy-element-box selected"
            v-for="(element,index) in data.elements"
            :style="{width:element.width+'px',
                            height:element.height+'px',
                            transform: 'rotate('+element.angle+'deg)',
                            left:element.left+'px',
                            zIndex:index+1,
                            top:element.top+'px'}"
            :key="element.id"
          >
            <!-- <img class="diy-element" src="https://shanghusm-shanghai-picture.oss-cn-shanghai.aliyuncs.com/img/xcx/material/h2d3AQjkDmcGQretyjDifmMiPeHXp2fH.png" /> -->
            <!-- <img
              class="diy-element"
              :src="element.value + '?x-oss-process=image/resize,w_'+ maxImageWidth +',m_mfit'"
            />-->

            <img class="diy-element" :src="element.value + '?x-oss-process=image/resize,w_320'" />
            <!-- <div
                            class="diy-element-text"
                            :style="{fontSize:element.height+'px',
                        height:element.height+'px',
                        color:element.color,
                        fontFamily:element.fontFamily,
                        lineHeight:element.height+'px'}"
                            v-if="element.type === 'text'"
            >{{element.value}}</div>-->
          </div>
        </div>
        <div class="diy-region diy-region-edit" :style="getDiyRegionStyle" v-if="isDiy">
          <div
            v-for="(element,index) in data.elements"
            :class="'diy-element-box ' + (element.id === elementSelected ? 'selected':'')"
            :style="{width:element.width+'px',
                            height:element.height+'px',
                            transform: 'rotate('+element.angle+'deg)',
                            left:element.left+'px',
                            zIndex:index+1,
                            top:element.top+'px'}"
            :key="element.id"
            :id="refName+element.id"
            @touchstart.stop="(e) => onTouchstart(e,element,index)"
            @touchmove="(e) => (diyType == 1 || !element.isTemplate || element.isTemplate === undefined) && onTouchmove(e,element)"
            @touchend="(e) => onTouchend(e,element)"
          >
            <div class="diy-element-edit">
              <div
                v-if="diyType == 1 || !element.isTemplate || element.isTemplate === undefined"
                class="diy-element-del"
                :style="{ transform:'scale('+ 1 * proportion +')'}"
                @touchend="()=>onDelete(element)"
              ></div>
              <div
                v-if="diyType == 1 || !element.isTemplate || element.isTemplate === undefined"
                class="diy-element-rotate"
                :style="{ transform:'scale('+ 1 * proportion +')'}"
                @touchstart.stop="(e) => onRotateTouchstart(e,element)"
                @touchmove.stop="(e) => onRotateTouchmove(e,element)"
                @touchend="(e) => onTouchend(e,element)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let touchMoveSt = [];

setInterval(() => {
  let fun = touchMoveSt[touchMoveSt.length - 1];
  if (fun) {
    fun();
    touchMoveSt = [];
  }
}, 15);

export default {
  props: {
    data: Object,
    elementSelected: Number,
    isDiy: Boolean,
    isChange: Boolean,
    diyType: String,
    onElementSelectedChange: Function
  },
  data() {
    let windowWidth = wx.getSystemInfoSync().windowWidth;

    return {
      diyRegionSelect: false,
      touchstartEvent: {},
      touchstartElement: null,
      startAngle: null,
      startWH: null,
      maxImageWidth: windowWidth * 1.5,
      proportion: 1,
      refName: "element",
      regionPosition: {
        left: 0,
        top: 0
      }
    };
  },
  mounted() {
    this.init();
  },

  watch: {
    data: {
      handler(newName, oldName) {
        this.init();
      },
      deep: true
    }
  },

  onShow() {},
  computed: {
    getDiyBoxStyle() {
      let { data } = this;
      let { width, height, x, y, backgroundImage } = data;

      return `width:${width}px;
            height:${height}px;
            transform:scale(${1 / this.proportion});
            background-image: url(${backgroundImage});
            background-position: ${x}px ${y}px;
            `;
    },
    getDataStyle(value) {
      return "";
    },

    getDiyRegionStyle() {
      let { left, top, width, height, backgroundImage } = this.data.diyRegion;
      let background = this.diyRegionSelect ? backgroundImage : "";
      return `width:${width}px;
            height:${height}px;
            background-image: url(${background});
            left:${left}px;
            top:${top}px`;
    }
  },
  methods: {
    init() {
      let query = wx.createSelectorQuery();
      query.select("#diy-content").boundingClientRect();
      query.exec(([res]) => {
        this.regionPosition = { ...res };
      });

      query = wx.createSelectorQuery();
      query.select("#diy").boundingClientRect();
      query.exec(([res]) => {
        if (!res) {
          return;
        }
        let { data } = this;
        let { width, height } = res;

        if (width / height > data.width / data.height) {
          this.proportion = data.height / height;
        } else {
          this.proportion = data.width / width;
        }

        // console.log("this.proportion", data.width, data.height);
        // console.log("this.proportion", this.proportion);
      });
    },

    getAngle(start, end) {
      var x = end.x - start.x,
        y = end.y - start.y;
      let angle = Math.atan2(y, x) / (Math.PI / 180);

      if (angle < 0) {
        return 360 + angle;
      }
      return angle;
    },

    getPosition(start, end, proportion) {
      let x = end.x - start.x;
      let y = end.y - start.y;

      let distance =
        this.getDistance(
          {
            x: 0,
            y: 0
          },
          {
            x,
            y
          }
        ) * proportion;
      let angle = this.getAngle(
        {
          x: 0,
          y: 0
        },
        {
          x,
          y
        }
      );

      y = Math.sin(Math.PI / 180 * angle) * distance;
      x = Math.cos(Math.PI / 180 * angle) * distance;

      return {
        x: x + start.x,
        y: y + start.y
      };
    },

    getDistance(start, end) {
      const x = Math.abs(end.x - start.x);
      const y = Math.abs(end.y - start.y);
      return Math.sqrt(x * x + y * y);
    },

    getWH(distance, angle) {
      return {
        width: Math.cos(Math.PI / 180 * angle) * distance,
        height: Math.sin(Math.PI / 180 * angle) * distance
      };
    },

    onRotateTouchstart(e, value) {
      const { x: eclientX, y: eclientY } = this.getPosition(
        {
          x: this.regionPosition.left + this.regionPosition.width / 2,
          y: this.regionPosition.top + this.regionPosition.height / 2
        },
        {
          x: e.clientX,
          y: e.clientY
        },
        this.proportion
      );

      this.touchstartElement = { ...value };
      const clientX =
        eclientX - this.regionPosition.left - this.data.diyRegion.left;
      const clientY =
        eclientY - this.regionPosition.top - this.data.diyRegion.top;
      const xy = {
        x: value.left + value.width / 2,
        y: value.top + value.height / 2
      };
      this.startAngle = this.getAngle(xy, { x: clientX, y: clientY });

      e.stopPropagation();
    },

    onRotateTouchmove(e, value) {
      touchMoveSt.push(() => {
        const { x: eclientX, y: eclientY } = this.getPosition(
          {
            x: this.regionPosition.left + this.regionPosition.width / 2,
            y: this.regionPosition.top + this.regionPosition.height / 2
          },
          {
            x: e.clientX,
            y: e.clientY
          },
          this.proportion
        );

        const { touchstartElement } = this;
        const clientX =
          eclientX - this.regionPosition.left - this.data.diyRegion.left;
        const clientY =
          eclientY - this.regionPosition.top - this.data.diyRegion.top;

        if (this.startAngle === null) {
          return;
        }

        // 计算角度
        value.angle =
          this.getAngle(
            {
              x: value.left + value.width / 2,
              y: value.top + value.height / 2
            },
            { x: clientX, y: clientY }
          ) -
          this.startAngle +
          this.touchstartElement.angle;

        // 计算宽高
        let left = touchstartElement.left + touchstartElement.width / 2;
        let top = touchstartElement.top + touchstartElement.height / 2;
        let wh = this.getWH(
          this.getDistance({ x: left, y: top }, { x: clientX, y: clientY }),
          this.getAngle(
            { x: 0, y: 0 },
            { x: touchstartElement.width, y: touchstartElement.height }
          )
        );
        value.width = wh.width * 2;
        value.height = wh.height * 2;

        // 计算坐标
        value.left =
          touchstartElement.left - (value.width - touchstartElement.width) / 2;
        value.top =
          touchstartElement.top - (value.height - touchstartElement.height) / 2;
      });
      e.stopPropagation();
    },

    onTouchstart(e, value, index) {
      console.log("e", e);
      console.log("value", value);
      const { x: eclientX, y: eclientY } = this.getPosition(
        {
          x: this.regionPosition.left + this.regionPosition.width / 2,
          y: this.regionPosition.top + this.regionPosition.height / 2
        },
        {
          x: e.clientX,
          y: e.clientY
        },
        this.proportion
      );

      this.touchstartEvent = {
        ...e,
        x: 0,
        y: 0,
        clientX: eclientX,
        clientY: eclientY
      };
      this.touchstartElement = { ...value };
      this.diyRegionSelect = true;

      this.onElementSelectedChange(value.id);
    },

    onTouchmove(e, value) {
      touchMoveSt.push(() => {
        const { x: eclientX, y: eclientY } = this.getPosition(
          {
            x: this.regionPosition.left + this.regionPosition.width / 2,
            y: this.regionPosition.top + this.regionPosition.height / 2
          },
          {
            x: e.clientX,
            y: e.clientY
          },
          this.proportion
        );
        let { touchstartEvent, touchstartElement } = this;

        value.left =
          this.touchstartElement.left + (eclientX - touchstartEvent.clientX);
        value.top =
          this.touchstartElement.top + (eclientY - touchstartEvent.clientY);
      });
    },

    onDelete(element) {
      let elements = this.data.elements;
      elements.splice(
        this.data.elements.findIndex(value => element.id === value.id),
        1
      );

      if (this.elementSelected === element.id) {
        this.onElementSelectedChange(null);
      }
    },

    onTouchend(e, value) {
      this.diyRegionSelect = false;
    }
  }
};
</script>
<style lang='less' scoped>
.diy {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diy-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.diy-box {
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.diy-region {
  position: absolute;
  overflow: hidden;
  background-size: 100% 100%;
}

.diy-element-text {
  width: 100%;
  white-space: nowrap;
}

.diy-element-box {
  position: absolute;
  opacity: 0;
  &.selected {
    opacity: 1;
  }
}

.diy-element {
  width: 100%;
  height: 100%;
}

.diy-element-edit {
  position: absolute;
  left: -2px;
  top: -2px;
  width: 100%;
  height: 100%;
  border: 2px solid #ff5100;
}

.diy-element-rotate {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 20px;
  height: 20px;
  background-image: url(./images/rotate-cw@2x.png);
  background-size: 100% 100%;
}

.diy-element-del {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background-image: url(./images/del@2x.png);
  background-size: 100% 100%;
}

.diy-region-edit {
  overflow: visible;
}
</style>
