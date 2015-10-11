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
  function p5Element() {
    this.position = {
      x : 0,
      y : 0,
    };
    this.velocity = {
      x : 0,
      y : 0,
    };
    this.depth = 0;
    this.scale = 1;
  }
  p5Element.prototype.update = function() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };
  p5Element.prototype.draw = function(p5) {};

  function p5Sprite() {
    p5Element.call(this);
    this.img = null;

    this.animation = [];
    this.animationIndex = -1;
  }
  p5Sprite.prototype = Object.create(p5Element.prototype);
  p5Sprite.prototype.draw = function(p5) {
    if (this.img !== null) {
      var w = this.img.width * this.scale,
          h = this.img.height * this.scale;
      EDB.p5drawImage(
        p5,
        this.img,
        this.position.x - w * .5,
        this.position.y - h * .5,
        w,
        h
      );
    }
  };
  p5Sprite.prototype.loadAnimation = function(paths) {
    var sprite = this;
    return Promise.all(_.map(paths, EDB.loadEDBImage)).then(function(images) {
      sprite.animation = images;
      sprite.animationIndex = 0;
    });
  };

  p5Sprite.prototype.update = function() {
    p5Element.prototype.update.call(this);
    if (this.animationIndex > -1) {
      this.animationIndex++;
      if (this.animationIndex >= this.animation.length) {
        this.animationIndex = 0;
      }
      this.img = this.animation[this.animationIndex];
    }
  };

  function Scene (p, width, height) {
    this.width = width;
    this.height = height;
    this.p5 = p;
    this.backgroundColor = 0;

    var elements = [];
    this.addElement = function(e) {
      elements.push(e);
      this.updateElements();
    };
    this.getElements = function() {
      return elements;
    };
    this.updateElements = function() {
      elements = _.sortBy(elements, 'depth');
    }
  };

  Scene.prototype.update = function() {
    _.each(this.getElements(), function(e) { e.update();});
    return this;
  };
  Scene.prototype.draw = function() {
    var p5 = this.p5;
    p5.background(this.backgroundColor);
    _.each(this.getElements(), function(e) { e.draw(p5);});
  };
  Scene.prototype.start = function() {};
  Scene.prototype.stop = function() {};
  Scene.prototype.keyboardManager = function() {};

  function loadEDBImage(path) {
    var promise = new Promise( function(resolve, reject) {
      var img = new Image();

      img.onload = function(i) {
        resolve(img);
      };
      img.onerror = function(e) {
        reject(e);
      };
      img.src = path;
    });

    return promise;
  }

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

    p5Element : p5Element,

    p5Sprite : p5Sprite,

    loadEDBImage : loadEDBImage,

    p5drawImage : function(p5, img, x, y, w, h) {
      w = w || img.width;
      h = h || img.height;
      p5.canvas.getContext('2d').drawImage(img, x, y, w, h);
    },
  };
})();
