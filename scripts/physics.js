class Body
{
  constructor(mass, pos, friction)
  {
    this.pos      = pos;
    this.mass     = mass;
    this.friction = friction;
  }
}

class Sphere extends Body
{
  constructor(mass, pos, friction, rad)
  {
    super(mass, pos, friction);
    this.rad = rad;
  }
}

class Rectangle extends Body
{
  constructor(mass, pos, friction, dim)
  {
    super(mass, pos, friction);
    this.dim = dim;
  }
}


class Physics
{
  static collide_ss(s1, s2)
  {
    if(s1.pos.sub(s2.pos).norm() > s1.rad + s2.rad)
      return {s1, s2};
    //  TODO
  }
  
  static collide_rs(r, s)
  {

  }
  
  static collide_rr(r1, r2)
  {

  }
  
  static collide(a, b) {
    if(a instanceof Sphere && b instanceof Sphere)
      return this.collide_ss(a, b);
    
    if(a instanceof Rectangle && b instanceof Rectangle)
      return this.collide_rr(a, b);
    
    if(a instanceof Rectangle && b instanceof Sphere)
      return this.collide_rs(a, b);
    
    if(a instanceof Sphere && b instanceof Rectangle)
      { {na, nb} = this.collide_rs(a, b); return {nb, na}; }
  }
}