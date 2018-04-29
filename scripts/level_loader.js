class LevelLoader {

  constructor(context) {
    this.context = context;
  }

  /**
   * Idée structure :
   *
   * // Physique
   *
   * Infos de base pour un body :
   * body = {
   *  mass     : Number,
   *  pos      : [Number, Number],
   *  vel      : [Number, Number],
   *  isStatic : Bool,
   *  dim    : [Number, Number]
   * }
   * si mass null -> Infinity
   *
   * // Graphisme
   *
   * Soit une image si image != null, soit un rectangle sinon :
   * sprite = {
   *  img_uri : string / null,
   *  color   : [Number, Number, Number]
   * }
   *
   * // Entité
   *
   * attributes = {
   *  name : string,
   *  life   : Number,
   *  friable : bool,
   *  isEnnemy : bool
   * }
   *
   * entity = {
   *  body   : body,
   *  sprite : sprite,
   *  attributes : attributes
   * }
   *
   * // Niveau de jeu
   *
   * level = {
   *  ammu = [String, ..., String],
   *  entities = [entity, ..., entity]
   * }
   *
   * ammu représentant les munitions, à savoir "little", "big" et "heavy"
   *
   */

  load(levelFileName, onLoad) {
    let xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let that = this;
    xhr.addEventListener("load", function (ev) {
      if (xhr.status === 404) {
        alert(levelFileName + " not found !");
        return;
      }
      let level = that.parseJSON(xhr.responseText);
      onLoad(level);
    });
    xhr.open("GET", levelFileName);
    xhr.send();
  }

  static parseBody(body) {
    if (!body.hasOwnProperty("mass")
      || !body.hasOwnProperty("pos")
      || !body.hasOwnProperty("vel")
      || !body.hasOwnProperty("dim")
      || !body.hasOwnProperty("isStatic")) {
      console.log(body);
      alert("Unrecognized body !");
      return;
    }

    let mass = body.mass === null ? Infinity : body.mass; // On peut pas mettre Infinity dans JSON :,(
    let pos = new Vector(body.pos[0], body.pos[1]);
    let vel = new Vector(body.vel[0], body.vel[1]);
    let dim = new Vector(body.dim[0], body.dim[1]);
    let isStatic = body.isStatic;

    return new Rectangle(mass, pos, dim, vel, isStatic);
  }

  parseEntity(entityJSON) {
    /**
     * On check qu'une entité issue du
     * JSON est bien composée
     */
    if (!entityJSON.body
        || !entityJSON.hasOwnProperty("sprite")
        || !entityJSON.sprite.hasOwnProperty("img_uri")
        || !entityJSON.sprite.hasOwnProperty("color")
        || !entityJSON.hasOwnProperty("attributes")
        || !entityJSON.attributes.hasOwnProperty("friable")
        || !entityJSON.attributes.hasOwnProperty("life")
        || !entityJSON.attributes.hasOwnProperty("isEnnemy")) {
      alert("Unrecognized entity !");
      return;
    }
    let body = LevelLoader.parseBody(entityJSON.body);
    let sprite;
    /**
     * Si img_uri === null -> le sprite est un rectangle,
     * une image sinon
     */
    if (entityJSON.sprite.img_uri !== null) {
      let uri = entityJSON.sprite.img_uri;
      sprite = new ImageRectSprite(this.context, body, uri, entityJSON.sprite.color);
    } else {
      sprite = new RectSprite(this.context, body, entityJSON.sprite.color);
    }

    let isFriable = entityJSON.attributes.friable;
    let life = entityJSON.attributes.life;
    let isEnnemy = entityJSON.attributes.isEnnemy;

    return new Entity(body, sprite, life, isFriable, isEnnemy);
  }

  parseJSON(JSONstr) {
    let json = JSON.parse(JSONstr);

    if (!json.hasOwnProperty("entities")
        || !json.hasOwnProperty("ammu")) {
      alert("Unrecognized level !");
      return;
    }

    let entity_arr = json.entities;
    let ammu = json.ammu;
    /**
     * On vérifie que les noms de muntitions sont
     * biens les bons
     */
    if (ammu.filter(a => a !== "little" && a !== "big" && a !== "heavy").length !== 0) {
      alert("Invalid ammunation(s) !");
      return;
    }

    if (!(entity_arr instanceof Array)) {
      alert("Unrecognized JSON !");
      return;
    }

    let entities = [];
    entity_arr.forEach((e) => {
      let new_e = this.parseEntity(e);
      entities.push(new_e);
    });

    return {
      entities : entities,
      ammu : ammu
    };
  }
}
