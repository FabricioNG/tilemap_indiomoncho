// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Juego extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}

    this.cantidadEstrellas = 0;
    console.log("Prueba !");

    this.timer = 60;
  }

  preload() {
    // load assets
    this.load.tilemapTiledJSON("map", "./public/tilemaps/nivel1.json");
    this.load.tilemapTiledJSON("map2", "./public/tilemaps/nivel2.json");
    this.load.tilemapTiledJSON("map3", "./public/tilemaps/nivel3.json");
    this.load.image("tilesFondo", "./public/assets/images/sky.png");
    this.load.image("tilesPlataforma", "./public/assets/images/platform.png");
    this.load.image("salida", "./public/assets/images/salida.png");
    this.load.image("star", "./public/assets/images/star.png");
    //this.load.image("enemy", "./public/assets/images/enemy.png");
    this.load.image("win", "./public/assets/images/win.png");
    this.load.image("gameover", "./public/assets/images/gameover.png");



    this.load.spritesheet("dude", "./public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
   
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const capaFondo = map.addTilesetImage("sky", "tilesFondo");
    const capaPlataformas = map.addTilesetImage("platform", "tilesPlataforma");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const fondoLayer = map.createLayer("fondo", capaFondo, 0, 0);
    const plataformaLayer = map.createLayer(
      "plataformas",
      capaPlataformas,
      0,
      0
    );
    const objectosLayer = map.getObjectLayer("objetos");

    plataformaLayer.setCollisionByProperty({ colision: true });

    console.log(objectosLayer);

    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint = map.findObject("objetos", (obj) => obj.name === "jugador");
    console.log(spawnPoint);
    // The player and its settings
    this.jugador = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);

    //enemigo
   // const spawnPointEnemy = map.findObject(
     // "objetos",
      //(obj) => obj.name === "enemy"
    //);
    //this.enemy = this.physics.add.sprite(
     // spawnPointEnemy.x,
      //spawnPointEnemy.y,
      //"enemy"
    //);

    // Establecer la propiedad de rebote del enemigo
  //  this.enemy.setBounce(1); // Valor de rebote máximo

    // Agregar colisión entre el enemigo y la capa de plataformas
  //  this.physics.add.collider(this.enemy, plataformaLayer);

    spawnPoint = map.findObject("objetos", (obj) => obj.name === "salida");
    console.log("spawn point salida ", spawnPoint);
    this.salida = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "salida")
      .setScale(0.2);
    this.salida.visible = false;

    this.physics.add.overlap(
      this.jugador,
      this.salida,
      this.avanzarNivel,
      null,
      this
    );

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create empty group of starts
    this.estrellas = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectosLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.estrellas.create(x, y, "star");
          break;
        }
      }
    });

    this.physics.add.collider(this.jugador, plataformaLayer);
    this.physics.add.collider(this.estrellas, plataformaLayer);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      this.recolectarEstrella,
      null,
      this
    );

    this.physics.add.collider(this.salida, plataformaLayer);
    this.physics.add.overlap(
      this.jugador,
      this.salida,
      this.esVencedor,
      () => this.cantidadEstrellas >= 1, // condicion de ejecucion
      this
    );

    // Agregar colisión entre el jugador y el enemigo
   // this.physics.add.collider(
     // this.jugador,
      //this.enemy,
      //this.colisionJugadorEnemigo,
      //null,
      //this
    //);

 // Dentro del método create() de la escena actual (Juego)
 this.physics.add.overlap(
  this.jugador,
  this.salida,
  this.cambiarNivel,
  null,
  this
);

    //time
    this.time.addEvent({
      delay: 1000,
      callback: this.timmer,
      callbackScope: this,
      loop: true,
    });

    //mostrar cantidad estrellas en la pantalla
    this.cantidadEstrellasTexto = this.add.text(
      15,
      15,
      "Estrellas recolectadas 0",
      { frontSize: "15px", fill: "#FFFFFF" }
    );

    //mostrar cantidad estrellas en la pantalla
    this.timeText = this.add.text(650, 15, "Tiempo: " + this.timer, {
      frontSize: "15px",
      fill: "#FFFFFF",
    });
  }

  cambiarNivel() {
    this.scene.start("nivel2"); // Cambia a la nueva escena (Nivel2)
  }

  update() {
    // update game objects
    // check input
    //move left
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-160);
      this.jugador.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(160);
      this.jugador.anims.play("right", true);
    }
    //stop
    else {
      this.jugador.setVelocityX(0);
      this.jugador.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.jugador.body.blocked.down) {
      this.jugador.setVelocityY(-330);
    }
    console.log(this.estrellas.getTotalUsed());
  }

  recolectarEstrella(jugador, estrella) {
    estrella.disableBody(true, true);
    if (this.estrellas.getTotalUsed() == 0) {
      this.salida.visible = true;
    }

    // todo / para hacer: sumar puntaje
    this.cantidadEstrellas++;

    this.cantidadEstrellasTexto.setText(
      "Estrellas recolectadas: " + this.cantidadEstrellas
    );
  }

  // todo / para hacer: controlar si el grupo esta vacio
  // todo / para hacer: ganar el juego

  timmer() {
    this.timer--;
    this.timeText.setText("Tiempo: " + this.timer);
    if (this.timer == 0) {
      this.scene.start("Gameover");
    }
  }
}
