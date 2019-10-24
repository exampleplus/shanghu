<template>
    <div class="content">
        <div class="top">
            <img :src="designerInfo.img" alt="">
        </div>
        <div class="designIntro">
            <div class="headUrl">
                <img :src="designerInfo.headimgurl" class="avator">
                <div v-if="isSelf == false">
                    <img src="/static/images/icon-trigle-active.png" class="trigle" v-if="designerInfo.isCollect" @click="_cancelCollect">
                    <img src="/static/images/icon-trigle.png" class="trigle" v-else @click="_collect">
                </div>
            </div>
            <div class="nick">
                <div class="nickName">
                    {{designerInfo.nickname}}
                </div>
                <div class="level">
                    lv{{designerInfo.level}}
                </div>
            </div>
            <div class="desc">
                {{designerInfo.detail}}
            </div>
            <div class="sign">
                 <div class="lableList">
                    <div class="label" v-for="(label,index2) in labelList" :key="index2">{{label}}</div>
                </div>
                <div class="complaint" v-if="isSelf == false" @click="complainDesinger">
                    <img src="/static/images/icon-warn.png" class="warn">
                    <span>投诉</span>
                </div>
            </div>
           
        </div>
        <div class="designDetail" v-if="designerInfo.video">
            <video :src="designerInfo.video"></video>
        </div>
        <div class="tabBar">
            <div class="tab" v-for="(item,index) in tabList" :key="index" :class="[activeIndex == index ? 'active' : '']" @click="tab(index)">
                {{item}}
            </div>
        </div>
        <scroll-view  v-show="activeIndex == 0" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMorematarals">
            <div class="list" >
                <source-item :souceList="souceList" @detail="goSourceDetail"></source-item>
                <last-page :last="{length: souceList.length, lastPage: lastPage}"></last-page>
                <div class="noOrder" v-if="souceList.length <= 0">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关素材</p>
                </div>
            </div>
         </scroll-view>

        <!-- 成品 -->
        <scroll-view  v-show="activeIndex == 1" scroll-y="true" :style="{height: contentHeight + 'px'}" lower-threshold="50" @scrolltolower="loadMoreWorks">
            <div class="list">
                <product :productList="productList"></product>
                <last-page :last="{length: productList.length, lastPage: lastPage2}"></last-page>
                <div class="noOrder" v-if="productList.length <= 0">
                    <img src="/static/images/noOrder.png" alt="">
                    <p>没有相关成品</p>
                </div>
            </div>
        </scroll-view>
         <div class="dynamicList" v-if="activeIndex == 2">
             <div class="dynamic dynamicFirst">

             </div>
            <div class="dynamic">
                <img src="/static/images/circle-light.png" class="circle">
                <div class="time">
                    <span class="date">02</span>
                    <span class="month">8月</span>
                </div>
                <div class="imgs">
                    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                     <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                      <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                       <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                </div>
            </div>
            <div class="dynamic">
                <img src="/static/images/circle-light.png" class="circle">
                <div class="time">
                    <span class="date">02</span>
                    <span class="month">8月</span>
                </div>
                <div class="imgs">
                    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                     <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                      <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                       <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2570310251,2684465092&fm=11&gp=0.jpg" alt="">
                </div>
            </div>
        </div>
        <div class="bottomFixed">
            <div class="share">
                <button open-type="share" class="shareBtn">
                    <img src="/static/images/icon-designer-share.png" alt>
                    <span>分享</span>
                </button>
            </div>
            <div class="diy" @click="goDiy" v-if="isSelf == false">
                DIY
            </div>
            <div class="diy" v-else @click="designerWorks">
                设计成品
            </div>
        </div>
         <div class="fixedBtns">
            <div class="backHome" @click="backHome">
                <img src="/static/images/icon-home.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import sourceItem from '@/components/sourceItem'
