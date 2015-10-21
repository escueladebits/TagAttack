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
      sprite.img = sprite.animation[sprite.animationIndex];
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
      var i = elements.push(e);
      this.updateElements();
      return i;
    };
    this.getElements = function() {
      return elements;
    };
    this.updateElements = function() {
      elements = _.sortBy(elements, 'depth');
    };
    this.removeElement = function(k) {
      elements[k] = null;
    }
  };

  Scene.prototype.update = function() {
    _.each(this.getElements(), function(e) {
        if (e !== null) { e.update();}
    });
    return this;
  };
  Scene.prototype.draw = function() {
    var p5 = this.p5;
    p5.background(this.backgroundColor);
    _.each(this.getElements(), function(e) {
      if (e !== null) {
        e.draw(p5);
      }
    });
  };
  Scene.prototype.start = function() {};
  Scene.prototype.stop = function() {};
  Scene.prototype.keyPressed = function(k) {};
  Scene.prototype.preload = function() {};

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

  function RGB (r, g, b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
  RGB.prototype.p5color = function(p5) {
    return p5.color(this.r, this.g, this.b);
  };
  function LuminancePalette (colors) {
    this.getColor = function(index, luminance) {
      return colors[luminance][index];
    };

    var palette = this;
    this.ColorCreator = (function() {
      var aux = function(index, luminance) {
        this.index = index;
        this.luminance = luminance;
      };
      aux.prototype.copy = function() {
        return  color = new palette.ColorCreator(this.index, this.luminance);
      };
      aux.prototype.lighter = function() {
        this.luminance = Math.min(this.luminance + 1, colors.length - 1);
        return this;
      };
      aux.prototype.darker = function() {
        this.luminance = Math.max(this.luminance - 1, 0);
        return this;
      };
      aux.prototype.p5color = function(p5) {
        return palette.getColor(this.index, this.luminance).p5color(p5);
      };
      return aux;
    })();
  }

  var NEScolors = (function () {
    var luminance = 0;
    var colors = [];
    colors[luminance] = [];
    colors[luminance][0] = new RGB(124,124,124);
    colors[luminance][1] = new RGB(0,0,252);
    colors[luminance][2] = new RGB(0,0,188);
    colors[luminance][3] = new RGB(68,40,188);
    colors[luminance][4] = new RGB(148,0,132);
    colors[luminance][5] = new RGB(168,0,32);
    colors[luminance][6] = new RGB(168,16,0);
    colors[luminance][7] = new RGB(136,20,0);
    colors[luminance][8] = new RGB(80,48,0);
    colors[luminance][9] = new RGB(0,120,0);
    colors[luminance][10] = new RGB(0,104,0);
    colors[luminance][11] = new RGB(0,88,0);
    colors[luminance][12] = new RGB(0,64,88);
    colors[luminance][13] = new RGB(0,0,0);
    colors[luminance][14] = new RGB(0,0,0);
    colors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 1
    luminance = 1;
    colors[luminance] = [];
    colors[luminance][0] = new RGB(188,188,188);
    colors[luminance][1] = new RGB(0,120,248);
    colors[luminance][2] = new RGB(0,88,248);
    colors[luminance][3] = new RGB(104,68,252);
    colors[luminance][4] = new RGB(216,0,204);
    colors[luminance][5] = new RGB(228,0,88);
    colors[luminance][6] = new RGB(248,56,0);
    colors[luminance][7] = new RGB(228,92,16);
    colors[luminance][8] = new RGB(172,124,0);
    colors[luminance][9] = new RGB(0,184,0);
    colors[luminance][10] = new RGB(0,168,0);
    colors[luminance][11] = new RGB(0,168,68);
    colors[luminance][12] = new RGB(0,136,136);
    colors[luminance][13] = new RGB(0,0,0);
    colors[luminance][14] = new RGB(0,0,0);
    colors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 2
    luminance = 2;
    colors[luminance] = [];
    colors[luminance][0] = new RGB(248,248,248);
    colors[luminance][1] = new RGB(60,188,252);
    colors[luminance][2] = new RGB(104,136,252);
    colors[luminance][3] = new RGB(152,120,248);
    colors[luminance][4] = new RGB(248,120,248);
    colors[luminance][5] = new RGB(248,88,152);
    colors[luminance][6] = new RGB(248,120,88);
    colors[luminance][7] = new RGB(252,160,68);
    colors[luminance][8] = new RGB(248,184,0);
    colors[luminance][9] = new RGB(184,248,24);
    colors[luminance][10] = new RGB(88,216,84);
    colors[luminance][11] = new RGB(88,248,152);
    colors[luminance][12] = new RGB(0,232,216);
    colors[luminance][13] = new RGB(120,120,120);
    colors[luminance][14] = new RGB(0,0,0);
    colors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 3
    luminance = 3;
    colors[luminance] = [];
    colors[luminance][0] = new RGB(252,252,252);
    colors[luminance][1] = new RGB(164,228,252);
    colors[luminance][2] = new RGB(184,184,248);
    colors[luminance][3] = new RGB(216,184,248);
    colors[luminance][4] = new RGB(248,184,248);
    colors[luminance][5] = new RGB(248,164,192);
    colors[luminance][6] = new RGB(240,208,176);
    colors[luminance][7] = new RGB(252,224,168);
    colors[luminance][8] = new RGB(248,216,120);
    colors[luminance][9] = new RGB(216,248,120);
    colors[luminance][10] = new RGB(184,248,184);
    colors[luminance][11] = new RGB(184,248,216);
    colors[luminance][12] = new RGB(0,252,252);
    colors[luminance][13] = new RGB(216,216,216);
    colors[luminance][14] = new RGB(0,0,0);
    colors[luminance][15] = new RGB(0,0,0);

    return colors;
  })();

  return {
    createp5Game : function(scenes, mainScene) {
      return function(p) {
        var currentScene = mainScene !== undefined ? new scenes[mainScene](p) : new scenes[0](p);

        p.preload = currentScene.preload();

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

        p.keyPressed = function() {
          currentScene.keyPressed(p);
        }
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

    NESPalette : new LuminancePalette(NEScolors),
  };
})();
