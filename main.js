import Juego from "./public/assets/scenes/Juego.js";

import Nivel2 from "./public/assets/scenes/nivel2.js";

import Nivel3 from "./public/assets/scenes/nivel3.js";

import Win from "./public/assets/scenes/levelwin.js"; 

import Gameover from "./public/assets/scenes/gameover.js"; 


// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Juego, Nivel2, Nivel3, Win, Gameover,],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
