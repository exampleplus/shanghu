<template>
    <div>
        <p class="applyDesc">提现金额</p>
        <div class="withdraw">
            <span class="rmb">￥</span>
            <input type="text" v-model="withdrawCount">
            <img src="/static/images/dellabel.png" class="del" v-if="withdrawCount.length > 0" @click="delConunt">
        </div>
        <div class="applyMoney">
            <span>可提现金额 </span>
            <span>{{balance}}</span>
        </div>
        <div class="applyDetail" @click="cashDetail">
            <span>提现明细</span>
            <img src="/static/images/user-arrow-right.png" alt="">
        </div>

        <div class="apply" @click="_withdraw">
            提现
        </div>
    </div>
</template>
<script>
import { withdraw} from "@/api/api";
import { toast } from "@/utils/index";
export default {
    data() {
        return {
            withdrawCount:'',
            balance:0,
        }
    },
    onLoad() {
         Object.assign(this.$data, this.$options.data())
        this.balance = this.$mp.query.balance;
    },
    methods:{
        _withdraw() {
            let withdrawCount = Number(this.withdrawCount);
            if(!withdrawCount) {
                toast("请输入提现金额");
                return;
            }
            let type = Number(this.$mp.query.type);
            let isCard = wx.getStorageSync("isCard");
            if(!isCard) {
                let url = '/pages/personalCenter/bindCard/main';
                wx.navigateTo({url});
            } else {
                withdraw({withdrawCount,type}).then(res => {
                    if(!res.data.code) {
                        toast("提现成功")
                        if(type == 1) {
                            this.$store.dispatch('getDesignerWallet',{type})
                        } else if (type == 3) {
                             this.$store.dispatch('getDistributionWallet',{type})
                        }
                         
                        wx.navigateBack()
                    } else {
                        toast(res.data.msg)
                    }
                })
            }
            
        },
        delConunt() {
            this.withdrawCount = '';
        },
        cashDetail() {
             let type = Number(this.$mp.query.type);
             let url = '/pages/personalCenter/cashDetail/main?type=' + type;
             wx.navigateTo({url})
        }
    }
}
</script>

<style lang="less" scoped>
    .applyDesc {
        padding: 14px 15px;
        font-size:15px;
        color:rgba(74,74,74,1);
        background: #fff;
    }
    .withdraw {
        padding: 0 15px;
        display: flex;
        background: #fff;
        height: 56px;
        border-bottom: 1px solid #eee;
        align-items: center;
        .rmb {
            font-size: 26px;
            color: #4A4A4A;
            font-weight: 600;
        }
        input {
            height: inherit;
            flex:1;
            color: #333;
            font-size: 40px;
            font-weight: 600;
        }
        .del {
            width: 16px;
            height: 16px;
            padding: 10px;
        }
    }
    .applyMoney {
        font-size:15px;
        color:rgba(155,155,155,1);
        padding: 10px 15px;
        background: #fff;
        margin-bottom: 10px;
    }
    .applyDetail {
        background: #fff;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:14px;
        color:rgba(74,74,74,1);
        img {
            width: 6px;
            height: 12px;
        }
    }
    .apply {
        position: fixed;
        width:345px;
        height:40px;
        bottom: 0;
        line-height: 40px;
        text-align: center;
        margin: 15px;
        margin-bottom: 8px;
        background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
        border-radius:22px;
        color: #fff;
        font-size: 15px;
    }
</style>
