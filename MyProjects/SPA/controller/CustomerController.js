/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/

/* save customer */
function saveCustomer() {
    let cid = $("#txtCusID").val();
    let name = $("#txtCusName").val();
    let address = $("#txtCusAddress").val();
    let contact = $("#txtCusTp").val();

    if (name.length !==0 && address.length !==0 && contact.length !==0) {
        var c = new Customer(cid, name, address, contact)
        customerDB.push(c);
        getAllCustomers();
        // generateCustomerId();
        // name.focus();
    } else {
        alert("Fields cannot be empty!");
    }
}

/* get all customer */
function getAllCustomers() {
    $("#customerTable").empty();
    for (let i = 0; i < customerDB.length; i++) {

        let row = `<tr><td>${customerDB[i].getCId()}</td><td>${customerDB[i].getName()}</td><td>${customerDB[i].getAddress()}</td><td>${customerDB[i].getContact()}</td></tr>`;
        /* select the table body and append the row */
        $("#customerTable").append(row);
    }
}

/* search customer */
$("#btnSearchCustomer").click(function () {
    var searchID = $("#txtSearchCusID").val();

    var response = searchCustomer(searchID);
    console.log(searchID);
    if (response) {
        $("#txtCusID").val(response.getCId());
        $("#txtCusName").val(response.getName());
        $("#txtCusAddress").val(response.getAddress());
        $("#txtCusTp").val(response.getContact());
        $("#lblCusId,#lblCusName,#lblCusAddress,#lblCusTp").text("");

        $("#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', false);
    }else{
        clearAllCustomerForm();
        alert("No Such a Customer");
    }
});

function searchCustomer(id) {
    for (let i = 0; i < customerDB.length; i++) {
        if (customerDB[i].getCId() == id) {
            return customerDB[i];
        }
    }
}

/* Update a Customer */
$("#btnUpdateCustomer").click(function () {
    if ($("#txtCusName").val().length !== 0) {
        let cid = $("#txtSearchCusID").val();
        let name = $("#txtCusName").val();
        let address = $("#txtCusAddress").val();
        let contact = $("#txtCusTp").val();

        for (let i = 0; i < customerDB.length; i++) {
            if (customerDB[i].getCId() === cid ) {
                customerDB[i].setName(name);
                customerDB[i].setAddress(address);
                customerDB[i].setContact(contact);
            }
        }
        getAllCustomers();
        clearAllCustomerForm();
        alert("Customer was updated!");
        $("#txtSearchCustomer").val("");
    } else {
        alert("Select a Customer to Update!");
    }
});

/* Remove a Customer */
$("#btnDeleteCustomer").click(function () {
    if ($("#txtCusName").val().length !== 0) {
        let cid = $("#txtCusID").val();

        let res = confirm("Do you really need to delete this Customer..?");
        if (res) {

            for (let i = 0; i < customerDB.length; i++) {
                if (customerDB[i].getCId() === cid ) {
                    customerDB.splice(i, 1);
                }
            }
            alert("Customer was deleted!");
            getAllCustomers();
            clearAllCustomerForm();
            $("#txtSearchCustomer").val("");
        }

    } else {
        alert("Select a Customer to Remove!");
    }
});

function clearAllCustomerForm() {
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').val("");
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').css('border', '2px solid #ced4da');
    // $('#txtCusID,').focus();
    $("#btnSaveCustomer,#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', true);
    getAllCustomers();
    $("#lblCusId,#lblCusName,#lblCusAddress,#lblCusTp").text("");
}



/* validation started */

/* customer regular expressions */
const cusIDRegEx = /^(C00-)[0-9]{1,3}$/;
const cusNameRegEx = /^[A-z ]{5,20}$/;
const cusAddressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusTpRegEx = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').on('keydown', function (eventOb) {
    if (eventOb.key == "Tab") {
        eventOb.preventDefault(); // stop execution of the button
    }
});

$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').on('blur', function () {
    formValid();
});

//focusing events
$("#txtCusID").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }

    if (eventOb.key == "Control") {
        var typedCustomerID = $("#txtCusID").val();
        var srcCustomer = searchCustomerFromID(typedCustomerID);
        $("#txtCusID").val(srcCustomer.getCustomerID());
        $("#txtCusName").val(srcCustomer.getCustomerName());
        $("#txtCusAddress").val(srcCustomer.getCustomerAddress());
        $("#txtCusTp").val(srcCustomer.getCustomerTp());
    }
});

$("#txtCusName").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusAddress").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusTp").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

/* focusing events end */

$("#btnSaveCustomer,#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', true);

/* print condition for unvalid input */
function formValid() {
    var cusID = $("#txtCusID").val();
    $("#txtCusID").css('border', '1px solid blue');
    $("#lblCusId").text("");
    if (cusIDRegEx.test(cusID)) {
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusName").css('border', '1px solid blue');
            $("#lblCusName").text("");
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                var cusTp = $("#txtCusTp").val();
                var resp = cusTpRegEx.test(cusTp);
                $("#txtCusAddress").css('border', '1px solid blue');
                $("#lblCusAddress").text("");
                if (resp) {
                    $("#txtCusTp").css('border', '1px solid blue');
                    $("#lblCusTp").text("");
                    return true;
                } else {
                    $("#txtCusTp").css('border', '2px solid red');
                    $("#lblCusTp").text("Customer Tp is a required field : Minimum 10 Numbers ");
                    return false;
                }
            } else {
                $("#txtCusAddress").css('border', '2px solid red');
                $("#lblCusAddress").text("Customer Address is a required field : Minimum 7");
                return false;
            }
        } else {
            $("#txtCusName").css('border', '2px solid red');
            $("#lblCusName").text("Customer Name is a required field : Minimum 5, Max 20, Spaces Allowed");
            return false;
        }
    } else {
        $("#txtCusID").css('border', '2px solid red');
        $("#lblCusId").text("Customer ID is a required field : Pattern C00-000");
        return false;
    }
}

/* check input value valid  */
function checkIfValid() {
    var cusID = $("#txtCusID").val();
    if (cusIDRegEx.test(cusID)) {
        $("#txtCusName").focus();
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusAddress").focus();
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                $("#txtCusTp").focus();
                var cusTp = $("#txtCusTp").val();
                var resp = cusTpRegEx.test(cusTp);
                if (resp) {
                    let res = confirm("Do you really need to add this Customer..?");
                    if (res) {
                        saveCustomer();
                        clearAll();
                    }
                } else {
                    $("#txtCusTp").focus();
                }
            } else {
                $("#txtCusAddress").focus();
            }
        } else {
            $("#txtCusName").focus();
        }
    } else {
        $("#txtCusID").focus();
    }
}

function setButton() {
    let b = formValid();
    if (b) {
        $("#btnSaveCustomer").attr('disabled', false);
    } else {
        $("#btnSaveCustomer").attr('disabled', true);
    }
}

$('#btnSaveCustomer').click(function () {
    checkIfValid();
});

/* validation end */