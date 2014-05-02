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

var map2 =
    "X,X,X,X,X,X,X,X,X,X,X\n" +
    "X,A,L,X,#,X,#,_,L,_,X\n" +
    "X,B,_,#,#,#,#,L,L,_,X\n" +
    "X,_,X,X,#,X,#,C,P,_,X\n" +
    "X,X,_,#,#,#,#,#,#,#,X\n" +
    "X,_,X,X,_,X,#,P,L,L,X\n" +
    "X,_,L,_,X,P,#,_,X,_,X\n" +
    "X,_,L,L,L,_,#,L,_,1,X\n" +
    "X,L,V,L,_,X,L,L,D,_,X\n" +
    "X,_,1,X,1,X,_,L,V,_,X\n" +
    "X,X,X,X,X,X,X,X,X,X,X";

var map3 =
    "X,X,X,X,X,X,X,X,X,X,X\n" +
    "X,_,_,_,_,_,_,_,_,_,X\n" +
    "X,_,A,_,_,_,_,_,_,_,X\n" +
    "X,_,_,_,_,_,X,_,_,_,X\n" +
    "X,_,_,_,_,_,_,_,_,_,X\n" +
    "X,_,_,_,1,_,_,_,_,_,X\n" +
    "X,_,_,_,_,_,_,X,_,_,X\n" +
    "X,_,_,_,B,_,_,_,_,_,X\n" +
    "X,_,_,_,_,_,_,_,_,_,X\n" +
    "X,_,_,_,_,_,_,_,_,_,X\n" +
    "X,X,X,X,X,X,X,X,X,X,X";

var data, letter, rows;
var compassRisk, compassXBlocks, compassLBlocks, emptyCells, closeBombs, closeTargets, targetsPosition, targetPos, userLetter, nextMove;
var index, statistics, varMove, targets;
JsMockito.Integration.QUnit();
JsHamcrest.Integration.QUnit();

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
        equal(lastMov, undefined, "Last move is undefined");
        expect(5);
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
        equal(getNear(x-20, y+10), "Error", "Near Error Ok");
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

    QUnit.test("Select Max Index", function(){
        updateChart(map2, "A");
        fillStatistics();
        equal(killerMode(), "P", "Select max -1 Ok");

        equal(calc_max([0, 1, 2, 3]), 3, "Max Ok");
        equal(calc_max([1, 1, 1, 1]), 1, "Max Ok");
        equal(calc_max([-1, -8, -5, -10]), -1, "Max Ok");
        equal(calc_max(undefined), undefined, "Max undefined Ok");
        equal(calc_max(1/0), Infinity, "Max undefined Ok");

        equal(calc_min([0, 1, 2, 3]), 0, "Min Ok");
        equal(calc_min([1, 1, 1, 1]), 1, "Min Ok");
        equal(calc_min([-1, -8, -5, -10]), -10, "Min Ok");
    });

    QUnit.test("Calculate total by array test", function(){
        equal(calc_totals([1, 2, 3, 4]), 10, "Total Ok");
        equal(calc_totals([-1, 5, -3, -1]), 0, "Total Ok");
        equal(calc_totals([0, 30, 4]), 34, "Total Ok");
    });

    QUnit.test("Are close blocks test", function(){
        ok(areCloseBlocks(-1, /_/));
        equal(nextMove, "E", "Next move Ok");
        ok(areCloseBlocks(-1, /X/));
        equal(nextMove, "N", "Next move Ok");
        ok(areCloseBlocks(-1, /L/));
        equal(nextMove, "O", "Next move Ok");
        ok(areCloseBlocks(0, /L/));
        equal(nextMove, "?", "Next move Ok");
        ok(areCloseBlocks(0, /_/));
        ok(areCloseBlocks(1, /_/));
        ok(areCloseBlocks(2, /X/));
        ok(areCloseBlocks(2, /_/));
        ok(areCloseBlocks(2, /#/));
        ok(!areCloseBlocks(2, /V/), "Not find any Ok");
    });

    QUnit.test("Find target Map", function(){
        updateChart(map1, "A");
        var target = "#";
        var targetMap = retrieveTargetMap(target);
        var cellKeys = [];
        for(var i in targetMap){
            cellKeys = cellKeys.concat(i);
        }
        var positions = { "1":[7,3], "2":[6,4], "3":[7,4], "4": [8,4], "5":[7,5], "6":[9,8], "7":[8,9], "8":[9,9]};
        propEqual(cellKeys, ["1", "2", "3", "4", "5", "6", "7", "8"], "Assert kwys Ok");
        propEqual(targetMap, positions, "Assert target positions Ok");

        target = "P";
        targetMap = retrieveTargetMap(target);
        positions = { "1":[8, 2], "2":[5, 6]};
        propEqual(targetMap, positions, "Assert target positions Ok");

        updateChart(map2, "A");
        target = "V";
        targetMap = retrieveTargetMap(target);
        positions = { "1":[2, 8], "2":[8, 9]};
        propEqual(targetMap, positions, "Assert target positions Ok");

    });

    QUnit.test("Find target with offset", function(){
        updateChart(map1, "A");
        var target = "#";
        propEqual(findTargetWithOffset(target, map1, 0), [7,3], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 81), [6,4], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 101), [7,4], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 103), [8,4], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 105), [7,5], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 125), [9,8], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 195), [8,9], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 215), [9,9], "Target position " + target + " Ok");

        target = "P";
        propEqual(findTargetWithOffset(target, map1, 0), [8,2], "Target position " + target + " Ok");
        propEqual(findTargetWithOffset(target, map1, 61), [5,6], "Target position " + target + " Ok");
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

    QUnit.test("New Path test", function(){
        compassRisk = [50, 40, 30, 20];
        emptyCells = [true, true, true, true];
        equal(findNewPath(0), "O", "Path Ok");
        equal(findNewPath(1), "N", "Path Ok");
        equal(findNewPath(2), "E", "Path Ok");
        equal(findNewPath(3), "S", "Path Ok");
        equal(findNewPath(4), "P", "Path Ok");
        equal(findNewPath(-99), "P", "Path Ok");
        compassRisk = [99, 40, 30, 20];
        equal(findNewPath(0), "N", "Path Ok");
        compassRisk = [4, 140, 30, 20];
        equal(findNewPath(1), "E", "Path Ok");
        compassRisk = [9, 40, 130, 20];
        equal(findNewPath(2), "S", "Path Ok");
        compassRisk = [9, 40, 30, 120];
        equal(findNewPath(3), "P", "Path Ok");
    });

    QUnit.test("Obtain compass move test", function(){
        updateChart(map3, "B");
        fillStatistics();
        var targetPos = [1, 1];
        equal(obtainCompassMove(targetPos, true), "BO", "Move Ok");
        equal(obtainCompassMove(targetPos, false), "O", "Move Ok");
        targetPos = [1, 9];
        equal(obtainCompassMove(targetPos, true), "BS", "Move Ok");
        equal(obtainCompassMove(targetPos, false), "S", "Move Ok");
        targetPos = [9, 1];
        equal(obtainCompassMove(targetPos, true), "BN", "Move Ok");
        equal(obtainCompassMove(targetPos, false), "N", "Move Ok");
        targetPos = [9, 9];
        equal(obtainCompassMove(targetPos, true), "BE", "Move Ok");
        equal(obtainCompassMove(targetPos, false), "E", "Move Ok");
        targetPos = findTarget("B", map3);
        emptyCells = [false, false, false, false];
        equal(obtainCompassMove(targetPos, true), "P", "Move Ok");
    });

