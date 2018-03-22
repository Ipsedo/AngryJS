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

      let r = new Rectangle(1, Vector.fill(0), 1, Vector.fill(100));
      let s = new RectSprite(this.context, r, [255,0,0]);
      this.entities.push({ obj : r, sprite : s });

      requestAnimationFrame(this.render.bind(this));
  }

    /**
     * Fonction  de rendu
     */
  render() {
      this.context.clearRect(0, 0, this.windowW, this.windowH);

      this.walls.forEach((w) => w.draw());
      this.entities.forEach((e) => {
        e.obj.pos.x += 0.1; // Test -> à virer (faire <<'"multi-threading"'>> pour partie physic)
        e.sprite.draw();
      });

      requestAnimationFrame(this.render.bind(this));
  }
}