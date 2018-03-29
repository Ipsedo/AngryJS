class Body
{
  constructor ( mass , pos
              
              , vel = new Vector(0, 0)
              , static = false
              )
  {
    this.pos        = pos;
    this.vel        = vel;
    this.mass       = mass;
    this.static     = static;
  }

  static elasticity = 1.;
}

class Sphere extends Body
{
  constructor ( mass , pos
              
              , rad

              , vel = new Vector(0, 0)
              , static = false
              )
  {
    super(mass, pos, vel, elasticity);
    this.rad = rad;
  }
}

class Rectangle extends Body
{
  constructor ( mass , pos
              
              , dim
              
              , vel = new Vector(0, 0)
              , static = false
              )
  {
    super(mass, pos, vel, elasticity);
    this.dim = dim;
  }

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
  
    { //  Elasticity check

    }

    if (!ra.minkowksiDiff(rb).hasOrigin()) return {ra, rb};
  
    let up    = new Vector( 0                    , s.origin.y );
    let down  = new Vector( 0                    , s.height + s.origin.y );
    let left  = new Vector( s.origin.x           , 0 );
    let right = new Vector( s.origin.x + s.width , 0 );
    
    let n;

    let norm_u = up.norm();
    let norm_d = down.norm();
    let norm_l = left.norm();
    let norm_r = right.norm();
  
    if(norm_u < norm_d && norm_u < norm_l && norm_u < norm_r) n = up;
    else if (norm_d < norm_u && norm_d < norm_r && norm_d < norm_l) n = down;
    else if (norm_l < norm_u && norm_l < norm_d && norm_l < norm_r) n = left;
    else n = right;
  
    let nA = ra.velocity.norm() / ( ra.velocity.norm() + rb.velocity.norm() );
    let nB = rb.velocity.norm() / ( ra.velocity.norm() + rb.velocity.norm() );
  
    if (ra.velocity.norm() == rb.velocity.norm())
    {
      if (ra.mass === Infinity && rb.mass === Infinity)
        return null;
      
      if (ra.mass > rb.mass)
        { nA = 0; nB = 1; }
      else
        { nA = 1; nB = 0; }
    }
  
    //  MODIFY
    //ra = ra.add(n.mult(nA));)
    //  MODIFY
    //rb = rb.add(n.mult(-nB));
  
    n = n.normalize();
  
    let rel_speed = ra.velocity.sub(rb.velocity);
    
    const e = Body.elasticity;
  
    let vC = n.mult(j * ra.invMass).add(ra.velocity);
    let vB = rb.velocity.sub(n.mult(j * rb.invMass));
  
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