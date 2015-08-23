/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/
class Frame {
  int i, j;
}

class Sprite {
  
  PImage spriteSheet;
  PImage[][] tiles;
  int width, height;
  int frameI, frameJ;

  float x, y;
  float scale;

  float FPS;
  float time0;
  float frameTime;

  ArrayList animation;
  int currentFrame;

  Sprite transformation;
  Sprite transformationOrigin;
  float transformationSpeed;
  float transformationTime0;

  Sprite() {
  }

  Sprite(String filename) {
    initAnimation();
    spriteSheet = loadImage(filename);
    this.width = spriteSheet.width;
    this.height = spriteSheet.height;
    
    tiles = new PImage[1][1];
    tiles[0][0] = spriteSheet;
    addFrame(0, 0);
  }

  private void initAnimation() {
    animation = new ArrayList();
    currentFrame = 0;
    this.setFPS(1);
  }

  Sprite (String filename, int width, int height) {
    initAnimation();
    spriteSheet = loadImage(filename);
    this.width = width;
    this.height = height;

    breakSpriteSheetInTiles();
  }

  private void breakSpriteSheetInTiles() {
    int sheetRows = spriteSheet.height / this.height;
    int sheetColumns = spriteSheet.width / this.width;
    tiles = new PImage[sheetRows][sheetColumns];
    for (int row = 0; row < sheetRows; row++) {
      for (int column = 0; column < sheetColumns; column++) {
        tiles[row][column] = createImage(this.width, this.height, ARGB);
        tiles[row][column].copy(spriteSheet, column * this.width, row * this.height, this.width, this.height, 0, 0, this.width, this.height);            
      }
    }
  }

  Sprite copy(){
    Sprite copy = new Sprite();
    copy.x = this.x;
    copy.y = this.y;
    return copy;
  }

  void animate(Sprite target, float speed) {
    transformationOrigin = copy();
    transformation = target;
    transformationTime0 = millis();
    transformationSpeed = speed + transformationTime0;
  }

  void setFPS(float FPS) {
    this.FPS = FPS;
    frameTime = 1000 / FPS;
    time0 = millis();
  }

  void addFrame(int i, int j) {
    Frame f = new Frame();
    f.i = i;
    f.j = j;
    animation.add(f);
  }

  void cleanAnimation() {
    animation = new ArrayList();
  }

  void update() {
    float t = millis();
    processAnimation(t);
    processTransformation(t);
  }

  private void processAnimation(float t) {
    if (animation.size() > 1) {
      if (t - time0 >= frameTime) {
        time0 = t;
        currentFrame = ++currentFrame == animation.size() ? 0 : currentFrame;
      }
    }
  }

  private void processTransformation(float t) {
    if (transformation != null) {
      if (t < transformationSpeed) {
        x = map(t, transformationTime0, transformationSpeed, transformationOrigin.x, transformation.x);
      }
    }
  }

  void draw() {
    imageMode(CORNER);
    Frame f = (Frame)animation.get(currentFrame);
    image(tiles[f.i][f.j], x, y, this.width * scale, this.height * scale);
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