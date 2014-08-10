// Generated by CoffeeScript 1.7.1
(function() {
  var Base58, i;

  Base58 = module.exports = {};

  Base58.ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  Base58.ALPHABET_MAP = {};

  i = 0;

  while (i < Base58.ALPHABET.length) {
    Base58.ALPHABET_MAP[Base58.ALPHABET.charAt(i)] = i;
    i++;
  }

  Base58.BASE = 58;

  Base58.encode = function(buffer) {
    var carry, digits, j;
    if (buffer.length === 0) {
      return "";
    }
    i = void 0;
    j = void 0;
    digits = [0];
    i = 0;
    while (i < buffer.length) {
      j = 0;
      while (j < digits.length) {
        digits[j] <<= 8;
        j++;
      }
      digits[0] += buffer[i];
      carry = 0;
      j = 0;
      while (j < digits.length) {
        digits[j] += carry;
        carry = (digits[j] / Base58.BASE) | 0;
        digits[j] %= Base58.BASE;
        ++j;
      }
      while (carry) {
        digits.push(carry % Base58.BASE);
        carry = (carry / Base58.BASE) | 0;
      }
      i++;
    }
    i = 0;
    while (i < buffer.length - 1 && buffer[i] === 0) {
      digits.push(0);
      i++;
    }
    return digits.reverse().map(function(digit) {
      return Base58.ALPHABET[digit];
    }).join("");
  };

  Base58.decode = function(string) {
    var bytes, carry, input, j;
    if (string.length === 0) {
      return new Uint8Array(0);
    }
    input = string.split("").map(function(c) {
      if (Base58.ALPHABET.indexOf(c) === -1) {
        throw "Non-base58 character";
      }
      return Base58.ALPHABET_MAP[c];
    });
    i = void 0;
    j = void 0;
    bytes = [0];
    i = 0;
    while (i < input.length) {
      j = 0;
      while (j < bytes.length) {
        bytes[j] *= Base58.BASE;
        j++;
      }
      bytes[0] += input[i];
      carry = 0;
      j = 0;
      while (j < bytes.length) {
        bytes[j] += carry;
        carry = bytes[j] >> 8;
        bytes[j] &= 0xff;
        ++j;
      }
      while (carry) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
      i++;
    }
    i = 0;
    while (i < input.length - 1 && input[i] === 0) {
      bytes.push(0);
      i++;
    }
    return new Uint8Array(bytes.reverse());
  };

}).call(this);