import request from '@/utils/request'

// 订单列表
export function getAssembleDemandDesigns(data) {
    return request({
        url: '/admin/produce/plan/list',
        method: 'get',
        params: data
    })
}

// 查询价格变动
export function getPagelist(data) {
    return request({
        url: '/admin/produce/plan/pageList',
        method: 'get',
        params: data
    })
}


// 查询价格变动
export function modifyAssembleDemandDesigns(data) {
    return request({
        url: '/admin/produce/plan/update',
        method: 'post',
        data: data
    })
}

