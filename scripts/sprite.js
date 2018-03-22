class Sprite {
    constructor(context) {
        this.context = context;
    }

    setColor(color) {
        this.context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    }

    /**
     *
     * @param color rgb array
     * @param rect Rect instance
     */
    fillRect(color, rect) {
        if (!rect instanceof Rectangle)
            alert("Not a Rectangle instance !");
        this.setColor(color);
        this.context.fillRect(rect.pos.x, rect.pos.y, rect.dim.x, rect.dim.y);
    }

    fillCircle(color, circle) {
        this.setColor(color);
        this.context.beginPath();
        this.context.arc(circle.pos.x, circle.pos.y, circle.rad, 0, Math.PI * 2.0);
        this.context.fill();
    }


}