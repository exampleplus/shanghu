<template>
  <div class="allEvaluate">
    <evaluate-item :judgeList="judgeList"></evaluate-item>
     <last-page :last="{length: judgeList.length, lastPage: lastPage}"></last-page>
  </div>
</template>
<script>
import evaluateItem from "@/components/evaluateItem";
import lastPage from "@/components/lastPage";
import { getAllEvaluate } from '@/api/api';
import { toast } from '@/utils/index'

export default {
  components: {
    evaluateItem,
    lastPage
  },
  data() {
    return {
      goodsId:'',
      pageIndex:1,
      pageSize:10,
      hasNextPage: false,
      lastPage:false,
      judgeList: []
    };
  },
  onLoad() {
     Object.assign(this.$data, this.$options.data())

    this._getEvaluate();
  },
   onReachBottom() {
    let that = this;
    that.loadMore();
  },

  methods:{
     // 上拉加载更多
    loadMore(e) {
      if (!this.hasNextPage) {
        return;
      } else {
        this.pageIndex++;
        this._getEvaluate();
      }
    },
    _getEvaluate() {
      let that = this;
      let goodsId = that.$mp.query.goodsId;
      let pageIndex = that.pageIndex;
      let pageSize = that.pageSize;
      getAllEvaluate({goodsId,pageIndex,pageSize}).then(res => {
        if(!res.data.code) {
          that.hasNextPage = res.data.hasNextPage;
          let list = res.data.list;
          that.judgeList = that.judgeList.concat(list);
          that.judgeList.map(ele => {
            let obj = ele;
            obj.imgs = obj.img.split(',');
            return obj;
          })
          if (!that.hasNextPage) {
              //最后一页
              that.lastPage = true;
            } else {
              that.lastPage = false;
            }
        } else {
          toast(res.data.msg)
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
    .allEvaluate {
        background: #f6f6f6;
        height: 100%;
    }
</style>
