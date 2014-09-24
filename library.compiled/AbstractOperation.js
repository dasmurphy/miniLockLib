// Generated by CoffeeScript 1.8.0
(function() {
  var AbstractOperation;

  AbstractOperation = (function() {
    function AbstractOperation() {}

    module.exports = AbstractOperation;

    AbstractOperation.prototype.chunkSize = 1024 * 1024;

    AbstractOperation.prototype.end = function(error, blob, attributes, header, sizeOfHeader) {
      this.endedAt = Date.now();
      this.duration = this.endedAt - this.startedAt;
      if (error) {
        return this.onerror(error, header, sizeOfHeader);
      } else {
        return this.oncomplete(blob, attributes, header, sizeOfHeader);
      }
    };

    AbstractOperation.prototype.onerror = function(error) {
      return console.info("onerror", error);
    };

    AbstractOperation.prototype.oncomplete = function(blob, attributes, header, sizeOfHeader) {
      return console.info("oncomplete", blob, attributes, header, sizeOfHeader);
    };

    AbstractOperation.prototype.readSliceOfData = function(start, end, callback) {
      if (this.fileReader == null) {
        this.fileReader = new FileReader;
      }
      this.fileReader.readAsArrayBuffer(this.data.slice(start, end));
      this.fileReader.onabort = function(event) {
        console.error("@fileReader.onabort", event);
        return callback("File read abort.");
      };
      this.fileReader.onerror = function(event) {
        console.error("@fileReader.onerror", event);
        return callback("File read error.");
      };
      return this.fileReader.onload = function(event) {
        var sliceOfBytes;
        sliceOfBytes = new Uint8Array(event.target.result);
        return callback(void 0, sliceOfBytes);
      };
    };

    return AbstractOperation;

  })();

}).call(this);
