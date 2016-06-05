import ddf.minim.*;

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

Scene currentScene, introScene, gameScene, tunningScene;

LuminancePalette palette;

Minim minim;

FlickrFeeder feeder;

String[] tags = {
  "portrait",
  "map",
  "diagram",
  "people",
  "heraldry",
  "architecture",
  "music",
  "fauna",
  "flora",
  "cycling",
};

void setup() {
  size(800, 600);
  noSmooth();

  minim = new Minim(this);

  palette = new LuminancePalette(LuminancePalette.NES);
  gameScene = new GameScene(this, palette);
  introScene = new IntroScene(this, palette);
  tunningScene = new PaletteScene(this, palette);
  introScene.start(gameScene);
  currentScene = introScene;  
  
  feeder = new FlickrFeeder(
    "588ed2f326df81d5a7382e1bf64da098",
    "12403504%40N02",
    tags
    );
    
}

void draw() {
  Scene newScene = currentScene.update();

  if (newScene != currentScene) {    
    currentScene.stop();
    currentScene = newScene;
    currentScene.start();
  }
  currentScene = currentScene.update();
  currentScene.draw();
}

void keyPressed() {
  if ((key == 'R' || key == 'r') && currentScene != tunningScene) {
    currentScene.pause();
    tunningScene.start(currentScene);
    currentScene = tunningScene;
  }
  else {
    currentScene.keyPressed();
  }
}

void keyReleased() {
  currentScene.keyReleased();
}