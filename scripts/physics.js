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

  minkowskiDiff(r)
  {
    let vec = this.pos.sub(r.pos).sub(r.dim);
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
    let s = rb.minkowskiDiff(ra);

     //  On vérifie si l'origine est dans la diff de Minkowski
    let a = s.pos;
    let b = s.pos.add(s.dim);

    let hasOrigin = a.x < 0 && 0 < b.x
        && a.y < 0 && 0 < b.y;
    if (!hasOrigin)
      return;

    //  Définition du plan de collision
    let up    = new Vector( 0                 , s.pos.y );
    let down  = new Vector( 0                 , s.dim.y + s.pos.y );
    let left  = new Vector( s.pos.x           , 0 );
    let right = new Vector( s.pos.x + s.dim.x , 0 );

    let norm_u = up.norm();
    let norm_d = down.norm();
    let norm_l = left.norm();
    let norm_r = right.norm();

    //  Sélection du plan de collision
    let min_norm = Math.min( norm_u , norm_d , norm_l , norm_r );

    let n;

    switch (min_norm)
    { case norm_u: n = up; break;
      case norm_d: n = down; break;
      case norm_l: n = left; break;
      case norm_r: n = right; break; }

    //  Calcul du rapport masse / somme des masses des objets, pour chaque objet
    let nA = ra.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );
    let nB = rb.vel.norm() / ( ra.vel.norm() + rb.vel.norm() );

    if (ra.vel.norm() === rb.vel.norm())
    {
      //  Masses infinies : on fait rien
      if (ra.mass === Infinity && rb.mass === Infinity) return;

      //  La plus grande masse éjecte l'autre
      if (ra.mass > rb.mass)
        { nA = 0; nB = 1; }
      else
        { nA = 1; nB = 0; }
    }

    //  n est la normale du plan de collision
    n = n.normalize();

    //  v est la vitesse de b par rapport à a
    let v = ra.vel.sub(rb.vel);
    const e = Body.elasticity;

    //  Calcul de l'impulsion
    let j = -(1. + e) * Vector.dot(v, n) / ((1. / ra.mass) + (1. / rb.mass));

    //  MàJ de la position
    ra.pos = ra.pos.add(n.mul(nA));
    rb.pos = rb.pos.add(n.mul(-nB));

    //  MàJ de la vitesse
    ra.vel = n.mul(j / ra.mass).add(ra.vel);
    rb.vel = rb.vel.sub(n.mul(j / rb.mass));
  }

  /**
   *  Gère les collisions entre deux bodies quelconques
   */
  static collide(a, b)
  {
    if(a instanceof Rectangle && b instanceof Rectangle)
      Physics.collide_rr(a, b);

    if(a instanceof Sphere && b instanceof Sphere)
      Physics.collide_ss(a, b);

    if(a instanceof Rectangle && b instanceof Sphere)
      Physics.collide_rs(a, b);

    if(a instanceof Sphere && b instanceof Rectangle)
      Physics.collide_rs(b, a);
  }
}