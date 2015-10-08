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
  GameScene.prototype = EDB.Scene.prototype;
  GameScene.prototype.start = function() {

  };
  GameScene.prototype.draw = function() {
    this.p5.background(255, 0, 0);
  };

  var game = EDB.createp5Game([GameScene]);
  var myp5 = new p5(game);
})()
