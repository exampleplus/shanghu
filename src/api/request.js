import Fly from 'flyio'
const request = new Fly()
import { toast } from '@/utils/index'

request.interceptors.request.use((req) => {
    const token = wx.getStorageSync('token')
    if (token) {
        req.headers['Authorization'] = token
    }
    return req
})

request.interceptors.response.use(
    (response, promise) => {
        return promise.resolve(response)
    },
    (err, promise) => {
        console.log(err.status)
        let that = this
        if (err.status === 401) {
            wx.navigateTo({ url: '/pages/authorization/main' })
            return
        } else if (err.status === 403) {
            wx.navigateTo({ url: '/pages/regisiter/main' })
            return
        } else if (err.status != 200) {
            toast(err.response.data.msg)
            return
        }
        return promise.reject(err.response)
    }
)
export default request