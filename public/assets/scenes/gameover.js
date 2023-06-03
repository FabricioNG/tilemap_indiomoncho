export default class Win extends Phaser.Scene {
    constructor() {
      super("Gameover"); // Nombre de la escena, debe coincidir con el proporcionado en la configuración
    }
  
    create() {
      // Agregar la imagen de victoria
      this.add.image(400, 300, "gameover");
  
      // Agregar eventos o acciones que ocurran en la escena de victoria
      // Por ejemplo, puedes reiniciar el juego o pasar al siguiente nivel
  
      // Ejemplo: Reiniciar el juego al hacer clic en la pantalla
      this.input.on("pointerup", () => {
        this.scene.start("Juego"); // Reinicia la escena principal del juego (Juego en este ejemplo)
      });
    }
  }
  