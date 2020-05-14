var productModel = {
    products: ko.observableArray()
}

//function sendAjaxRequest(url, callback) {
//    $.ajax("/product" + (url ? "/" + url : ""), {
//        success: callback
//    });
//}

//function getProducts() {
//    sendAjaxRequest("ListJson", function (data) {
//        productModel.products.removeAll();
//        for (var i = 0; i < data.length; i++) {
//            productModel.products.push(data[i]);
//        }
//    });
//}

//function getProducts() {
//    $.ajax({
//        type: "GET",
//        url: "/product/ListJson",
//        success: function (data) {
//            productModel.products(data);
//        }
//    });
//}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/product/ListJson",
        success: function (data) {
            productModel.products(data);
        }
    });
    });