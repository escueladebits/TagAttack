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

    this.init = function(speed) {
      var yuriImg = this.yuriSprite.img;
      var pictureImg = this.picture.img;
      var position = {
        x : x,
        y : y,
      };
      this.yuriSprite.position = position;
      this.picture.position.x = position.x;
      this.picture.position.y = position.y - yuriImg.height * .5 * this.yuriSprite.scale - pictureImg.height * .5 * this.picture.scale + 10 * this.picture.scale;
      this.setVelocity(speed);
      this.show();
    };
    this.setPicture = function(picturePath, speed) {
      var librarian = this;
      if (!this.loading) {
        this.loading = true;
        var promisePicture = EDB.loadEDBImage(picturePath);
        if (this.picture.img !== null) {
          this.hide();
          this.pause();
        }
        return Promise.all([promiseAnimation, promisePicture]).then(function(results) {
          librarian.picture.img = results[1];
          librarian.loading = false;
          librarian.init(speed);
        });
      }
      else {
        return new Promise(function(response, reject) { reject(); });
      }
    };
    this.setElement = function(element, width, height) {
      var librarian = this;
      this.picture = element;
      this.picture.img = {
        width: width,
        height: height,
      };
      return promiseAnimation.then(function() {
        librarian.init(-8);
      });
    };
  }
  LibrarianSprite.prototype.setVelocity = function(v) {
    this.yuriSprite.velocity = this.picture.velocity = {
      x: v,
      y: 0,
    }
  };
  LibrarianSprite.prototype.hide = function() {
    this.yuriSprite.hide();
    this.picture.hide();
  };
  LibrarianSprite.prototype.show = function() {
    this.yuriSprite.show();
    this.picture.show();
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

    this.nextScene = this;
    this.ready = false;

    this.walkingLeft = true;
    this.flickrFeeder = new FlickrFeeder(tags);
  };
  IntroScene.prototype = Object.create(EDB.Scene.prototype);

  IntroScene.resources = [
    {'type': 'sound', 'name': 'introMusic', 'path': 'data/Ozzed_-_Satisfucktion.mp3'},
    {'type': 'font', 'name': 'arcadeFont', 'path': 'data/04B_03__.TTF'},
  ];
  IntroScene.prototype.resourcesList = function() {
    return IntroScene.resources;
  };
  IntroScene.prototype.start = function() {
    EDB.Scene.prototype.start.call(this);
    this.gameScene = new GameScene(this.p5);
    this.levelsScene = new SelectLevelScene(this.p5);
    this.levelsScene.gameScene = this.gameScene;

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
    if (this.stopped) {
      return this.nextScene;
    }
    if (this.introMusic.isLoaded() && !this.introMusic.isPlaying()) {
      this.introMusic.play();
    }
    if (!this.yuri.loaded && this.flickrFeeder.available() && !this.yuri.loading) {
      var yuri = this.yuri;
      var intro = this;
      var path = this.flickrFeeder.getUntagged().path();
      this.yuri.setPicture(path, -2).then(function() {
        if (!yuri.loaded) {
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
    EDB.Scene.prototype.stop.call(this);
    this.introMusic.stop();
    this.nextScene = this.levelsScene;
    this.nextScene.resourceManager = this.resourceManager;
    this.gameScene.flickrFeeder = this.flickrFeeder;
  };
  IntroScene.prototype.keyPressed = function(k) {
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.stop();
    }
  };
  IntroScene.prototype.mousePressed = function() {
      this.stop();
      return false;
  };
  IntroScene.prototype.touchEnded = function() {
    this.mousePressed();
  }
  IntroScene.prototype.reinit = function() {
    this.nextScene = this;
  };

  var SelectLevelScene = function(p) {
    EDB.Scene.call(this, p, 800, 600)
    this.backgroundColor = (new EDB.NESPalette.ColorCreator(6, 3)).p5color(p);
    this.textColor = (new EDB.NESPalette.ColorCreator(0, 0)).p5color(p);
    this.selectedColor = (new EDB.NESPalette.ColorCreator(4, 1)).p5color(p);

    this.nextScene = this;
    this.levels = [
      {
        name: 'Level 1',
        speed: 4,
        tags: ['portrait', 'people', 'architecture', 'map',],
        taglines: [
          'First steps',
          'Use only common tags',
          'Low speed',
          'Learn the basics',
        ],
      },
      {
        name: 'Level 2',
        speed: 6,
        tags: ['portrait', 'people', 'architecture', 'map', 'flora', 'fauna',],
        taglines: [
          'Become a professional',
          'Use common and uncommon tags',
          'Medium speed',
          'Tag as many as you can',
        ],
      },
      {
        name: 'Level 3',
        speed: 9,
        tags: ['portrait', 'people', 'architecture', 'map', 'flora', 'fauna', 'heraldry', 'music', 'cycling'],
        taglines: [
          'High speed',
          'Domain rare & arcane tags',
          'Become a master librarian',
        ],
      },
    ];
    this.selectedLevel = -1;
  }
  SelectLevelScene.resources = [
    {'type': 'font', 'name': 'arcadeFont', 'path': 'data/04B_03__.TTF'},
    {'type': 'sound', 'name': 'dismissSound', 'path': 'data/Jump6.wav'},
    {'type': 'sound', 'name': 'simpleBell', 'path': 'data/Pickup_Coin14.wav'},
  ];
  SelectLevelScene.prototype = Object.create(EDB.Scene.prototype);
  SelectLevelScene.prototype.resourcesList = function() {
    return SelectLevelScene.resources;
  };
  SelectLevelScene.prototype.stop = function() {
    this.nextScene = this.gameScene;
    this.nextScene.resourceManager = this.resourceManager;
    this.nextScene.level = this.levels[this.selectedLevel];
  };
  SelectLevelScene.prototype.draw = function() {
    if (this.arcadeFont !== undefined) {
      EDB.Scene.prototype.draw.call(this);
      this.p5.textFont(this.arcadeFont);
      this.p5.textSize(48);
      for (var i = 0; i < this.levels.length; i++) {
        var third = this.p5.width * .33;
        var x = (i+1) * third - this.p5.textWidth(this.levels[i].name) * 1.3;
        this.p5.fill(this.textColor);
        if (i === this.selectedLevel) {
          this.p5.fill(this.selectedColor);
        }
        this.p5.text(this.levels[i].name, x, this.p5.height *.3);
      }

      if (this.selectedLevel !== -1) {
        this.p5.fill(this.textColor);
        this.p5.textSize(32);
        var levelFeatures = _.map(this.levels[this.selectedLevel].taglines, function(l) { return '- ' + l;}).join('\n\n');
        this.p5.text(levelFeatures, this.p5.width * .20, this.p5.height * .5);
      }
    }
  };
  SelectLevelScene.prototype.keyPressed = function() {
    if (this.p5.keyCode == this.p5.LEFT_ARROW) {
      this.selectedLevel--;
      this.dismissSound.play();
    }
    else if (this.p5.keyCode === this.p5.RIGHT_ARROW) {
      this.selectedLevel++;
      this.dismissSound.play();
    }
    if (this.selectedLevel < 0) {
      this.selectedLevel = this.levels.length - 1;
    }
    else if (this.selectedLevel === this.levels.length) {
      this.selectedLevel = 0;
    }
    if (this.p5.key === 'z' || this.p5.key === 'Z') {
      if (this.selectedLevel !== -1) {
        this.simpleBell.play();
        this.stop();
      }
    }
    return false;
  }

  var GameScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);

    this.nextScene = this;

    this.arrows = [p.UP_ARROW, p.DOWN_ARROW, p.LEFT_ARROW, p.RIGHT_ARROW];
    this.dismissedInARow = 0;
    this.untaggedInARow = 0;
    this.performanceRatio = 1;

    this.row = 0;
    this.score = {
      picturesTagged: 0,
      in_a_row: [],
      mistakes: 0,
    };

    this.uuid = EDB.uuid();
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
    EDB.Scene.prototype.start.call(this);

    this.gameoverScene = new GameOverScene(this.p5);
    this.gameoverScene.resourceManager = this.resourceManager;

    var game = this;

    this.availableTags = _.filter(tags, function(t) { return game.level.tags.indexOf(t.tag) !== -1;});
    var numberTags = this.availableTags.length > 4 ? 4 : 2;
    this.selectedTags = _.sortBy(this.availableTags, function() { return Math.random();}).slice(0, numberTags);
    this.selectedTags = _.sortBy(this.selectedTags, function(t) { return 1 / t.tag.length;});
    this.usedTags = [];

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
    this.availableCanvases = this.availableTags.length > 4 ? game.arrows : [this.p5.UP_ARROW, this.p5.DOWN_ARROW];
    _.each(this.availableCanvases, function(direction, i) {
      var color = new EDB.NESPalette.ColorCreator(game.selectedTags[i].index, game.selectedTags[i].lum);
      game.tagCanvases[direction] = new (TagCanvasCreator(direction))(game.selectedTags[i].tag, color, game.arcadeFont);
      game.tagCanvases[direction].addElement();
    });

    game.librarian = new LibrarianSprite(game.p5.width, game.p5.height * .7);
    var x = game.p5.width * .15;
    game.clock = new Clock(game.music, x + 2, x + 10, game.p5.width - x *2 - 4);
    game.addElement(game.clock);
  };
  GameScene.prototype.substituteCanvas = function(direction) {
    var game = this;
    if (this.selectedTags.length + this.usedTags.length === this.availableTags.length) {
      this.usedTags = [];
    }

    var oldTag = _.find(this.selectedTags, function(tc) {
      return tc.tag == game.tagCanvases[direction].tag;
    });
    this.usedTags.push(oldTag);
    var oldIndex = this.selectedTags.indexOf(oldTag);
    this.selectedTags.splice(oldIndex, 1);
    var newTag = _.sample(_.filter(this.availableTags, function(tc) {
      return game.selectedTags.indexOf(tc) === -1 && game.usedTags.indexOf(tc) === -1;
    }));
    this.selectedTags.push(newTag);

    this.successBell.play();

    this.changeTagCanvas(direction, newTag);
  };
  GameScene.prototype.update = function() {
    EDB.Scene.prototype.update.call(this);
    if (this.stopped) {
      return this.nextScene;
    }
    var game = this;
    if (game.music.isLoaded() && !game.music.isPlaying()) {
      game.music.play();
      game.time0 = game.p5.millis();
    }
    if (!this.librarian.loaded && this.flickrFeeder.available()) {
      var librarian = this.librarian;
      var path = this.getNextImage();
      this.librarian.setPicture(path, -this.level.speed).then(function() {
        if (!librarian.loaded) {
          librarian.addElements(game);
        }
      });
    }
    if (this.librarian.tooLeft(this.p5)) {
      this.dismiss();
    }
    this.secs = (this.p5.millis() - this.time0) / 1000;
    if (this.secs >= this.music.duration() * .99) {
      this.stop();
    }
    _.each(this.availableCanvases, function(arrow) {
      if (game.tagCanvases[arrow].full()) {
        game.substituteCanvas(arrow);
      }
    });
    return this.nextScene;
  };
  GameScene.prototype.getNextImage = function() {
    var source = null;
    if (this.untaggedInARow++ < this.performanceRatio) {
      this.backgroundColor = (new EDB.NESPalette.ColorCreator(6, 3)).p5color(this.p5);
      source = this.flickrFeeder.getUntagged();
    }
    else {
      this.untaggedInARow = 0;
      if (this.flickrFeeder.taggedAvailable()) {
        this.backgroundColor = (new EDB.NESPalette.ColorCreator(4, 3)).p5color(this.p5);
        source = this.flickrFeeder.getTagged();
      }
      else {
        this.backgroundColor = (new EDB.NESPalette.ColorCreator(13, 3)).p5color(this.p5);
        source = this.flickrFeeder.getUntagged();
      }
    }
    this.currentFlickrPicture = source;
    this.currentFlickrPicture.timestamp = this.p5.millis();
    return source.path();
  };
  GameScene.prototype.positiveTagging = function() {
    this.performanceRatio++;
  };
  GameScene.prototype.negativeTagging = function() {
    this.performanceRatio = this.performanceRatio === 1 ? 1 : Math.floor(this.performanceRatio / 2);
    // play sound
    this.score.mistakes++;
  };
  GameScene.prototype.closeRow = function() {
    if (this.row > 1) {
      if (this.score.in_a_row[this.row] === undefined) {
        this.score.in_a_row[this.row] = 0;
      }
      this.score.in_a_row[this.row]++;
    }
    this.row = 0;
  };
  GameScene.prototype.dismiss = function() {
    this.log('dismissed');
    this.closeRow();
    if (this.untaggedInARow === 0) {
      if (_.intersection(_.map(game.selectedTags, 'tag'), this.currentFlickrPicture.tags).length === 0) {
        this.positiveTagging();
      }
      else {
        this.negativeTagging();
      }
    }
    this.librarian.setPicture(this.getNextImage(), -this.level.speed);
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
    var chosenTag = this.tagCanvases[direction].tag;
    this.log(chosenTag);
    if (this.untaggedInARow === 0) {
      if (this.currentFlickrPicture.tags.indexOf(chosenTag) !== -1) {
        this.positiveTagging();
      }
      else {
        this.negativeTagging();
      }
    }
    this.simpleBell.play();
    var picture = this.librarian.getPicture();
    this.librarian.setPicture(this.getNextImage(), -this.level.speed);
    this.tagCanvases[direction].highlight();
    this.tagCanvases[direction].addPicture(picture);
    this.dismissedInARow = 0;

    this.score.picturesTagged++;
    this.row++;
  };
  GameScene.prototype.totalScore = function(score) {
    var base = score.picturesTagged * 9 - score.mistakes * 5;
    base += _.reduce(score.in_a_row, function(memo, value, index) {
      if (value !== undefined) {
        return memo + 3 * value * index;
      }
      else {
        return memo;
      }
    }, 0);
    return base;
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
  GameScene.prototype.positionControl = function(x, y) {
    if (this.librarian && this.librarian.loading) {
      return;
    }
    for(direction of this.arrows) {
      if (this.tagCanvases[direction].belongs(x, y)) {
        this.assignTag(direction);
        return;
      }
    }
    this.dismiss();
  };
  GameScene.prototype.mousePressed = function() {
    this.positionControl(this.p5.mouseX, this.p5.mouseY);
  };
  GameScene.prototype.touchEnded = function() {
    if (this.p5.touches.length === 1) {
      this.positionControl(this.p5.touchX, this.p5.touchY);

    }
  };
  GameScene.prototype.stop = function() {
    EDB.Scene.prototype.stop.call(this);
    this.music.stop();
    this.nextScene = this.gameoverScene;
    this.gameoverScene.score = this.score;
  };
  GameScene.prototype.reinit = function() {
    this.nextScene = this;
  };
  GameScene.prototype.log = function(tag) {
    var log = {
      game_id: this.uuid,
      timestamp: this.currentFlickrPicture.timestamp,
      action_timestamp: this.p5.millis(),
      flickrid: this.currentFlickrPicture.id,
      assigned_tag: tag,
      speed: 0,
      level: 0,
      row: this.row,
      tags: this.currentFlickrPicture.tags,
    };
    console.log(log);
    _LTracker.push(log);
  };

  function PaletteScene(p) {
    EDB.Scene.call(this, p, 320, 200);
    this.nextScene = this;
  }
  PaletteScene.resources = [];
  PaletteScene.prototype = Object.create(EDB.Scene.prototype);
  PaletteScene.prototype.start = function() {
    EDB.Scene.prototype.start.call(this);
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

  var GameOverScene = function(p) {
    EDB.Scene.call(this, p, 800, 600);
    this.backgroundColor = (new EDB.NESPalette.ColorCreator(10, 2)).p5color(p);
    this.scoreboardBackgroundColor = (new EDB.NESPalette.ColorCreator(8, 3)).p5color(p);

    this.nextScene = this;

    this.score = {
      picturesTagged: 16,
      mistakes: 2,
      in_a_row: [undefined, undefined, 2, undefined, 1, 1],
    }
  }
  GameOverScene.prototype = Object.create(EDB.Scene.prototype);
  GameOverScene.resources = [
    {'type': 'font', 'name': 'arcadeFont', 'path': 'data/04B_03__.TTF'},
    {'type': 'sound', 'name': 'gameoverMusic', 'path': 'data/Ozzed_-_Termosdynamik.mp3'},
  ];
  GameOverScene.prototype.resourcesList = function() {
    return GameOverScene.resources;
  };
  GameOverScene.prototype.start = function() {
    var gameover = this;
    EDB.Scene.prototype.start.call(this);

    this.gameoverMusic.play();
    this.time0 = this.p5.millis();
    this.introScene = new IntroScene(this.p5);
    this.introScene.resourceManager = this.resourceManager;

    var scoreBoard = new EDB.p5Element();
    scoreBoard.backgroundColor = (new EDB.NESPalette.ColorCreator(8, 3)).p5color(this.p5);
    scoreBoard.draw = function(p5) {
      this.width = gameover.p5.width * .7;
      this.height = gameover.p5.height * .8;

      p5.noStroke();
      p5.fill(this.backgroundColor);
      p5.rectMode(p5.CENTER);
      p5.rect(this.position.x, this.position.y, this.width, this.height);

      var msg = 'Game Over';
      p5.fill(155);
      p5.noStroke();
      p5.textFont(gameover.arcadeFont);
      p5.textSize(72);
      p5.text(msg, this.position.x - p5.textWidth(msg) * .5, this.position.y - this.height * .35);

      var leftMargin = this.position.x - this.width * .4;
      var baseScore = gameover.score.picturesTagged * 9;
      fullCanvases1 = 'Tagged items: ' + gameover.score.picturesTagged;
      fullCanvases2 =  gameover.score.picturesTagged + ' x 9 = ' + baseScore;
      p5.textSize(32);
      p5.text(fullCanvases1 + "\n" + fullCanvases2, leftMargin, this.position.y - this.height * .25);

      var penalization = gameover.score.mistakes * 3;
      warnings = 'Warnings: ' + gameover.score.mistakes +'\n' + gameover.score.mistakes + ' x -3 = -' + penalization;
      p5.text(warnings, leftMargin, this.position.y - this.height * .07);

      var bonus = _.reduce(gameover.score.in_a_row, function(memo, value, index) {
        return value !== undefined ? memo + value * index: memo;
      }, 0);
      var bonusScore = bonus * 7;
      items = 'Bonus: bonus\n' + bonus + ' x 7 = ' + bonusScore;
      p5.text(items, leftMargin, this.position.y + this.height * .1);

      score = baseScore + bonusScore - penalization;
      total = 'Total: \n' + baseScore + ' + ' + bonusScore + ' - ' + penalization + ' = ' + score;
      p5.textSize(45);
      p5.text(total, leftMargin, this.position.y + this.height * .35);
    };

    this.yuri = new LibrarianSprite(this.p5.width, this.p5.height * .9);
    this.yuri.setElement(scoreBoard, this.p5.width * .7, this.p5.height * .8).then(function() {
      gameover.yuri.setVelocity(-2);
      gameover.yuri.addElements(gameover);
    });

  };
  GameOverScene.prototype.actionEnding = function() {
    if (this.yuri.yuriSprite.velocity.x === 0 && this.yuri.yuriSprite.position.x <= this.p5.width * .5) {
      this.stop();
    }
  };
  GameOverScene.prototype.keyPressed = function(k) {
    if (this.p5.key == 'z' || this.p5.key == 'Z') {
      this.actionEnding();
    }
  };
  GameOverScene.prototype.mousePressed = function() {
    this.actionEnding();
  };
  GameOverScene.prototype.touchEnded = function() {
    if (this.p5.touches.length === 1) {
      this.actionEnding();
    }
  };
  GameOverScene.prototype.stop = function() {
    EDB.Scene.prototype.stop.call(this);
    this.nextScene = this.introScene;
    // music stop
    this.gameoverMusic.stop();
  };
  GameOverScene.prototype.update = function() {
    EDB.Scene.prototype.update.call(this);
    if (this.stopped) {
      return this.nextScene;
    }
    if (this.yuri.yuriSprite.position.x <= this.p5.width * .5) {
      this.yuri.pause();
    }
    if (this.p5.millis() - this.time0 > this.gameoverMusic.duration() * 1000) {
      this.stop();
    }
    return this.nextScene;
  };

  var game = EDB.createp5Game([IntroScene, SelectLevelScene, GameScene, GameOverScene], 0);
  //var game = EDB.createp5Game([PaletteScene]);
  var myp5 = new p5(game);
})();
