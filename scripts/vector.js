class Vector
{
  /**
   * Constructors
   */

  //  Base constructor
  constructor(x, y) { this.x = x ; this.y = y }

  //  Alternative constructors
  static fill(s) { return new Vector(s, s) }

  /**
   * Base arithmetics
   */

  //  Vector-vector operations
  add(v)    { return new Vector(this.x + v.x , this.y + v.y) }
  sub(v)    { return new Vector(this.x - v.x , this.y - v.y) }
  mul_v(v)  { return new Vector(this.x * v.x , this.y * v.y) }
  div_v(v)  { return new Vector(this.x / v.x , this.y / v.y) }

  //  Vector-scalar operations
  mul_s(s)  { return new Vector(this.x * s , this.y * s) }
  div_s(s)  { return new Vector(this.x / s , this.y / s) }

  //  Vector/Scalar disambiguation
  mul(e)    { return e instanceof Vector ? this.mul_v(e) : this.mul_s(e) }
  div(e)    { return e instanceof Vector ? this.div_v(e) : this.div_s(e) }

  /**
   * Stuff
   */

  apply(v, dt)  { return this.add_v(v.mul_s(dt)) }

  norm()        { return Math.sqrt(this.x * this.x + this.y * this.y) }
  normalize()   { return this.div_s(this.norm()) }

  static dot(u, v)  { return u.x * v.x + u.y * v.y }
}
