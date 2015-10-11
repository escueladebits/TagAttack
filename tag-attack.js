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
    game.p5.noSmooth();

    game.sprite = EDB.createp5Sprite();
    game.sprite.init = function() {
      this.position.x = 400;
      this.position.y = 300;
    };
    game.sprite.init();
    game.sprite.img = EDB.loadEDBImage('data/yuriWalking_1.png', function(i) {
      game.addElement(game.sprite);
    });
    game.sprite.velocity.x = -2;
    game.sprite.depth = 100;
    game.sprite.scale = 2;

    game.picture = EDB.createp5Sprite();
    game.picture.position = {
      x : 600, y : 200,
    };
    game.picture.img = EDB.loadEDBImage(Flickr.Feeder.getTagged().path(), function(i) {
      game.addElement(game.picture);
    });
    game.picture.growing = false;

    var clock = EDB.createp5Element();
    clock.draw = function(p5) {
      p5.ellipse(this.position.x, this.position.y, 50, 50);
    };
    clock.position = {
      x: game.p5.width * .5,
      y: game.p5.height * .5,
    };
    game.addElement(clock);
  };
  GameScene.prototype.update = function() {
    var parentAnswer = EDB.Scene.prototype.update.call(this);
    if (this.sprite.position.x <= 0) {
      this.sprite.init();
      this.sprite.depth = -1 * this.sprite.depth;
      this.updateElements();
    }
    if (this.picture.scale >=1 && this.picture.growing) {
      this.picture.growing = false;
    }
    if (this.picture.scale <= .5 && !this.picture.growing) {
      this.picture.growing = true;
    }
    this.picture.scale += this.picture.growing ? .02: -.02;
    return this;
  }

  var game = EDB.createp5Game([GameScene]);
  var myp5 = new p5(game);
})()
