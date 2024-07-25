import request from '@/utils/request'

// 订单列表
export function GetLines() {
    return request({
        url: '/admin/prm/ljcShopEmp/lines',
        method: 'get'
    })
}

//
export function GetShopEmp(data) {
    //console.log(data);
    return request({
        url: '/admin/prm/ljcShopEmp/list',
        method: 'get',
        params: data
    })
}

//
export function updateShopEmp(data) {
    //console.log(data);
    return request({
        url: '/admin/prm/ljcShopEmp/update',
        method: 'post',
        data: data
    })
}
