class Game
{
    // Passer width et height du canvas + context ou juste canvas ?
  constructor(canvas, entities, onLose = (() => {}))
  {
    canvas.style.backgroundColor = "#AAAAAA";
    this.context   = canvas.getContext("2d");
    this.windowW = canvas.width;
    this.windowH = canvas.height;

    this.entities = entities;
    this.explosion = [];

    this.onLose   = onLose;

    this.firstFrame = true;
    this.lastTime = Date.now();
  }

  start()
  {
    //  On amorce le jeu en appelant start
      //TODO JSON pour level
      let angle1 = Math.random() * Math.PI * 2;
      let r1 = new Rectangle(1, new Vector(200, 200), Vector.fill(100),
          new Vector(0.5 * Math.cos(angle1), 0.5 * Math.sin(angle1)));
      let s1 = new RectSprite(this.context, r1, [255, 0, 0]);
      this.entities.push(new Entity(r1, s1, 10));

      let angle2 = Math.random() * Math.PI * 2;
      let r2 = new Rectangle(1, new Vector(500, 200), Vector.fill(100),
          new Vector(0.5 * Math.cos(angle2), 0.5 * Math.sin(angle2)));
      let s2 = new RectSprite(this.context, r2, [255, 0, 0]);
      this.entities.push(new Entity(r2, s2, 100));

      let wall_up_body = new Rectangle(Infinity, new Vector(0,-10), new Vector(this.windowW, 20));
      let wall_down_body = new Rectangle(Infinity, new Vector(0, this.windowH - 10), new Vector(this.windowW, 20));
      let wall_left_body = new Rectangle(Infinity, new Vector(-10, 10), new Vector(20, this.windowH - 20));
      let wall_right_body = new Rectangle(Infinity, new Vector(this.windowW - 10, 10), new Vector(20, this.windowH - 10));

      let wall_up_sprite = new RectSprite(this.context, wall_up_body, [0, 0, 0]);
      let wall_down_sprite = new RectSprite(this.context, wall_down_body, [0, 0, 0]);
      let wall_left_sprite = new RectSprite(this.context, wall_left_body, [0, 0, 0]);
      let wall_rigth_sprite = new RectSprite(this.context, wall_right_body, [0, 0, 0]);

      this.entities.push(new Entity(wall_up_body, wall_up_sprite, Infinity));
      this.entities.push(new Entity(wall_down_body, wall_down_sprite, Infinity));
      this.entities.push(new Entity(wall_left_body, wall_left_sprite, Infinity));
      this.entities.push(new Entity(wall_right_body, wall_rigth_sprite, Infinity));

      /*let levelLoader = new LevelLoader(this.context);
      let that = this;
      levelLoader.load("../res/level.json", (e) => {
          that.entities = e;
      });*/

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
      //this.entities.forEach((e) => e.life--);
      this.explosion.forEach((e) => e.update());

      for (let i = 0; i < this.entities.length; i++) {
        for (let j = i + 1; j < this.entities.length; j++) {
            Physics.collide(this.entities[i].body, this.entities[j].body);
        }
      }
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

      this.entities.forEach((e) => e.sprite.draw());
      this.explosion.forEach((e) => e.draw());
  }
}

window.addEventListener("load", () => {
    let c = document.getElementById("main");
    let g = new Game(c, [], [], () => alert("perdu !"));
    g.start();
});