<template>
  <div class="add-upload-image" @click="upload"></div>
</template>
<script>
import { uploadImg, getImageIntro } from "./utils.js";
import { guid } from "../../utils/index";
export default {
  props: {
    onClick: Function,
    diyData: Object
  },
  data() {
    return {};
  },
  onShow() {},
  computed: {},
  methods: {
    async upload() {
      wx.chooseImage({
        count: 1, //最多可以选择的图片张数,
        sizeType: ["original"],
        sourceType: ['album', 'camera'],
        success: async res => {
          let path = res.tempFilePaths[0];
          wx.showLoading({
            title: "上传中",
            mask: true
          });
          path = await uploadImg(path);
          const { ImageWidth, ImageHeight } = await getImageIntro(path);
          let width = ImageWidth.value;
          let height = ImageHeight.value;
          this.onClick({
            id: guid(),
            type: "image",
            value: path,
            upload: false,
            width: this.diyData.diyRegion.width,
            height: height / width * this.diyData.diyRegion.width,
            realWidth: Number(width),
            realHeight: Number(height),
            angle: 0,
            left: 0,
            top: 0
          });
          // wx.hideLoading();
        },
        fail: () => {
          wx.showToast({
            title: "选择图片失败！",
            icon: "none",
            duration: 2000
          });
        }
      });
      // let path = await uploadImg();
    }
  }
};
</script>
<style lang='less' scoped>
.add-upload-image {
  width: 100px;
  height: 100px;

  background: url(../../../static/images/diy-upload.png);
  background-size: 100% 100%;
  margin-top: 100px;
}
</style>
