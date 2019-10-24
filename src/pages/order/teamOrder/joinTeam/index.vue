<template>
    <div class="content">
        <p class="top">备注信息</p>
        <div class="reason">
            <textarea placeholder="最多输入200字" v-model="remark" max-length="200" placeholder-style="color:#9B9B9B;font-size:14px;">
                
            </textarea>
        </div>
        <div class="sub" @click="startDiy">
            开始定制
        </div>
    </div>
</template>
<script>
import { toast } from "@/utils/index";
import { isCanJoinTeam } from '@/api/api';

export default {
    data() {
        return{
            remark:''
        }
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data())
         let groupDiyId = this.$mp.query.groupDiyId;
         let userId = this.$mp.query.userId;
    },
    methods:{
       async startDiy() {
           let isPay = this.$mp.query.isPay;
           console.log("isPay",isPay)
         
                let groupDiyId = this.$mp.query.groupDiyId;
                  isCanJoinTeam({groupDiyId}).then(res => {
                      if(res.data) {
                          toast("团队定制已结束");
                          return;
                      } else {
                           let remark = this.remark;
                            if(!remark) {
                                toast("请输入备注");
                                return;
                            }
                            let type = 0;
                            let userId = this.$mp.query.userId;

                            wx.setStorageSync("groupDiyId",groupDiyId)
                            console.log("groupDiyId",groupDiyId)
                            console.log("userId",userId)
                            let url = '/pages/diy/main?groupDiyId=' + groupDiyId + '&joinTeam=joinTeam' + '&joinToTeam=joinToTeam' + '&userId=' + userId + "&type=" +type + "&isJoin=" + 1 + '&remark=' + remark + '&isEdit=' + 1 + '&isShowBtn=' + 0;
                            wx.navigateTo({url})
                      }
                  })
               
          
        },
    }
}
</script>


<style lang="less" scoped>
    .content {
        background: #fff;
        .top {
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
            padding-left: 15px;
            border-bottom: 1px solid #eee;
            font-size:14px;
            color:rgba(74,74,74,1);
            margin-bottom: 15px;
        }
         .reason {
                padding:0 15px;
                font-size: 14px;
                color: #333;
                margin-bottom: 20px;
                textarea {
                    width: 100%;
                    height: 150px;
                }
        }
        .sub {
            position: fixed;
            z-index: 10;
            bottom: 0;
            width:345px;
            height:40px;
            line-height: 40px;
            text-align: center;
            background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
            border-radius:22px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            margin: 15px;
        }
    }
</style>
