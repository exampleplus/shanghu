<template>
  <div class="content">
    <div class="top">
      <div class="search">
        <img src="/static/images/search.png" class="icon-search" />
        <input type="text" placeholder="搜索设计师" v-model="searchName" confirm-type="search"  @confirm="search"/>
      </div>
      <div class="filter" @click="showLabels">
        <img src="/static/images/filterStroe.png" alt />
      </div>
    </div>
    <div>
        <designer-item :designerList="designerList" @designerHome="designerHome"></designer-item>
    </div>
     <div class="nodata" v-if="designerList.length == 0 && hasData == false">
        <img src="/static/images/nosearch.png" alt="">
        <p>抱歉，没有找到相关内容</p>
    </div>
     <last-page :last="{length: designerList.length, lastPage: lastPage}"></last-page>
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
import designerItem from '@/components/designerItem'
import { typeSearch ,getDesignerlabel ,getUserInfo} from '@/api/api'
import {toast} from '@/utils/index'
import lastPage from "@/components/lastPage";
export default {
    components:{
        designerItem,
        lastPage
    },
  data() {
    return {
        type:4,
        searchName:"",
        pageIndex:1,
        pageSize:10,
        hasNextPage:false,
        lastPage:false,
        isHidden:false,
        labelList:[],
        idList:"",
        designerList:[],
        hasData:true
    };
  },
  computed:{
      isAll() {
        let selList = this.labelList.filter(ele => ele.selected);
        if(selList.length > 0) {
            return true;
        } else {
            return false;
        }
     }
  },
  onLoad() {
     Object.assign(this.$data, this.$options.data());
    if(this.$mp.query.type) {
      this.type = this.$mp.query.type
    }
    if(this.$mp.query.searchName) {
      this.searchName = this.$mp.query.searchName;
    }
    this._getDesignerlabel();
    this.initData();
  },
  onShow() {
     
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },
  methods:{
    _getDesignerlabel() {
      let _this = this;
      getDesignerlabel().then(res => {
        if(!res.data.code) {  
          this.labelList = res.data;
          _this.labelList.map(function(item) {
            _this.$set(item, "selected", false);
          });
        } else {
          toast(res.data.msg)
        }
      })
    },
     loadMore(e) {
        if (!this.hasNextPage) {
          return;
        } else {
          this.pageIndex++;
          this.initData();
        }
      },
    initData() {
      let type = this.type;
      let searchName = this.searchName;
      let pageIndex = this.pageIndex;
      let pageSize = this.pageSize;
      let idList = this.idList;
      typeSearch({type,searchName,pageIndex,pageSize,idList}).then(res => {
          if(!res.data.code) {
             this.hasNextPage = res.data.hasNextPage;
             let list = res.data.list;
             if(list.length > 0) {
               this.hasData = true
             } else {
               this.hasData = false;
             }
             this.designerList = this.designerList.concat(list);
             this.designerList.map(ele => {
               let obj = ele;
               if(obj.labelNames) {
                  obj.labelList = obj.labelNames.split(',').slice(0,3);
               }  
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

    //搜索
    search() {
      this.designerList = [];
      let searchName = this.searchName;
      let type = this.type;
      this.pageIndex = 1;
      let idList = this.idList;
      this.initData();
    },
    showLabels() {
      this.isHidden = true;
    },
    cancel() {
       this.isHidden = false;
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
        this.designerList = [];
        this.initData();
        this.cancel();
    },

      //选择全部
    selAll() {
        let _this = this;
         _this.labelList.map(function(item) {
            _this.$set(item, "selected", false);
        });
    },
    filterLabel(item) {
     item.selected = !item.selected
    },
    //设计师详情
    async designerHome(designerId) {
      const { data } = await getUserInfo({});
      let userId = data.id;
      let isSelf = 0;
      if(userId == designerId) {
          isSelf = 1;
         let url = `/pages/designerDetail/main?designerId=${designerId}&isSelf=${isSelf}`;
         wx.navigateTo({ url });
       } else {
         isSelf = 0
         let url = `/pages/designerDetail/main?designerId=${designerId}&isSelf=${isSelf}`;
         wx.navigateTo({ url });
       }
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
        box-sizing:border-box;
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
          box-sizing:border-box;
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