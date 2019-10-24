<template>
    <ul :class="'content ' + (isVertical ? 'vertical' : '') ">
        <li v-for="(color,index) in colors" :key="index" @click="onSelectedIndexChange(index)">
            <div
                class="first"
                :style="{backgroundColor:color }"
                :class="'select-color ' + (index === selectedIndex ? 'selected':'')"
            >
                <img
                    v-if="index === selectedIndex && color === '#FFFFFF'"
                    src="../../../static/images/diy-select-color-selected-white.png"
                    class="font-color-selected"
                />
                <img
                    v-else-if="index === selectedIndex"
                    src="../../../static/images/diy-select-color-selected.png"
                    class="font-color-selected"
                />
            </div>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        onSelectedIndexChange: Function,
        selectedIndex: Number,
        isVertical: Boolean,

        colors: Array
    },
    data() {
        return {};
    },
    mounted() {
    },
    computed: {},
    methods: {}
};
</script>
<style lang='less' scoped>
.content {
}

.vertical {
    li {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
        &:first-child {
            & > div {
                border:1px solid #D6D6D6;
            }
        }
    }
}

.select-color {
    box-sizing: border-box;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    // background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;

    &.selected {
        border: 1px solid #D6D6D6;
    }

    .font-color-selected {
        width: 13px;
        height: 13px;
    }
}
</style>
