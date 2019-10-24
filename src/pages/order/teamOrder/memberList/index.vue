<template>
  <div class="content">
    <div class="memberList">
      <div class="commander" v-for="(item,index) in memberList" :key="index">
        <div class="commInfo">
          <img
            :src="item.headimgurl"
            class="avator"
          />
          <div class="nick">
            <p>
              <span class="name">{{item.nickname}}</span>
               <span class="icon-commander" v-if="item.isLeader">团长</span>
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
   
  </div>
</template>
<script>
import {
  groupMember
} from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      memberList:[]
    };
  },
  onLoad() {
    this.getMember();
  },
  methods:{
    getMember() {
      let orderId = this.$mp.query.orderId;
      groupMember({orderId}).then(res => {
        if(!res.data.code) {
            this.memberList = res.data;
        } toast(res.data.msg)
      })
    },
  },
};
</script>
<style lang="less" scoped>
.commander {
  background: #fff;
  padding: 10px;
  margin: 10px;
  border-radius: 6px;
  .commInfo {
    display: flex;
    margin-bottom: 20px;
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

</style>
