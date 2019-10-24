<template>
    <div class="content" :style="showMask ? 'position:fixed;overflow:hidden;height:100%;width:100%;' :''">
        <div class="nick">
            <span class="nickName">昵称</span>
            <input type="text" v-model="nickname" placeholder="请填写" placeholder-style="color:#9B9B9B;font-size:14px;">
        </div>
        <div class="coverImg">
            <span>主页封面</span>
            <div class="upImg" v-if="img">
                <img :src="img" alt="">
                <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(1)">
            </div>
            <div class="upImg" @click="upCoverImg" v-else>
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>
        <div class="coverImg">
            <span>身份证正面</span>
            <div class="upImg" v-if="identityCardFrontImg">
                <img :src="identityCardFrontImg" alt="">
               <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(2)">
            </div>
            <div class="upImg" @click="upCardFrontImg" v-else>
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>
        <div class="coverImg">
            <span>身份证反面</span>
            <div class="upImg" v-if="identityCardBackImg">
                <img :src="identityCardBackImg" alt="">
                <img src="/static/images/icon-delImg.png" alt="" class="del" @click="del(3)">
            </div>
             <div class="upImg" @click="upCardBackImg" v-else>
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

         <div class="divi"></div>
        <div class="desc" v-if="showDesc">
            <span class="intro">简介</span>
            <textarea placeholder="请填写简介" v-model="detail" maxlength="-1" :auto-height=true placeholder-style="color:#9B9B9B;font-size:14px;">

            </textarea>
        </div>
         <div class="divi"></div>

         <div class="coverImg project">
            <span>作品</span>
            <div class="upImg" v-for="(item,index) in imgs" :key="index">
                <img :src="item" alt="">
                <img src="/static/images/icon-delImg.png" class="delwork" @click="delWork(index)">
            </div>
            <div class="upImg" @click="upWorks">
                <img src="/static/images/upImg.png" alt="">
            </div>
            <div class="sub">
                <form @submit="formGoTo"  report-submit="true">
                    <button class="actionStyle" form-type='submit' data-name='buttonName'>提交</button>
                </form>
            </div>
        </div>
        <!-- 协议 -->
        <div class="agreement" v-if="showMask">
            <p class="title">尚乎平台设计师入驻协议</p>
            <div class="agreementCont">
                 <h3 style="font-weight:700;">重要须知：</h3>
                 <p>您确认：在您开始申请入驻尚乎平台设计频道前，您已充分阅读、理解并接受本协议的全部内容，一旦您选择“同意”并开始使用本服务，即表示您同意遵循本协议之所有约定。不具备前述条件的，您应立即终止注册或停止使用本服务</p>
                 <p>尚乎平台有权随时对协议内容进行单方面的变更，并以在尚乎官网http://www.shanghusm.com/、尚乎APP、尚乎小程序等官方途径予以公布，无需另行单独通知您；若您在本协议内容公告变更后继续使用本服务，表示您已充分阅读、理解并接受修改后的协议内容，也将遵循修改后的协议内容使用本服务；若您不同意修改后的协议内容，您应停止使用本服务。</p>
                 <p>用户通过进入注册程序，即表示用户与尚乎平台已达成协议，自愿接受本服务条款的所有内容</p>
                 <h1 style="font-weight:700;">1.设计师入驻协议及条款</h1>
                 <p>1.1设计师（或设计团队）提交的所有作品必须为设计师（或设计团队）原创，不得抄袭、盗用他人作品，且版权未移交他人。若在商业应用过程中发生版权纠纷，设计师（或设计团队）须承担全责。</p>
                 <p>1.2对所有网上提交并通过审核的设计师（或设计团队）作品，尚乎平台享有对作品进行推荐、展示、出版及其它形式的推广、宣传等权利。未经作者本人同意，其他单位或个人不得将作品用作商业用途，否则，一切后果由该单位或个人承担。</p>
                 <p>1.3所有设计师（或设计团队）作品不得侵犯他人著作权，一经发现，将取消设计师相应资格，以及追回相应奖励，所有法律责任由设计师（或设计团队）本人承担。</p>
                 <p>1.4设计师（或设计团队）作品不得涉及被禁止的内容，屏蔽暴力、色情等信息，不得与国家相关法律、法规抵触。</p>
                 <p>1.5设计师（或设计团队）必须同时遵守尚乎平台用户注册协议等其他相关条款。</p>
                 <h1 style="font-weight:700;">2. 尚乎平台的基本权利和义务</h1>
                 <p style="font-weight:700;">2.1 权利篇：</p>
                 <p>2.1.1 尚乎平台有权对设计师上传的作品及其他信息进行筛选、判断、审核、编辑，并根据相关政策、法律法规和尚乎平台的规定来确定可显示或被浏览的范围的内容。</p>
                 <p>2.1.2 尚乎平台有权对客户的纠纷和投诉进行调解或按网站规则进行处理，设计师应予以配合。如果调查结果违规属实，尚乎平台有权要求设计师撤稿下架，并根据情节轻重，影响大小及损害程度对设计师进行相应的处罚。</p>
                 <p>2.1.3 尚乎平台有权将设计师上传的作品用于尚乎平台业务有关宣传推广活动的画册、纸样、布样，并无需向作者或著作权人支付费用。</p>
                 <p>2.1.4 尚乎平台有权将设计师上传的作品的缩略图免费许可给尚乎平台的VIP、SVIP客户用于宣传推广活动的画册、纸样、布样，并无需向作者或著作权人支付费用。</p>
                 <p style="font-weight:700;">2.2 义务篇：</p>
                <p>2.2.1 尚乎平台严格遵循相关知识产权保护法律法规、并对设计师的信息严格保密。</p>
                <p>2.2.2 尚乎平台不得在设计师授权范围以外，擅自使用设计师的作品，如因前述行为对设计师造成损害，尚乎平台将对设计师予以一定经济赔偿并承担相应的责任。</p>
                
                <h1 style="font-weight:700;">3. 违约责任</h1>
                <p>3.1 任何一方违反本协议内任何条款均属违约，另一方可依法追究由此造成的一切损失，并要求对方赔偿。</p>
                <p>3.2 设计师如果违反本协议，尚乎平台有权终止对设计师提供服务，收回设计师在尚乎平台注册的所有ID并保留公告、诉讼权利。</p>

                <h1 style="font-weight:700;">4. 隐私权</h1>
                <p>4.1 信息使用:</p>
                <p>4.1.1 尚乎平台不会向任何人出售或出借设计师的个人或法人信息,除非事先得到设计师的书面许可。</p>
                <p>4.1.2 尚乎平台亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播设计师的个人或法人信息。一经发现, 尚乎平台将立即终止与该用户的服务协议,查封其账号。</p>
                <p>4.1.3 设计师应当对其所获悉的尚乎平台的任何商业信息保密，否则，设计师应承担责任以及因此造成的一切损失。</p>
                <p>4.2 信息披露：设计师的个人或法人信息将在下述情况下部分或全部被披露：根据法律的有关规定,或者行政、司法机关的要求,向第三方或者行政、司法机关披露。</p>
               
               <p>5. 本协议履行过程中引起的或与本协议有关的任何争议,均应由双方通过友好协商的方式解决。协商不成的,双方应向上海尚乎数码科技有限公司所在地人民法院提起诉讼。</p>
               <p>6.本协议最终解释权归尚乎平台所有。</p>
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
import { designerAgreement ,applyDesigner ,getdesignerLabel ,getOss} from "@/api/api";
import { toast ,upLoadHost } from "@/utils/index";
export default {
    data() {
        return {
            index:0,
            nodes:"",
            nickname:"",
            img:"",//主页封面
            identityCardFrontImg:"",  //身份证正面
            identityCardBackImg:"",   //身份证反面
            works:"",  //作品
            detail:"",//简介
            imgs:[], 
            fromId:"", //推送id
            labelIdList:[],  //标签id列表
            labelList:[],
            showMask:true,
            showDesc:false,
        }
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
        // this._designerAgreement();
        this._getDesignerLabel();
    },
    methods:{
        //设计师协议
        _designerAgreement() {
            designerAgreement().then(res => {
                if(!res.data.code) {
                    console.log("设计师协议",res)
                    this.nodes = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        //获取设计师标签
        _getDesignerLabel() {
            getdesignerLabel().then(res => {
                if(!res.data.code) {    
                    this.labelList = res.data;
                } else {
                    toast(res.data.msg)
                }
            })
        },
        cancel() {
            this.showMask = false;
            wx.navigateBack();
        },
        agree() {
             this.showMask = false;
             this.showDesc = true;
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
        //上传主页封面
        upCoverImg() {
             wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                  this.uploadCoverImg(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
        },
        async uploadCoverImg(tempFilePaths) {
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
                      _this.img = `${data.host}/${g_object_name}`
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

      //上传作品
      upWorks() {
           wx.chooseImage({
              count: 9, //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  console.log("res",res)
                  for(let i = 0; i < res.tempFilePaths.length; i++) {
                        wx.showLoading({
                            title:"上传中",
                            mask:true
                        })
                      this.uploadupWorks(res.tempFilePaths[i])
                  }
                //   let tempFilePaths = res.tempFilePaths[0];
                
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
      },

      async uploadupWorks(tempFilePaths) {
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

                    console.log("_this.imgs",_this.imgs)

                },
                fail: () => {},
            });
      },

      //删除作品
      delWork(index) {
          this.imgs.splice(index,1)
      },
      //删除封面 身份证
      del(type) {
          if(type == 1) {
              this.img = '';
          } else if(type == 2) {
              this.identityCardFrontImg = '';
          } else if(type == 3) {
              this.identityCardBackImg = '';
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
            let nickname = this.nickname;
            let img = this.img;
            let identityCardFrontImg = this.identityCardFrontImg;
            let identityCardBackImg = this.identityCardBackImg;
            let works = this.imgs.join(',');
            let detail = this.detail;
            let fromId = this.fromId;
            let labels = this.labelIdList;
            
            let labelIdList = [];
            for (let i = 0; i < labels.length; i++) {
                labelIdList.push(labels[i].id)
            }
            let params = {
                nickname,
                img,
                identityCardFrontImg,
                identityCardBackImg,
                works,
                detail,
                fromId,
                labelIdList
            }
            this.submitInfo(params);
        },

         checkForm() {
            let nickname = this.nickname;
            let img = this.img;
            let identityCardFrontImg = this.identityCardFrontImg;
            let identityCardBackImg = this.identityCardBackImg;
            let works = this.imgs.join(',');
            let detail = this.detail;
            let fromId = this.fromId;
            let labels = this.labelIdList;
            if(!nickname) {
                toast("请输入昵称");
                return;
            } else if(!img) {
                toast("请上传主页封面");
                return;
            } else if(!identityCardFrontImg) {
                toast("请上传身份证正面");
                return;
            } else if(!identityCardBackImg) {
                toast("请上传身份证反面");
                return;
            } else if(!detail) {
                toast("请输入设计师简介");
                return;
            }
            return true;
        },

        //提交
        submitInfo (params) {
            if(!this.checkForm()) {
                return;
            }
            console.log("params",params)
            applyDesigner(params).then(res => {
                if(!res.data.code) {
                    console.log("申请设计师",res)
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
            padding-bottom: 15px;
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
            height: 900rpx;
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
                // margin-bottom: 60px;
                overflow-y: auto;
            }
            .btns {
                margin:20px 0;
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
