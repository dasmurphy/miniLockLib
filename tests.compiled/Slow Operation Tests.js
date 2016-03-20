// Generated by CoffeeScript 1.8.0
(function() {
  var Alice, Blob, Bobby, miniLockLib, read, readFromNetwork, tape, _ref, _ref1;

  _ref = require("./test_setup"), tape = _ref.tape, miniLockLib = _ref.miniLockLib;

  Blob = (typeof window !== "undefined" && window !== null ? window.Blob : void 0) || require("../library.compiled/Blob");

  _ref1 = require("./fixtures"), Alice = _ref1.Alice, Bobby = _ref1.Bobby, read = _ref1.read, readFromNetwork = _ref1.readFromNetwork;

  tape("Slow Operations", function(test) {
    return test.end();
  });

  tape("decrypt 1MB file for Alice", function(test) {
    return readFromNetwork("1MB.tiff.for.Alice.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.start(function(error, decrypted) {
        if (error != null) {
          return test.end(error);
        }
        test.ok(decrypted.data.size === 1048826);
        test.ok(decrypted.name === "1MB.tiff");
        test.ok(decrypted.senderID === Alice.miniLockID);
        test.ok(decrypted.recipientID === Alice.miniLockID);
        return test.end();
      });
    });
  });

  tape("decrypt 4MB file for Alice", function(test) {
    return readFromNetwork("4MB.tiff.for.Alice.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.start(function(error, decrypted) {
        if (error != null) {
          return test.end(error);
        }
        test.ok(decrypted.data.size === 4194746);
        test.ok(decrypted.name === "4MB.tiff");
        test.ok(decrypted.senderID === Alice.miniLockID);
        test.ok(decrypted.recipientID === Alice.miniLockID);
        return test.end();
      });
    });
  });

  tape("encrypt 1MB file for Alice", function(test) {
    return readFromNetwork("1MB.tiff", function(blob) {
      var operation;
      operation = new miniLockLib.EncryptOperation({
        data: blob,
        name: "alice.1MB.tiff",
        keys: Alice.keys,
        miniLockIDs: [Alice.miniLockID]
      });
      return operation.start(function(error, encrypted) {
        if (error != null) {
          return test.end(error);
        }
        test.ok(encrypted.data.size === 1049788);
        test.ok(encrypted.name === "alice.1MB.tiff.minilock");
        test.ok(encrypted.senderID === Alice.miniLockID);
        return test.end();
      });
    });
  });

  tape("encrypt 4MB file for Alice", function(test) {
    return readFromNetwork("4MB.tiff", function(blob) {
      var operation;
      operation = new miniLockLib.EncryptOperation({
        data: blob,
        name: "alice.4MB.tiff",
        keys: Alice.keys,
        miniLockIDs: [Alice.miniLockID]
      });
      return operation.start(function(error, encrypted) {
        if (error != null) {
          return test.end(error);
        }
        test.ok(encrypted.data.size === 4195768);
        test.ok(encrypted.name === "alice.4MB.tiff.minilock");
        test.ok(encrypted.senderID === Alice.miniLockID);
        return test.end();
      });
    });
  });

}).call(this);
