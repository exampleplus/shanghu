<template>
    <div class="content" :style="showMask ? 'position:fixed;overflow:hidden;height:100%;width:100%;' :''">
        <div class="nick">
            <span class="nickName">店铺名称</span>
            <input type="text" v-model="name" placeholder="请填写" placeholder-style="color:#9B9B9B;font-size:14px;">
        </div>
        <div class="coverImg">
            <span>身份证正面</span>
            <div class="upImg" v-if="identityCardFrontImg">
                <img :src="identityCardFrontImg" alt="">
               <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(1)">
            </div>
            <div class="upImg" @click="upCardFrontImg" v-else>
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>
        <div class="coverImg">
            <span>身份证反面</span>
            <div class="upImg" v-if="identityCardBackImg">
                <img :src="identityCardBackImg" alt="">
                <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(2)">
            </div>
             <div class="upImg" @click="upCardBackImg" v-else>
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>

          <div class="coverImg">
            <span>营业执照</span>
            <div class="upImg" v-if="businessLicense">
                <img :src="businessLicense" alt="">
                <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(3)">
            </div>
             <div class="upImg" @click="upbusinessLicense" v-else>
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>

        <div class="addLabel">
            <span class="addNew">添加标签</span>
            <div class="labelList">
                <div class="label" v-for="(item,index) in labelIdList" :key="index">
                    <span>{{item.name}}</span>
                    <img src="/static/images/dellabel.png" alt="" @click="delLabel(index)">
                </div>
                <div class="add" v-if="labelIdList.length < 6">
                     <picker @change="bindPickerChange" :value="index" :range="labelList" range-key="name">
                        <div class="picker">
                          添加标签
                        </div>
                    </picker>
                </div>
            </div>
        </div>
        <div class="sub">
            <form @submit="formGoTo"  report-submit="true">
                <button class="actionStyle" form-type='submit' data-name='buttonName' >提交</button>
            </form>
        </div>
         <div class="divi"></div>
        <!-- 协议 -->
        <div class="agreement" v-if="showMask">
            <p class="title">尚乎平台商家店铺入驻须知</p>
            <div class="agreementCont">
                <h5>入驻商家资格要求以及证明文件</h5>
                <p>1、商家申请及开展店铺经营活动，须持续的同时满足以下基本条件：</p>
                <p>（1）商家已依照中华人民共和国法律注册并领取合法有效的营业执照及取得其他经营许可，身份信息应为商家自身情况的客观表现；</p>
                <p>（2）商家提交的任何信息均真实、合法、有效，所使用的图片、文字等不侵犯任何第三方合法权益；</p>
                <p>（3）商家认可并接受尚乎平台规则内容；</p>
                <p>（4）尚乎依据国家法律法规、政策或其他规范性文件规定及经营需要可能设定的其他条件。</p>
                <p>2、证明文件明细</p>
                <p>（1）商家应依据平台规则及相应的入驻流程要求完成尚乎平台的入驻及店铺开设，签订尚乎平台所公示的需要卖家签订的相应协议。商家应向尚乎提交各项为经营店铺所必须的资质、证照、证明或其他相关文件（以下统称“证明文件”），包括但不限于营业执照、开户行证明、授权委托书、商标注册证、质检报告、法定代表人身份证正、反面复印件等，商家应向尚乎提交与原件核对一致且加盖商家公章的纸质复印件（根据实际业务提供相应资质）。</p>
                <p>（2）商家保证上述证明文件发生任何变更或更新时立即通知尚乎，并于变更或更新之日起十五个工作日内，提交更新后的文件并依据尚乎平台实时公布的流程进行相应认证。</p>
                <p>（3）商家提交虚假、过期文件、或未如期通知并提交更新文件等情形的，由商家独立承担全部法律责任。若由此导致商家的店铺信息不符合尚乎平台所公示的店铺认证条件的，尚乎有权要求商家补充提供相关资料，或者拒绝商家申请、调整卖家权限、直至终止合作。如商家造成尚乎及其他任何第三方损失的，商家还应承担全部责任并足额赔偿。</p>
                <p>（4）尚乎依据国家法律法规、政策或其他规范性文件规定及经营需要可能设定的其他条件。</p>
            </div>
            <div class="btns">
                <div class="cancel" @click="cancel">
                    取消
                </div>
                <div class="agree" @click="agree">
                    我已阅读并同意
                </div>
            </div>
        </div>
        
        <div class="mask" v-if="showMask" @click="cancel">

        </div>
    </div>
