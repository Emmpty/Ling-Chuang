import request from '../utils/request.js'

// 抽奖次数
export function walletInfo(data) {
  return request({
    url: 'wallet/wheel/info',
    method: 'POST',
    data
  })
}

// 开始抽奖
export function walletTurn(data) {
  return request({
    url: 'wallet/wheel/turn?type=' + data.type + '&ten=' + data.ten,
    method: 'POST',
    data
  })
}
// 抽奖记录
export function walletRecord(data) {
  return request({
    url: 'wallet/wheel/turn_logs',
    method: 'POST',
    data
  })
}
// 灵力奖池
export function betpools(data) {
  return request({
    url: 'user/wallet/betpools',
    method: 'POST',
    data
  })
}
// 灵力投注
export function addBet(data) {
  return request({
    url: 'user/wallet/add_bet',
    method: 'POST',
    data
  })
}
// 灵力投注记录
export function betLogs(data) {
  return request({
    url: 'user/wallet/bet_logs',
    method: 'POST',
    data
  })
}
// 灵力投注排行
export function betRank(data) {
  return request({
    url: 'user/wallet/bet_rank',
    method: 'POST',
    data
  })
}

// 灵力投注概率
export function betWeight(data) {
  return request({
    url: 'user/wallet/bet_weight',
    method: 'POST',
    data
  })
}



