const damageMult = 1e-1;
const minDamage = 1.;

/**
 * Monkey patching sur body pour gestion vie entité (entité mortelle) ?
 *  si body.hasOwnProperty("hit") :
 *    - body.hit(force) { ... }
 *    - redéfinir hit : body.hit = function(force) { decrementer vie entité }
 *
 * Passer entity à Physics.compute ?
 */
class Entity {

  constructor(body, sprite, life, isFriable, isEnnemy) {
    this.body = body;

    if (isFriable) {
      let that = this;
      this.body.onCollide = function (infos) {
        that.hit(infos.impulsion);
      };
    }

    this.sprite = sprite;
    this.life = life;
    this.isEnnemy = isEnnemy;
  }

  isAlive() {
    return this.life > 0;
  }

  hit(force) {
    // Force de collision recupérée comment ?
    let dmg = force * damageMult;
    this.life -= force >= minDamage ? dmg : 0;
  }
}
