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

    this.onLose   = onLose;
  }

  start()
  {
    //  On amorce le jeu en appelant start

      let r1 = new Rectangle(1, Vector.fill(0), 1, Vector.fill(100));
      let s1 = new RectSprite(this.context, r, [255,0,0]);
      this.entities.push(new Entity(r1, s1, 10));

      requestAnimationFrame(this.update.bind(this));
  }

    /**
     * Supprime les entités mortes
     */
  removeDeadEntity() {
      this.entities.filter((e) => e.isAlive());
  }

    /**
     * Fonction d'animation et de collision
     */
  anime() {
      this.entities.forEach((e) => e.body.pos.x += 1);
      //TODO collision
  }

    /**
     * 1) Supprimer les entités mortes
     * 2) Animer le jeu
     * 3) Dessiner le jeu
     */
  update() {
      this.removeDeadEntity();
      this.anime();
      this.render();
      requestAnimationFrame(this.update.bind(this));
  }

    /**
     * Fonction  de rendu
     */
  render() {
      this.context.clearRect(0, 0, this.windowW, this.windowH);

      this.walls.forEach((w) => w.draw());
      this.entities.forEach((e) => e.sprite.draw());
  }
}

window.addEventListener("load", () => {
    let c = document.getElementById("main");
    let g = new Game(c, [], [], () => alert("perdu !"));
    g.start();
});