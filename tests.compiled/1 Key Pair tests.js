// Generated by CoffeeScript 1.7.1
(function() {
  var Alice, Bobby, read, readFromNetwork, tape, _ref;

  tape = require("./tape_test_harness");

  _ref = require("./fixtures"), Alice = _ref.Alice, Bobby = _ref.Bobby, read = _ref.read, readFromNetwork = _ref.readFromNetwork;

  tape("Key Pair", function(test) {
    return test.end();
  });

  tape("Compute Alice’s keys from her secret phrase and email address", function(test) {
    return miniLockLib.getKeyPair(Alice.secretPhrase, Alice.emailAddress, function(keys) {
      test.ok(Object.keys(keys).length === 2);
      test.same(keys.publicKey, Alice.publicKey);
      test.same(keys.secretKey, Alice.secretKey);
      return test.end();
    });
  });

  tape("Compute Bobby’s keys from his secret phrase and email address", function(test) {
    return miniLockLib.getKeyPair(Bobby.secretPhrase, Bobby.emailAddress, function(keys) {
      test.ok(Object.keys(keys).length === 2);
      test.same(keys.publicKey, Bobby.publicKey);
      test.same(keys.secretKey, Bobby.secretKey);
      return test.end();
    });
  });

}).call(this);
