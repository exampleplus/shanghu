<template>
  <div class="content">
    <div v-if="addressList.length > 0" class="addList">
      <div class="addressItem" v-for="(item,index) in addressList" :key="index" @click="chooseAddress(item)">
        <div class="receiver">
          <span class="name">{{item.name}}</span>
          <span class="phone">{{item.phone}}</span>
          <span class="default" v-if="item.defaultStatus">默认</span>
        </div>
        <div class="address">
          <p>{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</p>
          <div class="btn">
            <img src="/static/images/icon-editAdd.png" class="edit" @click.stop="editAddress(item.id)" />
            <img src="/static/images/icon-delAdd.png" class="del" @click.stop="_delAddress(item.id)" />
          </div>
        </div>
      </div>
    </div>
    <div class="nocart" v-if="addressList.length == 0 && hasData == false">
      <img src="/static/images/noaddress.png" alt />
      <p>暂无地址信息</p>
    </div>
    <div class="fixedBottom">
      <div class="newAddress" @click="newAddress">新增收货地址</div>
    </div>

    <div class="hidden" v-if="ishidden"></div>
    <!-- 删除提示 -->
    <div class="modal" v-if="ishidden">
      <p>是否确认删除该收货地址？</p>
      <div>
        <a @click="cancel">取消</a>
        <a @click="deleteAdd">确定</a>
      </div>
    </div>
  </div>
</template>
<script>
import { allAddress, delAddress } from "@/api/api";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      addressList: [],
      ishidden: false,
      delId:'',
      hasData:true
    };
  },
  onShow() {
    this._getAddress();
  },
  onUnload() {
    if(this.addressList.length <= 0) {
       wx.removeStorageSync('addressInfo')
    }
  },
  methods: {
    _getAddress() {
      allAddress().then(res => {
        if (!res.data.code) {
          this.addressList = res.data;
          if(this.addressList.length > 0) {
            this.hasData = true
          } else {
            this.hasData = false;
          }
        } else {
          toast(res.data.msg);
        }
      });
    },

    //选择地址
    chooseAddress(item) {
      let type = this.$mp.query.type;
      if(!type) {
        return;
      }
      wx.setStorageSync("addressInfo",JSON.stringify(item))
     
      wx.navigateBack({
        delta:1
      })
    },
    //删除地址
    _delAddress(id) {
        this.delId = id;
        this.ishidden = true;
    },
    cancel() {
      this.ishidden = false;
    },
    //确认删除
    deleteAdd() {
        let id = this.delId;
        delAddress({id}).then(res => {
            if(!res.data.code) {
                this._getAddress();
                this.ishidden = false;
            } else {
                toast(res.data.msg)
            }
        })
    },

    newAddress() {
      let url = "/pages/personalCenter/newAddress/main";
      wx.navigateTo({ url });
    },
    editAddress(id) {
      let url = "/pages/personalCenter/editAddress/main?id=" + id;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
    .addList {
        padding-bottom: 60px;
    }
  .addressItem {
    background: #fff;
    margin-bottom: 10px;
    padding: 12px 15px 15px;
    .receiver {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .name {
        font-size: 13px;
        color: rgba(74, 74, 74, 1);
        margin-right: 30px;
      }
      .phone {
        font-size: 13px;
        color: rgba(155, 155, 155, 1);
        margin-right: 18px;
      }
      .default {
        display: inline-block;
        height: 15px;
        line-height: 15px;
        text-align: center;
        padding: 1px 2px;
        font-size: 11px;
        color: rgba(255, 81, 0, 1);
        background: rgba(247, 243, 241, 1);
        border-radius: 2px;
      }
    }
    .address {
      display: flex;
      justify-content: space-between;
      p {
        font-size: 14px;
        color: rgba(9, 2, 3, 1);
        flex: 1;
      }
      .btn {
        margin-left: 20px;
        .edit {
          width: 16px;
          height: 16px;
          margin-right: 18px;
        }
        .del {
          width: 15px;
          height: 16px;
        }
      }
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
  .nocart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 130px;
    img {
      width: 130px;
      height: 130px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
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
}
</style>
