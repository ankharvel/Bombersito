module ("Player node test")

test("Get value", function(){
    var value = getValue("X");
    equal(value, 6, "Value is correct");
})

//test("conversion to F", function(){
//    var actual1 = convertFromCelsiusToFahrenheit(20);
//    equal(actual1, 68, "Value not correct");
//
//    var actual2 = convertFromCelsiusToFahrenheit(30);
//    equal(actual2, 86, "Value not correct");
//})
//
//test("a basic test example", function (assert) {
//    ok(true, "this test is fine");
//    var value = "hello";
//    equal("hello", value, "We expect value to be hello");
//});
//
//test("conversion to C", function(){
//    var actual1 = convertFromFahrenheitToCelsius(68);
//    equal(actual1, 20, "Value not correct");
//
//    var actual2 = convertFromFahrenheitToCelsius(86);
//    equal(actual2, 30, "Value not correct");
//})
