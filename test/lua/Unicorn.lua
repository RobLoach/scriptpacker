Unicorn = {}

function Unicorn:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  print("Unicorn!")
  return o
end

function Unicorn:isThirsty()
	print("Drink up!")
end
