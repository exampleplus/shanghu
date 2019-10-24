<template>
  <div class="qrcode">
    <div class="content">
      <div class="refesh" @click="refresh" v-if="isfresh">
        刷新
      </div>
      <cover-view class="btn-share" @click="saveImg">下载图片到手机</cover-view>
      <div class="code-bg">
        <canvas
          :style="{height: canvasHeight + 'px',width:canvasWidth + 'px',zIndex:10}"
          canvas-id="shareCanvas"
        ></canvas>

        <!-- <img
          :src="userInfo.headimgurl"
          alt
          class="avator"
        >
        <p class="nickName">{{userInfo.nickname}}</p>
        <div class="codeBorder">
            <img src="/static/images/bg-code.png" class="qrcode-bg">
             <img
               mode="aspectFill"
              :src="qrcode"
              alt
              class="code"
            >
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import { firstQrcode, getUserInfo } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      qrcode: "",
      headimgurl: "",
      nickname: "",
      userInfo: {},
      canvasHeight: 458,
      canvasWidth: 292,
      isfresh:false

    };
  },
  // onShareAppMessage(res) {
  //   return {
  //     title: `尚乎`,
  //     path: "/pages/home/main"
  //   };
  // },
  onLoad() {
    this._getUserInfo();
    // this.getfirstQrcode();
  },
  methods: {

    refresh() {
      this.isfresh = false;
      this._getUserInfo();
    },
    //分销商信息
    async _getUserInfo() {
      const { data } = await getUserInfo();
      this.userInfo = data;
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      const Code = await firstQrcode();
      this.qrcode = Code.data;

      this.getCanvas(
        this.userInfo.headimgurl,
        this.qrcode,
        this.userInfo.nickname
      );
      // wx.hideLoading();

    },

    getImage(path) {
      let _this = this;
       wx.showLoading({
          title: "加载中",
          mask: true
        });
      return new Promise(resolve => {
        wx.downloadFile({
          url: path,
          success(res) {
            resolve(res.tempFilePath);
            //  wx.hideLoading();
          },
          fail() {
            toast("获取二维码失败");
            _this.isfresh = true;
          }
        });
      });
    },

    async getCanvas(headimgurl, qrcode, nickName) {

      //二维码 https://shanghusm-shanghai-picture.oss-cn-shanghai.aliyuncs.com/img/xcx/material/ee289de856cd4b1eb853b224c7681eae.jpg
     

      let _this = this;
     
      let [headUrl, qrcodeUrl] = await Promise.all([
        this.getImage(headimgurl),
        this.getImage(qrcode),
      ]);

      const ctx = wx.createCanvasContext("shareCanvas");
      // ctx.setFillStyle("transparent");
      // ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
      // 绘制背景图
      ctx.drawImage(
        "/static/images/myQrcode-bg.png",
        0,
        35,
        _this.canvasWidth,
        _this.canvasHeight - 35
      );
     
      // 绘制文字
      ctx.setFillStyle("black"); // 文字颜色：黑色
      ctx.setFontSize(20); // 文字字号：22px
      ctx.setTextAlign("center");
      ctx.fillText(nickName, _this.canvasWidth / 2, 100);

      ctx.drawImage(qrcodeUrl, 53, 120, 180, 180);

      ctx.save();
      //绘制头像
      ctx.beginPath(); //开始绘制
      //先画个圆
      ctx.setStrokeStyle('transparent'); 
      ctx.arc(_this.canvasWidth / 2, 35, 35, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(headUrl, _this.canvasWidth / 2 - 35, 0, 70, 70);

      ctx.draw();
      wx.hideLoading();
    },

    saveImg() {
      let _this = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                //这里是用户同意授权后的回调
                _this.commitImg();
              },
              fail() {
                //这里是用户拒绝授权后的回调
                wx.showModal({
                  title: "保存图片需要授权",
                  confirmColor: "#036EB8",
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {}
                      });
                    } else if (res.cancel) {
                      wx.openSetting({
                        success(res) {}
                      });
                    }
                  }
                });
              }
            });
          } else {
            //用户已经授权过了
            _this.commitImg();
          }
        }
      });
    },

    commitImg() {
      // 调用 wx.canvasToTempFilePath方法
      wx.canvasToTempFilePath({
        //通过id 指定是哪个canvas
        canvasId: "shareCanvas",
        fileType: "png",
        success(res) {
          //成功之后保存到本地
          console.log("res", res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              wx.showModal({
                title: "图片已保存至系统相册",
                content: "快去分享给小伙伴吧",
                showCancel: false,
                confirmText: "我知道了",
                confirmColor: "#036EB8",
                success(res) {
                  if (res.confirm) {
                    // wx.navigateBack({
                    //   delta: 1
                    // })
                  }
                }
              });
            },
            fail: function(res) {}
          });
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.qrcode {
  height: 100%;
  width: 100%;
  position: fixed;
  background: linear-gradient(
    180deg,
    rgba(245, 132, 29, 1) 0%,
    rgba(244, 84, 9, 1) 100%
  );
  .content {
    .refesh {
      position: fixed;
      top: 50%;
      color: #fff;
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      border:1px solid #fff;
      font-size: 14px;
      left: 50%;
      margin-left: -60px;
      border-radius: 40px;
    }
    .btn-share {
      width: 200px;
      margin: 20px auto;
      position: relative;
      top: 380px;
      z-index: 1000;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgba(255, 81, 0, 1);
      border-radius: 22px;
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
    }
    .code-bg {
      width: 292px;
      height: 458px;
      position: fixed;
      left: 50%;
      margin-left: -292rpx;
      top: 80px;
      // background: url("data:image/png;base64,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");
      // background-repeat: no-repeat;
      // background-size: cover;
      display: flex;
      flex-direction: column;
      align-items: center;

      .avator {
        width: 144rpx;
        height: 144rpx;
        border-radius: 50%;
        margin-top: -72rpx;
      }
      .nickName {
        font-size: 36rpx;
        font-family: PingFangSC-Medium;
        font-weight: 600;
        color: rgba(29, 30, 31, 1);
        margin-top: 15px;
        margin-bottom: 16rpx;
      }
      .intro {
        font-size: 24rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .codeBorder {
        margin-top: 52rpx;
        width: 376rpx;
        height: 368rpx;
        position: relative;
        .qrcode-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }
        .code {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
