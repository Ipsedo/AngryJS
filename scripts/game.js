class Game {
  // Passer width et height du canvas + context ou juste canvas ?
  constructor(context, canvas, levelPath, onLose = (() => {})) {
    this.context = context;
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.entities = [];
    this.explosion = [];

    this.onLose = onLose;

    this.firstFrame = true;
    this.lastTime = Date.now();
    this.isPaused = true;

    this.levelPath = levelPath;

    /**
     * loading du level
     */
    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load(this.levelPath, (e) => {
      that.entities = e;
      that.render();
    });

    /**
     * definition du callback pour tirer le missile
     */
    let controlsCallBack = function (fst, vec) {
      if (!that.isPaused) {
        let rect = new Rectangle(3, fst, Vector.fill(50), vec, false);
        let sprite = new RectSprite(context, rect, [0, 0, 255]);
        let ball = new Entity(rect, sprite, 10);
        that.entities.push(ball);
      }
    };

    /**
     * Pas besoin de le garder en tant qu'attribut
     */
    new Controls(canvas, controlsCallBack, 2);
  }

  reloadLevel() {
    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load(this.levelPath, (e) => {
      that.entities = e;
      that.render();
    });
  }

  start() {
    //  On amorce le jeu en appelant start
    this.isPaused = false;
    this.firstFrame = false;
    this.lastTime = Date.now();
    requestAnimationFrame(this.update.bind(this));
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.lastTime = Date.now();
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Supprime les entités mortes
   */
  removeDeadEntity() {
    let that = this;
    this.entities = this.entities.filter((e) => {
      if (!e.isAlive()) {
        let middle;
        if (e.body instanceof Sphere) {
          middle = e.body.pos;
        } else if (e.body instanceof Rectangle) {
          middle = e.body.pos.add(e.body.dim.div(2));
        } else {
          alert("Unrecognized Body !");
        }
        // TODO intensité explosion selon masse et taille
        let ex = new Explosion(that.context, middle, e.sprite.color, 20);
        that.explosion.push(ex);
      }
      return e.isAlive();
    });
    this.explosion = this.explosion.filter((e) => e.isAlive());
  }

  /**
   * Fonction d'animation et de collision
   */
  anime(timeDelta) {
    Physics.compute(this.entities.map(e => e.body), timeDelta);
    this.explosion.forEach((e) => e.update());
  }

  /**
   * 1) Supprimer les entités mortes
   * 2) Animer le jeu
   * 3) Dessiner le jeu
   */
  update() {
    if (!this.isPaused) {
      this.removeDeadEntity();
      this.anime(Date.now() - this.lastTime);
      this.render();
      this.lastTime = Date.now();
      requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   * Fonction  de rendu
   */
  render() {
    this.context.clearRect(0, 0, this.windowW, this.windowH);

    this.entities.forEach((e) => e.sprite.draw());
    this.explosion.forEach((e) => e.draw());
  }
}

window.addEventListener("load", () => {
  let c = document.getElementById("main");
  let ctx = c.getContext("2d");
  let g = new Game(ctx, c,
    "./res/level0.json", () => alert("perdu !"));

  let start_button = document.getElementById("play_pause");
  start_button.addEventListener("click", (e) => {

    if (start_button.innerText === "Play") {
      start_button.innerText = "Pause";
      if (g.firstFrame) g.start();
      else g.resume();
    } else {
      start_button.innerText = "Play";
      g.pause();
    }
  });

  let reset_button = document.getElementById("reset");
  reset_button.addEventListener("click", (e) => {
    g.pause();
    start_button.innerText = "Play";
    g.reloadLevel();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      start_button.innerText = "Play";
      g.pause();
    }
  });
});

