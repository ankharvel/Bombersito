var map1 =
    "X,X,X,X,X,X,X,X,X,X,X\n" +
    "X,B,L,_,X,X,_,_,L,_,X\n" +
    "X,_,X,_,X,_,X,L,P,_,X\n" +
    "X,_,_,_,L,X,_,#,L,_,X\n" +
    "X,X,_,L,_,_,#,#,#,C,X\n" +
    "X,_,_,X,_,X,L,#,L,L,X\n" +
    "X,_,L,_,X,P,_,_,X,_,X\n" +
    "X,_,L,L,L,_,_,L,D,_,X\n" +
    "X,_,V,L,_,X,L,L,_,#,X\n" +
    "X,A,_,L,_,X,_,L,#,#,X\n" +
    "X,X,X,X,X,X,X,X,X,X,X";

var data, letter, rows, y, x;
var compassRisk, compassXBlocks, compassLBlocks, emptyCells, closeBombs, closeTargets, targetsPosition, targetPos, userLetter;

QUnit.module ("Player node initialize", {
    userLetter: "",
    setup: function(){
        initialize();
        userLetter = "D";
        updateChart(map1, userLetter);
    }
});

    QUnit.test("Initialize method", function(){
        ok(pUser, "Print User initialize");
        ok(pMode, "Print Mode initialize");
        equal(bombDown, 0, "Bomb down counter initialize");
        equal(countDown, 0, "Count down counter initialize");
    });

    QUnit.test("Update chart", function(){
        var position = x + ", " + y;

        equal(letter, "D", "My user is: " + userLetter);
        equal(data, map1, "My data is correct");
        equal(rows[5], "X,_,_,X,_,X,L,#,L,L,X", "Var rows[5] is OK");
        ok(rows.length == 11, "Row's length is " + rows.length);
        equal(position, "8, 7", "The current position is: " + position);
    });

    QUnit.test("Statistics", function(){
        fillStatistics();
        propEqual(compassRisk, [9, 13, 21, 8], "Assert Risk Ok " + x + ", " + y);
        propEqual(compassXBlocks, [0, 1, 3, 0], "Assert X Blocks Ok " + x + ", " + y);
        propEqual(compassLBlocks, [3, 2, 0, 2], "Assert L Blocks Ok " + x + ", " + y);
        propEqual(emptyCells, [false, false, true, true], "Assert Empty cells Ok " + x + ", " + y);
        propEqual(closeBombs, [false, false, false, false], "Assert Close Bombs Ok " + x + ", " + y);
        propEqual(closeTargets, [0, 0, 0, 0], "Assert Close Targets Ok " + x + ", " + y);
        var targetsLocation = {"A": [[ 1,9]], "B": [[1, 1]], "C": [[9, 4]], "D": [[8, 7]]};
        propEqual(targetsPosition, targetsLocation, "Assert Target Locations Ok " + x + ", " + y);
    });

QUnit.module ("Helper Methods", {
    setup: function(){
        updateChart(map1, "D");
    }
});

    QUnit.test("Get cell character", function(){
        equal(getNear(x-1, y-1), "_", "Near x-1, y-1");
        equal(getNear(x-1, y), "L", "Near x-1, y");
        equal(getNear(x-1, y+1), "L", "Near x-1, y+1");
        equal(getNear(x-2, y-1), "_", "Near x-2, y-1");
        equal(getNear(x-2, y), "_", "Near x-2, y");
        equal(getNear(x-2, y+1), "L", "Near x-2, y+1");
    });

    QUnit.test("Get risk value from cell", function(){
        var value = "X";
        equal(getValue(value), 6, "Risk cell: " + value + " Ok");
        value = "L";
        equal(getValue(value), 2, "Risk cell: " + value + " Ok");
        value = "_";
        equal(getValue(value), 1, "Risk cell: " + value + " Ok");
        value = "#";
        equal(getValue(value), 1, "Risk cell: " + value + " Ok");
        value = "2";
        equal(getValue(value), 50, "Risk cell: " + value + " Ok");
    });

    QUnit.test("Get risk by compass position", function(){
        var wCells = [x-1, x-2, -1, y-1, y, y+1];
        equal(getTotalByParameter(wCells, "Risk"), 9, "West Risk ok");
        var nCells = [x-1, x, x+1, y-1, y-2, -1];
        equal(getTotalByParameter(nCells, "Risk"), 13, "Nort Risk ok");
        var eCells = [x+1, x+2, -1, y-1, y, y+1];
        equal(getTotalByParameter(eCells, "Risk"), 21, "Est Risk ok");
        var sCells = [x-1, x, x+1, y+1, y+2, -1];
        equal(getTotalByParameter(sCells, "Risk"), 8, "South Risk ok");
    });

module( "module", {
    pp: -1,
    setup: function() {
        pp = -1;
        ok( pp == -1, "one extra assert per test" );
    },
    teardown: function() {
        ok( true, "and one extra assert after each test" );
    }
});
test( "test with setup and teardown", function() {
//    expect( 3 );
    ok(pp == -1, "tru es true")
});


