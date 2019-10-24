<template>
    <div class="content">
        <div class="evaList">
            <div class="goodsEva" v-for="(item,index) in orderDetail.orderDataList" :key="index">
                <div class="top">
                    <img :src="item.goodsImg" class="goodsImg">
                    <span class="desc">描述相符</span>
                    <div class="score">
                        <star @service="getGoodsGrade" :index="index"></star>
                    </div>
                </div>
                <div class="evaContent">
                    <textarea placeholder="商品满足您的期待？说说您的使用心得吧。" v-model="formItem[index].evaluateName" placeholder-style="font-size:13px;color:#9B9B9B;"></textarea>
                </div>
                <div class="pics">
                    <div class="upImg" v-for="(pic,idx) in formItem[index].imgs" :key="idx" v-if="formItem[index].imgs.length > 0">
                        <img :src="pic" alt="">
                        <img src="/static/images/delProduct.png" class="del" @click="delImg(index,idx)">
                    </div>
                    <div class="upImg" @click="uploadImgs(index)">
                        <img src="/static/images/upImg.png" alt="">
                    </div>
                </div>
                <div class="isNick">
                      <img src="/static/images/radio-check.png" alt  v-if="formItem[index].isAnonymous == true" @click="changeType(index)">
                      <img src="/static/images/radio-uncheck.png" alt v-if="formItem[index].isAnonymous == false" @click="changeType(index)">
                    <span class="nickRelanch">匿名发布</span>
                    <span class="relanchDesc">你写的评价能帮助其他小伙伴哟</span>
                </div>
            </div>
        </div>
        <div class="submit" @click="subEvaluate">
            <div class="sub">
                提交
            </div>
        </div>
    </div>
</template>
<script>
import star from "@/components/star";
import { evaluate,getOrderDetail,getOss } from "@/api/api";
import { toast ,upLoadHost} from "@/utils/index";

export default {
    data() {
        return {
            ismatiral:false,  //是否是素材
            orderDetail:{},
            formItem:[],  //评价要传的参数
        }
    },
    components:{
        star
    },
    mounted () {
    let orderDetail = JSON.parse(this.$mp.query.orderDetail);
    this.orderDetail = orderDetail;
    this.orderId = this.orderDetail.id;
    this.formItem = this.orderDetail.orderDataList.map(item=>{
      return {
        orderDataId:item.id,
        orderId:this.orderDetail.id,
        isAnonymous:true,
        mark:0,
        imgs:[],
        img:'',
        evaluateName:''
      }
    })
  },
    onLoad() {
    },
    methods:{
        getGoodsGrade(starNum,index) {
             this.formItem[index].mark = starNum;
        },
        changeType(index) {
            if(this.formItem[index].isAnonymous) {
                this.formItem[index].isAnonymous = false;
            } else {
                this.formItem[index].isAnonymous = true;
            }
        }, 

        //删除图片
        delImg(index,idx) {
            this.formItem[index].imgs.splice(idx,1)
        },
        //上传图片
        uploadImgs(index) {
            if(this.formItem[index].imgs.length >= 6) {
                toast("最多上传6张");
                return;
            }
            wx.chooseImage({
              count: 6, //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                 for(let i = 0; i < res.tempFilePaths.length; i++) {
                        wx.showLoading({
                            title:"上传中",
                            mask:true
                        })
                      this.uploadImg(res.tempFilePaths[i],index)
                  }
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {

              },
            });
        },
        async uploadImg(tempFilePaths,index) {
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
                    _this.formItem[index].imgs.push(`${data.host}/${g_object_name}`)
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

      //验证
    checkForm() {
      let formItem = this.formItem;
      for(let i = 0; i < formItem.length; i++) {
        if(formItem[i].mark == 0) {
                toast("请对商品描述相符等级做出评价");
                return;
            } else if(!formItem[i].evaluateName) {
                toast("请输入评价内容");
                return;
        } else {
            return true;
        }
      }
    },
      //提交商品评价
      subEvaluate() {
            if(!this.checkForm()) {
                return;
            }
          let formItem = this.formItem;
          for(let i = 0; i < formItem.length; i++) {
              formItem[i].img =  formItem[i].imgs.join(',')
          }
          console.log("formItem",formItem)
          evaluate(formItem).then(res => {
              if(!res.data.code) {
                  toast("发布成功");
                  if(this.$mp.query.type == 'myOrder') {   //如果来之我的订单
                        let pages = getCurrentPages(); //当前页面栈
                        if (pages.length > 1) {
                            let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                            beforePage.onLoad(); //触发父页面中的方法
                            wx.navigateBack()
                        }
                  } else {  //如果来之订单详情
                    let pages = getCurrentPages(); //当前页面栈
                    if (pages.length > 1) {
                        let beforePage = pages[pages.length - 3]; //获取上一个页面实例对象
                        beforePage.onLoad(); //触发父页面中的方法
                        wx.navigateBack({
                         delta: 2
                        })
                    }
                  }
              } else {
                  toast(res.data.msg)
              }
          })
      },
    },
}
</script>
<style lang='less' scoped>
    .content {
        .evaList {
            padding-bottom: 50px;
        }
        .goodsEva {
           background: #fff;
           margin-bottom: 10px;
          
            .top {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #eee;
                padding: 10px 15px;
                .goodsImg {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                }
                .desc {
                    font-size:13px;
                    font-weight:400;
                    color:rgba(52,51,51,1);
                    margin-right: 5px;
                }
            }
            .evaContent {
                width: 100%;
                height: 80px;
                padding: 10px 15px;
                textarea {
                    width: 100%;
                    height: 100%;
                    color: #333;
                    font-size: 14px;
                }
            }
            .pics {
                 padding: 15px;
                 border-bottom: 1px solid #eee;
                 display: flex;
                 flex-wrap: wrap;
                 margin-bottom: 10px;
                .upImg {
                    width: 78px;
                    height: 78px;
                    position: relative;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .del {
                        position: absolute;
                        right: 0;
                        top: 0;
                        z-index: 10;
                        width: 16px;
                        height: 16px;
                    }
                }
            }
            .isNick {
                display: flex;
                padding: 15px;
                img {
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                }
                .nickRelanch {
                    font-size:13px;
                    color:rgba(74,74,74,1);
                    flex: 1;
                }
                .relanchDesc {
                    font-size:13px;
                    color:rgba(155,155,155,1);
                }
            }
        }
        .submit {
             position: fixed;
             bottom: 0;
             left: 0;
             right: 0;
             background: #fff;
             padding: 15px;
            .sub {
                width:345px;
                height:40px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
                border-radius:22px;
            }
        }
    }
</style>