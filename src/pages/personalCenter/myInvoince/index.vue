<template>
  <div>
    <div class="invoinceList">
      <div class="invoince" v-for="(item,index) in invoinceList" :key="index" @click="selInvoince(item)">
        <div class="line">
          <span class="invoType">发票类型：</span>
          <span v-if="item.invoiceType == 1">普通发票</span>
           <span v-else>增值税专用发票</span>
          <span class="default" v-if="item.defaultStatus == 1">默认</span>
        </div>
        <div class="line m20">
          <span class="invoType">发票抬头：</span>
          <span class="invoHead" v-if="item.normalType == 1">个人</span>
           <span class="invoHead" v-else>企业</span>
          <div>
            <img src="/static/images/icon-editAdd.png" class="edit" @click.stop="editInvoince(item)">
            <img src="/static/images/icon-delAdd.png" class="del" @click.stop="del(item.id,index)">
          </div>
        </div>
        <div class="line">
          <span class="invoType">发票内容：</span>
          <span>{{item.content}}</span>
        </div>
      </div>
    </div>
    <div class="noInvoince" v-if="invoinceList.length <= 0 && hasData == false">
      <img src="/static/images/noInvoince.png" alt="">
      <p>暂无发票信息</p>
    </div>

    <div class="fixedBottom">
      <div class="newAddress" @click="newInvoince">新增发票</div>
    </div>
     <div class="hidden" v-if="ishidden"></div>
    <!-- 删除提示 -->
    <div class="modal" v-if="ishidden">
      <p>是否确认删除该发票？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="deleteInvoince">确定</a>
      </div>
    </div>
  </div>
</template>
<script>
import { getInvoinceList, delInvoince } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      invoinceList:[],
      ishidden:false,
      delId:'',
      delIndex:null,
      hasData:true
    };
  },
  onShow() {
    this._getInvoinceList();

  },
  methods:{
    _getInvoinceList() {
      getInvoinceList().then(res => {
        if(!res.data.code) {
           this.invoinceList = res.data;
           if(this.invoinceList.length > 0) {
             this.hasData = true;
           } else {
             this.hasData = false;
           }
        } else {
          toast(res.data.msg)
        }
      })
    },
    newInvoince() {
      let url = '/pages/personalCenter/newInvoince/main';
      wx.navigateTo({url})
    },
    //选择发票
    selInvoince(item) {
       let type = this.$mp.query.type;
        if(!type) {
          return;
        }
         wx.setStorageSync("invoinceInfo",JSON.stringify(item))
          wx.navigateBack({
            delta:1
          })
          // var pages = getCurrentPages();
          // var currPage = pages[pages.length - 1]; // 当前页
          // var prevPage = pages[pages.length - 2]; // 上一个页面
          // var data = prevPage.data // 获取上一页data里的数据
          // // 如果存在上一页
          // if(prevPage){
          //   // 可以修改上一页的数据
          //   console.log("prevPage",prevPage)
          //   prevPage.data.$root[0].isInvoice = true;
          //   prevPage.data.$root[0].invoiceId = item.id;
          //   // 返回上一页
          //   // wx.navigateBack();
          // }
    },
    
    editInvoince(item) {
       let info = JSON.stringify(item)
       let url = '/pages/personalCenter/editInvoince/main?invoinceInfo=' + info;
       wx.navigateTo({url})
    },
    cancel() {
       this.ishidden = false;
        this.delIndex = null;
    },
    del(id,index) {
      this.delId = id;
      this.ishidden = true;
      this.delIndex = index;
    },
    deleteInvoince() {
      let id = this.delId;
      delInvoince({id}).then(res => {
        if(!res.data.code) {
          this.invoinceList.splice(this.delIndex,1);
          this.cancel();
        } else {
          toast(res.data.msg)
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.invoinceList {
  padding-bottom: 120rpx;
}
.invoince {
  background: #fff;
  padding: 10px 15px;
  margin-bottom: 10px;
  .line {
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      color: rgba(74, 74, 74, 1);
      &.default {
        display: inline-block;
        height: 15px;
        line-height: 15px;
        text-align: center;
        background: rgba(247, 243, 241, 1);
        border-radius: 2px;
        padding: 2px 5px;
        font-size: 11px;
        color: rgba(255, 81, 0, 1);
        margin-left: 13px;
      }
    }
    .invoType {
      margin-right: 3px;
    }
    .invoHead {
      flex: 1;
    }
    .edit {
      width: 16px;
      height: 16px;
      margin-right: 28px;
    }
    .del {
      width: 15px;
      height: 16px;
    }
  }
  .m20 {
    margin: 12px 0;
  }
}
.noInvoince {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 122px;
    height: 119px;
    margin-bottom: 26px;
  }
  p {
    font-size:14px;
    color:rgba(153,153,153,1);
  }
}
.fixedBottom {
  width: 100%;
  height: 56px;
  line-height: 56px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  .newAddress {
    width: 345px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(
      90deg,
      rgba(254, 121, 0, 1) 0%,
      rgba(255, 81, 0, 1) 100%
    );
    border-radius: 20px;
  }
}

 .hidden {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    top: 392rpx;
    left: 100rpx;
    right: 100rpx;
    background: #fff;
    z-index: 3;
    border-radius: 12rpx;
    p {
      margin-top: 84rpx;
      margin-bottom: 84rpx;
      text-align: center;
      font-size: 30rpx;
      color: #333333;
    }
    div {
      // .list(row, flex-start, center);
      height: 96rpx;
      border-top: 2rpx solid rgba(0, 0, 0, 0.1207);
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #999;
      a {
        flex: 1;
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
      }
      a:last-of-type {
        color: #0068b6;
        border-left: 2rpx solid rgba(0, 0, 0, 0.1207);
      }
    }
  }
</style>
