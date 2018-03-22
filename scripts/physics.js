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

  minkowksiDiff(otherRect) {
    let vec = this.pos.sub(otherRect.pos).sub(new Vector(otherRect.dim.x, otherRect.dim.y));
    return new Rectangle(0.0, vec, 0.0, new Vector(this.dim.x + otherRect.dim.x, this.dim.y + otherRect.dim.y));
  }

  hasOrigin() {
    return this.pos.x <= 0 && this.pos.y <= 0 && this.pos.x + this.dim.x >= 0 && this.pos.y + this.dim.y >= 0;
  }
}


class Physics
{
  static collide_ss(s1, s2)
  {
    if(s1.pos.sub(s2.pos).norm() > s1.rad + s2.rad)
      return {s1, s2};
    return null; // Renvoie undefined sinon
  }
  
  static collide_rs(r, s)
  {

  }
  
  static collide_rr(r1, r2)
  {
      if (r1.minkowksiDiff(r2).hasOrigin())
        return {r1, r2};
      return null;
  }
  
  static collide(a, b)    {
    if(a instanceof Sphere && b instanceof Sphere)
      return this.collide_ss(a, b);
    if(a instanceof Rectangle && b instanceof Rectangle)
      return this.collide_rr(a, b);
    if(a instanceof Sphere && b instanceof Rectangle)
      //return this.collide_rs(a, b); TODO
    if(a instanceof Rectangle && b instanceof Sphere)
      return this.collide_rs(a, b);
  }
}