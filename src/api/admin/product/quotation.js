import request from '@/utils/request'



//修改订单成本总览的编辑状态和编辑时间
export function modifyOverviewEdate(data) {
    return request({
        url: '/admin/erp/quotation/updateOverviewEdate',
        method: 'get',
        params: data
    })
}

//修改订单成本的备注信息
export function modifyOverviewRemarks(data) {
    return request({
        url: '/admin/erp/quotation/updateOverviewRemarks',
        method: 'get',
        params: data
    })
}



//根据订单获取对应行号
export function getOrderNumber(data) {
    return request({
        url: '/admin/erp/quotation/getOrderNumber',
        method: 'get',
        params: data
    })
}

//根据订单号和行号查询对应订单成本总览
export function getOrderCostOverview(data) {
    return request({
        url: '/admin/erp/quotation/getOrderCostOverview',
        method: 'get',
        params: data
    })
}

//获取对应订单成本总览-根据日期
export function getOverviewList(data) {
    return request({
        url: '/admin/erp/quotation/getOverviewList',
        method: 'get',
        params: data
    })
}

//根据订单号和行号查询对应订订单成本明细-和子件成本明细
export function getSubcomponentCost(data) {
    return request({
        url: '/admin/erp/quotation/getSubcomponentCost',
        method: 'get',
        params: data
    })
}

//根据订单号和行号查询对应订订单成本明细-和子件成本明细
export function modifySubcomponentCost(data) {
    return request({
        url: '/admin/erp/quotation/updateSubcomponentCost',
        method: 'post',
        data: data
    })
}

//删除以保存的本地数据
export function removeOrderCostOverview(data) {
    return request({
        url: '/admin/erp/quotation/removeOrderCostOverview',
        method: 'get',
        params: data
    })
}
