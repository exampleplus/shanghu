<template>
  <div class="content">
    <div class="goodsInfo" @click="goodsDetail(afterSaleInfo.goodsId)">
      <div class="goodsContent">
        <div class="goodsWrapper">
          <div class="goodsImg">
            <img :src="afterSaleInfo.goodsImg" alt>
          </div>
          <div class="goodsIntro">
           <div class="goodsName">{{afterSaleInfo.goodsName}}</div>
            <div class="goodsSize">
              <span>{{afterSaleInfo.skuName}}</span>
            </div>
            <div class="goodsMoney">
              <p>
                <span class="goodsPrice">￥{{afterSaleInfo.goodsPrice}}</span>
                <span class="originalPrice">￥ {{afterSaleInfo.goodsMarketPrice}}</span>
                <span class="goodsNum">x {{afterSaleInfo.goodsNum}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="quit">
        <picker value="quitIndex" :range="changeArray" range-key="name" @change="quitChange" class="pick">
            <div class="picker">
                <span class="reason">退换货</span>
                <span>{{quitSelect}}</span>   
            </div>
            <img src="/static/images/user-arrow-right.png" class="arrow">
        </picker>

        <picker value="index2" :range="quitReasonArray" @change="qiutReason" class="pick">
            <div class="picker">
                <span class="reason">退换原因</span>
                <span>{{quitReason}}</span>   
            </div>
            <img src="/static/images/user-arrow-right.png" class="arrow">
        </picker>
        <div class="desc" v-if="refundType == 1">
            <span>退款说明:</span>
            <input type="text" v-model="messages" placeholder="请输入退款说明" placeholder-style="font-size:14px;color:#9B9B9B">
        </div>
        <div class="desc" v-else>
            <span>换货说明:</span>
            <input type="text" v-model="messages" placeholder="请输入换货说明" placeholder-style="font-size:14px;color:#9B9B9B">
        </div>
        <div class="desc">
            <span>快递公司:</span>
            <input type="text" v-model="expressName" placeholder="请输入快递公司名称" placeholder-style="font-size:14px;color:#9B9B9B">
        </div>
        <div class="desc">
            <span>快递单号:</span>
            <input type="text" v-model="expressNumber" placeholder="请输入快递单号" placeholder-style="font-size:14px;color:#9B9B9B">
        </div>
    </div>
    <div class="quitMoney">
        <span class="quitText">退款金额</span>
        <span class="money" v-if="refundType == 1">{{afterSaleInfo.orderAmount}}</span>
        <span class="money" v-else>0</span>
    </div>

    <div class="feedback"> 
        <p>上传商品图片</p>
        <div class="imgs">
          <div class="imgItem" v-for="(item,index) in imgs" :key="index" v-if="imgs.length > 0"> 
            <img :src="item" class="feedImg">
            <img src="/static/images/delProduct.png" class="del" @click="delImg(index)">
          </div>
          <div class="imgItem">
            <img src="/static/images/upImg.png" class="upImg" @click="uploadImgs">
          </div>
        </div>
    </div>

    <div class="submit" @click="submit">
        提交
    </div>
  </div>
</template>
<script>
import {upImgs, applyAfterSale, getOss} from '@/api/api';
import {toast ,upLoadHost} from '@/utils/index'
export default {
  data() {
    return {
        orderInfo:{},
        afterSaleInfo:{},   //申请售后的商品信息
        quitIndex:0,
        quitSelect:"",
        changeArray:[{name:'退货',refundType:1},{name:'换货',refundType:2}],
        quitReasonIndex:0,
        quitReason:"",
        refundType:'', //售后类型 1退货 2换货
        messages:'',//退货说明
        quitReasonArray:["不想要了","不合适"],
        imgs:[],  //上传的图片
        orderDataId:'',//订单id
        expressName:'',//快递公司名称
        expressNumber:''  //快递单号
    };
  },
  onLoad() {
    this.quitSelect = '';
    this.quitReason = '';
    this.messages = '';
    this.imgs = [];

    let orderInfo = JSON.parse(this.$mp.query.orderInfo);
    this.orderInfo = orderInfo;
    let index = this.$mp.query.index;
    this.afterSaleInfo =  this.orderInfo.orderDataList[index];
  },
  methods:{
    //退换货
      quitChange(e) {
          let index = e.mp.detail.value;
          this.quitSelect = this.changeArray[index].name;
          this.refundType = this.changeArray[index].refundType;
      },

      //退款原因
      qiutReason(e) {
           let index = e.mp.detail.value;
           this.quitReason = this.quitReasonArray[index]
      },

      delImg(index) {
        this.imgs.splice(index,1)
      },
      //商品详情
      goodsDetail(goodsId) {
            let url = '/pages/goodsDetail/main?goodsId=' + goodsId;
            wx.navigateTo({url})
      },
      //上传图片
      uploadImgs() {
         wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                  this.uploadImg(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
      },
       async uploadImg(tempFilePaths) {
          let _this = this;
           const { data } = await getOss({})
           let g_object_name = data.dir + _this.random_string() + _this.get_suffix(tempFilePaths);
           wx.uploadFile({
                url: data.host, //开发者服务器 url
                filePath: tempFilePaths, //要上传文件资源的路径
                name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                formData:{
                    'name': tempFilePaths,
                    'OSSAccessKeyId': data.accessid,
                    'policy': data.policy,
                    'Signature': data.signature,
                    'key': g_object_name,
                    'success_action_status': '200'
                },
                success: ret => {
                    wx.hideLoading();
                    _this.imgs.push(`${data.host}/${g_object_name}`)
                },
                fail: () => {},
            });
      },

      //获取随机数
        random_string(len) {
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        //获取后缀名
        get_suffix(filename) {
            var pos = filename.lastIndexOf('.')
            var suffix = ''
            if (pos != -1) {
                suffix = filename.substring(pos)
            }
            return suffix;
        },

        //提交
        submit() {
          let messages = this.messages;
          let refundType = this.refundType;
          let index = this.$mp.query.index;
          let orderDataId = this.orderInfo.orderDataList[index].id;
          let quitReason = this.quitReason;
          let img = this.imgs.join(',');
          let expressName = this.expressName;
          let expressNumber = this.expressNumber;
          if(refundType == "") {
            toast("请选择退换货");
            return;
          } else if(quitReason == "") {
              toast("请选择退换货原因");
              return;
          }
          applyAfterSale({messages,refundType,orderDataId,img,expressName,expressNumber}).then(res => {
            if(!res.data.code) {
              toast("申请成功");
              wx.navigateBack({
                delta:1
              })
            } else {
              toast(res.data.msg)
            }
          })
        },

  },
};
</script>
<style lang="less" scoped>
.content {
  .goodsInfo {
      background: #fff;
      padding: 12px 15px;
      margin-bottom: 10px;
    .goodsContent {
      margin-bottom: 10px;
      .goodsWrapper {
        display: flex;
        .goodsImg {
          width: 96px;
          height: 96px;
          margin-right: 11px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
        .goodsIntro {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .goodsName {
            font-size: 15px;
            font-weight: 400;
            color: rgba(9, 2, 3, 1);
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .goodsSize {
            font-size: 12px;
            font-weight: 400;
            color: rgba(155, 155, 155, 1);
          }
          .goodsMoney {
            p {
              display: flex;
              align-items: center;
              .goodsPrice {
                font-size: 16px;
                color: rgba(255, 81, 0, 1);
                margin-right: 5px;
                font-weight: 600;
              }
              .originalPrice {
                flex: 1;
                font-size: 12px;
                color: rgba(155, 155, 155, 1);
                text-decoration: line-through;
              }
              .goodsNum {
                font-size: 14px;
                color: rgba(9, 2, 3, 1);
              }
            }
          }
        }
      }
    }
  }
  .quit {
      background: #fff;
      .pick {
         position: relative;
         padding: 14px 15px;
         border-bottom:1px solid #eee;
         font-size:14px;
         color:rgba(74,74,74,1);
         .reason {
             margin-right: 10px;
         }
        .arrow {
              width: 6px;
              height: 12px;
              position: absolute;
              right:15px;
              top:50%;
              margin-top:-6px;
          }
      }
      .desc {
          display: flex;
          align-items: center;
          padding: 14px 15px;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
           span {
                font-size:14px;
                color:rgba(74,74,74,1);
                margin-right: 5px;
           }
           input {
               flex: 1;
           }
      }
  }
   .quitMoney {
       display: flex;
       align-items: center;
       padding: 14px 15px;
       background: #fff;
       margin-bottom: 10px;
       .quitText {
            font-size:14px;
            font-weight:400;
            color:rgba(74,74,74,1);
            margin-right: 5px;
       }
       .money {
            font-size:14px;
            font-weight:400;
            color:rgba(255,81,0,1);
       }
  }
  .feedback {
      padding: 14px 15px;
      background: #fff;
      padding-bottom: 120rpx;
      p {
        font-size:14px;
        font-weight:400;
        color:rgba(74,74,74,1);
        margin-bottom: 20px;
      }
      .imgs {
        display: flex;
        flex-wrap: wrap;
        .imgItem {
          width: 78px;
          height: 78px;
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;
          .feedImg {
            width: 78px;
            height: 78px;
          }
          .del {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 10;
            width: 16px;
            height: 16px;
          }
          .upImg {
            width: 78px;
            height: 78px;
            margin-bottom: 10px;
        }
        }
      }
     
  }
  .submit {
      position: fixed;
      width:345px;
      height:40px;
      line-height: 40px;
      text-align: center;
      bottom: 10px;
      left: 16px;
      right: 16px;
      z-index: 10;
      background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
      border-radius:22px;
      font-size:16px;
      font-weight:600;
      color:rgba(255,255,255,1);
  }
}
</style>
