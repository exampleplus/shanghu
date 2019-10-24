<template>
    <div>
         <wxParse :content="rules" noData="" /> 
    </div> 
</template>
<script>
import { groupRule } from "@/api/api";
import wxParse from 'mpvue-wxparse'
    export default {
        data() {
            return {
                rules:""
            }
        },
        components: {
            wxParse
        },
        onLoad() {
            this.getGroupRules();
        },
        methods:{
            async getGroupRules() {
               const { data } = await groupRule({})
               this.rules = data.replace(/<img /g, '<img class="rich_img" style="vertical-align:middle;height:auto;" ');
            },
        }
    }   
</script>
<style lang="less" scoped>
    
</style>