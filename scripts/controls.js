class Controls {
  constructor(canvas, onFire, maxVelLaunch) {
    this.canvas = canvas;

    /**
     * Call back pour le tir de missile : function(pos, vel)
     */
    this.onFire = onFire;

    this.maxVelLaunch = maxVelLaunch;

    this.fstPos = Vector.fill(0.);

    let that = this;

    /**
     * On récupère la position intitiale
     * et on passe à vrai la variable indiquant le début du drag and drop
     */
    this.canvas.onmousedown = function (e) {
      that.fstPos.x = e.clientX;
      that.fstPos.y = e.clientY;
    };

    /**
     * Si il y a eu drag and drop,
     * on récupère les vecteur de fin de drag,
     * on calcul le vecteur resultant du début du drag à la fin
     * On normalise ce vecteur avec une norme limite
     */
    this.canvas.onmouseup = function (e) {
      let finalPos = new Vector(e.clientX, e.clientY);
      let launchVec = that.fstPos.sub(finalPos);
      let norm = launchVec.norm();
      norm = norm < that.maxVelLaunch ? norm : that.maxVelLaunch;
      launchVec = launchVec.normalize().mul(norm);
      if (launchVec.norm() > 0)
        that.onFire(that.fstPos, launchVec);

    };
  }
}