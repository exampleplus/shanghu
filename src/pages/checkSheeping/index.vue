<template>
    <div class="content">
        <div class="sheeping" v-for="(item,index) in Traces" :key="index">
            <p class="time">{{item.AcceptTime}}</p>
            <p class="where">{{item.AcceptStation}}</p>
            <img src="/static/images/circle-light.png" class="circle-light" v-if="index == 0">
             <img src="/static/images/circle-gray.png" class="circle" v-else>
        </div>
        <div class="noship" v-if="Traces.length <= 0">
            暂无物流信息
        </div>
    </div>
</template>
<script>
import {checkSheeping} from '@/api/api';
import {toast} from '@/utils/index'
export default {
    data() {
        return {
            expressCode:'',
            expressNumber:'',
            Traces:[],
            step:''
        }
    },
    onLoad() {
        this.expressCode = this.$mp.query.expressCode;
        this.expressNumber =  this.$mp.query.expressNumber;
        this.getSheeping();
    },
    methods:{
        getSheeping() {
            let expressCode = this.$mp.query.expressCode;
            let expressNumber = this.$mp.query.expressNumber;
            checkSheeping({expressCode,expressNumber}).then(res => {
                if(!res.data.code) {
                    this.Traces = res.data.Traces.reverse();
                    this.step = res.data.State;
                } else {
                    toast(res.data.msg)
                }
            })

        },
    },
}
</script>

<style lang="less" scoped>
    .content {
        background: #fff;
        padding: 20px 34px 20px 17px;
        .sheeping {
            padding-bottom: 20px;
            border-left:1px solid #EBEBEB;
            padding-left: 14px;
            position: relative;
            &:last-of-type {
                border-left: none;
            }
            .time {
                font-size:12px;
                color:rgba(158,158,158,1);
                margin-bottom: 5px;
            }
            .where {
                font-size:12px;
                color:rgba(74,74,74,1);
            }
            .circle-light {
                width: 17px;
                height: 17px;
                position: absolute;
                top: -4px;
                left: -9px;
                z-index: 10;
            }
            .circle {
                width: 9px;
                height: 9px;
                position: absolute;
                top: 4px;
                left: -5px;
                z-index: 10;
            }
        }
        .noship {
            text-align: center;
            color: #333;
            font-size: 14px;
            margin: 20px 0;
        }
    }
</style>