<template>
  <div class="content">
    <img src="/static/images/bargain_bg.png" alt class="bargain-bg" />
    <div class="goodsinfo-card">
      <img class="card-bg" src="/static/images/bargain_goods_bg.png" alt />
      <div class="card-content">
        <div class="card-goods">
          <div class="goods-info">
            <div class="goods-img">
              <img :src="bargianInfo.logo" />
            </div>
            <div class="goods-desc">
              <div class="goods-title">{{bargianInfo.goodsName}}</div>
              <span class="bar">砍价</span>
              <div class="goods-price">
                <p class="goods-base-price">
                  <span class="miniPrice">￥{{bargianInfo.bottomPrice}}</span>
                  <span class="mini">最低价</span>
                </p>
                <p class="goods-sell-price">￥{{bargianInfo.goodsPrice}}</p>
              </div>
            </div>
          </div>
          <div class="goods-quantity">
            <span class="num-cur">销量：{{bargianInfo.saleCount}}</span>
            <span class="num-store">当前库存：{{bargianInfo.bargainStock}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bargainPrice">
      <p class="price">
        <span>当前价格：</span>
        <span class="nowPrice">{{bargianInfo.bargainPrice}}</span>
        <span>，</span>
        <span>还能砍：</span>
        <span class="isbargain">{{bargianInfo.remainBargainPrice}}</span>
      </p>
      <div class="progress">
        <progress :percent="percent" stroke-width="16" border-radius="20" activeColor="#F35821" />
      </div>
      <div class="shareFriends" v-if="bargianInfo.isSelf" @click="showShareMask">
        <button>分享给好友，多砍一刀</button>
      </div>
      <div
        class="help"
        @click="_helpBargain"
        v-if="!bargianInfo.isSelf && !bargianInfo.isBargain && bargainPress == true "
      >帮他砍价</div>
      <!-- 是否已经砍价过 -->
      <div
        class="shareFriends"
        v-if="bargianInfo.isBargain && !bargianInfo.isSelf"
        @click="showShareMask"
      >
        <button>您已砍掉{{bargianInfo.helpPrice}}元，分享给好友继续砍</button>
      </div>
    </div>

    <div class="users">
      <div class="user" v-for="(item,index) in bargianInfo.bargainUserList" :key="index">
        <img :src="item.headimgurl" alt />
        <span class="nick">{{item.nickname}}</span>
        <p class="cutPrice">
          <span>砍掉</span>
          <span class="cutMoney">{{item.bargainPrice}}</span>
          <span>元</span>
        </p>
      </div>
    </div>
    <!-- 购买按钮 -->
    <div class="buy">
      <div class="buyNow" v-if="bargianInfo.isSelf" @click="buyNow">立即购买</div>
    </div>
    <!-- 发起砍价按钮 -->
    <div class="buy" v-if="bargianInfo.helpPrice && !bargianInfo.isSelf" @click="goBargainList">
      <div class="buyNow">发起砍价</div>
    </div>

    <!-- 回到首页 -->
    <div class="backHome" @click="backHome">
      <img src="/static/images/icon-home.png" alt />
    </div>

    <!-- 好友查看页面 -->
    <!-- 没砍过价 -->
    <div
      class="modal"
      v-if="showhelpBargain && !bargianInfo.isBargain && !bargianInfo.isSelf && bargainPress == true"
    >
      <img src="/static/images/gold.png" class="gold" />
      <p class="helpBar">帮Ta砍价</p>
      <p class="mini">
        该商品最低可砍到
        <span class="miniPrice">{{bargianInfo.bottomPrice}}</span>元
      </p>
      <div class="btn-help" @click="_helpBargain">帮Ta砍价</div>
      <img src="/static/images/closeModal.png" class="closeModal" @click="closeModal" />
    </div>

    <!-- 好友砍价之后页面 -->
    <div class="hasbargain" v-if="hasBargain">
      <p class="hasCut">
        你帮
        <span class="nickName">{{bargainName}}</span> 砍掉了
      </p>
      <p class="cutMoney">
        <span>{{bargainedMoney}}</span>元
      </p>
      <img src="/static/images/cut.png" class="cutImg" />
      <p class="cutedPrice">
        砍价后价格
        <span class="cutedMoney">{{helpBargainPrice}}</span>元，原价
        <span class="originalMoney">{{bargianInfo.goodsPrice}}</span>元
      </p>
      <div class="join" @click="goBargainList">我也要参加</div>
      <img src="/static/images/closeModal.png" class="closeModal" @click="closeModal" />
    </div>

    <!-- 分享到朋友圈弹框 -->
    <div :class="'shareCircle ' + (friendsCircle ? 'shareCircle--show' : '')">
      <canvas
        :style="{height: canvasHeight + 'px',width:canvasWidth + 'px',zIndex:10000}"
        canvas-id="shareCanvas"
      ></canvas>
      <!-- <div class="top">
          <img :src="headImgUrl" alt="">
          <div class="helpOther">
            <p class="nick">{{nickName}}</p>
            <p class="help">是朋友就帮我砍一刀！</p>
          </div>
        </div>

        <div class="code">
          <img :src="qrCode" show-menu-by-longpress="true">
      </div>-->
      <cover-view class="saveImg" @click="saveCanvas">下载二维码到手机</cover-view>
    </div>

    <!-- 底部分享 -->
    <div class="shareBottom" v-if="showShare">
      <div class="share">
        <p class="wx">
          <button open-type="share">
            <img src="/static/images/icon-wx.png" alt />
            <span>微信好友</span>
          </button>
        </p>
        <p class="wx">
          <button @click="showShareFriends">
            <img src="/static/images/icon-friendsCircle.png" alt />
            <span>朋友圈</span>
          </button>
        </p>
      </div>
      <div class="divi"></div>
      <div class="cancel" @click="closeModal">取消</div>
    </div>
    <!-- 蒙层 -->
    <div class="mask" v-if="isHidden" @click="closeModal"></div>

    <!-- 分享给好友时的蒙层 -->
    <div
      class="mask"
      v-if="isHidden2 && !bargianInfo.isBargain && !bargianInfo.isSelf && bargainPress == true"
      @click="closeModal"
    ></div>

    <!-- 好友砍价之后 蒙层 -->
    <div class="mask" v-if="isHidden3" @click="closeModal"></div>

    <!-- 砍价生成订单弹出的框 -->
  </div>
</template>

<script>
import {
  shareBargainDetail,
  helpBargain,
  bargainVerifyGoodsStock,
  bargainQrcode,
  hadBargain
} from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      nickName: "", //发起者昵称
      headImgUrl: "", //发起者头像
      bargianInfo: {}, //砍价信息
      showShare: false,
      friendsCircle: false, // 显示二维码
      isHidden: false,
      isHidden2: true,
      isModal: false,
      hasBargain: false,
      isHidden3: false,
      id: "", //砍价id
      qrCode: "",
      showhelpBargain: true,
      bargainPress: false,
      percent: 0, // 砍价百分比
      helpBargainPrice: 0, //砍价后价格
      bargainName: "", //发起者昵称
      bargainedMoney: 0, //好友帮忙砍得价格
      isExit: false, //砍价是否已生成订单
      windowWidth: "",
      isEnd:'',
      canvasHeight: null,
      canvasWidth: null
    };
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data());
    this._getBargainDetail();
  },
  onShow() {
    
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      this.showShare = false;
      this.isHidden = false;
      this.isHidden2 = false;
      this.isHidden3 = false;
      // 来自页面内转发按钮
    }
    let that = this;
    let goodsId = this.$mp.query.goodsId;
    let skuId = this.$mp.query.skuId;
    return {
      // 强烈推荐+商品标题名称+商品主图。
      title: `强烈推荐${that.bargianInfo.goodsName}`,
      imageUrl: that.bargianInfo.logo,
      path:
        "/pages/order/twoshareBargainDetail/main?id=" + that.$mp.query.id +"&goodsId=" + goodsId + "&skuId=" + skuId
    };
  },
  methods: {
    backHome() {
      wx.switchTab({
        url: "/pages/home/main"
      });
    },
    async _getBargainDetail() {
      let id = this.$mp.query.id;
      let _this = this;
      const { data } = await hadBargain({ id });
      console.log("data", data);
      if (!data) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "砍价已结束，看看其他商品吧",
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/home/main"
              });
            }
          }
        });
      }
      await shareBargainDetail({ id }).then(async res => {
        if (!res.data.code) {
          this.bargianInfo = res.data;
          this.isEnd = res.data.bargainStatus;
          this.nickName = res.data.bargainUserList[0].nickname;
          this.headImgUrl = res.data.bargainUserList[0].headimgurl;
          let canBargain = res.data.goodsPrice - res.data.bottomPrice;
          let scene = this.$mp.query.id + ',' + this.$mp.query.goodsId + ',' +  this.$mp.query.skuId;
         wx.showLoading({
           title:"加载中",
           mask:true
         })
        const  { data } = await bargainQrcode({scene});
        _this.qrCode = data;
        wx.hideLoading();
        console.log("_this.qrCode",_this.qrCode)
        _this.getCanvas(this.nickName, this.headImgUrl, this.qrCode);

          if (res.data.isSelf) {
            this.bargainPress = false;
          } else {
            this.bargainPress = true;
          }
          this.percent = (
            res.data.alreadyBargainPrice /
            canBargain *
            100
          ).toFixed(2);
        } else {
          toast(res.data.msg);
        }
      });
     
    },