QUnit.module ("Play Mode Test", {
    setup: function(){
        updateChart(map2, "C");
        initialize();
        fillStatistics();
    }
});
    QUnit.test("Expected mode active", function(){
        countDown = 1;
        equal(moveBot(), hunterMode(), "Hunter mode active Ok");
        countDown = 0;
        equal(moveBot(), greedMode(), "Greed mode active Ok");
        updateChart(map2, "B");
        fillStatistics();
        equal(moveBot(), killerMode(), "Killer mode active Ok");
        lastMov = undefined;
        equal(moveBot(), hunterMode(), "Killer mode not active Ok");
        updateChart(map1, "C");
        fillStatistics();
        lastMov = "BO";
        equal(moveBot(), bomberMode(), "Bomber mode active Ok");
        updateChart(map3, "A");
        fillStatistics();
        equal(moveBot(), hunterMode(), "Hunter mode active Ok");
        updateChart(map3, "B");
        fillStatistics();
        equal(moveBot(), henMode(), "Hen mode active Ok");
    });

    QUnit.test("Hen mode test", function(){
        bombDown = 1;
        compassRisk = [10, 20, 30, 40];
        emptyCells = [true, true, true, true];
        equal(henMode(), "O");
        equal(bombDown, 0);
        emptyCells = [false, true, true, true];
        equal(henMode(), "N");
        emptyCells = [false, false, true, true];
        equal(henMode(), "E");
        compassRisk = [110, 20, 30, 40];
        emptyCells = [true, true, true, true];
        equal(henMode(), "N");
        compassRisk = [110, 120, 30, 40];
        emptyCells = [true, true, false, true];
        equal(henMode(), "S");
    });

    QUnit.test("Greed mode test", function(){
        nextMove = "N";
        equal(greedMode(), "N");
        nextMove = "?";
        compassRisk = [110, 120, 30, 40];
        emptyCells = [true, true, false, true];
        equal(greedMode(), "S");
    });

    QUnit.test("Bomber mode test", function(){
        updateChart(map1, "D");
        emptyCells = [true, true, true, true];
        compassLBlocks = [1, 2, 3, 4];
        equal(bomberMode(), "BS", "Move Ok");
        compassLBlocks = [10, 18, 3, 4];
        equal(bomberMode(), "BN", "Move Ok");
        compassLBlocks = [10, 18, 33, 4];
        updateChart(map2, "B");
        equal(bomberMode(), "BE", "Move Ok");
        emptyCells = [false, false, false, false];
        equal(bomberMode(), "P", "Move Ok");
    });

    QUnit.test("Killer mode test", function(){
        updateChart(map3, "A");
        fillStatistics();
        closeTargets = [1, 0, 0, 1];
        equal(killerMode(), "BO", "Move Ok");
        closeTargets = [1, 3, 0, 1];
        equal(killerMode(), "BN", "Move Ok");
        closeTargets = [1, 0, 4, 1];
        equal(killerMode(), "BE", "Move Ok");
        closeTargets = [1, 0, 0, 10];
        equal(killerMode(), "BS", "Move Ok");
    });

    QUnit.test("Hunter mode test", function(){
        updateChart(map3, "A");
        fillStatistics();
        countDown = -1;
        closeTargets = [0, 1, 0, 1];
        equal(hunterMode(), killerMode(), "Move Ok");
        equal(countDown, 0, "Counter Ok");
        equal(calc_exits(emptyCells), true);
        countDown = -1;
        closeTargets = [0, 0, 0, 0];
        var targetBPosition = findTarget("B", map3);
        equal(hunterMode(), obtainCompassMove(targetBPosition, false), "Move Ok");
        equal(countDown, 2, "Counter Ok");
    });