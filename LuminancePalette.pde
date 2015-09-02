/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

class LuminancePalette {
  
  static final public int NES = 1;
  
  private RGB[][] NEScolors;
  
  public LuminancePalette(int paletteType) {
    if (paletteType == NES) {
      initNES();
    }    
  }
  
  private void initNES() {
    // Colors chosen from https://en.wikipedia.org/wiki/List_of_video_game_console_palettes#Famicom.2FNES
    
    NEScolors = new RGB[4][];
    int luminance;
    // LUMINANCE 0
    luminance = 0;
    NEScolors[luminance] = new RGB[16];
    NEScolors[luminance][0] = new RGB(124,124,124);
    NEScolors[luminance][1] = new RGB(0,0,252);
    NEScolors[luminance][2] = new RGB(0,0,188);
    NEScolors[luminance][3] = new RGB(68,40,188);
    NEScolors[luminance][4] = new RGB(148,0,132);
    NEScolors[luminance][5] = new RGB(168,0,32);
    NEScolors[luminance][6] = new RGB(168,16,0);
    NEScolors[luminance][7] = new RGB(136,20,0);
    NEScolors[luminance][8] = new RGB(80,48,0);
    NEScolors[luminance][9] = new RGB(0,120,0);
    NEScolors[luminance][10] = new RGB(0,104,0);
    NEScolors[luminance][11] = new RGB(0,88,0);
    NEScolors[luminance][12] = new RGB(0,64,88);
    NEScolors[luminance][13] = new RGB(0,0,0);
    NEScolors[luminance][14] = new RGB(0,0,0);
    NEScolors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 1
    luminance = 1;
    NEScolors[luminance] = new RGB[16];
    NEScolors[luminance][0] = new RGB(188,188,188);
    NEScolors[luminance][1] = new RGB(0,120,248);
    NEScolors[luminance][2] = new RGB(0,88,248);
    NEScolors[luminance][3] = new RGB(104,68,252);
    NEScolors[luminance][4] = new RGB(216,0,204);
    NEScolors[luminance][5] = new RGB(228,0,88);
    NEScolors[luminance][6] = new RGB(248,56,0);
    NEScolors[luminance][7] = new RGB(228,92,16);
    NEScolors[luminance][8] = new RGB(172,124,0);
    NEScolors[luminance][9] = new RGB(0,184,0);
    NEScolors[luminance][10] = new RGB(0,168,0);
    NEScolors[luminance][11] = new RGB(0,168,68);
    NEScolors[luminance][12] = new RGB(0,136,136);
    NEScolors[luminance][13] = new RGB(0,0,0);
    NEScolors[luminance][14] = new RGB(0,0,0);
    NEScolors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 2
    luminance = 2;
    NEScolors[luminance] = new RGB[16];
    NEScolors[luminance][0] = new RGB(248,248,248);
    NEScolors[luminance][1] = new RGB(60,188,252);
    NEScolors[luminance][2] = new RGB(104,136,252);
    NEScolors[luminance][3] = new RGB(152,120,248);
    NEScolors[luminance][4] = new RGB(248,120,248);
    NEScolors[luminance][5] = new RGB(248,88,152);
    NEScolors[luminance][6] = new RGB(248,120,88);
    NEScolors[luminance][7] = new RGB(252,160,68);
    NEScolors[luminance][8] = new RGB(248,184,0);
    NEScolors[luminance][9] = new RGB(184,248,24);
    NEScolors[luminance][10] = new RGB(88,216,84);
    NEScolors[luminance][11] = new RGB(88,248,152);
    NEScolors[luminance][12] = new RGB(0,232,216);
    NEScolors[luminance][13] = new RGB(120,120,120);
    NEScolors[luminance][14] = new RGB(0,0,0);
    NEScolors[luminance][15] = new RGB(0,0,0);
    // LUMINANCE 3
    luminance = 3;
    NEScolors[luminance] = new RGB[16];
    NEScolors[luminance][0] = new RGB(252,252,252);
    NEScolors[luminance][1] = new RGB(164,228,252);
    NEScolors[luminance][2] = new RGB(184,184,248);
    NEScolors[luminance][3] = new RGB(216,184,248);
    NEScolors[luminance][4] = new RGB(248,184,248);
    NEScolors[luminance][5] = new RGB(248,164,192);
    NEScolors[luminance][6] = new RGB(240,208,176);
    NEScolors[luminance][7] = new RGB(252,224,168);
    NEScolors[luminance][8] = new RGB(248,216,120);
    NEScolors[luminance][9] = new RGB(216,248,120);
    NEScolors[luminance][10] = new RGB(184,248,184);
    NEScolors[luminance][11] = new RGB(184,248,216);
    NEScolors[luminance][12] = new RGB(0,252,252);
    NEScolors[luminance][13] = new RGB(216,216,216);
    NEScolors[luminance][14] = new RGB(0,0,0);
    NEScolors[luminance][15] = new RGB(0,0,0);
  }
  
  public LuminanceColor createColor(int index) {
    return createColor(index, 0);
  }
  
  public LuminanceColor createColor(int index, int luminance) {
    LuminanceColor aux = new LuminanceColor(index, this);
    aux.luminance = luminance;
    return aux;
  }
  
  public RGB getColor(int index, int luminance) {
    return NEScolors[luminance][index];
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