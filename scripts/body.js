class Body extends Rect {
    constructor(pos, w, h, mass, elasticity) {
        super(pos, w, h);
        this.force = Vector.fill(0);
        this.velocity = Vector.fill(0);
        this.mass = mass;
        this.invMass = 1.0 / this.mass;
        this.elasticy = elasticity;
    }

    isCollide(b) {
        let s = b.minkowksiDiff(this);
        if (!s.hasOrigin())
            return null;

        let up = new Vector(0, s.pos.y);
        let down = new Vector(0, s.height + s.origin.y);
        let left = new Vector(s.origin.x, 0);
        let right = new Vector(s.origin.x + s.width, 0);

        let n;
        let norm_u = up.norm();
        let norm_d = down.norm();
        let norm_l = left.norm();
        let norm_r = right.norm();

        if(norm_u < norm_d && norm_u < norm_l && norm_u < norm_r) {
            n = up;
        } else if (norm_d < norm_u && norm_d < norm_r && norm_d < norm_l) {
            n = down;
        } else if (norm_l < norm_u && norm_l < norm_d && norm_l < norm_r) {
            n = left;
        } else {
            n = right;
        }

        let nC = this.velocity.norm() / (this.velocity.norm() + b.velocity.norm());
        let nB = b.velocity.norm() / (this.velocity.norm() + b.velocity.norm());

        if (this.velocity.norm() === b.velocity.norm()) {
            if (this.mass === Infinity && b.mass === Infinity) {
                return null;
            }
            if (this.mass > b.mass) {
                nC = 0;
                nB = 1;
            } else {
                nC = 1;
                nB = 0;
            }
        }

        this.move(n.mul_s(nC));
        b.move(n.mul_s(-nB));

        n = n.normalize();

        let rel_speed = this.velocity.sub(b.velocity);

        let j = (-Vector.dot(rel_speed, n) * (1 + this.elasticy)) / (this.invMass + b.invMass);

        let vC = n.mul_s(j * this.invMass).add(this.velocity);
        let vB = b.velocity.sub(n.mul_s(j * b.invMass));

        return { velocity1 : vC , velocity2: vB };
    }
}