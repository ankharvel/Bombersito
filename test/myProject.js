

function convertFromCelsiusToFahrenheit(c){
    var f = c * (9/5) + 32;
    return f;
}

function convertFromFahrenheitToCelsius(f){
    var c = (f - 32) * (5/9);
    return c;
}

function getValue(cellValue) {
    switch (cellValue) {
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
            return -10;
            break;
        case "P":
            return -10;
            break;
        case "A":
        case "B":
        case "C":
        case "D":
            return 2;
            break;
        case "3":
        case "2":
            return 50;
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

exports.newPlayer = function(){
    player = {
        x:-1,
        y:-1,
        letter:"Z",
        rows:[],
        lastMov:"",
        countDown: -1,
        bombDown: -1
//        updatePower:function(){initialize()},
//        updateMap:function(data){updateChart(data, this.letter)},
//        move:function(){return superMoveBot()}
    };
    return player;
};


