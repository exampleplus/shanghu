<template>
  <div class="receiveInfo">
    <ul>
      <li>
        <div>收货人</div>
        <input
          type="text"
          v-model="name"
          placeholder="请输入收货人姓名"
          placeholder-class="input-placeholder"
          placeholder-style="color:#ccc;font-size:14px;"
        >
      </li>
      <li>
        <div>联系电话</div>
        <input type="number" v-model="phone" placeholder="请输入收货人联系电话" placeholder-style="color:#ccc;font-size:14px;">
      </li>
      <li>
        <picker mode="region" @change="bindRegionChange" class="pick">
            <section class="picker">
                <span class="receAdd">收件地区</span> <span class="placeName" :class="[isPalce ? 'career':'']">{{placeName}}</span>
            </section>
        </picker>
      </li>
      <li>
        <div>详细地址</div>
        <input type="text" v-model="address" placeholder="街道楼牌号等"  placeholder-style="color:#ccc;font-size:14px;">
      </li>
      <li>
        <div class="setDefault">设为默认</div>
        <section class="setAddress">
            <switch @change="switchChange" :checked="defaultStatus" color="#FF5100"/>
        </section>
      </li>
    </ul>

    <div class="save">
        <div class="saveBtn" @click="save">
            保存
        </div>
    </div>
  </div>
</template>
<script>
import { editAddress,checkAddress } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
        addressInfo:{},
        name:"",
        phone:'',
        address:"",
        region:[],
        defaultStatus	:0,
        isPalce:true,
        customItem:"全部",
        placeName:"省市区县、乡镇等",
        provinceName:'',
        cityName:'',
        districtName:'',
        address:'',
        provinceId:'',
        cityId:'',
        districtId:''
    };
  },
  onLoad() {
    this._checkAddress();
  },
  methods:{
    //获取地址信息
    _checkAddress() {
      let id = this.$mp.query.id;
      checkAddress({id}).then(res => {
        if(!res.data.code) {
          this.addressInfo = res.data;
          this.name = res.data.name;
          this.phone = res.data.phone;
          this.address = res.data.address;
          this.provinceName = res.data.provinceName;
          this.cityName = res.data.cityName;
          this.districtName = res.data.districtName;
          this.placeName = this.provinceName +  this.cityName + this.districtName;
          this.defaultStatus = res.data.defaultStatus;
        } else {
          toast(res.data.msg)
        }
      })
    },
      bindRegionChange(e) {
          this.region = e.mp.detail.value;
          this.placeName = this.region[0] + this.region[1] + this.region[2];
          this.provinceName =  this.region[0];
          this.cityName =  this.region[1];
          this.districtName =  this.region[2];
          this.isPalce = true;
      },
      switchChange(e) {
        let defaultStatus = e.mp.detail.value;
        if(defaultStatus) {
          this.defaultStatus = 1;
        } else {
          this.defaultStatus = 0;
        }
      },
       //校验
      checkForm() {
        let name = this.name;
        let phone = this.phone;
        let address = this.address;
        let provinceName = this.provinceName;
        let telReg = /^1[3-9][0-9]{9}$/;
        if(!name) {
          toast("请输入收件人姓名");
          return;
        } else if(!phone) {
          toast("请输入手机号");
          return;
        } else if(!telReg.test(phone)) {
          toast("请输入正确格式手机号");
          return;
        } else if(!provinceName) {
          toast("请选择收货地址");
          return;
        } else if(!address) {
          toast("请输入详细地址");
          return;
        } else {
          return true;
        }
      },

      save() {
         let isCheck = this.checkForm();
           if(!isCheck) {
               return;
        }
       const params = {
              id:this.$mp.query.id,
              name:this.name,
              phone:this.phone,
              address:this.address,
              provinceName:this.provinceName,
              cityName:this.cityName,
              districtName:this.districtName,
              defaultStatus:this.defaultStatus
          }
           editAddress(params).then(res => {
                if(!res.data.code) {
                   wx.navigateBack({
                        delta: 1
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
.receiveInfo {
  padding-top: 62rpx;
  background: #fff;
  ul {
    li {
      display: flex;
      padding-left: 15px;
      padding-bottom: 32rpx;
      .border-bottom(#f0f0f0);
      margin-bottom: 32rpx;
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
                color:rgba(74,74,74,1);
          }
          .placeName {
              font-size:14px;
              color:#CCC;
              &.career {
                  color: #333;
              }
          }
      }
      div {
        width: 120rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-right: 68rpx;
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
  .save {
      position: fixed;
      left: 15px;
      right: 15px;
      bottom: 8px;
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
}
</style>
