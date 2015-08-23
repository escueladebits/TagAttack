/*
  Copyright 2015 Antonio Jesús Sánchez Padial

  See License info at the end of the file.
*/

SoundFile introMusic;

class IntroScene extends Scene {

  PFont arcadeFont;

  Sprite yuriFox,
         picture;

  int[] framesYuriLeft = {0, 1, 2, 3},
        framesYuriRight = {4, 5, 6, 7};

  Scene nextScene;
  boolean exit;

  BlinkerText blinker;

  IntroScene(TagAttack app, Scene nextScene) {
    super(app);
    loadItems();

    this.nextScene = nextScene;
    exit = false;

    setupYuriFox();
    setupPicture();

    blinker = createBlinker();

    startScene();
  }

  private void loadItems() {
    arcadeFont = loadFont("04b03-48.vlw");
    introMusic = new SoundFile(app, "Ozzed_-_Satisfucktion.mp3");
    yuriFox = new Sprite("yurifox.png", 32, 32);
    picture = new Sprite("10997265356_0f8e16452f_q.jpg");
  }

  private void setupYuriFox() {
    yuriFox.scale = 2;
    yuriFox.x = width - yuriFox.width * .5 * yuriFox.scale;
    yuriFox.y = height * .75;

    yuriFox.setFPS(12);
    setupYuriAnimation(framesYuriLeft);
  }

  void setupYuriAnimation(int[] set) {
    for (int i = 0; i < set.length; i++) {
      yuriFox.addFrame(0, set[i]);
    }
  }

  private void setupPicture() {
    picture.scale = 1;
    picture.x = width - picture.width * .5 * picture.scale;
    picture.y = yuriFox.y - picture.height * picture.scale + 10;
  }

  private BlinkerText createBlinker() {
    BlinkerText b = new BlinkerText(3);
    b.text = "Press <START>";
    b.x = width * .32;
    b.y = height * .47;
    b.size = 40;
    return b;
  }

  private void startScene() {
    moveLeft();
    introMusic.play();
  }

  private void moveLeft() {
    moveX(0, -1, 5000);
  }

  private void moveRight() {
    moveX(width + picture.width, 1, 5000);
  }

  private void moveX (float destiny, int delta, float time) {
    Sprite yuriFinal = yuriFox.copy();
    yuriFinal.x = destiny - picture.width * .5 * picture.scale - yuriFox.width * .5 * yuriFox.scale;
    Sprite pictureFinal = picture.copy();
    pictureFinal.x = destiny - picture.width * picture.scale;

    yuriFox.animate(yuriFinal, time);
    picture.animate(pictureFinal, time);
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
    if (!exit) {
      return this;
    }
    else {
      exit = false;
      introMusic.stop();
      return nextScene;
    }
  }
  
  private void flipYuriFox() {
    Frame f = (Frame)yuriFox.animation.get(yuriFox.currentFrame);
    yuriFox.cleanAnimation();
    int[] framesSet;
    if (f.j < 4) {
      framesSet = framesYuriRight;
    }
    else {
      framesSet = framesYuriLeft;
    }
   setupYuriAnimation(framesSet);
  }

  void draw() {
    background(240,208,176);

    displayTitle();
    blinker.draw();
    //blinker.apply(3);
    displayFooter();
    picture.draw();
    yuriFox.draw();
  }

  private void displayTitle() {
    textFont(arcadeFont);
    textSize(125);
    String title = "Tag Attack";
    text(title, width * .10, height * .283);
  }

  private void displayFooter() {
    textFont(arcadeFont);
    textSize(20);
    String footer = "Copyright 2015 Escuela de Bits, GPL Licensed";
    text(footer, width * .44, height * .97);
  }

  void keyPressed() {
    exit = true;
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