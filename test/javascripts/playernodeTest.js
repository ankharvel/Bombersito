var assert = require('../nodeunit/lib/assert'),
    async = require('../nodeunit/deps/async'),
    nodeunit = require('../nodeunit/lib/nodeunit'),
    playernode = require('../../src/javascripts/playernode.js');

var bot = playernode.newPlayer();

module.exports = {
    'Test 1' : function(test) {
        test.expect(1);
        test.ok(true, "This shouldn't fail");
        test.done();
    },
    'Test 2' : function(test) {
        test.expect(2);
        test.ok(1 === 1, "This shouldn't fail");
        test.ok(true, "This should fail"); //false
        test.done();
    },
    'Test 3' : function(test){
        test.equal(bot.getValue("L"), 1700);
    }
};