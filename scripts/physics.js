class Body
{
  constructor(mass, pos, friction, static = false)
  {
    this.pos      = pos;
    this.mass     = mass;
    this.friction = friction;
    this.static   = static;
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

  minkowksiDiff(r) {
    let vec = this.pos.sub(r.pos).sub(dim);
    return {vec , new Vector(this.dim.x + r.dim.x, this.dim.y + r.dim.y) };
  }

  hasOrigin() {
    return  this.pos.x <= 0 
        &&  this.pos.y <= 0
        &&  this.pos.x + this.dim.x >= 0
        &&  this.pos.y + this.dim.y >= 0;
  }
}


class Physics
{
  static collide_ss(s1, s2)
  {
    if(s1.pos.sub(s2.pos).norm() > s1.rad + s2.rad)
      return {s1, s2};
    //  TODO
    return {s1, s2};
  }
  
  static collide_rs(r, s)
  {
    return null;  //  TEMP
  }
  
  static collide_rr(r1, r2)
  {
      if (r1.minkowksiDiff(r2).hasOrigin()) return {r1, r2};
      return null;  //  TEMP
  }
  
  static collide(a, b) {
    return null;

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