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

var EDB = (function() {
  function Scene (p, width, height) {
    this.width = width;
    this.height = height;
    this.p5 = p;
  };

  Scene.prototype.update = function() {
    return this;
  };
  Scene.prototype.draw = function() {};
  Scene.prototype.start = function() {};
  Scene.prototype.stop = function() {};
  Scene.prototype.keyboardManager = function() {};

  return {
    createp5Game : function(scenes, mainScene) {
      return function(p) {
        var currentScene = mainScene !== undefined ? new scenes[mainScene](p) : new scenes[0](p);

        p.setup = function() {
          p.createCanvas(currentScene.width, currentScene.height);
          currentScene.start();
        };

        p.draw = function() {
          var newScene = currentScene.update();
          if (newScene !== currentScene) {
            currentScene.stop();
            newScene.start();
            currentScene = newScene;
          }
          else {
            currentScene.draw();
          }
        };
      };
    },

    Scene : Scene,
  };
})();
