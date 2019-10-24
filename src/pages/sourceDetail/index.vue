<template>
    <div class="content">
        <div class="sourceContent">
            <div class="souceItem">
                <div class="souceImg">
                    <img :src="materialInfo.logo +'?x-oss-process=image/resize,w_320' " alt="">
                </div>
                <div class="sourceInfo">
                    <div class="sourceName">
                        <span class="name">{{materialInfo.name}}</span>
                        <img src="/static/images/icon-trigle-active.png" class="trigle" v-if="materialInfo.isCollect" @click="_cancelCollect(materialInfo.isCollect,materialInfo.materialId)">
                        <img src="/static/images/icon-trigle.png" class="trigle" v-else @click="_collect(materialInfo.isCollect,materialInfo.materialId)">
                    </div>
                    <div class="price">
                        <span>￥{{materialInfo.price}}</span>
                    </div>
                    <div class="souceDesc">
                        {{materialInfo.detail}}
                    </div>
                </div>
            </div>
        </div>
         <div class="souceIntro">
             <div class="sourceText">
                 素材标签
             </div>
            <div class="lableList">
                <div class="label" v-for="(item,index) in materialInfo.labelInfoList" :key="index">{{item.name}}</div>
            </div>
        </div>
        <div class="videos" v-if="materialInfo.video">
            <video :src="materialInfo.video"></video>
        </div>
        <div class="rich" v-if="materialInfo.richText">
            <wxParse :content="materialInfo.richText" mode="aspectFit" noData="" /> 
        </div>
        <!-- 设计师本人查看 -->
        <div class="bottom" v-if="isDesignerSelf">
             <div class="bargain" @click="designWorks">
                设计成品
            </div>
        </div>
         <div class="bottom" v-else>
            <div class="buy" @click="diy">
                <img src="/static/images/icon-addCart.png" alt="">
                <span>应用素材</span>
            </div>
            <div class="bargain" @click="checkDesigner" v-if="showDesigner && materialInfo.designerId">
                查看设计师
            </div>
        </div>
    </div>
