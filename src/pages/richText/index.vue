<template>
    <div class="rich-text">
      <wxParse :content="richText" noData="" />
    </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
export default {
    data() {
        return {
            richText: ""
        };
    },
     components: {
        wxParse
    },
    computed: {},
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: options.title
        });
        this.richText = wx.getStorageSync("diyContent");
        // this.richText = this.richText.replace(/<img /g, '<img class="rich_img" style="max-width:100%;vertical-align:middle;height:auto;" ')
    },
    methods: {}
};
</script>

<style lang='less' scoped>
.rich-text {
    // padding: 10px;
    min-height: 100%;
    background: white;
}
.rich_img {
    vertical-align: middle;
}
</style>

