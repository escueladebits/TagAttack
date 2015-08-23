/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class BlinkerText {
 private float time0;
  private boolean blink;
  private float FPS;
  
  String text;
  float x, y;
  int size;
  
  BlinkerText(float FPS) {
    time0 = millis();
    blink = false;
    this.FPS = FPS;
    
    text = "default text";
    x = width * .5;
    y = height * .5;
    size = 48;
  }
  
  void draw() {
    if (millis() > time0 + 1000 / FPS) {
      blink = !blink;
      time0 = millis();
    }
    if (!blink) {
      textSize(size);
      text(text, x, y);
    }
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