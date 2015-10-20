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
  var usedTags = [];

  var GameScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);
    this.arcadeFont = null;

    this.nextScene = this;

    this.arrows = [p.UP_ARROW, p.DOWN_ARROW, p.LEFT_ARROW, p.RIGHT_ARROW];
  };
  GameScene.prototype = Object.create(EDB.Scene.prototype);
  GameScene.prototype.preload = function() {
    var game = this;
    this.arcadeFont = this.p5.loadFont('data/04B_03__.TTF');
    this.music = this.p5.loadSound('data/Ozzed_-_8-bit_Party.mp3', function() {
      game.music.rate(1);
      game.music.play();
      game.time0 = game.p5.millis();
    });
    this.simpleBell = this.p5.loadSound('data/Pickup_Coin14.wav');
    this.successBell = this.p5.loadSound('data/Randomize7.wav');
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

      this.maxItems = 0;
    }
    TagCanvasElement.prototype = Object.create(EDB.p5Element.prototype);
    TagCanvasElement.prototype.full = function() {
      return this.pictures.length >= this.maxItems;
    };
    TagCanvasElement.prototype.draw = function(p5) {
      var tagcanvas = this;
      p5.noStroke();
      p5.fill((new EDB.NESPalette.ColorCreator(12, 0)).p5color(p5));
      p5.rect(this.position.x, this.position.y, this.width, this.height);
      p5.fill((new EDB.NESPalette.ColorCreator(12, 1)).p5color(p5));
      p5.rect(this.position.x + 2, this.position.y + 2, this.width - 4, this.height - 4);
      p5.fill(this.backgroundColor.p5color(p5));
      p5.rect(this.position.x + 4, this.position.y + 4, this.width - 8, this.height - 8);

      //pictures
      _.each(this.pictures, function(pict, i) {
        var pos = tagcanvas.getPosition(i);
        pos.x = pos.x - pict.width * .5 * .45;
        pos.y = pos.y - pict.height * .5 * .45;
        EDB.p5drawImage(p5, pict, pos.x, pos.y, pict.width * .45, pict.height * .45);
      });

      // tag
      p5.textSize(29);
      p5.textFont(this.font);
      p5.strokeWeight(2);
      p5.stroke(120);
      p5.fill(this.backgroundColor.copy().lighter().p5color(p5));
      p5.text(this.tag.slice(0, this.maxText), this.textX, this.textY);
    }
    TagCanvasElement.prototype.addElement = function() {
      this.idScene = game.addElement(this) + 1;
    };
    TagCanvasElement.prototype.removeElement = function() {
      game.removeElement(this.idScene);
    }
    TagCanvasElement.prototype.getPosition = function(i) {
      return {
        x: this.position.x + game.p5.width * .075 + i * this.deltaX ,
        y: this.position.y + game.p5.width * .075 + i * this.deltaY ,
      };
    };
    TagCanvasElement.prototype.addPicture = function(pic) {
      this.pictures.push(pic);
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

      this.maxItems = 5;
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

      this.maxItems = 4;
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

    function TagCanvasCreator(p5position, tag, color, font) {
      var creator;
      switch(p5position) {
        case game.p5.UP_ARROW:
          return TagCanvasTop;
          break;
        case game.p5.DOWN_ARROW:
          return TagCanvasBottom;
          break;
        case game.p5.LEFT_ARROW:
          return TagCanvasLeft;
          break;
        case game.p5.RIGHT_ARROW:
          return TagCanvasRight;
          break;
      }
    }

    this.changeTagCanvas = function(arrow, tag) {
      var color = new EDB.NESPalette.ColorCreator(tag.index, tag.lum);
      var oldTagCanvas = game.tagCanvases[arrow];
      game.tagCanvases[arrow] = new (TagCanvasCreator(arrow))(tag.tag, color, game.arcadeFont);
      game.tagCanvases[arrow].addElement();
      oldTagCanvas.removeElement();
    };

    game.tagCanvases = [];
     _.each(game.arrows, function(direction, i) {
      var color = new EDB.NESPalette.ColorCreator(selectedTags[i].index, selectedTags[i].lum);
      game.tagCanvases[direction] = new (TagCanvasCreator(direction))(selectedTags[i].tag, color, game.arcadeFont);
      game.tagCanvases[direction].addElement();
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
          if (picture.img !== null) {
            init();
            this.pause();
          }
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

      this.pause = function() {
        yuriSprite.velocity = picture.velocity = {
          x : 0,
          y : 0,
        };
      };

      this.getPicture = function() {
        if (!librarian.loading && picture.img !== null) {
          return picture.img;
        }
        else {
          return null;
        }
      };

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
    var game = this;
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
    _.each(this.arrows, function(arrow) {
      if (game.tagCanvases[arrow].full()) {
        if (selectedTags.length + usedTags.length === tags.length) {
          usedTags = [];
        }

        var oldTag = _.find(selectedTags, function(tc) {
          return tc.tag == game.tagCanvases[arrow].tag;
        });
        usedTags.push(oldTag);
        var oldIndex = selectedTags.indexOf(oldTag);
        selectedTags.splice(oldIndex, 1);
        var newTag = _.sample(_.filter(tags, function(tc) {
          return selectedTags.indexOf(tc) === -1 && usedTags.indexOf(tc) === -1;
        }));
        selectedTags.push(newTag);

        game.successBell.play();

        game.changeTagCanvas(arrow, newTag);
      }
    });
    return this.nextScene;
  };
  GameScene.prototype.keyPressed = function(k) {
    if (this.librarian.loading) {
      return;
    }
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
    if (this.arrows.indexOf(this.p5.keyCode) !== -1) {
      this.simpleBell.play();
      var picture = this.librarian.getPicture();
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
      this.tagCanvases[this.p5.keyCode].addPicture(picture);
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
