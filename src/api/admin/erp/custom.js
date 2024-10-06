import request from '@/utils/request'

// 查询客户级别
export function getLevel() {
    return request({
        url: '/admin/erp/custom/level',
        method: 'get'
    })
}

// 查询客户地区
export function getArea() {
    return request({
        url: '/admin/erp/custom/area',
        method: 'get'
    })
}

// 查询客户地区
export function getBanks() {
    return request({
        url: '/admin/erp/custom/bank',
        method: 'get'
    })
}

// 查询客户列表
export function getCustom(query) {
    return request({
        url: '/admin/erp/custom/list',
        method: 'get',
        params: query
    })
}

// 新增商户信息
export function add(data) {
    return request({
        url: '/admin/erp/custom/add',
        method: 'post',
        data: data
    })
}
