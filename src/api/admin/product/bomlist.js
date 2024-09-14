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

export function DownLoadBom(params) {
    return request({
        url: '/admin/erp/bomlist/downLoadBoms',
        method: 'get',
        params: params
    })
}

