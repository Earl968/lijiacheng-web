import request from '@/utils/request'

// 查询所有sop数据
export function GetEsopData() {
    return request({
        url: '/admin/prm/sopinfo/list',
        method: 'get'
    })
}

export function GetEsopDataByName(data) {
    return request({
        url: '/admin/prm/sopinfo/selectById',
        method: 'post',
        params: data
    })
}

export function RemoveEsopDataByName(data) {
    return request({
        url: '/admin/prm/sopinfo/deleteById',
        method: 'post',
        params: data
    })
}

export function insertEsop(data) {
    return request({
        url: '/admin/prm/sopinfo/insert',
        method: 'post',
        params: data
    })
}
