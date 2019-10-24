<template>
  <div class="authorization">
    <p class="p1">登录后小程序将会获得以下权限</p>
    <p class="p2">• 获得你的公开信息（昵称、头像等）</p>
    <button open-type="getUserInfo" @getuserinfo="getUserInfo">授权登录</button>
  </div>
</template>
<script>
import { toast } from "@/utils/index";
import { getToken } from "@/api/api";
export default {
  data() {
    return {

    };
  },
  methods: {
    getUserInfo(e) {
      let _this = this;
      let userInfo = e.target ? e.target.userInfo : null;
     
      if (!userInfo) {
        // wx.showToast({
        //   title: "拒绝授权，将无法使用本小程序全部功能，请重新获取授权！",
        //   icon: "none",
        //   mask: true
        // });
        wx.navigateBack();
        // return;
      } else {
         wx.login({
          success(resLogin) {
            if (resLogin.code) {
              const data = {
                code: resLogin.code,
                headimgurl: userInfo.avatarUrl,
                nickname: userInfo.nickName
              };

              let url = "/" + _this.$root.$mp.appOptions.path + "?";
              let options = _this.$root.$mp.appOptions.query;
             
              for (var key in options) {
                var value = options[key];
                url += key + "=" + value + "&";
              }
              wx.showLoading({ title: "加载中", mask: "true" });
              wx.setStorageSync("skipUrl", url);
              console.log("skipUrl",url)
              _this._getToken(data);
            }
          }
        });
      }

     
    },
     _getToken(data) {
      let that = this;
      getToken(data)
        .then(res => {
          if(!res.data.code) {
               let token = res.data;
               wx.setStorageSync('token', token)
                wx.hideLoading();
               this.$store.dispatch('updateUserData').then(res => {
                 console.log("res",res)
                 if(res.isLogin) {
                    wx.navigateBack();
                 } else {
                   wx.redirectTo({
                     url:'/pages/regisiter/main'
                   })
                 }
               })
              
              
          } else {
            toast(res.data.msg)
          }
            // let url = wx.getStorageSync("skipUrl");
            // if(url) {
            //     wx.reLaunch({url: url})
            // }
        })
        .catch(msg => {

        });
    }

  }
};
</script>
<style lang='less'>
.authorization {
  width: 100%;
  border-top: 1rpx #f4f4f4 solid;
  padding-top: 200rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    width: 404rpx;
    height: 46rpx;
    margin-bottom: 100rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .p1 {
    font-size: 26rpx;
    color: #333;
    margin-bottom: 40rpx;
    font-weight: 400;
  }
  .p2 {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 108rpx;
  }
  button {
    width: 630rpx;
    height: 88rpx;
    background: linear-gradient(135deg, #0ddad0 0%, #15e49a 100%);
    box-shadow: 0 24rpx 48rpx 0 rgba(21, 228, 156, 0.2);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    text-align: center;
    line-height: 88rpx;
    font-weight: 500;
  }
}
</style>