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

  static elasticity = 1.;
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
    return { pos: vec, dim: this.dim.add(r.dim); };
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
  
  static collide_rr(ra, rb)
    { return {ra, rb} }

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
  
    let up    = new Vector( 0                    , s.origin.y );
    let down  = new Vector( 0                    , s.height + s.origin.y );
    let left  = new Vector( s.origin.x           , 0 );
    let right = new Vector( s.origin.x + s.width , 0 );
    
    let n;

    let norm_u = up.norm();
    let norm_d = down.norm();
    let norm_l = left.norm();
    let norm_r = right.norm();
  
    let min_norm = Math.min( norm_u , norm_d , norm_l , norm_r );

    switch (min_norm)
    { case norm_u: n = norm_u; break;
      case norm_d: n = norm_d; break;
      case norm_l: n = norm_l; break;
      case norm_r: n = norm_r; break; }

    let nA = ra.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );
    let nB = rb.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );
  
    if (ra.vel.norm() == rb.vel.norm())
    {
      if (ra.mass == Infinity && rb.mass == Infinity) return null;
      
      if (ra.mass > rb.mass)
        { nA = 0; nB = 1; }
      else
        { nA = 1; nB = 0; }
    }
  
    //  MODIFY
    //ra = ra.add(n.mult(nA)));
    //  MODIFY
    //rb = rb.add(n.mult(-nB));
  
    n = n.normalize();
  
    let rel_speed = ra.vel.sub(rb.vel);
    
    const e = Body.elasticity();
  
    let vC = n.mult(j * ra.invMass).add(ra.vel);
    let vB = rb.vel.sub(n.mult(j * rb.invMass));
  
    return { velocity1 : vC , velocity2: vB };
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