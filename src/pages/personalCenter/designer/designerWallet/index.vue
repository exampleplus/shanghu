<template>
  <div class="content">
    <div class="box">
      <img src="/static/images/my-background.png" alt="">
      <div class="balance">
        <p>账户余额（元）</p>
        <h5>{{info.balance}}</h5>
      </div>
    </div>
    <div class="detailed" @click="applyCash">
      <p>提现</p>
      <img src="/static/images/user-arrow-right.png" alt="">
    </div>
    <div class="detailed" @click="incomeDetail">
      <p>明细</p>
      <img src="/static/images/user-arrow-right.png" alt="">
    </div>
    <div class="main">
      <p class="title">余额说明</p>
      <!-- <p class="text"> </p> -->
       <wxParse :content="info.content" noData="" /> 
    </div>
  </div>
</template>

<script>
// import { getDesignerWallet} from "@/api/api";
import wxParse from 'mpvue-wxparse'
import { toast } from "@/utils/index";
export default {
  data () {
    return {
      walletInfo:{}
    }
  },
   components: {
    wxParse
  },
  computed:{
    info() {
      return this.$store.state.info
    }
  },
  methods:{
    _getDesignerWallet() {
      this.$store.dispatch('getDesignerWallet',{type:1})
    },
    applyCash() {
      let type = 1;
      let isCard = this.info.isCard;
      let balance = this.info.balance
      wx.setStorageSync("isCard",isCard)
      let url = '/pages/personalCenter/applyCash/main?type=' + type + "&balance=" + balance;
      wx.navigateTo({url})
    },
    incomeDetail() {
      let url = '/pages/personalCenter/designer/designerincomeDetail/main';
      wx.navigateTo({url})
    },
  },
  onLoad() {
     Object.assign(this.$data, this.$options.data())
     this._getDesignerWallet();
  },
}
</script>

<style lang="less" scoped>
.content {
  .box {
    width: 100%;
    height: 182px;
    position: relative;
    background: #fff;
    img {
      width: 100%;
      height: 100%;
    }
    .balance {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 49px 0 0;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      p {
        font-size: 12px;
        line-height: 17px;
        margin-bottom: 10px;
      }
      h5 {
        font-size: 30px;
        line-height: 42px;
      }
    }
  }
  .detailed {
    width: 100%;
    height: 51px;
    background: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 14px;
    color: #4A4A4A;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    &:last-of-type {
        border-bottom: none;
    }    
    img {
      width: 6px;
      height: 12px;
    }
  }
  .main {
    background: #fff;
    width: 100%;
    padding: 12px 24px 15px 15px;
    box-sizing: border-box;
    margin-top:10px;
    .title {
      font-size: 12px;
      line-height: 17px;
      color: #4A4A4A;
      padding: 0 11px;
      box-sizing: border-box;
      position: relative;
      margin-bottom: 15px;
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 0;
        width: 3px;
        height: 10px;
        transform: translate(0, -50%);
        background: #4A4A4A;
      }
    }
    .text {
      font-size: 12px;
      line-height: 17px;
      color: #4A4A4A;
    }
  }
}
</style>
