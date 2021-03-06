const dt = 1.;
const nbLevel = 6;

class Game {

  static get NbIterPerFrame () { return Math.trunc(1000. / 60.); }

  constructor(context, canvas, onWin = (() => {}), onLose = (() => {})) {
    this.context = context;
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.entities = [];
    this.explosion = [];

    /**
     * Listener pour le début et fin de partie
     * //TODO quel(s) critère(s) pour perdre une partie
     */
    this.onWin = onWin;
    this.onLose = onLose;

    this.firstFrame = true;
    this.isPaused = true;

    /**
     * On initialise un Map qui servira pour
     * dessiner les munitions restantes à titre indicatif
     */
    this.ammuImg = new Map();
    /**
     * On ajoute les images pour dessiner
     * les munitions une fois  celles-ci chargées
     */
    let tmpImg1 = new Image();
    tmpImg1.onload = () => {
      this.ammuImg.set("little", tmpImg1);
      this.drawAmmu();
    };
    tmpImg1.src = "./res/bird_1/frame-1.png";

    let tmpImg2 = new Image();
    tmpImg2.onload = () => {
      this.ammuImg.set("big", tmpImg2);
      this.drawAmmu();
    };
    tmpImg2.src = "./res/bird_2/frame-1.png";

    let tmpImg3 = new Image();
    tmpImg3.onload = () => {
      this.ammuImg.set("heavy", tmpImg3);
      this.drawAmmu();
    };
    tmpImg3.src = "./res/bird_3/frame-1.png";

    /**
     * On crée un objet controle auquel on passe
     * le listener de tir
     */
    this.controls = new Controls(canvas,
      context, this.controlsListener.bind(this));
  }

  /**
   * loading du level
   * Un level = une liste d'entité et de munitions disponibles
   */
  loadLevel(levelPath) {
    this.levelPath = levelPath;
    let levelLoader = new LevelLoader(this.context);
    let that = this;
    levelLoader.load(this.levelPath, (e) => {
      that.entities = e.entities;
      that.ammu = e.ammu;
      that.render();
    });
  }

  win() {
    this.context.font = "25vh Arial";
    this.context.fillStyle = "rgb(255, 0, 0)";
    this.context.fillText("Game Done !", this.windowW / 8, this.windowH / 2);
  }

  /**
   *
   * @param fst position du début du drag an drop
   * @param vec vecteur de tir
   */
  controlsListener(fst, vec) {
    /**
     * Tir possible uniquement s'il reste des munitions
     * et que le jeu n'est pas en pause
     */
    if (!this.isPaused && this.ammu.length > 0) {
      /**
       * On récupère la munition courrante
       */
      let launchType = this.ammu.shift();

      /**
       * Trois type de munitions :
       * - petite
       * - grande
       * - lourde
       */
      let mass, dim, life, sprite;
      switch (launchType) {
        case "little": mass = 3; dim = Vector.fill(50); life = 1;
          sprite = FramesRectSprite.Bird_1;
          break;
        case "big":
          mass = 4; dim = Vector.fill(150); life = 2;
          sprite = FramesRectSprite.Bird_2;
          break;
        case "heavy":
          mass = 15; dim = Vector.fill(100); life = 7;
          sprite = FramesRectSprite.Bird_3;
          break;
      }
      let rect = new Rectangle(mass, fst, dim, vec, false);
      sprite = sprite(this.context, rect);
      let ball = new Entity(rect, sprite, life, true, false);
      this.entities.push(ball);
    }
  }

  reloadLevel() {
    this.loadLevel(this.levelPath);
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
        /**
         * Le centre de l'explosion correspond au centre
         * du body de l'entité correspondante
         */
        let middle = e.body.pos.add(e.body.dim.div(2));
        let intensity = 20;
        let ex = new Explosion(that.context, middle, e.sprite.color, intensity);
        that.explosion.push(ex);
      }
      return e.isAlive();
    });
    this.explosion = this.explosion.filter((e) => e.isAlive());
  }

  /**
   * Fonction d'animation et de collision
   * On effectue plusieurs petites itérations
   * du mouvement pour plus de précision
   */
  anime() {
    for (let i = 0; i < Game.NbIterPerFrame; i++) {
      Physics.compute(this.entities.map(e => e.body), dt);
    }
    this.explosion.forEach((e) => e.update());
  }

  /**
   * On gagne si il n'y a plus d'ennemis
   * On met un petit délai pour but de finir les
   * dernières animations
   */
  checkVictory() {
    if (this.entities.filter(e => e.isEnnemy).length === 0) {
      setTimeout(() => {
        this.win();
        this.onWin();
        this.isPaused = true;
      }, 500);
    }
  }

  checkLose() {
    // TODO verifier lorsqu'on a perdu
  }

  /**
   * 1) Supprimer les entités mortes
   * 2) Animer le jeu
   * 3) Dessiner le jeu
   * 4) Verifier si on a perdu ou gagné
   */
  update() {
    if (!this.isPaused) {
      this.removeDeadEntity();
      this.anime();
      this.render();
      this.checkLose();
      this.checkVictory();

      requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   * Afficher les munitions restantes
   */
  drawAmmu() {
    let offset = 20;
    this.ammu.forEach((a) => {
      this.context.fillStyle = "rgb(100, 100, 100)";
      this.context.fillRect(offset, 20, 50, 50);
      /**
       * On test si l'image associée à "a" a bien été chargée
       */
      if (this.ammuImg.get(a))
        this.context.drawImage(this.ammuImg.get(a), offset + 2, 20 + 2, 46, 46);
      offset += 50;
    });
  }

  /**
   * Fonction  de rendu
   */
  render() {
    this.context.clearRect(0, 0, this.windowW, this.windowH);

    this.entities.forEach((e) => e.sprite.draw());
    this.explosion.forEach((e) => e.draw());
    this.controls.draw();
    this.drawAmmu();
  }
}

window.addEventListener("load", () => {
  let c = document.getElementById("main");
  let ctx = c.getContext("2d");

  let start_button = document.getElementById("play_pause");

  let g = new Game(ctx, c,
    () => start_button.innerText = "Play",
    () => alert("perdu !"));
  g.loadLevel("./res/levels/level0.json");

  /**
   * Définition de l'action play ou pause du niveau
   */
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

  /**
   * Definition de l'action reset du niveau
   */
  let reset_button = document.getElementById("reset");
  reset_button.addEventListener("click", (e) => {
    g.pause();
    start_button.innerText = "Play";
    g.reloadLevel();
  });

  /**
   * Lorsque l'onglet ou la page deviennent cachés
   */
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
    if (id >= 0 && id < nbLevel && Number.isInteger(id))
      g.loadLevel("./res/levels/level" + id + ".json"); // -1 car indice json commence par 0
  })
});

