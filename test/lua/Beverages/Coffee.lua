require "../Beverage"

Coffee = {}

function Coffee:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

setmetatable(Coffee, {__index = Beverage})

function Coffee:drink(v)
  print("Delicious Coffee!")
end