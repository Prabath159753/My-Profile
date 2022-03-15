/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/

function OrderDetails(oID, code, iName, sellQty, price, total) {
    var __orderId = oID;
    var __code = code;
    var __ItemName = iName;
    var __sellQty = sellQty;
    var __unitPrice = price;
    var __total = total;

    this.setOrderDetailId = function (e) {
        __orderId = e;
    }
    this.getOrderDetailId  = function () {
        return __orderId;
    }

    this.setOrderItemCode = function (e) {
        __code = e;
    }
    this.getOrderItemCode = function () {
        return __code;
    }

    this.setOrderItemName = function (e) {
        __ItemName = e;
    }
    this.getOrderItemName = function () {
        return __ItemName;
    }

    this.setSellQty = function (e) {
        __sellQty = e;
    }
    this.getSellQty = function () {
        return __sellQty;
    }

    this.setOrderUnitPrice = function (e) {
        __unitPrice = e;
    }
    this.getOrderUnitPrice = function () {
        return __unitPrice;
    }

    this.setTotal = function (e) {
        __total = e;
    }
    this.getTotal = function () {
        return __total;
    }

}