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

var currentScene, tunningScene;

var yuriAnimation;
var pictureImages = [];
var arcadeFont;

var BL_Collection, tags;

function preload() {
  yuriAnimation = loadAnimation('data/yuriWalking_1.png', 'data/yuriWalking_4.png');
  pictureImages[0] = loadImage('data/10997265356_0f8e16452f_q.jpg');
  arcadeFont = loadFont('data/04B_03__.ttf');
  introMusic = loadSound('data/Ozzed_-_Satisfucktion.mp3');
  gameMusic = loadSound('data/Ozzed_-_8-bit_Party.mp3');
  actionSound = loadSound('data/Pickup_Coin14.wav');
  explosionSound = loadSound('data/Explosion2.wav');
  newCanvasSound = loadSound('data/Randomize7.wav');
  sampleset = loadStrings('data/sampleset.csv');
}

function setup() {
  createCanvas(800, 600);
  noSmooth();
  initCollectionDictionary();
  var NES_Palette = new LuminancePalette('NES');
  tunningScene = new PaletteScene(NES_Palette);
  currentScene = new IntroScene(NES_Palette);

  currentScene.start();
}

function initCollectionDictionary() {
  sampleset.shift();
  BL_Collection = _.map(sampleset, function(line) { return new BL_Image(line);});
  BL_Collection = _.groupBy(BL_Collection, 'tag');
  tags = _.map(BL_Collection, function(item) { return item[0].tag;});
}

function draw() {
  keyboardManager();
  var newScene = currentScene.update();
  if (currentScene != newScene) {
    currentScene.stop();
    currentScene = newScene;
    currentScene.start();
  }
  currentScene.draw();

  function keyboardManager() {
    if ((keyWentDown('r') || keyWentDown('R')) && currentScene != tunningScene) {
      currentScene.pause();
      tunningScene.start(currentScene);
      currentScene = tunningScene;
    }
    currentScene.keyboardManager();
  }
}

