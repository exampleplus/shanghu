import { getOss } from "@/api/api";



// 防抖
export function _debounce(fn, delay) {

    var delay = delay || 200;
    var timer;
    return function() {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}

function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

function formatTwo(n) {
    if (n >= 10) return n
    else return '0' + n
}
export function formatTime2(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}
/**
 * 根据日期获取月份
 */
export function getMonthStr(str) {
    //获取返回年月份
    let date = new Date(str);
    let month = str.substr(4, 2)
    let year = str.substr(0, 4)
        //获取当前年月份
    let nowDate = new Date();
    let nowMonth = nowDate.getMonth() + 1
    let nowYear = nowDate.getFullYear()
    if (nowYear == year && nowMonth != month) {
        return month + '月'
    } else if (nowYear == year && nowMonth == month) {
        return '本月'
    } else {
        return year + '年' + month + '月'
    }
}

/**
 * 获取年月日
 */
export function formatDate(date) {
    var date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

export function formatTime(date) {
    var date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + '   ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 根据日期获取年月
 */
export function getMonth() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    return year + '-' + month
}

/**
 * 页面跳转
 */
export function navigate(url) {
    wx.navigateTo({ url: url });
}

/**
 * 201801 ->  2018-01
 */
export function translateDate(date) {
    let month = date.substr(4, 2)
    let year = date.substr(0, 4)
    return year + '-' + month
}

/**
 * 返回上一页
 */
export function goBack() {
    wx.navigateBack({ delta: 1 })
}

/**
 * 判断年龄范围(精确到月)
 */
export function checkAge(birth) {
    //获取当前年月
    let date1 = new Date()
    let nowYear = date1.getFullYear()
    let nowMonth = date1.getMonth() + 1
        //获取生日
    let array = birth.split('-')
    let birthYear = array[0]
    let birthMonth = array[1]
        //比较
    if (nowYear > birthYear && nowMonth >= birthMonth) {
        return nowYear - birthYear
    } else if (nowYear > birthYear && nowMonth < birthMonth) {
        return nowYear - birthYear - 1
    } else {
        return 0
    }
}

/**
 * 判断多少月范围
 */
export function checkMonth(begin, end) {
    //获取开始日期
    let array1 = begin.split('-')
    let date1Year = array1[0]
    let date1Month = array1[1]
        //结束日期
    let array2 = end.split('-')
    let date2Year = array2[0]
    let date2Month = array2[1]
        //比较  2017-11  2018-12
    if (date2Year > date1Year && date2Month >= date1Month) {
        return (date2Year - date1Year) * 12 + (date2Month - date1Month) + 1
    } else if (date2Year > date1Year && date2Month < date1Month) {
        return (date2Year - date1Year) * 12 - (date1Month - date2Month) + 1
    } else {
        return false
    }
}



export function formatImgStr(str) {
    const newStr = str.substr(0, str.length - 1)
    return newStr
}

export function upLoadHost() {
    return 'https://yaochengkun-shanghu.f.wmeimob.com/'
}

export function toast(text, type, callback) {
    if (type === 'success') {
        wx.showToast({
            title: text,
            icon: 'success',
            mask: true,
            duration: 2000, //延迟时间,
        })
    } else if (type === 'loading') {
        wx.showToast({
            title: text,
            icon: 'loading',
            duration: 2000, //延迟时间,
        })
    } else {
        wx.showToast({
            title: text,
            icon: 'none',
            duration: 2000, //延迟时间,
        })
    }
    if (callback) {
        setTimeout(function() {
            callback()
        }, 1000)
    }
}

/**
 * 校验身份证
 */
export function IdentityCodeValid(code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "身份证地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "身份证校验位错误";
                pass = false;
            }
        }
    }
    return { pass: pass, tip: tip };
}


//获取随机数
function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//获取后缀名
function get_suffix(filename) {
    var pos = filename.lastIndexOf('.')
    var suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

/**
 * 生成唯一标识符
 *
 * @export
 * @returns
 */
export function guid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}