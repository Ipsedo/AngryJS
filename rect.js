class Rect {
    constructor(pos, w, h) {
        this.pos = pos;
        this.width = w;
        this.height = h;
    }

    minkowksiDiff(r) {
        vec = this.pos.sub(r.pos).sub(new Vector(r.width, r.height));
        return new Rect(vec, this.width + r.width, this.height + r.height);
    }

    hasOrigin() {
        return this.pos.x <= 0 && this.pos.y <= 0 && this.pos.x + this.width >= 0 && this.pos.y + this.height >= 0;
    };
}