function IntroScene(palette) {
  var nextScene = this;
  this.palette = palette;

  var backgroundColor = palette.createColor(6, 3);
  var textColor = palette.createColor(floor(random(1,12)), 1);
  var limits = new GroundLimitsSprite();
  var yuriFox = new LibrarianSprite(yuriAnimation, pictureImages[0], limits);
  var imagesRecords = selectImageRecords();;

  yuriFox.setY(height * .85);

  function selectImageRecords() {
    imageRecords = _.reduce(BL_Collection, function(memo, collection, index) {
      var n = index == 'UNTAGGED' ? 120 : 8;
      for (var i = 0; i < n; i++) {
        memo.push(collection[floor(random(collection.length))]);
      }
      return memo;
    }, []);
    imageRecords = _.sortBy(imageRecords, function() { return random(); });
  }

  this.draw = function() {
    background(backgroundColor.getColor());

    fill(textColor.getColor());
    noStroke();
    displayTitle();
    displayFooter();
    displayBlinker();

    yuriFox.draw();
  };

  this.update = function() {
    yuriFox.update();
    return nextScene;
  };

  this.keyboardManager = function() {
    if (keyWentDown(CONTROL)) {
      nextScene = new GameScene(palette, imageRecords);
    }
  };

  this.start = function(scene) {
    introMusic.play();
  };

  this.stop = function() {
    introMusic.stop();
  };

  this.pause = function() {
    introMusic.stop();
  };

  function displayTitle() {
    textFont(arcadeFont);
    textSize(125);
    text("Tag Attack", width * .10, height * .283);
  }

  function displayFooter() {
    textFont(arcadeFont);
    textSize(20);
    var footer = "Copyright 2015 Escuela de Bits, GPL Licensed";
    text(footer, width * .40, height * .97);
    text('Music by @OzzedNet', width * .01, height * .97);
  }

  function displayBlinker() {
    var blinkColor = palette.createColor(floor(random(1,14)), floor(random(0, 3)));
    fill(blinkColor.getColor());
    var x = width * .32;
    var y = height * .47;
    textSize(40);
    text("Press <START>", x, y);
  }
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

  this.lighter = function() {
    this.luminance++;
    return this;
  };

  this.copy = function() {
    var col = new LuminanceColor(index, palette);
    col.luminance = this.luminance;
    return col;
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

  this.setX = function(x) {
    character.position.x = x;
    item.position.x = character.position.x;
  };

  this.setSpeed = function(speed) {
    character.velocity.x = speed;
    item.velocity.x = speed;
  };

  this.draw = function() {
    drawSprites(group);
  };

  this.getPictX = function() {
    return item.position.x;
  };

  this.getPictY = function() {
    return item.position.y;
  };

  this.update = function() {
    if (limits.collide(character)) {
       flip();
       return false;
    }
    return true;
  };

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
    item.scale = 1;
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

function PaletteScene(palette) {
  var otherScene;
  var stop;
  var sizeX = width / 17;
  var sizeY = height / 5;
  stroke(90);
  var active = true;

  this.draw = function() {
    translate(sizeX * .5, sizeY * .5);
    for (var l = 0; l < 4; l++) {
      for (var c = 0; c < 16; c++) {
        fill(palette.createColor(c, l).getColor());
        rect(c * sizeX, l* sizeY, sizeX, sizeY);
      }
    }
  };

  this.start = function(scene) {
    otherScene = scene;
    active = true;
  };

  this.stop = function() {
    active = false;
  };

  this.update = function() {
    return active ? this : otherScene;
  };

  this.keyboardManager = function() {
    if (keyWentUp('r') || keyWentUp('R')) {
      this.stop();
    }
  };
}

function GameScene(palette, libraryRecords) {
  var wide = .15 * width;
  var canvases = [];
  var selectedCanvas = -1;
  var libraryIndex = 0;
  var clock = new Clock (.82 * width, .2 * height, 106);
  var nextImg = null, prevImg = null;
  var loading = false;

  var taggedRecords = _.filter(libraryRecords, function(r) { return r.tag != 'UNTAGGED'; });
  var untaggedRecords = _.filter(libraryRecords, function(r) { return r.tag == 'UNTAGGED'; });

  var performanceRatio = 1;
  var maxPerformanceRatio = 1;
  var untagged = 0;

  selectedTags = selectTags();

  canvases[0] = new TagCanvas('UP', selectedTags[0], wide, palette.createColor(2, 1));
  canvases[1] = new TagCanvas('DOWN', selectedTags[1], wide, palette.createColor(6,1));
  canvases[2] = new TagCanvas('LEFT', selectedTags[2], wide, palette.createColor(4, 1));
  canvases[3] = new TagCanvas('RIGHT', selectedTags[3], wide, palette.createColor(10, 1));

  var backgroundColor = palette.createColor(6, 3);
  var yuriFox;
  var ready = false;
  var limits = new GroundLimitsSprite();

  var prevLibraryItem, nextLibraryItem = getNextImgName();
  loadImage('data/repo/' + nextLibraryItem.flickrid + '.jpg', function(img) {
    yuriFox = new LibrarianSprite(yuriAnimation, img, limits);
    yuriFox.setY(height * .7);
    yuriFox.setX(width - 50);
    ready = true;
    prevImg = img;
    prevLibraryItem = nextLibraryItem;
  }, function(e) {console.log(e);});

  this.draw = function() {
    background(backgroundColor.getColor());
    canvases.forEach(defaultLight);
    if (ready) {
      yuriFox.draw();
    }
    if (selectedCanvas != -1) {
      canvases[selectedCanvas].highlight();
    }
    _.each(canvases, drawCanvas);
    clock.draw();
  };

  this.update = function() {
    if (clock.update()) {
      _.each(canvases, updateCanvas);
      if (ready) {
        if (nextImg == null && !loading) {
          loading = true;
          nextLibraryItem = getNextImgName();
          nextImg = loadImage('data/repo/' + nextLibraryItem.flickrid + '.jpg', function(img) {
            loading = false;
          });
        }
        if (!yuriFox.update()) {
          resetLibrarian();
        };
      }
      return this;
    }
    else {
      console.log('GAME OVER');
      console.log('final performance: ' + performanceRatio);
      console.log('max performance: ' + maxPerformanceRatio);
      return new IntroScene(palette);
    }
  };

  function resetLibrarian() {
    yuriFox = new LibrarianSprite(yuriAnimation, nextImg, limits);
    yuriFox.setY(height * .7);
    yuriFox.setX(width - 50);
    yuriFox.setSpeed(-6);
    prevImg = nextImg;
    prevLibraryItem = nextLibraryItem;
    nextImg = null;
  }

  this.start = function() {
    gameMusic.play();
    clock.start();
  };

  this.stop = function() {
    gameMusic.stop();
  };

  this.pause = function() {
    gameMusic.stop();
  };

  this.keyboardManager = function() {
    if (keyDown(UP_ARROW)) {
      selectedCanvas = 0;
    }
    else if (keyDown(DOWN_ARROW)) {
      selectedCanvas = 1;
    }
    else if (keyDown(LEFT_ARROW)) {
      selectedCanvas = 2;
    }
    else if (keyDown(RIGHT_ARROW)) {
      selectedCanvas = 3;
    }
    else {
      selectedCanvas = -1;
    }
    if (ready) {
      if (keyWentDown(CONTROL) && selectedCanvas != -1) {
        actionSound.play();
        if (prevLibraryItem.tag != 'UNTAGGED') {
          if (canvases[selectedCanvas].getTag() == prevLibraryItem.tag) {
            performanceRatio++;
            maxPerformanceRatio = max(performanceRatio, maxPerformanceRatio);
          }
          else {
            performanceRatio = performanceRatio > 1 ? floor(performanceRatio / 2) : 1;
            explosionSound.play();
          }
        }
        else {
          // untagged item .... no evaluation possible
        }
        canvases[selectedCanvas].addPicture(prevImg, yuriFox.getPictX(), yuriFox.getPictY());
        resetLibrarian();
      }
      else if (keyDown(CONTROL) && selectedCanvas == -1) {
        yuriFox.setSpeed(-10);
      }
      else {
        yuriFox.setSpeed(-6);
      }
    }
  };

  function drawCanvas(canvas) {
    canvas.draw();
  }

  function updateCanvas(canvas, i) {
    if (!canvas.update()) {
      newCanvasSound.play();
      var tag = 'UNTAGGED';
      while (tag == 'UNTAGGED' || selectedTags.indexOf(tag) != -1) {
        tag = tags[floor(random(tags.length))];
      }
      selectedTags.push(tag);
      var directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      //new TagCanvas('UP', selectedTags[0], wide, palette.createColor(2, 1));
      canvases[i] = new TagCanvas(directions[i], tag, wide, palette.createColor(i, 1));
    }
  }

  function defaultLight(canvas) {
    canvas.defaultLight();
  }

  function selectTags() {
    var aux = [];
    while (aux.length < 4) {
      var tag = tags[floor(random(tags.length - 1))];
      if (aux.indexOf(tag) == -1) {
        aux.push(tag);
      }
    }
    return _.sortBy(aux, function(e) { return 1 / e.length; });
  }

  function getNextImgName() {
    if (untagged++ < performanceRatio) {
      return untaggedRecords.shift();
    }
    else {
      untagged = 0;
      return taggedRecords.shift();
    }
  }
}

function TagCanvas(position, tag, size, col) {
  var x, y, w, h;
  var textX, textY, deltaX, deltaY;

  var wide = size;
  var picturesLength = 0;
  var maxPictures;

  switch (position) {
    case 'UP':
      x = wide;
      y = 0;
      w = width - wide;
      h = wide;
      textX = x + .8 * w;
      textY = y + .35 * h;
      deltaX = wide + 0.5;
      deltaY = 0;
      maxPictures = 5;
      break;
    case 'DOWN':
      x = 0;
      y = height - wide;
      w = width - wide;
      h = wide;
      textX = x + 0.02 * w;
      textY = y + 0.35 * h;
      deltaX = wide + 0.5;
      deltaY = 0;
      maxPictures = 5;
      break;
    case 'LEFT':
      x = 0;
      y = 0;
      w = wide;
      h = height - wide;
      textX = x + 0.1 * w;
      textY = y + 0.1 * h;
      deltaX = 0;
      deltaY = wide + 0.5;
      maxPictures = 4;
      break;
    case 'RIGHT':
      x = width - wide;
      y = wide;
      h = height - wide;
      w = wide;
      textX = x + 0.1 * w;
      textY = y + 0.95 * h;
      deltaX = 0;
      deltaY = wide + 0.5;
      maxPictures = 4;
      break;
  }

  var pictures = new Group();

  this.draw = function() {
    noStroke();
    fill(col.getColor());
    rect(x, y, w, h);

    drawSprites(pictures);

    textSize(32);
    fill(col.copy().lighter().getColor());
    text(tag, textX, textY);
    noFill();
  };

  this.highlight = function() {
    col.lighter();
  };

  this.defaultLight = function() {
    col.luminance = 1;
  };

  this.addPicture = function(img, x, y) {
    var sprite = createSprite(0, 0, img, img.width, img.height);
    sprite.addImage('still', img);
    sprite.changeAnimation('still');
    sprite.position.x = x;
    sprite.position.y = y;
    sprite.depth = 200;
    sprite.scale = .45;
    pictures.add(sprite);
    picturesLength++;
  };

  this.update = function() {
    for (var i = 0; i < picturesLength; i++) {
      var pic = pictures.get(i);
      var px = 0.5 * wide + x + i * deltaX;
      var py = 0.5 * wide + y + i * deltaY;
      if (sqrt(sq(pic.position.x - px) + sq(pic.position.y - py)) < 100) {
        pic.position.x = px;
        pic.position.y = py;
      }
      else {
        pic.attractionPoint(4, px, py);
      }
    }
    return picturesLength < maxPictures;
  };

  this.getTag = function() {
    return tag;
  }
}

function Clock(x, y, lap) {
  var time0, t;

  this.start = function() {
    time0 = millis();
  };

  this.update = function() {
    t = millis();
    if (t -time0 >= lap * 1000) {
      return false;
    }
    return true;
  };

  this.draw = function() {
    ellipseMode(CENTER);
    fill(255, 255, 255, 150);
    ellipse(x, y, 90, 90);
    fill(100, 100, 100, 150);
    arc(x, y, 90, 90, 0, map(t - time0, 0, lap * 1000, 0, TWO_PI));
    stroke(0);
    strokeWeight(5);
    noFill();
    ellipse(x, y, 95, 95);
  };
}

function BL_Image(csv) {
  var data = csv.split(',');

  this.flickrid = data[0];
  this.url = data[1];
  this.tag = data[2];
  this.largeSquare = data[3];
  this.small = data[4];
  this.medium = data[5];
  this.large = data[6];
}
