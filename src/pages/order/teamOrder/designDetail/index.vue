<template>
  <div class="content">
    <div class="goodsInfo">
      <div class="goodsCard">
        <img
          :src="detailInfo.logo"
          class="goodsImg"
        />
        <div class="goods">
          <div class="goodsName">{{detailInfo.baseName}}</div>
          <div class="teamNum">团队人数: {{detailInfo.groupNum}}人</div>
          <div class="goodsPrice">
            <span class="totalPrice">{{detailInfo.price}}</span>
            <span>（含素材费：￥{{detailInfo.materialPrice}}）</span>
          </div>
        </div>
      </div>
      <div class="edit">
        <span class="endTime">开始时间：{{detailInfo.endTime}}</span>
        <!-- <span class="editModel" v-if="detailInfo.isGroup" @click="editModel">修改模板</span> -->
      </div>
    </div>
    <!-- 团长查看时页面 -->
    <div class="memberList" v-if="detailInfo.isGroup">
      <div class="commander" v-for="(item,index) in detailInfo.userList" :key="index">
        <div class="commInfo" :class="[item.isGroup ? 'mbt20' : '']">
          <img
            :src="item.headimgurl"
            class="avator"
          />
          <div class="nick">
            <p>
              <span class="name">{{item.nickname}}</span>
              <span class="icon-commander" v-if="item.isGroup">团长</span>
            </p>
            <p class="size">{{item.skuName}}</p>
          </div>
          <div class="goodsImg">
            <img :src="item.logo" alt />
          </div>
        </div>
        <div class="remark" v-if="!item.isGroup">{{item.remark}}</div>
        <div class="modify">
          <div class="del" v-if="index >= 1" @click="_delMember(item.userId,index)">删除</div>
          <div class="change" @click="changeDiyInfo(item.userId)">修改</div>
        </div>
      </div>
    </div>

    <!-- 团员查看时页面 -->
    <div class="" v-else>
      <div class="commander" v-for="(item,index) in detailInfo.userList" :key="index">
        <div class="commInfo">
          <img
            :src="item.headimgurl"
            class="avator"
          />
          <div class="nick">
            <p>
              <span class="name">{{item.nickname}}</span>
              <span class="icon-commander" v-if="item.isGroup">团长</span>
            </p>
            <p class="size">{{item.skuName}}</p>
          </div>
          <div class="goodsImg">
            <img :src="item.logo" alt />
          </div>
        </div>
        <div class="remark" v-if="item.remark">{{item.remark}}</div>
      </div>
    </div>

    <div class="bottomFixed" v-if="isLeadflag">
        <div class="share">
          
           <button @click="unShareClick" v-if="unShare">
              分享给团员
          </button>
          <button open-type="share" v-else>
              分享给团员
          </button>
        </div>
        <div class="buy" @click="buyNow">
            立即购买
        </div>
    </div>

    <div class="bottomFixed" v-if="isNoLeadFlag" @click="_joinTeam">
        <div class="join">
            加入团队
        </div>
    </div>

    <div class="bottomFixed" v-if="!detailInfo.isGroup && detailInfo.isJoin" @click="backHome">
        <div class="join">
            回到首页
        </div>
    </div>
   <div class="hidden" v-if="ishidden"></div>
       <!-- 删除提示 -->
    <div class="modal" v-if="isdel">
      <p>是否确认删除该成员？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="confirmDel">确定</a>
      </div>
    </div>

  </div>
