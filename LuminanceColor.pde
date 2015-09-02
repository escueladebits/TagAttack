/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class LuminanceColor {
  
  private int index,
              luminance;
              
  private LuminancePalette palette;
              
  public LuminanceColor(int index, LuminancePalette palette) {
    this.luminance = 0;
    this.index = index;
    this.palette = palette;
  }
  
  public color getColor() {
    RGB c = palette.getColor(index, luminance);
    return color(c.R, c.G, c.B);
  }
  
  public LuminanceColor copy() {
    LuminanceColor copy = new LuminanceColor(index, palette);
    copy.luminance = luminance;
    return copy;
  }
  
  public LuminanceColor lighter() {
    luminance = ++luminance > 3 ? --luminance : luminance;
    return this;
  }
  
  public LuminanceColor darker() {
    luminance = --luminance < 0 ? ++luminance : luminance;
    return this;
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