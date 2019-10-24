import request from './request'
const hostName = 'https://yaochengkun-shanghu.f.wmeimob.com/api/' //本地服务器
    // const hostName = 'https://xcx.shanghusm.com/api/' //线上服务器

//获取阿里云oss
export const getOss = data => request.get(hostName + 'common/oss-token', data)

// 获取token
export const getToken = data => request.get(hostName + 'wx/wx-token', data)

//查询用户信息
export const getUserInfo = data => request.get(hostName + 'user/info', data)

export const getUserInfos = data => request.get(hostName + 'user/infos', data)

//首页
export const getIndex = data => request.get(hostName + 'index', data)

//根据id查询昵称
export const getNickName = data => request.get(hostName + 'user/nickname', data)


//首页全部搜索
export const allSearch = data => request.get(hostName + 'index/search/all', data)

//指定类型搜索
export const typeSearch = data => request.get(hostName + 'index/search', data)

//素材标签
export const getLabel = data => request.get(hostName + 'index/label', data)

//查看所有一级分类
export const getClassify = data => request.get(hostName + 'goodsClassify/classify', data)

//查看二级分类
export const getSecondClassify = data => request.get(hostName + `goodsClassify/second/${data.id}`)

//查看商品分类列表
export const getgoodsClassify = data => request.get(hostName + 'goods/classify', data)

//查询场景详情里面的下级场景
export const queryLowerScene = data => request.get(hostName + `scene/${data.sceneId}`)

//查询场景详情下的商品和素材
export const querySceneGoods = data => request.get(hostName + `scene/detail`, data)

//商品详情
export const goodsDetail = data => request.get(hostName + `goods/detail`, data)

//素材详情
export const materialDetail = data => request.get(hostName + `goods/material/${data.id}`)


//收藏
export const collect = data => request.post(hostName + 'collect', data)

//取消收藏
export const cancelCollect = data => request.put(hostName + 'collect', data)

//查看购物车数量
export const getcartNum = data => request.get(hostName + `goods/car/num`)

//购物车
export const getcart = data => request.get(hostName + `goods/car`)

//加入购物车
export const addCart = data => request.post(hostName + `goods/car`, data)

//修改购物车数量
export const changeCart = data => request.put(hostName + `goods/car`, data)

//删除购物车
export const delCart = data => request.put(hostName + `goods/car/del`, data)

//地址列表
export const allAddress = data => request.get(hostName + 'user/address/getList', data)

//新增收货地址
export const newAddress = data => request.post(hostName + `user/address/add`, data)

//删除地址
export const delAddress = data => request.put(hostName + `user/address/delete`, data)

//修改收货地址
export const editAddress = data => request.put(hostName + `user/address/update`, data)

//查看收货地址
export const checkAddress = data => request.get(hostName + `user/address/${data.id}`)

//全部评价
export const getAllEvaluate = data => request.get(hostName + 'goods/evaluate', data)

//查看用户收藏
export const checkUserCollect = data => request.get(hostName + 'collect/', data)

//查看售后列表
export const checkSaleList = data => request.get(hostName + 'refund/list', data)

//单条售后详情
export const checkSaleDetail = data => request.get(hostName + `refund/${data.id}`)

//获取验证码
export const getVertifyCode = data => request.get(hostName + 'login/code', data)

//注册
export const login = data => request.get(hostName + 'login/register', data)

//订单列表
export const getOrderList = data => request.get(hostName + 'order/getOrderList', data)

//订单详情
export const getOrderDetail = data => request.get(hostName + `order/${data.id}`)

//申请售后
export const applyAfterSale = data => request.post(hostName + `refund`, data)

//上传图片
export const upImgs = data => request.post(hostName + `common/upload`, data)

//查看物流
export const checkSheeping = data => request.get(hostName + `order/express`, data)

//购买校验库存
export const verifyGoodsStock = data => request.put(hostName + `goods/verifyGoodsStock`, data)

//获取下单信息
export const getPayInfo = data => request.put(hostName + `goods/getPayInfo`, data)

