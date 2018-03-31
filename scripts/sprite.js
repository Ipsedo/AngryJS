class Sprite {

    constructor(context) {
        this.context = context;
    }

    setColor(color) {
        this.context.fillStyle = "rgb("
            + color[0] + ","
            + color[1] + ","
            + color[2] + ")";
    }
}

class RectSprite extends Sprite {

    constructor(context, rect, color) {
        super(context);
        this.rect = rect;
        this.color = color;
    }

    draw() {
        super.setColor(this.color);
        this.context.fillRect(this.rect.pos.x, this.rect.pos.y,
            this.rect.dim.x, this.rect.dim.y);
    }
}

class CircleSprite extends Sprite {

    constructor(context, circle, color) {
        super(context);
        this.circle = circle;
        this.color = color;
    }

    draw() {
        super.setColor(this.color);
        this.context.beginPath();
        this.context.arc(this.circle.pos.x, this.circle.pos.y,
            this.circle.rad, 0, Math.PI * 2.0);
        this.context.fill();
    }
}

class ImageRectSprite extends Sprite {

    constructor(context, rect, imageURI) {
        super(context);
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
        super(context);
        this.particule = particule;
        this.color = color;
    }

    draw() {
        super.setColor(this.color);
        this.context.fillRect(this.particule.pos.x, this.particule.pos.y, 1, 1);
    }

}