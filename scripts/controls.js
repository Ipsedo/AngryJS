class Controls {

  static get LaunchCoeff () { return 1e-2; }
  static get MaxLaunchNorm () { return 2; }

  constructor(canvas, context, onFire) {
    this.canvas = canvas;

    this.sprite = new Line(context, [255, 255, 255]);

    /**
     * Call back pour le tir de missile : function(pos, vel)
     */
    this.onFire = onFire;

    this.startingDrag = false;

    this.canvas.addEventListener("mouseout", () => this.startingDrag = false);

    this.fstPos = Vector.fill(0.);
    this.launchVec = Vector.fill(0.);

    /**
     * Mouse callBack
     */
    this.canvas.onmousedown = this.draggingStart.bind(this);
    this.canvas.onmouseup = this.draggingEnd.bind(this);
    this.canvas.onmousemove = this.dragging.bind(this);

    /**
     * Touch callBack
     */
    this.canvas.addEventListener("touchstart", this.draggingStart.bind(this), false);
    this.canvas.addEventListener("touchend", this.draggingEnd.bind(this), false);
    this.canvas.addEventListener("touchmove", this.dragging.bind(this), false);
  }

  static getPointerPos(e) {
    let x = 0.;
    let y = 0.;
    if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove') {
      // mouseup mousedown mousemove events
      x = e.clientX;
      y = e.clientY;
    } else if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend') {
      // touch
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    }
    return { x : x, y : y };
  }

  dragging(e) {
    // Dernière position du pointeur
    let pos = Controls.getPointerPos(e);

    let finalPos = new Vector(this.canvas.width * pos.x / this.canvas.clientWidth,
      this.canvas.height * pos.y / this.canvas.clientHeight);


    // Vecteur de la dernière position à la première
    let launchVec = this.fstPos.sub(finalPos);

    // On multiplie la norme de ce vecteur par un coeff pour attenuer
    let norm = launchVec.norm() * Controls.LaunchCoeff;

    // On limite cette norme
    norm = norm < Controls.MaxLaunchNorm ? norm : Controls.MaxLaunchNorm;

    // Le vecteur de tir final est normalisé puis multiplié par la norme calculée avant
    launchVec = launchVec.normalize().mul(norm);

    // Assignation vecteur pour le dessin du control
    this.launchVec = launchVec;
  }

  /**
   * On récupère la position intitiale
   * et on passe à vrai la variable indiquant le début du drag and drop
   */
  draggingStart(e) {
    this.startingDrag = true;

    let pos = Controls.getPointerPos(e);

    this.fstPos.x = this.canvas.width * pos.x / this.canvas.clientWidth;
    this.fstPos.y = this.canvas.height * pos.y / this.canvas.clientHeight;
    this.launchVec = Vector.fill(0.)
  }

  draggingEnd(e) {
    if (this.launchVec.norm() > 0) {
      this.onFire(this.fstPos, this.launchVec);
    }
    this.startingDrag = false;
  }

  draw() {
    if(this.startingDrag) {
      this.sprite.draw(this.fstPos, this.launchVec.div(Controls.LaunchCoeff));
    }
  }
}