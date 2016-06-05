/*
  Copyright 2016 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class Clock {
  private int depth;
  private float x;
  private float y;
  private float width;
  private float musicDuration;
  
  Clock(AudioPlayer music, float x, float y, float width) {
    //EDB.p5Element.call(this);
    this.musicDuration = music.length() / 1000;
    this.depth = 100;
    /*
    this.position = {
      x : x,
      y : y,
    };
    */
    this.x = x;
    this.y = y;
    this.width = width;
   }
   
   public void draw(float secs) {
     //EDB.p5Element.prototype.draw.call(this, p5);
     fill(0, 0, 15, 200);
     rect(this.x, this.y, this.width, 15);
     color initColor = color(0, 255, 0, 200);
     color endColor = color(255, 0, 0, 200);
     colorMode(HSB);
     color printColor = color(map(secs, 0, this.musicDuration, hue(initColor), hue(endColor)), saturation(initColor), brightness(initColor), 200);
     fill(printColor);
     colorMode(RGB);
     noStroke();
     rect(this.x + 2, this.y + 2, this.width -4 - map(secs, 0, this.musicDuration, 0, this.width - 4), 11);
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