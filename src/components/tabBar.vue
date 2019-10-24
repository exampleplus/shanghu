<template>
  <section class="tabBar-wrap">
    <article class="tabBar-box">
      <ul class="tabBar-nav" v-if="navList.length > 0">
        <li
          class="tabBar-item"
          v-for="(item, index) in navList"
          @click="selectNavItem(item, index)"
          :key="index"
        >
          <p class="item-images" :class="index === 1 ? 'seleimg':''">
            <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" />
          </p>
          <p
            :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text' "
          >{{item.text}}</p>
        </li>
      </ul>
    </article>
    <div class="mask" v-if="isHidden" @click="cancel"></div>
    <div class="diyWrapper" v-if="isHidden">
      <div @click="goDiy(1)">团队定制</div>
      <div @click="goDiy(0)">个人定制</div>
      <div @click="cancel">取消</div>
    </div>
  </section>
</template>
<script>
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            isHidden: false,
            navList: [
                {
                    pagePath: "/pages/home/main",
                    iconPath: "/static/tabs/home.png",
                    selectedIconPath: "/static/tabs/home-active.png",
                    text: "首页"
                },
                {
                    pagePath: "/pages/diy/main",
                    iconPath: "/static/tabs/release.png",
                    selectedIconPath: "/static/tabs/release.png",
                    text: "DIY"
                },
                {
                    pagePath: "/pages/user/main",
                    iconPath: "/static/tabs/user.png",
                    selectedIconPath: "/static/tabs/user-active.png",
                    text: "我的"
                }
            ]
        };
    },
    props: ['selectNavIndex'],
     onShow() {
      this.isHidden = false;
        
    },
    computed:{
          userInfo() {
            return this.$store.getters.userInfo
          }
    },
    methods: {
    cancel() {
       this.isHidden = false;
    },
    selectNavItem(item, index) {
      if(index == 1) {
        this.isHidden = true;
      } else {
        wx.setStorageSync("backUrl",item.pagePath)
        wx.switchTab({
          url: item.pagePath
        });
      }
    },
    goDiy(type) {
          const token = wx.getStorageSync('token')
          if(!token) {
                let url = '/pages/authorization/main';
                wx.navigateTo({url})
                return;
          } else {
               let userInfo = this.userInfo;
              if(!userInfo.isLogin) {
                wx.setStorageSync("diyUrl",'/pages/diy/main')
                wx.navigateTo({url:'/pages/regisiter/main'})
              } else {
                let url = '/pages/diy/main?type=' + type + '&isShowBtn=1';
                wx.navigateTo({url})
                this.isHidden = false;
              }
          }
    },
  }

}
</script>

<style lang="less" scoped>
@import "../common/styles/elements";
.tabBar-box {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  height: 98rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1rpx 12rpx 0px rgba(228, 228, 228, 1);
}
.tabBar-nav {
  width: 100%;
  display: flex;
  .tabBar-item {
    flex: 1;
    text-align: center;
  }
  .item-text {
    color: #666;
    font-size: 12px;
    transition: 0.24s linear;
  }
  .item-text-active {
    color: #ff5100;
  }
  .item-images {
    width: 56rpx;
    height: 56rpx;
    margin: 0 auto;
    text-align: center;
    transition: 0.24s linear;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .seleimg {
    width: 116rpx !important;
    height: 116rpx !important;
    margin-top: -33px;
    margin-bottom: 4px;
  }
  .fix-iphonex-button {
    bottom: 68rpx !important;
  }
  .fix-iphonex-button::after {
    content: " ";
    position: fixed;
    bottom: 0 !important;
    height: 68rpx !important;
    width: 100%;
    background: #fff;
  }
}

.fix-iphonex-button {
  bottom: 68rpx !important;
}

.fix-iphonex-button::after {
  content: " ";

  position: fixed;

  bottom: 0 !important;

  height: 68rpx !important;

  width: 100%;

  background: #fff;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
}
.diyWrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
  background: #ececec;
  & > div {
    text-align: center;
    padding: 24rpx 0;
    font-size: 34rpx;
    font-weight: 400;
    color: #090203;
    width: 100%;
    background: #fff;
    &:first-of-type {
      .border-bottom(#d6d6d6);
    }
    &:last-of-type {
      margin-top: 12rpx;
    }
  }
}
</style>
