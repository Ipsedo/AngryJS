class LevelLoader {

  constructor(context) {
    this.context = context;
  }

  /**
   * Idée syntaxe :
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
   * Soit une image si image != null, un rectangle sinon :
   * sprite = {
   *  img_uri : string / null,
   *  color   : [Number, Number, Number]
   * }
   *
   * // Entité
   *
   * attributes = {
   *  life   : Number,
   *  friable : bool
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
   *  entities = [entity, ..., entity]
   * }
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
      let entities = that.parseJSON(xhr.responseText);
      onLoad(entities);
    });
    xhr.open("GET", levelFileName);
    xhr.send();
  }

  static parseBody(body) {

    //TODO tester si les champs de infos sont bien définis
    let mass = body.mass === null ? Infinity : body.mass; // On peut pas mettre Infinity dans JSON :,(
    let pos = new Vector(body.pos[0], body.pos[1]);
    let vel = new Vector(body.vel[0], body.vel[1]);
    let dim = new Vector(body.dim[0], body.dim[1]);
    let isStatic = body.isStatic;

    return new Rectangle(mass, pos, dim, vel, isStatic);
  }

  parseEntity(entityJSON) {
    if (!entityJSON.hasOwnProperty("body")) {
      alert("Unrecognized entity !");
      return;
    }
    let body = LevelLoader.parseBody(entityJSON.body);

    if (!entityJSON.hasOwnProperty("sprite")) {
      alert("Unrecognized entity !");
      return;
    }
    let sprite;
    //TODO tester si color et image sont bien definis
    if (entityJSON.sprite.img_uri !== null) {
      let uri = entityJSON.sprite.img_uri;
      sprite = new ImageRectSprite(this.context, body, uri, entityJSON.sprite.color);
    } else {
      sprite = new RectSprite(this.context, body, entityJSON.sprite.color);
    }

    if (!entityJSON.hasOwnProperty("attributes")) {
      alert("Unrecognized entity !");
      return;
    }

    let isFriable = entityJSON.attributes.friable;
    let life = entityJSON.attributes.life;

    let isEnnemy = entityJSON.attributes.isEnnemy;

    return new Entity(body, sprite, life, isFriable, isEnnemy);
  }

  parseJSON(JSONstr) {
    let json = JSON.parse(JSONstr);
    let entity_arr = json.entities;
    if (!(entity_arr instanceof Array)) {
      alert("Unrecognized JSON !");
      return;
    }

    let entities = [];
    entity_arr.forEach((e) => {
      let new_e = this.parseEntity(e);
      entities.push(new_e);
    });
    return entities;
  }
}