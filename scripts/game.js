const dt = 1.;
const nbLevel = 3;

class Game {

  static get NbIterPerFrame () { return Math.trunc(1000. / 60.); }

  // Passer width et height du canvas + context ou juste canvas ?
  constructor(context, canvas, onWin = (() => {}), onLose = (() => {})) {
    this.context = context;
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.entities = [];
    this.explosion = [];

    this.onWin = onWin;
    this.onLose = onLose;

    this.firstFrame = true;
    this.isPaused = true;

    this.controls = new Controls(canvas, context, this.controlsCallBack.bind(this));
  }

  /**
   * loading du level
   */
  loadLevel(levelPath) {
    this.levelPath = levelPath;
    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load(this.levelPath, (e) => {
      that.entities = e;
      that.render();
    });
  }

  win() {
    this.context.font = "25vh Arial";
    this.context.fillStyle = "rgb(255, 0, 0)";
    this.context.fillText("Game Done !", this.windowW / 8, this.windowH / 2);
  }

  controlsCallBack(fst, vec) {
    if (!this.isPaused) {
      let rect = new Rectangle(3, fst, Vector.fill(50), vec, false);
      let sprite = new ImageRectSprite(this.context,rect, "./res/bird_1.png", [0, 255, 0]);
      let ball = new Entity(rect, sprite, 10, true);
      this.entities.push(ball);
    }
  }

  reloadLevel() {
    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load(this.levelPath, (e) => {
      that.entities = e;
      requestAnimationFrame(that.render.bind(that));
    });
  }

  start() {
    //  On amorce le jeu en appelant start
    this.isPaused = false;
    this.firstFrame = false;
    requestAnimationFrame(this.update.bind(this));
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Supprime les entités mortes
   */
  removeDeadEntity() {
    let that = this;
    this.entities = this.entities.filter((e) => {
      if (!e.isAlive()) {
        let middle = e.body.pos.add(e.body.dim.div(2));
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
  anime() {
    for (let i = 0; i < Game.NbIterPerFrame; i++) {
      Physics.compute(this.entities.map(e => e.body), dt);
    }
    this.explosion.forEach((e) => e.update());
  }

  /**
   * 1) Supprimer les entités mortes
   * 2) Animer le jeu
   * 3) Dessiner le jeu
   * 4) Verifier si on a gagné
   */
  update() {
    if (!this.isPaused) {
      this.removeDeadEntity();
      this.anime();
      this.render();

      if (this.entities.filter(e => e.isEnnemy).length === 0) {
        setTimeout(() => {
          this.win();
          this.onWin();
          this.isPaused = true;
        }, 500);
      }

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
    this.controls.draw();
  }
}

window.addEventListener("load", () => {
  let c = document.getElementById("main");
  let ctx = c.getContext("2d");

  let start_button = document.getElementById("play_pause");

  let g = new Game(ctx, c,
    () => start_button.innerText = "Play",
    () => alert("perdu !"));
  g.loadLevel("./res/level0.json");

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

  /**
   * Récupération de l'element input pour choisir son level
   */
  let levelChooser = document.getElementById("level_chooser");
  levelChooser.addEventListener("input", (e) => {
    g.pause();
    start_button.innerText = "Play";
    let id = (levelChooser.value - 1);
    if (id >= 0 && id < nbLevel)
      g.loadLevel("./res/level" + id + ".json"); // -1 car indice json commence par 0
  })
});

