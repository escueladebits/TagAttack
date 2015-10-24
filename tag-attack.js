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

  var flickrFeeder = new FlickrFeeder(tags);

  var selectedTags = _.sortBy(tags, function() { return Math.random();}).slice(0,4);
  selectedTags = _.sortBy(selectedTags, function(t) { return 1 / t.tag.length;});
  var usedTags = [];

  function LibrarianSprite(x, y) {
    var librarian = this;
    this.x = x;
    this.y = y;
    this.yuriSprite = new EDB.p5Sprite();
    var yuriAnimation = [
      'data/yuriWalking_1.png',
      'data/yuriWalking_2.png',
      'data/yuriWalking_3.png',
      'data/yuriWalking_4.png',
    ];
    var promiseAnimation = this.yuriSprite.loadAnimation(yuriAnimation);
    this.yuriSprite.scale = 2;
    this.yuriSprite.depth = 2;

    this.picture = new EDB.p5Sprite();
    this.picture.scale = 1;
    this.picture.depth = 1;

    this.loaded = false;
    this.loading = false;

    this.init = function() {
      var yuriImg = this.yuriSprite.img;
      var pictureImg = this.picture.img;
      var position = {
        x : x,
        y : y,
      };
      this.yuriSprite.position = position;
      this.picture.position.x = position.x;
      this.picture.position.y = position.y - yuriImg.height * .5 * this.yuriSprite.scale - pictureImg.height * .5 * this.picture.scale + 10 * this.picture.scale;
      this.setVelocity(-8);
    };
    this.setPicture = function(picturePath) {
      var librarian = this;
      if (!this.loading) {
        this.loading = true;
        var promisePicture = EDB.loadEDBImage(picturePath);
        if (this.picture.img !== null) {
          this.init();
          this.pause();
        }
        return Promise.all([promiseAnimation, promisePicture]).then(function(results) {
          librarian.picture.img = results[1];
          librarian.loading = false;
          librarian.init();
        });
      }
      else {
        return new Promise(function(response, reject) { reject(); });
      }
    };
  }
  LibrarianSprite.prototype.setVelocity = function(v) {
    this.yuriSprite.velocity = this.picture.velocity = {
      x: v,
      y: 0,
    }
  };
  LibrarianSprite.prototype.getVelocity = function() {
    return this.yuriSprite.velocity.x;
  };

  LibrarianSprite.prototype.addElements = function(scene) {
    scene.addElement(this.yuriSprite);
    scene.addElement(this.picture);
    this.loaded = true;
  };
  LibrarianSprite.prototype.pause = function() {
    this.setVelocity(0);
  };
  LibrarianSprite.prototype.getPicture = function() {
    if (!this.loading && this.picture.img !== null) {
      return this.picture.img;
    }
    else {
      return null;
    }
  };
  LibrarianSprite.prototype.tooLeft = function(p5) {
    return this.yuriSprite.position.x < 0;
  };
  LibrarianSprite.prototype.tooRight = function(p5) {
    return this.yuriSprite.position.x > p5.width;
  };

  var IntroScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);
    this.textColor = null;

    this.gameScene = new GameScene(p);
    this.nextScene = this;
    this.ready = false;

    this.walkingLeft = true;
  };
  IntroScene.prototype = Object.create(EDB.Scene.prototype);

  IntroScene.resources = [
    {'type': 'sound', 'name': 'introMusic', 'path': 'data/Ozzed_-_Satisfucktion.mp3'},
    {'type': 'font', 'name': 'arcadeFont', 'path': 'data/04B_03__.TTF'},
  ];
  IntroScene.prototype.resourcesList = function() {
    return IntroScene.resources;
  }
  IntroScene.prototype.start = function() {
    var intro = this;
    this.backgroundColor = (new EDB.NESPalette.ColorCreator(6, 3)).p5color(this.p5);

    this.textColor = (new EDB.NESPalette.ColorCreator(Math.floor(12 * Math.random()), 1)).p5color(this.p5);

    //main title
    var title = new EDB.p5Element();
    title.draw = function(p5) {
      if (intro.arcadeFont !== null && intro.textColor !== null) {
        p5.fill(intro.textColor);
        p5.noStroke();
        p5.textFont(intro.arcadeFont);
        p5.textSize(125);
        p5.text("Tag Attack", p5.width * .10, p5.height * .283);
      }
    };
    title.depth = 100;
    this.addElement(title);

    // footer
    var footer = new EDB.p5Element();
    footer.draw = function(p5) {
      if (intro.arcadeFont !== null && intro.textColor !== null) {
        p5.fill(intro.textColor);
        p5.textFont(intro.arcadeFont);
        p5.textSize(20);
        p5.noStroke();
        var footer = "Copyright 2015 Escuela de Bits, GPL Licensed";
        p5.text(footer, p5.width * .40, p5.height * .97);
        p5.text('Music by @OzzedNet', p5.width * .01, p5.height * .97);
      }
    };
    this.addElement(footer);

    var callToAction = new EDB.p5Element();
    callToAction.draw = function(p5) {
      if (intro.arcadeFont !== null) {
        var blinkColor = new EDB.NESPalette.ColorCreator(1 + Math.floor(13 * Math.random()), Math.floor(3 * Math.random()));
        p5.fill(blinkColor.p5color(p5));
        var x = p5.width * .32;
        var y = p5.height * .47;
        p5.textFont(intro.arcadeFont);
        p5.textSize(40);
        p5.text("Press <START>", x, y);
      }
    };
    callToAction.depth = 100;
    this.addElement(callToAction);

    this.yuri = new LibrarianSprite(this.p5.width, this.p5.height * .8);
  };
  IntroScene.prototype.update = function() {
    EDB.Scene.prototype.update.call(this);
    if (this.introMusic.isLoaded() && !this.introMusic.isPlaying()) {
      this.introMusic.play();
    }
    if (!this.yuri.loaded && flickrFeeder.available() && !this.yuri.loading) {
      var yuri = this.yuri;
      var intro = this;
      var path = flickrFeeder.getTagged().path();
      this.yuri.setPicture(path).then(function() {
        if (!yuri.loaded) {
          yuri.setVelocity(-2);
          yuri.addElements(intro);
        }
      });
    }
    if (this.walkingLeft && this.yuri.tooLeft(this.p5) || this.walkingLeft === false && this.yuri.tooRight(this.p5)) {
      this.walkingLeft = !this.walkingLeft;
      this.yuri.setVelocity(-this.yuri.getVelocity());
    }

    return this.nextScene;
  };
  IntroScene.prototype.stop = function() {
    this.introMusic.stop();
    this.nextScene = this.gameScene;
    this.nextScene.resourceManager = this.resourceManager;
  }
  IntroScene.prototype.keyPressed = function(k) {
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.stop();
    }
  };
  IntroScene.prototype.mousePressed = function() {
      this.stop();
      return false;
  };

  var GameScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);

    this.nextScene = this;

    this.arrows = [p.UP_ARROW, p.DOWN_ARROW, p.LEFT_ARROW, p.RIGHT_ARROW];
    this.dismissedInARow = 0;
  };
  GameScene.prototype = Object.create(EDB.Scene.prototype);
  GameScene.resources = [
    {'type': 'sound', 'name': 'music', 'path': 'data/Ozzed_-_8-bit_Party.mp3'},
    {'type': 'sound', 'name': 'simpleBell', 'path': 'data/Pickup_Coin14.wav'},
    {'type': 'sound', 'name': 'successBell', 'path': 'data/Randomize7.wav'},
    {'type': 'font', 'name': 'arcadeFont', 'path': 'data/04B_03__.TTF'},
    {'type': 'sound', 'name': 'dismissSound', 'path': 'data/Jump6.wav'},
  ];
  GameScene.prototype.resourcesList = function() {
    return GameScene.resources;
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
      p5.textFont(game.arcadeFont);
      p5.strokeWeight(2);
      p5.stroke(20);
      p5.fill(this.backgroundColor.copy().lighter().p5color(p5));
      p5.text(this.tag.slice(0, this.maxText), this.textX, this.textY);
    };
    TagCanvasElement.prototype.highlight = function() {
      var tagcanvas = this;
      this.backgroundColor.lighter();
      window.setTimeout(function() {
        tagcanvas.backgroundColor.darker();
      }, 100);
    };
    TagCanvasElement.prototype.addElement = function() {
      this.idScene = game.addElement(this) + 1;
    };
    TagCanvasElement.prototype.removeElement = function() {
      game.removeElement(this.idScene);
    };
    TagCanvasElement.prototype.getPosition = function(i) {
      return {
        x: this.position.x + game.p5.width * .075 + i * this.deltaX ,
        y: this.position.y + game.p5.width * .075 + i * this.deltaY ,
      };
    };
    TagCanvasElement.prototype.addPicture = function(pic) {
      this.pictures.push(pic);
    };
    TagCanvasElement.prototype.belongs = function(x, y) {
      return x >= this.position.x && x <= this.position.x + this.width && y >= this.position.y && y <= this.position.y + this.height;
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

    game.librarian = new LibrarianSprite(game.p5.width, game.p5.height * .7);
    var x = game.p5.width * .15;
    game.clock = new Clock(game.music, x + 2, x + 10, game.p5.width - x *2 - 4);
    game.addElement(game.clock);
  };
  GameScene.prototype.substituteCanvas = function(direction) {
    var game = this;
    if (selectedTags.length + usedTags.length === tags.length) {
      usedTags = [];
    }

    var oldTag = _.find(selectedTags, function(tc) {
      return tc.tag == game.tagCanvases[direction].tag;
    });
    usedTags.push(oldTag);
    var oldIndex = selectedTags.indexOf(oldTag);
    selectedTags.splice(oldIndex, 1);
    var newTag = _.sample(_.filter(tags, function(tc) {
      return selectedTags.indexOf(tc) === -1 && usedTags.indexOf(tc) === -1;
    }));
    selectedTags.push(newTag);

    this.successBell.play();

    this.changeTagCanvas(direction, newTag);
  };
  GameScene.prototype.update = function() {
    EDB.Scene.prototype.update.call(this);
    var game = this;
    if (game.music.isLoaded() && !game.music.isPlaying()) {
      game.music.play();
      game.time0 = game.p5.millis();
    }
    if (!this.librarian.loaded && flickrFeeder.available()) {
      var librarian = this.librarian;
      var path = flickrFeeder.getTagged().path();
      this.librarian.setPicture(path).then(function() {
        if (!librarian.loaded) {
          librarian.addElements(game);
        }
      });
    }
    if (this.librarian.tooLeft(this.p5)) {
      this.librarian.setPicture(flickrFeeder.getUntagged().path());
    }
    this.secs = (this.p5.millis() - this.time0) / 1000;
    if (this.secs >= this.music.duration()) {
      this.stop();
    }
    _.each(this.arrows, function(arrow) {
      if (game.tagCanvases[arrow].full()) {
        game.substituteCanvas(arrow);
      }
    });
    return this.nextScene;
  };
  GameScene.prototype.dismiss = function() {
    this.librarian.setPicture(flickrFeeder.getTagged().path());
    this.usedImages++;
    this.dismissedInARow++;
    this.dismissSound.play();
    if (this.dismissedInARow >= 5) {
      this.dismissedInARow = 0;
      var removables = [];
      var minLength = _.reduce(this.tagCanvases, function(memo, tc) {
        if (tc !== undefined) {
          return Math.min(memo, tc.pictures.length);
        }
        else {
          return memo;
        }

      }, 100);
      for (d of this.arrows) {
        if (this.tagCanvases[d].pictures.length === minLength) {
          removables.push(d);
        }
      }
      var direction = _.sample(removables);
      this.substituteCanvas(direction);
    }
  };
  GameScene.prototype.assignTag = function(direction) {
    this.simpleBell.play();
    var picture = this.librarian.getPicture();
    this.librarian.setPicture(flickrFeeder.getTagged().path());
    this.tagCanvases[direction].highlight();
    this.tagCanvases[direction].addPicture(picture);
    this.dismissedInARow = 0;
  };
  GameScene.prototype.keyPressed = function(k) {
    if (this.librarian && this.librarian.loading) {
      return;
    }
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.dismiss();
    }
    if (this.arrows.indexOf(this.p5.keyCode) !== -1) {
      this.assignTag(this.p5.keyCode);
    }
  };
  GameScene.prototype.mousePressed = function() {
    if (this.librarian && this.librarian.loading) {
      return;
    }
    for(direction of this.arrows) {
      if (this.tagCanvases[direction].belongs(this.p5.mouseX, this.p5.mouseY)) {
        this.assignTag(direction);
        return;
      }
    }
    this.dismiss();
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

  var game = EDB.createp5Game([IntroScene, GameScene], 0);
  //var game = EDB.createp5Game([PaletteScene]);
  var myp5 = new p5(game);
})();
