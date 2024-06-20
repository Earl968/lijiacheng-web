import request from '@/utils/request'

// 竞品列表
export function getList(query) {
    return request({
        url: '/admin/produce/auction/list',
        method: 'get',
        params: query
    })
}
