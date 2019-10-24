<template>
    <div class="content">
        <p class="top">投诉原因</p>
        <div class="reason">
            <textarea name="" id="" placeholder="最多输入200字" maxlength="200" v-model="content" placeholder-style="color:#9B9B9B;font-size:14px;">
                
            </textarea>
        </div>
        <div class="upImgs">
            <div class="addImg" v-for="(item,index) in imgs" :key="index">
                <img :src="item" alt="">
                <img src="/static/images/icon-delImg.png" class="del" @click="delImg(index)">
            </div>
            <div class="addImg" @click="upImg">
                <img src="/static/images/upImg.png" alt="">
            </div>
        </div>
        <div class="sub">
             <form @submit="formGoTo"  report-submit="true">
                <button class="actionStyle" form-type='submit' data-name='buttonName' >提交</button>
            </form>
        </div>
    </div>
</template>
<script>
import { getOss ,complainDesigner } from "@/api/api";
import { toast ,upLoadHost } from "@/utils/index";
export default {
    data() {
        return {
            imgs:[],
            content:'',
            formId:''
        }
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data())
    },  
    methods:{
      //删除图片
      delImg(index) {
          let imgs = this.imgs;
          this.imgs.splice(index,1)
      },
      upImg() {
           wx.chooseImage({
              count: '1', //最多可以选择的图片张数,
              sizeType: ['compressed'], 
              success: res => {
                  let tempFilePaths = res.tempFilePaths[0];
                  wx.showLoading({
                    title:"上传中"
                  })
                  this.uploadImgs(tempFilePaths)
              }, //返回图片的本地文件路径列表 tempFilePaths,
              fail: () => {
                  console.log('===选择图片失败===')
              },
            });
      },

      async uploadImgs(tempFilePaths) {
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
        formGoTo(e) {
            console.log(e)
            let formId = e.mp.detail.formId;
            let content = this.content;
            let img = this.imgs.join();
            let designerUserId = this.$mp.query.designerUserId;
            let params = {
                formId,
                content,
                img,
                designerUserId
            }
            console.log("params",params)
            this.submitInfo(params);
        },
        submitInfo(params) {
            complainDesigner(params).then(res => {
                if(!res.data.code) {
                    toast("投诉成功")
                    setTimeout(() => {
                        wx.navigateBack()
                    },1000)
                } else {
                    toast(res.data.msg)
                }
            })
        }
    },
}
</script>


<style lang="less" scoped>
    .content {
        background: #fff;
        .top {
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
            padding-left: 15px;
            border-bottom: 1px solid #eee;
            font-size:14px;
            color:rgba(74,74,74,1);
            margin-bottom: 15px;
        }
         .reason {
                padding:0 15px;
                font-size: 14px;
                color: #333;
                margin-bottom: 20px;
                textarea {
                    width: 100%;
                    height: 100px;
                }
        }
        .upImgs {
            padding: 0 15px;
            display: flex;
            flex-wrap: wrap;
            .addImg {
                margin-right: 10px;
                margin-bottom: 10px;
                position: relative;
                &:nth-child(4n) {
                    margin-right: 0;
                }
                img {
                    width: 78px;
                    height: 78px;
                    &.del {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        right: 0;
                        top: 0;
                        z-index: 10;
                        padding-left: 20px;
                        padding-bottom: 20px;
                    }
                }
            }
        }
        .sub {
            position: fixed;
            z-index: 10;
            bottom: 0;
            margin: 5px 15px;
            width:345px;
            height:40px;
            line-height: 40px;
            text-align: center;
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
</style>
