vars.DEBUG && console.log('Initialising...');

var config = {
    title: vars.name,
    type: Phaser.CANVAS,
    version: vars.version,
    url: window.location.href,
    banner: false,

    backgroundColor: '#050505',
    disableContextMenu: true,

    height: consts.canvas.height,
    width: consts.canvas.width,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: consts.canvas.width,
        height: consts.canvas.height,
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var clamp = Phaser.Math.Clamp;
function preload() {
    scene = this;
    vars.init('PRELOAD');
};
function create() {
    vars.init('CREATE'),vars.init('STARTAPP');
};
function update() {
    vars.game.winScreen.fireworks.update();
};