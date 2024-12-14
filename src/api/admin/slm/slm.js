import request from '@/utils/request'

// 查询客户级别
export function summary(query) {
    return request({
        url: '/admin/slm/summary',
        method: 'get',
        params: query
    })
}

// 查询汇率
export function getExchangeRate() {
    return request({
        url: '/admin/slm/exchange/rate',
        method: 'get',
    })
}

// 出入库操作
export function stockControl(data) {
    return request({
        url: '/admin/slm/stock/control',
        method: 'post',
        data: data
    })
}


// 查询汇率
export function getBatchDetail(storeNo, productNo, batchNo) {
    return request({
        url: '/admin/slm/batch/' + storeNo + '/' + productNo + '/' + batchNo,
        method: 'get',
    })
}

