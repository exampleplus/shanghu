<template>
  <div>
    <div class="tab">
      <div  v-for="(item,index) in invoinceTypeArray"
            :key="index"
            :class="[activeIndex == index ? 'active' : '']"
            @click="tab(index,item.invoiceType)"
            >{{item.name}}
        </div>
    </div>
    <div v-if="activeIndex == 0">
      <picker value="index" :range="invoinceArray" range-key="name" @change="bindPickerChange" class="pick">
        <div class="picker">
          <span class="reason">发票性质</span>
          <!-- <span class="nature">{{invoinceArray[index].name}}</span> -->
           <span class="nature">{{invoinceName}}</span>
        </div>
        <img src="/static/images/user-arrow-right.png" class="arrow">
      </picker>
        <ul class="invoinceInfo">
        <li>
            <div>发票抬头</div>
            <input
            type="text"
            v-model="title"
            placeholder="默认“个人”（可修改）"
            placeholder-class="input-placeholder"
            placeholder-style="color:#9B9B9B;font-size:14px;"
            >
        </li>
        <li>
            <div>发票内容</div>
            <input
            type="text"
            v-model="content"
            placeholder="商品明细（不可修改）"
            placeholder-style="color:#9B9B9B;font-size:14px;"
            >
        </li>
        <li>
            <div>收票人手机号 <span class="red">*</span></div>
            <input
            type="number"
            v-model="mobile"
            placeholder="请填写手机号"
            placeholder-style="color:#9B9B9B;font-size:14px;"
            >
        </li>
        <li v-if="invoiceType == 1 && normalType == 2">
            <div>纳税人识别码 <span class="red">*</span></div>
            <input
            type="number"
            v-model="taxCode"
            placeholder="纳税人识别码或统一社会信用代码"
            placeholder-style="color:#9B9B9B;font-size:14px;"
            >
        </li>
        <li>
            <div class="setDefault">设为默认</div>
            <section class="setAddress">
            <switch @change="switchChange" :checked="defaultStatus" color="#FF5100"/>
            </section>
        </li>
        </ul>
    </div>
     
     <div v-if='activeIndex == 1' class="enterPrise">
         <ul class="invoinceInfo">
            <li>
                <div>发票内容</div>
                <input
                type="text"
                v-model="erterContent"
                placeholder="商品明细（不可修改）"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
        </ul>
        <p class="company">公司信息</p>
        <ul class="invoinceInfo enterInvoince">
            <li>
                <div>单位名称 <span class="red">*</span></div>
                <input
                type="text"
                v-model="enterpriseName"
                placeholder="请填写单位名称"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
            <li>
                <div>纳税人识别码</div>
                <input
                type="text"
                v-model="enterTaxCode"
                placeholder="纳税人识别号或统一社会信用代码"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
            <li>
                <div>注册地址 <span class="red">*</span></div>
                <input
                type="text"
                v-model="loginAddress"
                placeholder="请填写注册地址"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
             <li>
                <div>注册电话 <span class="red">*</span></div>
                <input
                type="text"
                v-model="enterMobile"
                placeholder="请填写注册电话"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
             <li>
                <div>开户银行 <span class="red">*</span></div>
                <input
                type="text"
                v-model="bankName"
                placeholder="请填写开户银行"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
             <li>
                <div>银行账户 <span class="red">*</span></div>
                <input
                type="text"
                v-model="account"
                placeholder="请填写银行账户"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
        </ul>
          <p class="company">收票人信息</p>
           <ul class="invoinceInfo">
            <li>
                <div>昵称 <span class="red">*</span></div>
                <input
                type="text"
                v-model="nickname"
                placeholder="请填写昵称"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
             <li>
                <div>地址 <span class="red">*</span></div>
                <input
                type="text"
                v-model="address"
                placeholder="请填写地址"
                placeholder-class="input-placeholder"
                placeholder-style="color:#9B9B9B;font-size:14px;"
                >
            </li>
             <li>
                <div class="setDefault">是否默认</div>
                <section class="setAddress">
                <switch @change="switchChange" :checked="defaultStatus" color="#FF5100"/>
                </section>
            </li>
        </ul>
     </div>
      <div class="save" @click="save">
              <div class="saveBtn">
                  保存
              </div>
        </div>
  </div>
  
