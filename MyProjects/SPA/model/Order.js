/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/

function OrderDTO(orderID,CusID,itemCode,qty,total) {
    var __orderID=orderID;
    var __CusID=CusID;
    var __itemCode=itemCode;
    var __qty=qty;
    var __total=total;

    this.getOrderID=function () {
        return __orderID;
    }
    this.getCusID=function () {
        return __CusID;
    }
    this.getItemCode=function () {
        return __itemCode;
    }
    this.getQty=function () {
        return __qty;
    }
    this.getTotal=function () {
        return __total;
    }

    this.setOrderID=function (newOrderID) {
        __orderID=newOrderID;
    }
    this.setCustomerID=function (newCID) {
        __CusID=newCID;
    }
    this.setItemCode=function (newItemCode) {
        __itemCode=newItemCode;
    }
    this.setQty=function (newQty) {
        __qty=newQty;
    }
    this.setTotal=function (newTotal) {
        __total=newTotal;
    }
}