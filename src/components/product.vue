<template>
    <div>
        <div  class="pics">
            <img :src="item.works"  v-for="(item,index) in productList" :key="index" :lazy-load="true" @click="previewProduct(item,productList)">
        </div>
    </div>
</template>
<script>
export default {
    props:{
        productList:{
            type:Array
        }
    },
    methods:{
        previewProduct(url,urls) {
            this.$emit('previewPt',url,urls)
        }
    },
}
</script>
<style lang="less" scoped>
    .pics {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 15px;
        img {
            width: 167px;
            height: 167px;
            border-radius: 6px;
            margin-bottom: 10px;
        }
    }
</style>