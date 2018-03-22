class Game
{
  constructor(canvas, walls, entities, onLose = (() => {}))
  {
    this.canvas   = canvas;
    this.walls    = walls;
    this.entities = entities;
    this.onLose   = onLose;
  }

  start()
  {
    //  On amorce le jeu en appelant start
  }
}