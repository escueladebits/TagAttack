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

(function() {
  var tags = [
    {tag: 'portrait', index: 0, lum: 1,},
    {tag: 'map', index: 8, lum: 1,},
    {tag: 'diagram', index: 8, lum: 2,},
    {tag: 'people', index: 11, lum: 2,},
    {tag: 'heraldry', index: 12, lum: 0,},
    {tag: 'architecture', index: 0, lum: 0,},
    {tag: 'music', index: 4, lum: 2,},
    {tag: 'fauna', index: 5, lum: 1,},
    {tag: 'flora', index: 9, lum: 1,},
    {tag: 'cycling', index: 12, lum: 2,},
  ];

  var selectedTags = _.sortBy(tags, function() { return Math.random();}).slice(0,4);
  selectedTags = _.sortBy(selectedTags, function(t) { return 1 / t.tag.length;});

  var GameScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);
    this.arcadeFont = null;

    this.nextScene = this;
  };
  GameScene.prototype = Object.create(EDB.Scene.prototype);
  GameScene.prototype.preload = function() {
    var game = this;
    this.arcadeFont = this.p5.loadFont('data/04B_03__.ttf');
    this.music = this.p5.loadSound('data/Ozzed_-_8-bit_Party.mp3', function() {
      game.music.rate(1);
      game.music.play();
      game.time0 = game.p5.millis();
    });
  };
  GameScene.prototype.start = function() {
    var game = this;
    //game.backgroundColor = game.p5.color(0, 0, 15);
    game.backgroundColor = (new EDB.NESPalette.ColorCreator(6, 3)).p5color(game.p5);
    game.p5.noSmooth();
    game.p5.frameRate(24);

    function Clock(music, x, y, width) {
      EDB.p5Element.call(this);
      this.music = music;
      this.depth = 100;
      this.position = {
        x : x,
        y : y,
      };
      this.width = width;
    }
    Clock.prototype = Object.create(EDB.p5Element.prototype);
    Clock.prototype.draw = function(p5) {
      EDB.p5Element.prototype.draw.call(this, p5);
      p5.fill(0, 0, 15, 200);
      p5.rect(this.position.x, this.position.y, this.width, 15);
      var initColor = p5.color(0, 255, 0, 200);
      var endColor = p5.color(255, 0, 0, 200);
      p5.colorMode(p5.HSB);
      var printColor = p5.color(p5.map(game.secs, 0, game.music.duration(), p5.hue(initColor), p5.hue(endColor)), p5.saturation(initColor), p5.brightness(initColor), 200)
      p5.fill(printColor);
      p5.colorMode(p5.RGB);
      p5.noStroke();
      p5.rect(this.position.x + 2, this.position.y + 2, this.width -4 - p5.map(game.secs, 0, game.music.duration(), 0, this.width - 4), 11);
    };

    function TagCanvasElement(tag, color, font) {
      EDB.p5Element.call(this);
      this.tag = tag;
      this.width = this.height;
      this.backgroundColor = color;
      this.depth = 10;
      this.font = font;

      this.textX = 0;
      this.textY = 0;
      this.maxText = 100;

      this.pictures = [];
      this.deltaX = 0;
      this.deltaY = 0;
    }
    TagCanvasElement.prototype = Object.create(EDB.p5Element.prototype);
    TagCanvasElement.prototype.draw = function(p5) {
      p5.noStroke();
      p5.fill((new EDB.NESPalette.ColorCreator(12, 0)).p5color(p5));
      p5.rect(this.position.x, this.position.y, this.width, this.height);
      p5.fill((new EDB.NESPalette.ColorCreator(12, 1)).p5color(p5));
      p5.rect(this.position.x + 2, this.position.y + 2, this.width - 4, this.height - 4);
      p5.fill(this.backgroundColor.p5color(p5));
      p5.rect(this.position.x + 4, this.position.y + 4, this.width - 8, this.height - 8);
    }
    TagCanvasElement.prototype.addLabel = function() {
      var tagCanvas = this;
      var label = new EDB.p5Element();
      label.draw = function(p5) {
        p5.textSize(29);
        p5.textFont(tagCanvas.font);
        p5.strokeWeight(2);
        p5.stroke(120);
        p5.fill(tagCanvas.backgroundColor.copy().lighter().p5color(p5));
        p5.text(tagCanvas.tag.slice(0, tagCanvas.maxText), tagCanvas.textX, tagCanvas.textY);
      };
      label.depth = 25;
      game.addElement(label);
    };
    TagCanvasElement.prototype.getPosition = function(i) {
      return {
        x: this.position.x + game.p5.width * .075 + i * this.deltaX ,
        y: this.position.y + game.p5.width * .075 + i * this.deltaY ,
      };
    };
    TagCanvasElement.prototype.addPicture = function(pic) {
      var i = this.pictures.push(pic) - 1;
      var spritePicture = new EDB.p5Sprite();
      spritePicture.img = pic;
      spritePicture.position = this.getPosition(i);
      spritePicture.depth = 20;
      spritePicture.scale = .45;
      console.log(i,spritePicture);
      game.addElement(spritePicture);
    };
    function TagCanvasTop() {
      TagCanvasElement.apply(this, arguments);
      this.width = .85 * game.p5.width + 2;
      this.height = .15 * game.p5.width;
      this.position.x = game.p5.width - this.width;
      this.position.y = 0;
      this.textX = this.position.x + .8 * this.width;
      this.textY = this.position.y + .35 * this.height;
      this.maxText = 9;

      this.deltaX = this.height + 0.5;
      this.deltaY = 0;
    }
    TagCanvasTop.prototype = Object.create(TagCanvasElement.prototype);
    function TagCanvasBottom() {
      TagCanvasTop.apply(this, arguments);
      this.position.x = 0;
      this.position.y = game.p5.height - this.height;
      this.textX = this.position.x + 0.02 * this.width;
      this.textY = this.position.y + 0.35 * this.height;
      this.depth = 11;
      this.maxText = 100;
    }
    TagCanvasBottom.prototype = Object.create(TagCanvasTop.prototype);
    function TagCanvasLeft() {
      TagCanvasElement.apply(this, arguments);
      this.width = .15 * game.p5.width;
      this.height = game.p5.height - this.width + 2;
      this.position.x = 0;
      this.position.y = 0;
      this.textX = this.position.x + 0.1 * this.width;
      this.textY = this.position.y + 0.1 * this.height;
      this.depth = 12;
      this.maxText = 6;

      this.deltaX = 0;
      this.deltaY = this.width + 0.5;
    }
    TagCanvasLeft.prototype = Object.create(TagCanvasElement.prototype);
    function TagCanvasRight() {
      TagCanvasLeft.apply(this, arguments);
      this.position.x = game.p5.width - this.width;
      this.position.y = game.p5.height - this.height;
      this.textX = this.position.x + 0.1 * this.width;
      this.textY = this.position.y + 0.95 * this.height;
      this.depth = 13;
    }
    TagCanvasRight.prototype = Object.create(TagCanvasLeft.prototype);

    var topColor = (new EDB.NESPalette.ColorCreator(selectedTags[0].index, selectedTags[0].lum));
    var bottomColor = (new EDB.NESPalette.ColorCreator(selectedTags[1].index, selectedTags[1].lum));
    var leftColor = (new EDB.NESPalette.ColorCreator(selectedTags[2].index, selectedTags[2].lum));
    var rightColor = (new EDB.NESPalette.ColorCreator(selectedTags[3].index, selectedTags[3].lum))
    game.tagCanvases = [];
    game.tagCanvases[game.p5.UP_ARROW] = new TagCanvasTop(selectedTags[0].tag, topColor, game.arcadeFont);
    game.tagCanvases[game.p5.DOWN_ARROW] = new TagCanvasBottom(selectedTags[1].tag, bottomColor, game.arcadeFont);
    game.tagCanvases[game.p5.LEFT_ARROW] = new TagCanvasLeft(selectedTags[2].tag, leftColor, game.arcadeFont);
    game.tagCanvases[game.p5.RIGHT_ARROW] = new TagCanvasRight(selectedTags[3].tag, rightColor, game.arcadeFont);

    _.each([game.p5.UP_ARROW, game.p5.DOWN_ARROW, game.p5.LEFT_ARROW, game.p5.RIGHT_ARROW], function(key) {
      game.addElement(game.tagCanvases[key]);
      game.tagCanvases[key].addLabel();
    });

    function LibrarianSprite() {
      var librarian = this;
      var yuriSprite = new EDB.p5Sprite();
      var yuriAnimation = [
        'data/yuriWalking_1.png',
        'data/yuriWalking_2.png',
        'data/yuriWalking_3.png',
        'data/yuriWalking_4.png',
      ];
      var promiseAnimation = yuriSprite.loadAnimation(yuriAnimation);
      yuriSprite.scale = 2;
      yuriSprite.depth = 2;

      var picture = new EDB.p5Sprite();
      picture.scale = 1;
      picture.depth = 1;

      var init = function() {
        var yuriImg = yuriSprite.img;
        var pictureImg = picture.img;
        var position = {
          x : game.p5.width,
          y : game.p5.height * .7,
        };
        var velocity = {
          x : -8,
          y : 0,
        }
        yuriSprite.position.x = position.x;
        yuriSprite.position.y = position.y;
        picture.position.x = position.x;
        picture.position.y = position.y - yuriImg.height * .5 * yuriSprite.scale - pictureImg.height * .5 * picture.scale + 10 * picture.scale;
        yuriSprite.velocity = velocity;
        picture.velocity = velocity;
      };

      librarian.loaded = false;

      librarian.loading = false;

      yuriKey = pictureKey = -1;

      this.setPicture = function(picturePath) {
        if (!librarian.loading) {
          librarian.loading = true;
          var promisePicture = EDB.loadEDBImage(picturePath);
          Promise.all([promiseAnimation, promisePicture]).then(function(results) {
            picture.img = results[1];
            librarian.loading = false;
            init();
            if (!librarian.loaded) {
              game.addElement(yuriSprite);
              game.addElement(picture);
              librarian.loaded = true;
            }
          });
        }
      };

      this.getPicture = function() {
        if (!librarian.loading && picture.img !== null) {
          return picture.img;
        }
        else {
          return null;
        }
      }

      this.outOfScope = function() {
        return yuriSprite.position.x < 0;
      };
    };

    game.librarian = new LibrarianSprite();
    var x = game.p5.width * .15;
    game.clock = new Clock(game.music, x + 2, x + 10, game.p5.width - x *2 - 4);
    game.addElement(game.clock);
  };
  GameScene.prototype.update = function() {
    var parentAnswer = EDB.Scene.prototype.update.call(this);
    if (!this.librarian.loaded && Flickr.Feeder.available()) {
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
    if (this.librarian.outOfScope()) {
      this.librarian.setPicture(Flickr.Feeder.getUntagged().path());
    }
    this.secs = (this.p5.millis() - this.time0) / 1000;
    if (this.secs >= this.music.duration()) {
      this.stop();
    }
    return this.nextScene;
  };
  GameScene.prototype.keyPressed = function(k) {
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
    keys = [this.p5.UP_ARROW, this.p5.DOWN_ARROW, this.p5.LEFT_ARROW, this.p5.RIGHT_ARROW];
    if (keys.indexOf(this.p5.keyCode) !== -1) {
      this.tagCanvases[this.p5.keyCode].addPicture(this.librarian.getPicture());
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
  };
  GameScene.prototype.stop = function() {
    EDB.Scene.prototype.stop.call(this);
    this.music.stop();
    this.nextScene = null;
  };

  function PaletteScene(p) {
    EDB.Scene.call(this, p, 320, 200);
  }
  PaletteScene.prototype = Object.create(EDB.Scene.prototype);
  PaletteScene.prototype.start = function() {
    var scene = this;
    function Panel(x, y, index, luminance) {
      EDB.p5Element.call(this);
      this.position = {
        x: x,
        y: y,
      }
      this.index = index;
      this.luminance = luminance;
      this.p5color = (new EDB.NESPalette.ColorCreator(index, luminance)).p5color(scene.p5);
    }
    Panel.prototype = Object.create(EDB.p5Element.prototype);
    Panel.prototype.draw = function(p5) {
      p5.push();
      p5.translate(this.position.x, this.position.y);
      p5.fill(this.p5color);
      p5.stroke(100);
      p5.rect(0, 0, p5.width / 16, p5.height / 4);
      p5.pop();
    };

    for (var i = 0; i< 16; i++) {
      for (var l = 0; l < 4; l++) {
        this.addElement(new Panel(i * this.p5.width / 16, l * this.p5.height / 4, i, l));
      }
    }
  };

  var game = EDB.createp5Game([GameScene]);
  //var game = EDB.createp5Game([PaletteScene]);
  var myp5 = new p5(game);
})();
