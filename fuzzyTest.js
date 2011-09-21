(function() {
  var FuzzyMatch;
  try {
    FuzzyMatch = require("./fuzzyMatch");
  } catch (e) {
    FuzzyMatch = window.FuzzyMatch;
  }
  this.don = new FuzzyMatch("Don Quixote", "Don Juan Castro", "Don Padre", "Don Quijote", "James Bond");
  console.log(this.test = don.rank());
}).call(this);
