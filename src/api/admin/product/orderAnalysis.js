import request from '@/utils/request'

//根据订单号和行号查询对应订订单成本明细-和子件成本明细
export function getAnalysis(data) {
    return request({
        url: '/admin/produce/order/Analysis/select',
        method: 'get',
        params: data
    })
}

//根据订单号和行号查询对应订订单成本明细-和子件成本明细
export function getAnalysisByprdNo(data) {
    return request({
        url: '/admin/produce/order/Analysis/selectByprdNo',
        method: 'get',
        params: data
    })
}

//根据订单号和行号查询对应订订单成本明细-和子件成本明细
export function getAnalysisDetail(data) {
    return request({
        url: '/admin/produce/order/Analysis/detail',
        method: 'post',
        data: data
    })
}
