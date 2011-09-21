try
  FuzzyMatch = require "./fuzzyMatch"
catch e
  FuzzyMatch = window.FuzzyMatch

@don = new FuzzyMatch "Don Quixote", "Don Juan Castro", "Don Padre", "Don Quijote", "James Bond"
console.log @test = don.rank()