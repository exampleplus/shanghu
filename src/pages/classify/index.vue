<template>
  <div class="content">
    <div class="left-scroll">
       <div
        class="tabs"
        v-for="(item, index) in classify"
        :key="index"
        :class=" currentIndex == index  ? 'active':''"
        @click="selectMenu(index,item.id,item.name)"
      >
        <div class="name">
          <span class="border" v-if=" currentIndex == index "></span>
          <span class="className">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="rightContent">
       <div class="levelOne">
            <i></i>
            <span>{{classifyName}}</span>
            <i></i>
       </div>
       <div class="station">
           <div class="stationItem" v-for="(item,index) in secondClassify" :key="index" @click="goodsClassify(item.id)">
               <img :src="item.img" alt="">
               <p>{{item.name}}</p>
           </div>
       </div>
    </div>
    <div class="homePage" @click="backHome">
        <img src="/static/images/icon-home.png" alt="">
    </div>
  </div>
</template>
<script>
import {getClassify,getSecondClassify} from '@/api/api';
import {toast} from '@/utils/index'
export default {
  data() {
    return {
      currentIndex: 0,
      classify: [],
      secondClassify:[],
      classifyName:'',
    };
  },
  onLoad() {
     Object.assign(this.$data, this.$options.data())
     this._getClassify();
  },
  methods:{
      //一级分类
      _getClassify() {
        getClassify().then(res => {
          if(!res.data.code) {
              this.classify = res.data;
              this.classifyName = res.data[0].name;
              let id =  res.data[0].id;
              this._getSecondClassify(id)
          } else {
            toast(res.data.msg)
          }
        })
      },
      //二级分类
      _getSecondClassify(id) {
          getSecondClassify({id}).then(res => {
            if(!res.data.code) {  
                this.secondClassify = res.data;
            } else {  
              toast(res.data.msg)
            }
          })
      },
      //分类商品列表
      goodsClassify(classifyId) {
          let url = '/pages/goodsClassify/main?classifyId=' + classifyId;
           wx.navigateTo({url})
      },

      //查询二级
      selectMenu(index,id,name) {
          this.currentIndex = index;
          this.classifyName = name;
          this._getSecondClassify(id)
      },

      //回到首页
      backHome() {
          let url = '/pages/home/main';
          wx.switchTab({url})
      }
  }
};
</script>

<style lang="less" scoped>
@import '../../common/styles/elements';
.content {
     display: flex;
     width: 100%;
    // align-items: center;
    // justify-content: center;
    position: absolute;
    height: 100%;
  .left-scroll {
    width: 97px;
    height: 100%;
    overflow: auto;
    background: #F6F6F6;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
    .tabs {
      width: 100%;
      display: flex;
      align-items: center;
       height: 50px;
      .name {
        width: 100%;
        font-size: 14px;
        color: #615454;
        position: relative;
        .border {
            display: inline-block;
            width:5px;
            height:17px;
            background:rgba(255,81,0,1);
        }
        .className {
          display: inline-block;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 80%;
        }
      }
    }
    .active {
      background: #ffffff;
    }
  }
  .rightContent {
        height: 100%;
        overflow: auto;
        background: #fff;
        flex:1;
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
            color: transparent;
        }
        .levelOne {
            display: flex;
            align-content: center;
            justify-content: center;
            margin-bottom: 24px;
            i {
                display: inline-block;
                height: 1px;
                width: 24px;
                margin-top: 9px;
                background: #EDEBEB;
            }
            span {
                font-size:14px;
                font-weight:400;
                color:rgba(43,35,17,1);
                margin:0 10px;
            }
        }
        .station {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .stationItem {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 33.3%;
                margin-bottom: 33px;
                img {
                    width: 59px;
                    height: 55px;
                    margin-bottom: 7px;
                }
                p {
                    font-size:11px;
                    font-weight:400;
                    color:rgba(97,84,84,1);
                }
            }
        }
  }
  .homePage {
      position: fixed;
      width: 40px;
      height: 40px;
      padding:20px;
      bottom: 40px;
      right:0;
      z-index: 99;
      img {
          width: 100%;
          height: 100%;
      }
  }
}
</style>

