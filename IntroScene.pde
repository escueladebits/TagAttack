/*
  Copyright 2015 Antonio Jesús Sánchez Padial

  See License info at the end of the file.
*/

AudioPlayer introMusic;

class IntroScene extends Scene {

  PFont arcadeFont;

  LibrarianSprite yuriFox;

  boolean exit;

  LuminanceColor backgroundColor;
  LuminanceColor textColor;

  IntroScene(TagAttack app, LuminancePalette palette) {
    super(app, palette);
    loadItems();
    backgroundColor = palette.createColor(6, 3);

    exit = false;

    yuriFox = new LibrarianSprite("yurifox.png", width, height);
    yuriFox.setY(.75 * height);
    yuriFox.setupPicture("10997265356_0f8e16452f_q.jpg");
  }

  private void loadItems() {
    arcadeFont = loadFont("04b03-48.vlw");
    introMusic = app.minim.loadFile("Ozzed_-_Satisfucktion.mp3");
  }

  private void startScene() {
    yuriFox.moveLeft();
    introMusic.play();
  }

  void start() {
    if (!pause) {
      startScene();
    }
    pause = false;
    textColor = palette.createColor(floor(random(1,12)), 1);
  }

  void stop() {
   introMusic.pause();
  };

  Scene update() {
    yuriFox.update();

    if (!exit) {
      return this;
    }
    else {
      exit = false;
      introMusic.pause();
      return otherScene;
    }
  }

  void draw() {
    background(backgroundColor.getColor());

    fill(textColor.getColor());
    displayTitle();    
    displayFooter();

    yuriFox.draw();

    displayBlinker();
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
  
  private void displayBlinker() {
    LuminanceColor blinkColor = palette.createColor(floor(random(1,14)), floor(random(0, 3)));
    fill(blinkColor.getColor());
    String text = "Press <START>";
    float x = width * .32;
    float y = height * .47;
    int size = 40;
    textSize(size);
    text(text, x, y);
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
