<template>
    <section :class="'clothes ' + (visible ? 'visible' : '') ">
        <div @click="onHide" :class="'mask ' + (visible ? 'visible' : '') "></div>

        <section :class="'clothes-box ' + (visible ? 'visible' : '') ">
            <scroll-view :scroll-y="true" class="clothes-nav">
                <ul>
                    <li
                        v-for="(value,index) in types"
                        :key="index"
                        :class="value.id === typeSelected ? 'selected':''"
                        @click="()=> getClothes(value.id)"
                    >
                        <div v-if="value.id === typeSelected" class="line"></div>
                        {{value.name}}
                    </li>
                </ul>
            </scroll-view>
            <scroll-view :scroll-y="true" class="clothes-list">
                <ul>
                    <li v-for="(value,index) in clothes" :key="index" @click="() => onClick(value.baseId)">
                        <img :src="value.logo" />
                        <p>{{value.baseMaterialName}}</p>
                    </li>
                </ul>
            </scroll-view>
        </section>
    </section>
</template>
<script>
import { get, join } from "@/api/api";
export default {
    props: {
        visible: Boolean,
        onClick: Function,
        onHide: Function
    },
    data() {
        return {
            typeSelected: 0,
            types: [],
            clothes: [
                // {
                //     id: 1,
                //     image:
                //         "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562921692644&di=b4f47eb970fcfc905ecd331920877ce4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F07%2F05%2F10577b17acb2926.jpg",
                //     title: "基材名称基材名称"
                // },
                // {
                //     id: 1,
                //     image:
                //         "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562921692644&di=b4f47eb970fcfc905ecd331920877ce4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F07%2F05%2F10577b17acb2926.jpg",
                //     title: "基材名称基材名称"
                // },
                // {
                //     id: 1,
                //     image:
                //         "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562921692644&di=b4f47eb970fcfc905ecd331920877ce4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F07%2F05%2F10577b17acb2926.jpg",
                //     title: "基材名称基材名称"
                // },
                // {
                //     id: 1,
                //     image:
                //         "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562921692644&di=b4f47eb970fcfc905ecd331920877ce4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F07%2F05%2F10577b17acb2926.jpg",
                //     title: "基材名称基材名称"
                // }
            ]
        };
    },
    mounted() {
        this.getClassifyData();
    },
    computed: {},
    methods: {
        async getClassifyData() {
            let { data } = await get("diy/classify");
            this.types = data;
            this.getClothes(data[0].id);
        },

        async getClothes(materialClassifyId) {
            this.typeSelected = materialClassifyId;
            let { data } = await get("diy/base", {
                materialClassifyId
            });
            this.clothes = data;
        }
    }
};
</script>
<style lang='less' scoped>
.clothes {
    position: fixed;
    left: -100%;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;

    &.visible {
        left: 0;
    }
}
.mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0);
    opacity: 0;
    transition: opacity 0.4s;

    &.visible {
        opacity: 0.3;
    }
}

.clothes-box {
    position: absolute;
    left: -200px;
    top: 0;
    height: 100%;
    transition: left 0.4s;
    &.visible {
        left: 0;
    }
}

.clothes-nav {
    float: left;
    width: 100px;
    background-color: #f6f6f6;
    height: 100%;

    li {
        color: #615454;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .selected {
        background-color: white;
        color: #090203;

        .line {
            position: absolute;
            left: 0;
            top: 16px;
            width: 5px;
            height: 17px;
            background-color: #ff5100;
        }
    }
}

.clothes-list {
    margin-left: 100px;
    width: 100px;
    height: 100%;
    background-color: white;

    img {
        margin-top: 20px;
        margin-left: 20px;
        width: 60px;
        height: 55px;
    }

    p {
        margin-top: 7px;
        font-size: 11pt;
        text-align: center;
        color: #615454;
    }

    li {
        margin-bottom: 15px;
    }
}
</style>
