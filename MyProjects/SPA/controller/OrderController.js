/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/


/* ------ generate order id ------ */
function generateOrderId() {
    $("#txtOrderID").val("O-0001");

    if(orderDB.length!=0){
        var orderId=orderDB[orderDB.length-1].getOrderId();
        console.log(orderId);
        var tempId = parseInt(orderId.split("")[2]);
        // var tempId = parseInt(orderId.substring(1,4))

        // let lastCustomerId = orderDB[orderDB.length-1].getOrderId();

        // let newCustomerId = parseInt(lastCustomerId.substring(2,6))+1;
        // tempId = newCustomerId;
        tempId = tempId+1;

        if (tempId <= 9){
            $("#txtOrderID").val("O-000"+tempId);
        }else if (tempId <= 99) {
            $("#txtOrderID").val("O-00" + tempId);
        }else if (tempId <= 999){
            $("#txtOrderID").val("O-0" + tempId);
        }else {
            $("#txtOrderID").val("O-"+tempId);
        }
    }else{
        $("#txtOrderID").val("O-0001");
    }
}

/*-------------------Customer Sec-----------------------*/

function loadCustomerIds() {
    $("#selectCusID").empty();
    for (var i = 0; i <customerDB.length ; i++) {
        $("#selectCusID").append($("<option></option>").attr("value", i).text(customerDB[i].getCId()));
    }
}

$("#selectCusID").click(function () {
    for (var i = 0; i < customerDB.length; i++) {
        if ($("#selectCusID option:selected").text()==customerDB[i].getCId()){
            $("#orderCusName").val(customerDB[i].getName());

            $("#orderCusContact").val(customerDB[i].getContact());

            $("#orderCusAddress").val(customerDB[i].getAddress());
        }
    }
});

/*-------------------Item Sec-----------------------*/

function loadItemCodes() {
    $("#selectItemCode").empty();
    for (var i = 0; i <itemDB.length ; i++) {
        $("#selectItemCode").append($("<option></option>").attr("value", i).text(itemDB[i].getCode()));
    }
}

$("#selectItemCode").click(function () {

    for (var i = 0; i < itemDB.length; i++) {
        if ($("#selectItemCode option:selected").text()==itemDB[i].getCode()){

            $("#txtOrderItemDescription").val(itemDB[i].getDescription());
            $("#txtOrderQtyOnHand").val(itemDB[i].getQty());
            $("#txtOrderItemPrice").val(itemDB[i].getUnitPrice());

        }
    }
});

/* ------ oder qty validation ------ */

var regExSellQuantity=/^[0-9]{1,20}$/;

$("#txtOrderQty").keyup(function (event) {

    let sellQty = $("#txtOrderQty").val();
    if (regExSellQuantity.test(sellQty)){
        $("#txtOrderQty").css('border','1px solid blue');
        $("#errorOrderlQty").text("");
        if (event.key=="Enter"){
            $("#btnAddToTable").focus();
        }
    }else {
        $("#txtOrderQty").css('border','2px solid red');
        $("#errorOrderQty").text("Quantity is a required field: Pattern 00");
    }
});

/* ----------------------- Order Table ----------------------- */

/* if add new row , qtyOnHand changes */
function manageAddQty(qty){
    var votevalue = parseInt(qty);
    for (var j = 0; j < itemDB.length; j++) {
        if ($("#selectItemCode option:selected").text() == itemDB[j].getCode()){
            var manageQty=parseInt(itemDB[j].getQty());
            manageQty-=votevalue;
            itemDB[j].setQty(manageQty);
        }
    }
}

/* if add new gross*/
var grossAmount=0;
function calculateGrossAmount(gross){
    grossAmount+=gross;
    $("#gross").text(grossAmount);
    console.log(grossAmount);
}

var tblOrderRow;
var click="not clicked";

