import request from "@/utils/request";

export function rateList(query) {
    return request({
        url: '/admin/exchange/rate/list',
        method: 'get',
        params: query
    })
}

// 查询商品变动
export function save(data) {
    return request({
        url: '/admin/exchange/rate/insert',
        method: 'post',
        data: data
    })
}
