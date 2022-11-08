"use strict";
var vars = {
    DEBUG: false,
    name: 'Fireworks Generator',

    version: 1.0,
    versionInfo: [
        ['v0.1', 'Fireworks class taken from going dotty to play about with them'],
        ['v1.0', 'Fireworks can now be birthed (once or twice per mother). Children are in groups of 2 and 4. Special firework is being flagged but not implemented yet']
    ],

    fonts: {
        default:  { fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '36px', color: '#ffffff', stroke: '#111111', strokeThickness: 3, align: 'center', lineSpacing: 20 }
    },

    init: function(_phase) {
        switch (_phase) {
            case 'PRELOAD': // PRELOADS
                vars.files.loadAssets();
                break;
            case 'CREATE': // CREATES
                vars.audio.init();
                vars.containers.init();
                vars.groups.init();
                vars.input.init();
                vars.UI.init();
                break;
            case 'STARTAPP': // GAME IS READY TO PLAY
                vars.game.init();
            break;
        }
    },

    files: {
        audio: {
            load: function() {

                ['fireworkExplode_1','fireworkExplode_2'].forEach((_fe)=> {
                    vars.audio.available.fireworkExplode.push(_fe);
                    scene.load.audio(_fe, `audio/${_fe}.ogg`);
                });

                ['fireworkTakeOff_1'].forEach((_fto)=> {
                    vars.audio.available.fireworkTakeOff.push(_fto);
                    scene.load.audio(_fto, `audio/${_fto}.ogg`);
                });
            }
        },

        images: {
            available: [],
            header: 'data:image/png;base64,',
            preA: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCA', preB: 'AAAAA6fptV[d]QIHW', postC: 'AAAABJRU5ErkJggg==',
            postD: 'AAAACklEQV', postE: 'IAAACQd1Pe', postF: 'AAAADElEQVR42m', postG: 'AAAAAElFTkSuQmCC',
            base64s: {
                'blackpixel' : '[a][e][d]R4AWMAAgAABAABsYaQRA[c]', 'whitepixel' : '[a][b]P4DwABAQEANl9ngA[c]', 'pixel2' : '[a][b]NQAgAAJAAjw8NKCg[c]', 'pixel3' : '[a][b]MwBgAANQA0TdMIeQ[c]',
                'pixel6' : '[a][b]NIAwAAaABnVJ+6Kw[c]', 'pixel9' : '[a][b]OYCQAAmwCaKknZIA[c]', 'pixel15' : '[a][b]MQBQAAFwAW6lOQIQ[c]', 'pixelC' : '[a][b]M4AwAAzgDNUwEBJA[c]'
            },
            init: ()=> {
                let fIV = vars.files.images;
                let base64s = fIV.base64s;
                let header = fIV.header;
                let preA = fIV.preA; let preB = fIV.preB; let postC = fIV.postC; let postD = fIV.postD; let postE = fIV.postE; let postF = fIV.postF; let postG = fIV.postG;
                for (let b in base64s) {
                    let b64 = header + base64s[b];
                    let newb64 = b64.replace('[a]', preA).replace('[b]',preB).replace('[c]',postC).replace('[d]',postD).replace('[e]',postE).replace('[f]',postF).replace('[g]',postG);
                    scene.textures.addBase64(b, newb64); fIV.available.push(b);
                };

            },
            load: ()=> {
                vars.files.images.init();
                scene.load.atlas('flares', 'images/flares.png', 'images/flares.json');
            }
        },

        loadAssets: ()=> {
            let fV = vars.files;
            scene.load.path='assets/';

            fV.audio.load();
            fV.images.load();
        }
    },

    containers: {
        init: ()=> {
            !scene.containers ? scene.containers = {} : null;
        }
    },

    groups: {
        init: ()=> {
            scene.groups = { };
        }
    },

    localStorage: {
        pre: 'FWG_',

        init: ()=> {
            //let lV = vars.localStorage;
            //let lS = window.localStorage;
            //let pre = lV.pre;
        },

        saveOptions: ()=> {
            
        }
    },



    // GAME/APP
    audio: {
        available: {
            fireworkTakeOff: [],
            fireworkExplode: [],
        },
        detunes: [],

        init: ()=> {
            vars.DEBUG ? console.log(`FN: audio > init`) : null;

            scene.sound.volume=0.2;

            for (let i=-1000; i<=1000; i+=200) {
                vars.audio.detunes.push(i);
            };
        },

        fireworkExplode: ()=> {
            let aV = vars.audio;
            let key = getRandom(aV.available.fireworkExplode);
            let detunes = [ ...aV.detunes ];
            detunes = detunes.splice(0,(detunes.length+1)/2|0);
            let detune = getRandom(detunes);
            scene.sound.play(key, { detune: detune });
        },

        fireworkTakeOff: ()=> {
            let aV = vars.audio;
            let key = getRandom(aV.available.fireworkTakeOff);
            let detune = getRandom(aV.detunes);
            scene.sound.play(key, { detune: detune });
        },

        playSound: (_key)=> {
            scene.sound.play(_key);
        },
    },

    game: {
        winScreen: { fireworks: null }, // emulated the way dots 
        fireworkCount: 1,
        init: ()=> {
            vars.DEBUG ? console.log(`\nFN: game > init`) : null;
            vars.game.winScreen.fireworks = new FireworksDisplay();
            vars.game.winScreen.fireworks.show();
        },
    },

    input: {
        init: ()=> {
            vars.DEBUG ? console.log(`FN: input > init`) : null;

            
            scene.input.on('pointerdown', (_pointer)=> {
                
            });
        },

        click: (_gameObject)=> { },
        out: (_gameObject)=> { },
        over: (_gameObject)=> { }
    },

    UI: {
        init: ()=> {
            vars.DEBUG ? console.log(`FN: ui > init`) : null;
        },
        generateBackground: (_colour,_w=null, _h=null)=> {
            if (!vars.files.images.available.includes(_colour)) return false;

            let cC = consts.canvas;
            let width = _w||cC.width;
            let height = _h||cC.height;

            let bg = scene.add.image(width/2, height/2, _colour).setScale(width,height);
            return bg;
        }
    }
};