$("#btnAddCart").click(function () {
    console.log("a");

    $("#tblOrder tbody > tr").off("click");
    $("#tblOrder tbody").off("click",'#btnDelete');

    if($("#errorOrderQty").text()!=""||$("#selectItemCode option:selected").val()==""||
        $("#selectItemCode option:selected").text()==""||$("#txtOrderQty").val()==""||$("#orderDate").val()==""){
        console.log("b");
        $("#btnPurchase").attr('disabled', true);
        alert("please enter customer details or item details ....");
    }else {

        let text = "Do you really want to add to cart this Item?";
        $("#btnPurchase").attr('disabled', false);

        if (confirm(text) == true) {

            let orderId = $("#selectCusID option:selected").text();
            let itemCode = $("#selectItemCode option:selected").text();

            let itemName = $("#txtOrderItemDescription").val();
            let unitPrice = $("#txtOrderItemPrice").val();
            var sellQty = $("#txtOrderQty").val();
            var gross = sellQty*unitPrice;
            var net = gross;

            var ifDuplicate=false;
            console.log($("#selectCusID option:selected").text());

            // if($("#tblOrder tbody tr").length != 0){
            //     var firstItem = new Array();
            //     firstItem = Array.from(document.querySelectorAll("#perf td:first-child")).map(x => x.innerHTML);

            // }

            for (var i = 0; i < $("#tblOrder tbody tr").length; i++) {


                // console.log("dddddddddddddddd");

                // var firstItem = new Array();
                // firstItem = Array.from(document.querySelectorAll("#perf td:first-child")).map(x => x.innerHTML);
                // console.log(firstItem);
                // var first = firstItem[0];
                // console.log(first);
                // console.log(Array.from(document.
                // querySelectorAll("#perf td:first-child")).map(x => x.innerHTML));

                // console.log($("#selectCusID option:selected").text());




                // var terf = document.getElementById('#tblOrder');
                // var firstChilds = terf.querySelectorAll("td:first-child");
                // var allName = [];
                // for(i=0; i<$("#tblOrder tbody tr").length; ++i){
                //     allName.push(firstChilds[i].innerHTML);
                // }

                // console.log(allName);


                // var code=$("#tblOrder tbody tr").children(':nth-"child(1)')[1].innerText;
                // console.log(("#tblOrder tbody tr").children(':nth-child(1)')[1].text);

                // if($("#selectItemCode option:selected").text()==firstItem[i]){
                //     ifDuplicate=true;
                //     console.log(("#selectCusID option:selected").text());

                // }

                if($("#selectItemCode option:selected").text()==$("#tblOrder tbody tr").children(':nth-child(1)')[i].innerText){
                    ifDuplicate=true;
                }
            }

            if (ifDuplicate!=true){

                if(parseInt($("#txtOrderQtyOnHand").val()) >= sellQty){

                    manageAddQty(sellQty);
                    calculateGrossAmount(gross);
                    calculateNetAmount(net);

                    let raw = `<tr><td> ${itemCode} </td><td> ${itemName} </td><td> ${sellQty} </td><td> ${unitPrice} </td><td> ${net} </td><td> <input id='btnEdit' class='btn btn-success btn-sm' value='Update' style="width: 75px"/> </td><td> <input id='btnDelete' class='btn btn-danger btn-sm' value='Delete' style="width: 75px"/> </td></tr>`;
                    $("#tblOrder tbody").append(raw);

                }else if(parseInt($("#txtOrderQtyOnHand").val()) < sellQty){
                    alert("Not Enough Quantity");
                }

                $("#txtOrderItemDescription").val("");
                $("#selectItemCode").text()

                $("#txtOrderQty").val("");
                $("#txtOrderItemPrice").val("");
                $("#txtOrderQtyOnHand").val("");

                console.log("x");

                $("#txtOrderQty").css('border', '2px solid transparent');

                $("#tblOrder tbody").on('click','#btnDelete',function () {
                    console.log("yyyyy");
                    let text = "Are you sure you want to remove this Item from cart?";

                    if (confirm(text) == true) {
                        tblOrderRow.remove();

                        manageReduceQty(tblOrderRow.children(':nth-child(4)').text());
                        var preGross=parseInt($(tblOrderRow).children(':nth-child(4)').text())*$("#orderPrice").val();
                        deleteGrossAmount(preGross);
                        var delNet=parseInt($(tblOrderRow).children(':nth-child(7)').text());
                        deleteNetAmount(delNet);

                        $("#txtOrderItemDescription").val("");
                        $("#selectItemCode").val("");

                        $("#txtOrderQty").val("");
                        $("#txtOrderItemPrice").val("");
                        $("#txtOrderQtyOnHand").val("");

                    } else {

                    }
                });

            }else if (ifDuplicate==true){

                if (click=="clicked"){

                    if(parseInt($("#txtOrderQty").val()) >= sellQty){

                        manageQty(sellQty,$(tblOrderRow).children(':nth-child(4)').text());
                        var previousGross=parseInt($(tblOrderRow).children(':nth-child(4)').text())*unitPrice;
                        updateGrossAmount(gross,previousGross);
                        updateNetAmount(net,$(tblOrderRow).children(':nth-child(7)').text());

                        $(tblOrderRow).children(':nth-child(4)').text(sellQty);
                        $(tblOrderRow).children(':nth-child(7)').text(net);

                    }else if(parseInt($("#txtOrderQty").val()) < sellQty){
                        alert("Not Enough Quantity");
                    }

                    $("#txtOrderItemDescription").val("");
                    $("#selectItemCode").val("");

                    $("#txtOrderQty").val("");

                    $("#txtOrderItemPrice").val("");
                    $("#txtOrderQtyOnHand").val("");



                    $("#txtOrderQtyOnHand").css('border', '2px solid transparent');

                }else if (click=="not clicked"){
                    alert("Please Select A Row.");
                }
            }

        } else {

        }

    }

    $("#tblOrder tbody > tr").click(function () {
        tblOrderRow=$(this);
        click="clicked";

        var code=tblOrderRow.children(':nth-child(1)').text();
        var trim1 = $.trim(code);
        var iName=tblOrderRow.children(':nth-child(2)').text();
        var trim2 = $.trim(iName);

        var sellqty=tblOrderRow.children(':nth-child(3)').text();
        var trim3 = $.trim(sellqty);

        var sellqty=tblOrderRow.children(':nth-child(4)').text();
        var trim4 = $.trim(sellqty);
        var price=tblOrderRow.children(':nth-child(5)').text();
        var trim5 = $.trim(price);
        var discount=tblOrderRow.children(':nth-child(6)').text();
        var trim6 = $.trim(discount);

        $("#orderItemCode").val(trim1);
        $("#orderKind").val(trim2);
        $("#orderItemName").val(trim3);
        $("#sellQty").val(trim4);
        $("#orderPrice").val(trim5);
        $("#itemDiscount").val(trim6);

        for (var i = 0; i < itemDB.length; i++) {
            if ($("#orderItemCode").val() == itemDB[i].getCode()) {
                $("#orderQty").val(itemDB[i].getQty());
            }
        }
    });

});



