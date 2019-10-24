<template>
    <div class="content">
        <div class="invoinceInfo">
            <div class="invoinceItem"> 
                <span class="regular">发票类型</span>
                <span class="gray" v-if="orderInfo.invoiceType == 1">普通发票(电子)</span>
                 <span class="gray" v-else>增值税专用发票</span>
            </div>
            <div class="invoinceItem"> 
                <span class="regular">发票性质</span>
                <span class="gray" v-if="orderInfo.normalType == 1">个人</span>
                 <span class="gray" v-else>企业</span>
            </div>
             <div class="invoinceItem" v-if="orderInfo.invoiceType == 1"> 
                <span class="regular">发票抬头</span>
                <span class="gray">{{orderInfo.invoiceTitle}}</span>
            </div>
             <div class="invoinceItem"> 
                <span class="regular">发票内容</span>
                <span class="gray">{{orderInfo.invoiceContent}}</span>
            </div>
        </div>
        <div class="company"  v-if="orderInfo.invoiceType == 1 && orderInfo.normalType == 2">
            公司信息
        </div>
        <div class="invoinceInfo" v-if="orderInfo.invoiceType == 1 && orderInfo.normalType == 2">
            <div class="invoinceItem" > 
                <span class="regular">纳税人识别码</span>
                <span class="gray">{{orderInfo.invoiceTaxCode}}</span>
            </div>
        </div>
        <div class="invoinceInfo" v-if="orderInfo.invoiceType == 2">
            <div class="invoinceItem"> 
                <span class="regular">单位名称</span>
                <span class="gray">{{orderInfo.invoiceEnterpriseName}}</span>
            </div>
            <div class="invoinceItem"> 
                <span class="regular">纳税人识别码</span>
                <span class="gray">{{orderInfo.invoiceTaxCode}}</span>
            </div>
             <div class="invoinceItem"> 
                <span class="regular">注册地址</span>
                <span class="gray">{{orderInfo.invoiceLoginAddress}}</span>
            </div>
             <div class="invoinceItem"> 
                <span class="regular">注册电话</span>
                <span class="gray">{{orderInfo.invoiceMobile}}</span>
            </div>
             <div class="invoinceItem"> 
                <span class="regular">开户银行</span>
                <span class="gray">{{orderInfo.invoiceBankName}}</span>
            </div>
             <div class="invoinceItem"> 
                <span class="regular">银行账户</span>
                <span class="gray">{{orderInfo.invoiceAccount}}</span>
            </div>
        </div>

        <div class="company" v-if='orderInfo.invoiceType == 2'>
            收票人信息
        </div>
        <div class="invoinceInfo receiver"  v-if='orderInfo.invoiceType == 2'>
            <div class="invoinceItem"> 
                <span class="regular">昵称</span>
                <span class="gray">{{orderInfo.invoiceNickname}}</span>
            </div>
            <div class="invoinceItem"> 
                <span class="regular">地址</span>
                <span class="gray">{{orderInfo.invoiceAddress}}</span>
            </div>
        </div>
        <!-- <div class="checkInvoince">
            <span>查看发票</span>
        </div> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            orderInfo:{}
        }
    },
    onLoad() {
        let orderInfo = JSON.parse(this.$mp.query.orderInfo);
        this.orderInfo = orderInfo;

    },
}
</script>
<style lang="less" scoped>
@import '../../../common/styles/elements';
    .content {
        height: 100%;
        .invoinceInfo {
            background: #fff;
            margin-bottom: 20px;
            &.receiver {
                margin-bottom: 0;
            }
            .invoinceItem {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
                &:last-of-type {
                    border-bottom: none;
                }
                .regular {
                    font-size:14px;
                    color:rgba(74,74,74,1);
                    flex:1;
                }
                .gray {
                    font-size:14px;
                    color:rgba(155,155,155,1);
                }
            }
        }
        .company {
            padding-left:15px;
            padding-bottom: 10px;
            font-size:14px;
            color:rgba(155,155,155,1);
        }
        .checkInvoince {
            background: #fff;
            padding: 15px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            span {
                display: block;
                width: 100%;
                height:40px;
                line-height: 40px;
                text-align: center;
                background:linear-gradient(90deg,rgba(254,121,0,1) 0%,rgba(255,81,0,1) 100%);
                border-radius:22px;
                font-size:16px;
                font-weight: 600;
                color:rgba(255,255,255,1);
            }
        }
    }
</style>
