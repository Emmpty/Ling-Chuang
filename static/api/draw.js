import request from '@/static/utils/request.js'

// 获取图片上传参数
export function getUploadUrl(data) {
  return request({
    url: 'task/attachment?type=' + (data || '0'),
    method: 'POST',
    data: {}
  })
}

// 首图创建
export function create(data) {
  return request({
    url: 'task/good/create',
    method: 'POST',
    data
  })
}

// 抠图进度
export function process(data) {
  return request({
    url: 'task/good/process',
    method: 'POST',
    data
  })
}

// 生成ai商品图
export function start(data) {
  return request({
    url: 'task/good/start',
    method: 'POST',
    data
  })
}

// 获取ai商品图场景列表
export function suggest(data) {
  return request({
    url: 'task/good/suggest',
    method: 'POST',
    data
  })
}