import request from '@/utils/request'

// 订单列表
export function listOrder(query) {
    return request({
        url: '/admin/produce/order/list',
        method: 'get',
        params: query
    })
}

// 查询商品变动
export function getProductUpdate(data) {
    return request({
        url: '/admin/produce/order/product/update',
        method: 'post',
        data: data
    })
}

// 查询价格变动
export function getPriceUpdate(orderNo) {
    return request({
        url: '/admin/produce/order/price/update/' + orderNo,
        method: 'get'
    })
}

// 查询订单资料
export function getInformation(orderNo, orderType) {
    return request({
        url: '/admin/produce/order/information/' + orderType + '/' + orderNo,
        method: 'get'
    })
}

export function customerComplaints(data) {
    return request({
        url: '/admin/produce/order/customer/complaints',
        method: 'post',
        data: data
    })
}
export function sample(data) {
    return request({
        url: '/admin/produce/order/sample',
        method: 'post',
        data: data
    })
}

export function uploadSuccess(data) {
    return request({
        url: '/admin/produce/order/upload/success',
        method: 'post',
        data: data
    })
}
