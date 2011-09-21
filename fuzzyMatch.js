(function() {
  /*
  
  This is a javascript implementation of the string similarity algorithm found
  [here](http://www.catalysoft.com/articles/StrikeAMatch.html).
  
  Perhaps we can call it the Letter Pairs Algorithm.
  
  License: MIT
  
  Author: Paul Harper <benekastah@gmail.com>
  
  */
  var FuzzyMatch, PairedString, isClonedInstance;
  isClonedInstance = {
    is_cloned_instance: true
  };
  PairedString = (function() {
    function PairedString(str) {
      var c, word, words, _i, _len;
      this.input = str;
      this.pairs = [];
      words = str.toLowerCase().split(/\s+/);
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        word = (function() {
          var _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = word.length; _j < _len2; _j++) {
            c = word[_j];
            _results.push(c);
          }
          return _results;
        })();
        while (word.length > 1) {
          this.pairs.push("" + (word.shift()) + (word[0] || ''));
        }
      }
    }
    PairedString.prototype.intersection = function(pairs) {
      var p, p_indx, pair, ret, _i, _len, _ref;
      ret = [];
      p = pairs.clone();
      _ref = this.pairs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        p_indx = p.contains(pair);
        if (p_indx >= 0) {
          ret.push(pair);
          p.remove(p_indx);
        }
      }
      return ret.length;
    };
    PairedString.prototype.union = function(pairs) {
      return this.pairs.length + pairs.pairs.length;
    };
    PairedString.prototype.contains = function(pair) {
      var i, mine, _len, _ref;
      _ref = this.pairs;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        mine = _ref[i];
        if (mine === pair) {
          return i;
        }
      }
    };
    PairedString.prototype.remove = function(index) {
      var pairs;
      if (this.isClonedInstance !== isClonedInstance) {
        throw new Error("Only cloned sets of pairs can have items removed from their pairs list.");
      }
      pairs = this.pairs.slice(0, index);
      pairs.push.apply(pairs, this.pairs.slice(index + 1));
      return this.pairs = pairs;
    };
    PairedString.prototype.clone = function() {
      var ret;
      ret = new this.constructor(this.input);
      ret.isClonedInstance = isClonedInstance;
      return ret;
    };
    PairedString.prototype.compare = function(pairs) {
      var intersection, union;
      intersection = this.intersection(pairs);
      union = this.union(pairs);
      return ((2 * intersection) / union) * 100;
    };
    PairedString.prototype.isCloned = function() {
      return this.isClonedInstance === isClonedInstance;
    };
    PairedString.prototype.toString = function() {
      return this.input;
    };
    return PairedString;
  })();
  FuzzyMatch = (function() {
    function FuzzyMatch(search, comparisons) {
      var c, item;
      this.search = new PairedString(search);
      if (!(comparisons instanceof Array)) {
        c = [];
        c.push.apply(c, arguments);
        c.shift();
      } else {
        c = comparisons;
      }
      this.comparisons = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = c.length; _i < _len; _i++) {
          item = c[_i];
          _results.push(new PairedString(item));
        }
        return _results;
      })();
    }
    FuzzyMatch.prototype.rank = function() {
      var item, ret, _i, _len, _ref;
      ret = [];
      _ref = this.comparisons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        ret.push({
          score: this.search.compare(item),
          item: item,
          string: item.toString()
        });
      }
      ret.search = this.search;
      return ret.sort(function(a, b) {
        return b.score - a.score;
      });
    };
    return FuzzyMatch;
  })();
  try {
    module.exports = FuzzyMatch;
  } catch (e) {
    window.FuzzyMatch = FuzzyMatch;
  }
}).call(this);
