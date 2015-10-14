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
  var GameScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);
  };
  GameScene.prototype = Object.create(EDB.Scene.prototype);
  GameScene.prototype.start = function() {
    var game = this;
    game.backgroundColor = game.p5.color(255, 0, 0);
    game.backgroundColor = (new EDB.NESPalette.ColorCreator(6, 3)).p5color(game.p5);
    game.p5.noSmooth();
    game.p5.frameRate(24);

    function TagCanvasElement(tag, color) {
      EDB.p5Element.call(this);
      this.width = this.height;
      this.backgroundColor = color;
      this.depth = 10;
    }
    TagCanvasElement.prototype = Object.create(EDB.p5Element.prototype);
    TagCanvasElement.prototype.draw = function(p5) {
      p5.fill(this.backgroundColor);
      p5.noStroke();
      p5.rect(this.position.x, this.position.y, this.width, this.height);
    };
    function TagCanvasTop(tag, color) {
      TagCanvasElement.call(this, tag, color);
      this.width = .85 * game.p5.width;
      this.height = .15 * game.p5.height;
      this.position.x = game.p5.width - this.width;
      this.position.y = 0;
    }
    TagCanvasTop.prototype = Object.create(TagCanvasElement.prototype);
    function TagCanvasBottom(tag, color) {
      TagCanvasTop.call(this, tag, color);
      this.position.x = 0;
      this.position.y = game.p5.height - this.height;
    }
    TagCanvasBottom.prototype = Object.create(TagCanvasTop.prototype);
    function TagCanvasLeft(tag, color) {
      TagCanvasElement.call(this, tag, color);
      this.width = .15 * game.p5.width;
      this.height = .85 * game.p5.height;
      this.position.x = 0;
      this.position.y = 0;
    }
    TagCanvasLeft.prototype = Object.create(TagCanvasElement.prototype);
    function TagCanvasRight(tag, color) {
      TagCanvasLeft.call(this, tag, color);
      this.position.x = game.p5.width - this.width;
      this.position.y = game.p5.height - this.height;
    }
    TagCanvasRight.prototype = Object.create(TagCanvasLeft.prototype);

    game.addElement(new TagCanvasTop('hello', game.p5.color(0, 255, 0)));
    game.addElement(new TagCanvasBottom('bye', game.p5.color(0, 0, 255)));
    game.addElement(new TagCanvasLeft('start', game.p5.color(255)));
    game.addElement(new TagCanvasRight('end', game.p5.color(0)));

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

      this.outOfScope = function() {
        return yuriSprite.position.x < 0;
      };
    };

    game.librarian = new LibrarianSprite();
  };
  GameScene.prototype.update = function() {
    var parentAnswer = EDB.Scene.prototype.update.call(this);
    if (!this.librarian.loaded && Flickr.Feeder.available()) {
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
    if (this.librarian.outOfScope()) {
      this.librarian.setPicture(Flickr.Feeder.getUntagged().path());
    }
    return this;
  };
  GameScene.prototype.keyPressed = function(k) {
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.librarian.setPicture(Flickr.Feeder.getTagged().path());
    }
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

  //var game = EDB.createp5Game([GameScene]);
  var game = EDB.createp5Game([PaletteScene]);
  var myp5 = new p5(game);
})();
