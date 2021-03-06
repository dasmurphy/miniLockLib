// Generated by CoffeeScript 1.10.0
(function() {
  var Alice, Bobby, miniLockLib, ref, ref1, tape;

  ref = require("./test_setup"), tape = ref.tape, miniLockLib = ref.miniLockLib;

  ref1 = require("./fixtures"), Alice = ref1.Alice, Bobby = ref1.Bobby;

  tape("Make Keys", function(test) {
    return test.end();
  });

  tape("returns an key pair operation that has started", function(test) {
    var operation;
    return operation = miniLockLib.makeKeyPair(Alice.secretPhrase, Alice.emailAddress, function(error, keys) {
      test.ok(operation != null ? operation.hashDigestOfSecret : void 0);
      return test.end();
    });
  });

  tape("make a pair of keys for Alice", function(test) {
    return miniLockLib.makeKeyPair(Alice.secretPhrase, Alice.emailAddress, function(error, keys) {
      test.ok(Object.keys(keys).length === 2);
      test.same(keys.publicKey, Alice.publicKey);
      test.same(keys.secretKey, Alice.secretKey);
      return test.end();
    });
  });

  tape("make a pair of keys for Bobby", function(test) {
    return miniLockLib.makeKeyPair(Bobby.secretPhrase, Bobby.emailAddress, function(error, keys) {
      test.ok(Object.keys(keys).length === 2);
      test.same(keys.publicKey, Bobby.publicKey);
      test.same(keys.secretKey, Bobby.secretKey);
      return test.end();
    });
  });

  tape("can’t make keys without a callback", function(test) {
    var noCanDo;
    noCanDo = function() {
      return miniLockLib.makeKeyPair();
    };
    test.throws(noCanDo, "Can’t make keys without a callback function.");
    return test.end();
  });

  tape("can’t make keys without a secret phrase", function(test) {
    return miniLockLib.makeKeyPair(void 0, Bobby.emailAddress, function(error) {
      test.same(error, "Can’t make keys without a secret phrase.");
      return test.end();
    });
  });

  tape("can’t make keys with unacceptable secret phrase", function(test) {
    return miniLockLib.makeKeyPair("My password is password.", Bobby.emailAddress, function(error) {
      test.same(error, "Can’t make keys because 'My password is password.' is not an acceptable secret phrase.");
      return test.end();
    });
  });

  tape("can’t make keys without an email address", function(test) {
    return miniLockLib.makeKeyPair(Bobby.secretPhrase, void 0, function(error) {
      test.same(error, "Can’t make keys without an email address.");
      return test.end();
    });
  });

  tape("can’t make keys with unacceptable email address", function(test) {
    return miniLockLib.makeKeyPair(Bobby.secretPhrase, "undefined@undefined", function(error) {
      test.same(error, "Can’t make keys because 'undefined@undefined' is not an acceptable email address.");
      return test.end();
    });
  });

}).call(this);
