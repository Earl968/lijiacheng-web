import request from '@/utils/request'

export function getFinanceValuation(data) {
    return request({
        url: '/admin/financeValuation/list',
        method: 'get',
        params: data
    })
}

export function getCustType(data) {
    return request({
        url: '/admin/financeValuation/selectCustType',
        method: 'get',
        params: data
    })
}


export function getEcn(data) {
    return request({
        url: '/admin/financeValuation/selectEcn',
        method: 'post',
        data: data
    })
}

export function getMoney(data) {
    return request({
        url: '/admin/financeValuation/selectMoney',
        method: 'post',
        data: data
    })
}

export function modifyOne(data) {
    return request({
        url: '/admin/financeValuation/updateOne',
        method: 'post',
        data: data
    })
}


export function getThaiHis(data) {
    return request({
        url: '/admin/financeValuation/selectThaiHis',
        method: 'post',
        data: data
    })
}

export function modifyList(data,params) {
    return request({
        url: '/admin/financeValuation/updateList',
        method: 'post',
        params: params,
        data: data
    })
}
