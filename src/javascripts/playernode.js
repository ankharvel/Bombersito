exports.newPlayer = function(){
    player = {
        x:-1,
        y:-1,
        letter:"Z",
        rows:[],
        updateMap:function(data){updateChart(data, this.letter)},
        move:function(){return moveBot()}
  };
  return player;
};

exports.operations = function(){
    operations = {
        numer: -1,
        getCellValue: function(name){
            numer = getValue(name);
        }
    };
    return operations;
};

function moveBot(){
    statistics = {
        compassRisk: [],
        compassXBlocks: [],
        compassLBlocks: [],
        emptyCells: [],
        closeBombs: [],
        lastMov: -1
    };
    fillStatistics();

    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    var totalLBlocks = calc_totals(compassLBlocks);
    var index;

    console.log("Risk = " + compassRisk);
    console.log("XBlocks = " + compassXBlocks);
    console.log("LBlocks = " + compassLBlocks);
    console.log("EmptyCells = " + emptyCells);
    console.log("CloseBombs = " + closeBombs);
    console.log("Total L Blocks = " + totalLBlocks);
    console.log("Are bombs = " + areBombs);
    console.log("Are Exits = " + areExits);
    console.log("Are VP Blocks = " + areVPBlocks());
    console.log("Index = " + selectMaxIndex(compassRisk, true));
    console.log("Position = " + this.x + ", " + this.y);

    if(!areBombs && areExits && totalLBlocks>0 && !areVPBlocks()){
        index = selectMaxIndex(compassLBlocks, true);
//        console.log("Entró poner bomba");
        switch (index){
            case 0:
                return (areCloseBlocks(index, "L") ? "BO" : "O");
                break;
            case 1:
                return (areCloseBlocks(index, "L") ? "BN" : "N");
                break;
            case 2:
                return (areCloseBlocks(index, "L") ? "BE" : "E");
                break;
            case 3:
                return (areCloseBlocks(index, "L") ? "BS" : "S");
                break;
            default:
                return "P";
        }
    } else {
//        console.log("Entró evitar bomba");
        index = selectMaxIndex(compassRisk, false);
        switch (index){
            case 0:
                return (compassRisk[index] < 100 ?  "O" : "P");
                break;
            case 1:
                return (compassRisk[index] < 100 ?  "N" : "P");
                break;
            case 2:
                return (compassRisk[index] < 100 ?  "E" : "P");
                break;
            case 3:
                return (compassRisk[index] < 100 ?  "S" : "P");
                break;
            default:
                return "P";
        }
    }

/*    var mov=Math.floor(Math.random()*3)+1;
    switch(mov){
        case 0: return "N"; break;
        case 1: return "E"; break;
        case 2: return "S"; break;
        case 3: return "O"; break;
    }*/
}

function areVPBlocks(){
    return areCloseBlocks(0, "P") ||
        areCloseBlocks(1, "P") ||
        areCloseBlocks(2, "P") ||
        areCloseBlocks(3, "P") ||
        areCloseBlocks(0, "V") ||
        areCloseBlocks(1, "V") ||
        areCloseBlocks(2, "V") ||
        areCloseBlocks(3, "V");
}

function areCloseBlocks(index, type){
    var newX;
    var newY;
    switch (index){
        case 0:
            newX = this.x - 1;
            newY = this.y;
            break;
        case 1:
            newX = this.x;
            newY = this.y - 1;
            break;
        case 2:
            newX = this.x + 1;
            newY = this.y;
            break;
        case 3:
            newX = this.x;
            newY = this.y + 1;
            break;
    }

    if(getNear(newX-1, newY) == type){
        return true;
    } else if(getNear(newX, newY-1) == type){
        return true;
    } else if(getNear(newX+1, newY) == type){
        return true;
    } else {
        return getNear(newX, newY+1) == type;
    }
}

function selectMaxIndex(array, selectMax){
//    if(!booleanResult(closeBombs) && statistics.lastMov != -1 && calc_exits(emptyCells)){
//        var oppositeIndex = statistics.lastMov < 2 ? statistics.lastMov + 2 : statistics.lastMov - 2;
//        emptyCells[oppositeIndex] = false;
//        console.log(emptyCells);
//    }
    var i = 0;
    var availableArray = [];
    for(i=0; i<array.length; i++){
        if(emptyCells[i]){
            availableArray = availableArray.concat(array[i]);
            console.log("Primer resultado es: " + availableArray);
        }
    }

    var targetValue =  selectMax ? calc_max(availableArray) : calc_min(availableArray);
    for(index=0; index<array.length; index++){
        if(emptyCells[index]){
            if(targetValue == array[index]){
                return index;
            }
        }
    }

    return -1;
}

