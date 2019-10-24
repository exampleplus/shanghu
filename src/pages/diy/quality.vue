<template>
    <div class="diy-quality-icon">
        <!-- 不要写key，会报错，莫名其妙的草了他妈的mpvue -->
        <div v-for="(value,index) in qualitySelect" class="selected"></div>
        <div v-for="(value,index) in qualityUnSelect"></div>
    </div>
</template>
<script>
import { get, join } from "@/api/api";
export default {
    props: {
        qualitySelect: Array,
        qualityUnSelect: Array
    },
    data() {
        return {};
    },
    updated() {
        // this.qualitySelect = new Array(this.quality);
        // this.qualityUnSelect = new Array(5 - this.quality);
    },

    onShow() {},
    computed: {},
    mounted() {},
    methods: {}
};
</script>
<style lang='less' scoped>
.diy-quality-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    div {
        margin-left: 1px;
        width: 9px;
        height: 10px;
        background-image: url(../../../static/images/diy-quality-icon.png);
        background-size: 100% 100%;
    }

    .selected {
        background-image: url(../../../static/images/diy-quality-icon-selected.png);
    }
}
</style>
