<template>
    <div class="content">
      <scroll-view class="designerHome" scroll-y="true" style="height:100vh" lower-threshold="50" @scrolltolower="loadMorematarals">
        <div class="top">
             <img :src="designerInfo.img" mode="aspectFill" v-if="designerInfo.img">
             <img v-else src="https://shanghusm-shanghai-picture.oss-cn-shanghai.aliyuncs.com/img/xcx/material/tGBX3iNfJikDC2t5RmnKN2yRekySe6P6.png" mode="aspectFit" >
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
            <div class="desc" v-if="designerInfo.detail">
                {{designerInfo.detail}}
            </div>
            <div class="sign">
                 <div class="lableList">
                    <div class="label" v-for="(label,index2) in labelList" :key="index2">{{label}}</div>
                </div>
                <div class="complaint"  v-if="isSelf == false" @click="complainDesinger">
                    <img src="/static/images/icon-warn.png" class="warn">
                    <span>投诉</span>
                </div>
            </div>
        </div>
        <div class="designDetail" v-if="designerInfo.video">
            <video :src="designerInfo.video"></video>
        </div>
        
        <div class="sticky">
             <div class="tabBar">
                <div class="tab" v-for="(item,index) in tabList" :key="index" :class="[activeIndex == index ? 'active' : '']" @click="tab(index)">
                    {{item}}
                </div>
            </div>
        </div>
        <div class="list" v-show="activeIndex == 0">
            <source-item :souceList="souceList" @detail="goSourceDetail" :hasCollectIcon="true" @collectSource="collectSource" @cancelCollectSource="cancelCollectSource"></source-item>
            <last-page :last="{length: souceList.length, lastPage: lastPage}"></last-page>
            <div class="noOrder" v-if="souceList.length <= 0">
                <img src="/static/images/noOrder.png" alt="">
                <p>没有相关素材</p>
            </div>
        </div>
        <!-- 成品 -->
        <div class="list"  v-show="activeIndex == 1">
            <product :productList="productList" @previewPt="previewPt"></product>
            <div class="noOrder" v-if="productList.length <= 0">
                <img src="/static/images/noOrder.png" alt="">
                <p>没有相关成品</p>
            </div>
             <last-page :last="{length: productList.length, lastPage: lastPage2}"></last-page>
        </div>
        <!-- 动态 -->
         <div class="dynamicList" v-if="activeIndex == 2">
             <div class="dynamic dynamicFirst">

             </div>
             <div v-for="(item,index) in trendList" :key="index">
                <div class="diffYear">
                    <img src="/static/images/circle-light.png" class="circle">
                    <span>{{item.strDate}}</span>
                </div>
                <div class="dynamic" >
                    <!-- <img src="/static/images/circle-light.png" class="circle"> -->
                    <!-- <div class="time" >
                        <span class="date"></span>
                        <span class="month"></span>
                    </div> -->
                    <div class="imgs">
                        <div v-for="(img,idx) in item.trendsList" :key="idx">
                            <img :src="img.logo" alt="" @click="previewImg(img,item.trendsList)" :lazy-load="true">
                        </div>
                    </div>
                </div>
            </div>
            <div class="noOrder" v-if="trendList.length <= 0">
                <img src="/static/images/noOrder.png" alt="">
                <p>没有相关动态</p>
            </div>
             <last-page :last="{length: trendList.length, lastPage: lastPage3}"></last-page>
        </div>
        <!-- 底部 -->
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
        </scroll-view>
    </div>
