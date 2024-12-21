import request from '@/utils/request'

export function listPlans(data) {
    return request({
        url: '/admin/erp/production/selectSmtPlans',
        method: 'post',
        data: data
    })
}


// 订单列表
export function pluginsPlans(data) {
    return request({
        url: '/admin/erp/production/selectPluginsPlans',
        method: 'post',
        data: data
    })
}
