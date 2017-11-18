var faker = require('faker');

var product = {
    product: "",
    material: "",
    adjective : "",
    price: ""
}
console.log("========================");
console.log("WELCOME TO MY SHOP!!!");
console.log("========================");

var products = [];
 for (var i=0; i<10; i++) {
    console.log(faker.fake("{{commerce.productAdjective}} {{commerce.productMaterial}} {{commerce.product}} - ${{commerce.price}}"));
 }


