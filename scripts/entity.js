const damageMult = 1e-1;
const minDamage = .2;

/**
 * Une entité est composée de son sprite (graphisme)
 * et de son body (physique)
 */
class Entity {

  constructor(body, sprite, life, isFriable, isEnnemy) {
    this.body = body;

    /**
     * Si l'entité est friable,
     * il faut pouvoir décrémenter sa vie via le listener de
     * collision de son body
     */
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

  isAlive() { return this.life > 0; }

  hit(force) {
    let dmg = force * damageMult;
    this.life -= dmg >= minDamage ? dmg : 0;
  }
}
