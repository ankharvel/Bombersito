try{
    var net = require('net');
    var playerNode = require('./playernode.js');
    var bot = playerNode.newPlayer();

    var client = net.connect(5000,"192.168.0.17", function() {
        console.log('bot connected');
        var user="player_1";
        var token="5336d3acac4a33670400000a";
        client.write(user+","+token+"\r\n");
    });

    client.on('data', function(data) {
        var info = data.toString().split(";");
        switch(info[0]){
            case "EMPEZO":
                //leemos el mapa incial y nuestra letra
                bot.letter = info[2];
                bot.updatePower();
                bot.updateMap(info[1]);
                break;
            case "TURNO":
                console.log(info[1]);
                bot.updateMap(info[2]);
                var mov= bot.move();
                client.write(mov);
                break;
            case "PERDIO":
                console.log("perdi :'( ");
                break;
            default:
                console.log(info[0]);
                break;
        }
    });

    client.on('end', function() {
        console.log('bot disconnected');
    });

} catch(ReferenceError){
    console.log(ReferenceError);
}
