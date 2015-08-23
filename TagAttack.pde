import processing.sound.*;

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

Scene currentScene, introScene, gameScene;

void setup() {
  size(800, 600);
  gameScene = new GameScene(this);
  introScene = new IntroScene(this, gameScene);
  currentScene = introScene;
}

void draw() {
  currentScene = currentScene.update();
  currentScene.draw();
}

void keyPressed() {
  currentScene.keyPressed();
}