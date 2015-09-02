/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class LibrarianSprite extends Sprite {
  
  Sprite librarian;
  Sprite picture;
  
  int[] framesLeft = {0, 1, 2, 3},
        framesRight = {4, 5, 6, 7};

  LibrarianSprite(String filename, int w, int h) {
    librarian = new Sprite(filename, 32, 32);
    this.width = w;
    this.height = h;
    setupLibrarian();
  }
  
  private void setupLibrarian() {
    librarian.scale = 2;
    librarian.x = width - librarian.width * .5 * librarian.scale;
    librarian.setFPS(12);
    setupAnimation(framesLeft);
  }

  private void setupAnimation(int[] set) {
    for (int i = 0; i < set.length; i++) {
      librarian.addFrame(0, set[i]);
    }
  }
  
  void setY (float y) {
    this.y = librarian.y = y;
  }

  void setupPicture(String filename) {
    setupPicture(filename, 1);
  }
  
  void setupPicture(String filename, float scale) {
    picture = new Sprite(filename);
    picture.scale = scale;
    picture.x = width - picture.width * .5 * picture.scale;
    picture.y = librarian.y - picture.height * picture.scale + 10;
  }
  
  private void moveLeft() {
    moveX(0, -1, 5000);
  }

  private void moveRight() {
    moveX(width + picture.width, 1, 5000);
  }

  private void moveX (float destiny, int delta, float time) {
    Sprite librarianFinal = librarian.copy();
    librarianFinal.x = destiny - picture.width * .5 * picture.scale - librarian.width * .5 * librarian.scale;
    Sprite pictureFinal = picture.copy();
    pictureFinal.x = destiny - picture.width * picture.scale;

    librarian.animate(librarianFinal, time);
    picture.animate(pictureFinal, time);
  }

  void update() {
    picture.update();
    librarian.update();

    if (librarian.x <= 0) {
      flipLibrarian();
      moveRight();
    }
    if (librarian.x + librarian.width * librarian.scale * .5 >= width) {
      flipLibrarian();
      moveLeft();
    }
  }
  
  private void flipLibrarian() {
    Frame f = (Frame)librarian.animation.get(librarian.currentFrame);
    librarian.cleanAnimation();
    int[] framesSet;
    if (f.j < 4) {
      framesSet = framesRight;
    }
    else {
      framesSet = framesLeft;
    }
    setupAnimation(framesSet);
  }
  
  void draw() {
    picture.draw();
    librarian.draw();
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