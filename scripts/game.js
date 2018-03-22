class Game
{
  constructor(context, walls, entities, onLose = (() => {}))
  {
    this.context   = context;
    this.walls    = walls;
    this.entities = entities;
    this.onLose   = onLose;
  }

  start()
  {
    //  On amorce le jeu en appelant start
  }
}