</template>
<script>
import { groupOrderDetail, joinTeam, delMemer, editUserDiyInfo, getUserInfo, groupVerifyGoodsStock, isCanJoinTeam } from '@/api/api';
import {toast} from '@/utils/index'
export default {
  data() {
    return {
      groupDiyId:'',
      isdel:false,
      ishidden:false,
      delIndex:'',
      delUserId:'',
      unShare:false,
      isLeader:true,
      isLeadflag:false,
      isNoLeadFlag:false,
      isPay:false,
    };
  },
  
   computed:{
    detailInfo() {
      return this.$store.state.detailInfo
    }
  },
   onLoad() {
      this.queryDetail();
  },
   onShareAppMessage(res) {
   
    return {
      title: `和我一起来DIY`,
      imageUrl: that.detailInfo.logo,
      path: "/pages/order/teamOrder/designDetail/main?groupDiyId=" + that.$mp.query.groupDiyId
    };
   
  },
  methods:{
    queryDetail() {
      let groupDiyId = this.$mp.query.groupDiyId;
      wx.setStorageSync("groupDiyId",groupDiyId)
      if(wx.getStorageSync("groupDiyId")) {
        groupDiyId = wx.getStorageSync("groupDiyId");
      }
      this.$store.dispatch('getGroupOrderInfo',{groupDiyId}).then(res => {
        console.log("团队订单详情",res)
        this.isPay = res.isPay;
        if(res.isGroup) {
          this.isLeadflag = true
          this.isNoLeadFlag = false
        } else {
            this.isNoLeadFlag = true
            this.isLeadflag = false
         }
         let times = (new Date()).valueOf();
         let endTime = (new Date(res.endTime)).valueOf();
         if(times > endTime) {   //当前时间大于结束时间，不能分享
            this.unShare = true;
         } else {
            this.unShare = false;
         }
      }) 
    },
    unShareClick() {
      toast("已到截止分享时间");
    },
    //修改模板
    async editModel() {
      let isGroup = this.detailInfo.isGroup;
     
      let memberLen = this.detailInfo.userList.length;
      if ( memberLen > 0) {
        toast("已有成员确认，不能修改模板");
        return;
      }
      const { data } = await getUserInfo({});
      let userId = data.id;
      let groupDiyId = this.detailInfo.groupDiyId;
      wx.setStorageSync("groupDiyId",groupDiyId)
      let url = '/pages/diy/main?groupDiyId=' + groupDiyId + '&userId=' + userId + "&type=1" + '&isEdit=' + 1 + '&isShowBtn=' + 0;
      wx.navigateTo({url})
    },

    //加入团队
    async _joinTeam() {
      let token = wx.getStorageSync("token");
      if(!token) {
        wx.navigateTo({
          url:'/pages/authorization/main'
        })
        return;
      }
      let groupDiyId = this.detailInfo.groupDiyId;
      isCanJoinTeam({groupDiyId}).then(res => {
        console.log("加入",res)
        if(!res.data.code) {
          if(res.data) {
              toast("团队定制已结束");
              return;
          } else {
              let userId = wx.getStorageSync("userInfo").id;
              console.log("userId",userId)
              let url = '/pages/order/teamOrder/joinTeam/main?groupDiyId=' + groupDiyId + '&userId=' + userId + '&isPay=' + res.data;
              wx.navigateTo({url})
          }
        }
        
      })
     
      //  let userId = this.detailInfo.userId;
     
    },
    //删除成员
    _delMember(userId,index) {
      this.delIndex = index;
      this.delUserId = userId;
      this.ishidden = true;
      this.isdel = true;
    },
    confirmDel() {
      let userId = this.delUserId;
      let groupDiyId = this.detailInfo.groupDiyId;
      let delIndex = this.delIndex;
      this.detailInfo.userList.splice(delIndex,1)
      delMemer({userId,groupDiyId}).then(res => {
        if(!res.data.code) {
          this.cancel();
          toast("删除成功")
        } else {
          toast(res.data.msg)
        }
      })

    },
    cancel() {
      this.ishidden = false;
      this.isdel = false;
    },
    //修改团员信息
    changeDiyInfo(userId) {
      let groupDiyId = this.detailInfo.groupDiyId;
      wx.setStorageSync("groupDiyId",groupDiyId)
      let url = '/pages/diy/main?groupDiyId=' + groupDiyId + '&userId=' + userId + "&isJoin=" + 1 + "&type=0" + '&isEdit=' + 1 + '&isShowBtn=' + 0;
      wx.navigateTo({url})
    },
    //购买
    buyNow() {
      let groupDiyId = this.$mp.query.groupDiyId;
        isCanJoinTeam({groupDiyId}).then(res => {
          if(!res.data.code) {
            if(res.data) {
              toast("已生成订单，不能重新购买");
              return;
            } else {
               groupVerifyGoodsStock({groupDiyId}).then(res => {
                  if(!res.data.code) {
                      let url = '/pages/order/teamOrder/teamConfirmOrder/main?groupDiyId=' + groupDiyId
                      wx.navigateTo({url})
                  } else {
                    toast(res.data.msg)
                  }
                })
            }
          } else {
            toast(res.data.msg)
          }
        })
     
    
    },
    //回到首页
    backHome() {
      let url = '/pages/home/main';
      wx.switchTab({url})
    },
  },

 

};
</script>
<style lang="less" scoped>
.goodsInfo {
  padding: 10px 15px 15px;
  background: #fff;
  .goodsCard {
    display: flex;
    margin-bottom: 23px;
    .goodsImg {
      width: 96px;
      height: 96px;
      border-radius: 8px;
      margin-right: 8px;
    }
    .goods {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goodsName {
        font-size: 15px;
        font-weight: 400;
        color: rgba(9, 2, 3, 1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .teamNum {
        font-size: 12px;
        color: rgba(155, 155, 155, 1);
      }
      .goodsPrice {
        span {
          font-size: 12px;
          color: rgba(155, 155, 155, 1);
        }
        .totalPrice {
          font-size: 16px;
          color: rgba(255, 81, 0, 1);
        }
      }
    }
  }
  .edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .endTime {
      font-size: 13px;
      color: rgba(74, 74, 74, 1);
    }
    .editModel {
      display: inline-block;
      width: 72px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 16px;
      border: 1px solid rgba(255, 81, 0, 1);
      font-size: 12px;
      color: rgba(255, 81, 0, 1);
    }
  }
}
.commander {
  background: #fff;
  padding: 10px;
  margin: 10px;
  border-radius: 6px;
  .commInfo {
    display: flex;
    &.mbt20 {
      margin-bottom: 20px;
    }
    .avator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .nick {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        font-size: 16px;
        font-weight: 600;
        color: rgba(9, 2, 3, 1);
        margin-right: 11px;
      }
      .icon-commander {
        height: 15px;
        line-height: 15px;
        text-align: center;
        padding: 1px 2px;
        background: rgba(247, 243, 241, 1);
        border-radius: 2px;
        font-size: 11px;
        color: rgba(255, 81, 0, 1);
      }
      .size {
        font-size: 12px;
        color: rgba(155, 155, 155, 1);
      }
    }
    .goodsImg {
      width: 40px;
      height: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .remark {
    font-size: 12px;
    color: rgba(155, 155, 155, 1);
    margin-bottom: 22px;
  }
  .modify {
    display: flex;
    justify-content: flex-end;
    .del {
      width: 72px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 16px;
      border: 1px solid rgba(74, 74, 74, 1);
      font-size: 12px;
      color: rgba(74, 74, 74, 1);
      margin-right: 10px;
    }
    .change {
      width: 72px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 16px;
      border: 1px solid rgba(255, 81, 0, 1);
      font-size: 12px;
      color: rgba(255, 81, 0, 1);
    }
  }
}
.memberList {
    padding-bottom: 60px;
}
.bottomFixed {
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 10;
    width: 100%;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    justify-content: space-between;
    padding: 8px 15px;
    box-sizing: border-box;
    .share {
        width:165px;
        height:40px;
        line-height: 40px;
        text-align: center;
        border-radius:22px;
        border:1px solid rgba(255,81,0,1);
        button {
            background: transparent;
            padding: 0;
            line-height: inherit;
            border-radius: 0;
            font-size:16px;
            color:rgba(255,81,0,1);
            &::after {
              border: none;
            }
        }
    }
    .buy {
        width:165px;
        height:40px;
        line-height: 40px;
        text-align: center;
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:22px;
        font-size:16px;
        color:rgba(255,255,255,1);
    }
    .join {
      position: fixed;
      width:345px;
      height:40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      z-index: 10;
      background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
      border-radius:20px;
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
