import { join, getOss } from "@/api/api";
import request from '../../api/request';


export async function uploadImg(path) {
    return new Promise(async reslove => {
        const { data } = await getOss({})
        let fileName = data.dir + random_string() + get_suffix(path);
        wx.uploadFile({
            url: data.host, //开发者服务器 url
            filePath: path, //要上传文件资源的路径
            name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
            formData: {
                'name': path,
                'OSSAccessKeyId': data.accessid,
                'policy': data.policy,
                'Signature': data.signature,
                'key': fileName,
                'success_action_status': '200'
            },
            success: ret => {
                reslove(`${data.host}/${fileName}`);
                wx.hideLoading();
            },
            fail: () => {},
        });

        // wx.uploadFile({
        //     url: join("common/upload"), //开发者服务器 url
        //     filePath: path, //要上传文件资源的路径
        //     name: "file",
        //     formData: {
        //         scene: "images",
        //         file: path
        //     },
        //     success: ret => {
        //         let path = JSON.parse(ret.data).path;
        //         reslove(path);
        //     },
        //     fail: () => {
        //         wx.showToast({
        //             title: "上传失败了！",
        //             icon: "none",
        //             duration: 2000
        //         });
        //     }
        // });
    })
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

export async function getImageIntro(url) {
    return request.get(url + '?x-oss-process=image/info').then(res => res.data);
}