/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class IntroScene extends Scene {
  
  Sprite yuriFox,
         picture;
  
  IntroScene() {
    yuriFox = new Sprite("yurifox.png", 32, 32);
    yuriFox.scale = 2;
    yuriFox.x = width * .5 - yuriFox.width * .5 * yuriFox.scale;
    yuriFox.y = height * .75;
    
    yuriFox.setFPS(12);
    yuriFox.addFrame(0, 0);
    yuriFox.addFrame(0, 1);
    yuriFox.addFrame(0, 2);
    yuriFox.addFrame(0, 3);
    
    picture = new Sprite("10997265356_0f8e16452f_q.jpg");
    picture.scale = 1;
    picture.x = width * .5 - picture.width * .5 * picture.scale;
    picture.y = yuriFox.y - picture.height * picture.scale + 10;
  }
  
  Scene update() {
    picture.update();
    yuriFox.update();
    return this;
  }
  
  void draw() {    
    background(200);
    picture.draw();
    yuriFox.draw();
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
    