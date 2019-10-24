<template>
    <div class="souceList">
        <div class="souceItem" v-for="(item,index) in souceList" :key="index" >
            <div class="souceImg">
                <img :src="item.logo +'?x-oss-process=image/resize,w_320'" class="logo" :lazy-load="true" @click="preview(item.logo+'?x-oss-process=image/resize,w_320')">
                <div v-if="hasCollectIcon == true">
                    <img src="/static/images/icon-trigle-active.png" class="trigle" v-if="item.isCollect" @click.stop="_cancelCollect(item)">
                    <img src="/static/images/icon-trigle.png" class="trigle" v-else @click.stop="_collect(item)">
                </div>
            </div>
            <div class="sourceInfo" @click="souceDetail(item.materialId)">
                <div class="sourceName">
                    <span class="name">{{item.name}}</span>
                    <span class="price">￥{{item.price}}</span>
                </div>
                <div class="souceIntro">
                    <div class="lableList">
                        <div class="label" v-for="(label,index2) in item.labelInfoList" :key="index2">{{label.name}}</div>
                    </div>
                    <div class="souceDesc">
                        {{item.detail}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        souceList:{
            type:Array
        },
        hasCollectIcon:{
            type:Boolean
        }
    },
    methods:{
        preview(logo) {
            wx.previewImage({
                current: logo, // 当前显示图片的http链接
                urls: [logo] // 需要预览的图片http链接列表
            })
        },
        souceDetail(id) {
           this.$emit("detail",id)
        },
        _collect(item) {
            this.$emit("collectSource",item)
        },
        _cancelCollect(item) {
             this.$emit("cancelCollectSource",item)
        },
    }
}
</script>
<style lang="less" scoped>
    .souceList {
        .souceItem {
            display: flex;
            padding: 0 10px 20px 15px;
            .souceImg {
                width:110px;
                height:110px;
                background:rgba(246,246,246,1);
                border-radius:6px;
                position: relative;
                margin-right: 15px;
                .logo {
                    width: 100%;
                    height: 100%;
                }
                .trigle {
                    position: absolute;
                    left: 12px;
                    top: 0;
                    z-index: 10;
                    width: 13px;
                    height: 15px;
                    padding:0 40rpx 40rpx;
                }
            }
            .sourceInfo {
                flex:1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .sourceName {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .name {
                        font-size:16px;
                        font-family:PingFangSC-Medium;
                        font-weight:600;
                        color:rgba(9,2,3,1);
                    }
                    .price {
                        font-size:20px;
                        font-weight:600;
                        color:rgba(255,81,0,1);
                    }
                }
                .lableList {
                    display: flex;
                    flex-wrap: wrap;
                    .label {
                        box-sizing: border-box;
                        width: 61px;
                        height: 17px;
                        text-align: center;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAiCAYAAACQhM1+AAADJElEQVR4Xu2aT0wTQRSH39tAut0/U4IkGi4EjZ5EvYN6B+MdEu82erfRu0TvNnqXxDsY7qCevNDoucYDYoiRnZ12t6TdZ1qCEaX09eRs+nrdN7vffL920jY/hCFeLWOuZdTZGWKJjFpggBDWcRiOxOhVIKoMs0Zm/78BAlhmB01E2GroOhHM/H90IeAaQIC4EKgL7KATrW8C0hb3ATJnhwEH8XUhUPfYQaeNqEoZlO3AFwquAXRg0fVLm6ygiT6Op+byNwA4x32AzFlhYN8N1DQitllBN7S+4yCtW4EuEGwDCPDCDUsPuwtYQbdMvJZRtsJ+ggxaYYAI5z2lPrCCJiI/jaPvgOhbQS8QLAOIUC/46hIiEivoljErGXXWWHeXIYsM4NNiqJ4cAw08uhMdvQWERYt2ICgMAw44Vwth+JkVNGk9lSLtAsA4494yYokBRNxxA3XjT5wzP9FpIy5TllUt4RcMpgEH8VEhUM/ZQSdx9A4A5pn3lzELDCBiljntWc+b/MoKOkmSGWgf1rk/wSzYoyD0DOBWMVS3/5bR9+huGV3JiFbFXr4MoOPcd/3wFTvo1OgaEc3la5ujTYuIh4cZTCulfrCCbhkzl1GnNtra8rd7RFh3g9Ld08hPPbqlYJC/kLvEDsByISy9YQXdLRiksa4DSsEgZ3EbN1DnEbHJCrrZ1AvYoe2cbXLkcY8LBv1E/HN0p3FUJZCCQd7eOeiMLbq+v8kK+qhgcGUXgKbyttHR5sV9Nwh7BQNW0GkjWqIMNkZbWv52TwBVLyw9OIv8xNGdmGgNCKRgkLOsiXDBU+o9K2ja2/NTz5WCQc5CBoIvbqguHhcMBh7dTROtIIEUDPIWNNJqMZh4PAj799GdmmiDCJYGLZDrdhloQ2cuDCc/DaLqBa21nhqXgsEgV9ZdJ6CaF05c54D1gk7jgzIBSsGAY8yiGQexUgjUMw5SL+gkjrr/hC1wFsiMHQaOCgZjs57nnSgY9P0yliQ/Z6DtSMHAjvyGoMDtYqhucRdgU+sKohQMuMJsmUOgshtOvOTyYBIf1ABQCgZcYxbMnVUw6If3CyFYBfjcFNUoAAAAAElFTkSuQmCC");
                        background-repeat: no-repeat;
                        background-size: cover;
                        font-size: 12px;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(255, 81, 0, 1);
                        margin-bottom: 10px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .souceDesc {
                    font-size:13px;
                    font-weight:400;
                    color:rgba(155,155,155,1);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
</style>