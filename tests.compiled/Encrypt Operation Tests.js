// Generated by CoffeeScript 1.10.0
(function() {
  var Alice, Blob, Bobby, miniLockLib, read, readFromNetwork, ref, ref1, tape;

  ref = require("./test_setup"), tape = ref.tape, miniLockLib = ref.miniLockLib;

  Blob = (typeof window !== "undefined" && window !== null ? window.Blob : void 0) || require("../library.compiled/Blob");

  ref1 = require("./fixtures"), Alice = ref1.Alice, Bobby = ref1.Bobby, read = ref1.read, readFromNetwork = ref1.readFromNetwork;

  tape("EncryptOperation", function(test) {
    return test.end();
  });

  tape("construct a blank encrypt operation", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation);
    return test.end();
  });

  tape("make miniLock version 1 files by default", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.same(operation.version, 1);
    return test.end();
  });

  tape("define version, data, name, type, time, miniLockIDs, keys and callback when you construct an encrypt operation", function(test) {
    var callback, data, miniLockIDs, operation, time;
    operation = new miniLockLib.EncryptOperation({
      version: 2,
      data: data = new Blob,
      name: "secret.minilock",
      type: "text/plain",
      time: time = Date.now(),
      miniLockIDs: miniLockIDs = [],
      keys: Alice.keys,
      callback: callback = function(error, encrypted) {}
    });
    test.same(operation.version, 2);
    test.same(operation.data, data);
    test.same(operation.name, "secret.minilock");
    test.same(operation.type, "text/plain");
    test.same(operation.time, time);
    test.same(operation.keys, Alice.keys);
    test.same(operation.miniLockIDs, miniLockIDs);
    test.same(operation.callback, callback);
    return test.end();
  });

  tape("can’t start encrypt operation without callback function", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.throws(operation.start, 'Can’t start encrypt operation without callback function.');
    return test.end();
  });

  tape("can’t start encrypt operation without data", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys,
      miniLockIDs: []
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt without a Blob of data.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation with data that is not a Blob", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      data: "Not a blob",
      keys: Alice.keys,
      miniLockIDs: []
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt without a Blob of data.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation without a set of keys", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      data: new Blob,
      miniLockIDs: []
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt without a set of keys.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation without miniLock IDs", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      data: new Blob,
      keys: Alice.keys
    });
    return operation.start(function(error, encrypted) {
      test.same(error, 'Can’t encrypt without an Array of miniLock IDs.');
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation with unacceptable file name", function(test) {
    var i, operation;
    operation = new miniLockLib.EncryptOperation({
      data: new Blob,
      keys: Alice.keys,
      miniLockIDs: [],
      name: ((function() {
        var j, results;
        results = [];
        for (i = j = 0; j < 257; i = ++j) {
          results.push("X");
        }
        return results;
      })()).join("")
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt because file name is too long. 256-characters max please.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation with unacceptable media type", function(test) {
    var i, operation;
    operation = new miniLockLib.EncryptOperation({
      data: new Blob,
      keys: Alice.keys,
      miniLockIDs: [],
      type: ((function() {
        var j, results;
        results = [];
        for (i = j = 0; j < 129; i = ++j) {
          results.push("X");
        }
        return results;
      })()).join("")
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt because media type is too long. 128-characters max please.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("can’t start encrypt operation with unacceptable file format version", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      data: new Blob,
      keys: Alice.keys,
      miniLockIDs: [],
      version: 0
    });
    return operation.start(function(error, encrypted) {
      test.same(error, "Can’t encrypt because version 0 is not supported. Version 1 or 2 please.");
      test.same(encrypted, void 0);
      return test.end();
    });
  });

  tape("empty array of ciphertext bytes is ready after operation is constructed", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation.ciphertextBytes.length === 0);
    return test.end();
  });

  tape("ephemeral key pair is ready after operation is constructed", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation.ephemeral.publicKey != null);
    test.ok(operation.ephemeral.secretKey != null);
    return test.end();
  });

  tape("file key is ready after operation is constructed", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation.fileKey.constructor === Uint8Array);
    test.ok(operation.fileKey.length === 32);
    return test.end();
  });

  tape("file nonce is ready after operation is constructed", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation.fileNonce.constructor === Uint8Array);
    test.ok(operation.fileNonce.length === 16);
    return test.end();
  });

  tape("hash for ciphertext bytes is ready after operation is constructed", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation;
    test.ok(operation.hash.digestLength === 32);
    test.ok(operation.hash.isFinished === false);
    test.ok(operation.hash.update != null);
    test.ok(operation.hash.digest != null);
    return test.end();
  });

  tape("name has a fixed size of 256 bytes", function(test) {
    var decodedName, operation;
    operation = new miniLockLib.EncryptOperation({
      name: "untitled.txt"
    });
    decodedName = operation.fixedSizeDecodedName();
    test.equal(decodedName.length, 256);
    return test.end();
  });

  tape("undefined name has a fixed size of 256 bytes", function(test) {
    var byte, decodedName, filteredBytes, operation;
    operation = new miniLockLib.EncryptOperation({
      name: void 0
    });
    decodedName = operation.fixedSizeDecodedName();
    test.equal(decodedName.length, 256);
    filteredBytes = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = decodedName.length; j < len; j++) {
        byte = decodedName[j];
        if (byte !== 0) {
          results.push(byte);
        }
      }
      return results;
    })();
    test.same(filteredBytes.length, 0);
    return test.end();
  });

  tape("decoded type has a fixed size of 128 bytes", function(test) {
    var decodedType, operation;
    operation = new miniLockLib.EncryptOperation({
      type: "text/plain"
    });
    decodedType = operation.fixedSizeDecodedType();
    test.equal(decodedType.length, 128);
    return test.end();
  });

  tape("decoded time has a fixed size of 24 bytes", function(test) {
    var decodedTime, operation;
    operation = new miniLockLib.EncryptOperation({
      time: Date.now()
    });
    decodedTime = operation.fixedSizeDecodedTime();
    test.equal(decodedTime.length, 24);
    return test.end();
  });

  tape("encrypt version 1 attributes", function(test) {
    var byte, decryptedBytes, decryptedName, decryptor, filteredBytes, operation;
    operation = new miniLockLib.EncryptOperation({
      version: 1,
      name: "untitled.txt"
    });
    operation.encryptAttributes(1);
    test.same(operation.ciphertextBytes.length, 1);
    decryptor = miniLockLib.NaCl.stream.createDecryptor(operation.fileKey, operation.fileNonce, operation.chunkSize + 4 + 16);
    decryptedBytes = decryptor.decryptChunk(operation.ciphertextBytes[0], false);
    test.equal(decryptedBytes.length, 256);
    filteredBytes = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = decryptedBytes.length; j < len; j++) {
        byte = decryptedBytes[j];
        if (byte !== 0) {
          results.push(byte);
        }
      }
      return results;
    })();
    decryptedName = miniLockLib.NaCl.util.encodeUTF8(filteredBytes);
    test.equal(decryptedName, "untitled.txt");
    return test.end();
  });

  tape("encrypt version 2 attributes", function(test) {
    var byte, decryptedBytes, decryptedName, decryptedNameBytes, decryptedTime, decryptedTimeBytes, decryptedType, decryptedTypeBytes, decryptor, filteredNameBytes, filteredTimeBytes, filteredTypeBytes, operation;
    operation = new miniLockLib.EncryptOperation({
      version: 2,
      name: "untitled.txt",
      type: "text/plain",
      time: (new Date("2014-08-17T07:06:50.095Z")).getTime()
    });
    operation.encryptAttributes(2);
    test.same(operation.ciphertextBytes.length, 1);
    decryptor = miniLockLib.NaCl.stream.createDecryptor(operation.fileKey, operation.fileNonce, operation.chunkSize + 4 + 16);
    decryptedBytes = decryptor.decryptChunk(operation.ciphertextBytes[0], false);
    test.equal(decryptedBytes.length, 256 + 128 + 24);
    decryptedNameBytes = decryptedBytes.subarray(0, 256);
    filteredNameBytes = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = decryptedNameBytes.length; j < len; j++) {
        byte = decryptedNameBytes[j];
        if (byte !== 0) {
          results.push(byte);
        }
      }
      return results;
    })();
    decryptedName = miniLockLib.NaCl.util.encodeUTF8(filteredNameBytes);
    test.equal(decryptedName, "untitled.txt");
    decryptedTypeBytes = decryptedBytes.subarray(256, 256 + 128);
    filteredTypeBytes = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = decryptedTypeBytes.length; j < len; j++) {
        byte = decryptedTypeBytes[j];
        if (byte !== 0) {
          results.push(byte);
        }
      }
      return results;
    })();
    decryptedType = miniLockLib.NaCl.util.encodeUTF8(filteredTypeBytes);
    test.equal(decryptedType, "text/plain");
    decryptedTimeBytes = decryptedBytes.subarray(256 + 128, 256 + 128 + 24);
    filteredTimeBytes = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = decryptedTimeBytes.length; j < len; j++) {
        byte = decryptedTimeBytes[j];
        if (byte !== 0) {
          results.push(byte);
        }
      }
      return results;
    })();
    decryptedTime = miniLockLib.NaCl.util.encodeUTF8(filteredTimeBytes);
    test.equal(decryptedTime, "2014-08-17T07:06:50.095Z");
    return test.end();
  });

  tape("construct a permit to decrypt for a recipient", function(test) {
    var operation, permit, ref2, uniqueNonce;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys
    });
    ref2 = operation.permit(Bobby.miniLockID), uniqueNonce = ref2[0], permit = ref2[1];
    test.ok(uniqueNonce.constructor === Uint8Array);
    test.ok(uniqueNonce.length === 24);
    test.ok(permit.senderID === Alice.miniLockID);
    test.ok(permit.recipientID === Bobby.miniLockID);
    test.ok(permit.fileInfo.constructor === String);
    test.ok(permit.fileInfo !== "");
    return test.end();
  });

  tape("recipient can decrypt the key, nonce and hash of the file encoded in their permit", function(test) {
    var decodedFileInfo, decryptedFileInfo, fileInfo, operation, permit, ref2, uniqueNonce;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys
    });
    ref2 = operation.permit(Bobby.miniLockID), uniqueNonce = ref2[0], permit = ref2[1];
    decodedFileInfo = miniLockLib.NaCl.util.decodeBase64(permit.fileInfo);
    decryptedFileInfo = miniLockLib.NaCl.box.open(decodedFileInfo, uniqueNonce, Alice.publicKey, Bobby.secretKey);
    test.ok(decryptedFileInfo);
    fileInfo = JSON.parse(miniLockLib.NaCl.util.encodeUTF8(decryptedFileInfo));
    test.ok(fileInfo.fileKey != null);
    test.ok(fileInfo.fileNonce != null);
    test.ok(fileInfo.fileHash === "aSF6MHmQgJThESHQQjVKfB9VtkgsoaUeGyUN/R7Q7vk=");
    return test.end();
  });

  tape("header specifies version 1 of the miniLock file format", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys,
      miniLockIDs: [Alice.miniLockID]
    });
    operation.constructHeader();
    test.ok(operation.header.version === 1);
    return test.end();
  });

  tape("header has a Base64 encoded 32-byte ephemeral key", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys,
      miniLockIDs: [Alice.miniLockID]
    });
    operation.constructHeader();
    test.ok(miniLockLib.NaCl.util.decodeBase64(operation.header.ephemeral).length === 32);
    return test.end();
  });

  tape("header for one recipient has one permit", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys,
      miniLockIDs: [Alice.miniLockID]
    });
    operation.constructHeader();
    test.ok(Object.keys(operation.header.decryptInfo).length === 1);
    return test.end();
  });

  tape("header for two recipients has two permits", function(test) {
    var operation;
    operation = new miniLockLib.EncryptOperation({
      keys: Alice.keys,
      miniLockIDs: [Alice.miniLockID, Bobby.miniLockID]
    });
    operation.constructHeader();
    test.ok(Object.keys(operation.header.decryptInfo).length === 2);
    return test.end();
  });

}).call(this);