/* if add new net*/
var netAmount=0;
function calculateNetAmount(net){
    netAmount+=net;
    $("#net").val(netAmount);
}

/* if delete a row , qtyOnHand changes */
function manageReduceQty(qty){
    var votevalue = parseInt(qty);
    for (var j = 0; j < itemDB.length; j++) {
        if ($("#orderItemCode").val() == itemDB[j].getCode()){
            var manageQty=parseInt(itemDB[j].getQty());
            manageQty+=votevalue;
            itemDB[j].setQty(manageQty);
        }
    }
}

/* if delete gross*/
function deleteGrossAmount(gross){
    grossAmount-=gross;
    $("#gross").val(grossAmount);
}

/* if delete net*/
function deleteNetAmount(net){
    netAmount-=net;
    $("#net").val(netAmount);
}

/* if update previous row , qtyOnHand changes */
function manageQty(qty,previousQty){
    var qty = parseInt(qty);
    var previousQty = parseInt(previousQty);
    for (var j = 0; j < itemDB.length; j++) {
        if ($("#orderItemCode").val() == itemDB[j].getCode()){
            var manageQty=parseInt(itemDB[j].getQty());
            manageQty+=previousQty;
            manageQty-=qty;
            itemDB[j].setQty(manageQty);
        }
    }
}

/* if update new gross*/
function updateGrossAmount(gross,previousGross){
    grossAmount-=previousGross;
    grossAmount+=gross;
    $("#gross").val(grossAmount);
}

/* if update new net*/
function updateNetAmount(net,previousNet){
    netAmount-=previousNet;
    netAmount+=net;
    $("#net").val(netAmount);
}


/* if update new net*/
function getSubAmount(){
    let amountOfNet = $("#net").val();
    let discount = $("#discount").val();
    var rest=amountOfNet-(amountOfNet*discount/100);
    $("#net").val(netAmount);
}


/*-------------------Final Total----------------------*/

var regExCash=/^[0-9]{1,10}$/;
var regExFinalDiscount=/^[0-9]{1,2}$/;

$("#cash").keyup(function (event) {

    let cash = $("#cash").val();
    if (regExCash.test(cash)){
        $("#cash").css('border','1px solid blue');
        $("#errorCash").text("");
        if (event.key=="Enter") {
            $("#discount").focus();
        }
    }else {
        $("#cash").css('border','1px solid red');
        $("#errorCash").text("Cash is a required field: Pattern 00.00");
    }
});

$("#discount").keyup(function () {

    let discount = $("#discount").val();
    if (regExFinalDiscount.test(discount)){
        $("#discount").css('border','1px solid blue');
        $("#errorFinalDiscount").text("");
    }else {
        $("#discount").css('border','1px solid red');
        $("#errorFinalDiscount").text("Discount is a required field: Pattern 0");
    }

});

