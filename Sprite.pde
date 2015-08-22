/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class Sprite {
  
  PImage spriteSheet;
  PImage[][] tiles;
  int width, height;
  int frameI, frameJ;
  
  float x, y;
  float scale;
  
  Sprite(String filename) {
    spriteSheet = loadImage(filename);
    this.width = spriteSheet.width;
    this.height = spriteSheet.height;
    
    tiles = new PImage[1][1];
    tiles[0][0] = spriteSheet;
    frameI = frameJ = 0;
  }
  
  Sprite (String filename, int width, int height) {
    spriteSheet = loadImage(filename);
    this.width = width;
    this.height = height;

    int sheetRows = spriteSheet.height / this.height;
    int sheetColumns = spriteSheet.width / this.width;
    tiles = new PImage[sheetRows][sheetColumns];
    spriteSheet.loadPixels();
    for (int row = 0; row < sheetRows; row++) {
      for (int column = 0; column < sheetColumns; column++) {
        tiles[row][column] = createImage(this.width, this.height, ARGB);
        tiles[row][column].copy(spriteSheet, column * this.width, row * this.height, this.width, this.height, 0, 0, this.width, this.height);            
      }
    }    
    frameI = frameJ = 0;
  }
  
  void draw() {
    imageMode(CORNER);
    image(tiles[frameI][frameJ], x, y, this.width * scale, this.height * scale);
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