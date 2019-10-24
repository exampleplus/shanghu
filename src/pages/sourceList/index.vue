<template>
  <div class="content">
    <div class="top">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search" />
        <input type="text" placeholder="搜索素材"  v-model="searchName" confirm-type="search"  @confirm="search"/>
      </div>
      <div class="filter" @click="showLabels">
        <img src="/static/images/filterStroe.png" alt />
      </div>
    </div>
    <div class="list">
        <source-item :souceList="sourceList" :hasCollectIcon="hasCollectIcon" @collectSource="_collect" @cancelCollectSource="_cancelCollect" @detail="goSourceDetail"></source-item>
    </div>
    <div class="nodata" v-if="sourceList.length <= 0 && hasData == false">
        <img src="/static/images/nosearch.png" alt="">
        <p>抱歉，没有找到相关内容</p>
    </div>
     <last-page :last="{length: sourceList.length, lastPage: lastPage}"></last-page>
     <div class="mask" v-if="isHidden" @click="cancel"></div>
    <div class="labelFilter" v-if="isHidden">
      <div class="levelOne">
        <i></i>
        <span>标签</span>
        <i></i>
      </div>
      <div class="labelWrapper">
        <div class="label" :class="[!isAll ? 'act' : '']" @click="selAll">
          全部
        </div>
        <div class="label" v-for="(item,index) in labelList" :key="index" :class="[item.selected == true ? 'act':'']" @click="filterLabel(item)">
          {{item.name}}
        </div>
      </div>
      <div class="btns">
        <div class="cancelBtn" @click="cancel">
          取消
        </div>
        <div class="confirmBtn" @click="confirm">
          确认
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getLabel,typeSearch,collect,cancelCollect} from '@/api/api';
import {toast} from '@/utils/index'
import sourceItem from '@/components/sourceItem'
import lastPage from "@/components/lastPage"
export default {
    components:{
        sourceItem,
        lastPage
    },
  data() {
    return {
        hasCollectIcon:true,
        isHidden:false,
        type:5,
        searchName:'',
        sourceList:[],
        labelList:[],// 标签列表
        pageIndex:1,
        pageSize:10,
        idList:'',
        hasNextPage:false,
        lastPage:false,
        hasData:true
    };
  },
  onUnload() {
     wx.removeStorageSync("typeMatiralId")
     wx.removeStorageSync("collect")
  },
  onShow() {
    let typeMatiralId = wx.getStorageSync("typeMatiralId");
    if(typeMatiralId) {
      let isCollect = wx.getStorageSync("collect")
      let sourceList = this.sourceList;
      for(let i = 0; i < sourceList.length; i++) {
        if(sourceList[i].materialId == typeMatiralId) {
          sourceList[i].isCollect = isCollect;
        }
      }
    }
  },
  onLoad() {
       Object.assign(this.$data, this.$options.data());

      if(this.$mp.query.type) {
        this.type = this.$mp.query.type
      }
      if(this.$mp.query.searchName) {
        this.searchName = this.$mp.query.searchName
      }
      this._getLabel();
      this.initData();
  },

 onReachBottom() {
    let that = this;
    that.loadMore();
  },
  computed:{
      isAll() {
        let  selList = this.labelList.filter(ele => ele.selected);
        if(selList.length > 0) {
            return true;
        } else {
            return false;
        }
     }
  },
  methods:{
      _getLabel() {
          let _this = this;
          getLabel().then(res => {
              if(!res.data.code) {
                  _this.labelList = res.data;
                  _this.labelList.map(function(item) {
                    _this.$set(item, "selected", false);
                  });
              } else {
                  toast(res.data.msg)
              }
          })
      },
    //收藏
    _collect(item) {
      
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

    //取消收藏
    _cancelCollect(item) {
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
    showLabels() {
      this.isHidden = true;
    },
    cancel() {
       this.isHidden = false;
    },
    //点击筛选
    filterLabel(item) {
        item.selected = !item.selected

    },
    //选择全部
    selAll() {
        let _this = this;
         _this.labelList.map(function(item) {
            _this.$set(item, "selected", false);
        });
    },
     search() {
      this.sourceList = [];
      let searchName = this.searchName;
      let type = this.type;
      this.pageIndex = 1;
      let idList = this.idList;
      this.initData();
    },
     // 上拉加载更多
    loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this.initData();
        }
      },
    initData() {
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;
        let type = this.type;
        let searchName = this.searchName;
        let idList = this.idList;
        wx.showLoading({title:"加载中"})
        typeSearch({pageIndex,pageSize,type,searchName,idList}).then(res => {
            if(!res.data.code) {
                wx.hideLoading();
                this.hasNextPage = res.data.hasNextPage;
                let list = res.data.list;
                if(list.length > 0) {
                  this.hasData = true;
                } else {
                  this.hasData = false;
                }
                this.sourceList = this.sourceList.concat(list);
                this.sourceList.map(ele => {
                  let obj = ele;
                  obj.labelInfoList = obj.labelInfoList.slice(0,3);
                  return obj;
                })
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

    //素材详情
    goSourceDetail(id) {
         let token = wx.getStorageSync("token");
            if(!token) {
                  let url = '/pages/authorization/main';
                  wx.navigateTo({url})
                  return;
            }  else {
               let url = '/pages/sourceDetail/main?id=' + id;
              wx.navigateTo({url})
            }
     
    },
    confirm() {
        let selLabel = this.labelList.filter(ele => ele.selected);
        let ids = [];
        selLabel.forEach(element => {
            ids.push(element.id)
        });
        let idList = ids.join(',')
        this.idList = idList;
        this.pageIndex  = 1;
        this.sourceList = [];
        this.initData();
        this.cancel();
    },
  }
};
</script>

<style lang="less" scoped>
.content {
  .top {
    display: flex;
    padding: 40rpx;
    background: #fff;
    .search {
      flex: 1;
      position: relative;
      margin-right: 15px;
      .icon-search {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        top: 16rpx;
        left: 22rpx;
      }
      input {
        height: 60rpx;
        background: #f5f5f5;
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #9b9b9b;
        padding-left: 60rpx;
      }
    }
    .filter {
      width: 18px;
      height: 15px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
  .list {
      background: #fff;
      margin-bottom: 10px;
  }
  .nodata {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
      img {
          width: 118px;
          height: 115px;
          margin-bottom: 30px;
      }
      p {
            font-size:14px;
            color:rgba(153,153,153,1);
      }
  }
 .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  .labelFilter {
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 10;
    padding-bottom: 24px;
    .levelOne {
      display: flex;
      align-content: center;
      justify-content: center;
      margin-bottom: 20px;
      i {
        display: inline-block;
        height: 1px;
        width: 24px;
        margin-top: 9px;
        background: #edebeb;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(43, 35, 17, 1);
        margin: 0 10px;
      }
    }
    .labelWrapper {
      display: flex;
      flex-wrap: wrap;
      padding:0 25px;
      .label {
        width:93px;
        height:32px;
        line-height: 32px;
        text-align: center;
        font-size:14px;
        font-weight:400;
        color:rgba(74,74,74,1);
        background:rgba(246,246,246,1);
        border-radius:4px;
        margin-right: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
      .act {
          background:rgba(253,244,242,1);
          border:1px solid rgba(255,81,0,1);
          color: #FF5100;
          font-weight: 600;
        }
    }
    .btns {
      padding:0 25px;
      display: flex;
      justify-content: space-between;
      & > div {
        width:155px;
        height:40px;
        line-height: 40px;
        text-align: center;
        border-radius:22px;
        font-size: 16px;
        &.cancelBtn {
          border:1px solid rgba(255,81,0,1);
          color: #FF5100;
        }
        &.confirmBtn {
          color: #fff;
          background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        }
      }
    }
  }
}
</style>