</template>
<script>
import sourceItem from '@/components/sourceItem'
import product from '@/components/product'
import lastPage from "@/components/lastPage"
import { getDesignerInfo ,getDesignerMaterial, getDesignerTrends, getUserInfo, getDesignerWorks, collect, cancelCollect } from "@/api/api";
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
            contentHeight:'',  //scroll-view高度
            materialIndex:1,
            materialSize:10,
            worksIndex:1,
            worksSize:10,
            hasNextPage:false,
            lastPage:false,
            hasNextPage2:false,
            lastPage2:false,
            hasNextPage3:false,
            lastPage3:false,
            trendIndex:1,
            trendSize:10,
            labelList:[],
            tabList:["素材","成品","动态"],
            activeIndex:0,
            productList:[],
            souceList:[],
            trendList:[],
            userId:'',
            firstYear:'',
            firstMonth:'',
            firstDay:'',

        }
    },
    
    onLoad() {
         Object.assign(this.$data, this.$options.data());
         let that = this;
         wx.getSystemInfo({
            success (res) {
                that.contentHeight = res.windowHeight;
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
        this._getDesignerTrends();
    },
    onShow() {
       wx.removeStorageSync("typeDesignerId")
       wx.removeStorageSync("collectDesigner");
        let typeMatiralId = wx.getStorageSync("typeMatiralId");
        if(typeMatiralId) {
            let isCollect = wx.getStorageSync("collect")
            let souceList = this.souceList;
            for(let i = 0; i < souceList.length; i++) {
                if(souceList[i].materialId == typeMatiralId) {
                souceList[i].isCollect = isCollect;
                }
            }
        }
         
    },

    onUnload() {
     wx.removeStorageSync("typeMatiralId")
     wx.removeStorageSync("collect")
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
        //预览成品
        previewPt(url,list) {
            let urls = [];
            for(let i = 0; i < list.length; i++) {
                urls.push(list[i].works)
            }
             wx.previewImage({
                current: url.works, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            })
        },
        //预览动态
        previewImg(url,list) {
            console.log("url",url)
            let urls = [];
            for(let i = 0; i < list.length; i++) {
                urls.push(list[i].logo)
            }
            console.log("urls",urls)

            wx.previewImage({
                current: url.logo, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            })
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
                    if(res.data.labelNames) {
                          this.labelList = res.data.labelNames.split(',');
                    }   
                } else {
                    toast(res.data.msg)
                }
            })
        },
        //收藏设计师
         _collect() {
            let typeId = this.$mp.query.designerId;
            let type = 3;
             wx.setStorageSync("typeDesignerId",typeId)
            
             wx.setStorageSync("collectDesigner", this.designerInfo.isCollect)
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
             wx.setStorageSync("typeDesignerId",typeId)
           
             wx.setStorageSync("collectDesigner", this.designerInfo.isCollect)
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

            //收藏素材
            collectSource(item) {
           
                let type = 2;
                let typeId = item.materialId;
                collect({type,typeId}).then(res => {
                    if(!res.data.code) {
                         item.isCollect = !item.isCollect;
                    } else {
                        toast(res.data.msg)
                    }
                })
            },

            //取消收藏素材
            cancelCollectSource(item) {
                let type = 2;
                let typeId = item.materialId;
                cancelCollect({type,typeId}).then(res => {
                    if(!res.data.code) {
                         item.isCollect = !item.isCollect;
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
            wx.showLoading({title:"加载中"})
            getDesignerMaterial({designerId,isSelf,pageSize,pageIndex}).then(res => {
                if(!res.data.code) {
                    wx.hideLoading();
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
        //更多
        loadMorematarals() {
            let activeIndex = this.activeIndex;
            if(activeIndex == 0) {   //更多素材
                if (!this.hasNextPage) {
                    return;
                } else {
                        this.materialIndex++;
                        this._getDesignerMaterial();
                }
            } else if (activeIndex == 1) {   //更多成品
                 if (!this.hasNextPage2) {
                    return;
                } else {
                    this.worksIndex++;
                    this._getDesignerWorks();
                }
            } else if (activeIndex == 2) {   //更多动态
                 if (!this.hasNextPage3) {
                    return;
                } else {
                    this.trendIndex++;
                    this._getDesignerTrends();
                }
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

        //设计师动态
        _getDesignerTrends() {
            let isSelf = this.isSelf;
            let designerId = this.designerId;
            let pageIndex = this.trendIndex;
            let pageSize = this.trendSize;
            getDesignerTrends({isSelf,designerId,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage3 = res.data.hasNextPage;
                    let list = res.data.list;
                    if(list.length > 0) {
                        this.firstYear = res.data.list[0].year;
                    }
                    this.trendList = this.trendList.concat(list);
                    if (!this.hasNextPage3) {
                        //最后一页
                        this.lastPage3 = true;
                    } else {
                        this.lastPage3 = false;
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
            let token = wx.getStorageSync("token");
            if(!token) {
                  let url = '/pages/authorization/main';
                  wx.navigateTo({url})
                  return;
            } else {
                let url = '/pages/sourceDetail/main?from=designer&id=' + id;
                wx.navigateTo({url})
            }
         
      },
      goDiy() {
            const token = wx.getStorageSync('token')
            if(!token) {
                    let url = '/pages/authorization/main';
                    wx.navigateTo({url});
                    return;
            } else {
                 let url = '/pages/diy/main?isShowBtn=1';
                 wx.navigateTo({url})
            }
          
      },
      //设计成品
      designerWorks() {
           const token = wx.getStorageSync('token')
           if(!token) {
                    let url = '/pages/authorization/main';
                    wx.navigateTo({url})
            } else {
                 let designerId = this.designerId;
                let url = '/pages/diy/main?designerId=' + designerId + '&isShowBtn=' + 1;
                wx.navigateTo({url})
            }
          
      },
    }
}
</script>

<style lang="less" scoped>
@import '../../common/styles/elements.less';
@import '../../common/styles/elements.css';
    .content {
        background: #fff;
        .designerHome {
            ::-webkit-scrollbar {
                width: 0;
                height: 0;
                color: transparent;
            }
        }
        
        .top {
            width: 100%;
            height: 328px;
            margin-bottom: 20px;
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
                    padding: 0 20rpx 20rpx 20rpx;
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
                            margin-bottom: 10px;
                            padding: 0 5px;
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
                        display: flex;
                        margin-bottom: 10px;
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
        .sticky {
                // position: -webkit-sticky;
                // position: sticky;
                // top: 0;
                // z-index:100;
                background: #fff;
                .tabBar {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                    overflow: auto;
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
        .diffYear {
             padding-left:15px;
            //  margin-bottom: 20px;
             position: relative;
             border-left: 2px solid #F6F6F6;
            font-size:12px;
            font-weight:600;
            color:rgba(9,2,3,1);
            .circle {
                width: 17px;
                height: 17px;
                position: absolute;
                left: -17rpx;
                top: -1px;
                z-index: 10;
            }
        }
        .dynamic {
            display: flex;
            padding-left:15px;
            // margin-bottom: 20px;
            padding-top: 20px;
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
                box-sizing: border-box;
                .shareBtn {
                    width: 100%;
                    height: 100%;
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