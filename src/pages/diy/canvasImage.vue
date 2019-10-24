<template>
  <div>
    <canvas :style="getStyle" canvas-id="canvasImage" class="canvasImage"></canvas>
    <!-- <canvas :style="getMaterialFrontStyle" canvas-id="canvasImageMaterialFront" class="canvasImage"></canvas> -->
    <!-- <canvas :style="getMaterialStyle" canvas-id="canvasImageMaterial" class="canvasImage"></canvas> -->
  </div>
</template>
<script>
import { get, join } from "@/api/api";
import { uploadImg } from "./utils.js";
export default {
  props: {
    baseData: Object,
    materialData: Object,
    elements: Array,
    color: String
  },
  data() {
    return {
      show: false,
      zoom: 10
    };
  },
  mounted() {},
  computed: {
    getStyle() {
      let { baseData } = this;
      let { width, height, xaxes, yaxes } = baseData.baseConfig.find(
        value => value.isFront
      );
      return `width:200px;
            height:${200 / width * height}px;
            `;
    },
    getMaterialFrontStyle() {
      let { baseData } = this;
      let { width, height } = baseData.baseDiyConfig.find(
        value => value.isFront
      );

      return `width:${width * this.zoom}px;
            height:${height * this.zoom}px;
            `;
    },
    getMaterialStyle() {
      let { baseData } = this;
      let { width, height } = baseData.baseDiyConfig.find(
        value => !value.isFront
      );

      return `width:${width * this.zoom}px;
            height:${height * this.zoom}px;
            `;
    }
  },
  methods: {
    // getMaterialImage() {
    //   return new Promise(async resolve => {
    //     let imageFront = await this.drawMaterialImage(true);
    //     let imageUnFront = await this.drawMaterialImage(false);

    //     Promise.all([
    //       uploadImg(imageFront),
    //       uploadImg(imageUnFront)
    //     ]).then(value => resolve(value));
    //   });
    // },

    // drawMaterialImage(isFront) {
    //   return new Promise(async resolve => {
    //     try {
    //       let { color, baseData, elements } = this;
    //       let { baseDiyConfig } = baseData;
    //       let { width, height } = baseDiyConfig.find(
    //         value => value.isFront === isFront
    //       );
    //       let canvasId = isFront
    //         ? "canvasImageMaterialFront"
    //         : "canvasImageMaterial";
    //       let context = wx.createCanvasContext(canvasId);
    //       context.clearRect(0, 0, 999999, 999999);
    //       context.draw();
    //       context.restore();

    //       let eles = isFront ? elements[0] : elements[1];
    //       eles = await Promise.all(
    //         eles.map(async element => {
    //           let value = await this.getImageUrl(element.value);
    //           return {
    //             ...element,
    //             value
    //           };
    //         })
    //       );

    //       let tasks = eles.map(element => {
    //         let { left, top, width, height, value, angle } = element;

    //         let translateX = left + width / 2;
    //         let translateY = top + height / 2;
    //         context.save();
    //         context.translate(translateX * this.zoom, translateY * this.zoom);
    //         context.rotate(Math.PI / 180 * angle);
    //         context.drawImage(
    //           value,
    //           (left - translateX) * this.zoom,
    //           (top - translateY) * this.zoom,
    //           width * this.zoom,
    //           height * this.zoom
    //         );
    //         context.restore();
    //       });

    //       context.draw(false, () => {
    //         wx.canvasToTempFilePath({
    //           canvasId: canvasId,
    //           destWidth: width * this.zoom,
    //           destHeight: height * this.zoom,
    //           success: res => {
    //             resolve(res.tempFilePath);
    //           }
    //         });
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   });
    // },

    getImage() {
      return new Promise(async resolve => {
        let { color, baseData, elements } = this;
        let context = wx.createCanvasContext("canvasImage");
        let { frontImg } = baseData.baseColorSpec.find(
          value => value.name === color
        );

        let { width, height, xaxes, yaxes } = baseData.baseConfig.find(
          value => value.isFront
        );
        let zoom = 200 / width;

        frontImg = await this.getImageUrl(
          frontImg + "?x-oss-process=image/resize,w_200,m_mfit"
        );
        let eles = elements[0];
        eles = await Promise.all(
          eles.map(async element => {
            let value = await this.getImageUrl(
              element.value + "?x-oss-process=image/resize,w_200,m_mfit"
            );
            return {
              ...element,
              value
            };
          })
        );

        let baseDiyConfig = baseData.baseDiyConfig.find(value => value.isFront);
        context.clearRect(0, 0, 1000, 1000);
        context.draw();
        context.restore();

        context.drawImage(
          frontImg,
          xaxes * zoom,
          yaxes * zoom,
          width * zoom,
          height * zoom
        );
        context.setStrokeStyle("rgba(255, 255, 255, 0)");
        context.save();
        context.beginPath();
        context.moveTo(baseDiyConfig.xaxes * zoom, baseDiyConfig.yaxes * zoom);
        context.lineTo(
          baseDiyConfig.xaxes * zoom + baseDiyConfig.width * zoom,
          baseDiyConfig.yaxes * zoom
        );
        context.lineTo(
          baseDiyConfig.xaxes * zoom + baseDiyConfig.width * zoom,
          baseDiyConfig.yaxes * zoom + baseDiyConfig.height * zoom
        );
        context.lineTo(
          baseDiyConfig.xaxes * zoom,
          baseDiyConfig.yaxes * zoom + baseDiyConfig.height * zoom
        );
        context.lineTo(baseDiyConfig.xaxes * zoom, baseDiyConfig.yaxes * zoom);
        context.stroke();
        context.clip();

        let tasks = eles.map(element => {
          let { left, top, width, height, value, angle } = element;

          let translateX =
            baseDiyConfig.xaxes * zoom + left * zoom + width * zoom / 2;
          let translateY =
            baseDiyConfig.yaxes * zoom + top * zoom + height * zoom / 2;
          context.save();
          context.translate(translateX, translateY);
          context.rotate(Math.PI / 180 * angle);
          context.drawImage(
            value,
            baseDiyConfig.xaxes * zoom + left * zoom - translateX,
            baseDiyConfig.yaxes * zoom + top * zoom - translateY,
            width * zoom,
            height * zoom
          );

          context.restore();
        });

        context.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: "canvasImage",
            destWidth: width * zoom,
            destHeight: height * zoom,
            success: res => {
              resolve(res.tempFilePath);
            }
          });
        });
      });
    },

    getImageUrl(image) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: image,
          success: res => {
            let tempPath = res.path;
            resolve(tempPath);
          }
        });
      });
    }
  }
};
</script>
<style lang='less' scoped>
.canvasImage {
  // display: none;
  position: absolute;
  left: 0;
  top: 0;
  top: 9999px;
  left: 9999px;
  opacity: 0;
}
</style>
