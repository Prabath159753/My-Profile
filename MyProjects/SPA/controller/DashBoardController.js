/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/

// hide all content

$("#customerContent").css("display","block");
$("#itemContent").css("display","none");
$("#orderContent").css("display","none");

$("#linkCustomer").click(function (){
    $("#customerContent").css("display","block");
    $("#itemContent").css("display","none");
    $("#orderContent").css("display","none");
    loadAllCustomer();

});

$("#linkItem").click(function (){
    $("#itemContent").css("display","block");
    $("#customerContent").css("display","none");
    $("#orderContent").css("display","none");
});

$("#linkPlaceOder").click(function (){
    $("#orderContent").css("display","block");
    $("#itemContent").css("display","none");
    $("#customerContent").css("display","none");

});