$("#btnPurchase").click(function () {



    let text = "Do you really want to place order?";

    if (confirm(text) == true) {

        getSubAmount();

        let amountOfGross = $("#gross").val();
        let amountOfNet = $("#net").val();
        let orderDate = $("#orderDate").val();
        let cusIds = $("#selectCusID option:selected").text();
        let orderId = $("#txtOrderID").val();
        let cash = $("#cash").val();
        let discount = $("#discount").val();

        var order = new Order(
            orderId,
            orderDate,
            cusIds,
            amountOfGross,
            amountOfNet
        );

        var ifDuplicate = false;

        for (var j = 0; j < orderDB.length; j++) {
            if (orderId == orderDB[j].getOrderId()) {
                ifDuplicate = true;
            }
        }

        if (ifDuplicate == false) {

            orderDB.push(order);

            for (var i = 0; i < $("#tblOrder tbody tr").length; i++) {
                var orderDetails = new OrderDetails(
                    orderId,
                    $("#tblOrder tbody tr").children(':nth-child(1)')[i].innerText,
                    $("#tblOrder tbody tr").children(':nth-child(2)')[i].innerText,
                    $("#tblOrder tbody tr").children(':nth-child(3)')[i].innerText,
                    $("#tblOrder tbody tr").children(':nth-child(4)')[i].innerText,
                    $("#tblOrder tbody tr").children(':nth-child(5)')[i].innerText


                )
                orderDetailsDB.push(orderDetails);
            }

            var rest=amountOfNet-(amountOfNet*discount/100);
            var balance=cash-rest;
            $("#balance").val(balance);

            $("#btnAddCart").attr('disabled',false);

            $("#orderItemName").val("");
            $("#orderItemCode").val("");
            $("#orderKind").val("");
            $("#orderQty").val("");
            $("#orderPrice").val("");
            $("#sellQty").val("");
            $("#itemDiscount").val("");
            $("#orderCusName").val("");
            $("#orderCusId").val("");
            $("#orderCusAddress").val("");
            $("#orderCusNIC").val("");
            $("#orderCusContact").val("");
            $("#searchOrder").val("");
            $("#gross").val("");
            $("#net").val("");
            $("#cash").val("");
            $("#discount").val("");

            $("#tblOrder tbody").empty();

            $("#sellQty").css('border', '2px solid transparent');
            $("#itemDiscount").css('border', '2px solid transparent');
            $("#discount").css('border', '2px solid transparent');
            $("#cash").css('border', '2px solid transparent');

        } else if (ifDuplicate == true) {
            alert("Something Wrong.");
        }

    }else if (confirm(text) == false){
        alert("error");

        for (var i = 0; i < $("#tblOrder tbody tr").length; i++) {
            var code=$("#tblOrder tbody tr").children(':nth-child(1)')[i].innerText;
            var qty=$("#tblOrder tbody tr").children(':nth-child(4)')[i].innerText;
            ifRefusePurchase(code,qty);
        }

        generateOrderId();
        netAmount = 0;
        grossAmount = 0;

        $("#orderItemName").val("");
        $("#orderItemCode").val("");
        $("#orderKind").val("");
        $("#orderQty").val("");
        $("#orderPrice").val("");
        $("#sellQty").val("");
        $("#itemDiscount").val("");
        $("#orderCusName").val("");
        $("#orderCusId").val("");
        $("#orderCusAddress").val("");
        $("#orderCusNIC").val("");
        $("#orderCusContact").val("");
        $("#searchOrder").val("");
        $("#gross").val("");
        $("#net").val("");
        $("#cash").val("");
        $("#discount").val("");
        $("#balance").val("");
        $("#tblOrder tbody").empty();

        $("#sellQty").css('border', '2px solid transparent');
        $("#itemDiscount").css('border', '2px solid transparent');
        $("#discount").css('border', '2px solid transparent');
        $("#cash").css('border', '2px solid transparent');

    }


});

$("#btnNew").click(function () {
    netAmount = 0;
    grossAmount = 0;
    generateOrderId();


    $("#selectItemCode").val("");
    $("#txtOrderItemDescription").val("");
    $("#txtOrderItemPrice").val("");
    $("#txtOrderQtyOnHand").val("");

    $("#selectCusID").val("");
    $("#orderCusName").val("");
    $("#orderCusContact").val("");
    $("#orderCusAddress").val("");


    $("#txtOrderQty").val("");
    $("#gross").val("");
    $("#net").val("");
    $("#cash").val("");
    $("#discount").val("");

    $("#txtBalance").val("");


    $("#tblOrder tbody").empty();

    $("#sellQty").css('border', '2px solid transparent');

    $("#discount").css('border', '2px solid transparent');
    $("#cash").css('border', '2px solid transparent');
});


