class Entity {
    constructor(body, sprite, life) {
        this.body = body;
        this.sprite = sprite;
        this.life = life;
    }

    isAlive() {
        return this.life > 0;
    }
}