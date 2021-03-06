// Generated by CoffeeScript 1.10.0
(function() {
  var Alice, Blob, Bobby, miniLockLib, read, readFromNetwork, ref, ref1, tape;

  ref = require("./test_setup"), tape = ref.tape, miniLockLib = ref.miniLockLib;

  Blob = (typeof window !== "undefined" && window !== null ? window.Blob : void 0) || require("../library.compiled/Blob");

  ref1 = require("./fixtures"), Alice = ref1.Alice, Bobby = ref1.Bobby, read = ref1.read, readFromNetwork = ref1.readFromNetwork;

  tape("DecryptOperation", function(test) {
    return test.end();
  });

  tape("construct a blank miniLockLib.DecryptOperation", function(test) {
    test.ok(new miniLockLib.DecryptOperation);
    return test.end();
  });

  tape("define data, keys and callback when decrypt operation is constructed", function(test) {
    var blob, callback, operation;
    callback = function(error, decrypted) {};
    operation = new miniLockLib.DecryptOperation({
      data: (blob = new Blob),
      keys: Alice.keys,
      callback: callback
    });
    test.same(operation.data, blob);
    test.same(operation.keys, Alice.keys);
    test.same(operation.callback, callback);
    return test.end();
  });

  tape("or define the callback when start is called if you prefer", function(test) {
    var callbackSpecifiedOnStart, operation;
    callbackSpecifiedOnStart = function() {};
    operation = new miniLockLib.DecryptOperation({
      data: new Blob,
      keys: Alice.keys
    });
    operation.run = function() {
      test.same(operation.callback, callbackSpecifiedOnStart);
      return test.end();
    };
    return operation.start(callbackSpecifiedOnStart);
  });

  tape("can’t start a decrypt operation without a callback function", function(test) {
    var operation;
    operation = new miniLockLib.DecryptOperation;
    test.throws(operation.start, "Can’t start decrypt operation without a callback function.");
    return test.end();
  });

  tape("can’t start a decrypt operation without data", function(test) {
    var operation;
    operation = new miniLockLib.DecryptOperation({
      keys: Alice.keys
    });
    return operation.start(function(error, decrypted) {
      test.same(error, "Can’t decrypt without a Blob of data.");
      test.same(decrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start a decrypt operation without keys", function(test) {
    var operation;
    operation = new miniLockLib.DecryptOperation({
      data: new Blob
    });
    return operation.start(function(error, decrypted) {
      test.same(error, "Can’t decrypt without a set of keys.");
      test.same(decrypted, void 0);
      return test.end();
    });
  });

  tape("construct map of byte addresses in a file", function(test) {
    return read("alice.txt.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob
      });
      return operation.constructMap(function(error, map) {
        test.same(map.magicBytes, {
          start: 0,
          end: 8
        });
        test.same(map.sizeOfHeaderBytes, {
          start: 8,
          end: 12
        });
        test.same(map.headerBytes, {
          start: 12,
          end: 646
        });
        test.same(map.ciphertextBytes, {
          start: 646,
          end: 962
        });
        return test.end(error);
      });
    });
  });

  tape("read size of header", function(test) {
    return read("alice.txt.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob
      });
      return operation.readSizeOfHeader(function(error, sizeOfHeader) {
        test.equal(sizeOfHeader, 634);
        return test.end();
      });
    });
  });

  tape("read header of a file with one permit", function(test) {
    return read("alice.txt.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.readHeader(function(error, header) {
        var uniqueNonces;
        if (error) {
          return test.end(error);
        }
        test.ok(header.version === 1);
        test.ok(header.ephemeral.constructor === String);
        test.ok(header.ephemeral.length === 44);
        uniqueNonces = Object.keys(header.decryptInfo);
        test.ok(uniqueNonces.length === 1);
        test.ok(header.decryptInfo[uniqueNonces[0]].length === 508);
        return test.end();
      });
    });
  });

  tape("read header of a file with two permits", function(test) {
    return read("alice_and_bobby.txt.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob
      });
      return operation.readHeader(function(error, header) {
        var uniqueNonces;
        if (error) {
          return test.end(error);
        }
        test.ok(header.version === 1);
        test.ok(header.ephemeral.constructor === String);
        test.ok(header.ephemeral.length === 44);
        uniqueNonces = Object.keys(header.decryptInfo);
        test.ok(uniqueNonces.length === 2);
        test.ok(header.decryptInfo[uniqueNonces[0]].length === 508);
        test.ok(header.decryptInfo[uniqueNonces[1]].length === 508);
        return test.end();
      });
    });
  });

  tape("decrypt uniqueNonce and permit", function(test) {
    return read("alice.txt.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.decryptUniqueNonceAndPermit(function(error, uniqueNonce, permit) {
        if (error != null) {
          return test.end(error);
        }
        test.ok(uniqueNonce);
        test.ok(uniqueNonce.constructor === Uint8Array);
        test.ok(uniqueNonce.length === 24);
        test.ok(permit.senderID === Alice.miniLockID);
        test.ok(permit.recipientID === Alice.miniLockID);
        test.same(permit.fileInfo.fileHash.constructor, Uint8Array);
        test.same(permit.fileInfo.fileHash.length, 32);
        test.same(permit.fileInfo.fileKey.constructor, Uint8Array);
        test.same(permit.fileInfo.fileKey.length, 32);
        test.same(permit.fileInfo.fileNonce.constructor, Uint8Array);
        test.same(permit.fileInfo.fileNonce.length, 16);
        return test.end();
      });
    });
  });

  tape("decrypt version 1 attributes", function(test) {
    return read("alice.txt.v1.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.decryptVersion1Attributes(function(error, attributes) {
        test.same(attributes, {
          name: "alice.txt.v1"
        });
        return test.end(error);
      });
    });
  });

  tape("decrypt version 2 attributes", function(test) {
    return read("alice.txt.v2.minilock", function(blob) {
      var operation;
      operation = new miniLockLib.DecryptOperation({
        data: blob,
        keys: Alice.keys
      });
      return operation.decryptVersion2Attributes(function(error, attributes) {
        test.same(attributes, {
          name: "alice.txt.v2",
          type: "text/plain",
          time: "2014-08-17T07:06:50.095Z"
        });
        return test.end(error);
      });
    });
  });

}).call(this);