</template>
<script>
import { addInvoince } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      activeIndex: 0,
      index: 0,
      invoinceArray: [{name:"个人",normalType:1},{name:"企业",normalType:2}],
      invoinceTypeArray: [{name:"普通发票(电子)",invoiceType:1},{name:"增值税专用发票",invoiceType:2}],
      title:'' ,//普通个人发票抬头
      content:'' ,//普通个人发票内容
      erterContent:"" ,  //企业 增值发票内容
      mobile:'', //普通个人发票收款人手机号
      enterpriseName:"",  //单位名称
      enterMobile:"",  // 注册手机号
      account:"",
      enterTaxCode:"",
      bankName:'',
      nickname:"",
      address:"",
      invoinceName:'个人',
      defaultStatus:false,//是否默认
      loginAddress:"",//注册地址
      taxCode:'',  //普通企业发票纳税人识别码
      invoiceType:1,   // 发票类型  1 普通发票 2增值发票
      normalType:1,   //发票抬头 1 个人 2 企业

    };
  },
   onLoad() {
    Object.assign(this.$data, this.$options.data())
  },
  methods: {
    tab(index,invoiceType) {
        this.index = index;
        this.activeIndex = index;
         if(invoiceType == 2) {
          this.normalType = 2;
        } else {
          this.normalType = 1;
        }
        this.invoiceType = invoiceType;
       
    },
    bindPickerChange(e) {
      let index = e.mp.detail.value;
      this.index = e.mp.detail.value;
      this.normalType = this.invoinceArray[index].normalType;
      this.invoinceName = this.invoinceArray[index].name;
    },

    switchChange(e) {
      this.defaultStatus = e.mp.detail.value;
    },

    checkForm() {
       if(this.invoiceType == 1 && this.normalType == 1) {   //普通个人
            if(!this.mobile) {
              toast("请输入收票人手机号");
              return false;
            }
       }  else if(this.invoiceType == 1 && this.normalType == 2) {  //普通企业
             if(!this.mobile) {
              toast("请输入收票人手机号");
              return false;
          } else if(!this.taxCode) {
             toast("请输入纳税人识别码");
              return false;
          }
       }  else if(this.invoiceType == 2 && this.normalType == 2) { 
                if(!this.enterpriseName) {
                  toast("请输入单位名称");
                  return false;
                } else if(!this.enterTaxCode) {
                  toast("请输入纳税人识别码");
                  return false;
                } else if(!this.loginAddress) {
                  toast("请输入注册地址");
                  return false;
                } else if(!this.enterMobile) {
                  toast("请输入注册电话");
                  return false;
                }  else if(!this.bankName) {
                    toast("请输入开户行");
                    return false;
                } else if(!this.account) {
                    toast("请输入银行账户");
                    return false;
                } else if(!this.nickname) {
                    toast("请输入昵称");
                    return false;
                } else if(!this.address) {
                    toast("请输入地址");
                    return false;
                } 
       } 
         return true;
    },

    save() {
        let isCheck = this.checkForm();
          if(!isCheck) {
               return;
        } 
      let params = {};
      if(this.invoiceType == 1 && this.normalType == 1) {   //普通个人
        params.normalType = this.normalType;
        params.invoiceType = this.invoiceType;
        params.title = this.title;
        params.content = this.content;
        params.mobile = this.mobile;
        params.defaultStatus = this.defaultStatus;
      } else if(this.invoiceType == 1 && this.normalType == 2) {  //普通企业
        params.normalType = this.normalType;
        params.invoiceType = this.invoiceType;
        params.title = this.title;
        params.content = this.content;
        params.mobile = this.mobile;
        params.defaultStatus = this.defaultStatus;
        params.taxCode = this.taxCode
      } else if(this.invoiceType == 2 && this.normalType == 2) {  //增值 企业
        params.invoiceType = this.invoiceType;
        params.content = this.erterContent;
        params.mobile = this.enterMobile;
        params.enterpriseName = this.enterpriseName;
        params.address = this.address;
        params.bankName = this.bankName;
        params.account = this.account;
        params.nickname = this.nickname;
        params.loginAddress = this.loginAddress;
        params.defaultStatus = this.defaultStatus;
        params.taxCode = this.enterTaxCode;
      }

      addInvoince(params).then(res => {
        if(!res.data.code) {
          wx.navigateBack({
            delta:1
          })
        } else {
          toast(res.data.msg)
        }
      })
    },



  }
};
</script>

<style lang="less" scoped>
@import '../../../common/styles/elements';
.tab {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #eee;
  background: #fff;
  padding: 15px 0;
  & > div {
    font-size: 14px;
    font-weight: 600;
    color: rgba(155, 155, 155, 1);
  }
  .active {
    font-size: 14px;
    font-weight: 600;
    color: rgba(9, 2, 3, 1);
  }
}
.pick {
  position: relative;
  padding: 15px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: rgba(74, 74, 74, 1);
  margin-bottom: 10px;
  .picker {
    display: flex;
    .reason {
      flex: 1;
    }
    .nature {
      margin-right: 20px;
    }
  }
  .arrow {
    width: 6px;
    height: 12px;
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -6px;
  }
}
.enterPrise {
  padding-bottom: 120rpx;
}
.invoinceInfo {
    background: #fff;
    li {
    display: flex;
    padding-left: 15px;
    padding-top: 15px;
    padding-bottom: 32rpx;
    .border-bottom(#f0f0f0);
    align-items: center;
    padding-right: 15px;
    &:last-of-type {
      border-bottom: none;
    }
    .pick {
      width: 100%;
      .receAdd {
        display: inline-block;
        width: 120rpx;
        font-size: 28rpx;
        font-weight: 500;
        margin-right: 68rpx;
        color: rgba(74, 74, 74, 1);
      }
      .placeName {
        font-size: 14px;
        color: #ccc;
        &.career {
          color: #333;
        }
      }
    }
    div {
      width: 98px;
      font-size: 28rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-right: 20rpx;
      .red {
          color: red;
      }
    }
    .setDefault {
      flex: 1;
    }
    .setAddress {
      justify-content: flex-end;
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
.company {
    font-size:14px;
    color:rgba(155,155,155,1);
    padding-left: 15px;
    padding-bottom: 10px;
    padding-top: 22px;
}
.save {
      position: fixed;
      left: 15px;
      right: 15px;
      bottom: 8px;
      z-index: 10;
      .saveBtn {
          width:345px;
          height:40px;
          line-height: 40px;
          text-align: center;
          background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
          border-radius:22px;
          font-size:14px;
          color:rgba(255,255,255,1);
      }
  }
   .saveEnterprise {
      padding-bottom: 20px;
      .saveBtn2 {
          width:345px;
          height:40px;
          line-height: 40px;
          text-align: center;
          background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
          border-radius:22px;
          font-size:14px;
          color:rgba(255,255,255,1);
          margin:20px auto;
          margin-bottom: 0;
      }
  }
</style>
