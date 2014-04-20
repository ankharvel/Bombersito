var map1 =
    "X,X,X,X,X,X,X,X,X,X,X\n" +
    "X,B,L,_,X,X,_,_,L,_,X\n" +
    "X,_,X,_,X,_,X,L,P,_,X\n" +
    "X,_,_,_,L,X,_,#,L,_,X\n" +
    "X,X,_,L,_,_,#,#,#,C,X\n" +
    "X,_,_,X,_,X,L,#,L,L,X\n" +
    "X,_,L,_,X,_P_,_,X,_,X\n" +
    "X,_,L,L,L,_,_,L,D,_,X\n" +
    "X,_,V,L,_,X,L,L,_,#,X\n" +
    "X,A,_,L,_,X,_,L,#,#,X\n" +
    "X,X,X,X,X,X,X,X,X,X,X";

var toPrint, pMode, pUser, pDate, bombDown, countDown, data, letter, rows, y, x;

QUnit.module ("Player node initialize");

QUnit.test("Initialize method", function(){
    initialize();
    ok(pUser, "Print User initialize");
    ok(pMode, "Print Mode initialize");
    ok(!pDate, "Print Date not initialize");
    equal(bombDown, 0, "Bomb down counter initialize");
    equal(countDown, 0, "Count down counter initialize");
});

QUnit.test("Update chart", function(){
    var userLetter = "D";
    updateChart(map1, userLetter);
    var position = x + ", " + y;

    equal(letter, "D", "My user is: " + userLetter);
    equal(data, map1, "My data is correct");
    equal(rows[5], "X,_,_,X,_,X,L,#,L,L,X", "Var rows[5] is OK");
    ok(rows.length == 11, "Row's length is " + rows.length);
    equal(position, "8, 7", "The current position is: " + position);

});

QUnit.module ("Otro modulo", function(){
    this.pUser = false;
});

QUnit.test("Get value", function(){
    this.pUser = false;

    var value = getValue("X");
    ok(pUser, "Print User initialize");
    equal(value, 6, "Value not correct");
});

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