//获取运费
export const getRreight = data => request.put(hostName + `goods/pay/getRreight`, data)

//下单支付
export const orderPay = data => request.post(hostName + `goods/pay`, data)

//订单号付款
export const pay = data => request.post(hostName + `goods/pay/orderNo`, data)

//取消订单
export const cancelOrder = data => request.put(hostName + `order/cancelOrder`, data)

//删除订单
export const delOrder = data => request.put(hostName + `order/delOrder`, data)

//确认收货
export const confirmOrder = data => request.put(hostName + `order/confirmOrder`, data)

//评价
export const evaluate = data => request.post(hostName + `order/evaluate`, data)

//发票列表
export const getInvoinceList = data => request.get(hostName + `user/invoice/getList`, data)

//编辑发票
export const editInvoince = data => request.put(hostName + `user/invoice/update`, data)

//删除发票
export const delInvoince = data => request.put(hostName + `user/invoice/delete`, data)

//添加发票
export const addInvoince = data => request.post(hostName + `user/invoice/add`, data)

//查看单条发票
export const checkInvoince = data => request.get(hostName + `user/user/invoice/${data.id}`)

//diy下单
export const diyconfirmOrder = data => request.post(hostName + `diy/pay`, data)

//查看diy下单信息
export const checkDiyOrderInfo = data => request.put(hostName + `diy/pay/getPayInfo`, data)

//基材库存
export const BaseMaterialStock = data => request.put(hostName + `diy/pay/verifyBaseMaterialStock`, data)

//diy订单运费
export const getDiyRreight = data => request.put(hostName + `diy/pay/getRreight`, data)

//获取diy订单评价信息
export const diyEvaluate = data => request.get(hostName + `order/diy/evaluate/info`, data)

//评价素材
export const baseEvaluate = data => request.post(hostName + `order/base/evaluate`, data)

//成为设计师协议
export const designerAgreement = data => request.get(hostName + `designer/agreement`, data)

//申请成为设计师
export const applyDesigner = data => request.post(hostName + `designer`, data)

//查看设计师标签
export const getdesignerLabel = data => request.get(hostName + `designer/label`, data)

//设计师主页
export const getDesignerInfo = data => request.get(hostName + `designer/info`, data)

//查看设计师标签
export const getDesignerlabel = data => request.get(hostName + `designer/label`, data)

//查看设计师素材
export const getDesignerMaterial = data => request.get(hostName + `designer/material`, data)

//查看设计师成品
export const getDesignerWorks = data => request.get(hostName + `designer/works`, data)

//查看设计师动态
export const getDesignerTrends = data => request.get(hostName + `designer/trends`, data)

//查看设计师订单统计
export const getDesignerStatistics = data => request.get(hostName + `designer/statistics`, data)

//查看设计师钱包信息
export const getDesignerWallet = data => request.get(hostName + `designer/wallet`, data)

//投诉设计师
export const complainDesigner = data => request.post(hostName + `designer/complain`, data)

//删除设计师成品
export const delDesignerWorks = data => request.put(hostName + `designer/works`, data)

//设计师 设计成品
export const addWorks = data => request.post(hostName + `designer/works`, data)

//申请提现
export const withdraw = data => request.post(hostName + `withdraw`, data)

//查看提现列表
export const withDrawList = data => request.get(hostName + `withdraw`, data)

//查看设计师收入明细
export const designerProfit = data => request.get(hostName + `designer/order`, data)

//编辑设计师素材
export const editDesignermaterial = data => request.put(hostName + `designer/material`, data)

//绑定银行卡
export const bindCard = data => request.post(hostName + `withdraw/card`, data)

//砍价列表
export const bargainList = data => request.get(hostName + `bargain`, data)

//砍价详情
export const bargainDetail = data => request.get(hostName + `bargain/goodsById`, data)

//砍价库存
export const bargainVerifyGoodsStock = data => request.get(hostName + `bargain/verifyGoodsStock`, data)

//生成砍价id
export const getBargainId = data => request.post(hostName + `bargain/save`, data)

