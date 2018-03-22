
class Body
{
  constructor(mass, pos)
  {
    this.pos = pos;
  }
}

class Sphere : Body
{
  constructor(mass, pos, rad) 
  {
    super(mass, pos)
    this.rad = rad;
  }
}

class Rectangle : Body
{
  constructor(mass, pos, dim)
  {
    super(mass, pos)
    this.dim = dim;
  }
}


class Physics
{
  collide_sr
  collide_ss

  collide(a, b)
  {

  }
}