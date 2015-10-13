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
      this.width = .82 * game.p5.width;
      this.height = .18 * game.p5.height;
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
      this.width = .18 * game.p5.width;
      this.height = .82 * game.p5.height;
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
          y : game.p5.height * .8,
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

      yuriKey = pictureKey = -1;

      this.setPicture = function(picturePath) {
        var promisePicture = EDB.loadEDBImage(picturePath);
        Promise.all([promiseAnimation, promisePicture]).then(function(results) {
          picture.img = results[1];
          init();
          if (!librarian.loaded) {
            game.addElement(yuriSprite);
            game.addElement(picture);
            librarian.loaded = true;
          }
        });
      };
      this.setPicture(FlickrFeeder.getTagged().path());

      this.outOfScope = function() {
        return yuriSprite.position.x < 0;
      };
    };

    game.librarian = new LibrarianSprite();
  };
  GameScene.prototype.update = function() {
    var parentAnswer = EDB.Scene.prototype.update.call(this);
    if (this.librarian.outOfScope()) {
      this.librarian.setPicture(Flickr.Feeder.getUntagged().path());
    }
    return this;
  }

  var game = EDB.createp5Game([GameScene]);
  var myp5 = new p5(game);
})();
