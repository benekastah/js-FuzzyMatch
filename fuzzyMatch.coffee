
# Magic cookie
isClonedInstance = {}

class PairedString
  constructor: (str) ->
    @input = str
    @pairs = []
    words = str.toLowerCase().split /\s+/
    
    for word in words
      word = (c for c in word)
      @pairs.push "#{word.shift()}#{word[0] || ''}" while word.length > 1
  
  intersection: (pairs) ->
    ret = []
    p = pairs.clone()
    
    for pair in @pairs
      p_indx = p.contains pair
      if p_indx >= 0
        ret.push pair
        p.remove p_indx
    ret.length
    
  union: (pairs) ->
    @pairs.length + pairs.pairs.length
  
  contains: (pair) ->
    for mine, i in @pairs
      return i if mine == pair
      
  remove: (index) ->
    if @isClonedInstance != isClonedInstance
      throw new Error "Only cloned sets of pairs can have items removed from their pairs list."
    pairs = @pairs.slice(0, index)
    pairs.push.apply pairs, @pairs.slice(index+1)
    @pairs = pairs
  
  clone: ->
    ret = new @constructor @input
    ret.isClonedInstance = isClonedInstance
    ret
    
  compare: (pairs) ->
    intersection = @intersection pairs
    union = @union pairs
    ((2 * intersection) / union) * 100
  
  isCloned: -> @isClonedInstance == isClonedInstance
  toString: -> @input


class FuzzyMatch
  constructor: (search, comparisons...) ->
    @search = new PairedString search
    @comparisons = (new PairedString item for item in comparisons)
    
  rank: ->
    ret = for item in @comparisons
      score: @search.compare(item)
      item: item
      string: item.toString()
    ret.search = @search
    ret.sort (a, b) -> b.score - a.score


try
  module.exports = FuzzyMatch
catch e
  window.FuzzyMatch = FuzzyMatch