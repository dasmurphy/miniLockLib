// Generated by CoffeeScript 1.8.0
(function() {
  var AbstractOperation, BLAKE2s, EncryptOperation, NaCl, numberToByteArray,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  AbstractOperation = require("./AbstractOperation");

  NaCl = require("./NaCl");

  BLAKE2s = require("./BLAKE2s");

  numberToByteArray = require("./util").numberToByteArray;

  EncryptOperation = (function(_super) {
    __extends(EncryptOperation, _super);

    module.exports = EncryptOperation;

    function EncryptOperation(params) {
      if (params == null) {
        params = {};
      }
      this.end = __bind(this.end, this);
      this.start = __bind(this.start, this);
      this.data = params.data, this.keys = params.keys, this.name = params.name, this.type = params.type, this.time = params.time, this.miniLockIDs = params.miniLockIDs, this.version = params.version, this.callback = params.callback;
      if (this.version === void 0) {
        this.version = 1;
      }
      this.ephemeral = NaCl.box.keyPair();
      this.fileKey = NaCl.randomBytes(32);
      this.fileNonce = NaCl.randomBytes(24).subarray(0, 16);
      this.hash = new BLAKE2s(32);
      this.ciphertextBytes = [];
      if (params.start != null) {
        this.start();
      }
    }

    EncryptOperation.prototype.start = function(callback) {
      var _ref, _ref1;
      if (callback != null) {
        this.callback = callback;
      }
      if ((((_ref = this.keys) != null ? _ref.publicKey : void 0) === void 0) || (((_ref1 = this.keys) != null ? _ref1.secretKey : void 0) === void 0)) {
        throw "Can’t start miniLockLib." + this.constructor.name + " without keys.";
      }
      if (this.miniLockIDs === void 0) {
        throw "Can’t start miniLockLib." + this.constructor.name + " without miniLockIDs.";
      }
      if ((this.data instanceof Blob) === false) {
        throw "Can’t start miniLockLib." + this.constructor.name + " without data.";
      }
      if (typeof this.callback !== "function") {
        throw "Can’t start miniLockLib." + this.constructor.name + " without a callback.";
      }
      this.startedAt = Date.now();
      if (this.time === void 0) {
        this.time = this.startedAt;
      }
      return this.run();
    };

    EncryptOperation.prototype.run = function() {
      this.encryptAttributes(this.version);
      return this.encryptData(0, (function(_this) {
        return function(error, dataWasEncrypted) {
          var fileFormat;
          if (dataWasEncrypted != null) {
            _this.constructHeader();
            fileFormat = ["miniLock", _this.sizeOfHeaderIn4Bytes, _this.headerJSONBytes].concat(__slice.call(_this.ciphertextBytes));
            return _this.end(error, new Blob(fileFormat, {
              type: "application/minilock"
            }));
          } else {
            return _this.end(error);
          }
        };
      })(this));
    };

    EncryptOperation.prototype.end = function(error, blob) {
      if (this.streamEncryptor != null) {
        this.streamEncryptor.clean();
      }
      return AbstractOperation.prototype.end.call(this, error, blob);
    };

    EncryptOperation.prototype.oncomplete = function(blob) {
      return this.callback(void 0, {
        data: blob,
        name: this.name + ".minilock",
        type: this.type,
        time: this.time,
        senderID: miniLockLib.ID.encode(this.keys.publicKey),
        duration: this.duration,
        startedAt: this.startedAt,
        endedAt: this.endedAt
      });
    };

    EncryptOperation.prototype.onerror = function(error) {
      return this.callback(error);
    };

    EncryptOperation.prototype.encryptAttributes = function(version) {
      var bytes, encryptedBytes;
      this.constructStreamEncryptor();
      bytes = (function() {
        switch (version) {
          case 1:
            return new Uint8Array(256);
          case 2:
            return new Uint8Array(256 + 128 + 24);
          default:
            throw "EncryptOperation does not support version " + version + ". Version 1 or 2 please.";
        }
      })();
      bytes.set(this.fixedSizeDecodedName(), 0);
      if (version === 2) {
        bytes.set(this.fixedSizeDecodedType(), 256);
      }
      if (version === 2) {
        bytes.set(this.fixedSizeDecodedTime(), 256 + 128);
      }
      if (encryptedBytes = this.streamEncryptor.encryptChunk(bytes, false)) {
        this.hash.update(encryptedBytes);
        return this.ciphertextBytes.push(encryptedBytes);
      } else {
        throw "EncryptOperation failed to record file attributes.";
      }
    };

    EncryptOperation.prototype.encryptData = function(position, callback) {
      this.constructStreamEncryptor();
      return this.readSliceOfData(position, position + this.chunkSize, (function(_this) {
        return function(error, sliceOfBytes) {
          var encryptedBytes, isLastSlice;
          if (error) {
            return callback(error);
          }
          isLastSlice = position + sliceOfBytes.length === _this.data.size;
          if (encryptedBytes = _this.streamEncryptor.encryptChunk(sliceOfBytes, isLastSlice)) {
            _this.hash.update(encryptedBytes);
            _this.ciphertextBytes.push(encryptedBytes);
            if (isLastSlice) {
              _this.hash.digest();
              return callback(void 0, _this.hash.isFinished);
            } else {
              return _this.encryptData(position + _this.chunkSize, callback);
            }
          } else {
            return callback("EncryptOperation failed to encrypt file data.");
          }
        };
      })(this));
    };

    EncryptOperation.prototype.constructHeader = function() {
      var headerJSON;
      this.header = {
        version: this.version,
        ephemeral: NaCl.util.encodeBase64(this.ephemeral.publicKey),
        decryptInfo: this.encodedEncryptedPermits()
      };
      headerJSON = JSON.stringify(this.header);
      this.sizeOfHeaderIn4Bytes = numberToByteArray(headerJSON.length);
      this.headerJSONBytes = NaCl.util.decodeUTF8(headerJSON);
      return this.header;
    };

    EncryptOperation.prototype.constructStreamEncryptor = function() {
      return this.streamEncryptor != null ? this.streamEncryptor : this.streamEncryptor = NaCl.stream.createEncryptor(this.fileKey, this.fileNonce, this.chunkSize);
    };

    EncryptOperation.prototype.fixedSizeDecodedName = function() {
      var decodedName, fixedSize;
      fixedSize = new Uint8Array(256);
      if (this.name) {
        decodedName = NaCl.util.decodeUTF8(this.name);
        if (decodedName.length > fixedSize.length) {
          throw "EncryptOperation file name is too long. 256-characters max please.";
        }
        fixedSize.set(decodedName);
      }
      return fixedSize;
    };

    EncryptOperation.prototype.fixedSizeDecodedType = function() {
      var decodedType, fixedSize;
      fixedSize = new Uint8Array(128);
      if (this.type) {
        decodedType = NaCl.util.decodeUTF8(this.type);
        if (decodedType.length > fixedSize.length) {
          throw "EncryptOperation media type is too long. 128-characters max please.";
        }
        fixedSize.set(decodedType);
      }
      return fixedSize;
    };

    EncryptOperation.prototype.fixedSizeDecodedTime = function() {
      var fixedSize, timestamp;
      fixedSize = new Uint8Array(24);
      if (this.time) {
        timestamp = (new Date(this.time)).toJSON();
        fixedSize.set(NaCl.util.decodeUTF8(timestamp));
      }
      return fixedSize;
    };

    EncryptOperation.prototype.encodedEncryptedPermits = function() {
      var encodedEncryptedPermit, encodedUniqueNonce, encryptedPermit, miniLockID, permits, uniqueNonce, _i, _len, _ref, _ref1;
      permits = {};
      _ref = this.miniLockIDs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        miniLockID = _ref[_i];
        _ref1 = this.encryptedPermit(miniLockID), uniqueNonce = _ref1[0], encryptedPermit = _ref1[1];
        encodedUniqueNonce = NaCl.util.encodeBase64(uniqueNonce);
        encodedEncryptedPermit = NaCl.util.encodeBase64(encryptedPermit);
        permits[encodedUniqueNonce] = encodedEncryptedPermit;
      }
      return permits;
    };

    EncryptOperation.prototype.encryptedPermit = function(miniLockID) {
      var decodedPermitJSON, encryptedPermit, permit, recipientPublicKey, uniqueNonce, _ref;
      _ref = this.permit(miniLockID), uniqueNonce = _ref[0], permit = _ref[1];
      decodedPermitJSON = NaCl.util.decodeUTF8(JSON.stringify(permit));
      recipientPublicKey = miniLockLib.ID.decode(miniLockID);
      encryptedPermit = NaCl.box(decodedPermitJSON, uniqueNonce, recipientPublicKey, this.ephemeral.secretKey);
      return [uniqueNonce, encryptedPermit];
    };

    EncryptOperation.prototype.permit = function(miniLockID) {
      var uniqueNonce;
      uniqueNonce = NaCl.randomBytes(24);
      return [
        uniqueNonce, {
          senderID: miniLockLib.ID.encode(this.keys.publicKey),
          recipientID: miniLockID,
          fileInfo: NaCl.util.encodeBase64(this.encryptedFileInfo(miniLockID, uniqueNonce))
        }
      ];
    };

    EncryptOperation.prototype.encryptedFileInfo = function(miniLockID, uniqueNonce) {
      var decodedFileInfoJSON, recipientPublicKey;
      decodedFileInfoJSON = NaCl.util.decodeUTF8(JSON.stringify(this.permitFileInfo()));
      recipientPublicKey = miniLockLib.ID.decode(miniLockID);
      return NaCl.box(decodedFileInfoJSON, uniqueNonce, recipientPublicKey, this.keys.secretKey);
    };

    EncryptOperation.prototype.permitFileInfo = function() {
      return {
        fileKey: NaCl.util.encodeBase64(this.fileKey),
        fileNonce: NaCl.util.encodeBase64(this.fileNonce),
        fileHash: NaCl.util.encodeBase64(this.hash.digest())
      };
    };

    return EncryptOperation;

  })(AbstractOperation);

}).call(this);
