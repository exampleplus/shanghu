<template>
    <div class="content">
        <div class="sourceWrapper">
            <source-item :souceList="souceList" hasCollectIcon=false @detail="goSourceDetail"></source-item>
        </div>
         <last-page :last="{length: souceList.length, lastPage: lastPage}"></last-page>
         <div class="noOrder" v-if="souceList.length <= 0 && hasData == false">
            <img src="/static/images/noOrder.png" alt="">
            <p>没有相关素材</p>
        </div>
    </div>
</template>
<script>
import sourceItem from '@/components/sourceItem';
import lastPage from "@/components/lastPage"
import { getDesignerMaterial } from "@/api/api";
import { toast } from "@/utils/index";
export default {
    components: {
        sourceItem,
        lastPage
    },
    data() {
        return {
            souceList:[],
            pageIndex:1,
            pageSize:10,
            hasNextPage:false,
            lastPage:false,
            hasData:true
        }
    },
    onLoad() {
          Object.assign(this.$data, this.$options.data())
          this._getDesignerMaterial();
    },
     onReachBottom() {
        let that = this;
        that.loadMore();
    },
      
    methods:{
        loadMore(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this._getDesignerMaterial();
            }
        },
        _getDesignerMaterial() {
            let isSelf = true;
            let designerId = '';
            let pageIndex = this.pageIndex;
            let pageSize = this.pageSize;
            getDesignerMaterial({isSelf,designerId,pageIndex,pageSize}).then(res => {
                if(!res.data.code) {
                    this.hasNextPage = res.data.hasNextPage;
                    let list = res.data.list;
                    
                    this.souceList = this.souceList.concat(list);
                    if (!this.hasNextPage) {
                        //最后一页
                        this.lastPage = true;
                    } else {
                        this.lastPage = false;
                    }
                } else {
                    toast(res.data.msg)
                }
            })
        },
        goSourceDetail(id) {
              let url = '/pages/personalCenter/designer/editSource/main?id=' + id;
              wx.navigateTo({url})
        },
    }
}
</script>

<style lang="less" scoped>
    .content {
        .sourceWrapper {
            background: #fff;
            margin-bottom: 10px;
        }
        .noOrder {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding-bottom: 20px;
                img {
                    width: 119px;
                    height: 124px;
                    margin-bottom: 20px;
                }
                p {
                    font-size:14px;
                    color:rgba(153,153,153,1);
                }
            }
    }
</style>
