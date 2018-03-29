class Particule {
    constructor(pos, intensity) {
        let angle = Math.random() * Math.PI * 2;
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
        this.velocity = this.velocity.mul(intensity);
        this.pos = pos;
        this.life = (1 + Math.random()) * 20;
    }

    move() {
        this.pos = this.pos.add(this.velocity);
    }

    isAlive() {
        return this.life > 0;
    }
}

class Explosion {
    static get MinPointsNumber() { return 50; };

    constructor(context, pos, color, intensity) {
        this.pos = pos;
        this.intensity = intensity;
        this.particules = [];
        for (let i = 0; i < this.intensity * Explosion.MinPointsNumber; i++) {
            let p = new Particule(this.pos, intensity * Math.random());
            let s = new Point(context, p, color);
            let union = { p : p, s : s};
            this.particules.push(union);
        }
    }

    draw() {
        this.particules.forEach((p) => p.s.draw());
    }

    update() {
        this.particules = this.particules.filter((p) => p.p.isAlive());
        this.particules.forEach((p) => p.p.life--);
        this.particules.forEach((p) => p.p.move());
    }
}