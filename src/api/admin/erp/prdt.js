import request from '@/utils/request'

// 查询客户级别
export function getList(query) {
    return request({
        url: '/admin/erp/prdt',
        method: 'get',
        params: query
    })
}


// 新增商户信息
export function updateQtyLow(prdNo, num) {
    return request({
        url: '/admin/erp/prdt/update/' + prdNo + '/' + num,
        method: 'post',
    })
}
