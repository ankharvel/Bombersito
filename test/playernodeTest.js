var map1 =
    "X,X,X,X,X,X,X,X,X,X,X\n" +
    "X,_,L,_,X,X,_,_,L,_,X\n" +
    "X,_,X,_,X,_,X,L,P,_,X\n" +
    "X,_,_,_,L,X,_,#,L,_,X\n" +
    "X,X,_,L,_,_,#,#,#,C,X\n" +
    "X,_,_,X,_,X,L,#,L,L,X\n" +
    "X,_,L,_,X,P,_,_,X,_,X\n" +
    "X,B,L,L,L,_,_,L,D,_,X\n" +
    "X,A,V,L,_,X,L,L,_,#,X\n" +
    "X,_,1,L,1,X,_,L,#,#,X\n" +
    "X,X,X,X,X,X,X,X,X,X,X";

var data, letter, rows;
var compassRisk, compassXBlocks, compassLBlocks, emptyCells, closeBombs, closeTargets, targetsPosition, targetPos, userLetter, nextMove;
var index, statistics;

QUnit.module ("Player node initialize", {
    userLetter: "",
    setup: function(){
        initialize();
        userLetter = "D";
        updateChart(map1, userLetter);
    },
    teardown: function() {
        bombDown = 0;
        userLetter = "D";
        fillStatistics();
    }
});

    QUnit.test("Initialize method", function(){
        ok(pUser, "Print User initialize");
        ok(pMode, "Print Mode initialize");
        equal(bombDown, 0, "Bomb down counter initialize");
        equal(countDown, 0, "Count down counter initialize");
        expect(4);
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
        var targetsLocation = {"A": [[1,8]], "B": [[1, 7]], "C": [[9, 4]], "D": [[8, 7]]};
        propEqual(targetsPosition, targetsLocation, "Assert Target Locations Ok " + x + ", " + y);
    });

    QUnit.test("New Statistics with user A", function(){
        userLetter = "A";
        updateChart(map1, userLetter);
        fillStatistics();
        propEqual(closeBombs, [false, false, true, true], "New Assert Close Bombs Ok " + x + ", " + y);
        propEqual(closeTargets, [0, 1, 0, 0], "New Assert Close Targets Ok " + x + ", " + y);
        bombDown = 1;
        propEqual(compassRisk, [18, 19, 98, 125], "New Assert Risk Ok " + x + ", " + y);
        lastMov = "N";
        fillStatistics();
        propEqual(compassRisk, [18, 19, 98, 225], "New Assert Risk with last mov Ok " + x + ", " + y);
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
        value = "P";
        equal(getValue(value), -10, "Risk cell: " + value + " Ok");
        value = "z";
        equal(getValue(value), 10, "Risk cell: " + value + " Ok");
        value = "a";
        equal(getValue(value), 1, "Risk cell: " + value + " Ok");
    });

    QUnit.test("Get risk by compass position", function(){
        var wCells = [x-1, x-2, -1, y-1, y, y+1];
        equal(getTotalByParameter(wCells, "Risk"), 9, "West Risk ok");
        var nCells = [x-1, x, x+1, y-1, y-2, -1];
        equal(getTotalByParameter(nCells, "Risk"), 13, "North Risk ok");
        var eCells = [x+1, x+2, -1, y-1, y, y+1];
        equal(getTotalByParameter(eCells, "Risk"), 21, "Est Risk ok");
        var sCells = [x-1, x, x+1, y+1, y+2, -1];
        equal(getTotalByParameter(sCells, "Risk"), 8, "South Risk ok");
    });

    QUnit.test("Are close V/P Blocks", function(){
        ok(!areVPBlocks(), "VP Blocks assert Ok");
        updateChart(map1, "A");
        ok(areVPBlocks(), "VP Blocks assert Ok");
    });

QUnit.module ("Move Methods", {
    setup: function(){
        updateChart(map1, "A");
        initialize();
        fillStatistics();
        bombDown = 1;
    }
});

    QUnit.test("Super move bot", function(){
        equal(superMoveBot(), "P", "SuperMove for 'A' ok");
        updateChart(map1, "B");
        bombDown = 0;
        fillStatistics();
        equal(superMoveBot(), "N", "SuperMove for 'B' ok");
        updateChart(map1, "C");
        fillStatistics();
        equal(superMoveBot(), "BO", "SuperMove for 'C' ok");
        bombDown = 0;
        updateChart(map1, "D");
        fillStatistics();
        equal(superMoveBot(), "BS", "SuperMove for 'D' ok");
    });

    QUnit.test("Evaluate move", function(){
        equal(evaluate("S"), "P", "Evaluate move 'A' to S Ok");
        equal(evaluate("E"), "E", "Evaluate move 'A' to E Ok");
        updateChart(map1, "B");
        bombDown = 0;
        fillStatistics();
        equal(evaluate("O"), "O", "Evaluate move 'B' to O Ok");
        updateChart(map1, "C");
        fillStatistics();
        equal(evaluate("O"), "O", "Evaluate move 'C' to O Ok");
        equal(evaluate("N"), "N",  "Evaluate move 'C' to N Ok");
        equal(evaluate("E"), "E",  "Evaluate move 'C' to E Ok");
        equal(evaluate("S"), "S",  "Evaluate move 'C' to S Ok");
        equal(evaluate("P"), "P",  "Evaluate move 'C' to P Ok");
        updateChart(map1, "D");
        fillStatistics();
        equal(evaluate("BO"), "BO",  "Evaluate move 'D' to BO Ok");
        equal(evaluate("BN"), "BN",  "Evaluate move 'D' to BN Ok");
        equal(evaluate("BE"), "BE",  "Evaluate move 'D' to BE Ok");
        equal(evaluate("SS"), "P",  "Evaluate move 'D' to SS Ok");
    });

QUnit.module ("Client", {
    setup: function(){
    }
});

    QUnit.test("Player test", function(){
        expect(0);
    });



