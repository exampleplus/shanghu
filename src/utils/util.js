export function formatGetUri(obj) {
    const params = []
    Object.keys(obj).forEach((key) => {
        let value = obj[key]
        if (typeof value === 'undefined' || value === null || value === '') {} else {
            params.push([key, encodeURIComponent(value)].join('='))
        }
    })
    return '?' + params.join('&')
}
export function navto(link, query) {
    wx.navigateTo({
        url: link + `${formatGetUri(query)}`
    })
}
export function formatTime(time, type) {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const t1 = [formatTwo(year), formatTwo(month), formatTwo(day)].join('-')
    const t3 = month + '月' + day + '日'
    const t2 = [formatTwo(hour), formatTwo(minute), formatTwo(second)].map(formatNumber).join(':')
    if (type === 'hours') return `${t1} ${t2}`
    else if (type === 'showHours') return `${t2}`
    else if (type === 'words') {
        if (new Date(time).toDateString() === new Date().toDateString()) {
            return `今天 ${t2}`
        } else {
            return `${t3} ${t2}`
        }
    } else return `${t1}`
}
const formatTwo = n => {
    if (n >= 10) return '' + n
    else return '0' + n
}
const formatNumber = n => {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
export function timeCha(time) {
    var d2 = time
    var d1 = new Date().getTime()
    var d3 = new Date(d2 - d1)
    let timeChaData = formatTwo((d3).getHours()) + ':' + formatTwo((d3).getMinutes()) + ':' + formatTwo((d3).getSeconds())
    return timeChaData
}
export function timeFn(d1, type) {
    var dateBegin = d1
    var dateEnd = new Date()
    var dateDiff = Math.abs(dateBegin - dateEnd.getTime())
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
    var leave1 = dateDiff % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    var hours2 = Math.floor(leave1 / (3600 * 1000)) + dayDiff * 24
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    if (type === 'words') return formatTwo(hours) + ':' + formatTwo(minutes) + ':' + formatTwo(seconds)
    else if (type === 'hours') return formatTwo(hours2) + ':' + formatTwo(minutes) + ':' + formatTwo(seconds)
    else return dayDiff + '天' + ":" + formatTwo(hours) + ':' + formatTwo(minutes) + ':' + formatTwo(seconds)
}
//   export async function verifyGoodsStockFun (formData, callBack) {
//     const data = await verifyGoodsStock(formData)
//     callBack(data)
//   }
// 跳转tabBar
export function navHome(link) {
    wx.switchTab({
        url: link
    })
}
// 跳转tabBar
export function redirectTo(link) {
    wx.redirectTo({
        url: link
    })
}
// 多张图片放大预览
export function previewImgUrl(currentImg, urls) {
    var url = []
    for (var i = 0; i < urls.length; i++) {
        url.push(urls[i])
    }
    previewImg(currentImg, url)
}
// 图片放大
export function previewImg(current, urls) {
    wx.previewImage({
        current: current,
        urls: urls
    })
}
// 微信支付
export function requestPayment(res, callback, failBack) {
    wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.pkg,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function(res) {
            callback(res)
        },
        'fail': function(res) {
            failBack()
        }
    })
}
// 跳转t
export function redirectToQuery(link, query) {
    wx.redirectTo({
        url: link + `${formatGetUri(query)}`
    })
}
// 是否为手机号
export function isPhone(str) {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    return reg.test(str)
}
// 是否为邮箱
export function isEmail(str) {
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    return reg.test(str)
}