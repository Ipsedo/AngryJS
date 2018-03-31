class Game
{
    // Passer width et height du canvas + context ou juste canvas ?
  constructor(canvas, entities, onLose = (() => {}))
  {
    this.context   = canvas.getContext("2d");
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.entities = entities;
    this.explosion = [];

    this.onLose   = onLose;

    this.firstFrame = true;
    this.lastTime = Date.now();
    this.isPaused = true;

    this.physics = new Physics();

    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load("./res/level0.json", (e) => {
        that.entities = e;
        that.render();
    });
  }

  start()
  {
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
      this.entities.forEach((e) => { if (!e.isAlive()) {
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
      });
      this.entities = this.entities.filter((e) => e.isAlive());
      this.explosion = this.explosion.filter((e) => e.isAlive());
  }

    /**
     * Fonction d'animation et de collision
     */
  anime(timeDelta) {
      this.physics.compute(this.entities.map(e => e.body), timeDelta);
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
    let g = new Game(c, [], [], () => alert("perdu !"));

    let button = document.getElementById("play_pause");
    button.addEventListener("click", (e) => {

        if (button.innerText === "Play") {
            button.innerText = "Pause";
            if (g.firstFrame) g.start();
            else g.resume();
        } else {
            button.innerText = "Play";
            g.pause();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            button.innerText = "Play";
            g.pause();
        }
    });
});

