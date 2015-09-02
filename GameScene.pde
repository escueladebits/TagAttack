/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class GameScene extends Scene {
  
  Sprite img;
  TagCanvas[] canvases;
  SoundFile music;
  
  GameScene(TagAttack app) {
    super(app);
    img = new Sprite("10997265356_0f8e16452f_q.jpg");
    PFont arcadeFont = loadFont("04b03-48.vlw");
    float wide = .17 * width;

    setPicture();

    String[] tags = TagManager.access().getNRandomTags(4);
    canvases = new TagCanvas[4];
    canvases[0] = new TagCanvas(UP, tags[0], wide, arcadeFont);
    canvases[1] = new TagCanvas(DOWN, tags[1], wide, arcadeFont);
    canvases[2] = new TagCanvas(LEFT, tags[2], wide, arcadeFont);
    canvases[3] = new TagCanvas(RIGHT, tags[3], wide, arcadeFont);
  }
  
  private void setPicture() {
    img.scale = 2;
    img.x = width * .5 - img.width * img.scale * .5;
    img.y = height * .5 - img.height * img.scale * .5;
  }
  
  void start() {
    music = new SoundFile(app, "Ozzed_-_8-bit_Party.mp3");
    music.play();
    
    lib = new LibrarianSprite("yurifox.png", width, height);
    lib.setY(width * .47);
    lib.setupPicture("10997265356_0f8e16452f_q.jpg", 1.5);
    lib.moveLeft();
  }

  void stop() {
    music.stop();
  }

  Scene update() {
    lib.update();
    for (int i = 0; i < canvases.length; i++) {
      canvases[i].update();
    }
    return this;
  }
  
  void draw() {
    background(200);
    lib.draw();
    for (int i = 0; i < canvases.length; i++) {
      canvases[i].draw();
    }  
  }
  
  void keyPressed() {    
    canvases[0].addImage(img);
    img = new Sprite("10997290916_57a15cf58d_q.jpg");
    setPicture();
  }
}

/*
  This file is part of Tag Attack.
  
  Tag Attack is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Tag Attack is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
    