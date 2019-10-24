<template>
    <scroll-view scroll-y class="templates" @scrolltolower="onPush">
        <ul>
            <li v-for="(value,index) in list" :key="index" @click="()=> onClick(value)">
                <div class="img-box" :style="{backgroundImage:'url('+value.logo+')'}"></div>
                <p>{{value.name}}</p>
            </li>
        </ul>
    </scroll-view>
</template>
<script>
import { get, join } from "@/api/api";
export default {
    props: {
        id: String,
        onTemplatesAdd: Function
    },
    data() {
        return {
            list: [],
            loading: false
        };
    },
    onShow() {},
    computed: {},
    mounted() {
        this.getData();
    },
    methods: {
        onPush() {
            if (this.loading) {
                return;
            }

            this.loading = true;
        },

        async getData() {
            let { data } = await get("diy/template", { id: this.id });
            this.list = data;
        },

        onClick({ templateId }) {
            wx.showModal({
                title: "提示",
                content: "确定要替换掉所有素材吗？",
                success: async ({ confirm }) => {
                    if (!confirm) {
                        return;
                    }
                    wx.showLoading({
                        title: "加载中",
                        mask: true
                    });

                    try {
                        let { data } = await get("diy/template/material", {
                            templateId: templateId
                        });
                        this.onTemplatesAdd(data);
                        wx.hideLoading();
                    } catch (error) {
                        wx.hideLoading();
                    }
                }
            });
        },

        getDiyData() {}
    }
};
</script>
<style lang='less' scoped>
.templates {
    height: 460px;

    ul {
        display: flex;
        flex-wrap: wrap;
    }

    li {
        box-sizing: border-box;
        padding: 18px;
        width: 33.33%;
        height: 164px;
        border-bottom: 1px solid #ececec;
        border-right: 1px solid #ececec;

        &:nth-of-type(3n) {
            border-right: none;
        }
    }

    .img-box {
        position: relative;
        width: 88px;
        padding-top: 100%;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
    }

    p {
        margin-top: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: #4a4a4a;
    }
}
</style>