// /* ------ generate order id ------ */
// function generateOrderId() {
//     $("#txtOrderID").val("O-0001");
//
//     if(orderDB.length!=0){
//         var orderId=orderDB[orderDB.length-1].getOrderId();
//         var tempId = parseInt(orderId.split("-")[1]);
//         tempId = tempId+1;
//
//         if (tempId <= 9){
//             $("#txtOrderID").val("O-000"+tempId);
//         }else if (tempId <= 99) {
//             $("#txtOrderID").val("O-00" + tempId);
//         }else if (tempId <= 999){
//             $("#txtOrderID").val("O-0" + tempId);
//         }else {
//             $("#txtOrderID").val("O-"+tempId);
//         }
//     }else{
//         $("#txtOrderID").val("O-0001");
//     }
// }
//
// /*-------------------Customer Sec-----------------------*/
//
// function loadCustomerIds() {
//     $("#selectCusID").empty();
//     for (var i = 0; i <customerDB.length ; i++) {
//         $("#selectCusID").append($("<option></option>").attr("value", i).text(customerDB[i].getCId()));
//     }
// }
//
// $("#selectCusID").click(function () {
//     for (var i = 0; i < customerDB.length; i++) {
//         if ($("#selectCusID option:selected").text()==customerDB[i].getCId()){
//             $("#orderCusName").val(customerDB[i].getName());
//
//             $("#orderCusContact").val(customerDB[i].getContact());
//
//             $("#orderCusAddress").val(customerDB[i].getAddress());
//         }
//     }
// });
//
// /*-------------------Item Sec-----------------------*/
//
// function loadItemCodes() {
//     $("#selectItemCode").empty();
//     for (var i = 0; i <itemDB.length ; i++) {
//         $("#selectItemCode").append($("<option></option>").attr("value", i).text(itemDB[i].getCode()));
//     }
// }
//
// $("#selectItemCode").click(function () {
//
//     for (var i = 0; i < itemDB.length; i++) {
//         if ($("#selectItemCode option:selected").text()==itemDB[i].getCode()){
//
//             $("#txtOrderItemDescription").val(itemDB[i].getDescription());
//             $("#txtOrderQtyOnHand").val(itemDB[i].getQty());
//             $("#txtOrderItemPrice").val(itemDB[i].getUnitPrice());
//
//         }
//     }
// });
//
// /* ------ oder qty validation ------ */
// var regExSellQuantity=/^[0-9]{1,20}$/;
//
// $("#txtOrderQty").keyup(function (event) {
//
//     let sellQty = $("#txtOrderQty").val();
//     if (regExSellQuantity.test(sellQty)){
//         $("#txtOrderQty").css('border','1px solid blue');
//         $("#errorOrderlQty").text("");
//         if (event.key=="Enter"){
//             $("#btnAddToTable").focus();
//         }
//     }else {
//         $("#txtOrderQty").css('border','2px solid red');
//         $("#errorOrderQty").text("Quantity is a required field: Pattern 00");
//     }
// });
//
// /* ----------------------- Order Table Sec ----------------------- */
//
// /* ------ if add new row , qtyOnHand changes ------ */
// function manageAddQty(qty){
//     var votevalue = parseInt(qty);
//     for (var j = 0; j < itemDB.length; j++) {
//         if ($("#selectItemCode option:selected").text() == itemDB[j].getCode()){
//             var manageQty=parseInt(itemDB[j].getQty());
//             manageQty-=votevalue;
//             itemDB[j].setQty(manageQty);
//         }
//     }
// }
//
// /* ------ if add new gross ------ */
// var grossAmount=0;
// function calculateGrossAmount(gross){
//     grossAmount+=gross;
//     $("#gross").text(grossAmount);
//     console.log(grossAmount);
// }
//
// /* ------ add items to table ------ */
// var tblOrderRow;
// var click="not clicked";
//
// $("#btnAddCart").click(function () {
//     console.log("a");
//
//     $("#tblOrder tbody > tr").off("click");
//     $("#tblOrder tbody").off("click",'#btnDelete');
//
//     if($("#errorOrderQty").text()!=""||$("#selectItemCode option:selected").val()==""||
//         $("#selectItemCode option:selected").text()==""||$("#txtOrderQty").val()==""||$("#orderDate").val()==""){
//         console.log("b");
//         $("#btnPurchase").attr('disabled', true);
//         alert("please enter customer details or item details ....");
//     }else {
//
//         let text = "Do you really want to add to cart this Item?";
//         $("#btnPurchase").attr('disabled', false);
//
//         if (confirm(text) == true) {
//
//             let orderId = $("#selectCusID option:selected").text();
//             let itemCode = $("#selectItemCode option:selected").text();
//
//             let itemName = $("#txtOrderItemDescription").val();
//             let unitPrice = $("#txtOrderItemPrice").val();
//             var sellQty = $("#txtOrderQty").val();
//             var gross = sellQty*unitPrice;
//             var net = gross;
//
//             var ifDuplicate=false;
//             console.log($("#selectCusID option:selected").text());
//
//             // if($("#tblOrder tbody tr").length != 0){
//             //     var firstItem = new Array();
//             //     firstItem = Array.from(document.querySelectorAll("#perf td:first-child")).map(x => x.innerHTML);
//             // }
//
//             for (var i = 0; i < $("#tblOrder tbody tr").length; i++) {
//
//                 // console.log("dddddddddddddddd");
//
//                 // var firstItem = new Array();
//                 // firstItem = Array.from(document.querySelectorAll("#perf td:first-child")).map(x => x.innerHTML);
//                 // console.log(firstItem);
//                 // var first = firstItem[0];
//                 // console.log(first);
//                 // console.log(Array.from(document.
//                 // querySelectorAll("#perf td:first-child")).map(x => x.innerHTML));
//
//                 // console.log($("#selectCusID option:selected").text());
//
//                 // var terf = document.getElementById('#tblOrder');
//                 // var firstChilds = terf.querySelectorAll("td:first-child");
//                 // var allName = [];
//                 // for(i=0; i<$("#tblOrder tbody tr").length; ++i){
//                 //     allName.push(firstChilds[i].innerHTML);
//                 // }
//
//                 // console.log(allName);
//
//                 // var code=$("#tblOrder tbody tr").children(':nth-"child(1)')[1].innerText;
//                 // console.log(("#tblOrder tbody tr").children(':nth-child(1)')[1].text);
//
//                 // if($("#selectItemCode option:selected").text()==firstItem[i]){
//                 //     ifDuplicate=true;
//                 //     console.log(("#selectCusID option:selected").text());
//
//                 // }
//
//                 if($("#selectItemCode option:selected").text()==$("#tblOrder tbody tr").children(':nth-child(1)')[i].innerText){
//                     ifDuplicate=true;
//                 }
//             }
//
//             if (ifDuplicate!=true){
//
//                 if(parseInt($("#txtOrderQtyOnHand").val()) >= sellQty){
//
//                     manageAddQty(sellQty);
//                     calculateGrossAmount(gross);
//                     calculateNetAmount(net);
//
//                     let raw = `<tr><td> ${itemCode} </td><td> ${itemName} </td><td> ${sellQty} </td><td> ${unitPrice} </td><td> ${net} </td><td> <input id='btnEdit' class='btn btn-success btn-sm' value='Update' style="width: 75px"/> </td><td> <input id='btnDelete' class='btn btn-danger btn-sm' value='Delete' style="width: 75px"/> </td></tr>`;
//                     $("#tblOrder tbody").append(raw);
//
//                 }else if(parseInt($("#txtOrderQtyOnHand").val()) < sellQty){
//                     alert("Not Enough Quantity");
//                 }
//
//                 $("#txtOrderItemDescription").val("");
//                 $("#selectItemCode").text()
//
//                 $("#txtOrderQty").val("");
//                 $("#txtOrderItemPrice").val("");
//                 $("#txtOrderQtyOnHand").val("");
//
//                 console.log("x");
//
//                 $("#txtOrderQty").css('border', '2px solid transparent');
//
//                 $("#tblOrder tbody").on('click','#btnDelete',function () {
//                     console.log("yyyyy");
//                     let text = "Are you sure you want to remove this Item from cart?";
//
//                     if (confirm(text) == true) {
//                         tblOrderRow.remove();
//
//                         manageReduceQty(tblOrderRow.children(':nth-child(4)').text());
//                         var preGross=parseInt($(tblOrderRow).children(':nth-child(4)').text())*$("#orderPrice").val();
//                         deleteGrossAmount(preGross);
//                         var delNet=parseInt($(tblOrderRow).children(':nth-child(7)').text());
//                         deleteNetAmount(delNet);
//
//                         $("#txtOrderItemDescription").val("");
//                         $("#selectItemCode").val("");
//
//                         $("#txtOrderQty").val("");
//                         $("#txtOrderItemPrice").val("");
//                         $("#txtOrderQtyOnHand").val("");
//
//                     } else {
//
//                     }
//                 });
//
//             }else if (ifDuplicate==true){
//
//                 if (click=="clicked"){
//
//                     if(parseInt($("#txtOrderQty").val()) >= sellQty){
//
//                         manageQty(sellQty,$(tblOrderRow).children(':nth-child(4)').text());
//                         var previousGross=parseInt($(tblOrderRow).children(':nth-child(4)').text())*unitPrice;
//                         updateGrossAmount(gross,previousGross);
//                         updateNetAmount(net,$(tblOrderRow).children(':nth-child(7)').text());
//
//                         $(tblOrderRow).children(':nth-child(4)').text(sellQty);
//                         $(tblOrderRow).children(':nth-child(7)').text(net);
//
//                     }else if(parseInt($("#txtOrderQty").val()) < sellQty){
//                         alert("Not Enough Quantity");
//                     }
//
//                     $("#txtOrderItemDescription").val("");
//                     $("#selectItemCode").val("");
//
//                     $("#txtOrderQty").val("");
//
//                     $("#txtOrderItemPrice").val("");
//                     $("#txtOrderQtyOnHand").val("");
//
//
//
//                     $("#txtOrderQtyOnHand").css('border', '2px solid transparent');
//
//                 }else if (click=="not clicked"){
//                     alert("Please Select A Row.");
//                 }
//             }
//
//         } else {
//
//         }
//
//     }
//
//     $("#tblOrder tbody > tr").click(function () {
//         tblOrderRow=$(this);
//         click="clicked";
//
//         var code=tblOrderRow.children(':nth-child(1)').text();
//         var trim1 = $.trim(code);
//         var iName=tblOrderRow.children(':nth-child(2)').text();
//         var trim2 = $.trim(iName);
//
//         var sellqty=tblOrderRow.children(':nth-child(3)').text();
//         var trim3 = $.trim(sellqty);
//
//         var sellqty=tblOrderRow.children(':nth-child(4)').text();
//         var trim4 = $.trim(sellqty);
//         var price=tblOrderRow.children(':nth-child(5)').text();
//         var trim5 = $.trim(price);
//         var discount=tblOrderRow.children(':nth-child(6)').text();
//         var trim6 = $.trim(discount);
//
//         $("#orderItemCode").val(trim1);
//         $("#orderKind").val(trim2);
//         $("#orderItemName").val(trim3);
//         $("#sellQty").val(trim4);
//         $("#orderPrice").val(trim5);
//         $("#itemDiscount").val(trim6);
//
//         for (var i = 0; i < itemDB.length; i++) {
//             if ($("#orderItemCode").val() == itemDB[i].getCode()) {
//                 $("#orderQty").val(itemDB[i].getQty());
//             }
//         }
//     });
//
// });



