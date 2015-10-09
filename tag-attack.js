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

    game.sprite = EDB.createp5Sprite(game.p5);
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

    var clock = EDB.createp5Element(game.p5);
    clock.draw = function() {
      game.p5.ellipse(this.position.x, this.position.y, 50, 50);
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
    return this;
  }


  var game = EDB.createp5Game([GameScene]);
  var myp5 = new p5(game);
})()
