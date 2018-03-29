class Body
{
  constructor ( mass , pos
              , vel = new Vector(0, 0)
              , isStatic = false
              )
  {
    this.pos    = pos;
    this.vel    = vel;
    this.mass   = mass;
    this.isStatic = isStatic;
  }

  static get elasticity() {return 1.; };
}

class Sphere extends Body
{
  constructor ( mass , pos
              , rad
              , vel = new Vector(0, 0)
              , isStatic = false
              )
  { super(mass, pos, vel, isStatic);
    this.rad = rad; }
}

class Rectangle extends Body
{
  constructor ( mass , pos
              , dim
              , vel = new Vector(0, 0)
              , isStatic = false
              )
  { super(mass, pos, vel, isStatic);
    this.dim = dim; }

  minkowksiDiff(r)
  {
    let vec = this.pos.sub(r.pos).sub(dim);
    return { pos: vec, dim: this.dim.add(r.dim) };
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
    { return {r, s} }

  static collide_rr (ra, rb)
  {
    let s = rb.minkowksiDiff(ra);
  
    { //  Check if origin is inside the Minkowski difference
      let a = s.pos;
      let b = s.pos.add(s.dim);

      if (  a.x < 0
        &&  0 < b.x
        &&  a.y < 0
        &&  0 < b.y )
        return {ra, rb};
    }

    //  Sélection du plan de collision
    let up    = new Vector( 0                    , s.origin.y );
    let down  = new Vector( 0                    , s.height + s.origin.y );
    let left  = new Vector( s.origin.x           , 0 );
    let right = new Vector( s.origin.x + s.width , 0 );
    
    let norm_u = up.norm();
    let norm_d = down.norm();
    let norm_l = left.norm();
    let norm_r = right.norm();
    
    let min_norm = Math.min( norm_u , norm_d , norm_l , norm_r );

    let n;

    switch (min_norm)
    { case norm_u: n = norm_u; break;
      case norm_d: n = norm_d; break;
      case norm_l: n = norm_l; break;
      case norm_r: n = norm_r; break; }

    let nA = ra.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );
    let nB = rb.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );
  
    if (ra.vel.norm() == rb.vel.norm())
    {
      if (ra.mass == Infinity && rb.mass == Infinity) return {ra, rb};
      
      if (ra.mass > rb.mass)
        { nA = 0; nB = 1; }
      else
        { nA = 1; nB = 0; }
    }
  
    n = n.normalize();
  
    let v = ra.vel.sub(rb.vel);
    const e = Body.elasticity();
  
    let j = (− (1. + e) * Vector.dot(v, n)) / ( (1. / ra.mass) + (1. / rb.mass) );

    //  Position update
    ra.pos = ra.pos.add(n.mult(nA));
    rb.pos = rb.pos.add(n.mult(-nB));

    //  Velocity update
    ra.vel = n.mult(j / ra.mass).add(ra.vel);
    rb.vel = rb.vel.sub(n.mult(j / rb.mass));
  }

  static collide(a, b) {
    if(a instanceof Rectangle && b instanceof Rectangle)
      return Physics.collide_rr(a, b);
    
    return;

//    if(a instanceof Sphere && b instanceof Sphere)
//      return Physics.collide_ss(a, b);
//
//    if(a instanceof Rectangle && b instanceof Sphere)
//      return Physics.collide_rs(a, b);
//    
//    if(a instanceof Sphere && b instanceof Rectangle)
//      { let {na, nb} = Physics.collide_rs(a, b); return {nb, na}; }
  }
}