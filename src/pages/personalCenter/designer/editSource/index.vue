<template>
  <div class="content">
    <div class="sourceInfo">
      <div class="nick">
        <span class="nickName">素材</span>
        <img
          :src="materialInfo.logo"
          alt
        />
      </div>
      <div class="nick">
        <span class="nickName">素材名称</span>
        <input type="text" v-model="materialInfo.name" placeholder-style="color:#9B9B9B;font-size:14px;" />
      </div>
      <div class="nick">
        <span class="nickName">素材价格</span>
        <input type="text" v-model="materialInfo.price" placeholder-style="color:#9B9B9B;font-size:14px;" />
      </div>
      <div class="desc">
        <span class="nickName">素材描述</span>
        <textarea v-model="materialInfo.detail"></textarea>
      </div>
    </div>
     <div class="addLabel">
          <span class="addNew">添加标签</span>
          <div class="labelList">
              <div class="label" v-for="(item,index) in materialInfo.labelInfoList" :key="index">
                  <span>{{item.name}}</span>
                  <img src="/static/images/dellabel.png" alt="" @click="delLabel(index)">
              </div>
              <div class="add" v-if="materialInfo.labelInfoList.length < 6">
                    <picker @change="bindPickerChange" :value="index" :range="labelList" range-key="name">
                      <div class="picker">
                        添加标签
                      </div>
                  </picker>
              </div>
          </div>
      </div>
    <div class="sub" @click="sub">
        保存
    </div>
</div>
</template>
<script>
import { editDesignermaterial, materialDetail, getLabel } from "@/api/api";
import { toast } from "@/utils/index";

export default {
  data() {
    return {
      index:0,
      materialInfo:{},
      labelIdList:[],
      labelList:[],
    };
  },
  onLoad() {
    this._materialDetail();
    this._getDesignerLabel();
  },
  methods:{
    _materialDetail() {
      let id = this.$mp.query.id;
      materialDetail({id}).then(res => {
        if(!res.data.code) {
          this.materialInfo = res.data;
        } else {
          toast(res.data.msg)
        }
      })
    },
    delLabel(index) {
      this.materialInfo.labelInfoList.splice(index,1);
    },
    //获取设计师标签
    _getDesignerLabel() {
        getLabel().then(res => {
            if(!res.data.code) {    
                this.labelList = res.data;
            } else {
                toast(res.data.msg)
            }
        })
    },
    //添加标签
      bindPickerChange(e) {
          let labelIdList = this.materialInfo.labelInfoList;
          let index = e.mp.detail.value;
          let name = this.labelList[index].name;
          let id = this.labelList[index].id;
          let hasLabel = labelIdList.find( value => value.labelId == id );
          if(!hasLabel) {
              labelIdList.push({name,labelId:id})
          } else {
              toast("已添加此标签")
          }
      },

      checkForm() {
        let name = this.materialInfo.name;
        let logo = this.materialInfo.logo;
        let price = this.materialInfo.price;
        let detail = this.materialInfo.detail;
        if(!name) {
          toast("请输入素材名称");
          return;
        } else if (price < 0) {
          toast("请输入价格");
          return;
        } else if (!detail) {
          toast("请输入素材简介");
          return
        }
        return true;
      },
      //提交
      sub() {
        if(!this.checkForm()) {
          return;
        }
        let id = this.$mp.query.id;
        let name = this.materialInfo.name;
        let logo = this.materialInfo.logo;
        let price = this.materialInfo.price;
        let detail = this.materialInfo.detail;
        let labels = this.materialInfo.labelInfoList;
        let labelIds = [];
        for (let i = 0; i < labels.length; i++) {
            labelIds.push(labels[i].labelId)
        }
        labelIds = labelIds.join(',')

        editDesignermaterial({id,name,logo,price,detail,labelIds}).then(res => {
          if(!res.data.code) {
             let pages = getCurrentPages(); //当前页面栈
            if (pages.length > 1) {
                let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                beforePage.onLoad(); //触发父页面中的方法
                wx.navigateBack()
            }
          } else {
            toast(res.data.msg)
          }
        })




        
      }
  },
};
</script>

<style lang="less" scoped>
.sourceInfo {
  background: #fff;
}
.nick {
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-bottom: 15px;
  padding-top: 15px;
  border-bottom: 1px solid #eee;
  background: #fff;
  .nickName {
    font-size: 14px;
    color: rgba(74, 74, 74, 1);
    width: 70px;
    margin-right: 20px;
  }
  img {
    width: 40px;
    height: 40px;
  }
  input {
    color: #333;
    font-size: 14px;
  }
}
.desc {
  display: flex;
  padding-left: 15px;
  padding-bottom: 15px;
  padding-top: 15px;
  border-bottom: 1px solid #eee;
  background: #fff;
  margin-bottom: 10px;
  .nickName {
    font-size: 14px;
    color: rgba(74, 74, 74, 1);
    width: 70px;
    margin-right: 20px;
  }
  textarea {
    color: #333;
    font-size: 14px;
    height: 50px;
  }
}
   .addLabel {
      padding-left: 15px;
      padding-bottom: 15px;
      padding-top: 15px;
      display: flex;
      background: #fff;
      .addNew {
          font-size:14px;
          color:rgba(74,74,74,1);
          width: 70px;
          margin-right: 20px;
      }
      .labelList {
          flex:1;
          display: flex;
          flex-wrap: wrap;
          .label {
              width:190rpx;
              height:64rpx;
              line-height:64rpx;
              background:#f6f6f6;
              border-radius:8rpx;
              margin-right:20rpx;
              margin-bottom:36rpx;
              display:flex;
              align-items:center;
              justify-content:center;
              span {
                  font-size:14px;
                  color:rgba(74,74,74,1);
                  margin-right: 10px;
                  max-width: 60px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
              }
              img {
                  width: 16px;
                  height: 16px;
                  vertical-align: middle;
              }
          }
          .add{
              width:95px;
              height:32px;
              line-height: 32px;
              text-align: center;
              border-radius:4px;
              border:1px solid rgba(255,81,0,1);
              font-size:14px;
              color:rgba(255,81,0,1);
          }
      }
  }
.sub {
    position: fixed;
    bottom: 0;
    z-index: 10;
    width:345px;
    height:40px;
    line-height: 40px;
    text-align: center;
    background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
    border-radius:20px;
    font-size:16px;
    font-weight:600;
    color:rgba(255,255,255,1);
    margin:15px;
   
}
</style>