// https://shanghusm-shanghai-picture.oss-cn-shanghai.aliyuncs.com/img/xcx/material/CrKaEDrYtaYNkFN8sfJ4zA7s2YYJ4br8.png

getImage(path) {
    
      return new Promise(resolve => {
        wx.downloadFile({
          url: path,
          success(res) {
            resolve(res.tempFilePath);
          }
        });
      });
    },

    //绘制canvas
    async getCanvas(nickName, imgUrl, qrCode) {
     
      let _this = this;
      _this.canvasHeight = 392;
      _this.canvasWidth = 280;
// qrcodeUrl
//headUrl

      let [headUrl,qrcodeUrl]= await Promise.all([
        this.getImage(imgUrl),
        this.getImage(qrCode)
      ]);

       console.log("qrcodeUrl",qrcodeUrl)

         const ctx = wx.createCanvasContext("shareCanvas");

          // ctx.setFillStyle("red");
          ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);

           //绘制背景图
          ctx.drawImage(
            "/static/images/bg-share.png",
            0,
            0,
            280,
            _this.canvasHeight
          );
          ctx.save();
          ctx.beginPath(); //开始绘制
          //先画个圆
          ctx.arc(45, 45, 25, 0, Math.PI * 2, false);
          ctx.clip();
          ctx.drawImage(headUrl, 20, 20, 50, 50);
          ctx.restore();

          //绘制文字
          ctx.setFillStyle("black"); // 文字颜色：黑色
          ctx.setFontSize(20); // 文字字号：22px
          ctx.fillText(`${nickName}`, 80, 40);

          //绘制文字
          ctx.setFillStyle("#333"); // 文字颜色：黑色
          ctx.setFontSize(12); // 文字字号：22px
          ctx.fillText(`是朋友就帮我砍一刀！`, 80, 60);

          ctx.drawImage(qrcodeUrl, 40, 110, 178, 178);
            
          ctx.draw();

          // let imgWidth = 280 / 375 * ret.screenWidth;
          // let fontSize = 12 / 375 * ret.screenWidth;


          // wx.downloadFile({
          //   url: imgUrl, //头像地址
          //   success(res) {
          //     console.log("头像", res);
          //     if (res.statusCode == 200) {
          //       wx.downloadFile({
          //         url: qrCode, //二维码地址
          //         success(ret) {
          //           if (res.statusCode == 200) {
          //             console.log("二维吗", ret);
          //             let QRcode = ret.tempFilePath;
          //             // ctx.setFillStyle("transparent");
          //             ctx.fillRect(0, 0, 280, _this.canvasHeight);
          //             //绘制背景图
          //             ctx.drawImage(
          //               "/static/images/bg-share.png",
          //               0,
          //               0,
          //               280,
          //               _this.canvasHeight
          //             );
          //             ctx.save();
          //             //绘制头像
          //             ctx.beginPath(); //开始绘制
          //             //先画个圆
          //             ctx.arc(45, 45, 25, 0, Math.PI * 2, false);
          //             ctx.clip();
          //             ctx.drawImage(res.tempFilePath, 20, 20, 50, 50);
          //             ctx.restore();

          //             //绘制文字
          //             ctx.setFillStyle("black"); // 文字颜色：黑色
          //             ctx.setFontSize(20); // 文字字号：22px
          //             ctx.fillText(`${nickName}`, 80, 40);

          //             //绘制文字
          //             ctx.setFillStyle("#333"); // 文字颜色：黑色
          //             ctx.setFontSize(12); // 文字字号：22px
          //             ctx.fillText(`是朋友就帮我砍一刀！`, 80, 60);
          //             //绘制二维码

          //             // ctx.drawImage(QRcode, 40, 110, 178, 178);

          //             ctx.draw();
          //           }
          //         }
          //       });
          //     } //if
          //   } //success
          // });
    },

    //下载图片
    saveCanvas() {
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
        fileType: "jpg",
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
    },
    showShareMask() {
      if(this.isEnd == 3) {
        toast("砍价已结束");
        return;
      } else {
         this.showShare = true;
         this.isHidden = true;
      }
    },
    //分享到朋友圈
    showShareFriends() {
      (this.friendsCircle = true), (this.isHidden = true);
      this.showShare = false;
    },
    //关闭砍价弹框
    closeModal() {
      this.showhelpBargain = false;
      this.hasBargain = false;
      this.isHidden2 = false;
      this.isHidden3 = false;
      this.isHidden = false;
      this.showShare = false;
      this.friendsCircle = false;
    },
    //帮忙砍价
    _helpBargain() {
      let token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({ url: "/pages/authorization/main" });
        return;
      }
      let bargainId = this.$mp.query.id; //砍价id
      helpBargain({ bargainId }).then(res => {
        if (!res.data.code) {
          this._getBargainDetail();
          this.isHidden3 = true;
          this.bargainedMoney = res.data.price;
          this.bargainName = res.data.nickname;
          this.helpBargainPrice = res.data.bargainPrice;
          this.hasBargain = true;
        } else {
          toast(res.data.msg);
          this.isHidden3 = false;
        }
      });
    },
    //立即购买
    buyNow() {
      let bargainId = this.$mp.query.id;
      let goodsId = this.$mp.query.goodsId;
      let skuId = this.$mp.query.skuId;
      bargainVerifyGoodsStock({ goodsId, skuId }).then(res => {
        if (!res.data.code) {
          let url =
            "/pages/order/bargainConfirmOrder/main?bargainId=" + bargainId;
          wx.navigateTo({ url });
        } else {
          toast(res.data.msg);
        }
      });
    },
    //参加砍价活动
    goBargainList() {
      let url = "/pages/activity/main";
      wx.navigateTo({ url });
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  overflow-x: hidden;
}
.bargain-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 181px;
  z-index: 0;
}
.goodsinfo-card {
  position: relative;
  height: 428rpx;
  padding-top: 20px;
  z-index: 1;
  .card-bg {
    display: inline-block;
    width: 345px;
    height: 208px;
    margin: 0 32rpx;
  }
  .card-content {
    position: absolute;
    top: 60rpx;
    left: 32rpx;
    .card-goods {
      padding: 40rpx 32rpx 32rpx 32rpx;
      .goods-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        height: 200rpx;
        .goods-img {
          img {
            width: 120px;
            height: 120px;
            border-radius: 16rpx;
          }
        }
        .goods-desc {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-left: 24rpx;
          flex: 1;
          padding-right: 10px;
          .goods-title {
            font-size: 30rpx;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            display: -webkit-box; /*设置为弹性盒子*/
            -webkit-line-clamp: 2; /*最多显示5行*/
            overflow: hidden; /*超出隐藏*/
            text-overflow: ellipsis; /*超出显示为省略号*/
            -webkit-box-orient: vertical;
            word-break: break-all; /*强制英文单词自动换行*/
          }
          .bar {
            width: 30px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            font-size: 11px;
            color: rgba(255, 255, 255, 1);
            background: rgba(196, 67, 71, 1);
            border-radius: 2px;
            margin-top: 3px;
            margin-bottom: 5px;
          }
          .goods-price {
            p {
              padding: 0;
              margin: 0;
            }
            .goods-base-price {
              font-size: 30rpx;
              font-weight: 600;
              color: rgba(243, 79, 30, 1);
              .miniPrice {
                font-size: 22px;
                font-weight: 600;
                color: rgba(255, 81, 0, 1);
                margin-right: 15px;
              }
              .mini {
                display: inline-block;
                width: 39px;
                height: 14px;
                line-height: 14px;
                text-align: center;
                background: rgba(247, 243, 241, 1);
                border-radius: 2px;
                color: #ff5100;
                font-size: 11px;
              }
            }
            .goods-sell-price {
              font-size: 12px;
              color: rgba(155, 155, 155, 1);
              text-decoration: line-through;
            }
          }
        }
      }
      .goods-quantity {
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        color: rgba(153, 153, 153, 1);
        margin-top: 56rpx;
        padding-top: 32rpx;
        border-top: 2rpx dashed #d8d8d8;
        padding-right: 15px;
      }
    }
  }
}
.bargainPrice {
  background: #fff;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 25px;
  padding-bottom: 20px;
  border-radius: 8px;
  margin: 15px;
  margin-top: 5px;

  .price {
    text-align: center;
    margin-bottom: 20px;
    span {
      color: #290b0b;
      font-size: 14px;
      &.nowPrice {
        color: #c44347;
        font-size: 20px;
        font-weight: 600;
      }
      &.isbargain {
        color: #c44347;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  .progress {
    margin-bottom: 30px;
  }
  .shareFriends {
    width: 275px;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    button {
      background: linear-gradient(
        225deg,
        rgba(246, 64, 66, 1) 0%,
        rgba(208, 16, 18, 1) 100%
      );
      padding: 0;
      line-height: inherit;
      border-radius: 6px;
      color: #fff;
      font-size: 15px;
    }
  }
  .help {
    width: 275px;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(
      225deg,
      rgba(246, 64, 66, 1) 0%,
      rgba(208, 16, 18, 1) 100%
    );
    border-radius: 20px;
  }
}
.users {
  margin: 15px;
  border-radius: 8px;
  background: #fff;
  padding: 15px;
  margin-bottom: 70px;
  .user {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    &:last-of-type {
      margin-bottom: 0;
    }
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .nick {
      height: 18px;
      font-size: 13px;
      color: rgba(9, 2, 3, 1);
      flex: 1;
    }
    .cutPrice {
      color: #090203;
      font-size: 13px;
      .cutMoney {
        color: #ff5100;
        font-size: 13px;
      }
    }
  }
}
.shareCircle {
  height: 392px;
  // background: url(data:image/png;base64,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);
  // background-repeat: no-repeat;
  // background-size: cover;
  position: fixed;
  top: 100px;
  left: 50%;
  // margin-left: -140px;
  z-index: 20;
  transform: translateX(-140px);
  top: 9999px;
  &--show {
    top: 100px;
  }
  .top {
    display: flex;
    padding-left: 28px;
    padding-top: 31px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .helpOther {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .nick {
        font-size: 16px;
        font-weight: 600;
        color: rgba(9, 2, 3, 1);
      }
      .help {
        font-size: 14px;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
      }
    }
  }
  .code {
    width: 178px;
    height: 178px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWQAAAFkBAMAAADlNVwTAAAAElBMVEUAAAD/UwD/VQD/UQD/VAD/TgCxFHXfAAAABnRSTlMATQxIHhetCEKxAAAA2klEQVR42uzYwQnDQBAEweUy2AyUjDOw8k/FYIxA1nz0EXdQFUG/uxbUJzWlPpH8JVly9EDyaz/UlPbD+5e81TKG5CvJkiPJkiPJkiPJkiPJkiPJkp8xpr0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcEt3b7WM0d2S/0iWHEmWHEmWHEmW/Gl3jkoAAIEYgK6CWaxw/TMJgoyDfcuUvQRPSjllKeWUb2C5CJaKdrmBpUEpHyn/UJ4NLL1wJGEB5+Q+Ojt2X3MAAAAASUVORK5CYII=");
    background-size: cover;
    background-repeat: no-repeat;
    margin: 30px auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .saveImg {
    width: 210px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    box-shadow: 0px 8px 16px 0px rgba(15, 116, 191, 0.2);
    border-radius: 18px;
    border: 1px solid rgba(9, 2, 3, 1);
    font-size: 14px;
    font-weight: 600;
    color: rgba(9, 2, 3, 1);
    margin: 0 auto;
    position: relative;
    z-index: 100000;
    margin-top: -70px;
  }
}
.shareBottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
  .share {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
    p {
      display: flex;
      flex-direction: column;
      align-items: center;
      button {
        background: transparent;
        padding: 0;
        line-height: inherit;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          margin-bottom: 8px;
        }
        span {
          font-size: 13px;
          color: rgba(9, 2, 3, 1);
        }
        &::after {
          border: none;
        }
      }
    }
  }
  .divi {
    background: #f6f6f6;
    height: 5px;
  }
  .cancel {
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 17px;
    color: rgba(9, 2, 3, 1);
  }
}
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 15;
}
.modal {
  position: fixed;
  width: 280px;
  height: 212px;
  box-sizing: border-box;
  left: 50%;
  top: 160px;
  margin-left: -140px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 16;
  padding-bottom: 16px;
  .gold {
    width: 88px;
    height: 106px;
    margin-top: -44px;
    margin-bottom: 12px;
  }
  .helpBar {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 13px;
  }
  .mini {
    color: #333333;
    font-size: 14px;
    margin-bottom: 17px;
    .miniPrice {
      color: #f34f1e;
      font-size: 14px;
    }
  }
  .btn-help {
    width: 216px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(
      225deg,
      rgba(246, 64, 66, 1) 0%,
      rgba(208, 16, 18, 1) 100%
    );
    border-radius: 20px;
  }
  .closeModal {
    position: fixed;
    left: 50%;
    width: 34px;
    height: 34px;
    top: 400px;
    margin-left: -17px;
  }
}
.hasbargain {
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 294px;
  box-sizing: border-box;
  position: fixed;
  top: 100px;
  left: 50%;
  margin-left: -140px;
  z-index: 16;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 16px;
  .hasCut {
    color: #333;
    font-size: 15px;
    margin-bottom: 18px;
    .nickName {
      color: #ff5100;
      font-size: 15px;
    }
  }
  .cutMoney {
    font-weight: 600;
    color: #090203;
    font-size: 16px;
    span {
      color: #ff5100;
      font-size: 30px;
    }
  }
  .cutImg {
    width: 148px;
    height: 118px;
    margin: 20px 0;
  }
  .cutedPrice {
    color: #9e9e9e;
    font-size: 13px;
    margin-bottom: 10px;
    .cutedMoney {
      color: #ff5100;
      font-size: 13px;
    }
    .originalMoney {
      color: #ff5100;
      font-size: 13px;
    }
  }
  .join {
    width: 216px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(
      225deg,
      rgba(246, 64, 66, 1) 0%,
      rgba(208, 16, 18, 1) 100%
    );
    border-radius: 20px;
  }
  .closeModal {
    position: fixed;
    left: 50%;
    width: 34px;
    height: 34px;
    top: 420px;
    margin-left: -17px;
  }
}
.backHome {
  position: fixed;
  right: 20px;
  bottom: 88px;
  z-index: 100;
  img {
    width: 40px;
    height: 40px;
  }
}
.buy {
  width: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;
  z-index: 10;
  padding: 8px 15px;
  .buyNow {
    width: 345px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(254, 121, 0, 1) 0%,
      rgba(255, 81, 0, 1) 100%
    );
    border-radius: 20px;
    color: #fff;
    font-size: 15px;
  }
}
</style>