import product from '@/components/product'
import lastPage from "@/components/lastPage"
import { getDesignerInfo ,getDesignerMaterial, getUserInfo, getDesignerWorks, collect, cancelCollect } from "@/api/api";
import { toast } from "@/utils/index";
export default {
    components:{
        sourceItem,
        product,
        lastPage
    },
    data() {
        return {
            designerInfo:{},//设计师信息
            isSelf:0, //是否设计师本人
            designerId:"", //设计师id
            contentHeight:'',
            materialIndex:1,
            materialSize:10,
            worksIndex:1,
            worksSize:10,
            hasNextPage:false,
            lastPage:false,
            hasNextPage2:false,
            lastPage2:false,
            labelList:[],
            tabList:["素材","成品","动态"],
            activeIndex:0,
            productList:[],
            souceList:[],
            userId:''
        }
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data());
         let that = this;
         wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight - 370;
            }
        })
        if(this.$mp.query.designerId) {
            this.designerId = this.$mp.query.designerId;
        }
        
        if(this.$mp.query.isSelf) {
            this.isSelf = this.$mp.query.isSelf
        }
        
        this._getDesignerInfo();
        this._getDesignerMaterial();
        this._getDesignerWorks();
        // this._getUserInfo();
    },
    onShareAppMessage(res) {
        let that = this;
        let designerName = that.designerInfo.nickname;
        let designerDesc = that.designerInfo.detail;
        return {
            title: `为您推荐优秀设计师${designerName}${designerDesc}`,
            imageUrl: that.designerInfo.img,
            path: "/pages/designerDetail/main?designerId=" + that.$mp.query.designerId
        };
    },
    methods:{
        backHome () {
             let url = '/pages/home/main';
             wx.switchTab({url})
        },
        //获取用户信息
        _getUserInfo() {
             getUserInfo().then(res => {
                 if(!res.data.code) {
                     this.userId = res.data.id;
                 } else {
                     toast(res.data.msg)
                 }
             })
        },
       _getDesignerInfo() {
            let designerId = this.$mp.query.designerId;
            let isSelf =  this.isSelf;
            getDesignerInfo({isSelf,designerId}).then(res => {
                if(!res.data.code) {
                    this.designerInfo = res.data;
                    this.labelList = res.data.labelNames.split(',');
                } else {
                    toast(res.data.msg)
                }
            })
        },
        //收藏设计师
         _collect() {
            let typeId = this.$mp.query.designerId;
            let type = 3;
            let params = {
                typeId,
                type
            }
            collect(params).then(res => {
                if(!res.data.code) {
                this.designerInfo.isCollect = true;
                } else {
                toast(res.data.msg)
                }
            })
        },
        

        //取消收藏设计师
        _cancelCollect() {
            let typeId = this.$mp.query.designerId;
            let type = 3;
            let params = {
                typeId,
                type
            }
            cancelCollect(params).then(res => {
                if(!res.data.code) {
                 this.designerInfo.isCollect = false;
                } else {
                 toast(res.data.msg)
                }
            })
        },

        //投诉设计师
        complainDesinger() {
            let designerUserId = this.$mp.query.designerId;
            let url = `/pages/complainDesigner/main?designerUserId=${designerUserId}`;
            wx.navigateTo({url})
        },
        //设计师素材
        _getDesignerMaterial() {
            let designerId = this.designerId;
            let isSelf =  this.isSelf;
            let pageIndex = this.materialIndex;
            let pageSize = this.materialSize;
            getDesignerMaterial({designerId,isSelf,pageSize,pageIndex}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    this.souceList = this.souceList.concat(list);
                    if (!this.hasNextPage) {
                        //最后一页
                        this.lastPage = true;
                    } else {
                        this.lastPage = false;
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        //更多素材
        loadMorematarals() {
             if (!this.hasNextPage) {
                return;
            } else {
                    this.materialIndex++;
                    this._getDesignerMaterial();
            }
        },

        //成品
        _getDesignerWorks() {
            let designerId = this.designerId;
            let isSelf =  this.isSelf;
            let pageIndex = this.worksIndex;
            let pageSize = this.worksSize;
            getDesignerWorks({designerId,isSelf,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    console.log("作品",res)
                    this.hasNextPage2 = res.data.hasNextPage;
                    let list = res.data.list;
                    this.productList = this.productList.concat(list);
                    if (!this.hasNextPage2) {
                        //最后一页
                        this.lastPage2 = true;
                    } else {
                        this.lastPage2 = false;
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        
        //更多作品
        loadMoreWorks() {
             if (!this.hasNextPage2) {
                return;
            } else {
                this.worksIndex++;
                this._getDesignerWorks();
            }
        },

        tab(index) {
            this.activeIndex = index;
        },
        //素材详情
       goSourceDetail(id) {
         let url = '/pages/sourceDetail/main?from=designer&id=' + id;
         wx.navigateTo({url})
      },
      goDiy() {
           let url = '/pages/diy/main';
           wx.navigateTo({url})
      },
      //设计成品
      designerWorks() {
          let designerId = this.designerId;
           let url = '/pages/diy/main?designerId=' + designerId;
           wx.navigateTo({url})
      },
    }
}
</script>

<style lang="less" scoped>
@import '../../common/styles/elements';
    .content {
        background: #fff;
        .top {
            width: 100%;
            height: 328px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .designIntro {
            width:345px;
            box-sizing: border-box;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 7px 0px rgba(0,0,0,0.06);
            border-radius:4px;
            padding: 20px 20px 25px;
            margin: 15px;
            margin-top:-132px;
            position:relative;
            z-index:10;
            .headUrl {
                display: flex;
                justify-content: space-between;
                .avator {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    margin-top: -55px;
                }
                .trigle {
                    width: 17px;
                    height: 20px;
                }

            }
            .nick {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                .nickName {
                    font-size:20px;
                    font-weight:600;
                    color:rgba(0,0,0,1);
                    margin-right: 5px;
                }
                .level {
                    height:16px;
                    line-height: 16px;
                    padding: 2px 9px;
                    text-align: center;
                    background:rgba(255,81,0,1);
                    box-shadow:0px 2px 4px 0px rgba(255,194,166,1);
                    border-radius:10px;
                    font-size:11px;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                }
            }
            .desc {
                font-size:12px;
                color:rgba(155,155,155,1);
                margin-bottom: 15px;
            }
            .sign {
                display: flex;
                align-items: center;
                     .lableList {
                         flex:1;
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
                            margin-right: 5px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .complaint {
                        font-size:12px;
                        color:rgba(155,155,155,1);
                        .warn {
                            width: 14px;
                            height: 14px;
                            vertical-align: middle;
                            margin-right: 3px;
                        }
                    }
            }
        }
        .designDetail {
            padding: 0 15px;
            video {
                width: 100%;
            }
        }
        .tabBar {
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 15px 0;
            .border-bottom(#eee);
            .tab {
                font-size:14px;
                color:rgba(155,155,155,1);
                &.active {
                    font-size:14px;
                    font-weight:600;
                    color:rgba(255,81,0,1);
                }
            }
        }
        .list {
            padding-top: 15px;
            padding-bottom: 100rpx;
            .noOrder {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding-bottom: 20px;
                img {
                    width: 119px;
                    height: 124px;
                    margin-bottom: 20px;
                }
                p {
                    font-size:14px;
                    color:rgba(153,153,153,1);
                }
            }
        }
        .dynamicList {
            margin-left: 15px;
            // padding: 15px 0;
            padding-bottom: 100rpx;
        }
        .dynamic {
            display: flex;
            padding-left:15px;
            margin-bottom: 20px;
            position: relative;
            border-left: 2px solid #F6F6F6;
            &.dynamicFirst {
                margin-bottom: 0;
                height: 30rpx;
            }
            .circle {
                width: 17px;
                height: 17px;
                position: absolute;
                left: -17rpx;
                top: 17rpx;
                z-index: 10;
            }
            .time {
                width: 60px;
                margin-right: 17px;
                .date {
                    font-size:24px;
                    font-weight:600;
                    color:rgba(9,2,3,1);
                }
                .month {
                    font-size:14px;
                    font-family:PingFangSC-Medium;
                    font-weight:600;
                    color:rgba(9,2,3,1);
                }
            }
            .imgs {
                flex:1;
                display: flex;
                flex-wrap: wrap;
                img {
                    width: 79px;
                    height: 79px;
                    margin-right: 5px;
                    margin-bottom: 10px;
                }
            }
        }
        .bottomFixed {
            position: fixed;
            display: flex;
            bottom: 10px;
            justify-content: space-between;
            z-index: 100;
            padding: 0 15px;
            .share {
                width:123px;
                height:40px;
                border-radius:20px;
                border:1px solid rgba(236,236,236,1);
                margin-right: 15px;
                background: #fff;
                .shareBtn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    padding: 0;
                    border-radius: 0;
                     &::after {
                        border: none;
                    }
                     img {
                        width: 20px;
                        height: 20px;
                        margin-right: 3px;
                    }
                    span {
                        font-size:14px;
                        color:rgba(9,2,3,1);
                    }
                }
               
            }
            .diy {
                width:207px;
                height:40px;
                line-height: 40px;
                text-align: center;
                background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
                border-radius:20px;
                font-size:16px;
                color:rgba(255,255,255,1);
            }
        }
        .fixedBtns {
            position: fixed;
            bottom: 90px;
            right: 0;
            z-index: 100;
            .backHome {
                width: 56px;
                height: 56px;
                text-align: center;
                img {
                    width:40px;
                    height: 40px;
                }
            }
        }
    }
</style>