/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var currentScene;

var yuriAnimation;
var pictureImages = [];

function preload() {
  yuriAnimation = loadAnimation('data/yuriWalking_1.png', 'data/yuriWalking_4.png');
  pictureImages[0] = loadImage('data/10997265356_0f8e16452f_q.jpg');
}

function setup() {
  createCanvas(640, 400);
  noSmooth();
  var NES_Palette = new LuminancePalette('NES');
  currentScene = new IntroScene(NES_Palette);    
}

function draw() {
  currentScene.draw();
}

function IntroScene(palette) {
  this.palette = palette;

  var backgroundColor = palette.createColor(6, 3);
  yuriFox.setY(height * .75);
  var limits = new GroundLimitsSprite();
  var yuriFox = new LibrarianSprite(yuriAnimation, pictureImages[0], limits);

  this.draw = function() {
    background(backgroundColor.getColor());
    yuriFox.update();
    yuriFox.draw();
  };
}

function LuminancePalette(type) {
  var colors = [];

  if (type == 'NES') {
    initNES();
  }

  this.createColor = function(index, luminance) {
    luminance = luminance || 0;
    var aux = new LuminanceColor(index, this);
    aux.luminance = luminance;
    return aux;
  };

  this.getColor = function(index, luminance) {
    return colors[luminance][index];
  };

  function initNES() {
    var luminance = 0;
    colors[luminance] = [];
    colors[luminance][0] = new RGB1(124,124,124);
    colors[luminance][1] = new RGB1(0,0,252);
    colors[luminance][2] = new RGB1(0,0,188);
    colors[luminance][3] = new RGB1(68,40,188);
    colors[luminance][4] = new RGB1(148,0,132);
    colors[luminance][5] = new RGB1(168,0,32);
    colors[luminance][6] = new RGB1(168,16,0);
    colors[luminance][7] = new RGB1(136,20,0);
    colors[luminance][8] = new RGB1(80,48,0);
    colors[luminance][9] = new RGB1(0,120,0);
    colors[luminance][10] = new RGB1(0,104,0);
    colors[luminance][11] = new RGB1(0,88,0);
    colors[luminance][12] = new RGB1(0,64,88);
    colors[luminance][13] = new RGB1(0,0,0);
    colors[luminance][14] = new RGB1(0,0,0);
    colors[luminance][15] = new RGB1(0,0,0);
    // LUMINANCE 1
    luminance = 1;
    colors[luminance] = [];
    colors[luminance][0] = new RGB1(188,188,188);
    colors[luminance][1] = new RGB1(0,120,248);
    colors[luminance][2] = new RGB1(0,88,248);
    colors[luminance][3] = new RGB1(104,68,252);
    colors[luminance][4] = new RGB1(216,0,204);
    colors[luminance][5] = new RGB1(228,0,88);
    colors[luminance][6] = new RGB1(248,56,0);
    colors[luminance][7] = new RGB1(228,92,16);
    colors[luminance][8] = new RGB1(172,124,0);
    colors[luminance][9] = new RGB1(0,184,0);
    colors[luminance][10] = new RGB1(0,168,0);
    colors[luminance][11] = new RGB1(0,168,68);
    colors[luminance][12] = new RGB1(0,136,136);
    colors[luminance][13] = new RGB1(0,0,0);
    colors[luminance][14] = new RGB1(0,0,0);
    colors[luminance][15] = new RGB1(0,0,0);
    // LUMINANCE 2
    luminance = 2;
    colors[luminance] = [];
    colors[luminance][0] = new RGB1(248,248,248);
    colors[luminance][1] = new RGB1(60,188,252);
    colors[luminance][2] = new RGB1(104,136,252);
    colors[luminance][3] = new RGB1(152,120,248);
    colors[luminance][4] = new RGB1(248,120,248);
    colors[luminance][5] = new RGB1(248,88,152);
    colors[luminance][6] = new RGB1(248,120,88);
    colors[luminance][7] = new RGB1(252,160,68);
    colors[luminance][8] = new RGB1(248,184,0);
    colors[luminance][9] = new RGB1(184,248,24);
    colors[luminance][10] = new RGB1(88,216,84);
    colors[luminance][11] = new RGB1(88,248,152);
    colors[luminance][12] = new RGB1(0,232,216);
    colors[luminance][13] = new RGB1(120,120,120);
    colors[luminance][14] = new RGB1(0,0,0);
    colors[luminance][15] = new RGB1(0,0,0);
    // LUMINANCE 3
    luminance = 3;
    colors[luminance] = [];
    colors[luminance][0] = new RGB1(252,252,252);
    colors[luminance][1] = new RGB1(164,228,252);
    colors[luminance][2] = new RGB1(184,184,248);
    colors[luminance][3] = new RGB1(216,184,248);
    colors[luminance][4] = new RGB1(248,184,248);
    colors[luminance][5] = new RGB1(248,164,192);
    colors[luminance][6] = new RGB1(240,208,176);
    colors[luminance][7] = new RGB1(252,224,168);
    colors[luminance][8] = new RGB1(248,216,120);
    colors[luminance][9] = new RGB1(216,248,120);
    colors[luminance][10] = new RGB1(184,248,184);
    colors[luminance][11] = new RGB1(184,248,216);
    colors[luminance][12] = new RGB1(0,252,252);
    colors[luminance][13] = new RGB1(216,216,216);
    colors[luminance][14] = new RGB1(0,0,0);
    colors[luminance][15] = new RGB1(0,0,0);
  }
}

function RGB1(r, g, b) {
  this.R = r;
  this.G = g;
  this.B = b;
}

function LuminanceColor(index, palette) {
  this.luminance = 0;

  this.getColor = function() {
    var c = palette.getColor(index, this.luminance);
    return color(c.R, c.G, c.B);
  };
}

function LibrarianSprite(animation, picture, limits) {
  var group = new Group();

  var character = setupCharacter(animation);
  var item = setupPicture(picture);

  group.add(item);
  group.add(character);
  character.velocity.x = -2;
  item.velocity.x = -2;

  this.setY = function(y) {
    character.position.y = y;
    item.position.y = character.position.y - picture.height * .5 * item.scale - animation.getFrameImage().height * .5 * character.scale + item.scale * 10;
  };

  this.draw = function() {
    drawSprites(group);
  }

  this.update = function() {
    if (limits.collide(character)) {
       flip();
    }
  }

  function setupCharacter(animation) {
    var character = createSprite(-100, -100, animation.getFrameImage().width, animation.getFrameImage().height);
    character.scale = 2;
    character.position.x = width * .5;
    character.addAnimation('walking', animation);
    character.depth = 100;
    return character;
  }

  function setupPicture(picture) {
    var item = createSprite(-100, -100, picture.width, picture.height);
    item.addImage('still', picture);
    item.changeAnimation('still');
    item.position.x = character.position.x;
    item.depth = 0;
    return item;
  }

  function flip() {
    character.velocity.x = - character.velocity.x;
    item.velocity.x = -item.velocity.x;
    character.mirrorX(-character.mirrorX());
  }
}

function GroundLimitsSprite() {
  var top = createSprite(width * .5, -50, width, 100);
  var bottom = createSprite(width *.5, height + 50, width, 100);
  var left = createSprite(-50, height * .5, 100, height);
  var right = createSprite(width + 50, height * .5, 100, height);

  top.immomable = bottom.immomable = left.immomable = right.immomable = true;

  var group = new Group();
  group.add(top);
  group.add(bottom);
  group.add(left);
  group.add(right);

  this.collide = function(sprite) {
    return sprite.overlap(group);
  };
}
