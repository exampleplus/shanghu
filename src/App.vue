<script>
export default {
   onLaunch () {
    // this.checkToken();
    },
    methods:{
       /**
     * 判断token是否存在
     */
      checkToken(){
        const token = wx.getStorageSync('token')
        if(!token){
            console.log("无token")
            wx.redirectTo({url: '/pages/authorization/main'})
        }
      }
    }
}
</script>

<style>
page {
  height: 100%;
  background: #f5f5f5;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
