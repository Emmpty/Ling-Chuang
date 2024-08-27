import request from '@/static/utils/request.js'

// 获取图片上传参数
export function getUploadUrl(data) {
  return request({
    url: 'task/creative/attachment',
    method: 'POST',
    data: {}
  })
}

