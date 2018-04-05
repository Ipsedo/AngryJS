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
   * body_infos = {
     *  mass     : Number,
     *  pos      : [Number, Number],
     *  vel      : [Number, Number],
     *  isStatic : Bool
     * }
   *
   * Distinction rectangle / cercle :
   * misc = {
     *  isRect : Bool,
     *  rad    : null             / Number,
     *  dim    : [Number, Number] / null,
     * }
   *
   * Regroupement des deux :
   * body = {
     *  infos           : body_infos,
     *  additional_info : misc
     * }
   *
   * // Graphisme
   *
   * Soit une image si image != null, soit un cercle ou rectangle (color != null) :
   * sprite = {
     *  img_uri : string / null,
     *  color   : null   / [Number, Number, Number]
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
   * entities = [entity, ..., entity]
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

  static parseBody(bodyJSON) {
    if (!bodyJSON.infos) {
      alert("Unrecognized body !");
      return;
    }
    let infos = bodyJSON.infos;
    //TODO tester si les champs de infos sont bien définis
    let mass = infos.mass === null ? Infinity : infos.mass; // On peut pas mettre Infinity dans JSON :,(
    let pos = new Vector(infos.pos[0], infos.pos[1]);
    let vel = new Vector(infos.vel[0], infos.vel[1]);
    let isStatic = infos.isStatic;

    if (!bodyJSON.additional_info) {
      alert("Unrecognized body !");
      return;
    }

    let misc = bodyJSON.additional_info;

    if (misc.hasOwnProperty("isRect")) {
      //TODO tester si dim et rad sont bien défini
      if (misc.isRect) {
        let dim = new Vector(misc.dim[0], misc.dim[1]);
        return new Rectangle(mass, pos, dim, vel, isStatic);
      } else {
        return new Sphere(mass, pos, misc.rad, vel, isStatic);
      }
    } else {
      alert("Unrecognized body !");
    }

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
    if (body instanceof Rectangle) {
      if (entityJSON.sprite.img_uri !== null) {
        let uri = entityJSON.sprite.img_uri;
        sprite = new ImageRectSprite(this.context, body, uri);
      } else {
        sprite = new RectSprite(this.context, body, entityJSON.sprite.color);
      }
    } else {
      sprite = new CircleSprite(this.context, body, entityJSON.sprite.color);

    }

    if (!entityJSON.hasOwnProperty("attributes")) {
      alert("Unrecognized entity !");
      return;
    }

    let isFriable = entityJSON.attributes.friable;
    let life = entityJSON.attributes.life;

    return new Entity(body, sprite, life, isFriable);
  }

  parseJSON(JSONstr) {
    let entity_arr = JSON.parse(JSONstr);
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