// var span=document.getElementById("lblTotal");
// span.style.fontSize="30px";
// span.style.color="red";
//
// var Text1=document.getElementById("txtTotal");
// Text1.style.fontSize="30px";
// Text1.style.color="red";
//
// var span2=document.getElementById("lblSubTotal");
// span2.style.fontSize="30px";
// span2.style.color="Blue";
//
// var Text2=document.getElementById("txtSubTotal");
// Text2.style.fontSize="30px";
// Text2.style.color="Blue";
//
// var Text4=document.getElementById("lblBalance");
// Text4.style.fontSize="20px";
// Text4.style.color="Orange";
//
// var Text3=document.getElementById("txtBalance");
// Text3.style.fontSize="20px";
// Text3.style.color="Orange";
//
// var Text4=document.getElementById("txtDate");
// Text4.style.fontSize="20px";
//
// var d=new Date();
// var strDate=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
// $('#txtDate').text(strDate);
//
// /*Genarate Order ID*/
// function genarateOrderID() {
//     if(orderTable.length==0){
//         $("#txtOrderID").val("OR-001");
//     }else{
//         let lastOrderID=orderTable[orderTable.length - 1].getOrderID();
//         let newOrderID=number.parseInt(lastOrderID.substring(3,6)) + 1;
//         if(newOrderID<10){
//             newOrderID="OR-00" +newOrderID;
//         }else if(newOrderID<100){
//             newOrderID="OR-0" +newOrderID;
//         }
//         $("#txtOrderID").val(newOrderID);
//     }
// }
//
//
// // load all customers to dropdown
// function loadAllCus(){
//     let data;
//     $('#selectCusID').empty();
//
//     for (var i = 0; i < customerTable.length; i++) {
//         data =`<option value="${customerTable[i].getCustomerID()}">${customerTable[i].getCustomerID()}</option>`;
//         $('#selectCusID').append(data);
//     }
// }
//
// // add data to textfields from selected cus id
// $('#selectCusID').on('click',function(data){
//     let selectedValue = $('#selectCusID :selected').val();
//
//     for (var i = 0; i < customerTable.length; i++) {
//         if (customerTable[i].getCustomerID()==selectedValue) {
//             $('#orderCustomerName').val(customerTable[i].getCustomerName());
//             $('#orderCustomerAddress').val(customerTable[i].getCustomerAddress());
//             $('#orderCustomerAge').val(customerTable[i].getCustomerAge());
//             $('#orderCustomerSalary').val(customerTable[i].getCustomerSalary());
//         }
//     }
// });
//
// // load all Items to dropdown
// function loadAllIt(){
//     let data;
//     $('#selectItemCode').empty();
//
//     for (var i = 0; i < itemTable.length; i++) {
//         data =`<option value="${itemTable[i].getItemCode()}">${itemTable[i].getItemCode()}</option>`;
//         console.log(data);
//
//         $('#selectItemCode').append(data);
//     }
// }
//
// // add data to textfields from selected cus id
// $('#selectItemCode').on('click',function(data){
//     let slectedValue = $('#selectItemCode :selected').val();
//
//     for (var i = 0; i < itemTable.length; i++) {
//         if (itemTable[i].getItemCode()==slectedValue) {
//             $('#txtItemDescription').val(itemTable[i].getDescription());
//             $('#txtQTYOnHand').val(itemTable[i].getQty());
//             $('#txtItemPrice').val(itemTable[i].getPrice());
//
//         }
//     }
// });
//
// // check all textfields
// function checkOrderFields() {
//     if (checkByOne($('#txtOrderID').val(), $('#txtOrderID'))) {
//
//         if (checkByOne($('#selectCusID').val(), $('#selectCusID'))) {
//             if (checkByOne($('#orderCustomerName').val(), $('#orderCustomerName'))) {
//                 if (checkByOne($('#orderCustomerAddress').val(), $('#orderCustomerAddress'))) {
//                     if (checkByOne($('#orderCustomerAge').val(), $('#orderCustomerAge'))) {
//                         if (checkByOne($('#orderCustomerSalary').val(), $('#orderCustomerSalary'))) {
//
//                             if (checkByOne($('#orderCustomerAddress').val(), $('#orderCustomerAddress'))) {
//                                 if (checkByOne($('#selectItemCode').val(), $('#selectItemCode'))) {
//                                     if (checkByOne($('#txtItemDescription').val(), $('#txtItemDescription'))) {
//
//                                         if (checkByOne($('#txtQTYOnHand').val(), $('#txtQTYOnHand'))) {
//                                             if (checkByOne($('#txtItemPrice').val(), $('#txtItemPrice'))) {
//
//                                                 return true;
//                                             }}}}}}}}}}}}
//
// function checkByOne(val, field){
//     if (val=='') {
//         field.css({
//             'border':'2px red solid'
//         });
//         field.focus();
//         return false;
//     }else{
//         field.css({
//             'border':'2px #CED4DA solid'
//         });
//         return true;
//     }
// }
//
// // check qty is available or not
// $('#OrderQty').on('keyup',function(){
//     let qtyOnHand = parseFloat($('#txtQTYOnHand').val());
//     let qty = parseFloat($('#OrderQty').val());
//
//     if (qtyOnHand<qty) {
//         $('#error').show();
//     }else{
//         $('#error').hide();
//     }
// });
//
// $('#btnAddToTable').on('click',function(){
//     if (checkOrderFields()) {
//         let oId = $('#txtOrderID').val();
//         let itCode = $('#selectItemCode').val();
//         let cId = $('#selectCusID').val();
//         let oQty = parseFloat($('#OrderQty').val());
//         let oItmPrice = parseFloat($('#txtItemPrice').val());
//
//         showOrderTableData(oId,itCode,cId,oQty,oItmPrice);
//     }
// });
//
// function showOrderTableData(oId, cId,itCode,oQty,oItmPrice){
//     let checkRows=true;
//
//     if (checkOrderFields()) {
//         let itmcode = $('#orderitmcode').val();
//
//         for (var i = 0; i < $('#tblOrder>tr').length; i++) {
//             let tblitmcode = $($($('#tblOrder>tr').get(i)).children().get(1)).text();
//             let tblitmqty = parseFloat($($($('#tblOrder>tr').get(i)).children().get(3)).text());
//
//             if (itmcode == tblitmcode) {
//
//                 $($($('#tblOrder>tr').get(i)).children().get(3)).text(oQty+tblitmqty);
//                 $($($('#tblOrder>tr').get(i)).children().get(4)).text((tblitmqty+oQty)*oItmPrice);
//                 checkRows=false;
//             }
//         }
//     }
//
//     if (checkRows) {
//         let data =`<tr><th scope="row">${oId}</th><td>${cId}</td><td>${itCode}</td><td>${oQty}</td><td>${oItmPrice*oQty}</td></tr>`;
//         $('#tblOrder').append(data);
//         $('#OrderViewTbl').append(data);
//     }
//
//     setTotal();
// }
//
// function setTotal(){
//     let tot=0;
//     $('#ViewOrder>tr').each(function(){
//         tot=tot+parseFloat($($(this).children().get(4)).text());
//         $('#txtTotal').text(tot).append('.00');
//         $('#txtSubTotal').text(tot).append('.00');
//     });
//     t=tot;
// }
//
// $('#txtCash').on('keyup',function(){
//     if ($('#txtCash').val()=='') {
//         $('#txtBalance').text('0.00');
//     }else{
//         let subtot = parseFloat($('#txtSubTotal').text());
//         let cash = parseFloat($('#txtCash').val());
//
//         let last = cash-subtot;
//         $('#txtBalance').text(last).append('.00 Rs/=');
//     }
// });
//
// $('#txtDiscount').on('keyup',function(){
//     if ($('#txtDiscount').val()=='') {
//         $('#txtSubTotal').text('0.00');
//     }else{
//         let tot = parseFloat(t);
//         let dis = parseFloat($('#txtDiscount').val());
//
//         $('#txtSubTotal').text(tot-dis).append('.00');
//     }
// });
//
// $('#txtDiscount').on('blur',function(){
//     if ($('#txtDiscount').val()=='') {
//         $('#lblDis').css({
//             'display':'block'
//         });
//     }else{
//         $('#lblDis').css({
//             'display':'none'
//         });
//     }
// });
//
// // send data to order array
// $('#btnPurchase').on('click',function(){
//     console.log('clicked');
//
//     let oId = $("#txtOrderID").val();
//     let oItmCode = $("#selectItemCode").val();
//     let oCusId = $("#selectCusID").val();
//     let oQty = $("#OrderQty").val();
//     let oItmPrice = $("#txtTotal").val();
//
//     let res=(saveOrder(oId, oCusId, oItmCode, oQty, oItmPrice));
//     if(res)clearOrder();
//
//
// });
//
// function saveOrder(orderID, customerID, itemCode, qty,total) {
//     let order = new OrderDTO(orderID, customerID, itemCode, qty,total);
//     orderTable.push(order);
//     return true;
// }
//
// $("#txtOrderID").on('keyup', function (eObj) {
//     if (eObj.key == "Enter"){
//         let order = searchOrder($(this).val());
//         if (order != null) {
//             $("#selectCusID").val(order.getCusID());
//             $("#selectItemCode").val(order.getItemCode());
//             $("#OrderQty").val(order.getQty());
//             $("#txtTotal").val(order.getTotal());
//
//         } else {
//             alert("not matching data exist! try again");
//
//         }
//     }
// });
//
// function searchOrder(id) {
//     for (var i in orderTable) {
//
//         if (orderTable[i].getOrderID() == id) return orderTable[i];
//     }
//     return null;
// }
//
// function clearOrder() {
//     $('#txtTotal').clear;
//     $("#txtBalance").val("");
//     $("#txtSubTotal").val("");
//     $("#txtDiscount").val("");
//     $("#ViewOrder tr").remove();
//
//     $("#txtCash").val("");
//     $("#txtDate").val("");
//     $("#txtOrderID").val("");
//     $("#selectCusID").val("");
//     $("#selectItemCode").val("");
//     $("#orderCustomerName").val("");
//     $("#orderCustomerAge").val("");
//     $("#orderCustomerSalary").val("");
//     $("#orderCustomerAddress").val("");
//     $("#orderCustomerContact").val("");
//     $("#txtItemDescription").val("");
//     $("#txtItemPrice").val("");
//     $("#txtQTYOnHand").val("");
//     $("#OrderQty").val("");
//
//
// }