</template>
<script>
import { shopAgreement ,applyShop ,getShopLabel ,getOss } from "@/api/api";
import { toast, uploadImg } from "@/utils/index";
export default {
    data() {
        return {
            index:0,
            nodes:"",
            name:"",
            identityCardFrontImg:"",  //身份证正面
            identityCardBackImg:"",   //身份证反面
            businessLicense:'',        //营业执照
            fromId:"", //推送id
            labelIdList:[],  //标签id列表
            labelList:[],
            showMask:true
        }
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
        // this._shopAgreement();
        this._getShopLabel();
    },
    methods:{
        //店铺协议
        _shopAgreement() {
            shopAgreement().then(res => {
                if(!res.data.code) {
                    this.nodes = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        //获取店铺标签
        _getShopLabel() {
            getShopLabel().then(res => {
                if(!res.data.code) {    
                    this.labelList = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        cancel() {
            this.showMask = false;
            wx.navigateBack()
        },
        agree() {
             this.showMask = false;
        },
        //添加标签
        bindPickerChange(e) {
            let labelIdList = this.labelIdList;
            let index = e.mp.detail.value;
            let name = this.labelList[index].name;
            let id = this.labelList[index].id;
            let hasLabel = labelIdList.find ( value => value.id == id );
            if(!hasLabel) {
                labelIdList.push({name,id})
            } else {
                toast("已添加此标签")
            }
        },

        //删除标签
        delLabel(index) {
            this.labelIdList.splice(index,1)
        },
        //上传营业执照
        upbusinessLicense() {
             wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                 this.upbusinessLicenseImg(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
        },
        async upbusinessLicenseImg(tempFilePaths) {
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
                      _this.businessLicense = `${data.host}/${g_object_name}`
                  },
                  fail: () => {},
              });
      },
      //上传身份证正面
      upCardFrontImg() {
            wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                  this.uploadCardFrontImg(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
      },
      async uploadCardFrontImg(tempFilePaths) {
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
                      _this.identityCardFrontImg = `${data.host}/${g_object_name}`
                  },
                  fail: () => {},
              });
      },

      //上传身份证反面
      upCardBackImg() {
           wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                  this.uploadCardBackImg(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
      },

      async uploadCardBackImg(tempFilePaths) {
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
                      _this.identityCardBackImg = `${data.host}/${g_object_name}`
                  },
                  fail: () => {},
              });
      },

      //删除封面 身份证
      del(type) {
          if(type == 1) {
              this.identityCardFrontImg = '';
          } else if(type == 2) {
              this.identityCardBackImg = '';
          } else if(type == 3) {
              this.businessLicense = '';
          }
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
        //获取formId
        formGoTo(e) {
            console.log(e)
            this.fromId = e.mp.detail.formId;
            let name = this.name;
            let identityCardFrontImg = this.identityCardFrontImg;
            let identityCardBackImg = this.identityCardBackImg;
            let businessLicense = this.businessLicense;
            let fromId = this.fromId;
            let labels = this.labelIdList;
            
            let labelIdList = [];
            for (let i = 0; i < labels.length; i++) {
                labelIdList.push(labels[i].id)
            }
            let params = {
                name,
                identityCardFrontImg,
                identityCardBackImg,
                businessLicense,
                fromId,
                labelIdList
            }
            this.submitInfo(params);
        },

        checkForm() {
            let name = this.name;
            let identityCardFrontImg = this.identityCardFrontImg;
            let identityCardBackImg = this.identityCardBackImg;
            let businessLicense = this.businessLicense;
            if(!name) {
                toast("请输入商家名称");
                return;
            } else if(!identityCardFrontImg) {
                toast("请上传身份证正面");
                return;
            } else if(!identityCardBackImg) {
                toast("请上传身份证反面");
                return;
            } else if(!businessLicense) {
                toast("请上传营业执照");
                return;
            }
            return true;
        },

        //提交
        submitInfo (params) {
            if(!this.checkForm()) {
                return;
            }
            applyShop(params).then(res => {
                if(!res.data.code) {
                    toast("已提交申请,请耐心等待审核结果");
                    setTimeout(function(){
                         wx.navigateBack()
                    },1000)
                } else {
                    toast(res.data.msg)
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .content {
        background: #fff;
        .nick {
            display: flex;
            // align-items: center;
            padding-top: 10px;
            padding-left: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
             background: #fff;
            .nickName {
                font-size:14px;
                color:rgba(74,74,74,1);
                width: 70px;
                margin-right: 20px;
            }
            input {
                color: #333;
                font-size: 14px;
            }
        }
        .divi {
            width: 100%;
            height: 8px;
            background: #f6f6f6;
        }
        .coverImg {
            border-bottom: 1px solid #eee;
            padding-left: 15px;
            padding-bottom: 15px;
            padding-top: 15px;
            display: flex;
             background: #fff;
            span {
                font-size:14px;
                color:rgba(74,74,74,1);
                width: 70px;
                margin-right: 20px;
            }
            .upImg {
                width: 78px;
                height: 78px;
                position: relative;
                img {
                    width: 100%;
                    height:100%;
                }
                .del {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    z-index: 10;
                }
            }
        }
        .addLabel {
            padding-left: 15px;
            padding-bottom: 15px;
            padding-top: 15px;
            display: flex;
             background: #fff;
            .addNew {
                font-size:14px;
                color:rgba(74,74,74,1);
                width: 70px;
                margin-right: 20px;
            }
            .labelList {
                flex:1;
                display: flex;
                flex-wrap: wrap;
                .label {
                    width:190rpx;
                    height:64rpx;
                    line-height:64rpx;
                    background:#f6f6f6;
                    border-radius:8rpx;
                    margin-right:20rpx;
                    margin-bottom:36rpx;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    span {
                        font-size:14px;
                        color:rgba(74,74,74,1);
                        margin-right: 10px;
                        max-width: 60px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    img {
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                    }
                }
                .add{
                    width:95px;
                    height:32px;
                    line-height: 32px;
                    text-align: center;
                    border-radius:4px;
                    border:1px solid rgba(255,81,0,1);
                    font-size:14px;
                    color:rgba(255,81,0,1);
                }
            }
        }
        .desc {
            display: flex;
            padding-left: 15px;
            padding-top: 15px;
            background: #fff;
            .intro {
                font-size:14px;
                color:rgba(74,74,74,1);
                width: 70px;
                margin-right: 20px;
            }
            textarea {
                flex:1;
                font-size: 14px;
                color: #333;
                height: 200rpx;
            }
        }
        .project {
            padding-bottom: 70px;
            flex-wrap: wrap;
            .upImg {
                margin-right: 10px;
                margin-bottom: 10px;
                position: relative;
                .delwork {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    right: 0;
                    top: 0;
                    z-index: 10;
                }
            }
        }
        .sub {
                width:345px;
                margin: 15px auto;
                height:40px;
                line-height: 40px;
                text-align: center;
                position: fixed;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
                button {
                    background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
                    border-radius:20px;
                    font-size:16px;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                    &::after {
                        border:none;
                    }
                }
            }
         .agreement {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 15px;
            position: fixed;
            background: #fff;
            top: 50px;
            left: 15px;
            right: 15px;
            z-index: 20;
            height: 800rpx;
            box-sizing: border-box;
            border-radius: 8px;
            // overflow-y: auto;
            .title {
                font-size:16px;
                font-weight:600;
                color:rgba(52,51,51,1);
                text-align: center;
                margin-bottom: 20px;
            }
            .agreementCont {
                font-size:14px;
                font-weight:400;
                color:rgba(52,51,51,1);
                overflow-y: auto;
            }
            .btns {
                height: 80px;
                margin: 20px 0;
                display: flex;
                justify-content: space-between;
                .cancel {
                    width: 150px;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius:22px;
                    border:1px solid rgba(255,81,0,1);
                    font-size:16px;
                    color:rgba(255,81,0,1);
                    margin-right: 15px;
                    box-sizing: border-box;
                }
                .agree {
                    width: 150px;
                    box-sizing: border-box;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    background:#FF5100;
                    border-radius:22px;
                    font-size:16px;
                    color:rgba(255,255,255,1);
                }
            }
        }
        .mask {
            position: fixed;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 15;
        }
        
    }
</style>
