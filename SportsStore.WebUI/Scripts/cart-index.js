var cartModel = {
    cart: ko.observableArray()
}

function formatCurrency(value) {
    return "$" + value.toFixed(2);
}

function sendAjaxRequest2(url, callback, reqData, httpMethod) {
    $.ajax("/cart" + (url ? "/" + url : ""), {
        success: callback,
        data: reqData,
        type: httpMethod
    });
}

function getCart() {
    sendAjaxRequest2("GetCartJson", function (lines) {
        cartModel.cart.removeAll();
        for (var i = 0; i < lines.length; i++) {
            cartModel.cart.push(lines[i]);
        }
    });
}

function addToCard(product) {
    sendAjaxRequest2("AddToCartJson", function (line) {             
        var isNull = true;
        for (var i = 0; i < cartModel.cart().length; i++) {
            if (cartModel.cart()[i].Product.Id == line.Product.Id) {
                cartModel.cart.replace(cartModel.cart()[i], line);
                isNull = false;
            }
        }
        if (isNull)
            cartModel.cart.push(line);
    }, {
            Id: product.Id
        }, "POST"
    );
}

function removeLine(line) {
    sendAjaxRequest2("RemoveFromCartJson", function () {
        for (var i = 0; i < cartModel.cart().length; i++) {
            if (cartModel.cart()[i].Product.Id == line.Product.Id) {
                cartModel.cart.remove(cartModel.cart()[i]);
                break;
            }
        }
    }, {
            Id: line.Product.Id
        }, "DELETE"
    );
}

function TotalSum() {
    var sum = 0;
    for (var i = 0; i < cartModel.cart().length; i++) {
        sum += (cartModel.cart()[i].Quantity * cartModel.cart()[i].Product.Price);
    }
    return sum;
}

function TotalQuan() {
    var quan = 0;
    for (var i = 0; i < cartModel.cart().length; i++) {
        quan += cartModel.cart()[i].Quantity;
    }
    return quan;
}

$(document).ready(function () {
    getCart();
    ko.applyBindings(cartModel);
});