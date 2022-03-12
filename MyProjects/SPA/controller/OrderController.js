/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/


var span=document.getElementById("lblTotal");
span.style.fontSize="30px";
span.style.color="red";

var Text1=document.getElementById("txtTotal");
Text1.style.fontSize="30px";
Text1.style.color="red";

var span2=document.getElementById("lblSubTotal");
span2.style.fontSize="30px";
span2.style.color="Blue";

var Text2=document.getElementById("txtSubTotal");
Text2.style.fontSize="30px";
Text2.style.color="Blue";

var Text4=document.getElementById("lblBalance");
Text4.style.fontSize="20px";
Text4.style.color="Orange";

var Text3=document.getElementById("txtBalance");
Text3.style.fontSize="20px";
Text3.style.color="Orange";

var Text4=document.getElementById("txtDate");
Text4.style.fontSize="20px";

var d=new Date();
var strDate=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
$('#txtDate').text(strDate);

/*Genarate Order ID*/
function genarateOrderID() {
    if(orderTable.length==0){
        $("#txtOrderID").val("OR-001");
    }else{
        let lastOrderID=orderTable[orderTable.length - 1].getOrderID();
        let newOrderID=number.parseInt(lastOrderID.substring(3,6)) + 1;
        if(newOrderID<10){
            newOrderID="OR-00" +newOrderID;
        }else if(newOrderID<100){
            newOrderID="OR-0" +newOrderID;
        }
        $("#txtOrderID").val(newOrderID);
    }
}


// load all customers to dropdown
function loadAllCus(){
    let data;
    $('#selectCusID').empty();

    for (var i = 0; i < customerTable.length; i++) {
        data =`<option value="${customerTable[i].getCustomerID()}">${customerTable[i].getCustomerID()}</option>`;
        $('#selectCusID').append(data);
    }
}

// add data to textfields from selected cus id
$('#selectCusID').on('click',function(data){
    let selectedValue = $('#selectCusID :selected').val();

    for (var i = 0; i < customerTable.length; i++) {
        if (customerTable[i].getCustomerID()==selectedValue) {
            $('#orderCustomerName').val(customerTable[i].getCustomerName());
            $('#orderCustomerAddress').val(customerTable[i].getCustomerAddress());
            $('#orderCustomerAge').val(customerTable[i].getCustomerAge());
            $('#orderCustomerSalary').val(customerTable[i].getCustomerSalary());
        }
    }
});

// load all Items to dropdown
function loadAllIt(){
    let data;
    $('#selectItemCode').empty();

    for (var i = 0; i < itemTable.length; i++) {
        data =`<option value="${itemTable[i].getItemCode()}">${itemTable[i].getItemCode()}</option>`;
        console.log(data);

        $('#selectItemCode').append(data);
    }
}

// add data to textfields from selected cus id
$('#selectItemCode').on('click',function(data){
    let slectedValue = $('#selectItemCode :selected').val();

    for (var i = 0; i < itemTable.length; i++) {
        if (itemTable[i].getItemCode()==slectedValue) {
            $('#txtItemDescription').val(itemTable[i].getDescription());
            $('#txtQTYOnHand').val(itemTable[i].getQty());
            $('#txtItemPrice').val(itemTable[i].getPrice());

        }
    }
});

// check all textfields
function checkOrderFields() {
    if (checkByOne($('#txtOrderID').val(), $('#txtOrderID'))) {

        if (checkByOne($('#selectCusID').val(), $('#selectCusID'))) {
            if (checkByOne($('#orderCustomerName').val(), $('#orderCustomerName'))) {
                if (checkByOne($('#orderCustomerAddress').val(), $('#orderCustomerAddress'))) {
                    if (checkByOne($('#orderCustomerAge').val(), $('#orderCustomerAge'))) {
                        if (checkByOne($('#orderCustomerSalary').val(), $('#orderCustomerSalary'))) {

                            if (checkByOne($('#orderCustomerAddress').val(), $('#orderCustomerAddress'))) {
                                if (checkByOne($('#selectItemCode').val(), $('#selectItemCode'))) {
                                    if (checkByOne($('#txtItemDescription').val(), $('#txtItemDescription'))) {

                                        if (checkByOne($('#txtQTYOnHand').val(), $('#txtQTYOnHand'))) {
                                            if (checkByOne($('#txtItemPrice').val(), $('#txtItemPrice'))) {

                                                return true;
                                            }}}}}}}}}}}}

function checkByOne(val, field){
    if (val=='') {
        field.css({
            'border':'2px red solid'
        });
        field.focus();
        return false;
    }else{
        field.css({
            'border':'2px #CED4DA solid'
        });
        return true;
    }
}

// check qty is available or not
$('#OrderQty').on('keyup',function(){
    let qtyOnHand = parseFloat($('#txtQTYOnHand').val());
    let qty = parseFloat($('#OrderQty').val());

    if (qtyOnHand<qty) {
        $('#error').show();
    }else{
        $('#error').hide();
    }
});

