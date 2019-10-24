<template>
    <div :style="isCollect ? 'background:#f5f5f5;margin-top:-23px;' :''"> 
        <div class="designer" v-for="(item,index) in designerList" :key="index">
            <div class="userInfo">
                <img :src="item.headimgurl" class="avator">
                <div class="topRight" @click="designerDetail(item.designerId)">
                    <div class="desiName">
                        <div class="level">
                            <div class="name">{{item.designerName}}</div>
                            <div class="equal">
                                lv{{item.level}}
                            </div>
                        </div>
                        <div class="checkDetail">
                            <div class="check">
                                查看详情
                            </div>
                            <img src="/static/images/designer-arrow.png" class="arrow">
                        </div>
                    </div>
                    
                     <div class="lableList">
                        <div class="label" v-for="(label,index2) in item.labelList" :key="index2">{{label}}</div>
                    </div>
                    <div class="designDesc" v-if="item.detail">
                        {{item.detail}}
                    </div>
                </div>
            </div>
            <div class="hotSource" v-if="item.materialList.length > 0">
                <div class="bottomLeft">
                    热门素材
                </div>
                <div class="sourceList">
                    <div class="sourceItem" v-for="(source,index3) in item.materialList" :key="index3">
                        <img :src="source +'?x-oss-process=image/resize,w_320'" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        designerList:{
            type:Array
        },
        isCollect:{
            type:Boolean
        }
    },
    methods:{
        designerDetail(designerId) {
            this.$emit("designerHome",designerId)
        },
    }
}
</script>
<style lang="less" scoped>
    .designer {
        background: #fff;
        border-radius: 6px;
        padding: 10px;
        margin: 10px;
        .userInfo {
            display: flex;
            margin-bottom: 12px;
            .avator {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                margin-right: 20px;
            }
            .topRight {
                flex:1;
                .desiName {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    .level {
                        flex:1;
                        display: flex;
                        align-items: center;
                        .name {
                            font-size:16px;
                            font-weight:600;
                            color:rgba(9,2,3,1);
                            margin-right: 5px;
                        }
                        .equal {
                            height:16px;
                            line-height: 16px;
                            padding: 2px 9px;
                            text-align: center;
                            background:rgba(255,81,0,1);
                            box-shadow:0px 2px 4px 0px rgba(255,194,166,1);
                            border-radius:10px;
                            font-size:11px;
                            font-weight:600;
                            color:rgba(255,255,255,1);
                        }
                    }
                    
                    .checkDetail {
                        display: flex;
                        align-items: center;
                        .check {
                                font-size:12px;
                                color:rgba(155,155,155,1);
                                margin-right: 5px;
                            }
                        .arrow {
                                width: 7px;
                                height: 11px;
                                vertical-align: middle;
                            }
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
                        margin-right: 5px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .designDesc {
                    font-size:13px;
                    color:rgba(74,74,74,1);
                }
            }

        }
        .hotSource {
            display: flex;
            align-items: center;
            .bottomLeft {
                width: 49px;
                margin-right: 15px;
                font-size:12px;
                color:rgba(9,2,3,1);
            }
            .sourceList {
                flex:1;
                display: flex;
                overflow-x: auto;
                flex-wrap: wrap;
                &::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                    color: transparent;
                }
                .sourceItem {
                    flex-basis: 82px;
                    white-space: nowrap;
                    margin-right: 8px;
                    margin-bottom: 10px;
                    img {
                        width: 82px;
                        height: 82px;
                    }
                }
            }

        }
        
    }
</style>