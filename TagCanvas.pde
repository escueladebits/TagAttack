/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class TagCanvas {
  float w, h;  
  float x, y;
  float textX, textY;

  String tag;
  ArrayList minis;
  float deltaX, deltaY;
  
  LuminanceColor c;
  
  float wide;
  PFont font;
  
  TagCanvas(int sector, String tag, float wide, PFont font, LuminanceColor col) {
    this.wide = wide;
    this.font = font;
    minis = new ArrayList();
    this.tag = tag;
    c = col;

    if (sector == UP) {
      x = wide;
      y = 0;
      this.w = width - wide;
      this.h = wide;      
      textX = x + 0.8 * this.w;
      textY = y + 0.35 * this.h;
      deltaX = wide + 0.5;
      deltaY = 0;
    }
    if (sector == DOWN) {
      x = 0;
      y = height - wide;
      this.w = width - wide;
      this.h = wide;
      textX = x + 0.02 * this.w;
      textY = y + 0.35 * this.h;
      deltaX = wide + 0.5;
      deltaY = 0;
    }
    if (sector == LEFT) {
      x = 0;
      y = 0;
      w = wide;
      this.h = height - wide;
      this.w = wide;
      textX = x + 0.3 * this.w;
      textY = y + 0.1 * this.h;
      deltaX = 0;
      deltaY = wide + 0.5;
    }
    if (sector == RIGHT) {
      x = width - wide;
      y = wide;
      this.h = height - wide;
      this.w = wide;
      textX = x + 0.3 * this.w;
      textY = y + 0.95 * this.h;
      deltaX = 0;
      deltaY = wide + 0.5;
    }    
  }
  
  void update() {
    for (int i = 0; i < minis.size(); i++) {
      Sprite spr = (Sprite)minis.get(i);
      spr.update();     
    }
  }
  
  void draw() {
    noStroke();
    textFont(font, 32);
    fill(c.getColor());
    rect(this.x, this.y, this.w, this.h);    

    for (int i = 0; i < minis.size(); i++) {
      Sprite spr = (Sprite)minis.get(i);
      spr.draw();     
    }

    fill(c.copy().lighter().getColor());
    text(tag, textX, textY);
    noFill();
  }
  
  void addImage(Sprite img) {
    Sprite spr = img.copy();    
    spr.scale = .8;
    int i = minis.size();
    spr.x = 0.05 * wide + this.x + i * this.deltaX;
    spr.y = 0.05 * wide + this.y + i * this.deltaY;
    img.animate(spr, 500);
    img.setFPS(12);
    minis.add(img); 
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