/**
 * @ author : Kavishka Prabath
 * @ since : 0.1.0
 **/

function Customer(cid, name, address, contact) {
    this.__cid = cid;
    this.__name = name;
    this.__address = address;
    this.__contact = contact;

    this.getCId = function(){
        return this.__cid;
    }
    this.setCId = function (cid) {
        this.__cid = cid;
    }

    this.getName = function () {
        return this.__name;
    }
    this.setName = function (name) {
        this.__name = name;
    }

    this.getAddress = function () {
        return this.__address;
    }
    this.setAddress = function (address) {
        this.__address = address;
    }

    this.getContact = function () {
        return this.__contact;
    }
    this.setContact = function (contact) {
        this.__contact = contact;
    }
}
    