//砍价分享界面
export const shareBargainDetail = data => request.get(hostName + `bargain/detail`, data)

//帮忙砍价
export const helpBargain = data => request.get(hostName + `bargain/help`, data)

//砍价订单信息
export const bargainOrderInfo = data => request.get(hostName + `bargain/payInfo`, data)

//砍价下单
export const confirmBargainOrder = data => request.post(hostName + `bargain/order`, data)

//砍价订单列表
export const getBargainOrder = data => request.get(hostName + `bargain/order`, data)

//分享商品绑定客户
export const distributorBinding = data => request.get(hostName + `distributor/binding`, data)

//分销管理 我的下级
export const distributorNext = data => request.get(hostName + `distributor/next`, data)

//分销 收入明细
export const distributorProfit = data => request.get(hostName + `distributor/profit`, data)

//申请成为店铺
export const applyShop = data => request.post(hostName + `shop`, data)

//店铺协议
export const shopAgreement = data => request.get(hostName + `shop/agreement`, data)

//店铺标签
export const getShopLabel = data => request.get(hostName + `shop/label`, data)

//店铺详情
export const shopDetail = data => request.get(hostName + `shop`, data)

//店铺详情商品列表
export const shopGoods = data => request.get(hostName + `shop/goods`, data)

//店铺收入明细
export const shopIncomeDetail = data => request.get(hostName + `shop/order`, data)

//店铺 订单统计
export const shopStatistics = data => request.get(hostName + `shop/statistics`, data)

//团队订单列表
export const getTeamOrder = data => request.get(hostName + `diy/group/order/list`, data)

//团队购买的信息
export const groupPayInfo = data => request.get(hostName + `diy/group/getPayInfo`, data)

//团队购买运费
export const groupRreight = data => request.get(hostName + `diy/group/getRreight`, data)

//团购订单支付
export const groupPay = data => request.post(hostName + `diy/group`, data)

//查看成员列表
export const groupMember = data => request.get(hostName + `diy/group/detail`, data)

//生成模板
export const groupTemplate = data => request.post(hostName + `diy/group/template`, data)

//校验是否可以加入团队

export const isCanJoinTeam = data => request.get(hostName + `diy/group/verify`, data)

//团队订单详情
export const groupOrderDetail = data => request.get(hostName + `diy/group/info`, data)

//团长修改模板
export const groupModify = data => request.put(hostName + `diy/group/template/modify`, data)

//团长修改团员信息
export const memberModify = data => request.put(hostName + `diy/group/user/modify`, data)

//团员加入团队
export const joinTeam = data => request.post(hostName + `diy/group/join`, data)

//团长删除成员
export const delMemer = data => request.put(hostName + `diy/group/del`, data)

//查看团员配置信息
export const editUserDiyInfo = data => request.get(hostName + `diy/group/user/info`, data)

//检验团队购买库存
export const groupVerifyGoodsStock = data => request.get(hostName + `diy/group/verifyGoodsStock`, data)

//团队定制规则
export const groupRule = data => request.get(hostName + `diy/group/rule`, data)

//获取团队订单评价信息
export const groupEvaluate = data => request.get(hostName + `diy/group/evaluate/info`, data)

//取消团购设计中订单
export const cancelDesignOrder = data => request.get(hostName + `diy/group/cancel`, data)

//校验设计师审核进度
export const checkDesignerProcess = data => request.get(hostName + `user/designer/verify`, data)

//校验设计师审核进度
export const checkShopProcess = data => request.get(hostName + `user/shop/verify`, data)

//一级分销商二维码
export const firstQrcode = data => request.get(hostName + `user/qrCode`, data)

//二维码绑定关系
export const binding = data => request.get(hostName + `distributor/code/binding`, data)

//砍价生成二维码分享到朋友圈
export const bargainQrcode = data => request.get(hostName + `user/bargain/qrCode`, data)


export const hadBargain = data => request.get(hostName + `bargain/exist`, data)


export function get(url, data) {
    return request.get(hostName + url, data);
}

export function join(url) {
    return hostName + url;
}