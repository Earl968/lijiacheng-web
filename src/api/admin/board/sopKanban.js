import request from '@/utils/request'

// 查询所有sop数据
export function GetEsopData() {
    return request({
        url: '/admin/prm/ljcShopjitGongyifile/list',
        method: 'get'
    })
}

// 按文件名模糊查询
export function GetEsopLikeByName(FileName) {
    return request({
        url: '/admin/prm/ljcShopjitGongyifile/listLike',
        method: 'get',
        params: FileName
    })
}



// // 查询所有sop数据
// export function GetEsopData() {
//     return request({
//         url: '/admin/prm/sopinfo/list',
//         method: 'get'
//     })
// }

// export function checkUserKey() {
//     return request({
//         url: '/admin/prm/sopinfo/checkUserKey',
//         method: 'post'
//     })
// }

// export function GetEsopDataByName(data) {
//     return request({
//         url: '/admin/prm/sopinfo/selectById',
//         method: 'post',
//         params: data
//     })
// }

// export function RemoveEsopDataByName(data) {
//     return request({
//         url: '/admin/prm/sopinfo/deleteById',
//         method: 'post',
//         params: data
//     })
// }

// export function insertEsop(data) {
//     return request({
//         url: '/admin/prm/sopinfo/insert',
//         method: 'post',
//         params: data
//     })
// }

// export function indexDOMContentLoaded(){
//         var cards = document.querySelectorAll("a.card");
//         var background = document.querySelector(".background");

//         // Store the index of the last hovered card
//         var lastHoveredCardIndex = localStorage.getItem("lastHoveredCardIndex") || 0;
//         // Set the background to the last hovered card by default
//         var cardRect = cards[lastHoveredCardIndex].getBoundingClientRect();

//         var x = cardRect.left  + cardRect.width / 2;
//         var y = cardRect.top  + cardRect.height / 2;


//         background.style.width = cardRect.width + "px";
//         background.style.height = cardRect.height + "px";
//         background.style.transform = `translate(${x - cardRect.width / 2}px, ${y - cardRect.height / 2}px)`;
//         background.style.opacity = "0"; // Set opacity to 0 when the page loads

//         cards.forEach(function(card, index) {
//             card.addEventListener("mouseenter", function(e) {
//                 // If the card is zoomed in, return early to prevent the hover effect
//                 if (card.classList.contains("zoomed")) {
//                     return;
//                 }

//                 var rect = card.getBoundingClientRect();

//                 background.style.width = rect.width + "px";
//                 background.style.height = rect.height + "px";
//                 background.style.transform = `translate(${ card.offsetLeft  }px, ${ card.offsetTop }px)`;
//                 background.style.opacity = "1"; // Change opacity to 1 when a card is hovered over
//                 background.style.top = "0%";
//                 background.style.left = "0%";
//                 background.style.transformOrigin = "center";
//             });

//             card.addEventListener("mouseleave", function(e) {
//                 background.style.opacity = "0"; // Change opacity back to 0 when the mouse leaves a card
//                 background.style.width = "0px";
//                 background.style.height = "0px";
//             });
//         });
// }