</template>
<script>
import { materialDetail, collect, cancelCollect, getUserInfo } from '@/api/api';
import {toast} from '@/utils/index'
import wxParse from 'mpvue-wxparse'
export default {
    data() {
        return {
            showDesigner:true,
            materialInfo:{},
            isDesignerSelf:false
        }
    },
     components: {
        wxParse
    },
    onLoad() {
        wx.removeStorageSync("typeMatiralId")
        wx.removeStorageSync("collect")
        this.showDesigner = true;
        this.isDesignerSelf = false;
        if(this.$mp.query.from) {   //从设计师首页进入
            this.showDesigner = false;
        }
        this._materialDetail();
    },
    onShow() {
       
    },
    methods:{
        async _materialDetail() {
            wx.showLoading({title:"加载中"})
            let id  = this.$mp.query.id;
            const { data } = await getUserInfo({})
            let userId = data.id; //用户id
            materialDetail({id}).then(res => {
                if(!res.data.code) {
                    wx.hideLoading();
                    this.materialInfo = res.data;
                    if(userId == res.data.designerId) {   //如果用户id和设计师id相同 代表是设计师本人
                        this.isDesignerSelf = true;
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        preview(src,e) {
             let urls = [];
             urls.push(e.mp.currentTarget.dataset.src)
            wx.previewImage({
                current: src, // 当前显示图片的http链接
                urls:urls  // 需要预览的图片http链接列表
            })
        },
        //应用素材
        diy() {
             const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let materialId = this.materialInfo.materialId;
                let url = '/pages/diy/main?materialId=' +  materialId + '&isShowBtn=1';
                wx.navigateTo({url})
            }
             
        },
        //设计成品
        designWorks() {
              const token = wx.getStorageSync('token')
            if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url});
                return;
            } else {
                let designerId = this.materialInfo.designerId;
                let url = '/pages/diy/main?designerId=' + designerId + '&isShowBtn=' + 1;
                wx.navigateTo({url})
            }
        },
        //取消收藏
        _cancelCollect(isCollect,id) {
              wx.setStorageSync("typeMatiralId",id)
              cancelCollect({typeId:id,type:2}).then(res => {
                if(!res.data.code) {
                    this.materialInfo.isCollect = false;
                    wx.setStorageSync("collect", this.materialInfo.isCollect)
                } else {
                    toast(res.data.msg)
                }
            })
        },

        //收藏
        _collect(isCollect,id) {
            wx.setStorageSync("typeMatiralId",id)
            collect({typeId:id,type:2}).then(res => {
               if(!res.data.code) {
                this.materialInfo.isCollect = true;
                wx.setStorageSync("collect", this.materialInfo.isCollect)
               } else {
                   toast(res.data.msg)
               }
           })
            
        },
        //查看设计师
        checkDesigner() {
            let isSelf = 0;
            let designerId = this.materialInfo.designerId
            let url = '/pages/designerDetail/main?isSelf=' + isSelf + '&designerId=' + designerId;
            wx.navigateTo({url})
        },
    }
}
</script>
<style lang="less" scoped>
@import '../../common/styles/elements';
.content {
    background: #fff;
}
.sourceContent {
    .border-bottom(#eee);
    .souceItem {
        display: flex;
        padding: 0 10px 10px 15px;
        .souceImg {
            width:110px;
            height:110px;
            border-radius:6px;
            margin-right: 15px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .sourceInfo {
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .sourceName {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .name {
                    font-size:16px;
                    font-family:PingFangSC-Medium;
                    font-weight:600;
                    color:rgba(9,2,3,1);
                }
                .trigle {
                    width: 13px;
                    height: 15px;
                    padding: 0 20rpx 20rpx;
                }
            }
            .price {
                    font-size:20px;
                    font-weight:600;
                    color:rgba(255,81,0,1);
                }
            .souceDesc {
                font-size:13px;
                font-weight:400;
                color:rgba(155,155,155,1);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient: vertical;
            }
        }
    }
}

 .souceIntro {
     padding: 15px 10px 10px 15px;
     display: flex;
     .sourceText {
        font-size:13px;
        font-weight:400;
        color:rgba(74,74,74,1);
        margin-right: 10px;
        width:110px;
        text-align: center;
     }
    .lableList {
        display: flex;
        flex-wrap: wrap;
        .label {
            box-sizing: border-box;
            width: 61px;
            height: 17px;
            text-align: center;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAiCAYAAACQhM1+AAADJElEQVR4Xu2aT0wTQRSH39tAut0/U4IkGi4EjZ5EvYN6B+MdEu82erfRu0TvNnqXxDsY7qCevNDoucYDYoiRnZ12t6TdZ1qCEaX09eRs+nrdN7vffL920jY/hCFeLWOuZdTZGWKJjFpggBDWcRiOxOhVIKoMs0Zm/78BAlhmB01E2GroOhHM/H90IeAaQIC4EKgL7KATrW8C0hb3ATJnhwEH8XUhUPfYQaeNqEoZlO3AFwquAXRg0fVLm6ygiT6Op+byNwA4x32AzFlhYN8N1DQitllBN7S+4yCtW4EuEGwDCPDCDUsPuwtYQbdMvJZRtsJ+ggxaYYAI5z2lPrCCJiI/jaPvgOhbQS8QLAOIUC/46hIiEivoljErGXXWWHeXIYsM4NNiqJ4cAw08uhMdvQWERYt2ICgMAw44Vwth+JkVNGk9lSLtAsA4494yYokBRNxxA3XjT5wzP9FpIy5TllUt4RcMpgEH8VEhUM/ZQSdx9A4A5pn3lzELDCBiljntWc+b/MoKOkmSGWgf1rk/wSzYoyD0DOBWMVS3/5bR9+huGV3JiFbFXr4MoOPcd/3wFTvo1OgaEc3la5ujTYuIh4cZTCulfrCCbhkzl1GnNtra8rd7RFh3g9Ld08hPPbqlYJC/kLvEDsByISy9YQXdLRiksa4DSsEgZ3EbN1DnEbHJCrrZ1AvYoe2cbXLkcY8LBv1E/HN0p3FUJZCCQd7eOeiMLbq+v8kK+qhgcGUXgKbyttHR5sV9Nwh7BQNW0GkjWqIMNkZbWv52TwBVLyw9OIv8xNGdmGgNCKRgkLOsiXDBU+o9K2ja2/NTz5WCQc5CBoIvbqguHhcMBh7dTROtIIEUDPIWNNJqMZh4PAj799GdmmiDCJYGLZDrdhloQ2cuDCc/DaLqBa21nhqXgsEgV9ZdJ6CaF05c54D1gk7jgzIBSsGAY8yiGQexUgjUMw5SL+gkjrr/hC1wFsiMHQaOCgZjs57nnSgY9P0yliQ/Z6DtSMHAjvyGoMDtYqhucRdgU+sKohQMuMJsmUOgshtOvOTyYBIf1ABQCgZcYxbMnVUw6If3CyFYBfjcFNUoAAAAAElFTkSuQmCC");
            background-repeat: no-repeat;
            background-size: cover;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 81, 0, 1);
            margin-bottom: 10px;
            margin-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
.videos {
    width: 100%;
    height: 209px;
    margin-bottom: 10px;
    video {
        width: 100%;
        height: 100%;
    }
}
.rich {
    font-size: 14px;
    padding-bottom: 55px;
    .wxParse {
        width: 100%!important;
        .img {
            width: 100%!important;
            vertical-align: middle;
        }
    }
}
.bottom {
    position: fixed;
    bottom:0px;
    left:0;
    right:0;
    z-index: 100;
    height:42px;
    background:rgba(255,255,255,1);
    padding:8px 15px;
    display: flex;
    justify-content: space-between;
    .buy {
        flex:1;
        height:80rpx;
        text-align:center;
        border-radius:40rpx;
        border:2rpx solid #ececec;
        display:flex;
        align-items:center;
        justify-content:center;
       
        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 2px;
        }
        span {
            font-size:14px;
            font-weight:400;
            color:rgba(9,2,3,1);
        }
    }
    .bargain {
        flex:1;
        margin-left: 15px;
        height:40px;
        line-height: 40px;
        text-align: center;;
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:20px;
        font-size:16px;
        font-weight:600;
        color:rgba(255,255,255,1);
    }
}
</style>