$('#btnAddToTable').on('click',function(){
    if (checkOrderFields()) {
        let oId = $('#txtOrderID').val();
        let itCode = $('#selectItemCode').val();
        let cId = $('#selectCusID').val();
        let oQty = parseFloat($('#OrderQty').val());
        let oItmPrice = parseFloat($('#txtItemPrice').val());

        showOrderTableData(oId,itCode,cId,oQty,oItmPrice);
    }
});

function showOrderTableData(oId, cId,itCode,oQty,oItmPrice){
    let checkRows=true;

    if (checkOrderFields()) {
        let itmcode = $('#orderitmcode').val();

        for (var i = 0; i < $('#tblOrder>tr').length; i++) {
            let tblitmcode = $($($('#tblOrder>tr').get(i)).children().get(1)).text();
            let tblitmqty = parseFloat($($($('#tblOrder>tr').get(i)).children().get(3)).text());

            if (itmcode == tblitmcode) {

                $($($('#tblOrder>tr').get(i)).children().get(3)).text(oQty+tblitmqty);
                $($($('#tblOrder>tr').get(i)).children().get(4)).text((tblitmqty+oQty)*oItmPrice);
                checkRows=false;
            }
        }
    }

    if (checkRows) {
        let data =`<tr><th scope="row">${oId}</th><td>${cId}</td><td>${itCode}</td><td>${oQty}</td><td>${oItmPrice*oQty}</td></tr>`;
        $('#tblOrder').append(data);
        $('#OrderViewTbl').append(data);
    }

    setTotal();
}

function setTotal(){
    let tot=0;
    $('#ViewOrder>tr').each(function(){
        tot=tot+parseFloat($($(this).children().get(4)).text());
        $('#txtTotal').text(tot).append('.00');
        $('#txtSubTotal').text(tot).append('.00');
    });
    t=tot;
}

$('#txtCash').on('keyup',function(){
    if ($('#txtCash').val()=='') {
        $('#txtBalance').text('0.00');
    }else{
        let subtot = parseFloat($('#txtSubTotal').text());
        let cash = parseFloat($('#txtCash').val());

        let last = cash-subtot;
        $('#txtBalance').text(last).append('.00 Rs/=');
    }
});

$('#txtDiscount').on('keyup',function(){
    if ($('#txtDiscount').val()=='') {
        $('#txtSubTotal').text('0.00');
    }else{
        let tot = parseFloat(t);
        let dis = parseFloat($('#txtDiscount').val());

        $('#txtSubTotal').text(tot-dis).append('.00');
    }
});

$('#txtDiscount').on('blur',function(){
    if ($('#txtDiscount').val()=='') {
        $('#lblDis').css({
            'display':'block'
        });
    }else{
        $('#lblDis').css({
            'display':'none'
        });
    }
});

// send data to order array
$('#btnPurchase').on('click',function(){
    console.log('clicked');

    let oId = $("#txtOrderID").val();
    let oItmCode = $("#selectItemCode").val();
    let oCusId = $("#selectCusID").val();
    let oQty = $("#OrderQty").val();
    let oItmPrice = $("#txtTotal").val();

    let res=(saveOrder(oId, oCusId, oItmCode, oQty, oItmPrice));
    if(res)clearOrder();


});

function saveOrder(orderID, customerID, itemCode, qty,total) {
    let order = new OrderDTO(orderID, customerID, itemCode, qty,total);
    orderTable.push(order);
    return true;
}

$("#txtOrderID").on('keyup', function (eObj) {
    if (eObj.key == "Enter"){
        let order = searchOrder($(this).val());
        if (order != null) {
            $("#selectCusID").val(order.getCusID());
            $("#selectItemCode").val(order.getItemCode());
            $("#OrderQty").val(order.getQty());
            $("#txtTotal").val(order.getTotal());

        } else {
            alert("not matching data exist! try again");

        }
    }
});

function searchOrder(id) {
    for (var i in orderTable) {

        if (orderTable[i].getOrderID() == id) return orderTable[i];
    }
    return null;
}

function clearOrder() {
    $('#txtTotal').clear;
    $("#txtBalance").val("");
    $("#txtSubTotal").val("");
    $("#txtDiscount").val("");
    $("#ViewOrder tr").remove();

    $("#txtCash").val("");
    $("#txtDate").val("");
    $("#txtOrderID").val("");
    $("#selectCusID").val("");
    $("#selectItemCode").val("");
    $("#orderCustomerName").val("");
    $("#orderCustomerAge").val("");
    $("#orderCustomerSalary").val("");
    $("#orderCustomerAddress").val("");
    $("#orderCustomerContact").val("");
    $("#txtItemDescription").val("");
    $("#txtItemPrice").val("");
    $("#txtQTYOnHand").val("");
    $("#OrderQty").val("");


}
