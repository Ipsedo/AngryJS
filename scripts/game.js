class Game
{
    // Passer width et height du canvas + context ou juste canvas ?
  constructor(canvas, walls, entities, onLose = (() => {}))
  {
    canvas.style.backgroundColor = "#AAAAAA";
    this.context   = canvas.getContext("2d");
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.walls    = walls;
    this.entities = entities;
    this.explosion = [];

    this.onLose   = onLose;

    this.firstFrame = true;
    this.lastTime = Date.now();
  }

  start()
  {
    //  On amorce le jeu en appelant start

      let r1 = new Rectangle(1, Vector.fill(0), Vector.fill(100));
      let s1 = new RectSprite(this.context, r1, [255, 0, 0]);
      this.entities.push(new Entity(r1, s1, 10));

      let r2 = new Rectangle(1, Vector.fill(100), Vector.fill(100), new Vector(0.1, 0.0));
      let s2 = new RectSprite(this.context, r2, [255, 0, 0]);
      this.entities.push(new Entity(r2, s2, 100));

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
      // TODO mouvements selon le delta de temps depuis le dernier appel
      this.entities.forEach((e) => {
          e.body.pos = e.body.pos.add(e.body.vel.mul(timeDelta));
      });
      this.entities.forEach((e) => e.life--);
      this.explosion.forEach((e) => e.update());
      //TODO collision
  }

    /**
     * 1) Supprimer les entités mortes
     * 2) Animer le jeu
     * 3) Dessiner le jeu
     */
  update() {
      if (this.firstFrame) {
          this.lastTime = Date.now();
          this.firstFrame = false;
      }

      this.removeDeadEntity();
      this.anime(Date.now() - this.lastTime);
      this.render();

      this.lastTime = Date.now();

      requestAnimationFrame(this.update.bind(this));
  }

    /**
     * Fonction  de rendu
     */
  render() {
      this.context.clearRect(0, 0, this.windowW, this.windowH);

      this.walls.forEach((w) => w.draw());
      this.entities.forEach((e) => e.sprite.draw());
      this.explosion.forEach((e) => e.draw());
  }
}

window.addEventListener("load", () => {
    let c = document.getElementById("main");
    let g = new Game(c, [], [], () => alert("perdu !"));
    g.start();
});