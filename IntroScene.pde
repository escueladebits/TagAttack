/*
  Copyright 2015 Antonio Jesús Sánchez Padial

  See License info at the end of the file.
*/

class IntroScene extends Scene {

  PFont arcadeFont;

  Sprite yuriFox,
         picture;

  int[] framesYuriLeft = {0, 1, 2, 3},
        framesYuriRight = {4, 5, 6, 7};

  IntroScene() {
    arcadeFont = loadFont("04b03-48.vlw");

    yuriFox = new Sprite("yurifox.png", 32, 32);
    yuriFox.scale = 2;
    yuriFox.x = width - yuriFox.width * .5 * yuriFox.scale;
    yuriFox.y = height * .75;

    yuriFox.setFPS(12);
    loadYuriAnimation(framesYuriLeft);

    picture = new Sprite("10997265356_0f8e16452f_q.jpg");
    picture.scale = 1;
    picture.x = width - picture.width * .5 * picture.scale;
    picture.y = yuriFox.y - picture.height * picture.scale + 10;

    moveLeft();
  }

  void moveX (float destiny, int delta, float time) {
    Sprite yuriFinal = yuriFox.copy();
    yuriFinal.x = destiny - picture.width * .5 * picture.scale - yuriFox.width * .5 * yuriFox.scale;
    Sprite pictureFinal = picture.copy();
    pictureFinal.x = destiny - picture.width * picture.scale;

    yuriFox.animate(yuriFinal, time);
    picture.animate(pictureFinal, time);
  }

  void moveLeft() {
    moveX(0, -1, 5000);
  }

  void moveRight() {
    moveX(width + picture.width, 1, 5000);
  }

  void loadYuriAnimation(int[] set) {
    for (int i = 0; i < set.length; i++) {
      yuriFox.addFrame(0, set[i]);
    }
  }

  void flipYuriFox() {
    Frame f = (Frame)yuriFox.animation.get(yuriFox.currentFrame);
    yuriFox.cleanAnimation();
    int[] framesSet;
    if (f.j < 4) {
      framesSet = framesYuriRight;
    }
    else {
      framesSet = framesYuriLeft;
    }
   loadYuriAnimation(framesSet);
  }

  Scene update() {
    picture.update();
    yuriFox.update();

    if (yuriFox.x <= 0) {
      flipYuriFox();
      moveRight();
    }
    if (yuriFox.x + yuriFox.width * yuriFox.scale * .5 >= width) {
      flipYuriFox();
      moveLeft();
    }
    return this;
  }
  
  void displayTitle() {
    textFont(arcadeFont);
    textSize(32);
    String subTitle = "Escuela de Bits presents";
    text(subTitle, width * .25, height * .15);
    textSize(80);
    String title = "Tag Attack";
    text(title, width * .25, height * .33);
  }

  void draw() {
    background(240,208,176);

    displayTitle();
    picture.draw();
    yuriFox.draw();
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