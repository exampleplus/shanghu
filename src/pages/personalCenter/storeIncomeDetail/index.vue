<template>
  <div class="content">
    <div class="selTime">
      <div class="startTime">
        <!-- <div class="section__title">开始时间</div> -->
        <picker mode="date" value="date" @change="bindStartDateChange">
          <view class="picker">开始时间{{startTime}}</view>
        </picker>
      </div>
      <div class="middle">至</div>
      <div class="endTime">
        <!-- <div class="section__title">结束时间</div> -->
        <picker mode="date" value="date" @change="bindEndDateChange">
          <view class="picker">结束时间{{endTime}}</view>
        </picker>
      </div>
    </div>
    <div class="income" v-for="(item,index) in incomeList" :key="index">
      <div class="top">
        <div class="avator">
          <img
            :src="item.headimgurl"
            alt
          />
        </div>
        <div class="incomeInfo">
          <div class="userInfo">
            <span class="name">{{item.orderPerson}}</span>
            <span class="time">{{item.gmtCreate}}</span>
          </div>
          <div class="order">
            <span class="orderMoney">订单金额：￥{{item.orderAmount}}</span>
            <span class="sourceProfit">实际收入：+{{item.actualAmount}}</span>
          </div>
        </div>
      </div>
    </div>
     <div class="noOrder" v-if="incomeList.length <= 0 && hasData == false">
        <img src="/static/images/noOrder.png" alt="">
        <p>没有相关收入</p>
    </div>
  </div>
</template>
<script>
import { shopIncomeDetail } from "@/api/api";
import lastPage from "@/components/lastPage";
import { toast } from "@/utils/index";
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      hasNextPage:false,
      lastPage:false,
      pageSize: 10,
      pageIndex: 1,
      incomeList:[],
      hasData:true
    };
  },
   components:{
        lastPage
    },
  onLoad() {
    Object.assign(this.$data, this.$options.data())
    this._shopIncomeDetail();
  },
    onReachBottom() {
        let that = this;
        that.loadMore();
    },
  methods: {
      bindStartDateChange(e) {
          this.startTime = e.mp.detail.value;
          this.pageIndex = 1;
           this.incomeList = [];
          this._shopIncomeDetail();
      },
      bindEndDateChange(e) {
           this.endTime = e.mp.detail.value;
            this.pageIndex = 1;
            this.incomeList = [];
           this._shopIncomeDetail();
      },
       loadMore(e) {
            if (!this.hasNextPage) {
                return;
            } else {
                this.pageIndex++;
                this._shopIncomeDetail();
            }
        },
    _shopIncomeDetail() {
      let startTime = this.startTime;
      let endTime = this.endTime;
      let pageSize = this.pageSize;
      let pageIndex = this.pageIndex;
      shopIncomeDetail({ pageIndex, pageSize, startTime, endTime }).then(
        res => {
          if (!res.data.code) {
            console.log("res", res);
             this.hasNextPage = res.data.hasNextPage;
            let list = res.data.list;
            if(list.length > 0) {
              this.hasData = true;
            } else {
              this.hasData = false;
            }
            this.incomeList = this.incomeList.concat(list);
            if (!this.hasNextPage) {
                //最后一页
                this.lastPage = true;
            } else {
                this.lastPage = false;
            }
          } else {
            toast(res.data.msg);
          }
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  background: #fff;
  .selTime {
    display: flex;
    flex-direction: row;
    align-items: center;
    .startTime {
      flex: 1;
      display: flex;
      justify-content: center;
      font-size: 14px;
      color: rgba(74, 74, 74, 1);
      picker {
          .picker {
              height: 20px;
          }
      }
    }
    .middle {
      font-size: 14px;
      color: rgba(155, 155, 155, 1);
    }
    .endTime {
      justify-content: center;
      flex: 1;
      display: flex;
      font-size: 14px;
      color: rgba(74, 74, 74, 1);
      picker {
          .picker {
              height: 20px;
          }
      }
    }
  }
  .income {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    padding-top: 14px;
    .top {
      display: flex;
      align-items: center;
      padding-left: 15px;
      padding-right: 15px;
      .avator {
        width: 40px;
        height: 40px;
        margin-right: 15px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .incomeInfo {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .userInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          .name {
            font-size: 14px;
            font-weight: 600;
            color: rgba(9, 2, 3, 1);
          }
          .time {
            font-size: 12px;
            color: rgba(74, 74, 74, 1);
          }
        }
        .order {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .orderMoney {
            font-size: 12px;
            color: rgba(74, 74, 74, 1);
          }
          .sourceProfit {
            font-size: 12px;
            color: rgba(255, 81, 0, 1);
          }
        }
      }
    }
  }
  .noOrder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 120px;
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
