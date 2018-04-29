/**
 * Base d'un sprite :
 * - le context 2d
 * - une couleur
 */
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

/**
 * Rectangle
 */
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

/**
 * Image rectangulaire
 */
class ImageRectSprite extends Sprite {

  constructor(context, rect, imageURI, explosionColor) {
    super(context, explosionColor);
    this.rect = rect;
    this.img = new Image();
    this.img.src = imageURI;
    this.img.onload = () => this.draw();
  }

  draw() {
    this.context.drawImage(this.img,
      this.rect.pos.x, this.rect.pos.y,
      this.rect.dim.x, this.rect.dim.y);
  }
}

/**
 * Sprite composé de plusieurs frames
 */
class FramesRectSprite extends Sprite {

  constructor(context, rect, imageURIs, explosionColor) {
    super(context, explosionColor);
    this.rect = rect;

    /**
     * On crée un tableau de promesses
     * servant pour charger toutes les images
     */
    let proms = imageURIs.map(uri =>
      new Promise(function (resolve) {
        let img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.src = uri;
      })
    );

    /**
     * Une fois toutes les promsesses finies,
     * On affecte les images resultantes à notre objet
     * et le rendu peut commencer
     */
    let that = this;
    Promise.all(proms).then(function (fulfilled) {
      that.sprites = fulfilled;
      that.nbFrame = fulfilled.length;
      that.isReady = true;
    });

    this.cpt = 0;
    this.maxFPS = 60;
  }

  draw() {
    if (this.isReady) {
      /**
       * On récupère l'indice de la frame
       */
      let currImg = Math.trunc(this.nbFrame * this.cpt / this.maxFPS);
      this.context.drawImage(this.sprites[currImg],
        this.rect.pos.x, this.rect.pos.y,
        this.rect.dim.x, this.rect.dim.y);
      this.cpt = ++this.cpt % this.maxFPS;
    }
  }

  static Bird(context, rect, index) {
    let path = "./res/bird_" + index + "/frame-";
    let URIs = [];
    for (let i = 1; i <= 8; i++) {
      URIs.push(path + i + ".png");
    }
    return new FramesRectSprite(context, rect, URIs, [0, 0, 225]);

  }

  static Bird_1(context, rect) {
    return FramesRectSprite.Bird(context, rect, 1);
  }

  static Bird_2(context, rect) {
    return FramesRectSprite.Bird(context, rect, 2);
  }

  static Bird_3(context, rect) {
    return FramesRectSprite.Bird(context, rect, 3);
  }
}

/**
 * Point
 */
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

/**
 * Ligne
 */
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