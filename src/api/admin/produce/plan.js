import request from '@/utils/request'

// 订单列表
export function listPlans(data) {
    return request({
        url: '/admin/erp/production/selectPlans',
        method: 'post',
        data: data
    })
}
