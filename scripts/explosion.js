class Particule {

  static get VelocityDecrease() {
    return 8e-1;
  }

  constructor(pos, intensity) {
    /**
     * On génère un angle aléatoire
     * servant pour la direction de la particule
     */
    let angle = Math.random() * Math.PI * 2;
    this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
    this.velocity = this.velocity.mul(intensity);
    this.pos = pos;
    this.life = Math.random() * 20;
  }

  move() {
    this.pos = this.pos.add(this.velocity);
    /**
     * On diminue la vitesse à chaque mouvement
     */
    this.velocity = this.velocity.mul(Particule.VelocityDecrease);
  }

  isAlive() {
    return this.life > 0;
  }
}

class Explosion {

  static get MinPointsNumber() {
    return 50;
  };

  constructor(context, pos, color, intensity) {
    this.pos = pos;
    this.intensity = intensity;
    this.particules = [];

    /**
     * On initialise un certain nombre de particules
     * composants l'explosion
     * On réunit la particule et sa partie graphique
     * sous un même objet union
     */
    for (let i = 0; i < this.intensity * Explosion.MinPointsNumber; i++) {
      let p = new Particule(this.pos, intensity * Math.random());
      let s = new Point(context, p, color);
      let union = {p: p, s: s};
      this.particules.push(union);
    }
  }

  draw() {
    this.particules.forEach((p) => p.s.draw());
  }

  /**
   * 1) supression des particules "mortes"
   * 2) decrémentation de la vie des particules
   * 3) déplacement des particules
   */
  update() {
    this.particules = this.particules.filter((p) => p.p.isAlive());
    this.particules.forEach((p) => p.p.life--);
    this.particules.forEach((p) => p.p.move());
  }

  /**
   * Une explosion est "morte" quand toutes ses
   * particules sont "mortes"
   */
  isAlive() {
    return this.particules.length > 0;
  }
}