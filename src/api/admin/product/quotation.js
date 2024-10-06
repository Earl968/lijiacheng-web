import request from '@/utils/request'

export function GetQuotationOrder() {
    return request({
        url: '/admin/erp/quotation/select',
        method: 'get'
    })
}

export function GetOrderCostById(data) {
    return request({
        url: '/admin/orderCost/selectById',
        method: 'get',
        params: data
    })
}

export function updateOrderCost(data) {
    return request({
        url: '/admin/orderCost/update',
        method: 'post',
        data: data,
    })
}

