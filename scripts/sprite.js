class Sprite {

    constructor(context, color) {
        this.context = context;
        this.color = color;
    }

    setColor() {
        this.context.fillStyle = "rgb("
            + this.color[0] + ","
            + this.color[1] + ","
            + this.color[2] + ")";
    }
}

class RectSprite extends Sprite {

    constructor(context, rect, color) {
        super(context, color);
        this.rect = rect;
    }

    draw() {
        super.setColor();
        this.context.fillRect(this.rect.pos.x, this.rect.pos.y,
            this.rect.dim.x, this.rect.dim.y);
    }
}

class CircleSprite extends Sprite {

    constructor(context, circle, color) {
        super(context, color);
        this.circle = circle;
    }

    draw() {
        super.setColor();
        this.context.beginPath();
        this.context.arc(this.circle.pos.x, this.circle.pos.y,
            this.circle.rad, 0, Math.PI * 2.0);
        this.context.fill();
    }
}

class ImageRectSprite extends Sprite {

    constructor(context, rect, imageURI, explosionColor) {
        super(context, explosionColor);
        this.rect = rect;
        this.img = new Image();
        this.img.src = imageURI;
    }

    draw() {
        this.context.drawImage(this.img,
            this.rect.pos.x, this.rect.pos.y,
            this.rect.dim.x, this.rect.dim.y);
    }
}

class Point extends Sprite {
    constructor(context, particule, color) {
        super(context, color);
        this.particule = particule;
    }

    draw() {
        super.setColor();
        this.context.fillRect(this.particule.pos.x, this.particule.pos.y, 1, 1);
    }

}

class Line extends Sprite {

    constructor(context, color) {
        super(context, color);
    }

    draw(fstVec, dirVec) {
        super.setColor();
        this.context.beginPath();
        this.context.moveTo(fstVec.x, fstVec.y);
        this.context.lineTo(fstVec.x + dirVec.x, fstVec.y + dirVec.y);
        this.context.stroke();
    }
}