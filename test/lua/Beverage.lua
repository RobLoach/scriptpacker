Beverage = {}

function Beverage:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

function Beverage:drink ()
  print("Delicious")
end