<template>
  <div class="stars">
    <img
      v-for="(star,index) in stars"
      :src="star.src"
      @click="rating(index)"
      :key="index"
      alt="星星图片"
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      starOffImg: "/static/images/starOff.png",
      starOnImg: "/static/images/starOn.png",
      stars: [
        {
          src: "/static/images/starOff.png",
          active: false
        },
        {
          src: "/static/images/starOff.png",
          active: false
        },
        {
          src: "/static/images/starOff.png",
          active: false
        },
        {
          src: "/static/images/starOff.png",
          active: false
        },
        {
          src: "/static/images/starOff.png",
          active: false
        }
      ],
      starNum: 0
    };
  },
  props:{
    index:{
      type:Number
    }
  },
  mounted() {
    
  },
  onLoad() {
    var total = this.stars.length; //星星总数
    for (var i = 0; i < total; i++) {
            this.stars[i].src = this.starOffImg;
            this.stars[i].active = false;
      }
  },
  methods: {
    rating: function(index) {
      var total = this.stars.length; //星星总数
      var idx = index + 1; //这代表选的第idx颗星-也代表应该显示的星星数量

      //进入if说明页面为初始状态
      if (this.starNum == 0) {
        this.starNum = idx;
        for (var i = 0; i < idx; i++) {
          this.stars[i].src = this.starOnImg;
          this.stars[i].active = true;
        }
      } else {
        //如果再次点击当前选中的星级-仅取消掉当前星级，保留之前的。
        if (idx == this.starNum) {
          for (var i = index; i < total; i++) {
            this.stars[i].src = this.starOffImg;
            this.stars[i].active = false;
          }
        }
        //如果小于当前最高星级，则直接保留当前星级
        if (idx < this.starNum) {
          for (var i = idx; i < this.starNum; i++) {
            this.stars[i].src = this.starOffImg;
            this.stars[i].active = false;
          }
        }
        //如果大于当前星级，则直接选到该星级
        if (idx > this.starNum) {
          for (var i = 0; i < idx; i++) {
            this.stars[i].src = this.starOnImg;
            this.stars[i].active = true;
          }
        }

        var count = 0; //计数器-统计当前有几颗星
        for (var i = 0; i < total; i++) {
          if (this.stars[i].active) {
            count++;
          }
        }
        this.starNum = count;
      }
       this.$emit('service', this.starNum,this.index)
      //  console.log("星星数",this.starNum);
    }
  }
};
</script>
<style lang="less" scoped>
    .stars {
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
          margin-right: 15px;
        }
    }
</style>
