import request from '@/utils/request'

// 查询所有sop数据
export function GetBomQuery(params) {
    if(params.hasOwnProperty('parNo')){
        return request({
            url: '/admin/erp/bomlist/bomQueryByParNo',
            method: 'get',
            params: params
        })
    }
    else{
        return request({
            url: '/admin/erp/bomlist/bomQueryByCustName',
            method: 'get',
            params: params
        })
    }
}

export function getCustNames() {
    return request({
        url: '/admin/erp/cust/getCustNames',
        method: 'get'
    })
}

export function GetManHoursByPartno(data) {
    return request({
        url: '/admin/incompleteproductmanhour/selectByPartnos',
        method: 'post',
        data: data,
    })
}

export function ModifyManHours(data) {
    return request({
        url: '/admin/incompleteproductmanhour/update',
        method: 'post',
        data: data,
    })
}
