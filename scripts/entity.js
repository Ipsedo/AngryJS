class Entity {

    constructor(body, sprite, life) {
        this.body = body;
        this.sprite = sprite;
        this.life = life;
    }

    isAlive() {
        return this.life > 0;
    }

    hit(force) {
        // Force en g ?
        // TODO sprite particulier lors de l'appel de cette fonction
        let coef = 1;
        this.life -= force * coef;
    }
}