<template>
  <div>
      <div class="selType">
        <picker @change="bindPickerChange" value="index" :range="types" range-key="name">
            <div class="picker">
                <span>
                    当前选择
                </span>
                <p>
                    <span>{{accountType}}</span>
                    <img src="/static/images/user-arrow-right.png" class="arrow">    
                </p>
            </div>
        </picker>
      </div>
    <ul class="inpts">
      <li>
        <div>姓名</div>
        <input
          type="text"
          v-model="accountName"
          placeholder="请输入姓名"
          placeholder-class="input-placeholder"
          placeholder-style="color:#ccc;font-size:14px;"
        />
      </li>
      <li>
        <div>开户行</div>
        <input
          type="text"
          v-model="bankName"
          placeholder="请输入开户行"
          placeholder-style="color:#ccc;font-size:14px;"
        />
      </li>

      <li>
        <div>卡号</div>
        <input
          type="number"
          v-model="bankCard"
          placeholder="请输入卡号"
          placeholder-style="color:#ccc;font-size:14px;"
        />
      </li>
    </ul>
    <div class="nextStep" @click="_bindCard">下一步</div>
  </div>
</template>
<script>
import { bindCard} from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
        types:[{name:"个人",isPerson:true},{name:"企业",isPerson:false}],
        index:0,
        bankName:"",
        accountName:"",
        bankCard:"",
        accountType:"个人",
        isPerson:true
    };
  },
  methods:{
      checkForm() {
            let accountName = this.accountName;
            let bankName = this.bankName;
            let bankCard = this.bankCard;
            if(!accountName) {
              toast("请输入姓名");
              return false;
            } else if(!bankName) {
              toast("请输入开户行");
              return false;
            } else if(!bankCard) {
              toast("请输入卡号");
              return false;
            }

            return true;
        },
      bindPickerChange(e) {
          let index = e.mp.detail.value;
          this.accountType = this.types[index].name;
          this.isPerson = this.types[index].isPerson;
      },
      _bindCard() {
        if(!this.checkForm()) {
          return false;
        }
        let params = {
          isPerson:this.isPerson,
          bankName:this.bankName,
          accountName:this.accountName,
          bankCard:this.bankCard
        }
        bindCard(params).then(res => {
          if(!res.data.code) {
            toast("绑定成功");
            wx.setStorageSync("isCard",true);
            wx.navigateBack()
          } else {
            toast(res.data.msg)
          }
        })
      },

  },
};
</script>

<style lang="less" scoped>
@import "../../../common/styles/elements";
.selType  {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
    .picker {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:14px;
        color:rgba(74,74,74,1);
        .arrow {
            width: 8px;
            height: 14px;
            vertical-align: middle;
            margin-left: 10px;

        }
    }
}
.inpts {
  background: #fff;
  li {
    display: flex;
    padding-top: 16px;
    padding-left: 15px;
    padding-bottom: 32rpx;
    .border-bottom(#f0f0f0);
    align-items: center;
    padding-right: 15px;
    &:last-of-type {
      border-bottom: none;
    }
    div {
      width: 100rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-right: 68rpx;
    }
    input {
      flex: 1;
      font-size: 28rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333;
    }
  }
}
.nextStep {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 345px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(254, 121, 0, 1) 0%,
    rgba(255, 81, 0, 1) 100%
  );
  border-radius: 22px;
  color: #fff;
  font-size: 15px;
  margin:15px;
}
</style>