function calc_max(array){
    var newArray = ([]).concat(array);
    return newArray.sort()[array.length-1];
}

function calc_min(array, i){
    var newArray = ([]).concat(array);
    return newArray.sort()[0];
}

function calc_totals(array) {
    return eval("(" + array.join(" + ") + ");");
}

function booleanResult(array) {
    return eval("(" + array.join(" || ") + ");");
}

function calc_exits(array) {
    return eval("((" + array.join(" ? 1 : 0) + (") + " ? 1 : 0));") >= 2;
}

function updateChart(data, letter){
    this.rows = data.split("\n");
    var pos = data.indexOf(letter)/2;
    this.y = Math.floor(pos/this.rows.length);
    this.x = pos%(this.rows).length;
}

function fillStatistics(){
    var wCells = new Array(this.x-1, this.x-2, -1, this.y-1, this.y, this.y+1);
    var nCells = new Array(this.x-1, this.x, this.x+1, this.y-1, this.y-2, -1);
    var eCells = new Array(this.x+1, this.x+2, -1, this.y-1, this.y, this.y+1);
    var sCells = new Array(this.x-1, this.x, this.x+1, this.y+1, this.y+2, -1);
    var emptyRegex = /_|#|a|b|c|d|V|P/;

    compassRisk = new Array(
        getRisk(wCells), getRisk(nCells), getRisk(eCells), getRisk(sCells)
    );
    compassXBlocks = new Array(
        getXBlocks(wCells), getXBlocks(nCells), getXBlocks(eCells), getXBlocks(sCells)
    );
    compassLBlocks = new Array(
        getLBlocks(wCells), getLBlocks(nCells), getLBlocks(eCells), getLBlocks(sCells)
    );
    emptyCells = new Array(
        emptyRegex.test(getNear(this.x-1, this.y)),
        emptyRegex.test(getNear(this.x, this.y-1)),
        emptyRegex.test(getNear(this.x+1, this.y)),
        emptyRegex.test(getNear(this.x, this.y+1))
    );

    closeBombs = new Array(
        areBombs(wCells), areBombs(nCells), areBombs(eCells), areBombs(sCells)
    );
}

function getTotalByParameter(array, parameter){
    var xArray = new Array(array[0], array[1], array[2]);
    var yArray = new Array(array[3], array[4], array[5]);
    var bombRegex = /1|2|3/;
    var result = 0;

    for(var i=0; i<xArray.length; i++){
        for(var j=0; j<yArray.length; j++){
            if(xArray[i] >= 0 && xArray[i] <= 10 && yArray[j] >= 0 && yArray[j] <= 10){
                var cellData = getNear(xArray[i], yArray[j]);
                switch (parameter){
                    case "Risk":
                        result += getValue(cellData);
                        break;
                    case "Bombs":
                        if(bombRegex.test(cellData)){
                            result += 1;
                        }
                        break;
                    default :
                        if( cellData == parameter){
                            result += 1;
                        }
                }
            }
        }
    }
    return result;
}

function getRisk(array){
    return getTotalByParameter(array, "Risk");
}

function getXBlocks(array){
    return getTotalByParameter(array, "X");
}

function getLBlocks(array){
    return getTotalByParameter(array, "L");
}

function areBombs(array){
    return getTotalByParameter(array, "Bombs") > 0;
}

function getNear(x,y) {
    try{
        var rRow = this.rows[y].split(",");
        return rRow[x];
    }catch(err){
        console.log("Bad argument getNear(" + x + "," + y + ")");
        return "Error";
    }
}

function getValue(cellValue){
    switch (cellValue){
        case "X":
            return 6;
            break;
        case "#":
            return 1;
            break;
        case "L":
            return 2;
            break;
        case "_":
            return 1;
            break;
        case "V":
            return 0;
            break;
        case "P":
            return 0;
            break;
        case "A":
        case "B":
        case "C":
        case "D":
            return 8;
            break;
        case "3":
        case "2":
        case "1":
            return 100;
            break;
        case "a":
        case "b":
        case "c":
        case "d":
            return 1;
            break;
        default :
            return 10;
    }
}